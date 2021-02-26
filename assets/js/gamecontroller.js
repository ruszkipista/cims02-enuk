// object GAMECONTROLLER
//======================
const gameController = {

  PARAMETERS: {
    numberOfSunPositions: 9,
    numberOfPlayers: 4,
    isTest: true,
  },

  TILES: {
    reindeer: { name: 'reindeer', rank: 5, count: 9 },
    polarbear: { name: 'polarbear', rank: 4, count: 14 },
    seal: { name: 'seal', rank: 3, count: 14 },
    salmon: { name: 'salmon', rank: 2, count: 14 },
    herring: { name: 'herring', rank: 1, count: 14 },
    igloo: { name: 'igloo', rank: null, count: 1 },
  },

  // game states
  STATE: {
    BeforePhase1: 'A',
    InPhase1BeforeMove: 'B',
    InPhase1ProcessMove: 'C',
    InPhase1Evaluation: 'D',
    InPhase1Execution: 'E',
    BeforePhase2: 'F',
    InPhase2CollectOneIgloo: 'G',
    InPhase2BeforeDeclaration: 'H',
    InPhase2BeforeMove: 'I',
    InPhase2ProcessMove: 'J',
    InPhase2Evaluation: 'K',
    InPhase2Execution: 'L',
    EndOfGame: 'M',
    EndOfGameProcessMove: 'N',
  },
  REQUEST: {
    toFlipLeft: '0',
    toFlipRight: '1',
    toCollect: '2',
    toDeclare: '3',
  },

  gameState: null,
  tilesOnTable: [],
  tilesOnIgloo: [],
  sunPosition: null,
  round: null,
  whosMove: null,
  human: null,
  players: null,
  isListenToClick: false,
  clickedTile: null,
  toBeMovedToStack: null,
  toBeTurnedDown: null,
  toBeMovedToIgloo: null,
  isAllFaceUp: false,
  isEndOfMove: false,
  isEndOfPhase1: false,
  isEndOfPhase2: false,

  play: function (request, elementId) {
    if (typeof this.gameState === 'undefined' || this.gameState === null) {
      this.gameState = this.STATE.BeforePhase1;
    }

    infiniteLoop: while (true) {

      switch (this.gameState) {

        case this.STATE.BeforePhase1:
          this.sunPosition = 0;
          this.round = 0;
          this.setupPlayers(this.PARAMETERS.numberOfPlayers, this.PARAMETERS.isTest);
          this.tilesOnIgloo = [];
          this.TILES.reindeer.count = this.PARAMETERS.numberOfSunPositions;
          this.tilesOnTable = this.setupTiles(this.TILES, gameViewer.tileFaces);
          if (!this.PARAMETERS.isTest) { shuffleArrayInplace(this.tilesOnTable); }
          // fill webpage with elements
          gameViewer.generateGameBoard(this.tilesOnTable, this.players, this.PARAMETERS.isTest);
          // set moving parts' position relative to their containing element
          gameViewer.setBoardPiecesPosition(this.sunPosition, this.PARAMETERS.numberOfPlayers);
          // whos move first?
          this.passMoveToNextPlayer();
          // continue to state InPhase1-BeforeMove
          this.gameState = this.STATE.InPhase1BeforeMove;
          break;

        case this.STATE.InPhase1BeforeMove:
          // instruct ActualPlayer to move (flip or collect)
          gameViewer.setBackground(this.players[this.whosMove].background);
          this.isListenToClick = true;
          this.request = null;
          this.clicked = null;
          // next state will be InPhase1ProcessMove 
          this.gameState = this.STATE.InPhase1ProcessMove;
          // wait for request
          break infiniteLoop;

        case this.STATE.InPhase1ProcessMove:
          this.clickedTile = null;
          //  If Request is RequestToFlip to flip a face-down tile up, then
          //    -> set flag RequestToFlip
          //    -> flip the tile face-up
          //    If ClickedTile is reindeer 
          //        -> move the sun piece to the next position. 
          //           if there is no next position (already on the final), then do not move sun
          // If Request is CollectTiles to collect face-up tiles from table -> set flag RequestToCollect
          // If Request is something else -> continue to state InPhase1-BeforeMove
          // continue to state InPhase1-Evaluation
          if (this.whosMove !== this.human) {
            return;

          } else if (request === this.REQUEST.toFlipLeft || request === this.REQUEST.toFlipRight) {
            this.clickedTile = gameController.findTileOnTable(elementId);
            if (!this.clickedTile || this.clickedTile.isFaceUp) {
              return;
            }
            // flip the tile face-up
            this.clickedTile.flipOnTable(request === this.REQUEST.toFlipLeft);
            // handle: reindeer -> sun advances
            if (this.clickedTile.name === this.TILES.reindeer.name
              && this.sunPosition < this.PARAMETERS.numberOfSunPositions - 1) {
              this.sunPosition++;
              gameViewer.setBoardPiecesPosition(this.sunPosition, this.PARAMETERS.numberOfPlayers);
            }
          } else if (request !== this.REQUEST.toCollect) {
            return;
          }
          this.gameState = this.STATE.InPhase1Evaluation;
          break;

        case this.STATE.InPhase1Evaluation:
          this.isEndOfPhase2 = false;
          this.isEndOfPhase1 = false;
          this.isEndOfMove = false;
          // check which tile to be turned down, moved to the igloo or to be collected to player's stack
          [this.toBeTurnedDown, this.toBeMovedToStack, this.toBeMovedToIgloo, this.isAllFaceUp] = this.evaluateTilesOnTablePhase1();

          // Phase_2 ends if no animal fled AND all tiles are face-up
          if (this.isAllFaceUp && this.toBeTurnedDown.length === 0) {
            this.isEndOfPhase1 = true;
            this.isEndOfPhase2 = true;
            // Phase_1 ends if clicked tile is a reindeer AND the sun is in the last position
          } else if (this.clickedTile
            && this.clickedTile.name === this.TILES.reindeer.name
            && this.sunPosition === this.PARAMETERS.numberOfSunPositions - 1) {
            this.isEndOfPhase1 = true;
          }
          // move ends if
          // - player decided to collect the turned up tiles, or
          // - last tile is an igloo, or
          // - at least one animal hid (tile to be turned down)
          if (this.isEndOfPhase1
            || request === this.REQUEST.toCollect
            || (this.clickedTile && this.clickedTile.name === this.TILES.igloo.name)
            || this.toBeTurnedDown.size > 0) {
            this.isEndOfMove = true;
          }
          if (this.isEndOfMove) {
            // play dead
            gameController.isListenToClick = false;
            setTimeout(function () {
              // back in the game
              gameController.isListenToClick = true;
              gameController.gameState = gameController.STATE.InPhase1Execution;
              gameController.play();
            }, gameViewer.tileBack.flipTimeMS * 2);
            // wait for Timeout
            break infiniteLoop;
          } else {
            // continue to execution
            this.gameState = gameController.STATE.InPhase1Execution;
            break;
          }

        case this.STATE.InPhase1Execution:
          if (this.isEndOfMove) {
            for (let tileIndex of this.toBeMovedToStack) {
              this.removeTileFromTableToStack(this.tilesOnTable[tileIndex]);
            }
            for (let tileIndex of this.toBeTurnedDown) {
              this.tilesOnTable[tileIndex].flipOnTable();
            }
            for (let tileIndex of this.toBeMovedToIgloo) {
              this.removeTileFromTableToIgloo(this.tilesOnTable[tileIndex]);
              this.removeMeepleFromBoardToIgloo(this.tilesOnTable[tileIndex]);
            }
          }
          if (this.isEndOfPhase2) {
            this.gameState = gameController.STATE.EndOfGame;
          } else {
            if (this.isEndOfMove) {
              // set up next player
              this.passMoveToNextPlayer();
            }
            if (this.isEndOfPhase1) { this.gameState = gameController.STATE.BeforePhase2; }
            else { this.gameState = gameController.STATE.InPhase1BeforeMove; }
          }
          break;

        case this.STATE.BeforePhase2:
          break;

        case this.STATE.InPhase2CollectOneIgloo:
          break;

        case this.STATE.InPhase2BeforeDeclaration:
          break;

        case this.STATE.InPhase2BeforeMove:
          break;

        case this.STATE.InPhase2ProcessMove:
          break;

        case this.STATE.InPhase2Evaluation:
          break;

        case this.STATE.InPhase2Execution:
          break;

        case this.STATE.EndOfGame:
          break;

        case this.STATE.EndOfGameProcessMove:
          break;
      }

    };

  },

  setupPlayers: function (numberOfPlayers, isTest) {
    if (isTest) {
      this.human = 0;
    } else {
      shuffleArrayInplace(gameViewer.meeplePieces);
      this.human = getRandomInt(numberOfPlayers);
    }
    this.players = [];
    for (let i = 0; i < numberOfPlayers; i++) {
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

  setupTiles: function (tileCounts, tileFaces) {
    let tilesOnTable = [];
    let counter = 0;
    for (const [key, tileCount] of Object.entries(tileCounts)) {
      for (let tileFace of tileFaces) {
        if (tileFace.name !== tileCount.name) { continue; }
        for (let i = 0; i < tileCount.count; i++) {
          // generate ID for each Tile
          let tileId = `tile-${counter}`;
          let isIgloo = tileCount.name === tileCounts.igloo.name;
          let tile = new Tile(tileId,
            tileCount.name,
            tileFace.filename,
            tileCount.rank,
            `${tileId}-ontable`,
            (isIgloo) ? `${tileId}-onigloo` : '',
            (isIgloo) ? `meeple-on-${tileId}` : '')
          tilesOnTable.push(tile);
          counter++;
        }
      }
    }
    return tilesOnTable;
  },

  passMoveToNextPlayer: function () {
    this.whosMove = (this.PARAMETERS.isTest) ? this.human : (++this.whosMove % this.PARAMETERS.numberOfPlayers);
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

  evaluateTilesOnTablePhase1: function () {
    let toBeTurnedDown = new Set();
    let toBeMovedToStack = new Set();
    let toBeMovedToIgloo = [];
    let isAllFaceUp = true;

    for (let i = 0; i < this.tilesOnTable.length; i++) {
      // isFaceUp can be ( true, false, null )
      if (!this.tilesOnTable[i].isFaceUp) {
        if (this.tilesOnTable[i].isFaceUp === false) { isAllFaceUp = false; }
        continue;
      }
      if (!this.tilesOnTable[i].rank) {
        if (this.tilesOnTable[i].name === this.TILES.igloo.name) {
          toBeMovedToIgloo.push(i);
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
    // remove those tiles which to be turned down, they can not be collected
    for (let k of toBeTurnedDown) { toBeMovedToStack.delete(k); }

    return [toBeTurnedDown, toBeMovedToStack, toBeMovedToIgloo, isAllFaceUp];
  },

};
