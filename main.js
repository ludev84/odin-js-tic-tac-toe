function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  const placeToken = (position, marker) => {
    const row = position[0] - 1;
    const col = position[1] - 1;
    const currentCell = board[row][col];
    if (currentCell !== "") return;
    board[row][col] = marker;
  };

  const printGameboard = () => {
    const consoleBoard = board
      .map(
        (row) =>
          " " + row.map((cell) => (cell === "" ? " " : cell)).join(" | ") + " ",
      )
      .join("\n---+---+---\n");
    console.log(consoleBoard);
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j] = "";
      }
    }
  };

  return { getBoard, placeToken, printGameboard, resetBoard };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const players = [
    {
      name: playerOneName,
      marker: "⭕",
    },
    {
      name: playerTwoName,
      marker: "✖️",
    },
  ];

  const board = Gameboard();

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // Print game in console
  const printNewRound = () => {
    console.log(
      `${getActivePlayer().name}'s turn`,
    );
    board.printGameboard();
  };

  const playRound = (position) => {
    board.placeToken(position, getActivePlayer().marker);
    switchPlayerTurn();
    // printNewRound();
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
  };

  // Initial play game message (console)
  // printNewRound();

  return { playRound, getActivePlayer, resetGame };
}

const game = GameController();

// DOM manipulation and events
// In the connect four game, they use another function, ScreenController
// I just stashed a really messy code for checking wining situation
const container = document.querySelector(".container");
const cells = document.querySelectorAll(".cell");
const divPlayer = document.querySelector(".player");
const btnReset = document.querySelector(".reset");

function displayCurrentPlayer() {
  divPlayer.innerHTML = `Current player: ${game.getActivePlayer().name} ${game.getActivePlayer().marker}`;
}

displayCurrentPlayer()

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell") && e.target.innerHTML.trim() == "") {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    // So, we have errors, here I am already updating the DOM object to the marker of the player
    // without really validating IF the move is valid
    e.target.innerHTML = game.getActivePlayer().marker;
    game.playRound([row, col]);
    displayCurrentPlayer();
  }
});

btnReset.addEventListener("click", (e) => {
  for (let cell of cells) {
    cell.innerHTML = "";
  }
  game.resetGame();
  displayCurrentPlayer();
});
