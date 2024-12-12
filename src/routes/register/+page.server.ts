import { db } from "$lib/server/db";
import { schema } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { user } from "$lib/server/db/schema";

enum Roles {
  ADMIN = 'Admin',
  USER = 'User'
}

export const load: PageServerLoad = async () => {

}


const register: Action = async ({ request }) => {
  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");
  const secondPassword = data.get("password_valid");
  const email = data.get("email");
  const uuid = crypto.randomUUID();

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return fail(400, { error: true, message:"Username and Password must be provided" })
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(schema.user.username, username),
  })

  if (existingUser) {
    return fail(400, { error: true, message:"User already exists" })
  }

  if (password !== secondPassword){
    return fail(400, {error:true, message:"Entered Passwords did not match"})
  }

  if (password.length < 4){
    return fail(400, {error:true, message:"Password must be at least 4 characters long!"})
  }

  const userRole = await db.query.roles.findFirst({
    where: eq(schema.roles.name, Roles.USER),
  });

  console.table({ username, password, email, uuid, userRole });
  await db.insert(user).values({id:crypto.randomUUID(), username:username, email:email, userAuthToken:crypto.randomUUID(), passwordHash: await bcrypt.hash(password, 10), roleId: 2})

  throw redirect(303, '/login');

 
}

export const actions: Actions = {
  register
}