// generate tiles
document.addEventListener('DOMContentLoaded', function () {
  gameState.setupPlayers(4, true);
  generateGameBoard();
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () { setBoardPiecesPosition(); });

const materialTypeTileFace = 'tileface';
const materialTypeTileBack = 'tileback';
const materialTypeImagePath = 'path-image';
const materialTypeFigurePiece = 'piece-figure';
const materialTypeBoardPiece = 'piece-board';
const materialTypeSunPiece = 'piece-sun';
const materialNameIgloo = 'igloo';
const materialNameReindeer = 'reindeer';

function getGameMaterials(attribute) {
  switch (attribute) {
    case materialTypeImagePath:
      return './assets/img/';
    case materialTypeTileBack:
      return { filename: 'tileback-ice.jpg' };
    case materialTypeTileFace:
      return [{ name: 'reindeer', filename: 'tileface-reindeer.jpg', count: 9 },
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
    case materialTypeFigurePiece:
      return [
        { name: 'blue', filename: 'piece-figure-blue.png', count: 4 },
        { name: 'red', filename: 'piece-figure-red.png', count: 4 },
        { name: 'green', filename: 'piece-figure-green.png', count: 4 },
        { name: 'orange', filename: 'piece-figure-orange.png', count: 4 },
        { name: 'purple', filename: 'piece-figure-purple.png', count: 4 }
      ];
    case materialTypeBoardPiece:
      return {
        id: materialTypeBoardPiece,
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
      }
    case materialTypeSunPiece:
      return {
        id: materialTypeSunPiece,
        filename: 'piece-sun.png',
        count: 1
      }
  }
}

const gameState = {
  isTest: null,
  tiles: null,
  sunPosition: null,
  players: null,
  scores: null,

  setupPlayers: function (numberOfPlayers, isTest) {
    this.isTest = isTest;
    this.sunPosition = 0;

    this.players = [];
    const pieceFigures = getGameMaterials(materialTypeFigurePiece);
    shuffleArrayInplace(pieceFigures);
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players[i] = {
        name: pieceFigures[i].name,
        filename: pieceFigures[i].filename,
        figures: [],
      };
      // generate ID for each figure
      for (let j = 0; j < pieceFigures[i].count; j++) {
        this.players[i].figures[j] = { id: `player${i}-figure${j}` };
      };
    }

    this.tiles = [];
    const tileFaces = getGameMaterials(materialTypeTileFace);
    let counter = 0;
    for (let piece of tileFaces) {
      for (let i = 0; i < piece.count; i++) {
        this.tiles.push({ name: piece.name, filename: piece.filename, id: `tile-${counter}` });
        counter++;
      };
    }
  }
};

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArrayInplace(arr) {
  let j;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateGameBoard() {
  const path = getGameMaterials(materialTypeImagePath);
  let tileElement;

  // put game board and sun piece in place
  const pieceBoard = getGameMaterials(materialTypeBoardPiece);
  const pieceSun = getGameMaterials(materialTypeSunPiece);

  const boardElement = document.getElementById('board');
  let boardPiecesHTML = "";
  // add board to game space
  boardPiecesHTML = `<img id="${pieceBoard.id}" src="${path}${pieceBoard.name}" alt="game board">`;
  // addd sun piece to the top of the board
  boardPiecesHTML += `<img id="${pieceSun.id}" src="${path}${pieceSun.filename}" alt="game piece sun">`;
  // add hidden igloo tiles to the middle of the board
  boardPiecesHTML += `<div id="tiles-igloo">`;
  for (let tile of gameState.tiles) {
    if (tile.name === materialNameIgloo) {
      boardPiecesHTML += `<img id="${tile.id}" class="tile-igloo" 
                            src="${path}${tile.filename}"
                            style="visibility: hidden;"
                            alt="game tile ${tile.name}">`;
    }
  }
  boardPiecesHTML += `</div>`;

  // add player figures to the bottom of the board
  for (let i = 0; i < gameState.players.length; i++) {
    boardPiecesHTML += `<div id="figures-player${i}" class="figures-playerx" style="border-top-color:${gameState.players[i].name}">`;
    for (let figure of gameState.players[i].figures) {
      boardPiecesHTML += `<img id="${figure.id}" class="figure-on-board" 
                            src="${path}${gameState.players[i].filename}"
                            alt="game figure ${gameState.players[i].name}">`;
    }
    boardPiecesHTML += `</div>`;
  }


  boardElement.innerHTML = boardPiecesHTML;

  if (!gameState.isTest) { shuffleArrayInplace(gameState.tiles) };

  let tilesElement = document.getElementById('tiles');
  let backtileName = getGameMaterials(materialTypeTileBack).filename;

  // assemble tiles
  for (let tile of gameState.tiles) {
    tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.setAttribute('data-id', tile.id);
    tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${path}${backtileName}" alt="game tile back">
          </div>
          <div class="tile-front">
            ${(gameState.isTest) ? tile.name : ""}
          </div>
          <div class="tile-back">
            <img src="${path}${tile.filename}" alt="game tile ${tile.name}">
          </div>
        </div>
        `
    tileElement.addEventListener('click', handleTileClick);
    tilesElement.appendChild(tileElement);
  }
  setBoardPiecesPosition();
}

function setBoardPiecesPosition() {
  const pieceBoard = getGameMaterials(materialTypeBoardPiece);
  const boardElement = document.getElementById(pieceBoard.id);
  const boardWidth = boardElement.clientWidth;
  const boardLeftOffset = boardElement.offsetLeft;
  const sunLength = boardWidth * pieceBoard.sunLength;
  document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
  document.documentElement.style.setProperty('--piece-sun-fromtop',
    `${boardWidth * pieceBoard.sunCenters[gameState.sunPosition][0] - sunLength / 2}px`);
  document.documentElement.style.setProperty('--piece-sun-fromleft',
    `${boardLeftOffset + boardWidth * pieceBoard.sunCenters[gameState.sunPosition][1] - sunLength / 2}px`);
  document.documentElement.style.setProperty('--piece-sun-rotate',
    `${gameState.sunPosition * 130}deg`);

  const iglooLength = boardWidth * pieceBoard.iglooLength;
  document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3 + 2}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromtop',
    `${boardWidth * pieceBoard.igloo3x3TopLeftCorner[0]}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromleft',
    `${boardLeftOffset + boardWidth * pieceBoard.igloo3x3TopLeftCorner[1]}px`);

  const figureWidth = boardWidth * pieceBoard.figureOnBoardWidth;
  document.documentElement.style.setProperty('--board-figure-width', `${figureWidth}px`);
  document.documentElement.style.setProperty('--board-figures-width', `${(figureWidth + 4) * gameState.players[0].figures.length + 2}px`);
  for (let i = 0; i < gameState.players.length; i++) {
    document.documentElement.style.setProperty('--board-figures-fromtop',
      `${boardWidth * pieceBoard.figuresOnBoardFromTop}px`);
    document.documentElement.style.setProperty(`--board-figures-fromleft${i}`,
      `${boardLeftOffset + boardWidth * pieceBoard.figuresOnBoardFromLeft[i]}px`);
  }
}

function handleTileClick(event) {
  let tileInner = event.currentTarget.children[0];
  let isTopRight = event.layerY < event.layerX;
  let isTopLeft = event.layerY < (event.currentTarget.offsetWidth - event.layerX);
  if (tileInner.classList.contains('tile-flip-up')
    || tileInner.classList.contains('tile-flip-down')
    || tileInner.classList.contains('tile-flip-left')
    || tileInner.classList.contains('tile-flip-right')) {
    tileInner.classList.remove('tile-flip-up', 'tile-flip-down', 'tile-flip-left', 'tile-flip-right');
  } else {
    if (isTopLeft && isTopRight) { tileInner.classList.add('tile-flip-up'); }
    else if (isTopLeft && !isTopRight) { tileInner.classList.add('tile-flip-left'); }
    else if (!isTopLeft && isTopRight) { tileInner.classList.add('tile-flip-right'); }
    else if (!isTopLeft && !isTopRight) { tileInner.classList.add('tile-flip-down'); }
    // learnt "find" from https://usefulangle.com/post/3/javascript-search-array-of-objects
    let tile = gameState.tiles.find(function (element, index) {
      if (element.id === event.currentTarget.dataset.id) return true;
    })
    switch (tile.name) {
      case materialNameIgloo:
        setVisibilityTileOnBoard(event.currentTarget.dataset.id, true);
        break;
      case materialNameReindeer:
        const pieceBoard = getGameMaterials(materialTypeBoardPiece);
        if (gameState.sunPosition < pieceBoard.sunCenters.length - 1) {
          ++gameState.sunPosition;
          setBoardPiecesPosition();
        };
        break;
    }
  }
}

function setVisibilityTileOnBoard(elementID, isVisible) {
  const tileElement = document.getElementById(elementID);
  if (isVisible) {
    tileElement.style.visibility = 'visible';
  } else {
    tileElement.style.visibility = 'hidden';
  }
}