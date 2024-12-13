import type {Handle} from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { schema } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'


export const handle:Handle = async ({event, resolve}) => {
  const session = event.cookies.get('session')

  if (!session){
    return await resolve(event)
  }

  const user = await db.query.user.findFirst({
    where: eq(schema.user.userAuthToken,session),
    columns:{
      username:true,
      roleId:true,
      id:true
    }
  })

  if (user){
    event.locals.user = {
      name:user.username,
      roleId:user.roleId,
      id:user.id
    }

  }
  return await resolve(event)
}