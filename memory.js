// Shuffle the order of the cards, by swapping
function shuffle(array) {
  let curr = array.length;
  let random, temp;
  while (curr > 0) {
    random = Math.floor(Math.random() * curr);
    curr--;
    temp = array[curr];
    array[curr] = array[random];
    array[random] = temp;
  }
  return array;
}

// add order prop to cards
function applyOrderToCards(cardsArray, orderArray) {
  cardsArray.forEach(function (card, indx) {
    card.style.order = orderArray[indx];
  });
}

// resets game
function resetAllFlips() {
  document.querySelectorAll(".cards").forEach(function (card) {
    card.classList.remove("is-flipped");
    card.classList.remove("is-done");
  });
  applyOrderToCards(arr1, shuffle(orderRange));
  document.querySelector(".restart").style.display = "none";
  document.querySelector(".tries span").innerHTML = 0;
  document.querySelector(".name span").innerHTML = 0;
  clearInterval(up);
  timer();
}

// the difficulty changer
function hideHardCards(gameElm) {
  document.querySelectorAll(".cards.hard").forEach(function (hardCard) {
    hardCard.style.display = "none";
  });
  gameElm.classList.remove("container-hard");
}

// the difficulty changer
function showHardCards(gameElm) {
  document.querySelectorAll(".cards.hard").forEach(function (hardCard) {
    hardCard.style.display = "block";
  });
  gameElm.classList.add("container-hard");
}

let start = document.querySelector(".special");
let game = document.querySelector("#main");
let arr1 = Array.from(game.children);
let orderRange = [...Array(arr1.length).keys()];
let modeBtn = document.querySelectorAll(".info button");
let cards = document.querySelectorAll(".cards");
let wrong = 0;

// game starter
let shuffled = shuffle(orderRange);
applyOrderToCards(arr1, shuffled);

// start the game after clicking the button
start.addEventListener("click", function () {
  start.previousElementSibling.remove();
  start.remove();
  timer();
});

// mode buttons for easy and hard
modeBtn[1].classList.add("active"); // Make second button active by default
cards.forEach(function (e) {
  if (e.classList.contains("hard")) {
    e.classList.add("is-done");
  }
});
modeBtn.forEach(function (btn) {
  btn.onclick = function () {
    // Reset flips on all cards, and trigger a shuffle again
    resetAllFlips();
    wrong = 0;
    document.querySelector(".tries span").innerHTML = `${wrong}`;
    // For each mode button, remove active class and hide hard cards
    modeBtn.forEach(function (ele) {
      ele.classList.remove("active");
      hideHardCards(game);
      cards.forEach(function (e) {
        if (e.classList.contains("hard")) {
          e.classList.add("is-done");
        }
      });
    });

    // Set this button active
    btn.classList.add("active");

    // If this is the hard mode, show hard cards and set the container class
    if (btn.id == "hard") {
      resetAllFlips();
      showHardCards(game);
    }
  };
});

let lockBoard = false; // Prevents clicking more cards while waiting for timeout

//The main click handler
function cardFlipper() {
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      //Stop if board is locked
      if (lockBoard) return;

      //Stop if clicking the exact same card twice
      if (card.classList.contains("is-flipped")) return;

      //Flip the card
      card.classList.add("is-flipped");

      //Check the game state
      checkState();
    });
  });
}

// flip counter
function checkState() {
  let flipped = arr1.filter((e) => e.classList.contains("is-flipped"));
  if (flipped.length === 2) {
    lockBoard = true; // Stop user from clicking more cards
    matchingCards(flipped[0], flipped[1]);
  }
}

//score counting
function matchingCards(first, second) {
  if (first.id === second.id) {
    first.classList.add("is-done");
    second.classList.add("is-done");
    first.classList.remove("is-flipped");
    second.classList.remove("is-flipped");
    lockBoard = false;
    gameComplete();
  } else {
    // no matches
    wrong++;
    document.querySelector(".tries span").innerHTML = `${wrong}`;
    setTimeout(function () {
      first.classList.remove("is-flipped");
      second.classList.remove("is-flipped");
      lockBoard = false;
    }, 800);
  }
}

//timer
let up;
function timer() {
  let time = 0;
  document.querySelector(".name span").innerHTML = `${time}`;
  up = setInterval(() => {
    document.querySelector(".name span").innerHTML = `${++time}`;
  }, 1000);
}

function gameComplete() {
  let flag = Array.from(cards).every((ele) =>
    ele.classList.contains("is-done")
  );
  if (flag) {
    document.querySelector(".restart").style.display = "block";
    clearInterval(up);
  }
}
// Initialize the game
cardFlipper();
