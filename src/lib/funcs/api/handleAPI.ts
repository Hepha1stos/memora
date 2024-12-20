


export async function loadAllCategories() {
  try {
    const response = await fetch("/api/category/get/all", {
      method: "GET",
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      categories: [],
    };
  }
};


export async function loadAllFlashcards(){
  try{
    const response = await fetch("/api/flashcard/get", {
      method:'GET'
    });
    const data = await response.json();
    return data;
  } catch(error){
    console.error("Failed to fetch flashcards:", error);
    return{
      flashcards:[],
    }
  }
}