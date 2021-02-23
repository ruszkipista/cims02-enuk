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
window.addEventListener('load', function () {
  gameController.play();
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () {
  gameViewer.setBoardPiecesPosition(gameController.sunPosition, gameController.numberOfPlayers);
});

// class TILE
//============
class Tile {
  static NAME_REINDEER() { return 'reindeer'; }
  static NAME_POLARBEAR() { return 'polarbear'; }
  static NAME_SEAL() { return 'seal'; }
  static NAME_SALMON() { return 'salmon'; }
  static NAME_HERRING() { return 'herring'; }
  static NAME_IGLOO() { return 'igloo'; }  // igloo is not ranked!
  static RANKING() {
    return [Tile.NAME_HERRING(), Tile.NAME_SALMON(), Tile.NAME_SEAL(), Tile.NAME_POLARBEAR(), Tile.NAME_REINDEER()];
  }

  constructor(id, name, filename) {
    this.id = id;
    this.isFaceUp = null;
    this.idOnTable = `${id}-ontable`;
    this.idOnIgloo = `${(name === Tile.NAME_IGLOO()) ? id + '-onigloo' : ''}`;
    this.name = name;
    this.filename = filename;
    this.rank = Tile.RANKING().indexOf(name);
    this.idMeepleOnIgloo = `${(name === Tile.NAME_IGLOO()) ? 'meeple-on-' + id : ''}`;
  }

  placeOnTable(isFaceUp, isTest) {
    this.isFaceUp = isFaceUp;
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.setAttribute('id', this.idOnTable);
    tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${gameViewer.imagePath}${gameViewer.tileBack.filename}" alt="game tile back">
          </div>
          <div class="tile-front">
            ${(isTest) ? this.name : ""}
          </div>
          <div class="tile-back">
            <img src="${gameViewer.imagePath}${this.filename}" alt="game tile ${this.name}">
          </div>
        </div>
        `;
    tileElement.addEventListener('click', gameController.handleTileClick);
    return tileElement;
  }

  placeOnIgloo() {
    return `<img id="${this.idOnIgloo}" class="tile-onigloo" 
              src="${gameViewer.imagePath}${this.filename}"
              style="visibility: hidden;"
              alt="game tile ${this.name}">`;
  }

  flipOnTable(isClickedOnLeft) {
    this.isFaceUp = !this.isFaceUp;
    let tileInnerElement = document.getElementById(this.idOnTable).children[0];
    if (this.isFaceUp) {
      if (isClickedOnLeft) { tileInnerElement.classList.add('tile-flip-left'); }
      else { tileInnerElement.classList.add('tile-flip-right'); }

    } else {
      tileInnerElement.classList.remove('tile-flip-up', 'tile-flip-down', 'tile-flip-left', 'tile-flip-right');
    }
  }

  addToStack(player) {
    let stackElement = document.getElementById(player.tileStackID);
    if (player.tilesInStack.length > 0) {
      stackElement.innerHTML =
        `<img class="tile-edge" 
              src="${gameViewer.imagePath}${gameViewer.tileEdges[(player.tilesInStack.length === 1) ? 1 : 0].filename}"
              style="margin-left: ${getRandomInt(5) - 2}px"
              alt="tile edge for score keeping">`
        + stackElement.innerHTML;
    }
  }
}

// class MEEPLE
//============
class Meeple {

  constructor(id, name, filename) {
    this.id = id;
    this.isOnBoard = true;
    this.idOnBoard = id + '-onboard';
    this.idOnIgloo = null;
    this.name = name;
    this.filename = filename;
  }

  placeOnBoard() {
    return `<img id="${this.idOnBoard}" class="meeple-on-board" 
                 src="${gameViewer.imagePath}${this.filename}"
                 alt="game meeple ${this.name}">`;
  }

  removeFromBoardToIgloo(idOnIgloo) {
    if (this.isOnBoard) {
      this.isOnBoard = false;
      this.idOnIgloo = idOnIgloo;
      const meepleOnIglooElement = document.getElementById(idOnIgloo);
      meepleOnIglooElement.setAttribute('src', gameViewer.imagePath + this.filename);
    }
  }

  removeFromIglooToBoard() {
    if (!this.isOnBoard) {
      this.isOnBoard = true;
      const meepleOnIglooElement = document.getElementById(this.idOnIgloo);
      meepleOnIglooElement.setAttribute('src', "");
      this.idOnIgloo = null;
      gameViewer.setVisibilityOfElement(this.idOnIgloo, false);
      gameViewer.setVisibilityOfElement(this.idOnBoard, true);
    }
  }
}

// class EVALUATION
//==================
class Evaluation {
  constructor() {
    this.toBeMovedToStack = [];
    this.toBeTurnedDown = [];
    this.toBeMovedToIgloo = [];
    this.isSunToBeMoved = false;
    this.isEndOfMove = false;
    this.isEndOfPhase1 = false;
    this.isEndOfPhase2 = false;
  }
}

// object GAMEVIEWER
//===================
const gameViewer = {
  imagePath: './assets/img/',

  tileFaces: [
    { name: Tile.NAME_REINDEER(), filename: 'tileface-reindeer.jpg', count: 9 },
    { name: Tile.NAME_POLARBEAR(), filename: 'tileface-polarbear.jpg', count: 14 },
    { name: Tile.NAME_SEAL(), filename: 'tileface-seal.jpg', count: 14 },
    { name: Tile.NAME_SALMON(), filename: 'tileface-salmon.jpg', count: 14 },
    { name: Tile.NAME_HERRING(), filename: 'tileface-herring.jpg', count: 14 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo00.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo01.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo02.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo10.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo11.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo12.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo20.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo21.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo22.jpg', count: 1 }
  ],

  tileEdges: [
    { filename: 'tileedge-mid.png' },
    { filename: 'tileedge-top.png' },
  ],

  icons: [
    { name: 'collect-tiles', filename: 'icon-collect-tiles.png', clickable: true, parentId: 'title', height: '9vh', topLeftCorner: [0, 0.885] },
  ],

  tileBack: { filename: 'tileback-ice.jpg', flipTimeMS: 800 },

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
    meepleOnBoardWidth: 0.025,
    meeplesOnBoardFromTop: 0.65,
    meeplesOnBoardFromLeft: [0.02, 0.16, 0.73, 0.86],
  },

  sunPiece: { id: 'piece-sun', filename: 'piece-sun.png' },

  meeplePieces: [
    { name: 'blue', filenameHuman: 'piece-meeple-blue.png', filenameMachine: 'piece-laptop-blue.png', background: 'enuk-background-blue.jpg', count: 4 },
    { name: 'green', filenameHuman: 'piece-meeple-green.png', filenameMachine: 'piece-laptop-green.png', background: 'enuk-background-green.jpg', count: 4 },
    { name: 'orange', filenameHuman: 'piece-meeple-orange.png', filenameMachine: 'piece-laptop-orange.png', background: 'enuk-background-orange.jpg', count: 4 },
    { name: 'purple', filenameHuman: 'piece-meeple-purple.png', filenameMachine: 'piece-laptop-purple.png', background: 'enuk-background-purple.jpg', count: 4 },
    { name: 'red', filenameHuman: 'piece-meeple-red.png', filenameMachine: 'piece-laptop-red.png', background: 'enuk-background-red.jpg', count: 4 },
  ],

  setBackground: function (backgroundFile) {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.style.backgroundImage = `url("${this.imagePath}${backgroundFile}")`;
  },

  generateGameBoard: function (tiles, tilesOnTable, players, isTest) {
    // put game board in place
    let boardPiecesHTML = "";
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // addd SUN piece to the top of the board
    boardPiecesHTML += `<img id="${this.sunPiece.id}" src="${this.imagePath}${this.sunPiece.filename}" alt="game piece sun">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += `<div id="tiles-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === Tile.NAME_IGLOO()) {
        boardPiecesHTML += tile.placeOnIgloo();
      }
    }
    boardPiecesHTML += `</div>`;

    // add hidden MEEPLES on top of igloo tiles - without src and alt
    boardPiecesHTML += `<div id="meeples-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === Tile.NAME_IGLOO()) {
        boardPiecesHTML += `<div class="tile-onigloo"><img 
                                id="${tile.idMeepleOnIgloo}"
                                class="meeple-onigloo"
                                style="visibility: hidden;" src="" alt="game meeple"></div>`;
      }
    }
    boardPiecesHTML += `</div>`;

    // add TILE STACKS and MEEPLES for all players on the board
    for (let i = 0; i < players.length; i++) {
      boardPiecesHTML += `<div id="${players[i].tileStackID}" class="tiles-stack tiles-stack-player${i}"></div>`;
      boardPiecesHTML += `<div id="meeples-player${i}" 
                               class="meeples-group tiles-stack-player${i}" 
                               style="border-top-color:${players[i].name}">`;
      for (let meeple of players[i].meeples) {
        boardPiecesHTML += meeple.placeOnBoard();
      }
      boardPiecesHTML += `</div>`;
    }

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = boardPiecesHTML;

    // add icons
    for (let icon of this.icons) {
      icon.id = 'icon-' + icon.name;
      const iconElement = document.createElement('img');
      iconElement.setAttribute('id', icon.id);
      iconElement.setAttribute('src', this.imagePath + icon.filename);
      iconElement.setAttribute('alt', icon.name + ' button');
      iconElement.addEventListener('click', gameController.handleIconClick);
      iconElement.style.position = 'absolute';
      iconElement.style.height = icon.height;
      iconElement.style.top = `var(--${icon.id}-fromtop)`;
      iconElement.style.left = `var(--${icon.id}-fromleft)`;
      // append icon to parent
      const parentElement = document.getElementById(icon.parentId);
      parentElement.appendChild(iconElement);
    }

    // assemble tiles
    const tilesElement = document.getElementById('tiles');
    let tileElement;
    while (true) {
      let tile = tiles.shift();
      if (tile === undefined) { break; }
      tilesOnTable.push(tile);
      tileElement = tile.placeOnTable(false, isTest);
      tilesElement.appendChild(tileElement);
    }

  },

  setVisibilityOfElement: function (elementID, isVisible) {
    const element = document.getElementById(elementID);
    if (isVisible) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  },

  setBoardPiecesPosition: function (sunPosition, numberOfPlayers) {
    const boardElement = document.getElementById(this.boardPiece.id);
    const boardWidth = boardElement.clientWidth;
    const boardLeftOffset = boardElement.offsetLeft;
    // flip transition time
    document.documentElement.style.setProperty('--flip-transition-time', `${gameViewer.tileBack.flipTimeMS}ms`);
    // sun piece position
    const sunLength = boardWidth * this.boardPiece.sunLength;
    document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
    document.documentElement.style.setProperty('--piece-sun-fromtop',
      `${boardWidth * this.boardPiece.sunCenters[sunPosition][0] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.sunCenters[sunPosition][1] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-rotate',
      `${sunPosition * 130}deg`);
    // igloo3x3 on board position
    const iglooLength = boardWidth * this.boardPiece.iglooLength;
    document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3 + 2}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromtop',
      `${boardWidth * this.boardPiece.igloo3x3TopLeftCorner[0]}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.igloo3x3TopLeftCorner[1]}px`);
    // meeple pieces position
    const meepleWidth = boardWidth * this.boardPiece.meepleOnBoardWidth;
    document.documentElement.style.setProperty('--meeple-onboard-width', `${meepleWidth}px`);
    document.documentElement.style.setProperty('--meeple-onigloo-width', `${meepleWidth * 2}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${meepleWidth * this.meeplePieces[0].count}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${boardWidth * this.boardPiece.meeplesOnBoardFromTop}px`);
    for (let i = 0; i < numberOfPlayers; i++) {
      document.documentElement.style.setProperty('--board-meeples-fromtop',
        `${boardWidth * this.boardPiece.meeplesOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`,
        `${boardLeftOffset + boardWidth * this.boardPiece.meeplesOnBoardFromLeft[i]}px`);
    }
    // icon position
    for (let icon of this.icons) {
      document.documentElement.style.setProperty(`--${icon.id}-fromtop`, `${boardWidth * icon.topLeftCorner[0]}px`);
      document.documentElement.style.setProperty(`--${icon.id}-fromleft`, `${boardLeftOffset + boardWidth * icon.topLeftCorner[1]}px`);
    }
  },
};

// object GAMECONTROLLER
//======================
const gameController = {
  // statuses
  statusBeforePhase1: 'A',
  statusInPhase1BeforeMove: 'B',
  statusInPhase1ProcessMove: 'C',
  statusInPhase1Evaluation: 'D',
  statusInPhase1Execution: 'E',
  statusBeforePhase2: 'F',
  statusInPhase2CollectOneIgloo: 'G',
  statusInPhase2BeforeDeclaration: 'H',
  statusInPhase2BeforeMove: 'I',
  statusInPhase2ProcessMove: 'J',
  statusInPhase2Evaluation: 'K',
  statusInPhase2Execution: 'L',
  statusEndOfGame: 'M',
  statusEndOfGameProcessMove: 'N',

  isTest: null,
  status: null,
  tilesOnTable: null,
  tilesOnIgloo: null,
  sunPosition: null,
  round: null,
  whosMove: null,
  human: null,
  players: null,
  numberOfPlayers: null,

  listenToClick: false,

  play: function () {
    if (typeof this.status === 'undefined' || this.status === null) { this.status = this.statusBeforePhase1; }

    infiniteLoop: while (true) {

      switch (this.status) {
        case this.statusBeforePhase1:
          this.isTest = true;
          this.numberOfPlayers = 4;
          this.sunPosition = 0;
          this.round = 0;
          this.setupPlayers();
          this.setupTiles();
          gameViewer.generateGameBoard(this.tiles, this.tilesOnTable, this.players, this.isTest);
          gameViewer.setBoardPiecesPosition(this.sunPosition, this.numberOfPlayers);
          this.whosMove = (this.isTest) ? this.human : 0;
          this.listenToClick = true;
          this.status = this.statusInPhase1BeforeMove;
          break;

        case this.statusInPhase1BeforeMove:
          gameViewer.setBackground(this.players[this.whosMove].background);
          break infiniteLoop;

        case this.statusInPhase1ProcessMove:
          break;

        case this.statusInPhase1Evaluation:
          break;

        case this.statusInPhase1Execution:
          break;

        case this.statusBeforePhase2:
          break;

        case this.statusInPhase2CollectOneIgloo:
          break;

        case this.statusInPhase2BeforeDeclaration:
          break;

        case this.statusInPhase2BeforeMove:
          break;

        case this.statusInPhase2ProcessMove:
          break;

        case this.statusInPhase2Evaluation:
          break;

        case this.statusInPhase2Execution:
          break;

        case this.statusEndOfGame:
          break;

        case this.statusEndOfGameProcessMove:
          break;
      }

    };

  },

  setupPlayers: function () {
    this.human = getRandomInt(this.numberOfPlayers);
    this.players = [];
    shuffleArrayInplace(gameViewer.meeplePieces);
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.players[i] = {
        name: gameViewer.meeplePieces[i].name,
        meeples: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
      };
      this.players[i].background = gameViewer.meeplePieces[i].background;
      // generate Meeples
      for (let j = 0; j < gameViewer.meeplePieces[i].count; j++) {
        this.players[i].meeples[j] = new Meeple(`player${i}-meeple${j}`,
          `meeple-${this.players[i].name}`,
          (i === this.human) ? gameViewer.meeplePieces[i].filenameHuman : gameViewer.meeplePieces[i].filenameMachine);
      }
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
      }
    }
    if (!this.isTest) { shuffleArrayInplace(this.tiles); }
  },

  findTileOnTable: function (idOnTable) {
    // learnt "find" from https://usefulangle.com/post/3/javascript-search-array-of-objects
    let tile = this.tilesOnTable.find(function (element, index) {
      if (element.idOnTable === idOnTable) return true;
    });
    return tile;
  },

  removeTileFromTable: function (tile) {
    let tileIndex = this.tilesOnTable.findIndex(function (element, index) {
      if (element.idOnTable === tile.idOnTable) return true;
    });
    this.tilesOnTable[tileIndex].isFaceUp = null;
    return tile;
  },

  removeTileFromTableToStack(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.players[this.whosMove].tilesInStack.push(tile);
      tile.addToStack(this.players[this.whosMove]);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
    }
  },

  removeTileFromTableToIgloo(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.tilesOnIgloo.push(tile);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
      gameViewer.setVisibilityOfElement(tile.idOnIgloo, true);
    }
  },

  removeMeepleFromBoardToIgloo(tile) {
    for (let i = this.players[this.whosMove].meeples.length - 1; i >= 0; i--) {
      let meeple = this.players[this.whosMove].meeples[i];
      if (meeple.isOnBoard) {
        meeple.removeFromBoardToIgloo(tile.idMeepleOnIgloo);
        gameViewer.setVisibilityOfElement(meeple.idOnBoard, false);
        gameViewer.setVisibilityOfElement(meeple.idOnIgloo, true);
        break;
      }
    }
  },

  handleTileClick: function (event) {
    if (gameController.whosMove !== gameController.human || !gameController.listenToClick) {
      return;
    }
    const isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
    const tile = gameController.findTileOnTable(event.currentTarget.id);
    if (tile.isFaceUp === false) {
      tile.flipOnTable(isClickedOnLeft);
      let evaluationResult = gameController.evaluateTilesOnTablePhase1(tile, false);
      if (evaluationResult.isEndOfMove) {
        gameController.listenToClick = false;
        setTimeout(function () {
          gameController.listenToClick = true;
          gameController.actOnEvaluation(evaluationResult);
        }, gameViewer.tileBack.flipTimeMS * 2);
      } else {
        gameController.actOnEvaluation(evaluationResult);
      }
    }
  },

  handleIconClick: function (event) {
    if (gameController.whosMove !== gameController.human) {
      return;
    }
    // if clicked on the CollecTiles icon
    if (event.currentTarget.id === gameViewer.icons[0].id
      // and it is the Human player's move
      && gameController.whosMove === gameController.human) {
      let evaluationResult = gameController.evaluateTilesOnTablePhase1(null, true);
      gameController.actOnEvaluation(evaluationResult);
    }
  },

  evaluateTilesOnTablePhase1: function (clickedTile, isPlayerWantToCollect) {
    let evaluation = new Evaluation();
    let toBeMovedToStack = new Set();
    let toBeTurnedDown = new Set();

    if (clickedTile !== null && clickedTile.name === Tile.NAME_REINDEER()) {
      evaluation.isSunToBeMoved = true;
    }

    for (let i = 0; i < this.tilesOnTable.length; i++) {
      if (this.tilesOnTable[i].isFaceUp) {
        if (this.tilesOnTable[i].rank < 0) {
          if (this.tilesOnTable[i].name === Tile.NAME_IGLOO()) {
            evaluation.toBeMovedToIgloo.push(i);
          }
        } else {
          // assume, that the current tile can be removed from the table
          // that means, there is not one tile to hide from
          toBeMovedToStack.add(i);
          for (let j = i + 1; j < this.tilesOnTable.length; j++) {
            if (this.tilesOnTable[j].isFaceUp && this.tilesOnTable[j].rank >= 0) {
              if (this.tilesOnTable[i].rank === this.tilesOnTable[j].rank + 1) {
                // j hides from i
                toBeTurnedDown.add(j);
              } else if (this.tilesOnTable[i].rank + 1 === this.tilesOnTable[j].rank) {
                // i hides from j
                toBeTurnedDown.add(i);
              }
            }
          }
        }
      }
    }
    // remove those tiles which to be turned down, they can not be collected
    for (let k of toBeTurnedDown) {
      toBeMovedToStack.delete(k);
    }
    // convert the 2 Sets into Arrays
    evaluation.toBeMovedToStack = Array.from(toBeMovedToStack);
    evaluation.toBeTurnedDown = Array.from(toBeTurnedDown);

    // Phase_1 ends if
    // last tile is a reindeer AND the sun reached the last place
    if (evaluation.isSunToBeMoved && this.sunPosition === gameViewer.boardPiece.sunCenters.length - 2) {
      evaluation.isEndOfPhase1 = true;
    }
    // move ends if
    // - player decided to collect the turned up tiles, or
    // - last tile is an igloo, or
    // - at least one animal hid (tile to be turned down)
    if (evaluation.isEndOfPhase1
      || isPlayerWantToCollect
      || (clickedTile && clickedTile.name === Tile.NAME_IGLOO())
      || evaluation.toBeTurnedDown.length > 0) {
      evaluation.isEndOfMove = true;
    }

    return evaluation;
  },

  actOnEvaluation: function (evaluation) {
    if (evaluation.isSunToBeMoved
      && this.sunPosition < gameViewer.boardPiece.sunCenters.length - 1) {
      this.sunPosition++;
      gameViewer.setBoardPiecesPosition(this.sunPosition, this.numberOfPlayers);
    }

    if (evaluation.isEndOfMove) {
      for (let tileIndex of evaluation.toBeMovedToStack) {
        this.removeTileFromTableToStack(this.tilesOnTable[tileIndex]);
      }
      for (let tileIndex of evaluation.toBeTurnedDown) {
        this.tilesOnTable[tileIndex].flipOnTable();
      }
      for (let tileIndex of evaluation.toBeMovedToIgloo) {
        this.removeTileFromTableToIgloo(this.tilesOnTable[tileIndex]);
        this.removeMeepleFromBoardToIgloo(this.tilesOnTable[tileIndex]);
      }
    }
  },

};