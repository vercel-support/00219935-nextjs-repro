import { MongoClient } from 'mongodb';
import { NextResponse, type NextRequest } from 'next/server';
import { ParsedQs } from 'qs';

const port = process.env.PORT;

const API_URI = process.env.MONGODB_URI as string;
const dbClient = new MongoClient(API_URI);

const database = dbClient.db('Cluster0');
const invites = database.collection('invites');

const retrieveRSVP = async (
  rsvpCode: string | ParsedQs | string[] | ParsedQs[]
) => {
  try {
    const query = {
      code: rsvpCode,
    };

    const rsvp = await invites.findOne(query);

    return JSON.stringify(rsvp);
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

const submitRSVP = async (
  rsvpCode: string | ParsedQs | string[] | ParsedQs[],
  rsvpResponse: boolean | string | ParsedQs | string[] | ParsedQs[]
) => {
  try {
    const query = {
      code: rsvpCode,
    };

    const response = {
      $set: {
        attending: rsvpResponse,
      },
    };

    const databaseResponse = await invites.updateOne(query, response);

    return databaseResponse;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await dbClient.connect();
    // Send a ping to confirm a successful connection
    await dbClient.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await dbClient.close();
  }
}

export async function GET(request: NextRequest) {
  const rsvpCode = request.nextUrl.searchParams.get('rsvpCode');

  if (!rsvpCode) {
    return new NextResponse('No code provided', { status: 400 });
  }

  // const rsvp = await retrieveRSVP(rsvpCode);
  await run();

  return new Response('rsvp', {
    headers: {
      'content-type': 'application/json',
    },
  });
}
