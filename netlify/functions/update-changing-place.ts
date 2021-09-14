import { Handler } from "@netlify/functions";
import faunadb from "faunadb";
import { Client } from "@googlemaps/google-maps-services-js";

const q = faunadb.query;

const dbClient = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET as string,
  domain: "db.fauna.com",
  port: 443,
  scheme: "https",
});

const mapsClient = new Client({});

const handler: Handler = async (event, context) => {
  if (event.body) {
    const toilet = JSON.parse(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify(toilet),
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
