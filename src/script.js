import { getCocktailFromSearch } from "./util-dan.js";

const COCKTAIL_BASE_API = "https://www.thecocktaildb.com/api/json/v1/1"


//set click listener on search button and prevent page refresh
document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchBar = document.getElementById("search-bar");
    //make get request for search term, log the response then clear the search bar
    if (searchBar.value) {
        fetch(`${COCKTAIL_BASE_API}/search.php?s=${searchBar.value.toLowerCase()}`)
            .then(response => response.json())
            .then(getCocktailFromSearch)
            .then(generateCard)
            .catch(error => console.error(error))
            .finally(() => searchBar.value = "");
    }
});

//set click listener on recommend drink button
document.getElementById("reco-button").addEventListener("click", () => {
    console.log("Recommend button pressed"); //call recommend function once integerated.
});


//=======================================
// COCKTAIL-CARD AND SEARCH BY ID
//=======================================

const card = document.getElementById("cocktail-card");


// retrieves cocktail information based on its id
function getCocktailById(id) {
    fetch(`${COCKTAIL_BASE_API}/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => generateCard(data.drinks[0]))
    .catch(error => alert(error.message))
}
// adds child divs to cocktail-card
function generateCard(data) {
    // want to retrieve name, img-url, ingredients, instructions about cocktail
    const {strDrink: name, strInstructions: instructions, strDrinkThumb: imgUrl} = data;
    // get list of ingredients and save as array. filters any null values
    const {strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15} = data;
    const ingredientsUnfiltered = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15]
    const ingredients = ingredientsUnfiltered.filter((item) => item)
    // get list of measures and save as array. filters any null values
    const {strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15} = data;
    const measuresUnfiltered = [strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15];
    const measures = measuresUnfiltered.filter((amount) => amount !== null);

    card.innerHTML = `
    <div class="child">
        <h2>${name}</h2>
        <img src="${imgUrl}" width="200px" class="card-image" alt="${name}"/>
        <div id="spotify-widget"></div>
    </div>
    <div class="child">
        <h3>ingredients</h3>
        <ul>
        ${generateIngredientList(ingredients, measures)}
        </ul>
        <h3>How to Make it</h3>
        <ul>
        ${generateRecipe(instructions)}
        </ul>

    </div>
    <div class="child">
        <button type="button" id="add-to-list"> Add this to my List</button>
    </div>
    `
}

function generateIngredientList(ingredients, measures) {
    let list = "";
    ingredients.forEach((ingredient, index) => {
        list += `<li>${ingredient}: ${measures[index]}</li>`
    })
    return list;
}

const generateRecipe = (instructions) => {
    let steps = instructions.split(". ");
    let stepsHTML = "";
    steps.forEach((step) => {
        stepsHTML += `<li>${step}</li>`
    })
    return stepsHTML;
}


