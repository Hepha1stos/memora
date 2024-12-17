import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { flashcard } from "$lib/server/db/schema.js";
import { eq,sql,and } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";


export async function DELETE({request,locals}:RequestEvent){

  try{
    const response = await request.json();
    const result = await db.delete(flashcard).where(and(eq(flashcard.user_id,locals.user.id), eq(flashcard.id, response.id)))
    return json({error:false, message:"Flashcard deleted", data:result})
  } catch (error){
    return json({error:true, message:`An Error occured at /api/flashcard/delete: ${error}`, data:[]})
}
}