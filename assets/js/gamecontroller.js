// object GAMECONTROLLER
//======================
const gameController = {

  PARAMETERS: {
    numberOfSunPositions: 9,
    numberOfPlayers: 4,
    isTest: true,
  },

  TILES: {
    reindeer: { name: 'reindeer', rank: 5, userInput: true, visible: true, count: 9 },
    polarbear: { name: 'polarbear', rank: 4, userInput: true, visible: true, count: 14 },
    seal: { name: 'seal', rank: 3, userInput: true, visible: true, count: 14 },
    salmon: { name: 'salmon', rank: 2, userInput: true, visible: true, count: 14 },
    herring: { name: 'herring', rank: 1, userInput: true, visible: true, count: 14 },
    igloo: { name: 'igloo', rank: null, userInput: true, visible: true, count: 1 },
  },

  ICONS: {
    collectTiles: { name: 'collect-tiles', count: 1, request: null, visible: true },
    sunPositions: { name: 'sun-position', count: 9, request: null, visible: true },
    sunPiece: { name: 'piece-sun', count: 1, request: null, visible: true },    
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
  iconsOnTable: [],
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

        // BeforePhase1
        case this.STATE.BeforePhase1:
          this.TILES.reindeer.count = this.PARAMETERS.numberOfSunPositions;
          this.ICONS.sunPositions.count = this.PARAMETERS.numberOfSunPositions;
          this.sunPosition = 0;
          this.round = 0;
          this.tilesOnIgloo = [];
          this.setupPlayers(this.PARAMETERS.numberOfPlayers, this.PARAMETERS.isTest);
          this.ICONS.collectTiles.request = gameController.REQUEST.toCollect;
          this.iconsOnTable = this.setupIcons(this.ICONS, this.TILES, gameViewer.iconFaces);
          this.tilesOnTable = this.setupTiles(this.TILES, gameViewer.tileFaces);
          if (!this.PARAMETERS.isTest) { shuffleArrayInplace(this.tilesOnTable); }
          // fill webpage with elements
          gameViewer.generateGameBoard(this.iconsOnTable, this.tilesOnTable, this.players, this.PARAMETERS.isTest);
          // set moving parts' position relative to their containing element
          gameViewer.setBoardPiecesPosition(this.sunPosition, this.PARAMETERS.numberOfPlayers);
          // whos move first?
          this.passMoveToNextPlayer();
          // continue to state InPhase1-BeforeMove
          this.gameState = this.STATE.InPhase1BeforeMove;
          break;

        // InPhase1-BeforeMove
        case this.STATE.InPhase1BeforeMove:
          // instruct ActualPlayer to move (flip or collect)
          gameViewer.setBackground(this.players[this.whosMove].background);
          this.request = null;
          this.clicked = null;
          // next state will be InPhase1ProcessMove 
          this.gameState = this.STATE.InPhase1ProcessMove;
          // wait for request
          this.isListenToClick = true;
          break infiniteLoop;

        // InPhase1-ProcessMove
        case this.STATE.InPhase1ProcessMove:
          // stop listening to clicks (for a while)
          this.clickedTile = null;
          if (this.whosMove !== this.human) {
            break infiniteLoop;
          }
          if (request === this.REQUEST.toFlipLeft || request === this.REQUEST.toFlipRight) {
            this.clickedTile = gameController.findTileOnTable(elementId);
            if (!this.clickedTile || this.clickedTile.isFaceUp) {
              break infiniteLoop;
            }
            // flip the tile face-up
            this.clickedTile.flipOnTable(request === this.REQUEST.toFlipLeft);
            // handle: reindeer -> advance sun
            if (this.clickedTile.name === this.TILES.reindeer.name
              && this.sunPosition < this.PARAMETERS.numberOfSunPositions - 1) {
              this.sunPosition++;
              gameViewer.setBoardPiecesPosition(this.sunPosition, this.PARAMETERS.numberOfPlayers);
            }
          } else if (request !== this.REQUEST.toCollect) {
            break infiniteLoop;
          }
          this.gameState = this.STATE.InPhase1Evaluation;
          break;

        // InPhase1-Evaluation
        case this.STATE.InPhase1Evaluation:
          gameController.isListenToClick = false;
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
          if (this.isEndOfPhase1
            // player decided to collect the turned up tiles, or
            || request === this.REQUEST.toCollect
            // latest clicked tile is an igloo, or
            || (this.clickedTile && this.clickedTile.name === this.TILES.igloo.name)
            // at least one animal hid (there is a tile to be turned down)
            || this.toBeTurnedDown.size > 0) {
            this.isEndOfMove = true;
          }
          if (this.isEndOfMove) {
            setTimeout(function () {
              // back in the game after Timeout
              gameController.isListenToClick = true;
              gameController.gameState = gameController.STATE.InPhase1Execution;
              gameController.play();
            }, gameViewer.tileBack.flipTimeMS * 2);
            // wait for Timeout to complete
            break infiniteLoop;
          } else {
            // continue to execution
            this.gameState = gameController.STATE.InPhase1Execution;
            break;
          }

        // InPhase1-Execution
        case this.STATE.InPhase1Execution:
          // handle End Of Move
          if (this.isEndOfMove) {
            for (let tileIndex of this.toBeTurnedDown) {
              this.tilesOnTable[tileIndex].flipOnTable();
            }
            for (let tileIndex of this.toBeMovedToStack) {
              this.removeTileFromTableToStack(this.tilesOnTable[tileIndex]);
            }
            for (let tileIndex of this.toBeMovedToIgloo) {
              this.removeTileFromTableToIgloo(this.tilesOnTable[tileIndex]);
              this.removeMeepleFromBoardToIgloo(this.tilesOnTable[tileIndex]);
            }
          }
          // handle End of Phase 2
          if (this.isEndOfPhase2) {
            this.gameState = gameController.STATE.EndOfGame;
          } else {
            // handle End Of Move
            if (this.isEndOfMove) {
              // set up next player
              this.passMoveToNextPlayer();
            }
            // handle End Of Phase 1
            if (this.isEndOfPhase1) { this.gameState = gameController.STATE.BeforePhase2; }
            else { this.gameState = gameController.STATE.InPhase1BeforeMove; }
          }
          break;

        // BeforePhase2
        case this.STATE.BeforePhase2:
          // set invisible the CollectTiles icon on board
          // set visible the icons for each tile type on the board for getting tile type declaration from players:
          //     (herring, salmon, seal, polarbear, reindeer, igloo)
          // continue to state InPhase2-CollectOneIgloo
          break;

        // InPhase2-CollectOneIgloo
        case this.STATE.InPhase2CollectOneIgloo:
          // If ActualPlayer hasn’t got meeple on igloo -> continue to state InPhase2-Evaluation
          // remove ActualPlayer’s one meeple from igloo
          // remove tile underneath the removed meeple and move it to the tile stack of the ActualPlayer
          // continue to state InPhase2-BeforeDeclaration
          break;

        // InPhase2-BeforeDeclaration
        case this.STATE.InPhase2BeforeDeclaration:
          // instruct ActualPlayer to declare its next flip, choose one of the following:
          //         (herring, salmon, seal, polarbear, reindeer, igloo)
          // wait for request
          break;

        // InPhase2-ProcessMove
        case this.STATE.InPhase2BeforeMove:
          // instruct ActualPlayer to flip one tile
          // wait for request
          break;

        // InPhase2-ProcessMove
        case this.STATE.InPhase2ProcessMove:
          // receive move from player: (ClickedElement(Tile or Icon), Request)
          // If Request is DeclareNextTileType AND ClickedElement is valid:
          //   -> set Declaration
          //   -> mark Declaration on board
          //   -> continue to state InPhase2 - BeforeMove
          // If Request is to flip a face - down tile up AND Declaration is set
          //   -> flag RequestToFlip
          //   -> flip the clicked tile face - up
          //   -> continue to state InPhase2 - Evaluation
          // If Declaration is set -> continue to state InPhase2 - BeforeMove
          // Else -> continue to state InPhase2 - BeforeDeclaration
          break;

        // InPhase2-Evaluation
        case this.STATE.InPhase2Evaluation:
          // clear evaluation flags
          // If all tiles on table are face-up 
          //     OR ClickedElement tile is the last reindeer
          //     OR there is no more meeple on the igloo
          //     -> set flag EndOfPhase2
          // If NOT ClickedElement tile -> set flag EndOfMove
          // Else If ClickedElement tile is the same as Declaration -> set flag CorrectDeclaration
          // Else -> set flag EndOfMove
          // continue to state InPhase2-Execution          
          break;

        //  InPhase2-Execution
        case this.STATE.InPhase2Execution:
          // If ClickedElement tile -> wait some time that each player can memorize the last tile flip
          // If flag CorrectDeclaration -> move tile ClickedElement to player’s stack
          // wait some time that each player can memorize the actions (if there was)
          // If flag EndOfPhase2 -> continue to state EndOfGame
          // Else If flag EndOfMove -> set ActualPlayer to the next player
          // continue to state InPhase2-CollectOneIgloo          
          break;

        // EndOfGame
        case this.STATE.EndOfGame:
          // Announce winner (most collected tiles)
          // Allow free tile flipping on tiles remaining on the table
          // Offer to restart the game
          // wait for request
          break;

        // EndOfGameProcessMove
        case this.STATE.EndOfGameProcessMove:
          // receive move from player: (ClickedElement, Request)
          // If Request is RequestToRestart -> continue to state BeforePhase1
          // If Request is RequestToFlip -> flip ClickedElement          
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

  setupIcons: function (iconCounts, tileCounts, iconFaces) {
    let iconsOnTable = [];
    for (const [key, iconCount] of Object.entries(iconCounts)) {
      for (let iconFace of iconFaces) {
        if (iconFace.name !== iconCount.name) { continue; }
        for (let i = 0; i < iconCount.count; i++) {
          iconsOnTable.push({
            id: `icon-${iconCount.name}${(iconCount.count===1)?'':i}`,
            name: iconCount.name,
            parentId: 'title',
            filename: iconFace.filename,
            request: iconCount.request, 
            isVisible: iconCount.isVisible,
            height: iconFace.height, 
            leftTopCorner: iconFace.leftTopCorner,
          });                    
        }
      }
    }
    return iconsOnTable;
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
