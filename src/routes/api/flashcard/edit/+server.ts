import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { flashcard } from "$lib/server/db/schema.js";
import { eq,sql,and } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";

export async function PATCH({request,locals}:RequestEvent){

  try{
    const data = await request.json();
    const updatedFlashcard = await db.update(flashcard).set(data.flashcard).where(and(eq(flashcard.user_id, locals.user.id), eq(flashcard.id, data.id))).returning()

    return json({error:false, message:"Flashcard updated", data:updatedFlashcard})
  } catch(error){
    return json({error:true, message:`An error occured at /api/flashcard/edit: ${error}`, data:[]})
  }

}

