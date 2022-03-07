import { Handler } from "@netlify/functions";
import faunadb from "faunadb";

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET as string,
  domain: "db.fauna.com",
  port: 443,
  scheme: "https",
});

const handler: Handler = async (event, context) => {
  const search = event.queryStringParameters?.["search"] ?? "";

  try {
    const data = await client.query<any>(
      q.Map(
        q.Filter(
          q.Paginate(q.Match(q.Index("all_changing_places")), { size: 10000 }),
          q.Lambda((x) =>
            q.ContainsStr(
              q.LowerCase(q.Select(["data", "name"], q.Get(x), "@Worle")),
              search.toLocaleLowerCase()
            )
          )
        ),
        q.Lambda((x) => q.Get(x))
      ),
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
