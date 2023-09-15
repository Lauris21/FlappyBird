import Phaser from "phaser";

const pipesToRender = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.bird = null;
    this.pipes = null;
    // Creamos rango de distancia
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    //Distancia entre tuberías
    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 250;
  }

  //Este contexto es nuestro escenario
  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    // 1er valor eje x, 2er valor eje y, 3er valor clave imagen
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 400;

    // Almacenamos las tuberías y las añadimos
    this.pipes = this.physics.add.group();
    for (let i = 0; i < pipesToRender; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);

    // Proporcionamos el nombre del evento a capturar
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("spacedown_SPACE", this.flap, this);
  }

  update() {
    //si la posicion y del pájaro es menor a 0 o mayor que la altura del lienzo pierdes
    if (
      this.bird.y > this.config.height - this.bird.height ||
      this.bird.y < 0
    ) {
      this.restartBirdPosition();
    }
    // reciclamos las tuberías
    this.recyclePipes();
  }

  placePipe(upPipe, loPipe) {
    // Cogemos la tubería más a la derecha
    const rightMostX = this.getRightMostPipe();
    // Tamaño de distancia y posicion --> método que devuelve valor random entre dos números
    const pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    // la posicion es la última de la derecha + la distancia horizontal random
    upPipe.x = rightMostX + pipeHorizontalDistance;
    upPipe.y = pipeVerticalPosition;

    loPipe.x = upPipe.x;
    loPipe.y = upPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const temPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      //comparamos los límites de la tubería por la derecha y si es afirmativo se recicla
      if (pipe.getBounds().right <= 0) {
        temPipes.push(pipe);
        if (temPipes.length === 2) {
          this.placePipe(...temPipes);
        }
      }
    });
  }

  getRightMostPipe() {
    let rightMostX = 0;
    // Recorremos las tuberías
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  restartBirdPosition() {
    // Aquí debemos llegar a la posición inicial
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.body.velocity.y = 0;
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
}
export default PlayScene;
