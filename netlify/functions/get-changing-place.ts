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
  const limit = event.queryStringParameters?.["limit"] ?? 10;
  const ref = event.queryStringParameters?.["id"];

  const options: any = {
    size: +limit,
  };

  try {
    const data = await client.query<any>(
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
  }
};

export { handler };
