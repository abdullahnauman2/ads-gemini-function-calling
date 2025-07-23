import {
  QueryParams,
  QueryResult,
  AdsData,
  Campaign,
  AdGroup,
  Ad,
} from "./types";
import adsData from "../data/sample-data.json";

const typedAdsData = adsData as AdsData;

export function queryAdsData(params: QueryParams): QueryResult {
  const {
    entity_type,
    filters = {},
    limit,
    sort_by,
  } = params;


  // Get the data for the requested entity type
  let results: (Campaign | AdGroup | Ad)[] = typedAdsData[entity_type] || [];

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      results = results.filter((item) => {
        if (key === "date_range") {
          // Handle date range filtering
          const itemDate = new Date((item as unknown as Record<string, string>).start_date || (item as unknown as Record<string, string>).date);
          const startDate = new Date(value.start_date);
          const endDate = new Date(value.end_date);
          return itemDate >= startDate && itemDate <= endDate;
        }
        const itemValue = (item as Record<string, unknown>)[key];
        const exactMatch = itemValue === value;
        const partialMatch = itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
        return exactMatch || partialMatch;
      });
    }
  });

  // Sort results if requested
  if (sort_by) {
    results.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sort_by] as number || 0;
      const bVal = (b as Record<string, unknown>)[sort_by] as number || 0;
      return bVal - aVal; // Descending order
    });
  }

  // Limit results if requested
  if (limit) {
    results = results.slice(0, limit);
  }

  return {
    entity_type,
    count: results.length,
    data: results as Campaign[] | AdGroup[] | Ad[],
  };
}
