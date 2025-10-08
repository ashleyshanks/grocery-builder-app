//DOC
const actionsBar = document.getElementById("actions-bar");
const actionBarLine1 = document.querySelector("#actions-bar p:nth-of-type(1)");
const actionBarLine2 = document.querySelector("#actions-bar p:nth-of-type(2)");

const addNewBtn = document.getElementById("add-svg");
const ingredForm = document.getElementById("add-item");
const nameSpan = document.querySelector("#add-item h2 span");
const emojiBtn = document.querySelector("#add-item h2 button");
const formName = document.getElementById("ingred-name-input");
const formUnit = document.getElementById("unit-input");
const formCategory = document.getElementById("category-input");
const formCost = document.getElementById("cost-input");
const deleteBtn = document.getElementById("delete-btn");
const viewBtn = document.getElementById("edit-btn");
const ingredList = document.getElementById("ingred-list");
const addPopup = document.getElementById("add-to-shopping-list-popup");
const saveAddBtn = document.getElementById("add-to-list-btn");

const prevPageTab = document.getElementById("prev-page");
const prevText = document.querySelector("#prev-page h1");
const prevPrevPageTab = document.getElementById("prev-prev-page");
const prevPrevText = document.querySelector("#prev-prev-page h1");
const currentPageText = document.querySelector("#current-page h1").textContent;

const pageHistoryMap = {
  editRecipeIngred: { display: "My Recipes", URL: "edit-recipe-ingred.html" },
  editRecipe: { display: "My Recipes", URL: "edit-recipe.html" },
  home: { display: "Home", URL: "index.html" },
  editIngred: { display: "Ingredients", URL: "ingredients-edit.html" },
  viewRecipes: { display: "My Recipes", URL: "my-recipes.html" },
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

//global
let currItem;
let addingNew = false;
let justSavedItem = false;
tabsUI();
populateIngredList(items);

//select item
ingredList.addEventListener("click", (event) => {
  if (Object.keys(items).length === 0) {
    return;
  }
  ingredForm.classList.remove("hidden");
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

  populateIngredForm();
});

//functions

function autoSelect() {
  if (Object.keys(items).length === 0) {
    return;
  }

  if (justSavedItem) {
    // Grab all <li> elements
    const allLi = ingredList.querySelectorAll("li");
    if (!allLi.length) return; // nothing to select

    // Remove any previous selection
    const prev = ingredList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select the last one
    const lastLi = allLi[allLi.length - 1];
    lastLi.classList.add("selected-li");

    currItem = lastLi.textContent.trim();
  } else {
    // Grab the first <li> inside the menuList
    const firstLi = ingredList.querySelector("li");

    if (!firstLi) return; // nothing to select

    // Remove any previous selection
    const prev = ingredList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select the new one
    firstLi.classList.add("selected-li");
    currItem = firstLi.textContent.trim();
  }
  //get name - emoji
  currItem = currItem
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .trim();
  currItem = items[currItem];
  populateIngredForm();
  //   return currItem;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function populateIngredList(items) {
  console.log("populating", items);
  if (Object.keys(items).length === 0) {
    ingredList.innerHTML = "<ul><li>No ingredients added yet.<li><ul>";
    hideEmptyListActions();
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
    autoSelect();
  }
}

//fill values
function populateIngredForm() {
  let item = items[currItem.name];
  let displayEmoji = item.emoji && item.emoji.trim() !== "" ? item.emoji : "🥕";
  nameSpan.textContent = item.name;
  emojiBtn.textContent = displayEmoji;
  formName.value = item.name;
  formCategory.value = item.category;
  formCost.value = item.cost;

  hideEmptyListActions();
}

//delete popup
const deleteConfirmPopup = document.getElementById("delete-confirm-popup");
const usedInUl = document.getElementById("used-in");
const confirmDeleteBtn = document.getElementById("confirm-delete-button");
const cancelDeleteBtn = document.getElementById("cancel-delete-button");
const closeDeletePopupBtn = document.getElementById("delete-confirm-close");
deleteBtn.addEventListener("click", () => {
  let confirmedDelete = false;
  console.log(currItem);
  deleteConfirmPopup.classList.remove("hidden");

  let usedInArray = createUsedInArray(currItem.name);
  usedInUl.innerHTML = "";

  if (usedInArray.length === 0) {
    // If empty, replace the UL with a P
    const msg = document.createElement("p");
    msg.textContent = "This item is not used in any recipes.";
    usedInUl.replaceWith(msg);
  } else {
    // Fill the UL with list items
    usedInArray.forEach((recipeName) => {
      const li = document.createElement("li");
      li.textContent = recipeName;
      usedInUl.appendChild(li);
    });
  }
});

confirmDeleteBtn.addEventListener("click", () => {
  delete items[currItem.name];

  // 2️⃣ Delete from recipes' ingredients
  for (const recipe of Object.values(recipes)) {
    if (recipe.ingredients && recipe.ingredients[currItem.name]) {
      delete recipe.ingredients[currItem.name];
    }
  }
  console.log("Deleted from recipes' ingredients:", recipes);
  populateIngredList(items);
  deleteConfirmPopup.classList.add("hidden");

  //save
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("recipes", JSON.stringify(recipes));
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteConfirmPopup.classList.add("hidden");
});

closeDeletePopupBtn.addEventListener("click", () => {
  deleteConfirmPopup.classList.add("hidden");
});
//end of delete popup

//save form
const saveBtn = document.getElementById("submit-btn");
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  saveForm();
});

function saveForm() {
  if (formName.value == "") {
    alert("You must enter an ingredient name. (:");
    return;
  }

  let name = formName.value;
  let category = formCategory.value;
  let unit = formUnit.value;
  let cost = formCost.value;
  let emoji = emojiBtn.textContent;

  let newItem = {
    name: name,
    unit: unit,
    category: category,
    cost: cost,
    emoji: emoji,
  };

  if (!addingNew) {
    // Editing existing item → delete old currItem first if name changed
    if (currItem && currItem.name && currItem.name !== name) {
      delete items[currItem.name];
    }
  }

  // add it to the object
  items[newItem.name] = newItem;
  justSavedItem = true;
  //save
  localStorage.setItem("items", JSON.stringify(items));

  populateIngredList(items);
  populateIngredForm();
}

//close form
const closeInfoBtn = document.getElementById("info-close-btn");
closeInfoBtn.addEventListener("click", () => {
  ingredForm.classList.add("hidden");
  ingredList.classList.remove("info-shown");

  const selected = ingredList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current item?
});

//open popup add item
//save + addToList
const addQuantity = document.getElementById("popup-quantity");
const addUnit = document.getElementById("popup-unit");
const addListItemBtn = document.getElementById("add-to-list-btn");
addListItemBtn.addEventListener("click", () => {
  console.log("before adding: shopping list is");
  console.log(shoppingList);
  addPopup.classList.remove("hidden");
  addUnit.value = "";
  addQuantity.value = "";
  if (addUnit.value == "") {
    addUnit.value = formUnit.value;
  }
});

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
  //save
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

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

//save popup info
const savePopupBtn = document.getElementById("save-popup");
savePopupBtn.addEventListener("click", () => {
  let unit = addUnit.value;
  let quantity = addQuantity.value;
  if (quantity == "") {
    alert("You must enter a quantity!");
    return;
  }
  if (quantity !== "") {
    console.log("currItem is ", currItem);
    //testing
    console.log("formName.value is", formName.value);
    saveForm();
    currItem = items[formName.value];
    addToShoppingList(currItem.name, quantity, unit);
    console.log("items are now");
    console.log(items);
    addPopup.classList.add("hidden");
  }
});
//close popup add item
const closePopupBtn = document.getElementById("add-close");
closePopupBtn.addEventListener("click", () => {
  addPopup.classList.add("hidden");
});

addNewBtn.addEventListener("click", () => {
  addingNew = true;
  hideEmptyListActions(addingNew);
  addNew();
});
function addNew() {
  //clear placeholders and change emoji/span
  nameSpan.textContent = "Adding Ingredient";
  emojiBtn.textContent = "🥕";
  formCategory.value = "";
  formCost.value = "";
  formName.value = "";
  formUnit.value = "";
}

// center items when only 1 child is visible
function hideEmptyListActions(addingNew = false) {
  if (Object.keys(items).length === 0 || addingNew) {
    viewBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    actionBarLine1.classList.add("hidden");
    actionBarLine2.classList.add("hidden");
    saveAddBtn.textContent = "Save + Add to Shopping List";
  } else {
    viewBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    actionBarLine1.classList.remove("hidden");
    actionBarLine2.classList.remove("hidden");
    saveAddBtn.textContent = "Add to List";
  }
  updateActionsBarLayout();
}

function updateActionsBarLayout() {
  const children = Array.from(actionsBar.children);

  const hiddenCount = children.filter((child) =>
    child.classList.contains("hidden")
  ).length;
  const visibleCount = children.length - hiddenCount;

  if (visibleCount <= 1) {
    actionsBar.style.justifyContent = "center";
  } else {
    actionsBar.style.justifyContent = "space-between";
  }
}

//emoji popup
//choose emoji-----------------------------
let selectedEmoji = "🥄"; // store the chosen emoji
document.addEventListener("DOMContentLoaded", () => {
  const emojiBtn = document.getElementById("select-emoji");
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
    });
  });

  const emojiSaveBtn = document.getElementById("select-emoji-btn");
  // hide popup and change ui
  emojiSaveBtn.addEventListener("click", () => {
    emojiPopup.classList.add("hidden");
    emojiBtn.textContent = selectedEmoji || "🥕";
  });
});

function savePages(currentPage) {
  // Move prevPage to prevPrevPage
  pageHistory.prevPrevPage = pageHistory.prevPage || "No page";

  // Set prevPage to the page we’re leaving
  pageHistory.prevPage = currentPage || "No page";

  localStorage.setItem("pageHistory", JSON.stringify(pageHistory));
}

function tabsUI() {
  // If both tabs are hidden, do nothing
  if (
    prevPageTab.classList.contains("hidden") &&
    prevPrevPageTab.classList.contains("hidden")
  ) {
    return;
  }

  // Set prevPage tab
  if (
    pageHistory.prevPage &&
    pageHistoryMap[pageHistory.prevPage] &&
    pageHistoryMap[pageHistory.prevPage].display != currentPageText
  ) {
    prevText.textContent = pageHistoryMap[pageHistory.prevPage].display;
    prevPageTab.classList.remove("hidden");
  } else {
    prevPageTab.classList.add("hidden");
  }

  // Set prevPrevPage tab
  if (
    pageHistory.prevPrevPage &&
    pageHistoryMap[pageHistory.prevPrevPage] &&
    pageHistoryMap[pageHistory.prevPrevPage].display != currentPageText &&
    pageHistoryMap[pageHistory.prevPage] !=
      pageHistoryMap[pageHistory.prevPrevPage]
  ) {
    prevPrevText.textContent = pageHistoryMap[pageHistory.prevPrevPage].display;
    prevPrevPageTab.classList.remove("hidden");
  } else {
    prevPrevPageTab.classList.add("hidden");
  }
}

// Click for previous-previous page tab
prevPrevPageTab.addEventListener("click", () => {
  const prevPrevKey = pageHistory.prevPrevPage;
  if (prevPrevKey && pageHistoryMap[prevPrevKey]) {
    const url = pageHistoryMap[prevPrevKey].URL;
    savePages("home");
    window.location.href = url;
  }
});

function saveAllData() {
  localStorage.setItem("menu", JSON.stringify(menu));
  console.log(menu);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  console.log(recipes);
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  console.log(shoppingList);
  localStorage.setItem("items", JSON.stringify(items));
  console.log(items);
}

function clearData() {
  localStorage.removeItem("menu");
  localStorage.removeItem("recipes");
  localStorage.removeItem("shoppingList");
  localStorage.removeItem("items");
  localStorage.removeItem("pageHistory");

  console.log("Data cleared from memory and localStorage.");
}

function loadPageHistory() {
  const storedPageHistory = localStorage.getItem("pageHistory");
  console.log("load page function: storedPageHistory: ", storedPageHistory);

  // If found, parse it; otherwise, use default fallback
  const pageHistory = storedPageHistory
    ? JSON.parse(storedPageHistory)
    : {
        prevPrevPage: "No page",
        prevPage: "No page",
        currentPage: "No page",
      };

  return pageHistory;
}

//WIP wip
//when using add to list button for new item
//add unit from popup if the unit was not entered in the form

//view button needs to save currItem
