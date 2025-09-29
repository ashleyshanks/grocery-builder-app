// save button will be used to add recipe and ingredients ,

// -Update current ingredient list

// EDIT RECIPE INGREDIENTS
const addRecipeIngredForm = document.getElementById("add-recipe-ingred-form");
const currRecipeIngredList = document.getElementById("edit-recipe-ingred-list");
const addRecipeIngredSubmit = document.querySelector(
  "#add-recipe-ingred-form #submit-btn"
);

const recipes = {};
const ingreds = {};

// when calling, if no recipe name call w/ untitled
function createNewRecipe(
  recipeNameIn,
  serves,
  type,
  method,
  creator,
  link,
  ingreds
) {
  let baseName = recipeNameIn.trim();
  let sameNameCount = 0;

  for (const recipe of recipes) {
    if (recipe.name.startsWith(baseName)) {
      sameNameCount++;
    }
  }

  //append number if needed
  const recipeName = sameNameCount > 0 ? baseName + sameNameCount : baseName;

  const newRecipe = {
    name: recipeName,
    serves: serves.trim(),
    type: type.trim(),
    method: method.trim(),
    creator: creator.trim(),
    link: link.trim(),
    ingredients: ingreds, // optional, start with empty array
  };

  recipes[recipeName] = newRecipe;

  return recipeName;
}

function createIngred(name, unit, quantity, category, cost) {
  //check ingredient map to see if already exists
  //if exists use prev info if no input, if not use new input
  //add to global ingred map

  const ingredName = name.trim();
  if (!ingredName) return alert("Ingredient name is required.");

  // Check if ingredient already exists
  const existing = ingreds[ingredName] || {};

  const ingredient = {
    name,
    unit: unit?.trim() || existing.unit,
    quantity: quantity || existing.quantity,
    category: category?.trim() || existing.category,
    cost: cost || existing.cost,
  };

  ingreds[name] = ingredient;
  return ingredient;
}

//ATTACH INGRED TO CORRECT RECIPE
function addIngredToRecipe(recipeName, ingredient) {
  if (!recipes[recipeName]) {
    // createNewRecipe(
    //   tempRecName,
    //   tempRecServes, // serves
    //   tempRecType, // type
    //   tempRecMethod, // method
    //   tempRecCreator, // creator
    //   tempRecLink, // link
    //   tempRecIngreds // empty ingredients
    // );
    const recipeName = {
      name: "Recipe name",
      serves: 0,
      type: "Dinner",
      method: "One-pot",
      creator: "Me",
      link: "N/A",
      ingreds: [],
    };
  }
  recipes[recipeName].ingreds[ingredient.name] = ingredient;
}

//GET RECIPE INFO FROM INPUT...add to recipe page js

// const recNameInput = document.querySelector("#recipe-form #recipe-name");
// const recServesInput = document.querySelector("#recipe-form #serves");
// const recTimeInput = document.querySelector("#recipe-form #cook-time");
// const recTypeInput = document.querySelector(
//   "#add-recipe-ingred-form #meal-type"
// );
// const recMethodInput = document.querySelector(
//   "#add-recipe-ingred-form #method-input"
// );
// const recCreatorInput = document.querySelector(
//   "#add-recipe-ingred-form #creator"
// );
// const recLinkInput = document.querySelector(
//   "#add-recipe-ingred-form #recipe-link"
// );

// let tempRecName = "Untitled";
// let tempRecServes = "Unknown";
// let tempRecType = "Unknown";
// let tempRecMethod = "Unknown";
// let tempRecCreator = "Unknown";
// let tempRecLink = "Unknown";
// let tempRecIngreds = {};

// function replaceTempRecValues() {
//   tempRecName = recNameInput.value.trim() || tempRecName;
//   tempRecServes = recServesInput.value.trim() || tempRecServes;
//   tempRecType = recTypeInput.value.trim() || tempRecType;
//   tempRecMethod = recMethodInput.value.trim() || tempRecMethod;
//   tempRecCreator = recCreatorInput.value.trim() || tempRecCreator;
//   tempRecLink = recLinkInput.value.trim() || tempRecLink;
// }

//GET RECIPE INGREDIENTS FROM INPUT

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

let tempIngredName = "";
let tempIngredUnit = "Unknown";
let tempIngredQuantity = "Unknown";
let tempIngredCategory = "Unknown";
let tempIngredCost = "Unknown";

function replaceTempIngredValues() {
  tempIngredName = recIngredNameInput.value.trim() || tempIngredName;
  tempIngredQuantity =
    recIngredQuantityInput.value.trim() || tempIngredQuantity;
  tempIngredUnit = recIngredUnitInput.value.trim() || tempIngredUnit;
  tempIngredCategory =
    recIngredCategoryInput.value.trim() || tempIngredCategory;
}

//UI
function updateIngredListUI(recipeName) {
  const recipe = recipes[recipeName];
  const listEl = currRecipeIngredList;

  // Clear current list
  listEl.innerHTML = "";

  // If no ingredients, show placeholder
  if (!recipe || Object.keys(recipe.ingredients).length === 0) {
    const li = document.createElement("li");
    li.textContent = "No ingredients added";
    listEl.appendChild(li);
    return;
  }

  // Add each ingredient as a list item
  for (const ingredName in recipe.ingredients) {
    const ingred = recipe.ingredients[ingredName];
    const li = document.createElement("li");
    li.textContent = `${ingred.name} - ${ingred.quantity} ${ingred.unit} (${ingred.category})`;
    listEl.appendChild(li);
  }
}

//EVENT LISTENERS
const editRecipeBtn = document.querySelector("#add-item #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  //   replaceTempRecValues();

  //   const recipeName = createNewRecipe(
  //     tempRecName,
  //     tempRecServes, // serves
  //     tempRecType, // type
  //     tempRecMethod, // method
  //     tempRecCreator, // creator
  //     tempRecLink, // link
  //     tempRecIngreds // empty ingredients
  //   );

  let tempRecIngreds = [];

  const recipeName = {
    name: "Recipe name",
    serves: 0,
    type: "Dinner",
    method: "One-pot",
    creator: "Me",
    link: "N/A",
    ingreds: tempRecIngreds,
  };

  replaceTempIngredValues();

  const ingredient = createIngred(
    tempIngredName,
    tempIngredUnit,
    tempIngredQuantity,
    tempIngredCategory,
    tempIngredCost
  );

  tempRecIngreds[ingredient.name] = ingredient;

  addIngredToRecipe(recipeName, ingredient);

  console.log("Recipes:", recipes);
  console.log("Ingredients:", ingreds);

  updateIngredListUI(recipeName);
});
