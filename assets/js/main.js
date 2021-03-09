// initialize Rules page after Load
window.addEventListener('DOMContentLoaded', function () {
  gameRules.init();
});

const gameRules = {
  sunPiecePrefix: 'sunpiece',
  numberOfSunPositions: 0,
  tilesPerTypePrefix: 'tilespertype',
  numberOfTilesPerType: 0,

  init: function () {
    this.numberOfSunPositions = gameViewer.minSunPositions;
    this.numberOfTilesPerType = gameViewer.minTilesPerType;

    // SETTING: Color
    const colorFieldsetElement = document.getElementById('color-picker');
    for (let meeple of gameViewer.meeplePieces) {
      const meepleId = `color-${meeple.name}`;
      colorFieldsetElement.innerHTML +=
        `<label for="${meepleId}">
          <input type="radio" id="${meepleId}" name="colors">
          <img src="${gameViewer.imagePath}${meeple.filenameHuman}" class="rules-meeple" alt="${meeple.name} meeple">
        </label>`;
    }

    // SETTING: Opponents
    const opponentsFieldsetElement = document.getElementById('opponents-picker');
    for (let opponent = 0; opponent < gameViewer.numberOfMeeples - 1; opponent++) {
      const opponentId = `opponent-${opponent}`;
      opponentsFieldsetElement.innerHTML +=
        `<label for="${opponentId}">
           <input type="checkbox" id="${opponentId}" name="${opponentId}">
           <img src="${gameViewer.imagePath}${gameViewer.meepleMachine4Count.filename}" class="rules-meeple" alt="${opponentId} meeple">
         </label>`;
    }

    // SETTING: Sun positions
    gameRules.setupSunPositionsPicker(gameRules.sunPiecePrefix);
    gameRules.setElementsVisibility(gameRules.sunPiecePrefix, gameRules.numberOfSunPositions, 1, gameViewer.maxSunPositions, 'rules-sun-positions');

    // SETTING: number of Tiles Per Animal Type
    gameRules.setupTilesPerTypePicker(gameRules.tilesPerTypePrefix);
    gameRules.setElementsVisibility(gameRules.tilesPerTypePrefix, gameRules.numberOfTilesPerType, 1, gameViewer.maxTilesPerType, 'rules-tilespertype');

    gameController.initialize(3, 2, gameViewer.numberOfMeeples, 3, true, true);
  },

  setupSunPositionsPicker: function (prefix) {
    const positionsFieldsetElement = document.getElementById('sunpos-picker');
    const sunPiece = gameViewer.iconFaces.find(function (element) {
      if (element.name === gameController.ICONS.sunPiece.name) { return true; }
    });
    const sunPosition = gameViewer.iconFaces.find(function (element) {
      if (element.name === gameController.ICONS.sunPositions.name) { return true; }
    });
    for (let position = 1; position <= gameViewer.maxSunPositions; position++) {
      const sunPieceElement = document.createElement('div');
      sunPieceElement.classList.add('rules-sun');
      sunPieceElement.innerHTML +=
        `<img src="${gameViewer.imagePath}${sunPosition.filename}" class="rules-sun" alt="sun position">
         <img src="${gameViewer.imagePath}${sunPiece.filename}" id="${prefix}-${position}" class="rules-sun" alt="sun piece">`;
      if (position >= gameViewer.minSunPositions) { sunPieceElement.addEventListener('click', gameRules.handleSunClick); }
      positionsFieldsetElement.appendChild(sunPieceElement);
    }
  },

  handleSunClick: function (event) {
    gameRules.numberOfSunPositions = parseInt(event.currentTarget.lastChild.id.split('-')[1]);
    gameRules.setElementsVisibility(gameRules.sunPiecePrefix, gameRules.numberOfSunPositions, 1, gameViewer.maxSunPositions, 'rules-sun-positions');
  },

  setElementsVisibility: function (prefix, current, from, to, classToUpdate) {
    for (let position = from; position <= to; position++) {
      sunPieceId = `${prefix}-${position}`;
      const sunPieceElement = document.getElementById(sunPieceId);
      sunPieceElement.style.visibility = (position <= current) ? 'visible' : 'hidden';
    };
    if (classToUpdate) {
      const counterElements = document.getElementsByClassName(classToUpdate);
      for (let counterElement of counterElements) {
        counterElement.textContent = current;
      }
    }
  },

  setupTilesPerTypePicker: function (prefix) {
    const containerElement = document.getElementById('tilespertype-picker');
    const tilePiece = gameViewer.tileBack;
    for (let position = 1; position <= gameViewer.maxTilesPerType; position++) {
      const tilePieceElement = document.createElement('div');
      tilePieceElement.classList.add('rules-tilecounter');
      tilePieceElement.innerHTML +=
        `<img src="${gameViewer.imagePath}${tilePiece.filename}" id="${prefix}-${position}" class="rules-tilecounter" alt="tile-back counter">`;
      if (position >= gameViewer.minTilesPerType) { tilePieceElement.addEventListener('click', gameRules.handleTileClick); }
      containerElement.appendChild(tilePieceElement);
    }
  },

  handleTileClick: function (event) {
    gameRules.numberOfTilesPerType = parseInt(event.currentTarget.lastChild.id.split('-')[1]);
    gameRules.setElementsVisibility(gameRules.tilesPerTypePrefix, gameRules.numberOfTilesPerType, 1, gameViewer.maxTilesPerType, 'rules-tilespertype');
  },

}

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