import { db } from '$lib/server/db/index.js';
import { learnSession } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from "@sveltejs/kit";

interface learnSessionRequest {
  category_id: number;
  total_correct: number;
  total_wrong: number;
  data: Array<object>;
}

export async function POST({ request, locals }: RequestEvent) {

  try {
    const response: learnSessionRequest = await request.json()
    console.log(response)

    try {
      await db.insert(learnSession).values({ category_id: response.category_id, total_correct: response.total_correct, total_wrong: response.total_wrong, data: response.data, user_id: locals.user.id })
    } catch (error) {
      console.log(`Database Error: ${error}`)
      return json({ error: true, message: `Database Error: ${error}`, data: [] })
    }

    return json({ error: false, message: "leranSession created", data: [] })
  } catch (error) {
    console.log(`An Error occured in /api/learnSession/create: ${error}`)
    return json({ error: true, message: `An Error occured in /api/learnSession/create: ${error}`, data: [] })
  }
}