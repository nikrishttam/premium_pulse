"use client";
import React from "react";

export default function StorySkeleton() {
  return (
    <article>
      <div className="max-w-4xl mx-auto p-4 animate-pulse">
        {/* Back Button placeholder */}
        <div className="mb-4 w-28 h-9 rounded bg-gray-200" />

        {/* Headline */}
        <div className="h-8 sm:h-10 w-3/4 bg-gray-200 rounded mb-6" />

        {/* Image */}
        <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200 rounded mb-6" />

        {/* Author & date */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-40 bg-gray-200 rounded mb-6" />

        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />

        {/* Body paragraphs */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-11/12 bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
