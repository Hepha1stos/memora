import {json} from "@sveltejs/kit";
import { db } from "$lib/server/db";


export async function GET(){

 try{
  const categories = await db.query.category.findMany();

  return json({error:false, message:"categories succsessfully fetched", data:categories})
 } catch(error){
  console.log(error)
 }

}