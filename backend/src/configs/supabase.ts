import { createClient } from "@supabase/supabase-js";

// Ensure these variables are in your envConfig or process.env
// For now accessing process.env directly if not in envConfig yet,
// but ideally should be added to envConfig.
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_KEY. Uploads will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
