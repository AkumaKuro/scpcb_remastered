import { float, int, Float, PositionEntity, EntityTexture, EntityFX } from "./Helper/bbhelper.ts"
import { CreateCamera, CameraRange, CameraZoom, CameraProjMode, CameraViewport } from "./Helper/camera.ts"
import { SetBuffer, TextureBuffer, BackBuffer, Cls, RenderWorld } from "./Helper/graphics.ts"
import { RotateEntity, ScaleMesh, FreeEntity, FlipMesh } from "./Helper/Mesh.ts"
import { FreeTexture, PositionTexture, ScaleTexture, TextureBlend } from "./Helper/textures.ts"
import { GraphicWidth, GraphicHeight } from "./Main.ts"

class DrawPortal {
	
	w: float
	h: float
	
	
	cam: int
	portal: int
	
	camZoom: float
	campitch: float
	camyaw: float
	camroll: float
	tex: int
	texw: int
	texh: int
	id: int
	static each: DrawPortal[] = []
}

export function CreateDrawPortal(x: float,y: float,z: float,pitch: float,yaw: float,roll: float,w: float,h: float,camx: float=0.0,camy: float=0.0,camz: float=0.0,campitch: float=0.0,camyaw: float=0.0,camroll: float=0.0,camZoom: float=1.0,texw: int=2048,texh: int=2048): DrawPortal {
	let ndp: DrawPortal = new DrawPortal()
	
	ndp.w = w
	ndp.h = h
	
	ndp.tex = CreateTexture(texw,texh,1+8+256+FE_RENDER+FE_ZRENDER) //make a texture we can render to
	TextureBlend (ndp.tex, FE_PROJECT)
	PositionTexture (ndp.tex,0.5,0.5)
	ScaleTexture (ndp.tex,(Float(texw)/Float(GraphicWidth))*2,(Float(texh)/Float(GraphicHeight))*2)
	//RotateTexture ndp.tex,180
	ndp.texw = texw
	ndp.texh = texh
	ndp.cam = CreateCamera() //create a camera to enable rendering
	CameraRange (ndp.cam,0.5,20.0)
	PositionEntity (ndp.cam,camx,camy,camz,true)
	RotateEntity (ndp.cam,campitch,camyaw,camroll,true)
	CameraZoom (ndp.cam,camZoom)
	
	ndp.campitch = campitch
	ndp.camyaw   = camyaw
	ndp.camroll  = camroll
	
	ndp.camZoom  = camZoom
	
	ndp.portal = CreateCube() //you can replace the cube with anything you like
	ScaleMesh (ndp.portal,w/2.0,h/2.0,d/2.0)
	FlipMesh (ndp.portal)
	//ndp.surface = GetSurface(ndp.portal,1)
	EntityTexture (ndp.portal,ndp.tex)
	
	EntityFX (ndp.portal,1)
	PositionEntity (ndp.portal,x,y,z,true)
	RotateEntity (ndp.portal,pitch,yaw,roll,true)
	
	CameraProjMode(ndp.cam,0) //prevent the camera from causing problems with the BackBuffer
	
	ndp.id = 0
	
	let temp: int = 0
	for (let c of DrawPortal.each) {
	//	temp=temp+1
		temp = Max(c.id,temp)
	}
	ndp.id = temp+1
	
	return ndp
}

export function DestroyDrawPortal(ndp: DrawPortal) {
	if (ndp.tex != 0) {FreeTexture (ndp.tex)}
	ndp.tex = 0
	ndp.texw = 0
	ndp.texh = 0
	if (ndp.cam != 0) {FreeEntity (ndp.cam)}
	ndp.cam = 0
	if (ndp.portal != 0) {FreeEntity (ndp.portal)}
	ndp.portal = 0
	Delete(ndp)
}

export function UpdateDrawPortal(ndp: DrawPortal) {
	RotateEntity (ndp.cam,ndp.campitch,ndp.camyaw,ndp.camroll,true)
	CameraZoom (ndp.cam,ndp.camZoom)
	
	CameraProjMode (ndp.cam,1) //enable the camera
	
	SetBuffer(TextureBuffer(ndp.tex))
	CameraViewport (ndp.cam,(ndp.texw/2)-(GraphicWidth/2),(ndp.texh/2)-(GraphicHeight/2),GraphicWidth,GraphicHeight)
	Cls()
	RenderWorld() //requires FastExt to render to texture
	
	CameraProjMode (ndp.cam,0) //disable the camera
	
	SetBuffer(BackBuffer())
}