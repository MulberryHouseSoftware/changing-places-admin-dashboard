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
    const data = JSON.parse(event.body);

    const toilet = data.data;
    const id = data.id;

    console.log(id, toilet);

    const { error } = await supabase
      .from("toilets")
      .update(toilet)
      .eq("id", id);

    if (error) {
      console.log(error);

      return {
        statusCode: 500,
        body: JSON.stringify({ message: error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(toilet),
    };
  } else {
    return {
      statusCode: 500,
    };
  }
};

export { handler };
