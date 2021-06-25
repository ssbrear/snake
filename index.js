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
