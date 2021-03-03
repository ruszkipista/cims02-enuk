// object GAMECONTROLLER
//======================
const gameController = {

  initialize: function (numberOfSunPositions, numberOfPlayers, numberOfMeeples, numberOfAnimalTiles, isSoundsOn, isTest) {
    this.PARAMETERS.numberOfSunPositions = numberOfSunPositions;
    this.PARAMETERS.numberOfPlayers = numberOfPlayers;
    this.PARAMETERS.numberOfMeeples = numberOfMeeples;
    this.PARAMETERS.numberOfAnimalTiles = numberOfAnimalTiles;
    this.PARAMETERS.isSoundsOn = isSoundsOn;
    this.PARAMETERS.isTest = isTest;
    this.play();
  },

  PARAMETERS: {
    numberOfSunPositions: null,
    numberOfPlayers: null,
    numberOfMeeples: null,
    numberOfAnimalTiles: null,
    isSoundsOn: null,
    isTest: null,
  },

  PHASES: {
    rules: 0,
    one: 1,
    two: 2,
    end: 3,
  },

  TILES: {
    reindeer: { name: 'reindeer', rank: 5, count: null },
    polarbear: { name: 'polarbear', rank: 4, count: null },
    seal: { name: 'seal', rank: 3, count: null },
    salmon: { name: 'salmon', rank: 2, count: null },
    herring: { name: 'herring', rank: 1, count: null },
    igloo: { name: 'igloo', rank: null, count: 1 },
  },
  // wherewer you see null, that is going to be updated during setup
  ICONS: {
    collectTiles: { name: 'collect-tiles', count: 1, request: null, isVisible: [false, true, false, false] },
    sunPositions: { name: 'sun-position', count: null, request: null, isVisible: [false, true, false, false] },
    sunPiece: { name: 'piece-sun', count: 1, request: null, isVisible: [false, true, false, false] },
    start: { name: 'game-start', count: 1, request: null, isVisible: [true, false, false, false] },
    restart: { name: 'game-restart', count: 1, request: null, isVisible: [false, false, false, true] },
    declareReindeer: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
    declarePolarbear: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
    declareSeal: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
    declaresSalmon: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
    declareHerring: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
    declareIgloo: { name: null, count: 1, request: null, isVisible: [false, false, true, false] },
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
    toStart: '4',
    toRestart: '5',
  },

  gameState: null,
  iconsOnTable: [],
  tilesOnTable: [],
  tilesOnIgloo: [],
  sunPosition: 0,
  round: 0,
  whosMove: null,
  human: null,
  players: null,
  isListenToClick: false,
  clickedTile: null,
  declaredTileName: null,
  toBeMovedToStack: null,
  toBeTurnedDown: null,
  toBeMovedToIgloo: null,
  isEndOfMove: false,
  isEndOfPhase1: false,
  isDeclarationCorrect: false,
  isEndOfPhase2: false,

  play: function (request, elementId) {
    if (typeof this.gameState === 'undefined' || this.gameState === null) {
      this.gameState = this.STATE.BeforePhase1;
    }

    infiniteLoop: while (true) {

      switch (this.gameState) {

        // BeforePhase1
        case this.STATE.BeforePhase1:
          this.setupGameBeforePhase1();
          // continue to state InPhase1-BeforeMove
          this.gameState = this.STATE.InPhase1BeforeMove;
          break;

        // InPhase1-BeforeMove
        case this.STATE.InPhase1BeforeMove:
          // instruct ActualPlayer to move (flip or collect)
          gameViewer.setBackground(this.players[this.whosMove].background);
          // next state will be InPhase1ProcessMove 
          this.gameState = this.STATE.InPhase1ProcessMove;
          // wait for request
          this.isListenToClick = true;
          break infiniteLoop;

        // InPhase1-ProcessMove
        case this.STATE.InPhase1ProcessMove:
          // stop listening to clicks (for a while)
          this.isListenToClick = false;
          this.clickedTile = null;
          // fall back state - if something unexpected
          this.gameState = this.STATE.InPhase1BeforeMove;
          if (this.whosMove !== this.human) {
            break;
          }
          let timeOutMultiplier = 1;
          if (request === this.REQUEST.toFlipLeft || request === this.REQUEST.toFlipRight) {
            this.clickedTile = this.findTileOnTable(elementId);
            if (!this.clickedTile || this.clickedTile.isFaceUp) {
              break;
            }
            // flip the tile face-up
            gameViewer.flipTileOnTable(this.clickedTile, request === this.REQUEST.toFlipLeft);
            // handle: reindeer -> advance sun
            if (this.clickedTile.name === this.TILES.reindeer.name
              && this.sunPosition < this.PARAMETERS.numberOfSunPositions - 1) {
              this.sunPosition++;
              gameViewer.setBoardPiecesPosition(this.sunPosition, this.PARAMETERS.numberOfPlayers);
            }
          } else if (request === this.REQUEST.toCollect) {
            gameViewer.playSound(gameViewer.sounds.click.filename);
            timeOutMultiplier = 1;
          } else {
            break;
          }
          // continue to next state
          this.gameState = this.STATE.InPhase1Evaluation;
          // back in the game after Timeout
          setTimeout(function () { gameController.play(request, elementId); }, gameViewer.tileBack.flipTimeMS * timeOutMultiplier);
          // wait outside the loop for Timeout to complete
          break infiniteLoop;

        // InPhase1-Evaluation
        case this.STATE.InPhase1Evaluation:
          this.isEndOfPhase2 = false;
          this.isEndOfPhase1 = false;
          this.isEndOfMove = false;
          let isAllTilesFaceUp = false;
          // check which tile to be turned down, moved to the igloo or to be collected to player's stack
          [this.toBeTurnedDown, this.toBeMovedToStack, this.toBeMovedToIgloo, isAllTilesFaceUp] = this.evaluateTilesOnTablePhase1(this.tilesOnTable);

          // Phase_2 ends if no animal fled AND all tiles are face-up
          if (isAllTilesFaceUp && this.toBeTurnedDown.size === 0) {
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
          // set next state
          this.gameState = this.STATE.InPhase1Execution;
          break;

        // InPhase1-Execution
        case this.STATE.InPhase1Execution:
          // handle End Of Move
          if (this.isEndOfMove) {
            for (let tileIndex of this.toBeTurnedDown) {
              gameViewer.playSound(this.tilesOnTable[tileIndex].sound);
              gameViewer.flipTileOnTable(this.tilesOnTable[tileIndex], null);
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
            this.gameState = this.STATE.EndOfGame;
          } else {
            // handle End Of Move
            if (this.isEndOfMove) {
              // set up next player
              this.passMoveToNextPlayer();
            }
            // handle End Of Phase 1
            if (this.isEndOfPhase1) {
              this.gameState = this.STATE.BeforePhase2;
              // back in the game after Timeout
              setTimeout(function () { gameController.play(request, elementId); }, gameViewer.tileBack.flipTimeMS * 2);
              // wait outside the loop for Timeout to complete
              break infiniteLoop;
            }
            else { this.gameState = this.STATE.InPhase1BeforeMove; }
          }
          break;

        // BeforePhase2
        case this.STATE.BeforePhase2:
          // re-set title's size and position
          gameViewer.setTitle(this.PHASES.two);
          // set visibility/invisibility of icons
          gameViewer.setVisibilityOfIcons(this.iconsOnTable, this.PHASES.two);
          // continue to state InPhase2-CollectOneIgloo
          this.gameState = this.STATE.InPhase2CollectOneIgloo;
          // back in the game after Timeout
          setTimeout(function () { gameController.play(); }, gameViewer.tileBack.flipTimeMS * 4);
          // wait outside the loop for Timeout to complete
          break infiniteLoop;


        // InPhase2-CollectOneIgloo
        case this.STATE.InPhase2CollectOneIgloo:
          // remove ActualPlayer’s one meeple from igloo
          const tileId = this.removeMeepleFromIglooToBoard(this.players[this.whosMove]);
          if (!tileId) {
            // If ActualPlayer hasn’t got meeple on any igloo -> continue to state InPhase2-Evaluation
            this.gameState = this.STATE.InPhase2Evaluation;
            break;
          }
          // remove tile from under the removed meeple and move it to the tile stack of the ActualPlayer
          this.removeTileFromIglooToStack(tileId);
          // continue to next state
          this.gameState = this.STATE.InPhase2BeforeDeclaration;
          break;

        // InPhase2-BeforeDeclaration
        case this.STATE.InPhase2BeforeDeclaration:
          this.clickedTile = null;
          this.declaredTileName = null;
          // initialize the radio buttons of tile deceleration icons
          gameViewer.initDeclareIcons(this.iconsOnTable);
          // instruct ActualPlayer to declare what its next flip going to be, 
          // ask to choose one of the following: (herring, salmon, seal, polarbear, reindeer, igloo)
          this.isListenToClick = true;
          // continue to next state
          this.gameState = this.STATE.InPhase2BeforeMove;
          // wait for request
          break infiniteLoop;

        // InPhase2-BeforeMove
        case this.STATE.InPhase2BeforeMove:
          // receive move from player: (Request, ClickedElement[Tile or Icon])
          if (request !== this.REQUEST.toDeclare) {
            // wait for request
            break infiniteLoop;
          }
          gameViewer.playSound(gameViewer.sounds.click.filename);
          // If Request is DeclareNextTileType AND ClickedElement is valid:
          //   -> set Declaration
          //   -> mark Declaration on board
          // instruct ActualPlayer to flip one tile
          // continue to next state
          this.gameState = this.STATE.InPhase2ProcessMove;
          break infiniteLoop;

        // InPhase2-ProcessMove
        case this.STATE.InPhase2ProcessMove:
          // check if there is one Declaration icon selected
          this.declaredTileName = gameViewer.getTileDeclarationFromIcons(this.iconsOnTable);
          if (!this.declaredTileName) {
            // wait for request
            break infiniteLoop;
          }
          // there is a declaration - now accept click on a face-down tile
          if (request !== this.REQUEST.toFlipLeft && request !== this.REQUEST.toFlipRight) {
            if (request === this.REQUEST.toDeclare) {
              gameViewer.playSound(gameViewer.sounds.click.filename);
            }
            // wait for request
            break infiniteLoop;
          }
          // got clicked on tile
          this.clickedTile = this.findTileOnTable(elementId);
          if (!this.clickedTile || this.clickedTile.isFaceUp) {
            // wait for request
            break infiniteLoop;
          }
          // mute further clicks
          this.isListenToClick = false;
          // If Declaration is set AND Request was to flip a face-down tile up
          //   -> flag RequestToFlip
          //   -> flip the clicked tile face-up
          //   -> continue to state InPhase2 - Evaluation
          gameViewer.flipTileOnTable(this.clickedTile, request === this.REQUEST.toFlipLeft);
          // continue to next state
          this.gameState = this.STATE.InPhase2Evaluation;
          // back in the game after Timeout
          setTimeout(function () { gameController.play(); }, gameViewer.tileBack.flipTimeMS * 2);
          // wait outside the loop for Timeout to complete 
          break infiniteLoop;

        // InPhase2-Evaluation
        case this.STATE.InPhase2Evaluation:
          // clear evaluation flags
          this.isEndOfMove = false;
          this.isDeclarationCorrect = false;
          // If NOT ClickedElement tile -> set flag EndOfMove
          if (!this.clickedTile) {
            this.isEndOfMove = true;
            // If ClickedElement tile is the same as Declaration -> set flag CorrectDeclaration
          } else if (this.clickedTile.name === this.declaredTileName) {
            this.isDeclarationCorrect = true;
          } else {
            this.isEndOfMove = true;
          }
          // If ClickedElement tile is the last reindeer
          if ((this.clickedTile && this.clickedTile.name === this.TILES.reindeer.name)
            //     OR there is no more meeple on the igloo
            || (!this.isDeclarationCorrect && this.evaluateMeeplesAtPlayers(this.players))
            //     OR all tiles on table are face-up
            || this.evaluateTilesOnTablePhase2(this.tilesOnTable)) {
            //   -> set flag EndOfPhase2
            this.isEndOfPhase2 = true;
            this.isEndOfMove = true;
          }
          // continue to next state
          this.gameState = this.STATE.InPhase2Execution;
          break;

        //  InPhase2-Execution
        case this.STATE.InPhase2Execution:
          // If flag CorrectDeclaration -> move tile ClickedElement to player’s stack
          if (this.isDeclarationCorrect) {
            this.removeTileFromTableToStack(this.clickedTile);
            // prevent repeated run of the previous tile removal and following wait
            this.isDeclarationCorrect = false;
            // back in the game after Timeout
            setTimeout(function () {
              gameViewer.playSound(gameViewer.sounds.click.filename);
              gameController.play();
            }, gameViewer.tileBack.flipTimeMS * 2);
            // wait outside the loop for Timeout to complete
            break infiniteLoop;
          }
          if (this.isEndOfPhase2) {
            // continue to next state
            this.gameState = this.STATE.EndOfGame;
          } else {
            if (this.isEndOfMove) {
              // set up next player
              this.passMoveToNextPlayer();
              // continue to state InPhase2-CollectOneIgloo
              this.gameState = this.STATE.InPhase2CollectOneIgloo;
            } else {
              // continue to state InPhase2-BeforeDeclaration
              this.gameState = this.STATE.InPhase2BeforeDeclaration;
            }
          }
          break;

        // EndOfGame
        case this.STATE.EndOfGame:
          // re-set title's size and position
          gameViewer.setTitle(this.PHASES.end);
          // set visibility/invisibility of icons
          gameViewer.setVisibilityOfIcons(this.iconsOnTable, this.PHASES.end);
          // Announce winner (most collected tiles)

          // Offer to restart the game

          // Allow free tile flipping on tiles remaining on the table
          this.isListenToClick = true;
          // continue to state EndOfGame-ProcessMove
          this.gameState = this.STATE.EndOfGameProcessMove;
          // wait for request
          break infiniteLoop;

        // EndOfGameProcessMove
        case this.STATE.EndOfGameProcessMove:
          // receive move from player: (ClickedElement, Request)
          // If Request is RequestToFlip -> flip ClickedElement          
          if (request === this.REQUEST.toFlipLeft || request === this.REQUEST.toFlipRight) {
            this.clickedTile = this.findTileOnTable(elementId);
            gameViewer.flipTileOnTable(this.clickedTile, request === this.REQUEST.toFlipLeft);
            // If Request is RequestToRestart -> continue to state BeforePhase1            
          } else if (request === this.REQUEST.toRestart) {
            gameViewer.playSound(gameViewer.sounds.click.filename);
            // continue to state BeforePhase1
            this.gameState = this.STATE.BeforePhase1;
            break;
          }
          break infiniteLoop;
      }

    };

  },

  // ================================================================================
  setupGameBeforePhase1: function () {
    this.sunPosition = 0;
    this.round = 0;
    this.setupPlayers(this.PARAMETERS.numberOfPlayers, this.PARAMETERS.isTest);
    this.iconsOnTable = this.setupIcons(this.ICONS, this.TILES, gameViewer.iconFaces);
    this.tilesOnTable = this.setupTiles(this.TILES, gameViewer.tileFaces,
      this.PARAMETERS.numberOfSunPositions,
      this.PARAMETERS.numberOfAnimalTiles);
    if (!this.PARAMETERS.isTest) { shuffleArrayInplace(this.tilesOnTable); }
    // fill webpage with elements
    gameViewer.generateGameBoard(this.iconsOnTable, this.tilesOnTable, this.players, this.PARAMETERS.isTest);
    // set moving parts' position relative to their containing element
    gameViewer.setBoardPiecesPosition();
    // set visibility/invisibility of icons
    gameViewer.setVisibilityOfIcons(this.iconsOnTable, this.PHASES.one);
    // determine whos move first?
    this.passMoveToNextPlayer();
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
      const meeple = gameViewer.meeplePieces[i];
      this.players[i] = {
        name: meeple.name,
        meeples: [],
        // generate ID for each Tile Stack (score) - one stack per player
        tileStackID: `tiles-stack-player${i}`,
        tilesInStack: [],
      };
      this.players[i].background = meeple.background;
      // generate meeples
      for (let j = 0; j < this.PARAMETERS.numberOfMeeples; j++) {
        let meepleId = `player${i}-meeple${j}`;
        this.players[i].meeples[j] = {
          id: meepleId,
          name: `meeple-${this.players[i].name}`,
          filename: (i === this.human) ? meeple.filenameHuman : meeple.filenameMachine,
          isOnBoard: true,
          idOnBoard: meepleId + '-onboard',
          idOnIgloo: null,
          tileIdonIgloo: null,
        }
      }
    }
  },

  setupIcons: function (iconCounts, tileCounts, iconFaces) {
    iconCounts.sunPositions.count = this.PARAMETERS.numberOfSunPositions;
    iconCounts.collectTiles.request = this.REQUEST.toCollect;
    iconCounts.declareReindeer.name = tileCounts.reindeer.name;
    iconCounts.declareReindeer.request = this.REQUEST.toDeclare;
    iconCounts.declarePolarbear.name = tileCounts.polarbear.name;
    iconCounts.declarePolarbear.request = this.REQUEST.toDeclare;
    iconCounts.declareSeal.name = tileCounts.seal.name;
    iconCounts.declareSeal.request = this.REQUEST.toDeclare;
    iconCounts.declaresSalmon.name = tileCounts.salmon.name;
    iconCounts.declaresSalmon.request = this.REQUEST.toDeclare;
    iconCounts.declareHerring.name = tileCounts.herring.name;
    iconCounts.declareHerring.request = this.REQUEST.toDeclare;
    iconCounts.declareIgloo.name = tileCounts.igloo.name;
    iconCounts.declareIgloo.request = this.REQUEST.toDeclare;
    iconCounts.start.request = this.REQUEST.toStart;
    iconCounts.restart.request = this.REQUEST.toRestart;

    let iconsOnTable = [];
    for (const [key, iconCount] of Object.entries(iconCounts)) {
      for (let iconFace of iconFaces) {
        if (iconFace.name !== iconCount.name) { continue; }
        for (let i = 0; i < iconCount.count; i++) {
          const iconId = `icon-${iconCount.name}${(iconCount.count === 1) ? '' : i}`;
          iconsOnTable.push({
            id: iconId,
            name: iconCount.name,
            parentId: iconFace.parentId,
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

  setupTiles: function (tileCounts, tileFaces, numberOfSunPositions, numberOfAnimalTiles) {
    tileCounts.reindeer.count = numberOfSunPositions;
    tileCounts.polarbear.count = numberOfAnimalTiles;
    tileCounts.seal.count = numberOfAnimalTiles;
    tileCounts.salmon.count = numberOfAnimalTiles;
    tileCounts.herring.count = numberOfAnimalTiles;
    let tilesOnTable = [];
    let counter = 0;
    for (const [key, tileCount] of Object.entries(tileCounts)) {
      for (let tileFace of tileFaces) {
        if (tileFace.name !== tileCount.name) { continue; }
        for (let i = 0; i < tileCount.count; i++) {
          // generate ID for each Tile
          let tileId = `tile-${counter}`;
          let isIgloo = tileCount.name === tileCounts.igloo.name;
          let tile = {
            id: tileId,
            name: tileCount.name,
            filename: tileFace.filename,
            rank: tileCount.rank,
            idOnTable: `${tileId}-ontable`,
            idOnIgloo: (isIgloo) ? `${tileId}-onigloo` : '',
            idMeepleOnIgloo: (isIgloo) ? `meeple-on-${tileId}` : '',
            isFaceUp: null,
            sound: tileFace.sound,
          };
          tilesOnTable.push(tile);
          counter++;
        }
      }
    }
    return tilesOnTable;
  },

  passMoveToNextPlayer: function () {
    this.whosMove = (this.PARAMETERS.isTest) ? this.human : (++this.whosMove % this.PARAMETERS.numberOfPlayers);
    if (this.whosMove === 0) { ++this.round; }
  },

  findTileOnTable: function (idOnTable) {
    // learnt "find" from https://usefulangle.com/post/3/javascript-search-array-of-objects
    const tile = this.tilesOnTable.find(function (element, index) {
      if (element.idOnTable === idOnTable) {
        return true;
      }
    });
    return tile;
  },

  findTileIndexOnIgloo: function (tileId) {
    const tileIndex = this.tilesOnIgloo.findIndex(function (element, index) {
      if (element.id === tileId) {
        return true;
      }
    });
    return tileIndex;
  },

  removeTileFromTable: function (tile) {
    let tileIndex = this.tilesOnTable.findIndex(function (element, index) {
      if (element.idOnTable === tile.idOnTable)
        return true;
    });
    this.tilesOnTable[tileIndex].isFaceUp = null;
    return tile;
  },

  removeTileFromIgloo: function (tileId) {
    const tileIndex = this.findTileIndexOnIgloo(tileId);
    if (tileIndex >= 0) {
      return tile = this.tilesOnIgloo.splice(tileIndex, 1)[0];
    }
  },

  // Tile: Table -> Stack
  removeTileFromTableToStack(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
      this.players[this.whosMove].tilesInStack.push(tile);
      gameViewer.playSound(gameViewer.sounds.stack.filename);
      gameViewer.addOneTileEdgeToStack(this.players[this.whosMove]);
    }
  },

  // Tile: Table -> Igloo
  removeTileFromTableToIgloo(tile) {
    if (tile.isFaceUp) {
      this.removeTileFromTable(tile);
      this.tilesOnIgloo.push(tile);
      gameViewer.setVisibilityOfElement(tile.idOnTable, false);
      gameViewer.setVisibilityOfElement(tile.idOnIgloo, true);
      gameViewer.playSound(tile.sound);
    }
  },

  // Tile: Igloo -> Stack
  removeTileFromIglooToStack(tileId) {
    const tile = this.removeTileFromIgloo(tileId);
    gameViewer.setVisibilityOfElement(tile.idOnIgloo, false);
    this.players[this.whosMove].tilesInStack.push(tile);
    gameViewer.playSound(gameViewer.sounds.stack.filename);
    gameViewer.addOneTileEdgeToStack(this.players[this.whosMove]);
  },

  // Meeple: Board -> Igloo
  removeMeepleFromBoardToIgloo(tile) {
    for (let i = this.players[this.whosMove].meeples.length - 1; i >= 0; i--) {
      let meeple = this.players[this.whosMove].meeples[i];
      if (meeple.isOnBoard) {
        meeple.tileIdonIgloo = tile.id;
        meeple.isOnBoard = false;
        meeple.idOnIgloo = tile.idMeepleOnIgloo;
        const meepleOnIglooElement = document.getElementById(tile.idMeepleOnIgloo);
        meepleOnIglooElement.setAttribute('src', gameViewer.imagePath + meeple.filename);
        gameViewer.setVisibilityOfElement(meeple.idOnBoard, false);
        gameViewer.setVisibilityOfElement(meeple.idOnIgloo, true);
        break;
      }
    }
  },

  // Meeple: Igloo -> Board
  removeMeepleFromIglooToBoard(player) {
    for (let i = 0; i < player.meeples.length; i++) {
      let meeple = player.meeples[i];
      if (!meeple.isOnBoard) {
        meeple.isOnBoard = true;
        const meepleOnIglooElement = document.getElementById(meeple.idOnIgloo);
        meepleOnIglooElement.setAttribute('src', '');
        gameViewer.setVisibilityOfElement(meeple.idOnBoard, true);
        gameViewer.setVisibilityOfElement(meeple.idOnIgloo, false);
        meeple.idOnIgloo = null;
        const tileIdOnIgloo = meeple.tileIdonIgloo;
        meeple.tileIdonIgloo = null;
        return tileIdOnIgloo;
      }
    }
    return null;
  },

  // Evaluate Tiles on Table - Phase 1
  evaluateTilesOnTablePhase1: function (tiles) {
    let toBeTurnedDown = new Set();
    let toBeMovedToStack = new Set();
    let toBeMovedToIgloo = [];
    let isAllTilesFaceUp = true;

    for (let i = 0; i < tiles.length; i++) {
      // isFaceUp can be ( true, false, null )
      if (!tiles[i].isFaceUp) {
        if (tiles[i].isFaceUp === false) { isAllTilesFaceUp = false; }
        continue;
      }
      if (!tiles[i].rank) {
        if (tiles[i].name === this.TILES.igloo.name) {
          toBeMovedToIgloo.push(i);
        }
      } else {
        // assume, that the current tile can be removed from the table
        // that means, there is not one tile to hide from
        toBeMovedToStack.add(i);
        for (let j = i + 1; j < tiles.length; j++) {
          if (!tiles[j].isFaceUp || tiles[j].rank === null) { continue; }
          if (tiles[i].rank === tiles[j].rank + 1) {
            // j hides from i
            toBeTurnedDown.add(j);
          } else if (tiles[i].rank + 1 === tiles[j].rank) {
            // i hides from j
            toBeTurnedDown.add(i);
          }
        }
      }
    }
    // remove those tiles which to be turned down, they can not be collected
    for (let k of toBeTurnedDown) { toBeMovedToStack.delete(k); }

    return [toBeTurnedDown, toBeMovedToStack, toBeMovedToIgloo, isAllTilesFaceUp];
  },

  // Evaluate Tiles on Table - Phase 2
  evaluateTilesOnTablePhase2: function (tiles) {
    let isAllTilesFaceUp = true;
    for (let tile of tiles) {
      // isFaceUp can be ( true, false, null )
      if (tile.isFaceUp === false) {
        isAllTilesFaceUp = false;
        break;
      }
    }
    return isAllTilesFaceUp;
  },

  // Evaluate Meeples on Board - Phase 2
  evaluateMeeplesAtPlayers: function (players) {
    let isMeeplesAtPlayers = true;
    for (let player of players) {
      for (let meeple of player.meeples) {
        if (!meeple.isOnBoard) {
          isMeeplesAtPlayers = false;
          break;
        }
      }
    }
    return isMeeplesAtPlayers;
  },

};
