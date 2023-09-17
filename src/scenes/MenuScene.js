import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);

    // Creamos varios elementos
    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      //No irá a ninguna escena
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();

    //con .bind(this) le pasamos la escena this
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    // Recogemos el texto
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    //Cuando ratón pasa
    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    //Cuando ratón sale
    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    // Cuando clicamos
    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
