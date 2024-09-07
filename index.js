/// Global variables

let mainGameDiv = document.getElementById("mainGameField");
let tiles = document.querySelectorAll("div.tileClass");
let bestScore = 0;

let seconds = 0;
let minutes = 0;

let theGrid = [];
let currentScore;

let savedGame = sessionStorage.getItem("currentGame");
savedGame = JSON.parse(savedGame);

let intervalFunction;

/// Game creation

function createTiles(field) {
  for (let i = 0; i < 16; i++) {
    let oneTile = document.createElement("div");
    oneTile.classList.add("tileClass");
    field.appendChild(oneTile);
  }
}

function generateGrid(value) {
  for (let i = 0; i < 4; i++) {
    theGrid.push([value]);

    for (let j = 0; j < 3; j++) {
      theGrid[i].push(value);
    }
  }
}

function generateNumbers() {
  let numbers = [2, 4];
  let r1 = randomValue(4);
  let r2 = randomValue(4);
  let numPick = randomValue(2);

  let nullGrid = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    let firstNulli = theGrid[i].indexOf(null);
    nullGrid[i].push(firstNulli);
  }

  function randomValue(limit) {
    return Math.floor(Math.random() * limit);
  }

  function insertNumber(i1, i2) {
    theGrid[i1][i2] = numbers[numPick];
  }

  if (!theGrid[r1][r2]) {
    insertNumber(r1, r2);
  } else if (theGrid[r1][r2] && nullGrid[r1][0] !== -1) {
    insertNumber(r1, nullGrid[r1][0]);
  } else if (theGrid[r1][r2] && nullGrid[r1][0] === -1) {
    let nullRowIndex = [];
    nullGrid.forEach((item) => {
      if (item[0] !== -1) {
        nullRowIndex.push(nullGrid.indexOf(item));
      }
    });
    let randomRowIndex = Math.floor(Math.random() * nullRowIndex.length);
    let randomRow = nullRowIndex[randomRowIndex];
    insertNumber(randomRow, nullGrid[randomRow][0]);
  }
}

/// Reset

function softResetGame() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      theGrid[i][j] = null;
    }
  }
  minutes = 0;
  seconds = 0;
  currentScore = 0;
  showScore();
  generateNumbers();
  generateNumbers();
  renderNumbers();
  colorTiles();
  captureGameState();
}

/// Handling tile movement

function handleKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
      turnUp();
      break;
    case "ArrowDown":
      turnDown();
      break;
    case "ArrowLeft":
      turnLeft();
      break;
    case "ArrowRight":
      turnRight();
      break;
  }
}

function turnLeft() {
  let newGrid = JSON.parse(JSON.stringify(theGrid));

  if (event.key === "ArrowLeft") {
    function alignLeft() {
      for (let i = 0; i < 4; i++) {
        let result = theGrid[i].filter((rowItem) => rowItem !== null);
        theGrid[i] = result;
      }
      theGrid.forEach((row) => {
        row.length = 4;
        for (let j = 0; j < row.length; j++) {
          if (!row[j]) {
            row[j] = null;
          }
        }
      });
    }

    alignLeft();

    theGrid.forEach((row) => {
      for (let o = 0; o < row.length - 1; o++) {
        if (row[o] === row[o + 1]) {
          if (row[o] !== null) {
            currentScore += row[o] * 2;
            row[o] = row[o] * 2;
            row[o + 1] = null;
          }
        }
      }
    });
  }

  function checkGrids() {
    let sameGridCheck = [];
    for (let k = 0; k < 4; k++) {
      for (let p = 0; p < 4; p++) {
        if (theGrid[k][p] === newGrid[k][p]) {
          sameGridCheck.push(true);
        }
      }
    }
    if (sameGridCheck.length < 16) {
      generateNumbers();
    }
  }

  alignLeft();
  checkGrids();
  renderNumbers();
  colorTiles();
  showScore();
  loseHandling();

  captureGameState();
}

function turnRight() {
  let newGrid = JSON.parse(JSON.stringify(theGrid));

  if (event.key === "ArrowRight") {
    function alignRight() {
      for (let i = 0; i < 4; i++) {
        let result = theGrid[i].filter((rowItem) => rowItem !== null);
        theGrid[i] = result;
      }
      theGrid.forEach((row) => {
        for (let j = 0; j < 4; j++) {
          if (row.length < 4) {
            row.unshift(null);
          }
        }
      });
    }

    alignRight();

    theGrid.forEach((row) => {
      for (let o = 3; o >= 0; o--) {
        if (row[o] === row[o - 1]) {
          if (row[o] !== null) {
            currentScore += row[o] * 2;
            row[o] = row[o] * 2;
            row[o - 1] = null;
          }
        }
      }
    });

    function checkGrids() {
      let sameGridCheck = [];
      for (let k = 0; k < 4; k++) {
        for (let p = 0; p < 4; p++) {
          if (theGrid[k][p] === newGrid[k][p]) {
            sameGridCheck.push(true);
          }
        }
      }
      if (sameGridCheck.length < 16) {
        generateNumbers();
      }
    }

    alignRight();
    checkGrids();
    renderNumbers();
    colorTiles();
    showScore();
    loseHandling();

    captureGameState();
  }
}

function turnDown() {
  let newGrid = JSON.parse(JSON.stringify(theGrid));

  if (event.key === "ArrowDown") {
    function allignDown() {
      for (let i = 0; i < 4; i++) {
        let result = theGrid[i].filter((rowItem) => rowItem !== null);
        theGrid[i] = result;
      }
      theGrid.forEach((row) => {
        for (let j = 0; j < 4; j++) {
          if (row.length < 4) {
            row.unshift(null);
          }
        }
      });
    }

    changeGrid();
    allignDown();

    theGrid.forEach((row) => {
      for (let o = 3; o >= 0; o--) {
        if (row[o] === row[o - 1]) {
          if (row[o] !== null) {
            currentScore += row[o] * 2;
            row[o] = row[o] * 2;
            row[o - 1] = null;
          }
        }
      }
    });

    function checkGrids() {
      let sameGridCheck = [];
      for (let k = 0; k < 4; k++) {
        for (let p = 0; p < 4; p++) {
          if (theGrid[k][p] === newGrid[k][p]) {
            sameGridCheck.push(true);
          }
        }
      }
      if (sameGridCheck.length < 16) {
        generateNumbers();
      }
    }

    allignDown();
    changeGrid();
    checkGrids();
    renderNumbers();
    colorTiles();
    showScore();
    loseHandling();

    captureGameState();
  }
}

function turnUp() {
  let newGrid = JSON.parse(JSON.stringify(theGrid));

  if (event.key === "ArrowUp") {
    function allignUp() {
      for (let i = 0; i < 4; i++) {
        let result = theGrid[i].filter((rowItem) => rowItem !== null);
        theGrid[i] = result;
      }
      theGrid.forEach((row) => {
        row.length = 4;
        for (let j = 0; j < row.length; j++) {
          if (!row[j]) {
            row[j] = null;
          }
        }
      });
    }

    changeGrid();
    allignUp();

    theGrid.forEach((row) => {
      for (let o = 0; o < row.length; o++) {
        if (row[o] === row[o + 1]) {
          if (row[o] !== null) {
            currentScore += row[o] * 2;
            row[o] = row[o] * 2;
            row[o + 1] = null;
          }
        }
      }
    });

    function checkGrids() {
      let sameGridCheck = [];
      for (let k = 0; k < 4; k++) {
        for (let p = 0; p < 4; p++) {
          if (theGrid[k][p] === newGrid[k][p]) {
            sameGridCheck.push(true);
          }
        }
      }
      if (sameGridCheck.length < 16) {
        generateNumbers();
      }
    }

    allignUp();
    changeGrid();
    checkGrids();
    renderNumbers();
    colorTiles();
    showScore();
    loseHandling();

    captureGameState();
  }
}

function changeGrid() {
  let oppositeGrid = [[], [], [], []];
  theGrid.forEach((item) => {
    oppositeGrid[0].push(item[0]);
    oppositeGrid[1].push(item[1]);
    oppositeGrid[2].push(item[2]);
    oppositeGrid[3].push(item[3]);
  });
  theGrid = oppositeGrid;
}

/// Rendering game

function renderNumbers() {
  let tiles = document.querySelectorAll("div.tileClass");
  let combinedGrid = theGrid[0].concat(theGrid[1], theGrid[2], theGrid[3]);
  for (let k = 0; k < tiles.length; k++) {
    tiles[k].innerText = combinedGrid[k];
    if (combinedGrid[k] !== null) {
    }
  }
}

function colorTiles() {
  let tiles = document.querySelectorAll("div.tileClass");

  for (let i = 0; i < 16; i++) {
    tiles[i].style.backgroundColor = "#eadfb4";
    tiles[i].style.color = "white";
    tiles[i].style.fontSize = "40px";
    tiles[i].style.textDecoration = "bold";

    if (tiles[i].innerText.length > 0) {
      let valueToNumber = Number(tiles[i].innerText);
      tiles[i].style.backgroundColor = "#F8C471";

      switch (valueToNumber) {
        case 8:
          tiles[i].style.backgroundColor = "#F0B27A";
          break;
        case 16:
          tiles[i].style.backgroundColor = "pink";
          break;
        case 32:
          tiles[i].style.backgroundColor = "violet";
          break;
        case 64:
          tiles[i].style.backgroundColor = "purple";
          break;
        case 128:
          tiles[i].style.backgroundColor = "orange";
          break;
        case 256:
          tiles[i].style.backgroundColor = "red";
          break;
        case 512:
          tiles[i].style.backgroundColor = "#922B21";
          break;
        case 1024:
          tiles[i].style.backgroundColor = "#DE3163";
          break;
        case 2048:
          tiles[i].style.backgroundColor = "green";
          break;
      }
    }
  }
}

function showScore() {
  document.querySelector("#currentScore h4").innerText = currentScore;
}

/// Timer

function timer() {
  intervalFunction = setInterval(() => {
    let secondsToRender = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let minutesToRender = minutes < 10 ? `0${minutes}` : `${minutes}`;

    seconds += 1;

    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    document.querySelector(
      ".timer p"
    ).innerText = `Time: ${minutesToRender}:${secondsToRender}`;
    captureGameState();
  }, 1000);
}

/// Handling lose message

function loseHandling() {
  let fullRows = 0;
  let fullGrid = false;

  let availableMoves = true;

  theGrid.forEach((line) => {
    if (!line.includes(null)) {
      fullRows += 1;
    }
  });

  if (fullRows === 4) {
    fullGrid = true;
  }

  let horizontalNum1;
  let horizontalNum2;

  let verticalNum1;
  let verticalNum2;

  if (fullGrid) {
    for (let i = 0; i < theGrid.length; i++) {
      for (let j = 0; j < theGrid[i].length; j++) {
        if (j < theGrid[i].length - 1) {
          horizontalNum1 = theGrid[i][j];
          horizontalNum2 = theGrid[i][j + 1];
          if (horizontalNum1 === horizontalNum2) {
            availableMoves = true;
            return;
          }
        }

        if (i < theGrid.length - 1) {
          verticalNum1 = theGrid[i][j];
          verticalNum2 = theGrid[i + 1][j];
          if (verticalNum1 === verticalNum2) {
            availableMoves = true;
            return;
          }
        }
        availableMoves = false;
      }
    }
  }
  if (!availableMoves) {
    if (currentScore > bestScore) {
      bestScore = currentScore;
      localStorage.setItem("bestScore", bestScore);
    }

    document.querySelector(".lostMsgContainer").style.display = "block";
    window.removeEventListener("keydown", handleKeydown);
    clearInterval(intervalFunction);
  }
}

/// Best score

function getLocalBestScore() {
  let localScore = localStorage.getItem("bestScore");
  if (localScore !== null) {
    bestScore = localScore;
    document.querySelector("#bestScore h4").innerText = bestScore;
  }
}

/// Session storage

function captureGameState() {
  let gameState = {
    grid: theGrid,
    minutes: minutes,
    seconds: seconds,
    score: currentScore,
  };
  sessionStorage.setItem("currentGame", JSON.stringify(gameState));
}

/// Event listeners

window.addEventListener("load", (event) => {
  if (savedGame === null) {
    currentScore = 0;
    generateNumbers();
    generateNumbers();
    renderNumbers();
    colorTiles();
    showScore();
  } else {
    theGrid = savedGame.grid;
    seconds = savedGame.seconds;
    minutes = savedGame.minutes;
    currentScore = savedGame.score;
    renderNumbers();
    colorTiles();
    showScore();
  }
});

window.addEventListener("keydown", handleKeydown);

document.getElementById("newGame").addEventListener("click", softResetGame);
document.querySelector(".lostMsgContainer").addEventListener("click", () => {
  sessionStorage.clear();
  location.reload();
});

/// Function calls

createTiles(mainGameDiv);
generateGrid(null);
getLocalBestScore();
timer();
