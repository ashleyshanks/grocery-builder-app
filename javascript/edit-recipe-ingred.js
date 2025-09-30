// EDIT RECIPE INGREDIENTS
const addRecipeIngredForm = document.getElementById("add-recipe-ingred-form");
const currRecipeIngredList = document.getElementById("edit-recipe-ingred-list");
const addRecipeIngredSubmit = document.querySelector(
  "#add-recipe-ingred-form #submit-btn"
);
const ingreds = {};
let ingred = {};

const savedItems = localStorage.getItem("items");
const items = savedItems ? JSON.parse(savedItems) : {};
const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe ? savedCurrRecipe : "Untitled"; // default if none saved
if (recipes[currRecipe]) {
  const recipe = recipes[currRecipe];

  const recName = recipe.name || "Unknown";
  const recServes = recipe.serves || "Unknown";
  const recTime = recipe.time || "Unknown";
  const recType = recipe.type || "Unknown";
  const recMethod = recipe.method || "Unknown";
  const recCreator = recipe.creator || "Unknown";
  const recLink = recipe.link || "Unknown";
  const recIngreds = recipe.ingredients || {};
}

let recipeNameUI = document.querySelector("#edit-recipe-ingred h2 span");
recipeNameUI.textContent = `${recipes[currRecipe].emoji} ${currRecipe}`;
updateIngredListUI();

//DOM SELECTORS FOR FORM INPUT
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

let recIngredName = "";
let recIngredQuantity = "";
let recIngredUnit = "";
let recIngredCategory = "";
let recIngredCost = "";

const editRecipeBtn = document.querySelector("#add-item #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  recIngredNameInput.value && (recIngredName = recIngredNameInput.value);
  recIngredQuantityInput.value &&
    (recIngredQuantity = recIngredQuantityInput.value);
  recIngredUnitInput.value && (recIngredUnit = recIngredUnitInput.value);
  recIngredCategoryInput.value &&
    (recIngredCategory = recIngredCategoryInput.value);
  recIngredCostInput.value && (recIngredCost = recIngredCostInput.value);

  console.log("recIngredQuantityInput.value 2", recIngredQuantityInput.value);

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

  ingreds[ingred.name] = ingred;
  items[item.name] = item;
  recipes[currRecipe].ingredients[ingred.name] = ingred;

  console.log("Recipes map:");
  console.log(recipes);

  updateIngredListUI();

  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("items", JSON.stringify(items));

  console.log("ingred...", ingred);
  console.log("item...", item);
  console.log("Saved!");

  // Optional: clear form values
  recIngredNameInput.value = "";
  recIngredQuantityInput.value = "";
  recIngredUnitInput.value = "";
  recIngredCategoryInput.value = "";
  recIngredCostInput.value = "";

  // Optional: clear placeholders
  recIngredNameInput.placeholder = "";
  recIngredQuantityInput.placeholder = "";
  recIngredUnitInput.value = "";
  recIngredCategoryInput.value = "";
  recIngredCostInput.placeholder = "";
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

//SELECT LI
const ingredList = document.getElementById("edit-recipe-ingred-list");

let selectedIngredName = null; // global variable to store selection

ingredList.addEventListener("click", (event) => {
  const clickedItem = event.target;

  // Make sure you clicked on an <li>, not the <ul> itself
  if (clickedItem.tagName.toLowerCase() === "li") {
    if (clickedItem.classList.contains("selected-li")) {
      // If already selected, deselect it
      clickedItem.classList.remove("selected-li");
      selectedIngredName = null;
      console.log("Deselected ingredient");
      //clear placeholders
      if (!selectedIngredName) {
        recIngredNameInput.placeholder = "";
        recIngredQuantityInput.placeholder = "";
        recIngredUnitInput.value = "";
        recIngredCategoryInput.value = "";
        recIngredCostInput.placeholder = "";
      }
    } else {
      // Remove .selected-li from all other items
      Array.from(ingredList.children).forEach((li) =>
        li.classList.remove("selected-li")
      );

      // Add .selected-li to the clicked item
      clickedItem.classList.add("selected-li");
      selectedIngredName = clickedItem.textContent;

      //fill placeholders
      if (selectedIngredName && items[selectedIngredName]) {
        const selectedItem = items[selectedIngredName];
        const selectedIngred =
          recipes[currRecipe].ingredients[selectedIngredName];

        recIngredNameInput.placeholder = selectedItem.name || "";
        recIngredQuantityInput.placeholder = selectedIngred?.quantity || "";
        recIngredUnitInput.value = selectedItem.unit || "";
        recIngredCategoryInput.value = selectedItem.category || "";
        recIngredCostInput.placeholder = selectedItem.cost || "";

        //fill values
        recIngredName =
          recIngredNameInput.value || recIngredNameInput.placeholder;
        recIngredQuantity =
          recIngredQuantityInput.value || recIngredQuantityInput.placeholder;
        recIngredUnit = recIngredUnitInput.value;
        recIngredCategory = recIngredCategoryInput.value;
        recIngredCost =
          recIngredCostInput.value || recIngredCostInput.placeholder;
      }
    }
  }
});

const deleteBtn = document.getElementById("delete-svg");

deleteBtn.addEventListener("click", () => {
  if (!selectedIngredName) return; // nothing selected

  // Example: deleting from recipes
  if (recipes[currRecipe]?.ingredients[selectedIngredName]) {
    delete recipes[currRecipe].ingredients[selectedIngredName];
    console.log(`${selectedIngredName} deleted from ${currRecipe}`);

    // Update UI after deletion
    updateIngredListUI();

    // Save updated recipes to localStorage
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
});

//favorite

const favStar = document.getElementById("fav-star");

let recFav = recipes[currRecipe].favorite || false;

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

//filter popup

const filterSvg = document.getElementById("filter-svg");
const filterSelect = document.getElementById("filter-category");
const filterPopup = document.getElementById("filter-popup");

// Toggle popup on click
filterSvg.addEventListener("click", () => {
  filterPopup.classList.toggle("hidden");
});

// Close popup with X
const filterClose = document.getElementById("filter-close");
filterClose.addEventListener("click", () => {
  filterPopup.classList.add("hidden");
});

// Apply filter
filterSelect.addEventListener("change", (e) => {
  const category = e.target.value;

  // Toggle .selected-svg class on #filter-svg
  if (category) {
    filterSvg.classList.add("selected-svg");
  } else {
    filterSvg.classList.remove("selected-svg");
  }

  const listEl = document.getElementById("edit-recipe-ingred-list");
  const recipe = recipes[currRecipe];
  if (!recipe) return;

  listEl.innerHTML = "";

  // Filter ingredient list
  for (const ingredName in recipe.ingredients) {
    // Get the full item object from the items map
    const itemObj = items[ingredName];
    // items[selectedIngredName].category
    if (!itemObj) continue; // skip if item not found

    // Only add the ingredient if category matches or no filter selected
    if (!category || itemObj.category === category) {
      const li = document.createElement("li");
      li.textContent = ingredName;
      listEl.appendChild(li);
    }
  }
});

const filterClearBtn = document.querySelector("#filter-popup #clear-btn");

filterClearBtn.addEventListener("click", () => {
  // Reset the dropdown
  filterSelect.value = "";

  filterSvg.classList.remove("selected-svg");

  // Show all ingredients
  const listEl = document.getElementById("edit-recipe-ingred-list");
  const recipe = recipes[currRecipe];
  if (!recipe) return;

  listEl.innerHTML = "";

  for (const ingredName in recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredName;
    listEl.appendChild(li);
  }

  // Optional: close the filter popup
  const filterPopup = document.getElementById("filter-popup");
  filterPopup.classList.add("hidden");
});

//SORT OPTIONS
const sortSvg = document.getElementById("sort-svg");
const sortPopup = document.getElementById("sort-popup");

// Toggle popup on click
sortSvg.addEventListener("click", () => {
  sortPopup.classList.toggle("hidden");
});

// Close popup with X
const sortCloseBtn = document.getElementById("sort-close");
sortCloseBtn.addEventListener("click", () => {
  sortPopup.classList.add("hidden");
});

const sortSelect = document.getElementById("sort-category");
sortSelect.addEventListener("change", (e) => {
  // Render ingredients ?
  const recipe = recipes[currRecipe];
  currRecipeIngredList.innerHTML = "";
  for (const ingredName in recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredName;
    currRecipeIngredList.appendChild(li);
  }

  const sortOption = e.target.value;
  console.log("sortOption: ", sortOption);

  let sortedIngredients = [];

  if (sortOption === "abc") {
    // Get ingredient names and sort alphabetically
    sortedIngredients = Object.keys(recipe.ingredients).sort();
    console.log("sortedIngredients", sortedIngredients);
  }
  //wip sort by category
  if (sortOption === "category") {
    const order = [
      "produce",
      "meat",
      "dairy",
      "cold",
      "frozen",
      "bakery",
      "pantry",
      "other",
    ];
    sortedIngredients = Object.keys(recipe.ingredients).sort(
      (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
    );
    console.log("sortedIngredients", sortedIngredients);
  }

  //displaying sorted list
  currRecipeIngredList.innerHTML = "";
  sortedIngredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    currRecipeIngredList.appendChild(li);
  });
});
// } else if (type === "category") {
//   const order = [
//     "produce",
//     "meat",
//     "dairy",
//     "cold",
//     "frozen",
//     "bakery",
//     "pantry",
//     "other",
//   ];
//   recipeIngredients.sort(
//     (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
//   );
// } else if (type === "recent") {
//   recipeIngredients.sort((a, b) => new Date(b.added) - new Date(a.added));
// }

// Sort option click wip
//   document.querySelectorAll(".sort-options li").forEach((li) => {
//     li.addEventListener("click", () => {
//       //testing
//       if (type === "abc") {
//         recipeIngredients.sort((a, b) => a.name.localeCompare(b.name));
//       } else if (type === "category") {
//         const order = [
//           "produce",
//           "meat",
//           "dairy",
//           "cold",
//           "frozen",
//           "bakery",
//           "pantry",
//           "other",
//         ];
//         recipeIngredients.sort(
//           (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
//         );
//       } else if (type === "recent") {
//         recipeIngredients.sort((a, b) => new Date(b.added) - new Date(a.added));
//       }
//       renderIngredients(recipeIngredients);
//       popup.style.display = "none";
//     });
//   });
// });

const sortClearBtn = document.querySelector("#sort-popup #clear-btn");
sortClearBtn.addEventListener("click", () => {
  // Reset the dropdown
  sortSelect.value = "";

  sortSvg.classList.remove("selected-svg");

  // Show all ingredients
  const listEl = document.getElementById("edit-recipe-ingred-list");
  const recipe = recipes[currRecipe];
  if (!recipe) return;

  listEl.innerHTML = "";

  for (const ingredName in recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredName;
    listEl.appendChild(li);
  }

  // Optional: close the filter popup
  const sortPopup = document.getElementById("filter-popup");
  sortPopup.classList.add("hidden");
});
