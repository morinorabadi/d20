import {
  Mesh,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  Vector3,
} from "@babylonjs/core";
import Editor from "./Editor";

export default class D20 {
    private mesh : Mesh
    constructor() {
    const { assetManager, scene } = Editor.GetInstance();
    this.mesh = assetManager.getMesh("d20").getChildren().at(0) as Mesh;
    this.mesh.position.y = 5;

    const physicsBody = new PhysicsBody(
        this.mesh,
      PhysicsMotionType.DYNAMIC,
      false,
      scene
    );
    physicsBody.shape = new PhysicsShapeConvexHull(this.mesh, scene);

    physicsBody.applyImpulse(
      new Vector3(Math.random() * 1000, 0, Math.random() * 1000),
      new Vector3()
    );
  }

  dispose() {
    this.mesh.dispose()
  }
}
