import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { category } from "$lib/server/db/schema";
import type {RequestEvent} from "@sveltejs/kit"
import { and, eq } from "drizzle-orm";



export async function PUT({request, locals} : RequestEvent){

  try{
    const newCategory = await request.json()
    const updatedCategory = await db.update(category).set({name:newCategory.name}).where(and(eq(category.user_id, locals.user.id), eq(category.id, newCategory.id))).returning()

    return json({error:false, message:"Category updated!", data:updatedCategory})

  } catch(error){
    return json({error:true, message:`An error occured in /api/category/updated: ${error}`, data:[]})
  }

}