import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Settings,
  LogOut,
  Inbox,
  Sparkles,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import InterestPills from "@/components/InterestPills";
import { useAuth } from "@/contexts/AuthContext";
import { useUserInterests } from "@/hooks/useInterests";

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: userInterests, isLoading } = useUserInterests();

  const interests = userInterests?.map((ui) => ui.interests) || [];
  const hasInterests = interests.length > 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const userInitials =
    user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <h1 className="hidden sm:block text-lg font-display font-semibold">
            Your Feed
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Interest Pills Section */}
      {!isLoading && hasInterests && (
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <InterestPills interests={interests} />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit interests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Interests Banner */}
      {!isLoading && !hasInterests && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-primary/20 bg-primary/5"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm">
                  <span className="font-medium">
                    Pick interests to personalize your feed
                  </span>{" "}
                  — Get content you actually care about.
                </p>
              </div>
              <Button variant="gradient" size="sm" asChild>
                <Link to="/onboarding/interests">Choose interests</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content - Empty State */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-display font-semibold mb-3">
            Your feed will appear here
          </h2>
          <p className="text-muted-foreground mb-8">
            Once content sources are connected, your personalized feed will show
            up here based on your selected interests.
          </p>

          <Button variant="outline" disabled className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Content integrations coming soon
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Feed;
