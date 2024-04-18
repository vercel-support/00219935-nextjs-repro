import { MongoClient } from 'mongodb';
import { NextResponse, type NextRequest } from 'next/server';
import { ParsedQs } from 'qs';

export const maxDuration = 900;

const port = process.env.PORT;

const API_URI = process.env.MONGODB_URI as string;
const dbClient = new MongoClient(API_URI);

const database = dbClient.db();
const commentsCollection = database.collection('comments');

const retrieveComments = async () => {
  try {
    const comments = await commentsCollection.find().toArray();

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

export async function GET(request: NextRequest) {
  try {
    const comments = await retrieveComments();
    // await run();
    return NextResponse.json(comments);
  } catch (error) {
    return new NextResponse('error', { status: 599 });
  }
}
