import { db } from "$lib/server/db";
import { category } from "$lib/server/db/schema";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import type { RequestEvent } from "@sveltejs/kit";

export async function DELETE({ request, locals }: RequestEvent) {
  try {
    const data = await request.json();

    const result = await db
      .delete(category)
      .where(and(eq(category.id, data.id), eq(category.user_id, locals.user.id)))
      .returning();

    if (result.length === 0) {
      return json({
        error: true,
        message: "No category was deleted. Either it doesn't exist or you don't have permission.",
        data: [],
      });
    }

    return json({ error: false, message: "Category deleted", data: result });
  } catch (error) {
    console.error("Error in DELETE /api/category/delete:", error);
    return json({
      error: true,
      message: `An Error occurred in /api/category/delete: ${error.message}`,
      data: [],
    });
  }
}
