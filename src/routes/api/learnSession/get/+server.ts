import { db } from "$lib/server/db";
import { schema } from "$lib/server/db/schema";

import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export async function GET({locals}:RequestEvent){

  try{
    const learnSessions = await db.query.learnSession.findMany({
      where:eq(schema.learnSession.user_id,locals.user.id)
    })
    if(!learnSessions){
      return json({error:true,message:`Could not fetch learnSessions from user ${locals.user.name}`,data:[]})
    }
    return json({error:false,message:`learnSession fetched`,data:learnSessions })
  } catch(error){
    console.log(`An error occured in /api/learnSession/get: ${error}`)
    return json({error:true, message:`An error occured in /api/learnSession/get: ${error}`,data:[]})
  }
}