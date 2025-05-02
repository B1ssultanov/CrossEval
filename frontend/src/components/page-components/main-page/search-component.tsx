"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { fetchUserData } from "@/api/user";
import { SearchComponentProps } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { Loader, Search } from "lucide-react";

export const SearchComponent = ({ role, onSearchResults }: SearchComponentProps) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isInteracted, setIsInteracted] = useState<boolean>(false); // Track user interaction
  const { toast } = useToast();

  // Debounced function to handle API call
  const fetchResults = useCallback(
    debounce(async (searchTerm: string) => {
      if (!isInteracted) return; // Do not search if user hasn't interacted yet

      setLoading(true);
      try {
        const data = await fetchUserData(role, searchTerm.trim() || undefined);
        onSearchResults(data);
      } catch (error) {
        toast({ title: "Error", description: error instanceof Error ? error.message : "Search failed" });
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce
    [role, isInteracted] // Dependency includes interaction state
  );

  // Trigger search when input changes, but only if user interacted
  useEffect(() => {
    if (isInteracted) {
      fetchResults(query);
    }
  }, [query, fetchResults, isInteracted]);

  return (
    <div className="max-w-md mb-4 absolute w-[200px] z-10 lg:w-[300px] left-[35%] md:left-[20%] xl:left-[20%] xl:w-full top-0  md:-top-[4.7rem]  ">
      <Search className="absolute right-3 top-[0.6rem]  text-gray-400 h-5 w-5" />

      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!isInteracted) setIsInteracted(true); // Mark as interacted on first input
        }}
        className="border border-gray-300 rounded-2xl  px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {loading && <Loader className="absolute right-10 animate-spin top-[0.6rem] text-gray-500 text-sm" />}
    </div>
  );
};

