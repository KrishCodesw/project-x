// src/components/shared/state-demo.tsx
"use client";

import { useQueryState } from "nuqs";
import { useUIStore } from "@/hooks/use-ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StateDemo() {
  // 1. Zustand Global State
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  // 2. Nuqs URL State
  // This will automatically sync with ?search=your_query in the URL
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    // shallow: true ensures we don't trigger a full server reload on every keystroke
    shallow: true,
  });

  return (
    <div className="grid gap-8 md:grid-cols-2 mt-8">
      {/* Zustand Test Card */}
      <div className="p-6 border rounded-lg bg-white dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Zustand Global State</h3>
          <p className="text-sm text-zinc-500">
            State managed in memory. Does not persist on refresh.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={toggleSidebar} variant="secondary">
            Toggle Sidebar State
          </Button>
          <span className="font-mono text-sm px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            isSidebarOpen: {isSidebarOpen ? "true" : "false"}
          </span>
        </div>
      </div>

      {/* Nuqs Test Card */}
      <div className="p-6 border rounded-lg bg-white dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Nuqs URL State</h3>
          <p className="text-sm text-zinc-500">
            State managed in the URL. Persists on refresh and is shareable.
          </p>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Type to update URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p className="text-sm text-zinc-500 truncate">
            Current URL Query:{" "}
            <span className="font-mono text-zinc-900 dark:text-zinc-100">
              {searchQuery || "empty"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
