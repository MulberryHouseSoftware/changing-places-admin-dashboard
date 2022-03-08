import { Handler } from "@netlify/functions";
import faunadb, { Collection } from "faunadb";
import { csvFormat } from "d3-dsv";

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET as string,
  domain: "db.fauna.com",
  port: 443,
  scheme: "https",
});

const handler: Handler = async (event, context) => {
  const limit = event.queryStringParameters?.["limit"] ?? 20000;
  const ref = event.queryStringParameters?.["cursor"];

  const options: any = {
    size: +limit,
  };

  if (ref) {
    options.after = [q.Ref(q.Collection("changing_places"), ref)];
  }

  try {
    const data = await client.query<any>(
      q.Map(
        q.Paginate(q.Documents(q.Collection("changing_places")), options),
        q.Lambda((x) => q.Get(x))
      ),
      {
        queryTimeout: 1000,
      }
    );

    console.log(`Found ${data.data.length} locations`);

    return {
      statusCode: 200,
      contentType: "text/csv",
      body: csvFormat(data.data.map((d: any) => ({ ...d.data }))),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
    };
  }
};

export { handler };
