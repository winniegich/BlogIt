// src/hooks/useSingleBlog.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogAPI } from "../services/api";
import { useBlogStore } from "../store/blogStore";

export const useSingleBlog = (id: string) => {
  const addBlog = useBlogStore((s) => s.addBlog);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
        const res = await blogAPI.getOne(id);
        return res.data;
    },
    enabled: !!id,
});

  // Save fetched blog into Zustand
  useEffect(() => {
    if (data) addBlog(data);
  }, [data, addBlog]);

  return { data, isLoading, isError };
};
