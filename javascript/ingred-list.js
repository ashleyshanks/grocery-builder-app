//DOC
const ingredInfo = document.getElementById("ingred-info");
const ingredList = document.getElementById("ingred-list");
const addPopup = document.getElementById("add-to-shopping-list-popup");
const currentPageText = document.querySelector("#current-page h1").textContent;
const prevPageTab = document.getElementById("prev-page");
const prevText = document.querySelector("#prev-page h1");
const prevPrevPageTab = document.getElementById("prev-prev-page");
const prevPrevText = document.querySelector("#prev-prev-page h1");

const pageHistoryMap = {
  editRecipeIngred: { display: "My Recipes", URL: "edit-recipe-ingred.html" },
  editRecipe: { display: "My Recipes", URL: "edit-recipe.html" },
  home: { display: "Home", URL: "index.html" },
  viewRecipes: { display: "My Recipes", URL: "my-recipes.html" },
  editIngred: { display: "Ingredients", URL: "ingredients-edit.html" },
  viewIngred: { display: "Ingredients", URL: "ingredients.html" },
  viewMenu: { display: "My Menu", URL: "my-menu.html" },
  editMenu: { display: "My Menu", URL: "my-menu-edit.html" },
  viewList: { display: "Shopping List", URL: "shopping-list.html" },
  editList: { display: "Shopping List", URL: "shopping-list-add.html" },
};

//loading
const savedItems = localStorage.getItem("items");
const items = savedItems ? JSON.parse(savedItems) : {};
const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
const savedShoppingList = localStorage.getItem("shoppingList");
const shoppingList = savedRecipes ? JSON.parse(savedShoppingList) : {};
let pageHistory = loadPageHistory();

tabsUI();
populateIngredList(items);
let currItem;
autoSelect();

//select item
ingredList.addEventListener("click", (event) => {
  if (Object.keys(items).length === 0) {
    return;
  }
  console.log("manually selected ", currItem);
  ingredInfo.classList.remove("hidden");
  ingredList.classList.add("info-shown");
  closeInfoBtn.classList.remove("hidden");
  const clickedLi = event.target.closest("li");
  if (!clickedLi || !ingredList.contains(clickedLi)) return;

  //get name - emoji
  currItem = clickedLi.textContent;
  currItem = currItem
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .trim();
  currItem = items[currItem];

  // Optional: single selection highlight
  const prev = ingredList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");
  clickedLi.classList.add("selected-li");

  populateIngredInfo(currItem);
});

//functions

function autoSelect() {
  if (Object.keys(items).length === 0) {
    return;
  }
  // Grab the first <li> inside the menuList
  const firstLi = ingredList.querySelector("li");

  if (!firstLi) return; // nothing to select

  // Remove any previous selection
  const prev = ingredList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");

  // Select the new one
  firstLi.classList.add("selected-li");
  currItem = firstLi.textContent.trim();
  //get name - emoji
  currItem = currItem
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .trim();
  currItem = items[currItem];
  populateIngredInfo(currItem);
  console.log("auto selected ", currItem);
  //   return currItem;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function populateIngredList(items) {
  if (Object.keys(items).length === 0) {
    ingredList.innerHTML = "<ul><li>No ingredients added yet.<li><ul>";
    return;
  }
  // Clear existing content
  ingredList.innerHTML = "";

  // Group items by category
  const categories = {};
  for (const item of Object.values(items)) {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  }

  // Loop through categories and create DOM elements
  for (const category in categories) {
    // Create and append category header
    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = capitalize(category);
    ingredList.appendChild(categoryHeader);

    // Create ul for this category
    const ul = document.createElement("ul");

    // Add each item as li
    categories[category].forEach((item) => {
      const li = document.createElement("li");
      let displayEmoji =
        item.emoji && item.emoji.trim() !== "" ? item.emoji : "🥕";
      li.textContent = `${displayEmoji} ${item.name}`;
      ul.appendChild(li);
    });

    // Append ul to the list
    ingredList.appendChild(ul);
  }
}

function populateIngredInfo(item) {
  // Populate H2
  const ingredName = document.getElementById("ingred-name");
  //   const costLabel = document.getElementById("cost-label");
  const ingredCost = document.getElementById("ingred-cost");
  const unitLabel = document.getElementById("unit-label");
  const ingredUnit = document.getElementById("unit");
  const categoryLabel = document.getElementById("category-label");
  const ingredCategory = document.getElementById("category");
  const usedInList = document.getElementById("needed-for-list");

  //if info does not exist, remove from UI
  ingredCost.classList.toggle("hidden", !item.cost);

  unitLabel.classList.toggle("hidden", !item.unit);
  ingredUnit.classList.toggle("hidden", !item.unit);

  categoryLabel.classList.toggle("hidden", !item.category);
  ingredCategory.classList.toggle("hidden", !item.category);

  // Populate definition list
  let displayEmoji = item.emoji && item.emoji.trim() !== "" ? item.emoji : "🥕";
  ingredName.textContent = `${displayEmoji} ${item.name}`;
  if (item.cost !== "" && item.cost != null) {
    ingredCost.textContent = `$${item.cost.toFixed(2)}`;
  }

  if (item.unit !== "" && item.unit != null) {
    ingredUnit.textContent = capitalize(item.unit);
  }

  if (item.category !== "" && item.category != null) {
    ingredCategory.textContent = capitalize(item.category);
  }

  // Populate "Used In" list
  usedInList.innerHTML = ""; // Clear previous content
  usedInArray = createUsedInArray(item.name);
  usedInArray.forEach((recipeName) => {
    const li = document.createElement("li");
    li.textContent = recipeName;
    usedInList.appendChild(li);
  });
  //clear array
  usedInArray = [];
}
//delete item
const deleteBtn = document.getElementById("delete-btn");
//WIP wip add confirm ON edit-ingred
console.log("before delete", currItem);
deleteBtn.addEventListener("click", () => {
  //   console.log("items before delete");
  //   console.log(items);
  //   console.log("deleting ", currItem);
  delete items[currItem.name];
  //   console.log("items after delete");
  //   console.log(items);
  localStorage.setItem("items", JSON.stringify(items));
});

//close recipe info
const closeInfoBtn = document.getElementById("info-close-btn");
closeInfoBtn.addEventListener("click", () => {
  ingredInfo.classList.add("hidden");
  ingredList.classList.remove("info-shown");

  const selected = ingredList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current item?
});

//open popup add item
const addQuantity = document.getElementById("popup-quantity");
const addUnit = document.getElementById("popup-unit");
const addListItemBtn = document.getElementById("add-to-list-btn");
addListItemBtn.addEventListener("click", () => {
  addPopup.classList.remove("hidden");
  addUnit.value = "";
  addQuantity.value = "";
  if (currItem.unit !== "") {
    addUnit.value = currItem.unit;
  }
});
//save popup info
const savePopupBtn = document.getElementById("save-popup");
savePopupBtn.addEventListener("click", () => {
  let unit = addUnit.value;
  let quantity = addQuantity.value;
  if (quantity == "") {
    alert("You must enter a quantity!");
    return;
  }
  console.log("unit is", unit);
  console.log("quantity is", quantity);
  if (quantity !== "") {
    addToShoppingList(currItem.name, quantity, unit);
    addPopup.classList.add("hidden");
  }
});
//close popup add item
const closePopupBtn = document.getElementById("add-close");
closePopupBtn.addEventListener("click", () => {
  addPopup.classList.add("hidden");
});

function createUsedInArray(item) {
  let usedInArray = [];
  for (const recipeName in recipes) {
    const recipe = recipes[recipeName];

    // Check if recipe.ingredients contains currIngred
    if (recipe.ingredients.hasOwnProperty(item)) {
      usedInArray.push(recipe.name); // add recipe name to array
    }
  }

  return usedInArray;
}

function addToShoppingList(ingredName, quantity, unit) {
  const recipeName = "unknown"; // placeholder

  // If the ingredient does not exist, create it
  if (!shoppingList[ingredName]) {
    shoppingList[ingredName] = {
      name: ingredName,
      quantityUnit: {},
    };
  }

  // Generate a unique key under "unknown" to avoid overwriting
  let entryKey = recipeName;
  let counter = 1;
  while (shoppingList[ingredName].quantityUnit[entryKey]) {
    entryKey = `${recipeName}-${counter}`;
    counter++;
  }

  // Add the new quantity/unit entry
  shoppingList[ingredName].quantityUnit[entryKey] = {
    quantity: quantity,
    unit: unit,
  };

  console.log("after adding: shopping list is");
  console.log(shoppingList);
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

//wip WIP when deleting item, alert it will delete
//from recipes used in too then do that
