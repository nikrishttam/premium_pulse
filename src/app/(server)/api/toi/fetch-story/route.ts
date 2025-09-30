import { NextResponse } from "next/server";

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
    const res = await fetch(urlParam);
    const html = await res.text();
    const match = html.match(
      /https:\/\/assets\.toiimg\.com\/toi\/appstate\/articleshow\/[^"]+\.chunk\.json/
    );

    if (!match) {
      return NextResponse.json({
        success: false,
        error: "No content found.",
      });
    }

    const jsonUrl = match[0];
    const data = await fetch(jsonUrl).then((res) => res.json());
    const story_id_found = urlParam.match(/\/(\d+)\.cms$/);
    if (!story_id_found) {
      return NextResponse.json({
        success: false,
        error: "Invalid Story Id.",
      });
    }
    const story_id = story_id_found[1];
    const schemaArray: string[] =
      data.state.articleshow_v2.data[story_id].schema;
    const parsed = schemaArray.map((item) => JSON.parse(item));
    const news_article = parsed.find((item) => item["@type"] === "NewsArticle");

    if (news_article) {
      return NextResponse.json({ success: true, story_data: news_article });
    } else {
      return NextResponse.json({
        success: false,
        error: "No NewsArticle found in schema.",
      });
    }
  } catch (err) {
    console.log("Error fetching story:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch" });
  }
}
