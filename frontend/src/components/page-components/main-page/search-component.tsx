"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { fetchUserData } from "@/api/user";
import { UserDataResponse, SearchComponentProps } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { Loader, Search } from "lucide-react";

export const SearchComponent = ({ role, onSearchResults }: SearchComponentProps) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Debounced function to handle API call
  const fetchResults = useCallback(
    debounce(async (searchTerm: string) => {
      setLoading(true);

      try {
        const data = await fetchUserData(role, searchTerm.trim() || undefined); // ✅ Pass undefined if empty
        onSearchResults(data);
      } catch (error) {
        toast({ title: "Error", description: error instanceof Error ? error.message : "Search failed" });
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce
    [role]
  );

  // Trigger search when input changes
  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  return (
    <div className="relative w-full max-w-md mb-4">
      <Search className="absolute right-3 top-[0.6rem] text-gray-400 h-5 w-5" />

      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {loading && <Loader className="absolute right-10 animate-spin top-[0.6rem] text-gray-500 text-sm" />}
    </div>
  );
};
