import { Handler } from "@netlify/functions";
import faunadb, { Collection } from "faunadb";

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET as string,
  domain: "db.fauna.com",
  port: 443,
  scheme: "https",
});

const handler: Handler = async (event, context) => {
  const ref = event.queryStringParameters?.["id"];

  try {
    const data = await client.query<any>(
      q.Get(q.Ref(q.Collection("changing_places"), ref)),
      {
        queryTimeout: 1000,
      }
    );

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
