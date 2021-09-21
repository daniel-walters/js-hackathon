
export const card = document.getElementById("cocktail-card");

//recommended = boolean true if being called from the recommended button
export const generateCard = (data, recommended) => {
    // want to retrieve name, img-url, ingredients, instructions about cocktail
    const {strDrink: name, strInstructions: instructions, strDrinkThumb: imgUrl, idDrink: id, strCategory: category} = data;
    // get list of ingredients and save as array. filters any null values
    const {strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15} = data;
    const ingredientsUnfiltered = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15]
    const ingredients = ingredientsUnfiltered.filter((item) => item)
    // get list of measures and save as array. filters any null values
    const {strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15} = data;
    const measuresUnfiltered = [strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15];
    const measures = measuresUnfiltered.filter((amount) => amount !== null);
    card.classList.add("show-card");
    card.innerHTML = `
    <div class="child">
        <h2 id="drink-name">${name}</h2>
        ${recommended ? "<p>(Recommended because you like " + category + "s)</p>": ""}
        <img src="${imgUrl}" width="200px" class="card-image" alt="${name}"/>
        <div id="spotify-widget">
            <h3 id="song-name"></h3>
            <a href="" id="song-link" target="_blank"></a>
            <button id="get-song-button">Pair with a Song!</button>
        </div>
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
    <div id="add-to-list-div" class="child-button">
        <button type="button" id="add-to-list"> Add this to my List</button>
    </div>
    `
    
    return [{id: id, name: name}, category];
}

export const generateIngredientList = (ingredients, measures) =>{
    let list = "";
    ingredients.forEach((ingredient, index) => {
        list += `<li>${ingredient}: ${measures[index]}</li>`
    })
    return list;
}

export const generateRecipe = (instructions) => {
    let steps = instructions.split(". ");
    let stepsHTML = "";
    steps.forEach((step) => {
        stepsHTML += `<li>${step}</li>`
    })
    return stepsHTML;
}