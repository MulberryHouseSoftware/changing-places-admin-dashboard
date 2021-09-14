import { Handler } from "@netlify/functions";
import faunadb from "faunadb";

const q = faunadb.query;

const dbClient = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET as string,
  domain: "db.fauna.com",
  port: 443,
  scheme: "https",
});

const handler: Handler = async (event, context) => {
  const id = event.queryStringParameters?.["id"];

  const res = await dbClient.query(
    q.Delete(q.Ref(q.Collection("changing_places"), id)),
    {
      queryTimeout: 1000,
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};

export { handler };
