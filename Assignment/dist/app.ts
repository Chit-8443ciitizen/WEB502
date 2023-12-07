// app.ts
var playerName = "";
var gameBoard = [];
var flippedTiles = [];
var isGameActive = false;
var startTime;

var matchedTiles = [];
var leaderboard = [];
var leaderboardKey = 'memoryGameLeaderboard';

function startGame() {
  playerName = document.getElementById("playerName").value;
  if (playerName.trim() === "") {
    alert("Please enter a valid name.");
    return;
  }
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  initializeGame();
}

function cancelGame() {
  endGame();
  showWelcomeScreen();
}

function showWelcomeScreen() {
  document.getElementById("welcome-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";
  renderLeaderboard();
}

function resetGame() {
  endGame();
  initializeGame();
}

function initializeGame() {
  isGameActive = true;
  startTime = Date.now();
  gameBoard = generateGameBoard();
  renderGameBoard();
}

function generateGameBoard() {
  // Logic to generate a shuffled game board
  var symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  var pairs = symbols.concat(symbols);
  return shuffleArray(pairs);
}

function renderGameBoard() {
  var gameBoardElement = document.getElementById("game-board");
  gameBoardElement.innerHTML = "";
  gameBoard.forEach(function (symbol, index) {
    var tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = matchedTiles.includes(index) || flippedTiles.includes(index) ? symbol : "";
    tile.addEventListener("click", function () { return flipTile(index); });
    gameBoardElement.appendChild(tile);
  });
  updateTimer();
}

function flipTile(index) {
  if (!isGameActive || flippedTiles.length === 2 || flippedTiles.includes(index)) {
    return;
  }
  flippedTiles.push(index);
  if (flippedTiles.length === 2) {
    setTimeout(checkMatch, 500);
  }
  renderGameBoard();
}

function checkMatch() {
  var index1 = flippedTiles[0], index2 = flippedTiles[1];
  if (gameBoard[index1] === gameBoard[index2]) {
    matchedTiles.push(index1, index2);
    flippedTiles = [];
  } else {
    setTimeout(function () {
      flippedTiles = [];
      renderGameBoard();
    }, 1000);
  }
  checkWin();
  renderGameBoard();
}

function checkWin() {
  if (matchedTiles.length === gameBoard.length) {
    var elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    alert("Congratulations, " + playerName + "! You completed the game in " + elapsedTime + " seconds.");
    addToLeaderboard(playerName, elapsedTime);
    renderLeaderboard();
    endGame();
    showWelcomeScreen();
  }
}

function addToLeaderboard(playerName, elapsedTime) {
  leaderboard = getLeaderboard();
  leaderboard.push({ playerName: playerName, elapsedTime: elapsedTime });
  leaderboard.sort(function (a, b) { return a.elapsedTime - b.elapsedTime; });
  if (leaderboard.length > 5) {
    leaderboard.pop();
  }
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

function endGame() {
  isGameActive = false;
  flippedTiles = [];
}

function updateTimer() {
  if (!isGameActive) return;
  var elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").textContent = "Time: " + elapsedSeconds + " seconds";
  requestAnimationFrame(updateTimer);
}

function getLeaderboard() {
  var storedLeaderboard = localStorage.getItem(leaderboardKey);
  return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
}

// Cập nhật hàm renderLeaderboard trong app.ts
function renderLeaderboard() {
    var leaderboardContainer = document.getElementById("leaderboard-container");
    leaderboardContainer.innerHTML = "";
  
    leaderboard = getLeaderboard();
    // console.log("Leaderboard:");
    // leaderboard.forEach(function (entry, index) {
    //   console.log(index + 1 + ". " + entry.playerName + " - " + entry.elapsedTime + " seconds");
  
    //   var leaderboardItem = document.createElement("div");
    //   leaderboardItem.textContent = entry.playerName + " - " + entry.elapsedTime + " seconds";
    //   leaderboardContainer.appendChild(leaderboardItem);
    // });
  
   
     // Hiển thị trên HTML
     leaderboard.forEach(function (entry, index) {
        var leaderboardItem = document.createElement("div");
        leaderboardItem.className = "leaderboard-item";
        leaderboardItem.textContent = index + 1 + ". " + entry.playerName + " - " + entry.elapsedTime + " seconds";
        leaderboardContainer.appendChild(leaderboardItem);
      });
  }
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
