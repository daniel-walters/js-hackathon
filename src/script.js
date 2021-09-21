import { getCocktailFromSearch, getKeyWithHighestValue } from "./util-dan.js";
import {card, generateCard } from "./cocktail-card.js";

const COCKTAIL_BASE_API = "https://www.thecocktaildb.com/api/json/v1/1";
const LAST_FM_BASE_API = "http://ws.audioscrobbler.com/2.0";
const LAST_FM_KEY = "2857e445e341a103eb9da0bac1a29ad3";
let likedDrinks = retrieveList();
let likedCategoriesFrequencies = retrieveFreq();

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
            .finally(() => {
                searchBar.value = "";
                hideLikedDrinks();
            });
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
            .catch(error => console.error(error))
            .finally(() => hideLikedDrinks());
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
    .then(addEventsToCocktailCard)
    .catch(error => console.error(error.message))
    .finally(() => hideLikedDrinks());
}

//adds events to things that appear after cocktail card has been filled
//drink info = [{id, name}, category]
function addEventsToCocktailCard(drinkInfo) {
    document.getElementById("get-song-button").style.visibility = "visible";

    document.getElementById("add-to-list").addEventListener("click", () => {
        if (!likedDrinks.some(drink => drink.name === drinkInfo[0].name)) {
            likedDrinks.push(drinkInfo[0]);
            localStorage.setItem("drinks-list", JSON.stringify(likedDrinks));
            console.log(likedDrinks);

            //add/increment liked category frequency
            likedCategoriesFrequencies[drinkInfo[1]] = (likedCategoriesFrequencies[drinkInfo[1]] ?? 0) + 1;
            localStorage.setItem("category-freq", JSON.stringify(likedCategoriesFrequencies));
            console.log(likedCategoriesFrequencies);
        }
        else {
            console.log("duplicate");
        }
    });

    document.getElementById("get-song-button").addEventListener("click", () => {
        console.log("getting song");
        let drinkName = document.getElementById("drink-name").textContent;
        console.log(drinkName);

        fetch(`${LAST_FM_BASE_API}/?method=track.search&track=${drinkName}&api_key=${LAST_FM_KEY}&format=json`)
            .then(response => response.json())
            .then(data => data.results.trackmatches.track[0])
            .then(addSongInfo)
            .catch(error => {
                document.getElementById("song-name").textContent = "Sorry, we couldn't find you a song :(";
            });
    })
}
//takes song object from last.fm api response
function addSongInfo(song) {
    console.log(song);
    if (song) {
        const songLink = document.getElementById("song-link");
        document.getElementById("song-name").textContent = `${song.name} by ${song.artist.name ?? song.artist}`;
        songLink.textContent = "Check it out on Last.FM";
        songLink.href = song.url;
        document.getElementById("get-song-button").style.visibility = "hidden";
    } else {
        fetch(`${LAST_FM_BASE_API}/?method=chart.gettoptracks&api_key=${LAST_FM_KEY}&format=json`)
            .then(response => response.json())
            .then(data => data.tracks.track[getRandomNumber(0, data.tracks.track.length - 1)])
            .then(addSongInfo)
            .catch(error => console.error(error.message));
    }
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


const showOrHideLikedDrinkList = (event) => {
    event.preventDefault();
    let myList = retrieveList();
    let showFavesButton = document.getElementById("show-liked-drinks");
    let likedDrinksDiv = document.getElementById("liked-drinks");
    console.log(likedDrinksDiv.children)
    if (likedDrinksDiv.children.length > 0) {
        // if favourites list is already being displayed remove it 
        likedDrinksDiv.innerHTML = "";
        showFavesButton.textContent = "Show me my Favourites!";
    } else {
        // 
        showFavesButton.textContent = "Hide Favourites";
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
        })
        myList.forEach((drink) => {
            addEventsToDrinkList(drink);
        })
    }
   
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

function addEventsToDrinkList(drink) {
    removeDrinkButton(drink);
    showDrinkdetail(drink.id);
}

function removeDrinkButton(drink) {
     document.getElementById(`remove-${drink.id}`).addEventListener("click", () => {
        console.log(drink)
        removeCategoryFrequency(drink.id);
        removeDrinkFromBrowser(drink.id);
        removeDrinkFromLocalStorage(drink.id);
    })
}

function removeDrinkFromLocalStorage(id) {
    likedDrinks = likedDrinks.filter((item) => item.id !== id);
    localStorage.setItem("drinks-list", JSON.stringify(likedDrinks));
}

function removeDrinkFromBrowser(id) {
    let drinkDiv = document.getElementById(`div-${id}`)
    drinkDiv.remove();
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
    if (likedCategoriesFrequencies[category] > 0) likedCategoriesFrequencies -= 1;
    localStorage.setItem("category-freq", JSON.stringify(likedCategoriesFrequencies));
}

// ==============================
// SHOW FAVOURITE DRINK IN DETAIL
// ==============================

function showDrinkdetail(id) {
    return document.getElementById(`show-drink-${id}`).addEventListener("click", (e) => {
        e.preventDefault();
        getCocktailById(id);
    })
}

//UI CLEANUP
function hideLikedDrinks() {
    let likedDrinksDiv = document.getElementById("liked-drinks") ?? false;
    if (likedDrinksDiv) {
        let showFavesButton = document.getElementById("show-liked-drinks");
        showFavesButton.textContent = "Show me my Favourites!";
        likedDrinksDiv.innerHTML = "";
    }
}

