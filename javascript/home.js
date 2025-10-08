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

const menuExample = {
  "Potato Soup": {
    name: "Potato Soup",
    day: "anyday",
    course: "lunch",
  },
  "Potato Salad": {
    name: "Potato Salad",
    day: "mon",
    course: "lunch",
  },
  Lasagna: {
    name: "Lasagna",
    day: "fri",
    course: "dinner",
  },
  "Potato Salad": {
    name: "Potato Salad",
    day: "mon",
    course: "lunch",
  },
  Pizza: {
    name: "Pizza",
    day: "fri",
    course: "lunch",
  },
  Spaghetti: {
    name: "Spaghetti",
    day: "tues",
    course: "dinner",
  },
  Minestrone: {
    name: "Minestrone",
    day: "wed",
    course: "dinner",
  },
  "Grilled Chicken": {
    name: "Grilled Chicken",
    day: "wed",
    course: "lunch",
  },
  Pancakes: {
    name: "Pancakes",
    day: "wed",
    course: "breakfast",
  },
  Cake: {
    name: "Cake",
    day: "wed",
    course: "dessert",
  },
  "Grilled Cheese": {
    name: "Grilled Cheese",
    day: "tues",
    course: "lunch",
  },
};
let menu = menuExample;

const recipesExample = {
  "Corn Chowder": {
    emoji: "🌽",
    serves: 4,
    time: "2 hr",
    type: "Lunch",
    method: "One Pot",
    creator: "The Natural Nurturer",
    link: "https://thenaturalnurturer.com/one-pot-corn-potato-chowder/",
    ingredients: [
      { name: "Frozen Corn", quantity: "1", unit: "cup" },
      { name: "Milk", quantity: "4", unit: "cup" },
      { name: "Celery", quantity: "1", unit: "cup" },
    ],
  },
  "Apple Pie": {
    emoji: "🥧",
    serves: 6,
    time: "1 hr",
    type: "Dessert",
    method: "One Pot",
    creator: "Persnickety Plates",
    link: "https://www.persnicketyplates.com/sheet-pan-apple-slab-pie-oat-crumb-topping/",
    ingredients: [
      { name: "Flour", quantity: "3", unit: "cup" },
      { name: "Sugar", quantity: "1", unit: "cup" },
      { name: "Apple", quantity: "5", unit: "" },
    ],
  },
  "Sourdough Chicken Sandwich": {
    emoji: "🥪",
    serves: 4,
    time: "30 min",
    type: "Lunch",
    method: "No Cook",
    creator: "Me",
    link: "",
    ingredients: [
      { name: "Grilled Chicken", quantity: "1", unit: "lb" },
      { name: "Sourdough Loaf", quantity: "1", unit: "" },
      { name: "Cheese", quantity: "1", unit: "pkg" },
      { name: "Tomato", quantity: "4", unit: "" },
    ],
  },
  "Black Beans": {
    emoji: "🫘",
    serves: 8,
    time: "5 hr",
    type: "Lunch",
    method: "Slow Cooker",
    creator: "Feasting at Home",
    link: "https://www.feastingathome.com/black-beans-recipe/",
    ingredients: [
      { name: "Black Beans", quantity: "1", unit: "can" },
      { name: "Onion", quantity: "1", unit: "" },
    ],
  },
  "Lemon Cake": {
    emoji: "🍰",
    serves: 8,
    time: "2 hr",
    type: "Dessert",
    method: "",
    creator: "Plated Cravings",
    link: "https://platedcravings.com/moist-lemon-cake-recipe/",
    ingredients: [
      { name: "Flour", quantity: "3", unit: "cup" },
      { name: "Sugar", quantity: "1", unit: "cup" },
      { name: "Lemon", quantity: "5", unit: "" },
    ],
  },
  "Potato Soup": {
    emoji: "🥣",
    serves: 4,
    time: "1 hr",
    type: "Dinner",
    method: "One Pot",
    creator: "All Recipes",
    link: "https://www.allrecipes.com/recipe/13218/absolutely-ultimate-potato-soup/",
    ingredients: [
      { name: "Potato", quantity: "5", unit: "" },
      { name: "Milk", quantity: "4", unit: "cup" },
    ],
  },
  "Potato Salad": {
    emoji: "🥔",
    serves: 8,
    time: "2 hr",
    type: "Lunch",
    method: "No Cook",
    creator: "Me",
    link: "",
    ingredients: [
      { name: "Potato", quantity: "1", unit: "cup" },
      { name: "Celery", quantity: "1", unit: "" },
      { name: "Olives", quantity: "1", unit: "can" },
    ],
  },
  Lasagna: {
    emoji: "🍽️",
    serves: 6,
    time: "1 hr",
    type: "Dinner",
    method: "Slow Cooker",
    creator: "The Country Cook",
    link: "https://www.thecountrycook.net/crock-pot-lasagna/",
    ingredients: [
      { name: "Zucchini", quantity: "2", unit: "" },
      { name: "Cheese", quantity: "200", unit: "g" },
      { name: "Tomato", quantity: "2", unit: "" },
      { name: "Ground Beef", quantity: "2", unit: "lb" },
      { name: "Basil", quantity: "1", unit: "cup" },
    ],
  },
  Pizza: {
    emoji: "🍕",
    serves: 8,
    time: "45 min",
    type: "Lunch",
    method: "Sheet Pan",
    creator: "Love and Lemons",
    link: "https://www.loveandlemons.com/sheet-pan-pizza/",
    ingredients: [
      { name: "Pizza Dough", quantity: 1, unit: "pkg" },
      { name: "Olives", quantity: 1, unit: "can" },
      { name: "Tomato", quantity: "2", unit: "" },
    ],
  },
  Minestrone: {
    emoji: "🍲",
    serves: 5,
    time: "3 hr",
    type: "Dinner",
    method: "One Pot",
    creator: "Me",
    link: "",
    ingredients: [
      { name: "Tomato Paste", quantity: 1, unit: "tbsp" },
      { name: "Onion", quantity: 1, unit: "cup" },
      { name: "Carrot", quantity: "2", unit: "" },
      { name: "Olive Oil", quantity: "1/4", unit: "cup" },
    ],
  },
  "Grilled Chicken": {
    emoji: "🍗",
    serves: 4,
    time: "40 min",
    type: "Snack",
    method: "Air Fryer",
    creator: "",
    link: "",
    ingredients: [{ name: "Chicken Breast", quantity: 2, unit: "lb" }],
  },
  Cake: {
    emoji: "🎂",
    serves: 12,
    time: "2 hr",
    type: "Dessert",
    method: "",
    creator: "Recipe Tin Eats",
    link: "https://www.recipetineats.com/my-very-best-vanilla-cake/",
    ingredients: [
      { name: "Milk", quantity: "1/4", unit: "cup" },
      { name: "Flour", quantity: 2, unit: "cup" },
      { name: "Sugar", quantity: "1/2", unit: "cup" },
    ],
  },
  Pancakes: {
    emoji: "🥞",
    serves: 4,
    time: "30 min",
    type: "Breakfast",
    method: "",
    creator: "",
    link: "",
    ingredients: [
      { name: "Milk", quantity: "2", unit: "cup" },
      { name: "Flour", quantity: 4, unit: "cup" },
      { name: "Sugar", quantity: "1/2", unit: "cup" },
    ],
  },
  "Grilled Cheese": {
    emoji: "🥪",
    serves: 5,
    time: "20 min",
    type: "Lunch",
    method: "",
    creator: "Natasha's Kitchen",
    link: "https://natashaskitchen.com/grilled-cheese-sandwich/",
    ingredients: [
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Cheese", quantity: 2, unit: "pkg" },
      { name: "Sourdough Loaf", quantity: "1", unit: "" },
      { name: "Tomato", quantity: "3", unit: "" },
    ],
  },
  Spaghetti: {
    emoji: "🍝",
    serves: 4,
    time: "40 min",
    type: "Dinner",
    method: "Instant Pot",
    creator: "",
    link: "",
    ingredients: [
      { name: "Ground Beef", quantity: "2", unit: "lb" },
      { name: "Pasta", quantity: 1, unit: "pkg" },
      { name: "Basil", quantity: "1/2", unit: "cup" },
      { name: "Tomato", quantity: "2", unit: "" },
    ],
  },
  "Roasted Oranges": {
    emoji: "🍊",
    serves: 4,
    time: "45 min",
    type: "Snack",
    method: "",
    creator: "Food.com",
    link: "https://www.food.com/recipe/roasted-oranges-495606",
    ingredients: [
      { name: "Orange", quantity: "4", unit: "" },
      { name: "Sugar", quantity: "1/2", unit: "cup" },
    ],
  },
  "Sauteed Celery": {
    emoji: "🍽️",
    serves: 4,
    time: "30 min",
    type: "Snack",
    method: "",
    creator: "Me",
    link: "",
    ingredients: [
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Celery", quantity: "3", unit: "cup" },
    ],
  },
};
let recipes = recipesExample;

const shoppingListExample = {
  Potato: {
    name: "Potato",
    quantityUnit: {
      "Potato Soup": { quantity: "5", unit: "" },
      "Potato Salad": { quantity: "1", unit: "cup" },
    },
  },

  Celery: {
    name: "Celery",
    quantityUnit: {
      "Potato Salad": { quantity: "1", unit: "" },
    },
  },

  Zucchini: {
    name: "Zucchini",
    quantityUnit: {
      Lasagna: { quantity: "2", unit: "" },
    },
  },

  Olives: {
    name: "Olives",
    quantityUnit: {
      "Potato Salad": { quantity: "1", unit: "can" },
      Pizza: { quantity: "1", unit: "can" },
    },
  },

  "Pizza Dough": {
    name: "Pizza Dough",
    quantityUnit: {
      Pizza: { quantity: "1", unit: "pkg" },
    },
  },

  "Tomato Paste": {
    name: "Tomato Paste",
    quantityUnit: {
      Spaghetti: { quantity: 1, unit: "tbsp" },
      Minestrone: { quantity: "1/2", unit: "can" },
    },
  },

  Onion: {
    name: "Onion",
    quantityUnit: {
      Minestrone: { quantity: 1, unit: "cup" },
    },
  },

  Carrot: {
    name: "Carrot",
    quantityUnit: {
      Minestrone: { quantity: "2", unit: "" },
    },
  },

  "Chicken Breast": {
    name: "Chicken Breast",
    quantityUnit: {
      "Grilled Chicken": { quantity: 2, unit: "lb" },
    },
  },

  Milk: {
    name: "Milk",
    quantityUnit: {
      Pancakes: { quantity: 2, unit: "cup" },
      Cake: { quantity: "1/4", unit: "cup" },
      "Potato Soup": { quantity: "4", unit: "cup" },
    },
  },

  Flour: {
    name: "Flour",
    quantityUnit: {
      Pancakes: { quantity: 4, unit: "cup" },
      Cake: { quantity: 2, unit: "cup" },
    },
  },

  Sugar: {
    name: "Sugar",
    quantityUnit: {
      Pancakes: { quantity: "1/2", unit: "cup" },
      Cake: { quantity: "1/2", unit: "cup" },
    },
  },

  "Olive Oil": {
    name: "Olive Oil",
    quantityUnit: {
      Minestrone: { quantity: "1/4", unit: "cup" },
      "Grilled Cheese": { quantity: "2", unit: "tbsp" },
    },
  },

  Cheese: {
    name: "Cheese",
    quantityUnit: {
      Lasagna: { quantity: "200", unit: "g" },
      "Grilled Cheese": { quantity: 2, unit: "pkg" },
    },
  },

  "Sourdough Loaf": {
    name: "Bread",
    quantityUnit: {
      "Grilled Cheese": { quantity: "1", unit: "" },
    },
  },

  Tomato: {
    name: "Tomato",
    quantityUnit: {
      "Grilled Cheese": { quantity: 3, unit: "" },
      Spaghetti: { quantity: 2, unit: "" },
      Lasagna: { quantity: 2, unit: "" },
    },
  },

  "Ground Beef": {
    name: "Ground Beef",
    quantityUnit: {
      Spaghetti: { quantity: 2, unit: "lb" },
      Lasagna: { quantity: 2, unit: "lb" },
    },
  },

  Pasta: {
    name: "Pasta",
    quantityUnit: {
      Spaghetti: { quantity: 1, unit: "pkg" },
      Lasagna: { quantity: 1, unit: "pkg" },
    },
  },

  Basil: {
    name: "Basil",
    quantityUnit: {
      Lasagna: { quantity: 1, unit: "cup" },
      Spaghetti: { quantity: "1/2", unit: "cup" },
    },
  },
};
let shoppingList = shoppingListExample;

const itemsExample = {
  Apple: {
    name: "Apple",
    unit: "",
    category: "Produce",
    cost: "1.50",
    emoji: "🍎",
  },
  Orange: {
    name: "Orange",
    unit: "",
    category: "Produce",
    cost: "1.80",
    emoji: "🍊",
  },
  Butter: {
    name: "Butter",
    unit: "lb",
    category: "Dairy",
    cost: "5.60",
    emoji: "🧈",
  },
  Croissant: {
    name: "Croissant",
    unit: "",
    category: "Bakery",
    cost: "",
    emoji: "🥐",
  },
  Potato: {
    name: "Potato",
    unit: "",
    category: "Produce",
    cost: 0.5,
    emoji: "🥔",
  },
  "Frozen Corn": {
    name: "Frozen Corn",
    unit: "pkg",
    category: "Frozen",
    cost: "3.90",
    emoji: "🌽",
  },
  "Tomato Paste": {
    name: "Tomato Paste",
    unit: "can",
    category: "Pantry",
    cost: 2.5,
    emoji: "🥫",
  },
  Celery: {
    name: "Celery",
    unit: "",
    category: "Produce",
    cost: 3,
    emoji: "🥕",
  },
  Lemon: {
    name: "Lemon",
    unit: "",
    category: "Produce",
    cost: 0.75,
    emoji: "🍋",
  },
  "Ground Beef": {
    name: "Ground Beef",
    unit: "pkg",
    category: "Meat",
    cost: 8.54,
    emoji: "🥩",
  },
  Olives: {
    name: "Olives",
    unit: "can",
    category: "Pantry",
    cost: 3.75,
    emoji: "🫒",
  },
  Zucchini: {
    name: "Zucchini",
    unit: "",
    category: "Produce",
    cost: 2,
    emoji: "🥒",
  },
  "Pizza Dough": {
    name: "Pizza Dough",
    unit: "pkg",
    category: "Frozen",
    cost: 5.5,
    emoji: "🫓",
  },
  Onion: {
    name: "Onion",
    unit: "",
    category: "Produce",
    cost: 1.5,
    emoji: "🧅",
  },
  Carrot: {
    name: "Carrot",
    unit: "",
    category: "Produce",
    cost: 0.75,
    emoji: "🥕",
  },
  "Black Beans": {
    name: "Black Beans",
    unit: "can",
    category: "Pantry",
    cost: 2.75,
    emoji: "🫘",
  },
  Milk: {
    name: "Milk",
    unit: "gallon",
    category: "Dairy",
    cost: 4,
    emoji: "🥛",
  },
  Flour: {
    name: "Flour",
    unit: "lb",
    category: "Pantry",
    cost: 3,
    emoji: "🥕",
  },
  Sugar: {
    name: "Sugar",
    unit: "pkg",
    category: "Pantry",
    cost: 3,
    emoji: "🍰",
  },
  "Olive Oil": {
    name: "Olive Oil",
    unit: "",
    category: "Pantry",
    cost: 6,
    emoji: "🍾",
  },
  "Chicken Breast": {
    name: "Chicken Breast",
    unit: "lb",
    category: "Meat",
    cost: 4.9,
    emoji: "🍗",
  },

  Cheese: {
    name: "Cheese",
    unit: "pkg",
    category: "Dairy",
    cost: 5,
    emoji: "🧀",
  },
  "Sourdough Loaf": {
    name: "Sourdough Loaf",
    unit: "",
    category: "Bakery",
    cost: 5,
    emoji: "🍞",
  },
  Pasta: {
    name: "Pasta",
    unit: "pkg",
    category: "Pantry",
    cost: 2.5,
    emoji: "🍝",
  },
  Tomato: {
    name: "Tomato",
    unit: "",
    category: "Produce",
    cost: 0.7,
    emoji: "🍅",
  },
  Basil: {
    name: "Basil",
    unit: "",
    category: "Produce",
    cost: 3,
    emoji: "🌿",
  },
};
let items = itemsExample;

let pageHistory = loadPageHistory();
tabsUI();

const loadBtn = document.getElementById("load");
loadBtn.addEventListener("click", () => {
  clearData();
  saveAllData();
});

const shoppingListBtn = document.getElementById("shop");
shoppingListBtn.addEventListener("click", () => {
  //   localStorage.setItem("pageHistoryInitialized", "false");
  savePages("home");
});

const menuBtn = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  //   localStorage.setItem("pageHistoryInitialized", "false");
  savePages("home");
});

const recipesBtn = document.getElementById("recipes");
recipesBtn.addEventListener("click", () => {
  //   localStorage.setItem("pageHistoryInitialized", "false");
  savePages("home");
});

const ingredBtn = document.getElementById("ingred");
ingredBtn.addEventListener("click", () => {
  //   localStorage.setItem("pageHistoryInitialized", "false");
  savePages("home");
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
