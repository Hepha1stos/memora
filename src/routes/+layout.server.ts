import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, url }) => {

  if (!locals.user && url.pathname !== "/login" && url.pathname !== "/register") {
    throw redirect(302, "/login");
  }
  if(locals.user){
    console.table(locals)
  }
  
  return {
    user: locals.user
  };
};