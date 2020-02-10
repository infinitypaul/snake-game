const canvas = document.querySelector("#snake");
const ctx = canvas.getContext("2d");
const button = document.querySelector('#butts');
const scoreText = document.querySelector('.score');

const {width, height} =  canvas;
let x = Math.floor(Math.random() * width);
let y = Math.floor(Math.random() * height);
let hue = 0;
let currentPosition;
const gridSize = 10;
let direction;
let Point;
let snakeBody;
let snakeLength;
let allowPressKeys =  false;
let timer;
let score = 0;
let playBool = false;



ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
ctx.fillRect(50, 50, 20, 20);



function move() {
    switch (direction) {
        case "right":
            arrowRight();
            break;
        case "up":
            arrowUp();
            break;
        case "left":
            arrowLeft();
            break;
        case "down":
            arrowDown();
            break;

    }
}

function draw({key}) {
    hue +=1;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

    switch (key) {
        case 'ArrowUp':
            if (direction !== "down"){
                arrowUp();
            }
            break;
        case 'ArrowDown':
            if (direction !== "up"){
                arrowDown();
            }
            break;
        case 'ArrowLeft':
            if (direction !== "right"){
                arrowLeft();
            }
            break;
        case 'ArrowRight':
            if (direction !== "left"){
               arrowRight();
            }
            break;
        default:
            break;
    }
}

function handleKey(e){
    if (!allowPressKeys){
        return null;
    }
    if(e.key.includes('Arrow')){
        e.preventDefault();
        draw(e)
    }
}


function leftSide(){
    return currentPosition['x'] - gridSize;
}

function rightSide(){
    return currentPosition['x'] + gridSize;
}

function upSide(){
    return currentPosition['y'] - gridSize;
}

function downSide(){
    return currentPosition['y'] + gridSize;
}

function arrowUp(){
    if (upSide() >= 0) {
        executeMove('up', 'y', upSide());
    } else {
        directionToFace('x');
    }
}

function arrowDown(){
    if (downSide() < height) {
        executeMove('down', 'y', downSide());
    }else {
        directionToFace('x')
    }
}

function arrowLeft(){
    if (leftSide() >= 0) {
        executeMove('left', 'x', leftSide());
    } else{
        directionToFace('y')
    }
}

function arrowRight(){
    if (rightSide() < canvas.width) {
        executeMove('right', 'x', rightSide());
    } else {
        directionToFace('y')
    }
}



function executeMove(value, positionType, positionValue) {
    direction = value;
    currentPosition[positionType] = positionValue;
    fillRect();
}

function fillRect() {
    if (snakeBody.some(bumpIntoSelf)) {
        end();
        return false;
    }
    snakeBody.push([currentPosition['x'], currentPosition['y']]);
    hue +=1;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(currentPosition['x'], currentPosition['y'], gridSize, gridSize);
    if (snakeBody.length > snakeLength) {
        const itemToRemove = snakeBody.shift();
        ctx.clearRect(itemToRemove[0], itemToRemove[1], gridSize, gridSize);
    }
    if (currentPosition['x'] === Point[0] && currentPosition['y'] === Point[1]) {
        foodToEat();
        snakeLength += 10;
        scores();
    }
}


function directionToFace(positionType){
    let a;
    if (positionType==='x') {
        a = (currentPosition['x'] > width / 2) ? arrowLeft() : arrowRight();
    } else {
        a = (currentPosition['y'] > height / 2) ? arrowUp() : arrowDown();
    }
    end()
}


function foodToEat(){
    Point = [Math.floor(Math.random()*(width/gridSize))*gridSize, Math.floor(Math.random()*(height/gridSize))*gridSize];
    if (snakeBody.some(hasPoint)) {
        foodToEat();
    } else{
        ctx.fillStyle = "rgb(32,12,100)";
        ctx.fillRect(Point[0], Point[1], gridSize, gridSize);
    }


}

function hasPoint(element, index, array) {
    return (element[0] === Point[0] && element[1] === Point[1]);
}

function bumpIntoSelf(element, index, array) {
    return (element[0] === currentPosition['x'] && element[1] === currentPosition['y']);
}


function end() {
    score = (snakeLength - 3)*10;
    pause();
    alert("Game Over. Your score was " + score);
    ctx.clearRect(0, 0, width, height);
    restart();
}



function pause(){
    clearInterval(timer);
    allowPressKeys = false;
}

function play(){
    timer = setInterval(move,30);
    allowPressKeys = true;
}

function start(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    currentPosition = {'x':50, 'y':50};
    snakeBody = [];
    snakeLength = 3;
    scores();
    foodToEat();
    fillRect();
    direction = 'right';
}

function scores(){
    score = (snakeLength - 3)*10;
    scoreText.textContent = score;
}



function playAndPause(){
    canvas.classList.add('shake');
    if(playBool){
        pause();
        button.textContent = 'Play';
    } else {
        button.textContent = 'Pause';
        play();
    }
    playBool = !playBool;
    canvas.addEventListener('animationend', function () {
        canvas.classList.remove('shake')
    }, {once : true})
}


function restart(){
    pause();
    start();
    playBool = false;
    button.textContent = 'Play';
}


start();

window.addEventListener("keydown", handleKey);
button.addEventListener("click", playAndPause);