//RECIPE INFO DOM
const servesOutput = document.getElementById("serves");
const timeOutput = document.getElementById("time");
const categoryOutput = document.getElementById("category");
const methodOutput = document.getElementById("method");
const creatorOutput = document.getElementById("creator");
const linkOutput = document.getElementById("link");
const ingredOutput = document.getElementById("subingredients-list");
const recipeTitle = document.querySelector("h2");
const svgHTML = recipeTitle.querySelector("svg")?.outerHTML || "";
const recipeInfo = document.getElementById("recipe-info");

const savedMenu = localStorage.getItem("menu");
const menu = savedMenu ? JSON.parse(savedMenu) : {};

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
const recipeList = document.getElementById("recipes-list");
console.log(recipes);
populateRecipeList();

let currRecipe;
recipeList.addEventListener("click", (event) => {
  // Find the closest <li> ancestor of whatever was clicked
  const clickedLi = event.target.closest("li");
  // If click was outside an li or the li isn't in this list, ignore
  if (!clickedLi || !recipeList.contains(clickedLi)) return;

  if (clickedLi.classList.contains("selected-li")) {
    // Deselect
    clickedLi.classList.remove("selected-li");
    currRecipe = null;
    console.log("Deselected recipe");
  } else {
    // Remove previous selection (only one at a time)
    const prev = recipeList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select clicked one
    clickedLi.classList.add("selected-li");
    let fullText = clickedLi.querySelector("span")?.textContent.trim();
    currRecipe = fullText.replace(/^[\p{Emoji}\s]+/u, "").trim();
    fillRecipeDetails(fullText, currRecipe);
  }
});

const editBtn = document.getElementById("edit-btn");
editBtn.addEventListener("click", () => {
  // Prefer a data attribute for the recipe id/name, fallback to trimmed text
  console.log("Selected recipe:", currRecipe);
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
const closeInfoBtn = document.getElementById("info-close-btn");
closeInfoBtn.addEventListener("click", () => {
  recipeInfo.classList.add("hidden");
  recipeList.classList.remove("recipe-info-shown");

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
const favStar = document.getElementById("fav-star");

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  recipes[currRecipe].favorite = recFav;
  localStorage.setItem("recipes", JSON.stringify(recipes));
});
//FUNCTION

function loadData() {
  const savedCurrRecipe = localStorage.getItem("currRecipe");
  let currRecipe = savedCurrRecipe; // default if none saved

  const savedRecipes = localStorage.getItem("recipes");
  const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
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
}

function fillRecipeDetails(fullText, currRecipe) {
  recipeInfo.classList.remove("hidden");
  recipeList.classList.add("recipe-info-shown");
  console.log("currRecipe", currRecipe);
  console.log(recipes);
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

  recipeTitle.innerHTML = `${svgHTML} ${fullText}`;
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

function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("currRecipe");
}

//WIP add categories
//WIP add "No recipes added, click the + button to add recipes"
