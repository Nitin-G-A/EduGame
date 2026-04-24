// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation helper
function validateInput(body: unknown): { topic: string; difficulty: string; numQuestions: number } | null {
  if (!body || typeof body !== 'object') return null;
  
  const data = body as Record<string, unknown>;
  
  const topic = typeof data.topic === 'string' && data.topic.length > 0 && data.topic.length <= 500 
    ? data.topic 
    : "general knowledge";
  
  const validDifficulties = ['easy', 'medium', 'hard'];
  const difficulty = typeof data.difficulty === 'string' && validDifficulties.includes(data.difficulty)
    ? data.difficulty
    : "medium";
  
  let numQuestions = 5;
  if (typeof data.numQuestions === 'number') {
    numQuestions = Math.min(20, Math.max(1, Math.floor(data.numQuestions)));
  }
  
  return { topic, difficulty, numQuestions };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();

    const validatedInput = validateInput(body);
    if (!validatedInput) {
      return new Response(JSON.stringify({ error: "Invalid input parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { topic, difficulty, numQuestions } = validatedInput;

    // using Google Gemini directly
    // @ts-ignore: Deno is available in Supabase Edge Functions
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const prompt = `
Generate ${numQuestions} ${difficulty} multiple choice questions about "${topic}".

Return ONLY JSON in this format:
{
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "text"
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Error:", errorText);
      throw new Error(`Gemini request failed: ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Invalid Gemini response");
    }

    // Extract JSON safely
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not parse AI response");
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const result = JSON.parse(jsonString);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
      success: false
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});