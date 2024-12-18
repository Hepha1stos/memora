import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { schema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
  // CORS Preflight-Request behandeln
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  // Session prüfen
  const session = event.cookies.get('session');

  if (session) {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.userAuthToken, session),
      columns: {
        username: true,
        roleId: true,
        id: true
      }
    });

    if (user) {
      event.locals.user = {
        name: user.username,
        roleId: user.roleId,
        id: user.id
      };
    }
  }

  // Anfrage verarbeiten und CORS-Header ergänzen
  const response = await resolve(event);

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
};
