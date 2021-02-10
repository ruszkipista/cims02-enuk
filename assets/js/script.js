// generate tiles
document.addEventListener('DOMContentLoaded', init);
function init() {
    generateTiles(true);
}
let materialTypeTileFace = 'tileface';
let materialTypeTileBack = 'tileback';
function getGameMaterials(){
  return [
    { type: 'path', name:'image', value:'./assets/img/'},
    { type: materialTypeTileBack, name: 'ice'},
    { type: materialTypeTileFace, name: 'reindeer', count: 9 },
    { type: materialTypeTileFace, name: 'polarbear', count: 14  },
    { type: materialTypeTileFace, name: 'seal', count: 14 },
    { type: materialTypeTileFace, name: 'salmon', count: 14 },
    { type: materialTypeTileFace, name: 'herring', count: 9 },
    { type: materialTypeTileFace, name: 'igloo00', count: 1 },
    { type: materialTypeTileFace, name: 'igloo01', count: 1 },
    { type: materialTypeTileFace, name: 'igloo02', count: 1 },
    { type: materialTypeTileFace, name: 'igloo10', count: 1 },
    { type: materialTypeTileFace, name: 'igloo11', count: 1 },
    { type: materialTypeTileFace, name: 'igloo12', count: 1 },
    { type: materialTypeTileFace, name: 'igloo20', count: 1 },
    { type: materialTypeTileFace, name: 'igloo21', count: 1 },
    { type: materialTypeTileFace, name: 'igloo22', count: 1 },
    { type: 'piece', name: 'figure-blue', count: 4 },
    { type: 'piece', name: 'figure-red', count: 4 },
    { type: 'piece', name: 'figure-green', count: 4 },
    { type: 'piece', name: 'figure-orange', count: 4 },
    { type: 'piece', name: 'figure-purple', count: 4 },
    { type: 'piece', name: 'sun', count: 1 },
  ]
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
    let gameMaterials = getGameMaterials();
    let pathName = "";
    let backtileName = "";

    // assemble tiles
    tiles = [];
    for (let piece of gameMaterials) {
        if (piece.type === materialTypeTileFace) {
            for (let i = 0; i < piece.count; i++) {
                tiles.push({name:piece.name});
            };
        } else if (piece.type === 'path' && piece.name === 'image') {
            pathName = piece.value;
        } else if (piece.type === 'tileback') {
            backtileName = piece.name;
        }
    };
    if (isRandom) { shuffleArrayInplace(tiles) };
    let tilesElement = document.getElementById('tiles');
    let tileElement;
    for (let tile of tiles) {
        tileElement = document.createElement('div');
        tileElement.setAttribute('class','tile');
        tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
          <img src="${pathName}${materialTypeTileBack}-${backtileName}.jpg" alt="game tile back">
          </div>
          <div class="tile-back">
          <img src="${pathName}${materialTypeTileFace}-${tile.name}.jpg" alt="game tile face">
          </div>
        </div>
        `
        tileElement.addEventListener('click', handleClick);
        tilesElement.appendChild(tileElement);
    }
}

function handleClick(event){
  let tileInner = event.currentTarget.children[0];
  let isTopRight = event.layerY < event.layerX;
  let isTopLeft  = event.layerY < (event.currentTarget.offsetWidth - event.layerX);
  if (tileInner.classList.contains('tile-flip-up')
    || tileInner.classList.contains('tile-flip-down')
    || tileInner.classList.contains('tile-flip-left')
    || tileInner.classList.contains('tile-flip-right')){
      tileInner.classList.remove('tile-flip-up','tile-flip-down','tile-flip-left','tile-flip-right');
  } else {
    if ( isTopLeft &&  isTopRight) { tileInner.classList.toggle('tile-flip-up');}
    if ( isTopLeft && !isTopRight) { tileInner.classList.toggle('tile-flip-left');}
    if (!isTopLeft &&  isTopRight) { tileInner.classList.toggle('tile-flip-right');}
    if (!isTopLeft && !isTopRight) { tileInner.classList.toggle('tile-flip-down');}
  }

  
}