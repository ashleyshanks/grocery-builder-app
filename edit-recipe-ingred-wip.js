// EDIT RECIPE INGREDIENTS
const addRecipeIngredForm = document.getElementById("add-recipe-ingred-form");
const currRecipeIngredList = document.getElementById("edit-recipe-ingred-list");
const addRecipeIngredSubmit = document.querySelector(
  "#add-recipe-ingred-form #submit-btn"
);

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes
  ? JSON.parse(savedRecipes)
  : {
      Spaghetti: { name: "Spaghetti", type: "Dinner", ingredients: {} },
      Lasagna: { name: "Lasagna", type: "Dinner", ingredients: {} },
    };

const ingreds = {};
let ingred = {};

const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe ? savedCurrRecipe : "Untitled"; // default if none saved

let recipeNameUI = document.querySelector("#edit-recipe-ingred h2 span");
recipeNameUI.textContent = currRecipe;

updateIngredListUI();

const editRecipeBtn = document.querySelector("#add-item #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  const recIngredNameInput = document.querySelector(
    "#add-recipe-ingred-form #ingred-name-input"
  );
  const recIngredQuantityInput = document.querySelector(
    "#add-recipe-ingred-form #quantity-input"
  );
  const recIngredUnitInput = document.querySelector(
    "#add-recipe-ingred-form #unit-input"
  );
  const recIngredCategoryInput = document.querySelector(
    "#add-recipe-ingred-form #category-input"
  );
  const recIngredCostInput = document.querySelector(
    "#add-recipe-ingred-form #cost-input"
  );

  const recIngredName = recIngredNameInput.value;
  const recIngredQuantity = recIngredQuantityInput.value;
  const recIngredUnit = recIngredUnitInput.value;
  const recIngredCategory = recIngredCategoryInput.value;
  const recIngredCost = recIngredCostInput.value;

  console.log(
    recIngredName,
    recIngredQuantity,
    recIngredUnit,
    recIngredCategory,
    recIngredCost
  );

  item = {
    name: recIngredName,
    unit: recIngredUnit,
    category: recIngredCategory,
    cost: recIngredCost,
  };

  ingred = {
    name: recIngredName,
    quantity: recIngredQuantity,
  };

  ingreds[item.name] = item;

  console.log("Ingredients map:");
  console.log(ingreds);

  recipes[currRecipe].ingredients[ingred.name] = ingred;

  console.log("Recipes map:");
  console.log(recipes);

  updateIngredListUI();

  localStorage.setItem("recipes", JSON.stringify(recipes));
  console.log("Recipes saved to localStorage!");
});

function updateIngredListUI() {
  const listEl = currRecipeIngredList;
  const recipe = recipes[currRecipe]; // get the recipe object

  // Clear previous list
  listEl.innerHTML = "";

  // If no ingredients, show placeholder
  if (!recipe || Object.keys(recipe.ingredients).length === 0) {
    const li = document.createElement("li");
    li.textContent = "No ingredients added";
    listEl.appendChild(li);
    return;
  }

  // Loop through all ingredients and add them to the list
  for (const ingredName in recipe.ingredients) {
    const ingred = recipe.ingredients[ingredName];
    const li = document.createElement("li");
    li.textContent = ingredName;
    listEl.appendChild(li);
  }
}
