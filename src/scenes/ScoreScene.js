import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    // Al superconstructor BASE le pasaremos la configuración y una propiedad de puede regresar en true
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();

    const bestScore = localStorage.getItem("bestScore");
    // Añadios la puntuación
    this.add
      .text(
        ...this.screenCenter,
        `Best Score: ${bestScore || 0}`,
        this.fontOptions
      )
      .setOrigin(0.5);
  }
}

export default ScoreScene;
