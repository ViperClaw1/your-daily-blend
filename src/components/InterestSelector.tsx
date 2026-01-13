import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Interest {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface InterestSelectorProps {
  interests: Interest[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  loading?: boolean;
  minRequired?: number;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  interests,
  selectedIds,
  onSelectionChange,
  loading = false,
  minRequired = 3,
}) => {
  const [search, setSearch] = useState("");

  const filteredInterests = useMemo(() => {
    if (!search.trim()) return interests;
    const query = search.toLowerCase();
    return interests.filter(
      (interest) =>
        interest.name.toLowerCase().includes(query) ||
        interest.slug.toLowerCase().includes(query)
    );
  }, [interests, search]);

  const toggleInterest = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading interests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search interests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
        />
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Selected:{" "}
          <span
            className={cn(
              "font-semibold",
              selectedIds.length >= minRequired
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {selectedIds.length}
          </span>{" "}
          / minimum {minRequired}
        </span>
        {selectedIds.length >= minRequired && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-primary flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Ready to continue
          </motion.span>
        )}
      </div>

      {/* Interest Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredInterests.map((interest, index) => {
            const isSelected = selectedIds.includes(interest.id);
            return (
              <motion.button
                key={interest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50 hover:bg-accent/50"
                )}
              >
                <span className="text-lg">{interest.icon || "📌"}</span>
                <span className="font-medium text-sm truncate">
                  {interest.name}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredInterests.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No interests found matching "{search}"
        </div>
      )}
    </div>
  );
};

export default InterestSelector;
