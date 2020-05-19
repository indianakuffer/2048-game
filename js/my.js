var example = true;
var moved;

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

function setValue(x,y,num) {
  let square = document.getElementById(`${x}-${y}`);
  boardArray[x][y] = num;
  if (num > 0) {
    square.innerHTML = num;
  } else {
    square.innerHTML = '';
  }
  setClass(x,y,square);
}

function setClass(x,y,obj) {
  obj.classList = [];
  if (obj.innerHTML > 0) {
    obj.classList.add('full');
    obj.classList.add('n'+boardArray[x][y]);
  }
}

function respawn() {
  let possibleX;
  let possibleY;
  let valueChecked;
  let timeOut = 1;
  do {
    possibleX = Math.round(Math.random()*(boardArray.length - 1));
    possibleY = Math.round(Math.random()*(boardArray.length - 1));
    // console.log(possibleX);
    // console.log(possibleY);
    // console.log('Respawn attempt: ' + timeOut);
    valueChecked = boardArray[possibleX][possibleY];
    timeOut++;
    if (timeOut > 100) {
      checkGameOver();
      return;
    }
  } while (valueChecked > 0);
  if (!moved) {
    return;
  } else {
    moved = false;
  }
  setValue(possibleX,possibleY,2);
  respawnFlash(possibleX,possibleY);
}

function move(key) {

  function moveAction(x,y,dir) {
    let current = boardArray[x][y];
    if (current == 0) {return;};
    switch(dir) {
      case 'up':
        if (boardArray[x][y-1] === 0) {
          moved = true;
          setValue(x,y-1,current);
          setValue(x,y,0);
          moveAction(x,y-1,dir);
        } else if (boardArray[x][y-1] == boardArray[x][y]) {
          moved = true;
          setValue(x,y-1,current*2);
          setValue(x,y,0);
        }
        break;
      case 'down':
        if (boardArray[x][y+1] == '') {
          moved = true;
          setValue(x,y+1,current);
          setValue(x,y,0);
          moveAction(x,y+1,dir);
        } else if (boardArray[x][y+1] == boardArray[x][y]) {
          moved = true;
          setValue(x,y+1,current*2);
          setValue(x,y,0);
        }
        break;
      case 'left':
        if (x == 0) {break};
        if (boardArray[x-1][y] == '') {
          moved = true;
          setValue(x-1,y,current);
          setValue(x,y,0);
          moveAction(x-1,y,dir);
        } else if (boardArray[x-1][y] == boardArray[x][y]) {
          moved = true;
          setValue(x-1,y,current*2);
          setValue(x,y,0);
        }
        break;
      case 'right':
        if (x == boardArray.length - 1) {break};
        if (boardArray[x+1][y] == '') {
          moved = true;
          setValue(x+1,y,current);
          setValue(x,y,0);
          moveAction(x+1,y,dir);
        } else if (boardArray[x+1][y] == boardArray[x][y]) {
          moved = true;
          setValue(x+1,y,current*2);
          setValue(x,y,0);
        }
        break;
    }
  }

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
  respawn();
  refreshBoard();
}

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

function gameWin() {
  alert('Congrats, you won!');
}

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
  alert('Game over :(');
  restart();
}

function restart() {
  boardInitialize();
  refreshBoard();
  respawn();
}

function respawnFlash(x,y) {
  let square = document.getElementById(`${x}-${y}`);
  let rect = square.getBoundingClientRect();
  let flash = document.createElement('div');
  flash.classList.add('flash');
  flash.style.width = rect.width + 'px';
  flash.style.height = rect.height + 'px';
  flash.style.top = rect.top + 'px';
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

boardInitialize();
respawn();

if (example) {
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

document.addEventListener('keyup', function(event) {
  const key = event.key;
  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    if (document.querySelector('.flash')) {
      document.querySelector('body').removeChild(document.querySelector('.flash'));
    }
    move(key);
  }
});
