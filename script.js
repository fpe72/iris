"use strict";

// Array de objetos con la información de cada capital
const capitals = [
  { country: "España", city: "Madrid" },
  { country: "Francia", city: "París" },
  { country: "Alemania", city: "Berlín" },
  { country: "Italia", city: "Roma" },
  { country: "Portugal", city: "Lisboa" },
  { country: "Bélgica", city: "Bruselas" },
  { country: "Países Bajos", city: "Ámsterdam" },
  { country: "Suiza", city: "Berna" },
  { country: "Austria", city: "Viena" },
  { country: "Suecia", city: "Estocolmo" },
  { country: "Noruega", city: "Oslo" },
  { country: "Dinamarca", city: "Copenhague" },
  { country: "Finlandia", city: "Helsinki" },
  { country: "Polonia", city: "Varsovia" },
  { country: "Grecia", city: "Atenas" },
  { country: "Hungría", city: "Budapest" },
  { country: "Irlanda", city: "Dublín" },
  { country: "República Checa", city: "Praga" },
  { country: "Eslovaquia", city: "Bratislava" },
  { country: "Eslovenia", city: "Liubliana" },
  { country: "Estonia", city: "Tallin" },
  { country: "Letonia", city: "Riga" },
  { country: "Lituania", city: "Vilna" },
  { country: "Rumanía", city: "Bucarest" },
  { country: "Bulgaria", city: "Sofía" },
  { country: "Serbia", city: "Belgrado" },
  { country: "Croacia", city: "Zagreb" },
  { country: "Bosnia y Herzegovina", city: "Sarajevo" },
  { country: "Macedonia del Norte", city: "Skopie" },
  { country: "Albania", city: "Tirana" },
  { country: "Islandia", city: "Reikiavik" },
  { country: "Ucrania", city: "Kiev" }
];

let score = 0;
let attempts = 3;
let currentCapital = null;

// Función para normalizar cadenas eliminando acentos y convirtiendo a minúsculas
function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Selecciona aleatoriamente una capital
function getRandomCapital() {
  const randomIndex = Math.floor(Math.random() * capitals.length);
  return capitals[randomIndex];
}

// Carga la imagen de Wikipedia y prepara la pregunta
function askQuestion() {
  currentCapital = getRandomCapital();
  const cityName = currentCapital.city;
  // URL de la API REST de Wikipedia para obtener el resumen de la página
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.thumbnail && data.thumbnail.source) {
        document.getElementById("cityImage").src = data.thumbnail.source;
      } else {
        document.getElementById("cityImage").src = "https://via.placeholder.com/800x600?text=No+Image";
      }
    })
    .catch(error => {
      console.error("Error fetching image:", error);
      document.getElementById("cityImage").src = "https://via.placeholder.com/800x600?text=No+Image";
    });
  
  // Limpia los campos y oculta el botón de "Siguiente pregunta"
  document.getElementById("cityAnswer").value = "";
  document.getElementById("countryAnswer").value = "";
  document.getElementById("message").textContent = "";
  document.getElementById("next").style.display = "none";
}

// Verifica la respuesta del usuario, comparando sin tildes
function checkAnswer() {
  const userCity = document.getElementById("cityAnswer").value.trim();
  const userCountry = document.getElementById("countryAnswer").value.trim();
  const correctCity = currentCapital.city;
  const correctCountry = currentCapital.country;
  
  if (
    normalizeString(userCity) === normalizeString(correctCity) &&
    normalizeString(userCountry) === normalizeString(correctCountry)
  ) {
    score++;
    document.getElementById("message").textContent = "✅ ¡Correcto! +1 punto";
    document.getElementById("message").style.color = "#28a745";
  } else {
    score--;
    attempts--;
    let errorMessage = `❌ Incorrecto. ${correctCity} es la capital de ${correctCountry}.`;
    if (attempts === 0) {
      errorMessage += " 🎮 Fin del juego. ¡Inténtalo de nuevo!";
    }
    document.getElementById("message").textContent = errorMessage;
    document.getElementById("message").style.color = "#dc3545";
  }
  
  document.getElementById("score").textContent = `⭐ Puntuación: ${score}`;
  document.getElementById("attempts").textContent = `❌ Intentos restantes: ${attempts}`;
  
  if (attempts === 0) {
    document.getElementById("cityImage").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("restart").style.display = "block";
  } else {
    // Muestra el botón para pasar a la siguiente pregunta
    document.getElementById("next").style.display = "block";
  }
}

// Pasa a la siguiente pregunta
function nextQuestion() {
  askQuestion();
}

// Reinicia el juego
function restartGame() {
  score = 0;
  attempts = 3;
  document.getElementById("score").textContent = "⭐ Puntuación: 0";
  document.getElementById("attempts").textContent = "❌ Intentos restantes: 3";
  document.getElementById("message").textContent = "";
  document.getElementById("cityImage").style.display = "block";
  document.getElementById("restart").style.display = "none";
  askQuestion();
}

// Asigna eventos a los botones
document.getElementById("checkButton").addEventListener("click", checkAnswer);
document.getElementById("next").addEventListener("click", nextQuestion);
document.getElementById("restart").addEventListener("click", restartGame);

// Inicia el juego al cargar la página
askQuestion();
