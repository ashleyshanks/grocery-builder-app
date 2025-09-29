const recNameInput = document.querySelector("#recipe-form #recipe-name");
const recServesInput = document.getElementById("serves");
const recTimeInput = document.getElementById("cook-time");
const recTypeInput = document.getElementById("meal-type");
const recMethodInput = document.getElementById("method-input");
const recCreatorInput = document.getElementById("creator");
const recLinkInput = document.getElementById("recipe-link");

const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe; // default if none saved
//incorrect save testing
// localStorage.setItem("currRecipe", currRecipe);

let recipeNameUI = document.querySelector("#recipe-form h2 span");
recipeNameUI.textContent = currRecipe || "New Recipe";

//Having issues with setting new recipe true/false correctly
// Moving load into editRecipeBtn function fixed this issue
// But now currRecipe is unable to switch between edit recipe/new recipe correctly

updatePlaceholders();

const editRecipeBtn = document.querySelector("#recipe-form #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  // Try to load saved recipes
  const savedRecipes = localStorage.getItem("recipes");
  // Parse saved recipes, or start with an empty object if nothing is saved
  const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
  console.log("currRecipe is", currRecipe);
  console.log("recipes:", recipes);
  console.log("Object.keys(recipes):", Object.keys(recipes));
  console.log("Object.keys(recipes).length:", Object.keys(recipes).length);
  let newRecipe;
  // If recipes object is empty, this is a new recipe
  if (Object.keys(recipes).length === 0) {
    newRecipe = true;
  } else {
    newRecipe = false;
  }
  let inputName = recNameInput.value.trim();

  if (!inputName && newRecipe) {
    alert("Recipe name required");
    return;
  }

  console.log("newRecipe is", newRecipe);
  if (newRecipe) {
    //New recipe
    recName = inputName;
    recServes = recServesInput.value || "Unknown";
    recTime = recTimeInput.value || "Unknown";
    recType = recTypeInput.value || "Unknown";
    recMethod = recMethodInput.value || "Unknown";
    recCreator = recCreatorInput.value || "Unknown";
    recLink = recLinkInput.value || "Unknown";
    recIngreds = {};
    currRecipe = recName;
  } else {
    //Editing current recipe
    const prevName = currRecipe;
    currRecipe = inputName || recipe.name;

    if (currRecipe !== prevName) {
      recipes[currRecipe] = { ...recipes[prevName] }; // copy old recipe
      delete recipes[prevName];
    }
    // recName = inputName || recipe.name;
    recServes = recServesInput.value || recipe.serves || "Unknown";
    recTime = recTimeInput.value || recipe.time || "Unknown";
    recType = recTypeInput.value || recipe.type || "Unknown";
    recMethod = recMethodInput.value || recipe.method || "Unknown";
    recCreator = recCreatorInput.value || recipe.creator || "Unknown";
    recLink = recLinkInput.value || recipe.link || "Unknown";
    recIngreds = recipes[currRecipe]?.ingredients || {};
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

  console.log("recipes map:");
  console.log(recipes);

  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("currRecipe", currRecipe);

  console.log(recipes[currRecipe]);
  console.log("Recipes saved");
});

//favorite
const favStar = document.getElementById("fav-star");

if (currRecipe) {
  if (recFav) {
    favStar.classList.add("favorited");
  } else {
    favStar.classList.remove("favorited");
  }
}
favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  if (currRecipe && recipes[currRecipe]) {
    recipes[currRecipe].favorite = recFav;
    localStorage.setItem("recipes", JSON.stringify(recipes));

    //testing
    console.log("recipes map");
    console.log(recipes);
  }
});

// FUNCTIONS

function updatePlaceholders() {
  //update placeholders if values exist
  if (currRecipe) {
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
  }
}

function clearValues() {
  recServesInput.value = "";
  recTimeInput.value = "";
  recTypeInput.value = "";
  recMethodInput.value = "";
  recCreatorInput.value = "";
  recLink = "";
}

function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("currRecipe");

  currRecipe = null;
  recipe = null;
  recName = "";
  recServes = "";
  recTime = "";
  recType = "";
  recMethod = "";
  recCreator = "";
  recLink = "";
  recIngreds = {};
  recFav = false;
}
