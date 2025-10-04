// EDIT RECIPE INGREDIENTS
const addRecipeIngredForm = document.getElementById("add-recipe-ingred-form");
const currRecipeIngredList = document.getElementById("edit-recipe-ingred-list");
const addRecipeIngredSubmit = document.querySelector(
  "#add-recipe-ingred-form #submit-btn"
);
// const fallbackRecipe = {
//   creator: "",
//   emoji: "🍽️",
//   favorite: false,
//   ingredients: {},
//   link: "",
//   method: "",
//   name: "",
//   serves: "",
//   time: "",
//   type: ""
// };
let ingred = {};
const savedItems = localStorage.getItem("items");
const items = savedItems ? JSON.parse(savedItems) : {};
const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe ? savedCurrRecipe : "Untitled"; // default if none saved
currRecipe =
  recipes[currRecipe] ||
  alert("To add ingredients, name your recipe by clicking 'Recipe Info'.");
let ingredients = currRecipe.ingredients || {};
let currIngred;
if (recipes[currRecipe.name]) {
  const recipe = recipes[currRecipe.name];

  const recName = recipe.name || "Unknown";
  const recServes = recipe.serves || "Unknown";
  const recTime = recipe.time || "Unknown";
  const recType = recipe.type || "Unknown";
  const recMethod = recipe.method || "Unknown";
  const recCreator = recipe.creator || "Unknown";
  const recLink = recipe.link || "Unknown";
  const recIngreds = recipe.ingredients || {};
}

let recipeNameUI = document.querySelector("#recipe-ingred-info h2 span");
recipeNameUI.textContent = `${recipes[currRecipe.name].emoji} ${
  currRecipe.name
}`;
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
  if (!recIngredNameInput.value) {
    alert("Ingredient must have a name!");
  } else {
    recIngredName = recIngredNameInput.value;
    recIngredQuantity = recIngredQuantityInput.value;
    recIngredUnit = recIngredUnitInput.value;
    recIngredCategory = recIngredCategoryInput.value;
    recIngredCost = recIngredCostInput.value;
  }

  item = {
    emoji: selectedEmoji,
    name: recIngredName,
    unit: recIngredUnit,
    category: recIngredCategory,
    cost: recIngredCost,
  };

  ingred = {
    name: recIngredName,
    quantity: recIngredQuantity,
  };

  if (currIngred) {
    if (currIngred.name !== ingred.name) {
      delete items[currIngred.name];
      delete recipes[currRecipe.name].ingredients[currIngred.name];
    }
  }
  items[item.name] = item;
  recipes[currRecipe.name].ingredients[ingred.name] = ingred;

  updateIngredListUI();

  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("items", JSON.stringify(items));

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
  const recipe = recipes[currRecipe.name]; // get the recipe object

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

//fill info
ingredList.addEventListener("click", (event) => {
  const clickedItem = event.target;

  // Make sure you clicked on an <li>, not the <ul> itself
  if (clickedItem.tagName.toLowerCase() === "li") {
    if (clickedItem.classList.contains("selected-li")) {
      // If already selected, deselect it
      clickedItem.classList.remove("selected-li");
      selectedIngredName = null;
      //clear placeholders
      if (!selectedIngredName) {
        emojiBtn.textContent = "🥕";
        recIngredNameInput.value = "";
        recIngredQuantityInput.value = "";
        recIngredUnitInput.value = "";
        recIngredCategoryInput.value = "";
        recIngredCostInput.value = "";
      }
    } else {
      // Remove .selected-li from all other items
      Array.from(ingredList.children).forEach((li) =>
        li.classList.remove("selected-li")
      );

      // Add .selected-li to the clicked item
      clickedItem.classList.add("selected-li");
      selectedIngredName = clickedItem.textContent;
      currIngred = currRecipe.ingredients[selectedIngredName];

      //fill placeholders, jk make value
      if (selectedIngredName && items[selectedIngredName]) {
        const selectedItem = items[selectedIngredName];
        const selectedIngred =
          recipes[currRecipe.name].ingredients[selectedIngredName];

        emojiBtn.textContent = selectedItem.emoji || "🥕";
        recIngredNameInput.value = selectedItem.name || "";
        recIngredQuantityInput.value = selectedIngred?.quantity || "";
        recIngredUnitInput.value = selectedItem.unit || "";
        recIngredCategoryInput.value = selectedItem.category || "";
        recIngredCostInput.value = selectedItem.cost || "";

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
  if (recipes[currRecipe.name]?.ingredients[selectedIngredName]) {
    delete recipes[currRecipe.name].ingredients[selectedIngredName];

    // Update UI after deletion
    updateIngredListUI();

    // Save updated recipes to localStorage
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
});

//favorite

const favStar = document.getElementById("fav-star");

let recFav = recipes[currRecipe.name].favorite || false;

if (recFav) {
  favStar.classList.add("favorited");
} else {
  favStar.classList.remove("favorited");
}

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  if (currRecipe && recipes[currRecipe.name]) {
    recipes[currRecipe.name].favorite = recFav;
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
});
//item emoji
const emojiBtn = document.getElementById("select-emoji");
let selectedEmoji = "🥕"; // store the chosen emoji
document.addEventListener("DOMContentLoaded", () => {
  const emojiPopup = document.getElementById("emoji-popup");

  // Show popup
  emojiBtn.addEventListener("click", () => {
    emojiPopup.classList.remove("hidden"); // Show the popup
  });

  //close button
  const closeEmojiBtn = document.getElementById("emoji-close");
  closeEmojiBtn.addEventListener("click", () => {
    emojiPopup.classList.add("hidden"); // Show the popup
  });

  const emojiCategoryList = document.querySelectorAll(
    "#emoji-categories ul li"
  );
  const emojiCategories = document.querySelectorAll(".emoji-category");

  const categoryMap = {
    Meals: "meals-category",
    Fruit: "fruit-category",
    Veggies: "veg-category",
    "Dairy/Meat": "dairy-meat",
    "Pantry/Staples": "pantry-staples",
    Other: "other-category",
  };

  emojiCategoryList.forEach((li) => {
    li.addEventListener("click", () => {
      const categoryId = categoryMap[li.textContent.trim()];

      emojiCategories.forEach((ul) => {
        if (ul.id === categoryId) {
          ul.classList.remove("hidden");
        } else {
          ul.classList.add("hidden");
        }
      });
    });
  });

  // Select all emoji items
  const emojiItems = document.querySelectorAll(".emoji-category li");

  emojiItems.forEach((li) => {
    li.addEventListener("click", () => {
      // Remove 'selected' class from all emojis
      emojiItems.forEach((e) => e.classList.remove("selected"));

      // Add 'selected' class to the clicked one
      li.classList.add("selected");

      // Save the clicked emoji
      selectedEmoji = li.textContent;
      console.log("Selected emoji:", selectedEmoji);
    });
  });

  const emojiSaveBtn = document.getElementById("select-emoji-btn");
  // hide popup and change ui
  emojiSaveBtn.addEventListener("click", () => {
    emojiPopup.classList.add("hidden");
    emojiBtn.textContent = selectedEmoji || "🥕";
  });
});

//sort and filter

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
  const recipe = recipes[currRecipe.name];
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
  const recipe = recipes[currRecipe.name];
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
  const recipe = recipes[currRecipe.name];
  currRecipeIngredList.innerHTML = "";
  for (const ingredName in recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredName;
    currRecipeIngredList.appendChild(li);
  }

  const sortOption = e.target.value;

  let sortedIngredients = [];

  if (sortOption === "abc") {
    // Get ingredient names and sort alphabetically
    sortedIngredients = Object.keys(recipe.ingredients).sort();
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
  const recipe = recipes[currRecipe.name];
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

function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("currRecipe");
  localStorage.removeItem("items");
}
