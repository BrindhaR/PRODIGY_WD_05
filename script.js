const board = document.getElementById("board");
const statusMessage = document.getElementById("statusMessage");
const restartBtn = document.getElementById("restartBtn");
const symbolButtons = document.querySelectorAll(".symbol-btn");
const symbolSelect = document.getElementById("symbolSelect");

let gameMode = ""; // pvp or pvc
let currentPlayer = "X";
let playerSymbol = "X";
let computerSymbol = "O";
let cells = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

document.getElementById("pvpBtn").onclick = () => startGame("pvp");
document.getElementById("pvcBtn").onclick = () => {
  gameMode = "pvc";
  symbolSelect.classList.remove("hidden");
};
restartBtn.onclick = () => location.reload();

symbolButtons.forEach((btn) => {
  btn.onclick = () => {
    playerSymbol = btn.dataset.symbol;
    computerSymbol = playerSymbol === "X" ? "O" : "X";
    startGame("pvc");
  };
});

function startGame(mode) {
  gameMode = mode;
  symbolSelect.classList.add("hidden");
  board.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

function createBoard() {
  board.innerHTML = "";
  cells = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleCellClick(i));
    board.appendChild(cell);
  });
}

function handleCellClick(index) {
  if (!gameActive || cells[index]) return;

  if (gameMode === "pvc" && currentPlayer !== playerSymbol) return;

  cells[index] = currentPlayer;
  updateBoard();
  checkResult();

  if (gameMode === "pvc" && gameActive) {
    currentPlayer = computerSymbol;
    setTimeout(() => {
      aiMove();
      updateBoard();
      checkResult();
    }, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
  }
}

function aiMove() {
  let emptyIndexes = cells.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
  let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  cells[randomIndex] = computerSymbol;
  currentPlayer = playerSymbol;
}

function updateBoard() {
  const cellElements = document.querySelectorAll(".cell");
  cellElements.forEach((cell, i) => {
    cell.textContent = cells[i];
  });
}

function updateStatus() {
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      statusMessage.textContent = `Player ${cells[a]} wins! 🎉`;
      gameActive = false;
      return;
    }
  }

  if (!cells.includes("")) {
    statusMessage.textContent = "It's a draw! 🤝";
    gameActive = false;
  }
}
