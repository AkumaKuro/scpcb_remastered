import { EntityFX, EntityTexture, Float, float, int, PositionEntity, ScaleEntity } from "./Helper/bbhelper"
import { CreateCamera, CameraZoom, CameraClsMode, CameraRange, CameraViewport, CameraProjMode, CameraProjectionMode } from "./Helper/camera"
import { BackBuffer, TextureBuffer } from "./Helper/graphics"
import { CreateMesh, CreateSurface, AddVertex, AddTriangle, MoveEntity } from "./Helper/Mesh"
import { GraphicWidth, GraphicHeight } from "./Main"

export var ark_blur_image: int
export var ark_blur_texture: int
export var ark_sw: int
export var ark_sh: int
export var ark_blur_cam: int

export function CreateBlurImage() {
	//Create blur Camera
	let cam: int = CreateCamera()
	CameraProjMode(cam, CameraProjectionMode.Perspective)
	CameraZoom(cam,0.1)
	CameraClsMode(cam, false, false)
	CameraRange(cam, 0.1, 1.5)
	MoveEntity(cam, 0, 0, 10000)
	ark_blur_cam = cam
	
	ark_sw = GraphicWidth
	ark_sh = GraphicHeight
	CameraViewport(cam,0,0,ark_sw,ark_sh)
	
	//Create sprite
	let spr: int = CreateMesh(cam)
	let sf: int = CreateSurface(spr)
	AddVertex(sf, -1, 1, 0, 0, 0)
	AddVertex(sf, 1, 1, 0, 1, 0)
	AddVertex(sf, -1, -1, 0, 0, 1)
	AddVertex(sf, 1, -1, 0, 1, 1)
	AddTriangle(sf, 0, 1, 2)
	AddTriangle(sf, 3, 2, 1)
	EntityFX(spr, 17)
	ScaleEntity(spr, 2048.0 / Float(ark_sw), 2048.0 / Float(ark_sw), 1)
	PositionEntity(spr, 0, 0, 1.0001)
	EntityOrder(spr, -100000)
	EntityBlend(spr, 1)
	ark_blur_image = spr
	
	//Create blur texture
	ark_blur_texture = CreateTexture(2048, 2048, 256)
	EntityTexture(spr, ark_blur_texture)
}

export function UpdateBlur(power: float) {
	
	EntityAlpha(ark_blur_image, power)
	
	CopyRect(0, 0, GraphicWidth, GraphicHeight, 1024.0 - GraphicWidth/2, 1024.0 - GraphicHeight/2, BackBuffer(), TextureBuffer(ark_blur_texture))
}