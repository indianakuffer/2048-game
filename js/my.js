function boardInitialize() {
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
  if (obj.innerHTML > 0) {
    obj.classList.toggle('full');
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
    console.log('Respawn attempt: ' + timeOut);
    valueChecked = boardArray[possibleX][possibleY];
    timeOut++;
    if (timeOut > 100) {
      break;
    }
  } while (valueChecked > 0);
  setValue(possibleX,possibleY,2);
}

boardInitialize();
respawn();
console.log(boardArray);
