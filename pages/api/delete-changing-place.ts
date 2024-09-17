import type { NextApiRequest, NextApiResponse } from "next";

import { Database } from "../../database.types";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    const response = await supabase
      .from("toilets")
      .delete()
      .eq("id", id as string);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "failed to load data" });
  }
}
