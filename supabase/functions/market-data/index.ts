import { getJson } from "npm:@serper/client@latest";
import { CohereClient } from "npm:cohere-ai@7.7.7";
import { OpenAI } from "npm:openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Validate environment variables
    const SERPER_API_KEY = Deno.env.get("SERPER_API_KEY");
    const COHERE_API_KEY = Deno.env.get("COHERE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!SERPER_API_KEY || !COHERE_API_KEY || !OPENAI_API_KEY) {
      throw new Error("Missing required API keys");
    }

    const url = new URL(req.url);
    const endpoint = url.pathname.split("/").pop();

    // Initialize clients
    const serperClient = getJson(SERPER_API_KEY);
    const cohereClient = new CohereClient({ token: COHERE_API_KEY });
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    switch (endpoint) {
      case "news": {
        try {
          const news = await serperClient.search({
            q: "gold price market news",
            num: 10,
          });

          if (!news?.organic) {
            throw new Error("Invalid news data received");
          }

          const transformedNews = news.organic.map((item: any) => ({
            id: item.position,
            title: item.title,
            source: item.source,
            date: item.date || new Date().toISOString(),
            summary: item.snippet,
            url: item.link,
            impact: 'medium'
          }));

          return new Response(JSON.stringify(transformedNews), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("News endpoint error:", error);
          throw new Error(`Failed to fetch news: ${error.message}`);
        }
      }

      case "sentiment": {
        try {
          const news = await serperClient.search({
            q: "gold price market news",
            num: 5,
          });

          if (!news?.organic) {
            throw new Error("Invalid news data received");
          }

          const sentiments = await Promise.all(
            news.organic.map(async (item: any) => {
              const response = await cohereClient.classify({
                inputs: [item.snippet],
                examples: [
                  { text: "Gold prices surge on strong demand", label: "positive" },
                  { text: "Gold market faces uncertainty", label: "neutral" },
                  { text: "Gold prices plummet on selling pressure", label: "negative" }
                ]
              });

              return {
                id: item.position,
                title: item.title,
                source: item.source,
                date: item.date || new Date().toISOString(),
                sentiment: response.classifications[0].prediction,
                score: response.classifications[0].confidence,
                summary: item.snippet
              };
            })
          );

          return new Response(JSON.stringify(sentiments), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Sentiment endpoint error:", error);
          throw new Error(`Failed to analyze sentiment: ${error.message}`);
        }
      }

      case "price-prediction": {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a gold market analyst. Provide price predictions in JSON format with direction, target, and confidence."
              },
              {
                role: "user",
                content: "Analyze current gold market conditions and provide a short-term price prediction."
              }
            ],
            response_format: { type: "json_object" }
          });

          return new Response(completion.choices[0].message.content, {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Price prediction endpoint error:", error);
          throw new Error(`Failed to generate price prediction: ${error.message}`);
        }
      }

      default:
        return new Response(JSON.stringify({ error: "Endpoint not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});