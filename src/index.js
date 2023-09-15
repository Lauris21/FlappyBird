import Phaser from "phaser";

const config = {
  //WebGL (web graphics library) API JS para renderizar gráficos en 2 y 3D
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //utiliza la física de arcade -> gestiona simulaciones físicas (gravedad, velocidad, etc)
    default: "arcade",
  },
  //La escena es lo que puede ver en la pantalla
  //Tiene 3 funciones precargar, crear y actualizar
  scene: {
    preload,
    create,
  },
};

//cargando archivos
function preload() {
  //Este contexto es nuestro escenario
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

let bird = null;

function create() {
  // 1er valor eje x
  // 2er valor eje y
  // 3er valor clave imagen
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  // Sprite contiene propiedades con las que jugar
  //Proporcionamos las coordenadas donde se posicionará el objeto
  //3er valor clave del objeto en este caso bird
  bird = this.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);
  console.log(bird);
  debugger;
}

new Phaser.Game(config);
