document.addEventListener("DOMContentLoaded", () => {
  const ingredientInput = document.getElementById("ingredientInput");
  const searchBtn = document.getElementById("searchBtn");
  const recipesContainer = document.getElementById("recipes");
  const recipeDetailsContainer = document.getElementById("recipeDetails");

  const apiKey = "use your api key here";
  const apiUrlBase = "https://api.spoonacular.com/recipes/findByIngredients";
  const recipeDetailsUrl = "https://api.spoonacular.com/recipes";

  searchBtn.addEventListener("click", () => {
    const ingredients = ingredientInput.value.trim();

    if (!ingredients) {
      recipesContainer.innerHTML = "<p>Please enter some ingredients.</p>";
      return;
    }

    recipesContainer.innerHTML = "";
    const apiUrl = `${apiUrlBase}?ingredients=${ingredients}&number=8&apiKey=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          displayRecipes(data);
        } else {
          recipesContainer.innerHTML = "<p>No recipes found.</p>";
        }
      })
      .catch(() => {
        recipesContainer.innerHTML = "<p>Error fetching recipes.</p>";
      });
  });

  function displayRecipes(recipes) {
    recipesContainer.style.display = "grid";
    recipeDetailsContainer.style.display = "none";

    recipes.forEach((recipe) => {
      const recipeHTML = `
        <div class="recipe-card" data-recipe-id="${recipe.id}">
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
          <button class="view-recipe-btn" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      `;
      recipesContainer.insertAdjacentHTML("beforeend", recipeHTML);
    });

    const viewButtons = document.querySelectorAll(".view-recipe-btn");
    viewButtons.forEach((button) =>
      button.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-recipe-id");
        fetchRecipeDetails(recipeId);
      })
    );
  }

  function fetchRecipeDetails(recipeId) {
    recipesContainer.style.display = "none";
    recipeDetailsContainer.style.display = "block";

    const apiUrl = `${recipeDetailsUrl}/${recipeId}/information?apiKey=${apiKey}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          displayRecipeDetails(data);
        } else {
          recipeDetailsContainer.innerHTML =
            "<p>Could not fetch recipe details.</p>";
        }
      })
      .catch(() => {
        recipeDetailsContainer.innerHTML = "<p>Error fetching recipe details.</p>";
      });
  }

  function displayRecipeDetails(recipe) {
    const detailsHTML = `
      <div>
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>Ingredients</h3>
        <ul>
          ${recipe.extendedIngredients
            .map((ing) => `<li>${ing.original}</li>`)
            .join("")}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions || "No instructions provided."}</p>
        <button id="backToRecipes">Back to Recipes</button>
      </div>
    `;

    recipeDetailsContainer.innerHTML = detailsHTML;
    document
      .getElementById("backToRecipes")
      .addEventListener("click", () => {
        recipesContainer.style.display = "grid";
        recipeDetailsContainer.style.display = "none";
      });
  }
});
