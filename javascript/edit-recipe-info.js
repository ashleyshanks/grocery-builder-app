const recNameInput = document.querySelector("#recipe-form #recipe-name");
const recServesInput = document.getElementById("serves");
const recTimeInput = document.getElementById("cook-time");
const recTypeInput = document.getElementById("meal-type");
const recMethodInput = document.getElementById("method-input");
const recCreatorInput = document.getElementById("creator");
const recLinkInput = document.getElementById("recipe-link");

const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe; // default if none saved
localStorage.setItem("currRecipe", currRecipe);
// Try to load saved recipes
const savedRecipes = localStorage.getItem("recipes");
// Parse saved recipes, or start with an empty object if nothing is saved
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
let recipe = recipes[currRecipe];
let recName = recipe.name || "Unknown";
let recServes = recipe.serves || "Unknown";
let recTime = recipe.time || "Unknown";
let recType = recipe.type || "Unknown";
let recMethod = recipe.method || "Unknown";
let recCreator = recipe.creator || "Unknown";
let recLink = recipe.link || "Unknown";
let recIngreds = recipe.ingredients || {};
let recFav = recipe.favorite || false;

let recipeNameUI = document.querySelector("#recipe-form h2 span");
recipeNameUI.textContent = currRecipe;
//update placeholders if values exist
recNameInput.placeholder =
  !currRecipe || currRecipe === "Untitled" ? "" : recipe.name;
recServesInput.placeholder =
  !recipe.serves || recipe.serves === "Unknown" ? "" : recipe.serves;
recTimeInput.placeholder =
  !recipe.time || recipe.time === "Unknown" ? "" : recipe.time;
recCreatorInput.placeholder =
  !recipe.creator || recipe.creator === "Unknown" ? "" : recipe.creator;
recLinkInput.placeholder =
  !recipe.link || recipe.link === "Unknown" ? "" : recipe.link;
// For select dropdowns
recTypeInput.value =
  !recipe.type || recipe.type === "Unknown" ? "" : recipe.type;
recMethodInput.value =
  !recipe.method || recipe.method === "Unknown" ? "" : recipe.method;

const editRecipeBtn = document.querySelector("#recipe-form #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  recName = recNameInput.value.trim() || currRecipe;
  recServes = recServesInput.value || recipe.serves;
  recTime = recTimeInput.value || recipe.time;
  recType = recTypeInput.value || recipe.type;
  recMethod = recMethodInput.value || recipe.method;
  recCreator = recCreatorInput.value || recipe.creator;
  recLink = recLinkInput.value || recipe.link;
  recIngreds = recipes[currRecipe]?.ingredients || {};

  if (!recName) {
    alert("Recipe name required");
  } else {
    if (!currRecipe) {
      currRecipe = recName; // or the recipe the user chose
    }
    recipeNameUI.textContent = currRecipe;

    recipes[currRecipe] = {
      name: currRecipe,
      serves: recServes || "Unknown",
      time: recTime || "Unknown",
      type: recType || "Unknown",
      method: recMethod || "Unknown",
      creator: recCreator || "Unknown",
      link: recLink || "Unknown",
      ingredients: recIngreds,
      favorite: recFav,
    };

    localStorage.setItem("recipes", JSON.stringify(recipes));

    console.log(recipes[currRecipe]);
    console.log("Recipes saved");
  }
});

//favorite

const favStar = document.getElementById("fav-star");

if (recFav) {
  favStar.classList.add("favorited");
} else {
  favStar.classList.remove("favorited");
}

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  if (currRecipe && recipes[currRecipe]) {
    recipes[currRecipe].favorite = recFav;
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
});
