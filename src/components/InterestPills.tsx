import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Interest {
  id: string;
  name: string;
  icon: string | null;
}

interface InterestPillsProps {
  interests: Interest[];
  onRemove?: (id: string) => void;
  showRemove?: boolean;
  className?: string;
}

const InterestPills: React.FC<InterestPillsProps> = ({
  interests,
  onRemove,
  showRemove = false,
  className,
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {interests.map((interest, index) => (
        <motion.div
          key={interest.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
        >
          <span>{interest.icon || "📌"}</span>
          <span>{interest.name}</span>
          {showRemove && onRemove && (
            <button
              onClick={() => onRemove(interest.id)}
              className="ml-1 hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default InterestPills;
