import { db } from '$lib/server/db/index.js';
import { learnSession } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';




export async function POST({request}){

  const response = await request.json()
  console.log(response)
  
}