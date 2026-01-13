import React from "react";
import { Rss } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({
  className,
  showText = true,
  size = "md",
}) => {
  const sizes = {
    sm: { icon: "h-5 w-5", text: "text-lg" },
    md: { icon: "h-6 w-6", text: "text-xl" },
    lg: { icon: "h-8 w-8", text: "text-2xl" },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="gradient-bg p-1.5 rounded-lg">
        <Rss className={cn(sizes[size].icon, "text-primary-foreground")} />
      </div>
      {showText && (
        <span className={cn("font-display font-bold", sizes[size].text)}>
          <span className="gradient-text">Feed</span>
          <span className="text-foreground">lyzer</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
