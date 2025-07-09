
class Materials {
	name: string
	Diff
	Bump
	
	StepSound: int
	static each: Materials[] = []
}

function LoadMaterials(file: string) {
	CatchErrors("Uncaught (LoadMaterials)")
	
	let TemporaryString: string
	let mat: Materials
	let StrTemp: string = ""
	
	let f = OpenFile(file)
	
	while (!Eof(f)) {
		TemporaryString = Trim(ReadLine(f))
		if (Left(TemporaryString,1) == "[") {
			TemporaryString = Mid(TemporaryString, 2, Len(TemporaryString) - 2)
			
			let mat: Materials = new Materials()
			
			mat.name = Lower(TemporaryString)
			
			if (BumpEnabled) {
				StrTemp = GetINIString(file, TemporaryString, "bump")
				if (StrTemp != "") { 
					mat.Bump =  LoadTexture_Strict(StrTemp)
					
					TextureBlend (mat.Bump, TextureBlendMode.NoBlendOrAlpha) //TODO mode 6?
					TextureBumpEnvMat(mat.Bump,0,0,-0.012)
					TextureBumpEnvMat(mat.Bump,0,1,-0.012)
					TextureBumpEnvMat(mat.Bump,1,0,0.012)
					TextureBumpEnvMat(mat.Bump,1,1,0.012)
					TextureBumpEnvOffset(mat.Bump,0.5)
					TextureBumpEnvScale (mat.Bump,1.0)
				}
			}
			
			mat.StepSound = (GetINIInt(file, TemporaryString, "stepsound")+1)
		}
	}
	
	CloseFile (f)
	
	CatchErrors("LoadMaterials")
}

function LoadWorld(file: string, rt: RoomTemplates) {
	let map=LoadAnimMesh_Strict(file)
	if (!map) {return}
	
	let x: float,y: float,z: float,i: int,c: int
	let mat: Materials
	
	let world=CreatePivot()
	let meshes=CreatePivot(world)
	let renderbrushes=CreateMesh(world)
	let collisionbrushes=CreatePivot(world)
	EntityType (collisionbrushes,HIT_MAP)
	
	for (c of range(1, CountChildren(map) + 1)) {
		
		let node=GetChild(map,c)	
		let classname: string = Lower(KeyValue(node,"classname"))
		
		switch (classname) {
				
			//===============================================================================
			//Map Geometry
			//===============================================================================
				
			case "mesh":
				EntityParent (node,meshes)
				
				if (KeyValue(node,"disablecollisions") != 1) {
					EntityType (node,HIT_MAP)
					EntityPickMode (node, 2)
				}
				
				c=c-1
				
			case "brush":
				RotateMesh (node,EntityPitch(node),EntityYaw(node),EntityRoll(node))
				PositionMesh (node,EntityX(node),EntityY(node),EntityZ(node))
				
				AddMesh (node,renderbrushes	)
				
				EntityAlpha (node,0)
				EntityType (node,HIT_MAP)
				EntityAlpha (node,0)
				EntityParent (node,collisionbrushes)
				EntityPickMode (node, 2)
				
				c=c-1
				
			//===============================================================================
			//Solid Entities
			//===============================================================================
			case "item":
				// nothing?
			case "screen":
				
				x = EntityX(node)*RoomScale
				y = EntityY(node)*RoomScale
				z = EntityZ(node)*RoomScale
				
				if (x != 0 || y != 0 || z != 0) {
					let ts: TempScreens = new TempScreens()
					ts.x = x
					ts.y = y
					ts.z = z
					ts.imgpath = KeyValue(node,"imgpath","")
					ts.roomtemplate = rt
				}
				
			case "waypoint":
				x = EntityX(node)*RoomScale
				y = EntityY(node)*RoomScale
				z = EntityZ(node)*RoomScale				
				let w: TempWayPoints = new TempWayPoints()
				w.roomtemplate = rt
				w.x = x
				w.y = y
				w.z = z
				
			case "light":
				x = EntityX(node)*RoomScale
				y = EntityY(node)*RoomScale
				z = EntityZ(node)*RoomScale
				
				if (x != 0 || y != 0 || z != 0) {
					let trange = Float(KeyValue(node,"range","1"))/2000.0
					let lcolor = KeyValue(node,"color","255 255 255")
					let intensity = Min(Float(KeyValue(node,"intensity","1.0"))*0.8,1.0)
					let r=Int(Piece(lcolor,1," "))*intensity
					let g=Int(Piece(lcolor,2," "))*intensity
					let b=Int(Piece(lcolor,3," "))*intensity
					
					AddTempLight(rt, x,y,z, 2, trange, r,g,b)
				}
			case "spotlight":
				x = EntityX(node)*RoomScale
				y = EntityY(node)*RoomScale
				z = EntityZ(node)*RoomScale
				if (x != 0 || y != 0 || z != 0) {
					let trange = Float(KeyValue(node,"range","1"))/700.0
					let lcolor = KeyValue(node,"color","255 255 255")
					let intensity = Min(Float(KeyValue(node,"intensity","1.0"))*0.8,1.0)
					let r = Int(Piece(lcolor,1," "))*intensity
					let g = Int(Piece(lcolor,2," "))*intensity
					let b = Int(Piece(lcolor,3," "))*intensity
					
					let lt: LightTemplates = AddTempLight(rt, x,y,z, 3, trange, r,g,b)
					let angles = KeyValue(node,"angles","0 0 0")
					let pitch = Piece(angles,1," ")
					let yaw = Piece(angles,2," ")
					lt.pitch = pitch
					lt.yaw = yaw
					
					lt.innerconeangle = Int(KeyValue(node,"innerconeangle",""))
					lt.outerconeangle = Int(KeyValue(node,"outerconeangle",""))	
				}
			case "soundemitter":
				for (i of range(4)) {
					if (rt.TempSoundEmitter[i] == 0) {
						rt.TempSoundEmitterX[i]=EntityX(node)*RoomScale
						rt.TempSoundEmitterY[i]=EntityY(node)*RoomScale
						rt.TempSoundEmitterZ[i]=EntityZ(node)*RoomScale
						rt.TempSoundEmitter[i]=Int(KeyValue(node,"sound","0"))
						
						rt.TempSoundEmitterRange[i]=Float(KeyValue(node,"range","1"))
						Exit()
					}
				}
				
			//Invisible collision brush
			case "field_hit":
				EntityParent (node,collisionbrushes)
				EntityType (node,HIT_MAP)
				EntityAlpha (node,0)
				c=c-1
				
			//===============================================================================
			//Point Entities
			//===============================================================================
				
			//Camera start position point entity
			case "playerstart":
				let angles = KeyValue(node,"angles","0 0 0")
				let pitch = Piece(angles,1," ")
				let yaw = Piece(angles,2," ")
				let roll = Piece(angles,3," ")
				if (cam) {
					PositionEntity (cam,EntityX(node),EntityY(node),EntityZ(node))
					RotateEntity (cam,pitch,yaw,roll)
				}
				
		}
	}
	
	EntityFX (renderbrushes, 1)
	
	FreeEntity (map)
	
	return world	
	
	
}

//RMESH STUFF////////

export function StripFilename(file: string): string {
	let mi: string = ""
	let lastSlash: int=0
	if (Len(file)>0) {
		for (let i of range(1, Len(file) + 1)) {
			mi=Mid(file,i,1)
			if (mi == "\\" || mi == "/") {
				lastSlash=i
			}
		}
	}
	
	return Left(file,lastSlash)
}

export function GetTextureFromCache(name: string): int {
	for (let tc of Materials.each) {
		if (tc.name == name) {return tc.Diff}
	}
	return 0
}

export function GetBumpFromCache(name: string): int {
	for (let tc of Materials.each) {
		if (tc.name == name) {return tc.Bump}
	}
	return 0
}

export function GetCache(name: string): Materials | null {
	for (let tc of Materials.each) {
		if (tc.name == name) {return tc}
}
	return null
}

export function AddTextureToCache(texture: int) {
	let tc: Materials = GetCache(StripPath(TextureName(texture)))
	if (!tc) {
		tc = new Materials()
		tc.name=StripPath(TextureName(texture))
		if (BumpEnabled) {
			let temp: string = GetINIString("Data/materials.ini",tc.name,"bump")
			if (temp != "") {
				tc.Bump=LoadTexture_Strict(temp)
				TextureBlend (tc.Bump,6)
				TextureBumpEnvMat (tc.Bump,0,0,-0.012)
				TextureBumpEnvMat (tc.Bump,0,1,-0.012)
				TextureBumpEnvMat (tc.Bump,1,0,0.012)
				TextureBumpEnvMat (tc.Bump,1,1,0.012)
				TextureBumpEnvOffset (tc.Bump,0.5)
				TextureBumpEnvScale (tc.Bump,1.0)
			} else {
				tc.Bump=0
			}
		}
		tc.Diff=0
	}
	if (tc.Diff == 0) {
		tc.Diff=texture
	}
}

export function ClearTextureCache() {
	for (let tc of Materials.each) {
		if (tc.Diff != 0) {
			FreeTexture(tc.Diff)
		}
		if (tc.Bump != 0) {
			FreeTexture(tc.Bump)
		}
		Delete (tc)
	}
}

export function FreeTextureCache() {
	for (let tc of Materials.each) {
		if (tc.Diff != 0) {
			FreeTexture (tc.Diff)
		}
		if (tc.Bump != 0) {
			FreeTexture (tc.Bump)
		}
		tc.Diff = 0
		tc.Bump = 0
	}
}

export function LoadRMesh(file: string,rt: RoomTemplates) {
	CatchErrors("Uncaught (LoadRMesh)")
	//generate a texture made of white
	let blankTexture: int
	blankTexture=CreateTexture(4,4,TextureFlags.Color,1)
	ClsColor (255,255,255)
	SetBuffer (TextureBuffer(blankTexture))
	Cls()
	SetBuffer (BackBuffer())
	
	let pinkTexture: int
	pinkTexture=CreateTexture(4,4,TextureFlags.Color,1)
	ClsColor (255,255,255)
	SetBuffer (TextureBuffer(pinkTexture))
	Cls()
	SetBuffer (BackBuffer())
	
	ClsColor (0,0,0)
	
	//read the file
	let f: int=ReadFile(file)
	let i: int
	let j: int
	let k: int
	let x: float
	let y: float
	let z: float
	let yaw: float
	let vertex: int
	let temp1i: int
	let temp2i: int
	let temp3i: int
	let temp1: float
	let temp2: float
	let temp3: float
	let temp1s: string
	let temp2s: string
	
	let collisionMeshes: int = CreatePivot()
	
	let hasTriggerBox: boolean = false
	
	for (i of range(4)) { //reattempt up to 3 times
		if (f == 0) {
			f=ReadFile(file)
		} else {
			break
		}
	}
	if (f == 0) {
		RuntimeError ("Error reading file "+Chr(34)+file+Chr(34))
	}
	let isRMesh: string = ReadString(f)
	if (isRMesh == "RoomMesh") {
		
	} else if (isRMesh == "RoomMesh.HasTriggerBox") {
		hasTriggerBox = true
	} else {
		RuntimeError (Chr(34)+file+Chr(34)+" is !RMESH ("+isRMesh+")")
	}
	
	file=StripFilename(file)
	
	let count: int
	let count2: int
	
	//drawn meshes
	let Opaque: int
	let Alpha: int
	
	Opaque=CreateMesh()
	Alpha=CreateMesh()
	
	count = ReadInt(f)
	let childMesh: int
	let surf: int
	let tex: int[] = new Array(2)
	let brush: int
	
	let isAlpha: int
	
	let u: float
	let v: float
	
	for (i of range(1, count + 1)) { //drawn mesh
		childMesh=CreateMesh()
		
		surf=CreateSurface(childMesh)
		
		brush=CreateBrush()
		
		tex[0]=0
		tex[1]=0
		
		isAlpha=0
		for (j of range(2)) {
			temp1i=ReadByte(f)
			if (temp1i != 0) {
				temp1s=ReadString(f)
				tex[j]=GetTextureFromCache(temp1s)
				if (tex[j]=0) { //texture is not in cache
					switch (true) {
						case temp1i<3:
							tex[j]=LoadTexture(file+temp1s,1)
						default:
							tex[j]=LoadTexture(file+temp1s,3)
					}
					
					if (tex[j] != 0) {
						if (temp1i=1) {TextureBlend (tex[j],5)}
						if (Instr(Lower(temp1s),"_lm") != 0) {
							TextureBlend (tex[j],3)
						}
						AddTextureToCache(tex[j])
					}
					
				}
				if (tex[j] != 0) {
					isAlpha=2
					if (temp1i == 3) {
						isAlpha=1
					}
					
					TextureCoords (tex[j],1-j)
				}
			}
		}
		
		if (isAlpha == 1) {
			if (tex[1] != 0) {
				TextureBlend (tex[1],2)
				BrushTexture (brush,tex[1],0,0)
			} else {
				BrushTexture (brush,blankTexture,0,0)
			}
		} else {
			if (tex[0] != 0 && tex[1] != 0) {
				let bumptex = GetBumpFromCache(StripPath(TextureName(tex[1])))
				for (j of range(2)) {
					BrushTexture (brush,tex[j],0,j+1+Int(bumptex != 0))
				}
				
				BrushTexture (brush,AmbientLightRoomTex,0)
				if (bumptex != 0) {
					BrushTexture (brush,bumptex,0,1)
				}
			} else {
				for (j of range(2)) {
					if (tex[j] != 0) {
						BrushTexture (brush,tex[j],0,j)
					} else {
						BrushTexture (brush,blankTexture,0,j)
					}
				}
			}
		}
		
		surf=CreateSurface(childMesh)
		
		if (isAlpha>0) {PaintSurface (surf,brush)}
		
		FreeBrush (brush)
		brush = 0
		
		count2=ReadInt(f) //vertices
		
		for (j of range(1, count2 + 1)) {
			//world coords
			x=ReadFloat(f)
			y=ReadFloat(f)
			z=ReadFloat(f)
			let vertex=AddVertex(surf,x,y,z)
			
			//texture coords
			for (k of range(2)) {
				u=ReadFloat(f)
				v=ReadFloat(f)
				VertexTexCoords (surf,vertex,u,v,0.0,k)
			}
			
			//colors
			let temp1i=ReadByte(f)
			let temp2i=ReadByte(f)
			let temp3i=ReadByte(f)
			VertexColor (surf,vertex,temp1i,temp2i,temp3i,1.0)
		}
		
		count2=ReadInt(f) //polys
		for (j of range(1, count2 + 1)) {
			temp1i = ReadInt(f)
			temp2i = ReadInt(f)
			temp3i = ReadInt(f)
			AddTriangle(surf,temp1i,temp2i,temp3i)
		}
		
		if (isAlpha==1) {
			AddMesh (childMesh,Alpha)
			EntityAlpha (childMesh,0.0)
		} else {
			AddMesh (childMesh,Opaque)
			EntityParent (childMesh,collisionMeshes)
			EntityAlpha (childMesh,0.0)
			EntityType (childMesh,HIT_MAP)
			EntityPickMode (childMesh,2)
			
			//make collision double-sided
			let flipChild: int = CopyMesh(childMesh)
			FlipMesh(flipChild)
			AddMesh (flipChild,childMesh)
			FreeEntity (flipChild)
		}	
	}
	
	let hiddenMesh: int
	hiddenMesh=CreateMesh()
	
	count=ReadInt(f) //invisible collision mesh
	for (i of range(1, count + 1)) {
		surf=CreateSurface(hiddenMesh)
		count2=ReadInt(f) //vertices
		for (j of range(1, count2 + 1)) {
			//world coords
			x=ReadFloat(f)
			y=ReadFloat(f)
			z=ReadFloat(f)
			let vertex=AddVertex(surf,x,y,z)
		}
		
		count2=ReadInt(f) //polys
		for (j of range(1, count2 + 1)) {
			temp1i = ReadInt(f)
			temp2i = ReadInt(f)
			temp3i = ReadInt(f)
			AddTriangle(surf,temp1i,temp2i,temp3i)
			AddTriangle(surf,temp1i,temp3i,temp2i)
		}
	}
	
	//trigger boxes
	if (hasTriggerBox) {
		DebugLog ("TriggerBoxEnable")
		rt.TempTriggerboxAmount = ReadInt(f)
		for (let tb of range(rt.TempTriggerboxAmount)) {
			rt.TempTriggerbox[tb] = CreateMesh(rt.obj)
			count = ReadInt(f)
			for (i of range(1, count + 1)) {
				surf=CreateSurface(rt.TempTriggerbox[tb])
				count2=ReadInt(f)
				for (j of range(1, count2 + 1)) {
					x=ReadFloat(f)
					y=ReadFloat(f)
					z=ReadFloat(f)
					let vertex = AddVertex(surf,x,y,z)
				}
				count2=ReadInt(f)
				for (j of range(1, count2 + 1)) {
					temp1i = ReadInt(f)
					temp2i = ReadInt(f)
					temp3i = ReadInt(f)
					AddTriangle(surf,temp1i,temp2i,temp3i)
					AddTriangle(surf,temp1i,temp3i,temp2i)
				}
			}
			rt.TempTriggerboxName[tb] = ReadString(f)
		}
	}
	
	count=ReadInt(f) //point entities
	for (i of range(1, count + 1)) {
		let temp1s = ReadString(f)
		switch (temp1s) {
			case "screen":
				
				temp1=ReadFloat(f)*RoomScale
				temp2=ReadFloat(f)*RoomScale
				temp3=ReadFloat(f)*RoomScale
				
				let temp2s = ReadString(f)
				
				if (temp1 != 0 || temp2 != 0 || temp3 != 0) {
					let ts: TempScreens = new TempScreens()
					ts.x = temp1
					ts.y = temp2
					ts.z = temp3
					ts.imgpath = temp2s
					ts.roomtemplate = rt
				}
				
			case "waypoint":
				
				temp1=ReadFloat(f)*RoomScale
				temp2=ReadFloat(f)*RoomScale
				temp3=ReadFloat(f)*RoomScale
				
				let w: TempWayPoints = new TempWayPoints()
				w.roomtemplate = rt
				w.x = temp1
				w.y = temp2
				w.z = temp3
				
			case "light":
				
				temp1=ReadFloat(f)*RoomScale
				temp2=ReadFloat(f)*RoomScale
				temp3=ReadFloat(f)*RoomScale
				
				if (temp1 != 0 || temp2 != 0 || temp3 != 0) {
					let trange = ReadFloat(f)/2000.0
					let lcolor = ReadString(f)
					let intensity = Min(ReadFloat(f)*0.8,1.0)
					let r = Int(Piece(lcolor,1," "))*intensity
					let g = Int(Piece(lcolor,2," "))*intensity
					let b = Int(Piece(lcolor,3," "))*intensity
					
					AddTempLight(rt, temp1,temp2,temp3, 2, trange, r,g,b)
				} else {
					ReadFloat(f)
					ReadString(f)
					ReadFloat(f)
				}
				
			case "spotlight":
				
				temp1=ReadFloat(f)*RoomScale
				temp2=ReadFloat(f)*RoomScale
				temp3=ReadFloat(f)*RoomScale
				
				if (temp1 != 0 || temp2 != 0 || temp3 != 0) {
					let trange = ReadFloat(f)/2000.0
					let lcolor = ReadString(f)
					let intensity = Min(ReadFloat(f)*0.8,1.0)
					let r = Int(Piece(lcolor,1," "))*intensity
					let g = Int(Piece(lcolor,2," "))*intensity
					let b = Int(Piece(lcolor,3," "))*intensity
					
					let lt: LightTemplates = AddTempLight(rt, temp1,temp2,temp3, 2, trange, r,g,b)
					let angles = ReadString(f)
					let pitch = Piece(angles,1," ")
					let yaw = Piece(angles,2," ")
					lt.pitch = pitch
					lt.yaw = yaw
					
					lt.innerconeangle = ReadInt(f)
					lt.outerconeangle = ReadInt(f)
				} else {
					ReadFloat(f)
					ReadString(f)
					ReadFloat(f)
					ReadString(f)
					ReadInt(f)
					ReadInt(f)
				}
				
			case "soundemitter":
				
				temp1i=0
				
				for (j of range(MaxRoomEmitters)) {
					if (rt.TempSoundEmitter[j] == 0) {
						rt.TempSoundEmitterX[j]=ReadFloat(f)*RoomScale
						rt.TempSoundEmitterY[j]=ReadFloat(f)*RoomScale
						rt.TempSoundEmitterZ[j]=ReadFloat(f)*RoomScale
						rt.TempSoundEmitter[j]=ReadInt(f)
						
						rt.TempSoundEmitterRange[j]=ReadFloat(f)
						temp1i=1
						Exit()
					}
				}
				
				if (temp1i == 0) {
					ReadFloat(f)
					ReadFloat(f)
					ReadFloat(f)
					ReadInt(f)
					ReadFloat(f)
				}
				
			case "playerstart":
				
				temp1=ReadFloat(f)
				temp2=ReadFloat(f)
				temp3=ReadFloat(f)
				
				let angles = ReadString(f)
				let pitch = Float(Piece(angles,1," "))
				let yaw = Float(Piece(angles,2," "))
				let roll = Float(Piece(angles,3," "))
				if (cam) {
					PositionEntity (cam,temp1,temp2,temp3)
					RotateEntity (cam,pitch,yaw,roll)
				}
			case "model":
				file = ReadString(f)
				if (file != "") {
					let model = CreatePropObj("GFX/Map/Props/"+file)
					
					temp1=ReadFloat(f)
					temp2=ReadFloat(f)
					temp3=ReadFloat(f)
					PositionEntity(model,temp1,temp2,temp3)
					
					temp1=ReadFloat(f)
					temp2=ReadFloat(f)
					temp3=ReadFloat(f)
					RotateEntity (model,temp1,temp2,temp3)
					
					temp1=ReadFloat(f)
					temp2=ReadFloat(f)
					temp3=ReadFloat(f)
					ScaleEntity (model,temp1,temp2,temp3)
					
					EntityParent (model,Opaque)
					EntityType (model,HIT_MAP)
					EntityPickMode (model,2)
				} else {
					DebugLog ("file = 0")
					temp1=ReadFloat(f)
					temp2=ReadFloat(f)
					temp3=ReadFloat(f)
					DebugLog (temp1+", "+temp2+", "+temp3)
					
					//Stop
				}
		}
	}
	
	let obj: int
	
	temp1i=CopyMesh(Alpha)
	FlipMesh (temp1i)
	AddMesh (temp1i,Alpha)
	FreeEntity (temp1i)
	
	if (brush != 0) {
		FreeBrush (brush)
	}
	
	AddMesh (Alpha,Opaque)
	FreeEntity (Alpha)
	
	EntityFX (Opaque,3)
	
	EntityAlpha (hiddenMesh,0.0)
	EntityAlpha (Opaque,1.0)
	
	//EntityType Opaque,HIT_MAP
	EntityType (hiddenMesh,HIT_MAP)
	FreeTexture (blankTexture)
	
	//AddMesh hiddenMesh,BigRoomMesh
	
	obj=CreatePivot()
	CreatePivot(obj) //skip "meshes" object
	EntityParent (Opaque,obj)
	EntityParent (hiddenMesh,obj)
	CreatePivot(obj) //skip "pointentites" object
	CreatePivot(obj) //skip "solidentites" object
	EntityParent (collisionMeshes,obj)
	
	CloseFile (f)
	
	CatchErrors("LoadRMesh")
	return obj
	
}


//-----------////////

export function StripPath(file: string): string {
	let name: string = ""
	if (Len(file) > 0) {
		for (let i of range(Len(file) + 1, 1, -1)) {
			
			let mi=Mid(file,i,1) 
			if (mi == "\\" || mi == "/") {return name}
			
			name=mi+name 
		} 
		
	} 
	
	return name
}

export function Piece(s: string,entry,char: string=" "): string {
	let p
	let a
	while (Instr(s,char+char)) {
		s=Replace(s,char+char,char)
	}
	for (let n of range(1, entry)) {
		p=Instr(s,char)
		s=Right(s,Len(s)-p)
	}
	p=Instr(s,char)
	if (p<1) {
		a=s
	} else {
		a=Left(s,p-1)
	}
	return a
}

export function KeyValue(entity,key: string,defaultvalue: string=""): string {
	let properties=EntityName(entity)
	let test
	properties=Replace(properties,Chr(13),"")
	key=Lower(key)
	while (true) {
		let p=Instr(properties,Chr(10))
		if (p) {
			test=(Left(properties,p-1))
		} else {
			test=properties
		}
		let testkey=Piece(test,1,"=")
		testkey=Trim(testkey)
		testkey=Replace(testkey,Chr(34),"")
		testkey=Lower(testkey)
		if (testkey == key) {
			let value=Piece(test,2,"=")
			value=Trim(value)
			value=Replace(value,Chr(34),"")
			return value
		}
		if (!p) {
			return defaultvalue
		}
		properties=Right(properties,Len(properties)-p)
	} 
}



//Forest gen consts
export const gridsize: int = 10
export const deviation_chance: int = 40 //out of 100
export const branch_chance: int = 65
export const branch_max_life: int = 4
export const branch_die_chance: int = 18
export const max_deviation_distance: int = 3
export const return_chance: int = 27
export const center = 5 //(gridsize-1) / 2

import "Drawportals.bb"
import { ChannelPlaying, Chr, CopyEntity, CountChildren, DebugLog, EntityFX, EntityName, EntityTexture, Exit, Float, float, GetChild, ImageWidth, Int, int, PositionEntity, range, RuntimeError, ScaleEntity, SeedRnd } from "./Helper/bbhelper.ts"

export class Forest {
	TileMesh: int[] = new Array(6)
	DetailMesh: int[] = new Array(6)
	TileTexture: int[] = new Array(10)
	grid: int[] = new Array((gridsize*gridsize)+11)
	TileEntities: int[] = new Array((gridsize*gridsize)+1)
	Forest_Pivot: int
	
	Door: int[] = new Array(2)
	DetailEntities: int[] = new Array(2)
	
	ID: int
}

export function move_forward(dir: int,pathx: int,pathy: int,retval: int=0) : int {
	//move 1 unit along the grid in the designated direction
	if (dir == 1) {
		if (retval == 0) {
			return pathx
		} else {
			return pathy+1
		}
	}
	if (retval == 0) {
		return pathx-1+dir
	} else {
		return pathy
	}
}

export function chance(chanc: int) : boolean {
	//perform a chance given a probability
	return (Rand(0,100)<=chanc)
}

export function turn_if_deviating(max_deviation_distance_: int,pathx: int,center_: int,dir: int,retval: int=0) : int {
	//check if deviating and return the answer. if deviating, turn around
	let current_deviation: int = center_ - pathx
	let deviated: int = 0
	if ((dir == 0 && current_deviation >= max_deviation_distance_) || (dir == 2 && current_deviation <= -max_deviation_distance_)) {
		dir = (dir + 2) % 4
		deviated = 1
	}
	if (retval == 0) {
		return dir
	} else {
		return deviated
	}
}

function GenForestGrid(fr: Forest) {
	CatchErrors("Uncaught (GenForestGrid)")
	fr.ID=LastForestID+1
	LastForestID += 1
	
	let door1_pos: int
	let door2_pos: int
	let i: int
	let j: int
	door1_pos=Rand(3,7)
	door2_pos=Rand(3,7)
	
	//clear the grid
	for (i of range(gridsize)) {
		for (j of range(gridsize)) {
			fr.grid[(j*gridsize)+i]=0
		}
	}
	
	//set the position of the concrete and doors
	fr.grid[door1_pos]=3
	fr.grid[((gridsize-1)*gridsize)+door2_pos]=3
	
	//generate the path
	let pathx = door2_pos
	let pathy = 1
	let dir = 1 //0 = left, 1 = up, 2 = right
	fr.grid[((gridsize-1-pathy)*gridsize)+pathx] = 1
	
	let deviated: int
	
	while (pathy < gridsize -4) {
		if (dir == 1) { //determine whether to go forward or to the side
			if (chance(deviation_chance)) {
				//pick a branch direction
				dir = 2 * Rand(0,1)
				//make sure you have not passed max side distance
				dir = turn_if_deviating(max_deviation_distance,pathx,center,dir)
				deviated = turn_if_deviating(max_deviation_distance,pathx,center,dir,1)
				if (deviated) {
					fr.grid[((gridsize-1-pathy)*gridsize)+pathx]=1
				}
				pathx=move_forward(dir,pathx,pathy)
				pathy=move_forward(dir,pathx,pathy,1)
			}
			
		} else {
			//we are going to the side, so determine whether to keep going or go forward again
			dir = turn_if_deviating(max_deviation_distance,pathx,center,dir)
			deviated = turn_if_deviating(max_deviation_distance,pathx,center,dir,1)
			if (deviated || chance(return_chance)) {
				dir = 1
			}
			
			pathx=move_forward(dir,pathx,pathy)
			pathy=move_forward(dir,pathx,pathy,1)
			//if we just started going forward go twice so as to avoid creating a potential 2x2 line
			if (dir == 1) {
				fr.grid[((gridsize-1-pathy)*gridsize)+pathx]=1
				pathx=move_forward(dir,pathx,pathy)
				pathy=move_forward(dir,pathx,pathy,1)
			}
		}
		
		//add our position to the grid
		fr.grid[((gridsize-1-pathy)*gridsize)+pathx]=1
		
	}
	//finally, bring the path back to the door now that we have reached the end
	dir = 1
	while (pathy < gridsize-1) {
		pathx=move_forward(dir,pathx,pathy)
		pathy=move_forward(dir,pathx,pathy,1)
		fr.grid[((gridsize-1-pathy)*gridsize)+pathx]=1
	}
	
	if (pathx != door1_pos) {
		dir=0
		if (door1_pos>pathx) {
			dir=2
		}
		while (pathx != door1_pos) {
			pathx=move_forward(dir,pathx,pathy)
			pathy=move_forward(dir,pathx,pathy,1)
			fr.grid[((gridsize-1-pathy)*gridsize)+pathx]=1
		}
	}
	
	//attempt to create new branches
	let new_y: int
	let temp_y: int
	let new_x: int
	let branch_type: int
	let branch_pos: int
	new_y=-3 //used for counting off// branches will only be considered once every 4 units so as to avoid potentially too many branches
	while (new_y<gridsize-5) {
		new_y=new_y+4
		temp_y=new_y
		new_x=0
		if (chance(branch_chance)) {
			branch_type=-1
			if (chance(cobble_chance)) {
				branch_type=-2
			}
			//create a branch at this spot
			//determine if on left or on right
			branch_pos=2*Rand(0,1)
			//get leftmost or rightmost path in this row
			let leftmost=gridsize
			let rightmost=0
			for (i of range(gridsize + 1)) {
				if (fr.grid[((gridsize-1-new_y)*gridsize)+i]=1) {
					if (i<leftmost) {
						leftmost=i
					}
					if (i>rightmost) {
						rightmost=i
					}
				}
			}
			if (branch_pos == 0) {
				new_x=leftmost-1
			} else {
				new_x=rightmost+1
			}
			//before creating a branch make sure there are no 1's above or below
			if ((temp_y != 0 && fr.grid[((gridsize-1-temp_y+1)*gridsize)+new_x] == 1) || fr.grid[((gridsize-1-temp_y-1)*gridsize)+new_x] == 1) {
				break //break simply to stop creating the branch
			}
			fr.grid[((gridsize-1-temp_y)*gridsize)+new_x]=branch_type //make 4s so you don't confuse your branch for a path// will be changed later
			if (branch_pos == 0) {
				new_x=leftmost-2
			} else {
				new_x=rightmost+2
			}
			fr.grid[((gridsize-1-temp_y)*gridsize)+new_x]=branch_type //branch out twice to avoid creating an unwanted 2x2 path with the real path
			i = 2
			while (i<branch_max_life) {
				i=i+1
				if (chance(branch_die_chance)) {
					break
				}
				if (Rand(0,3) == 0) { //have a higher chance to go up to confuse the player
					if (branch_pos == 0) {
						new_x=new_x-1
					} else {
						new_x=new_x+1
					}
				} else {
					temp_y=temp_y+1
				}
				
				//before creating a branch make sure there are no 1's above or below
				let n=((gridsize - 1 - temp_y + 1)*gridsize)+new_x
				if (n < gridsize-1) { 
					if (temp_y != 0 && fr.grid[n] == 1) {break}
				}
				n=((gridsize - 1 - temp_y - 1)*gridsize)+new_x
				if (n>0) {
					if (fr.grid[n] == 1) {break}
				}
				
				fr.grid[((gridsize-1-temp_y)*gridsize)+new_x]=branch_type //make 4s so you don't confuse your branch for a path// will be changed later
				if (temp_y>=gridsize-2) {break}
			}
		}
	}
	
	//change branches from 4s to 1s (they were 4s so that they didn't accidently create a 2x2 path unintentionally)
	for (i of range(gridsize)) {
		for (j of range(gridsize)) {
			if (fr.grid[(i*gridsize)+j]=-1) {
				fr.grid[(i*gridsize)+j]=1
			} else if (fr.grid[(i*gridsize)+j]=-2) {
				fr.grid[(i*gridsize)+j]=1				
			}
		}
	}
	
	CatchErrors("GenForestGrid")
}

function PlaceForest(fr: Forest,x: float,y: float,z: float,r: Rooms) {
	CatchErrors("Uncaught (PlaceForest)")
	//local variables
	let tx: int,ty: int
	let tile_size: float=12.0
	let tile_type: int
	let tile_entity: int,detail_entity: int
	
	let tempf1: float,tempf2: float,tempf3: float
	let i: int
	
	if (fr.Forest_Pivot != 0) {
		FreeEntity(fr.Forest_Pivot)
		fr.Forest_Pivot=0
	}
	for (i of range(4)) {
		if (fr.TileMesh[i] != 0) {
			FreeEntity(fr.TileMesh[i])
			fr.TileMesh[i]=0
		}
	}
	for (i of range(5)) {
		if (fr.DetailMesh[i] != 0) {
			FreeEntity(fr.DetailMesh[i])
			fr.DetailMesh[i]=0
		}
	}
	for (i of range(10)) {
		if (fr.TileTexture[i] != 0) {
			FreeEntity(fr.TileTexture[i])
			fr.TileTexture[i]=0
		}
	}
	
	fr.Forest_Pivot=CreatePivot()
	PositionEntity (fr.Forest_Pivot,x,y,z,true)
	
	//load assets
	
	let hmap: any[] = new Array(ROOM4)
	let mask: any[] = new Array(ROOM4)
	let GroundTexture = LoadTexture_Strict("GFX/map/forest/forestfloor.jpg")
	let PathTexture = LoadTexture_Strict("GFX/map/forest/forestpath.jpg")
	
	hmap[ROOM1]=LoadImage_Strict("GFX/map/forest/forest1h.png")
	mask[ROOM1]=LoadTexture_Strict("GFX/map/forest/forest1h_mask.png",1+2)
	
	hmap[ROOM2]=LoadImage_Strict("GFX/map/forest/forest2h.png")
	mask[ROOM2]=LoadTexture_Strict("GFX/map/forest/forest2h_mask.png",1+2)
	
	hmap[ROOM2C]=LoadImage_Strict("GFX/map/forest/forest2Ch.png")
	mask[ROOM2C]=LoadTexture_Strict("GFX/map/forest/forest2Ch_mask.png",1+2)
	
	hmap[ROOM3]=LoadImage_Strict("GFX/map/forest/forest3h.png")
	mask[ROOM3]=LoadTexture_Strict("GFX/map/forest/forest3h_mask.png",1+2)
	
	hmap[ROOM4]=LoadImage_Strict("GFX/map/forest/forest4h.png")
	mask[ROOM4]=LoadTexture_Strict("GFX/map/forest/forest4h_mask.png",1+2)
	
	for (i of range(ROOM1, ROOM4 + 1)) {
		fr.TileMesh[i]=load_terrain(hmap[i],0.03,GroundTexture,PathTexture,mask[i])
	}
	
	//detail meshes
	fr.DetailMesh[1]=LoadMesh_Strict("GFX/map/forest/detail/treetest4.b3d")//1.b3d)
	fr.DetailMesh[2]=LoadMesh_Strict("GFX/map/forest/detail/rock.b3d")
	fr.DetailMesh[3]=LoadMesh_Strict("GFX/map/forest/detail/rock2.b3d")
	fr.DetailMesh[4]=LoadMesh_Strict("GFX/map/forest/detail/treetest5.b3d")
	fr.DetailMesh[5]=LoadMesh_Strict("GFX/map/forest/wall.b3d")
	
	for (i of range(ROOM1, ROOM4 + 1)) {
		HideEntity(fr.TileMesh[i])
	}
	for (i of range(1, 6)) {
		HideEntity(fr.DetailMesh[i])
	}
	
	tempf3=MeshWidth(fr.TileMesh[ROOM1])
	tempf1=tile_size/tempf3
	
	for (tx of range(1, gridsize)) {
		for (ty of range(1, gridsize)) {
			if (fr.grid[(ty*gridsize)+tx] == 1) {
				
				tile_type = 0
				if (tx+1<gridsize) {
					tile_type = (fr.grid[(ty*gridsize)+tx+1]>0)
				}
				if (tx-1 >= 0) {
					tile_type = tile_type+(fr.grid[(ty*gridsize)+tx-1]>0)
				}
				
				if (ty+1<gridsize) {
					tile_type = tile_type+(fr.grid[((ty+1)*gridsize)+tx]>0)
				}
				if (ty-1 >= 0) {
					tile_type = tile_type+(fr.grid[((ty-1)*gridsize)+tx]>0)
				}
								
				let angle: int=0
				switch (tile_type) {
					case 1:
						tile_entity = CopyEntity(fr.TileMesh[ROOM1])
						
						if (fr.grid[((ty+1)*gridsize)+tx]>0) {
							angle = 180
						} else if (fr.grid[(ty*gridsize)+tx-1]>0) {
							angle = 270
						} else if (fr.grid[(ty*gridsize)+tx+1]>0) {
							angle = 90
						}
						
						tile_type = ROOM1
					case 2:
						if (fr.grid[((ty-1)*gridsize)+tx]>0 && fr.grid[((ty+1)*gridsize)+tx]>0) {
							tile_entity = CopyEntity(fr.TileMesh[ROOM2])
							tile_type = ROOM2
						} else if (fr.grid[(ty*gridsize)+tx+1]>0 && fr.grid[(ty*gridsize)+tx-1]>0) {
							tile_entity = CopyEntity(fr.TileMesh[ROOM2])
							angle = 90
							tile_type = ROOM2
						} else {
							tile_entity = CopyEntity(fr.TileMesh[ROOM2C])
							if (fr.grid[(ty*gridsize)+tx-1]>0 && fr.grid[((ty+1)*gridsize)+tx]>0) {
								angle = 180
							} else if (fr.grid[(ty*gridsize)+tx+1]>0 && fr.grid[((ty-1)*gridsize)+tx]>0) {
								
							} else if (fr.grid[(ty*gridsize)+tx-1]>0 && fr.grid[((ty-1)*gridsize)+tx]>0) {
								angle = 270
							} else {
								angle = 90
							}
							tile_type = ROOM2C
						}
					case 3:
						tile_entity = CopyEntity(fr.TileMesh[ROOM3])
						
						if (fr.grid[((ty-1)*gridsize)+tx]=0) {
							angle = 180
						} else if (fr.grid[(ty*gridsize)+tx-1] == 0) {
							angle = 90
						} else if (fr.grid[(ty*gridsize)+tx+1] == 0) {
							angle = 270
						}
						
						tile_type = ROOM3
					case 4:
						tile_entity = CopyEntity(fr.TileMesh[ROOM4])	
						tile_type = ROOM4
					default:
						DebugLog("tile_type: "+tile_type)
				}
				
				if (tile_type > 0) {
					
					let itemPlaced: Array = new Array(4)
					//2, 5, 8
					let it: Items = null
					if ((ty % 3) == 2 && itemPlaced[Floor(ty/3)] == False) {
						itemPlaced[Floor(ty/3)]=true
						it.Items = CreateItem("Log #"+Int(Floor(ty/3)+1), "paper", 0,0.5,0)
						EntityType(it.collider, HIT_ITEM)
						EntityParent(it.collider, tile_entity)
					}
					
					//place trees and other details
					//only placed on spots where the value of the heightmap is above 100
					SetBuffer (ImageBuffer(hmap[tile_type]))
					width = ImageWidth(hmap[tile_type])
					tempf4 = (tempf3/Float(width))
					for (lx of range(3, width-1)) {
						for (ly of range(3, width-1)) {
							GetColor (lx,width-ly)
							
							if (ColorRed()>Rand(100,260)) {
								switch (Rand(0,7)) {
									case 0,1,2,3,4,5,6: //create a tree
										detail_entity=CopyEntity(fr.DetailMesh[1])
										//EntityType detail_entity,HIT_MAP
										tempf2=Rnd(0.25,0.4)
										
										for (i of range(4)) {
											d=CopyEntity(fr.DetailMesh[4])
											RotateEntity(d, 0, 90*i+Rnd(-20,20), 0)
											EntityParent(d,detail_entity)
											
											EntityFX(d, 1)
										}
										
										ScaleEntity(detail_entity,tempf2*1.1,tempf2,tempf2*1.1,true)
										PositionEntity(detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-Rnd(3.0,3.2),ly*tempf4-(tempf3/2.0),true)
										
										RotateEntity(detail_entity,Rnd(-5,5),Rnd(360.0),0.0,true)
										
									case 7: //add a rock
										detail_entity=CopyEntity(fr.DetailMesh[2])
										tempf2=Rnd(0.01,0.012)
										
										PositionEntity(detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-1.3,ly*tempf4-(tempf3/2.0),true)
										
										EntityFX(detail_entity, 1)
										
										RotateEntity(detail_entity,0.0,Rnd(360.0),0.0,true)
									case 6: //add a stump
										detail_entity=CopyEntity(fr.DetailMesh[4])
										tempf2=Rnd(0.1,0.12)
										ScaleEntity(detail_entity,tempf2,tempf2,tempf2,true)
										
										PositionEntity(detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-1.3,ly*tempf4-(tempf3/2.0),true)
								}
								
								EntityFX(detail_entity, 1)
								EntityParent(detail_entity,tile_entity)
							}
						}
					}
					SetBuffer(BackBuffer())
					
					TurnEntity(tile_entity, 0, angle, 0)
					
					PositionEntity(tile_entity,x+(tx*tile_size),y,z+(ty*tile_size),true)
					
					ScaleEntity(tile_entity,tempf1,tempf1,tempf1)
					EntityType(tile_entity,HIT_MAP)
					EntityFX(tile_entity,1)
					EntityParent(tile_entity,fr.Forest_Pivot)
					EntityPickMode(tile_entity,2)
					
					if (it != null) {
						EntityParent (it.collider,0)
					}
					
					fr.TileEntities[tx+(ty*gridsize)] = tile_entity
				} else {
					DebugLog("INVALID TILE @ ("+tx+", "+ty+ "): "+tile_type)
				}
			}
		}
	}
	
	//place the wall		
	for (i of range(2)) {
		ty = ((gridsize-1)*i)
		
		for (tx of range(1, gridsize)) {
			if (fr.grid[(ty*gridsize)+tx] == 3) {
				fr.DetailEntities[i]=CopyEntity(fr.DetailMesh[5])
				ScaleEntity(fr.DetailEntities[i],RoomScale,RoomScale,RoomScale)
				
				fr.Door[i] = CopyEntity(r.Objects[3])
				PositionEntity(fr.Door[i],72*RoomScale,32.0*RoomScale,0,true)
				RotateEntity(fr.Door[i], 0,180,0)
				ScaleEntity(fr.Door[i],48*RoomScale,45*RoomScale,48*RoomScale,true)
				EntityParent(fr.Door[i],fr.DetailEntities[i])
				
				frame = CopyEntity(r.Objects[2],fr.Door[i])
				PositionEntity(frame,0,32.0*RoomScale,0,true)
				ScaleEntity(frame,48*RoomScale,45*RoomScale,48*RoomScale,true)
				EntityParent(frame,fr.DetailEntities[i])
				
				EntityType(fr.DetailEntities[i],HIT_MAP)
				EntityPickMode(fr.DetailEntities[i],2)
				
				PositionEntity(fr.DetailEntities[i],x+(tx*tile_size),y,z+(ty*tile_size)+(tile_size/2)-(tile_size*i),true)
				RotateEntity(fr.DetailEntities[i],0,180*i,0)
				
				EntityParent(fr.DetailEntities[i],fr.Forest_Pivot)
			}		
		}		
	}
	
	CatchErrors("PlaceForest")
}

function PlaceForest_MapCreator(fr: Forest,x: float,y: float,z: float,r: Rooms) {
	CatchErrors("Uncaught (PlaceForest_MapCreator)")
	//local variables
	let tx: int,ty: int
	let tile_size: float=12.0
	let tile_type: int
	let tile_entity: int,detail_entity: int
	
	let tempf1: float,tempf2: float,tempf3: float
	let i: int
	
	if (fr.Forest_Pivot != 0) {
		FreeEntity(fr.Forest_Pivot)
		fr.Forest_Pivot=0
	}
	for (i of range(4)) {
		if (fr.TileMesh[i] != 0) {
			FreeEntity(fr.TileMesh[i])
			fr.TileMesh[i]=0
		}
	}
	for (i of range(5)) {
		if (fr.DetailMesh[i] != 0) {
			FreeEntity(fr.DetailMesh[i])
			fr.DetailMesh[i]=0
		}
	}
	for (i of range(10)) {
		if (fr.TileTexture[i] != 0) {
			FreeEntity(fr.TileTexture[i])
			fr.TileTexture[i]=0
		}
	}
	
	fr.Forest_Pivot=CreatePivot()
	PositionEntity (fr.Forest_Pivot,x,y,z,true)
	
	//load assets
	
	let hmap: Array = new Array(ROOM4 + 1)
	let mask: Array = new Array(ROOM4 + 1)
	let GroundTexture = LoadTexture_Strict("GFX/map/forest/forestfloor.jpg")
	let PathTexture = LoadTexture_Strict("GFX/map/forest/forestpath.jpg")
	
	hmap[ROOM1]=LoadImage_Strict("GFX/map/forest/forest1h.png")
	mask[ROOM1]=LoadTexture_Strict("GFX/map/forest/forest1h_mask.png",1+2)
	
	hmap[ROOM2]=LoadImage_Strict("GFX/map/forest/forest2h.png")
	mask[ROOM2]=LoadTexture_Strict("GFX/map/forest/forest2h_mask.png",1+2)
	
	hmap[ROOM2C]=LoadImage_Strict("GFX/map/forest/forest2Ch.png")
	mask[ROOM2C]=LoadTexture_Strict("GFX/map/forest/forest2Ch_mask.png",1+2)
	
	hmap[ROOM3]=LoadImage_Strict("GFX/map/forest/forest3h.png")
	mask[ROOM3]=LoadTexture_Strict("GFX/map/forest/forest3h_mask.png",1+2)
	
	hmap[ROOM4]=LoadImage_Strict("GFX/map/forest/forest4h.png")
	mask[ROOM4]=LoadTexture_Strict("GFX/map/forest/forest4h_mask.png",1+2)
	
	for (i of range(ROOM1, ROOM4 + 1)) {
		fr.TileMesh[i]=load_terrain(hmap[i],0.03,GroundTexture,PathTexture,mask[i])
	}
	
	//detail meshes
	fr.DetailMesh[1]=LoadMesh_Strict("GFX/map/forest/detail/treetest4.b3d")
	fr.DetailMesh[2]=LoadMesh_Strict("GFX/map/forest/detail/rock.b3d")
	fr.DetailMesh[3]=LoadMesh_Strict("GFX/map/forest/detail/rock2.b3d")
	fr.DetailMesh[4]=LoadMesh_Strict("GFX/map/forest/detail/treetest5.b3d")
	fr.DetailMesh[5]=LoadMesh_Strict("GFX/map/forest/wall.b3d")
	
	for (i of range(ROOM1, ROOM4 + 1)) {
		HideEntity(fr.TileMesh[i])
	}
	for (i of range(1, 6)) {
		HideEntity(fr.DetailMesh[i])
	}
	
	tempf3=MeshWidth(fr.TileMesh[ROOM1])
	tempf1=tile_size/tempf3
	
	DebugLog("ForestINIT")
	
	for (tx of range(gridsize)) {
		for (ty of range(gridsize)) {
			if (fr.grid[(ty*gridsize)+tx] > 0) { 
				
				tile_type = 0
				let angle: int=0
				
				tile_type = Ceil(Float(fr.grid[(ty*gridsize)+tx])/4.0)
				if (tile_type == 6) {
					tile_type = 2
				}
				angle = (fr.grid[(ty*gridsize)+tx] % 4)*90
				
				tile_entity = CopyEntity(fr.TileMesh[tile_type])
				
				DebugLog("Tile: "+tile_type+"| Angle: "+angle)
				
				if (tile_type > 0) {
					
					let itemPlaced: Array = new Array(4)
					//2, 5, 8
					let it: Items = null
					if ((ty % 3) == 2 && itemPlaced[Floor(ty/3)] == False) {
						itemPlaced[Floor(ty/3)]=true
						it.Items = CreateItem("Log : float"+Int(Floor(ty/3)+1), "paper", 0,0.5,0)
						EntityType(it.collider, HIT_ITEM)
						EntityParent(it.collider, tile_entity)
					}
					
					//place trees and other details
					//only placed on spots where the value of the heightmap is above 100
					SetBuffer (ImageBuffer(hmap[tile_type]))
					width = ImageWidth(hmap[tile_type])
					tempf4 = (tempf3/Float(width))
					for (lx of range(3, width-1)) {
						for (ly of range(3, width-1)) {
							GetColor (lx,width-ly)
							
							if (ColorRed()>Rand(100,260)) {
								detail_entity = 0
								switch (Rand(0,7)) {
									case 0,1,2,3,4,5,6: //create a tree
										detail_entity=CopyEntity(fr.DetailMesh[1])
										tempf2=Rnd(0.25,0.4)
										
										for (i of range(4)) {
											d=CopyEntity(fr.DetailMesh[4])
											RotateEntity (d, 0, 90*i+Rnd(-20,20), 0)
											EntityParent(d,detail_entity)
											
											EntityFX (d, 1)
										}
										
										ScaleEntity (detail_entity,tempf2*1.1,tempf2,tempf2*1.1,true)
										PositionEntity (detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-Rnd(3.0,3.2),ly*tempf4-(tempf3/2.0),true)
										
										RotateEntity (detail_entity,Rnd(-5,5),Rnd(360.0),0.0,true)
										
									case 7: //add a rock
										detail_entity=CopyEntity(fr.DetailMesh[2])
										tempf2=Rnd(0.01,0.012)
										
										PositionEntity (detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-1.3,ly*tempf4-(tempf3/2.0),true)
										
										EntityFX (detail_entity, 1)
										
										RotateEntity (detail_entity,0.0,Rnd(360.0),0.0,true)
									case 6: //add a stump
										detail_entity=CopyEntity(fr.DetailMesh[4])
										tempf2=Rnd(0.1,0.12)
										ScaleEntity (detail_entity,tempf2,tempf2,tempf2,true)
										
										PositionEntity (detail_entity,lx*tempf4-(tempf3/2.0),ColorRed()*0.03-1.3,ly*tempf4-(tempf3/2.0),true)
								}
								
								if (detail_entity != 0) {
									EntityFX (detail_entity, 1)
									EntityParent (detail_entity,tile_entity)
								}
							}
						}
					}
					SetBuffer (BackBuffer())
					
					TurnEntity (tile_entity, 0, angle, 0)
					
					PositionEntity (tile_entity,x+(tx*tile_size),y,z+(ty*tile_size),true)
					
					DebugLog ("tile_entity: "+(x+(tx*tile_size))+"|"+(y)+"|"+(z+(ty*tile_size)))
					
					ScaleEntity(tile_entity,tempf1,tempf1,tempf1)
					EntityType(tile_entity,HIT_MAP)
					EntityFX(tile_entity,1)
					EntityParent(tile_entity,fr.Forest_Pivot)
					EntityPickMode(tile_entity,2)
					
					if (it != null) {
						EntityParent(it.collider,0)
					}
					
					fr.TileEntities[tx+(ty*gridsize)] = tile_entity
				} else {
					DebugLog("INVALID TILE @ ("+tx+", "+ty+ "): "+tile_type)
				}
				
				if (Ceil(fr.grid[(ty*gridsize)+tx]/4.0) == 6) {
					for (i of range(2)) {
						if (fr.Door[i] == 0) {
							fr.DetailEntities[i]=CopyEntity(fr.DetailMesh[5])
							ScaleEntity(fr.DetailEntities[i],RoomScale,RoomScale,RoomScale)
							
							fr.Door[i] = CopyEntity(r.Objects[3])
							PositionEntity(fr.Door[i],72*RoomScale,32.0*RoomScale,0,true)
							RotateEntity(fr.Door[i], 0,180,0)
							ScaleEntity(fr.Door[i],48*RoomScale,45*RoomScale,48*RoomScale,true)
							EntityParent(fr.Door[i],fr.DetailEntities[i])
							
							let frame = CopyEntity(r.Objects[2],fr.Door[i])
							PositionEntity(frame,0,32.0*RoomScale,0,true)
							ScaleEntity(frame,48*RoomScale,45*RoomScale,48*RoomScale,true)
							EntityParent(frame,fr.DetailEntities[i])
							
							EntityType(fr.DetailEntities[i],HIT_MAP)
							EntityPickMode(fr.DetailEntities[i],2)
							
							PositionEntity(fr.DetailEntities[i],x+(tx*tile_size),y,z+(ty*tile_size),true)
							RotateEntity(fr.DetailEntities[i],0,angle+180,0)
							MoveEntity(fr.DetailEntities[i],0,0,-6)
							
							EntityParent(fr.DetailEntities[i],fr.Forest_Pivot)
							break
						}
					}
				}
			} else {
				DebugLog("NO TILE FOUND @ ("+tx+", "+ty+ ")")
			}
		}
	}
	
	DebugLog("ForestINIT END")
	
	CatchErrors("PlaceForest_MapCreator")
}

function DestroyForest(fr: Forest) {
	CatchErrors("Uncaught (DestroyForest)")
	let tx: int
	let ty: int
	for (tx of range(gridsize)) {
		for (ty of range(gridsize)) {
			if (fr.TileEntities[tx+(ty*gridsize)] != 0) {
				FreeEntity(fr.TileEntities[tx+(ty*gridsize)])
				fr.TileEntities[tx+(ty*gridsize)] = 0
				fr.grid[tx+(ty*gridsize)] = 0
			}
		}
	}
	if (fr.Door[0] != 0) {
		FreeEntity(fr.Door[0])
		fr.Door[0] = 0
	}
	if (fr.Door[1] != 0) {
		FreeEntity(fr.Door[1])
		fr.Door[0] = 1
	}
	if (fr.DetailEntities[0] != 0) {
		FreeEntity(fr.DetailEntities[0])
		fr.DetailEntities[0] = 0
	}
	if (fr.DetailEntities[1] != 0) {
		FreeEntity(fr.DetailEntities[1])
		fr.DetailEntities[1] = 0
	}
	
	if (fr.Forest_Pivot != 0) {
		FreeEntity(fr.Forest_Pivot)
		fr.Forest_Pivot=0
	}
	for (let i of range(4)) {
		if (fr.TileMesh[i] != 0) {
			FreeEntity(fr.TileMesh[i])
			fr.TileMesh[i]=0
		}
	}
	for (let i of range(5)) {
		if (fr.DetailMesh[i] != 0) {
			FreeEntity(fr.DetailMesh[i])
			fr.DetailMesh[i]=0
		}
	}
	for (let i of range(10)) {
		if (fr.TileTexture[i] != 0) {
			FreeEntity(fr.TileTexture[i])
			fr.TileTexture[i]=0
		}
	}
	
	CatchErrors("DestroyForest")
}


function UpdateForest(fr: Forest,ent: int) {
	CatchErrors("Uncaught (UpdateForest)")
	//local variables
	let tx: int
	let ty: int
	if (Abs(EntityY(ent,true)-EntityY(fr.Forest_Pivot,true))<12.0) {
		for (tx of range(gridsize)) {
			for (ty of range(gridsize)) {
				if (fr.TileEntities[tx+(ty*gridsize)] != 0) {
					if (Abs(EntityX(ent,true)-EntityX(fr.TileEntities[tx+(ty*gridsize)],true))<20.0) {
						if (Abs(EntityZ(ent,true)-EntityZ(fr.TileEntities[tx+(ty*gridsize)],true))<20.0) {
							ShowEntity(fr.TileEntities[tx+(ty*gridsize)])
						} else {
							HideEntity(fr.TileEntities[tx+(ty*gridsize)])
						}
					} else {
						HideEntity(fr.TileEntities[tx+(ty*gridsize)])
					}
				}
			}
		}
	}
	CatchErrors("UpdateForest")
}

export const MaxRoomLights: int = 32
export const MaxRoomEmitters: int = 8
export const MaxRoomObjects: int = 30


export const ROOM1: int = 1
export const ROOM2: int = 2
export const ROOM2C: int = 3
export const ROOM3: int = 4
export const ROOM4: int = 5

export var RoomTempID: int
export class RoomTemplates {
	static each: RoomTemplates[] = []
	obj: int
	id: int
	objPath: string
	
	zone: int[] = new Array(5)
		
	TempSoundEmitter: int[] = new Array(MaxRoomEmitters)
	TempSoundEmitterX: float[] = new Array(MaxRoomEmitters)
	TempSoundEmitterY: float[] = new Array(MaxRoomEmitters)
	TempSoundEmitterZ: float[] = new Array(MaxRoomEmitters)
	TempSoundEmitterRange: float[] = new Array(MaxRoomEmitters)
	
	Shape: int
	Name: string
	Commonness: int
	Large: int
	DisableDecals: int
	
	TempTriggerboxAmount
	TempTriggerbox: any[] = new Array(128)
	TempTriggerboxName: string[] = new Array(128)
	
	UseLightCones: int
	
	DisableOverlapCheck: boolean = true
	
	MinX: float
	MinY: float
	MinZ: float
	MaxX: float
	MaxY: float
	MaxZ: float
} 	

function CreateRoomTemplate(meshpath: string) : RoomTemplates {
	let rt: RoomTemplates = new RoomTemplates()
	
	rt.objPath = meshpath
	
	rt.id = RoomTempID
	RoomTempID=RoomTempID+1
	
	return rt
}

function LoadRoomTemplates(file: string) {
	CatchErrors("Uncaught (LoadRoomTemplates)")
	let TemporaryString: string
	let i: int
	let rt: RoomTemplates
	let StrTemp: string = ""
	
	let f = OpenFile(file)
	
	while (!Eof(f)) {
		TemporaryString = Trim(ReadLine(f))
		if (Left(TemporaryString,1) == "[") {
			TemporaryString = Mid(TemporaryString, 2, Len(TemporaryString) - 2)
			StrTemp = GetINIString(file, TemporaryString, "mesh path")
			
			rt = CreateRoomTemplate(StrTemp)
			rt.Name = Lower(TemporaryString)
			
			StrTemp = Lower(GetINIString(file, TemporaryString, "shape"))
			
			switch (StrTemp) {
				case "room1", "1":
					rt.Shape = ROOM1
				case "room2", "2":
					rt.Shape = ROOM2
				case "room2c", "2c":
					rt.Shape = ROOM2C
				case "room3", "3":
					rt.Shape = ROOM3
				case "room4", "4":
					rt.Shape = ROOM4
			}
			
			for (i of range(5)) {
				rt.zone[i]= GetINIInt(file, TemporaryString, "zone"+(i+1))
			}
			
			rt.Commonness = Max(Min(GetINIInt(file, TemporaryString, "commonness"), 100), 0)
			rt.Large = GetINIInt(file, TemporaryString, "large")
			rt.DisableDecals = GetINIInt(file, TemporaryString, "disabledecals")
			rt.UseLightCones = GetINIInt(file, TemporaryString, "usevolumelighting")
			rt.DisableOverlapCheck = GetINIInt(file, TemporaryString, "disableoverlapcheck")
		}
	}
	
	i = 1
	while (true) {
		StrTemp = GetINIString(file, "room ambience", "ambience"+i)
		if (StrTemp == "") {
			break
		}
		
		RoomAmbience[i]=LoadSound_Strict(StrTemp)
		i=i+1
	}
	
	CloseFile (f)
	
	CatchErrors("LoadRoomTemplates")
}


function LoadRoomMesh(rt: RoomTemplates) {
	
	if (Instr(rt.objPath,".rmesh") != 0) { //file is roommesh
		rt.obj = LoadRMesh(rt.objPath, rt)
	} else { //file is b3d
		if (rt.objPath != "") {
			rt.obj = LoadWorld(rt.objPath, rt)
		} else {
			rt.obj = CreatePivot()
		}
	}
	
	if (!rt.obj) {
		RuntimeError("Failed to load map file "+Chr(34)+mapfile+Chr(34)+".")
	}
	
	CalculateRoomTemplateExtents(rt)
	
	HideEntity(rt.obj)
	
}

function LoadRoomMeshes() {
	let temp: int = 0
	for (let rt of RoomTemplates.each) {
		temp=temp+1
	}
	
	let i = 0
	for (let rt of RoomTemplates.each) {
		if (Instr(rt.objpath,".rmesh") != 0) { //file is roommesh
			rt.obj = LoadRMesh(rt.objPath, rt)
		} else { //file is b3d
			if (rt.objpath != "") {
				rt.obj = LoadWorld(rt.objPath, rt)
			} else {
				rt.obj = CreatePivot()
			}
		}
		if (!rt.obj) {
			RuntimeError("Failed to load map file "+Chr(34)+mapfile+Chr(34)+".")
		}
		
		HideEntity(rt.obj)
		DrawLoading(Int(30 + (15.0 / temp)*i))
		i=i+1
	}
}


LoadRoomTemplates("Data/rooms.ini")

export var RoomScale: float = 8.0 / 2048.0
export const ZONEAMOUNT = 3
export var MapWidth: int = GetINIInt("options.ini", "options", "map size")
export var MapHeight: int = GetINIInt("options.ini", "options", "map size")
export var MapTemp: int[] = new Array(MapWidth+1, MapHeight+1)
export var MapFound: int[] = new Array(MapWidth+1, MapHeight+1)

export var RoomAmbience: int[] = new Array(20)

export var Sky

export var HideDistance: float = 15.0

export var SecondaryLightOn: boolean = true
export var PrevSecondaryLightOn: boolean = true
export var RemoteDoorOn: boolean = true
export var Contained106: boolean = false

export class Rooms {
	static each: Rooms[] = []
	zone: int
	found: int
	obj: int
	x: float
	y: float
	z: float
	angle: int
	RoomTemplate: RoomTemplates
	
	dist: float
	
	SoundCHN: int
	
	dp: DrawPortal
	fr: Forest
	
	SoundEmitter: int[] = new Array(MaxRoomEmitters)
	SoundEmitterObj: int[] = new Array(MaxRoomEmitters)
	SoundEmitterRange: float[] = new Array(MaxRoomEmitters)
	SoundEmitterCHN: int[] = new Array(MaxRoomEmitters)
	
	Lights: int[] = new Array(MaxRoomLights)
	LightIntensity: float[] = new Array(MaxRoomLights)
	
	LightSprites: int[] = new Array(MaxRoomLights)	
	
	Objects: int[] = new Array(MaxRoomObjects)
	Levers: int[] = new Array(11)
	RoomDoors: Doors[] = new Array(7)
	NPC: NPCs[] = new Array(12)
	grid: Grids
	
	Adjacent: Rooms[] = new Array(4)
	AdjDoor: Doors[] = new Array(4)
	
	NonFreeAble: int[] = new Array(10)
	Textures: int[] = new Array(10)
	
	MaxLights: int = 0
	LightSpriteHidden: int[] = new Array(MaxRoomLights)
	LightSpritesPivot: int[] = new Array(MaxRoomLights)
	LightSprites2: int[] = new Array(MaxRoomLights)
	LightHidden: int[] = new Array(MaxRoomLights)
	LightFlicker: int[] = new Array(MaxRoomLights)
	AlarmRotor: int[] = new Array(1)
	AlarmRotorLight: int[] = new Array(1)
	TriggerboxAmount
	Triggerbox: any[] = new Array(128)
	TriggerboxName: string[] = new Array(128)
	MaxWayPointY: float
	LightR: float[] = new Array(MaxRoomLights)
	LightG: float[] = new Array(MaxRoomLights)
	LightB: float[] = new Array(MaxRoomLights)
	LightCone: int[] = new Array(MaxRoomLights)
	LightConeSpark: int[] = new Array(MaxRoomLights)
	LightConeSparkTimer: float[] = new Array(MaxRoomLights)
	
	MinX: float
	MinY: float
	MinZ: float
	MaxX: float
	MaxY: float
	MaxZ: float
} 

const gridsz: int=19 //Same size as the main map itself (better for the map creator)
class Grids {
	grid: int[] = new Array(gridsz*gridsz)
	angles: int[] = new Array(gridsz*gridsz)
	Meshes: int[] = new Array(7)
	Entities: int[] = new Array(gridsz*gridsz)
	waypoints: WayPoints[] = new Array(gridsz*gridsz)
}

function UpdateGrid(grid: Grids) {
	//local variables
	let tx: int,ty: int
	for (tx of range(gridsz)) {
		for (ty of range(gridsz)) {
			if (grid.Entities[tx+(ty*gridsz)] != 0) {
				if (Abs(EntityY(Collider,true)-EntityY(grid.Entities[tx+(ty*gridsz)],true))>4.0) {Exit()}
				if (Abs(EntityX(Collider,true)-EntityX(grid.Entities[tx+(ty*gridsz)],true))<HideDistance) {
					if (Abs(EntityZ(Collider,true)-EntityZ(grid.Entities[tx+(ty*gridsz)],true))<HideDistance) {
						ShowEntity(grid.Entities[tx+(ty*gridsz)])
					} else {
						HideEntity(grid.Entities[tx+(ty*gridsz)])
					}
				} else {
					HideEntity(grid.Entities[tx+(ty*gridsz)])
				}
			}
		}
	}
}

function PlaceGrid_MapCreator(r: Rooms) {
	let x,y,i
	let Meshes: any[] = new Array(6)
	let dr: Doors
	let it: Items
	
	for (i of range(7)) {
		Meshes[i]=CopyEntity(OBJTunnel(i))
		DebugLog (i)
		HideEntity (Meshes[i])
	}
	
	for (y of range(gridsz)) {
		for (x of range(gridsz)) {
			if (r.grid.grid[x+(y*gridsz)]>0) {
				let tile_type = 0
				let angle: int=0
				
				tile_type = r.grid.grid[x+(y*gridsz)]
				angle = r.grid.angles[x+(y*gridsz)]*90.0
				
				let tile_entity = CopyEntity(Meshes[tile_type-1])
				RotateEntity(tile_entity,0,angle,0)
				ScaleEntity(tile_entity,RoomScale,RoomScale,RoomScale,true)
				PositionEntit(tile_entity,r.x+x*2.0,8.0,r.z+y*2.0,true)
				
				switch (r.grid.grid[x+(y*gridsz)]) {
					case ROOM1:
						AddLight(null, r.x+x*2.0, 8.0+(368.0*RoomScale), r.z+y*2.0, 2, 500.0 * RoomScale, 255, 255, 255)
					case ROOM2,ROOM2C:
						AddLight(null, r.x+x*2.0, 8.0+(368.0*RoomScale), r.z+y*2.0, 2, 500.0 * RoomScale, 255, 255, 255)
					case ROOM2C:
						AddLight(null, r.x+x*2.0, 8.0+(412.0*RoomScale), r.z+y*2.0, 2, 500.0 * RoomScale, 255, 255, 255)
					case ROOM3,ROOM4:
						AddLight(null,r.x+x*2.0, 8.0+(412.0*RoomScale), r.z+y*2.0, 2, 500.0 * RoomScale, 255, 255, 255)
					case ROOM4+1:
						dr=CreateDoor(r.zone,r.x+(x*2.0)+(Cos(EntityYaw(tile_entity,true))*240.0*RoomScale),8.0,r.z+(y*2.0)+(Sin(EntityYaw(tile_entity,true))*240.0*RoomScale),EntityYaw(tile_entity,true)+90.0,null,False,3,False,"")
						PositionEntity(dr.buttons[0],EntityX(dr.buttons[0],true)+(Cos(EntityYaw(tile_entity,true))*0.05),EntityY(dr.buttons[0],true)+0.0,EntityZ(dr.buttons[0],true)+(Sin(EntityYaw(tile_entity,true))*0.05),true)
						
						AddLight(null, r.x+x*2.0+(Cos(EntityYaw(tile_entity,true))*555.0*RoomScale), 8.0+(469.0*RoomScale), r.z+y*2.0+(Sin(EntityYaw(tile_entity,true))*555.0*RoomScale), 2, 600.0 * RoomScale, 255, 255, 255)
						
						let tempInt2=CreatePivot()
						RotateEntity (tempInt2,0,EntityYaw(tile_entity,true)+180.0,0,true)
						PositionEntity (tempInt2,r.x+(x*2.0)+(Cos(EntityYaw(tile_entity,true))*552.0*RoomScale),8.0+(240.0*RoomScale),r.z+(y*2.0)+(Sin(EntityYaw(tile_entity,true))*552.0*RoomScale))
						if (r.RoomDoors[1] == null) {
							r.RoomDoors[1]=dr
							r.Objects[3]=tempInt2
							PositionEntity (r.Objects[0],r.x+x*2.0,8.0,r.z+y*2.0,true)
							DebugLog ("Created door 1 successfully!")
						} else if (r.RoomDoors[1] != null && r.RoomDoors[3] == null) {
							r.RoomDoors[3]=dr
							r.Objects[5]=tempInt2
							PositionEntity (r.Objects[1],r.x+x*2.0,8.0,r.z+y*2.0,true)
							DebugLog ("Created door 2 successfully!")
						}
					case ROOM4+2:
						AddLight(null, r.x+x*2.0-(Sin(EntityYaw(tile_entity,true))*504.0*RoomScale)+(Cos(EntityYaw(tile_entity,true))*16.0*RoomScale), 8.0+(396.0*RoomScale), r.z+y*2.0+(Cos(EntityYaw(tile_entity,true))*504.0*RoomScale)+(Sin(EntityYaw(tile_entity,true))*16.0*RoomScale), 2, 500.0 * RoomScale, 255, 200, 200)
						it = CreateItem("SCP-500-01","scp500",r.x+x*2.0+(Cos(EntityYaw(tile_entity,true))*(-208.0)*RoomScale)-(Sin(EntityYaw(tile_entity,true))*1226.0*RoomScale),8.0+(80.0*RoomScale),r.z+y*2.0+(Sin(EntityYaw(tile_entity,true))*(-208.0)*RoomScale)+(Cos(EntityYaw(tile_entity,true))*1226.0*RoomScale))
						EntityType (it.collider, HIT_ITEM)
						
						it = CreateItem("Night Vision Goggles", "nvgoggles",r.x+x*2.0-(Sin(EntityYaw(tile_entity,true))*504.0*RoomScale)+(Cos(EntityYaw(tile_entity,true))*16.0*RoomScale), 8.0+(80.0*RoomScale), r.z+y*2.0+(Cos(EntityYaw(tile_entity,true))*504.0*RoomScale)+(Sin(EntityYaw(tile_entity,true))*16.0*RoomScale))
						EntityType (it.collider, HIT_ITEM)
				}
				
				r.grid.Entities[x+(y*gridsz)]=tile_entity
				wayp.WayPoints = CreateWaypoint(r.x+(x*2.0),8.2,r.z+(y*2.0),null,r)
				r.grid.waypoints[x+(y*gridsz)]=wayp
				
				if (y<gridsz-1) {
					if (r.grid.waypoints[x+((y+1)*gridsz)] != null) {
						dist=EntityDistance(r.grid.waypoints[x+(y*gridsz)].obj,r.grid.waypoints[x+((y+1)*gridsz)].obj)
						for (i of range(4)) {
							if (r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+((y+1)*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+((y+1)*gridsz)]
								r.grid.waypoints[x+(y*gridsz)].dist[i]=dist
								break
							}
						}
						for (i of range(4)) {
							if (r.grid.waypoints[x+((y+1)*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+((y+1)*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+((y+1)*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]
								r.grid.waypoints[x+((y+1)*gridsz)].dist[i]=dist
								break
							}
						}
					}
				}
				if (y>0) {
					if (r.grid.waypoints[x+((y-1)*gridsz)] != null) {
						dist=EntityDistance(r.grid.waypoints[x+(y*gridsz)].obj,r.grid.waypoints[x+((y-1)*gridsz)].obj)
						for (i of range(4)) {
							if (r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+((y-1)*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+((y-1)*gridsz)]
								r.grid.waypoints[x+(y*gridsz)].dist[i]=dist
								break
							}
						}
						for (i of range(4)) {
							if (r.grid.waypoints[x+((y-1)*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+((y-1)*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]
								r.grid.waypoints[x+((y-1)*gridsz)].dist[i]=dist
								break
							}
						}
					}
				}
				if (x>0) {
					if (r.grid.waypoints[x-1+(y*gridsz)] != null) {
						dist=EntityDistance(r.grid.waypoints[x+(y*gridsz)].obj,r.grid.waypoints[x-1+(y*gridsz)].obj)
						for (i of range(4)) {
							if (r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x-1+(y*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x-1+(y*gridsz)]
								r.grid.waypoints[x+(y*gridsz)].dist[i]=dist
								break
							}
						}
						for (i of range(4)) {
							if (r.grid.waypoints[x-1+(y*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x-1+(y*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]
								r.grid.waypoints[x-1+(y*gridsz)].dist[i]=dist
								break
							}
						}
					}
				}
				if (x<gridsz-1) {
					if (r.grid.waypoints[x+1+(y*gridsz)] != null) {
						dist=EntityDistance(r.grid.waypoints[x+(y*gridsz)].obj,r.grid.waypoints[x+1+(y*gridsz)].obj)
						for (i of range(4)) {
							if (r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+1+(y*gridsz)]) {
								break
							} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+(y*gridsz)].connected[i]=r.grid.waypoints[x+1+(y*gridsz)]
								r.grid.waypoints[x+(y*gridsz)].dist[i]=dist
								break
							}
						}
						for (i of range(4)) {
							if (r.grid.waypoints[x+1+(y*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]) {
								break
						 	} else if (r.grid.waypoints[x+(y*gridsz)].connected[i]=null) {
								r.grid.waypoints[x+1+(y*gridsz)].connected[i]=r.grid.waypoints[x+(y*gridsz)]
								r.grid.waypoints[x+1+(y*gridsz)].dist[i]=dist
								break
							}
						}
					}
				}
			}
		}
	}
	
	for (i of range(7)) {
		r.grid.Meshes[i]=Meshes[i]
	}
	
}

function CreateRoom(zone: int, roomshape: int, x: float, y: float, z: float, name: string = "") : Rooms {
	CatchErrors("Uncaught (CreateRoom)")
	let r: Rooms = new Rooms()
	let rt: RoomTemplates
	
	r.zone = zone
	
	r.x = x
	r.y = y
	r.z = z
	
	if (name != "") {
		name = Lower(name)
		for (rt of RoomTemplates.each) {
			if (rt.Name == name) {
				r.RoomTemplate = rt
				
				if (rt.obj == 0) {
					LoadRoomMesh(rt)
				}
				
				r.obj = CopyEntity(rt.obj)
				ScaleEntity(r.obj, RoomScale, RoomScale, RoomScale)
				EntityType(r.obj, HIT_MAP)
				EntityPickMode(r.obj, 2)
				
				PositionEntity(r.obj, x, y, z)
				FillRoom(r)
				
				if (r.RoomTemplate.UseLightCones) {
					AddLightCones(r)
				}
				
				CalculateRoomExtents(r)
				return r
			}
		}
	}
	
	let temp: int = 0
	for (rt of RoomTemplates.each) {
		for (i of range(5)) {
			if (rt.zone[i]=zone) { 
				if (rt.Shape = roomshape) {
					temp=temp+rt.Commonness
					break
				}
			}
		}	
	}
	
	let RandomRoom: int = Rand(temp)
	temp = 0
	for (rt of RoomTemplates.each) {
		for (i of range(5)) {
			if (rt.zone[i] == zone && rt.Shape == roomshape) {
				temp=temp+rt.Commonness
				if (RandomRoom > temp - rt.Commonness && RandomRoom <= temp) {
					r.RoomTemplate = rt
					
					if (rt.obj == 0) {
						LoadRoomMesh(rt)
					}
					
					r.obj = CopyEntity(rt.obj)
					ScaleEntity(r.obj, RoomScale, RoomScale, RoomScale)
					EntityType(r.obj, HIT_MAP)
					EntityPickMode(r.obj, 2)
					
					PositionEntity(r.obj, x, y, z)
					FillRoom(r)
					
					if (r.RoomTemplate.UseLightCones) {
						AddLightCones(r)
					}
					
					CalculateRoomExtents(r)
					return r	
				}
			}
		}
	}
	
	CatchErrors("CreateRoom")
}

function FillRoom(r: Rooms) {
	CatchErrors("Uncaught (FillRoom)")
	let d: Doors
	let d2: Doors
	let sc: SecurityCams
	let de: Decals
	let r2: Rooms
	let sc2: SecurityCams
	let it: Items
	let i: int
	let xtemp: int
	let ytemp: int
	let ztemp: int
	
	let t1
	
	switch (r.RoomTemplate.Name) {
		case "room860":
			//[Block]
			//the wooden door
			r.Objects[2] = LoadMesh_Strict("GFX/map/forest/door_frame.b3d")
			PositionEntity(r.Objects[2],r.x + 184.0 * RoomScale,0,r.z,true)
			ScaleEntity(r.Objects[2],45.0*RoomScale,45.0*RoomScale,80.0*RoomScale,true)
			EntityParent(r.Objects[2],r.obj)
			
			r.Objects[3] =  LoadMesh_Strict("GFX/map/forest/door.b3d")
			PositionEntity(r.Objects[3],r.x + 112.0 * RoomScale,0,r.z+0.05,true)
			EntityType(r.Objects[3], HIT_MAP)
			
			ScaleEntity(r.Objects[3],46.0*RoomScale,45.0*RoomScale,46.0*RoomScale,true)
			EntityParent(r.Objects[3],r.obj)
			
			r.Objects[4] = CopyEntity(r.Objects[3])
			PositionEntity(r.Objects[4],r.x + 256.0 * RoomScale,0,r.z-0.05,true)
			RotateEntity(r.Objects[4], 0,180,0)
			ScaleEntity(r.Objects[4],46.0*RoomScale,45.0*RoomScale,46.0*RoomScale,true)
			EntityParent(r.Objects[4],r.obj)
			
			//doors to observation booth
			d = CreateDoor(r.zone, r.x + 928.0 * RoomScale,0,r.z + 640.0 * RoomScale,0,r,False,False,False,"ABCD")
			d = CreateDoor(r.zone, r.x + 928.0 * RoomScale,0,r.z - 640.0 * RoomScale,0,r,true,False,False,"ABCD")
			d.AutoClose = False
			
			//doors to the room itself
			d = CreateDoor(r.zone, r.x+416.0*RoomScale,0,r.z - 640.0 * RoomScale,0,r,False,False,1)
			d = CreateDoor(r.zone, r.x+416.0*RoomScale,0,r.z + 640.0 * RoomScale,0,r,False,False,1)
			
			//the forest
			if (I_Zone.HasCustomForest = False) {
				let fr: Forest = new Forest()
				r.fr=fr
				GenForestGrid(fr)
				PlaceForest(fr,r.x,r.y+30.0,r.z,r)
			}
			
						
			it = CreateItem("Document SCP-860-1", "paper", r.x + 672.0 * RoomScale, r.y + 176.0 * RoomScale, r.z + 335.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle+10, 0)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-860", "paper", r.x + 1152.0 * RoomScale, r.y + 176.0 * RoomScale, r.z - 384.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle+170, 0)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "lockroom":
			//[Block]
			d = CreateDoor(r.zone, r.x - 736.0 * RoomScale, 0, r.z - 104.0 * RoomScale, 0, r, true)
			d.timer = 70 * 5
			d.AutoClose = False
			d.open = False
			
			EntityParent(d.buttons[0], 0)
			PositionEntity(d.buttons[0], r.x - 288.0 * RoomScale, 0.7, r.z - 640.0 * RoomScale)
			EntityParent(d.buttons[0], r.obj)
			
			FreeEntity(d.buttons[1])
			d.buttons[1] = 0
			
			d2 = CreateDoor(r.zone, r.x + 104.0 * RoomScale, 0, r.z + 736.0 * RoomScale, 270, r, true)
			d2.timer = 70 * 5
			d2.AutoClose = False
			d2.open = False
			EntityParent(d2.buttons[0], 0)
			PositionEntity(d2.buttons[0], r.x + 640.0 * RoomScale, 0.7, r.z + 288.0 * RoomScale)
			RotateEntity (d2.buttons[0], 0, 90, 0)
			EntityParent(d2.buttons[0], r.obj)
			
			FreeEntity(d2.buttons[1])
			d2.buttons[1] = 0
			
			d.LinkedDoor = d2
			d2.LinkedDoor = d
			
			sc.SecurityCams = CreateSecurityCam(r.x - 688.0 * RoomScale, r.y + 384 * RoomScale, r.z + 688.0 * RoomScale, r, true)
			sc.angle = 45 + 180
			sc.turn = 45
			sc.ScrTexture = 1
			EntityTexture(sc.ScrObj, ScreenTexs[sc.ScrTexture])
			
			TurnEntity(sc.CameraObj, 40, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			PositionEntity(sc.ScrObj, r.x + 668 * RoomScale, 1.1, r.z - 96.0 * RoomScale)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			EntityParent(sc.ScrObj, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 112.0 * RoomScale, r.y + 384 * RoomScale, r.z + 112.0 * RoomScale, r, true)
			sc.angle = 45
			sc.turn = 45
			sc.ScrTexture = 1
			EntityTexture(sc.ScrObj, ScreenTexs[sc.ScrTexture])
			
			TurnEntity(sc.CameraObj, 40, 0, 0)
			EntityParent(sc.obj, r.obj)				
			
			PositionEntity(sc.ScrObj, r.x + 96.0 * RoomScale, 1.1, r.z - 668.0 * RoomScale)
			EntityParent(sc.ScrObj, r.obj)
			
			let em: Emitters = CreateEmitter(r.x - 175.0 * RoomScale, 370.0 * RoomScale, r.z + 656.0 * RoomScale, 0)
			TurnEntity(em.Obj, 90, 0, 0, true)
			EntityParent(em.Obj, r.obj)
			em.RandAngle = 20
			em.Speed = 0.05
			em.SizeChange = 0.007
			em.Achange = -0.006
			em.Gravity = -0.24
			
			em.Emitters = CreateEmitter(r.x - 655.0 * RoomScale, 370.0 * RoomScale, r.z + 240.0 * RoomScale, 0)
			TurnEntity(em.Obj, 90, 0, 0, true)
			EntityParent(em.Obj, r.obj)
			em.RandAngle = 20
			em.Speed = 0.05
			em.SizeChange = 0.007
			em.Achange = -0.006
			em.Gravity = -0.24
			
			//This needs more work
		case "lockroom2":
			//[Block]
			for (i of range(6)) {
				de.Decals = CreateDecal(Rand(2,3), r.x+Rnd(-392,520)*RoomScale, 3.0*RoomScale+Rnd(0,0.001), r.z+Rnd(-392,520)*RoomScale,90,Rnd(360),0)
				de.Size = Rnd(0.3,0.6)
				ScaleSprite(de.obj, de.Size,de.Size)
				CreateDecal(Rand(15,16), r.x+Rnd(-392,520)*RoomScale, 3.0*RoomScale+Rnd(0,0.001), r.z+Rnd(-392,520)*RoomScale,90,Rnd(360),0)
				de.Size = Rnd(0.1,0.6)
				ScaleSprite(de.obj, de.Size,de.Size)
				CreateDecal(Rand(15,16), r.x+Rnd(-0.5,0.5), 3.0*RoomScale+Rnd(0,0.001), r.z+Rnd(-0.5,0.5),90,Rnd(360),0)
				de.Size = Rnd(0.1,0.6)
				ScaleSprite(de.obj, de.Size,de.Size)
			}
			
			sc.SecurityCams = CreateSecurityCam(r.x + 512.0 * RoomScale, r.y + 384 * RoomScale, r.z + 384.0 * RoomScale, r, true)
			sc.angle = 45 + 90
			sc.turn = 45
			TurnEntity(sc.CameraObj, 40, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			PositionEntity(sc.ScrObj, r.x + 668 * RoomScale, 1.1, r.z - 96.0 * RoomScale)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			EntityParent(sc.ScrObj, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 384.0 * RoomScale, r.y + 384 * RoomScale, r.z - 512.0 * RoomScale, r, true)
			sc.angle = 45 + 90 + 180
			sc.turn = 45
			
			TurnEntity(sc.CameraObj, 40, 0, 0)
			EntityParent(sc.obj, r.obj)				
			
			PositionEntity(sc.ScrObj, r.x + 96.0 * RoomScale, 1.1, r.z - 668.0 * RoomScale)
			EntityParent(sc.ScrObj, r.obj)
			//[End Block]
		case "gatea":
			//[Block]
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 4064.0 * RoomScale, r.y-1280.0*RoomScale, r.z + 3952.0 * RoomScale, 0, r, False)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = False
			
			d2 = CreateDoor(r.zone, r.x, r.y, r.z - 1024.0 * RoomScale, 0, r, False)
			d2.AutoClose = False
			d2.open = False
			d2.locked = true
			
			d2 = CreateDoor(r.zone, r.x-1440*RoomScale, r.y-480.0*RoomScale, r.z + 2328.0 * RoomScale, 0, r, False, False, 2)
			if (SelectedEnding == "A2") {
				d2.AutoClose = False
				d2.open = true
				d2.locked = true	
			} else {
				d2.AutoClose = False
				d2.open = False
				d2.locked = False	
			}	
			PositionEntity(d2.buttons[0], r.x-1320.0*RoomScale, EntityY(d2.buttons[0],true), r.z + 2288.0*RoomScale, true)
			PositionEntity(d2.buttons[1], r.x-1584*RoomScale, EntityY(d2.buttons[0],true), r.z + 2488.0*RoomScale, true	)
			RotateEntity (d2.buttons[1], 0, 90, 0, true)
			
			d2 = CreateDoor(r.zone, r.x-1440*RoomScale, r.y-480.0*RoomScale, r.z + 4352.0 * RoomScale, 0, r, False, False, 2)
			if (SelectedEnding == "A2") {
				d2.AutoClose = False
				d2.open = true
				d2.locked = true	
			} else {
				d2.AutoClose = False
				d2.open = False
				d2.locked = False
			}
			PositionEntity (d2.buttons[0], r.x-1320.0*RoomScale, EntityY(d2.buttons[0],true), r.z + 4384.0*RoomScale, true)
			RotateEntity (d2.buttons[0], 0, 180, 0, true	)
			PositionEntity (d2.buttons[1], r.x-1584.0*RoomScale, EntityY(d2.buttons[0],true), r.z + 4232.0*RoomScale, true	)
			RotateEntity( d2.buttons[1], 0, 90, 0, true	)
			
			for (r2 of Rooms.each) {
				if (r2.RoomTemplate.Name = "exit1") {
					r.Objects[1]=r2.Objects[1]
					r.Objects[2]=r2.Objects[2]	
				} else if (r2.RoomTemplate.Name = "gateaentrance") {
					//ylempi hissi
					r.RoomDoors[1] = CreateDoor(0, r.x+1544.0*RoomScale, r.y, r.z-64.0*RoomScale, 90, r, False, 3)
					r.RoomDoors[1].AutoClose = False
					r.RoomDoors[1].open = False
					PositionEntity(r.RoomDoors[1].buttons[0],r.x+1584*RoomScale, EntityY(r.RoomDoors[1].buttons[0],true), r.z+80*RoomScale, true)
					PositionEntity(r.RoomDoors[1].buttons[1],r.x+1456*RoomScale, EntityY(r.RoomDoors[1].buttons[1],true), r.z-208*RoomScale, true)	
					r2.Objects[1] = CreatePivot()
					PositionEntity(r2.Objects[1], r.x+1848.0*RoomScale, r.y+240.0*RoomScale, r.z-64.0*RoomScale, true)
					EntityParent (r2.Objects[1], r.obj)
				}
			}
			
			//106:n spawnpoint
			r.Objects[3]=CreatePivot()
			PositionEntity(r.Objects[3], r.x+1216.0*RoomScale, r.y, r.z+2112.0*RoomScale, true)
			EntityParent(r.Objects[3], r.obj)
			
			//sillan loppup��
			r.Objects[4]=CreatePivot()
			PositionEntity(r.Objects[4], r.x, r.y+96.0*RoomScale, r.z+6400.0*RoomScale, true)
			EntityParent(r.Objects[4], r.obj)
			
			//vartiotorni 1
			r.Objects[5]=CreatePivot()
			PositionEntity(r.Objects[5], r.x+1784.0*RoomScale, r.y+2124.0*RoomScale, r.z+4512.0*RoomScale, true)
			EntityParent(r.Objects[5], r.obj)
			
			//vartiotorni 2
			r.Objects[6]=CreatePivot()
			PositionEntity(r.Objects[6], r.x-5048.0*RoomScale, r.y+1912.0*RoomScale, r.z+4656.0*RoomScale, true)
			EntityParent(r.Objects[6], r.obj)
			
			//sillan takareuna
			r.Objects[7]=CreatePivot()
			PositionEntity(r.Objects[7], r.x+1824.0*RoomScale, r.y+224.0*RoomScale, r.z+7056.0*RoomScale, true)
			EntityParent(r.Objects[7], r.obj)
			
			//sillan takareuna2
			r.Objects[8]=CreatePivot()
			PositionEntity(r.Objects[8], r.x-1824.0*RoomScale, r.y+224.0*RoomScale, r.z+7056.0*RoomScale, true)
			EntityParent(r.Objects[8], r.obj)
			
			//"valopyssy"
			r.Objects[9]=CreatePivot()
			PositionEntity(r.Objects[9], r.x+2624.0*RoomScale, r.y+992.0*RoomScale, r.z+6157.0*RoomScale, true)
			EntityParent(r.Objects[9], r.obj)
			//objects[10] = valopyssyn yl�osa
			
			//tunnelin loppu
			r.Objects[11]=CreatePivot()
			PositionEntity(r.Objects[11], r.x-4064.0*RoomScale, r.y-1248.0*RoomScale, r.z-1696.0*RoomScale, true)
			EntityParent(r.Objects[11], r.obj)
			
			r.Objects[13]=LoadMesh_Strict("GFX/map/gateawall1.b3d",r.obj)
			PositionEntity(r.Objects[13], r.x-4308.0*RoomScale, r.y-1045.0*RoomScale, r.z+544.0*RoomScale, true)
			EntityColor(r.Objects[13], 25,25,25)
			EntityType(r.Objects[13],HIT_MAP)
			
			r.Objects[14]=LoadMesh_Strict("GFX/map/gateawall2.b3d",r.obj)
			PositionEntity(r.Objects[14], r.x-3820.0*RoomScale, r.y-1045.0*RoomScale, r.z+544.0*RoomScale, true)	
			EntityColor(r.Objects[14], 25,25,25)
			EntityType(r.Objects[14],HIT_MAP)
			
			r.Objects[15]=CreatePivot(r.obj)
			PositionEntity(r.Objects[15], r.x-3568.0*RoomScale, r.y-1089.0*RoomScale, r.z+4944.0*RoomScale, true)
			
			r.Objects[16] = LoadMesh_Strict("GFX/map/gatea_hitbox1.b3d",r.obj)
			EntityPickMode(r.Objects[16],2)
			EntityType(r.Objects[16],HIT_MAP)
			EntityAlpha(r.Objects[16],0.0)
			
			//[End Block]
		case "gateaentrance":
			//[Block]
			//alempi hissi
			r.RoomDoors[0] = CreateDoor(0, r.x+744.0*RoomScale, 0, r.z+512.0*RoomScale, 90, r, true, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = true
			PositionEntity(r.RoomDoors[0].buttons[1],r.x+688*RoomScale, EntityY(r.RoomDoors[0].buttons[1],true), r.z+368*RoomScale, true)
			PositionEntity(r.RoomDoors[0].buttons[0],r.x+784*RoomScale, EntityY(r.RoomDoors[0].buttons[0],true), r.z+656*RoomScale, true)
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x+1048.0*RoomScale, 0, r.z+512.0*RoomScale, true)
			EntityParent(r.Objects[0], r.obj)
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x, 0, r.z - 360.0 * RoomScale, 0, r, False, true, 5)
			r.RoomDoors[1].dir = 1
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			PositionEntity(r.RoomDoors[1].buttons[1], r.x+416*RoomScale, EntityY(r.RoomDoors[0].buttons[1],true), r.z-576*RoomScale, true)
			RotateEntity(r.RoomDoors[1].buttons[1],0,r.angle-90,0,true)
			PositionEntity(r.RoomDoors[1].buttons[0], r.x, 20.0, r.z, true)
			
			//[End Block]
		case "exit1":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x+4356.0*RoomScale, 9767.0*RoomScale, r.z+2588.0*RoomScale, true)
			
			r.RoomDoors[4] = CreateDoor(r.zone, r.x, 0, r.z - 320.0 * RoomScale, 0, r, False, true, 5)
			r.RoomDoors[4].dir = 1
			r.RoomDoors[4].AutoClose = False
			r.RoomDoors[4].open = False
			PositionEntity(r.RoomDoors[4].buttons[1], r.x+352*RoomScale, 0.7, r.z-528*RoomScale, true)
			RotateEntity(r.RoomDoors[4].buttons[1],0,r.angle-90,0,true)
			PositionEntity(r.RoomDoors[4].buttons[0], r.x, 7.0, r.z, true)		
			
			//k�yt�v�n takaosa
			r.Objects[3] = CreatePivot()
			PositionEntity(r.Objects[3], r.x-7680.0*RoomScale, 10992.0*RoomScale, r.z-27048.0*RoomScale, true)
			EntityParent(r.Objects[3], r.obj)
			
			//oikean puolen watchpoint 1
			r.Objects[4] = CreatePivot()
			PositionEntity(r.Objects[4], r.x+5203.36*RoomScale, 12128.0*RoomScale, r.z-1739.19*RoomScale, true)
			EntityParent(r.Objects[4], r.obj)
			//oikean puolen watchpoint 2
			r.Objects[5] = CreatePivot()
			PositionEntity(r.Objects[5], r.x+4363.02*RoomScale, 10536.0*RoomScale, r.z+2766.16*RoomScale, true)
			EntityParent(r.Objects[5], r.obj)
			//vasemman puolen watchpoint 1
			r.Objects[6] = CreatePivot()
			PositionEntity(r.Objects[6], r.x+5192.0*RoomScale, 12192.0*RoomScale, r.z-1760.0*RoomScale, True)
			EntityParent(r.Objects[6], r.obj)
			//vasemman puolen watchpoint 2
			r.Objects[7] = CreatePivot()
			PositionEntity(r.Objects[7], r.x+5192.0*RoomScale, 12192.0*RoomScale, r.z-4352.0*RoomScale, True)
			EntityParent(r.Objects[7], r.obj)
			
			//alempi hissi
			r.RoomDoors[0] = CreateDoor(0, r.x+720.0*RoomScale, 0, r.z+1432.0*RoomScale, 0, r, True, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			MoveEntity(r.RoomDoors[0].buttons[0],0,0,22.0*RoomScale)
			MoveEntity(r.RoomDoors[0].buttons[1],0,0,22.0*RoomScale	)
			r.Objects[8] = CreatePivot()
			PositionEntity(r.Objects[8], r.x+720.0*RoomScale, 0, r.z+1744.0*RoomScale, True)
			EntityParent(r.Objects[8], r.obj)
			
			//ylempi hissi
			r.RoomDoors[1] = CreateDoor(0, r.x-5424.0*RoomScale, 10784.0*RoomScale, r.z-1380.0*RoomScale, 0, r, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			MoveEntity(r.RoomDoors[1].buttons[0],0,0,22.0*RoomScale)
			MoveEntity(r.RoomDoors[1].buttons[1],0,0,22.0*RoomScale)
			r.Objects[9] = CreatePivot()
			PositionEntity(r.Objects[9], r.x-5424.0*RoomScale, 10784.0*RoomScale, r.z-1068.0*RoomScale, True)
			EntityParent(r.Objects[9], r.obj)
			
			r.RoomDoors[2] = CreateDoor(0, r.x+4352.0*RoomScale, 10784.0*RoomScale, r.z-492.0*RoomScale, 0, r, False)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = False	
			
			r.RoomDoors[3] = CreateDoor(0, r.x+4352.0*RoomScale, 10784.0*RoomScale, r.z+500.0*RoomScale, 0, r, False)
			r.RoomDoors[3].AutoClose = False
			r.RoomDoors[3].open = False	
			
			//walkway
			r.Objects[10] = CreatePivot()
			PositionEntity(r.Objects[10], r.x+4352.0*RoomScale, 10778.0*RoomScale, r.z+1344.0*RoomScale, True)
			EntityParent(r.Objects[10], r.obj	)
			
			//"682"
			r.Objects[11] = CreatePivot()
			PositionEntity(r.Objects[11], r.x+2816.0*RoomScale, 11024.0*RoomScale, r.z-2816.0*RoomScale, True)
			EntityParent(r.Objects[11], r.obj)
						
			//"valvomon" takaovi
			r.RoomDoors[5] = CreateDoor(0, r.x+3248.0*RoomScale, 9856.0*RoomScale, r.z+6400.0*RoomScale, 0, r, False, False, 0, "ABCD")
			r.RoomDoors[5].AutoClose = False
			r.RoomDoors[5].open = False		
			
			//"valvomon" etuovi
			d.Doors = CreateDoor(0, r.x+3072.0*RoomScale, 9856.0*RoomScale, r.z+5800.0*RoomScale, 90, r, False, False, 3)
			d.AutoClose = False
			d.open = False
			
			r.Objects[14] = CreatePivot()
			PositionEntity(r.Objects[14], r.x+3536.0*RoomScale, 10256.0*RoomScale, r.z+5512.0*RoomScale, True)
			EntityParent(r.Objects[14], r.obj)
			r.Objects[15] = CreatePivot()
			PositionEntity(r.Objects[15], r.x+3536.0*RoomScale, 10256.0*RoomScale, r.z+5824.0*RoomScale, True)
			EntityParent(r.Objects[15], r.obj)
			r.Objects[16] = CreatePivot()
			PositionEntity(r.Objects[16], r.x+3856.0*RoomScale, 10256.0*RoomScale, r.z+5512.0*RoomScale, True)
			EntityParent(r.Objects[16], r.obj)
			r.Objects[17] = CreatePivot()
			PositionEntity(r.Objects[17], r.x+3856.0*RoomScale, 10256.0*RoomScale, r.z+5824.0*RoomScale, True)
			EntityParent(r.Objects[17], r.obj)
			
			//MTF:n spawnpoint
			r.Objects[18] = CreatePivot()
			//PositionEntity(r.Objects[18], r.x+3727.0*RoomScale, 10066.0*RoomScale, r.z+6623.0*RoomScale, True)
			PositionEntity(r.Objects[18], r.x+3250.0*RoomScale, 9896.0*RoomScale, r.z+6623.0*RoomScale, True)
			EntityParent(r.Objects[18], r.obj)
			
			//piste johon helikopterit pakenee nukea
			r.Objects[19] = CreatePivot()
			PositionEntity(r.Objects[19], r.x+3808.0*RoomScale, 12320.0*RoomScale, r.z-13568.0*RoomScale, True)
			EntityParent(r.Objects[19], r.obj)
			
			//[End Block]
		case "roompj":
			//[Block]
			it = CreateItem("Document SCP-372", "paper", r.x + 800.0 * RoomScale, r.y + 176.0 * RoomScale, r.z + 1108.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle, 0)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Radio Transceiver", "radio", r.x + 800.0 * RoomScale, r.y + 112.0 * RoomScale, r.z + 944.0 * RoomScale)
			it.state = 80.0
			EntityParent(it.collider, r.obj)
			
			r.Objects[3] = LoadMesh_Strict("GFX/map/372_hb.b3d",r.obj)
			EntityPickMode(r.Objects[3],2)
			EntityType(r.Objects[3],HIT_MAP)
			EntityAlpha(r.Objects[3],0.0)
			
			d = CreateDoor(r.zone,r.x,r.y,r.z-368.0*RoomScale,0,r,True,True,2)
			d.AutoClose = False
			PositionEntity (d.buttons[0], r.x - 496.0 * RoomScale, 0.7, r.z - 272.0 * RoomScale, True)
			TurnEntity(d.buttons[0], 0, 90, 0)
			//[End Block]
		case "room079":
			//[Block]
			d = CreateDoor(r.zone, r.x, -448.0*RoomScale, r.z + 1136.0 * RoomScale, 0, r, False,True, 4)
			d.dir = 1
			d.AutoClose = False
			d.open = False
			PositionEntity(d.buttons[1], r.x + 224.0 * RoomScale, -250*RoomScale, r.z + 918.0 * RoomScale, True)
			PositionEntity(d.buttons[0], r.x - 240.0 * RoomScale, -250*RoomScale, r.z + 1366.0 * RoomScale, True)
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 1456.0*RoomScale, -448.0*RoomScale, r.z + 976.0 * RoomScale, 0, r, False, True, 3)
			r.RoomDoors[0].dir = 1
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			PositionEntity(r.RoomDoors[0].buttons[1], r.x + 1760.0 * RoomScale, -250*RoomScale, r.z + 1236.0 * RoomScale, True)
			TurnEntity(r.RoomDoors[0].buttons[0],0,-90-90,0,True)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 1760.0 * RoomScale, -240*RoomScale, r.z + 740.0 * RoomScale, True)
			TurnEntity(r.RoomDoors[0].buttons[1],0, 90-90,0,True)
			
			CreateDoor(0, r.x + 1144.0*RoomScale, -448.0*RoomScale, r.z + 704.0 * RoomScale, 90, r, False, False, -1)
			
			r.Objects[0] = LoadAnimMesh_Strict("GFX/map/079.b3d")
			ScaleEntity(r.Objects[0], 1.3, 1.3, 1.3, True)
			PositionEntity (r.Objects[0], r.x + 1856.0*RoomScale, -560.0*RoomScale, r.z-672.0*RoomScale, True)
			EntityParent(r.Objects[0], r.obj)
			TurnEntity(r.Objects[0],0,180,0,True)
			
			r.Objects[1] = CreateSprite(r.Objects[0])
			SpriteViewMode(r.Objects[1],2)
			PositionEntity(r.Objects[1], 0.082, 0.119, 0.010)
			ScaleSprite(r.Objects[1],0.18*0.5,0.145*0.5)
			TurnEntity(r.Objects[1],0,13.0,0)
			MoveEntity(r.Objects[1], 0,0,-0.022)
			EntityTexture (r.Objects[1],OldAiPics(0))
			
			HideEntity(r.Objects[1])
			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity (r.Objects[2], r.x + 1184.0*RoomScale, -448.0*RoomScale, r.z+1792.0*RoomScale, True)
			
			de.Decals = CreateDecal(3,  r.x + 1184.0*RoomScale, -448.0*RoomScale+0.01, r.z+1792.0*RoomScale,90,Rnd(360),0)
			de.Size = 0.5
			ScaleSprite(de.obj, de.Size,de.Size)
			EntityParent(de.obj, r.obj)
			//[End Block]
		case "checkpoint1":
			//[Block]
			r.RoomDoors[0] = CreateDoor(0, r.x + 48.0*RoomScale, 0, r.z - 128.0 * RoomScale, 0, r, False, False, 3)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x - 152.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z - 352.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[0].buttons[1], r.x - 152.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[1],True), r.z + 96.0 * RoomScale, True)
			
			r.RoomDoors[1] = CreateDoor(0, r.x - 352.0*RoomScale, 0, r.z - 128.0 * RoomScale, 0, r, False, False, 3)
			
			r.RoomDoors[1].LinkedDoor = r.RoomDoors[0]
			r.RoomDoors[0].LinkedDoor = r.RoomDoors[1]
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity (r.Objects[0], r.x + 720.0*RoomScale, 120.0*RoomScale, r.z+333.0*RoomScale, True)
			
			r.RoomDoors[0].timer = 70 * 5
			r.RoomDoors[1].timer = 70 * 5
			
			sc.SecurityCams = CreateSecurityCam(r.x+192.0*RoomScale, r.y+704.0*RoomScale, r.z-960.0*RoomScale, r)
			sc.angle = 45
			sc.turn = 0
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
			r.Objects[2] = CopyEntity(Monitor2,r.obj)
			ScaleEntity(r.Objects[2], 2.0, 2.0, 2.0)
			PositionEntity (r.Objects[2], r.x - 152.0*RoomScale, 384.0*RoomScale, r.z+124.0*RoomScale, True)
			RotateEntity (r.Objects[2],0,180,0)
			EntityFX(r.Objects[2],1)
			
			r.Objects[3] = CopyEntity(Monitor2,r.obj)
			ScaleEntity(r.Objects[3], 2.0, 2.0, 2.0)
			PositionEntity (r.Objects[3], r.x - 152.0*RoomScale, 384.0*RoomScale, r.z-380.0*RoomScale, True)
			RotateEntity (r.Objects[3],0,0,0)
			EntityFX(r.Objects[3],1)
			
			if (MapTemp(Floor(r.x / 8.0),Floor(r.z /8.0)-1) == 0) {
				CreateDoor(r.zone, r.x, 0, r.z  - 4.0, 0, r, 0, False, 0, "GEAR")
			}
			//[End Block]
		case "checkpoint2":
			//[Block]
			r.RoomDoors[0]= CreateDoor(0, r.x - 48.0*RoomScale, 0, r.z + 128.0 * RoomScale, 0, r, False, False, 5)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 152.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z - 96.0 * RoomScale, True)			
			PositionEntity(r.RoomDoors[0].buttons[1], r.x + 152.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[1],True), r.z + 352.0 * RoomScale, True)
			
			r.RoomDoors[1] = CreateDoor(0, r.x + 352.0*RoomScale, 0, r.z + 128.0 * RoomScale, 0, r, False, False, 5)
			
			r.RoomDoors[1].LinkedDoor = r.RoomDoors[0]
			r.RoomDoors[0].LinkedDoor = r.RoomDoors[1]
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity (r.Objects[0], r.x - 720.0*RoomScale, 120.0*RoomScale, r.z+464.0*RoomScale, True)
			
			r.Objects[2] = CopyEntity(Monitor3,r.obj)
			ScaleEntity(r.Objects[2], 2.0, 2.0, 2.0)
			PositionEntity (r.Objects[2], r.x + 152.0*RoomScale, 384.0*RoomScale, r.z+380.0*RoomScale, True)
			RotateEntity (r.Objects[2],0,180,0)
			EntityFX(r.Objects[2],1)
			
			r.Objects[3] = CopyEntity(Monitor3,r.obj)
			ScaleEntity(r.Objects[3], 2.0, 2.0, 2.0)
			PositionEntity (r.Objects[3], r.x + 152.0*RoomScale, 384.0*RoomScale, r.z-124.0*RoomScale, True)
			RotateEntity (r.Objects[3],0,0,0)
			EntityFX(r.Objects[3],1)
			
			r.RoomDoors[0].timer = 70 * 5
			r.RoomDoors[1].timer = 70 * 5
			
			if (MapTemp(Floor(r.x / 8.0),Floor(r.z /8.0)-1) == 0) {
				CreateDoor(r.zone, r.x, 0, r.z  - 4.0, 0, r, 0, False, 0, "GEAR")
			}
			//[End Block]
		case "room2pit":
			//[Block]
			i = 0
			for (xtemp of range(-1, 2, 2)) {
				for (ztemp of range(-1, 2)) {
					em.Emitters = CreateEmitter(r.x + 202.0 * RoomScale * xtemp, 8.0 * RoomScale, r.z + 256.0 * RoomScale * ztemp, 0)
					em.RandAngle = 30
					em.Speed = 0.0045
					em.SizeChange = 0.007
					em.Achange = -0.016
					r.Objects[i] = em.Obj
					if (i < 3) { 
						TurnEntity(em.Obj, 0, -90, 0, True) 
					} else { 
						TurnEntity(em.Obj, 0, 90, 0, True)
					}
					TurnEntity(em.Obj, -45, 0, 0, True)
					EntityParent(em.Obj, r.obj)
					i=i+1
				}
			}
			
			r.Objects[6] = CreatePivot()
			PositionEntity(r.Objects[6], r.x + 640.0 * RoomScale, 8.0 * RoomScale, r.z - 896.0 * RoomScale)
			EntityParent(r.Objects[6], r.obj)
			
			r.Objects[7] = CreatePivot()
			PositionEntity(r.Objects[7], r.x - 864.0 * RoomScale, -400.0 * RoomScale, r.z - 632.0 * RoomScale)
			EntityParent(r.Objects[7],r.obj)
			//[End Block]
		case "room2testroom2":
			//[Block]
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x - 640.0 * RoomScale, 0.5, r.z - 912.0 * RoomScale)
			EntityParent(r.Objects[0], r.obj)
			
			r.Objects[1] = CreatePivot()
			PositionEntity(r.Objects[1], r.x - 669.0 * RoomScale, 0.5, r.z - 16.0 * RoomScale) //r.x - 632
			EntityParent(r.Objects[1], r.obj)
			
			let Glasstex = LoadTexture_Strict("GFX/map/glass.png",1+2)
			r.Objects[2] = CreateSprite()
			EntityTexture(r.Objects[2],Glasstex)
			SpriteViewMode(r.Objects[2],2)
			ScaleSprite(r.Objects[2],182.0*RoomScale*0.5, 192.0*RoomScale*0.5)
			PositionEntity(r.Objects[2], r.x - 632.0 * RoomScale, 224.0*RoomScale, r.z - 208.0 * RoomScale)
			TurnEntity(r.Objects[2],0,180,0)			
			EntityParent(r.Objects[2], r.obj)
			HideEntity (r.Objects[2])
			
			FreeTexture (Glasstex)
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 240.0 * RoomScale, 0.0, r.z + 640.0 * RoomScale, 90, r, False, False, 1)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			
			d = CreateDoor(r.zone, r.x - 512.0 * RoomScale, 0.0, r.z + 384.0 * RoomScale, 0, r, False, False)
			d.AutoClose = False
			d.open = False					
						
			it = CreateItem("Level 2 Key Card", "key2", r.x - 914.0 * RoomScale, r.y + 137.0 * RoomScale, r.z + 61.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("S-NAV 300 Navigator", "nav", r.x - 312.0 * RoomScale, r.y + 264.0 * RoomScale, r.z + 176.0 * RoomScale)
			it.state = 20
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room3tunnel":
			//[Block]
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity (r.Objects[0], r.x - 190.0*RoomScale, 4.0*RoomScale, r.z+190.0*RoomScale, True)
			
			//[End Block]
		case "room2toilets":
			//[Block]
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x + 1040.0 * RoomScale, 192.0 * RoomScale, r.z)
			EntityParent(r.Objects[0], r.obj)
			
			r.Objects[1] = CreatePivot()
			PositionEntity(r.Objects[1], r.x + 1530.0*RoomScale, 0.5, r.z+512.0*RoomScale)
			EntityParent(r.Objects[1], r.obj)
			
			r.Objects[2] = CreatePivot()
			PositionEntity(r.Objects[2], r.x + 1535.0*RoomScale, r.y+150.0*RoomScale, r.z+512.0*RoomScale)
			EntityParent(r.Objects[2], r.obj)
			//[End Block]
		case "room2storage":
			//[Block]
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 1288.0 * RoomScale, 0, r.z, 270, r)
			r.RoomDoors[1] = CreateDoor(r.zone, r.x - 760.0 * RoomScale, 0, r.z, 270, r)
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 264.0 * RoomScale, 0, r.z, 270, r)
			r.RoomDoors[3] = CreateDoor(r.zone, r.x + 264.0 * RoomScale, 0, r.z, 270, r)
			r.RoomDoors[4] = CreateDoor(r.zone, r.x + 760.0 * RoomScale, 0, r.z, 270, r)
			r.RoomDoors[5] = CreateDoor(r.zone, r.x + 1288.0 * RoomScale, 0, r.z, 270, r)
			
			for (i of range(6)) {
				MoveEntity(r.RoomDoors[i].buttons[0], 0,0,-8.0)
				MoveEntity(r.RoomDoors[i].buttons[1], 0,0,-8.0)
				r.RoomDoors[i].AutoClose = False
				r.RoomDoors[i].open = False				
			}
			
			it = CreateItem("Document SCP-939", "paper", r.x + 352.0 * RoomScale, r.y + 176.0 * RoomScale, r.z + 256.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle+4, 0)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("9V Battery", "bat", r.x + 352.0 * RoomScale, r.y + 112.0 * RoomScale, r.z + 448.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Empty Cup", "emptycup", r.x-672*RoomScale, 240*RoomScale, r.z+288.0*RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Level 1 Key Card", "key1", r.x - 672.0 * RoomScale, r.y + 240.0 * RoomScale, r.z + 224.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2sroom":
			//[Block]
			d = CreateDoor(r.zone, r.x + 1440.0 * RoomScale, 224.0 * RoomScale, r.z + 32.0 * RoomScale, 90, r, False, False, 4)
			d.AutoClose = False
			d.open = False
			
			it = CreateItem("Some SCP-420-J", "420", r.x + 1776.0 * RoomScale, r.y + 400.0 * RoomScale, r.z + 427.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Some SCP-420-J", "420", r.x + 1808.0 * RoomScale, r.y + 400.0 * RoomScale, r.z + 435.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Level 5 Key Card", "key5", r.x + 2232.0 * RoomScale, r.y + 392.0 * RoomScale, r.z + 387.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle, 0, True)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Nuclear Device Document", "paper", r.x + 2248.0 * RoomScale, r.y + 440.0 * RoomScale, r.z + 372.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Radio Transceiver", "radio", r.x + 2240.0 * RoomScale, r.y + 320.0 * RoomScale, r.z + 128.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2shaft":
			//[Block]
			d = CreateDoor(r.zone, r.x + 1552.0 * RoomScale, r.y, r.z + 552.0 * RoomScale, 0, r, False, False)
			PositionEntity(d.buttons[0], EntityX(d.buttons[0],True), EntityY(d.buttons[0],True), r.z + 518.0 * RoomScale, True)
			PositionEntity(d.buttons[1], EntityX(d.buttons[1],True), EntityY(d.buttons[1],True), r.z + 575.0 * RoomScale, True)
			d.AutoClose = False
			d.open = False
			
			d = CreateDoor(r.zone, r.x + 256.0 * RoomScale, r.y, r.z + 744.0 * RoomScale, 90, r, False, False, 2)
			d.AutoClose = False
			d.open = False
			
			it = CreateItem("Level 3 Key Card", "key3", r.x + 1119.0 * RoomScale, r.y + 233.0 * RoomScale, r.z + 494.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("First Aid Kit", "firstaid", r.x + 1035.0 * RoomScale, r.y + 145.0 * RoomScale, r.z + 56.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, 90, 0)
			
			it = CreateItem("9V Battery", "bat", r.x + 1930.0 * RoomScale, r.y + 97.0 * RoomScale, r.z + 256.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("9V Battery", "bat", r.x + 1061.0 * RoomScale, r.y + 161.0 * RoomScale, r.z + 494.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("ReVision Eyedrops", "eyedrops", r.x + 1930.0*RoomScale, r.y + 225.0 * RoomScale, r.z + 128.0*RoomScale)
			EntityParent(it.collider, r.obj)
			
			//Player's position after leaving the pocket dimension
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0],r.x+1560.0*RoomScale,r.y,r.z+250.0*RoomScale,True)
			
			r.Objects[1] = CreatePivot(r.obj)
            PositionEntity(r.Objects[1],r.x + 1344.0 * RoomScale, -752.0 * RoomScale,r.z - 384.0 * RoomScale,True)
            
            de.Decals = CreateDecal(3,  r.x + 1334.0*RoomScale, -796.0*RoomScale+0.01, r.z-220.0*RoomScale,90,Rnd(360),0)
            de.Size = 0.25
            ScaleSprite(de.obj, de.Size,de.Size)
            EntityParent(de.obj, r.obj)
			
			r.Objects[2] = CreateButton(r.x + 1181.0 *RoomScale, r.y + 180.0 * RoomScale, r.z - 512.0 * RoomScale, 0, 270)
            EntityParent (r.Objects[2],r.obj)
			//[End Block]
		case "room2poffices":
			//[Block]
			d = CreateDoor(r.zone, r.x + 240.0 * RoomScale, 0.0, r.z + 448.0 * RoomScale, 90, r, False, False, 0, Str(AccessCode))
			PositionEntity(d.buttons[0], r.x + 248.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True),True)
			PositionEntity(d.buttons[1], r.x + 232.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True),True)			
			d.AutoClose = False
			d.open = False
			
			d = CreateDoor(r.zone, r.x - 496.0 * RoomScale, 0.0, r.z, 90, r, False, False, 0, "ABCD")
			PositionEntity(d.buttons[0], r.x - 488.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True),True)
			PositionEntity(d.buttons[1], r.x - 504.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True),True)				
			d.AutoClose = False
			d.open = False
			d.locked = True	
			
			d = CreateDoor(r.zone, r.x + 240.0 * RoomScale, 0.0, r.z - 576.0 * RoomScale, 90, r, False, False, 0, "7816")
			PositionEntity(d.buttons[0], r.x + 248.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True),True)
			PositionEntity(d.buttons[1], r.x + 232.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True),True)		
			d.AutoClose = False
			d.open = False	
			
			it = CreateItem("Mysterious Note", "paper", r.x + 736.0 * RoomScale, r.y + 224.0 * RoomScale, r.z + 544.0 * RoomScale)
			EntityParent(it.collider, r.obj)	
			it = CreateItem("Ballistic Vest", "vest", r.x + 608.0 * RoomScale, r.y + 112.0 * RoomScale, r.z + 32.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, 90, 0)
			
			it = CreateItem("Incident Report SCP-106-0204", "paper", r.x + 704.0 * RoomScale, r.y + 183.0 * RoomScale, r.z - 576.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("Journal Page", "paper", r.x + 912 * RoomScale, r.y + 176.0 * RoomScale, r.z - 160.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("First Aid Kit", "firstaid", r.x + 912.0 * RoomScale, r.y + 112.0 * RoomScale, r.z - 336.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, 90, 0)
			//[End Block]
		case "room2poffices2":
			//[Block]
			d = CreateDoor(r.zone, r.x + 240.0 * RoomScale, 0.0, r.z + 48.0 * RoomScale, 270, r, False, False, 3)
			PositionEntity(d.buttons[0], r.x + 224.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 176.0 * RoomScale,True)
			PositionEntity(d.buttons[1], r.x + 256.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True),True)			
			d.AutoClose = False
			d.open = False
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 432.0 * RoomScale, 0.0, r.z, 90, r, False, False, 0, "1234")
			PositionEntity(r.RoomDoors[0].buttons[0], r.x - 416.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z + 176.0 * RoomScale,True)
			FreeEntity(r.RoomDoors[0].buttons[1])
			r.RoomDoors[0].buttons[1] = 0
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			r.RoomDoors[0].locked = True	
			
			de.Decals = CreateDecal(0, r.x - 808.0 * RoomScale, 0.005, r.z - 72.0 * RoomScale, 90, Rand(360), 0)
			EntityParent(de.obj, r.obj)
			de.Decals = CreateDecal(2, r.x - 808.0 * RoomScale, 0.01, r.z - 72.0 * RoomScale, 90, Rand(360), 0)
			de.Size = 0.3
			ScaleSprite(de.obj, de.Size, de.Size)
			EntityParent(de.obj, r.obj)
			
			de.Decals = CreateDecal(0, r.x - 432.0 * RoomScale, 0.01, r.z, 90, Rand(360), 0)
			EntityParent(de.obj, r.obj)
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x - 808.0 * RoomScale, 1.0, r.z - 72.0 * RoomScale, True)
			
			it = CreateItem("Dr. L's Burnt Note", "paper", r.x - 688.0 * RoomScale, 1.0, r.z - 16.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Dr L's Burnt Note", "paper", r.x - 808.0 * RoomScale, 1.0, r.z - 72.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("The Modular Site Project", "paper", r.x + 622.0*RoomScale, r.y + 125.0*RoomScale, r.z - 73.0*RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2elevator":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x+888.0*RoomScale, 240.0*RoomScale, r.z, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x+1024.0*RoomScale-0.01, 120.0*RoomScale, r.z, True)
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 448.0 * RoomScale, 0.0, r.z, 90, r, False, 3)
			PositionEntity(r.RoomDoors[0].buttons[1], r.x + 416.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[1],True), r.z - 208.0 * RoomScale,True)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 480.0 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z + 184.0 * RoomScale,True)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			r.RoomDoors[0].locked = True
			//[End Block]
		case "room2cafeteria":
			//[Block]
			//scp-294
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x+1847.0*RoomScale, -240.0*RoomScale, r.z-321*RoomScale, True)
			//"spawnpoint" for the cups
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x+1780.0*RoomScale, -248.0*RoomScale, r.z-276*RoomScale, True)
			
			it = CreateItem("cup", "cup", r.x-508.0*RoomScale, -187*RoomScale, r.z+284.0*RoomScale, 240,175,70)
			EntityParent(it.collider, r.obj)
			it.name = "Cup of Orange Juice"
			
			it = CreateItem("cup", "cup", r.x+1412 * RoomScale, -187*RoomScale, r.z-716.0 * RoomScale, 87,62,45)
			EntityParent(it.collider, r.obj)
			it.name = "Cup of Coffee"
			
			it = CreateItem("Empty Cup", "emptycup", r.x-540*RoomScale, -187*RoomScale, r.z+124.0*RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Quarter", "25ct", r.x-447.0*RoomScale, r.y-334.0*RoomScale, r.z+36.0*RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("Quarter", "25ct", r.x+1409.0*RoomScale, r.y-334.0*RoomScale, r.z-732.0*RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2nuke":
			//[Block]
			//"tuulikaapin" ovi
			d = CreateDoor(r.zone, r.x + 576.0 * RoomScale, 0.0, r.z + 152.0 * RoomScale, 90, r, False, False, 5)
			d.AutoClose = False
			d.open = False
			PositionEntity(d.buttons[0], r.x + 602.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 20.0 * RoomScale,True)
			PositionEntity(d.buttons[1], r.x + 550.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 20.0 * RoomScale,True)
			FreeEntity(d.obj2)
			d.obj2 = 0
			
			d = CreateDoor(r.zone, r.x - 544.0 * RoomScale, 1504.0*RoomScale, r.z + 738.0 * RoomScale, 90, r, False, False, 5)
			d.AutoClose = False
			d.open = False			
			PositionEntity(d.buttons[0], EntityX(d.buttons[0],True), EntityY(d.buttons[0],True), r.z + 608.0 * RoomScale,True)
			PositionEntity(d.buttons[1], EntityX(d.buttons[1],True), EntityY(d.buttons[1],True), r.z + 608.0 * RoomScale,True)
			
			//yl�kerran hissin ovi
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 1192.0 * RoomScale, 0.0, r.z, 90, r, True, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			//yl�kerran hissi
			r.Objects[4] = CreatePivot()
			PositionEntity(r.Objects[4], r.x + 1496.0 * RoomScale, 240.0 * RoomScale, r.z)
			EntityParent(r.Objects[4], r.obj)
			//alakerran hissin ovi
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 680.0 * RoomScale, 1504.0 * RoomScale, r.z, 90, r, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			//alakerran hissi
			r.Objects[5] = CreatePivot()
			PositionEntity(r.Objects[5], r.x + 984.0 * RoomScale, 1744.0 * RoomScale, r.z)
			EntityParent(r.Objects[5], r.obj)
			
			for (n of range(2)) {
				r.Objects[n * 2] = CopyEntity(LeverBaseOBJ)
				r.Objects[n * 2 + 1] = CopyEntity(LeverOBJ)
				r.Levers[n] = r.Objects[n * 2 + 1]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n * 2 + i], 0.04, 0.04, 0.04)
					PositionEntity (r.Objects[n * 2 + i], r.x - 975.0 * RoomScale, r.y + 1712.0 * RoomScale, r.z - (502.0-132.0*n) * RoomScale, True)
					
					EntityParent(r.Objects[n * 2 + i], r.obj)
				}
				RotateEntity(r.Objects[n * 2], 0, -90-180, 0)
				RotateEntity(r.Objects[n * 2 + 1], 10, -90 - 180-180, 0)
				
				EntityPickMode(r.Objects[n * 2 + 1], 1, False)
				EntityRadius(r.Objects[n * 2 + 1], 0.1)
			}
			
			it = CreateItem("Nuclear Device Document", "paper", r.x - 768.0 * RoomScale, r.y + 1684.0 * RoomScale, r.z - 768.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Ballistic Vest", "vest", r.x - 944.0 * RoomScale, r.y + 1652.0 * RoomScale, r.z - 656.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, -90, 0)
			
			sc.SecurityCams = CreateSecurityCam(r.x+624.0*RoomScale, r.y+1888.0*RoomScale, r.z-312.0*RoomScale, r)
			sc.angle = 90
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
			r.Objects[6] = CreatePivot()
			PositionEntity (r.Objects[6],r.x+1110.0*RoomScale,r.y+36.0*RoomScale,r.z-208.0*RoomScale)
			EntityParent(r.Objects[6],r.obj)
			//[End Block]
		case "room2tunnel":
			//[Block]
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x + 2640.0 * RoomScale, -2496.0 * RoomScale, r.z + 400.0 * RoomScale)
			EntityParent(r.Objects[0], r.obj)
			
			r.Objects[1] = CreatePivot()
			PositionEntity(r.Objects[1], r.x - 4336.0 * RoomScale, -2496.0 * RoomScale, r.z - 2512.0 * RoomScale)
			EntityParent(r.Objects[1], r.obj)
			
			r.Objects[2] = CreatePivot()
			RotateEntity(r.Objects[2],0.0,180.0,0.0,True)
			PositionEntity(r.Objects[2], r.x + 552.0 * RoomScale, 240.0 * RoomScale, r.z + 656.0 * RoomScale)
			EntityParent(r.Objects[2], r.obj)
		
			r.Objects[4] = CreatePivot()
			PositionEntity(r.Objects[4], r.x - 552.0 * RoomScale, 240.0 * RoomScale, r.z - 656.0 * RoomScale)
			EntityParent(r.Objects[4], r.obj)
		
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 264.0 * RoomScale, 0.0, r.z + 656.0 * RoomScale, 90, r, True, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			PositionEntity(r.RoomDoors[0].buttons[1], r.x + 224.0 * RoomScale, 0.7, r.z + 480.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 304.0 * RoomScale, 0.7, r.z + 832.0 * RoomScale, True)			
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 264.0 * RoomScale, 0.0, r.z - 656.0 * RoomScale, 90, r, True, 3)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = True
			PositionEntity(r.RoomDoors[2].buttons[0], r.x - 224.0 * RoomScale, 0.7, r.z - 480.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[2].buttons[1], r.x - 304.0 * RoomScale, 0.7, r.z - 832.0 * RoomScale, True)
		
			temp = ((Int(AccessCode)*3) % 10000)
			if (temp < 1000) {
				temp = temp+1000
			}
			d.Doors = CreateDoor(0, r.x,r.y,r.z,0, r, False, True, False, temp)
			PositionEntity(d.buttons[0], r.x + 224.0 * RoomScale, r.y + 0.7, r.z - 384.0 * RoomScale, True)
			RotateEntity (d.buttons[0], 0,-90,0,True)
			PositionEntity(d.buttons[1], r.x - 224.0 * RoomScale, r.y + 0.7, r.z + 384.0 * RoomScale, True)		
			RotateEntity (d.buttons[1], 0,90,0,True)
			
			de.Decals = CreateDecal(0, r.x + 64.0 * RoomScale, 0.005, r.z + 144.0 * RoomScale, 90, Rand(360), 0)
			EntityParent(de.obj, r.obj)
			it = CreateItem("Scorched Note", "paper", r.x + 64.0 * RoomScale, r.y +144.0 * RoomScale, r.z - 384.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "008":
			//[Block]
			//the container
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x + 292.0 * RoomScale, 130.0*RoomScale, r.z + 516.0 * RoomScale, True)
			
			//the lid of the container
			r.Objects[1] = LoadMesh_Strict("GFX/map/008_2.b3d")
			ScaleEntity (r.Objects[1], RoomScale, RoomScale, RoomScale)
			PositionEntity(r.Objects[1], r.x + 292 * RoomScale, 151 * RoomScale, r.z + 576.0 * RoomScale, 0)
			EntityParent(r.Objects[1], r.obj)
			
			RotateEntity(r.Objects[1],89,0,0,True)
			
			r.Levers[0] = r.Objects[1]
			
			Glasstex = LoadTexture_Strict("GFX/map/glass.png",1+2)
			r.Objects[2] = CreateSprite()
			EntityTexture(r.Objects[2],Glasstex)
			SpriteViewMode(r.Objects[2],2)
			ScaleSprite(r.Objects[2],256.0*RoomScale*0.5, 194.0*RoomScale*0.5)
			PositionEntity(r.Objects[2], r.x - 176.0 * RoomScale, 224.0*RoomScale, r.z + 448.0 * RoomScale)
			TurnEntity(r.Objects[2],0,90,0)			
			EntityParent(r.Objects[2], r.obj)
			
			FreeTexture (Glasstex)
			
			//scp-173 spawnpoint
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x - 445.0 * RoomScale, 120.0*RoomScale, r.z + 544.0 * RoomScale, True)
			
			//scp-173 attack point
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x + 67.0 * RoomScale, 120.0*RoomScale, r.z + 464.0 * RoomScale, True)
			
			r.Objects[5] = CreateSprite()
			PositionEntity(r.Objects[5], r.x - 158 * RoomScale, 368 * RoomScale, r.z + 298.0 * RoomScale)
			ScaleSprite(r.Objects[5], 0.02, 0.02)
			EntityTexture(r.Objects[5], LightSpriteTex(1))
			EntityBlend (r.Objects[5], 3)
			EntityParent(r.Objects[5], r.obj)
			HideEntity(r.Objects[5])
			
			d = CreateDoor(r.zone, r.x + 296.0 * RoomScale, 0, r.z - 672.0 * RoomScale, 180, r, True, 0, 4)
			d.AutoClose = False
			PositionEntity (d.buttons[1], r.x + 164.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			FreeEntity(d.buttons[0])
			d.buttons[0]=0
			FreeEntity(d.obj2)
			d.obj2=0
			r.RoomDoors[0] = d
			
			d2 = CreateDoor(r.zone, r.x + 296.0 * RoomScale, 0, r.z - 144.0 * RoomScale, 0, r, False)
			d2.AutoClose = False
			PositionEntity (d2.buttons[0], r.x + 432.0 * RoomScale, EntityY(d2.buttons[0],True), r.z - 480.0 * RoomScale, True)
			RotateEntity(d2.buttons[0], 0, -90, 0, True)			
			PositionEntity (d2.buttons[1], r.x + 164.0 * RoomScale, EntityY(d2.buttons[0],True), r.z - 128.0 * RoomScale, True)
			FreeEntity(d2.obj2)
			d2.obj2=0
			r.RoomDoors[1] = d2
			
			d.LinkedDoor = d2
			d2.LinkedDoor = d
			
			d = CreateDoor(r.zone, r.x - 384.0 * RoomScale, 0, r.z - 672.0 * RoomScale, 0, r, False, 0, 4)
			d.AutoClose = False
			d.locked = True
			r.RoomDoors[2]=d
			
			
			it = CreateItem("Hazmat Suit", "hazmatsuit", r.x - 76.0 * RoomScale, 0.5, r.z - 396.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, 90, 0)
			
			it = CreateItem("Document SCP-008", "paper", r.x - 245.0 * RoomScale, r.y + 192.0 * RoomScale, r.z + 368.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			//spawnpoint for the scientist used in the "008 zombie scene"
			r.Objects[6] = CreatePivot(r.obj)
			PositionEntity(r.Objects[6], r.x + 160 * RoomScale, 672 * RoomScale, r.z - 384.0 * RoomScale, True)
			//spawnpoint for the player
			r.Objects[7] = CreatePivot(r.obj)
			PositionEntity(r.Objects[7], r.x, 672 * RoomScale, r.z + 352.0 * RoomScale, True)
			
			sc.SecurityCams = CreateSecurityCam(r.x+578.956*RoomScale, r.y+444.956*RoomScale, r.z+772.0*RoomScale, r)
			sc.angle = 135
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			//[End Block]
		case "room035":
			//[Block]
			d = CreateDoor(r.zone, r.x - 296.0 * RoomScale, 0, r.z - 672.0 * RoomScale, 180, r, True, 0, 5)
			d.AutoClose = False
			d.locked = True
			r.RoomDoors[0]=d
			PositionEntity (d.buttons[1], r.x - 164.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			FreeEntity(d.buttons[0])
			d.buttons[0]=0
			FreeEntity(d.obj2)
			d.obj2=0
			
			d2 = CreateDoor(r.zone, r.x - 296.0 * RoomScale, 0, r.z - 144.0 * RoomScale, 0, r, False)
			d2.AutoClose = False
			d2.locked = True
			r.RoomDoors[1]=d2
			PositionEntity (d2.buttons[0], r.x - 432.0 * RoomScale, EntityY(d2.buttons[0],True), r.z - 480.0 * RoomScale, True)
			RotateEntity(d2.buttons[0], 0, 90, 0, True)
			FreeEntity(d2.buttons[1])
			d2.buttons[1]=0
			FreeEntity(d2.obj2)
			d2.obj2=0
			
			//door to the control room
			r.RoomDoors[2] = CreateDoor(r.zone, r.x + 384.0 * RoomScale, 0, r.z - 672.0 * RoomScale, 180, r, False, 0, 5)
			r.RoomDoors[2].AutoClose = False
			
			//door to the storage room
			r.RoomDoors[3] = CreateDoor(0, r.x + 768.0 * RoomScale, 0, r.z +512.0 * RoomScale, 90, r, False, 0, 0, "5731")
			r.RoomDoors[3].AutoClose = False			
			
			d.LinkedDoor = d2
			d2.LinkedDoor = d
			
			for (i of range(2)) {
				r.Objects[i*2] = CopyEntity(LeverBaseOBJ)
				r.Objects[i*2+1] = CopyEntity(LeverOBJ)
				
				r.Levers[i] = r.Objects[i*2+1]
				
				for (n of range(2)) {
					ScaleEntity(r.Objects[i*2+n], 0.04, 0.04, 0.04)
					PositionEntity (r.Objects[i*2+n], r.x + 210.0 * RoomScale, r.y + 224.0 * RoomScale, r.z - (208-i*76) * RoomScale, True)
					
					EntityParent(r.Objects[i*2+n], r.obj)
				}
				
				RotateEntity(r.Objects[i*2], 0, -90-180, 0)
				RotateEntity(r.Objects[i*2+1], -80, -90, 0)
				
				EntityPickMode(r.Objects[i*2+1], 1, False)
				EntityRadius(r.Objects[i*2+1], 0.1)
			}
			
			//the control room
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x + 456 * RoomScale, 0.5, r.z + 400.0 * RoomScale, True)
			
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x - 576 * RoomScale, 0.5, r.z + 640.0 * RoomScale, True)
			
			for (i of range(2)) {
				em.Emitters = CreateEmitter(r.x - 272.0 * RoomScale, 10, r.z + (624.0-i*512) * RoomScale, 0)
				TurnEntity(em.Obj, 90, 0, 0, True)
				EntityParent(em.Obj, r.obj)
				em.RandAngle = 15
				em.Speed = 0.05
				em.SizeChange = 0.007
				em.Achange = -0.006
				em.Gravity = -0.24
				
				r.Objects[5+i]=em.Obj
			}
			
			//the corners of the cont chamber (needed to calculate whether the player is inside the chamber)
			r.Objects[7] = CreatePivot(r.obj)
			PositionEntity(r.Objects[7], r.x - 720 * RoomScale, 0.5, r.z + 880.0 * RoomScale, True)
			r.Objects[8] = CreatePivot(r.obj)
			PositionEntity(r.Objects[8], r.x + 176 * RoomScale, 0.5, r.z - 144.0 * RoomScale, True)			
			
			it = CreateItem("SCP-035 Addendum", "paper", r.x + 248.0 * RoomScale, r.y + 220.0 * RoomScale, r.z + 576.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Radio Transceiver", "radio", r.x - 544.0 * RoomScale, 0.5, r.z + 704.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("SCP-500-01", "scp500", r.x + 1168*RoomScale, 224*RoomScale, r.z+576*RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Metal Panel", "scp148", r.x - 360 * RoomScale, 0.5, r.z + 644 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-035", "paper", r.x + 1168.0 * RoomScale, 104.0 * RoomScale, r.z + 608.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room513":
			//[Block]
			d = CreateDoor(r.zone, r.x - 704.0 * RoomScale, 0, r.z + 304.0 * RoomScale, 0, r, False, 0, 2)
			d.AutoClose = False //: d.buttons[0] = False
			PositionEntity (d.buttons[0], EntityX(d.buttons[0],True), EntityY(d.buttons[0],True), r.z + 288.0 * RoomScale, True)
			PositionEntity (d.buttons[1], EntityX(d.buttons[1],True), EntityY(d.buttons[1],True), r.z + 320.0 * RoomScale, True)
			
			sc.SecurityCams = CreateSecurityCam(r.x-312.0 * RoomScale, r.y + 414*RoomScale, r.z + 656*RoomScale, r)
			sc.FollowPlayer = True
			
			it = CreateItem("SCP-513", "scp513", r.x - 32.0 * RoomScale, r.y + 196.0 * RoomScale, r.z + 688.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Blood-stained Note", "paper", r.x + 736.0 * RoomScale,1.0, r.z + 48.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-513", "paper", r.x - 480.0 * RoomScale, 104.0*RoomScale, r.z - 176.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room966":
			//[Block]
			d = CreateDoor(r.zone, r.x - 400.0 * RoomScale, 0, r.z, -90, r, False, False, 3)
			d = CreateDoor(r.zone, r.x, 0, r.z - 480.0 * RoomScale, 180, r, False, False, 3)
			
			sc.SecurityCams = CreateSecurityCam(r.x-312.0 * RoomScale, r.y + 414*RoomScale, r.z + 656*RoomScale, r)
			sc.angle = 225
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x, 0.5, r.z + 512.0 * RoomScale, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x + 64.0 * RoomScale, 0.5, r.z - 640.0 * RoomScale, True)
			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x, 0.5, r.z, True)
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x + 320.0 * RoomScale, 0.5, r.z + 704.0 * RoomScale, True)
			
			it = CreateItem("Night Vision Goggles", "nvgoggles", r.x + 320.0 * RoomScale, 0.5, r.z + 704.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it.state = 300
			
			//[End Block]
		case "room3storage":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x, 240.0 * RoomScale, r.z + 752.0 * RoomScale, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x + 5840.0 * RoomScale, -5392.0 * RoomScale, r.z + 1360.0 * RoomScale, True)
			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x + 608.0 * RoomScale, 240.0 * RoomScale, r.z - 624.0 * RoomScale, True)
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x - 456.0 * RoomScale, -5392.0 * RoomScale, r.z - 1136 * RoomScale, True)
			
			//"waypoints" #1
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x + 2128.0 * RoomScale, -5550.0 * RoomScale, r.z + 2048.0 * RoomScale, True)
			
			r.Objects[5] = CreatePivot(r.obj)
			PositionEntity(r.Objects[5], r.x + 2128.0 * RoomScale, -5550.0 * RoomScale, r.z - 1136.0 * RoomScale, True)
			
			r.Objects[6] = CreatePivot(r.obj)
			PositionEntity(r.Objects[6], r.x + 3824.0 * RoomScale, -5550.0 * RoomScale, r.z - 1168.0 * RoomScale, True)
			
			r.Objects[7] = CreatePivot(r.obj)
			PositionEntity(r.Objects[7], r.x + 3760.0 * RoomScale, -5550.0 * RoomScale, r.z + 2048.0 * RoomScale, True)
			
			r.Objects[8] = CreatePivot(r.obj)
			PositionEntity(r.Objects[8], r.x + 4848.0 * RoomScale, -5550.0 * RoomScale, r.z + 112.0 * RoomScale, True)
			
			//"waypoints" #2
			r.Objects[9] = CreatePivot(r.obj)
			PositionEntity(r.Objects[9], r.x + 592.0 * RoomScale, -5550.0 * RoomScale, r.z + 6352.0 * RoomScale, True)
			
			r.Objects[10] = CreatePivot(r.obj)
			PositionEntity(r.Objects[10], r.x + 2928.0 * RoomScale, -5550.0 * RoomScale, r.z + 6352.0 * RoomScale, True)
			
			r.Objects[11] = CreatePivot(r.obj)
			PositionEntity(r.Objects[11], r.x + 2928.0 * RoomScale, -5550.0 * RoomScale, r.z + 5200.0 * RoomScale, True)
			
			r.Objects[12] = CreatePivot(r.obj)
			PositionEntity(r.Objects[12], r.x + 592.0 * RoomScale, -5550.0 * RoomScale, r.z + 5200.0 * RoomScale, True)
			
			//"waypoints" #3
			r.Objects[13] = CreatePivot(r.obj)
			PositionEntity(r.Objects[13], r.x + 1136.0 * RoomScale, -5550.0 * RoomScale, r.z + 2944.0 * RoomScale, True)
			
			r.Objects[14] = CreatePivot(r.obj)
			PositionEntity(r.Objects[14], r.x + 1104.0 * RoomScale, -5550.0 * RoomScale, r.z + 1184.0 * RoomScale, True)
			
			r.Objects[15] = CreatePivot(r.obj)
			PositionEntity(r.Objects[15], r.x - 464.0 * RoomScale,  -5550.0 * RoomScale, r.z + 1216.0 * RoomScale, True)
			
			r.Objects[16] = CreatePivot(r.obj)
			PositionEntity(r.Objects[16], r.x - 432.0 * RoomScale, -5550.0 * RoomScale, r.z + 2976.0 * RoomScale, True)
			
			r.Objects[20] = LoadMesh_Strict("GFX/map/room3storage_hb.b3d",r.obj)
			EntityPickMode(r.Objects[20],2)
			EntityType(r.Objects[20],HIT_MAP)
			EntityAlpha(r.Objects[20],0.0)
			
			//Doors
			r.RoomDoors[0] = CreateDoor(r.zone, r.x, 0.0, r.z + 448.0 * RoomScale, 0, r, True, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			PositionEntity(r.RoomDoors[0].buttons[1], r.x - 160.0 * RoomScale, 0.7, r.z + 480.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 160.0 * RoomScale, 0.7, r.z + 416.0 * RoomScale, True)	
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 5840.0 * RoomScale,  -5632.0 * RoomScale, r.z + 1048.0 * RoomScale, 0, r, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			PositionEntity(r.RoomDoors[1].buttons[0], r.x + 6000.0 * RoomScale, EntityY(r.RoomDoors[1].buttons[0],True), r.z + 1008.0 * RoomScale, True)					
			PositionEntity(r.RoomDoors[1].buttons[1], r.x + 5680.0 * RoomScale, EntityY(r.RoomDoors[1].buttons[1],True), r.z + 1088.0 * RoomScale, True)
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x + 608.0 * RoomScale, 0.0, r.z - 312.0 * RoomScale, 0, r, True, 3)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = True
			PositionEntity(r.RoomDoors[2].buttons[1], r.x + 448.0 * RoomScale, 0.7, r.z - 272.0 * RoomScale, True)	
			PositionEntity(r.RoomDoors[2].buttons[0], r.x + 768.0 * RoomScale, 0.7, r.z - 352.0 * RoomScale, True)
			
			r.RoomDoors[3] = CreateDoor(r.zone, r.x - 456.0 * RoomScale,  -5632.0 * RoomScale, r.z - 824.0 * RoomScale, 0, r, False, 3)
			r.RoomDoors[3].AutoClose = False
			r.RoomDoors[3].open = False
			//X=+176 | Z=-40
			PositionEntity(r.RoomDoors[3].buttons[0], r.x - 280.0*RoomScale, EntityY(r.RoomDoors[3].buttons[0],True), r.z - 864.0 * RoomScale, True)
			//X=-176 | Z=+40
			PositionEntity(r.RoomDoors[3].buttons[1], r.x - 632.0*RoomScale, EntityY(r.RoomDoors[3].buttons[1],True), r.z - 784.0 * RoomScale, True)
			
			em.Emitters = CreateEmitter(r.x + 5218.0 * RoomScale, -5584.0*RoomScale, r.z - 600* RoomScale, 0)
			TurnEntity(em.Obj, 20, -100, 0, True)
			EntityParent(em.Obj, r.obj)
			em.Room = r
			em.RandAngle = 15
			em.Speed = 0.03
			em.SizeChange = 0.01
			em.Achange = -0.006
			em.Gravity = -0.2 
			
			switch (Rand(3)) {
				case 1:
					x = 2312
					z = -952
				case 2:
					x = 3032
					z = 1288
				case 3:
					x = 2824
					z = 2808
			}
			
			it.Items = CreateItem("Black Severed Hand", "hand2", r.x + x*RoomScale, -5596.0*RoomScale+1.0, r.z+z*RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Night Vision Goggles", "nvgoggles", r.x + 1936.0 * RoomScale, r.y - 5496.0 * RoomScale, r.z - 944.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it.state = 450
			
			de.Decals = CreateDecal(3,  r.x + x*RoomScale, -5632.0*RoomScale+0.01, r.z+z*RoomScale,90,Rnd(360),0)
			de.Size = 0.5
			ScaleSprite(de.obj, de.Size,de.Size)
			EntityParent(de.obj, r.obj)
			
			//Objects [20],[21],[22],[23]
			for (n of range(10, 12)) {
				r.Objects[n * 2] = CopyEntity(LeverBaseOBJ)
				r.Objects[n * 2 + 1] = CopyEntity(LeverOBJ)
				
				r.Levers[n-10] = r.Objects[n * 2 + 1]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n * 2 + i], 0.04, 0.04, 0.04)
					if (n == 10) {
						//r.z+6578
						PositionEntity(r.Objects[n * 2 + i],r.x+3101*RoomScale,r.y-5461*RoomScale,r.z+6568*RoomScale,True)
					} else {
						//r.z+3174
						PositionEntity(r.Objects[n * 2 + i],r.x+1209*RoomScale,r.y-5461*RoomScale,r.z+3164*RoomScale,True)
					}
					
					EntityParent(r.Objects[n * 2 + i], r.obj)
				}
				RotateEntity(r.Objects[n * 2], 0, 0, 0)
				RotateEntity(r.Objects[n * 2 + 1], -10, 0 - 180, 0)
				
				EntityPickMode(r.Objects[n * 2 + 1], 1, False)
				EntityRadius(r.Objects[n * 2 + 1], 0.1)
			}
			
			r.RoomDoors[4] = CreateDoor(r.zone,r.x+56*RoomScale,r.y-5632*RoomScale,r.z+6344*RoomScale,90,r,False,2)
			r.RoomDoors[4].AutoClose = False
			r.RoomDoors[4].open = False
			for (i of range(2)) {
				FreeEntity(r.RoomDoors[4].buttons[i])
				r.RoomDoors[4].buttons[i] = 0
			}
			
			d = CreateDoor(r.zone,r.x+1157.0*RoomScale,r.y-5632.0*RoomScale,r.z+660.0*RoomScale,0,r,False,2)
			d.locked = True
			d.open = False
			d.AutoClose = False
			for (i of range(2)) {
				FreeEntity(d.buttons[i])
				d.buttons[i]=0
			}
			
			d = CreateDoor(r.zone,r.x+234.0*RoomScale,r.y-5632.0*RoomScale,r.z+5239.0*RoomScale,90,r,False,2)
			d.locked = True
			d.open = False
			d.AutoClose = False
			for (i of range(2)) {
				FreeEntity(d.buttons[i])
				d.buttons[i]=0
			}
			
			d = CreateDoor(r.zone,r.x+3446.0*RoomScale,r.y-5632.0*RoomScale,r.z+6369.0*RoomScale,90,r,False,2)
			d.locked = True
			d.open = False
			d.AutoClose = False
			for (i of range(2)) {
				FreeEntity(d.buttons[i])
				d.buttons[i]=0
			}
			//[End Block]
		case "room049":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x + 640.0 * RoomScale, 240.0 * RoomScale, r.z + 656.0 * RoomScale, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x + 3211.0 * RoomScale, -3280.0 * RoomScale, r.z + 1824.0 * RoomScale, True)
			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x - 672.0 * RoomScale, 240.0 * RoomScale, r.z - 93.0 * RoomScale, True)
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x - 2766.0 * RoomScale, -3280.0 * RoomScale, r.z - 1277.0 * RoomScale, True)
			
			//zombie 1
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x + 528.0 * RoomScale, -3440.0 * RoomScale, r.z + 96.0 * RoomScale, True)
			//zombie 2
			r.Objects[5] = CreatePivot(r.obj)
			PositionEntity(r.Objects[5], r.x  + 64.0 * RoomScale, -3440.0 * RoomScale, r.z - 1000.0 * RoomScale, True)
			
			for (n of range(2)) {
				r.Objects[n * 2 + 6] = CopyEntity(LeverBaseOBJ)
				r.Objects[n * 2 + 7] = CopyEntity(LeverOBJ)
				
				r.Levers[n] = r.Objects[n * 2 + 7]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n * 2 + 6 + i], 0.03, 0.03, 0.03)
					
					switch (n) {
						case 0: //power feed
							PositionEntity (r.Objects[n * 2 + 6 + i], r.x + 852.0 * RoomScale, r.y - 3374.0 * RoomScale, r.z - 854.0 * RoomScale, True)
							
						case 1: //generator
							PositionEntity (r.Objects[n * 2 + 6 + i], r.x - 834.0 * RoomScale, r.y - 3400.0 * RoomScale, r.z + 1093.0 * RoomScale, True)
							
					}
					
					EntityParent(r.Objects[n * 2 + 6 + i], r.obj)
				}
				
				RotateEntity(r.Objects[n*2+6], 0, 180+90*(!n), 0)
				RotateEntity(r.Objects[n*2+7], 81-92*n, 90*(!n), 0)
				
				EntityPickMode(r.Objects[n * 2 + 7], 1, False)
				EntityRadius(r.Objects[n * 2 + 7], 0.1)
			}
			
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 330.0 * RoomScale, 0.0, r.z + 656.0 * RoomScale, 90, r, True, 3)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			PositionEntity(r.RoomDoors[0].buttons[1], r.x + 288.0 * RoomScale, 0.7, r.z + 512.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 368.0 * RoomScale, 0.7, r.z + 840.0 * RoomScale, True)
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 2898.0 * RoomScale, -3520.0 * RoomScale, r.z + 1824.0 * RoomScale, 90, r, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False	
			PositionEntity(r.RoomDoors[1].buttons[1], r.x + 2881.0 * RoomScale, EntityY(r.RoomDoors[1].buttons[1],True), r.z + 1663.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[1].buttons[0], r.x + 2936.0 * RoomScale, EntityY(r.RoomDoors[1].buttons[0],True), r.z + 2009.0 * RoomScale, True)				
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 672.0 * RoomScale, 0.0, r.z - 408.0 * RoomScale, 0, r, True, 3)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = True
			PositionEntity(r.RoomDoors[2].buttons[0], r.x - 487.0 * RoomScale, 0.7, r.z - 447.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[2].buttons[1], r.x - 857.0 * RoomScale, 0.7, r.z - 369.0 * RoomScale, True)				
			
			r.RoomDoors[3] = CreateDoor(r.zone, r.x - 2766.0 * RoomScale, -3520.0 * RoomScale, r.z - 1592.0 * RoomScale, 0, r, False, 3)
			r.RoomDoors[3].AutoClose = False
			r.RoomDoors[3].open = False		
			PositionEntity(r.RoomDoors[3].buttons[0], r.x - 2581.0 * RoomScale, EntityY(r.RoomDoors[3].buttons[0],True), r.z - 1631.0 * RoomScale, True)
			PositionEntity(r.RoomDoors[3].buttons[1], r.x - 2951.0 * RoomScale, EntityY(r.RoomDoors[3].buttons[1],True), r.z - 1553.0 * RoomScale, True)	
			
			//storage room doors
			r.RoomDoors[4] = CreateDoor(r.zone, r.x + 272.0 * RoomScale, -3552.0 * RoomScale, r.z + 104.0 * RoomScale, 90, r, False)
			r.RoomDoors[4].AutoClose = False
			r.RoomDoors[4].open = True
			r.RoomDoors[4].locked = True
			r.RoomDoors[5] = CreateDoor(r.zone, r.x + 264.0 * RoomScale, -3520.0 * RoomScale, r.z - 1824.0 * RoomScale, 90, r, False)
			r.RoomDoors[5].AutoClose = False
			r.RoomDoors[5].open = True
			r.RoomDoors[5].locked = True
			r.RoomDoors[6] = CreateDoor(r.zone, r.x - 264.0 * RoomScale, -3520.0 * RoomScale, r.z + 1824.0 * RoomScale, 90, r, False)
			r.RoomDoors[6].AutoClose = False
			r.RoomDoors[6].open = True
			r.RoomDoors[6].locked = True
			
			d.Doors = CreateDoor(0, r.x,0,r.z, 0, r, False, 2, -2)
			
			it = CreateItem("Document SCP-049", "paper", r.x - 608.0 * RoomScale, r.y - 3332.0 * RoomScale, r.z + 876.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Level 4 Key Card", "key4", r.x - 512.0 * RoomScale, r.y - 3412.0 * RoomScale, r.z + 864.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("First Aid Kit", "firstaid", r.x +385.0 * RoomScale, r.y - 3412.0 * RoomScale, r.z + 271.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			d = CreateDoor(r.zone,r.x-272.0*RoomScale,r.y-3552.0*RoomScale,r.z+98.0*RoomScale,90,r,True,True)
			d.AutoClose = False
			d.open = True
			d.MTFClose = False
			d.locked = True
			for (i of range(2)) {
				FreeEntity(d.buttons[i])
				d.buttons[i]=0
			}
			
			d = CreateDoor(r.zone,r.x-2990.0*RoomScale,r.y-3520.0*RoomScale,r.z-1824.0*RoomScale,90,r,False,2)
			d.locked = True
			d.DisableWaypoint = True
			d = CreateDoor(r.zone,r.x-896.0*RoomScale,r.y,r.z-640*RoomScale,90,r,False,2)
			d.locked = True
			d.DisableWaypoint = True
			
			r.Objects[10] = CreatePivot(r.obj)
			PositionEntity(r.Objects[10],r.x-832.0*RoomScale,r.y-3484.0*RoomScale,r.z+1572.0*RoomScale,True)
			
			//Spawnpoint for the map layout document
			r.Objects[11] = CreatePivot(r.obj)
			PositionEntity(r.Objects[11],r.x+2642.0*RoomScale,r.y-3516.0*RoomScale,r.z+1822.0*RoomScale,True)
			r.Objects[12] = CreatePivot(r.obj)
			PositionEntity(r.Objects[12],r.x-2666.0*RoomScale,r.y-3516.0*RoomScale,r.z-1792.0*RoomScale,True)
			//[End Block]
		case "room2_2":
			//[Block]
			for (r2 of Rooms.each) {
				if (r2 != r) {
					if (r2.RoomTemplate.Name == "room2_2") {
						r.Objects[0] = CopyEntity(r2.Objects[0]) //don't load the mesh again
						break
					}
				}
			}
			if (r.Objects[0] == 0) {
				r.Objects[0] = LoadMesh_Strict("GFX/map/fan.b3d")
			}
			ScaleEntity(r.Objects[0], RoomScale, RoomScale, RoomScale)
			PositionEntity(r.Objects[0], r.x - 248 * RoomScale, 528 * RoomScale, r.z, 0)
			EntityParent(r.Objects[0], r.obj)
			//[End Block]
		case "room012":
			//[Block]
			d.Doors = CreateDoor(r.zone, r.x + 264.0 * RoomScale, 0.0, r.z + 672.0 * RoomScale, 270, r, False, False, 3)
			PositionEntity(d.buttons[0], r.x + 224.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 540.0 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x + 304.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 840.0 * RoomScale, True)
			TurnEntity (d.buttons[1],0,0,0,True)
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x -512.0 * RoomScale, -768.0*RoomScale, r.z -336.0 * RoomScale, 0, r, False, False)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			r.RoomDoors[0].locked = True
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 176.0 * RoomScale, -512.0*RoomScale, r.z - 364.0 * RoomScale, True)
			FreeEntity (r.RoomDoors[0].buttons[1])
			r.RoomDoors[0].buttons[1]=0
			
			r.Objects[0] = CopyEntity(LeverBaseOBJ)
			r.Objects[1] = CopyEntity(LeverOBJ)
			
			r.Levers[0] = r.Objects[1]
			
			for (i of range(2)) {
				ScaleEntity(r.Objects[i], 0.04, 0.04, 0.04)
				PositionEntity (r.Objects[i], r.x + 240.0 * RoomScale, r.y - 512.0 * RoomScale, r.z - 364 * RoomScale, True)
				
				EntityParent(r.Objects[i], r.obj)
			}
			
			RotateEntity(r.Objects[1], 10, -180, 0)
			
			EntityPickMode(r.Objects[1], 1, False)
			EntityRadius(r.Objects[1], 0.1)
			
			r.Objects[2] = LoadMesh_Strict("GFX/map/room012_2.b3d")
			ScaleEntity(r.Objects[2], RoomScale, RoomScale, RoomScale)
			PositionEntity(r.Objects[2], r.x - 360 * RoomScale, - 130 * RoomScale, r.z + 456.0 * RoomScale, 0)
			EntityParent(r.Objects[2], r.obj)
			
			r.Objects[3] = CreateSprite()
			PositionEntity(r.Objects[3], r.x - 43.5 * RoomScale, - 574 * RoomScale, r.z - 362.0 * RoomScale)
			ScaleSprite(r.Objects[3], 0.015, 0.015)
			EntityTexture(r.Objects[3], LightSpriteTex(1))
			EntityBlend (r.Objects[3], 3)
			EntityParent(r.Objects[3], r.obj)
			HideEntity(r.Objects[3])
			
			r.Objects[4] = LoadMesh_Strict("GFX/map/room012_3.b3d")
			tex=LoadTexture_Strict("GFX/map/scp-012_0.jpg")
			EntityTexture(r.Objects[4],tex, 0,1)
			ScaleEntity(r.Objects[4], RoomScale, RoomScale, RoomScale)
			PositionEntity(r.Objects[4], r.x - 360 * RoomScale, - 130 * RoomScale, r.z + 456.0 * RoomScale, 0)
			EntityParent(r.Objects[4], r.Objects[2])
			
			it = CreateItem("Document SCP-012", "paper", r.x - 56.0 * RoomScale, r.y - 576.0 * RoomScale, r.z - 408.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it.Items = CreateItem("Severed Hand", "hand", r.x - 784*RoomScale, -576*RoomScale+0.3, r.z+640*RoomScale)
			EntityParent(it.collider, r.obj)
			
			de.Decals = CreateDecal(3,  r.x - 784*RoomScale, -768*RoomScale+0.01, r.z+640*RoomScale,90,Rnd(360),0)
			de.Size = 0.5
			ScaleSprite(de.obj, de.Size,de.Size)
			EntityParent(de.obj, r.obj)
			//[End Block]
		case "tunnel2":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x, 544.0 * RoomScale, r.z + 512.0 * RoomScale, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x, 544.0 * RoomScale, r.z - 512.0 * RoomScale, True)
			//[End Block]
		case "room2pipes":
			//[Block]
			r.Objects[0]= CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x + 368.0 * RoomScale, 0.0, r.z, True)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x - 368.0 * RoomScale, 0.0, r.z, True)
			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x + 224.0 * RoomScale - 0.005, 192.0 * RoomScale, r.z, True)
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x - 224.0 * RoomScale + 0.005, 192.0 * RoomScale, r.z, True)
			//[End Block]
		case "room3pit":
			//[Block]
			em.Emitters = CreateEmitter(r.x + 512.0 * RoomScale, -76 * RoomScale, r.z - 688 * RoomScale, 0)
			TurnEntity(em.Obj, -90, 0, 0)
			EntityParent(em.Obj, r.obj)
			em.RandAngle = 55
			em.Speed = 0.0005
			em.Achange = -0.015
			em.SizeChange = 0.007
			
			em.Emitters = CreateEmitter(r.x - 512.0 * RoomScale, -76 * RoomScale, r.z - 688 * RoomScale, 0)
			TurnEntity(em.Obj, -90, 0, 0)
			EntityParent(em.Obj, r.obj)
			em.RandAngle = 55
			em.Speed = 0.0005
			em.Achange = -0.015
			em.SizeChange = 0.007
			
			r.Objects[0]= CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x + 704.0 * RoomScale, 112.0*RoomScale, r.z-416.0*RoomScale, True)
			//[End Block]
		case "room2servers":
			//[Block]
			d.Doors = CreateDoor(0, r.x,0,r.z, 0, r, False, 2, False)
			d.locked = True
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 208.0 * RoomScale, 0.0, r.z - 736.0 * RoomScale, 90, r, True, False, False, "", True)
			r.RoomDoors[0].AutoClose=False
			r.RoomDoors[1] = CreateDoor(r.zone, r.x - 208.0 * RoomScale, 0.0, r.z + 736.0 * RoomScale, 90, r, True, False, False, "", True)
			r.RoomDoors[1].AutoClose=False
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 672.0 * RoomScale, 0.0, r.z - 1024.0 * RoomScale, 0, r, False, False, False, "GEAR")
			r.RoomDoors[2].AutoClose=False
			r.RoomDoors[2].DisableWaypoint = True 
			FreeEntity(r.RoomDoors[2].buttons[0])
			r.RoomDoors[2].buttons[0]=0
			FreeEntity(r.RoomDoors[2].buttons[1])
			r.RoomDoors[2].buttons[1]=0
			
			for (n of range(3)) {
				r.Objects[n * 2] = CopyEntity(LeverBaseOBJ)
				r.Objects[n * 2 + 1] = CopyEntity(LeverOBJ)
				
				r.Levers[n] = r.Objects[n * 2 + 1]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n * 2 + i], 0.03, 0.03, 0.03)
					
					switch (n) {
						case 0: //power switch
							PositionEntity (r.Objects[n * 2 + i], r.x - 1260.0 * RoomScale, r.y + 234.0 * RoomScale, r.z + 750 * RoomScale, True)	
						case 1: //generator fuel pump
							PositionEntity (r.Objects[n * 2 + i], r.x - 920.0 * RoomScale, r.y + 164.0 * RoomScale, r.z + 898 * RoomScale, True)
						case 2: //generator on/off
							PositionEntity (r.Objects[n * 2 + i], r.x - 837.0 * RoomScale, r.y + 152.0 * RoomScale, r.z + 886 * RoomScale, True)
					}
					
					EntityParent(r.Objects[n * 2 + i], r.obj)
				}
				RotateEntity(r.Objects[n*2+1], 81, -180, 0)
				
				EntityPickMode(r.Objects[n * 2 + 1], 1, False)
				EntityRadius(r.Objects[n * 2 + 1], 0.1)
			}
			
			RotateEntity(r.Objects[2+1], -81, -180, 0)
			RotateEntity(r.Objects[4+1], -81, -180, 0)
			
			//096 spawnpoint
			r.Objects[6]=CreatePivot(r.obj)
			PositionEntity(r.Objects[6],r.x-320*RoomScale,0.5,r.z,True)
			//guard spawnpoint
			r.Objects[7]=CreatePivot(r.obj)
			PositionEntity(r.Objects[7], r.x - 1328.0 * RoomScale, 0.5, r.z + 528*RoomScale, True)
			//the point where the guard walks to
			r.Objects[8]=CreatePivot(r.obj)
			PositionEntity(r.Objects[8], r.x - 1376.0 * RoomScale, 0.5, r.z + 32*RoomScale, True)
			
			r.Objects[9]=CreatePivot(r.obj)
			PositionEntity(r.Objects[9], r.x - 848*RoomScale, 0.5, r.z+576*RoomScale, True)
			//[End Block]
		case "room3servers":
			//[Block]
			it = CreateItem("9V Battery", "bat", r.x - 132.0 * RoomScale, r.y - 368.0 * RoomScale, r.z - 648.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			if (Rand(2) == 1) {
				it = CreateItem("9V Battery", "bat", r.x - 76.0 * RoomScale, r.y - 368.0 * RoomScale, r.z - 648.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			if (Rand(2) == 1) {
				it = CreateItem("9V Battery", "bat", r.x - 196.0 * RoomScale, r.y - 368.0 * RoomScale, r.z - 648.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			
			it = CreateItem("S-NAV 300 Navigator", "nav", r.x + 124.0 * RoomScale, r.y - 368.0 * RoomScale, r.z - 648.0 * RoomScale)
			it.state = 20
			EntityParent(it.collider, r.obj)
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x + 736.0 * RoomScale, -512.0 * RoomScale, r.z - 400.0 * RoomScale, True)
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x - 552.0 * RoomScale, -512.0 * RoomScale, r.z - 528.0 * RoomScale, True)			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x + 736.0 * RoomScale, -512.0 * RoomScale, r.z + 272.0 * RoomScale, True)
			
			r.Objects[3] = LoadMesh_Strict("GFX/npcs/duck_low_res.b3d")
			ScaleEntity(r.Objects[3], 0.07, 0.07, 0.07)
			tex = LoadTexture_Strict("GFX/npcs/duck2.png")
			EntityTexture(r.Objects[3], tex)
			PositionEntity (r.Objects[3], r.x + 928.0 * RoomScale, -640*RoomScale, r.z + 704.0 * RoomScale)
			
			EntityParent(r.Objects[3], r.obj)
			//[End Block]
		case "room3servers2":
			//[Block]
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x - 504.0 * RoomScale, -512.0 * RoomScale, r.z + 271.0 * RoomScale, True)
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x + 628.0 * RoomScale, -512.0 * RoomScale, r.z + 271.0 * RoomScale, True)			
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x - 532.0 * RoomScale, -512.0 * RoomScale, r.z - 877.0 * RoomScale, True)	
			
			it = CreateItem("Document SCP-970", "paper", r.x + 960.0 * RoomScale, r.y - 448.0 * RoomScale, r.z + 251.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle, 0)
			EntityParent(it.collider, r.obj)		
			
			it = CreateItem("Gas Mask", "gasmask", r.x + 954.0 * RoomScale, r.y - 504.0 * RoomScale, r.z + 235.0 * RoomScale)
			EntityParent(it.collider, r.obj)		
			//[End Block]
		case "testroom":
			//[Block]
			for (xtemp of range(2)) {
				for (ztemp of range(-1, 2)) {
					r.Objects[xtemp * 3 + (ztemp + 1)] = CreatePivot()
					PositionEntity(r.Objects[xtemp * 3 + (ztemp + 1)], r.x + (-236.0 + 280.0 * xtemp) * RoomScale, -700.0 * RoomScale, r.z + 384.0 * ztemp * RoomScale)
					EntityParent(r.Objects[xtemp * 3 + (ztemp + 1)], r.obj)
				}
			}
			
			r.Objects[6] = CreatePivot()
			PositionEntity(r.Objects[6], r.x + 754.0 * RoomScale, r.y - 1248.0 * RoomScale, r.z)
			EntityParent(r.Objects[6], r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x + 744.0 * RoomScale, r.y - 856.0 * RoomScale, r.z + 236.0 * RoomScale, r)
			sc.FollowPlayer = True
			
			CreateDoor(0, r.x + 720.0 * RoomScale, 0, r.z, 0, r, False, 2, -1)
			
			CreateDoor(0, r.x - 624.0 * RoomScale, -1280.0 * RoomScale, r.z, 90, r, True)			
			
			it = CreateItem("Document SCP-682", "paper", r.x + 656.0 * RoomScale, r.y - 1200.0 * RoomScale, r.z - 16.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2closets":
			//[Block]
			it = CreateItem("Document SCP-1048", "paper", r.x + 736.0 * RoomScale, r.y + 176.0 * RoomScale, r.z + 736.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Gas Mask", "gasmask", r.x + 736.0 * RoomScale, r.y + 176.0 * RoomScale, r.z + 544.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("9V Battery", "bat", r.x + 736.0 * RoomScale, r.y + 176.0 * RoomScale, r.z - 448.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			if (Rand(2) = 1) {
				it = CreateItem("9V Battery", "bat", r.x + 730.0 * RoomScale, r.y + 176.0 * RoomScale, r.z - 496.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			if (Rand(2) = 1) {
				it = CreateItem("9V Battery", "bat", r.x + 740.0 * RoomScale, r.y + 176.0 * RoomScale, r.z - 560.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			
			it = CreateItem("Level 1 Key Card", "key1", r.x + 736.0 * RoomScale, r.y + 240.0 * RoomScale, r.z + 752.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			let clipboard: Items = CreateItem("Clipboard","clipboard",r.x + 736.0 * RoomScale, r.y + 224.0 * RoomScale, r.z -480.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Incident Report SCP-1048-A", "paper",r.x + 736.0 * RoomScale, r.y + 224.0 * RoomScale, r.z -480.0 * RoomScale)
			//clipboard.SecondInv[0] = it
			HideEntity(it.collider)
			
			r.Objects[0]=CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x-1120*RoomScale, -256*RoomScale, r.z+896*RoomScale, True)
			r.Objects[1]=CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x-1232*RoomScale, -256*RoomScale, r.z-160*RoomScale, True)
			
			d.Doors = CreateDoor(0, r.x - 240.0 * RoomScale, 0.0, r.z, 90, r, False)
			PositionEntity(d.buttons[0], r.x - 230.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			PositionEntity(d.buttons[1], r.x - 250.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			d.open = False
			d.AutoClose = False
			
			sc.SecurityCams = CreateSecurityCam(r.x, r.y + 704*RoomScale, r.z + 863*RoomScale, r)
			sc.angle = 180
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			//[End Block]
		case "room2offices":
			//[Block]
			it = CreateItem("Document SCP-106", "paper", r.x + 404.0 * RoomScale, r.y + 145.0 * RoomScale, r.z + 559.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Level 2 Key Card", "key2", r.x - 156.0 * RoomScale, r.y + 151.0 * RoomScale, r.z + 72.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("S-NAV 300 Navigator", "nav", r.x + 305.0 * RoomScale, r.y + 153.0 * RoomScale, r.z + 944.0 * RoomScale)
			it.state = 20
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Notification", "paper", r.x -137.0 * RoomScale, r.y + 153.0 * RoomScale, r.z + 464.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			w.waypoints = CreateWaypoint(r.x - 32.0 * RoomScale, r.y + 66.0 * RoomScale, r.z + 288.0 * RoomScale, null, r)
			w2.waypoints = CreateWaypoint(r.x, r.y + 66.0 * RoomScale, r.z - 448.0 * RoomScale, null, r)
			w.connected[0] = w2
			w.dist[0] = EntityDistance(w.obj, w2.obj)
			w2.connected[0] = w
			w2.dist[0] = w.dist[0]
			//[End Block]
		case "room2offices2":
			//[Block]
			it = CreateItem("Level 1 Key Card", "key1", r.x - 368.0 * RoomScale, r.y - 48.0 * RoomScale, r.z + 80.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-895", "paper", r.x - 800.0 * RoomScale, r.y - 48.0 * RoomScale, r.z + 368.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			if (Rand(2) = 1) {
				it = CreateItem("Document SCP-860", "paper", r.x - 800.0 * RoomScale, r.y - 48.0 * RoomScale, r.z - 464.0 * RoomScale)
			} else {
				it = CreateItem("SCP-093 Recovered Materials", "paper", r.x - 800.0 * RoomScale, r.y - 48.0 * RoomScale, r.z - 464.0 * RoomScale)
			}
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("S-NAV 300 Navigator", "nav", r.x - 336.0 * RoomScale, r.y - 48.0 * RoomScale, r.z - 480.0 * RoomScale)
			it.state = 28
			EntityParent(it.collider, r.obj)		
			
			r.Objects[0] = LoadMesh_Strict("GFX/npcs/duck_low_res.b3d")
			ScaleEntity(r.Objects[0], 0.07, 0.07, 0.07)
			
			EntityParent(r.Objects[0], r.obj)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x-808.0 * RoomScale, -72.0 * RoomScale, r.z - 40.0 * RoomScale, True)
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], r.x-488.0 * RoomScale, 160.0 * RoomScale, r.z + 700.0 * RoomScale, True)
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x-488.0 * RoomScale, 160.0 * RoomScale, r.z - 668.0 * RoomScale, True)
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x-572.0 * RoomScale, 350.0 * RoomScale, r.z - 4.0 * RoomScale, True)
			
			temp = Rand(1,4)
			PositionEntity(r.Objects[0], EntityX(r.Objects[temp],True),EntityY(r.Objects[temp],True),EntityZ(r.Objects[temp],True),True)
			//[End Block]
		case "room2offices3":
			//[Block]
			if (Rand(2) == 1) { 
				it = CreateItem("Mobile Task Forces", "paper", r.x + 744.0 * RoomScale, r.y +240.0 * RoomScale, r.z + 944.0 * RoomScale)
				EntityParent(it.collider, r.obj)	
			} else {
				it = CreateItem("Security Clearance Levels", "paper", r.x + 680.0 * RoomScale, r.y +240.0 * RoomScale, r.z + 944.0 * RoomScale)
				EntityParent(it.collider, r.obj)			
			}
			
			it = CreateItem("Object Classes", "paper", r.x + 160.0 * RoomScale, r.y +240.0 * RoomScale, r.z + 568.0 * RoomScale)
			EntityParent(it.collider, r.obj)	
			
			it = CreateItem("Document", "paper", r.x -1440.0 * RoomScale, r.y +624.0 * RoomScale, r.z + 152.0 * RoomScale)
			EntityParent(it.collider, r.obj)	
			
			it = CreateItem("Radio Transceiver", "radio", r.x - 1184.0 * RoomScale, r.y + 480.0 * RoomScale, r.z - 800.0 * RoomScale)
			EntityParent(it.collider, r.obj)				
			
			for (i of range(Rand(0,1) + 1)) {
				it = CreateItem("ReVision Eyedrops", "eyedrops", r.x - 1529.0*RoomScale, r.y + 563.0 * RoomScale, r.z - 572.0*RoomScale + i*0.05)
				EntityParent(it.collider, r.obj)				
			}
			
			it = CreateItem("9V Battery", "bat", r.x - 1545.0 * RoomScale, r.y + 603.0 * RoomScale, r.z - 372.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			if (Rand(2) == 1) {
				it = CreateItem("9V Battery", "bat", r.x - 1540.0 * RoomScale, r.y + 603.0 * RoomScale, r.z - 340.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			if (Rand(2) == 1) {
				it = CreateItem("9V Battery", "bat", r.x - 1529.0 * RoomScale, r.y + 603.0 * RoomScale, r.z - 308.0 * RoomScale)
				EntityParent(it.collider, r.obj)
			}
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 1056.0 * RoomScale, 384.0*RoomScale, r.z + 290.0 * RoomScale, 90, r, True)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			PositionEntity(r.RoomDoors[0].buttons[0], EntityX(r.RoomDoors[0].buttons[0],True),EntityY(r.RoomDoors[0].buttons[0],True),r.z + 161.0 * RoomScale,True)
			PositionEntity(r.RoomDoors[0].buttons[1], EntityX(r.RoomDoors[0].buttons[1],True),EntityY(r.RoomDoors[0].buttons[1],True),r.z + 161.0 * RoomScale,True)
			//[End Block]
		case "start":
			//[Block]
			//the containment doors
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 4000.0 * RoomScale, 384.0*RoomScale, r.z + 1696.0 * RoomScale, 90, r, True, True)
			r.RoomDoors[1].locked = False
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].dir = 1
			r.RoomDoors[1].open = True 
			FreeEntity(r.RoomDoors[1].buttons[0])
			r.RoomDoors[1].buttons[0] = 0
			FreeEntity(r.RoomDoors[1].buttons[1])
			r.RoomDoors[1].buttons[1] = 0
			r.RoomDoors[1].MTFClose = False
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x + 2704.0 * RoomScale, 384.0*RoomScale, r.z + 624.0 * RoomScale, 90, r, False)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = False
			FreeEntity(r.RoomDoors[2].buttons[0])
			r.RoomDoors[2].buttons[0] = 0
			FreeEntity(r.RoomDoors[2].buttons[1])
			r.RoomDoors[2].buttons[1] = 0
			r.RoomDoors[2].MTFClose = False
			
			d.Doors = CreateDoor(r.zone, r.x + 1392.0 * RoomScale, 384.0*RoomScale, r.z + 64.0 * RoomScale, 90, r, True)
			d.AutoClose = False
			d.MTFClose = False
			d.locked = True
			
			d.Doors = CreateDoor(r.zone, r.x - 640.0 * RoomScale, 384.0*RoomScale, r.z + 64.0 * RoomScale, 90, r, False)
			d.locked = True
			d.AutoClose = False
			
			d.Doors = CreateDoor(r.zone, r.x + 1280.0 * RoomScale, 384.0*RoomScale, r.z + 312.0 * RoomScale, 180, r, True)
			d.locked = True
			d.AutoClose = False
			PositionEntity(d.buttons[0], r.x + 1120.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 328.0 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x + 1120.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 296.0 * RoomScale, True)
			FreeEntity(d.obj2)
			d.obj2=0
			d.MTFClose = False
			
			d.Doors = CreateDoor(r.zone, r.x, 0, r.z + 1184.0 * RoomScale, 0, r, False)
			d.locked = True
			
			r.Objects[0] = LoadMesh_Strict("GFX/map/IntroDesk.b3d")
			ScaleEntity(r.Objects[0], RoomScale, RoomScale ,RoomScale)
			PositionEntity(r.Objects[0], r.x + 272.0 * RoomScale, 0, r.z + 400.0 * RoomScale)
			EntityParent(r.Objects[0], r.obj)
			
			de.Decals = CreateDecal(0, r.x + 272.0 * RoomScale, 0.005, r.z + 262.0 * RoomScale, 90, Rand(360), 0)
			EntityParent(de.obj, r.obj)
			
			r.Objects[1] = LoadMesh_Strict("GFX/map/IntroDrawer.b3d")
			ScaleEntity(r.Objects[1], RoomScale, RoomScale ,RoomScale)
			PositionEntity(r.Objects[1], r.x + 448.0 * RoomScale, 0, r.z + 192.0 * RoomScale)
			EntityParent(r.Objects[1], r.obj)
			
			de.Decals = CreateDecal(0, r.x + 456.0 * RoomScale, 0.005, r.z + 135.0 * RoomScale, 90, Rand(360), 0)
			EntityParent(de.obj, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 336.0 * RoomScale, r.y + 352 * RoomScale, r.z + 48.0 * RoomScale, r, True)
			sc.angle = 270
			sc.turn = 45
			sc.room = r
			TurnEntity(sc.CameraObj, 20, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			PositionEntity(sc.ScrObj, r.x + 1456 * RoomScale, 608 * RoomScale, r.z +352.0 * RoomScale)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			EntityParent(sc.ScrObj, r.obj)
			
			r.Objects[2] = CreatePivot()
			PositionEntity (r.Objects[2], EntityX(r.obj) + 40.0 * RoomScale, 460.0 * RoomScale, EntityZ(r.obj) + 1072.0 * RoomScale)
			r.Objects[3] = CreatePivot()
			PositionEntity (r.Objects[3], EntityX(r.obj) - 80.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 526.0 * RoomScale)
			r.Objects[4] = CreatePivot()
			PositionEntity (r.Objects[4], EntityX(r.obj) - 128.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 320.0 * RoomScale)
			
			r.Objects[5] = CreatePivot()
			PositionEntity (r.Objects[5], EntityX(r.obj) + 660.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 526.0 * RoomScale)
			r.Objects[6] = CreatePivot()
			PositionEntity (r.Objects[6], EntityX(r.obj) + 700 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 320.0 * RoomScale)
			
			r.Objects[7] = CreatePivot()
			PositionEntity (r.Objects[7], EntityX(r.obj) + 1472.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 912.0 * RoomScale)
			
			for (i of range(2, 8)) {
				EntityParent(r.Objects[i], r.obj)
			}
			
			//3384,510,2400
			CreateDevilEmitter(r.x+3384.0*RoomScale,r.y+510.0*RoomScale,r.z+2400.0*RoomScale,r,1,4)
			//[End Block]
		case "room2scps":
			//[Block]
			d.Doors = CreateDoor(r.zone, r.x + 264.0 * RoomScale, 0, r.z, 90, r, True, False, 3)
			d.AutoClose = False
			d.open = False
			PositionEntity(d.buttons[0], r.x + 320.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			PositionEntity(d.buttons[1], r.x + 224.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			
			d.Doors = CreateDoor(r.zone, r.x - 264.0 * RoomScale, 0, r.z, 270, r, True, False, 3)
			d.AutoClose = False
			d.open = False
			PositionEntity(d.buttons[0], r.x - 320.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			PositionEntity(d.buttons[1], r.x - 224.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x-560.0 * RoomScale, 0, r.z - 272.0 * RoomScale, 0, r, True, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			
			r.RoomDoors[2] = CreateDoor(r.zone, r.x + 560.0 * RoomScale, 0, r.z - 272.0 * RoomScale, 180, r, True, False, 3)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = False
			
			r.RoomDoors[3] = CreateDoor(r.zone, r.x + 560.0 * RoomScale, 0, r.z + 272.0 * RoomScale, 180, r, True, False, 3)
			r.RoomDoors[3].AutoClose = False
			r.RoomDoors[3].open = False
			
			r.RoomDoors[4] = CreateDoor(r.zone, r.x-560.0 * RoomScale, 0, r.z + 272.0 * RoomScale, 0, r, True, False, 3)
            r.RoomDoors[4].AutoClose = False
			r.RoomDoors[4].open = False
			
			it = CreateItem("SCP-714", "scp714", r.x - 552.0 * RoomScale, r.y + 220.0 * RoomScale, r.z - 760.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("SCP-1025", "scp1025", r.x + 552.0 * RoomScale, r.y + 224.0 * RoomScale, r.z - 758.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("SCP-860", "scp860", r.x + 568.0 * RoomScale, r.y + 178.0 * RoomScale, r.z + 760.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x + 560.0 * RoomScale, r.y + 386 * RoomScale, r.z - 416.0 * RoomScale, r)
			sc.angle = 180
			sc.turn = 30
			TurnEntity(sc.CameraObj, 30, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 560.0 * RoomScale, r.y + 386 * RoomScale, r.z - 416.0 * RoomScale, r)
			sc.angle = 180
			sc.turn = 30
			TurnEntity(sc.CameraObj, 30, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x + 560.0 * RoomScale, r.y + 386 * RoomScale, r.z + 480.0 * RoomScale, r)
            sc.angle = 0
			sc.turn = 30
            TurnEntity(sc.CameraObj, 30, 0, 0)
            EntityParent(sc.obj, r.obj)
			
            sc.SecurityCams = CreateSecurityCam(r.x - 560.0 * RoomScale, r.y + 386 * RoomScale, r.z + 480.0 * RoomScale, r)
            sc.angle = 0
			sc.turn = 30
            TurnEntity(sc.CameraObj, 30, 0, 0)
            EntityParent(sc.obj, r.obj)
			
			it = CreateItem("Document SCP-714", "paper", r.x - 728.0 * RoomScale, r.y + 288.0 * RoomScale, r.z - 360.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-427", "paper", r.x - 608.0 * RoomScale, r.y + 66.0 * RoomScale, r.z + 636.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			let dx: float,dy: float
			for (i of range(15)) {
				switch (i) {
					case 0:
						dx = -64.0
						dz = -516.0
					case 1:
						dx = -96.0
						dz = -388.0
					case 2:
						dx = -128.0
						dz = -292.0
					case 3:
						dx = -128.0
						dz = -132.0
					case 4:
						dx = -160.0
						dz = -36.0
					case 5:
						dx = -192.0
						dz = 28.0
					case 6:
						dx = -384.0
						dz = 28.0
					case 7:
						dx = -448.0
						dz = 92.0
					case 8:
						dx = -480.0
						dz = 124.0
					case 9:
						dx = -512.0
						dz = 156.0
					case 10:
						dx = -544.0
						dz = 220.0
					case 11:
						dx = -544.0
						dz = 380.0
					case 12:
						dx = -544.0
						dz = 476.0
					case 13:
						dx = -544.0
						dz = 572.0
					case 14:
						dx = -544.0
						dz = 636.0
				}
				de.Decals = CreateDecal(Rand(15,16),r.x+dx * RoomScale,0.005,r.z+dz * RoomScale,90,Rand(360),0)
				if (i > 10) {
					de.Size = Rnd(0.2,0.25)
				} else {
					de.Size = Rnd(0.1,0.17)
				}
				EntityAlpha(de.obj, 1.0)
				ScaleSprite(de.obj,de.Size,de.Size)
				EntityParent(de.obj, r.obj)
			}
			//[End Block]
		case "room205":
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 128.0 * RoomScale, 0, r.z + 640.0 *RoomScale, 90, r, True, False, 3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = False
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 1392.0 * RoomScale, -128.0 * RoomScale, r.z - 384*RoomScale, 0, r, True, False, 3, "", True)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			FreeEntity(r.RoomDoors[0].buttons[0])
			r.RoomDoors[0].buttons[0]=0
			FreeEntity(r.RoomDoors[0].buttons[1])
			r.RoomDoors[0].buttons[1]=0
			
			sc.SecurityCams = CreateSecurityCam(r.x - 1152.0 * RoomScale, r.y + 900.0 * RoomScale, r.z + 176.0 * RoomScale, r, True)
			sc.angle = 90
			sc.turn = 0
			EntityParent(sc.obj, r.obj)
			
			sc.AllowSaving = False
			sc.RenderInterval = 0
			
			EntityParent(sc.ScrObj, 0)
			PositionEntity(sc.ScrObj, r.x - 1716.0 * RoomScale, r.y + 160.0 * RoomScale, r.z + 176.0 * RoomScale, True)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			ScaleSprite(sc.ScrObj, 896.0*0.5*RoomScale, 896.0*0.5*RoomScale)
			
			EntityParent(sc.ScrObj, r.obj)
			
			CameraZoom (sc.Cam, 1.5)
			
			HideEntity(sc.ScrOverlay)
			HideEntity(sc.MonitorObj)
			
			r.Objects[0] = CreatePivot(r.obj)
			PositionEntity(r.Objects[0], r.x - 1536.0 * RoomScale, r.y + 730.0 * RoomScale, r.z + 192.0 * RoomScale, True)
			RotateEntity(r.Objects[0], 0,-90,0,True)
			
			r.Objects[1] = sc.ScrObj
			
			//[End Block]
		case "endroom":
			//[Block]
			r.RoomDoors[0] = CreateDoor(r.zone, r.x, 0, r.z + 1136 * RoomScale, 0, r, False, True, 6)
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = False
			FreeEntity(r.RoomDoors[0].buttons[0])
			r.RoomDoors[0].buttons[0]=0
			FreeEntity(r.RoomDoors[0].buttons[1])
			r.RoomDoors[0].buttons[1]=0
			//[End Block]
		case "endroomc":
			//[Block]
			d = CreateDoor(r.zone, r.x+1024*RoomScale, 0, r.z, 0, r, False, 2, False, "")
			d.open = False
			d.AutoClose = False
			d.locked = True
			//[End Block]
		case "coffin":
			//[Block]
			d = CreateDoor(r.zone, r.x, 0, r.z - 448.0 * RoomScale, 0, r, False, True, 2)
			d.AutoClose = False
			d.open = False
			PositionEntity(d.buttons[0], r.x - 384.0 * RoomScale, 0.7, r.z - 280.0 * RoomScale, True)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 320.0 * RoomScale, r.y + 704 * RoomScale, r.z + 288.0 * RoomScale, r, True)
			sc.angle = 45 + 180
			sc.turn = 45
			sc.CoffinEffect = True
			TurnEntity(sc.CameraObj, 120, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			CoffinCam = sc
			
			PositionEntity(sc.ScrObj, r.x - 800 * RoomScale, 288.0 * RoomScale, r.z - 340.0 * RoomScale)
			EntityParent(sc.ScrObj, r.obj)
			TurnEntity(sc.ScrObj, 0, 180, 0)
			
			r.Objects[2] = CopyEntity(LeverBaseOBJ)
			r.Objects[3] = CopyEntity(LeverOBJ)
				
			r.Levers[0] = r.Objects[3]
				
			for (i of range(2)) {
				ScaleEntity(r.Objects[2 + i], 0.04, 0.04, 0.04)
				PositionEntity (r.Objects[2 + i], r.x - 800.0 * RoomScale, r.y + 180.0 * RoomScale, r.z - 336 * RoomScale, True)
					
				EntityParent(r.Objects[2 + i], r.obj)
			}
			RotateEntity(r.Objects[2], 0, 180, 0)
			RotateEntity(r.Objects[3], 10, 0, 0)
			
			EntityPickMode(r.Objects[3], 1, False)
			EntityRadius(r.Objects[3], 0.1)
			
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x, -1320.0 * RoomScale, r.z + 2304.0 * RoomScale)
			EntityParent(r.Objects[0], r.obj)
			
			it = CreateItem("Document SCP-895", "paper", r.x - 688.0 * RoomScale, r.y + 133.0 * RoomScale, r.z - 304.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Level 3 Key Card", "key3", r.x + 240.0 * RoomScale, r.y -1456.0 * RoomScale, r.z + 2064.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Night Vision Goggles", "nvgoggles", r.x + 280.0 * RoomScale, r.y -1456.0 * RoomScale, r.z + 2164.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it.state = 400
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x + 96.0*RoomScale, -1532.0 * RoomScale, r.z + 2016.0 * RoomScale,True)
			
		case "room2tesla","room2tesla_lcz","room2tesla_hcz":
			//[Block]
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x - 114.0 * RoomScale, 0.0, r.z)
			EntityParent(r.Objects[0], r.obj)
			
			r.Objects[1] = CreatePivot()
			PositionEntity(r.Objects[1], r.x + 114.0 * RoomScale, 0.0, r.z)
			EntityParent(r.Objects[1], r.obj)			
			
			r.Objects[2] = CreatePivot()
			PositionEntity(r.Objects[2], r.x, 0.0, r.z)
			EntityParent(r.Objects[2], r.obj)	
			
			r.Objects[3] = CreateSprite()
			EntityTexture (r.Objects[3], TeslaTexture)
			SpriteViewMode(r.Objects[3],2) 
			EntityBlend (r.Objects[3], 3) 
			EntityFX(r.Objects[3], 1 + 8 + 16)
			
			PositionEntity(r.Objects[3], r.x, 0.8, r.z)
			
			HideEntity(r.Objects[3])
			EntityParent(r.Objects[3], r.obj)
			
			w.waypoints = CreateWaypoint(r.x, r.y + 66.0 * RoomScale, r.z + 292.0 * RoomScale, null, r)
			w2.waypoints = CreateWaypoint(r.x, r.y + 66.0 * RoomScale, r.z - 284.0 * RoomScale, null, r)
			w.connected[0] = w2
			w.dist[0] = EntityDistance(w.obj, w2.obj)
			w2.connected[0] = w
			w2.dist[0] = w.dist[0]
			
			r.Objects[4] = CreateSprite()
			PositionEntity(r.Objects[4], r.x - 32 * RoomScale, 568 * RoomScale, r.z)
			ScaleSprite(r.Objects[4], 0.03, 0.03)
			EntityTexture(r.Objects[4], LightSpriteTex(1))
			EntityBlend (r.Objects[4], 3)
			EntityParent(r.Objects[4], r.obj)
			HideEntity(r.Objects[4])
			
			r.Objects[5] = CreatePivot()
			PositionEntity(r.Objects[5],r.x,0,r.z-800*RoomScale)
			EntityParent(r.Objects[5],r.obj)
			
			r.Objects[6] = CreatePivot()
			PositionEntity(r.Objects[6],r.x,0,r.z+800*RoomScale)
			EntityParent(r.Objects[6],r.obj)
			
			for (r2 of Rooms.each) {
				if (r2 != r) {
					if (r2.RoomTemplate.Name == "room2tesla" || r2.RoomTemplate.Name == "room2tesla_lcz" || r2.RoomTemplate.Name == "room2tesla_hcz") {
						r.Objects[7] = CopyEntity(r2.Objects[7],r.obj) //don't load the mesh again
						break
					}
				}
			}
			if (r.Objects[7] == 0) {
				r.Objects[7] = LoadMesh_Strict("GFX/map/room2tesla_caution.b3d",r.obj)
			}
			
		case "room2doors":
			//[Block]
			d = CreateDoor(r.zone, r.x, 0, r.z + 528.0 * RoomScale, 0, r, True)
			d.AutoClose = False
			PositionEntity (d.buttons[0], r.x - 832.0 * RoomScale, 0.7, r.z + 160.0 * RoomScale, True)
			PositionEntity (d.buttons[1], r.x + 160.0 * RoomScale, 0.7, r.z + 536.0 * RoomScale, True)
			
			d2 = CreateDoor(r.zone, r.x, 0, r.z - 528.0 * RoomScale, 180, r, True)
			d2.AutoClose = False
			FreeEntity (d2.buttons[0])
			d2.buttons[0] = 0
			PositionEntity (d2.buttons[1], r.x +160.0 * RoomScale, 0.7, r.z - 536.0 * RoomScale, True)
			
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0], r.x - 832.0 * RoomScale, 0.5, r.z)
			EntityParent(r.Objects[0], r.obj)
			
			d2.LinkedDoor = d
			d.LinkedDoor = d2
			
			d.open = False
			d2.open = True
		case "914":
			
			r.RoomDoors[2] = CreateDoor(r.zone,r.x,0,r.z-368.0*RoomScale,0,r,False,True,2)
			r.RoomDoors[2].dir=1
			r.RoomDoors[2].AutoClose=False
			r.RoomDoors[2].open=False
			PositionEntity (r.RoomDoors[2].buttons[0], r.x - 496.0 * RoomScale, 0.7, r.z - 272.0 * RoomScale, True)
			TurnEntity(r.RoomDoors[2].buttons[0], 0, 90, 0)
			
			r.Objects[0] = LoadMesh_Strict("GFX/map/914key.x")
			r.Objects[1] = LoadMesh_Strict("GFX/map/914knob.x")
			
			for (i of range(2)) {
				ScaleEntity(r.Objects[i], RoomScale, RoomScale, RoomScale)
				EntityPickMode(r.Objects[i], 2)
			}
			
			PositionEntity (r.Objects[0], r.x, r.y + 190.0 * RoomScale, r.z + 374.0 * RoomScale)
			PositionEntity (r.Objects[1], r.x, r.y + 230.0 * RoomScale, r.z + 374.0 * RoomScale)
			EntityParent(r.Objects[0], r.obj)
			EntityParent(r.Objects[1], r.obj)
			
			d = CreateDoor(r.zone, r.x - 624.0 * RoomScale, 0.0, r.z + 528.0 * RoomScale, 180, r, True)
			FreeEntity (d.obj2)
			d.obj2 = 0
			FreeEntity (d.buttons[0])
			d.buttons[0] = 0
			FreeEntity (d.buttons[1])
			d.buttons[1] = 0
			d.dir = 4
			r.RoomDoors[0] = d
			d.AutoClose = False
			
			d = CreateDoor(r.zone, r.x + 816.0 * RoomScale, 0.0, r.z + 528.0 * RoomScale, 180, r, True)
			FreeEntity (d.obj2)
			d.obj2 = 0	
			FreeEntity (d.buttons[0])
			d.buttons[0] = 0
			FreeEntity (d.buttons[1])
			d.buttons[1] = 0
			d.dir = 4
			r.RoomDoors[1] = d
			d.AutoClose = False
			
			r.Objects[2] = CreatePivot()
			r.Objects[3] = CreatePivot()
			PositionEntity(r.Objects[2], r.x - 712.0 * RoomScale, 0.5, r.z + 640.0 * RoomScale)
			PositionEntity(r.Objects[3], r.x + 728.0 * RoomScale, 0.5, r.z + 640.0 * RoomScale)
			EntityParent(r.Objects[2], r.obj)
			EntityParent(r.Objects[3], r.obj)
			
			it = CreateItem("Addendum: 5/14 Test Log", "paper", r.x +954.0 * RoomScale, r.y +228.0 * RoomScale, r.z + 127.0 * RoomScale)
			EntityParent(it.collider, r.obj)	
			
			it = CreateItem("First Aid Kit", "firstaid", r.x + 960.0 * RoomScale, r.y + 112.0 * RoomScale, r.z - 40.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			RotateEntity(it.collider, 0, 90, 0)
			
			it = CreateItem("Dr. L's Note", "paper", r.x - 928.0 * RoomScale, 160.0 * RoomScale, r.z - 160.0 * RoomScale)
			EntityParent(it.collider, r.obj)

		case "173":
			//[Block]
			r.Objects[0] = CreatePivot()
			PositionEntity (r.Objects[0], EntityX(r.obj) + 40.0 * RoomScale, 460.0 * RoomScale, EntityZ(r.obj) + 1072.0 * RoomScale)
			r.Objects[1] = CreatePivot()
			PositionEntity (r.Objects[1], EntityX(r.obj) - 80.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 526.0 * RoomScale)
			r.Objects[2] = CreatePivot()
			PositionEntity (r.Objects[2], EntityX(r.obj) - 128.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 320.0 * RoomScale)
			
			r.Objects[3] = CreatePivot()
			PositionEntity (r.Objects[3], EntityX(r.obj) + 660.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 526.0 * RoomScale)
			r.Objects[4] = CreatePivot()
			PositionEntity (r.Objects[4], EntityX(r.obj) + 700 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 320.0 * RoomScale)
			
			r.Objects[5] = CreatePivot()
			PositionEntity (r.Objects[5], EntityX(r.obj) + 1472.0 * RoomScale, 100.0 * RoomScale, EntityZ(r.obj) + 912.0 * RoomScale)
			
			for (i of range(6)) {
				EntityParent(r.Objects[i], r.obj)
			}
			
			r.RoomDoors[1] = CreateDoor(r.zone, EntityX(r.obj) + 288.0 * RoomScale, 0, EntityZ(r.obj) + 384.0 * RoomScale, 90, r, False, True)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].dir = 1
			r.RoomDoors[1].open = False
			
			FreeEntity(r.RoomDoors[1].buttons[0])
			r.RoomDoors[1].buttons[0] = 0
			FreeEntity(r.RoomDoors[1].buttons[1])
			r.RoomDoors[1].buttons[1] = 0
			
			de.Decals = CreateDecal(Rand(4, 5), EntityX(r.Objects[5], True), 0.002, EntityZ(r.Objects[5], True), 90, Rnd(360), 0)
			de.Size = 1.2
			ScaleSprite(de.obj, de.Size, de.Size)
			
			for (xtemp of range(2)) {
				for (ztemp of range(2)) {
					de.Decals = CreateDecal(Rand(4, 6), r.x + 700.0 * RoomScale + xtemp * 700.0 * RoomScale + Rnd(-0.5, 0.5), Rnd(0.001, 0.0018), r.z + 600 * ztemp * RoomScale + Rnd(-0.5, 0.5), 90, Rnd(360), 0)
					de.Size = Rnd(0.5, 0.8)
					de.Alpha = Rnd(0.8, 1.0)
					ScaleSprite(de.obj, de.Size, de.Size)
				}
			}
						
			r.RoomDoors[2] = CreateDoor(r.zone, r.x - 1008.0 * RoomScale, 0, r.z - 688.0 * RoomScale, 90, r, True, False, False, "", True)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[2].open = False
			r.RoomDoors[2].locked = True
			FreeEntity(r.RoomDoors[2].buttons[0])
			r.RoomDoors[2].buttons[0] = 0
			FreeEntity(r.RoomDoors[2].buttons[1])
			r.RoomDoors[2].buttons[1] = 0
			
			r.RoomDoors[3] = CreateDoor(r.zone, r.x - 2320.0 * RoomScale, 0, r.z - 1248.0 * RoomScale, 90, r, True)
			r.RoomDoors[3].AutoClose = False
			r.RoomDoors[3].open = True
			r.RoomDoors[3].locked = True
			
			r.RoomDoors[4] = CreateDoor(r.zone, r.x - 4352.0 * RoomScale, 0, r.z - 1248.0 * RoomScale, 90, r, True)
			r.RoomDoors[4].AutoClose = False
			r.RoomDoors[4].open = True
			r.RoomDoors[4].locked = True	
			
			//the door in the office below the walkway
			r.RoomDoors[7] = CreateDoor(r.zone, r.x - 3712.0 * RoomScale, -385*RoomScale, r.z - 128.0 * RoomScale, 0, r, True)
			r.RoomDoors[7].AutoClose = False
			r.RoomDoors[7].open = True
			
			d.Doors = CreateDoor(r.zone, r.x - 3712 * RoomScale, -385*RoomScale, r.z - 2336 * RoomScale, 0, r, False)
			d.locked = True
			d.DisableWaypoint = True
			
			//the door from the concrete tunnel to the large hall
			d.Doors = CreateDoor(r.zone, r.x - 6864 * RoomScale, 0, r.z - 1248 * RoomScale, 90, r, True)
			d.AutoClose = False
			d.locked = True
			
			//the locked door to the lower level of the hall
			d.Doors = CreateDoor(r.zone, r.x - 5856 * RoomScale, 0, r.z - 1504 * RoomScale, 0, r, False)
			d.locked = True
			d.DisableWaypoint = True
			
			//the door to the staircase in the office room
			d.Doors = CreateDoor(r.zone, r.x - 2432 * RoomScale, 0, r.z - 1000 * RoomScale, 0, r, False)
			PositionEntity(d.buttons[0], r.x - 2592 * RoomScale, EntityY(d.buttons[0],True), r.z - 1016 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x - 2592 * RoomScale, EntityY(d.buttons[0],True), r.z - 984 * RoomScale, True)
			d.locked = True
			d.DisableWaypoint = True
			
			tex = LoadTexture_Strict("GFX/map/Door02.jpg")
			for (ztemp of range(2)) {
				d.Doors = CreateDoor(r.zone, r.x - 5760 * RoomScale, 0, r.z + (320+896*ztemp) * RoomScale, 0, r, False)
				d.locked = True
				d.DisableWaypoint = True
				
				d.Doors = CreateDoor(r.zone, r.x - 8288 * RoomScale, 0, r.z + (320+896*ztemp) * RoomScale, 0, r, False)
				d.locked = True
				if (ztemp = 0) {
					d.open = True
				} else {
					d.DisableWaypoint = True
				}
				
				for (xtemp of range(3)) {
					d.Doors = CreateDoor(r.zone, r.x - (7424.0-512.0*xtemp) * RoomScale, 0, r.z + (1008.0-480.0*ztemp) * RoomScale, 180*(!ztemp), r, False)
					EntityTexture(d.obj, tex)
					d.locked = True
					FreeEntity(d.obj2)
					d.obj2=0
					FreeEntity(d.buttons[0])
					d.buttons[0]=0
					FreeEntity(d.buttons[1])
					d.buttons[1]=0
					d.DisableWaypoint = True
				}					
				for (xtemp of range(5)) {
					d.Doors = CreateDoor(r.zone, r.x - (5120.0-512.0*xtemp) * RoomScale, 0, r.z + (1008.0-480.0*ztemp) * RoomScale, 180*(!ztemp), r, False)
					EntityTexture(d.obj, tex)
					d.locked = True
					FreeEntity(d.obj2)
					d.obj2=0
					FreeEntity(d.buttons[0])
					d.buttons[0]=0
					FreeEntity(d.buttons[1])
					d.buttons[1]=0	
					d.DisableWaypoint = True
					
					if (xtemp == 2 && ztemp == 1) {
						r.RoomDoors[6] = d
					}
				}	
			}
			
			CreateItem("Class D Orientation Leaflet", "paper", r.x-(2914+1024)*RoomScale, 170.0*RoomScale, r.z+40*RoomScale)
			
			sc.SecurityCams = CreateSecurityCam(r.x - 4048.0 * RoomScale, r.y - 32.0 * RoomScale, r.z - 1232.0 * RoomScale, r, True)
			sc.angle = 270
			sc.turn = 45
			sc.room = r
			TurnEntity(sc.CameraObj, 20, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			PositionEntity(sc.ScrObj, r.x - 2256 * RoomScale, 224.0 * RoomScale, r.z - 928.0 * RoomScale)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			EntityParent(sc.ScrObj, r.obj)
			
			r.Objects[9] = LoadMesh_Strict("GFX/map/173_2.b3d",r.obj)
			EntityType(r.Objects[9],HIT_MAP)
			EntityPickMode(r.Objects[9],2)
			
			r.Objects[10] = LoadMesh_Strict("GFX/map/intro_labels.b3d",r.obj)
			
		case "room2ccont":
			//[Block]
			d = CreateDoor(r.zone, r.x + 64.0 * RoomScale, 0.0, r.z + 368.0 * RoomScale, 180, r, False, False, 2)
			d.AutoClose = False
			d.open = False
			
			it = CreateItem("Note from Daniel", "paper", r.x-400.0*RoomScale,1040.0*RoomScale,r.z+115.0*RoomScale)
			EntityParent(it.collider, r.obj)
			
			for (n of range(3)) {
				r.Objects[n * 2] = CopyEntity(LeverBaseOBJ)
				r.Objects[n * 2 + 1] = CopyEntity(LeverOBJ)
				
				r.Levers[n] = r.Objects[n * 2 + 1]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n * 2 + i], 0.04, 0.04, 0.04)
					PositionEntity (r.Objects[n * 2 + i], r.x - 240.0 * RoomScale, r.y + 1104.0 * RoomScale, r.z + (632.0 - 64.0 * n) * RoomScale, True)
					
					EntityParent(r.Objects[n * 2 + i], r.obj)
				}
				RotateEntity(r.Objects[n * 2], 0, -90, 0)
				RotateEntity(r.Objects[n * 2 + 1], 10, -90 - 180, 0)
				
				EntityPickMode(r.Objects[n * 2 + 1], 1, False)
				EntityRadius(r.Objects[n * 2 + 1], 0.1)
			}
			
			sc.SecurityCams = CreateSecurityCam(r.x-265.0*RoomScale, r.y+1280.0*RoomScale, r.z+105.0*RoomScale, r)
			sc.angle = 45
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
		case "room106":
			//[Block]
			it = CreateItem("Level 5 Key Card", "key5", r.x - 752.0 * RoomScale, r.y - 592 * RoomScale, r.z + 3026.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Dr. Allok's Note", "paper", r.x - 416.0 * RoomScale, r.y - 576 * RoomScale, r.z + 2492.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Recall Protocol RP-106-N", "paper", r.x + 268.0 * RoomScale, r.y - 576 * RoomScale, r.z + 2593.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			d = CreateDoor(r.zone, r.x - 968.0 * RoomScale, -764.0 * RoomScale, r.z + 1392.0 * RoomScale, 0, r, False, False, 4)
			d.AutoClose = False
			d.open = False	
			
			d = CreateDoor(r.zone, r.x, 0, r.z - 464.0 * RoomScale, 0, r, False, False, 4)
			d.AutoClose = False
			d.open = False			
			
			d = CreateDoor(r.zone, r.x - 624.0 * RoomScale, -1280.0 * RoomScale, r.z, 90, r, False, False, 4)
			d.AutoClose = False
			d.open = False	
			
			r.Objects[6] = LoadMesh_Strict("GFX/map/room1062.b3d")
			
			ScaleEntity (r.Objects[6],RoomScale,RoomScale,RoomScale)
			EntityType(r.Objects[6], HIT_MAP)
			EntityPickMode(r.Objects[6], 3)
			PositionEntity(r.Objects[6],r.x+784.0*RoomScale,-980.0*RoomScale,r.z+720.0*RoomScale,True)

			
			EntityParent(r.Objects[6], r.obj)
			
			for (n of range(0, 3, 2)) {
				r.Objects[n] = CopyEntity(LeverBaseOBJ)
				r.Objects[n+1] = CopyEntity(LeverOBJ)
				
				r.Levers[n/2] = r.Objects[n+1]
				
				for (i of range(2)) {
					ScaleEntity(r.Objects[n+i], 0.04, 0.04, 0.04)
					PositionEntity (r.Objects[n+i], r.x - (555.0 - 81.0 * (n/2)) * RoomScale, r.y - 576.0 * RoomScale, r.z + 3040.0 * RoomScale, True)
					
					EntityParent(r.Objects[n+i], r.obj)
				}
				RotateEntity(r.Objects[n], 0, 0, 0)
				RotateEntity(r.Objects[n+1], 10, -180, 0)
				
				EntityPickMode(r.Objects[n+1], 1, False)
				EntityRadius(r.Objects[n+1], 0.1)
			}
			
			RotateEntity(r.Objects[1], 81,-180,0)
			RotateEntity(r.Objects[3], -81,-180,0)			
			
			r.Objects[4] = CreateButton(r.x - 146.0*RoomScale, r.y - 576.0 * RoomScale, r.z + 3045.0 * RoomScale, 0,0,0)
			EntityParent (r.Objects[4],r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x + 768.0 * RoomScale, r.y + 1392.0 * RoomScale, r.z + 1696.0 * RoomScale, r, True)
			sc.angle = 45 + 90 + 180
			sc.turn = 20
			TurnEntity(sc.CameraObj, 45, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			r.Objects[7] = sc.CameraObj
			r.Objects[8] = sc.obj
			
			PositionEntity(sc.ScrObj, r.x - 272.0 * RoomScale, -544.0 * RoomScale, r.z + 3020.0 * RoomScale)
			TurnEntity(sc.ScrObj, 0, -10, 0)
			EntityParent(sc.ScrObj, r.obj)
			sc.CoffinEffect=0
			
			r.Objects[5] = CreatePivot()
			TurnEntity(r.Objects[5], 0,180,0)
			PositionEntity (r.Objects[5], r.x + 1088.0 * RoomScale, 1104.0 * RoomScale, r.z + 1888.0 * RoomScale) 
			EntityParent(r.Objects[5], r.obj)
			
			r.Objects[9] = CreatePivot(r.obj)
			PositionEntity (r.Objects[9], r.x - 272 * RoomScale, r.y - 672.0 * RoomScale, r.z + 2736.0 * RoomScale, True)
			
			r.Objects[10] = CreatePivot(r.obj)
			PositionEntity (r.Objects[10], r.x, r.y, r.z - 720.0 * RoomScale, True)
			
		case "room1archive":
			//[Block]
			for (xtemp of range(1 + 1)) {
				for (ytemp of range(2 + 1)) {
					for (ztemp of range(2 + 1)) {
						
						tempstr = "9V Battery"
						tempstr2 = "bat"
						chance = Rand(-10,100)
						switch (True) {
							case (chance<0):
								Exit
							case (chance<40): //40: int chance for a document
								tempstr="Document SCP-"
								switch (Rand(1,6)) {
									case 1:
										tempstr=tempstr+"1123"
									case 2:
										tempstr=tempstr+"1048"
									case 3:
										tempstr=tempstr+"939"
									case 4:
										tempstr=tempstr+"682"
									case 5:
										tempstr=tempstr+"079"
									case 6:
										tempstr=tempstr+"096"
									case 6:
										tempstr=tempstr+"966"
								}
								tempstr2="paper"
							case ((chance>=40) && (chance<45)): //5: int chance for a key card
								temp3=Rand(1,2)
								tempstr="Level "+Str(temp3)+" Key Card"
								tempstr2="key"+Str(temp3)
							case ((chance>=45) && (chance<50)): //5 chance for a medkit
								tempstr="First Aid Kit"
								tempstr2="firstaid"
							case ((chance>=50) && (chance<60)): //10 chance for a battery
								tempstr="9V Battery"
								tempstr2="bat"
							case ((chance>=60) && (chance<70)): //10 chance for an SNAV
								tempstr="S-NAV 300 Navigator"
								tempstr2="nav"
							case ((chance>=70) && (chance<85)): //15 chance for a radio
								tempstr="Radio Transceiver"
								tempstr2="radio"
							case ((chance>=85) && (chance<95)): //10 chance for a clipboard
								tempstr="Clipboard"
								tempstr2="clipboard"
							case ((chance>=95) && (chance <= 100)): //5 chance for misc
								temp3 = Rand(1,3)
								switch (temp3) {
									case 1: //playing card
										tempstr="Playing Card"
									case 2: //Mastercard
										tempstr="Mastercard"
									case 3: //origami
										tempstr="Origami"
								}
								tempstr2="misc"
						}
						
						x = (-672.0 + 864.0 * xtemp)* RoomScale
						y = (96.0  + 96.0 * ytemp) * RoomScale
						z = (480.0 - 352.0*ztemp + Rnd(-96.0,96.0)) * RoomScale
						
						it = CreateItem(tempstr,tempstr2,r.x+x,y,r.z+z)
						EntityParent (it.collider,r.obj)
					}
				}
			}
			
			r.RoomDoors[0] = CreateDoor(r.zone,r.x,r.y,r.z - 528.0 * RoomScale,0,r,False,False,6)
			
			sc.SecurityCams = CreateSecurityCam(r.x-256.0*RoomScale, r.y+384.0*RoomScale, r.z+640.0*RoomScale, r)
			sc.angle = 180
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
		case "room2test1074":
			//[Block]
			r.RoomDoors[0] = CreateDoor(r.zone,r.x,r.y,r.z,0,r,False,False,False,"")
			r.RoomDoors[0].locked = True
			r.RoomDoors[1] = CreateDoor(r.zone,r.x + 336.0 * RoomScale,r.y,r.z + 671.0 * RoomScale,90,r,True,False,3)
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[2] = CreateDoor(r.zone,r.x + 336.0 * RoomScale,r.y,r.z - 800.0 * RoomScale,90,r,True,False,3)
			r.RoomDoors[2].AutoClose = False
			r.RoomDoors[3] = CreateDoor(r.zone,r.x + 672.0 * RoomScale,r.y,r.z,0,r,False,False)
			
			r.Textures[0] = LoadTexture("GFX/map/1074tex0.jpg") //blank texture (ripped from official article), seen when you put on 714
			r.Textures[1] = LoadTexture("GFX/map/1074tex1.jpg") //texture depicting subject D-9341 (the player)
			TextureBlend (r.Textures[0], 5) //texture
			TextureBlend (r.Textures[1], 5) //blends
			
			it = CreateItem("Document SCP-1074","paper",r.x + 300.0 * RoomScale,r.y+20.0*RoomScale,r.z + 671.0*RoomScale)
			EntityParent(it.collider, r.obj)
			
			r.Objects[0] = CreatePivot() //painting pivot: the player will be attracted when it sees this.
			PositionEntity(r.Objects[0],r.x + 835.0 * RoomScale,r.y + 165.0 * RoomScale,r.z + 540.0 * RoomScale, True)
			EntityParent(r.Objects[0],r.obj)
			r.Objects[1] = CreatePivot() //floor pivot: the player will walk to this point when it sees the painting pivot.
			PositionEntity(r.Objects[1],r.x + 835.0 * RoomScale,r.y + 10.0 * RoomScale,r.z + 300.0 * RoomScale, True)
			EntityParent(r.Objects[1],r.obj)
			//let sf,b,t,msh
			msh = GetChild(r.obj,2) //the second child is the rendered mesh
			r.NonFreeAble[0] = GetSurface(msh,1) //a failsafe if the correct surface isn't found
			for (tempint of range(1, CountSurfaces(msh) + 1)) {
				sf = GetSurface(msh,tempint)
				b = GetSurfaceBrush( sf )
				t = GetBrushTexture(b, 1)
				texname$ = StripPath(TextureName(t))
				DebugLog ("texname: "+texname)
				if (Lower(texname) == "1074tex1.jpg") {
					r.NonFreeAble[0] = sf //the surface holding 1074's texture
					FreeTexture(t)
					FreeBrush(b)
					break
				}
				if (texname != "") {
					FreeTexture(t)
				}
				FreeBrush(b)
			}
			
		case "room1123":
			//[Block]
			it = CreateItem("Document SCP-1123", "paper", r.x + 511.0 * RoomScale, r.y + 125.0 * RoomScale, r.z - 936.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("SCP-1123", "1123", r.x + 832.0 * RoomScale, r.y + 166.0 * RoomScale, r.z + 784.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Leaflet", "paper", r.x - 816.0 * RoomScale, r.y + 704.0 * RoomScale, r.z+ 888.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Gas Mask", "gasmask", r.x + 457.0 * RoomScale, r.y + 150.0 * RoomScale, r.z + 960.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			d.Doors = CreateDoor(r.zone, r.x + 832.0 * RoomScale, 0.0, r.z + 367.0 * RoomScale, 0, r, False, False, 3)
			PositionEntity(d.buttons[0], r.x + 956.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 352.0 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x + 713.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 384.0 * RoomScale, True)
			FreeEntity(d.obj2)
			d.obj2 = 0
			d.Doors = CreateDoor(r.zone, r.x + 280.0 * RoomScale, 0.0, r.z - 607.0 * RoomScale, 90, r, False, False)
			PositionEntity(d.buttons[0], EntityX(d.buttons[0],True), EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			PositionEntity(d.buttons[1], EntityX(d.buttons[1],True), EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			
			d.Doors = CreateDoor(r.zone, r.x + 280.0 * RoomScale, 512.0 * RoomScale, r.z - 607.0 * RoomScale, 90, r, False, False)
			PositionEntity(d.buttons[0], EntityX(d.buttons[0],True), EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			FreeEntity(d.buttons[1])
			d.buttons[1]=0
			r.RoomDoors[0] = d
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3], r.x + 832.0 * RoomScale, r.y + 166.0 * RoomScale, r.z + 784.0 * RoomScale, True)
			r.Objects[4] = CreatePivot(r.obj)
			PositionEntity(r.Objects[4], r.x -648.0 * RoomScale, r.y + 592.0 * RoomScale, r.z + 692.0 * RoomScale, True)
			r.Objects[5] = CreatePivot(r.obj)
			PositionEntity(r.Objects[5], r.x + 828.0 * RoomScale, r.y + 592.0 * RoomScale, r.z + 592.0 * RoomScale, True)
			
			r.Objects[6] = CreatePivot(r.obj)
			PositionEntity(r.Objects[6], r.x - 76.0 * RoomScale, r.y + 620.0 * RoomScale, r.z + 744.0 * RoomScale, True)
			r.Objects[7] = CreatePivot(r.obj)
			PositionEntity(r.Objects[7], r.x - 640.0 * RoomScale, r.y + 620.0 * RoomScale, r.z - 864.0 * RoomScale, True)	
			
			r.Objects[8] = LoadMesh_Strict("GFX/map/forest/door_frame.b3d")
			PositionEntity(r.Objects[8], r.x - 272.0 * RoomScale, 512.0 * RoomScale, r.z + 288.0 * RoomScale,True)
			RotateEntity(r.Objects[8],0,90,0,True)
			ScaleEntity(r.Objects[8],45.0*RoomScale,45.0*RoomScale,80.0*RoomScale,True)
			EntityParent(r.Objects[8],r.obj)
			
			r.Objects[9] =  LoadMesh_Strict("GFX/map/forest/door.b3d")
			PositionEntity(r.Objects[9],r.x - 272.0 * RoomScale, 512.0 * RoomScale, r.z + (288.0-70) * RoomScale,True)
			RotateEntity(r.Objects[9],0,10,0,True)
			EntityType(r.Objects[9], HIT_MAP)
			ScaleEntity(r.Objects[9],46.0*RoomScale,45.0*RoomScale,46.0*RoomScale,True)
			EntityParent(r.Objects[9],r.obj)
			
			r.Objects[10] = CopyEntity(r.Objects[8])
			PositionEntity(r.Objects[10], r.x - 272.0 * RoomScale, 512.0 * RoomScale, r.z + 736.0 * RoomScale,True)
			RotateEntity(r.Objects[10],0,90,0,True)
			ScaleEntity(r.Objects[10],45.0*RoomScale,45.0*RoomScale,80.0*RoomScale,True)
			EntityParent(r.Objects[10],r.obj)
			
			r.Objects[11] =  CopyEntity(r.Objects[9])
			PositionEntity(r.Objects[11],r.x - 272.0 * RoomScale, 512.0 * RoomScale, r.z + (736.0-70) * RoomScale,True)
			RotateEntity(r.Objects[11],0,90,0,True)
			EntityType(r.Objects[11], HIT_MAP)
			ScaleEntity(r.Objects[11],46.0*RoomScale,45.0*RoomScale,46.0*RoomScale,True)
			EntityParent(r.Objects[11],r.obj)
			
			r.Objects[12] = CopyEntity(r.Objects[8])
			PositionEntity(r.Objects[12], r.x - 592.0 * RoomScale, 512.0 * RoomScale, r.z - 704.0 * RoomScale,True)
			RotateEntity(r.Objects[12],0,0,0,True)
			ScaleEntity(r.Objects[12],45.0*RoomScale,45.0*RoomScale,80.0*RoomScale,True)
			EntityParent(r.Objects[12],r.obj)
			
			r.Objects[13] =  CopyEntity(r.Objects[9])
			PositionEntity(r.Objects[13],r.x - (592.0+70.0) * RoomScale, 512.0 * RoomScale, r.z - 704.0 * RoomScale,True)
			RotateEntity(r.Objects[13],0,0,0,True)
			EntityType(r.Objects[13], HIT_MAP)
			ScaleEntity(r.Objects[13],46.0*RoomScale,45.0*RoomScale,46.0*RoomScale,True)
			EntityParent(r.Objects[13],r.obj	)
			
			r.Objects[14] = LoadMesh_Strict("GFX/map/1123_hb.b3d",r.obj)
			EntityPickMode(r.Objects[14],2)
			EntityType(r.Objects[14],HIT_MAP)
			EntityAlpha(r.Objects[14],0.0)
			
		case "pocketdimension":
			//[Block]
			let hallway = LoadMesh_Strict("GFX/map/pocketdimension2.b3d") //the tunnels in the first room
			r.Objects[8]=LoadMesh_Strict("GFX/map/pocketdimension3.b3d")	//the room with the throne, moving pillars etc 
			r.Objects[9]=LoadMesh_Strict("GFX/map/pocketdimension4.b3d") //the flying pillar
			r.Objects[10]=CopyEntity(r.Objects[9])
			
			r.Objects[11]=LoadMesh_Strict("GFX/map/pocketdimension5.b3d") //the pillar room
			
			
			terrain = LoadMesh_Strict("GFX/map/pocketdimensionterrain.b3d")
			ScaleEntity(terrain,RoomScale,RoomScale,RoomScale,True)
			PositionEntity(terrain, 0, 2944, 0, True)
			
			
			
			CreateItem("Burnt Note", "paper", EntityX(r.obj),0.5,EntityZ(r.obj)+3.5)
			
			for (n of range(0)) {//4
				
				switch (n) {
					case 0:
						entity = hallway 					
					case 1:
						entity = r.Objects[8]						
					case 2:
						entity = r.Objects[9]						
					case 3:
						entity = r.Objects[10]							
					case 4:
						entity = r.Objects[11]							
				}
	
				
			}
			
			for (i of range(8, 12)) {
				ScaleEntity (r.Objects[i],RoomScale,RoomScale,RoomScale)
				EntityType(r.Objects[i], HIT_MAP)
				EntityPickMode(r.Objects[i], 2)
				PositionEntity(r.Objects[i],r.x,r.y,r.z+32.0,True)
			}
			
			ScaleEntity (terrain,RoomScale,RoomScale,RoomScale)
			EntityType(terrain, HIT_MAP)
			EntityPickMode(terrain, 3)
			PositionEntity(terrain,r.x,r.y+2944.0*RoomScale,r.z+32.0,True)			
			
			r.RoomDoors[0] = CreateDoor(0, r.x,2048*RoomScale,r.z+32.0-1024*RoomScale,0,r,False)
			r.RoomDoors[1] = CreateDoor(0, r.x,2048*RoomScale,r.z+32.0+1024*RoomScale,180,r,False)
			
			de.Decals = CreateDecal(18, r.x-(1536*RoomScale), 0.02,r.z+608*RoomScale+32.0, 90,0,0)
			EntityParent(de.obj, r.obj)
			de.Size = Rnd(0.8, 0.8)
			de.blendmode = 2
			de.fx = 1+8
			ScaleSprite(de.obj, de.Size, de.Size)
			EntityFX(de.obj, 1+8)
			EntityBlend(de.obj, 2)
			
			ScaleEntity (r.Objects[10],RoomScale*1.5,RoomScale*2.0,RoomScale*1.5,True)			
			PositionEntity(r.Objects[11],r.x,r.y,r.z+64.0,True)			
			
			for (i of range(1, 9)) {
				r.Objects[i-1] = CopyEntity(hallway) //CopyMesh
				ScaleEntity (r.Objects[i-1],RoomScale,RoomScale,RoomScale)
				angle: float = (i-1) * (360.0/8.0)
				
				EntityType(r.Objects[i-1], HIT_MAP)
				EntityPickMode(r.Objects[i-1], 2)
				
				RotateEntity(r.Objects[i-1],0,angle-90,0)
				PositionEntity(r.Objects[i-1],r.x+Cos(angle)*(512.0*RoomScale),0.0,r.z+Sin(angle)*(512.0*RoomScale))
				EntityParent (r.Objects[i-1], r.obj)
				
				if (i < 6) {
					de.Decals = CreateDecal(i+7, r.x+Cos(angle)*(512.0*RoomScale)*3.0, 0.02,r.z+Sin(angle)*(512.0*RoomScale)*3.0, 90,angle-90,0)
					de.Size = Rnd(0.5, 0.5)
					de.blendmode = 2
					de.fx = 1+8
					ScaleSprite(de.obj, de.Size, de.Size)
					EntityFX(de.obj, 1+8)
					EntityBlend(de.obj, 2)
				}				
			}
			
			for (i of range(12, 17)) {
				r.Objects[i] = CreatePivot(r.Objects[11])
				switch (i) {
					case 12:
						PositionEntity(r.Objects[i],r.x,r.y+200*RoomScale,r.z+64.0,True)	
					case 13:
						PositionEntity(r.Objects[i],r.x+390*RoomScale,r.y+200*RoomScale,r.z+64.0+272*RoomScale,True)	
					case 14:
						PositionEntity(r.Objects[i],r.x+838*RoomScale,r.y+200*RoomScale,r.z+64.0-551*RoomScale,True)	
					case 15:
						PositionEntity(r.Objects[i],r.x-139*RoomScale,r.y+200*RoomScale,r.z+64.0+1201*RoomScale,True)	
					case 16:
						PositionEntity(r.Objects[i],r.x-1238*RoomScale,r.y-1664*RoomScale,r.z+64.0+381*RoomScale,True)
				}	
			}
			
			let OldManEyes: int = LoadTexture_Strict("GFX/npcs/oldmaneyes.jpg")
			r.Objects[17] = CreateSprite()
			ScaleSprite(r.Objects[17], 0.03, 0.03)
			EntityTexture(r.Objects[17], OldManEyes)
			EntityBlend (r.Objects[17], 3)
			EntityFX(r.Objects[17], 1 + 8)
			SpriteViewMode(r.Objects[17], 2)
			
			r.Objects[18] = LoadTexture_Strict("GFX/npcs/pdplane.png", 1+2)
			r.Objects[19] = LoadTexture_Strict("GFX/npcs/pdplaneeye.png", 1+2)		
			
			r.Objects[20] = CreateSprite()
			ScaleSprite(r.Objects[20], 8.0, 8.0)
			EntityTexture(r.Objects[20], r.Objects[18])
			EntityOrder(r.Objects[20], 100)
			EntityBlend (r.Objects[20], 2)
			EntityFX(r.Objects[20], 1 + 8)
			SpriteViewMode(r.Objects[20], 2)
			
			FreeTexture(t)
			FreeEntity(hallway)
			
		case "room3z3":
			//[Block]
			sc.SecurityCams = CreateSecurityCam(r.x-320.0*RoomScale, r.y+384.0*RoomScale, r.z+512.25*RoomScale, r)
			sc.angle = 225
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			
		case "room2_3","room3_3":
			//[Block]
			w.waypoints = CreateWaypoint(r.x, r.y + 66.0 * RoomScale, r.z, null, r)
			
		//New rooms (in SCP:CB 1.3) - ENDSHN
		case "room1lifts":
			//[Block]
			r.Objects[0] = CreateButton(r.x + 96.0*RoomScale, r.y + 160.0 * RoomScale, r.z + 64.0 * RoomScale, 0,0,0)
			EntityParent (r.Objects[0],r.obj)
			r.Objects[1] = CreateButton(r.x - 96.0*RoomScale, r.y + 160.0 * RoomScale, r.z + 64.0 * RoomScale, 0,0,0)
			EntityParent (r.Objects[1],r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x+384.0*RoomScale, r.y+(448-64)*RoomScale, r.z-960.0*RoomScale, r, True)
			sc.angle = 45
			sc.turn = 45
			sc.room = r
			TurnEntity(sc.CameraObj, 20, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			w.waypoints = CreateWaypoint(r.x, r.y + 66.0 * RoomScale, r.z, null, r)
			//[End Block]
		case "room2servers2":
			//[Block]
			d.Doors = CreateDoor(r.zone, r.x + 264.0 * RoomScale, 0.0, r.z + 672.0 * RoomScale, 270, r, False, False, 3)
			PositionEntity(d.buttons[0], r.x + 224.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 510.0 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x + 304.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 840.0 * RoomScale, True)	
			TurnEntity(d.buttons[1],0,0,0,True)
			d.Doors = CreateDoor(r.zone, r.x -512.0 * RoomScale, -768.0*RoomScale, r.z -336.0 * RoomScale, 0, r, False, False, 3)
			d.Doors = CreateDoor(r.zone, r.x -509.0 * RoomScale, -768.0*RoomScale, r.z -1037.0 * RoomScale, 0, r, False, False, 3)
			d.Doors.locked = True
			d.Doors.DisableWaypoint = True
			it = CreateItem("Night Vision Goggles", "nvgoggles", r.x + 56.0154 * RoomScale, r.y - 648.0 * RoomScale, r.z + 749.638 * RoomScale)
			it.state = 200
			RotateEntity(it.collider, 0, r.angle+Rand(245), 0)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2gw","room2gw_b":
		    //[Block]
			if (r.RoomTemplate.Name == "room2gw_b") {
				r.Objects[2] = CreatePivot(r.obj)
				PositionEntity (r.Objects[2], r.x - 156.825*RoomScale, -37.3458*RoomScale, r.z+121.364*RoomScale, True)
				
				de.Decals = CreateDecal(3,  r.x - 156.825*RoomScale, -37.3458*RoomScale, r.z+121.364*RoomScale,90,Rnd(360),0)
				de.Size = 0.5
				ScaleSprite(de.obj, de.Size,de.Size)
				EntityParent(de.obj, r.obj)
				
				//260 300 -350
				//WIP
				r.Objects[0] = CreatePivot()
				PositionEntity(r.Objects[0],r.x+280.0*RoomScale,r.y+345.0*RoomScale,r.z-340.0*RoomScale,True)
				EntityParent(r.Objects[0],r.obj)
			}
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 336.0 * RoomScale, 0.0, r.z - 382.0 * RoomScale, 0, r, False, False)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z - 606.679 * RoomScale, True)	
            PositionEntity(r.RoomDoors[0].buttons[1], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[0].buttons[1],True), r.z - 606.679 * RoomScale, True)
			r.RoomDoors[0].dir = 0
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True 
			r.RoomDoors[0].locked = True	
			r.RoomDoors[0].MTFClose = False
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 336.0 * RoomScale, 0.0, r.z + 462.0 * RoomScale, 180, r, False, False)
			PositionEntity(r.RoomDoors[1].buttons[0], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[1].buttons[0],True), r.z - 606.679 * RoomScale, True)	
            PositionEntity(r.RoomDoors[1].buttons[1], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[1].buttons[1],True), r.z - 606.679 * RoomScale, True)
			r.RoomDoors[1].dir = 0
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = True 
			r.RoomDoors[1].locked = True
			r.RoomDoors[1].MTFClose = False
			
			for (r2 of Rooms.each) {
				if (r2 != r) {
					if (r2.RoomTemplate.Name == "room2gw" || r2.RoomTemplate.Name == "room2gw_b") {
						r.Objects[3] = CopyEntity(r2.Objects[3],r.obj) //don't load the mesh again
						break
					}
				}
			}
			if (r.Objects[3] == 0) {
				r.Objects[3] = LoadMesh_Strict("GFX/map/room2gw_pipes.b3d",r.obj)
			}
			EntityPickMode(r.Objects[3],2)
			
			if (r.RoomTemplate.Name == "room2gw") {
				r.Objects[0] = CreatePivot()
				PositionEntity(r.Objects[0],r.x+344.0*RoomScale,128.0*RoomScale,r.z)
				EntityParent(r.Objects[0],r.obj)
				
				let bd_temp: boolean = false
				if (room2gw_brokendoor) {
					if (room2gw_x == r.x) {
						if (room2gw_z == r.z) {
							bd_temp = True
						}
					}
				}
				
				if ((room2gw_brokendoor == 0 && Rand(1,2) == 1) || bd_temp) {
					r.Objects[1] = CopyEntity(DoorOBJ)
					ScaleEntity(r.Objects[1], (204.0 * RoomScale) / MeshWidth(r.Objects[1]), 312.0 * RoomScale / MeshHeight(r.Objects[1]), 16.0 * RoomScale / MeshDepth(r.Objects[1]))
					EntityType(r.Objects[1], HIT_MAP)
					PositionEntity(r.Objects[1], r.x + 336.0 * RoomScale, 0.0, r.z + 462.0 * RoomScale)
					RotateEntity(r.Objects[1], 0, 180 + 180, 0)
					EntityParent(r.Objects[1], r.obj)
					MoveEntity(r.Objects[1],120.0,0,5.0)
					room2gw_brokendoor = True
					room2gw_x = r.x
					room2gw_z = r.z
					FreeEntity(r.RoomDoors[1].obj2)
					r.RoomDoors[1].obj2 = 0
				}
			}
			//[End Block]
		case "room3gw":
	        //[Block]
			d = CreateDoor(r.zone, r.x - 728.0 * RoomScale, 0.0, r.z - 458.0 * RoomScale, 0, r, False, False, 3)
			d.AutoClose = False
			d.open = False
			d.locked = False
			
			d = CreateDoor(r.zone, r.x - 223.0 * RoomScale, 0.0, r.z - 736.0 * RoomScale, -90, r, False, False, 3)
			d.AutoClose = False
			d.open = False
			d.locked = False
			
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 459.0 * RoomScale, 0.0, r.z + 339.0 * RoomScale, 90, r, False, False)
			PositionEntity(r.RoomDoors[0].buttons[0], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[0].buttons[0],True), r.z - 606.679 * RoomScale, True)	
            PositionEntity(r.RoomDoors[0].buttons[1], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[0].buttons[1],True), r.z - 606.679 * RoomScale, True)
			r.RoomDoors[0].dir = 0
			r.RoomDoors[0].AutoClose = False
			r.RoomDoors[0].open = True
			r.RoomDoors[0].locked = True	
			r.RoomDoors[0].MTFClose = False
			
			r.RoomDoors[1] = CreateDoor(r.zone, r.x + 385.0 * RoomScale, 0.0, r.z + 339.0 * RoomScale, 270, r, False, False)
			PositionEntity(r.RoomDoors[1].buttons[0], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[1].buttons[0],True), r.z - 606.679 * RoomScale, True)	
            PositionEntity(r.RoomDoors[1].buttons[1], r.x + 580.822 * RoomScale, EntityY(r.RoomDoors[1].buttons[1],True), r.z - 606.679 * RoomScale, True)
			r.RoomDoors[1].dir = 0
			r.RoomDoors[1].AutoClose = False
			r.RoomDoors[1].open = True
			r.RoomDoors[1].locked = True
			r.RoomDoors[1].MTFClose = False
			FreeEntity(r.RoomDoors[1].obj2)
			r.RoomDoors[1].obj2 = 0
			
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0],r.x-48.0*RoomScale,128.0*RoomScale,r.z+320.0*RoomScale)
			EntityParent(r.Objects[0],r.obj)
			
			for (r2 of range(Rooms.each)) {
				if (r2 != r) {
					if (r2.RoomTemplate.Name == "room3gw") {
						r.Objects[3] = CopyEntity(r2.Objects[3],r.obj) //don't load the mesh again
						break
					}
				}
			}
			if (r.Objects[3] == 0) {
				r.Objects[3] = LoadMesh_Strict("GFX/map/room3gw_pipes.b3d",r.obj)
			}
			EntityPickMode(r.Objects[3],2)
	        //[End Block]
		case "room1162":
			//[Block]
			d = CreateDoor(r.zone, r.x + 248.0*RoomScale, 0.0, r.z - 736.0*RoomScale, 90, r, False, False, 2)
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0],r.x+1012.0*RoomScale,r.y+128.0*RoomScale,r.z-640.0*RoomScale)
			EntityParent(r.Objects[0],r.obj)
			EntityPickMode(r.Objects[0],1)
			it = CreateItem("Document SCP-1162", "paper", r.x + 863.227 * RoomScale, r.y + 152.0 * RoomScale, r.z - 953.231 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x-192.0*RoomScale, r.y+704.0*RoomScale, r.z+192.0*RoomScale, r)
			sc.angle = 225
			sc.turn = 45
			TurnEntity(sc.CameraObj, 20, 0, 0)
			//[End Block]
		case "room2scps2":
			//[Block]
			r.RoomDoors[0] = CreateDoor(r.zone, r.x + 288.0*RoomScale, r.y, r.z + 576.0*RoomScale, 90, r, False, False, 3)
			r.RoomDoors[0].open = False
			r.RoomDoors[0].locked = True
			d = CreateDoor(r.zone, r.x + 777.0*RoomScale, r.y, r.z + 671.0*RoomScale, 90, r, False, False, 4)
			d = CreateDoor(r.zone, r.x + 556.0*RoomScale, r.y, r.z + 296.0*RoomScale, 0, r, False, False, 3)
			r.Objects[0] = CreatePivot()
			PositionEntity(r.Objects[0],r.x + 576.0*RoomScale,r.y+160.0*RoomScale,r.z+632.0*RoomScale)
			EntityParent(r.Objects[0],r.obj)
			
			it = CreateItem("SCP-1499", "scp1499", r.x + 600.0 * RoomScale, r.y + 176.0 * RoomScale, r.z - 228.0 * RoomScale)
			RotateEntity(it.collider, 0, r.angle, 0)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-1499", "paper", r.x + 840.0 * RoomScale, r.y + 260.0 * RoomScale, r.z + 224.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Document SCP-500", "paper", r.x + 1152.0 * RoomScale, r.y + 224.0 * RoomScale, r.z + 336.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			it = CreateItem("Emily Ross' Badge", "badge", r.x + 364.0 * RoomScale, r.y + 5.0 * RoomScale, r.z + 716.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			
			sc.SecurityCams = CreateSecurityCam(r.x + 850.0 * RoomScale, r.y + 350.0 * RoomScale, r.z + 876.0 * RoomScale, r)
            sc.angle = 220
			sc.turn = 30
            TurnEntity(sc.CameraObj, 30, 0, 0)
            EntityParent(sc.obj, r.obj)
			
            sc.SecurityCams = CreateSecurityCam(r.x + 600.0 * RoomScale, r.y + 514.0 * RoomScale, r.z + 150.0 * RoomScale, r)
            sc.angle = 180
			sc.turn = 30
            TurnEntity(sc.CameraObj, 30, 0, 0)
            EntityParent(sc.obj, r.obj)
			//[End Block]
		case "room3offices":
			//[Block]			
			d.Doors = CreateDoor(r.zone, r.x + 736.0 * RoomScale, 0.0, r.z + 240.0 * RoomScale, 0, r, False, False, 3)
			PositionEntity(d.buttons[0], r.x + 892.0 * RoomScale, EntityY(d.buttons[0],True), r.z + 224.0 * RoomScale, True)
			PositionEntity(d.buttons[1], r.x + 892.0 * RoomScale, EntityY(d.buttons[1],True), r.z + 255.0 * RoomScale, True)
			FreeEntity(d.obj2)
			d.obj2 = 0
			
			r.Objects[0] = LoadMesh_Strict("GFX/map/room3offices_hb.b3d",r.obj)
			EntityPickMode(r.Objects[0],2)
			EntityType(r.Objects[0],HIT_MAP)
			EntityAlpha(r.Objects[0],0.0)
			//[End Block]
		case "room2offices4":
			//[Block]
			d.Doors = CreateDoor(0, r.x - 240.0 * RoomScale, 0.0, r.z, 90, r, False)
			PositionEntity(d.buttons[0], r.x - 230.0 * RoomScale, EntityY(d.buttons[0],True), EntityZ(d.buttons[0],True), True)
			PositionEntity(d.buttons[1], r.x - 250.0 * RoomScale, EntityY(d.buttons[1],True), EntityZ(d.buttons[1],True), True)
			d.open = False
			d.AutoClose = False
			
			it = CreateItem("Sticky Note", "paper", r.x - 991.0*RoomScale, r.y - 242.0*RoomScale, r.z + 904.0*RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "room2sl":
			//[Block]
			let scale: float = RoomScale * 4.5 * 0.4
			let screen: int
			
			r.Textures[0] = LoadAnimTexture("GFX/SL_monitors_checkpoint.jpg",1,512,512,0,4)
			r.Textures[1] = LoadAnimTexture("GFX/Sl_monitors.jpg",1,256,256,0,8)
			
			//Monitor Objects
			for (i of range(15)) {
				if (i != 7) {
					r.Objects[i] = CopyEntity(Monitor)
					ScaleEntity(r.Objects[i], scale, scale, scale)
					if (i != 4 && i != 13) {
						screen = CreateSprite()
						EntityFX(screen,17)
						SpriteViewMode(screen,2)
						ScaleSprite(screen, MeshWidth(Monitor) * scale * 0.95 * 0.5, MeshHeight(Monitor) * scale * 0.95 * 0.5)
						switch (i) {
							case 0:
								EntityTexture(screen,r.Textures[1],0)
							case 2:
								EntityTexture(screen,r.Textures[1],2)
							case 3:
								EntityTexture(screen,r.Textures[1],1)
							case 8:
								EntityTexture(screen,r.Textures[1],4)
							case 9:
								EntityTexture(screen,r.Textures[1],5)
							case 10:
								EntityTexture(screen,r.Textures[1],3)
							case 11:
								EntityTexture(screen,r.Textures[1],7)
							default:
								EntityTexture(screen,r.Textures[0],3)
						}
						EntityParent(screen,r.Objects[i])
					} else if (i == 4) {
						r.Objects[20] = CreateSprite()
						EntityFX(r.Objects[20],17)
						SpriteViewMode(r.Objects[20],2)
						ScaleSprite(r.Objects[20], MeshWidth(Monitor) * scale * 0.95 * 0.5, MeshHeight(Monitor) * scale * 0.95 * 0.5)
						EntityTexture(r.Objects[20],r.Textures[0],2)
						EntityParent(r.Objects[20],r.Objects[i])
					} else {
						r.Objects[21] = CreateSprite()
						EntityFX(r.Objects[21],17)
						SpriteViewMode(r.Objects[21],2)
						ScaleSprite(r.Objects[21], MeshWidth(Monitor) * scale * 0.95 * 0.5, MeshHeight(Monitor) * scale * 0.95 * 0.5)
						EntityTexture(r.Objects[21],r.Textures[1],6)
						EntityParent(r.Objects[21],r.Objects[i])
					}
				}
			}
			for (i of range(3)) {
				PositionEntity(r.Objects[i],r.x-207.94*RoomScale,r.y+(648.0+(112*i))*RoomScale,r.z-60.0686*RoomScale)
				RotateEntity(r.Objects[i],0,105+r.angle,0)
				EntityParent(r.Objects[i],r.obj)
				DebugLog(i)
			}
			for (i of range(3, 6)) {
				PositionEntity(r.Objects[i],r.x-231.489*RoomScale,r.y+(648.0+(112*(i-3)))*RoomScale,r.z+95.7443*RoomScale)
				RotateEntity(r.Objects[i],0,90+r.angle,0)
				EntityParent(r.Objects[i],r.obj)
				DebugLog(i)
			}
			for (i of range(6, 9, 2)) {
				PositionEntity(r.Objects[i],r.x-231.489*RoomScale,r.y+(648.0+(112*(i-6)))*RoomScale,r.z+255.744*RoomScale)
				RotateEntity(r.Objects[i],0,90+r.angle,0)
				EntityParent(r.Objects[i],r.obj)
				DebugLog(i)
			}
			for (i of range(9, 12)) {
				PositionEntity(r.Objects[i],r.x-231.489*RoomScale,r.y+(648.0+(112*(i-9)))*RoomScale,r.z+415.744*RoomScale)
				RotateEntity(r.Objects[i],0,90+r.angle,0)
				EntityParent(r.Objects[i],r.obj)
				DebugLog(i)
			}
			for (i of range(12, 15)) {
				PositionEntity(r.Objects[i],r.x-208.138*RoomScale,r.y+(648.0+(112*(i-12)))*RoomScale,r.z+571.583*RoomScale)
				RotateEntity(r.Objects[i],0,75+r.angle,0)
				EntityParent(r.Objects[i],r.obj)
				DebugLog(i)
			}
			
			//Doors for room
			r.RoomDoors[0] = CreateDoor(r.zone,r.x+480.0*RoomScale,r.y,r.z-640.0*RoomScale,90,r,False,False,3)
			r.RoomDoors[0].AutoClose = False
			PositionEntity(r.RoomDoors[0].buttons[0],r.x+576.0*RoomScale,EntityY(r.RoomDoors[0].buttons[0],True),r.z-480*RoomScale,True)
			RotateEntity(r.RoomDoors[0].buttons[0],0,270,0)
			r.RoomDoors[1] = CreateDoor(r.zone,r.x+544.0*RoomScale,r.y+480.0*RoomScale,r.z+256.0*RoomScale,270,r,False,False,3)
			r.RoomDoors[1].AutoClose = False
			FreeEntity(r.RoomDoors[1].obj2)
			r.RoomDoors[1].obj2 = 0
			d = CreateDoor(r.zone,r.x+1504.0*RoomScale,r.y+480.0*RoomScale,r.z+960.0*RoomScale,0,r)
			d.AutoClose = False
			d.locked = True
			
			//PathPoint 1 for SCP-049
			r.Objects[7] = CreatePivot()
			PositionEntity(r.Objects[7],r.x,r.y+100.0*RoomScale,r.z-800.0*RoomScale,True)
			EntityParent(r.Objects[7],r.obj)
			
			//PathPoints for SCP-049
			r.Objects[15] = CreatePivot()
			PositionEntity(r.Objects[15],r.x+700.0*RoomScale,r.y+700.0*RoomScale,r.z+256.0*RoomScale,True)
			EntityParent(r.Objects[15],r.obj)
			r.Objects[16] = CreatePivot()
			PositionEntity(r.Objects[16],r.x-60.0*RoomScale,r.y+700.0*RoomScale,r.z+200.0*RoomScale,True)
			EntityParent(r.Objects[16],r.obj)
			r.Objects[17] = CreatePivot()
			PositionEntity(r.Objects[17],r.x-48.0*RoomScale,r.y+540.0*RoomScale,r.z+656.0*RoomScale,True)
			EntityParent(r.Objects[17],r.obj)
			
			//Faked room409
			
			//-49.0 689.0 912.0
			//Objects [18],[19]
			r.Objects[9 * 2] = CopyEntity(LeverBaseOBJ)
			r.Objects[9 * 2 + 1] = CopyEntity(LeverOBJ)
			
			r.Levers[0] = r.Objects[9 * 2 + 1]
			
			for (i of range(2)) {
				ScaleEntity(r.Objects[9 * 2 + i], 0.04, 0.04, 0.04)
				PositionEntity(r.Objects[9 * 2 + i],r.x-49*RoomScale,r.y+689*RoomScale,r.z+912*RoomScale,True)
				
				EntityParent(r.Objects[9 * 2 + i], r.obj)
			}
			RotateEntity(r.Objects[9 * 2], 0, 0, 0)
			RotateEntity(r.Objects[9 * 2 + 1], 10, 0 - 180, 0)
				
			EntityPickMode(r.Objects[9 * 2 + 1], 1, False)
			EntityRadius(r.Objects[9 * 2 + 1], 0.1)
			
			//Camera in the room itself
			sc.SecurityCams = CreateSecurityCam(r.x-159.0*RoomScale, r.y+384.0*RoomScale, r.z-929.0*RoomScale, r, True)
			sc.angle = 315
			//sc.turn = 45
			sc.room = r
			TurnEntity(sc.CameraObj, 20, 0, 0)
			EntityParent(sc.obj, r.obj)
			
			PositionEntity(sc.ScrObj, r.x-231.489*RoomScale, r.y+760.0*RoomScale, r.z+255.744*RoomScale)
			TurnEntity(sc.ScrObj, 0, 90, 0)
			EntityParent(sc.ScrObj, r.obj)
			
					//[End Block]
		case "room2_4":
			//[Block]
			r.Objects[6] = CreatePivot()
			PositionEntity(r.Objects[6], r.x + 640.0 * RoomScale, 8.0 * RoomScale, r.z - 896.0 * RoomScale)
			EntityParent(r.Objects[6], r.obj)
			//[End Block]
		case "room3z2":
			//[Block]
			for (r2 of Rooms.each) {
				if (r2.RoomTemplate.Name == r.RoomTemplate.Name && r2 != r) {
					r.Objects[0] = CopyEntity(r2.Objects[0],r.obj)
					break
				}
			}
			if (r.Objects[0] == 0) {
				r.Objects[0] = LoadMesh_Strict("GFX/map/room3z2_hb.b3d",r.obj)
			}
			EntityPickMode(r.Objects[0],2)
			EntityType(r.Objects[0],HIT_MAP)
			EntityAlpha(r.Objects[0],0.0)
			//[End Block]
		case "lockroom3":
			//[Block]
			d = CreateDoor(r.zone, r.x - 736.0 * RoomScale, 0, r.z - 104.0 * RoomScale, 0, r, True)
			d.timer = 70 * 5
			d.AutoClose = False
			d.open = False
			d.locked = True
			
			EntityParent(d.buttons[0], 0)
			PositionEntity(d.buttons[0], r.x - 288.0 * RoomScale, 0.7, r.z - 640.0 * RoomScale)
			EntityParent(d.buttons[0], r.obj)
			
			FreeEntity(d.buttons[1])
			d.buttons[1] = 0
			
			d2 = CreateDoor(r.zone, r.x + 104.0 * RoomScale, 0, r.z + 736.0 * RoomScale, 270, r, True)
			d2.timer = 70 * 5
			d2.AutoClose = False
			d2.open = False
			d2.locked = True
			EntityParent(d2.buttons[0], 0)
			PositionEntity(d2.buttons[0], r.x + 640.0 * RoomScale, 0.7, r.z + 288.0 * RoomScale)
			RotateEntity (d2.buttons[0], 0, 90, 0)
			EntityParent(d2.buttons[0], r.obj)
			
			FreeEntity(d2.buttons[1])
			d2.buttons[1] = 0
			
			d.LinkedDoor = d2
			d2.LinkedDoor = d
			
			scale = RoomScale * 4.5 * 0.4
			
			r.Objects[0] = CopyEntity(Monitor)
			ScaleEntity(r.Objects[0],scale,scale,scale)
			PositionEntity(r.Objects[0],r.x+668*RoomScale,1.1,r.z-96.0*RoomScale,True)
			RotateEntity(r.Objects[0],0,90,0)
			EntityParent(r.Objects[0],r.obj)
			
			r.Objects[1] = CopyEntity(Monitor)
			ScaleEntity(r.Objects[1],scale,scale,scale)
			PositionEntity(r.Objects[1],r.x+96.0*RoomScale,1.1,r.z-668.0*RoomScale,True)
			EntityParent(r.Objects[1],r.obj)
			//[End Block]
		case "medibay":
			//[Block]
			r.Objects[0] = LoadMesh_Strict("GFX/map/medibay_props.b3d",r.obj)
			EntityType(r.Objects[0],HIT_MAP)
			EntityPickMode(r.Objects[0],2)
			
			r.Objects[1] = CreatePivot(r.obj)
			PositionEntity(r.Objects[1], r.x - 762.0 * RoomScale, r.y + 0.0 * RoomScale, r.z - 346.0 * RoomScale, True)
			r.Objects[2] = CreatePivot(r.obj)
			PositionEntity(r.Objects[2], (EntityX(r.Objects[1],True)+(126.0 * RoomScale)), EntityY(r.Objects[1],True), EntityZ(r.Objects[1],True), True)
			it = CreateItem("First Aid Kit", "firstaid", r.x - 506.0 * RoomScale, r.y + 192.0 * RoomScale, r.z - 322.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("Syringe", "syringe", r.x - 333.0 * RoomScale, r.y + 100.0 * RoomScale, r.z + 97.3 * RoomScale)
			EntityParent(it.collider, r.obj)
			it = CreateItem("Syringe", "syringe", r.x - 340.0 * RoomScale, r.y + 100.0 * RoomScale, r.z + 52.3 * RoomScale)
			EntityParent(it.collider, r.obj)
			r.RoomDoors[0] = CreateDoor(r.zone, r.x - 264.0 * RoomScale, r.y - 0.0 * RoomScale, r.z + 640.0 * RoomScale, 90, r, False, False, 3)
			
			r.Objects[3] = CreatePivot(r.obj)
			PositionEntity(r.Objects[3],r.x-820.0*RoomScale,r.y,r.z-318.399*RoomScale,True)
			//[End Block]
		case "room2cpit":
			//[Block]
			em.Emitters = CreateEmitter(r.x + 512.0 * RoomScale, -76 * RoomScale, r.z - 688 * RoomScale, 0)
            TurnEntity(em.Obj, -90, 0, 0)
            EntityParent(em.Obj, r.obj)
            em.RandAngle = 55
            em.Speed = 0.0005
            em.Achange = -0.015
            em.SizeChange = 0.007
            
            d = CreateDoor(r.zone,r.x-256.0*RoomScale, 0.0, r.z-752.0*RoomScale,90,r,False,2,3)
            d.locked = True
			d.open = False
			d.AutoClose = False
			d.MTFClose = False
			d.DisableWaypoint = True
			PositionEntity (d.buttons[0],r.x-240.0*RoomScale,EntityY(d.buttons[0],True),EntityZ(d.buttons[0],True),True)
			
			it = CreateItem("Dr L's Note", "paper", r.x - 160.0 * RoomScale, 32.0 * RoomScale, r.z - 353.0 * RoomScale)
			EntityParent(it.collider, r.obj)
			//[End Block]
		case "dimension1499":
			//[Block]
			r.Levers[1] = LoadMesh_Strict("GFX/map/dimension1499/1499object0_cull.b3d",r.obj)
			EntityType(r.Levers[1],HIT_MAP)
			EntityAlpha(r.Levers[1],0)
			
			r.Levers[0] = CreatePivot()
			PositionEntity(r.Levers[0],r.x+205.0*RoomScale,r.y+200.0*RoomScale,r.z+2287.0*RoomScale)
			EntityParent(r.Levers[0],r.obj)
			//[End Block]
	}
	
	for (lt of LightTemplates.each) {
		if (lt.roomtemplate == r.RoomTemplate) {
			newlt = AddLight(r, r.x+lt.x, r.y+lt.y, r.z+lt.z, lt.ltype, lt.range, lt.r, lt.g, lt.b)
			if (newlt != 0) {
				if (lt.ltype == 3) {
					LightConeAngles(newlt, lt.innerconeangle, lt.outerconeangle)
					RotateEntity(newlt, lt.pitch, lt.yaw, 0)
				}
			}
		}
	}
	
	for (ts of TempScreens.each) {
		if (ts.roomtemplate == r.RoomTemplate) {
			CreateScreen(r.x+ts.x, r.y+ts.y, r.z+ts.z, ts.imgpath, r)
		}
	}
	
	for (tw of TempWayPoints.each) {
		if (tw.roomtemplate == r.RoomTemplate) {
			CreateWaypoint(r.x+tw.x, r.y+tw.y, r.z+tw.z, null, r)
		}
	}
	
	if (r.RoomTemplate.TempTriggerboxAmount > 0) {
		r.TriggerboxAmount = r.RoomTemplate.TempTriggerboxAmount
		for (i of range(r.TriggerboxAmount)) {
			r.Triggerbox[i] = CopyEntity(r.RoomTemplate.TempTriggerbox[i],r.obj)
			r.TriggerboxName[i] = r.RoomTemplate.TempTriggerboxName[i]
			DebugLog("Triggerbox found: "+i)
			DebugLog("Triggerbox "+i+" name: "+r.TriggerboxName[i])
		}
	}
	
	for (i of range(MaxRoomEmitters)) {
		if (r.RoomTemplate.TempSoundEmitter[i] != 0) {
			r.SoundEmitterObj[i]=CreatePivot(r.obj)
			PositionEntity(r.SoundEmitterObj[i], r.x+r.RoomTemplate.TempSoundEmitterX[i],r.y+r.RoomTemplate.TempSoundEmitterY[i],r.z+r.RoomTemplate.TempSoundEmitterZ[i],True)
			EntityParent(r.SoundEmitterObj[i],r.obj)
			
			r.SoundEmitter[i] = r.RoomTemplate.TempSoundEmitter[i]
			r.SoundEmitterRange[i] = r.RoomTemplate.TempSoundEmitterRange[i]
		}
	}
	
	CatchErrors("FillRoom ("+r.RoomTemplate.Name+")")
}

function UpdateRooms() {
	CatchErrors("Uncaught (UpdateRooms)")
	let dist: float
	let i: int
	let j: int
	let r: Rooms
	
	let x: float
	let z: float
	let hide: boolean = true
	
	//The reason why it is like this:
	//	When the map gets spawned by a seed, it starts from LCZ to HCZ to EZ (bottom to top)
	//	A map loaded by the map creator starts from EZ to HCZ to LCZ (top to bottom) and that's why this little code thing with the (SelectedMap="") needs to be there
	//	- ENDSHN
	if ((EntityZ(Collider)/8.0)<I_Zone.Transition[1]-(SelectedMap == "")) {
		PlayerZone=2
	} else if ((EntityZ(Collider)/8.0)>=I_Zone.Transition[1]-(SelectedMap="") && (EntityZ(Collider)/8.0)<I_Zone.Transition[0]-(SelectedMap == "")) {
		PlayerZone=1
	} else {
		PlayerZone=0
	}
	
	TempLightVolume=0
	let foundNewPlayerRoom: int = False
	if (PlayerRoom != null) {
		if (Abs(EntityY(Collider) - EntityY(PlayerRoom.obj)) < 1.5) {
			x = Abs(PlayerRoom.x-EntityX(Collider,True))
			if (x < 4.0) {
				z = Abs(PlayerRoom.z-EntityZ(Collider,True))
				if (z < 4.0) {
					foundNewPlayerRoom = True
				}
			}
			
			if (!foundNewPlayerRoom) { //it's likely that an adjacent room is the new player room, check for that
				for (i of range(4)) {
					if (PlayerRoom.Adjacent[i] != null) {
						x = Abs(PlayerRoom.Adjacent[i].x-EntityX(Collider,True))
						if (x < 4.0) {
							z = Abs(PlayerRoom.Adjacent[i].z-EntityZ(Collider,True))
							if (z < 4.0) {
								foundNewPlayerRoom = True
								PlayerRoom = PlayerRoom.Adjacent[i]
								break
							}
						}
					}
				}
			}
		} else {
			foundNewPlayerRoom = True //PlayerRoom stays the same when you're high up, or deep down
		}
	}
	
	for (r of Rooms.each) {
		
		x = Abs(r.x-EntityX(Collider,True))
		z = Abs(r.z-EntityZ(Collider,True))
		r.dist = Max(x,z)
		
		
		if (x<16 && z < 16) {
			for (i of range(MaxRoomEmitters)) {
				if (r.SoundEmitter[i] != 0) { 
					dist = EntityDistance(r.SoundEmitterObj[i],Collider)
					if (dist < r.SoundEmitterRange[i]) {
						r.SoundEmitterCHN[i] = LoopSound2(RoomAmbience[r.SoundEmitter[i]],r.SoundEmitterCHN[i], Camera, r.SoundEmitterObj[i],r.SoundEmitterRange[i])
					}
				}
			}
			
			if ((!foundNewPlayerRoom) && (PlayerRoom != r)) {
				if (x < 4.0) {
					if (z < 4.0) {
						if (Abs(EntityY(Collider) - EntityY(r.obj)) < 1.5) {PlayerRoom = r}
						foundNewPlayerRoom = True
					}
				}				
			}
		}
		
		hide = True
		
		if (r == PlayerRoom) {
			hide = False
		}
		if (hide) {
			if (IsRoomAdjacent(PlayerRoom,r)) {hide = False}
		}
		if (hide) {
			for (i of range(4)) {
				if (IsRoomAdjacent(PlayerRoom.Adjacent[i],r)) {
					hide=False
					break
				}
			}
		}
		
		if (hide) {
			HideEntity(r.obj)
		} else {
			ShowEntity(r.obj)
			for (i of range(MaxRoomLights)) {
				if (r.Lights[i] != 0) {
					dist = EntityDistance(Collider,r.Lights[i])
					if (dist < HideDistance) {
						TempLightVolume = TempLightVolume + r.LightIntensity[i]*r.LightIntensity[i]*((HideDistance-dist)/HideDistance)
					}
				} else {
					break
				}
			}
			if (DebugHUD) {
				if (r.TriggerboxAmount>0) {
					for (i of range(r.TriggerboxAmount)) {
						EntityColor(r.Triggerbox[i],255,255,0)
						EntityAlpha(r.Triggerbox[i],0.2)
					}
				}
			} else {
				if (r.TriggerboxAmount>0) {
					for (i of range(r.TriggerboxAmount)) {
						EntityColor(r.Triggerbox[i],255,255,255)
						EntityAlpha(r.Triggerbox[i],0.0)
					}
				}
			}
		}
	}
	
	MapFound(Floor(EntityX(PlayerRoom.obj) / 8.0), Floor(EntityZ(PlayerRoom.obj) / 8.0)) = 1
	PlayerRoom.found = True
	
	TempLightVolume = Max(TempLightVolume / 4.5, 1.0)
	
	if (PlayerRoom != null) {
		EntityAlpha(GetChild(PlayerRoom.obj,2),1)
		for (i of range(4)) {
			if (PlayerRoom.Adjacent[i] != null) {
				if (PlayerRoom.AdjDoor[i] != null) {
					x = Abs(EntityX(Collider,True)-EntityX(PlayerRoom.AdjDoor[i].frameobj,True))
					z = Abs(EntityZ(Collider,True)-EntityZ(PlayerRoom.AdjDoor[i].frameobj,True))
					if (PlayerRoom.AdjDoor[i].openstate == 0) {
						EntityAlpha(GetChild(PlayerRoom.Adjacent[i].obj,2),0)
					} else if (!EntityInView(PlayerRoom.AdjDoor[i].frameobj,Camera)) {
						EntityAlpha(GetChild(PlayerRoom.Adjacent[i].obj,2),0)
					} else {
						EntityAlpha(GetChild(PlayerRoom.Adjacent[i].obj,2),1)
					}
				}
				
				for (j of range(4)) {
					if (PlayerRoom.Adjacent[i].Adjacent[j] != null) {
						if (PlayerRoom.Adjacent[i].Adjacent[j] != PlayerRoom) {
							EntityAlpha(GetChild(PlayerRoom.Adjacent[i].Adjacent[j].obj,2),0)
						}
					}
				}
			}
		}
	}
	
	CatchErrors("UpdateErrors")
}

function IsRoomAdjacent(this: Rooms,that: Rooms) {
	if (this == null) {return False}
	if (this == that) {return True}
	for (i of range(4)) {
		if (that == this.Adjacent[i]) {
			return True
		}
	}
	return False
}

//-------------------------------------------------------------------------------------------------------

var LightVolume: float
var TempLightVolume: float
function AddLight(room: Rooms | null, x: float, y: float, z: float, ltype: int, range: float, r: int, g: int, b: int) : int {
	let i
	
	if (room) {
		for (i of range(MaxRoomLights)) {
			if (room.Lights[i] == 0) {
				room.Lights[i] = CreateLight(ltype)
				LightRange(room.Lights[i],range)
				LightColor(room.Lights[i],r,g,b)
				PositionEntity(room.Lights[i],x,y,z,True)
				EntityParent(room.Lights[i],room.obj)
				
				room.LightIntensity[i] = (r+g+b)/255.0/3.0
				
				room.LightSprites[i]= CreateSprite()
				PositionEntity(room.LightSprites[i], x, y, z)
				ScaleSprite(room.LightSprites[i], 0.13 , 0.13)
				EntityTexture(room.LightSprites[i], LightSpriteTex(0))
				EntityBlend (room.LightSprites[i], 3)
				
				EntityParent(room.LightSprites[i], room.obj)
				
				room.LightSpritesPivot[i] = CreatePivot()
				EntityRadius(room.LightSpritesPivot[i],0.05)
				PositionEntity(room.LightSpritesPivot[i], x, y, z)
				EntityParent(room.LightSpritesPivot[i], room.obj)
				
				room.LightSprites2[i] = CreateSprite()
				PositionEntity(room.LightSprites2[i], x, y, z)
				ScaleSprite(room.LightSprites2[i], 0.6, 0.6)
				EntityTexture(room.LightSprites2[i], LightSpriteTex(2))
				EntityBlend(room.LightSprites2[i], 3)
				EntityOrder(room.LightSprites2[i], -1)
				EntityColor(room.LightSprites2[i], r, g, b)
				EntityParent(room.LightSprites2[i], room.obj)
				EntityFX(room.LightSprites2[i],1)
				RotateEntity(room.LightSprites2[i],0,0,Rand(360))
				SpriteViewMode(room.LightSprites2[i],1)
				room.LightSpriteHidden[i] = True
				HideEntity(room.LightSprites2[i])
				room.LightFlicker[i] = Rand(1,10)
				
				room.LightR[i] = r
				room.LightG[i] = g
				room.LightB[i] = b
				
				HideEntity(room.Lights[i])
				
				room.MaxLights += 1
				
				return room.Lights[i]
			}
		}
	} else {
		let light: int
		let sprite: int
		light=CreateLight(ltype)
		LightRange(light,range)
		LightColor(light,r,g,b)
		PositionEntity(light,x,y,z,True)
		sprite=CreateSprite()
		PositionEntity(sprite, x, y, z)
		ScaleSprite(sprite, 0.13 , 0.13)
		EntityTexture(sprite, LightSpriteTex(0))
		EntityBlend (sprite, 3)
		return light
	}
}

class LightTemplates {
	roomtemplate: RoomTemplates
	ltype: int
	x: float
	y: float
	z: float
	range: float
	r: int
	g: int
	b: int
	
	pitch: float
	yaw: float
	innerconeangle: int
	outerconeangle: float
} 

export function AddTempLight(rt: RoomTemplates, x: float, y: float, z: float, ltype: int, range: float, r: int, g: int, b: int) : LightTemplates {
	let lt: Lighttemplates = new LightTemplates()
	lt.roomtemplate = rt
	lt.x = x
	lt.y = y
	lt.z = z
	lt.ltype = ltype
	lt.range = range
	lt.r = r
	lt.g = g
	lt.b = b
	
	return lt
}

//-------------------------------------------------------------------------------------------------------

export class TempWayPoints {
	x: float
	y: float
	z: float
	roomtemplate: RoomTemplates
} 

export class WayPoints {
	obj: int
	door: Doors
	room: Rooms
	state: int
	connected: WayPoints[] = new Array(5)
	dist: float[] = new Array(5)
	
	Fcost: float
	Gcost: float
	Hcost: float
	
	parent: WayPoints
}

export function CreateWaypoint(x: float, y: float, z: float, door: Doors, room: Rooms) : WayPoints {
	
	let w: WayPoints = new WayPoints()
	
	if (true) {
		w.obj = CreatePivot()
		PositionEntity(w.obj, x,y,z	)
	} else {
		w.obj = CreateSprite()
		PositionEntity(w.obj, x, y, z)
		ScaleSprite(w.obj, 0.15 , 0.15)
		EntityTexture(w.obj, LightSpriteTex(0))
		EntityBlend (w.obj, 3)	
	}
	
	EntityParent(w.obj, room.obj)
	
	w.room = room
	w.door = door
	
	return w
}

export function InitWayPoints(loadingstart=45) {
	
	let d: Doors
	let w: WayPoints
	let w2: WayPoints
	let r: Rooms
	let ClosestRoom: Rooms
	
	let x: float
	let y: float
	let z: float
	
	temper = MilliSecs()
	
	let dist: float
	let dist2: float
	
	for (d of Doors.each) {
		if (d.obj != 0) {HideEntity(d.obj)}
		if (d.obj2 != 0) {HideEntity(d.obj2)}
		if (d.frameobj != 0) {HideEntity(d.frameobj)}
		
		if (d.room == null) { 
			ClosestRoom.Rooms = null
			dist = 30
			for (r of Rooms.each) {
				x = Abs(EntityX(r.obj,True)-EntityX(d.frameobj,True))
				if (x < 20.0) {
					z = Abs(EntityZ(r.obj,True)-EntityZ(d.frameobj,True))
					if (z < 20.0) {
						dist2 = x*x+z*z
						if (dist2 < dist) {
							ClosestRoom = r
							dist = dist2
						}
					}
				}
			}
		} else {
			ClosestRoom = d.room
		}
		
		if (!d.DisableWaypoint) {
			CreateWaypoint(EntityX(d.frameobj, True), EntityY(d.frameobj, True)+0.18, EntityZ(d.frameobj, True), d, ClosestRoom)
		}
	}
	
	amount = 0
	for (w of WayPoints.each) {
		EntityPickMode(w.obj, 1, True)
		EntityRadius(w.obj, 0.2)
		amount=amount+1
	}
		
	number = 0
	iter = 0
	for (w of WayPoints.each) {
		
		number = number + 1
		iter = iter + 1
		if (iter == 20) { 
			DrawLoading(loadingstart+Floor((35.0/amount)*number)) 
			iter = 0
		}
		
		w2.WayPoints = After(w)
		
		let canCreateWayPoint: int = False
		
		while (w2 != null) {
			
			if (w.room == w2.room || w.door != null || w2.door != null) {
				
				dist = EntityDistance(w.obj, w2.obj)
				
				if (w.room.MaxWayPointY == 0.0 || w2.room.MaxWayPointY == 0.0) {
					canCreateWayPoint = True
				} else {
					if (Abs(EntityY(w.obj)-EntityY(w2.obj))<=w.room.MaxWayPointY) {
						canCreateWayPoint = True
					}
				}
				
				if (dist < 7.0) {
					if (canCreateWayPoint) {
						if (EntityVisible(w.obj, w2.obj)) {
							for (i of range(5)) {
								if (w.connected[i] == null) {
									w.connected[i] = w2.WayPoints 
									w.dist[i] = dist
									break
								}
							}
							
							for (n of range(5)) {
								if (w2.connected[n] == null) { 
									w2.connected[n] = w.WayPoints 
									w2.dist[n] = dist
									break
								}					
							}
						}
					}	
				}
			}
			w2 = After(w2)
		}
		
	}
		
	for (d of Doors.each) {
		if (d.obj != 0) {ShowEntity(d.obj)}
		if (d.obj2 != 0) {ShowEntity(d.obj2)}
		if (d.frameobj != 0) {ShowEntity(d.frameobj)}
	}
	
	for (w of WayPoints.each) {
		EntityPickMode(w.obj, 0, 0)
		EntityRadius(w.obj, 0)
		
		for (i of range(5)) {
			if (w.connected[i]) {
				tline = CreateLine(EntityX(w.obj,True),EntityY(w.obj,True),EntityZ(w.obj,True),EntityX(w.connected[i].obj,True),EntityY(w.connected[i].obj,True),EntityZ(w.connected[i].obj,True))
				EntityColor(tline, 255,0,0)
				EntityParent(tline, w.obj)
			}
		}
	}
	
	DebugLog("InitWaypoints() - "+(MilliSecs2()-temper))
	
}

function RemoveWaypoint(w: WayPoints) {
	FreeEntity(w.obj)
	Delete(w)
}


export var MapF: int[] = new Array(MapWidth+1, MapHeight+1)
export var MapG: int[] = new Array(MapWidth+1, MapHeight+1)
export var MapH: int[] = new Array(MapWidth+1, MapHeight+1)
export var MapState: int[] = new Array(MapWidth+1, MapHeight+1)
export var MapParent: int[] = new Array(MapWidth+1, MapHeight+1, 2)

function FindPath(n: NPCs, x: float, y: float, z: float) {
	
	DebugLog("findpath: " + n.NPCtype)
	
	let temp: int
	let dist: float
	let dist2: float
	let xtemp: float
	let ytemp: float
	let ztemp: float
	
	let w: WayPoints
	let StartPoint: WayPoints
	let EndPoint: WayPoints   
	
	let StartX: int = Floor(EntityX(n.Collider,True) / 8.0 + 0.5), StartZ: int = Floor(EntityZ(n.Collider,True) / 8.0 + 0.5)
	
	let EndX: int = Floor(x / 8.0 + 0.5), EndZ: int = Floor(z / 8.0 + 0.5)
	
	
	let CurrX
	let CurrZ

	
	
	for (w of WayPoints.each) {
		w.state = 0
		w.Fcost = 0
		w.Gcost = 0
		w.Hcost = 0
	}
	
	n.PathStatus = 0
	n.PathLocation = 0
	for (i of range(20)) {
		n.Path[i] = null
	}
	
	let pvt = CreatePivot()
	PositionEntity(pvt, x,y,z, True)   
	
	temp = CreatePivot()
	PositionEntity(temp, EntityX(n.Collider,True), EntityY(n.Collider,True)+0.15, EntityZ(n.Collider,True))
	
	dist = 350.0
	for (w of WayPoints.each) {
		xtemp = EntityX(w.obj,True)-EntityX(temp,True)
          
		ztemp = EntityZ(w.obj,True)-EntityZ(temp,True)
             
		ytemp = EntityY(w.obj,True)-EntityY(temp,True)
                
		dist2 = (xtemp*xtemp)+(ytemp*ytemp)+(ztemp*ztemp)
		if (dist2 < dist) {
			//prefer waypoints that are visible
			if (!EntityVisible(w.obj, temp)) {
				dist2 = dist2*3
			}
			if (dist2 < dist) {
				dist = dist2
				StartPoint = w
			}
		}
	}
	DebugLog("DIST: "+dist)
	
	FreeEntity(temp)
	
	if (StartPoint == null) {return 2}
	StartPoint.state = 1      
	
	EndPoint = null
	dist = 400.0
	for (w of WayPoints.each) {
		xtemp = EntityX(pvt,True)-EntityX(w.obj,True)
		ztemp = EntityZ(pvt,True)-EntityZ(w.obj,True)
		ytemp = EntityY(pvt,True)-EntityY(w.obj,True)
		dist2 = (xtemp*xtemp)+(ytemp*ytemp)+(ztemp*ztemp)
		
		if (dist2 < dist) {
			dist = dist2
			EndPoint = w
		}            
	}
    
	
	FreeEntity(pvt)
	
	if (EndPoint == StartPoint) {
		if (dist < 0.4) {
			return 0
		} else {
			n.Path[0] = EndPoint
			return 1               
		}
	}
	if (EndPoint == null) {return 2}
	
	do {
		
		temp = False
		smallest.WayPoints = null
		dist = 10000.0
		for (w of WayPoints.each) {
			if (w.state == 1) {
                temp = True
                if ((w.Fcost) < dist) {
					dist = w.Fcost
					smallest = w
				}
			}
		}
		
		if (smallest != null) {
			
			w = smallest
			w.state = 2
			
			for (i of range(5)) {
                if (w.connected[i] != null) {
					if (w.connected[i].state < 2) {
						
						if (w.connected[i].state == 1) { //open list
							gtemp = w.Gcost+w.dist[i]
							if (n.NPCtype == NPCtypeMTF) {
								if (w.connected[i].door == null) {
									gtemp = gtemp + 0.5
								}
							}
							if (gtemp < w.connected[i].Gcost) { //parempi reitti -> overwrite
								w.connected[i].Gcost = gtemp
								w.connected[i].Fcost = w.connected[i].Gcost + w.connected[i].Hcost
								w.connected[i].parent = w
							}
						} else {
							w.connected[i].Hcost = Abs(EntityX(w.connected[i].obj,True)-EntityX(EndPoint.obj,True))+Abs(EntityZ(w.connected[i].obj,True)-EntityZ(EndPoint.obj,True))
							gtemp = w.Gcost+w.dist[i]
							if (n.NPCtype == NPCtypeMTF) {
								if (w.connected[i].door == null) {
									gtemp = gtemp + 0.5
								}
							}
							w.connected[i].Gcost = gtemp
							w.connected[i].Fcost = w.Gcost+w.Hcost
							w.connected[i].parent = w
							w.connected[i].state=1
						}            
					}
					
				}
			}
		} else {
			if (EndPoint.state > 0) {
                StartPoint.parent = null
                EndPoint.state = 2
                break
			}
		}
		
		if (EndPoint.state > 0) {
			StartPoint.parent = null
			EndPoint.state = 2
			break
		}
		
	} while (temp)
	
	if (EndPoint.state > 0) {
		
		let currpoint: WayPoints = EndPoint
		let twentiethpoint: WayPoints = EndPoint
		
		let length = 0
		do {
			length = length +1
			currpoint = currpoint.parent
			if (length>20) {
                twentiethpoint = twentiethpoint.parent
			}
		} while (currpoint != null)
		
		currpoint.WayPoints = EndPoint
		while (twentiethpoint != null) {
			length=Min(length-1,19)
			twentiethpoint = twentiethpoint.parent
			n.Path[length] = twentiethpoint
		}
		
		return 1
	} else {
		DebugLog("FUNCTION FindPath() - no route found")
		return 2 
	}
	
}
function CreateLine(x1: float,y1: float,z1: float, x2: float,y2: float,z2: float, mesh=0) {
	
	if (mesh == 0) {
		mesh=CreateMesh()
		EntityFX(mesh,16)
		surf=CreateSurface(mesh)	
		verts = 0	
		
		AddVertex (surf,x1,y1,z1,0,0)
	} else {
		surf = GetSurface(mesh,1)
		verts = CountVertices(surf)-1
	}
	
	AddVertex(surf,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2,0,0 )
	// you could skip creating the above vertex and change the line below to
	// AddTriangle surf,verts,verts+1,verts+0
	// so your line mesh would use less vertices, the drawback is that some videocards (like the matrox g400)
	// aren't able to create a triangle with 2 vertices. so, it's your call :)
	AddVertex(surf,x2,y2,z2,1,0)
	
	AddTriangle(surf,verts,verts+2,verts+1)
	
	return mesh
}

//-------------------------------------------------------------------------------------------------------

var SelectedScreen: Screens
class Screens {
	obj: int
	imgpath: string
	img: int
	room: Rooms
}

class TempScreens {
	imgpath: string
	x: float
	y: float
	z: float
	roomtemplate: RoomTemplates
}

function CreateScreen(x: float, y: float, z: float, imgpath: string, r: Rooms) : Screens {
	let s: Screens = new Screens()
	s.obj = CreatePivot()
	EntityPickMode(s.obj, 1)	
	EntityRadius(s.obj, 0.1)
	
	PositionEntity(s.obj, x,y,z)
	s.imgpath = imgpath
	s.room = r
	EntityParent(s.obj, r.obj)
	
	return s
}

function UpdateScreens() {
	if (SelectedScreen != null) {return}
	if (SelectedDoor != null) {return}
	
	for (s of Screens.each) {
		if (s.room == PlayerRoom) {
			if (EntityDistance(Collider,s.obj)<1.2) {
				EntityPick(Camera, 1.2)
				if (PickedEntity() == s.obj && s.imgpath != "") {
					DrawHandIcon=True
					if (MouseUp1) {
						SelectedScreen=s
						s.img = LoadImage_Strict("GFX/screens/"+s.imgpath)
						s.img = ResizeImage2(s.img, ImageWidth(s.img) * MenuScale, ImageHeight(s.img) * MenuScale)
						MaskImage(s.img, 255,0,255)
						PlaySound_Strict(ButtonSFX)
						MouseUp1=False
					}
				}
			}
		}
	}
}

export var MapName: string[][] = new Array(MapWidth, MapHeight)
export var MapRoomID: int[] = new Array(ROOM4 + 1)
export var MapRoom: string[][] = new Array(ROOM4 + 1, 0)

//-------------------------------------------------------------------------------------------------------


export var GorePics: int[] = new Array(10)
export var SelectedMonitor: SecurityCams
export var CoffinCam: SecurityCams
class SecurityCams {
	obj: int
	MonitorObj: int
	
	BaseObj: int
	CameraObj: int
	
	ScrObj: int
	ScrWidth: float
	ScrHeight: float
	Screen: int
	Cam: int
	ScrTexture: int
	ScrOverlay: int
	angle: float
	turn: float
	CurrAngle: float
	State: float
	PlayerState: int
	
	soundCHN: int
	
	InSight: int
	
	RenderInterval: float
	
	room: Rooms
	
	FollowPlayer: int
	CoffinEffect: int
	
	AllowSaving: int
	
	MinAngle: float
	MaxAngle: float
	dir: int
}

export var ScreenTexs: int[] = new Array(2)

export var CurrRoom2slRenderCam: int
export var Room2slCam: int

function CreateSecurityCam(x: float, y: float, z: float, r: Rooms, screen: boolean = false) : SecurityCams {
	let sc: SecurityCams = new SecurityCams()
	
	sc.obj = CopyEntity(CamBaseOBJ)
	ScaleEntity(sc.obj, 0.0015, 0.0015, 0.0015)
	sc.CameraObj = CopyEntity(CamOBJ)
	ScaleEntity(sc.CameraObj, 0.01, 0.01, 0.01)
	
	sc.room = r
	
	sc.Screen = screen
	if (screen) {
		sc.AllowSaving = True
		
		sc.RenderInterval = 12
		
		let scale: float = RoomScale * 4.5 * 0.4
		
		sc.ScrObj = CreateSprite()
		EntityFX(sc.ScrObj, 17)
		SpriteViewMode(sc.ScrObj, 2)
		sc.ScrTexture = 0
		EntityTexture(sc.ScrObj, ScreenTexs[sc.ScrTexture])
		ScaleSprite(sc.ScrObj, MeshWidth(Monitor) * scale * 0.95 * 0.5, MeshHeight(Monitor) * scale * 0.95 * 0.5)
		
		sc.ScrOverlay = CreateSprite(sc.ScrObj)
		ScaleSprite(sc.ScrOverlay, MeshWidth(Monitor) * scale * 0.95 * 0.5, MeshHeight(Monitor) * scale * 0.95 * 0.5)
		MoveEntity(sc.ScrOverlay, 0, 0, -0.0005)
		EntityTexture(sc.ScrOverlay, MonitorTexture)
		SpriteViewMode(sc.ScrOverlay, 2)
		EntityBlend(sc.ScrOverlay , 3)
		
		sc.MonitorObj = CopyEntity(Monitor, sc.ScrObj)
		
		ScaleEntity(sc.MonitorObj, scale, scale, scale)
		
		sc.Cam = CreateCamera()
		CameraViewport(sc.Cam, 0, 0, 512, 512)
		CameraRange(sc.Cam, 0.05, 8.0)
		CameraZoom(sc.Cam, 0.8)
		HideEntity(sc.Cam)	
	}
	
	PositionEntity(sc.obj, x, y, z)
	
	if (r != null) {
		EntityParent(sc.obj, r.obj)
	}
	
	return sc
}

enum CoffinEffect {
	NotAffectedBy895,
	ConstantlyAffectedBy895,
	CanBroadcast895Feed,
	Broadcasts895Feed
}

function UpdateSecurityCams() {
	CatchErrors("Uncaught (UpdateSecurityCams)")
	let sc: SecurityCams

	for (sc of SecurityCams.each) {
		let close = False
		if (sc.room == null) {
			HideEntity(sc.Cam)
		} else {
			if (sc.room.dist < 6.0 || PlayerRoom == sc.room) {
				close = True
			} else if (sc.Cam != 0) {
				HideEntity(sc.Cam)
			}
			
			if (sc.room != null) {
				if (sc.room.RoomTemplate.Name$ == "room2sl") {
					sc.CoffinEffect = 0
				}
			}
			
			if (close || sc == CoffinCam) { 
				if (sc.FollowPlayer) {
					if (sc != CoffinCam) {
						if (EntityVisible(sc.CameraObj,Camera)) {
							if (MTF_CameraCheckTimer>0.0) {
								MTF_CameraCheckDetected=True
							}
						}
					}
					PointEntity(sc.CameraObj, Camera)
					let temp: float = EntityPitch(sc.CameraObj)
					RotateEntity(sc.obj, 0, CurveAngle(EntityYaw(sc.CameraObj), EntityYaw(sc.obj), 75.0), 0)
					
					if (temp < 40.0) {temp = 40}
					if (temp > 70.0) {temp = 70}
					RotateEntity(sc.CameraObj, CurveAngle(temp, EntityPitch(sc.CameraObj), 75.0), EntityYaw(sc.obj), 0)
					
					PositionEntity(sc.CameraObj, EntityX(sc.obj, True), EntityY(sc.obj, True) - 0.083, EntityZ(sc.obj, True))
					RotateEntity(sc.CameraObj, EntityPitch(sc.CameraObj), EntityYaw(sc.obj), 0)
				} else {
					if (sc.turn > 0) {
						if (sc.dir == 0) {
							sc.CurrAngle=sc.CurrAngle+0.2 * FPSfactor
							if (sc.CurrAngle > (sc.turn * 1.3)) {
								sc.dir = 1
							}
						} else {
							sc.CurrAngle=sc.CurrAngle-0.2 * FPSfactor
							if (sc.CurrAngle < (-sc.turn * 1.3)) {
								sc.dir = 0
							}
						}
					}
					RotateEntity(sc.obj, 0, sc.room.angle + sc.angle + Max(Min(sc.CurrAngle, sc.turn), -sc.turn), 0)
					
					PositionEntity(sc.CameraObj, EntityX(sc.obj, True), EntityY(sc.obj, True) - 0.083, EntityZ(sc.obj, True))
					RotateEntity(sc.CameraObj, EntityPitch(sc.CameraObj), EntityYaw(sc.obj), 0)
					
					if (sc.Cam != 0) {
						PositionEntity(sc.Cam, EntityX(sc.CameraObj, True), EntityY(sc.CameraObj, True), EntityZ(sc.CameraObj, True))
						RotateEntity(sc.Cam, EntityPitch(sc.CameraObj), EntityYaw(sc.CameraObj), 0)
						MoveEntity(sc.Cam, 0, 0, 0.1)
					}
					
					if (sc != CoffinCam) {
						if (Abs(DeltaYaw(sc.CameraObj,Camera))<60.0) {
							if (EntityVisible(sc.CameraObj,Camera)) {
								if (MTF_CameraCheckTimer>0.0) {
									MTF_CameraCheckDetected=True
								}
							}
						}
					}
				}
			}
			
			if (close) {
				if (sc.Screen) {
					sc.State = sc.State+FPSfactor
					
					if (BlinkTimer > -5 && EntityInView(sc.ScrObj, Camera)) {
						if (EntityVisible(Camera,sc.ScrObj)) {
							if ((sc.CoffinEffect == 1 || sc.CoffinEffect == 3) && (!Wearing714) && (WearingHazmat<3) && (WearingGasMask<3)) {
								if (BlinkTimer > -5) {
									Sanity=Sanity-FPSfactor
									DebugLog(Sanity)
									RestoreSanity = False
								}
							}
						}
					}
					
					if (Sanity < (-1000)) { 
						DeathMSG = Chr(34)+"What we know is that he died of cardiac arrest. My guess is that it was caused by SCP-895, although it has never been observed affecting video equipment from this far before. "
						DeathMSG = DeathMSG + "Further testing is needed to determine whether SCP-895's "+Chr(34)+"Red Zone"+Chr(34)+" is increasing."+Chr(34)
						
						if (VomitTimer < -10) {
							Kill()
						}
					}
					
					if (VomitTimer < 0 && Sanity < -800) {
						RestoreSanity = False
						Sanity = -1010
					}
					
					if (BlinkTimer > -5 && EntityInView(sc.ScrObj, Camera) && EntityVisible(Camera,sc.ScrObj)) {
						sc.InSight = True
					} else {
						sc.InSight = False
					}
					
					if (sc.State >= sc.RenderInterval) {
						
						if (BlinkTimer > -5 && EntityInView(sc.ScrObj, Camera)) {
							if (EntityVisible(Camera,sc.ScrObj)) {
								
								if (CoffinCam == null || Rand(5) == 5 || sc.CoffinEffect != 3) {
									HideEntity(Camera)
									ShowEntity(sc.Cam)
									Cls()
									
									UpdateRoomLights(sc.Cam)
									
									SetBuffer(BackBuffer())
									RenderWorld()
									CopyRect(0,0,512,512,0,0,BackBuffer(),TextureBuffer(ScreenTexs[sc.ScrTexture]))
									
									HideEntity(sc.Cam)
									ShowEntity(Camera)										
								} else {
									HideEntity(Camera)
									ShowEntity (CoffinCam.room.obj)
									EntityAlpha(GetChild(CoffinCam.room.obj,2),1)
									ShowEntity(CoffinCam.Cam)
									Cls()
									
									UpdateRoomLights(CoffinCam.Cam)
									
									SetBuffer(BackBuffer())
									RenderWorld()
									CopyRect(0,0,512,512,0,0,BackBuffer(),TextureBuffer(ScreenTexs[sc.ScrTexture]))
									
									HideEntity (CoffinCam.room.obj)
									HideEntity(CoffinCam.Cam)
									ShowEntity(Camera)										
								}
							}
						}
						sc.State = 0
					}
					
					if ((sc.CoffinEffect == 1 || sc.CoffinEffect == 3) && (!Wearing714) && (WearingHazmat<3) && (WearingGasMask<3)) {
						if (sc.InSight) {
							let pvt: int = CreatePivot()
							PositionEntity(pvt, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
							PointEntity(pvt, sc.ScrObj)
							
							RotateEntity(Collider, EntityPitch(Collider), CurveAngle(EntityYaw(pvt), EntityYaw(Collider), Min(Max(15000.0 / (-Sanity), 20.0), 200.0)), 0)
							
							TurnEntity(pvt, 90, 0, 0)
							user_camera_pitch = CurveAngle(EntityPitch(pvt), user_camera_pitch + 90.0, Min(Max(15000.0 / (-Sanity), 20.0), 200.0))
							user_camera_pitch=user_camera_pitch-90
							
							FreeEntity (pvt)
							if ((sc.CoffinEffect == 1 || sc.CoffinEffect == 3) && !Wearing714) {
								if (Sanity < - 800) {
									if (Rand(3) == 1) {EntityTexture(sc.ScrOverlay, MonitorTexture)}
									if (Rand(6) < 5) {
										EntityTexture(sc.ScrOverlay, GorePics(Rand(0, 5)))
										if (sc.PlayerState = 1) {PlaySound_Strict(HorrorSFX(1))}
										sc.PlayerState = 2
										if (sc.soundCHN == 0) {
											sc.soundCHN = PlaySound_Strict(HorrorSFX(4))
										} else {
											if (!ChannelPlaying(sc.soundCHN)) {
												sc.soundCHN = PlaySound_Strict(HorrorSFX(4))
											}
										}
										if (sc.CoffinEffect == 3 && Rand(200) == 1) {
											sc.CoffinEffect=2
											sc.PlayerState = Rand(10000, 20000)
										}
									}	
									BlurTimer = 1000
									if (VomitTimer == 0) {
										VomitTimer = 1
									}
								} else if (Sanity < -500) {
									if (Rand(7) == 1) {
										EntityTexture(sc.ScrOverlay, MonitorTexture)
									}
									if (Rand(50) == 1) {
										EntityTexture(sc.ScrOverlay, GorePics(Rand(0, 5)))
										if (sc.PlayerState = 0) {PlaySound_Strict(HorrorSFX(0))}
										sc.PlayerState = Max(sc.PlayerState, 1)
										if (sc.CoffinEffect=3 && Rand(100) == 1) {
											sc.CoffinEffect=2
											sc.PlayerState = Rand(10000, 20000)
										}
									}
								} else {
									EntityTexture(sc.ScrOverlay, MonitorTexture)
								}
							}
						}
					} else {
						if (sc.InSight) {
							if ((Wearing714) || (WearingHazmat == 3) || (WearingGasMask == 3)) {
								EntityTexture(sc.ScrOverlay, MonitorTexture)
							}
						}
					}
					
					if (sc.InSight && sc.CoffinEffect == 0 || sc.CoffinEffect == 2) {
						if (sc.PlayerState == 0) {
							sc.PlayerState = Rand(60000, 65000)
						}
						
						if (Rand(500) == 1) {
							EntityTexture(sc.ScrOverlay, OldAiPics(0))
						}
						
						if ((MilliSecs2() % sc.PlayerState) >= Rand(600)) {
							EntityTexture(sc.ScrOverlay, MonitorTexture)
						} else {
							if (sc.soundCHN == 0) {
								sc.soundCHN = PlaySound_Strict(LoadTempSound("SFX/SCP/079/Broadcast"+Rand(1,3)+".ogg"))
								if (sc.CoffinEffect == 2) {
									sc.CoffinEffect=3
									sc.PlayerState = 0
								}
							} else if (!ChannelPlaying(sc.soundCHN)) {
								sc.soundCHN = PlaySound_Strict(LoadTempSound("SFX/SCP/079/Broadcast"+Rand(1,3)+".ogg"))
								if (sc.CoffinEffect == 2) {
									sc.CoffinEffect=3
									sc.PlayerState = 0
								}
							}
							EntityTexture(sc.ScrOverlay, OldAiPics(0))
						}
						
					}
					
				}
				
				if (!sc.InSight) {
					sc.soundCHN = LoopSound2(CameraSFX, sc.soundCHN, Camera, sc.CameraObj, 4.0)
				}
			}
			
			if (sc != null) {
				if (sc.room != null) {
					CatchErrors("UpdateSecurityCameras ("+sc.room.RoomTemplate.Name+")")
				} else {
					CatchErrors("UpdateSecurityCameras (screen has no room)")
				}
			} else {
				CatchErrors("UpdateSecurityCameras (screen doesn't exist anymore)")
			}
		}
	}
	
	Cls()
}

function UpdateMonitorSaving() {
	let sc: SecurityCams
	let close: int = False
	
	if (SelectedDifficulty.saveType != SAVEONSCREENS) {return}
	
	for (sc of SecurityCams.each) {
		if (sc.AllowSaving && sc.Screen) {
			close = False
			if (sc.room.dist < 6.0 || PlayerRoom == sc.room) {
				close = True
			}
			
			if (close && GrabbedEntity == 0 && ClosestButton == 0) {
				if (EntityInView(sc.ScrObj,Camera) && EntityDistance(sc.ScrObj,Camera)<1.0) {
					if (EntityVisible(sc.ScrObj,Camera)) {
						DrawHandIcon = True
						if (MouseHit1) {SelectedMonitor = sc}
					} else {
						if (SelectedMonitor = sc) {SelectedMonitor = null}
					}
				} else {
					if (SelectedMonitor = sc) {SelectedMonitor = null}
				}
				
				if (SelectedMonitor == sc) {
					if (sc.InSight) {
						let pvt: int = CreatePivot()
						PositionEntity(pvt, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
						PointEntity(pvt, sc.ScrObj)
						RotateEntity(Collider, EntityPitch(Collider), CurveAngle(EntityYaw(pvt), EntityYaw(Collider), Min(Max(15000.0 / (-Sanity), 20.0), 200.0)), 0)
						TurnEntity(pvt, 90, 0, 0)
						user_camera_pitch = CurveAngle(EntityPitch(pvt), user_camera_pitch + 90.0, Min(Max(15000.0 / (-Sanity), 20.0), 200.0))
						user_camera_pitch=user_camera_pitch-90
						FreeEntity(pvt)
					}
				}
			} else {
				if (SelectedMonitor == sc) {SelectedMonitor = null}
			}
		}
	}
}

function UpdateLever(obj, locked=False) {
	
	let dist: float = EntityDistance(Camera, obj)
	if (dist < 8.0) { 
		if (dist < 0.8 && (!locked)) {
			if (EntityInView(obj, Camera)) { 
				
				EntityPick(Camera, 0.65)
				
				if (PickedEntity() == obj) {
					DrawHandIcon = True
					if (MouseHit1) {
						GrabbedEntity = obj
					}
				}
				
				prevpitch = EntityPitch(obj)
				
				if (MouseDown1 || MouseHit1) {
					if (GrabbedEntity != 0) {
						if (GrabbedEntity == obj) {
							DrawHandIcon = True 
							RotateEntity(GrabbedEntity, Max(Min(EntityPitch(obj)+Max(Min(mouse_y_speed_1 * 8,30.0),-30), 80), -80), EntityYaw(obj), 0)
							
							DrawArrowIcon(0) = True
							DrawArrowIcon(2) = True
							
						}
					}
				} 
				
				if (EntityPitch(obj,True) > 75) {
					if (prevpitch <= 75) {
						PlaySound2(LeverSFX, Camera, obj, 1.0)
					}
				} else if (EntityPitch(obj,True) < -75) {
					if (prevpitch >= -75) {
						PlaySound2(LeverSFX, Camera, obj, 1.0)
					}
				}						
			}
		}
		
		if (!MouseDown1 && !MouseHit1) {
			if (EntityPitch(obj,True) > 0) {
				RotateEntity(obj, CurveValue(80, EntityPitch(obj), 10), EntityYaw(obj), 0)
			} else {
				RotateEntity(obj, CurveValue(-80, EntityPitch(obj), 10), EntityYaw(obj), 0)
			}
			GrabbedEntity = 0
		}
		
	}
	
	if (EntityPitch(obj,True) > 0) {
		return True
	} else {
		return False
	}
	
}

function UpdateButton(obj) {
	
	let dist: float = EntityDistance(Collider, obj)
	if (dist < 0.8) {
		let temp: int = CreatePivot()
		PositionEntity(temp, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
		PointEntity(temp,obj)
		
		if (EntityPick(temp, 0.65) == obj) {
			if (ClosestButton == 0) { 
				ClosestButton = obj
			} else {
				if (dist < EntityDistance(Collider, ClosestButton)) {
					ClosestButton = obj
				}
			}							
		}
		
		FreeEntity(temp)
	}
}

function UpdateElevators(State: float, door1: Doors, door2: Doors, room1, room2, event: Events, ignorerotation: boolean = true) : float {
	let x: float
	let z: float
	let sound: int
	let dist: float
	let dir: float
	let n: NPCs
	let it: Items
	
	door1.IsElevatorDoor = 1
	door2.IsElevatorDoor = 1
	if (door1.open && !door2.open && door1.openstate == 180) {
		State = -1
		door1.locked = False
		if ((ClosestButton = door2.buttons[0] || ClosestButton == door2.buttons[1]) && MouseHit1) {
			UseDoor(door1,False)
		}
	} else if (door2.open && !door1.open && door2.openstate == 180) {
		State = 1
		door2.locked = False
		if ((ClosestButton == door1.buttons[0] || ClosestButton == door1.buttons[1]) && MouseHit1) {
			UseDoor(door2,False)
		}
	} else if (Abs(door1.openstate-door2.openstate)<0.2) {
		door1.IsElevatorDoor = 2
		door2.IsElevatorDoor = 2
	}
	
	door1.locked = True
	door2.locked = True
	if (door1.open) {
		door1.IsElevatorDoor = 3
		if (Abs(EntityX(Collider)-EntityX(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
			if (Abs(EntityZ(Collider)-EntityZ(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
				if (Abs(EntityY(Collider)-EntityY(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
					door1.locked = False
					door1.IsElevatorDoor = 1
				}
			}
		}
	}
	if (door2.open) {
		door2.IsElevatorDoor = 3
		if (Abs(EntityX(Collider)-EntityX(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
			if (Abs(EntityZ(Collider)-EntityZ(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {	
				if (Abs(EntityY(Collider)-EntityY(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
					door2.locked = False
					door2.IsElevatorDoor = 1
				}
			}
		}	
	}
	
	let inside = False
	
	if (!door1.open && !door2.open) {
		door1.locked = True
		door2.locked = True
		if (door1.openstate == 0 && door2.openstate == 0) {
			if (State < 0) {
				State = State - FPSfactor
				if (Abs(EntityX(Collider)-EntityX(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
					if (Abs(EntityZ(Collider)-EntityZ(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
						if (Abs(EntityY(Collider)-EntityY(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							inside = True
							
							if (event.SoundCHN == 0) {
								event.SoundCHN = PlaySound_Strict(ElevatorMoveSFX)
							} else {
								if (!ChannelPlaying(event.SoundCHN)) {
									event.SoundCHN = PlaySound_Strict(ElevatorMoveSFX)
								}
							}
							
							CameraShake = Sin(Abs(State)/3.0)*0.3
						}
					}
				}
				
				if (State < -500) {
					door1.locked = True
					door2.locked = False
					State = 0
					
					if (inside) {
						if (!ignorerotation) {
							dist = Distance(EntityX(Collider,True),EntityZ(Collider,True),EntityX(room1,True),EntityZ(room1,True))
							dir = point_direction(EntityX(Collider,True),EntityZ(Collider,True),EntityX(room1,True),EntityZ(room1,True))
							dir=dir+EntityYaw(room2,True)-EntityYaw(room1,True)
							dir=WrapAngle(dir)
							x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
							z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
							RotateEntity(Collider,EntityPitch(Collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(Collider,True),EntityYaw(room1,True)),EntityRoll(Collider,True),True)
						} else {
							x = Max(Min((EntityX(Collider)-EntityX(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
							z = Max(Min((EntityZ(Collider)-EntityZ(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
						}
						
						TeleportEntity(Collider, EntityX(room2,True)+x,(0.1*FPSfactor)+EntityY(room2,True)+(EntityY(Collider)-EntityY(room1,True)),EntityZ(room2,True)+z,0.3,True)
						UpdateDoorsTimer = 0
						DropSpeed = 0
						UpdateDoors()
						UpdateRooms()
						
						sound=Rand(0, 2)
						door2.SoundCHN = PlaySound_Strict(OpenDoorSFX(3, sound))
					}
					
					for (n of NPCs.each) {
						if (Abs(EntityX(n.Collider)-EntityX(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							if (Abs(EntityZ(n.Collider)-EntityZ(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
								if (Abs(EntityY(n.Collider)-EntityY(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
									if (!ignorerotation) {
										dist = Distance(EntityX(n.Collider,True),EntityZ(n.Collider,True),EntityX(room1,True),EntityZ(room1,True))
										dir = point_direction(EntityX(n.Collider,True),EntityZ(n.Collider,True),EntityX(room1,True),EntityZ(room1,True))
										dir=dir+EntityYaw(room2,True)-EntityYaw(room1,True)
										dir=WrapAngle(dir)
										x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										RotateEntity(n.Collider,EntityPitch(n.Collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(n.Collider,True),EntityYaw(room1,True)),EntityRoll(n.Collider,True),True)
									} else {
										x = Max(Min((EntityX(n.Collider)-EntityX(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min((EntityZ(n.Collider)-EntityZ(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
									}
									
									TeleportEntity(n.Collider, EntityX(room2,True)+x,(0.1*FPSfactor)+EntityY(room2,True)+(EntityY(n.Collider)-EntityY(room1,True)),EntityZ(room2,True)+z,n.CollRadius,True)
									if (n == Curr173) {
										Curr173.IdleTimer = 10
									}
								}
							}
						}
					}
					for (it of Items.each) {
						if (Abs(EntityX(it.collider)-EntityX(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							if (Abs(EntityZ(it.collider)-EntityZ(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
								if (Abs(EntityY(it.collider)-EntityY(room1,True))<280.0*RoomScale+(0.015*FPSfactor)) {
									if (!ignorerotation) {
										dist = Distance(EntityX(it.collider,True),EntityZ(it.collider,True),EntityX(room1,True),EntityZ(room1,True))
										dir = point_direction(EntityX(it.collider,True),EntityZ(it.collider,True),EntityX(room1,True),EntityZ(room1,True))
										dir=dir+EntityYaw(room2,True)-EntityYaw(room1,True)
										dir=WrapAngle(dir)
										x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										RotateEntity(it.collider,EntityPitch(it.collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(it.collider,True),EntityYaw(room1,True)),EntityRoll(it.collider,True),True)
									} else {
										x = Max(Min((EntityX(it.collider)-EntityX(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min((EntityZ(it.collider)-EntityZ(room1,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
									}
									
									TeleportEntity(it.collider, EntityX(room2,True)+x,(0.1*FPSfactor)+EntityY(room2,True)+(EntityY(it.collider)-EntityY(room1,True)),EntityZ(room2,True)+z,0.01,True)
								}
							}
						}
					}
					
					UseDoor(door2,False,!inside)
					door1.open = False
					
					PlaySound2(ElevatorBeepSFX, Camera, room1, 4.0)
				}
			} else {
				State = State + FPSfactor
				if (Abs(EntityX(Collider)-EntityX(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
					if (Abs(EntityZ(Collider)-EntityZ(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {	
						if (Abs(EntityY(Collider)-EntityY(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							inside = True
							
							if (event.SoundCHN == 0) {
								event.SoundCHN = PlaySound_Strict(ElevatorMoveSFX)
							} else {
								if (!ChannelPlaying(event.SoundCHN)) {event.SoundCHN = PlaySound_Strict(ElevatorMoveSFX)}
							}
							
							CameraShake = Sin(Abs(State)/3.0)*0.3
						}
					}
				}	
				
				if (State > 500) {
					door1.locked = False
					door2.locked = True				
					State = 0
					
					if (inside) {
						if (!ignorerotation) {
							dist = Distance(EntityX(Collider,True),EntityZ(Collider,True),EntityX(room2,True),EntityZ(room2,True))
							dir = point_direction(EntityX(Collider,True),EntityZ(Collider,True),EntityX(room2,True),EntityZ(room2,True))
							dir=dir+EntityYaw(room1,True)-EntityYaw(room2,True)
							x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
							z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
							RotateEntity(Collider,EntityPitch(Collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(Collider,True),EntityYaw(room1,True)),EntityRoll(Collider,True),True)
						} else {
							x = Max(Min((EntityX(Collider)-EntityX(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
							z = Max(Min((EntityZ(Collider)-EntityZ(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
						}
						
						TeleportEntity(Collider, EntityX(room1,True)+x,(0.1*FPSfactor)+EntityY(room1,True)+(EntityY(Collider)-EntityY(room2,True)),EntityZ(room1,True)+z,0.3,True)
						UpdateDoorsTimer = 0
						DropSpeed = 0
						UpdateDoors()
						UpdateRooms()
						
						sound=Rand(0, 2)
						door1.SoundCHN = PlaySound_Strict(OpenDoorSFX(3, sound))
					}
					
					for (n of NPCs.each) {
						if (Abs(EntityX(n.Collider)-EntityX(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							if (Abs(EntityZ(n.Collider)-EntityZ(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
								if (Abs(EntityY(n.Collider)-EntityY(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
									if (!ignorerotation) {
										dist = Distance(EntityX(n.Collider,True),EntityZ(n.Collider,True),EntityX(room2,True),EntityZ(room2,True))
										dir = point_direction(EntityX(n.Collider,True),EntityZ(n.Collider,True),EntityX(room2,True),EntityZ(room2,True))
										dir=dir+EntityYaw(room1,True)-EntityYaw(room2,True)
										x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										RotateEntity(n.Collider,EntityPitch(n.Collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(n.Collider,True),EntityYaw(room1,True)),EntityRoll(n.Collider,True),True)
									} else {
										x = Max(Min((EntityX(n.Collider)-EntityX(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min((EntityZ(n.Collider)-EntityZ(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
									}
									
									TeleportEntity(n.Collider, EntityX(room1,True)+x,(0.1*FPSfactor)+EntityY(room1,True)+(EntityY(n.Collider)-EntityY(room2,True)),EntityZ(room1,True)+z,n.CollRadius,True)
									if (n == Curr173) {
										Curr173.IdleTimer = 10
									}
								}
							}
						}
					}
					for (it of Items.each) {
						if (Abs(EntityX(it.collider)-EntityX(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
							if (Abs(EntityZ(it.collider)-EntityZ(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
								if (Abs(EntityY(it.collider)-EntityY(room2,True))<280.0*RoomScale+(0.015*FPSfactor)) {
									if (!ignorerotation) {
										dist = Distance(EntityX(it.collider,True),EntityZ(it.collider,True),EntityX(room2,True),EntityZ(room2,True))
										dir = point_direction(EntityX(it.collider,True),EntityZ(it.collider,True),EntityX(room2,True),EntityZ(room2,True))
										dir=dir+EntityYaw(room1,True)-EntityYaw(room2,True)
										x = Max(Min(Cos(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min(Sin(dir)*dist,280*RoomScale-0.22),-280*RoomScale+0.22)
										RotateEntity(it.collider,EntityPitch(it.collider,True),EntityYaw(room2,True)+angleDist(EntityYaw(it.collider,True),EntityYaw(room1,True)),EntityRoll(it.collider,True),True)
									} else {
										x = Max(Min((EntityX(it.collider)-EntityX(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
										z = Max(Min((EntityZ(it.collider)-EntityZ(room2,True)),280*RoomScale-0.22),-280*RoomScale+0.22)
									}
									
									TeleportEntity(it.collider, EntityX(room1,True)+x,(0.1*FPSfactor)+EntityY(room1,True)+(EntityY(it.collider)-EntityY(room2,True)),EntityZ(room1,True)+z,0.01,True)
								}
							}
						}
					}
					
					UseDoor(door1,False,!inside)
					door2.open = False
					
					PlaySound2(ElevatorBeepSFX, Camera, room2, 4.0)
				}	
				
			}
		}
	}
	
	return State
	
}
//-------------------------------------------------------------------------------------------------------

class Props {
	file: string
	obj
}

function CreatePropObj(file: string) {
	let p: Props
	for (p of Props.each) {
		if (p.file == file) {
			return CopyEntity(p.obj)
		}
	}
	
	p = new Props()
	p.file = file
	p.obj = LoadMesh(file)
	return p.obj
}

//-------------------------------------------------------------------------------------------------------

function CreateMap() {
	DebugLog ("Generating a map using the seed "+RandomSeed)
	
	I_Zone.Transition[0] = 13
	I_Zone.Transition[1] = 7
	I_Zone.HasCustomForest = False
	I_Zone.HasCustomMT = False
	
	let x: int
	let y: int
	let temp: int
	let i: int
	let x2: int
	let y2: int
	let width: int
	let height: int
	
	let zone: int
	
	SeedRnd(GenerateSeedNumber(RandomSeed))
	
	var MapName: string[][] = new Array(MapWidth, MapHeight)
	
	var MapRoomID: int[] = new Array(ROOM4 + 1)
	
	x = Floor(MapWidth / 2)
	y = MapHeight - 2
	
	for (i of range(y, MapHeight)) {
		MapTemp(x, i) = True
	}
	
	do {
		width = Rand(10, 15)
		
		if (x > MapWidth*0.6) {
			width = -width
		} else if (x > MapWidth*0.4) {
			x = x-width/2
		}
		
		//make sure the hallway doesn't go outside the array
		if (x+width > MapWidth-3) {
			width=MapWidth-3-x
		} else if (x+width < 2) {
			width=-x+2
		}
		
		x = Min(x, x + width)
		width = Abs(width)
		for (i of range(x, x + width + 1)) {
			MapTemp(Min(i,MapWidth), y) = True
		}
		
		height = Rand(3, 4)
		if (y - height < 1) {height = y-1}
		
		yhallways = Rand(4,5)
		
		if (GetZone(y-height) != GetZone(y-height+1)) {
			height -= 1
		}
		
		for (i of range(1, yhallways + 1)) {
			
			x2 = Max(Min(Rand(x, x + width-1),MapWidth-2),2)
			while (MapTemp(x2, y - 1) || MapTemp(x2 - 1, y - 1) || MapTemp(x2 + 1, y - 1)) {
				x2=x2+1
			}
			
			if (x2<x+width) {
				if (i == 1) {
					tempheight = height 
					if (Rand(2)=1) {
						x2 = x
					} else {
						x2 = x+width
					}
				} else {
					tempheight = Rand(1,height)
				}
				
				for (y2 of range(y - tempheight, y + 1)) {
					if (GetZone(y2) != GetZone(y2+1)) { //a room leading from zone to another
						MapTemp(x2, y2) = 255
					} else {
						MapTemp(x2, y2) = True
					}
				}
				
				if (tempheight == height) {temp = x2}
			}
			
		}
		
		x = temp
		y = y - height
	} while (!(y < 2))
	
	
	let ZoneAmount=3
	let Room1Amount: int[3], Room2Amount: int[3],Room2CAmount: int[3],Room3Amount: int[3],Room4Amount: int[3]
	
	//count the amount of rooms
	for (y of range(1, MapHeight)) {
		zone = GetZone(y)
		
		for (x of range(1, MapWidth)) {
			if (MapTemp(x, y) > 0) {
				temp = Min(MapTemp(x + 1, y),1) + Min(MapTemp(x - 1, y),1)
				temp = temp + Min(MapTemp(x, y + 1),1) + Min(MapTemp(x, y - 1),1)			
				if (MapTemp(x,y)<255) {MapTemp(x, y) = temp}
				switch (MapTemp(x,y)) {
					case 1:
						Room1Amount[zone]=Room1Amount[zone]+1
					case 2:
						if (Min(MapTemp(x + 1, y),1) + Min(MapTemp(x - 1, y),1) == 2) {
							Room2Amount[zone]=Room2Amount[zone]+1	
						} else if (Min(MapTemp(x, y + 1),1) + Min(MapTemp(x , y - 1),1) == 2) {
							Room2Amount[zone]=Room2Amount[zone]+1	
						} else {
							Room2CAmount[zone] += 1
						}
					case 3:
						Room3Amount[zone]=Room3Amount[zone]+1
					case 4:
						Room4Amount[zone]=Room4Amount[zone]+1
				}
			}
		}
	}		
	
	//force more room1s (if needed)
	for (i of range(3)) {
		//need more rooms if there are less than 5 of them
		temp = -Room1Amount[i]+5
		
		if (temp > 0) {
			
			for (y of range((MapHeight/ZoneAmount)*(2-i)+1, ((MapHeight/ZoneAmount) * ((2-i)+1.0))-1)) {
				
				for (x of range(2, MapWidth - 1)) {
					if (MapTemp(x, y) == 0) {
						
						if ((Min(MapTemp(x + 1, y),1) + Min(MapTemp(x - 1, y),1) + Min(MapTemp(x, y + 1),1) + Min(MapTemp(x, y - 1),1)) == 1) {
							
							if (MapTemp(x + 1, y)) {
								x2 = x+1
								y2 = y
							} else if (MapTemp(x - 1, y)) {
								x2 = x-1
								y2 = y
							} else if (MapTemp(x, y+1)) {
								x2 = x
								y2 = y+1	
							} else if (MapTemp(x, y-1)) {
								x2 = x
								y2 = y-1
							}
							
							placed = False
							if (MapTemp(x2,y2)>1 && MapTemp(x2,y2)<4) {
								switch (MapTemp(x2,y2)) {
									case 2:
										if (Min(MapTemp(x2 + 1, y2),1) + Min(MapTemp(x2 - 1, y2),1) == 2) {
											Room2Amount[i]=Room2Amount[i]-1
											Room3Amount[i]=Room3Amount[i]+1
											placed = True
										} else if (Min(MapTemp(x2, y2 + 1),1) + Min(MapTemp(x2, y2 - 1),1) == 2) {
											Room2Amount[i]=Room2Amount[i]-1
											Room3Amount[i]=Room3Amount[i]+1
											placed = True
										}
									case 3:
										Room3Amount[i]=Room3Amount[i]-1
										Room4Amount[i]=Room4Amount[i]+1	
										placed = True
								}
								
								if (placed) {
									MapTemp(x2,y2)=MapTemp(x2,y2)+1
									
									MapTemp(x, y) = 1
									Room1Amount[i] = Room1Amount[i]+1	
									
									temp=temp-1
								}
							}
						}
						
					}
					if (temp == 0) {break}
				}
				if (temp == 0) {break}
			}
		}
	}
	
	//force more room4s and room2Cs
	for (i of range(3)) {
		
		switch (i) {
			case 2:
				zone=2
				temp2=MapHeight/3
			case 1:
				zone=MapHeight/3+1
				temp2=MapHeight*(2.0/3.0)-1
			case 0:
				zone=MapHeight*(2.0/3.0)+1
				temp2=MapHeight-2
		}
		
		if (Room4Amount[i]<1) { //we want at least 1 ROOM4
			DebugLog("forcing a ROOM4 into zone "+i)
			temp=0
			
			for (y of range(zone, temp2 + 1)) {
				for (x of range(2, MapWidth - 1)) {
					if (MapTemp(x,y) == 3) {
						switch (0) { //see if adding a ROOM1 is possible
							case (MapTemp(x+1,y) || MapTemp(x+1,y+1) || MapTemp(x+1,y-1) || MapTemp(x+2,y)):
								MapTemp(x+1,y)=1
								temp=1
							case (MapTemp(x-1,y) || MapTemp(x-1,y+1) || MapTemp(x-1,y-1) || MapTemp(x-2,y)):
								MapTemp(x-1,y)=1
								temp=1
							case (MapTemp(x,y+1) || MapTemp(x+1,y+1) || MapTemp(x-1,y+1) || MapTemp(x,y+2)):
								MapTemp(x,y+1)=1
								temp=1
							case (MapTemp(x,y-1) || MapTemp(x+1,y-1) || MapTemp(x-1,y-1) || MapTemp(x,y-2)):
								MapTemp(x,y-1)=1
								temp=1
						}
						if (temp == 1) {
							MapTemp(x,y)=4 //turn this room into a ROOM4
							DebugLog("ROOM4 forced into slot ("+x+", "+y+")")
							Room4Amount[i]=Room4Amount[i]+1
							Room3Amount[i]=Room3Amount[i]-1
							Room1Amount[i]=Room1Amount[i]+1
						}
					}
					if (temp == 1) {break}
				}
				if (temp == 1) {break}
			}
			
			if (temp == 0) {DebugLog("Couldn't place ROOM4 in zone "+i)}
		}
		
		if (Room2CAmount[i] < 1) { //we want at least 1 ROOM2C
			DebugLog("forcing a ROOM2C into zone "+i)
			temp=0
			
			zone=zone+1
			temp2=temp2-1
			
			for (y of range(zone, temp2 + 1)) {
				for (x of range(3, MapWidth - 2)) {
					if (MapTemp(x,y) == 1) {
						switch (true) { //see if adding some rooms is possible
							case MapTemp(x-1,y)>0:
								if ((MapTemp(x,y-1)+MapTemp(x,y+1)+MapTemp(x+2,y)) == 0) {
									if ((MapTemp(x+1,y-2)+MapTemp(x+2,y-1)+MapTemp(x+1,y-1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x+1,y)=2
										DebugLog("ROOM2C forced into slot ("+(x+1)+", "+(y)+")")
										MapTemp(x+1,y-1)=1
										temp=1
									} else if ((MapTemp(x+1,y+2)+MapTemp(x+2,y+1)+MapTemp(x+1,y+1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x+1,y)=2
										DebugLog("ROOM2C forced into slot ("+(x+1)+", "+(y)+")")
										MapTemp(x+1,y+1)=1
										temp=1
									}
								}
							case MapTemp(x+1,y) > 0:
								if ((MapTemp(x,y-1)+MapTemp(x,y+1)+MapTemp(x-2,y)) == 0) {
									if ((MapTemp(x-1,y-2)+MapTemp(x-2,y-1)+MapTemp(x-1,y-1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x-1,y)=2
										DebugLog("ROOM2C forced into slot ("+(x-1)+", "+(y)+")")
										MapTemp(x-1,y-1)=1
										temp=1
									} else if ((MapTemp(x-1,y+2)+MapTemp(x-2,y+1)+MapTemp(x-1,y+1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x-1,y)=2
										DebugLog("ROOM2C forced into slot ("+(x-1)+", "+(y)+")")
										MapTemp(x-1,y+1)=1
										temp=1
									}
								}
							case MapTemp(x,y-1) > 0:
								if ((MapTemp(x-1,y)+MapTemp(x+1,y)+MapTemp(x,y+2))=0) {
									if ((MapTemp(x-2,y+1)+MapTemp(x-1,y+2)+MapTemp(x-1,y+1))=0) {
										MapTemp(x,y)=2
										MapTemp(x,y+1)=2
										DebugLog("ROOM2C forced into slot ("+(x)+", "+(y+1)+")")
										MapTemp(x-1,y+1)=1
										temp=1
									} else if ((MapTemp(x+2,y+1)+MapTemp(x+1,y+2)+MapTemp(x+1,y+1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x,y+1)=2
										DebugLog("ROOM2C forced into slot ("+(x)+", "+(y+1)+")")
										MapTemp(x+1,y+1)=1
										temp=1
									}
								}
							case MapTemp(x,y+1) > 0:
								if ((MapTemp(x-1,y)+MapTemp(x+1,y)+MapTemp(x,y-2)) == 0) {
									if ((MapTemp(x-2,y-1)+MapTemp(x-1,y-2)+MapTemp(x-1,y-1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x,y-1)=2
										DebugLog("ROOM2C forced into slot ("+(x)+", "+(y-1)+")")
										MapTemp(x-1,y-1)=1
										temp=1
									} else if ((MapTemp(x+2,y-1)+MapTemp(x+1,y-2)+MapTemp(x+1,y-1)) == 0) {
										MapTemp(x,y)=2
										MapTemp(x,y-1)=2
										DebugLog("ROOM2C forced into slot ("+(x)+", "+(y-1)+")")
										MapTemp(x+1,y-1)=1
										temp=1
									}
								}
						}
						if (temp == 1) {
							Room2CAmount[i]=Room2CAmount[i]+1
							Room2Amount[i]=Room2Amount[i]+1
						}
					}
					if (temp == 1) {break}
				}
				if (temp == 1) {break}
			}
			
			if (temp == 0) {DebugLog("Couldn't place ROOM2C in zone "+i)}
		}
		
	}
	
	let MaxRooms: int = 55*MapWidth/20
	MaxRooms=Max(MaxRooms,Room1Amount[0]+Room1Amount[1]+Room1Amount[2]+1)
	MaxRooms=Max(MaxRooms,Room2Amount[0]+Room2Amount[1]+Room2Amount[2]+1)
	MaxRooms=Max(MaxRooms,Room2CAmount[0]+Room2CAmount[1]+Room2CAmount[2]+1)
	MaxRooms=Max(MaxRooms,Room3Amount[0]+Room3Amount[1]+Room3Amount[2]+1)
	MaxRooms=Max(MaxRooms,Room4Amount[0]+Room4Amount[1]+Room4Amount[2]+1)
	var MapRoom: string[][] = new Array(ROOM4 + 1, MaxRooms)
	
	
	//zone 1 --------------------------------------------------------------------------------------------------
	
	let min_pos = 1, max_pos = Room1Amount[0]-1
	
	MapRoom(ROOM1, 0) = "start"	
	SetRoom("roompj", ROOM1, Floor(0.1*Float(Room1Amount[0])),min_pos,max_pos)
	SetRoom("914", ROOM1, Floor(0.3*Float(Room1Amount[0])),min_pos,max_pos)
	SetRoom("room1archive",ROOM1,Floor(0.5*Float(Room1Amount[0])),min_pos,max_pos)
	SetRoom("room205", ROOM1, Floor(0.6*Float(Room1Amount[0])),min_pos,max_pos)
	
	MapRoom(ROOM2C, 0) = "lockroom"
	
	min_pos = 1
	max_pos = Room2Amount[0]-1
	
	MapRoom(ROOM2, 0) = "room2closets"
	SetRoom("room2testroom2", ROOM2, Floor(0.1*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2scps", ROOM2, Floor(0.2*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2storage", ROOM2, Floor(0.3*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2gw_b", ROOM2, Floor(0.4*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2sl", ROOM2, Floor(0.5*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room012", ROOM2, Floor(0.55*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2scps2",ROOM2,Floor(0.6*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room1123",ROOM2,Floor(0.7*Float(Room2Amount[0])),min_pos,max_pos)
	SetRoom("room2elevator",ROOM2,Floor(0.85*Float(Room2Amount[0])),min_pos,max_pos)
	
	
	MapRoom(ROOM3, Floor(Rnd(0.2,0.8)*Float(Room3Amount[0]))) = "room3storage"
	
	MapRoom(ROOM2C, Floor(0.5*Float(Room2CAmount[0]))) = "room1162"
	
	MapRoom(ROOM4, Floor(0.3*Float(Room4Amount[0]))) = "room4info"
	
	//zone 2 --------------------------------------------------------------------------------------------------
	
	min_pos = Room1Amount[0]
	max_pos = Room1Amount[0]+Room1Amount[1]-1
	
	SetRoom("room079", ROOM1, Room1Amount[0]+Floor(0.15*Float(Room1Amount[1])),min_pos,max_pos)
    SetRoom("room106", ROOM1, Room1Amount[0]+Floor(0.3*Float(Room1Amount[1])),min_pos,max_pos)
    SetRoom("008", ROOM1, Room1Amount[0]+Floor(0.4*Float(Room1Amount[1])),min_pos,max_pos)
    SetRoom("room035", ROOM1, Room1Amount[0]+Floor(0.5*Float(Room1Amount[1])),min_pos,max_pos)
    SetRoom("coffin", ROOM1, Room1Amount[0]+Floor(0.7*Float(Room1Amount[1])),min_pos,max_pos)
	
	min_pos = Room2Amount[0]
	max_pos = Room2Amount[0]+Room2Amount[1]-1
	
	MapRoom(ROOM2, Room2Amount[0]+Floor(0.1*Float(Room2Amount[1]))) = "room2nuke"
	SetRoom("room2tunnel", ROOM2, Room2Amount[0]+Floor(0.25*Float(Room2Amount[1])),min_pos,max_pos)
	SetRoom("room049", ROOM2, Room2Amount[0]+Floor(0.4*Float(Room2Amount[1])),min_pos,max_pos)
	SetRoom("room2shaft",ROOM2,Room2Amount[0]+Floor(0.6*Float(Room2Amount[1])),min_pos,max_pos)
	SetRoom("testroom", ROOM2, Room2Amount[0]+Floor(0.7*Float(Room2Amount[1])),min_pos,max_pos)
	SetRoom("room2servers", ROOM2, Room2Amount[0]+Floor(0.9*Room2Amount[1]),min_pos,max_pos)
	
	MapRoom(ROOM3, Room3Amount[0]+Floor(0.3*Float(Room3Amount[1]))) = "room513"
	MapRoom(ROOM3, Room3Amount[0]+Floor(0.6*Float(Room3Amount[1]))) = "room966"
	
	MapRoom(ROOM2C, Room2CAmount[0]+Floor(0.5*Float(Room2CAmount[1]))) = "room2cpit"
	
	
	//zone 3  --------------------------------------------------------------------------------------------------
	
	MapRoom(ROOM1, Room1Amount[0]+Room1Amount[1]+Room1Amount[2]-2) = "exit1"
	MapRoom(ROOM1, Room1Amount[0]+Room1Amount[1]+Room1Amount[2]-1) = "gateaentrance"
	MapRoom(ROOM1, Room1Amount[0]+Room1Amount[1]) = "room1lifts"
	
	min_pos = Room2Amount[0]+Room2Amount[1]
	max_pos = Room2Amount[0]+Room2Amount[1]+Room2Amount[2]-1		
	
	MapRoom(ROOM2, min_pos+Floor(0.1*Float(Room2Amount[2]))) = "room2poffices"
	SetRoom("room2cafeteria", ROOM2, min_pos+Floor(0.2*Float(Room2Amount[2])),min_pos,max_pos)
	SetRoom("room2sroom", ROOM2, min_pos+Floor(0.3*Float(Room2Amount[2])),min_pos,max_pos)
	SetRoom("room2servers2", ROOM2, min_pos+Floor(0.4*Room2Amount[2]),min_pos,max_pos)	
	SetRoom("room2offices", ROOM2, min_pos+Floor(0.45*Room2Amount[2]),min_pos,max_pos)
	SetRoom("room2offices4", ROOM2, min_pos+Floor(0.5*Room2Amount[2]),min_pos,max_pos)	
	SetRoom("room860", ROOM2, min_pos+Floor(0.6*Room2Amount[2]),min_pos,max_pos)
	SetRoom("medibay", ROOM2, min_pos+Floor(0.7*Float(Room2Amount[2])),min_pos,max_pos)
	SetRoom("room2poffices2", ROOM2, min_pos+Floor(0.8*Room2Amount[2]),min_pos,max_pos)
	SetRoom("room2offices2", ROOM2, min_pos+Floor(0.9*Float(Room2Amount[2])),min_pos,max_pos)
	
	MapRoom(ROOM2C, Room2CAmount[0]+Room2CAmount[1]) = "room2ccont"	
	MapRoom(ROOM2C, Room2CAmount[0]+Room2CAmount[1]+1) = "lockroom2"		
	
	MapRoom(ROOM3, Room3Amount[0]+Room3Amount[1]+Floor(0.3*Float(Room3Amount[2]))) = "room3servers"
	MapRoom(ROOM3, Room3Amount[0]+Room3Amount[1]+Floor(0.7*Float(Room3Amount[2]))) = "room3servers2"
	MapRoom(ROOM3, Room3Amount[0]+Room3Amount[1]+Floor(0.5*Float(Room3Amount[2]))) = "room3offices"
	
	//----------------------- luodaan kartta --------------------------------
	
	temp = 0
	let r: Rooms
	let spacing: float = 8.0
	for (y of range(MapHeight - 1, 2, - 1)) {
				
		if (y < MapHeight/3+1) {
			zone=3
		} else if (y < MapHeight*(2.0/3.0)) {
			zone=2
		} else {
			zone=1
		}
		
		for (x of range(1, MapWidth - 1)) {
			if (MapTemp(x, y) == 255) {
				if (y > MapHeight/2) { //zone = 2
					r = CreateRoom(zone, ROOM2, x * 8, 0, y * 8, "checkpoint1")
				} else { //if zone = 3
					r = CreateRoom(zone, ROOM2, x * 8, 0, y * 8, "checkpoint2")
				}
			} else if (MapTemp(x, y) > 0) {
				
				temp = Min(MapTemp(x + 1, y),1) + Min(MapTemp(x - 1, y),1) + Min(MapTemp(x, y + 1),1) + Min(MapTemp(x, y - 1),1)
				
				switch (temp) {
					case 1:
						if (MapRoomID(ROOM1) < MaxRooms && MapName(x,y) == "") {
							if (MapRoom(ROOM1, MapRoomID(ROOM1)) != "") {
								MapName(x, y) = MapRoom(ROOM1, MapRoomID(ROOM1))
							}
						}
						
						r = CreateRoom(zone, ROOM1, x * 8, 0, y * 8, MapName(x, y))
						if (MapTemp(x, y + 1)) {
							r.angle = 180 
							TurnEntity(r.obj, 0, r.angle, 0)
						} else if (MapTemp(x - 1, y)) {
							r.angle = 270
							TurnEntity(r.obj, 0, r.angle, 0)
						} else if (MapTemp(x + 1, y)) {
							r.angle = 90
							TurnEntity(r.obj, 0, r.angle, 0)
						} else { 
							r.angle = 0
						}
						MapRoomID(ROOM1)=MapRoomID(ROOM1)+1
					case 2:
						if (MapTemp(x - 1, y)>0 && MapTemp(x + 1, y)>0) {
							if (MapRoomID(ROOM2) < MaxRooms && MapName(x,y) == "" ) {
								if (MapRoom(ROOM2, MapRoomID(ROOM2)) != "") {
									MapName(x, y) = MapRoom(ROOM2, MapRoomID(ROOM2))
								}
							}
							r = CreateRoom(zone, ROOM2, x * 8, 0, y * 8, MapName(x, y))
							if (Rand(2) == 1) {
								r.angle = 90
							} else {
								r.angle = 270
							}
							TurnEntity(r.obj, 0, r.angle, 0)
							MapRoomID(ROOM2)=MapRoomID(ROOM2)+1
						} else if (MapTemp(x, y - 1)>0 && MapTemp(x, y + 1)>0) {
							if (MapRoomID(ROOM2) < MaxRooms && MapName(x,y) == "")  {
								if (MapRoom(ROOM2, MapRoomID(ROOM2)) != "") {
									MapName(x, y) = MapRoom(ROOM2, MapRoomID(ROOM2))
								}
							}
							r = CreateRoom(zone, ROOM2, x * 8, 0, y * 8, MapName(x, y))
							if (Rand(2) == 1) {
								r.angle = 180
							} else {
								r.angle = 0
							}
							TurnEntity(r.obj, 0, r.angle, 0)
							MapRoomID(ROOM2)=MapRoomID(ROOM2)+1
						} else {
							if (MapRoomID(ROOM2C) < MaxRooms && MapName(x,y) == "") {
								if (MapRoom(ROOM2C, MapRoomID(ROOM2C)) != "") {
									MapName(x, y) = MapRoom(ROOM2C, MapRoomID(ROOM2C))
								}
							}
							
							if (MapTemp(x - 1, y)>0 && MapTemp(x, y + 1)>0) {
								r = CreateRoom(zone, ROOM2C, x * 8, 0, y * 8, MapName(x, y))
								r.angle = 180
								TurnEntity(r.obj, 0, r.angle, 0)
							} else if (MapTemp(x + 1, y)>0 && MapTemp(x, y + 1)>0) {
								r = CreateRoom(zone, ROOM2C, x * 8, 0, y * 8, MapName(x, y))
								r.angle = 90
								TurnEntity(r.obj, 0, r.angle, 0)
							} else if (MapTemp(x - 1, y)>0 && MapTemp(x, y - 1)>0) {
								r = CreateRoom(zone, ROOM2C, x * 8, 0, y * 8, MapName(x, y))
								TurnEntity(r.obj, 0, 270, 0)
								r.angle = 270
							} else {
								r = CreateRoom(zone, ROOM2C, x * 8, 0, y * 8, MapName(x, y))
							}
							MapRoomID(ROOM2C)=MapRoomID(ROOM2C)+1
						}
					case 3:
						if (MapRoomID(ROOM3) < MaxRooms && MapName(x,y) == "") {
							if (MapRoom(ROOM3, MapRoomID(ROOM3)) != "") {
								MapName(x, y) = MapRoom(ROOM3, MapRoomID(ROOM3))
							}
						}
						
						r = CreateRoom(zone, ROOM3, x * 8, 0, y * 8, MapName(x, y))
						if (!MapTemp(x, y - 1)) {
							TurnEntity(r.obj, 0, 180, 0)
							r.angle = 180
						} else if (!MapTemp(x - 1, y)) {
							TurnEntity(r.obj, 0, 90, 0)
							r.angle = 90
						} else if (!MapTemp(x + 1, y)) {
							TurnEntity(r.obj, 0, -90, 0)
							r.angle = 270
						}
						MapRoomID(ROOM3)=MapRoomID(ROOM3)+1
					case 4:
						if (MapRoomID(ROOM4) < MaxRooms && MapName(x,y) == "") {
							if (MapRoom(ROOM4, MapRoomID(ROOM4)) != "") {
								MapName(x, y) = MapRoom(ROOM4, MapRoomID(ROOM4))
							}
						}
						
						r = CreateRoom(zone, ROOM4, x * 8, 0, y * 8, MapName(x, y))
						MapRoomID(ROOM4)=MapRoomID(ROOM4)+1
				}
				
			}
			
		}
	}		
	
	r = CreateRoom(0, ROOM1, (MapWidth-1) * 8, 500, 8, "gatea")
	MapRoomID(ROOM1)=MapRoomID(ROOM1)+1
	
	r = CreateRoom(0, ROOM1, (MapWidth-1) * 8, 0, (MapHeight-1) * 8, "pocketdimension")
	MapRoomID(ROOM1)=MapRoomID(ROOM1)+1	
	
	if (IntroEnabled) {
		r = CreateRoom(0, ROOM1, 8, 0, (MapHeight-1) * 8, "173")
		MapRoomID(ROOM1)=MapRoomID(ROOM1)+1
	}
	
	r = CreateRoom(0, ROOM1, 8, 800, 0, "dimension1499")
	MapRoomID(ROOM1)=MapRoomID(ROOM1)+1
	
	for (r of Rooms.each) {
		PreventRoomOverlap(r)
	}
	
	for (y of range(MapHeight + 1)) {
		for (x of range(MapWidth + 1)) {
			MapTemp(x, y) = Min(MapTemp(x, y),1)
		}
	}
	
	let d: Doors
	let shouldSpawnDoor: int
	for (y of range(MapHeight + 1, 0, -1)) {
		
		if (y<I_Zone.Transition[1]-1) {
			zone=3
		} else if (y>=I_Zone.Transition[1]-1 && y<I_Zone.Transition[0]-1) {
			zone=2
		} else {
			zone=1
		}
		
		for (x of range(MapWidth + 1, 0, -1)) {
			if (MapTemp(x,y) > 0) {
				if (zone == 2) {
					temp=2
				} else {
					temp=0
				}
                
                for (r of Rooms.each) {
					r.angle = WrapAngle(r.angle)
					if (Int(r.x/8.0) == x && Int(r.z/8.0) == y) {
						shouldSpawnDoor = False
						switch (r.RoomTemplate.Shape) {
							case ROOM1:
								if (r.angle == 90) {
									shouldSpawnDoor = True
								}
							case ROOM2:
								if (r.angle == 90 || r.angle == 270) {
									shouldSpawnDoor = True
								}
							case ROOM2C:
								if (r.angle == 0 || r.angle == 90) {
									shouldSpawnDoor = True
								}
							case ROOM3:
								if (r.angle == 0 || r.angle == 180 || r.angle == 90) {
									shouldSpawnDoor = True
								}
							default:
								shouldSpawnDoor = True
						}
						if (shouldSpawnDoor) {
							if ((x+1)<(MapWidth+1)) {
								if (MapTemp(x + 1, y) > 0) {
									d.Doors = CreateDoor(r.zone, Float(x) * spacing + spacing / 2.0, 0, Float(y) * spacing, 90, r, Max(Rand(-3, 1), 0), temp)
									r.AdjDoor[0] = d
								}
							}
						}
						
						shouldSpawnDoor = False
						switch (r.RoomTemplate.Shape) {
							case ROOM1:
								if (r.angle=180) {
									shouldSpawnDoor = true
								}
							case ROOM2:
								if (r.angle == 0 || r.angle == 180) {
									shouldSpawnDoor = true
								}
							case ROOM2C:
								if (r.angle == 180 || r.angle == 90) {
									shouldSpawnDoor = true
								}
							case ROOM3:
								if (r.angle == 180 || r.angle == 90 || r.angle == 270) {
									shouldSpawnDoor = true
								}
							default:
								shouldSpawnDoor = true
						}
						if (shouldSpawnDoor) {
							if ((y+1)<(MapHeight+1)) {
								if (MapTemp(x, y + 1) > 0) {
									d.Doors = CreateDoor(r.zone, Float(x) * spacing, 0, Float(y) * spacing + spacing / 2.0, 0, r, Max(Rand(-3, 1), 0), temp)
									r.AdjDoor[3] = d
								}
							}
						}
						
						break
					}
                }   
			}
		}
	}
	
	for (r of Rooms.each) {
		r.angle = WrapAngle(r.angle)
		r.Adjacent[0]=null
		r.Adjacent[1]=null
		r.Adjacent[2]=null
		r.Adjacent[3]=null
		for (r2 of Rooms.each) {
			if (r != r2) {
				if (r2.z == r.z) {
					if ((r2.x) == (r.x+8.0)) {
						r.Adjacent[0]=r2
						if (r.AdjDoor[0] == null) {r.AdjDoor[0] = r2.AdjDoor[2]}
					} else if ((r2.x) == (r.x-8.0)) {
						r.Adjacent[2]=r2
						if (r.AdjDoor[2] == null) {r.AdjDoor[2] = r2.AdjDoor[0]}
					}
				} else if (r2.x == r.x) {
					if ((r2.z) == (r.z-8.0)) {
						r.Adjacent[1]=r2
						if (r.AdjDoor[1] == null) {r.AdjDoor[1] = r2.AdjDoor[3]}
					} else if ((r2.z) == (r.z+8.0)) {
						r.Adjacent[3]=r2
						if (r.AdjDoor[3] == null) {
							r.AdjDoor[3] = r2.AdjDoor[1]
						}
					}
				}
			}
			if ((r.Adjacent[0] != null) && (r.Adjacent[1] != null) && (r.Adjacent[2] != null) && (r.Adjacent[3] != null)) {break}
		}
	}
	
}

function SetRoom(room_name$,room_type: int,pos: int,min_pos: int,max_pos: int) {//place a room without overwriting others
	
	if (max_pos < min_pos) {
		DebugLog("Can't place "+room_name)
		return False
	}
	
	DebugLog("--- SETROOM: "+Upper(room_name)+" ---")
	let looped: int
	let can_place: int
	looped = False
	can_place = True
	while (MapRoom(room_type,pos) != "") {
		DebugLog("found "+MapRoom(room_type,pos))
		pos=pos+1
		if (pos>max_pos) {
			if (!looped) {
				pos=min_pos+1
				looped=True
			} else {
				can_place=False
				break
			}
		}
	}
	DebugLog(room_name+" "+Str(pos))
	if (can_place) {
		DebugLog("--------------")
		MapRoom(room_type,pos)=room_name
		return True
	} else {
		DebugLog("couldn't place "+room_name)
		return False
	}
}

function GetZone(y: int) {
	return Min(Floor((Float(MapWidth-y)/MapWidth*ZONEAMOUNT)),ZONEAMOUNT-1)
}

//-------------------------------------------------------------------------------------------------------


function load_terrain(hmap,yscale: float=0.7,t1: int,t2: int,mask: int) {
	
	DebugLog("load_terrain: "+hmap)
	
	// load the heightmap
	if (hmap == 0) {RuntimeError("Heightmap image "+hmap+" does not exist.")}
	
	// store heightmap dimensions
	let x = ImageWidth(hmap)-1, y = ImageHeight(hmap)-1
	let lx,ly,index
	
	// load texture and lightmaps
	if (t1 == 0) {RuntimeError("load_terrain error: invalid texture 1")}
	if (t2 == 0) {RuntimeError("load_terrain error: invalid texture 2")}
	if (mask == 0) {RuntimeError("load_terrain error: invalid texture mask")}
	
	// auto scale the textures to the right size
	if (t1) {ScaleTexture(t1,x/4,y/4)}
	if (t2) {ScaleTexture(t2,x/4,y/4)}
	if (mask) {ScaleTexture(mask,x,y)}
	
	// start building the terrain
	let mesh = CreateMesh()
	let surf = CreateSurface(mesh)
	
	// create some verts for the terrain
	for (ly of range(y + 1)) {
		for (lx of range(x + 1)) {
			AddVertex(surf,lx,0,ly,1.0/lx,1.0/ly)
		}
	}
	RenderWorld()
			
	// connect the verts with faces
	for (ly of range(y)) {
		for (lx of range(x)) {
			AddTriangle(surf,lx+((x+1)*ly),lx+((x+1)*ly)+(x+1),(lx+1)+((x+1)*ly))
			AddTriangle(surf,(lx+1)+((x+1)*ly),lx+((x+1)*ly)+(x+1),(lx+1)+((x+1)*ly)+(x+1))
		}
	}
			
	// position the terrain to center 0,0,0
	let mesh2: int = CopyMesh(mesh,mesh)
	let surf2: int = GetSurface(mesh2,1)
	PositionMesh(mesh, -x/2.0,0,-y/2.0)
	PositionMesh(mesh2, -x/2.0,0.01,-y/2.0)
	
	// alter vertice height to match the heightmap red channel
	LockBuffer(ImageBuffer(hmap))
	LockBuffer(TextureBuffer(mask))
	//SetBuffer 
	for (lx of range(x + 1)) {
		for (ly of range(y + 1)) {
			//using vertex alpha and two meshes instead of FE_ALPHAWHATEVER
			//it doesn't look perfect but it does the job
			//you might get better results by downscaling the mask to the same size as the heightmap
			let maskX: float = Min(lx*Float(TextureWidth(mask))/Float(ImageWidth(hmap)),TextureWidth(mask)-1)
			let maskY: float = TextureHeight(mask)-Min(ly*Float(TextureHeight(mask))/Float(ImageHeight(hmap)),TextureHeight(mask)-1)
			RGB1=ReadPixelFast(Min(lx,x-1),y-Min(ly,y-1),ImageBuffer(hmap))
			r = (RGB1 && 0xFF0000) >> 16 //separate out the red
			let alpha: float=(((ReadPixelFast(Max(maskX-5,5),Max(maskY-5,5),TextureBuffer(mask)) && $FF000000) >> 24)/0xFF)
			alpha = alpha+(((ReadPixelFast(Min(maskX+5,TextureWidth(mask)-5),Min(maskY+5,TextureHeight(mask)-5),TextureBuffer(mask)) && 0xFF000000) >> 24)/0xFF)
			alpha = alpha+(((ReadPixelFast(Max(maskX-5,5),Min(maskY+5,TextureHeight(mask)-5),TextureBuffer(mask)) && 0xFF000000) >> 24)/0xFF)
			alpha = alpha+(((ReadPixelFast(Min(maskX+5,TextureWidth(mask)-5),Max(maskY-5,5),TextureBuffer(mask)) && 0xFF000000) >> 24)/0xFF)
			alpha = alpha*0.25
			alpha = Sqr(alpha)
			
			index = lx + ((x+1)*ly)
			VertexCoords(surf, index , VertexX(surf,index), r*yscale,VertexZ(surf,index))
			VertexCoords(surf2, index , VertexX(surf2,index), r*yscale,VertexZ(surf2,index))
			VertexColor(surf2, index, 255.0,255.0,255.0,alpha)
			// set the terrain texture coordinates
			VertexTexCoords(surf,index,lx,-ly )
			VertexTexCoords(surf2,index,lx,-ly )
		}
	}
	UnlockBuffer(TextureBuffer(mask))
	UnlockBuffer(ImageBuffer(hmap))
	
	UpdateNormals(mesh)
	UpdateNormals(mesh2)
	
	EntityTexture(mesh,t1,0,0)
	EntityTexture(mesh2,t2,0,0)
	
	EntityFX(mesh, 1)
	EntityFX(mesh2, 1+2+32)
	
	return mesh
}



import {} from "./Skybox.ts/index.ts"
import { SetBuffer, TextureBuffer, BackBuffer, ReadPixelFast, Cls, ClsColor, ColorRed, RenderWorld } from "./Helper/graphics.ts"
import { CreateMesh, CreateSurface, AddVertex, VertexTexCoords, AddTriangle, GetSurface, CountSurfaces, AddMesh, CountVertices, EntityPitch, EntityRoll, EntityX, EntityY, EntityYaw, EntityZ, FlipMesh, FreeBrush, FreeEntity, GetBrushTexture, GetSurfaceBrush, MoveEntity, PositionMesh, RotateEntity, RotateMesh, TFormedX, TFormedY, TFormedZ, VertexX, VertexZ, EntityAlpha, Delete, EntityOrder, BrushTexture, CopyMesh, CreatePivot, EntityType } from "./Helper/Mesh.ts"
import { Trim, Left, Instr, Replace, Right, Str, Len, Lower, Mid, Upper } from "./Helper/strings.ts"
import { TFormVector } from "./Helper/vector.ts"
import { OldAiPics, AccessCode, PlayerZone, PlayerRoom, DrawHandIcon, MouseUp1, MenuScale, ButtonSFX, FPSfactor, BlinkTimer, Wearing714, WearingHazmat, WearingGasMask, Sanity, RestoreSanity, VomitTimer, user_camera_pitch, GrabbedEntity, MouseHit1, MouseDown1, mouse_y_speed_1, DrawArrowIcon, DropSpeed, EnableRoomLights, Mesh_MinX, Mesh_MinY, Mesh_MinZ, Mesh_MaxX, Mesh_MaxY, Mesh_MaxZ, Collider, BlurTimer, Brightness, BumpEnabled, CamBaseOBJ, CamOBJ, Camera, CameraSFX, CameraShake, CatchErrors, CreateDecal, CurveAngle, DeathMSG, DebugHUD, Decals, DoorOBJ, ElevatorBeepSFX, ElevatorMoveSFX, GetINISectionLocation, GetINIString2, GetMeshExtents, HIT_ITEM, HIT_MAP, HorrorSFX, IntroSFX, Inverse, LeverBaseOBJ, LeverOBJ, LeverSFX, LightSpriteTex, Max, MilliSecs2, Min, Monitor, MonitorTexture, OpenDoorSFX, ResizeImage2, SelectedEnding, TeleportEntity, TeslaTexture, WrapAngle, angleDist, point_direction } from "./Main.ts"
import { NPCtypeMTF, Curr173, NPCtype1499, NPCs } from "./NPCs.ts"
import { LoadAnimMesh_Strict, LoadImage_Strict, LoadSound_Strict } from "./StrictLoads.ts"
import { GetINIString, GetINIInt } from "./Converter.ts"
import { SAVEONSCREENS, SelectedDifficulty } from "./Difficulty.ts"
import { Eof, ReadLine, CloseFile, TextureName, ReadFile, ReadFloat, ReadInt, ReadString, ReadByte } from "./Helper/Files.ts"
import { Rand, Abs, Sin, Sqr } from "./Helper/math.ts"
import { TextureBlend, FreeTexture, ImageBuffer, ScaleTexture, LockBuffer, TextureWidth, TextureHeight, UnlockBuffer, TextureFlags, CreateTexture, TextureBlendMode } from "./Helper/textures.ts"
import { Items } from "./Items.ts"
import { CameraZoom, CreateCamera, CameraViewport, CameraRange } from "./Helper/camera.ts"
import { SetEmitter } from "./lib/DevilParticleSystem.ts"
import { ClosestButton, CreateDoor, Doors, OBJTunnel, SelectedDoor, UpdateDoorsTimer } from "./Doors.ts"

export var UpdateRoomLightsTimer: float = 0.0

function UpdateRoomLights(cam: int) {
	
	let r: Rooms
	let i
	let random: float
	let alpha: float
	let dist: float
	
	for (r of Rooms.each) {
		if (r.dist < HideDistance*0.7 || r == PlayerRoom) {
			for (i of range(r.MaxLights + 1)) {
				if (r.Lights[i] != 0) {
					if (EnableRoomLights && (SecondaryLightOn>0.5) && cam == Camera) {
						EntityOrder(r.LightSprites2[i],-1)
						if (UpdateRoomLightsTimer == 0.0) {
							ShowEntity(r.LightSprites[i])
							
							if (EntityDistance(cam,r.Lights[i])<8.5) {
								if (r.LightHidden[i]) {
									ShowEntity(r.Lights[i])
									r.LightHidden[i] = False
								}
							} else {
								if (!r.LightHidden[i]) {
									HideEntity(r.Lights[i])
									r.LightHidden[i] = True
								}
							}
							
							if (EntityDistance(cam,r.LightSprites2[i])<8.5 || r.RoomTemplate.UseLightCones) {
								if (EntityVisible(cam,r.LightSpritesPivot[i]) || r.RoomTemplate.UseLightCones) {
									if (r.LightSpriteHidden[i]) {
										ShowEntity(r.LightSprites2[i])
										r.LightSpriteHidden[i] = False
									}
									if (PlayerRoom.RoomTemplate.Name == "173") {
										random = Rnd(0.38,0.42)
									} else {
										if (r.LightFlicker[i]<5) {
											random = Rnd(0.38,0.42)
										} else if (r.LightFlicker[i]>4 && r.LightFlicker[i]<10) {
											random = Rnd(0.35,0.45)
										} else {
											random = Rnd(0.3,0.5)
										}
									}
									ScaleSprite(r.LightSprites2[i],random,random)
									
									dist = (EntityDistance(cam,r.LightSpritesPivot[i])+0.5)/7.5
									dist = Max(Min(dist,1.0),0.0)
									alpha = Float(Inverse(dist))
									
									if (alpha > 0.0) {
										EntityAlpha(r.LightSprites2[i],Max(3*(Brightness/255)*(r.LightIntensity[i]/2),1)*alpha)
									} else {
										//Instead of rendering the sprite invisible, just hiding it if the player is far away from it
										if (!r.LightSpriteHidden[i]) {
											HideEntity(r.LightSprites2[i])
											r.LightSpriteHidden[i]=True
										}
									}
									
									if (r.RoomTemplate.UseLightCones) {
										if (EntityDistance(cam,r.LightSprites2[i])>=8.5 || (!EntityVisible(cam,r.LightSpritesPivot[i]))) {
											HideEntity(r.LightSprites2[i])
											r.LightSpriteHidden[i] = True
										}
									}
								} else {
									if (!r.LightSpriteHidden[i]) {
										HideEntity(r.LightSprites2[i])
										r.LightSpriteHidden[i] = True
									}
								}
							} else {
								if (!r.LightSpriteHidden[i]) {
									HideEntity(r.LightSprites2[i])
									r.LightSpriteHidden[i] = True
									if (r.LightCone[i] != 0) {
										HideEntity(r.LightCone[i])
									}
									if (r.LightConeSpark[i] != 0) {
										HideEntity(r.LightConeSpark[i])
									} //TODO: Does this need another close???????
								}
							}
							
							if (r.LightCone[i] != 0) {ShowEntity(r.LightCone[i])}
							
							if (r.LightConeSpark[i] != 0) {
								if (r.LightConeSparkTimer[i]>0 && r.LightConeSparkTimer[i]<10) {
									ShowEntity(r.LightConeSpark[i])
									r.LightConeSparkTimer[i]=r.LightConeSparkTimer[i]+FPSfactor
								} else {
									HideEntity(r.LightConeSpark[i])
									r.LightConeSparkTimer[i]=0
								}
							}
							
							if (r.LightCone[i] != 0) {
								ScaleEntity(r.LightCone[i],0.005+Max(((-0.4+random)*0.025),0),0.005+Max(((-0.4+random)*0.025),0),0.005+Max(((-0.4+random)*0.025),0))
								if (r.LightFlicker[i] > 4) {
									if (Rand(400) == 1) {
										SetEmitter(r.LightSpritesPivot[i],ParticleEffect[0])
										PlaySound2(IntroSFX(Rand(10,12)),cam,r.LightSpritesPivot[i])
										ShowEntity(r.LightConeSpark[i])
										r.LightConeSparkTimer[i] = FPSfactor
									}
								}
							}
						} else {
							if (EntityDistance(cam,r.LightSprites2[i])<8.5 || r.RoomTemplate.UseLightCones) {
								if (PlayerRoom.RoomTemplate.Name == "173") {
									random = Rnd(0.38,0.42)
								} else {
									if (r.LightFlicker[i]<5) {
										random = Rnd(0.38,0.42)
								 	} else if (r.LightFlicker[i]>4 && r.LightFlicker[i]<10) {
										random = Rnd(0.35,0.45)
									} else {
										random = Rnd(0.3,0.5)
									}
								}
								
								if (!r.LightSpriteHidden[i]) {
									ScaleSprite(r.LightSprites2[i],random,random)
								}
							}
							
							if (r.LightCone[i] != 0) {
								ScaleEntity(r.LightCone[i],0.005+Max(((-0.4+random)*0.025),0),0.005+Max(((-0.4+random)*0.025),0),0.005+Max(((-0.4+random)*0.025),0))
							}
							
							if (r.LightConeSpark[i] != 0) {
								if (r.LightConeSparkTimer[i]>0 && r.LightConeSparkTimer[i]<10) {
									ShowEntity(r.LightConeSpark[i])
									r.LightConeSparkTimer[i]=r.LightConeSparkTimer[i]+FPSfactor
								} else {
									HideEntity(r.LightConeSpark[i])
									r.LightConeSparkTimer[i]=0
								}
							}
						}
						UpdateRoomLightsTimer = UpdateRoomLightsTimer + FPSfactor
						if (UpdateRoomLightsTimer >= 8) {
							UpdateRoomLightsTimer = 0.0
						}
					} else if (cam == Camera) {
						if (SecondaryLightOn<=0.5) {
							HideEntity(r.LightSprites[i])
						} else {
							ShowEntity(r.LightSprites[i])
						}
						
						if (!r.LightHidden[i]) {
							HideEntity(r.Lights[i])
							r.LightHidden[i] = True
						}
						if (!r.LightSpriteHidden[i]) {
							HideEntity(r.LightSprites2[i])
							r.LightSpriteHidden[i]=True
						}
						if (r.LightCone[i] != 0) {HideEntity(r.LightCone[i])}
						if (r.LightConeSpark[i] != 0) {HideEntity(r.LightConeSpark[i])}
					} else {
						//This will make the lightsprites not glitch through the wall when they are rendered by the cameras
						EntityOrder(r.LightSprites2[i],0)
					}
				}
			}
		}
	}
}

function UpdateCheckpointMonitors(numb: int) {
	let i
	let sf
	let b
	let t1
	let entity: int
	
	if (numb == 0) {
		entity = Monitor2
		UpdateCheckpoint1 = True
	} else {
		entity = Monitor3
		UpdateCheckpoint2 = True
	}
	
	for (i of range(2, CountSurfaces(entity) + 1)) {
		sf = GetSurface(entity,i)
		b = GetSurfaceBrush(sf)
		if (b != 0) {
			t1 = GetBrushTexture(b,0)
			if (t1 != 0) {
				name$ = StripPath(TextureName(t1))
				if (Lower(name) != "monitortexture.jpg") {
					if (numb == 0) {
						if (MonitorTimer < 50) {
							BrushTexture(b, MonitorTexture2, 0, 0)
						} else {
							BrushTexture(b, MonitorTexture4, 0, 0)
						}
					} else {
						if (MonitorTimer2 < 50) {
							BrushTexture(b, MonitorTexture2, 0, 0)
						} else {
							BrushTexture(b, MonitorTexture3, 0, 0)
						}
					}
					PaintSurface(sf,b)
				}
				if (name != "") {FreeTexture(t1)}
			}
			FreeBrush(b)
		}
	}
}

function TurnCheckpointMonitorsOff(numb: int) {
	let i
	let sf
	let b
	let t1
	let entity: int
	
	if (numb == 0) {
		entity = Monitor2
		UpdateCheckpoint1 = False
		MonitorTimer = 0.0
	} else {
		entity = Monitor3
		UpdateCheckpoint2 = False
		MonitorTimer2 = 0.0
	}
	
	for (i of range(2, CountSurfaces(entity) + 1)) {
		sf = GetSurface(entity,i)
		b = GetSurfaceBrush(sf)
		if (b != 0) {
			t1 = GetBrushTexture(b,0)
			if (t1 != 0) {
				name$ = StripPath(TextureName(t1))
				if (Lower(name) != "monitortexture.jpg") {
					BrushTexture(b, MonitorTextureOff, 0, 0)
					PaintSurface(sf,b)
				}
				if (name != "") {
					FreeTexture(t1)
				}
			}
			FreeBrush(b)
		}
	}
}

function TimeCheckpointMonitors() {
	
	if (UpdateCheckpoint1) {
		if (MonitorTimer < 100.0) {
			MonitorTimer = Min(MonitorTimer + FPSfactor,100.0)
		} else {
			MonitorTimer = 0.0
		}
	}
	if (UpdateCheckpoint2) {
		if (MonitorTimer2 < 100.0) {
			MonitorTimer2 = Min(MonitorTimer2 + FPSfactor,100.0)
		} else {
			MonitorTimer2 = 0.0
		}
	}
}

function AmbientLightRooms(value: int=0) {
	let mesh: int
	let surf: int
	let brush: int
	let tex0: int
	
	if (value == AmbientLightRoomVal) {return}
	AmbientLightRoomVal = value
	
	let oldbuffer: int = BackBuffer() //probably shouldn't make assumptions here but who cares, why wouldn't it use the backbuffer //GetBuffer()
	
	SetBuffer(TextureBuffer(AmbientLightRoomTex))
	
	ClsColor(value,value,value)
	Cls()
	ClsColor(0,0,0)
	
	SetBuffer(oldbuffer)
}

//CHUNKS FOR 1499

export var CHUNKDATA: int[][] = new Array(64,64)

function SetChunkDataValues() {
	let StrTemp: string
	let i: int
	let j: int
	StrTemp = ""
	SeedRnd(GenerateSeedNumber(RandomSeed))
	
	for (i of range(64)) {
		for (j of range(64)) {
			CHUNKDATA(i,j)=Rand(0,GetINIInt("Data/1499chunks.INI","general","count"))
		}
	}
	
	SeedRnd(MilliSecs2())
	
}

class ChunkPart {
	Amount: int
	obj: int[] = new Array(128)
	RandomYaw: float[] = new Array(128)
	ID
}

function CreateChunkParts(r: Rooms) {
	let File: string = "Data/1499chunks.INI"
	let ChunkAmount: int = GetINIInt(File$,"general","count")
	let i: int
	let StrTemp: string = ''
	let j: int
	let chp: ChunkPart
	let chp2: ChunkPart
	let obj: int
	
	SeedRnd(GenerateSeedNumber(RandomSeed))
	
	for (i of range(ChunkAmount + 1)) {
		let loc: int = GetINISectionLocation(File$,"chunk"+i)
		if (loc > 0) {
			StrTemp = GetINIString2(File,loc,"count")
			chp = new ChunkPart()
			chp.Amount = Int(StrTemp$)
			DebugLog("------------------")
			for (j of range(Int(StrTemp) + 1)) {
				let objID: int = GetINIString2(File,loc,"obj"+j)
				let x: string = GetINIString2(File,loc,"obj"+j+"-x")
				let z: string = GetINIString2(File,loc,"obj"+j+"-z")
				let yaw: string = GetINIString2(File,loc,"obj"+j+"-yaw")
				DebugLog("1499 chunk X/Z/Yaw: "+x+"|"+z+"|"+yaw)
				chp.obj[j] = CopyEntity(r.Objects[objID])
				if (Lower(yaw) == "random") {
					chp.RandomYaw[j] = Rnd(360)
					RotateEntity(chp.obj[j],0,chp.RandomYaw[j],0)
				} else {
					RotateEntity(chp.obj[j],0,Float(yaw),0)
				}
				PositionEntity(chp.obj[j],Float(x),0,Float(z))
				ScaleEntity(chp.obj[j],RoomScale,RoomScale,RoomScale)
				EntityType(chp.obj[j],HIT_MAP)
				EntityPickMode(chp.obj[j],2)
				HideEntity(chp.obj[j])
			}
			chp2 = Before(chp)
			if (chp2 != null) {
				chp.ID = chp2.ID+1
			}
			DebugLog("<<<<<<<<<<<<<<<<")
			DebugLog("Generated 1499 chunk "+chp.ID+" sucessfully")
		}
	}
	
	SeedRnd(MilliSecs2())
}

class Chunk {
	obj: int[] = new Array(128)
	x: float
	z: float
	y: float
	Amount: int
	IsSpawnChunk: int
	ChunkPivot: int
	PlatForm: int
}

function CreateChunk(obj: int,x: float,y: float,z: float,isSpawnChunk: int=False) : Chunk {
	let ch: Chunk = new Chunk()
	let i: int
	let chp: ChunkPart
	
	ch.ChunkPivot = CreatePivot()
	ch.x = x
	ch.y = y
	ch.z = z
	PositionEntity(ch.ChunkPivot,ch.x+20.0,ch.y,ch.z+20.0,True)
	
	ch.IsSpawnChunk = isSpawnChunk
	
	if (obj > -1) {
		ch.Amount = GetINIInt("Data/1499chunks.INI","chunk"+obj,"count")
		for (chp of ChunkPart.each) {
			if (chp.ID == obj) {
				for (i of range(ch.Amount + 1)) {
					ch.obj[i] = CopyEntity(chp.obj[i],ch.ChunkPivot)
				}
			}
		}
	}
	
	ch.PlatForm = CopyEntity(PlayerRoom.Objects[0],ch.ChunkPivot)
	EntityType(ch.PlatForm,HIT_MAP)
	EntityPickMode(ch.PlatForm,2)
	
	return ch
}

function UpdateChunks(r: Rooms, ChunkPartAmount: int, spawnNPCs: boolean = True) {
	let ch: Chunk
	let StrTemp: string
	let i: int
	let x: float
	let z: float
	let ch2: Chunk
	let y: float
	let n: NPCs
	let j: int
	let ChunkX: float
	let ChunkZ: float
	let ChunkMaxDistance: float = 3*40
	
	ChunkX = Int(EntityX(Collider)/40)
	ChunkZ = Int(EntityZ(Collider)/40)
	
	y = EntityY(PlayerRoom.obj)
	x = -ChunkMaxDistance+(ChunkX*40)
	z = -ChunkMaxDistance+(ChunkZ*40)
	
	let CurrChunkData: int = 0, MaxChunks: int = GetINIInt("Data/1499chunks.INI","general","count")
	
	do {
		let chunkfound: boolean = False
		for (ch of Chunk.each) {
			if (ch.x == x) {
				if (ch.z == z) {
					chunkfound = True
					break
				}
			}
		}
		if (!chunkfound) {
			CurrChunkData = CHUNKDATA(Abs(((x+32)/40) % 64),Abs(((z+32)/40) % 64))
			ch2 = CreateChunk(CurrChunkData,x,y,z)
			ch2.IsSpawnChunk = False
		}
		x=x+40.0
		if (x > (ChunkMaxDistance+(ChunkX*40))) {
			z=z+40.0
			x = -ChunkMaxDistance+(ChunkX*40)
		}
	} while (!(z > (ChunkMaxDistance+(ChunkZ*40))))
	
	for (ch of Chunk.each) {
		if (!ch.IsSpawnChunk) {
			if (Distance(EntityX(Collider),EntityZ(Collider),EntityX(ch.ChunkPivot),EntityZ(ch.ChunkPivot))>ChunkMaxDistance) {
				FreeEntity(ch.ChunkPivot)
				Delete(ch)
			}
		}
	}
	
	let currNPCNumb: int = 0
	for (n of NPCs.each) {
		if (n.NPCtype == NPCtype1499) {
			currNPCNumb = currNPCNumb + 1
		}
	}
	
	let MaxNPCs: int = 64 //<---- the maximum amount of NPCs in dimension1499
	let e: Events
	for (e of Events.each) {
		if (e.room == PlayerRoom) {
			if (e.room.NPC[0] != null) {
				MaxNPCs = 16
				break
			}
		}
	}
	
	if (currNPCNumb < MaxNPCs) {
		switch (Rand(1,8)) {
			case 1:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(40,80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(40,80))
			case 2:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(40,80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(-40,40))
			case 3:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(40,80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(-40,-80))
			case 4:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(-40,40),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(-40,-80))
			case 5:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(-40,-80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(-40,-80))
			case 6:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(-40,-80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(-40,40))
			case 7:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(-40,-80),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(40,80))
			case 8:
				n.NPCs = CreateNPC(NPCtype1499,EntityX(Collider)+Rnd(-40,40),EntityY(PlayerRoom.obj)+0.5,EntityZ(Collider)+Rnd(40,80))
		}
		if (Rand(2) == 1) {n.State2 = 500*3}
		n.Angle = Rnd(360)
	} else {
		for (n of NPCs.each) {
			if (n.NPCtype == NPCtype1499) {
				if (n.PrevState == 0) {
					if (EntityDistance(n.Collider,Collider)>ChunkMaxDistance || EntityY(n.Collider)<EntityY(PlayerRoom.obj)-5) {
						//This will be updated like this so that new NPCs can spawn for the player
						RemoveNPC(n)
					}
				}
			}
		}
	}
	
}

function HideChunks() {
	let ch: Chunk
	let i
	
	for (ch of Chunk.each) {
		if (!ch.IsSpawnChunk) {
			for (i of range(ch.Amount + 1)) {
				FreeEntity(ch.obj[i])
			}
			FreeEntity(ch.PlatForm)
			FreeEntity(ch.ChunkPivot)
			Delete(ch)
		}
	}
	
}

function DeleteChunks() {
	
	Delete(Chunk.each)
	Delete(ChunkPart.each)
	
}

class Dummy1499 {
	anim: int
	obj: int
}

class ElevatorObj {
	obj: int
	InFacility: int
	door: Doors
}

function AssignElevatorObj(obj: int,door: Doors,in_facility: int) : ElevatorObj {
	let eo: ElevatorObj = new ElevatorObj()
	
	eo.obj = obj
	eo.door = door
	eo.InFacility = in_facility
	
	return eo
}

function DeleteElevatorObjects() {
	
	Delete(ElevatorObj.each)
	
}

function ValidRoom2slCamRoom(r: Rooms) {
	if (r == null) {
		return False
	}
	
	let RN: string = r.RoomTemplate.Name$
	
	if (RN == "room2closets") {return true}
	if (RN == "room1archive") {return true}
	if (RN == "room3z3") {return true}
	if (RN == "room1lifts") {return true}
	if (RN == "checkpoint1") {return true}
	if (RN == "room2nuke") {return true}
	if (RN == "008") {return true}
	if (RN == "room1162") {return true}
	if (RN == "room966") {return true}
	if (RN == "room2ccont") {return true}
	
	return False
	
}

function FindAndDeleteFakeMonitor(r: Rooms,x: float,y: float,z: float,Amount: int) {
	let i: int
	
	for (i of range(Amount + 1)) {
		if (r.Objects[i] != 0) {
			if (EntityX(r.Objects[i],True) == x) {
				if (EntityY(r.Objects[i],True) == y) {
					if (EntityZ(r.Objects[i],True) == z) {
						FreeEntity(r.Objects[i])
						r.Objects[i]=0
						DebugLog("Deleted Fake Monitor: "+i)
						break
					}
				}
			}
		}
	}
}

function AddLightCones(room: Rooms) {
	let i
	
	for (i of range(MaxRoomLights)) {
		if (room.Lights[i] != 0) {
			room.LightCone[i] = CopyEntity(LightConeModel)
			ScaleEntity(room.LightCone[i],0.01,0.01,0.01)
			EntityColor(room.LightCone[i],room.LightR[i],room.LightG[i],room.LightB[i])
			EntityAlpha(room.LightCone[i],0.15)
			EntityBlend(room.LightCone[i],3)
			PositionEntity(room.LightCone[i],EntityX(room.LightSpritesPivot[i],True),EntityY(room.LightSpritesPivot[i],True),EntityZ(room.LightSpritesPivot[i],True),True)
			EntityParent(room.LightCone[i],room.LightSpritesPivot[i])
			
			if (room.LightFlicker[i] > 4) {
				room.LightConeSpark[i] = CreateSprite()
				ScaleSprite(room.LightConeSpark[i],1.0,1.0)
				EntityTexture(room.LightConeSpark[i],ParticleTextures(8))
				SpriteViewMode(room.LightConeSpark[i],2)
				EntityFX(room.LightConeSpark[i],1)
				RotateEntity(room.LightConeSpark[i],-90,0,0)
				EntityBlend(room.LightConeSpark[i],3)
				EntityAlpha(room.LightConeSpark[i],1.0)
				PositionEntity(room.LightConeSpark[i],EntityX(room.LightSpritesPivot[i],True),EntityY(room.LightSpritesPivot[i],True)+0.05,EntityZ(room.LightSpritesPivot[i],True),True)
				EntityParent(room.LightConeSpark[i],room.LightSpritesPivot[i])
			}
		}
	}
}

function CalculateRoomTemplateExtents(r: RoomTemplates) {
	if (r.DisableOverlapCheck) {return}
	
	GetMeshExtents(GetChild(r.obj,2))
	r.MinX = Mesh_MinX
	r.MinY = Mesh_MinY
	r.MinZ = Mesh_MinZ
	r.MaxX = Mesh_MaxX
	r.MaxY = Mesh_MaxY
	r.MaxZ = Mesh_MaxZ
	
	DebugLog("roomtemplateextents: "+r.MinX+", "+r.MinY	+", "+r.MinZ	+", "+r.MaxX	+", "+r.MaxY+", "+r.MaxZ)
}

function CalculateRoomExtents(r: Rooms) {
	if (r.RoomTemplate.DisableOverlapCheck) {return}
	
	//shrink the extents slightly - we don't care if the overlap is smaller than the thickness of the walls
	let shrinkAmount: float = 0.05
	
	//convert from the rooms local space to world space
	TFormVector(r.RoomTemplate.MinX, r.RoomTemplate.MinY, r.RoomTemplate.MinZ, r.obj, 0)
	r.MinX = TFormedX() + shrinkAmount + r.x
	r.MinY = TFormedY() + shrinkAmount
	r.MinZ = TFormedZ() + shrinkAmount + r.z
	
	//convert from the rooms local space to world space
	TFormVector(r.RoomTemplate.MaxX, r.RoomTemplate.MaxY, r.RoomTemplate.MaxZ, r.obj, 0)
	r.MaxX = TFormedX() - shrinkAmount + r.x
	r.MaxY = TFormedY() - shrinkAmount
	r.MaxZ = TFormedZ() - shrinkAmount + r.z
	
	if (r.MinX > r.MaxX) Then
		let tempX: float = r.MaxX
		r.MaxX = r.MinX
		r.MinX = tempX
	EndIf
	if (r.MinZ > r.MaxZ) Then
		let tempZ: float = r.MaxZ
		r.MaxZ = r.MinZ
		r.MinZ = tempZ
	EndIf
	
	DebugLog("roomextents: "+r.MinX+", "+r.MinY	+", "+r.MinZ	+", "+r.MaxX	+", "+r.MaxY+", "+r.MaxZ)
}

function CheckRoomOverlap(r1: Rooms, r2: Rooms) {
	if (r1.MaxX	<= r2.MinX || r1.MaxY <= r2.MinY || r1.MaxZ <= r2.MinZ) {return false}
	if (r1.MinX	>= r2.MaxX || r1.MinY >= r2.MaxY || r1.MinZ >= r2.MaxZ) {return false}
	
	return True
}

function PreventRoomOverlap(r: Rooms) {
	if (r.RoomTemplate.DisableOverlapCheck) {return}
	
	let r2: Rooms
	let r3: Rooms
	
	let isIntersecting: boolean = False
	
	//Just skip it when it would try to check for the checkpoints
	if (r.RoomTemplate.Name == "checkpoint1" || r.RoomTemplate.Name == "checkpoint2" || r.RoomTemplate.Name == "start") {return true}
	
	//First, check if the room is actually intersecting at all
	for (r2 of Rooms.each) {
		if (r2 != r && (!r2.RoomTemplate.DisableOverlapCheck)) {
			if (CheckRoomOverlap(r, r2)) {
				isIntersecting = True
				Exit
			}
		}
	}
	
	//if not, then simply return it as True
	if (!isIntersecting) {
		return True
	}
	
	//Room is interseting: First, check if the given room is a ROOM2, so we could potentially just turn it by 180 degrees
	isIntersecting = False
	let x: int = r.x/8.0
	let y: int = r.z/8.0
	if (r.RoomTemplate.Shape == ROOM2) {
		//Room is a ROOM2, let's check if turning it 180 degrees fixes the overlapping issue
		r.angle = r.angle + 180
		RotateEntity(r.obj,0,r.angle,0)
		CalculateRoomExtents(r)
		
		for (r2 of Rooms.each) {
			if (r2 != r && (!r2.RoomTemplate.DisableOverlapCheck)) {
				if (CheckRoomOverlap(r, r2)) {
					//didn't work -> rotate the room back and move to the next step
					isIntersecting = True
					r.angle = r.angle - 180
					RotateEntity(r.obj,0,r.angle,0)
					CalculateRoomExtents(r)
					break
				}
			}
		}
	} else {
		isIntersecting = True
	}
	
	//room is ROOM2 and was able to be turned by 180 degrees
	if (!isIntersecting) {
		DebugLog("ROOM2 turning succesful! "+r.RoomTemplate.Name)
		return True
	}
	
	//Room is either not a ROOM2 or the ROOM2 is still intersecting, now trying to swap the room with another of the same type
	isIntersecting = True
	let temp2,x2: int,y2: int,rot: int,rot2: int
	for (r2 of Rooms.each) {
		if (r2 != r && (!r2.RoomTemplate.DisableOverlapCheck)) {
			if (r.RoomTemplate.Shape == r2.RoomTemplate.Shape && r.zone == r2.zone && (r2.RoomTemplate.Name != "checkpoint1" && r2.RoomTemplate.Name != "checkpoint2" && r2.RoomTemplate.Name != "start")) {
				x = r.x/8.0
				y = r.z/8.0
				rot = r.angle
				
				x2 = r2.x/8.0
				y2 = r2.z/8.0
				rot2 = r2.angle
				
				isIntersecting = False
				
				r.x = x2*8.0
				r.z = y2*8.0
				r.angle = rot2
				PositionEntity(r.obj,r.x,r.y,r.z)
				RotateEntity(r.obj,0,r.angle,0)
				CalculateRoomExtents(r)
				
				r2.x = x*8.0
				r2.z = y*8.0
				r2.angle = rot
				PositionEntity(r2.obj,r2.x,r2.y,r2.z)
				RotateEntity(r2.obj,0,r2.angle,0)
				CalculateRoomExtents(r2)
				
				//make sure neither room overlaps with anything after the swap
				for (r3 of Rooms.each) {
					if (!r3.RoomTemplate.DisableOverlapCheck) {
						if (r3 != r) {
							if (CheckRoomOverlap(r, r3)) {
								isIntersecting = True
								break
							}
						}
						if (r3 != r2) {
							if (CheckRoomOverlap(r2, r3)) {
								isIntersecting = True
								break
							}
						}	
					}
				}
				
				//Either the original room or the "reposition" room is intersecting, reset the position of each room to their original one
				if (isIntersecting) {
					r.x = x*8.0
					r.z = y*8.0
					r.angle = rot
					PositionEntity(r.obj,r.x,r.y,r.z)
					RotateEntity(r.obj,0,r.angle,0)
					CalculateRoomExtents(r)
					
					r2.x = x2*8.0
					r2.z = y2*8.0
					r2.angle = rot2
					PositionEntity(r2.obj,r2.x,r2.y,r2.z)
					RotateEntity(r2.obj,0,r2.angle,0)
					CalculateRoomExtents(r2)
					
					isIntersecting = False
				}
			}
		}
	}
	
	//room was able to the placed in a different spot
	if (!isIntersecting) {
		DebugLog("Room re-placing successful! "+r.RoomTemplate.Name)
		return True
	}
	
	DebugLog("Couldn't fix overlap issue for room "+r.RoomTemplate.Name)
	return False
}