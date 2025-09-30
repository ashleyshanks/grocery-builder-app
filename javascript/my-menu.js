const servesOutput = document.getElementById("serves");
const timeOutput = document.getElementById("time");
const categoryOutput = document.getElementById("category");
const methodOutput = document.getElementById("method");
const creatorOutput = document.getElementById("creator");
const linkOutput = document.getElementById("link");
const ingredOutput = document.getElementById("subingredients-list");
const recipeTitle = document.querySelector("h2");
const svgHTML = recipeTitle.querySelector("svg")?.outerHTML || "";
const menuList = document.getElementById("menu-list");
const recipeInfo = document.getElementById("recipe-info");

const savedMenu = localStorage.getItem("menu");
const menu = savedMenu ? JSON.parse(savedMenu) : {};

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};

console.log(menu);

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

// Step 1: populate organizedMenu
const organizedMenu = {};

// initialize all days and courses
for (const dayKey in dayMap) {
  const dayName = dayMap[dayKey];
  organizedMenu[dayName] = {};
  for (const course in courseMap) {
    organizedMenu[dayName][course] = [];
  }
}

// populate organizedMenu
for (const [name, info] of Object.entries(menu)) {
  const dayName =
    info.day && dayMap[info.day] ? dayMap[info.day] : dayMap.anyday;
  const course =
    info.course && courseMap[info.course] ? info.course : "unknown";
  organizedMenu[dayName][course].push(name);
}

// Step 2: generate HTML
menuList.innerHTML = "";

// loop through days in the order of dayMap
for (const dayKey in dayMap) {
  const dayName = dayMap[dayKey];

  // skip day if no recipes at all
  const hasRecipes = Object.values(organizedMenu[dayName]).some(
    (arr) => arr.length > 0
  );
  if (!hasRecipes) continue;

  const dayHeader = document.createElement("h3");
  dayHeader.textContent = dayName;
  menuList.appendChild(dayHeader);

  for (const course in courseMap) {
    const recipes = organizedMenu[dayName][course];
    if (recipes.length === 0) continue; // skip empty courses

    const courseHeader = document.createElement("h4");
    courseHeader.textContent = courseMap[course];
    menuList.appendChild(courseHeader);

    const ul = document.createElement("ul");
    recipes.forEach((recipeName) => {
      const li = document.createElement("li");
      li.textContent = recipeName;
      ul.appendChild(li);
    });
    menuList.appendChild(ul);
  }
}
autoSelect();

let currRecipe;
menuList.addEventListener("click", (event) => {
  // Find the closest <li> ancestor of whatever was clicked
  const clickedLi = event.target.closest("li");
  // If click was outside an li or the li isn't in this list, ignore
  if (!clickedLi || !menuList.contains(clickedLi)) return;

  if (clickedLi.classList.contains("selected-li")) {
    // Deselect
    clickedLi.classList.remove("selected-li");
    currRecipe = null;
    console.log("Deselected recipe");
  } else {
    // Remove previous selection (only one at a time)
    const prev = menuList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select clicked one
    clickedLi.classList.add("selected-li");
    currRecipe = clickedLi.textContent.trim();

    fillRecipeDetails(currRecipe);
  }
});

//fav star
const favStar = document.getElementById("fav-star");

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise
  console.log("currRecipe");
  console.log(currRecipe);
  recipes[currRecipe].favorite = recFav;
  localStorage.setItem("recipes", JSON.stringify(recipes));
});

//close recipe info
const closeInfoBtn = document.getElementById("info-close-btn");
closeInfoBtn.addEventListener("click", () => {
  recipeInfo.classList.add("hidden");
  menuList.classList.remove("recipe-info-shown");

  const selected = menuList.querySelector(".selected-li");
  if (selected) selected.classList.remove("selected-li");

  // Reset current recipe
  currRecipe = null;
});

//functions
function fillRecipeDetails(currRecipe) {
  recipeInfo.classList.remove("hidden");
  menuList.classList.add("recipe-info-shown");

  console.log(currRecipe);
  if (!currRecipe || !recipes[currRecipe]) {
    console.warn("Recipe not found:", currRecipe);
    return;
  }

  const recipe = recipes[currRecipe];

  //fav star
  console.log(recipes[currRecipe]);

  if (recipe.favorite) {
    favStar.classList.add("favorited");
  } else {
    favStar.classList.remove("favorited");
  }

  recipeTitle.innerHTML = `${svgHTML} ${recipe.emoji} ${currRecipe}`;
  servesOutput.textContent = recipe.serves || "Unknown";
  timeOutput.textContent = recipe.time || "0hr";
  categoryOutput.textContent = recipe.type || "Unknown";
  methodOutput.textContent = recipe.method || "Unknown";
  creatorOutput.textContent = recipe.creator || "Unknown";

  // If link is available, make it a clickable link
  if (recipe.link) {
    linkOutput.innerHTML = `<a href="${recipe.link}" target="_blank">${recipe.link}</a>`;
  } else {
    linkOutput.textContent = "Unknown";
  }

  // Populate ingredients
  ingredOutput.innerHTML = ""; // clear old list

  if (recipe.ingredients && Object.keys(recipe.ingredients).length > 0) {
    Object.values(recipe.ingredients).forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing.name;
      ingredOutput.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No ingredients";
    ingredOutput.appendChild(li);
  }
}

function autoSelect() {
  // Grab the first <li> inside the menuList
  const firstLi = menuList.querySelector("li");

  if (!firstLi) return; // nothing to select

  // Remove any previous selection
  const prev = menuList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");

  // Select the new one
  firstLi.classList.add("selected-li");
  let currRecipe = firstLi.textContent.trim();
}
