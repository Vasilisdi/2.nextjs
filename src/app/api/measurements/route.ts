import { supabaseAdmin } from "@/lib/supabase"; // Assuming you have a supabase client setup

export async function GET() {
  // Fetch the data from the 'measurements' table
  const { data, error } = await supabaseAdmin
    .from("measurements")
    .select("*");

  if (error) {
    return new Response("Error fetching measurements", { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
