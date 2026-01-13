import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import InterestSelector from "@/components/InterestSelector";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInterests,
  useUserInterests,
  useSaveUserInterests,
} from "@/hooks/useInterests";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: interests, isLoading: interestsLoading } = useInterests();
  const { data: userInterests, isLoading: userInterestsLoading } =
    useUserInterests();
  const saveInterests = useSaveUserInterests();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize with existing selections
  useEffect(() => {
    if (userInterests) {
      const ids = userInterests.map((ui) => ui.interest_id);
      setSelectedIds(ids);
    }
  }, [userInterests]);

  // Track changes
  useEffect(() => {
    if (userInterests) {
      const originalIds = userInterests.map((ui) => ui.interest_id);
      const changed =
        selectedIds.length !== originalIds.length ||
        selectedIds.some((id) => !originalIds.includes(id));
      setHasChanges(changed);
    }
  }, [selectedIds, userInterests]);

  const handleSave = async () => {
    await saveInterests.mutateAsync(selectedIds);
    setHasChanges(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/feed">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Logo showText={false} />
            <h1 className="text-lg font-display font-semibold">Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Interests Section */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-semibold mb-1">
                  Interests
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose topics to personalize your feed
                </p>
              </div>
              {hasChanges && (
                <Button
                  variant="gradient"
                  onClick={handleSave}
                  disabled={saveInterests.isPending}
                >
                  {saveInterests.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save changes
                </Button>
              )}
            </div>

            <InterestSelector
              interests={interests || []}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              loading={interestsLoading || userInterestsLoading}
              minRequired={0}
            />
          </section>

          {/* Account Section */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="text-xl font-display font-semibold mb-6">Account</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Your email cannot be changed
                </p>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sign out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
