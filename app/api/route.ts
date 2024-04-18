import { MongoClient } from 'mongodb';
import { NextResponse, type NextRequest } from 'next/server';
import { ParsedQs } from 'qs';

export const maxDuration = 900;
export const dynamic = 'force-dynamic';

const port = process.env.PORT;

const API_URI = process.env.MONGODB_URI as string;
const dbClient = new MongoClient(API_URI);

const retrieveComments = async (client: MongoClient) => {
  try {
    const database = client.db();
    const commentsCollection = database.collection('comments');
    const comments = await commentsCollection
      .find({
        $where:
          'this.date > new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)',
      })
      .toArray();

    return JSON.stringify(comments);
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

async function listDatabases(client: MongoClient) {
  const databasesList = await client.db().admin().listDatabases();

  return databasesList.databases;
}

export async function GET(request: NextRequest) {
  try {
    await dbClient.connect();
    // const comments = await retrieveComments(dbClient);
    const dbs = await listDatabases(dbClient);
    // await run();
    return NextResponse.json(dbs);
  } catch (error) {
    return new NextResponse('error', { status: 599 });
  }
}
