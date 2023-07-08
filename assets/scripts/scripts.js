const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite ({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/images/background.png'
});

const shop = new Sprite ({
  position: {
    x: 600,
    y: 130
  },
  imageSrc: './assets/images/shop.png',
  scale: 2.75,
  maxFrame: 6
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './assets/images/player1/Idle.png',
  maxFrame: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 156
  },
  sprites: {
    idle: {
      imageSrc: './assets/images/player1/Idle.png',
      maxFrame: 8
    },
    run: {
      imageSrc: './assets/images/player1/Run.png',
      maxFrame: 8
    },
    jump: {
      imageSrc: './assets/images/player1/Jump.png',
      maxFrame: 2
    },
    fall: {
      imageSrc: './assets/images/player1/Fall.png',
      maxFrame: 2
    },
    attack1: {
      imageSrc: './assets/images/player1/Attack1.png',
      maxFrame: 6
    },
    takeHit: {
      imageSrc: './assets/images/player1/Take hit.png',
      maxFrame: 4
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 150,
    height: 50
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './assets/images/player2/Idle.png',
  maxFrame: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 169
  },
  sprites: {
    idle: {
      imageSrc: './assets/images/player2/Idle.png',
      maxFrame: 4
    },
    run: {
      imageSrc: './assets/images/player2/Run.png',
      maxFrame: 8
    },
    jump: {
      imageSrc: './assets/images/player2/Jump.png',
      maxFrame: 2
    },
    fall: {
      imageSrc: './assets/images/player2/Fall.png',
      maxFrame: 2
    },
    attack1: {
      imageSrc: './assets/images/player2/Attack1.png',
      maxFrame: 4
    },
    takeHit: {
      imageSrc: './assets/images/player2/Take hit.png',
      maxFrame: 3
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
  
});


const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.image = player.sprites.run.image;
  } else {
    player.switchSprite('idle');
  };

  // player jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  };

  // enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // player1 hits player 2
  if (collisionDetection({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && 
      player.currentFrame === 4 ) {
    enemy.takeHit();
    player.isAttacking = false;
    
    document.querySelector('#enemyHealth').style.width = enemy.health + "%";
  };
  // player1 misses 
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  // player2 hits player1
  if (collisionDetection({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && 
      enemy.currentFrame === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    
    document.querySelector('#playerHealth').style.width = player.health + "%";
  };
  // player2 misses 
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  

  

  // end game basd on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }

};
animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});