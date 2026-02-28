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
    if (isGameWon()) return;
    if (isGameTied()) return;
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

  const isGameWon = () => {
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
      let cell1 = getCellValue(line[0]);
      let cell2 = getCellValue(line[1]);
      let cell3 = getCellValue(line[2]);
      if (cell1 === cell2 && cell2 === cell3 && cell1 !== "") return true; // Win
    }
    return false;
  };

  const isGameTied = () => {
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

  return { getBoard, placeToken, printGameboard, resetBoard, getCellValue, isGameTied, isGameWon };
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
    if (!board.isGameTied() && !board.isGameWon()) {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
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
    // This is messy, this can be optimized.
    // THis checks if the game is now over, by win or tie, and the cell empty
    // Returns true or false, to be used in ScreenController to update DOM. Fix.
    // I did change some things, now let's use it in DOM
    if (
      !board.isGameTied() &&
      !board.isGameWon() &&
      board.getCellValue(position) === ""
    ) {
      board.placeToken(position, getActivePlayer().marker);
      switchPlayerTurn();
      // return true;
    } else if (board.isGameWon()) {
      // This gets executed AFTER winner's turn
      console.log(`Game finished, the winner is: ${getActivePlayer().name}`);
      // return false;
    } else if (board.isGameTied()) {
      console.log("That is a tie")
    }
    printNewRound();
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
  };

  // Initial play game message (console)
  printNewRound();

  return { playRound, getActivePlayer, resetGame, getBoard: board.getBoard };
}

// const play1 = prompt("Enter player 1: ")
// const play2 = prompt("Enter player 2: ")

// const game = GameController(play1, play2);

// game.playRound([0,0])
// game.playRound([2,0])
// game.playRound([0,1])
// game.playRound([2,1])
// game.playRound([1,2])
// game.playRound([2,2])
// game.playRound([1,0])


function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".player")
  const boardDiv = document.querySelector(".board")
  const resetBtn = document.querySelector(".reset")
  
  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer().name

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
    // I think this can be in a function, and keep it separated from the add event listener
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

// ScreenController()
