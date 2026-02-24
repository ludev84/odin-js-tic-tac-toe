function Player(name, marker) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.name = name;
  this.marker = marker;
}

function Game() {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  this.play = function (player, pos) {
    const row = pos[0] - 1;
    const col = pos[1] - 1;
    const currentCell = this.gameboard[row][col];
    if (currentCell !== "") {
      throw Error("You must select an empty cell");
    }
    this.gameboard[row][col] = player.marker;
    console.log(this.printGameboard(this.gameboard));
    const gameFinished = this.isGameFinished(this.gameboard);
    if (gameFinished) {
      console.log("Game finished");
    }
  };
  this.printGameboard = function (board) {
    return board
      .map(
        (row) =>
          " " + row.map((cell) => (cell === "" ? " " : cell)).join(" | ") + " ",
      )
      .join("\n---+---+---\n");
  };
  this.isGameFinished = function () {
    for (let row of this.gameboard) {
      for (let cell of row) {
        if (cell === "") return false;
      }
    }
    return true;
  };
}

const game = new Game();
const player1 = new Player("Joe", "X");
const player2 = new Player("Karen", "O");

game.play(player1, [1, 2]);
game.play(player2, [1, 3]);
game.play(player1, [1, 1]);
game.play(player2, [2, 1]);
game.play(player1, [2, 2]);
game.play(player2, [3, 3]);
game.play(player1, [3, 1]);
game.play(player2, [3, 2]);
game.play(player1, [2, 3]);
