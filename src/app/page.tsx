"use client";
import { Publication } from "@/lib/enums";
import { useFeedStore } from "@/store/useFeedStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const setPublication = useFeedStore((state) => state.setPublication);
  return (
    <main className="flex flex-col items-center justify-start min-h-[85vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 w-full ">
        {Object.entries(Publication).map(([key, value]) => (
          <button
            key={key}
            className="bg-gray-100 hover:bg-red-600 hover:text-white rounded-lg shadow-lg p-8 text-xl font-semibold transition hover:cursor-pointer"
            onClick={() => {
              setPublication(value);
              router.push(`/${key}`);
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </main>
  );
}
			
		