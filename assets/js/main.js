// initialize game space
window.addEventListener('load', function () {
  gameController.play();
});
// reposition the sun piece after window resize or change between landscape and portrait
window.addEventListener('resize', function () {
  gameViewer.setBoardPiecesPosition(gameController.sunPosition, gameController.PARAMETERS.numberOfPlayers);
});

// class TILE
//============
class Tile {

  constructor(id, name, filename, rank, idOnTable, idOnIgloo, idMeepleOnIgloo) {
    this.id = id;
    this.isFaceUp = null;
    this.idOnTable = idOnTable;
    this.idOnIgloo = idOnIgloo;
    this.name = name;
    this.filename = filename;
    this.rank = rank;
    this.idMeepleOnIgloo = idMeepleOnIgloo;
  }

  flipOnTable(isClickedOnLeft) {
    this.isFaceUp = !this.isFaceUp;
    let tileInnerElement = document.getElementById(this.idOnTable).children[0];
    if (this.isFaceUp) {
      if (isClickedOnLeft) { tileInnerElement.classList.add('tile-flip-left'); }
      else { tileInnerElement.classList.add('tile-flip-right'); }

    } else {
      tileInnerElement.classList.remove('tile-flip-up', 'tile-flip-down', 'tile-flip-left', 'tile-flip-right');
    }
  }

  addToStack(player) {
    let stackElement = document.getElementById(player.tileStackID);
    if (player.tilesInStack.length > 0) {
      stackElement.innerHTML =
        `<img class="tile-edge" 
              src="${gameViewer.imagePath}${gameViewer.tileEdges[(player.tilesInStack.length === 1) ? 1 : 0].filename}"
              style="margin-left: ${getRandomInt(5) - 2}px"
              alt="tile edge for score keeping">`
        + stackElement.innerHTML;
    }
  }
}

// class MEEPLE
//============
class Meeple {

  constructor(id, name, filename) {
    this.id = id;
    this.isOnBoard = true;
    this.idOnBoard = id + '-onboard';
    this.idOnIgloo = null;
    this.name = name;
    this.filename = filename;
  }

  removeFromBoardToIgloo(idOnIgloo) {
    if (this.isOnBoard) {
      this.isOnBoard = false;
      this.idOnIgloo = idOnIgloo;
      const meepleOnIglooElement = document.getElementById(idOnIgloo);
      meepleOnIglooElement.setAttribute('src', gameViewer.imagePath + this.filename);
    }
  }

  removeFromIglooToBoard() {
    if (!this.isOnBoard) {
      this.isOnBoard = true;
      const meepleOnIglooElement = document.getElementById(this.idOnIgloo);
      meepleOnIglooElement.setAttribute('src', "");
      this.idOnIgloo = null;
      gameViewer.setVisibilityOfElement(this.idOnIgloo, false);
      gameViewer.setVisibilityOfElement(this.idOnBoard, true);
    }
  }
}
