import type { NextApiRequest, NextApiResponse } from "next";

import { Database } from "../../database.types";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZ3FpbmtpbnJ1bGxzYmtjaWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM4MDAyMjUsImV4cCI6MjAxOTM3NjIyNX0.MkWX_HO7D4sgHh1DPRS5NlY_ELIZtxqUjMRVkW8Bkes"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    if (!id) {
      return {
        statusCode: 400,
      };
    }

    const { data, error } = await supabase
      .from("toilets")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "failed to load data" });
  }
}
