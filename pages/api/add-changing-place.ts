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
      const toilet = req.body;

      const geocode = async (toilet: any) => {
        try {
          let res = await mapsClient.geocode({
            params: {
              address: [
                toilet.name,
                toilet.address_1,
                toilet.address_2,
                toilet.city,
                toilet.county,
                toilet.postcode,
                toilet.country,
              ]
                .filter((d) => d)
                .join(" "),
              key: "AIzaSyA-sTinUdfDSE7h80ld35HFS3wrRnoYgh0",
            },
            timeout: 1000, // milliseconds
          });

          if (res.data.results.length === 0) {
            console.log(`No data found for ${toilet.name}`);
          } else {
            console.log(`Data found for ${toilet.name}`);
          }

          const result = res.data.results[0];

          return {
            place_id: result.place_id,
            formatted_address: result.formatted_address,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          };
        } catch (error) {
          console.log(error);
        }
      };

      const result = await geocode(toilet);

      const { error } = await supabase
        .from("toilets")
        .insert({ ...toilet, ...result });

      if (error) {
        console.log(error);

        return res.status(500).json(error);
      }

      res.status(200).json({ ...toilet, ...result });
    } else {
      res.status(500);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "failed to load data" });
  }
}
