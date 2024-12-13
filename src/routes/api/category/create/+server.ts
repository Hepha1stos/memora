import {json} from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { category } from "$lib/server/db/schema";

export async function POST({request}){
  
  try{

    const data = await request.json()

    if(!data){
      throw new Error("No data send")
    }

    console.log(data)

    try{
      await db.insert(category).values({name:data.data,user_id:data.user.id})
    
    } catch (error){
      if (error.code === '23505'){
        return json({error:true, message:"Category already created"})
      }
      console.error("Database error:", error);
      return json({ error: true, message: "Database error" });
    }

    return json({error:false, message:"New Category created"})

  } catch (error){
    console.log(error)
  }

}
