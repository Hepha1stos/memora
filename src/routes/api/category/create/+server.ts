import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { category } from "$lib/server/db/schema";

export async function POST({ request }) {
  try {
    const data = await request.json();

    if (!data) {
      throw new Error("No data sent");
    }

    console.log(data);

    try {
      // Insert category and return the new row
      const [newCategory] = await db
        .insert(category)
        .values({ name: data.data, user_id: data.user.id })
        .returning();

      return json({
        error: false,
        message: "New Category created",
        newCategory,
      });
    } catch (error) {
      if (error.code === "23505") {
        return json({ error: true, message: "Category already created" });
      }
      console.error("Database error:", error);
      return json({ error: true, message: "Database error" });
    }
  } catch (error) {
    console.log(error);
    return json({ error: true, message: "Invalid request" });
  }
}
