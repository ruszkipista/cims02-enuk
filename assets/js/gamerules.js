// initialize Rules page after Load
window.addEventListener('DOMContentLoaded', function () {
  gameRules.init();
});

const gameRules = {
  soundTargetId: 'rules-sound',
  testTargetId: 'rules-test',
  colorPrefix: 'color',
  opponentsPrefix: 'opponent',
  sunPiecePrefix: 'sunpiece',
  tilesPerTypePrefix: 'tilespertype',

  // isSoundsOn: false,
  // isTestOn: false,
  // colorIndexHuman: 0,
  // numberOfOpponents: 0,
  // numberOfSunPositions: 0,
  // numberOfTilesPerType: 0,

  init: function () {

    this.numberOfSunPositions = gameViewer.minSunPositions;
    this.numberOfTilesPerType = gameViewer.minTilesPerType;

    const startElement = document.getElementById('rules-start');
    startElement.addEventListener('click', gameRules.handlePlayClick);

    // SETTING: Sounds
    // learnt deserialization from here https://stackoverflow.com/questions/3263161/cannot-set-boolean-values-in-localstorage
    gameRules.setupSoundsSwitch();

    // SETTING: Test
    gameRules.setupTestSwitch();

    // SETTING: Color
    gameRules.setupColorPicker(gameRules.colorPrefix, gameRules.colorIndexHuman);

    // SETTING: Opponents
    gameRules.setupOpponentsPicker(gameRules.opponentsPrefix);

    // SETTING: Sun positions
    gameRules.setupSunPositionsPicker(gameRules.sunPiecePrefix);

    // SETTING: number of Tiles Per Animal Type
    gameRules.setupTilesPerTypePicker(gameRules.tilesPerTypePrefix);

  },

  handlePlayClick: function (event) {
    gameController.init(gameRules.colorIndexHuman,
      gameRules.numberOfSunPositions,
      1 + gameRules.numberOfOpponents,
      gameViewer.numberOfMeeples,
      gameRules.numberOfTilesPerType,
      gameRules.isSoundsOn,
      gameRules.isTestOn);
  },

  setupSoundsSwitch: function () {
    this.isSoundsOn = JSON.parse(localStorage.getItem(this.soundTargetId));
    this.setSwitchTarget(this.soundTargetId, this.isSoundsOn);
    const soundElement = document.getElementById('sound-picker-switch');
    soundElement.checked = this.isSoundsOn;
    soundElement.addEventListener('click', gameRules.handleSoundClick);
  },

  handleSoundClick: function (event) {
    gameRules.isSoundsOn = event.currentTarget.checked;
    localStorage.setItem(gameRules.soundTargetId, gameRules.isSoundsOn);
    gameRules.setSwitchTarget(gameRules.soundTargetId, gameRules.isSoundsOn);
  },

  setSwitchTarget: function (targetElementId, isOn) {
    const updateElement = document.getElementById(targetElementId);
    updateElement.textContent = (isOn) ? 'Off' : 'On';
  },

  setupTestSwitch: function () {
    this.isTestOn = JSON.parse(localStorage.getItem(this.testTargetId));
    this.setSwitchTarget(this.testTargetId, this.isTestOn);
    const testElement = document.getElementById('test-picker-switch');
    testElement.checked = this.isTestOn;
    testElement.addEventListener('click', gameRules.handleTestClick);
  },

  handleTestClick: function (event) {
    gameRules.isTestOn = event.currentTarget.checked;
    localStorage.setItem(gameRules.testTargetId, gameRules.isTestOn);
    gameRules.setSwitchTarget(gameRules.testTargetId, gameRules.isTestOn);
  },

  setEventListenerOnInputElements: function (containerElement, clickHandler) {
    for (let childElement of containerElement.children) {
      // put the evvent listener on the <input> element
      if (childElement.children.length > 0 && childElement.children[0].tagName === 'INPUT') {
        childElement.addEventListener('click', clickHandler);
      }
    }
  },

  setupColorPicker: function (prefix) {
    gameRules.colorIndexHuman = JSON.parse(localStorage.getItem(prefix));
    if (gameRules.colorIndexHuman !== null) {
      gameViewer.setBackground(gameViewer.meeplePieces[gameRules.colorIndexHuman].background);
    }

    const containerElement = document.getElementById('color-picker');
    for (let [index, meeple] of gameViewer.meeplePieces.entries()) {
      const meepleId = `${prefix}-${index}`;
      containerElement.innerHTML +=
        `<label for="${meepleId}">
          <input type="radio" id="${meepleId}" name="colors" ${(index === gameRules.colorIndexHuman) ? 'checked' : ''}>
          <img src="${gameViewer.imagePath}${meeple.filenameHuman}" class="rules-meeple" alt="${meeple.name} meeple">
        </label>`;
    }
    gameRules.setEventListenerOnInputElements(containerElement, gameRules.handleColorClick);
  },

  handleColorClick: function (event) {
    gameRules.colorIndexHuman = parseInt(event.currentTarget.children[0].id.split('-')[1]);
    localStorage.setItem(gameRules.colorPrefix, gameRules.colorIndexHuman);
    gameViewer.setBackground(gameViewer.meeplePieces[gameRules.colorIndexHuman].background);
  },

  setupOpponentsPicker: function (prefix) {
    gameRules.numberOfOpponents = JSON.parse(localStorage.getItem(prefix));

    const containerElement = document.getElementById('opponents-picker');
    for (let opponent = 1; opponent < gameViewer.numberOfMeeples; opponent++) {
      const opponentId = `${prefix}-${opponent}`;
      containerElement.innerHTML +=
        `<label for="${opponentId}">
           <input type="checkbox" id="${opponentId}" name="${opponentId}" ${(opponent <= gameRules.numberOfOpponents) ? 'checked' : ''}>
           <img src="${gameViewer.imagePath}${gameViewer.meepleMachine4Count.filename}" class="rules-meeple" alt="${opponentId} meeple">
         </label>`;
    }
    gameRules.setEventListenerOnInputElements(containerElement, gameRules.handleOpponentClick);
  },

  handleOpponentClick: function (event) {
    // read how many laptops are selected
    gameRules.numberOfOpponents = document.querySelectorAll('#opponents-picker>label>input:checked').length;
    localStorage.setItem(gameRules.opponentsPrefix, gameRules.numberOfOpponents);
  },

  setupSunPositionsPicker: function (prefix) {
    const containerElement = document.getElementById('sunpos-picker');
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
      containerElement.appendChild(sunPieceElement);
    }
    gameRules.setElementsVisibility(prefix, gameRules.numberOfSunPositions, 1, gameViewer.maxSunPositions, 'rules-sun-positions');
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
        `<img src="${gameViewer.imagePath}${tilePiece.filename}" id="${prefix}-${position}" class="img-fluid" alt="tile-back counter">`;
      if (position >= gameViewer.minTilesPerType) { tilePieceElement.addEventListener('click', gameRules.handleTileClick); }
      containerElement.appendChild(tilePieceElement);
    }
    gameRules.setElementsVisibility(prefix, gameRules.numberOfTilesPerType, 1, gameViewer.maxTilesPerType, 'rules-tilespertype');
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