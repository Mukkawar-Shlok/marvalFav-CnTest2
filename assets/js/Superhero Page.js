//globals
const apiKey = '813aa37b3b4a23bd88d5fb113f8aa547';
const privateKey = '31c40be2a5ece9e55e17e0689a38142d9b1f8553';
const baseUrl = 'https://gateway.marvel.com/v1/public/';
// const md5 = require("crypto-js/md5");


//global var for storing charachter id that needs to be loaded
var charachterIdLoad = '';
window.onload = function () {
    // Get the selected character ID from the localStorage
    charachterIdLoad = localStorage.getItem('charId');
};

//arrays to store data
let characters_array = [];
function generateHash(ts) {
    const hash = CryptoJS.MD5(ts + privateKey + apiKey);
    return hash;
}

function fetchCharacters() {
    const ts = new Date().getTime().toString();
    const hash = generateHash(ts);

    const url = `${baseUrl}characters?apikey=${apiKey}&ts=${ts}&hash=${hash}`;
    console.log("API Request URL:", url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            displayCharacters(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
fetchCharacters();

function displayCharacters(data) {
    characters_array = data.data.results;
    const charactersList = document.getElementById('characters-list');

    // Check if the API request was successful
    if (data && data.data && data.data.results) {
        const characters = data.data.results;
        characters.forEach(character => {
            const characterCard = createCharacterCard(character);
            charactersList.appendChild(characterCard);
        });
    } else {
        charactersList.textContent = 'Error fetching characters.';
    }
}
function createCharacterCard(character) {
    if (character.id == charachterIdLoad) {
        const characterCardHTML = `
    <div class="col-12  mb-4">
  <div class="card h-100 custom-card">
    <div class="row no-gutters">
      <!-- Image container on the left side -->
      <div class="col-md-4">
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="card-img" alt="${character.name}">
      </div>
      <!-- Character description on the right side -->
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          ${character.description ? `<p class="card-text">${character.description}</p>` : '<p class="card-text">No description available.</p>'}
        </div>
      </div>
    </div>
  </div>
</div>
  `;
        // Convert the card HTML string to a DOM element
        const characterCard = document.createRange().createContextualFragment(characterCardHTML);


        return characterCard;
    } else {
        const characterCard = document.createRange().createContextualFragment('');
        return characterCard;
    }
}
