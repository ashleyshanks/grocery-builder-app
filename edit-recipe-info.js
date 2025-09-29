const recNameInput = document.querySelector("#recipe-form #recipe-name");
const recServesInput = document.getElementById("serves");
const recTimeInput = document.getElementById("cook-time");
const recTypeInput = document.getElementById("meal-type");
const recMethodInput = document.getElementById("method-input");
const recCreatorInput = document.getElementById("creator");
const recLinkInput = document.getElementById("recipe-link");

const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe; // default if none saved

let recipeNameUI = document.querySelector("#recipe-form h2 span");
recipeNameUI.textContent = currRecipe;
recNameInput.placeholder = currRecipe || "Untitled";

// Try to load saved recipes
const savedRecipes = localStorage.getItem("recipes");
// Parse saved recipes, or start with an empty object if nothing is saved
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};

const editRecipeBtn = document.querySelector("#recipe-form #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  let recName = recNameInput.value.trim() || currRecipe;
  let recServes = recServesInput.value;
  let recTime = recTimeInput.value;
  let recType = recTypeInput.value;
  let recMethod = recMethodInput.value;
  let recCreator = recCreatorInput.value;
  let recLink = recLinkInput.value;

  if (!recName) {
    alert("Recipe name required");
  } else {
    currRecipe = recName; // or the recipe the user chose
    localStorage.setItem("currRecipe", currRecipe);
    recipeNameUI.textContent = currRecipe;

    if (!recipes[currRecipe]) {
      recipes[currRecipe] = {
        name: currRecipe,
        serves: recServes || "Unknown",
        time: recTime || "Unknown",
        type: recType || "Unknown",
        method: recMethod || "Unknown",
        creator: recCreator || "Unknown",
        link: recLink || "Unknown",
        ingredients: {},
      };
    }

    localStorage.setItem("recipes", JSON.stringify(recipes));

    console.log("Recipes saved");
  }
});
