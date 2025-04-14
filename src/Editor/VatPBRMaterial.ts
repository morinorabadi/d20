import { PBRCustomMaterial } from "@babylonjs/materials/custom/pbrCustomMaterial";
import Editor from "./Editor";

export default class VatPBRMaterial extends PBRCustomMaterial{
    constructor(name : string){
        const { scene } = Editor.GetInstance()

        super(name)

        // this. _uniformBuffer.setTexture()

        this.Vertex_Definitions(`
            attribute float indexX;

            attribute vec2 minMaxX;
            attribute vec2 minMaxY;
            attribute vec2 minMaxZ;

            attribute vec2 minMaxNX;
            attribute vec2 minMaxNY;
            attribute vec2 minMaxNZ;

            uniform sampler2D posTex;
            uniform sampler2D norTex;
        `)
        
        this.Vertex_Before_PositionUpdated(`
            vec4 texturePos = texture2D(posTex,vec2(indexX, 1.0 - frame));

            float posX = texturePos.x * (minMaxX.y - minMaxX.x) + minMaxX.x;
            float posY = texturePos.y * (minMaxY.y - minMaxY.x) + minMaxY.x;
            float posZ = texturePos.z * (minMaxZ.y - minMaxZ.x) + minMaxZ.x;

            positionUpdated = vec3(posX,posY,posZ);
        `)

        this.Vertex_Before_NormalUpdated(`
            vec4 textureNor = texture2D(norTex,vec2(indexX, 1.0 - frame));

            float norX = textureNor.x * (minMaxNX.y - minMaxNX.x) + minMaxNX.x;
            float norY = textureNor.y * (minMaxNY.y - minMaxNY.x) + minMaxNY.x;
            float norZ = textureNor.z * (minMaxNZ.y - minMaxNZ.x) + minMaxNZ.x;

            normalUpdated = vec3(norX,norY,norZ);
        `)
        
    }}