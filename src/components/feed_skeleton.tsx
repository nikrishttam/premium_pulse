"use client";
import React from "react";

export default function FeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="mb-4 border-b border-b-gray-300 py-4 px-2 rounded-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 w-72 md:min-w-4xl">
            {/* IMAGE placeholder */}
            <div className="relative w-full md:w-1/3 h-48 md:h-40 flex-shrink-0">
              <div className="w-full h-full rounded-lg bg-gray-200" />
            </div>

            {/* TEXT placeholder */}
            <div className="flex-1 space-y-3">
              {/* category bar */}
              <div className="h-3 w-20 bg-gray-200 rounded" />

              {/* headline */}
              <div className="h-5 w-3/4 bg-gray-200 rounded" />

              {/* description lines */}
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />

              {/* footer meta */}
              <div className="mt-3 h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
