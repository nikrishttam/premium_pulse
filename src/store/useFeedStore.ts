"use client";
import { create } from "zustand";
import { FeedItem } from "@/models/feed_item";

interface FeedState {
  items: FeedItem[];
  page: number;
  pages: Record<number, FeedItem[]>; // <-- cache
  hasMore: boolean;
  loadedContent: Record<string, boolean>;
  fitMode: Record<string, string>;
  scrollY: number;

  setItems: (items: FeedItem[]) => void;
  addItems: (page: number, newItems: FeedItem[]) => void;
  setPage: (p: number) => void;
  setHasMore: (v: boolean) => void;
  setLoaded: (id: string) => void;
  setFitMode: (id: string, mode: string) => void;
  setScroll: (y: number) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  items: [],
  page: 1,
  pages: {},
  hasMore: true,
  loadedContent: {},
  fitMode: {},
  scrollY: 0,

  setItems: (items) => set({ items }),
  addItems: (page, newItems) =>
    set((s) => {
      const pages = { ...s.pages, [page]: newItems };
      const merged = Object.keys(pages)
        .map((p) => pages[+p])
        .flat();
      return { pages, items: merged };
    }),
  setPage: (p) => set({ page: p }),
  setHasMore: (v) => set({ hasMore: v }),
  setLoaded: (id) =>
    set((s) => ({ loadedContent: { ...s.loadedContent, [id]: true } })),
  setFitMode: (id, mode) =>
    set((s) => ({ fitMode: { ...s.fitMode, [id]: mode } })),
  setScroll: (y) => set({ scrollY: y }),
  reset: () =>
    set({
      items: [],
      page: 1,
      pages: {},
      hasMore: true,
      loadedContent: {},
      fitMode: {},
      scrollY: 0,
    }),
}));
