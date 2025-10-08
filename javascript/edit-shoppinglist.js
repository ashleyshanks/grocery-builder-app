const ingredList = document.getElementById("shopping-list");
const ingredInfo = document.getElementById("add-item-shop");
const ingredName = document.querySelector("#add-item-shop h2");
const ingredFormName = document.getElementById("ingred-name-input");
const ingredCost = document.getElementById("cost-input");
const ingredQuantity = document.getElementById("quantity-input");
const ingredUnit = document.getElementById("unit-input");
const ingredCategory = document.getElementById("category-input");
const saveBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const currentPageText = document.querySelector("#current-page h1").textContent;
const prevPageTab = document.getElementById("prev-page");
const prevText = document.querySelector("#prev-page h1");
const prevPrevPageTab = document.getElementById("prev-prev-page");
const prevPrevText = document.querySelector("#prev-prev-page h1");

const pageHistoryMap = {
  editRecipeIngred: { display: "Edit Recipe", URL: "edit-recipe-ingred.html" },
  editRecipe: { display: "Edit Recipe", URL: "edit-recipe.html" },
  home: { display: "Home", URL: "index.html" },
  viewRecipes: { display: "My Recipes", URL: "my-recipes.html" },
  editIngred: { display: "Edit Ingredients", URL: "ingredients-edit.html" },
  viewIngred: { display: "Ingredients", URL: "ingredients.html" },
  viewMenu: { display: "My Menu", URL: "my-menu.html" },
  editMenu: { display: "Edit Menu", URL: "my-menu-edit.html" },
  viewList: { display: "Shopping List", URL: "shopping-list.html" },
  editList: { display: "Edit List", URL: "shopping-list-add.html" },
};
const storedMenu = localStorage.getItem("menu");
const storedRecipes = localStorage.getItem("recipes");
const storedShoppingList = localStorage.getItem("shoppingList");
const storedItems = localStorage.getItem("items");

// Parse each if it exists, or fall back to an empty object
const menu = storedMenu ? JSON.parse(storedMenu) : {};
const recipes = storedRecipes ? JSON.parse(storedRecipes) : {};
const shoppingList = storedShoppingList ? JSON.parse(storedShoppingList) : {};
const items = storedItems ? JSON.parse(storedItems) : {};
//wip load current item
let pageHistory = loadPageHistory();

populateIngredList(shoppingList);
let currItem;
autoSelect();

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

  populateIngredForm(currItem);
});

function autoSelect() {
  if (Object.keys(shoppingList).length === 0) {
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
  currItem = shoppingList[currItem];
  populateIngredForm(currItem);
  console.log("auto selected ", currItem);
  //   return currItem;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function populateIngredList(shoppingList) {
  if (!shoppingList || Object.keys(shoppingList).length === 0) {
    ingredList.innerHTML =
      "<ul><li>Nothing added yet. Add recipes to your menu.</li></ul>";
    return;
  }

  // Clear existing content
  ingredList.innerHTML = "";

  // Create main list container
  const ul = document.createElement("ul");

  for (const [ingredientName, data] of Object.entries(shoppingList)) {
    const li = document.createElement("li");

    // Create checkbox div
    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    // Default emoji (you can assign by category later if you want)
    const emoji = "🥕";

    // Example display: 🥕 Potato — used in: potato soup, potato salad
    const text = document.createTextNode(` ${emoji} ${data.name}`);

    // Build list item
    li.appendChild(checkbox);
    li.appendChild(text);
    ul.appendChild(li);

    checkbox.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent li click from firing
      checkbox.classList.toggle("checked"); // toggle checkmark
      li.classList.toggle("checked"); // optional: strike-through li
    });

    // Clickable checklist toggle
    li.addEventListener("click", () => {
      li.classList.toggle("checked");
    });
  }

  // Add to section
  ingredList.appendChild(ul);

  // Optional footer total
  const totalDiv = document.createElement("div");
  totalDiv.id = "list-total";
  totalDiv.in;
}

// const ingredName = document.querySelector("#add-item-shop h2");
// const ingredCost = document.getElementById("cost-input");
// const ingredQuantity = document.getElementById("quantity-input");
// const ingredUnit = document.getElementById("unit-input");
// const ingredCategory = document.getElementById("category-input");
function populateIngredForm(item) {
  item = items[item.name];
  console.log(item);
  let displayEmoji = item.emoji && item.emoji.trim() !== "" ? item.emoji : "🥕";
  ingredName.textContent = `${displayEmoji} ${item.name}`;
  ingredFormName.value = item.name;
  ingredCost.value = item.cost ? item.cost : "";
  console.log("item.quantity  is", item.quantity);
  ingredQuantity.value = calculateTotalQuantity(item);
  ingredUnit.value = item.unit ? item.unit : "";
  ingredCategory.value = item.category ? item.category : "";
}

function createUsedInArray(item) {
  // Check if the item exists and has a quantityUnit object
  item = shoppingList[item];
  console.log("createArray: item.quantityUnit is", item.quantityUnit);
  if (!item || !item.quantityUnit) return [];

  // Return an array of the recipe names (keys)
  console.log("createdArray: returning ", Object.keys(item.quantityUnit));
  return Object.keys(item.quantityUnit);
}

function calculateTotalQuantity(item) {
  console.log("item.name is ", item.name);
  console.log("shoppingList[item.name] is", shoppingList[item.name]);
  const quantityUnit = shoppingList[item.name].quantityUnit;

  let total = 0;

  for (const info of Object.values(quantityUnit)) {
    let q = info.quantity;

    // Convert "1/2" style strings to numbers
    if (typeof q === "string" && q.includes("/")) {
      const [num, denom] = q.split("/").map(Number);
      q = num / denom;
    } else {
      q = Number(q);
    }

    // Add if it's a valid number
    if (!isNaN(q)) total += q;
  }

  return total;
}

function savePages(currentPage) {
  // Move prevPage to prevPrevPage
  pageHistory.prevPrevPage = pageHistory.prevPage || "No page";

  // Set prevPage to the page we’re leaving
  pageHistory.prevPage = currentPage || "No page";

  localStorage.setItem("pageHistory", JSON.stringify(pageHistory));
}

// savePages("My Recipes");

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

const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  savePages("viewMenu");
});

prevPageTab.addEventListener("click", () => {
  const prevKey = pageHistory.prevPage;
  if (prevKey && pageHistoryMap[prevKey]) {
    const url = pageHistoryMap[prevKey].URL;
    savePages("viewMenu");
    window.location.href = url; // navigate to the URL
  }
});

// Click for previous-previous page tab
prevPrevPageTab.addEventListener("click", () => {
  const prevPrevKey = pageHistory.prevPrevPage;
  if (prevPrevKey && pageHistoryMap[prevPrevKey]) {
    const url = pageHistoryMap[prevPrevKey].URL;
    savePages("viewMenu");
    window.location.href = url; // navigate to the URL
  }
});

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

  console.log("load page function: pageHistory:", pageHistory);

  return pageHistory;
}

//WIP save checkboxes + save everything
