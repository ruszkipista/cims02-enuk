// initialize game space
window.addEventListener('load', function () {
  gameController.initialize(3, 1, 4, 4, true, true);
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () {
  gameViewer.setBoardPiecesPosition();
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
