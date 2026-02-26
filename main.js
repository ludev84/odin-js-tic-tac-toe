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

  return { getBoard, placeToken, printGameboard };
}

function GameController(playerOneName = "Joe", playerTwoName = "Karen") {
  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  const board = Gameboard();

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(`${getActivePlayer().name}'s turn. Marker: ${getActivePlayer().marker}`)
    board.printGameboard()
  }

  const playRound = (position) => {
    board.placeToken(position, getActivePlayer().marker);
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();

// game.playRound([1,3])
// game.playRound([1,2])
