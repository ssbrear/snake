function init() {
  const board = $("#board");
  const GAME_SIZE = 315;
  for (let i = 0; i < GAME_SIZE; i++) {
    const newTile = $("<div>").addClass("tile");
    if (i === 31 || i === 52 || i === 73) newTile.addClass("snek");
    if (i === 73) newTile.attr("id", "head");
    board.append(newTile);
  }
  // Starts at 74 and guesses the remaining numbers to start food off in the general direction of the snake
  const randNum = 74 + Math.round(241 * Math.random());

  $($(board).children()[randNum]).addClass("food");
}
init();
const keyTranslate = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};
let direction = "down";
let started = false;
$(document).keydown(function (e) {
  const searchedKey = keyTranslate[e.keyCode];
  if (started === false) started === true;
  if (searchedKey == undefined || searchedKey === direction) return;
  direction = searchedKey;
  console.log(direction);
});

function gameloop() {}
while (started) {
  gameloop();
}
