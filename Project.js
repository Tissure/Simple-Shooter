let canvas;
let ctx;
const width = 500;
const height = 500;
const speed = 1;
const enemy_speed = 1;
const shoot_speed = 5;
const PLAYER_BULLET = 2;
const ENEMY_BULLET = 5;
const PLAYER_X_LIMIT = 10;
const PLAYER_Y_LIMIT = 25;
const ENEMY_X_LIMIT = 20;
const ENEMY_Y_LIMIT = 20;
const BASIC_HEALTH = 20;
let player, player_bullets, enemys, enemy_bullets, keys, updater, spawn_counter, score;

//sets up game
function setUp() {
   canvas = document.getElementById("myCanvas");
   ctx = canvas.getContext("2d");
   ctx.font = "20px Arial";
   player = new Player(width / 2, height * 0.8);
   player_bullets = new Array();
   enemys = new Array();
   enemy_bullets = new Array();
   keys = {};
   startGame();
}

//starts game
function startGame() {
   score = 0;
   spawn_counter = 0;
   updater = setInterval(updateBoard, 1);
   addEventListener("keydown", function (event) {
      keys = (keys || []);
      keys[event.keyCode] = true;
   }, false);
   addEventListener("keyup", function (event) {
      keys[event.keyCode] = false;
   }, false);
}

//Updates game state per tick
function updateBoard() {
   ctx.clearRect(0, 0, width, height);
   ctx.fillStyle = "#000000";
   ctx.fillText("Score: " + score, 0, 20);
   //draw and update player status
   playerUpdate();
   player.drawPlayer();

   //draw all enemys
   for (var i = 0; i < enemys.length; i++) {
      //drawEnemy(enemys[i]);
      enemys[i].drawEnemy();
      //enemys[i].enemyShoot();
      enemys[i].move(speed);
      enemys[i].enemyShoot();
      if (enemys[i].getY() > height) {
         enemys.splice(i, 1);
      }
      //check if hit player
      if (enemys.length > 0 && i < enemys.length) {
         if (enemys[i].getX() + ENEMY_X_LIMIT > player.getX() - PLAYER_X_LIMIT && enemys[i].getX() - ENEMY_X_LIMIT < player.getX() + PLAYER_X_LIMIT && enemys[i].getY() + ENEMY_Y_LIMIT > player.getY() && enemys[i].getY() - ENEMY_Y_LIMIT < player.getY() + PLAYER_Y_LIMIT) {
            if (!player.isHit()) {
               player.startInvis();
            }
            if (!player.getHealth()) {
               gameOver();
            }
         }
      }
   }
   //player bullet collision
   for (var i = 0; i < player_bullets.length; i++) {
      player_bullets[i].drawBullet();
      player_bullets[i].move();
      //check out of bounds
      if (player_bullets[i].getY() < 0) {
         player_bullets.shift();
      }
      //check if hit enemy
      enemys.forEach(function (element) {
         if (player_bullets.length > 0 && i < player_bullets.length) {
            if (player_bullets[i].getX() + PLAYER_BULLET > element.getX() - ENEMY_X_LIMIT && player_bullets[i].getX() - PLAYER_BULLET < element.getX() + ENEMY_X_LIMIT && player_bullets[i].getY() - PLAYER_BULLET < element.getY() + ENEMY_Y_LIMIT) {
               player_bullets.splice(i, 1);
               if (element.takeHit()) {
                  enemys.splice(enemys.indexOf(element), 1);
               }
            }
         }
      });
   }

   //enemy bullet collision
   for (var i = 0; i < enemy_bullets.length; i++) {
      enemy_bullets[i].drawBullet();
      enemy_bullets[i].move();
      //check out of bounds
      if (enemy_bullets[i].getY() > height) {
         enemy_bullets.splice(i, 1);
      }
      //check if hit player
      if (enemy_bullets.length > 0 && i < enemy_bullets.length) {
         if (enemy_bullets[i].getX() + ENEMY_BULLET > player.getX() - 5 && enemy_bullets[i].getX() - ENEMY_BULLET < player.getX() + 5 && enemy_bullets[i].getY() + ENEMY_BULLET > player.getY() + 5 && enemy_bullets[i].getY() - ENEMY_BULLET < player.getY() + 20) {
            if (!player.isHit()) {
               player.startInvis();
            }
            if (!player.getHealth()) {
               gameOver();
            }
            enemy_bullets.splice(i, 1);
         }
      }
   }

   //adds new enemys after 999ms
   if (spawn_counter % 1000 === 999) {
      for (let i = 0; i < Math.ceil(Math.random() * 5 + 1); i++) {
         enemys.push(new Enemy((Math.random() * width), 0, 10));
      }
   }
   spawn_counter++;

   //Power player after 2000 points/20 enemys
   if(score === 2000){
      player.changePower();
   }
}

//checks bounds of player
function checkOutOfBounds(player) {
   if (player.getX() < PLAYER_X_LIMIT) {
      player.setX(PLAYER_X_LIMIT);
   }
   if (player.getX() > width - PLAYER_X_LIMIT) {
      player.setX(width - PLAYER_X_LIMIT);
   }
   if (player.getY() < 0) {
      player.setY(0);
   }
   if (player.getY() > height - PLAYER_Y_LIMIT) {
      player.setY(height - PLAYER_Y_LIMIT);
   }
}

//Control map for player movement
function playerUpdate() {
   if (keys[37]) {
      player.changeX(-speed);
   }
   if (keys[39]) {
      player.changeX(speed);
   }
   if (keys[38]) {
      player.changeY(-speed);
   }
   if (keys[40]) {
      player.changeY(speed);
   }
   if (keys[89]) { //y key
      player.changePower();
   }
   if (keys[65]) { // a key
      player.shoot();
   }
   player.counter++;
   
   checkOutOfBounds(player);
   if (keys[13]) {
      clearInterval(updater);
      ctx.fillText("END", width / 2, height / 2);
   }
}

//gameovers
function gameOver() {
   ctx.fillStyle = "#000000";
   ctx.fillText("GAME OVER", width / 2, height / 2);
   clearInterval(updater);
}

//reset game
function reset() {
   ctx.clearRect(0, 0, width, height);
   player.setX(width / 2);
   player.setY(height * 0.8);
   player.unPower();
   score = 0;
   while (player_bullets.length > 0) {
      player_bullets.pop();
   }
   while (enemy_bullets.length > 0) {
      enemy_bullets.pop();
   }
   while (enemys.length > 0) {
      enemys.pop();
   }
   spawn_counter = 0;
   clearInterval(updater);
   updater = setInterval(updateBoard, 1);
}