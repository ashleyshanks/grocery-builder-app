const ingredList = document.getElementById("shopping-list");
const closeInfoBtn = document.getElementById("info-close-btn");
const ingredInfo = document.getElementById("item-info");
const ingredName = document.querySelector("#item-info h2");
const ingredCost = document.getElementById("cost");
const ingredQuantity = document.getElementById("quantity");
const usedInLabel = document.querySelector("#item-info h3");
const usedInList = document.getElementById("need-for-list");
const deleteBtn = document.getElementById("delete-item-btn");
const editBtn = document.getElementById("edit-item-btn");
const totalQuantity = document.getElementById("quantity");
const complexQuantityList = document.getElementById("complex-quantity");

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

let checkedState = JSON.parse(localStorage.getItem("checkedState")) || {};

const storedMenu = localStorage.getItem("menu");
const storedRecipes = localStorage.getItem("recipes");
const storedShoppingList = localStorage.getItem("shoppingList");
const storedItems = localStorage.getItem("items");

// Parse each if it exists, or fall back to an empty object
const menu = storedMenu ? JSON.parse(storedMenu) : {};
const recipes = storedRecipes ? JSON.parse(storedRecipes) : {};
const shoppingList = storedShoppingList ? JSON.parse(storedShoppingList) : {};
const items = storedItems ? JSON.parse(storedItems) : {};
let pageHistory = loadPageHistory();

let simpleQuantity = false;
let currItem;

// if (!localStorage.getItem("pageHistoryInitialized")) {
//   savePages("viewList");
//   localStorage.setItem("pageHistoryInitialized", "true");
// }
tabsUI();
populateIngredList(shoppingList);
autoSelect();

ingredList.addEventListener("click", (event) => {
  if (Object.keys(items).length === 0) {
    return;
  }

  ingredInfo.classList.remove("hidden");
  ingredList.classList.add("info-shown");
  closeInfoBtn.classList.remove("hidden");
  const clickedLi = event.target.closest("li");
  if (!clickedLi || !ingredList.contains(clickedLi)) return;

  //get name - emoji
  currItem = clickedLi.textContent;
  console.log("manually selected ", currItem);
  currItem = currItem
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .trim();
  console.log("Trimmed currItem is", currItem);
  console.log(shoppingList);
  currItem = shoppingList[currItem];

  // Optional: single selection highlight
  const prev = ingredList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");
  clickedLi.classList.add("selected-li");

  console.log("BAD manual select: currItem is", currItem);
  populateIngredInfo(currItem);
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
  populateIngredInfo(currItem);
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
    const emoji = items[ingredientName].emoji;

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
      // Update state
      checkedState[ingredientName] = checkbox.classList.contains("checked");

      // Save to localStorage
      localStorage.setItem("checkedState", JSON.stringify(checkedState));
    });

    // Clickable checklist toggle
    li.addEventListener("click", () => {
      li.classList.toggle("checked");

      // Update state
      checkedState[ingredientName] = checkbox.classList.contains("checked");
      localStorage.setItem("checkedState", JSON.stringify(checkedState));
    });
  }

  // Add to section
  ingredList.appendChild(ul);

  // Optional footer total
  const totalDiv = document.createElement("div");
  totalDiv.id = "list-total";
  totalDiv.in;
}

//save wip
//if quantity is more than shoppinglist quantity, add key unknown w/ relevant info

function populateIngredInfo(item) {
  //if info does not exist, remove from UI
  console.log("populating info : item is", item);
  ingredCost.classList.toggle("hidden", !items[item.name].cost);

  console.log(item);
  let displayEmoji =
    items[item.name].emoji && items[item.name].emoji.trim() !== ""
      ? items[item.name].emoji
      : "🥕";
  ingredName.textContent = `${displayEmoji} ${item.name}`;

  //wip fix
  // let unitQuantityInfo = convertUnits(item);
  const itemQuantityInfo = convertUnits(item);
  if (simpleQuantity) {
    complexQuantityList.classList.add("hidden");
    totalQuantity.textContent = `${itemQuantityInfo.quantity} ${itemQuantityInfo.unit}`;
  } else {
    complexQuantityList.classList.remove("hidden");
    totalQuantity.textContent = "";
    populateComplexQuantity(itemQuantityInfo);
  }

  if (items[item.name].cost !== "" && items[item.name].cost != null) {
    ingredCost.textContent = `$${items[item.name].cost.toFixed(2)}`;
  }

  usedInList.innerHTML = ""; // Clear previous content

  usedInArray = createUsedInArray(item.name);
  if (usedInArray.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Not used in any recipes.";
    usedInList.appendChild(li);
  } else {
    usedInArray.forEach((recipe) => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.classList.add("need-name");

      nameSpan.textContent = recipe; // assuming each recipe has a name property

      const servesSpan = document.createElement("span");
      servesSpan.classList.add("need-serves");

      servesSpan.textContent = recipes[recipe]?.serves || "#"; // or whatever value you want to show

      li.appendChild(nameSpan);
      li.appendChild(servesSpan);
      usedInList.appendChild(li);
    });
  }
  //clear array
  usedInArray = [];
}

//close recipe info
closeInfoBtn.addEventListener("click", () => {
  ingredInfo.classList.add("hidden");
  ingredList.classList.remove("info-shown");

  const selected = ingredList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current item?
});

//delete popup
const deleteConfirmPopup = document.getElementById("delete-confirm-popup");
const usedInUl = document.getElementById("used-in");
const confirmDeleteBtn = document.getElementById("confirm-delete-button");
const cancelDeleteBtn = document.getElementById("cancel-delete-button");
const closeDeletePopupBtn = document.getElementById("delete-confirm-close");
deleteBtn.addEventListener("click", () => {
  let confirmedDelete = false;

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

editBtn.addEventListener("click", () => {
  //wip.. save currItem from shopping list
});

confirmDeleteBtn.addEventListener("click", () => {
  delete items[currItem.name];

  // 2️⃣ Delete from recipes' ingredients
  for (const recipe of Object.values(recipes)) {
    if (recipe.ingredients && recipe.ingredients[currItem.name]) {
      delete recipe.ingredients[currItem.name];
    }
  }

  populateIngredList(shoppingList);
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

function createUsedInArray(item) {
  // Check if the item exists and has a quantityUnit object
  item = shoppingList[item];

  if (!item || !item.quantityUnit) return [];

  // Return an array of the recipe names (keys)

  return Object.keys(item.quantityUnit);
}

//WIP save checkboxes + save everything

function convertUnits(item) {
  console.log("converting: item.quantityUnit", item.quantityUnit);
  const quantities = Object.values(item.quantityUnit);
  const allUnits = [];

  for (const q of quantities) {
    if (q.unit && q.unit.trim() !== "") {
      allUnits.push(q.unit.toLowerCase().trim());
    }
  }

  //NO UNIT
  if (allUnits.length === 0) {
    let totalQty = 0;
    for (const info of quantities) {
      let q = parseFloat(info.quantity) || 0;

      // Convert fractions like "1/2" to decimal
      if (typeof info.quantity === "string" && info.quantity.includes("/")) {
        const [num, denom] = info.quantity.split("/").map(Number);
        q = num / denom;
      }

      totalQty += q;
    }

    simpleQuantity = true;
    return { unit: "", quantity: totalQty };
  } else if (allUnits.every((u) => u === allUnits[0])) {
    //SAME UNIT
    simpleQuantity = true;
    if (items[item.name].category == "Produce") {
      totalQty = convertProduceUnit(allUnits, item);
      return { unit: "", quantity: totalQty };
    } else {
      return sameUnitCalcQty(quantities, allUnits);
    }
  } else {
    //MORE THAN ONE UNIT
    const obj = complexCalcUnits(item);
    simpleQuantity = hasOnlyOneNonZero(obj);
    if (simpleQuantity) {
      return sameUnitCalcQty(quantities, allUnits);
    } else {
      return obj;
    }
  }
}

function sameUnitCalcQty(quantities, allUnits) {
  if (!allUnits || allUnits.length === 0) return { unit: "", quantity: 0 };

  const unit = allUnits[0];
  let totalQty = 0;

  for (const info of quantities) {
    let q = parseFloat(info.quantity) || 0;

    // Convert fractions like "1/2" to decimal
    if (typeof info.quantity === "string" && info.quantity.includes("/")) {
      const [num, denom] = info.quantity.split("/").map(Number);
      q = num / denom;
    }

    totalQty += q;
  }

  return { unit, quantity: totalQty };
}

function convertProduceUnit(allUnits, item) {
  // conversion rates to cups
  const conversionToCups = {
    tsp: 1 / 48, // 48 tsp in a cup
    tbsp: 1 / 16, // 16 tbsp in a cup
    cup: 1, // 1 cup = 1 cup
  };

  let totalCups = 0;

  // loop through each recipe in quantityUnit
  console.log("convertProduce: item", item);
  for (const [recipe, info] of Object.entries(item.quantityUnit)) {
    const unit = info.unit?.toLowerCase().trim() || "";
    const quantity = parseFloat(info.quantity) || 0;

    if (conversionToCups[unit]) {
      totalCups += quantity * conversionToCups[unit];
    } else {
      // unknown unit (e.g. "", "can", etc.) — treat as 1 cup equivalent
      totalCups += 1;
    }
  }

  // round and ensure at least 1
  console.log("totalCups:", totalCups);
  const newQuantity = Math.max(1, Math.round(totalCups));

  return newQuantity;
}

function hasOnlyOneNonZero(obj) {
  // Flatten all values including nested unconverted
  const values = [
    ...Object.values(obj.unconverted),
    obj.totalCups,
    obj.totalPounds,
    obj.totalOunces,
    obj.totalGallons,
  ];

  // Count how many are greater than 0
  const nonZeroCount = values.filter((v) => v > 0).length;

  return nonZeroCount === 1;
}

function complexCalcUnits(item) {
  // Conversion rates to cups for small volume units
  const toCups = {
    tsp: 1 / 48,
    tbsp: 1 / 16,
    cup: 1,
  };

  const toGallons = {
    pint: 1 / 8, // 8 pints = 1 gallon
    quart: 1 / 4, // 4 quarts = 1 gallon
    gallon: 1, // 1 gallon = 1 gallon
    liter: 1 / 3.785, // 3.785 liters = 1 U.S. gallon
  };

  const toPounds = {
    oz: 1 / 16, // 16 ounces = 1 pound
    lb: 1, // 1 pound = 1 pound
    g: 1 / 453.592, // 453.592 grams = 1 pound
    kg: 2.20462, // 1 kilogram = 2.20462 pounds
  };

  let totalCups = 0;
  let totalGallons = 0;
  let totalPounds = 0;
  let totalOunces = 0;

  const unconverted = { pkg: 0, cans: 0, noUnit: 0 };

  for (const info of Object.values(item.quantityUnit)) {
    let unit = info.unit?.toLowerCase().trim() || "";
    let quantity = parseFloat(info.quantity) || 0;

    // Convert fractions like "1/2" to decimal
    if (typeof info.quantity === "string" && info.quantity.includes("/")) {
      const [num, denom] = info.quantity.split("/").map(Number);
      quantity = num / denom;
    }

    // Cups
    if (["tsp", "tbsp", "cup"].includes(unit)) {
      totalCups += quantity * toCups[unit];
    }
    // Pounds/Ounces
    else if (["oz", "lb", "g", "kg"].includes(unit)) {
      const lbQty = quantity * toPounds[unit];
      totalPounds += lbQty;
    }
    // Gallons
    else if (["pint", "quart", "gallon", "liter"].includes(unit)) {
      totalGallons += quantity * toGallons[unit];
    }
    // Other / unconverted units
    else if (unit === "pkg") {
      unconverted.pkg += quantity;
    } else if (unit === "can") {
      unconverted.cans += quantity;
    } else {
      unconverted.noUnit += quantity;
    }
  }

  // Round up cups and gallons
  totalCups = Math.ceil(totalCups);
  totalGallons = Math.ceil(totalGallons);

  // Pounds / ounces
  if (totalPounds < 1 && totalPounds > 0) {
    totalOunces = Math.round(totalPounds * 16);
    totalPounds = 0;
  } else {
    totalPounds = Math.ceil(totalPounds);
  }

  return {
    unconverted,
    totalCups,
    totalPounds,
    totalOunces,
    totalGallons,
  };
}

function populateComplexQuantity(data) {
  console.log("GOOD popComplex: data is", data);
  const ul = document.getElementById("complex-quantity-list");
  ul.innerHTML = ""; // Clear any existing items

  // Handle unconverted units first
  for (const [key, value] of Object.entries(data.unconverted)) {
    if (value > 0) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="complex-quantity">${value}</span><span class="complex-unit">${capitalizeUnit(
        key
      )}</span>`;
      ul.appendChild(li);
    }
  }

  // Handle totals
  if (data.totalCups > 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="complex-quantity">${data.totalCups}</span><span class="complex-unit">Cups</span>`;
    ul.appendChild(li);
  }

  if (data.totalPounds > 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="complex-quantity">${data.totalPounds}</span><span class="complex-unit">Pounds</span>`;
    ul.appendChild(li);
  }

  if (data.totalOunces > 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="complex-quantity">${data.totalOunces}</span><span class="complex-unit">Ounces</span>`;
    ul.appendChild(li);
  }

  if (data.totalGallons > 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="complex-quantity">${data.totalGallons}</span><span class="complex-unit">Gallons</span>`;
    ul.appendChild(li);
  }
}

// Helper to capitalize unit names nicely
function capitalizeUnit(str) {
  return str
    .split(/(?=[A-Z])|_/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
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
  savePages("viewList");
});

prevPageTab.addEventListener("click", () => {
  const prevKey = pageHistory.prevPage;
  if (prevKey && pageHistoryMap[prevKey]) {
    const url = pageHistoryMap[prevKey].URL;
    savePages("viewList");
    window.location.href = url; // navigate to the URL
  }
});

// Click for previous-previous page tab
prevPrevPageTab.addEventListener("click", () => {
  const prevPrevKey = pageHistory.prevPrevPage;
  if (prevPrevKey && pageHistoryMap[prevPrevKey]) {
    const url = pageHistoryMap[prevPrevKey].URL;
    savePages("viewList");
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

  return pageHistory;
}
