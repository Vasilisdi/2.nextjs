import { supabaseAdmin } from '../../lib/supabase';

export async function GET() {
  try {
    console.log("Fetching data from Supabase...");

    const { data, error } = await supabaseAdmin
      .from('measurements')
      .select('*');

    if (error) {
      console.error("Error fetching measurements:", error);
      return new Response("Error fetching measurements: " + error.message, { status: 500 });
    }

    console.log("Fetched data:", data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);

    // Cast err to Error type to access message
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return new Response("Unexpected error: " + errorMessage, { status: 500 });
  }
}
