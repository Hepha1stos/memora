import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { flashcard } from "$lib/server/db/schema.js";
import { eq,sql } from "drizzle-orm";


export async function PATCH({ request }) {
  try {
    const { data } = await request.json(); // Empfange das Array mit sessionAnswers
    console.log("Received data:", data);

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // Aktualisiere jede Flashcard basierend auf den Antworten
    for (const answer of data) {
      const { flashcardId, answered } = answer;

      if (answered) {
        // Erhöhe num_correct
        await db
          .update(flashcard)
          .set({ num_correct: sql`${flashcard.num_correct} + 1` })
          .where(eq(flashcard.id,flashcardId));
      } else {
        // Erhöhe num_wrong
        await db
          .update(flashcard)
          .set({num_wrong: sql`${flashcard.num_wrong} + 1`})
          .where(eq(flashcard.id,flashcardId));
      }
    }

    return json({ error: false, message: "Flashcards updated successfully" });
  } catch (error) {
    console.error("Error updating flashcards:", error);
    return json({ error: true, message: "Failed to update flashcards" });
  }
}
