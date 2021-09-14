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
    const data = JSON.parse(event.body);

    const toilet = data.data;
    const id = data.id;

    console.log(toilet, id);

    const res = await dbClient.query(
      q.Update(q.Ref(q.Collection("changing_places"), id), { data: toilet }),
      {
        queryTimeout: 1000,
      }
    );

    console.log(res);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } else {
    return {
      statusCode: 500,
    };
  }

  /*
  Update(
  Ref(Collection("Spaceships"), "266354515987399186"),
  // NOTE: be sure to use your ship's document ID here
  {
    data: {
      name: "Millennium Falcon"
    }
  }
)*/
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
