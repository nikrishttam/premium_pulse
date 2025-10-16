// Publication Endpoints - TOI
export const toi_plus_ep = "https://timesofindia.indiatimes.com/toi-plus";
export const toi_plus_all_stories_ep =
  "https://toifeeds.indiatimes.com/treact/feeds/toi/web/list/section?path=/toi-plus/all-toi-stories";

// Publication Endpoints - IE
export const ie_premium_ep =
  "https://indianexpress.com/about/express-premium/page";
export const ie_article_ep = "https://indianexpress.com/article";
// API Endpoints
export const api_endpoints = {
  toi: {
    fetch_story: "/api/toi/fetch-story?url=",
    feed: "/api/toi/feed",
  },
  ie: {
    feed: "/api/ie/feed",
    // fetch_story: "/api/ie/fetch-story?url=",
    fetch_story: "https://indianexpress.com/wp-json/wp/v2/article",
  },
};
