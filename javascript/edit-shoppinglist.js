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

const shoppingListExample = {
  Potato: {
    name: "Potato",
    quantityUnit: {
      "Potato Soup": {
        quantity: 5,
        unit: "",
      },
      "Potato Salad": {
        quantity: 3,
        unit: "",
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
    category: "Baking",
    cost: 2.5,
    emoji: "🍞",
  },
  "Tomato Paste": {
    name: "Tomato Paste",
    unit: "",
    category: "Produce",
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

//WIP save checkboxes + save everything
