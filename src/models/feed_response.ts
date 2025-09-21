import { FeedItem } from "./feed_item";

export interface Pagination {
  ts: number;
  pp: number;
  cp: number;
  tp: number;
  hm: boolean;
}

export interface Section {
  tn: string;
  id: string;
  pagination?: Pagination;
  items?: FeedItem[];
}

export interface FeedResponse {
  sections: Section[];
}
