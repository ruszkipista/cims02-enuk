// initialize Rules page after Load
window.addEventListener('DOMContentLoaded', function () {
  gameRules.init();
});

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

const gameRules = {
  numberOfSunPositions: 0,

  init: function () {
    this.numberOfSunPositions = gameViewer.minSunPositions;

    const colorFieldsetElement = document.getElementById('color-picker');
    for (let meeple of gameViewer.meeplePieces) {
      const meepleId = `color-${meeple.name}`;
      colorFieldsetElement.innerHTML +=
        `<label for="${meepleId}">
          <input type="radio" id="${meepleId}" name="colors">
          <img src="${gameViewer.imagePath}${meeple.filenameHuman}" class="rules-meeple" alt="${meeple.name} meeple">
        </label>`;
    }

    const opponentsFieldsetElement = document.getElementById('opponents-picker');
    for (let opponent = 0; opponent < gameViewer.numberOfMeeples - 1; opponent++) {
      const opponentId = `opponent-${opponent}`;
      opponentsFieldsetElement.innerHTML +=
        `<label for="${opponentId}">
           <input type="checkbox" id="${opponentId}" name="${opponentId}">
           <img src="${gameViewer.imagePath}${gameViewer.meepleMachine4Count.filename}" class="rules-meeple" alt="${opponentId} meeple">
         </label>`;
    }

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
         <img src="${gameViewer.imagePath}${sunPiece.filename}" id="sunpiece-${position}" class="rules-sun" alt="sun piece">`;
      if (position >= gameViewer.minSunPositions) { sunPieceElement.addEventListener('click', gameRules.handleSunClick); }
      positionsFieldsetElement.appendChild(sunPieceElement);
    }
    gameRules.setSunPiecesVisibility();

    gameController.initialize(3, 2, gameViewer.numberOfMeeples, 3, true, true);
  },

  handleSunClick: function (event) {
    gameRules.numberOfSunPositions = parseInt(event.currentTarget.lastChild.id.split('-')[1]);
    gameRules.setSunPiecesVisibility();
  },

  setSunPiecesVisibility: function () {
    for (let position = 1; position <= gameViewer.maxSunPositions; position++) {
      sunPieceId = `sunpiece-${position}`;
      const sunPieceElement = document.getElementById(sunPieceId);
      sunPieceElement.style.visibility = (position <= gameRules.numberOfSunPositions) ? 'visible' : 'hidden';
    };
    const sunPositionsElement = document.getElementById('rules-sun-positions');
    sunPositionsElement.textContent = gameRules.numberOfSunPositions;
  }
}

