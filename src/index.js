import Phaser from "phaser";

const config = {
  //WebGL (web graphics library) API JS para renderizar gráficos en 2 y 3D
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //utiliza la física de arcade -> gestiona simulaciones físicas (gravedad, velocidad, etc)
    default: "arcade",
    arcade: {
      debug: true, // ayuda ver movimientos y a donde va el objeto
    },
  },
  //La escena es lo que puede ver en la pantalla
  //Tiene 3 funciones precargar, crear y actualizar
  scene: {
    preload,
    create,
    update,
  },
};

const velocity = 200;

let bird = null;
// Asignamos velocidad de vuelo
const flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };

//Asignamos una tuberia
let upperPipe = null;
let lowerPipe = null;

// Creamos rango de distancia
const pipeVerticalDistanceRange = [150, 250];
// Tamaño de distancia --> método que devuelve valor random entre dos números
let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);

// Asignamos tiempos Delta
let totalDelta = null;

//cargando archivos
function preload() {
  //Este contexto es nuestro escenario
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  // 1er valor eje x
  // 2er valor eje y
  // 3er valor clave imagen
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 400;

  upperPipe = this.physics.add.sprite(400, 100, "pipe").setOrigin(0, 1);
  lowerPipe = this.physics.add
    .sprite(400, upperPipe.y + pipeVerticalDistance, "pipe")
    .setOrigin(0, 0);

  // Proporcionamos el nombre del evento a capturar
  this.input.on("pointerdown", flap);
  this.input.keyboard.on("spacedown_SPACE", flap);
}

// tiempo 0s -> velocidad 0px/s
// tiempo 1s --> velocidad 200px/s
// tiempo 2s --> velocidad 400px/s
// tiempo 3s --> velocidad 600px/s

//si la posicion y del pájaro es menor a 0 o mayor que la altura del lienzo pierdes
function update(time, delta) {
  if (bird.y > config.height - bird.height || bird.y < 0) {
    restartPlayerPosition();
  }
}

function restartPlayerPosition() {
  // Aquí debemos llegar a la posición inicial
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);
