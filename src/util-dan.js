//get a random number between min and max (inclusive)
const getRandomNumber = (min ,max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//INPUT: data: object (response from search)
//OUTPUT: drinksArray[randomIndex]: object (random index of drinks array)
export const getCocktailFromSearch = (data) => {
    const drinksArray = data.drinks;
    const randomIndex = getRandomNumber(0, drinksArray.length - 1);
    
    return drinksArray[randomIndex];
}

export const getKeyWithHighestValue = (obj) => {
    const maxValue = Math.max(...(Object.values(obj)));
    const correspondingKey = Object.keys(obj).find(key => obj[key] === maxValue);
    return correspondingKey;
}