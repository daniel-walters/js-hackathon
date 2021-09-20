
// const card = document.getElementById("cocktail-card");
// const cocktailApiBase = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?"

// // retrieves cocktail information based on its id
// function getCocktail(id) {
//     fetch(`${cocktailApiBase}i=${id}`)
//     .then(response => response.json())
//     .then(generateCard)
//     .catch(error => alert(error.message))
// }
// // adds child divs to cocktail-card
// function generateCard(data) {
//     console.log(data);
//     // want to retrieve name, img-url, ingredients, instructions about cocktail
//     const {strDrink: name, strInstructions: instructions, strDrinkThumb: imgUrl} = data.drinks[0];
//     console.log(name);
//     // get list of ingredients and save as array. filters any null values
//     const {strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15} = data.drinks[0];
//     const ingredientsUnfiltered = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, trIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15]
//     const ingredients = ingredientsUnfiltered.filter((item) => item)
//     // get list of measures and save as array. filters any null values
//     const {strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15} = data.drinks[0];
//     const measuresUnfiltered = [strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15];
//     const measures = measuresUnfiltered.filter((amount) => amount !== null);
//     console.log(ingredients)
//     console.log(measures)

//     card.innerHTML = `
//     <div class="child">
//         <h2>${name}</h2>
//         <img src="${imgUrl}" width="200px" class="card-image" alt="${name}"/>
//         <div id="spotify-widget"></div>
//     </div>
//     <div class="child">
//         <h3>ingredients</h3>
//         <ul>
//         ${generateIngredientList(ingredients, measures)}
//         </ul>
//     </div>
//     <div class="child">
//         <button type="button" id="add-to-list"> Add this to my List</button>
//     </div>
//     `
// }

// function generateIngredientList(ingredients, measures) {
//     let list = "";
//     ingredients.forEach((ingredient, index) => {
//         list += `<li>${ingredient}: ${measures[index]}</li>`
//     })
//     return list;
// }



