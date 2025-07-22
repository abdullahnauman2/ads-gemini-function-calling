import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { queryAdsData } from "@/lib/ads-query";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the function declaration for Gemini
const queryAdsDataFunction = {
  name: "queryAdsData",
  description:
    "Query Google Ads data with flexible filtering and aggregation options. Use this to find campaigns, adgroups, or ads based on user questions.",
  parameters: {
    type: "object",
    properties: {
      entity_type: {
        type: "string",
        enum: ["campaigns", "adgroups", "ads"],
        description: "Type of ads entity to query",
      },
      filters: {
        type: "object",
        properties: {
          campaign_id: {
            type: "string",
            description: "Filter by specific campaign ID",
          },
          campaign_name: {
            type: "string",
            description: "Filter by campaign name (partial match)",
          },
          status: {
            type: "string",
            enum: ["ENABLED", "PAUSED", "REMOVED"],
            description: "Filter by status",
          },
          date_range: {
            type: "object",
            properties: {
              start_date: {
                type: "string",
                description: "Start date in YYYY-MM-DD format",
              },
              end_date: {
                type: "string",
                description: "End date in YYYY-MM-DD format",
              },
            },
          },
        },
        description: "Filters to apply to the data",
      },
      metrics: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "impressions",
            "clicks",
            "conversions",
            "cost",
            "ctr",
            "cpc",
            "roas",
            "budget",
          ],
        },
        description: "Specific metrics to focus on in the response",
      },
      aggregation: {
        type: "string",
        enum: ["sum", "average", "count", "max", "min"],
        description: "How to aggregate the data if needed",
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return (e.g., top 5)",
      },
      sort_by: {
        type: "string",
        description: "Field to sort by (e.g., 'roas', 'cost', 'clicks')",
      },
    },
    required: ["entity_type"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      tools: [{ function_declarations: [queryAdsDataFunction] }],
    });

    // First call to Gemini - it will decide if it needs to call the function
    const result = await model.generateContent(message);
    const response = await result.response;

    // Check if Gemini wants to call our function
    const functionCall =
      response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (functionCall && functionCall.name === "queryAdsData") {
      console.log("Function call requested:", functionCall);

      // Execute our query function with Gemini's parameters
      const queryResult = queryAdsData(functionCall.args);

      // Create a simple follow-up prompt with the data
      const followUpPrompt = `
Original question: ${message}

Based on this Google Ads data:
${JSON.stringify(queryResult, null, 2)}

Please provide a helpful, natural language response that answers the user's question using this data. Focus on the key insights and present the information in an easy-to-understand way.
      `;

      const followUpResult = await model.generateContent(followUpPrompt);
      const finalResponse = await followUpResult.response;

      return NextResponse.json({
        response: finalResponse.text(),
        data: queryResult,
        functionCalled: true,
      });
    } else {
      // Gemini responded directly without needing function call
      return NextResponse.json({
        response: response.text(),
        functionCalled: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
