import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const width = 800;
const height = 600;
const birdPosition = { x: width * 0.1, y: height / 2 };

const sharedConfig = {
  width: width,
  height: height,
  startPosition: birdPosition,
};

//Tienen que ir en orden de ejecución
const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];

// Creamos una nueva escena con la configuracion compartida
const createScene = (Scene) => new Scene(sharedConfig);
//Inicializamos instancias para las escenas
const initScenes = () => Scenes.map(createScene);

const config = {
  //WebGL (web graphics library) API JS para renderizar gráficos en 2 y 3D
  type: Phaser.AUTO,
  ...sharedConfig,
  scale: {
    parent: "game-container",
    mode: Phaser.Scale.FIT, // Escala para ajustar al contenedor
    width: width,
    height: height,
  },
  // Evita que se vean manchas alrededor de elementos
  pixelArt: true,
  physics: {
    //utiliza la física de arcade -> gestiona simulaciones físicas (gravedad, velocidad, etc)
    default: "arcade",
    arcade: {
      // debug: true,  ayuda ver movimientos y a donde va el objeto
    },
  },
  //La escena es lo que puede ver en la pantalla
  //Tiene 3 funciones precargar, crear y actualizar
  scene: initScenes(),
};

new Phaser.Game(config);
