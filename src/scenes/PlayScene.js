import Phaser from "phaser";
import BaseScene from "./BaseScene";

const pipesToRender = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    // Le pasamos a la BaseScena : la escena y la configuración
    super("PlayScene", config);
    this.bird = null;
    this.pipes = null;
    this.isPause = false;
    // Creamos rango de distancia
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    //Distancia entre tuberías
    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";

    // Dificultades
    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200],
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190],
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 150],
      },
    };
  }

  create() {
    this.currentDifficulty = "easy";
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();

    this.anims.create({
      key: "fly",
      // generamos números
      frames: this.anims.generateFrameNumbers("bird", { start: 9, end: 15 }),
      //24 fotogramas por segundo --> hará que cada imagen se repita 3 veces en un segundo
      frameRate: 8,
      //Cuantas veces se repetirá la animación -1 = infinito
      repeat: -1,
    });

    // Ejecutamos la animación
    this.bird.play("fly");
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
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);

    // Ajustamos el choque al tamaño del pájaro
    this.bird.setBodySize(this.bird.width, this.bird.height - 8); // Tamaño del pájaro --> 1 ancho 2 alto
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
    this.isPause = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1);

    // Hacemos el botón interactivo
    pauseButton.setInteractive();

    // Configuramos el evento al pulsar raton pausamos el juego
    pauseButton.on("pointerdown", () => {
      this.isPause = false;
      this.physics.pause();
      this.scene.pause();
      //Lanza una escena pero no cierra la actual --> las mantiene en paralelo
      this.scene.launch("PauseScene");
    });
  }

  //Manejamos eventos
  handleInputs() {
    // Proporcionamos el nombre del evento a capturar --> espacio o boton derecho
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("spacedown_SPACE", this.flap, this);
  }

  listenToEvents() {
    // Si ya lo tenemos creado salimos y no la iniciamos
    if (this.pauseEvent) {
      return;
    }
    //Accedemos al evento resume que ejecuta esta escena desde PausaScene
    // 1 nombre evento, 2 callback
    this.pauseEvent = this.events.on("resume", () => {
      // Introducimos cuenta regresiva para el comienzo
      this.initialTime = 3;

      // Añadimos el texto
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          `Fly in: ${this.initialTime}`,
          this.fontOptions
        )
        .setOrigin(0.5);

      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.countDown();
        },
        // Alcance de devolución de llamada será este contexto
        callbackScope: this,
        //Haremos un bucle tres veces y despues de cada segundo se volverá a llamar
        loop: true,
      });
    });
  }

  // Creamos cuenta regresiva
  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Fly in: ${this.initialTime}`);
    if (this.initialTime <= 0) {
      this.isPause = false;
      // Vaciamos el texto, reanudamos la física
      this.countDownText.setText("");
      this.physics.resume();
      // Dejamos de escuchar el evento cronometrado para terminar el bucle
      this.timeEvent.remove();
    }
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
    // LLamaremos a la dificultad con la actual y cambiamos los valores
    const difficulty = this.difficulties[this.currentDifficulty];
    // Cogemos la tubería más a la derecha
    const rightMostX = this.getRightMostPipe();
    // Tamaño de distancia y posicion --> método que devuelve valor random entre dos números
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
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
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 1) {
      this.currentDifficulty = "normal";
    }

    if (this.score === 3) {
      this.currentDifficulty = "hard";
    }
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
    // Comprobaremos si estamos en un estado de pausa para no añadir velocidad
    // Evitamos que al continuar el juego de un saltito hacia arriba
    if (this.isPause) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
export default PlayScene;
