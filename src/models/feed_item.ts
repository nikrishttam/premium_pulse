import { Author } from "./author";

export interface FeedItem {
  id: string;
  hl?: string;
  des?: string;
  wu?: string;
  category?: { id: number; name: string; url: string; type: string }[];
  authors?: Author[];
  ag?: string;
  image?: { id: number; version: number; src: string };
  upd?: string;
  lpt?: string;
}
