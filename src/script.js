//set click listener on search button and prevent page refresh
document.getElementById("search-form").addEventListener("click", (event) => {
    event.preventDefault();
    const searchBar = document.getElementById("search-bar");
    console.log(searchBar.value); //log out API response instead once integrated.
    searchBar.value = ""; //clear search bar
});

//set click listener on recommend drink button
document.getElementById("reco-button").addEventListener("click", () => {
    console.log("Recommend button pressed"); //call recommend function once integerated.
});


