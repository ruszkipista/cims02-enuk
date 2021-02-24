// object GAMEVIEWER
//===================
const gameViewer = {
  imagePath: './assets/img/',

  numberOfSunPositions: 9,

  tileFaces: [
    { name: Tile.NAME_REINDEER(), filename: 'tileface-reindeer.jpg', count: 9 },
    { name: Tile.NAME_POLARBEAR(), filename: 'tileface-polarbear.jpg', count: 14 },
    { name: Tile.NAME_SEAL(), filename: 'tileface-seal.jpg', count: 14 },
    { name: Tile.NAME_SALMON(), filename: 'tileface-salmon.jpg', count: 14 },
    { name: Tile.NAME_HERRING(), filename: 'tileface-herring.jpg', count: 14 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo00.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo01.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo02.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo10.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo11.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo12.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo20.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo21.jpg', count: 1 },
    { name: Tile.NAME_IGLOO(), filename: 'tileface-igloo22.jpg', count: 1 }
  ],

  tileEdges: [
    { filename: 'tileedge-mid.png' },
    { filename: 'tileedge-top.png' },
  ],

  icons: [
    { name: 'collect-tiles', count: 1, filename: 'icon-collect-tiles.png', clickable: true, parentId: 'title', height: 0.08, leftTopCorners: [[0.885, 0]] },
    { name: 'sun-position', count: 9, filename: 'icon-sun-position.png', clickable: false, parentId: 'title', height: 0.05, leftTopCorners: [] },
    { name: 'piece-sun', count: 1, filename: 'piece-sun.png', clickable: false, parentId: 'title', height: 0.05, leftTopCorners: [] },
  ],

  tileBack: { filename: 'tileback-ice.jpg', flipTimeMS: 800 },

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

  generateGameBoard: function (tiles, tilesOnTable, players, isTest) {
    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.innerHTML = `
      <header id="header">
        <div id="title"></div>
      </header>
      <main>
        <div id="tiles"></div>
        <div id="board"></div>
      </main>`;
    // put game board in place
    let boardPiecesHTML = "";
    // add BOARD to game space
    boardPiecesHTML = `<img id="${this.boardPiece.id}" src="${this.imagePath}${this.boardPiece.name}" alt="game board">`;

    // add hidden IGLOO TILES to the middle of the board
    boardPiecesHTML += `<div id="tiles-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === Tile.NAME_IGLOO()) {
        boardPiecesHTML += tile.placeOnIgloo();
      }
    }
    boardPiecesHTML += `</div>`;

    // add hidden MEEPLES on top of igloo tiles - without src and alt
    boardPiecesHTML += `<div id="meeples-onigloo" class="layer-onigloo">`;
    for (let tile of tiles) {
      if (tile.name === Tile.NAME_IGLOO()) {
        boardPiecesHTML += `<div class="tile-onigloo"><img 
                                id="${tile.idMeepleOnIgloo}"
                                class="meeple-onigloo"
                                style="visibility: hidden;" src="" alt="game meeple"></div>`;
      }
    }
    boardPiecesHTML += `</div>`;

    // add TILE STACKS and MEEPLES for all players on the board
    for (let i = 0; i < players.length; i++) {
      boardPiecesHTML += `<div id="${players[i].tileStackID}" class="tiles-stack tiles-stack-player${i}"></div>`;
      boardPiecesHTML += `<div id="meeples-player${i}" 
                               class="meeples-group tiles-stack-player${i}" 
                               style="border-top-color:${players[i].name}">`;
      for (let meeple of players[i].meeples) {
        boardPiecesHTML += meeple.placeOnBoard();
      }
      boardPiecesHTML += `</div>`;
    }

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = boardPiecesHTML;

    // add icons
    for (let icon of this.icons) {
      // grab parent
      const parentElement = document.getElementById(icon.parentId);
      icon.id = `icon-${icon.name}`;
      for (let i = 0; i < icon.count; i++) {
        const iconElement = document.createElement('img');
        iconElement.setAttribute('id', `${icon.id}${i}`);
        iconElement.setAttribute('src', this.imagePath + icon.filename);
        if (icon.clickable) {
          iconElement.addEventListener('click', gameController.handleIconClick);
          iconElement.setAttribute('alt', icon.name + ' button');
        } else {
          iconElement.setAttribute('alt', icon.name + ' icon');
        }
        iconElement.classList.add('icon-position');
        if (icon.name === 'sun-position') {
          iconElement.style.opacity = '50%';
        }
        // append icon to parent
        parentElement.appendChild(iconElement);
      }
    }

    // assemble tiles
    const tilesElement = document.getElementById('tiles');
    let tileElement;
    while (true) {
      let tile = tiles.shift();
      if (tile === undefined) { break; }
      tilesOnTable.push(tile);
      tileElement = tile.placeOnTable(false, isTest);
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

  setBoardPiecesPosition: function (sunPosition, numberOfPlayers) {
    const boardElement = document.getElementById(this.boardPiece.id);
    let boardWidth = boardElement.clientWidth;
    let boardLeftOffset = boardElement.offsetLeft;
    // flip transition time
    document.documentElement.style.setProperty('--flip-transition-time', `${gameViewer.tileBack.flipTimeMS}ms`);
    // igloo3x3 on board position
    const iglooLength = boardWidth * this.boardPiece.iglooLength;
    document.documentElement.style.setProperty('--piece-igloo-length', `${iglooLength}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-length', `${(iglooLength + 4) * 3 + 2}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromtop',
      `${boardWidth * this.boardPiece.igloo3x3TopLeftCorner[0]}px`);
    document.documentElement.style.setProperty('--piece-igloo3x3-fromleft',
      `${boardLeftOffset + boardWidth * this.boardPiece.igloo3x3TopLeftCorner[1]}px`);
    // meeple pieces position
    const meepleWidth = boardWidth * this.boardPiece.meepleOnBoardWidth;
    document.documentElement.style.setProperty('--meeple-onboard-width', `${meepleWidth}px`);
    document.documentElement.style.setProperty('--meeple-onigloo-width', `${meepleWidth * 2}px`);
    document.documentElement.style.setProperty('--tile-edge-width', `${meepleWidth * this.meeplePieces[0].count}px`);
    document.documentElement.style.setProperty('--tiles-stack-height', `${boardWidth * this.boardPiece.meeplesOnBoardFromTop}px`);
    for (let i = 0; i < numberOfPlayers; i++) {
      document.documentElement.style.setProperty('--board-meeples-fromtop',
        `${boardWidth * this.boardPiece.meeplesOnBoardFromTop}px`);
      document.documentElement.style.setProperty(`--tiles-stack-fromleft${i}`,
        `${boardLeftOffset + boardWidth * this.boardPiece.meeplesOnBoardFromLeft[i]}px`);
    }
    // icon positions
    let element = null;
    let leftTopCorner = null;
    let leftTopCorners = null;
    for (let icon of this.icons) {
      // learnt about getBoundingClientRect() here: https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
      let parentRect = document.getElementById(icon.parentId).getBoundingClientRect();
      if (icon.name === 'sun-position') {
        icon.leftTopCorners = this.calculateSunPositions(parentRect.width, parentRect.height, parentRect.width * icon.height, icon.count);
        leftTopCorners = icon.leftTopCorners;
      }
      for (let i = 0; i < icon.count; i++) {
        element = document.getElementById(`${icon.id}${i}`);
        if (icon.name == 'piece-sun') {
          leftTopCorner = leftTopCorners[sunPosition];
        } else { leftTopCorner = icon.leftTopCorners[i]; }
        element.style.height = `${parentRect.width * icon.height}px`;
        element.style.left = `${parentRect.width * leftTopCorner[0]}px`;
        element.style.top = `${parentRect.width * leftTopCorner[1]}px`;
      }
    }
    // set how many degrees the sun needs to turn in current position relative to the first position
    document.documentElement.style.setProperty('--piece-sun-rotate', `${sunPosition * 130}deg`);
  },
};