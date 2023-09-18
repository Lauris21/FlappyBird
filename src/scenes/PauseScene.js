import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    // Al superconstructor BASE le pasaremos la configuración y una propiedad de puede regresar en true
    super("PauseScene", config);
    // Creamos varios elementos
    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
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
      if (menuItem.scene && menuItem.text === "Continue") {
        //Detenemos la escena actual (Pause)
        this.scene.stop();
        //Reanudamos la escena PlayScene
        this.scene.resume(menuItem.scene);
      } else {
        // Detenemos escena actual y la de juego
        this.scene.stop("PlayScene");
        // Lanzamos la escena de menu
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
