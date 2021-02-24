// object GAMECONTROLLER
//======================
const gameController = {
  // statuses
  statusBeforePhase1: 'A',
  statusInPhase1BeforeMove: 'B',
  statusInPhase1ProcessMove: 'C',
  statusInPhase1Evaluation: 'D',
  statusInPhase1Execution: 'E',
  statusBeforePhase2: 'F',
  statusInPhase2CollectOneIgloo: 'G',
  statusInPhase2BeforeDeclaration: 'H',
  statusInPhase2BeforeMove: 'I',
  statusInPhase2ProcessMove: 'J',
  statusInPhase2Evaluation: 'K',
  statusInPhase2Execution: 'L',
  statusEndOfGame: 'M',
  statusEndOfGameProcessMove: 'N',

  isTest: null,
  status: null,
  tilesOnTable: null,
  tilesOnIgloo: null,
  sunPosition: null,
  round: null,
  whosMove: null,
  human: null,
  players: null,
  numberOfPlayers: null,

  listenToClick: false,

  play: function (event) {
    if (typeof this.status === 'undefined' || this.status === null) { this.status = this.statusBeforePhase1; }
    if (event) { }

    infiniteLoop: while (true) {

      switch (this.status) {
        case this.statusBeforePhase1:
          this.isTest = true;
          this.numberOfPlayers = 4;
          this.sunPosition = 0;
          this.round = 0;
          this.setupPlayers();
          this.setupTiles();
          gameViewer.generateGameBoard(this.tiles, this.tilesOnTable, this.players, this.isTest);
          gameViewer.setBoardPiecesPosition(this.sunPosition, this.numberOfPlayers);
          // set ActualPlayer to the first player
          this.whosMove = (this.isTest) ? this.human : 0;
          // continue to status InPhase1-BeforeMove
          this.status = this.statusInPhase1BeforeMove;
          this.listenToClick = true;
          break;

        case this.statusInPhase1BeforeMove:
          // instruct ActualPlayer to move (flip or collect)
          gameViewer.setBackground(this.players[this.whosMove].background);
          this.listenToClick = true;
          // wait for request
          break infiniteLoop;

        case this.statusInPhase1ProcessMove:
          //  If Request is RequestToFlip to flip a face-down tile up, then
          //    -> set flag RequestToFlip
          //    -> flip the tile face-up
          //    If ClickedTile is reindeer 
          //        -> move the sun piece to the next position. 
          //           if there is no next position (already on the final), then do not move sun
          // If Request is CollectTiles to collect face-up tiles from table -> set flag RequestToCollect
          // If Request is something else -> continue to status InPhase1-BeforeMove
          // continue to status InPhase1-Evaluation
          if (gameController.whosMove !== gameController.human || !gameController.listenToClick) {
            return;
          }
          const isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
          const tile = gameController.findTileOnTable(event.currentTarget.id);
          if (tile.isFaceUp === false) {
            tile.flipOnTable(isClickedOnLeft);
            let evaluationResult = gameController.evaluateTilesOnTablePhase1(tile, false);
            if (evaluationResult.isEndOfMove) {
              gameController.listenToClick = false;
              setTimeout(function () {
                gameController.listenToClick = true;
                gameController.actOnEvaluation(evaluationResult);
              }, gameViewer.tileBack.flipTimeMS * 2);
            } else {
              gameController.actOnEvaluation(evaluationResult);
            }
          }
          this.status = this.statusInPhase1Evaluation;
          break;

        case this.statusInPhase1Evaluation:
          break;

        case this.statusInPhase1Execution:
          break;

        case this.statusBeforePhase2:
          break;

        case this.statusInPhase2CollectOneIgloo:
          break;

        case this.statusInPhase2BeforeDeclaration:
          break;

        case this.statusInPhase2BeforeMove:
          break;

        case this.statusInPhase2ProcessMove:
          break;

        case this.statusInPhase2Evaluation:
          break;

        case this.statusInPhase2Execution:
          break;

        case this.statusEndOfGame:
          break;

        case this.statusEndOfGameProcessMove:
          break;
      }

    };

  },

  setupPlayers: function () {
    this.human = getRandomInt(this.numberOfPlayers);
    this.players = [];
    shuffleArrayInplace(gameViewer.meeplePieces);
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.players[i] = {
        name: gameViewer.meeplePieces[i].name,
        meeples: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
      };
      this.players[i].background = gameViewer.meeplePieces[i].background;
      // generate Meeples
      for (let j = 0; j < gameViewer.meeplePieces[i].count; j++) {
        this.players[i].meeples[j] = new Meeple(`player${i}-meeple${j}`,
          `meeple-${this.players[i].name}`,
          (i === this.human) ? gameViewer.meeplePieces[i].filenameHuman : gameViewer.meeplePieces[i].filenameMachine);
      }
    }
  },

  setupTiles: function () {
    this.tilesOnIgloo = [];
    this.tilesOnTable = [];
    this.tiles = [];
    let counter = 0;
    for (let tileFace of gameViewer.tileFaces) {
      for (let i = 0; i < tileFace.count; i++) {
        // generate ID for each Tile
        this.tiles.push(new Tile(`tile-${counter}`, tileFace.name, tileFace.filename));
        counter++;
      }
    }
    if (!this.isTest) { shuffleArrayInplace(this.tiles); }
  },

  findTileOnTable: function (idOnTable) {
    // learnt "find" from https://usefulangle.com/post/3/javascript-search-array-of-objects
    let tile = this.tilesOnTable.find(function (element, index) {
      if (element.idOnTable === idOnTable)
        return true;
    });
    return tile;
  },

  removeTileFromTable: function (tile) {
    let tileIndex = this.tilesOnTable.findIndex(function (element, index) {
      if (element.idOnTable === tile.idOnTable)
        return true;
    });
    this.tilesOnTable[tileIndex].isFaceUp = null;
    return tile;
  },

  removeTileFromTableToStack(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.players[this.whosMove].tilesInStack.push(tile);
      tile.addToStack(this.players[this.whosMove]);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
    }
  },

  removeTileFromTableToIgloo(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.tilesOnIgloo.push(tile);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
      gameViewer.setVisibilityOfElement(tile.idOnIgloo, true);
    }
  },

  removeMeepleFromBoardToIgloo(tile) {
    for (let i = this.players[this.whosMove].meeples.length - 1; i >= 0; i--) {
      let meeple = this.players[this.whosMove].meeples[i];
      if (meeple.isOnBoard) {
        meeple.removeFromBoardToIgloo(tile.idMeepleOnIgloo);
        gameViewer.setVisibilityOfElement(meeple.idOnBoard, false);
        gameViewer.setVisibilityOfElement(meeple.idOnIgloo, true);
        break;
      }
    }
  },

  handleTileClick: function (event) {
    if (gameController.whosMove !== gameController.human || !gameController.listenToClick) {
      return;
    }
    const isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
    const tile = gameController.findTileOnTable(event.currentTarget.id);
    if (tile.isFaceUp === false) {
      tile.flipOnTable(isClickedOnLeft);
      let evaluationResult = gameController.evaluateTilesOnTablePhase1(tile, false);
      if (evaluationResult.isEndOfMove) {
        gameController.listenToClick = false;
        setTimeout(function () {
          gameController.listenToClick = true;
          gameController.actOnEvaluation(evaluationResult);
        }, gameViewer.tileBack.flipTimeMS * 2);
      } else {
        gameController.actOnEvaluation(evaluationResult);
      }
    }
  },

  handleIconClick: function (event) {
    if (gameController.whosMove !== gameController.human) {
      return;
    }
    // if clicked on the CollecTiles icon
    if (event.currentTarget.id === gameViewer.icons[0].id + '0'
      // and it is the Human player's move
      && gameController.whosMove === gameController.human) {
      let evaluationResult = gameController.evaluateTilesOnTablePhase1(null, true);
      gameController.actOnEvaluation(evaluationResult);
    }
  },

  evaluateTilesOnTablePhase1: function (clickedTile, isPlayerWantToCollect) {
    let evaluation = new Evaluation();
    let toBeMovedToStack = new Set();
    let toBeTurnedDown = new Set();

    if (clickedTile !== null && clickedTile.name === Tile.NAME_REINDEER()) {
      evaluation.isSunToBeMoved = true;
    }

    for (let i = 0; i < this.tilesOnTable.length; i++) {
      if (this.tilesOnTable[i].isFaceUp) {
        if (this.tilesOnTable[i].rank < 0) {
          if (this.tilesOnTable[i].name === Tile.NAME_IGLOO()) {
            evaluation.toBeMovedToIgloo.push(i);
          }
        } else {
          // assume, that the current tile can be removed from the table
          // that means, there is not one tile to hide from
          toBeMovedToStack.add(i);
          for (let j = i + 1; j < this.tilesOnTable.length; j++) {
            if (this.tilesOnTable[j].isFaceUp && this.tilesOnTable[j].rank >= 0) {
              if (this.tilesOnTable[i].rank === this.tilesOnTable[j].rank + 1) {
                // j hides from i
                toBeTurnedDown.add(j);
              } else if (this.tilesOnTable[i].rank + 1 === this.tilesOnTable[j].rank) {
                // i hides from j
                toBeTurnedDown.add(i);
              }
            }
          }
        }
      }
    }
    // remove those tiles which to be turned down, they can not be collected
    for (let k of toBeTurnedDown) {
      toBeMovedToStack.delete(k);
    }
    // convert the 2 Sets into Arrays
    evaluation.toBeMovedToStack = Array.from(toBeMovedToStack);
    evaluation.toBeTurnedDown = Array.from(toBeTurnedDown);

    // Phase_1 ends if
    // last tile is a reindeer AND the sun reached the last place
    if (evaluation.isSunToBeMoved && this.sunPosition === gameViewer.numberOfSunPositions - 2) {
      evaluation.isEndOfPhase1 = true;
    }
    // move ends if
    // - player decided to collect the turned up tiles, or
    // - last tile is an igloo, or
    // - at least one animal hid (tile to be turned down)
    if (evaluation.isEndOfPhase1
      || isPlayerWantToCollect
      || (clickedTile && clickedTile.name === Tile.NAME_IGLOO())
      || evaluation.toBeTurnedDown.length > 0) {
      evaluation.isEndOfMove = true;
    }

    return evaluation;
  },

  actOnEvaluation: function (evaluation) {
    if (evaluation.isSunToBeMoved
      && this.sunPosition < gameViewer.numberOfSunPositions - 1) {
      this.sunPosition++;
      gameViewer.setBoardPiecesPosition(this.sunPosition, this.numberOfPlayers);
    }

    if (evaluation.isEndOfMove) {
      for (let tileIndex of evaluation.toBeMovedToStack) {
        this.removeTileFromTableToStack(this.tilesOnTable[tileIndex]);
      }
      for (let tileIndex of evaluation.toBeTurnedDown) {
        this.tilesOnTable[tileIndex].flipOnTable();
      }
      for (let tileIndex of evaluation.toBeMovedToIgloo) {
        this.removeTileFromTableToIgloo(this.tilesOnTable[tileIndex]);
        this.removeMeepleFromBoardToIgloo(this.tilesOnTable[tileIndex]);
      }
    }
  },
};
