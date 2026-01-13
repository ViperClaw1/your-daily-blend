import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings,
  LogOut,
  Sparkles,
  Edit3,
  User,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import InterestPills from "@/components/InterestPills";
import { useAuth } from "@/contexts/AuthContext";
import { useUserInterests, useProfile } from "@/hooks/useInterests";

// Configuration variable for the Flockler iframe embed
const FLOCKLER_IFRAME_EMBED = `<iframe src="https://plugins.flockler.com/embed/iframe/1b65cc6173e67ad4644a83c22ca02c13" width="100%" style="border: none; min-height: 900px;" allowfullscreen></iframe>`;

const FLOCKLER_FEED_URL = "https://plugins.flockler.com/embed/iframe/1b65cc6173e67ad4644a83c22ca02c13";

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: userInterests, isLoading } = useUserInterests();
  const { data: profile } = useProfile();

  const interests = userInterests?.map((ui) => ui.interests) || [];
  const hasInterests = interests.length > 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const userInitials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "U";

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
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {profile?.display_name || user?.email}
                  </p>
                  {profile?.display_name && (
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
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

      {/* Video Feed Section */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1200px] mx-auto"
        >
          <h2 className="text-2xl font-display font-semibold mb-6">
            Video Feed
          </h2>

          {/* Embed Container */}
          <div
            className="w-full [&_iframe]:w-full [&_iframe]:min-h-[700px] sm:[&_iframe]:min-h-[900px] [&_iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: FLOCKLER_IFRAME_EMBED }}
          />

          {/* Open in new tab link */}
          <div className="mt-4 text-center">
            <a
              href={FLOCKLER_FEED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Feed;
