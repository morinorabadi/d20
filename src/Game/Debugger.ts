import type { Inspector } from "@babylonjs/inspector";
import Game from "./Game";

export default class Debugger {
  private Inspector!: typeof Inspector;

  async init() {
    const { Inspector } = await import("@babylonjs/inspector");
    this.Inspector = Inspector;
    Game.GetInstance().engine.onDisposeObservable.add(
      this.cleanup.bind(this)
    );
    window.addEventListener("keydown", this.onKeydown.bind(this));
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "i") {
      this.toggleInspector();
    }
  }

  private toggleInspector() {
    if (this.Inspector.IsVisible) {
      this.Inspector.Hide();
    } else {
      this.Inspector.Show(Game.GetInstance().scene, { embedMode: true });
    }
  }

  private cleanup() {
    window.removeEventListener("keydown", this.onKeydown.bind(this));
  }
}
