const recNameInput = document.querySelector("#recipe-form #recipe-name");
const recServesInput = document.getElementById("serves");
const recTimeInput = document.getElementById("cook-time");
const recTypeInput = document.getElementById("meal-type");
const recMethodInput = document.getElementById("method-input");
const recCreatorInput = document.getElementById("creator");
const recLinkInput = document.getElementById("recipe-link");
let recipeNameUI = document.querySelector("#recipe-form h2 span");
let recipeEmojiUI = document.getElementById("select-emoji");
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

//LOAD DATA
const savedCurrRecipe = localStorage.getItem("currRecipe");
let currRecipe = savedCurrRecipe;
let pageHistory = loadPageHistory();

tabsUI();

let addClicked = localStorage.getItem("addClicked") === "true";

if (addClicked) {
  newRecipeUI();
  addClicked = false;
  localStorage.setItem("addClicked", "false");
}
console.log(addClicked);

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};
let recipe = recipes[currRecipe];

console.log(recipes);

recipeNameUI.textContent = currRecipe || "New Recipe";
recipeEmojiUI.textContent = recipes[currRecipe]?.emoji || "🥄";

updatePlaceholders();

const editRecipeBtn = document.querySelector("#recipe-form #submit-btn");
editRecipeBtn.addEventListener("click", () => {
  let inputName = recNameInput.value.trim();

  let newRecipe = isNewRecipe();
  console.log("newRecipe is", newRecipe);
  if (!inputName && newRecipe) {
    alert("Recipe name required");
    return;
  }

  if (newRecipe) {
    //New recipe
    recName = inputName;
    recServes = recServesInput.value || "Unknown";
    recTime = recTimeInput.value || "Unknown";
    recType = recTypeInput.value || "Unknown";
    recMethod = recMethodInput.value || "Unknown";
    recCreator = recCreatorInput.value || "Unknown";
    recLink = recLinkInput.value || "Unknown";
    recIngreds = {};
    currRecipe = recName;
  } else {
    //Editing current recipe
    const prevName = currRecipe;
    currRecipe = inputName || recipe.name;

    if (currRecipe !== prevName) {
      recipes[currRecipe] = { ...recipes[prevName] }; // copy old recipe
      delete recipes[prevName];
    }
    // recName = inputName || recipe.name;
    recServes = recServesInput.value || recipe?.serves || "Unknown";
    recTime = recTimeInput.value || recipe?.time || "Unknown";
    recType = recTypeInput.value || recipe?.type || "Unknown";
    recMethod = recMethodInput.value || recipe?.method || "Unknown";
    recCreator = recCreatorInput.value || recipe?.creator || "Unknown";
    recLink = recLinkInput.value || recipe?.link || "Unknown";
    recIngreds = recipes[currRecipe]?.ingredients || {};
  }

  recipeNameUI.textContent = currRecipe;
  recipeEmojiUI.textContent = selectedEmoji || "🥄";

  console.log("selectedEmoji is", selectedEmoji);
  recipes[currRecipe] = {
    emoji: selectedEmoji,
    name: currRecipe,
    serves: recServes || "Unknown",
    time: recTime || "Unknown",
    type: recType || "Unknown",
    method: recMethod || "Unknown",
    creator: recCreator || "Unknown",
    link: recLink || "Unknown",
    ingredients: recIngreds,
    favorite: recFav,
  };

  saveInfo();
  // addClicked = false;
  console.log(recipes);
});

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
      console.log("Selected emoji:", selectedEmoji);
    });
  });

  const emojiSaveBtn = document.getElementById("select-emoji-btn");
  // hide popup and change ui
  emojiSaveBtn.addEventListener("click", () => {
    emojiPopup.classList.add("hidden");
    recipeEmojiUI.textContent = selectedEmoji || "🥄";
  });
});

//close
const closeBtn = document.getElementById("larger-close-btn");
let closeBtnURL = "my-recipes.html"; // default

const directedFrom = localStorage.getItem("directedFrom");
if (directedFrom === "myMenu") {
  closeBtnURL = "my-menu.html"; // make sure the file name matches
}

closeBtn.addEventListener("click", (event) => {
  event.preventDefault(); // prevent the default <a> behavior
  localStorage.removeItem("directedFrom");
  localStorage.removeItem("currRecipe");
  window.location.href = closeBtnURL; // manually navigate
});

//favorite
const favStar = document.getElementById("fav-star");

let recFav = recipes[currRecipe]?.favorite || false;

if (recFav) {
  favStar.classList.add("favorited");
} else {
  favStar.classList.remove("favorited");
}

favStar.addEventListener("click", () => {
  favStar.classList.toggle("favorited");
  recFav = favStar.classList.contains("favorited"); // true if favorited, false otherwise

  if (currRecipe && recipes[currRecipe]) {
    recipes[currRecipe].favorite = recFav;
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
});

// When #add-svg is clicked, force newRecipe to true
const addBtn = document.getElementById("add-svg");

addBtn.addEventListener("click", () => {
  addClicked = true;
  newRecipeUI();
});

// FUNCTIONS

function updatePlaceholders() {
  //update placeholders if values exist
  if (currRecipe) {
    recNameInput.placeholder =
      !currRecipe || currRecipe === "Untitled" ? "" : recipe.name;
    recServesInput.placeholder =
      !recipe.serves || recipe.serves === "Unknown" ? "" : recipe.serves;
    recTimeInput.placeholder =
      !recipe.time || recipe.time === "Unknown" ? "" : recipe.time;
    recCreatorInput.placeholder =
      !recipe.creator || recipe.creator === "Unknown" ? "" : recipe.creator;
    recLinkInput.placeholder =
      !recipe.link || recipe.link === "Unknown" ? "" : recipe.link;
    // For select dropdowns
    recTypeInput.value =
      !recipe.type || recipe.type === "Unknown" ? "" : recipe.type;
    recMethodInput.value =
      !recipe.method || recipe.method === "Unknown" ? "" : recipe.method;
  }
}

function newRecipeUI() {
  recipeNameUI.textContent = "New Recipe";

  //clear name
  recNameInput.value = "";
  recNameInput.placeholder = "";

  clearValues();
  clearPlaceholders();
}

function clearValues() {
  recServesInput.value = "";
  recTimeInput.value = "";
  recTypeInput.value = "";
  recMethodInput.value = "";
  recCreatorInput.value = "";
  recLinkInput.value = "";
}

function clearPlaceholders() {
  recServesInput.placeholder = "";
  recTimeInput.placeholder = "";
  recCreatorInput.placeholder = "";
  recLinkInput.placeholder = "";
}

function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("currRecipe");

  currRecipe = null;
  recName = "";
  recServes = "";
  recTime = "";
  recType = "";
  recMethod = "";
  recCreator = "";
  recLink = "";
  recIngreds = {};
}

function saveInfo() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("currRecipe", currRecipe);
}

function isNewRecipe() {
  return Object.keys(recipes).length === 0 || addClicked;
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
