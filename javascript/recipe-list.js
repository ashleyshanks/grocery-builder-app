//RECIPE INFO DOM
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
const recipeInfo = document.getElementById("recipe-info");
const favStar = document.getElementById("fav-star");
const closeInfoBtn = document.getElementById("info-close-btn");
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

const savedMenu = localStorage.getItem("menu");
const menu = savedMenu ? JSON.parse(savedMenu) : {};

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
const recipeList = document.getElementById("recipes-list");
let pageHistory = loadPageHistory();

tabsUI();
populateRecipeList();
let currRecipe;
if (typeof currRecipe === "undefined" || currRecipe === null) {
  currRecipe = autoSelect(); // autoSelect should return a recipe key
}

recipeList.addEventListener("click", (event) => {
  // Find the closest <li> ancestor of whatever was clicked
  const clickedLi = event.target.closest("li");
  // If click was outside an li or the li isn't in this list, ignore
  if (!clickedLi || !recipeList.contains(clickedLi)) return;

  if (clickedLi.classList.contains("selected-li")) {
    // Deselect
    clickedLi.classList.remove("selected-li");
    recipeInfo.classList.add("hidden");
    recipeList.classList.remove("info-shown");
    closeInfoBtn.classList.add("hidden");
    currRecipe = null;
    console.log("Deselected recipe");
  } else {
    recipeInfo.classList.remove("hidden");
    closeInfoBtn.classList.remove("hidden");
    recipeList.classList.add("info-shown");
    // Remove previous selection (only one at a time)
    const prev = recipeList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select clicked one
    clickedLi.classList.add("selected-li");
    console.log("fullText: clickedLi is", clickedLi);
    let fullText = clickedLi.querySelector("span")?.textContent.trim();
    currRecipe = fullText.replace(/^[\p{Emoji}\s]+/u, "").trim();
    fillRecipeDetails(fullText, currRecipe);
  }
});

const editBtn = document.getElementById("edit-btn");
console.log("edit btn Selected recipe:", currRecipe);
editBtn.addEventListener("click", () => {
  // Prefer a data attribute for the recipe id/name, fallback to trimmed text
  saveInfo();
});

const addIngredBtn = document.getElementById("ingred-list-btn");
addIngredBtn.addEventListener("click", () => {
  saveInfo();
});

const addBtn = document.getElementById("add-svg");
let addClicked = false;
addBtn.addEventListener("click", () => {
  addClicked = true;
  localStorage.setItem("addClicked", "true");
  newRecipeUI();
});

//close recipe info

closeInfoBtn.addEventListener("click", () => {
  recipeInfo.classList.add("hidden");
  recipeList.classList.remove("info-shown");
  closeInfoBtn.classList.add("hidden");

  const selected = recipeList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current recipe
  currRecipe = null;
});

//add to menu
const addMenuBtn = document.getElementById("add-to-menu-btn");
addMenuBtn.addEventListener("click", () => {
  menu[currRecipe] = {
    name: currRecipe,
    day: "unknown",
    course: recipes[currRecipe].type || "unknown",
  };

  localStorage.setItem("menu", JSON.stringify(menu));
  console.log(menu);
});

//fav star
favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  recipes[currRecipe].favorite = recFav;
  localStorage.setItem("recipes", JSON.stringify(recipes));
});

//FUNCTION

function toggleFavStar() {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  recipes[currRecipe].favorite = recFav;
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function populateRecipeList() {
  recipeList.innerHTML = ""; // clear current list

  // Loop through recipes map (object)
  for (const [recipeName, recipeData] of Object.entries(recipes)) {
    const li = document.createElement("li");

    // First span: Recipe Name (from key)
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${recipeData.emoji} ${recipeData.name}`;

    // Second span: Method (from recipe object)
    const methodSpan = document.createElement("span");
    methodSpan.textContent = recipeData.method || "Unknown";

    // Third span: ## (you could use serves, or just blank)
    const servesSpan = document.createElement("span");
    servesSpan.textContent = recipeData.serves || "##";

    li.appendChild(nameSpan);
    li.appendChild(methodSpan);
    li.appendChild(servesSpan);

    recipeList.appendChild(li);
  }
}

function saveInfo() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("currRecipe", currRecipe);
  console.log("saved: currRecipe is", currRecipe);
}

function fillRecipeDetails(fullText, currRecipe) {
  recipeInfo.classList.remove("hidden");
  recipeList.classList.add("info-shown");
  closeInfoBtn.classList.remove("hidden");

  const recipe = recipes[currRecipe];

  //fav star

  if (recipe.favorite) {
    favStar.classList.add("favorited");
  } else {
    favStar.classList.remove("favorited");
  }

  recipeTitle.innerHTML = `${svgHTML} ${fullText}`;
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

  let categoryText = capitalize(recipe.type);
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
  console.log("fill placeholders: currRecipe is", currRecipe);
}
console.log("after fill placeholders: currRecipe is", currRecipe);

function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("currRecipe");
}

function autoSelect() {
  // Grab the first <li> inside the menuList
  const firstLi = recipeList.querySelector("li");

  if (!firstLi) return; // nothing to select

  // Remove any previous selection
  const prev = recipeList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");

  // Select the new one
  firstLi.classList.add("selected-li");
  let fullText = firstLi.querySelector("span")?.textContent.trim();
  currRecipe = fullText.replace(/^[\p{Emoji}\s]+/u, "").trim();
  fillRecipeDetails(fullText, currRecipe);
  return currRecipe;
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

// populateRecipeList();
// autoSelect();

//WIP add categories
//WIP add "No recipes added, click the + button to add recipes"

//bug favStar saying accessed before init
