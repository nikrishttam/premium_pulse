"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { feeds_ep } from "@/lib/endpoints";
import { FeedResponse, Section } from "@/models/feed_response";
import { useFeedStore } from "@/store/useFeedStore";

export default function MainFeed() {
  const {
    items,
    page,
    pages,
    hasMore,
    loadedContent,
    fitMode,
    scrollY,
    addItems,
    setPage,
    setHasMore,
    setLoaded,
    setFitMode,
    setScroll,
  } = useFeedStore();
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, page, setPage]
  );

  // Restore scroll
  useEffect(() => {
    if (scrollY > 0) {
      setTimeout(() => window.scrollTo(0, scrollY), 0);
    }
  }, [scrollY]);

  // Fetch data only if page not cached
  useEffect(() => {
    const fetchData = async () => {
      if (pages[page]) return; // <-- skip network if cached

      try {
        setLoading(true);
        const res = await fetch(`${feeds_ep}${page}`);
        const data: FeedResponse = await res.json();

        const section = data.sections?.find(
          (s: Section) => s.tn === "sectionlisting"
        );
        const newItems = section?.items ?? [];
        addItems(page, newItems);

        const pagination = section?.pagination;
        if (pagination && pagination.cp >= pagination.tp) {
          setHasMore(false);
        }
      } catch (e) {
        console.error("Feed fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addItems, page, pages, setHasMore]);

  const formatDate = (ts?: string) => {
    if (!ts) return "";
    const v = Number(ts);
    if (Number.isNaN(v)) return "";
    const ms = v < 1e12 ? v * 1000 : v;
    return new Date(ms).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-screen max-w-4xl mx-auto p-4">
      {items &&
        items.length > 0 &&
        items.map((item, idx) => {
          const imageUrl = item.image
            ? `https://static.toiimg.com/thumb/${item.image.id}.cms?width=300&height=200&resizemode=75`
            : null;
          const isLast = idx === items.length - 1;
          const isLoaded = loadedContent[item.id];

          return (
            <Link
              key={item.id}
              href={`/story${item.wu?.match(/toi-plus(\/.+)$/)?.[1] ?? ""}`}
              className="block mb-4 border-b border-b-gray-300 py-4 px-2 hover:bg-gray-100 transition rounded-lg"
              onClick={() => setScroll(window.scrollY)}
            >
              <div ref={isLast ? lastItemRef : null}>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* IMAGE */}
                  <div className="relative w-full md:w-1/3 h-48 md:h-40 flex-shrink-0 bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.hl || "Story image"}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={`rounded-lg transition-opacity duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        } ${fitMode[item.id] || "object-cover"}`}
                        onLoad={(e) => {
                          setLoaded(item.id);
                          const img = e.currentTarget as HTMLImageElement;
                          setFitMode(
                            item.id,
                            img.naturalHeight > img.naturalWidth
                              ? "object-contain"
                              : "object-cover"
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-600 uppercase mb-1">
                      {item.category?.[0]?.name || "General"}
                    </p>
                    <h2 className="text-lg font-bold">
                      {item.hl || "Untitled"}
                    </h2>
                    <p className="text-gray-700 text-sm">
                      {item.des || "No description available."}
                    </p>
                    <div className="mt-3 text-xs text-gray-500 space-x-2">
                      {item.authors && item.authors?.length > 0 && (
                        <span>
                          By{" "}
                          {item.authors
                            .map((author) => author.name)
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {item.ag && <span>({item.ag})</span>}
                      {formatDate(item.upd || item.lpt) && (
                        <span>• {formatDate(item.upd || item.lpt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      {loading && <p className="text-center py-4">Loading... </p>}

      {!hasMore && <p className="text-center py-4">No more stories</p>}
    </section>
  );
}
