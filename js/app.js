/*
*
* Global variables.
*
*/

let matchedCards = 0;
let timerId;
let moves = 0;
let timerOff = true;
let time = 0;
let stars;
let cardsClickCount = 24;
let totalCardsPairs = 8;

// A list to holds clicked cards.
let clickedCards = [];

// A list to holds all the cards.
const cardsList = document.querySelector(".deck");

/*
*
*  Shuffle function from http://stackoverflow.com/a/2450976
*
*/

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Call the shuffle function.
function shuffleCards() {
  const cardsToShuffle = Array.from(document.getElementsByClassName("card"));
  const shuffleCards = shuffle(cardsToShuffle);
  for (let card of shuffleCards) {
    cardsList.appendChild(card);
  }
}
shuffleCards();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
*
*  Setting event listener for clicked cards.
*
*/

const cards = document.querySelector(".deck");

cards.addEventListener("click", function(event) {
  const clickedCard = event.target;
  if (validateClickCard(clickedCard)) {
    if (timerOff) {
      startTimer();
      timerOff = false;
    }
    flippedCard(clickedCard);
    addClickedCard(clickedCard);

    if (clickedCards.length === 2) {
      countMoves();
      starsStatus();
      displayTime();
      checkMatchCards(clickedCard);
    }
  }
});

/*
*
*  Setting event listener for game modal.
*
*/

// This handler will hide the modal,when cancel is clicked.
document.querySelector(".modal_cancel").addEventListener("click", function() {
  toggleModal();
});

// This handler will close the modal,when the closed button is clicked.
document.querySelector(".modal_close").addEventListener("click", function() {
  toggleModal();
});

// This handler will reset the game when the modal replay button is clicked.
document.querySelector(".modal_replay").addEventListener("click", function() {
  replay();
});

// This handler will reset the game.
document.querySelector(".restart").addEventListener("click", function() {
  resetGame();
});

/*
*
*  Sub functions for cards clicked events.
*
*/

// Function to vallidate clicked cards.
function validateClickCard(clickedCard) {
  return (
    clickedCard.classList.contains("card") &&
    !clickedCard.classList.contains("match") &&
    clickedCards.length < 2 &&
    !clickedCards.includes(clickedCard)
  );
}

// Function to display the card's symbol when clicked.
function flippedCard(clickedCard) {
  clickedCard.classList.toggle("open");
  clickedCard.classList.toggle("show");
}

// Function to add the clicked card to 'clickedCards' list.
function addClickedCard(clickedCard) {
  clickedCards.push(clickedCard);
}

// Function to count moves.
function countMoves() {
  moves++;
  const count = document.querySelector(".moves");
  count.innerHTML = moves;
}

// Function to display number of stars.
function starsStatus() {
  if (moves === 16 || moves === 24 || moves === 32) {
    changeStars();
  }
}

function changeStars() {
  const starList = document.querySelectorAll(".stars li");
  for (let star of starList) {
    if (star.style.display !== "none") {
      star.style.display = "none";
      break;
    }
  }
}

// Function to check clicked cards for match.
function checkMatchCards() {
  if (moves > cardsClickCount && matchedCards < totalCardsPairs) {
    gameLost();
  }

  if (
    clickedCards[0].children[0].className ===
    clickedCards[1].children[0].className
  ) {
    clickedCards[0].classList.toggle("match");
    clickedCards[1].classList.toggle("match");
    clickedCards = [];
    matchedCards++; // This keeps track of the number of cards matched.
    if (matchedCards === totalCardsPairs) {
      gameWon();
    }
  } else {
    setTimeout(function() {
      flippedCard(clickedCards[0]);
      flippedCard(clickedCards[1]);
      clickedCards = [];
    }, 1000);
  }
}

// Adding time function to the game.

// A function to start “time”.
function startTimer() {
  timerId = setInterval(function() {
    time++;
    displayTime();
  }, 1000);
}

// A function to display time recorded durring play.
function displayTime() {
  const timer = document.querySelector(".timer");
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    timer.innerHTML = minutes + ":" + 0 + seconds; // this add 0 before single digits.
  } else {
    timer.innerHTML = minutes + ":" + seconds;
  }
}

// A function to stop the time.
function stopTimer() {
  clearInterval(timerId);
}

/*
*
*  Functions for the game modal.
*
*/

// Function to toggle the modal.
function toggleModal() {
  const modal = document.querySelector(".modal_overlay");
  modal.classList.toggle("hide");
}

// Function to write game stats to the modal.
function writeModalStats() {
  const timeStat = document.querySelector(".modal_time");
  const timerTime = document.querySelector(".timer").innerHTML;
  const movesStat = document.querySelector(".modal_moves");
  const starsStat = document.querySelector(".modal_stars");
  const stars = getStars();

  timeStat.innerHTML = "Time =" + " " + timerTime;
  movesStat.innerHTML = "Moves =" + " " + moves;
  starsStat.innerHTML = "Stars =" + " " + stars;
  winLostMessage();
}

// Function to get stars to modal.
function getStars() {
  stars = document.querySelectorAll(".stars li");
  let starsCount = 0;
  for (let star of stars) {
    if (star.style.display !== "none") {
      starsCount++;
    }
  }
  return starsCount;
}

// Function to get game win or lost message to modal.
function winLostMessage() {
  let modalWon = document.getElementById("won").innerHTML;
  if (moves > cardsClickCount && matchedCards < totalCardsPairs) {
    let lost = modalWon.replace(modalWon, "***  Sorry, You Lost!  ***");
    document.getElementById("won").innerHTML = lost;
  } else {
    if (matchedCards === totalCardsPairs) {
      modalWon;
    }
  }
}

/*
*
*  Functions to reset the game.
*
*/

// Adding a Reset function
function resetGame() {
  resetTimerAndTime();
  resetMoves();
  resetStars();
  resetCards();
  shuffleCards();
  matchedCards = 0;
  winLostMessageReset();
}
resetGame();

// Reset time and timer
function resetTimerAndTime() {
  stopTimer();
  timerOff = true;
  time = 0;
  displayTime();
}

// Reset Moves
function resetMoves() {
  moves = 0;
  document.querySelector(".moves").innerHTML = moves;
}

// Reset Stars
function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll(".stars li");
  for (let star of starList) {
    star.style.display = "inline";
  }
}

// Reset Win/Lost message.
function winLostMessageReset() {
  if (
    document.getElementById("won").innerHTML != "***  Congrats, You Won!  ***"
  ) {
    let modalLost = document.getElementById("won").innerHTML;
    let won = modalLost.replace(modalLost, "***  Congrats, You Won!  ***");
    document.getElementById("won").innerHTML = won;
  }
}

/*
*
*  Functions for the end of game.
*
*/

// Game won function.
function gameWon() {
  stopTimer();
  writeModalStats();
  toggleModal();
}

// Game lost function.
function gameLost() {
  stopTimer();
  writeModalStats();
  toggleModal();
}

// Replay game.
function replay() {
  toggleModal();
  resetGame();
}

// Resets the card’s classes back to default.
function resetCards() {
  const cards = document.querySelectorAll(".deck li");
  for (let card of cards) {
    card.className = "card";
  }
}
