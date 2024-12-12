import { db } from "$lib/server/db";
import { schema } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type {Actions, Action, PageServerLoad} from './$types';
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import { user } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
  //todo
}

const login: Action = async ({cookies, request}) => {

  const data = await request.formData()
  const username = data.get("username");
  const password = data.get("password");

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, {error:true, message:"Invalid Credentials"})
  }

  const resultUser = await db.query.user.findFirst({
    where:eq(schema.user.username,username),
  })

  if (!resultUser){
    return fail(400, {error:true, message:"Invalid Credentials"})
  }

  const userPassword = await bcrypt.compare(password, resultUser.passwordHash);

  if (!userPassword){
    return fail(400, {error:true,message:"Invalid Credentials"})
  }

  const newAuthToken = crypto.randomUUID()

  const authUser = await db.update(user).set({userAuthToken: newAuthToken}).where(eq(schema.user.username,username))

  console.table(authUser);

  cookies.set('session', newAuthToken,{path: '/', httpOnly:true, sameSite:"lax",secure:process.env.NODE_ENV === 'production', maxAge:60*60*2})

  throw redirect(302, "/")
}



export const actions: Actions = {login}