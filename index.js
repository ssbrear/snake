const board = $("#board");
const GAME_SPEED = 250;
let direction = "down";
let extend = false;
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
let tick = false;
$(document).keydown(function (e) {
  if (tick === true) return;
  const searchedKey = keyTranslate[e.keyCode];
  if (started === false) started = true;
  // Check if the new input is invalid (two cases)
  // Ex: Direction is left, input is right
  // Ex: Direction is left, input is left
  if (checkInvalidInput(searchedKey, direction)) return;
  // Otherwise, update the new direction
  direction = searchedKey;
  tick = true;
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
  for (let i = newPositions.length - 1; i > 0; i--) {
    newPositions[i] = oldPositions[i - 1];
  }
  if (extend === true) {
    newPositions.push(oldPositions[oldPositions.length - 1]);
    extend = false;
  }
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
  // Check if game over before updating. Exit loop early if that is the case
  // Simplest way to check for a gameover is to loop through an array of all possible positions around the border
  // Better way using game logic?
  // (Yes!)
  if (checkGameover()) {
    ended = true;
    return;
  }
  updateDisplay();
  checkFoodEaten();
  setTimeout(gameLoop, GAME_SPEED);
  tick = false;
  // Emergency in case food didn't spawn properly
  // Happens sometimes for a reason I can't understand
  if ($(".food").length === 0) spawnFood();
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
function checkFoodEaten() {
  const tileArray = board.children();
  const newHead = $(tileArray[newPositions[0]]);
  if (newHead.attr("class").includes("food")) {
    // "Eat" the food
    newHead.removeClass("food");
    // Set a flag to delay tail next loop
    extend = true;
    // Spawn new food
    spawnFood();
  }
}
function checkGameover() {
  const tileArray = board.children();
  // Checks hitting left wall
  if (oldPositions[0] % 21 === 0 && newPositions[0] % 21 === 20) return true;
  // Checks hitting right wall
  if (oldPositions[0] % 21 === 20 && newPositions[0] % 21 === 0) return true;
  // Checks hitting top wall
  if (oldPositions[0] <= 20 && newPositions[0] < 0) return true;
  // Checks hitting bottom wall
  if (oldPositions[0] > 280 && newPositions[0] > 314) return true;
  // Checks if hitting tail
  if ($(tileArray[newPositions[0]]).attr("class").includes("snek")) return true;
  return false;
}
function spawnFood() {
  const possibleSpawns = $(".tile:not(.snek)");
  const randNum = Math.round(possibleSpawns.length * Math.random());
  $(possibleSpawns[randNum]).addClass("food");
}
