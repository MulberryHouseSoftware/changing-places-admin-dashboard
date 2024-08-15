import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

import { Database } from "../../database.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://acgqinkinrullsbkcihi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZ3FpbmtpbnJ1bGxzYmtjaWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM4MDAyMjUsImV4cCI6MjAxOTM3NjIyNX0.MkWX_HO7D4sgHh1DPRS5NlY_ELIZtxqUjMRVkW8Bkes"
);

const handler: Handler = async (event, context) => {
  const id = event.queryStringParameters?.["id"];

  if (!id) {
    return {
      statusCode: 400,
    };
  }

  try {
    const { data, error } = await supabase
      .from("toilets")
      .select()
      .eq("id", id)
      .single();

    /*     if (data.requestResult.statusCode !== 200) {
      return {
        statusCode: data.requestResult.statusCode,
        body: JSON.stringify(data.requestResult.responseContent),
      };
    } */

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({}),
    };
  }
};

export { handler };
