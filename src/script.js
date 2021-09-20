const COCKTAIL_BASE_API = "https://www.thecocktaildb.com/api/json/v1/1"

//set click listener on search button and prevent page refresh
document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchBar = document.getElementById("search-bar");
    //make get request for search term, log the response then clear the search bar
    if (searchBar.value) {
        fetch(`${COCKTAIL_BASE_API}/search.php?s=${searchBar.value.toLowerCase()}`)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
            .finally(() => searchBar.value = "");
    }
});

//set click listener on recommend drink button
document.getElementById("reco-button").addEventListener("click", () => {
    console.log("Recommend button pressed"); //call recommend function once integerated.
});
