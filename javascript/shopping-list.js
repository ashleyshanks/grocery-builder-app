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

const shoppingListExample = {
  Potato: {
    name: "Potato",
    quantityUnit: {
      "Potato Soup": {
        quantity: "1",
        unit: "",
      },
      "Potato Salad": {
        quantity: "1",
        unit: "cup",
      },
      "Potato Casserole": {
        quantity: "1",
        unit: "cup",
      },
    },
  },

  "Tomato Paste": {
    name: "Tomato Paste",
    quantityUnit: {
      Spaghetti: {
        quantity: 1,
        unit: "tbsp",
      },
      Minestrone: {
        quantity: "1/2",
        unit: "can",
      },
    },
  },
};
const shoppingList = shoppingListExample;

const itemsExample = {
  Potato: {
    name: "Potato",
    unit: "cups",
    category: "Produce",
    cost: 2.5,
    emoji: "🍞",
  },
  "Tomato Paste": {
    name: "Tomato Paste",
    unit: "",
    category: "produce",
    cost: 1,
    emoji: "🥕",
  },
};
const items = itemsExample;

const recipesExample = {
  "Potato Soup": {
    name: "Potato Soup",
    emoji: "🍰",
    serves: 3,
    time: "30 min",
    ingredients: {
      Potato: { name: "Potato", quantity: 4 },
      Milk: { name: "Milk", quantity: 3 },
    },
  },
  "Potato Salad": {
    name: "Lemonade",
    emoji: "🍋",
    serves: 2,
    time: "10 min",
    ingredients: {
      Potato: { name: "Potato", quantity: 2 },
      Lemon: { name: "Lemon", quantity: 3 },
      Water: { name: "Water", quantity: 5 },
    },
  },
  Spaghetti: {
    name: "Spaghetti",
    emoji: "🍝",
    serves: 4,
    time: "20 min",
    ingredients: {
      Tomato: { name: "Tomato", quantity: 3 },
      Noodles: { name: "Noodles", quantity: 2 },
      OliveOil: { name: "Olive Oil", quantity: 1 },
    },
  },
  Minestrone: {
    name: "Spaghetti",
    emoji: "🍝",
    serves: 4,
    time: "20 min",
    ingredients: {
      Tomato: { name: "Tomato", quantity: 3 },
      Noodles: { name: "Noodles", quantity: 2 },
      OliveOil: { name: "Olive Oil", quantity: 1 },
    },
  },
};
const recipes = recipesExample;

let simpleQuantity = false;
let currItem;

populateIngredList(shoppingList);
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

//save wip
//if quantity is more than shoppinglist quantity, add key unknown w/ relevant info

function populateIngredInfo(item) {
  //if info does not exist, remove from UI
  ingredCost.classList.toggle("hidden", !item.cost);

  let displayEmoji = item.emoji && item.emoji.trim() !== "" ? item.emoji : "🥕";
  ingredName.textContent = `${displayEmoji} ${item.name}`;

  let unitQuantityInfo = convertUnits(item);
  if (simpleQuantity) {
    totalQuantity.textContent = calculateTotalQuantity(item);
  } else {
    totalQuantity.textContent = "";
    //wip make new div in info that lists quantities and units
  }

  if (item.cost !== "" && item.cost != null) {
    ingredCost.textContent = `$${item.cost.toFixed(2)}`;
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

function calculateTotalQuantity(item) {
  //must adjust for different units
  console.log("calc quantity: item.name is ", item.name);
  console.log(
    "calc quantity: shoppingList[item.name] is",
    shoppingList[item.name]
  );
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

convertUnits(butter);

function convertUnits(item) {
  console.log("convertUnits:");
  const quantities = Object.values(item.quantityUnit);
  console.log("quantities is", quantities);
  const allUnits = [];

  for (const q of quantities) {
    if (q.unit && q.unit.trim() !== "") {
      allUnits.push(q.unit.toLowerCase().trim());
    }
  }
  console.log("allUnits is", allUnits);

  if (allUnits.length === 0) {
    simpleQuantity = true;
    return { unit: null, type: "none" };
  }

  // Check if all units are the same
  if (allUnits.every((u) => u === allUnits[0])) {
    console.log({
      unit: allUnits[0],
      type: inferType(item.category, allUnits[0]),
    });

    console.log("convert1:", {
      unit: allUnits[0],
      type: inferType(item.category, allUnits[0]),
    });
    simpleQuantity = true;
    return { unit: allUnits[0], type: inferType(item.category, allUnits[0]) };
  }

  if (items[item.name].category == "Produce") {
    let newQuantity = convertProduceUnit(allUnits, item);
    console.log("produce newQuantity should be 3", newQuantity);
    return newQuantity;
  } else if (items[item.name].category == "Meat") {
    let newQuantity = convertProduceUnit(allUnits, item);
    return newQuantity;
  } else {
    let newQuantityUnits = calcUnits(allUnits, butter);
    console.log("newQuantityUnits");
    console.log(newQuantityUnits);
  }
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

function convertMeatUnit(allUnits, item) {
  let totalPounds = 0;

  for (const [recipe, info] of Object.entries(item.quantityUnit)) {
    let quantity = info.quantity;
    let unit = info.unit?.toLowerCase().trim() || "";

    // Convert string fractions like "1/2" to decimal
    if (typeof quantity === "string" && quantity.includes("/")) {
      const [num, denom] = quantity.split("/").map(Number);
      quantity = num / denom;
    } else {
      quantity = Number(quantity);
    }

    switch (unit) {
      case "pkg":
        totalPounds += quantity * 1; // 1 pkg ≈ 1 lb
        break;
      case "can":
        totalPounds += quantity * (1 / 3); // 1 can ≈ 1/3 lb
        break;
      case "oz":
      case "ounce":
        totalPounds += quantity / 16; // 16 oz in 1 lb
        break;
      case "lb":
      case "pound":
        totalPounds += quantity; // already in pounds
        break;
      case "g":
        totalPounds += quantity / 453.592; // grams → lb
        break;
      case "kg":
        totalPounds += quantity * 2.20462; // kg → lb
        break;
      default:
        // unknown or empty unit → assume 1 lb
        totalPounds += quantity;
        break;
    }
  }

  return totalPounds; // decimal number in pounds
}

function calcUnits(allUnits, item) {
  // Conversion rates to cups for small volume units
  const toCups = {
    tsp: 1 / 48,
    tbsp: 1 / 16,
    cup: 1,
  };

  const totals = {};

  for (const info of Object.values(item.quantityUnit)) {
    let unit = info.unit?.toLowerCase().trim() || "";
    let quantity = parseFloat(info.quantity) || 0;

    // Convert fractions like "1/2" to decimal
    if (typeof info.quantity === "string" && info.quantity.includes("/")) {
      const [num, denom] = info.quantity.split("/").map(Number);
      quantity = num / denom;
    }

    // Normalize small units to cups
    if (["tsp", "tbsp", "cup"].includes(unit)) {
      const cupQty = quantity * toCups[unit];
      totals["cup"] = (totals["cup"] || 0) + cupQty;
    } else {
      totals[unit] = (totals[unit] || 0) + quantity;
    }
  }

  // Round cups up if present
  if (totals["cup"]) totals["cup"] = Math.ceil(totals["cup"]);

  // Update allUnits to reflect what units are actually present
  const updatedUnits = Object.keys(totals);

  return { totals, allUnits: updatedUnits };
}
