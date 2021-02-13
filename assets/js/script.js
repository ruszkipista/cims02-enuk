// UTILITIES
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// learnt random shuffling from here https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArrayInplace(arr) {
  let j;
  for (let i = arr.length - 1; i > 0; i--) {
    j = getRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function setVisibilityOfElement(elementID, isVisible) {
  const element = document.getElementById(elementID);
  if (isVisible) {
    element.style.visibility = 'visible';
  } else {
    element.style.visibility = 'hidden';
  }
}

// generate tiles
document.addEventListener('DOMContentLoaded', function () {
  gameController.setupPlayers(4, true);
  generateGameBoard();
  setBoardPiecesPosition();
  gameController.players[0].score = 30;
  gameController.players[1].score = 31;
  gameController.players[2].score = 2;
  gameController.players[3].score = 2;
  setScoresOnBoard();
  gameController.players[3].score++;
  setScoresOnBoard();
  gameController.whosMove = 0;
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () { setBoardPiecesPosition(); });

// object GAMEMATERIALS
const gameMaterials = {
  imagePath: './assets/img/',
  nameIgloo: 'igloo',
  nameReindeer: 'reindeer',
  getTileFace: function () {
    return [
      { name: 'reindeer', filename: 'tileface-reindeer.jpg', count: 9 },
      { name: 'polarbear', filename: 'tileface-polarbear.jpg', count: 14 },
      { name: 'seal', filename: 'tileface-seal.jpg', count: 14 },
      { name: 'salmon', filename: 'tileface-salmon.jpg', count: 14 },
      { name: 'herring', filename: 'tileface-herring.jpg', count: 9 },
      { name: 'igloo', filename: 'tileface-igloo00.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo01.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo02.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo10.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo11.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo12.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo20.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo21.jpg', count: 1 },
      { name: 'igloo', filename: 'tileface-igloo22.jpg', count: 1 }];
  },
  getTileEdges: function () {
    return [
      { filename: 'tileedge-mid.png' },
      { filename: 'tileedge-top.png' },
    ]
  },
  getTileBack: function () {
    return { filename: 'tileback-ice.jpg' };
  },
  getBoardPiece: function () {
    return {
      id: 'piece-board',
      name: 'enuk-board-front.jpg',
      sunLength: 0.08556,
      sunCenters: [
        [0.146, 0.0728],
        [0.115, 0.185],
        [0.09, 0.291],
        [0.074, 0.404],
        [0.068, 0.51],
        [0.07, 0.622],
        [0.086, 0.73],
        [0.112, 0.835],
        [0.143, 0.935]],
      iglooLength: 0.1355,
      igloo3x3TopLeftCorner: [0.232, 0.297],
      figureOnBoardWidth: 0.025,
      figuresOnBoardFromTop: 0.65,
      figuresOnBoardFromLeft: [0.02, 0.16, .73, .86],
    };
  },
  getSunPiece: function () {
    return {
      id: 'piece-sun',
      filename: 'piece-sun.png',
      count: 1
    }
  },
  getFigurePiece: function () {
    return [
      { name: 'blue', filename: 'piece-figure-blue.png', count: 4 },
      { name: 'red', filename: 'piece-figure-red.png', count: 4 },
      { name: 'green', filename: 'piece-figure-green.png', count: 4 },
      { name: 'orange', filename: 'piece-figure-orange.png', count: 4 },
      { name: 'purple', filename: 'piece-figure-purple.png', count: 4 }
    ];
  },
}

// class TILE
class Tile {
  constructor(id, name, filename) {
    this.id = id;
    this.idOnTable = id + '-ontable';
    this.idOnIgloo = id + '-onigloo';
    this.name = name;
    this.filename = filename;
    this.isFaceUp = null;
  }
  placeOnTable(isFaceUp) {
    this.isFaceUp = isFaceUp;
    const tileElement = document.createElement('div');
    const backtileName = gameMaterials.getTileBack().filename;
    const path = gameMaterials.imagePath;
    tileElement.classList.add('tile');
    tileElement.setAttribute('id', this.idOnTable);
    tileElement.setAttribute('data-id', this.id);
    tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${path}${backtileName}" alt="game tile back">
          </div>
          <div class="tile-front">
            ${(gameController.isTest) ? this.name : ""}
          </div>
          <div class="tile-back">
            <img src="${path}${this.filename}" alt="game tile ${this.name}">
          </div>
        </div>
        `
    tileElement.addEventListener('click', handleTileClick);
    return tileElement;
  }
  flipOnTable(isTopLeft, isTopRight) {
    this.isFaceUp = !this.isFaceUp;
    let tileInnerElement = document.getElementById(this.idOnTable).children[0];
    if (this.isFaceUp) {
      if (isTopLeft && isTopRight) { tileInnerElement.classList.add('tile-flip-up'); }
      else if (isTopLeft && !isTopRight) { tileInnerElement.classList.add('tile-flip-left'); }
      else if (!isTopLeft && isTopRight) { tileInnerElement.classList.add('tile-flip-right'); }
      else if (!isTopLeft && !isTopRight) { tileInnerElement.classList.add('tile-flip-down'); }
    } else {
      tileInnerElement.classList.remove('tile-flip-up', 'tile-flip-down', 'tile-flip-left', 'tile-flip-right');
    }
  }
}

// object GAMECONTROLLER
const gameController = {
  isTest: null,
  tilesOnTable: null,
  tilesOnIgloo: null,
  sunPosition: null,
  round: null,
  whosMove: null,
  players: null,

  setupPlayers: function (numberOfPlayers, isTest) {
    this.isTest = isTest;
    this.sunPosition = 0;
    this.round = 0;

    this.players = [];
    const pieceFigures = gameMaterials.getFigurePiece();
    shuffleArrayInplace(pieceFigures);
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players[i] = {
        name: pieceFigures[i].name,
        filename: pieceFigures[i].filename,
        figures: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
        score: 0,
      };
      // generate ID for each Figure
      for (let j = 0; j < pieceFigures[i].count; j++) {
        this.players[i].figures[j] = { id: `player${i}-figure${j}` };
      };
    }

    this.tilesOnIgloo = [];
    this.tilesOnTable = [];
    this.tiles = [];
    const tileFaces = gameMaterials.getTileFace();
    let counter = 0;
    for (let tileFace of tileFaces) {
      for (let i = 0; i < tileFace.count; i++) {
        // generate ID for each Tile
        this.tiles.push(new Tile(`tile-${counter}`, tileFace.name, tileFace.filename));
        counter++;
      };
    }
    if (!this.isTest) { shuffleArrayInplace(this.tiles) };
  },

  findTileOnTable: function (idOnTable) {
    // learnt "find" from https://usefulangle.com/post/3/javascript-search-array-of-objects
    let tile = gameController.tilesOnTable.find(function (element, index) {
      if (element.idOnTable === idOnTable) return true;
    })
    return tile;
  },

  removeTileFromTable: function (tile) {
    let tileIndex = this.tilesOnTable.findIndex(function (element, index) {
      if (element.idOnTable === tile.idOnTable) return true;
    })
    this.tilesOnTable.splice(tileIndex,1);
    return tile;
  },

  addTileToIgloo: function (tile) {
    this.tilesOnIgloo.push(tile);
  },

  handleTileClickOnTable: function (tileIdOnTable, isTopLeft, isTopRight) {
    if (this.whosMove !== 0) {
      return;
    }
    const tile = this.findTileOnTable(tileIdOnTable);
    if (!tile.isFaceUp) {
      tile.flipOnTable(isTopLeft, isTopRight);
      switch (tile.name) {
        case gameMaterials.nameIgloo:
          this.removeTileFromTable(tile);
          this.addTileToIgloo(tile);
          setInterval(function(){
            setVisibilityOfElement(tile.idOnTable, false);
            setVisibilityOfElement(tile.idOnIgloo, true);
          }, 2000);
          break;
        case gameMaterials.nameReindeer:
          const pieceBoard = gameMaterials.getBoardPiece();
          if (this.sunPosition < pieceBoard.sunCenters.length - 1) {
            this.sunPosition++;
            setBoardPiecesPosition();
          };
          break;
      }
    }
  },
}

function generateGameBoard() {
  const path = gameMaterials.imagePath;
  let tileElement;

  // put game board and sun piece in place
  const pieceBoard = gameMaterials.getBoardPiece();
  const pieceSun = gameMaterials.getSunPiece();

  let boardPiecesHTML = "";
  // add BOARD to game space
  boardPiecesHTML = `<img id="${pieceBoard.id}" src="${path}${pieceBoard.name}" alt="game board">`;
  // addd SUN piece to the top of the board

  boardPiecesHTML += `<img id="${pieceSun.id}" src="${path}${pieceSun.filename}" alt="game piece sun">`;
  // add hidden IGLOO TILES to the middle of the board
  boardPiecesHTML += `<div id="tiles-igloo">`;
  for (let tile of gameController.tiles) {
    if (tile.name === gameMaterials.nameIgloo) {
      boardPiecesHTML += `<img id="${tile.idOnIgloo}" class="tile-igloo" 
                            src="${path}${tile.filename}"
                            style="visibility: hidden;"
                            alt="game tile ${tile.name}">`;
    }
  }
  boardPiecesHTML += `</div>`;

  // add TILE STACKS and FIGURES for all players on the board
  for (let i = 0; i < gameController.players.length; i++) {
    boardPiecesHTML += `<div id="${gameController.players[i].tileStackID}" class="tiles-stack tiles-stack-player${i}"></div>`;
    boardPiecesHTML += `<div id="figures-player${i}" 
                             class="figures-group tiles-stack-player${i}" 
                             style="border-top-color:${gameController.players[i].name}">`;
    for (let figure of gameController.players[i].figures) {
      boardPiecesHTML += `<img id="${figure.id}" class="figure-on-board" 
                            src="${path}${gameController.players[i].filename}"
                            alt="game figure ${gameController.players[i].name}">`;
    }
    boardPiecesHTML += `</div>`;
  }

  const boardElement = document.getElementById('board');
  boardElement.innerHTML = boardPiecesHTML;

  let tilesElement = document.getElementById('tiles');
  // assemble tiles
  while (true) {
    let tile = gameController.tiles.shift();
    if (tile === undefined) { break }
    tileElement = tile.placeOnTable(false);
    gameController.tilesOnTable.push(tile);
    tilesElement.appendChild(tileElement);
  }
}

function setBoardPiecesPosition() {
  const pieceBoard = gameMaterials.getBoardPiece();
  const boardElement = document.getElementById(pieceBoard.id);
  const boardWidth = boardElement.clientWidth;
  const boardLeftOffset = boardElement.offsetLeft;
  const sunLength = boardWidth * pieceBoard.sunLength;
  document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
  document.documentElement.style.setProperty('--piece-sun-fromtop',
    `${boardWidth * pieceBoard.sunCenters[gameController.sunPosition][0] - sunLength / 2}px`);
  document.documentElement.style.setProperty('--piece-sun-fromleft',
    `${boardLeftOffset + boardWidth * pieceBoard.sunCenters[gameController.sunPosition][1] - sunLength / 2}px`);
  document.documentElement.style.setProperty('--piece-sun-rotate',
    `${gameController.sunPosition * 130}deg`);

  const iglooLength = boardWidth * pieceBoard.iglooLength;
  document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3 + 2}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromtop',
    `${boardWidth * pieceBoard.igloo3x3TopLeftCorner[0]}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromleft',
    `${boardLeftOffset + boardWidth * pieceBoard.igloo3x3TopLeftCorner[1]}px`);

  const figureWidth = boardWidth * pieceBoard.figureOnBoardWidth;
  document.documentElement.style.setProperty('--figure-onboard-width', `${figureWidth}px`);
  document.documentElement.style.setProperty('--tile-edge-width', `${figureWidth * 4}px`);
  document.documentElement.style.setProperty('--tiles-stack-height', `${boardWidth * pieceBoard.figuresOnBoardFromTop}px`);
  for (let i = 0; i < gameController.players.length; i++) {
    document.documentElement.style.setProperty('--board-figures-fromtop',
      `${boardWidth * pieceBoard.figuresOnBoardFromTop}px`);
    document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`,
      `${boardLeftOffset + boardWidth * pieceBoard.figuresOnBoardFromLeft[i]}px`);
  }
}

function handleTileClick(event) {
  let isTopRight = event.layerY < event.layerX;
  let isTopLeft = event.layerY < (event.currentTarget.offsetWidth - event.layerX);
  gameController.handleTileClickOnTable(event.currentTarget.id, isTopLeft, isTopRight);
}

function setScoresOnBoard() {
  const tileEdges = gameMaterials.getTileEdges();
  let tilesHTML = null;
  let stackElement = null;
  for (let player of gameController.players) {
    stackElement = document.getElementById(player.tileStackID);
    tilesHTML = stackElement.innerHTML;
    if (player.score > 0) {
      for (let i = 0; i < (player.score - stackElement.children.length); i++) {
        tilesHTML = `<img class="tile-edge" 
                       src="${gameMaterials.imagePath}${tileEdges[(i === 0 && stackElement.children.length === 0) ? 1 : 0].filename}"
                       style="margin-left: ${getRandomInt(5) - 2}px"
                       alt="tile edge for score keeping">`
          + tilesHTML;
      }
    }
    stackElement.innerHTML = tilesHTML;
  }
}

