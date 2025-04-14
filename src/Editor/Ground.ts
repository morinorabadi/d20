import {
  CreateBox,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  Quaternion,
  Vector3,
} from "@babylonjs/core";
import Editor from "./Editor";

export default class Ground {
  constructor() {
    [
      {
        size: new Vector3(20, 2, 20),
        pos: new Vector3(0, -1, 0),
      },
      {
        size: new Vector3(2, 2, 23),
        pos: new Vector3(10.5, 1, 0),
      },
      {
        size: new Vector3(2, 2, 23),
        pos: new Vector3(-10.5, 1, 0),
      },
      {
        size: new Vector3(23, 2, 2),
        pos: new Vector3(0, 1, 10.5),
      },
      {
        size: new Vector3(23, 2, 2),
        pos: new Vector3(0, 1, -10.5),
      },
    ].forEach((info) => this.createBox(info.size, info.pos));
  }

  createBox(size: Vector3, pos: Vector3) {
    const { scene } = Editor.GetInstance();

    const base = CreateBox("base");
    base.scaling.copyFrom(size);
    base.position.copyFrom(pos);

    const basePhysic = new PhysicsBody(
      base,
      PhysicsMotionType.STATIC,
      false,
      scene
    );

    basePhysic.shape = new PhysicsShapeBox(
      Vector3.Zero(),
      Quaternion.Identity(),
      size,
      scene
    );
  }
}
