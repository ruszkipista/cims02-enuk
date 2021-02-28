// object GAMEVIEWER
//===================
const gameViewer = {
  imagePath: './assets/img/',
  audioPath: './assets/audio/',
  tileBack: { filename: 'tileback-ice.jpg', flipTimeMS: 800 },
  tileEdges: [{ filename: 'tileedge-mid.png' }, { filename: 'tileedge-top.png' }],

  tileFaces: [
    { name: gameController.TILES.reindeer.name, filename: 'tileface-reindeer.jpg' },
    { name: gameController.TILES.polarbear.name, filename: 'tileface-polarbear.jpg', sound: 'polarbear-roar.mp3' },
    { name: gameController.TILES.seal.name, filename: 'tileface-seal.jpg', sound: 'seal-pips.mp3' },
    { name: gameController.TILES.salmon.name, filename: 'tileface-salmon.jpg', sound: 'salmon-pips.mp3' },
    { name: gameController.TILES.herring.name, filename: 'tileface-herring.jpg', sound: 'herring-fart.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo00.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo01.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo02.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo10.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo11.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo12.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo20.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo21.jpg', sound: 'ice-crack.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo22.jpg', sound: 'ice-crack.mp3' }
  ],

  iconFaces: [
    { name: gameController.ICONS.collectTiles.name, filename: 'icon-collect-tiles.png', parentId: 'title', height: 0.08, leftTopCorner: [0.885, 0] },
    { name: gameController.ICONS.sunPositions.name, filename: 'icon-sun-position.png', parentId: 'title', height: 0.05, leftTopCorner: null },
    { name: gameController.ICONS.sunPiece.name, filename: 'piece-sun.png', parentId: 'title', height: 0.05, leftTopCorner: null },
    { name: gameController.TILES.reindeer.name, filename: 'icon-reindeer.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.2, 0.015] },
    { name: gameController.TILES.polarbear.name, filename: 'icon-polarbear.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.3, 0.015] },
    { name: gameController.TILES.seal.name, filename: 'icon-seal.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.4, 0.015] },
    { name: gameController.TILES.salmon.name, filename: 'icon-salmon.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.5, 0.015] },
    { name: gameController.TILES.herring.name, filename: 'icon-herring.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.6, 0.015] },
    { name: gameController.TILES.igloo.name, filename: 'icon-igloo.jpg', parentId: 'title', height: 0.08, leftTopCorner: [0.7, 0.015] },
  ],

  sounds: {
    flip: { filename: 'tile-flip.mp3' },
    stack: { filename: 'tile-stack.mp3' },
    click: { filename: 'button-click.mp3' },
  },

  boardPiece: {
    id: 'piece-board',
    name: 'enuk-board-front.jpg',
    iglooLength: 0.1355,
    igloo3x3TopLeftCorner: [0.232, 0.297],
    meepleOnBoardWidth: 0.025,
    meeplesOnBoardFromTop: 0.65,
    meeplesOnBoardFromLeft: [0.02, 0.16, 0.73, 0.86],
  },

  meeplePieces: [
    { name: 'blue', filenameHuman: 'piece-meeple-blue.png', filenameMachine: 'piece-laptop-blue.png', background: 'enuk-background-blue.jpg', count: 4 },
    { name: 'green', filenameHuman: 'piece-meeple-green.png', filenameMachine: 'piece-laptop-green.png', background: 'enuk-background-green.jpg', count: 4 },
    { name: 'orange', filenameHuman: 'piece-meeple-orange.png', filenameMachine: 'piece-laptop-orange.png', background: 'enuk-background-orange.jpg', count: 4 },
    { name: 'purple', filenameHuman: 'piece-meeple-purple.png', filenameMachine: 'piece-laptop-purple.png', background: 'enuk-background-purple.jpg', count: 4 },
    { name: 'red', filenameHuman: 'piece-meeple-red.png', filenameMachine: 'piece-laptop-red.png', background: 'enuk-background-red.jpg', count: 4 },
  ],

  setBackground: function (backgroundFile) {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.style.backgroundImage = `url("${this.imagePath}${backgroundFile}")`;
  },

  calculateSunPositions: function (rectWidth, rectHeight, iconSideLength, numberOfPositions) {
    sunPositions = [];
    const halfIconSideLength = iconSideLength / 2;

    // calculate r radius
    // learnt about Math.pow() here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
    const r = Math.pow(rectWidth - iconSideLength, 2) / 8 / (rectHeight - iconSideLength) + (rectHeight - iconSideLength) / 2;
    // calculate angle between 2 adjacent positions
    // learnt about Math.asin() here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin
    const opposite = (rectWidth - iconSideLength) / 2;
    const hypotenuse = r;
    const angleStartToFinish = 2 * Math.asin(opposite / hypotenuse);
    const angleOnePos = angleStartToFinish / (numberOfPositions - 1);

    // learnt about rotation here: https://math.stackexchange.com/questions/270194/how-to-find-the-vertices-angle-after-rotation
    // rotate point (x,y) into (x′,y′) about point (p,q) counterclockwise by angle θ
    // x′ = (x−p)cos(θ) − (y−q)sin(θ) + p
    // y′ = (x−p)sin(θ) + (y−q)cos(θ) + q
    // calculate rotation center (p,q)
    p = rectWidth / 2;
    q = iconSideLength / 2 + r;
    // set up first position (left hand side)
    let x0 = iconSideLength / 2;
    let y0 = rectHeight - iconSideLength / 2;
    // store the icon's top-left corner as (distance from Left side, distance from Top)
    sunPositions.push([(x0 - halfIconSideLength) / rectWidth, (y0 - halfIconSideLength) / rectWidth]);
    // calculate rest of the positions relative to the first positon by increasing the angle
    let angle = 0;
    for (let i = 1; i < numberOfPositions; i++) {
      angle += angleOnePos;
      x = (x0 - p) * Math.cos(angle) - (y0 - q) * Math.sin(angle) + p;
      y = (x0 - p) * Math.sin(angle) + (y0 - q) * Math.cos(angle) + q;
      sunPositions.push([(x - halfIconSideLength) / rectWidth, (y - halfIconSideLength) / rectWidth]);
    }
    return sunPositions;
  },

  createBodyHTML: function () {
    return `<header id="header">
               <div id="title"></div>
             </header>
             <main>
               <div id="tiles"></div>
               <div id="board"></div>
             </main>`
  },

  createIgloo3x3HTML: function (tiles) {
    let imgHTML = `<div id="tiles-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === gameController.TILES.igloo.name) {
        imgHTML += `<img id="${tile.idOnIgloo}" class="tile-onigloo" 
                         src="${this.imagePath}${tile.filename}"
                         style="visibility: hidden;"
                         alt="game tile ${tile.name}">`;
      }
    }
    return imgHTML + '</div>';
  },

  createMeeple3x3HTML: function (tiles) {
    let imgHTML = `<div id="meeples-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === gameController.TILES.igloo.name) {
        imgHTML += `<div class="tile-onigloo"><img 
                       id="${tile.idMeepleOnIgloo}"
                       class="meeple-onigloo"
                       style="visibility: hidden;" src="" 
                       alt="game meeple"></div>`;
      }
    }
    return imgHTML + '</div>';
  },

  createMeepleOnBoard: function (meeple) {
    return `<img id="${meeple.idOnBoard}" class="meeple-on-board" 
                 src="${this.imagePath}${meeple.filename}"
                 alt="game meeple ${meeple.name}">`;
  },

  createTileStacksHTML: function (players) {
    let stacksHTML = '';
    for (let i = 0; i < players.length; i++) {
      stacksHTML += `<div id="${players[i].tileStackID}" class="tiles-stack tiles-stack-player${i}"></div>`;
      stacksHTML += `<div id="meeples-player${i}" 
                               class="meeples-group tiles-stack-player${i}" 
                               style="border-top-color:${players[i].name}">`;
      for (let meeple of players[i].meeples) {
        stacksHTML += this.createMeepleOnBoard(meeple);
      }
      stacksHTML += `</div>`;
    }
    return stacksHTML;
  },

  createTileOnTable: function (tile, isTest) {
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.setAttribute('id', tile.idOnTable);
    tileElement.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <img src="${this.imagePath}${this.tileBack.filename}" alt="game tile back">
          </div>
          <div class="tile-front">${(isTest) ? tile.name : ""}</div>
          <div class="tile-back">
            <img src="${this.imagePath}${tile.filename}" alt="game tile ${tile.name}">
          </div>
        </div>
        `;
    tileElement.addEventListener('click', this.handleTileClick);
    return tileElement;
  },

  flipTileOnTable: function (tile, isClickedOnLeft) {
    tile.isFaceUp = !tile.isFaceUp;
    this.playSound(this.sounds.flip.filename);
    let tileInnerElement = document.getElementById(tile.idOnTable).children[0];
    if (tile.isFaceUp) {
      if (isClickedOnLeft) { tileInnerElement.classList.add('tile-flip-left'); }
      else { tileInnerElement.classList.add('tile-flip-right'); }

    } else {
      tileInnerElement.classList.remove('tile-flip-left', 'tile-flip-right');
    }

  },

  addTileToStack: function (player) {
    let stackElement = document.getElementById(player.tileStackID);
    if (player.tilesInStack.length > 0) {
      stackElement.innerHTML =
        `<img class="tile-edge" 
              src="${this.imagePath}${this.tileEdges[(player.tilesInStack.length === 1) ? 1 : 0].filename}"
              style="margin-left: ${getRandomInt(5) - 2}px"
              alt="tile edge for score keeping">`
        + stackElement.innerHTML;
    }
  },

  createIcons: function (icons) {
    for (let icon of icons) {
      // grab parent
      const parentElement = document.getElementById(icon.parentId);
      let iconElement = null;
      if (icon.request === gameController.REQUEST.toDeclare) {
        iconElement = document.createElement('div');
        iconElement.innerHTML = `<input type="radio" id="${icon.id}-input" name="${icon.request}" />
                                 <label for="${icon.id}-input">
                                   <img src="${this.imagePath}${icon.filename}" alt="${icon.name} button">
                                 </label>
                                `;
      } else {
        iconElement = document.createElement('img');
        iconElement.setAttribute('src', this.imagePath + icon.filename);
        iconElement.setAttribute('alt', icon.name + (icon.request) ? ' button' : ' icon');
      }
      if (icon.request) {
        iconElement.addEventListener('click', gameViewer.handleIconClick);
      }
      iconElement.setAttribute('id', icon.id);
      iconElement.classList.add('icon-position');
      if (icon.name === gameController.ICONS.sunPositions.name) {
        iconElement.style.opacity = '50%';
      }

      // append icon to parent
      parentElement.appendChild(iconElement);
    }
  },

  generateGameBoard: function (iconsOnTable, tilesOnTable, players, isTest) {
    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.innerHTML = this.createBodyHTML();
    // put game board in place
    let boardPiecesHTML = '';
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += this.createIgloo3x3HTML(tilesOnTable);

    // add hidden MEEPLES on top of igloo tiles - without src
    boardPiecesHTML += this.createMeeple3x3HTML(tilesOnTable);

    // add TILE STACKS and MEEPLES for all players on the board
    boardPiecesHTML += this.createTileStacksHTML(players);

    document.getElementById('board').innerHTML = boardPiecesHTML;

    // add icons to the top area
    this.createIcons(iconsOnTable);

    // assemble tiles
    const tilesElement = document.getElementById('tiles');
    for (let tile of tilesOnTable) {
      tile.isFaceUp = false;
      let tileElement = this.createTileOnTable(tile, isTest);
      tilesElement.appendChild(tileElement);
    }
  },

  setVisibilityOfElement: function (elementID, isVisible) {
    const element = document.getElementById(elementID);
    if (isVisible) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  },

  setVisibilityOfIcons: function (icons, phase) {
    for (let icon of icons) {
      this.setVisibilityOfElement(icon.id, icon.isVisible[phase]);
    }
  },

  setBoardPiecesPosition: function () {
    // learnt about getBoundingClientRect() here: https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
    let parentRect = document.getElementById(this.boardPiece.id).getBoundingClientRect();

    // flip transition time
    document.documentElement.style.setProperty('--flip-transition-time', `${gameViewer.tileBack.flipTimeMS}ms`);

    // igloo3x3 on board position
    const iglooLength = parentRect.width * this.boardPiece.iglooLength;
    document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromtop', `${parentRect.width * this.boardPiece.igloo3x3TopLeftCorner[0]}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromleft', `${parentRect.left + parentRect.width * this.boardPiece.igloo3x3TopLeftCorner[1]}px`);

    // meeple pieces position
    const meepleWidth = parentRect.width * this.boardPiece.meepleOnBoardWidth;
    document.documentElement.style.setProperty('--meeple-onboard-width', `${meepleWidth}px`);
    document.documentElement.style.setProperty('--meeple-onigloo-width', `${meepleWidth * 2}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${meepleWidth * this.meeplePieces[0].count}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${parentRect.width * this.boardPiece.meeplesOnBoardFromTop}px`);
    for (let i = 0; i < gameController.PARAMETERS.numberOfPlayers; i++) {
      document.documentElement.style.setProperty('--board-meeples-fromtop', `${parentRect.width * this.boardPiece.meeplesOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`, `${parentRect.left + parentRect.width * this.boardPiece.meeplesOnBoardFromLeft[i]}px`);
    }

    // set sun positions
    let icon = this.iconFaces.find(function (element, index) {
      if (element.name === gameController.ICONS.sunPositions.name)
        return true;
    });
    parentRect = document.getElementById(icon.parentId).getBoundingClientRect();
    let sunLeftTopCorners = this.calculateSunPositions(parentRect.width, parentRect.height, parentRect.width * icon.height, gameController.PARAMETERS.numberOfSunPositions);
    let sunCounter = 0;
    for (let icon of gameController.iconsOnTable) {
      if (icon.name === gameController.ICONS.sunPositions.name) {
        icon.leftTopCorner = sunLeftTopCorners[sunCounter];
        sunCounter++;
      } else if (icon.name === gameController.ICONS.sunPiece.name) {
        icon.leftTopCorner = sunLeftTopCorners[gameController.sunPosition];
      }
    }

    // set how many degrees the sun needs to turn in current position relative to the first position
    document.documentElement.style.setProperty('--piece-sun-rotate', `${gameController.sunPosition * 130}deg`);

    // icon positions
    let element = null;
    for (let icon of gameController.iconsOnTable) {
      parentRect = document.getElementById(icon.parentId).getBoundingClientRect();
      element = document.getElementById(icon.id);
      element.style.width = `${parentRect.width * icon.height}px`;
      element.style.height = `${parentRect.width * icon.height}px`;
      element.style.left = `${parentRect.width * icon.leftTopCorner[0]}px`;
      element.style.top = `${parentRect.width * icon.leftTopCorner[1]}px`;
    }
  },

  handleTileClick: function (event) {
    if (!gameController.isListenToClick) { return; }
    const isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
    const request = isClickedOnLeft ? gameController.REQUEST.toFlipLeft : gameController.REQUEST.toFlipRight;
    const clickedElement = event.currentTarget.id
    gameController.play(request, clickedElement);
  },

  handleIconClick: function (event) {
    if (!gameController.isListenToClick) { return; }
    // clicked on the CollecTiles icon
    for (let icon of gameController.iconsOnTable) {
      if (event.currentTarget.id !== icon.id) { continue; }
      gameController.play(icon.request, event.currentTarget.id);
    }
  },

  playSound: function (filename) {
    if (gameController.PARAMETERS.isSoundsOn) {
      // learnt about handling audio here: https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
      const audio = document.createElement("audio");
      audio.src = `${gameViewer.audioPath}${filename}`;
      audio.play();
    }
  },

};
