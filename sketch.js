let x = 100;
let y = 100;
let ballArray = [];
let blockArray = [];
let flowerArray = [];
let dotArray = [];
let soundArray = [];
let flowerIndex = 0;
let add = 0;
let control = 0;
let isAdd = false;
let ANGLE;
let create = true;
let active = true;
let arrange = true;
let cover = true;
let narrative = true;
let buttonFont;
let subtitleFont;
let bgm;
let harpArray = [];
let root;
let DOT;
let funcChoice;
let colorArray = [[155, 144, 194], [168, 73, 122], [208, 16, 76], [235, 122, 119]];
let subtitleArray = [];
let contentArray = [
    `    Every year they will select
    the best poet of Greek. 
    Decorate their hair with the 
    laurel branch. When the branch 
    is chopped off, I feel the same pain. 
    The same pain that you chop off a 
    human’s arm or body. My name is Daphne, 
    I am this tree, talking to you. I was 
    free and happy, living in the woods. 
    My skin is as pure as milk and hair 
    is golden sunlight. I am chaste, devout, 
    as the presbyter of Goddess Diana, for 
    years and century. Until then, until 
    the day come.`,
    `    Gods are fickle, gods are cold-blood. 
    Even the god of love, Cupid, enjoy the 
    game of love and hate. I am the presbyter, 
    so I have to stay in the virgin. Apollo’s 
    arrival only brings fear to me, no more 
    than other. He is the god, he is powerful. 
    Even though he is in the shape of most 
    handsome young in the world, even he 
    brings his harp to play the most beautiful 
    tune, even his carriage gives most glory 
    flame in the sky that every woman in the 
    world should immediately fall in love with 
    him. But a sudden shock comes over me. The 
    shock that reminds me who I am, the shock 
    telling me to run away. The shock makes 
    me want nothing but escapes from the 
    powerful man, even if he is the god.`,
    `    It’s a long journey. I’ve run cross 
    the woods, field, mountain and rivers. 
    I can’t run anymore, but he is still 
    catching up with me. In such a wide world, 
    there is not a single space for a little 
    woman like me. I knee, pray, to my father, 
    the River god. I pray so hard, please, 
    please father let me be free. Help me, 
    rescue me, away from this nightmare, 
    away from the Sun God that I’can’t be 
    away from. I can give anything, anything 
    it can take.`,
    `    My legs take root, into the deep ground. 
    Leaves coming from my hair, hands become 
    branches. My eyes, they are shining, flowers. 
    I see this world from a human’s aspect for 
    the last time. He is there, reaching his hand
    to drag on my roots and branches, but there’s
    nothing he can do. I’m looking at him, telling 
    him: no I don’t love you. I don’t do 
    relationship. I will not be your woman. I’d 
    rather be here. With my stomach being woods, 
    the brain becomes juice of leaves, heart deeply 
    inlay in bole and never turns soft anymore, 
    ever again.
    
    That’s me, 
    That’s my story. 
    I am Daphne, the laurel`];

class Ball {
    constructor(radius, posX, posY, speedX, speedY, accX, accY, color, pitch) {
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
        this.speedX = speedX;
        this.speedY = speedY;
        this.accX = accX;
        this.accY = accY;
        this.color = color;
        this.pitch = pitch;
    }

    distance(other) {
        let distanceX = this.posX - other.posX;
        let distanceY = this.posY - other.posY;
        return sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    update(top, bottom) {
        this.speedX = this.speedX + this.accX >= 25 ? 25 : this.speedX + this.accX;
        this.speedY = this.speedY + this.accY >= 25 ? 25 : this.speedY + this.accY;
        this.posX += this.speedX;
        this.posY += this.speedY;
        this.accX = 0;
        this.accY = 0;

        if (this.posY >= bottom - this.radius && this.speedY <= 1) {
            this.posY = top + this.radius;
            this.speedY = 3;
        }
    }

    appear() {
        fill(this.color[0], this.color[1], this.color[2]);
        noStroke();
        ellipse(this.posX, this.posY, this.radius * 2, this.radius * 2);
    }

    checkCollision(other) {
        let distance = dist(this.posX, this.posY, other.posX, other.posY );
        if (distance < this.radius + other.radius) {
            let damping = 0.05;
            let forceX = (other.posX - this.posX) * damping;
            let forceY = (other.posY - this.posY) * damping;
            // force applied to other too!
            other.applyForce(forceX,forceY);
            // force applied to this
            forceX *= -1;
            forceY *= -1;
            this.applyForce(forceX,forceY);
        }
    }
    applyForce( forceX, forceY ) {
        this.accX += forceX;
        this.accY += forceY;
    }
    bump(top, bottom, left, right) {
        // check border
        if (this.posX < left + this.radius || this.posX > right - this.radius) {
            this.posX = this.posX < left + this.radius ? left + this.radius : right - this.radius;
            let pitch = this.posX < left + this.radius ? 1 : 3 + this.pitch;
            harpArray[pitch].play();
            this.speedX *= -1;
        }

        if (this.posY < top + this.radius || this.posY > bottom - this.radius) {
            this.posY = this.posY < top + this.radius ? top + this.radius : bottom - this.radius;
            let pitch = this.posY < top + this.radius ? 0 : 2 + this.pitch;
            harpArray[pitch].play();
            this.speedY *= -1;
        }

        //check blocks
        for (let i = 0; i < blockArray.length; i++) {
            let block = blockArray[i];

            if (this.posX > block.centerX - 0.5 * block.width && this.posX < block.centerX + 0.5 * block.width) {
                if (abs(this.posY - block.centerY) < this.radius + block.height * 0.5) {
                    this.posY = this.posY - block.centerY >= 0 ? block.centerY + this.radius + 0.5 * block.height: block.centerY - this.radius - 0.5 * block.height;
                    this.speedY *= -1;
                    control += 5;
                    isAdd = true;
                }
            }

            if (this.posY > block.centerY - 0.5 * block.height && this.posY < block.centerY + 0.5 * block.height) {
                if (abs(this.posX - block.centerX) < this.radius + block.width * 0.5) {
                    this.posX = this.posX - block.centerX >= 0 ? block.centerX + this.radius + 0.5 * block.width: block.centerX - this.radius - 0.5 * block.width;
                    this.speedX *= -1;
                    control += 5;
                    isAdd = true;
                }
            }
        }
    }
}

class Block {
    constructor(centerX, centerY, width, height) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
    }

    appear() {
        rectMode(CENTER);
        stroke(0);
        fill(0);
        strokeWeight(1);
        rect(this.centerX, this.centerY, this.width, this.height);
    }

    intersect(x=this.centerX, y=this.centerY, other) {
        if (abs(x - other.centerX) * 2 < this.width + other.width
            && abs(y - other.centerY) * 2 < this.height + other.height) {
            return true;
        } else {
            return false;
        }
    }

    inBound(x=this.centerX, y=this.centerY, top, bottom, left, right) {
        if (x - this.width / 2 > left && x + this.width / 2 < right
            && y - this.height / 2 > top && y + this.height / 2 < bottom) {
            return true;
        } else {
            return false;
        }
    }

    relocate(x, y) {
        this.centerX = x;
        this.centerY = y;
    }
}

class Flower {
    constructor(posX, posY, color) {
        this.posX = posX;
        this.posY = posY;
        this.func1 = random(funcChoice);
        this.func2 = random(funcChoice);
        this.color = color;
    }

    bloom() {
        translate(this.posX, this.posY);
        strokeWeight(1);
        if (isAdd) {
            add++;
            rotate(radians(ANGLE) + add * 0.01); //angle

            stroke(this.color[0], this.color[1], this.color[2], 10);
            for (let angle = 0; angle < 360; angle += 72) {
                push();
                rotate(radians(angle) + add * 0.01); //angle
                let freq, noiseVal;
                let amp = 50;//可以改 花大小
                freq = add * 0.01;//初始大小
                amp = lerp(amp, 100, 0.01);
                noiseVal = this.func1(freq) * amp;
                freq = add * 0.015;//可以改
                amp = noiseVal;
                let distance = this.func2(freq) * amp;
                fill(0);
                line(0, 0, distance, 0);
                pop();
            }
            if (add === control) {
                isAdd = false;
            }
        }

    }
}

class Dot {
    constructor(posX, posY, bound) {
        // bound(list): [x1, y1, x2, y2]
        this.posX = posX;
        this.posY = posY;
        this.bound = bound;
        this.desX = posX + 1;
        this.desY = posY + 1;
    }

    move() {
        let dis = dist(this.posX, this.posY, this.desX, this.desY);
        if (dis < 10) {
            this.desX = random(this.bound[0], this.bound[2]);
            this.desY = random(this.bound[1], this.bound[3]);
        }
        let correct = dis > 100 ? 1 / dis : 0.01;
        this.posX = lerp(this.posX, this.desX, correct);
        this.posY = lerp(this.posY, this.desY, correct);
    }

    appear() {
        image(DOT, this.posX, this.posY);
    }
}

class Subtitle {
    constructor(content, posX, posY) {
        this.content = content;
        this.posX = posX;
        this.posY = posY;
    }

    move() {
        this.posY -= 0.2;
    }

    appear() {
        fill(255);
        textSize(18);
        textFont(subtitleFont);
        text(this.content, this.posX, this.posY);
    }
}

function preload() {
    soundFormats('mp3', 'wav');
    //bgm = loadSound('sound/bgm.mp3');
    for (let i = 0; i < 7; i++) {
        harpArray.push(loadSound('sound/harp_' + i + '.wav'));
    }
    buttonFont = loadFont("font/Allura-Regular.ttf");
    subtitleFont = loadFont("font/Monaco.ttf");
    for (let i = 1; i < 5; i++) {
        soundArray.push(loadSound('sound/daphne' + i + '.mp3'));
        print("Load: " + i);
    }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  translate(width / 2, height - 260);
  branch(250);
  strokeWeight(1);
  ANGLE = PI / 3;
  root = loadImage('images/root.png');
  DOT = loadImage("images/dot.png");
  funcChoice = [sin, cos, noise];
  //bgm.loop();
}

function draw() {
    let rectCenterX = width / 2;
    let rectCenterY = height - 180;
    let rectWidth = 300;
    let rectHeight = 300;
    let trapezoidWidth = 500;
    let trapezoidHeight = 400;
    let trapezoidDiffrence = 50;
    let top = rectCenterY - rectHeight / 2;
    let bottom = rectCenterY + rectHeight / 2;
    let left = rectCenterX - rectWidth / 2;
    let right = rectCenterX + rectWidth / 2;

    cursor();
    if (create) {
        for (let i = 0; i < 4; i++) {
            subtitleArray.push(new Subtitle(contentArray[i], width / 2 - 850, height));
        }
        flowerArray.push(new Flower(rectCenterX, rectCenterY / 2 + 4, choice(colorArray)));
        flowerArray.push(new Flower(rectCenterX - 133, rectCenterY / 2 - 60, choice(colorArray)));
        flowerArray.push(new Flower(rectCenterX + 133, rectCenterY / 2 - 60, choice(colorArray)));
        flowerArray.push(new Flower(rectCenterX, rectCenterY / 2 - 140, choice(colorArray)));
        blockArray.push(new Block(rectCenterX - 100, rectCenterY - 50, 100, 20));
        blockArray.push(new Block(rectCenterX + 100, rectCenterY + 50, 100, 20));
        for (let i = 0; i < 2; i++) {
            let tempColor, tempPitch;
            if (i === 0) {
                tempColor = [255, 177, 27];
                tempPitch = 0;
            } else {
                tempColor = [134, 193, 102];
                tempPitch = 3;
            }
            let tempSpeedX = floor(random(-5, 5));
            let tempSpeedY = floor(random(-10, 10));
            let tempBall = new Ball(20, rectCenterX, rectCenterY, tempSpeedX, tempSpeedY, 0, 0.5, tempColor, tempPitch);
            ballArray.push(tempBall);
        }
        let bound1 = [0, 0, rectCenterX - 400, height];
        let bound2 = [width, 0, rectCenterX + 300, height];
        for (let i = 0; i < 10; i++) {
            dotArray.push(new Dot(random(bound1[0], bound1[2]), random(bound1[1], bound1[3]), bound1));
        }
        for (let i = 0; i < 10; i++) {
            dotArray.push(new Dot(random(bound2[0], bound2[2]), random(bound2[1], bound2[3]), bound2));
        }
        create = false;
    }
    rectMode(CORNER);
    stroke(0);
    fill(0);
    rect(width / 2 - 300, height, -width / 2, -height);
    rect(width / 2 + 300, height, width / 2, -height);
    for (let i = 0; i < dotArray.length; i++) {
        dotArray[i].move();
        dotArray[i].appear();
    }
    fill(255);
    textFont(buttonFont);
    textSize(32);
    text("BACK", width - 120, height - 20);
    if (mouseX > width - 150
        && mouseX < width - 10
        && mouseY > height - 40
        && mouseY < height - 5
    ) {
        cursor(HAND);
        if (mouseIsPressed) {
            location.href = './intro.html';
        }
    }

    if (add > 200) {
        active = false;
        isAdd = false;
    }

    if (active) {
        /* Clear the screen */
        strokeWeight(10);
        stroke(255);
        fill(64);
        quad(rectCenterX - trapezoidWidth / 2, rectCenterY - trapezoidHeight / 2,
            rectCenterX + trapezoidWidth / 2, rectCenterY - trapezoidHeight / 2,
            rectCenterX + trapezoidWidth / 2 - trapezoidDiffrence, rectCenterY + trapezoidHeight / 2,
            rectCenterX - trapezoidWidth / 2 + trapezoidDiffrence, rectCenterY + trapezoidHeight / 2);

        noStroke();
        fill(96);
        rectMode(CENTER);
        rect(rectCenterX, rectCenterY, rectWidth, rectHeight);
        image(root, rectCenterX - 183, rectCenterY - 205);
        for (let i = 0; i < blockArray.length; i++) {
            blockArray[i].appear();
        }


        if (!arrange) {
            strokeWeight(1);
            for (let i = 0; i < ballArray.length; i++) {

                let gravity = 0.5;
                ballArray[i].applyForce(0,gravity);

                for (let j = 0; j < ballArray.length; j++) {
                    if ( i !== j) {
                        ballArray[i].checkCollision( ballArray[j] );
                    }
                }
                ballArray[i].bump(top, bottom, left, right);
                ballArray[i].update(top, bottom);
                ballArray[i].appear();
            }
        }

        if (arrange) {
            rectMode(CENTER);
            strokeJoin(ROUND);
            stroke(255);
            strokeWeight(5);
            noStroke();
            fill(255);
            textFont(buttonFont);
            textSize(32);
            text("READY", rectCenterX + 350, rectCenterY + 10);
            if (mouseX > rectCenterX + 325
                && mouseX < rectCenterX + 475
                && mouseY > rectCenterY - 25
                && mouseY < rectCenterY + 25
                ) {
                cursor(HAND);
                if (mouseIsPressed) {
                    arrange = false;
                    for (let i  = 0; i < ballArray.length; i++) {
                        let tempSpeedX = floor(random(-5, 5));
                        let tempSpeedY = floor(random(-5, 5));
                        ballArray[i].posX = rectCenterX;
                        ballArray[i].posY = rectCenterY;
                        ballArray[i].speedX = tempSpeedX;
                        ballArray[i].speedY = tempSpeedY;
                    }
                }
            }
        }

        if (arrange) {
            for (let i = 0; i < blockArray.length; i++) {
                if (mouseX > blockArray[i].centerX - blockArray[i].width / 2
                    && mouseX < blockArray[i].centerX + blockArray[i].width / 2
                    && mouseY > blockArray[i].centerY - blockArray[i].height / 2
                    && mouseY < blockArray[i].centerY + blockArray[i].height / 2) {
                    cursor(HAND);
                    if (mouseIsPressed) {
                        let valid = true;
                        for (let j = 0; j < blockArray.length; j++) {
                            if (i !== j) {
                                if (blockArray[i].intersect(mouseX, mouseY, blockArray[j])) {
                                    valid = false;
                                }
                            }
                        }
                        if (blockArray[i].inBound(mouseX, mouseY, top, bottom, left, right) === false) {
                            valid = false;
                        }
                        if (valid) {
                            blockArray[i].relocate(mouseX, mouseY);
                        }
                    }
                }
            }
        }
        flowerArray[flowerIndex].bloom();
    }

    if (!active) {
        if (!narrative) {
            textFont(buttonFont);
            fill(255);
            textSize(32);
            text("SKIP", rectCenterX + 350, rectCenterY + 110);
            if (mouseX > rectCenterX + 325
                && mouseX < rectCenterX + 475
                && mouseY > rectCenterY + 75
                && mouseY < rectCenterY + 125
                ) {
                cursor(HAND);
                if (mouseIsPressed) {
                    soundArray[flowerIndex].stop();
                }
            }
            subtitleArray[flowerIndex].move();
            subtitleArray[flowerIndex].appear();
        }
        if (cover && !active) {
            noStroke();
            fill(255, 255, 255, 80);
            rectMode(CENTER);
            rect(rectCenterX, rectCenterY, rectWidth, rectHeight);
            cover = false;
        }
        if (narrative && dist(mouseX, mouseY, flowerArray[flowerIndex].posX, flowerArray[flowerIndex].posY) < 50) {
            cursor(HAND);
            if (mouseIsPressed) {
                narrative = false;
                print("play: " + flowerIndex);
                soundArray[flowerIndex].play();
                soundArray[flowerIndex].onended(
                    function () {
                        //bgm.play();
                        narrative = true;
                        active = true;
                        arrange = true;
                        cover = true;
                        add = 0;
                        control = 0;
                        noiseDetail(4, random(0, 1));
                        if (flowerIndex !== 3) {
                            flowerIndex++;
                        }
                        blockArray[0].centerX = rectCenterX - 100;
                        blockArray[0].centerY = rectCenterY - 50;
                        blockArray[1].centerX = rectCenterX + 100;
                        blockArray[1].centerY = rectCenterY + 50;
                    }
                );
            }
        }
    }
}

function branch(len) {
    let sw = map(len, 150, 0, 30, 0);
    let ANGLE = PI / 3;
    stroke(255);
    strokeWeight(sw);
    line(0, 0, 0, -len);
    translate(0, -len);

    if (len > 25) {

        push();
        rotate(ANGLE + random(0));
        branch(len*2/3*0.9);
        // branch(len * 2/ 3 * random(0.7, 1.3));
        pop();

        push();
        rotate(-ANGLE + random(0));
        branch(len*2/3*0.9);
        // branch(len * 2 / 3 * random(0.7, 1.3));
        pop();

        push();
        rotate(random(0));
        branch(len*2/3*0.9);
        // branch(len * 2 / 3 * random(0.7, 1.3));
        pop();
    }
}

function choice(l) {
    let index = floor(random(0, l.length));
    let value = l[index];
    l.splice(index, 1);
    print(1);
    return value;
}
