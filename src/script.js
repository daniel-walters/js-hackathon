import { getCocktailFromSearch, getKeyWithHighestValue } from "./util-dan.js";
import {card, generateCard } from "./cocktail-card.js";

const COCKTAIL_BASE_API = "https://www.thecocktaildb.com/api/json/v1/1"
const likedDrinks = retrieveList();
const likedCategoriesFrequencies = retrieveFreq();

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
            .then(addEventsToCocktailCard)
            .catch(error => console.error(error))
            .finally(() => searchBar.value = "");
    }
});

//set click listener on recommend drink button
document.getElementById("reco-button").addEventListener("click", () => {
    console.log("Recommend button pressed"); //call recommend function once integerated.
    const favCat = getKeyWithHighestValue(likedCategoriesFrequencies);
    if (favCat) {
        fetch(`${COCKTAIL_BASE_API}/filter.php?c=${favCat}`)
            .then(response => response.json())
            .then(getCocktailFromSearch)
            .then(cocktail => getCocktailById(cocktail.idDrink))
            .catch(error => console.error(error));
    }    
});

//=======================================
// SEARCH COCKTAIL BY ID
//=======================================


// retrieves cocktail information based on its id
function getCocktailById(id) {
    fetch(`${COCKTAIL_BASE_API}/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => generateCard(data.drinks[0]))
    .catch(error => alert(error.message))
}

//adds events to things that appear after cocktail card has been filled
//drink info = [{id, name}, category]
function addEventsToCocktailCard(drinkInfo) {
    document.getElementById("add-to-list").addEventListener("click", () => {
        likedDrinks.push(drinkInfo[0]);
        localStorage.setItem("drinks-list", JSON.stringify(likedDrinks));
        console.log(likedDrinks);

        //add/increment liked category frequency
        likedCategoriesFrequencies[drinkInfo[1]] = (likedCategoriesFrequencies[drinkInfo[1]] ?? 0) + 1;
        localStorage.setItem("category-freq", JSON.stringify(likedCategoriesFrequencies));
        console.log(likedCategoriesFrequencies);
    })
}

//=======
//LOCAL STORAGE
//========
//retrieve list from local storage or return empty array
function retrieveList() {
    const listString = localStorage.getItem("drinks-list");
    return JSON.parse(listString || "[]");
}


// ======================
// LIST OF LIKED DRINKS
// ======================

document.getElementById("show-liked-drinks").addEventListener("click", () => {
    let myList = retrieveList();
    console.log(myList);
    if(myList.length == 0 || !myList) {
        return console.log("currently no item in list");
    }
    // create divs with cocktail name and button to remove from list
    // also button to show more, which changes div to card format
    let likedDrinksDiv = document.getElementById("liked-drinks")
    likedDrinksDiv.innerHTML = "";
    myList.forEach((drink) => {
        likedDrinksDiv.innerHTML += displayLikedDrink(drink);
    })

})

const displayLikedDrink = (drink) => {
    // take drink object and turn it into a HTML
    const drinkHtml = `<div>
        <h3>${drink.name}</h3>
        <button id="show-drink${drink.id}">Show more</button>
        <button id="remove-from-list">Remove from List</button>
        </div>`
    return drinkHtml;
}


function retrieveFreq() {
    const freqString = localStorage.getItem("category-freq");
    return JSON.parse(freqString || "{}");
}

