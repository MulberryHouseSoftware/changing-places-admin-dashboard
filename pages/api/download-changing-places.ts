import type { NextApiRequest, NextApiResponse } from "next";

import { Database } from "../../database.types";
import { createClient } from "@supabase/supabase-js";
import { csvFormat } from "d3-dsv";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZ3FpbmtpbnJ1bGxzYmtjaWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM4MDAyMjUsImV4cCI6MjAxOTM3NjIyNX0.MkWX_HO7D4sgHh1DPRS5NlY_ELIZtxqUjMRVkW8Bkes"
);

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, error } = await supabase.from("toilets").select();

    if (error) {
      return {
        statusCode: 500,
      };
    }

    if (!data) {
      throw new Error("No data found");
    }

    res.status(200).setHeader("Content-Type", "text/csv").send(csvFormat(data));
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "failed to load data" });
  }
}