import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { flashcard } from "$lib/server/db/schema";

export async function POST({ request }) {
  try {
    const response = await request.json();

    if (!response) {
      throw Error("Could not fetch at /api/flashcard/create");
    }

    try {
      // Flashcard erstellen und zurückgeben
      const [newFlashcard] = await db
        .insert(flashcard)
        .values({
          question: response.data.question,
          answer: response.data.answer,
          category_id: response.data.category_id,
          user_id: response.user.id
        })
        .returning();

      return json({
        error: false,
        message: "New Flashcard created",
        newFlashcard
      });
    } catch (error) {
      console.error("Database error:", error);
      return json({ error: true, message: "Database error" });
    }
  } catch (error) {
    console.log(error);
    return json({ error: true, message: "Something went wrong..." });
  }
}
