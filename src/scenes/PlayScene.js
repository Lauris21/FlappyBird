import Phaser from "phaser";
import BaseScene from "./BaseScene";

const pipesToRender = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    // Le pasamos a la BaseScena : la escena y la configuración
    super("PlayScene", config);
    this.bird = null;
    this.pipes = null;
    // Creamos rango de distancia
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    //Distancia entre tuberías
    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";
  }

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
  }

  update() {
    // Cheuqeamos si choca arriba o abajo de la escena
    this.checkGameStatus();
    // reciclamos las tuberías
    this.recyclePipes();
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 600;
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

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    // scoreText será lo que se renderice, podemos añadir diferentes propiedades
    // 1er posición X, 2 posición Y, 3 texto, 4 propiedades texto
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });
    // creamos la mejor puntuación
    this.add.text(16, 52, `Score: ${bestScore || 0}`, {
      fontSize: "18px",
      fill: "#000",
    });
  }

  createPause() {
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1);

    // Hacemos el botón interactivo
    pauseButton.setInteractive();

    // Configuramos el evento al pulsar raton pausamos el juego
    pauseButton.on("pointerdown", () => {
      this.physics.pause();
      this.scene.pause();
    });
  }

  //Manejamos eventos
  handleInputs() {
    // Proporcionamos el nombre del evento a capturar --> espacio o boton derecho
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("spacedown_SPACE", this.flap, this);
  }

  checkGameStatus() {
    //si la posicion abajo del pájaro es mayor que la altura del lienzo pierdes o menor que 0
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
          this.increaseScore();
          this.setBestScore();
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

  // Almacenamos la mejor puntuación
  setBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    // Lo transformamos a sistema decimal
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    // Comprobamos si no tenemos mejor puntuación o
    // si esta puntuación es mayor que la mejor puntuación para guardarla en el localStorage
    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  //Pausamos la gravedad y cambiamos de color el pájaro
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);
    // retrasamos la función añadiendo un delay en el contexto

    this.setBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // accdemeos a la escena y reiniciamos, esto se ejecutará después de un segundo
        // al reinicair la función de creación se ejecuta
        this.scene.restart();
      },
      // no queremos llamarlo todo despues de un segundo
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
export default PlayScene;
