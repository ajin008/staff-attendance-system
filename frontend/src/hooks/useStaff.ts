import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { getAllStaff } from "../services/auth.service";
import { User } from "../types";

interface StaffData {
  staff: User[];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
}

export const useStaff = () => {
  const [data, setData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 400);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllStaff(page, 20, debouncedSearch);
      setData(res);
    } catch {
      setError("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    search,
    handleSearch,
    refresh: fetchStaff,
  };
};
