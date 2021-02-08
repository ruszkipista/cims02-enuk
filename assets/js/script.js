// generate tiles
document.addEventListener('DOMContentLoaded', init);
function init() {
    generateTiles(false);
}
let gameMaterials = [
    { type: 'tile', name: 'reindeer', count: 9 },
    { type: 'tile', name: 'polarbear', count: 14  },
    { type: 'tile', name: 'seal', count: 14 },
    { type: 'tile', name: 'salmon', count: 14 },
    { type: 'tile', name: 'herring', count: 9 },
    { type: 'tile', name: 'igloo00', count: 1 },
    { type: 'tile', name: 'igloo01', count: 1 },
    { type: 'tile', name: 'igloo02', count: 1 },
    { type: 'tile', name: 'igloo10', count: 1 },
    { type: 'tile', name: 'igloo11', count: 1 },
    { type: 'tile', name: 'igloo12', count: 1 },
    { type: 'tile', name: 'igloo20', count: 1 },
    { type: 'tile', name: 'igloo21', count: 1 },
    { type: 'tile', name: 'igloo22', count: 1 },
    { type: 'figure', name: 'blue', count: 4 },
    { type: 'figure', name: 'red', count: 4 },
    { type: 'figure', name: 'green', count: 4 },
    { type: 'figure', name: 'orange', count: 4 },
    { type: 'figure', name: 'purple', count: 4 },
    { type: 'sun', name: 'sun', count: 4, image: 'figure-sun.png' },
]
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArrayInplace(arr) {
    let j;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
function generateTiles(isRandom) {
    // assemble tiles
    tiles = [];
    for (let piece of gameMaterials) {
        if (piece.type === 'tile') {
            for (let i = 0; i < piece.count; i++) {
                tiles.push({name:piece.name});
            };
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
            <img class="tile-normal" src="./assets/img/tile-${tile.name}.jpg" alt="game tile">
          </div>
          <div class="tile-back">
            <img class="tile-normal" src="./assets/img/tile-ice.jpg" alt="game tile">
          </div>
        </div>
        `
        tileElement.addEventListener('click', handleClick);
        tilesElement.appendChild(tileElement);
    }
}

function handleClick(event){

}