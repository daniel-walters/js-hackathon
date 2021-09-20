import { getCocktailFromSearch, getKeyWithHighestValue, getRandomNumber } from "./util-dan.js";
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
    let tempLikedCats = Object.assign({}, likedCategoriesFrequencies);
    let favCat = getKeyWithHighestValue(tempLikedCats);
    //pseudo-weighted-random number generator
    if (getRandomNumber(1, 2) === 2) {
        delete tempLikedCats[favCat];
        favCat = getKeyWithHighestValue(tempLikedCats);
        if (getRandomNumber(1, 3) == 3) {
            delete tempLikedCats[favCat];
            favCat = getKeyWithHighestValue(tempLikedCats);
        }
    }
     
    if (favCat) {
        fetch(`${COCKTAIL_BASE_API}/filter.php?c=${favCat}`)
            .then(response => response.json())
            .then(getCocktailFromSearch)
            .then(cocktail => getCocktailById(cocktail.idDrink, true))
            .catch(error => console.error(error));
    }   
    console.log(likedCategoriesFrequencies); 
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


const showOrHideLikedDrinkList = () => {
    let myList = retrieveList();
    let showFavesButton = document.getElementById("show-liked-drinks");
    let likedDrinksDiv = document.getElementById("liked-drinks")
    if (showFavesButton.classList.contains("visible")) {
        // if favourites list is already being displayed remove it 
        likedDrinksDiv.innerHTML = "";
        showFavesButton.textContent = "Hide Favourites";
    } else {
        // 
        showFavesButton.textContent = "Show me my Favourites!";
        console.log(myList);
        if(myList.length == 0 || !myList) {
            console.log("currently no item in list");
            likedDrinksDiv.innerHTML = `<p>You currently have no favourites</p>`;
            return
        }
        // empty list on display first
        likedDrinksDiv.innerHTML = `<h2 class="subtitle">My Favourites:</h2>`;
        myList.forEach((drink) => {
            // add html to display drink
            likedDrinksDiv.innerHTML += displayLikedDrink(drink);
            // and add event listener to remove button
            console.log(drink);
            addEventToDrinkList(drink);
        })
    }
    showFavesButton.classList.toggle("visible");
}

 

const displayLikedDrink = (drink) => {
    // take drink object and turn it into a HTML

    const drinkHtml = `<div id="div-${drink.id}" class="div-list-item">
        <h3 class="list-item-name">${drink.name}</h3>
        <div class="list-buttons">
            <button id="show-drink-${drink.id}" class="show-details-button">Details</button>
            <button id="remove-${drink.id}" class="delete-button">Remove</button>
        </div>
        </div>`
    return drinkHtml;
}


// click to show list of liked drinks on display
document.getElementById("show-liked-drinks").addEventListener("click", showOrHideLikedDrinkList)



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

// ================================
// CLICK ON SHOW MORE IN LIKED LIST
// ================================

