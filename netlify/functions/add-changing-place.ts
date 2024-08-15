import { Handler } from "@netlify/functions";
import { Client } from "@googlemaps/google-maps-services-js";
import { createClient } from "@supabase/supabase-js";

import { Database } from "../../database.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mapsClient = new Client({});

const handler: Handler = async (event, context) => {
  if (event.body) {
    const toilet = JSON.parse(event.body);

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

      return {
        statusCode: 500,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ...toilet, ...result }),
    };
  } else {
    return {
      statusCode: 500,
    };
  }

  /* try {
    const data = await dbClient.query<any>(
      q.Get(q.Ref(q.Collection("changing_places"), ref)),
      {
        queryTimeout: 1000,
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
    };
  } */
};

export { handler };
