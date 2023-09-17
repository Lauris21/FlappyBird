import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  // Le pasamos otra clave que será la escena
  constructor(scene, config) {
    super(scene);
    this.config = config;
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#fff" };
    this.screenCenter = [config.width / 2, config.height / 2];
  }

  create() {
    // 1er valor eje x, 2er valor eje y, 3er valor clave imagen
    this.add.image(0, 0, "sky").setOrigin(0);

    //Comprobamos si recibimos la opcion de puedo volver para crear la imagen
    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 10, this.config.height - 10, "back")
        .setOrigin(1)
        .setScale(2)
        .setInteractive();

      backButton.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  createMenu(menu, setupMenuevents) {
    let lastMenuPositionY = 0;
    //Recorremos el menú traido desde MenuBase.js para posicionar el texto de los elementos en la escena
    menu.forEach((item) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      //Si no añademos el setOrigin las letras del menú empezarán en el centro quedando así descuadrado a la derecha
      item.textGO = this.add
        .text(...menuPosition, item.text, this.fontOptions)
        .setOrigin(0.5, 1);

      lastMenuPositionY += this.lineHeight;
      setupMenuevents(item);
    });
  }
}

export default BaseScene;
