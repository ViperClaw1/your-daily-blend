import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Interest {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface UserInterest {
  interest_id: string;
  interests: Interest;
}

export const useInterests = () => {
  return useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Interest[];
    },
  });
};

export const useUserInterests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-interests", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_interests")
        .select("interest_id, interests(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data as unknown as UserInterest[];
    },
    enabled: !!user,
  });
};

export const useSaveUserInterests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (interestIds: string[]) => {
      if (!user) throw new Error("Not authenticated");

      // First, delete existing interests
      const { error: deleteError } = await supabase
        .from("user_interests")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Then insert new interests
      if (interestIds.length > 0) {
        const inserts = interestIds.map((interest_id) => ({
          user_id: user.id,
          interest_id,
        }));

        const { error: insertError } = await supabase
          .from("user_interests")
          .insert(inserts);

        if (insertError) throw insertError;
      }

      // Update onboarding status if >= 3 interests
      if (interestIds.length >= 3) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      return interestIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Saved!",
        description: "Your interests have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
