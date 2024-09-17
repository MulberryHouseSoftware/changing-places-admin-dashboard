import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from "@googlemaps/google-maps-services-js";
import { Database } from "../../database.types";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mapsClient = new Client({});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.body) {
      const data = req.body;

      const toilet = data.data;
      const id = data.id;

      console.log(id, toilet);

      const { error } = await supabase
        .from("toilets")
        .update(toilet)
        .eq("id", id);

      if (error) {
        console.log(error);

        return res.status(500).json({ message: error });
      }

      res.status(200).json({ message: "success" });
    } else {
      return res.status(500).json({ message: "No body" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "failed to load data" });
  }
}
