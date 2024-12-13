import { db } from "$lib/server/db"
import { flashcard } from "$lib/server/db/schema";

import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";





export async function GET({locals}:RequestEvent){
  try{
    const flashcards = await db.query.flashcard.findMany({where:eq(flashcard.user_id,locals.user.id)});
    console.log(flashcards)
    return json({error:false, message:"flashcards successfully fetched", data:flashcards})
  } catch(error){
    return json({error:true,message:`${error}`, data:null})
  }
  

}