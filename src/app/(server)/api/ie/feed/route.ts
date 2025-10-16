import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({
      success: false,
      error: "Missing url parameter",
    });
  }

  try {
    const html_res = await fetch(urlParam);
    if (!html_res.ok) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch feed",
      });
    }
    const htmlText = await html_res.text();
    const $ = cheerio.load(htmlText);
    const opinionWrapper = $("#opinion-more-wrapper");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let opinionItems: any[] = [];
    if (opinionWrapper.length) {
      const articles = opinionWrapper.find(".o-opin-article");
      opinionItems = articles
        .map((_, article) => {
          const $article = $(article);
          const title =
            $article.find(".o-opin-article__title a").text().trim() || "";
          const date = $article.find(".opinion-date").text().trim() || "";
          const para = $article.find(".opinion-news-para").text().trim() || "";
          const author =
            $article.find(".news-writer-name a").text().trim() || "";
          const href =
            $article.find(".opinion-news-figure a").attr("href")?.trim() || "";
          const idMatch = href.match(/(\d{8})(?:[^\d]*$)/);
          const id = idMatch ? idMatch[1] : "";

          const img =
            $article.find(".opinion-news-figure img").attr("src")?.trim() || "";

          return { id, title, date, para, author, img, wu: href };
        })
        .get();
    }

    const data = opinionItems;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.log("Error fetching feeds:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch: Internal Server Error",
    });
  }
}
