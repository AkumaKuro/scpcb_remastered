import { GetINIInt } from "./Converter"
import { ark_blur_cam } from "./Dreamfilter"
import { Chr, Color, DebugLog, EntityFX, EntityTexture, float, Float, Int, int, PositionEntity, range, ScaleEntity, SetFont } from "./Helper/bbhelper"
import { CreateCamera, CameraViewport, CameraZoom, CameraClsMode, CameraRange, CameraProjMode } from "./Helper/camera"
import { TextureBuffer, ReadPixelFast, WritePixelFast, BackBuffer, ColorRed, ColorGreen, ColorBlue, BBText, RenderWorld, ClsColor, SetBuffer, Cls } from "./Helper/graphics"
import { Abs } from "./Helper/math"
import { MoveEntity, CreateMesh, CreateSurface, AddVertex, AddTriangle, EntityAlpha, VertexTexCoords, GetSurface } from "./Helper/Mesh"
import { Len, Asc, Mid, StringHeight } from "./Helper/strings"
import { LockBuffer, ImageBuffer, UnlockBuffer } from "./Helper/textures"
import { OptionFile, GraphicWidth, GraphicHeight, Camera } from "./Main"

export var AATextEnable: int = GetINIInt(OptionFile, "options", "antialiased text")
export var AASelectedFont: int
export var AATextCam: int
export var AATextSprite: int[] = new Array(150)
export var AACharW: int
export var AACharH: int
export var AATextEnable_Prev: int = AATextEnable

export var AACamViewW: int
export var AACamViewH: int

export class AAFont {
	static each: AAFont[]
	texture: int
	backup: int //images don't get erased by clearworld
	
	x: int[] = new Array(128) //not going to bother with unicode
	y: int[] = new Array(128)
	w: int[] = new Array(128)
	h: int[] = new Array(128)
	
	lowResFont: int //for use on other buffers
	
	mW: int
	mH: int
	texH: int
	
	isAA: boolean
}

export function InitAAFont() {
	if (AATextEnable) {
		//Create Camera
		let cam: int = CreateCamera()
		CameraViewport (cam,0,0,10,10)//GraphicWidth,GraphicHeight
		//CameraProjMode cam, 2
		CameraZoom (cam, 0.1)
		CameraClsMode (cam, false, false)
		CameraRange (cam, 0.1, 1.5)
		MoveEntity (cam, 0, 0, -20000)
		AATextCam = cam
		CameraProjMode (cam,0)
	
	    //Create sprite
		let spr: int = CreateMesh(cam)
		let sf: int = CreateSurface(spr)
		AddVertex(sf, -1, 1, 0, 0, 0) //vertex 0// uv:0,0
		AddVertex(sf, 1, 1, 0, 1, 0)  //vertex 1// uv:1,0
		AddVertex(sf, -1, -1, 0, 0, 1)//vertex 2// uv:0,1
		AddVertex(sf, 1, -1, 0, 1, 1) //vertex 3// uv:1,1
		AddTriangle(sf, 0, 1, 2)
		AddTriangle(sf, 3, 2, 1)
		EntityFX(spr, 17+32)
		PositionEntity(spr, 0, 0, 1.0001)
		EntityOrder(spr, -100001)
		EntityBlend(spr, 1)
		AATextSprite[0] = spr
		HideEntity(AATextSprite[0])
		for (let i of range(1, 150)) {
			spr = CopyMesh(AATextSprite[0],cam)
			EntityFX(spr, 17+32)
			PositionEntity(spr, 0, 0, 1.0001)
			EntityOrder(spr, -100001)
			EntityBlend(spr, 1)
			AATextSprite[i] = spr
			HideEntity(AATextSprite[i])
		}
	}
}

export function AASpritePosition(ind: int,x: int,y: int) {
	//THE HORROR
	let nx: float = (((Float(x-(AACamViewW/2))/Float(AACamViewW))*2))
	let ny: float = -(((Float(y-(AACamViewH/2))/Float(AACamViewW))*2))
	
	//how does this work pls help
	nx = nx-((1.0/Float(AACamViewW))*(((AACharW-2) % 2)))+(1.0/Float(AACamViewW))
	ny = ny-((1.0/Float(AACamViewW))*(((AACharH-2) % 2)))+(1.0/Float(AACamViewW))
	
	PositionEntity(AATextSprite[ind],nx,ny,1.0)
}

export function AASpriteScale(ind: int,w: int,h: int) {
	ScaleEntity (AATextSprite[ind],1.0/Float(AACamViewW)*Float(w), 1/Float(AACamViewW)*Float(h), 1)
	AACharW = w
	AACharH = h
}

export function ReloadAAFont() { //CALL ONLY AFTER CLEARWORLD
	if (AATextEnable) {
		InitAAFont()
		for (let font of AAFont.each) {
			if (font.isAA) {
				font.texture = CreateTexture(1024,1024,3)
				LockBuffer(ImageBuffer(font.backup))
				LockBuffer(TextureBuffer(font.texture))
				for (let ix of range(1024)) {
					for (let iy of range(font.texH + 1)) {
						let px = ReadPixelFast(ix,iy,ImageBuffer(font.backup)) << 24
						WritePixelFast(ix,iy,0xFFFFFF+px,TextureBuffer(font.texture))
					}
				}
				UnlockBuffer(TextureBuffer(font.texture))
				UnlockBuffer(ImageBuffer(font.backup))
			}
		}
	}
}

export function AASetFont(fnt: int) {	
	AASelectedFont = fnt
	let font: AAFont = AAFont.each[AASelectedFont]
	if (AATextEnable && font.isAA) {
		for (let i of range(150)) {
			EntityTexture(AATextSprite[i],font.texture)
		}
	}
}

export function AAStringWidth(txt: string): int {
	let font: AAFont = AAFont.each[AASelectedFont]
	if ((AATextEnable) && (font.isAA)) {
		let retVal: int = 0
		for (let i of range(1, Len(txt) + 1)) {
			let char: int = Asc(Mid(txt,i,1))
			if (char>=0 && char<=127) {
				retVal=retVal+font.w[char]-2
			}
		}
		return retVal+2
	} else {
		SetFont (font.lowResFont)
		return StringWidth(txt)
	}
}

export function AAStringHeight(txt: string): int {
	let font: AAFont = AAFont.each[AASelectedFont]
	if ((AATextEnable) && (font.isAA)) {
		return font.mH
	}
	SetFont (font.lowResFont)
	return StringHeight(txt)
}

export function AAText(x: int,y: int,txt: string,cx: boolean=false,cy: boolean = false,a: float = 1.0) {
	if (Len(txt) == 0) {return}
	let font: AAFont = AAFont.each[AASelectedFont]
	
	if ((GraphicsBuffer() != BackBuffer()) || (!AATextEnable) || (!font.isAA)) {
		SetFont (font.lowResFont)
		let oldr: int = ColorRed()
		let oldg: int = ColorGreen()
		let oldb: int = ColorBlue()
		Color(oldr*a,oldg*a,oldb*a)
		BBText(x,y,txt,cx,cy)
		Color(oldr,oldg,oldb)
		return
	}
	
	if (cx) {
		x=x-(AAStringWidth(txt)/2)
	}
	
	if (cy) {
		y=y-(AAStringHeight(txt)/2)
	}
	
	if (Camera != 0) {HideEntity(Camera)}
	if (ark_blur_cam != 0) {HideEntity(ark_blur_cam)}
	
	let tX: int = 0
	CameraProjMode(AATextCam,2)
	
	let char: int
	
	let tw: int = 0
	for (let i of range(1, Len(txt) + 1)) {
		char = Asc(Mid(txt,i,1))
		if (char>=0 && char<=127) {
			tw=tw+font.w[char]
		}
	}
	
	AACamViewW = tw
	AACamViewW = AACamViewW+(AACamViewW % 2)
	AACamViewH = AAStringHeight(txt)
	AACamViewH = AACamViewH+(AACamViewH % 2)
	
	let vx: int = x
	if (vx<0) {vx=0}
	let vy: int = y
	if (vy<0) {vy=0}
	let vw: int = AACamViewW+(x-vx)
	if (vw+vx>GraphicWidth) {vw=GraphicWidth-vx}
	let vh: int = AACamViewH+(y-vy)
	if (vh+vy>GraphicHeight) {vh=GraphicHeight-vy}
	vw = vw-(vw % 2)
	vh = vh-(vh % 2)
	AACamViewH = AACamViewH+(AACamViewH % 2)
	AACamViewW = vw
	AACamViewH = vh
	
	
	CameraViewport (AATextCam,vx,vy,vw,vh)
	for (let i of range(1, Len(txt) + 1)) {
		EntityAlpha (AATextSprite[i-1],a)
		EntityColor (AATextSprite[i-1],ColorRed(),ColorGreen(),ColorBlue())
		ShowEntity( AATextSprite[i-1])
		let char: int = Asc(Mid(txt,i,1))
		if (char>=0 && char<=127) {
			AASpriteScale(i-1,font.w[char],font.h[char])
			AASpritePosition(i-1,tX+(x-vx)+(font.w[char]/2),(y-vy)+(font.h[char]/2))
			VertexTexCoords(GetSurface(AATextSprite[i-1],1),0,Float(font.x[char])/1024.0,Float(font.y[char])/1024.0)
			VertexTexCoords(GetSurface(AATextSprite[i-1],1),1,Float(font.x[char]+font.w[char])/1024.0,Float(font.y[char])/1024.0)
			VertexTexCoords(GetSurface(AATextSprite[i-1],1),2,Float(font.x[char])/1024.0,Float(font.y[char]+font.h[char])/1024.0)
			VertexTexCoords(GetSurface(AATextSprite[i-1],1),3,Float(font.x[char]+font.w[char])/1024.0,Float(font.y[char]+font.h[char])/1024.0)
			tX = tX+font.w[char]-2
		}
	}
	RenderWorld()
	CameraProjMode(AATextCam,0)
	
	for (let i of range(1, Len(txt) + 1)) {
		HideEntity(AATextSprite[i-1])
	}
	
	if (Camera != 0) {
		ShowEntity(Camera)
	}
	if (ark_blur_cam != 0) {
		ShowEntity(ark_blur_cam)
	}
}

export function AALoadFont(file: string="Tahoma", height=13, bold=0, italic=0, underline=0, AATextScaleFactor: int = 2): int {
	let newFont: AAFont = new AAFont()
	
	newFont.lowResFont = LoadFont(file,height,bold,italic,underline)
	
	SetFont (newFont.lowResFont)
	newFont.mW = FontWidth()
	newFont.mH = FontHeight()
	
	if (AATextEnable && AATextScaleFactor>1) {
		let hResFont: int = LoadFont(file,height*AATextScaleFactor,bold,italic,underline)
		let tImage: int = CreateTexture(1024,1024,3)
		let tX: int = 0
		let tY: int = 1
		
		SetFont (hResFont)
		let tCharImage: int = CreateImage(FontWidth()+2*AATextScaleFactor,FontHeight()+2*AATextScaleFactor)
		ClsColor (0,0,0)
		LockBuffer (TextureBuffer(tImage))
		
		let miy: int = newFont.mH*((newFont.mW*95/1024)+2)
		DebugLog (miy)
		
		newFont.mW = 0
		
		for (let ix of range(1024)) {
			for (let iy of range(miy + 1)) {
				WritePixelFast(ix,iy,0xFFFFFF,TextureBuffer(tImage))
			}
		}
		
		for (let i of range(32, 127)) {
			SetBuffer(ImageBuffer(tCharImage))
			Cls()

			Color(255,255,255)
			SetFont(hResFont)
			BBText(AATextScaleFactor/2,AATextScaleFactor/2,Chr(i))
			let tw: int = StringWidth(Chr(i))
			let th: int = FontHeight()
			SetFont(newFont.lowResFont)
			let dsw: int = StringWidth(Chr(i))
			let dsh: int = FontHeight()
			
			let wRatio: float = Float(tw)/Float(dsw)
			let hRatio: float = Float(th)/Float(dsh)
			
			SetBuffer(BackBuffer())
				
			LockBuffer(ImageBuffer(tCharImage))
			
			for (let iy of range(dsh)) {
				for (let ix of range(dsw)) {
					let rsx: int = Int(Float(ix)*wRatio-(wRatio*0.0))
					if ((rsx<0)) {rsx=0}
					let rsy: int = Int(Float(iy)*hRatio-(hRatio*0.0))
					if ((rsy<0)) {rsy=0}
					let rdx: int = Int(Float(ix)*wRatio+(wRatio*1.0))
					if ((rdx>tw)) {rdx=tw-1}
					let rdy: int = Int(Float(iy)*hRatio+(hRatio*1.0))
					if ((rdy>th)) {rdy=th-1}
					let ar: int = 0
					if (Abs(rsx-rdx)*Abs(rsy-rdy)>0) {
						for (let iiy of range(rsy, rdy)) {
							for (let iix of range(rsx, rdx)) {
								ar=ar+((ReadPixelFast(iix,iiy,ImageBuffer(tCharImage)) && 0xFF))
							}
						}
						ar = ar/(Abs(rsx-rdx)*Abs(rsy-rdy))
						if (ar>255) {
							ar=255
						}
						ar = ((Float(ar)/255.0)^(0.5))*255
					}
					WritePixelFast(ix+tX,iy+tY,0xFFFFFF+(ar << 24),TextureBuffer(tImage))
				}
			}
			
			UnlockBuffer(ImageBuffer(tCharImage))
	
			newFont.x[i]=tX
			newFont.y[i]=tY
			newFont.w[i]=dsw+2
			
			if (newFont.mW<newFont.w[i]-3) {newFont.mW=newFont.w[i]-3}
			
			newFont.h[i]=dsh+2
			tX=tX+newFont.w[i]+2
			if (tX>1024-FontWidth()-4) {
				tX=0
				tY=tY+FontHeight()+6
			}
		}
		
		newFont.texH = miy
		
		let backup: int = CreateImage(1024,1024)
		LockBuffer(ImageBuffer(backup))
		for (let ix of range(1024)) {
			for (let iy of range(newFont.texH + 1)) {
				let px = ReadPixelFast(ix,iy,TextureBuffer(tImage)) >> 24
				px += (px << 8) + (px << 16)
				WritePixelFast(ix,iy,0xFF000000+px,ImageBuffer(backup))
			}
		}
		UnlockBuffer(ImageBuffer(backup))
		newFont.backup = backup
		
		UnlockBuffer(TextureBuffer(tImage))
		
		
		FreeImage(tCharImage)
		FreeFont(hResFont)
		newFont.texture = tImage
		newFont.isAA = true
	} else {
		newFont.isAA = false
	}
	return Handle(newFont)
}