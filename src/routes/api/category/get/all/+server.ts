import {json} from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { category } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";


export async function GET({locals}:RequestEvent){

 try{
  const categories = await db.query.category.findMany({where:eq(category.user_id,locals.user.id)});

  return json({error:false, message:"categories succsessfully fetched", data:categories})
 } catch(error){
  console.log(error)
 }

}