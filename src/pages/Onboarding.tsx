import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import InterestSelector from "@/components/InterestSelector";
import { useInterests, useUserInterests, useSaveUserInterests } from "@/hooks/useInterests";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { data: interests, isLoading: interestsLoading } = useInterests();
  const { data: userInterests, isLoading: userInterestsLoading } = useUserInterests();
  const saveInterests = useSaveUserInterests();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize with existing selections
  useEffect(() => {
    if (userInterests) {
      setSelectedIds(userInterests.map((ui) => ui.interest_id));
    }
  }, [userInterests]);

  const handleContinue = async () => {
    await saveInterests.mutateAsync(selectedIds);
    navigate("/feed", { replace: true });
  };

  const handleSkip = () => {
    navigate("/feed", { replace: true });
  };

  const canContinue = selectedIds.length >= 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">
                Step 1 of 1
              </span>
              <span className="text-sm text-muted-foreground">
                Almost there!
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-bg rounded-full"
                initial={{ width: 0 }}
                animate={{ width: canContinue ? "100%" : "50%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Choose your interests
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Select at least 3 interests to personalize your feed. You can
              always change these later.
            </p>
          </div>

          {/* Interest Selector */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-soft">
            <InterestSelector
              interests={interests || []}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              loading={interestsLoading || userInterestsLoading}
              minRequired={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground order-2 sm:order-1"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip for now
            </Button>

            <Button
              variant="hero"
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue || saveInterests.isPending}
              className="order-1 sm:order-2"
            >
              {saveInterests.isPending ? "Saving..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Onboarding;
