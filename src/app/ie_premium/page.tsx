"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ie_premium_ep, api_endpoints } from "@/lib/endpoints";
import { useFeedStore } from "@/store/useFeedStore";
import FeedSkeleton from "@/components/feed_skeleton";
import { Publication } from "@/lib/enums";
import { useRouter } from "next/navigation";
import { FeedItem } from "@/models/feed_item";
import type { Author } from "@/models/author";

export default function IEMainFeed() {
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
    setLoaded,
    setFitMode,
    setScroll,
    reset,
  } = useFeedStore();

  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const router = useRouter();
  // --- IntersectionObserver with prefetch buffer ---
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // Trigger fetch when 50% visible and not already fetching
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.5 &&
            hasMore &&
            !loading &&
            !isFetchingRef.current
          ) {
            isFetchingRef.current = true;
            setPage((prev) => prev + 1);
          }
        },
        {
          threshold: 0.5, // half visible triggers fetch
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, loading, setPage]
  );

  // --- Restore scroll ---
  useEffect(() => {
    if (scrollY > 0) {
      setTimeout(() => window.scrollTo(0, scrollY), 0);
    }
  }, [scrollY]);

  // --- Fetch current page ---
  useEffect(() => {
    const fetchData = async () => {
      if (pages[page]) {
        isFetchingRef.current = false;
        return;
      }
      try {
        setLoading(true);

        const ie_feed_url = `${ie_premium_ep}/${page}`;
        const feed_url = `${api_endpoints.ie.feed}?url=${encodeURIComponent(
          ie_feed_url
        )}`;

        const res = await fetch(feed_url);
        const output = await res.json();

        if (!output.success) {
          console.error("Failed to fetch feed:", output.error);
          return;
        }

        // Map incoming data to FeedItem[]
        const all_data: FeedItem[] = (output.data || []).map(
          (d: {
            id: string;
            title: string;
            date: string;
            para: string;
            author: string;
            img: string;
            wu: string;
          }) => ({
            id: d.id,
            hl: d.title,
            des: d.para,
            wu: d.wu,
            category: undefined,
            authors: [{ name: d.author ?? "" } as Author],
            ag: "",
            image: { id: 0, version: 0, src: d.img },
            upd: d.date,
            lpt: d.date,
          })
        );

        addItems(page, all_data);
      } catch (e) {
        console.error("Feed fetch error:", e);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchData();
    // only re-run when page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <section className="min-h-screen max-w-4xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        ← Go Back
      </button>
      <h2 className="text-3xl font-bold text-center py-4">
        {Publication.ie_premium}
      </h2>
      {items.map((item, idx) => {
        const imageUrl = item.image ? `${item.image.src}` : null;
        const isLast = idx === items.length - 1;
        const isLoaded = loadedContent[item.id];

        return (
          <Link
            key={item.id + "#" + idx}
            href={`/ie_premium/story${
              item.wu?.match(/article(\/.+)$/)?.[1] ?? ""
            }`}
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
                  <h2 className="text-lg font-bold">{item.hl || "Untitled"}</h2>
                  <p className="text-gray-700 text-sm">
                    {item.des || "No description available."}
                  </p>
                  <div className="mt-3 text-xs text-gray-500 space-x-2">
                    {item.authors && item.authors.length > 0 && (
                      <span>
                        By{" "}
                        {item.authors
                          .map((author) => author.name)
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                    {item.ag && <span>({item.ag})</span>}
                    {(item.upd || item.lpt) && (
                      <span>• {item.upd || item.lpt}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
      {loading && <FeedSkeleton count={6} />}
      {!hasMore && <p className="text-center py-4">No more stories</p>}
    </section>
  );
}
