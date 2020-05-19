function boardInitialize() {
  boardArray = [];
  for (let i = 0; i < 4; i++) {
    boardArray[i] = [];
  }
  for (var i = 0; i < boardArray.length; i++) {
      for (var j = 0; j < 4; j++) {
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

boardInitialize();
setValue(1,0,2);
console.log(boardArray);
