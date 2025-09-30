"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api_endpoints, toi_plus_ep } from "@/lib/endpoints";
import { StoryData } from "@/models/story_data";
import Image from "next/image";
import { transform_text } from "@/lib/transform_text";
import StorySkeleton from "@/components/story_skeleton";

export default function StoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [story_data, setStoryData] = useState<StoryData | null>(null);
  const [error_msg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const slug = pathname.replace("/story/", "");
    const externalUrl = `${toi_plus_ep}/${slug}`;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${api_endpoints.toi.fetch_story}${encodeURIComponent(externalUrl)}`
        );
        const data = await res.json();

        if (data.success) {
          setStoryData(data.story_data);
        } else {
          setErrorMsg(data.error);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("An unexpected error occurred.");
      }
    };

    fetchData();
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

            {story_data.image && (
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
              {new Date(story_data.datePublished).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
              }) + " IST"}
            </p>
            <p className="text-gray-700 mb-6 italic">
              {story_data.description || ""}
            </p>
            <div>
              {story_data.articleBody ? (
                transform_text(story_data.articleBody, 80).map((p, i) => (
                  <p
                    key={i}
                    className={`
          text-gray-800       /* text color */
          text-base sm:text-lg lg:text-xl  /* responsive font size */
          leading-relaxed     /* line height */
          mt-4               /* margin-top for spacing between paragraphs */
        `}
                  >
                    {p}
                  </p>
                ))
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
