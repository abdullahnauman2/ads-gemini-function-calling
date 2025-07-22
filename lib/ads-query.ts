import {
  QueryParams,
  QueryResult,
  AdsData,
  Campaign,
  AdGroup,
  Ad,
} from "@/types/ads";
import adsData from "../data/ads-data.json";

const typedAdsData = adsData as AdsData;

export function queryAdsData(params: QueryParams): QueryResult {
  const {
    entity_type,
    filters = {},
    metrics = [],
    aggregation,
    limit,
    sort_by,
  } = params;

  console.log("Query params:", params);

  // Get the data for the requested entity type
  let results: Campaign[] | AdGroup[] | Ad[] = typedAdsData[entity_type] || [];

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      results = results.filter((item: any) => {
        if (key === "date_range") {
          // Handle date range filtering
          const itemDate = new Date(item.start_date || item.date);
          const startDate = new Date(value.start_date);
          const endDate = new Date(value.end_date);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return (
          item[key] === value ||
          (item[key] &&
            item[key].toString().toLowerCase().includes(value.toLowerCase()))
        );
      });
    }
  });

  // Sort results if requested
  if (sort_by) {
    results.sort((a: any, b: any) => {
      const aVal = a[sort_by] || 0;
      const bVal = b[sort_by] || 0;
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
    data: results,
  };
}
