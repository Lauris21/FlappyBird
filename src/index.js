import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const width = 800;
const height = 600;
const birdPosition = { w: width * 0.1, y: height / 2 };

const sharedConfig = {
  width: width,
  height: height,
  startPosition: birdPosition,
};
const config = {
  //WebGL (web graphics library) API JS para renderizar gráficos en 2 y 3D
  type: Phaser.AUTO,
  ...sharedConfig,
  physics: {
    //utiliza la física de arcade -> gestiona simulaciones físicas (gravedad, velocidad, etc)
    default: "arcade",
    arcade: {
      debug: true, // ayuda ver movimientos y a donde va el objeto
    },
  },
  //La escena es lo que puede ver en la pantalla
  //Tiene 3 funciones precargar, crear y actualizar
  scene: [new PlayScene(sharedConfig)],
};

new Phaser.Game(config);
