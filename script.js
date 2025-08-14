const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

let cells;
let currentPlayer = "X";
let gameState = Array(9).fill(null);
let isGameActive = true;
let isSinglePlayer = true; // toggle for bot mode

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6]           // Diagonals
];

function renderBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell' + (gameState[i] ? ' ' + gameState[i].toLowerCase() : '');
    cell.dataset.index = i;
    cell.textContent = gameState[i] ? gameState[i] : '';
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
  cells = document.querySelectorAll('.cell');
}

function handleCellClick(e) {
  const idx = e.target.dataset.index;
  if (!isGameActive || gameState[idx]) return;
  if (currentPlayer === "X") {
    gameState[idx] = currentPlayer;
    renderBoard();
    checkResult();
    if (isGameActive) {
      if (isSinglePlayer) {
        currentPlayer = "O";
        setStatus(`Bot's turn`);
        setTimeout(botMove, 500); // bot plays after short delay
      } else {
        currentPlayer = "O";
        setStatus(`Player ${currentPlayer}'s turn`);
      }
    }
  }
}

function botMove() {
  // Simple bot: pick a random available cell
  let empty = [];
  for (let i = 0; i < 9; i++) {
    if (!gameState[i]) empty.push(i);
  }
  if (!empty.length) return;
  // Bot can be improved with smarter logic if desired
  const move = empty[Math.floor(Math.random() * empty.length)];
  gameState[move] = "O";
  renderBoard();
  checkResult();
  if (isGameActive) {
    currentPlayer = "X";
    setStatus(`Player ${currentPlayer}'s turn`);
  }
}

function checkResult() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      isGameActive = false;
      highlightWinner(combo);
      setStatus(`Player ${gameState[a]} wins!`);
      return;
    }
  }
  if (!gameState.includes(null)) {
    isGameActive = false;
    setStatus("It's a draw!");
  }
}

function highlightWinner(combo) {
  combo.forEach(idx => {
    cells[idx].style.background = 'linear-gradient(135deg,#aaffd5,#ffe993)';
    cells[idx].style.transform = 'scale(1.1)';
  });
}

function setStatus(msg) {
  statusDiv.textContent = msg;
}

function restartGame() {
  gameState = Array(9).fill(null);
  currentPlayer = "X";
  isGameActive = true;
  renderBoard();
  setStatus(`Player ${currentPlayer}'s turn`);
}

restartBtn.addEventListener('click', restartGame);

// Initial render
renderBoard();
setStatus(`Player ${currentPlayer}'s turn`);