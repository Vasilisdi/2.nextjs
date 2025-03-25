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
    return new Response("Unexpected error: " + err.message, { status: 500 });
  }
}
