export interface StoryData {
  "@context": string;
  articleBody: string;
  "@type": string;
  mainEntityOfPage: string;
  inLanguage: string;
  headline: string;
  keywords: string;
  url: string;
  datePublished: string;
  dateModified: string;
  description: string;
  thumbnailUrl: string;
  author: {
    "@type": string;
    name: string;
    url: string;
  };
  publisher: {
    "@type": string;
    name: string;
    url: string;
    logo: {
      "@type": string;
      url: string;
      width: number;
      height: number;
    };
  };
  image: {
    "@type": string;
    url: string;
    width: number;
    height: number;
  };
}
