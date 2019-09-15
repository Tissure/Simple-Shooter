class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.is_shooting = false;
        this.counter = 0;
        this.powered = false;
        this.hit = false;
        this.health = 5;
        this.visible = true;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    changeX(speed) {
        this.x += speed;
    }
    changeY(speed) {
        this.y += speed;
    }
    changePower() {
        this.powered = true;
    }
    unPower() {
        this.powered = false;
    }
    isPower() {
        return this.powered
    }
    getHealth() {
        return this.health;
    }
    isVisible() {
        return this.visible;
    }
    setVisible() {
        this.visible = !this.visible;
        if (this.isHit()) {
            this.blink = setTimeout(this.setVisible.bind(this), 100);
        }
    }

    isHit() {
        return this.hit;
    }
    startInvis() {
        this.hit = true;
        this.health--;
        setTimeout(this.setVisible.bind(this), 100);
        setTimeout(this.stopInvis.bind(this), 2000);
    }
    stopInvis() {
        clearInterval(this.blink);
        this.visible = true;
        this.hit = false;
    }

    shoot() {
        if (!this.is_shooting) {
            this.is_shooting = !this.is_shooting;
            if (player.isPower()) {
                player_bullets.push(new Bullet(player.getX(), player.getY(), 0));
                player_bullets.push(new Bullet(player.getX(), player.getY(), -2));
                player_bullets.push(new Bullet(player.getX(), player.getY(), 2));
            } else {
                player_bullets.push(new Bullet(player.getX(), player.getY(), 0));
            }
        }
        if (this.counter % 25 == 0) {
            this.is_shooting = false;
        }
    }

    drawPlayer() {
        if (this.isHit() && !this.isVisible()) {
            //donothing
        } else {
            this.drawRect(this.getX(), this.getY()); //body
            this.draw(this.getX(), this.getY(), "#000000");//wings
            this.drawEye(this.getX(), this.getY()); //eye
        }
    }
    drawRect(x, y) {
        ctx.beginPath();
        ctx.rect(x, y, PLAYER_X_LIMIT, PLAYER_Y_LIMIT);
        ctx.stroke();
        ctx.rect(x, y, -PLAYER_X_LIMIT, PLAYER_Y_LIMIT);
        ctx.stroke();
    }
    drawEye(x, y) {
        ctx.save();
        ctx.translate(x, y);
        switch (player.getHealth()) {
            case (1):
                ctx.fillStyle = "#FFBBBB";
                break;
            default:
                ctx.fillStyle = "#BBBBFF";
                break;

        }
        ctx.rotate(Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 15, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
    draw(x, y, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, PLAYER_Y_LIMIT);
        ctx.lineTo(0 - 15, PLAYER_Y_LIMIT);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.restore();
    }
}
class Bullet {
    //Takes position of Player as x and y;
    constructor(x, y, angle) {
        this.x_position = x;
        this.y_position = y;
        this.angle = angle;
        this.radius = PLAYER_BULLET;
        this.type = "player";
        this.color = "#000000"
    }
    getX() {
        return this.x_position;
    }
    getY() {
        return this.y_position;
    }
    move() {
        this.x_position += this.angle;
        this.y_position -= shoot_speed;
    }
    getType() {
        return this.type;
    }
    drawBullet() {
        ctx.save()
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.getX(), this.getY(), this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}
class Enemy {
    constructor(x, y, hp) {
        this.x = x;
        this.y = y;
        this.has_shot = true;
        this.hp = hp;
        this.counter = 0;
        this.shoot_counter = 0;
        this.stop_move = Math.ceil(Math.random() * 200 + 10);
        this.start_move = Math.ceil(Math.random() * 2000 + this.stop_move + 1000);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    //Checks if enemy should move then moves or stops
    move(speed) {
        switch (this.counter) {
            case this.stop_move:
                this.startShooting();
                break;
            case this.start_move:
                this.has_shot = true;
                break;
        }
        if (this.counter < this.stop_move || this.counter > this.start_move) {
            this.y += speed;
        }
        this.counter++;
    }

    //returns true if hp is below 0 and adds to score
    //else return false
    takeHit() {
        this.hp--;
        if (this.hp <= 0) {
            score += 100;
            return true;
        }
        return false;
    }

    //Creates new enemy bullet if enemy has not shot
    //counter tracks shots
    enemyShoot() {
        if (this.shoot_counter % 200 == 199 && this.shoot_counter >= this.stop_move) {
            this.startShooting();
        }
        if (!this.has_shot) {
            this.has_shot = !this.has_shot;
            enemy_bullets.push(new Enemy_Bullet(this.x, this.y, 0));
        }
        this.shoot_counter++;
    }

    startShooting() {
        this.has_shot = false;
    }
    //draws enemy
    drawEnemy() {
        ctx.save();
        ctx.translate(this.getX(), this.getY());
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.moveTo(ENEMY_X_LIMIT, 0);
        ctx.lineTo(-ENEMY_X_LIMIT, 0);
        ctx.lineTo(-ENEMY_X_LIMIT, -ENEMY_Y_LIMIT);
        ctx.lineTo(ENEMY_X_LIMIT, -ENEMY_Y_LIMIT);
        ctx.lineTo(ENEMY_X_LIMIT, 0);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(0, 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
    }
}
class Enemy_Bullet extends Bullet {
    constructor(x, y, angle) {
        super(x, y, angle);
        super.type = "enemy";
        super.radius = ENEMY_BULLET;
        super.color = "#FF0000"
    }
    move() {
        //this.x_position += this.angle;
        this.y_position += shoot_speed / 5;
    }
}
