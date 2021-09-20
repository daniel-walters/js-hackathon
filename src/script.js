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
            .then(cocktail => getCocktailById(cocktail.idDrink, true))
            .catch(error => console.error(error));
    }    
});

//=======================================
// SEARCH COCKTAIL BY ID
//=======================================


// retrieves cocktail information based on its id. recommended = optional boolean if coming from recommended
function getCocktailById(id, recommended) {
    fetch(`${COCKTAIL_BASE_API}/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => generateCard(data.drinks[0], recommended))
    .catch(error => console.error(error.message))
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

function retrieveFreq() {
    const freqString = localStorage.getItem("category-freq");
    return JSON.parse(freqString || "{}");
}

// ======================
// LIST OF LIKED DRINKS
// ======================


const generateLikedDrinkList = () => {

    document.getElementById("show-liked-drinks").addEventListener("click", () => {

        let myList = retrieveList();
        console.log(myList);
        if(myList.length == 0 || !myList) {
            return console.log("currently no item in list");
        }
        // create divs with cocktail name and button to remove from list
        let likedDrinksDiv = document.getElementById("liked-drinks")
        // empty list on display first
        likedDrinksDiv.innerHTML = "";
        myList.forEach((drink) => {
            // add html to display drink
            likedDrinksDiv.innerHTML += displayLikedDrink(drink);
            // and add event listener to remove button
            console.log(drink);
            addEventToDrinkList(drink);
        })
    });
}

 

const displayLikedDrink = (drink) => {
    // take drink object and turn it into a HTML
    const drinkHtml = `<div id="div-${drink.id}">
        <h3>${drink.name}</h3>
        <button id="show-drink-${drink.id}">Show more</button>
        <button id="remove-${drink.id}">Remove from List</button>
        </div>`
    return drinkHtml;
}


// click to show list of liked drinks on display
document.getElementById("show-liked-drinks").addEventListener("click", generateLikedDrinkList)



// ================================
// REMOVE DRINK FROM LOCSALSTORAGE
// ================================

function addEventToDrinkList(drink) {
    document.getElementById(`remove-${drink.id}`).addEventListener("click", () => {
        console.log(drink)
        // remove drink from local storage
        let newList = likedDrinks.filter((item) => item.id !== drink.id);
        localStorage.setItem("drinks-list", JSON.stringify(newList));
        // remove category count from localstorage
        removeCategoryFrequency(drink.id);
        // remove the drink from browser
        let drinkDiv = document.getElementById(`div-${drink.id}`)
        drinkDiv.remove();
    })
}

const removeCategoryFrequency = (id) => {
    fetch(`${COCKTAIL_BASE_API}/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => data.drinks[0].strCategory)
        .then(decrementCategoryAndSave)
        .catch(error => console.error(error.message))
}

const decrementCategoryAndSave = (category) => {
    console.log(category);
    likedCategoriesFrequencies[category] -= 1;
    localStorage.setItem("category-freq", JSON.stringify(likedCategoriesFrequencies));
}
