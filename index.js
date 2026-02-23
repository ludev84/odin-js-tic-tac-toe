const Gameboard = {
  gameboard: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
};

const Player = {
  playerOne: {
    name: "tim",
    marker: "X",
  },
  playerTwo: {
    name: "Jenn",
    marker: "O",
  },
};

const Game = {
  printGameboard: function (board) {
    return board
      .map(
        (row) =>
          " " + row.map((cell) => (cell === "" ? " " : cell)).join(" | ") + " ",
      )
      .join("\n---+---+---\n");
  },
};

console.log(Game.printGameboard(Gameboard.gameboard));
