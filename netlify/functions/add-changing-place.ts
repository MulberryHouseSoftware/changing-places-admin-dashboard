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

    const geocode = async (toilet: any) => {
      try {
        let res = await mapsClient.geocode({
          params: {
            address: [
              toilet.name,
              toilet.address_1,
              toilet.address_2,
              toilet.city,
              toilet.county,
              toilet.postcode,
              toilet.country,
            ]
              .filter((d) => d)
              .join(" "),
            key: "AIzaSyA-sTinUdfDSE7h80ld35HFS3wrRnoYgh0",
          },
          timeout: 1000, // milliseconds
        });

        if (res.data.results.length === 0) {
          console.log(`No data found for ${toilet.name}`);
        } else {
          console.log(`Data found for ${toilet.name}`);
        }

        const result = res.data.results[0];

        return {
          place_id: result.place_id,
          formatted_address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        };
      } catch (error) {
        console.log(error);
      }
    };

    const result = await geocode(toilet);

    const data = await dbClient.query<any>(
      q.Create(q.Collection("changing_places"), {
        data: { ...toilet, ...result },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ ...toilet, ...result }),
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
