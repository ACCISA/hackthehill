// Elements for taking the snapshot
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

const searchForm = document.querySelector('form');
const searchResultDiv = document.getElementById("search-result-recipe");
const container = document.querySelector(".container");
const foodsImage = document.querySelector(".foods");
let searchQuery;
let searchType;
const APP_ID = "0afafdc7";
const APP_key = "69cb8af4aa436ea914b9305824fa8871";
const input = document.querySelector('input')
const searchIcon = document.querySelector('.search-icon');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

const takeSnap = () => {
    searchType = document.getElementById("search-type").checked
    context.drawImage(video, 0, 0, 640, 480);
    canvas.toBlob(upload, "image/jpeg");
}

function upload(file) {
    var formdata = new FormData();
    formdata.append("snap", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/vision", true);
    xhr.onload = function () {
        if (this.status = 200) {
            console.log(this.response);
        } else {
            console.error(xhr);
        }
        const result = this.response
        console.log(result)
        searchQuery = result
        if (searchType) {
            fetchAPI(result)
        } else {
            getNutritionData(result)
        }
    };
    xhr.send(formdata);
}


const getNutritionData = (result) => {
    var appId = "d1ee3d45";
    var appKey = "3c58b7f3ce63c623ef6fc3fa6ac534fa";
    var apiUrl = "https://api.edamam.com/api/nutrition-data?app_id=" + appId + "&app_key=" + appKey + "&ingr=" + ("1%20" + result);
    console.log(apiUrl)
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var nutritionDataDiv = document.getElementById("search-result-nutri");
            nutritionDataDiv.innerHTML = "<p>Calories: " + data.calories + "</p><p>Protein: " + data.totalNutrients.PROCNT.quantity.toFixed(2) + "g</p><p>Fat: " + data.totalNutrients.FAT.quantity.toFixed(2) + "g</p><p>Carbs: " + data.totalNutrients.CHOCDF.quantity.toFixed(2) + "g</p><p>Sugar: " + data.totalNutrients.SUGAR.quantity.toFixed(2) + "g</p><p>Fiber: " + data.totalNutrients.FIBTG.quantity.toFixed(2) + "g</p><p>Sodium: " + data.totalNutrients.NA.quantity.toFixed(2) + "mg</p>";
        })
        .catch(error => console.error(error));
}


async function fetchAPI() {
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&to=48&app_id=${APP_ID}&app_key=${APP_key}`;
    const response = await fetch(baseURL);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data);
    console.log(baseURL);
}

function generateHTML(results) {
    let generatedHTML = '';
    results.map(result => {
        let spaced = ""
        result.recipe.healthLabels.map(ingredient => {
            spaced += ingredient + "," + " ";
        })

        generatedHTML += ` <div class="item">
            <img src="${result.recipe.image}" alt="">
        <div class="flex-container">
            <h1 class="title">${result.recipe.label}</h1>
        </div>
        <div class="details">
            <p class="item-data">
            <ion-icon name="flame-outline"></ion-icon>
            Calories: ${result.recipe.calories.toFixed(0)} &nbsp; • <b>Restrictions</b> : ${result.recipe.dietLabels}</p>
            <p class="restrictions">${spaced.slice(0, -2)}</p>       
            <a class="view-button" target="_blank" href="${result.recipe.url}"><u>View Recipe</u></a>
            </div>
        </div> `
    })
    searchResultDiv.innerHTML = generatedHTML;
}
