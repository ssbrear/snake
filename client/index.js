const board = $("#board");
const GAME_SPEED = 250;
let direction = "down";
let started = false;
let ended = false;
const keyTranslate = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

let oldPositions = [73, 52, 31];
let newPositions = [73, 52, 31];
function init() {
  const GAME_SIZE = 315;
  for (let i = 0; i < GAME_SIZE; i++) {
    const newTile = $("<div>").addClass("tile");
    board.append(newTile);
  }
  updateDisplay();
  // Starts at 74 and guesses the remaining numbers to start food off in the general direction of the snake
  const randNum = 74 + Math.round(241 * Math.random());

  $($(board).children()[randNum]).addClass("food");
}
init();

function checkToStart() {
  if (started === true) {
    console.log("start");
    clearInterval(checkToStart);
    gameLoop();
  } else {
    setTimeout(checkToStart, 100);
  }
}
checkToStart();
$(document).keydown(function (e) {
  const searchedKey = keyTranslate[e.keyCode];
  if (started === false) started = true;
  // Check if the new input is invalid (two cases)
  // Ex: Direction is left, input is right
  // Ex: Direction is left, input is left
  if (checkInvalidInput(searchedKey, direction)) return;
  // Otherwise, update the new direction
  direction = searchedKey;
  console.log(direction);
});

function checkInvalidInput(input, direction) {
  // Already going that direction
  //console.log(input, direction);
  if (input === direction) return true;
  // Not an arrow key
  if (input == undefined) return true;
  // Input is opposite direction of current
  if (
    (input === "left" && direction === "right") ||
    (input === "right" && direction === "left") ||
    (input === "up" && direction === "down") ||
    (input === "down" && direction === "up")
  )
    return true;
  return false;
}
function gameLoop() {
  if (started === false) return;
  if (ended === true) clearInterval(gameTick);
  newPositions[2] = oldPositions[1];
  newPositions[1] = oldPositions[0];
  if (direction === "left") {
    newPositions[0] = oldPositions[0] - 1;
  } else if (direction === "up") {
    newPositions[0] = oldPositions[0] - 21;
  } else if (direction === "right") {
    newPositions[0] = oldPositions[0] + 1;
  } else if (direction === "down") {
    newPositions[0] = oldPositions[0] + 21;
  }
  console.log("old:", oldPositions);
  console.log("new:", newPositions);
  console.log(direction);
  updateDisplay();
  setTimeout(gameLoop, GAME_SPEED);
}
function updateDisplay() {
  const tileArray = board.children();
  // Remove styling on old position tiles
  $(tileArray[oldPositions[oldPositions.length - 1]]).removeClass("snek");
  $(tileArray[oldPositions[0]]).attr("id", "");

  // Style the new position tiles
  for (let i = 0; i < newPositions.length; i++) {
    $(tileArray[newPositions[i]]).addClass("snek");
    if (i === 0) {
      $(tileArray[newPositions[i]]).attr("id", "head");
    }
  }
  newPositions.forEach((position, i) => (oldPositions[i] = position));
}
