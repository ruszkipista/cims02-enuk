// object GAMEVIEWER
//===================
const gameViewer = {
  numberOfMeeples: 4,
  minSunPositions: 3,
  maxSunPositions: 9,
  minTilesPerType: 2,
  maxTilesPerType: 14,

  imagePath: './assets/img/',
  audioPath: './assets/audio/',
  title: { filename: 'enuk-title.png' },
  tileBack: { filename: 'tileback-ice.jpg', flipTimeMS: 800 },
  tileEdges: [{ filename: 'tileedge-mid.png' }, { filename: 'tileedge-top.png' }],

  tileFaces: [
    { name: gameController.TILES.reindeer.name, filename: 'tileface-reindeer.jpg' },
    { name: gameController.TILES.polarbear.name, filename: 'tileface-polarbear.jpg', sound: 'polarbear-roar.mp3' },
    { name: gameController.TILES.seal.name, filename: 'tileface-seal.jpg', sound: 'seal-pips.mp3' },
    { name: gameController.TILES.salmon.name, filename: 'tileface-salmon.jpg', sound: 'salmon-pips.mp3' },
    { name: gameController.TILES.herring.name, filename: 'tileface-herring.jpg', sound: 'herring-fart.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo00.jpg', sound: 'ice-cube1.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo01.jpg', sound: 'ice-cube2.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo02.jpg', sound: 'ice-cube3.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo10.jpg', sound: 'ice-cube4.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo11.jpg', sound: 'ice-cube5.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo12.jpg', sound: 'ice-cube6.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo20.jpg', sound: 'ice-cube7.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo21.jpg', sound: 'ice-cube8.mp3' },
    { name: gameController.TILES.igloo.name, filename: 'tileface-igloo22.jpg', sound: 'ice-cube9.mp3' }
  ],

  iconFaces: [
    { name: gameController.ICONS.collectTiles.name, filename: 'icon-collect-tiles.png', parentId: 'title', height: 0.7, leftTopCorner: [0.04, 0.0085] },
    // re-engineered image from here: https://icon-library.net/icon/rules-icon-22.html
    { name: gameController.ICONS.rules.name, filename: 'icon-rules.png', parentId: 'title', height: 0.5, leftTopCorner: [0.9, 0.08] },
    // re-engineered image from here: https://www.iconfinder.com/icons/1628513/game_movie_play_run_start_icon
    { name: gameController.ICONS.start.name, filename: 'icon-start.png', parentId: 'title', height: 0.5, leftTopCorner: [0.885, 0.3] },
    // re-engineered image from here: https://www.iconfinder.com/icons/1547535/arrow_recycle_refresh_reload_reset_restart_icon
    { name: gameController.ICONS.restart.name, filename: 'icon-restart.png', parentId: 'title', height: 0.5, leftTopCorner: [0.82, 0.08] },
    { name: gameController.ICONS.sunPositions.name, filename: 'icon-sun-position.png', parentId: 'title', height: 0.6, leftTopCorner: null },
    { name: gameController.ICONS.sunPiece.name, filename: 'piece-sun.png', parentId: 'title', height: 0.6, leftTopCorner: null },
    { name: gameController.TILES.reindeer.name, filename: 'icon-reindeer.jpg', parentId: 'title', height: 0.8 },
    { name: gameController.TILES.polarbear.name, filename: 'icon-polarbear.jpg', parentId: 'title', height: 0.8 },
    { name: gameController.TILES.seal.name, filename: 'icon-seal.jpg', parentId: 'title', height: 0.8 },
    { name: gameController.TILES.salmon.name, filename: 'icon-salmon.jpg', parentId: 'title', height: 0.8 },
    { name: gameController.TILES.herring.name, filename: 'icon-herring.jpg', parentId: 'title', height: 0.8 },
    { name: gameController.TILES.igloo.name, filename: 'icon-igloo.jpg', parentId: 'title', height: 0.8 },
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
    igloo3x3LeftTopCorner: [0.3, 0.232],
    meepleOnBoardWidth: 0.025,
    meeplesOnBoardFromTop: 0.65,
    meeplesOnBoardFromLeft: [0.02, 0.16, 0.73, 0.86],
  },

  meeplePieces: [
    // the laptop icon image was reengineered from here: https://www.pngkey.com/maxpic/u2e6w7r5a9u2y3w7/
    { name: 'blue', filenameHuman: 'piece-meeple-blue.png', filenameMachine: 'piece-laptop-blue.png', background: 'enuk-background-blue.jpg' },
    { name: 'green', filenameHuman: 'piece-meeple-green.png', filenameMachine: 'piece-laptop-green.png', background: 'enuk-background-green.jpg' },
    { name: 'orange', filenameHuman: 'piece-meeple-orange.png', filenameMachine: 'piece-laptop-orange.png', background: 'enuk-background-orange.jpg' },
    { name: 'purple', filenameHuman: 'piece-meeple-purple.png', filenameMachine: 'piece-laptop-purple.png', background: 'enuk-background-purple.jpg' },
    { name: 'red', filenameHuman: 'piece-meeple-red.png', filenameMachine: 'piece-laptop-red.png', background: 'enuk-background-red.jpg' },
  ],

  meepleMachine4Count: {
    filename: 'piece-laptop-black.png',
  },

  generateGameBoard: function (icons, tilesOnTable, tilesOnIgloo, players, isTest) {
    // reposition the sun piece after window resize or change between landscape and portrait
    window.addEventListener('resize', function () {
      gameViewer.setBoardPiecesPosition();
    });

    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.classList.remove('container');
    bodyElement.innerHTML = this.createBodyHTML();

    // put game board in place
    let boardPiecesHTML = '';
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += this.createIgloo3x3HTML(tilesOnIgloo);

    // add hidden MEEPLES on top of igloo tiles - without src
    boardPiecesHTML += this.createMeeple3x3HTML(tilesOnIgloo);

    // add TILE STACKS and MEEPLES for all players on the board
    boardPiecesHTML += this.createTileStacksHTML(players);

    document.getElementById('board').innerHTML = boardPiecesHTML;

    // add icons to the top area
    this.createDeclareFieldset(icons);
    icons.forEach(icon => this.createIcon(icon));

    // assemble tiles
    const tilesElement = document.getElementById('tiles');
    for (let tile of tilesOnTable) {
      tile.isFaceUp = false;
      let tileElement = this.createTileOnTable(tile, isTest);
      tilesElement.appendChild(tileElement);
    }
  },

  setBackground: function (backgroundFile) {
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.style.backgroundImage = `url("${this.imagePath}${backgroundFile}")`;
  },

  calculateSunPositions: function (rectWidth, rectHeight, iconSideLength, numberOfPositions) {
    const sunPositions = [];
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
    const p = rectWidth / 2;
    const q = iconSideLength / 2 + r;
    // set up first position (left hand side)
    let x0 = iconSideLength / 2;
    let y0 = rectHeight - iconSideLength / 2;
    // store the icon's top-left corner as (distance from Left side, distance from Top)
    sunPositions.push([(x0 - halfIconSideLength) / rectWidth, (y0 - halfIconSideLength) / rectHeight]);
    // calculate rest of the positions relative to the first positon by increasing the angle
    let angle = 0;
    for (let i = 1; i < numberOfPositions; i++) {
      angle += angleOnePos;
      const x = (x0 - p) * Math.cos(angle) - (y0 - q) * Math.sin(angle) + p;
      const y = (x0 - p) * Math.sin(angle) + (y0 - q) * Math.cos(angle) + q;
      sunPositions.push([(x - halfIconSideLength) / rectWidth, (y - halfIconSideLength) / rectHeight]);
    }
    return sunPositions;
  },

  createBodyHTML: function () {
    return `<header id="header">
               <div id="title"></div>
             </header>
             <main>
               <div id="tiles"></div>
               <div id="board-container"><div id="board"></div></div>
             </main>`;
  },

  createIgloo3x3HTML: function (tilesOnIgloo) {
    let imgHTML = `<div id="tiles-onigloo" class="layer-onigloo">`;
    for (let tile of tilesOnIgloo) {
      imgHTML += `<img id="${tile.idOnIgloo}" class="tile-onigloo" 
                         src="${this.imagePath}${tile.filename}"
                         style="visibility: hidden;"
                         alt="game tile ${tile.name}">`;
    }
    return imgHTML + '</div>';
  },

  createMeeple3x3HTML: function (tilesOnIgloo) {
    let imgHTML = `<div id="meeples-onigloo" class="layer-onigloo">`;
    for (let tile of tilesOnIgloo) {
      imgHTML += `<div class="tile-onigloo"><img 
                       id="${tile.idMeepleOnIgloo}"
                       class="meeple-onigloo"
                       style="visibility: hidden;" src="" 
                       alt="game meeple"></div>`;
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

  addOneTileEdgeToStack: function (player) {
    let stackElement = document.getElementById(player.tileStackID);
    if (player.tilesInStack.length > 0) {
      stackElement.innerHTML =
        `<img class="tile-edge" 
              src="${this.imagePath}${this.tileEdges[(player.tilesInStack.length === 1) ? 1 : 0].filename}"
              style="margin-left: ${getRandomInt(5) - 2}px"
              alt="tile edge for score keeping">
        ` + stackElement.innerHTML;
    }
  },

  createIcon: function (icon) {
    if (icon.request === gameController.REQUEST.toDeclare) { return; }
    // grab parent
    const parentElement = document.getElementById(icon.parentId);
    if (!parentElement) { return; }

    let iconElement = null;
    iconElement = document.createElement('img');
    iconElement.setAttribute('src', this.imagePath + icon.filename);
    iconElement.setAttribute('alt', `${icon.name} ${(icon.request) ? 'button' : 'icon'}`);
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
  },

  createDeclareFieldset: function (icons) {
    // grab parent
    const parentElement = document.getElementById('title');
    if (!parentElement) { return; }

    const containerElement = document.createElement('fieldset');
    containerElement.setAttribute('id', 'declare');
    for (let icon of icons) {
      if (icon.request !== gameController.REQUEST.toDeclare) { continue; }
      icon.id = `declare-${icon.name}`;
      containerElement.innerHTML +=
        `<label for="${icon.clickId}" id="${icon.id}">
          <input type="radio" id="${icon.clickId}" name="${icon.request}">
          <img src="${gameViewer.imagePath}${icon.filename}" alt="${icon.name} button">
        </label>`;
    }
    // append fieldset to parent
    parentElement.appendChild(containerElement);
    // set event liteners
    gameViewer.setEventListenerOnInputElements(containerElement, gameViewer.handleIconClick);
  },

  setEventListenerOnInputElements: function (containerElement, clickHandler) {
    for (let childElement of containerElement.children) {
      // put the evvent listener on the <input> element
      if (childElement.children.length > 0 && childElement.children[0].tagName === 'INPUT') {
        childElement.children[0].addEventListener('click', clickHandler);
      }
    }
  },

  initDeclareIcons: function (icons) {
    for (let icon of icons) {
      if (icon.request === gameController.REQUEST.toDeclare) {
        // grab input element
        const inputElement = document.getElementById(icon.clickId);
        inputElement.checked = "";
      }
    }
  },

  getTileDeclarationFromIcons: function (icons) {
    for (let icon of icons) {
      if (icon.request === gameController.REQUEST.toDeclare) {
        // grab input element
        const inputElement = document.getElementById(icon.clickId);
        if (inputElement.checked) {
          return icon.name;
        }
      }
    }
  },

  setVisibilityOfElement: function (elementID, isVisible) {
    const element = document.getElementById(elementID);
    if (!element) { return; }

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
    document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 6) * 3}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromleft', `${parentRect.width * this.boardPiece.igloo3x3LeftTopCorner[0]}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromtop', `${parentRect.width * this.boardPiece.igloo3x3LeftTopCorner[1]}px`);

    // meeple pieces position
    const meepleWidth = parentRect.width * this.boardPiece.meepleOnBoardWidth;
    document.documentElement.style.setProperty('--meeple-onboard-width', `${meepleWidth}px`);
    document.documentElement.style.setProperty('--meeple-onigloo-width', `${meepleWidth * 2}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${meepleWidth * gameController.PARAMETERS.numberOfMeeples}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${parentRect.width * this.boardPiece.meeplesOnBoardFromTop}px`);
    for (let i = 0; i < gameController.PARAMETERS.numberOfPlayers; i++) {
      document.documentElement.style.setProperty('--board-meeples-fromtop', `${parentRect.width * this.boardPiece.meeplesOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`, `${parentRect.width * this.boardPiece.meeplesOnBoardFromLeft[i]}px`);
    }

    // set sun positions
    let icon = this.iconFaces.find(function (element, index) {
      if (element.name === gameController.ICONS.sunPositions.name)
        return true;
    });
    parentRect = document.getElementById(icon.parentId).getBoundingClientRect();
    let sunLeftTopCorners = this.calculateSunPositions(parentRect.width, parentRect.height, parentRect.height * icon.height, gameController.PARAMETERS.numberOfSunPositions);
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

    // set icon positions
    this.setIconPositions(gameController.iconsOnTable);
  },

  setIconPositions: function (icons) {
    for (let icon of icons) {
      const parentElement = document.getElementById(icon.parentId);
      if (!parentElement || !icon.leftTopCorner) { continue; }

      const parentRect = parentElement.getBoundingClientRect();
      const element = document.getElementById(icon.id);
      if (!element) { continue; }
      if (icon.width) {
        element.style.width = `${parentRect.width * icon.width}px`;
        element.style.height = `${parentRect.width * icon.width}px`;
        element.style.left = `${parentRect.width * icon.leftTopCorner[0]}px`;
        element.style.top = `${parentRect.width * icon.leftTopCorner[1]}px`;
      } else {
        element.style.width = `${parentRect.height * icon.height}px`;
        element.style.height = `${parentRect.height * icon.height}px`;
        element.style.left = `${parentRect.left + parentRect.width * icon.leftTopCorner[0]}px`;
        element.style.top = `${parentRect.height * icon.leftTopCorner[1]}px`;
      }
    }
  },

  handleTileClick: function (event) {
    if (!gameController.isListenToClick) {
      event.preventDefault();
      return;
    }
    const isClickedOnLeft = (event.layerX < event.currentTarget.offsetWidth / 2);
    const request = isClickedOnLeft ? gameController.REQUEST.toFlipLeft : gameController.REQUEST.toFlipRight;
    const clickedElement = event.currentTarget.id;
    gameController.play(request, clickedElement);
  },

  handleIconClick: function (event) {
    if (!gameController.isListenToClick) {
      event.preventDefault();
      return;
    }
    for (let icon of gameController.iconsOnTable) {
      if (event.currentTarget.id === icon.clickId) {
        gameController.play(icon.request, event.currentTarget.id);
        break;
      }
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

  reloadRules: function () { location.reload(); }

};
