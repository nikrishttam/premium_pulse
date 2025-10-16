"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api_endpoints } from "@/lib/endpoints";
import { StoryData } from "@/models/story_data";
import Image from "next/image";
import StorySkeleton from "@/components/story_skeleton";

function stripHtml(html?: string) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function extractFirstImageSrc(html?: string) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const img = doc.querySelector("img");
  return img ? img.getAttribute("src") || "" : "";
}

export default function StoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [story_data, setStoryData] = useState<StoryData | null>(null);
  const [error_msg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const idMatch = pathname?.match(/(\d{8})(?:[^\d]*$)/);
    const id = idMatch ? idMatch[1] : "";

    const fetchData = async () => {
      try {
        const res = await fetch(`${api_endpoints.ie.fetch_story}/${id}`);
        if (!res.ok) {
          setErrorMsg(`Fetch error: ${res.status}`);
          return;
        }

        const data = await res.json();

        // WordPress / parsely style response -> map to StoryData
        const headline =
          data?.title?.rendered ||
          data?.parsely?.meta?.headline ||
          data?.guid?.rendered ||
          "";

        const description = stripHtml(data?.excerpt?.rendered);
        const articleBody = data?.content?.rendered;
        const datePublished =
          data?.date || data?.parsely?.meta?.datePublished || "";
        const authorName =
          data?.parsely?.meta?.author?.[0]?.name ||
          (data?.parsely?.meta?.author
            ? String(data.parsely.meta.author)
            : "") ||
          "";

        const imageUrl =
          data?.parsely?.meta?.thumbnailUrl ||
          extractFirstImageSrc(data?.content?.rendered);

        // Construct object matching StoryData shape used in the component
        const mapped: StoryData = {
          headline: headline,
          description: description,
          articleBody: articleBody,
          datePublished: datePublished,
          author: authorName ? { name: authorName } : undefined,
          image: imageUrl ? { url: imageUrl } : undefined,
        } as unknown as StoryData;

        setStoryData(mapped);
      } catch (err) {
        console.error(err);
        setErrorMsg("An unexpected error occurred.");
      }
    };

    if (id) fetchData();
  }, [pathname]);

  return (
    <article>
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          ← Go Back
        </button>

        {error_msg ? (
          <div className="text-red-600 text-center mt-8">{error_msg}</div>
        ) : !story_data ? (
          <StorySkeleton />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{story_data.headline}</h1>

            {story_data.image?.url && (
              <Image
                src={story_data.image.url}
                alt={story_data.headline}
                className="w-full h-auto mb-6 rounded"
                width={600}
                height={400}
                unoptimized={true}
                priority={true}
              />
            )}

            <p className="text-lg">
              {story_data.author?.name
                ? `By ${story_data.author.name}`
                : "By Unknown Author"}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {story_data.datePublished
                ? new Date(story_data.datePublished).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }) + " IST"
                : ""}
            </p>
            <p className="text-gray-700 mb-6 italic">
              {story_data.description || ""}
            </p>
            <div>
              {story_data.articleBody ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: story_data.articleBody }}
                />
              ) : (
                <p className="text-gray-500 text-base mt-4">No content</p>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
