// Stores whether or not a valid move was made last 'turn'
var moved;

var popSound = new sound('./pop.m4a');

boardInitialize();
spawn(2);

document.addEventListener('keyup', function(event) {
  const key = event.key;
  keyPress(key);
});

// Demo mode spawns all blocks
var demo = false;
if (demo) {
  let x = 0;
  let y = 0;
  let num = 2;
  for (let i = 0; i < 16; i++) {
    console.log(`${x},${y}`)
    setValue(x,y,num);
    num *= 2;
    if (x > 2) {
      y++;
    }
    if (x < boardArray.length - 1) {
      x++;
    } else {x = 0}
    if (num > 2048) {
      break;
    }
  }
}

// // FUNCTIONS

function boardInitialize() {
  moved = true;
  boardArray = [];
  for (let i = 0; i < 4; i++) {
    boardArray[i] = [];
  }
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < 4; j++) {
      boardArray[i][j] = 0;
    }
  }
}

function keyPress (key) {
  hidePopup();
  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    if (document.querySelector('.flash')) {
      document.querySelector('body').removeChild(document.querySelector('.flash'));
    }
    move(key);
  }
}

function move(key) {
  // Triggers moveAction according to appropriate pattern
  switch(key) {
    case 'ArrowUp':
      for (let i = 0; i < boardArray.length; i++) {
        for (let j = 1; j < 4; j++) {
          moveAction(i,j,'up');
        }
      }
      break;
    case 'ArrowDown':
      for (let i = 0; i < boardArray.length; i++) {
        for (let j = 2; j > -1; j--) {
          moveAction(i,j,'down');
        }
      }
      break;
    case 'ArrowLeft':
      for (let i = 1; i < boardArray.length; i++) {
        for (let j = 0; j < 4; j++) {
          moveAction(i,j,'left');
        }
      }
      break;
    case 'ArrowRight':
      for (let i = boardArray.length - 2; i > -1; i--) {
        for (let j = 0; j < 4; j++) {
          moveAction(i,j,'right');
        }
      }
      break;
  }

  // Square look and move behavior
  function moveAction(x,y,dir) {
    let current = boardArray[x][y];
    let checkX, checkY;
    if (current == 0) {return;};
    switch(dir) {
      case 'up':
        checkX = x;
        checkY = y - 1;
        break;
      case 'down':
        checkX = x;
        checkY = y + 1;
        break;
      case 'left':
        if (x == 0) {return};
        checkX = x - 1;
        checkY = y;
        break;
      case 'right':
        if (x == boardArray.length - 1) {return};
        checkX = x + 1;
        checkY = y;
        break;
    }
    if (boardArray[checkX][checkY] == '') {
      moved = true;
      setValue(checkX,checkY,current);
      setValue(x,y,0);
      moveAction(checkX,checkY,dir);
    } else if (boardArray[checkX][checkY] == boardArray[x][y]) {
      moved = true;
      setValue(checkX,checkY,current*2);
      setValue(x,y,0);
      popSound.play();
    }
  }

  spawn(2);
  refreshBoard();
}

function setValue(x,y,num) {
  let square = document.getElementById(`${x}-${y}`);
  boardArray[x][y] = num;
  if (num > 0) {
    square.innerHTML = num;
  } else {
    square.innerHTML = '';
  }
  // All changes in value need to be followed by changes in class
  setClass(x,y,square);
}

function setClass(x,y,obj) {
  obj.classList = [];
  if (obj.innerHTML > 0) {
    obj.classList.add('full');
    obj.classList.add('n'+boardArray[x][y]);
  }
}

function spawn(num) {
  let possibleX;
  let possibleY;
  let valueChecked;
  let timeOut = 1;
  do {
    possibleX = Math.round(Math.random()*(boardArray.length - 1));
    possibleY = Math.round(Math.random()*(boardArray.length - 1));
    valueChecked = boardArray[possibleX][possibleY];
    timeOut++;
    // Timeout breaks loop if there are no suitable spawn points
    if (timeOut > 1000) {
      checkGameOver();
      return;
    }
  } while (valueChecked > 0);
  // Stops turn if no square movement was made, to prevent excess spawning
  if (!moved) {
    return;
  } else {
    moved = false;
  }
  setValue(possibleX,possibleY,num);
  spawnFlash(possibleX,possibleY);
}

// Resets values based on array, checks for win condition
function refreshBoard() {
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < 4; j++) {
      setValue(i,j,boardArray[i][j]);
      if (boardArray[i][j] >= 2048) {
        gameWin();
      }
    }
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function spawnFlash(x,y) {
  let square = document.getElementById(`${x}-${y}`);
  let rect = square.getBoundingClientRect();
  console.log(rect);
  let flash = document.createElement('div');
  flash.classList.add('flash');
  flash.style.width = rect.width + 'px';
  flash.style.height = rect.height + 'px';
  flash.style.top = rect.top + window.pageYOffset + 'px';
  flash.style.left = rect.left + 'px';
  flash.style.opacity = 1;
  document.querySelector('body').appendChild(flash);
  fadeFlash();
}

function fadeFlash() {
  let flash = document.querySelector('.flash');
  var fadeEffect = setInterval(function () {
        if (flash.style.opacity > 0) {
            flash.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            document.querySelector('body').removeChild(flash);
        }
    }, 50);
}

function popup(message) {
  let popupBox = document.querySelector('#popup');
  document.querySelector('#popup p').innerHTML = message;
  popupBox.style.visibility = 'visible';
}

function hidePopup() {
  let popupBox = document.querySelector('#popup');
  if (popupBox.style.visibility = 'visible') {
    popupBox.style.visibility = 'hidden';
  }
}

function gameWin() {
  popup('Congrats, you win!!');
  restart();
}

// If spawn timesout, checks if there are any valid moves on the board
function checkGameOver() {
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (i < boardArray.length - 1) {
        if (boardArray[i+1][j] == boardArray[i][j]) {return;}
      }
      if (i > 0) {
        if (boardArray[i-1][j] == boardArray[i][j]) {return;}
      }
      if (j < boardArray.length - 1) {
        if (boardArray[i][j+1] == boardArray[i][j]) {return;}
      }
      if (j > 0) {
        if (boardArray[i][j-1] == boardArray[i][j]) {return;}
      }
    }
  }
  popup('Sorry, you lost :\'(');
  restart();
}

function restart() {
  boardInitialize();
  refreshBoard();
  spawn(2);
  fadeFlash();
}
