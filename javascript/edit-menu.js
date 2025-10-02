const menuList = document.getElementById("menu-list");
const daySelect = document.getElementById("meal-day-input");
const categorySelect = document.getElementById("meal-category-input");
const recipeTitle = document.querySelector("h2");
const svgHTML = recipeTitle.querySelector("svg")?.outerHTML || "";

const savedMenu = localStorage.getItem("menu");
const menu = savedMenu ? JSON.parse(savedMenu) : {};

const savedRecipes = localStorage.getItem("recipes");
const recipes = savedRecipes ? JSON.parse(savedRecipes) : {};

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

let currRecipe;
populateMenu();
autoSelect();

function populateMenu() {
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
  for (const [key, info] of Object.entries(menu)) {
    const dayName =
      info.day && dayMap[info.day] ? dayMap[info.day] : dayMap.anyday;
    const course =
      info.course && courseMap[info.course] ? info.course : "unknown";
    organizedMenu[dayName][course].push(key); // keep internal key
  }

  // generate HTML
  if (Object.keys(menu).length === 0) {
    menuList.innerHTML =
      "<p>Nothing is added to your menu. Add some on My Recipes!</p>";
  } else {
    menuList.innerHTML = "";
  }

  for (const dayKey in dayMap) {
    const dayName = dayMap[dayKey];
    const hasRecipes = Object.values(organizedMenu[dayName]).some(
      (arr) => arr.length > 0
    );
    if (!hasRecipes) continue;

    const dayHeader = document.createElement("h3");
    dayHeader.textContent = dayName;
    menuList.appendChild(dayHeader);

    for (const course in courseMap) {
      const recipesArr = organizedMenu[dayName][course];
      if (recipesArr.length === 0) continue;

      const courseHeader = document.createElement("h4");
      courseHeader.textContent = courseMap[course];
      menuList.appendChild(courseHeader);

      const ul = document.createElement("ul");
      recipesArr.forEach((key) => {
        let li = document.createElement("li");
        // Display the original recipe name, not the duplicate key
        const originalName = key.replace(/ Copy.*$/, "");
        li.textContent = originalName;
        li.dataset.key = key; // keep the real key hidden

        ul.appendChild(li);
      });
      menuList.appendChild(ul);
    }
  }
}

//select list item
menuList.addEventListener("click", (event) => {
  // Find the closest <li> ancestor of whatever was clicked
  const clickedLi = event.target.closest("li");
  // If click was outside an li or the li isn't in this list, ignore
  if (!clickedLi || !menuList.contains(clickedLi)) return;

  if (clickedLi.classList.contains("selected-li")) {
    // Deselect
    // clickedLi.classList.remove("selected-li");
    // currRecipe = null;
    // console.log("Deselected recipe");
  } else {
    // Remove previous selection (only one at a time)
    const prev = menuList.querySelector(".selected-li");
    if (prev) prev.classList.remove("selected-li");

    // Select clicked one
    clickedLi.classList.add("selected-li");
    currRecipe = clickedLi.dataset.key;
    fillPlaceholder(currRecipe);
  }
});

const saveBtn = document.getElementById("submit-btn");
saveBtn.addEventListener("click", (event) => {
  menu[currRecipe] = {
    name: currRecipe,
    day: daySelect.value || "Unknown",
    course: categorySelect.value || recipes[currRecipe].type || "Unknown",
  };
  // If recipe type is unknown, update it
  if (recipes[currRecipe] && recipes[currRecipe].type === "unknown") {
    recipes[currRecipe].type = selectedCourse;
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  localStorage.setItem("menu", JSON.stringify(menu));
  populateMenu();
});

const duplicateBtn = document.getElementById("duplicate-btn");
let duplicateName = null;
duplicateBtn.addEventListener("click", (event) => {
  if (!currRecipe) return;

  // Generate a unique name for the duplicate
  let newName = currRecipe + " Copy";
  let counter = 1;
  while (menu[newName]) {
    counter++;
    newName = `${currRecipe} Copy ${counter}`;
  }

  // Duplicate the menu entry
  menu[newName] = { ...menu[currRecipe] }; // shallow copy
  menu[newName].name = menu[currRecipe].name; // update the name property
  menu[newName].day = menu[currRecipe].day;
  menu[newName].course = menu[currRecipe].course;

  // Store the duplicate name for later reference
  //   duplicateName = newName;

  // Save and refresh
  localStorage.setItem("menu", JSON.stringify(menu));

  // Re-populate menu and auto-select the new duplicate
  populateMenu();
  currRecipe = menu[newName].name;
  selectRecipe(currRecipe);
  fillPlaceholder(currRecipe);
});

const removeBtn = document.getElementById("remove-from-menu-btn");
removeBtn.addEventListener("click", (event) => {
  if (!currRecipe) return; // nothing selected

  // Remove the menu entry
  //   console.log("currRecipe is", menu[currRecipe]);
  //   console.log("duplicateName is", duplicateName);
  delete menu[currRecipe];

  // Save updated menu to localStorage
  localStorage.setItem("menu", JSON.stringify(menu));

  // Clear selection
  currRecipe = null;

  // Optionally reset placeholders
  recipeTitle.innerHTML = svgHTML;
  daySelect.value = "anyday";
  categorySelect.value = "";

  // Refresh the menu list
  populateMenu();
  autoSelect();
});

//functions++
function fillPlaceholder(currRecipe) {
  //   const originalName = currRecipe.replace(/ Copy.*$/, "");
  recipeTitle.innerHTML = `${svgHTML} ${
    recipes[menu[currRecipe]?.name]?.emoji || "🥄"
  } ${menu[currRecipe]?.name}`;

  // Fill category
  const courseValue =
    menu[currRecipe]?.course || recipes[currRecipe]?.type || "";
  categorySelect.value = courseValue === "unknown" ? "" : courseValue;

  // Fill day safely
  const dayKey = menu[currRecipe]?.day || "anyday";
  daySelect.value = dayKey;
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
  currRecipe = firstLi.dataset.key;
  fillPlaceholder(currRecipe);
}

function selectRecipe(recipeName) {
  if (!recipeName) return;

  // Find the <li> whose text matches the recipe name
  const li = Array.from(menuList.querySelectorAll("li")).find(
    (el) => el.textContent.trim() === recipeName
  );

  if (!li) return; // recipe not found in the list

  // Remove previous selection
  const prev = menuList.querySelector(".selected-li");
  if (prev) prev.classList.remove("selected-li");

  // Select this one
  li.classList.add("selected-li");
  currRecipe = recipeName;
  fillPlaceholder(currRecipe);
}

//clear data
function clearData() {
  localStorage.removeItem("recipes");
  localStorage.removeItem("menu");
}

//wip
//save course to recipe type if its unknown
//placeholder "Nothing is added to your menu. Add some on My Recipes!"
