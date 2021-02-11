// generate tiles
document.addEventListener('DOMContentLoaded', init);
function init() {
    generateTiles(true);
}
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function(){setBoardPiecesPosition();});

const materialTypeTileFace = 'tileface';
const materialTypeTileBack = 'tileback';
const materialTypeImagePath = 'path-image';
const materialTypeFigurePiece = 'piece-figure';
const materialTypeBoardPiece = 'piece-board';
const materialTypeSunPiece = 'piece-sun';
const materialNameIgloo = 'igloo';

const gameState = {
  isTest: true,
  sunPosition: 0,
  players: [],
  scores: [],
};

function getGameMaterials(attribute){
  switch (attribute) {
    case materialTypeImagePath:
      return './assets/img/';
    case materialTypeTileBack:
      return { filename: 'tileback-ice.jpg'};
    case materialTypeTileFace:
      return [{ name: 'reindeer', filename: 'tileface-reindeer.jpg', count: 9 },
              { name: 'polarbear', filename: 'tileface-polarbear.jpg', count: 14 },
              { name: 'seal', filename: 'tileface-seal.jpg', count: 14 },
              { name: 'salmon', filename: 'tileface-salmon.jpg', count: 14 },
              { name: 'herring', filename: 'tileface-herring.jpg', count: 9 },
              { name: 'igloo', posRow:0,posCol:0, filename: 'tileface-igloo00.jpg', count: 1 },
              { name: 'igloo', posRow:0,posCol:1, filename: 'tileface-igloo01.jpg', count: 1 },
              { name: 'igloo', posRow:0,posCol:2, filename: 'tileface-igloo02.jpg', count: 1 },
              { name: 'igloo', posRow:1,posCol:0, filename: 'tileface-igloo10.jpg', count: 1 },
              { name: 'igloo', posRow:1,posCol:1, filename: 'tileface-igloo11.jpg', count: 1 },
              { name: 'igloo', posRow:1,posCol:2, filename: 'tileface-igloo12.jpg', count: 1 },
              { name: 'igloo', posRow:2,posCol:0, filename: 'tileface-igloo20.jpg', count: 1 },
              { name: 'igloo', posRow:2,posCol:1, filename: 'tileface-igloo21.jpg', count: 1 },
              { name: 'igloo', posRow:2,posCol:2, filename: 'tileface-igloo22.jpg', count: 1 }];
    case materialTypeFigurePiece:
      return [{ name: 'blue', count: 4 },
              { name: 'red', count: 4 },
              { name: 'green', count: 4 },
              { name: 'orange', count: 4 },
              { name: 'purple', count: 4 }];
    case materialTypeBoardPiece:              
      return { id: materialTypeBoardPiece,
               name: 'enuk-board-front.jpg',
               sunLength: 0.08556,
               sunCenters:[
                 [0.144,0.072],
                 [0.115,0.185],
                 [0.09,0.291],
                 [0.074,0.404],
                 [0.068,0.51],
                 [0.07,0.622],
                 [0.086,0.73],
                 [0.112,0.835],
                 [0.143,0.935]],
               iglooLength: 0.1355,
               igloo3x3TopLeftCorner:[0.232,0.296],
              }
    case materialTypeSunPiece:
      return { id: materialTypeSunPiece,
               filename: 'piece-sun.png', 
               count: 1 }
  }
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArrayInplace(arr) {
    let j;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function generateTiles(isRandom) {
    const path = getGameMaterials(materialTypeImagePath);
    let tileElement; 

    // put game board and sun piece in place
    const pieceBoard = getGameMaterials(materialTypeBoardPiece);
    const pieceSun = getGameMaterials(materialTypeSunPiece);
    const tileFaces = getGameMaterials(materialTypeTileFace);
    const boardElement = document.getElementById('board');
    let boardPiecesHTML = `
      <img id="${pieceBoard.id}" src="${path}${pieceBoard.name}" alt="game board">           
      <img id="${pieceSun.id}" src="${path}${pieceSun.filename}" alt="game piece sun">
      <div id="tiles-igloo">
    `;
    for (let piece of tileFaces) {
      if (piece.name === materialNameIgloo){
        boardPiecesHTML += `<img class="tile-igloo" 
                            id="${piece.name+piece.posRow+piece.posCol}" 
                            src="${path}${piece.filename}"
                            style="visibility: hidden;"
                            alt="game tile igloo">`;        
      }
    }
    boardPiecesHTML += `</div>`;
    boardElement.innerHTML = boardPiecesHTML;

    setVisibilityTileOnBoard('igloo00',true);

    document.getElementById(pieceSun.id).addEventListener('click', handleSunClick);

    let tiles = [];
    for (let piece of tileFaces) {
      for (let i = 0; i < piece.count; i++) {
        tiles.push({name: piece.name, filename: piece.filename});
      };
    }

    if (isRandom) { shuffleArrayInplace(tiles) };

    let tilesElement = document.getElementById('tiles');
    let backtileName = getGameMaterials(materialTypeTileBack).filename;

    // assemble tiles
    for (let tile of tiles) {
        tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${path}${backtileName}" alt="game tile back">
          </div>
          <div class="tile-front">
            ${(gameState.isTest) ? tile.name : ""}
          </div>
          <div class="tile-back">
            <img src="${path}${tile.filename}" alt="game tile face">
          </div>
        </div>
        `
        tileElement.addEventListener('click', handleTileClick);
        tilesElement.appendChild(tileElement);
    }
    setBoardPiecesPosition();
}

function setBoardPiecesPosition(){
  const pieceBoard = getGameMaterials(materialTypeBoardPiece);
  const boardElement = document.getElementById(pieceBoard.id);
  const boardWidth = boardElement.clientWidth;
  const boardLeftOffset = boardElement.offsetLeft;
  const sunLength = boardWidth * pieceBoard.sunLength;
  document.documentElement.style.setProperty('--piece-sun-length', `${sunLength}px`);
  document.documentElement.style.setProperty('--piece-sun-fromtop', 
      `${boardWidth * pieceBoard.sunCenters[gameState.sunPosition][0] - sunLength/2}px`);
  document.documentElement.style.setProperty('--piece-sun-fromleft', 
      `${boardLeftOffset + boardWidth * pieceBoard.sunCenters[gameState.sunPosition][1] - sunLength/2}px`);
  document.documentElement.style.setProperty('--piece-sun-rotate', 
      `${gameState.sunPosition * 130}deg`);

  const iglooLength = boardWidth * pieceBoard.iglooLength;
  document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-length', `${iglooLength * 3 +14}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromtop', 
      `${boardWidth * pieceBoard.igloo3x3TopLeftCorner[0]}px`);
  document.documentElement.style.setProperty('--piece-igloo3x3-fromleft', 
      `${boardLeftOffset + boardWidth * pieceBoard.igloo3x3TopLeftCorner[1]}px`); 
}

function handleSunClick(event){
  let pieceBoard = getGameMaterials(materialTypeBoardPiece);
  if (gameState.sunPosition < pieceBoard.sunCenters.length-1){
    ++gameState.sunPosition;
    setBoardPiecesPosition();
  };
}

function handleTileClick(event){
  let tileInner = event.currentTarget.children[0];
  let isTopRight = event.layerY < event.layerX;
  let isTopLeft  = event.layerY < (event.currentTarget.offsetWidth - event.layerX);
  if (tileInner.classList.contains('tile-flip-up')
    || tileInner.classList.contains('tile-flip-down')
    || tileInner.classList.contains('tile-flip-left')
    || tileInner.classList.contains('tile-flip-right')){
      tileInner.classList.remove('tile-flip-up','tile-flip-down','tile-flip-left','tile-flip-right');
  } else {
    if ( isTopLeft &&  isTopRight) { tileInner.classList.add('tile-flip-up');}
    if ( isTopLeft && !isTopRight) { tileInner.classList.add('tile-flip-left');}
    if (!isTopLeft &&  isTopRight) { tileInner.classList.add('tile-flip-right');}
    if (!isTopLeft && !isTopRight) { tileInner.classList.add('tile-flip-down');}
  }
}

function setVisibilityTileOnBoard(elementID,isVisible){
  const tileElement = document.getElementById(elementID);
  if (isVisible){
    tileElement.style.visibility = 'visible';
  } else {
    tileElement.style.visibility = 'hidden';
  }
}