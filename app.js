// EDIT RECIPE INGREDIENTS
const addRecipeIngredForm = document.getElementById("add-recipe-ingred-form");
const currRecipeIngredList = document.getElementById("edit-recipe-ingred-list");
const addRecipeIngredSubmit = document.querySelector("#add-recipe-ingred-form #submit-btn");


let recIngredName = "";
let recIngredQuantity = "Unknown";
let recIngredUnit = "Unknown";
let recIngredCategory = "Unknown";
// Temporary array for current recipe ingredients
let currentIngredients = [];

const recIngredNameInput = document.querySelector("#add-recipe-ingred-form #ingred-name-input");
const recIngredQuantityInput = document.querySelector("#add-recipe-ingred-form #quantity-input");
const recIngredUnitInput = document.document.querySelector("#add-recipe-ingred-form #unit-input");
const recIngredCategoryInput = document.document.querySelector("#add-recipe-ingred-form #category-input");
const recIngredCostInput = document.querySelector("#add-recipe-ingred-form #cost-input");
// EDIT RECIPE INGREDIENTS
//base functions
function addIngredToRecipe(recipeName, recipeIngredient) {
  // Get existing recipes from localStorage
const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};

  if (!storedRecipes[recipeName]) {
    storedRecipes[recipeName] = [];
  }

  storedRecipes[recipeName].push(recipeIngredient);

  localStorage.setItem("recipes", JSON.stringify(storedRecipes));
}

function renderCurrIngredients(recipeName) {
  const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
  const recipeIngredients = storedRecipes[recipeName] || [];

  const ul = document.querySelector("#recipe-ingredients");
  ul.innerHTML = "<li>No ingredients added</li>"; // Clear previous

  recipeIngredients.forEach((ingred) => {
    const li = document.createElement("li");
    li.textContent = `${ingred.name}`;
    ul.appendChild(li);
  });
}

//form
addRecipeIngredSubmit.addEventListener("click",()) => {
    e.preventDefault();

    recIngredName = recIngredNameInput.ariaValueMax.trim();
    recIngredQuantity = recIngredQuantityInput.value.trim()
    ? parseFloat(recIngredQuantityInput.value)
    : "Unknown";
    recIngredUnit = recIngredUnitInput.value.trim() || "Unknown";
    recIngredCategory = recIngredCategoryInput.value.trim() || "Unknown";
    recIngredCost = recIngredCostInput.value.trim() 
    ? parseFloat(recIngredCostInput.value) 
    : "Unknown";
    
    if (!recIngredName) return alert("Ingredient name is required."); //FIX ME: Change to red outline on form

    if (recIngredName) {
        const recIngredient = {
          name: recIngredQuantity,
          quantity: recIngredQuantity,
          unit: recIngredUnit,
          category: recIngredCategory,
          cost: recIngredCost
        };
        currentIngredients.push(recIngredient);
        clearRecIngredInputs();
        updateIngredientList();
      }

      renderCurrIngredients(recipeName);
    clearIngredientInputs();
}

function clearRecIngredInputs() {
    recIngredName = "";
    recIngredQuantity = "";
    recIngredUnit = "";
    recIngredCategory = "";
    recIngredCost = "";
}


// Example of how to add a new recipe in the future:
recipes["New Recipe Name"] = [
  {
    name: "Ingredient 1",
    unit: "unit type",
    quantity: 0,
    category: "Category",
    cost: 0,
  },
  {
    name: "Ingredient 2",
    unit: "unit type",
    quantity: 0,
    category: "Category",
    cost: 0,
  },
];

// SAVED INFO
const recipes = {};
