//Initialising global variables
var monkey, monkey_running, monkey_collided;
var ground;
var banana, bananaImage, obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var score = 0, bananaPoints = 0;
var gameState;
var PLAY = 1;
var END = 0;
var randY;

function preload() {

  //Loading the monkey animation
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  monkey_collided = loadAnimation("sprite_0.png");
  
  //Loading the bananas
  bananaImage = loadImage("banana.png");

  //Loading the obstacles
  obstacleImage = loadImage("obstacle.png");

}



function setup() {
  createCanvas(400, 400);

  //Creating the monkey sprite
  monkey = createSprite(50, 320);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.1;

  //Creating the ground sprite
  ground = createSprite(200, 355, 800, 10);
  ground.velocityX = -4;

  //Setting initial gameState to PLAY
  gameState = PLAY;
  
  //Declaring groups
  bananaGroup = new Group();
  obstacleGroup = new Group();
  
}


function draw() {
  background("white");
  
  //Printing the current score and banana points
  text("Survival Time: " + score, 150, 20);
  text("Bananas: " + bananaPoints, 300, 20);

  if (gameState === PLAY) {
    //PLAY gameState commands

    //Setting up the seemingly infinite road
    infiniteGround();

    //Making the monkey interactive
    monkeyControls();
    
    //Simulating gravity
    gravity();

    //Preventing the monkey from exiting the canvas
    monkey.collide(ground);
    
    //Score and banana points incrementation system
    scoreCounter();
    bananaCounter();
    
    //Spawning the bananas and obstacles
    spawnBananas();
    spawnObstacles();

    //Setting a game ending sequence
    gameEnd();
    
  } else if (gameState === END){
    //END gameState commands
    
    textSize(20);
    text("Game Over",140,80);
    text("Press R to restart",120,100);
    
    if(keyWentDown("R")){
      //Reset
      reset();
    }
    
  }
  
  drawSprites();
}

function infiniteGround(){
  if (ground.x === 0){

    ground.x = 200;

  }
}

function monkeyControls(){
  if (keyWentDown("SPACE") && monkey.y > 300){

    //Simulating a jump
    monkey.velocityY = -12;

  }
}

function gravity(){
  monkey.velocityY = monkey.velocityY + 0.5;
}

function scoreCounter(){
  if(frameCount % 40 === 0){
      
    score = score + 1;
      
  }
}

function bananaCounter(){
  
  if(bananaGroup.isTouching(monkey)){
    
    //Destroying the banana to hide it and free up memory
    banana.destroy();
    
    //Banana scoring system
    bananaPoints = bananaPoints + 1;
    
  }
  
}

function spawnBananas(){
  //random Y axis for each banana
  randY = random(150,250);
  
  if(frameCount % 150 === 0){
    //Creating the bananas
    banana = createSprite(410,randY);
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -4;
    
    //Adding the bananas to a group for bulk management
    bananaGroup.add(banana);
    
  }
  
}

function spawnObstacles(){
  if(frameCount % 100 === 0){
    //Creating the obstacles
    obstacle = createSprite(410,340);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.1;
    obstacle.setCollider("circle",0,0,180);
    obstacle.velocityX = -4;
    
    //Adding the obstacles to a group for bulk management
    obstacleGroup.add(obstacle);
    
  }
}

function gameEnd(){
  //gameEnding commands
  if(obstacleGroup.isTouching(monkey)){
    //Switching gameState to END
    gameState = END;
    
    //Setting velocityX of all sprites to 0 to mimic a pause
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    monkey.velocityY = 0;
    ground.velocityX = 0;
    
    //Switching animation to a single image to mimic a pause
    monkey.changeAnimation("collided", monkey_collided);
    
  }
}

function reset(){
  //Destroying all current bananas and obstacles to prevent a END loop
  bananaGroup.destroyEach();
  obstacleGroup.destroyEach();
  
  //Setting gameState to PLAY
  gameState = PLAY;
  
  //Initialising score and banana points for a new game
  score = 0;
  bananaPoints = 0;
  
  //Changing the animation to running again
  monkey.changeAnimation("running", monkey_running);
  
}