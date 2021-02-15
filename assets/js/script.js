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
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () { gameViewer.setBoardPiecesPosition(); });

// class TILE
//============
class Tile {
  static NAME_REINDEER = 'reindeer';
  static NAME_POLARBEAR = 'polarbear';
  static NAME_SEAL = 'seal';
  static NAME_SALMON = 'salmon';
  static NAME_HERRING = 'herring';
  static RANKING = [Tile.NAME_HERRING, Tile.NAME_SALMON, Tile.NAME_SEAL, Tile.NAME_POLARBEAR, Tile.NAME_REINDEER]
  static NAME_IGLOO = 'igloo';

  constructor(id, name, filename) {
    this.id = id;
    this.isFaceUp = null;
    this.idOnTable = `${id}-ontable`;
    this.idOnIgloo = `${(name === Tile.NAME_IGLOO) ? id + '-onigloo' : ''}`;
    this.name = name;
    this.filename = filename;
    this.rank = Tile.RANKING.indexOf(name);
    this.idFigureOnIgloo = `${(name === Tile.NAME_IGLOO) ? 'figure-on-' + id : ''}`;
  }

  placeOnTable(isFaceUp) {
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
      else { tileInnerElement.classList.add('tile-flip-right'); };

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

// class FIGURE
//============
class Figure {

  constructor(id, name, filename) {
    this.id = id;
    this.isOnBoard = true;
    this.idOnBoard = `${id}-onboard`;
    this.idOnIgloo = null;
    this.name = name;
    this.filename = filename;
  }

  placeOnBoard() {
    return `<img id="${this.idOnBoard}" class="figure-on-board" 
    src="${gameViewer.imagePath}${this.filename}"
    alt="game figure ${this.name}">`;
  }

  removeFromBoardToIgloo(idOnIgloo) {
    if (this.isOnBoard) {
      this.isOnBoard = false;
      this.idOnIgloo = idOnIgloo;
      const figureOnIglooElement = document.getElementById(idOnIgloo);
      figureOnIglooElement.setAttribute('src', gameViewer.imagePath + this.filename);
    }
  }

  removeFromIglooToBoard() {
    if (!this.isOnBoard) {
      this.isOnBoard = true;
      const figureOnIglooElement = document.getElementById(this.idOnIgloo);
      figureOnIglooElement.setAttribute('src', "");
      this.idOnIgloo = null;
      gameViewer.setVisibilityOfElement(this.idOnIgloo, false);
      gameViewer.setVisibilityOfElement(this.idOnBoard, true);
    }
  }
}

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

  backgrounds: [{ filename: 'enuk-background-phase1.jpg' }, { filename: 'enuk-background-phase2.jpg' }],

  tileFaces: [
    { name: Tile.NAME_REINDEER, filename: 'tileface-reindeer.jpg', count: 9 },
    { name: Tile.NAME_POLARBEAR, filename: 'tileface-polarbear.jpg', count: 14 },
    { name: Tile.NAME_SEAL, filename: 'tileface-seal.jpg', count: 14 },
    { name: Tile.NAME_SALMON, filename: 'tileface-salmon.jpg', count: 14 },
    { name: Tile.NAME_HERRING, filename: 'tileface-herring.jpg', count: 9 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo00.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo01.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo02.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo10.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo11.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo12.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo20.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo21.jpg', count: 1 },
    { name: Tile.NAME_IGLOO, filename: 'tileface-igloo22.jpg', count: 1 }
  ],

  tileEdges: [
    { filename: 'tileedge-mid.png' },
    { filename: 'tileedge-top.png' },
  ],

  iconCollectTiles: { id: 'icon-collect', filename: 'icon-collect.png', },

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
    iconCollectTopLeftCorner: [0, 0.885],
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

  setBackground: function () {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.style.backgroundImage = `url("${this.imagePath}${this.backgrounds[gameController.phase].filename}")`;
  },

  generateGameBoard: function () {
    this.setBackground();
    // put game board in place
    let boardPiecesHTML = "";
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // addd SUN piece to the top of the board
    boardPiecesHTML += `<img id="${this.sunPiece.id}" src="${this.imagePath}${this.sunPiece.filename}" alt="game piece sun">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += `<div id="tiles-onigloo" class="layer-onigloo">`;
    for (let tile of gameController.tiles) {
      if (tile.name === Tile.NAME_IGLOO) {
        boardPiecesHTML += tile.placeOnIgloo();
      }
    }
    boardPiecesHTML += `</div>`;

    // add hidden FIGURES on top of igloo tiles - without src and alt
    boardPiecesHTML += `<div id="figures-onigloo" class="layer-onigloo">`;
    for (let tile of gameController.tiles) {
      if (tile.name === Tile.NAME_IGLOO) {
        boardPiecesHTML += `<div class="tile-onigloo"><img 
                                id="${tile.idFigureOnIgloo}"
                                class="figure-onigloo"
                                style="visibility: hidden;" src="" alt="game figure"></div>`;
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
        boardPiecesHTML += figure.placeOnBoard();
      }
      boardPiecesHTML += `</div>`;
    };

    // add CollectTiles icon
    boardPiecesHTML += `<img id="${gameViewer.iconCollectTiles.id}" 
                         src="${this.imagePath}${gameViewer.iconCollectTiles.filename}"
                         alt="collect tiles button">`;

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = boardPiecesHTML;

    const collectElement = document.getElementById(gameViewer.iconCollectTiles.id);
    collectElement.addEventListener('click', gameViewer.handleIconClick);

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
    // flip transition time
    document.documentElement.style.setProperty('--flip-transition-time', `${gameViewer.tileBack.flipTimeMS}ms`);
    // sun piece position
    const sunLength = boardWidth * this.boardPiece.sunLength;
    document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
    document.documentElement.style.setProperty('--piece-sun-fromtop',
      `${boardWidth * this.boardPiece.sunCenters[gameController.sunPosition][0] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.sunCenters[gameController.sunPosition][1] - sunLength / 2}px`);
    document.documentElement.style.setProperty('--piece-sun-rotate',
      `${gameController.sunPosition * 130}deg`);
    // igloo3x3 on board position
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
    document.documentElement.style.setProperty('--figure-onigloo-width', `${figureWidth * 2}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${figureWidth * this.figurePieces[0].count}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${boardWidth * this.boardPiece.figuresOnBoardFromTop}px`);
    for (let i = 0; i < gameController.players.length; i++) {
      document.documentElement.style.setProperty('--board-figures-fromtop',
        `${boardWidth * this.boardPiece.figuresOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`,
        `${boardLeftOffset + boardWidth * this.boardPiece.figuresOnBoardFromLeft[i]}px`);
    }
    // collect icon position
    document.documentElement.style.setProperty('--icon-collect-fromtop',
      `${boardWidth * this.boardPiece.iconCollectTopLeftCorner[0]}px`);
    document.documentElement.style.setProperty('--icon-collect-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.iconCollectTopLeftCorner[1]}px`);
  },

  handleTileClick: function (event) {
    let isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
    gameController.handleTileClickOnTable(event.currentTarget.id, isClickedOnLeft);
  },

  handleIconClick: function (event) {
    gameController.handleIconClick(event.currentTarget.id);
  },
};

// object GAMECONTROLLER
//======================
const gameController = {
  PHASE1: 0,
  PHASE2: 1,

  isTest: null,
  phase: null,
  tilesOnTable: null,
  tilesOnIgloo: null,
  sunPosition: null,
  round: null,
  whosMove: null,
  human: null,
  players: null,
  listenToClick: false,

  setupGame: function (numberOfPlayers, isTest) {
    this.phase = this.PHASE1;
    this.isTest = isTest;
    this.sunPosition = 0;
    this.round = 0;
    this.setupPlayers(numberOfPlayers);
    this.setupTiles(isTest);
    gameViewer.generateGameBoard();
    gameViewer.setBoardPiecesPosition();
    if (isTest) { this.whosMove = this.human }
    else { this.whosMove = 0 };
    this.listenToClick = true;
  },

  setupPlayers: function (numberOfPlayers) {
    this.human = getRandomInt(numberOfPlayers);

    this.players = [];
    shuffleArrayInplace(gameViewer.figurePieces);
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players[i] = {
        name: gameViewer.figurePieces[i].name,
        figures: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
      };
      // generate Figures
      for (let j = 0; j < gameViewer.figurePieces[i].count; j++) {
        this.players[i].figures[j] = new Figure(`player${i}-figure${j}`,
          `figure-${gameController.players[i].name}`,
          (i === this.human) ? gameViewer.figurePieces[i].filenameHuman : gameViewer.figurePieces[i].filenameMachine);
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
    let tile = this.tilesOnTable.find(function (element, index) {
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

  removeTileFromTableToStack(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.players[this.whosMove].tilesInStack.push(tile);
      tile.addToStack(this.whosMove);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false)
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

  removeFigureFromBoardToIgloo(tile) {
    for (let i = this.players[this.whosMove].figures.length - 1; i >= 0; i--) {
      let figure = this.players[this.whosMove].figures[i];
      if (figure.isOnBoard) {
        figure.removeFromBoardToIgloo(tile.idFigureOnIgloo);
        gameViewer.setVisibilityOfElement(figure.idOnBoard, false);
        gameViewer.setVisibilityOfElement(figure.idOnIgloo, true);
        break;
      }
    }
  },

  handleTileClickOnTable: function (tileIdOnTable, isClickedOnLeft) {
    if (this.whosMove !== this.human || !this.listenToClick) {
      return;
    }
    const tile = this.findTileOnTable(tileIdOnTable);
    if (tile.isFaceUp === false) {
      tile.flipOnTable(isClickedOnLeft);
      let evaluationResult = this.evaluateTilesOnTablePhase1(tile, false);
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

  handleIconClick: function (iconID) {
    if (this.whosMove !== this.human) {
      return;
    }
    // if clicked on the CollecTiles icon
    if (iconID === gameViewer.iconCollectTiles.id
      // and it is the Human player's move
      && this.whosMove === this.human) {
      let evaluationResult = this.evaluateTilesOnTablePhase1(null, true);
      this.actOnEvaluation(evaluationResult);
    }
  },

  evaluateTilesOnTablePhase1: function (clickedTile, isPlayerWantToCollect) {
    let evaluation = new Evaluation();

    if (this.phase !== this.PHASE1) { return evaluation; }

    let toBeMovedToStack = new Set();
    let toBeTurnedDown = new Set();

    if (clickedTile !== null && clickedTile.name === Tile.NAME_REINDEER) {
      evaluation.isSunToBeMoved = true;
    }

    for (let i = 0; i < this.tilesOnTable.length; i++) {
      if (this.tilesOnTable[i].isFaceUp) {
        if (this.tilesOnTable[i].rank < 0) {
          if (this.tilesOnTable[i].name === Tile.NAME_IGLOO) {
            evaluation.toBeMovedToIgloo.push(i);
          };
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
    if (evaluation.isSunToBeMoved
      && this.sunPosition === gameViewer.boardPiece.sunCenters.length - 2) {
      evaluation.isEndOfPhase1 = true;
    }
    // move ends if
    // - player decided to collect the turned up tiles, or
    // - last tile is an igloo, or
    // - at least one animal hid (tile to be turned down)
    if (evaluation.isEndOfPhase1
      || isPlayerWantToCollect
      || clickedTile.name === Tile.NAME_IGLOO
      || evaluation.toBeTurnedDown.length > 0) {
      evaluation.isEndOfMove = true;
    }

    return evaluation;
  },

  actOnEvaluation: function (evaluation) {
    if (evaluation.isSunToBeMoved
      && this.sunPosition < gameViewer.boardPiece.sunCenters.length - 1) {
      this.sunPosition++;
      gameViewer.setBoardPiecesPosition();
    };

    if (evaluation.isEndOfPhase1) {
      this.phase++;
      gameViewer.setBackground(); 
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
        this.removeFigureFromBoardToIgloo(this.tilesOnTable[tileIndex]);
      }
    }
  },

}