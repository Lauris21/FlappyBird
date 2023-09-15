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
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInputs();
  }

  update() {
    // Cheuqeamos si choca arriba o abajo de la escena
    this.checkGameStatus();
    // reciclamos las tuberías
    this.recyclePipes();
  }

  // Creamos fondo, pájaro y tuberías
  createBG() {
    // 1er valor eje x, 2er valor eje y, 3er valor clave imagen
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 400;
    // choque con la cima y el final de las columnas
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    // Almacenamos las tuberías y las añadimos
    this.pipes = this.physics.add.group();
    for (let i = 0; i < pipesToRender; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }

  // Creamos las colisiones del pájaro con tuberías
  createColliders() {
    // Cuando chocamos reiniciamos el juego
    //añadimos devolución de llamada en null y el contexto con this
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  //Manejamos eventos
  handleInputs() {
    // Proporcionamos el nombre del evento a capturar
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("spacedown_SPACE", this.flap, this);
  }

  checkGameStatus() {
    //si la posicion y del pájaro es menor a 0 o mayor que la altura del lienzo pierdes
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
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
    // Recorremos las tuberías y obtenemos la que esta posicionada más a la derecha
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  //Pausamos la gravedad y cambiamos de color el pájaro
  gameOver() {
    // Aquí debemos llegar a la posición inicial
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
    this.physics.pause();
    this.bird.setTint(0xee4824);
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
}
export default PlayScene;
