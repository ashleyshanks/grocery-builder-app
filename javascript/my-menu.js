const servesOutput = document.getElementById("serves");
const servesLabel = document.getElementById("serves-label");
const timeOutput = document.getElementById("time");
const timeLabel = document.getElementById("time-label");
const categoryOutput = document.getElementById("category");
const categoryLabel = document.getElementById("category-label");
const methodOutput = document.getElementById("method");
const methodLabel = document.getElementById("method-label");
const creatorOutput = document.getElementById("creator");
const creatorLabel = document.getElementById("creator-label");
const linkOutput = document.getElementById("link");
const linkLabel = document.getElementById("link-label");
const ingredOutput = document.getElementById("subingredients-list");
const ingredLabel = document.getElementById("ingred-label");
const recipeTitle = document.querySelector("h2");
const svgHTML = recipeTitle.querySelector("svg")?.outerHTML || "";
const menuList = document.getElementById("menu-list");
const recipeInfo = document.getElementById("recipe-info");

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

const courseMap = {
  breakfast: "🥞 Breakfast",
  lunch: "🥗 Lunch",
  dinner: "🍔 Dinner",
  dessert: "🍪 Dessert",
  snack: "🍿 Snacks",
  unknown: "🍽️ Uncategorized",
};

const dayMap = {
  anyday: "Any Day",
  sun: "Sunday",
  mon: "Monday",
  tues: "Tuesday",
  wed: "Wednesday",
  thurs: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

const savedMenu = localStorage.getItem("menu");
const menu = savedMenu ? JSON.parse(savedMenu) : {};

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};

let pageHistory = loadPageHistory();

tabsUI();
// Step 1: Group recipes by day and course
const organizedMenu = {};
menuList.innerHTML = "";
let currMeal = null;

// Step 1: Build organizedMenu with keys

for (const key in menu) {
  const recipe = menu[key];
  let day = recipe.day || "anyday";
  day = dayMap[day] || "Any Day";
  const course = recipe.course || "unknown";

  if (!organizedMenu[day]) organizedMenu[day] = {};
  if (!organizedMenu[day][course]) organizedMenu[day][course] = {}; // object to store key

  // Store the recipe under its original menu key
  organizedMenu[day][course][key] = recipe;
}

// Step 2: Loop through organizedMenu to display by day and course
for (const dayName in organizedMenu) {
  const dayHeader = document.createElement("h3");
  dayHeader.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  menuList.appendChild(dayHeader);

  for (const course in courseMap) {
    const recipesForCourse = organizedMenu[dayName][course] || {};

    // Skip empty courses
    if (Object.keys(recipesForCourse).length === 0) continue;

    const courseHeader = document.createElement("h4");
    courseHeader.textContent = courseMap[course];
    menuList.appendChild(courseHeader);

    // Loop through each recipe by key
    for (const key in recipesForCourse) {
      const recipe = recipesForCourse[key];
      const li = document.createElement("li");
      li.textContent = recipe.name;

      // Store original key on the <li>
      li.dataset.recipeKey = key;

      menuList.appendChild(li);
    }
  }
}

// Step 3: Add click handler to access original key
menuList.addEventListener("click", (event) => {
  const clickedLi = event.target.closest("li");
  if (!clickedLi || !menuList.contains(clickedLi)) return;

  const recipeKey = clickedLi.dataset.recipeKey;
  currMeal = menu[recipeKey];
  console.log("Clicked recipe key:", recipeKey);

  // Optional: single selection highlight
  const prev = menuList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");
  clickedLi.classList.add("selected-li");

  // Call your function with the original key
  fillRecipeDetails(recipeKey);
});

//fav star
const favStar = document.getElementById("fav-star");

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  console.log("fav");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise
  console.log("currMeal.name is", currMeal.name);
  recipes[currMeal.name].favorite = recFav;
  localStorage.setItem("recipes", JSON.stringify(recipes));
});

autoSelect();

const editMenuBtn = document.getElementById("edit-svg");
editMenuBtn.addEventListener("click", () => {
  savePages("viewMenu");
});

//save direct from
const editRecipeBtn = document.getElementById("edit-recipe-btn");
editRecipeBtn.addEventListener("click", () => {
  savePages("viewMenu");
  //fix me: save curr item
  localStorage.setItem("directedFrom", "myMenu"); //fix me: remove now?
});

//close recipe info
const closeInfoBtn = document.getElementById("info-close-btn");
closeInfoBtn.addEventListener("click", () => {
  recipeInfo.classList.add("hidden");
  menuList.classList.remove("info-shown");

  const selected = menuList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current recipe
  currMeal = null;
});

//functions
function fillRecipeDetails(currMeal) {
  recipeInfo.classList.remove("hidden");
  menuList.classList.add("info-shown");

  const meal = menu[currMeal];
  const recipe = recipes[meal.name];

  //fav star recipes
  if (recipe.favorite) {
    favStar.classList.add("favorited");
  } else {
    favStar.classList.remove("favorited");
  }

  recipeTitle.innerHTML = `${svgHTML} ${recipe.emoji} ${meal.name}`;
  servesOutput.textContent = recipe.serves || "Unknown";
  if (servesOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    servesLabel.classList.add("hidden");
    servesOutput.classList.add("hidden");
  } else {
    servesLabel.classList.remove("hidden");
  }

  let timeText = formatTime(recipe.time);
  timeOutput.textContent = timeText || "Unknown";
  if (timeOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    timeLabel.classList.add("hidden");
    timeOutput.classList.add("hidden");
  } else {
    timeLabel.classList.remove("hidden");
    timeOutput.classList.remove("hidden");
  }

  let categoryText = capitalize(meal.course);
  categoryOutput.textContent = categoryText || "Unknown";
  if (categoryOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    categoryLabel.classList.add("hidden");
    categoryOutput.classList.add("hidden");
  } else {
    categoryLabel.classList.remove("hidden");
    categoryOutput.classList.remove("hidden");
  }

  let methodText = capitalize(recipe.method);
  methodOutput.textContent = methodText || "Unknown";
  if (methodOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    methodLabel.classList.add("hidden");
    methodOutput.classList.add("hidden");
  } else {
    methodLabel.classList.remove("hidden");
    methodOutput.classList.remove("hidden");
  }

  let creatorText = capitalize(recipe.creator);
  creatorOutput.textContent = creatorText || "Unknown";
  if (creatorOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    creatorLabel.classList.add("hidden");
    creatorOutput.classList.add("hidden");
  } else {
    creatorLabel.classList.remove("hidden");
    creatorOutput.classList.remove("hidden");
  }

  // If link is available, make it a clickable link
  if (recipe.link) {
    // Add http:// if missing
    let url = recipe.link;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    linkOutput.innerHTML = `<a href="${url}" target="_blank">${recipe.link}</a>`;
  } else {
    linkOutput.textContent = "Unknown";
  }
  if (linkOutput.textContent == "Unknown") {
    // or whatever your condition is for "unknown"
    linkLabel.classList.add("hidden");
    linkOutput.classList.add("hidden");
  } else {
    linkLabel.classList.remove("hidden");
    linkOutput.classList.remove("hidden");
  }

  // Populate ingredients

  ingredOutput.innerHTML = ""; // clear old list

  if (recipe.ingredients && Object.keys(recipe.ingredients).length > 0) {
    ingredLabel.classList.remove("hidden");
    ingredOutput.classList.remove("hidden");
    Object.values(recipe.ingredients).forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing.name;
      ingredOutput.appendChild(li);
    });
  } else {
    ingredLabel.classList.add("hidden");
    ingredOutput.classList.add("hidden");
  }
}

function autoSelect() {
  // Grab the first <li> inside the menuList
  recipeInfo.classList.remove("hidden");
  menuList.classList.add("info-shown");

  const firstLi = menuList.querySelector("li");

  if (!firstLi) return; // nothing to select

  // Remove any previous selection
  const prev = menuList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");

  // Select the new one
  firstLi.classList.add("selected-li");

  const recipeKey = firstLi.dataset.recipeKey;
  console.log("Auto selected recipe key:", recipeKey);
  currMeal = menu[recipeKey];

  fillRecipeDetails(recipeKey);
}

function formatTime(input) {
  if (!input) return "";

  const lower = input.toLowerCase();
  let hours = 0;
  let minutes = 0;

  // Match hours (e.g., "4 hours", "2 hr", "1h")
  const hrMatch = lower.match(/(\d+)\s*(h|hr|hour|hours)/);
  if (hrMatch) hours = parseInt(hrMatch[1]);

  // Match minutes (e.g., "30 minutes", "20 min", "15m")
  const minMatch = lower.match(/(\d+)\s*(m|min|minute|minutes)/);
  if (minMatch) minutes = parseInt(minMatch[1]);

  // Build formatted string
  let result = "";
  if (hours > 0) result += `${hours}hr`;
  if (minutes > 0) result += hours > 0 ? ` ${minutes} min` : `${minutes} min`;

  return result || input; // fallback to original if nothing matched
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
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
