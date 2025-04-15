import useStore from "@/store/store.index";
import {
  ArcRotateCamera,
  Engine,
  Scene,
  Vector3,
  HavokPlugin,
  Observable,
} from "@babylonjs/core";
import Environment from "./Environment";
import AssetManager from "./AssetManager";
import Debugger from "./Debugger";
import HavokPhysics from "@babylonjs/havok";
import Ground from "./Ground";
import DiceManager from "./DiceManager";

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

  diceManager!: DiceManager;

  camera!: ArcRotateCamera;

  resizeObservable = new Observable();

  isInitialized = false;
  async init(canvas: HTMLCanvasElement) {
    try {
      if (this.isInitialized) return;
      this.isInitialized = true;

      this.canvas = canvas;
      this.engine = new Engine(canvas, true);
      this.scene = new Scene(this.engine);

      this.onResize = () => {
        this.engine.resize();
        this.resizeObservable.notifyObservers(undefined);
      };
      window.addEventListener("resize", this.onResize);

      await this.initHavok();

      this.camera = new ArcRotateCamera(
        "main_camera",
        0.6,
        1,
        10,
        new Vector3(0, 1, 0)
      );
      this.camera.attachControl();
      this.camera.minZ = 0.01;
      this.camera.maxZ = 50;

      this.camera.lowerBetaLimit = 0.01;
      this.camera.upperBetaLimit = Math.PI / 2;

      this.camera.angularSensibilityX = 4000;
      this.camera.angularSensibilityY = 4000;
      this.camera.wheelPrecision = 15;

      this.camera.panningSensibility = 500;

      this.camera.lowerRadiusLimit = 1.2;
      this.camera.upperRadiusLimit = 20;

      this.assetManager = new AssetManager(this.scene);
      await this.assetManager.loadAsync();

      new Ground();
      this.diceManager = new DiceManager();

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

  async initHavok() {
    const hk = await HavokPhysics();
    const gravityVector = new Vector3(0, -9.8, 0);
    const physicsPlugin = new HavokPlugin(true, hk);
    this.scene.enablePhysics(gravityVector, physicsPlugin);
  }
  private onResize() {}

  cleanUp() {
    this.engine.stopRenderLoop();
    window.removeEventListener("resize", this.onResize);
    this.engine.dispose();
  }
}
