
//pano
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dinozor
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//kaktüs
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//fizik
let velocityX = -8; //kaktüs sola doğru hareket ediyor
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //tahtaya çizim yapmak için kullanılır

    // draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "images/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "images/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "images/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "images/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milisaniye = 1 saniye
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dinozor
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //Mevcut dino.y'ye yer çekimini uygulayarak zemini aşmadığından emin olun
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //kaktüs
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "images/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //skor
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //zıpla
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //ördek
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //kaktüs yerleştir
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //Dizinin sürekli büyümemesi için dizideki ilk öğeyi kaldırın
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a'nın sol üst köşesi b'nin sağ üst köşesine ulaşmıyor
           a.x + a.width > b.x &&   //a'nın sağ üst köşesi b'nin sol üst köşesini geçer
           a.y < b.y + b.height &&  //a'nın sol üst köşesi b'nin sol alt köşesine ulaşmıyor
           a.y + a.height > b.y;    //a'nın sol alt köşesi b'nin sol üst köşesini geçer
}