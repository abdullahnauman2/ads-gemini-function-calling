export interface Campaign {
  id: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  roas: number;
  start_date: string;
  end_date: string;
}

export interface AdGroup {
  id: string;
  campaign_id: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
}

export interface Ad {
  id: string;
  adgroup_id: string;
  campaign_id: string;
  headline: string;
  description: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
}

export interface AdsData {
  campaigns: Campaign[];
  adgroups: AdGroup[];
  ads: Ad[];
}

export interface QueryParams {
  entity_type: "campaigns" | "adgroups" | "ads";
  filters?: {
    campaign_id?: string;
    campaign_name?: string;
    status?: "ENABLED" | "PAUSED" | "REMOVED";
    date_range?: {
      start_date: string;
      end_date: string;
    };
    [key: string]: any;
  };
  metrics?: string[];
  aggregation?: "sum" | "average" | "count" | "max" | "min";
  limit?: number;
  sort_by?: string;
}

export interface QueryResult {
  entity_type: string;
  count: number;
  data: Campaign[] | AdGroup[] | Ad[];
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  debugInfo?: {
    functionCalled: boolean;
    rawData?: any;
    processingTime?: number;
  };
}

export interface ChatResponse {
  response: string;
  data?: any;
  functionCalled?: boolean;
}
