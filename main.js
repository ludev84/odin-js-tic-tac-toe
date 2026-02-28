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
    const row = position[0];
    const col = position[1];
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
    const row = position[0];
    const col = position[1];
    return board[row][col];
  }

  const isGameFinished = () => {
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
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
      // printNewRound();
      return true;
    } else if (board.isGameFinished()) {
      return false;
    }
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
  };

  // Initial play game message (console)
  // printNewRound();

  return { playRound, getActivePlayer, resetGame, getBoard: board.getBoard };
}


function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".player")
  const boardDiv = document.querySelector(".board")
  const resetBtn = document.querySelector(".reset")
  
  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer().name
    // const activeMarker = game.getActivePlayer().marker

    // Clear board
    boardDiv.innerHTML = "";

    // Player name
    playerTurnDiv.innerHTML = `Current player: ${activePlayer}`

    // Build the board
    board.forEach((row, indexRow) =>
      row.forEach((cell, indexCol) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.row = indexRow;
        cellDiv.dataset.col = indexCol;
        cellDiv.innerHTML = cell;
        boardDiv.appendChild(cellDiv);
      }),
    );

  };

  // Event listeners as I already had them outside a function
  boardDiv.addEventListener("click", (e) => {
    // Notice here we have a DOMStringMap {row: '1', col: '2'} in e.target.dataset
    const {row, col} = e.target.dataset;
    if (!row || !col) return;
    game.playRound([row, col])
    updateScreen()
  })

  resetBtn.addEventListener("click", (e) => {
    game.resetGame()
    updateScreen()
  })

  // Initial update screen
  updateScreen()

  return { updateScreen }
}

ScreenController()