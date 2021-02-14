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

// initialize game space
document.addEventListener('DOMContentLoaded', function () {
  gameController.setupGame(4, true);
  gameViewer.generateGameBoard();
  gameViewer.setBoardPiecesPosition();
  gameController.whosMove = 0;
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () { gameViewer.setBoardPiecesPosition(); });

// object GAMEVIEWER
//===================
const gameViewer = {
  imagePath: './assets/img/',
  nameIgloo: 'igloo',
  nameReindeer: 'reindeer',
  tileFaces: [
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
    { name: 'igloo', filename: 'tileface-igloo22.jpg', count: 1 }
  ],

  tileEdges: [
    { filename: 'tileedge-mid.png' },
    { filename: 'tileedge-top.png' },
  ],

  iconCollectTiles: { filename: 'icon-collect.png', },

  tileBack: { filename: 'tileback-ice.jpg' },

  boardPiece: {
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
  },

  sunPiece: { id: 'piece-sun', filename: 'piece-sun.png', count: 1 },

  figurePieces: [
    { name: 'blue', filenameHuman: 'piece-figure-blue.png', filenameMachine: 'piece-laptop-blue.png', count: 4 },
    { name: 'red', filenameHuman: 'piece-figure-red.png', filenameMachine: 'piece-laptop-red.png', count: 4 },
    { name: 'green', filenameHuman: 'piece-figure-green.png', filenameMachine: 'piece-laptop-green.png', count: 4 },
    { name: 'orange', filenameHuman: 'piece-figure-orange.png', filenameMachine: 'piece-laptop-orange.png', count: 4 },
    { name: 'purple', filenameHuman: 'piece-figure-purple.png', filenameMachine: 'piece-laptop-purple.png', count: 4 },
  ],

  generateGameBoard: function () {

    // put game board in place
    let boardPiecesHTML = "";
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // addd SUN piece to the top of the board
    boardPiecesHTML += `<img id="${this.sunPiece.id}" src="${this.imagePath}${this.sunPiece.filename}" alt="game piece sun">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += `<div id="tiles-igloo">`;
    for (let tile of gameController.tiles) {
      if (tile.name === gameViewer.nameIgloo) {
        boardPiecesHTML += `<img id="${tile.idOnIgloo}" class="tile-igloo" 
                              src="${this.imagePath}${tile.filename}"
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
                              src="${this.imagePath}${gameController.players[i].filename}"
                              alt="game figure ${gameController.players[i].name}">`;
      }
      boardPiecesHTML += `</div>`;
    };

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = boardPiecesHTML;

    // assemble tiles
    const tilesElement = document.getElementById('tiles');
    let tileElement;
    while (true) {
      let tile = gameController.tiles.shift();
      if (tile === undefined) { break }
      gameController.tilesOnTable.push(tile);
      tileElement = tile.placeOnTable(false);
      tilesElement.appendChild(tileElement);
    };

    // add CollectTiles icon
    tileElement = document.createElement('div');
    tileElement.setAttribute('id', "icon-collect");
    tileElement.classList.add("tile");
    tileElement.innerHTML += `
        <img class="tile" src="${this.imagePath}${gameViewer.iconCollectTiles.filename}"
        alt="collect tiles button">`;
    tileElement.addEventListener('click', gameViewer.handleIconClick);
    tilesElement.appendChild(tileElement);
  },

  setVisibilityOfElement: function (elementID, isVisible) {
    const element = document.getElementById(elementID);
    if (isVisible) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  },

  setBoardPiecesPosition: function () {
    const boardElement = document.getElementById(this.boardPiece.id);
    const boardWidth = boardElement.clientWidth;
    const boardLeftOffset = boardElement.offsetLeft;
    // sun piece position
    const sunLength = boardWidth * this.boardPiece.sunLength;
    document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
    document.documentElement.style.setProperty('--piece-sun-fromtop',
      `${boardWidth * this.boardPiece.sunCenters[gameController.sunPosition][0] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.sunCenters[gameController.sunPosition][1] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-rotate',
      `${gameController.sunPosition * 130}deg`);
    // igloo position
    const iglooLength = boardWidth * this.boardPiece.iglooLength;
    document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3 + 2}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromtop',
      `${boardWidth * this.boardPiece.igloo3x3TopLeftCorner[0]}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.igloo3x3TopLeftCorner[1]}px`);
    // figure pieces position
    const figureWidth = boardWidth * this.boardPiece.figureOnBoardWidth;
    document.documentElement.style.setProperty('--figure-onboard-width', `${figureWidth}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${figureWidth * 4}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${boardWidth * this.boardPiece.figuresOnBoardFromTop}px`);
    for (let i = 0; i < gameController.players.length; i++) {
      document.documentElement.style.setProperty('--board-figures-fromtop',
        `${boardWidth * this.boardPiece.figuresOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`,
        `${boardLeftOffset + boardWidth * this.boardPiece.figuresOnBoardFromLeft[i]}px`);
    }
  },

  handleTileClick: function (event) {
    let isTopRight = event.layerY < event.layerX;
    let isTopLeft = event.layerY < (event.currentTarget.offsetWidth - event.layerX);
    gameController.handleTileClickOnTable(event.currentTarget.id, isTopLeft, isTopRight);
  },

  handleIconClick: function (event) {
    gameController.handleIconClick(event.currentTarget.id);
  },
};

// class TILE
//============
class Tile {
  constructor(id, name, filename) {
    this.id = id;
    this.isFaceUp = null;
    this.idOnTable = id + '-ontable';
    this.idOnIgloo = id + '-onigloo';
    this.name = name;
    this.filename = filename;
  }

  placeOnTable(isFaceUp) {
    this.isFaceUp = isFaceUp;
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.setAttribute('id', this.idOnTable);
    tileElement.setAttribute('data-id', this.id);
    tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${gameViewer.imagePath}${gameViewer.tileBack.filename}" alt="game tile back">
          </div>
          <div class="tile-front">
            ${(gameController.isTest) ? this.name : ""}
          </div>
          <div class="tile-back">
            <img src="${gameViewer.imagePath}${this.filename}" alt="game tile ${this.name}">
          </div>
        </div>
        `
    tileElement.addEventListener('click', gameViewer.handleTileClick);
    return tileElement;
  }

  flipOnTable(isClickedOnTopLeft, isClickedOnTopRight) {
    this.isFaceUp = !this.isFaceUp;
    let tileInnerElement = document.getElementById(this.idOnTable).children[0];
    if (this.isFaceUp) {
      if (isClickedOnTopLeft && isClickedOnTopRight) { tileInnerElement.classList.add('tile-flip-up'); }
      else if (isClickedOnTopLeft && !isClickedOnTopRight) { tileInnerElement.classList.add('tile-flip-left'); }
      else if (!isClickedOnTopLeft && isClickedOnTopRight) { tileInnerElement.classList.add('tile-flip-right'); }
      else if (!isClickedOnTopLeft && !isClickedOnTopRight) { tileInnerElement.classList.add('tile-flip-down'); }
    } else {
      tileInnerElement.classList.remove('tile-flip-up', 'tile-flip-down', 'tile-flip-left', 'tile-flip-right');
    }
  }

  addToStack(playerIndex) {
    let player = gameController.players[playerIndex]
    let stackElement = document.getElementById(player.tileStackID);
    if (player.tilesInStack.length > 0) {
      stackElement.innerHTML = `<img class="tile-edge" 
                         src="${gameViewer.imagePath}${gameViewer.tileEdges[(player.tilesInStack.length === 1) ? 1 : 0].filename}"
                         style="margin-left: ${getRandomInt(5) - 2}px"
                         alt="tile edge for score keeping">`
        + stackElement.innerHTML;
    }
  }
}

// object GAMECONTROLLER
//======================
const gameController = {
  isTest: null,
  tilesOnTable: null,
  tilesOnIgloo: null,
  sunPosition: null,
  round: null,
  whosMove: null,
  human: 0,
  players: null,

  setupGame: function (numberOfPlayers, isTest) {
    this.setupPlayers(numberOfPlayers, isTest);
    this.setupTiles(isTest);
  },

  setupPlayers: function (numberOfPlayers, isTest) {
    this.isTest = isTest;
    this.sunPosition = 0;
    this.round = 0;

    this.players = [];
    shuffleArrayInplace(gameViewer.figurePieces);
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players[i] = {
        name: gameViewer.figurePieces[i].name,
        filename: (i === gameController.human) ? gameViewer.figurePieces[i].filenameHuman : gameViewer.figurePieces[i].filenameMachine,
        figures: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
      };
      // generate ID for each Figure
      for (let j = 0; j < gameViewer.figurePieces[i].count; j++) {
        this.players[i].figures[j] = {
          idOnTable: `player${i}-figure${j}-ontable`,
          idOnIgloo: `player${i}-figure${j}-onigloo`,
        };
      };
    }
  },

  setupTiles: function () {
    this.tilesOnIgloo = [];
    this.tilesOnTable = [];
    this.tiles = [];
    let counter = 0;
    for (let tileFace of gameViewer.tileFaces) {
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
    this.tilesOnTable[tileIndex].isFaceUp = null;
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
    if (tile.isFaceUp === false) {
      tile.flipOnTable(isTopLeft, isTopRight);
      switch (tile.name) {
        case gameViewer.nameIgloo:
          this.removeTileFromTable(tile);
          this.addTileToIgloo(tile);
          setInterval(function () {
            gameViewer.setVisibilityOfElement(tile.idOnTable, false);
            gameViewer.setVisibilityOfElement(tile.idOnIgloo, true);
          }, 2000);
          break;
        case gameViewer.nameReindeer:
          if (this.sunPosition < gameViewer.boardPiece.sunCenters.length - 1) {
            this.sunPosition++;
            gameViewer.setBoardPiecesPosition();
          };
          break;
      }
    }
  },

  removeUpTurnedTilesFromTable: function () {
    for (let tile of this.tilesOnTable) {
      if (tile.isFaceUp) {
        this.removeTileFromTable(tile);
        gameViewer.setVisibilityOfElement(tile.idOnTable, false);
        this.players[this.whosMove].tilesInStack.push(tile);
        tile.addToStack(this.whosMove);
      }
    }
  },

  handleIconClick: function (iconID) {
    if (this.whosMove === this.human) {
      this.removeUpTurnedTilesFromTable();
    }
  },
}