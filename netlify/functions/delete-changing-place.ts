import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

import { Database } from "../../database.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event, context) => {
  const id = event.queryStringParameters?.["id"];

  if (!id) {
    return {
      statusCode: 400,
    };
  }

  const response = await supabase.from("toilets").delete().eq("id", id);

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export { handler };
