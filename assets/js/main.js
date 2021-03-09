// initialize Rules page after Load
window.addEventListener('DOMContentLoaded', function(){
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

  init: function () {

    const colorFieldsetElement = document.getElementById('color-picker');
    for (let meeple of gameViewer.meeplePieces) {
      meepleId = `color-${meeple.name}`;
      colorFieldsetElement.innerHTML +=
       `<label for="${meepleId}">
          <input type="radio" id="${meepleId}" name="colors">
          <img src="${gameViewer.imagePath}${meeple.filenameHuman}" class="rules-meeple" alt="${meeple.name} meeple">
        </label>`;
    }

    const opponentsFieldsetElement = document.getElementById('opponents-picker');
    for (let opponent = 0; opponent < gameViewer.numberOfMeeples - 1; opponent++) {
      opponentId = `opponent-${opponent}`;
      opponentsFieldsetElement.innerHTML += 
        `<label for="${opponentId}">
           <input type="checkbox" id="${opponentId}" name="${opponentId}">
           <img src="${gameViewer.imagePath}${gameViewer.meepleMachine4Count.filename}" class="rules-meeple" alt="${opponentId} meeple">
         </label>`;
    }

    gameController.initialize(3, 2, gameViewer.numberOfMeeples, 3, true, true);
  },
}

