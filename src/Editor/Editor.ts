import useStore from "@/store/store.index";
import { ArcRotateCamera, Engine, Scene, Vector3 } from "@babylonjs/core";
import Environment from "./Environment";
import AssetManager from "./AssetManager";
import Debugger from "./Debugger";

export default class Editor {
  private static instance: Editor | undefined;

  static GetInstance() {
    if (!this.instance) {
      this.instance = new Editor();
    }
    return this.instance;
  }

  static ClearInstance() {
    useStore.getState().reset();
    this.instance?.cleanUp();
    this.instance = undefined;
  }

  canvas!: HTMLCanvasElement;
  engine!: Engine;
  scene!: Scene;

  environment!: Environment;
  assetManager!: AssetManager;

  camera!: ArcRotateCamera;

  isInitialized = false;
  async init(canvas: HTMLCanvasElement) {
    try {
      if (this.isInitialized) return;
      this.isInitialized = true;

      this.canvas = canvas;
      this.engine = new Engine(canvas, true);
      this.scene = new Scene(this.engine);

      this.camera = new ArcRotateCamera(
        "main_camera",
        0.4,
        0.8,
        20,
        new Vector3(0, 2, 0)
      );
      this.camera.attachControl();

      this.assetManager = new AssetManager(this.scene);
      await this.assetManager.loadAsync();

      this.assetManager.getInstance("basic_ground");

      await this.scene.whenReadyAsync();

      this.environment = new Environment();
      if (process.env.NODE_ENV === "development") {
        const debugLayer = new Debugger();
        await debugLayer.init();
      }

      useStore.getState().loadingOver();

      this.engine.runRenderLoop(() => this.scene.render());
    } catch (error) {
      console.error(error);
    }
  }

  cleanUp() {
    this.engine.stopRenderLoop();
    this.engine.dispose();
  }
}
