import {
  Mesh,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  Vector3,
} from "@babylonjs/core";
import Game from "./Game";
import normal from "./d20.json";

export default class D20 {
  private mesh: Mesh;
  private positions: { position: Vector3; number: number }[] = [];

  constructor(private onFinish: (score: number) => void) {
    const { assetManager, scene } = Game.GetInstance();
    this.mesh = assetManager.getMesh("d20").getChildren().at(0) as Mesh;
    this.mesh.position.y = 10;

    const physicsBody = new PhysicsBody(
      this.mesh,
      PhysicsMotionType.DYNAMIC,
      false,
      scene
    );
    physicsBody.shape = new PhysicsShapeConvexHull(this.mesh, scene);
    physicsBody.shape.material = { friction : 0.2,restitution : 0.4 }

    physicsBody.applyImpulse(
      new Vector3(this.randomPower(), 0, this.randomPower()),
      this.mesh.getAbsolutePosition()
    );

    physicsBody.applyAngularImpulse(
      new Vector3(this.randomPower(), 0, this.randomPower())
    );

    scene.onAfterPhysicsObservable.add(this.calculateDisplacement.bind(this));

    this.positions = normal.map((a) => {
      return {
        position: new Vector3(a.normal[0], a.normal[2], a.normal[1]),
        number: a.number,
      };
    });
  }
  private randomPower() {
    return Math.random() + 0.5 * (Math.random() > 0.5 ? 1 : -1) * 2000;
  }

  dispose() {
    this.mesh.dispose();
  }

  private lastPos: Vector3 = new Vector3();
  calculateDisplacement() {
    const distance = Vector3.DistanceSquared(this.lastPos, this.mesh.position);
    this.lastPos.copyFrom(this.mesh.position);
    if (distance < 0.0000002) this.calculateNumber();
  }

  isCalculated = false;
  calculateNumber() {
    if (this.isCalculated) return;
    this.isCalculated = true;

    let topFace = 0;
    let maxDot = -Infinity;

    const down = Vector3.Down();

    const rotationMatrix = this.mesh.getWorldMatrix().getRotationMatrix();

    this.positions.forEach((face) => {
      const worldNormal = Vector3.TransformCoordinates(
        face.position,
        rotationMatrix
      );
      worldNormal.normalize();
      const dot = Vector3.Dot(worldNormal, down);

      if (dot > maxDot) {
        maxDot = dot;
        topFace = face.number;
      }
    });

    this.onFinish(topFace);
  }
}
