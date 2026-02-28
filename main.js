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
    if (isGameFinished()) return;
    if (currentCell !== "") return;
    board[row][col] = marker;
  };

  const getAvailableCells = () => {
    const available = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (board[i][j] === "") {
          available.push({ row: i, col: j });
        }
      }
    }

    return available;
  };

  const getCellValue = (position) => {
    const row = position[0] - 1;
    const col = position[1] - 1;
    return board[row][col];
  }

  const isGameFinished = () => {
    const lines = [
      [
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      [
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      [
        [3, 1],
        [3, 2],
        [3, 3],
      ],
      [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      [
        [1, 2],
        [2, 2],
        [3, 2],
      ],
      [
        [1, 3],
        [2, 3],
        [3, 3],
      ],
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      [
        [1, 3],
        [2, 2],
        [3, 1],
      ],
    ];

    for (line of lines) {
      let cell1 = getCellValue(line[0])
      let cell2 = getCellValue(line[1])
      let cell3 = getCellValue(line[2])
      if (cell1 === cell2 && cell2 === cell3 && cell1 !== "") return true;   // Win
    }

    const availableCells = getAvailableCells();
    if (availableCells.length == 0) return true;    // Tie

    return false;
  }

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

  return { getBoard, placeToken, printGameboard, resetBoard, isGameFinished, getCellValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const players = [
    {
      name: playerOneName,
      marker: "O",
    },
    {
      name: playerTwoName,
      marker: "X",
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
    if (!board.isGameFinished() && board.getCellValue(position) === "") {
      board.placeToken(position, getActivePlayer().marker);
      switchPlayerTurn();
      printNewRound();
    } else if (board.isGameFinished()) {
      console.log("Game over!")
    }
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
  };

  // Initial play game message (console)
  printNewRound();

  return { playRound, getActivePlayer, resetGame };
}

const game = GameController();

game.playRound([1,2])
game.playRound([1,2])
game.playRound([1,3])