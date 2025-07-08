import { range } from "./Helper/bbhelper"

//[Block]
export var Curr173: NPCs
export var Curr106: NPCs
export var Curr096: NPCs
export var Curr5131: NPCs
export const NPCtype173: int = 1
export const NPCtypeOldMan: int = 2
export const NPCtypeGuard: int = 3
export const NPCtypeD: int = 4
export const NPCtype372: int = 6
export const NPCtypeApache: int = 7
export const NPCtypeMTF: int = 8
export const NPCtype096 = 9
export const NPCtype049: int = 10
export const NPCtypeZombie: int = 11
export const NPCtype5131: int = 12
export const NPCtypeTentacle: int = 13
export const NPCtype860: int = 14
export const NPCtype939: int = 15
export const NPCtype066: int = 16
export const NPCtypePdPlane: int = 17
export const NPCtype966: int = 18
export const NPCtype1048a = 19
export const NPCtype1499: int = 20
export const NPCtype008: int = 21
export const NPCtypeClerk: int = 22
//[End Block]

enum PathStatus {
	NotSearched,
	Found,
	Unreachable
}

class NPCs {
	obj: int
	obj2: int
	obj3: int
	obj4: int
	Collider: int
	NPCtype: int
	ID: int
	DropSpeed: float
	Gravity: int
	State: float
	State2: float
	State3: float
	PrevState: int
	MakingNoise: int
	
	Frame: float
	
	Angle: float
	Sound: int
	SoundChn: int
	SoundTimer: float
	Sound2: int
	SoundChn2: int
	
	Speed: float
	CurrSpeed: float
	
	texture$
	
	Idle: float
	
	Reload: float
	
	LastSeen: int
	LastDist: float
	
	PrevX: float
	PrevY: float
	PrevZ: float
	
	Target: NPCs
	TargetID: int
	EnemyX: float
	EnemyY: float
	EnemyZ: float
	
	Path: WayPoints[] = new Array(20)
	pathstatus: PathStatus
	PathTimer: float
	PathLocation: int
	
	NVX: float
	NVY: float
	NVZ: float
	NVName: string
	
	GravityMult: float = 1.0
	MaxGravity: float = 0.2
	
	MTFVariant: int
	MTFLeader: NPCs
	IsDead: int
	BlinkTimer: float = 1.0
	IgnorePlayer: int
	
	ManipulateBone: int
	ManipulationType: int
	BoneToManipulate$
	BonePitch: float
	BoneYaw: float
	BoneRoll: float
	NPCNameInSection$
	InFacility: boolean = True
	CanUseElevator: boolean = False
	CurrElevator: ElevatorObj
	HP: int
	PathX: float
	PathZ: float
	Model$
	ModelScaleX: float
	ModelScaleY: float
	ModelScaleZ: float
	HideFromNVG
	TextureID: int = -1
	CollRadius: float
	IdleTimer: float
	SoundChn_IsStream: int
	SoundChn2_IsStream: int
	FallingPickDistance: float
}

function CreateNPC(NPCtype: int, x: float, y: float, z: float) : NPCs {
	let n: NPCs = new NPCs()
	let n2: NPCs
	let temp: float
	let i: int
	let diff1
	let bump1
	let spec1
	let sf
	let b
	let t1
	
	n.NPCtype = NPCtype
	n.GravityMult = 1.0
	n.MaxGravity = 0.2
	n.CollRadius = 0.2
	n.FallingPickDistance = 10
	switch (NPCtype) {
		case NPCtype173:
			//[Block]
			n.NVName = "SCP-173"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.23, 0.32)
			EntityType(n.Collider, HIT_PLAYER)
			n.Gravity = True
			
			n.obj = LoadMesh_Strict("GFX/npcs/173_2.b3d")
			
			//On Halloween set jack-o-latern texture.
			if (Left(CurrentDate(), 7) == "31 Oct ") {
				HalloweenTex = True
				let texFestive = LoadTexture_Strict("GFX/npcs/173h.pt", 1)
				EntityTexture(n.obj, texFestive, 0, 0)
				FreeTexture(texFestive)
			}
			
			temp = (GetINIFloat("DATA/NPCs.ini", "SCP-173", "scale") / MeshDepth(n.obj))			
			ScaleEntity(n.obj, temp,temp,temp)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-173", "speed") / 100.0)
			
			n.obj2 = LoadMesh_Strict("GFX/173box.b3d")
			ScaleEntity(n.obj2, RoomScale, RoomScale, RoomScale)
			HideEntity(n.obj2)
			
			n.CollRadius = 0.32
			//[End Block]
		case NPCtypeOldMan:
			//[Block]
			n.NVName = "SCP-106"
			n.Collider = CreatePivot()
			n.GravityMult = 0.0
			n.MaxGravity = 0.0
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = LoadAnimMesh_Strict("GFX/npcs/106_2.b3d")
			
			temp = (GetINIFloat("DATA/NPCs.ini", "SCP-106", "scale") / 2.2)		
			ScaleEntity(n.obj, temp, temp, temp)
			
			let OldManEyes: int = LoadTexture_Strict("GFX/npcs/oldmaneyes.jpg")
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-106", "speed") / 100.0)
			
			n.obj2 = CreateSprite()
			ScaleSprite(n.obj2, 0.03, 0.03)
			EntityTexture(n.obj2, OldManEyes)
			EntityBlend (n.obj2, 3)
			EntityFX(n.obj2, 1 + 8)
			SpriteViewMode(n.obj2, 2)
			
			FreeTexture(OldManEyes)
			//[End Block]
		case NPCtypeGuard:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = CopyEntity(GuardObj)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "Guard", "speed") / 100.0)
			temp = (GetINIFloat("DATA/NPCs.ini", "Guard", "scale") / 2.5)
			
			ScaleEntity(n.obj, temp, temp, temp)
			
			MeshCullBox (n.obj, -MeshWidth(GuardObj), -MeshHeight(GuardObj), -MeshDepth(GuardObj), MeshWidth(GuardObj)*2, MeshHeight(GuardObj)*2, MeshDepth(GuardObj)*2)
			//[End Block]
		case NPCtypeMTF:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = CopyEntity(MTFObj)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "MTF", "speed") / 100.0)
			
			temp = (GetINIFloat("DATA/NPCs.ini", "MTF", "scale") / 2.5)
			
			ScaleEntity(n.obj, temp, temp, temp)
			
			MeshCullBox (n.obj, -MeshWidth(MTFObj), -MeshHeight(MTFObj), -MeshDepth(MTFObj), MeshWidth(MTFObj)*2, MeshHeight(MTFObj)*2, MeshDepth(MTFObj)*2) 
			
			if (MTFSFX(0) == 0) {
				MTFSFX(0)=LoadSound_Strict("SFX/Character/MTF/ClassD1.ogg")
				MTFSFX(1)=LoadSound_Strict("SFX/Character/MTF/ClassD2.ogg")
				MTFSFX(2)=LoadSound_Strict("SFX/Character/MTF/ClassD3.ogg")			
				MTFSFX(3)=LoadSound_Strict("SFX/Character/MTF/ClassD4.ogg")
				MTFSFX(5)=LoadSound_Strict("SFX/Character/MTF/Beep.ogg")
				MTFSFX(6)=LoadSound_Strict("SFX/Character/MTF/Breath.ogg")
			}
			if (MTFrooms[6] == Null) {
				for (r of Rooms.each) {
					switch (Lower(r.RoomTemplate.Name)) {
						case "room106":
							MTFrooms[0]=r
						case "roompj":
							MTFrooms[1]=r	
						case "room079":
							MTFrooms[2]=r	
						case "room2poffices":
							MTFrooms[3]=r	
						case "914":
							MTFrooms[4]=r	
						case "coffin":
							MTFrooms[5]=r	
						case "start":
							MTFrooms[6]=r
					}
				}
			}
			//[End Block]
		case NPCtypeD:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.32)
			EntityType(n.Collider, HIT_PLAYER)
			
			n.obj = CopyEntity(ClassDObj)
			
			temp = 0.5 / MeshWidth(n.obj)
			ScaleEntity(n.obj, temp, temp, temp)
			
			n.Speed = 2.0 / 100
			
			MeshCullBox (n.obj, -MeshWidth(ClassDObj), -MeshHeight(ClassDObj), -MeshDepth(ClassDObj), MeshWidth(ClassDObj)*2, MeshHeight(ClassDObj)*2, MeshDepth(ClassDObj)*2)
			
			n.CollRadius = 0.32
			//[End Block]
		case NPCtype372:
			//[Block]
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			n.obj = LoadAnimMesh_Strict("GFX/npcs/372.b3d")
			
			temp = 0.35 / MeshWidth(n.obj)
			ScaleEntity(n.obj, temp, temp, temp)
			//[End Block]
		case NPCtype5131:
			//[Block]
			n.NVName = "SCP-513-1"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			n.obj = LoadAnimMesh_Strict("GFX/npcs/bll.b3d")
			
			n.obj2 = CopyEntity (n.obj)
			EntityAlpha(n.obj2, 0.6)
			
			temp = 1.8 / MeshWidth(n.obj)
			ScaleEntity(n.obj, temp, temp, temp)
			ScaleEntity(n.obj2, temp, temp, temp)
			//[End Block]
		case NPCtype096:
			//[Block]
			n.NVName = "SCP-096"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.26)
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = LoadAnimMesh_Strict("GFX/npcs/scp096.b3d")
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-096", "speed") / 100.0)
			
			temp = (GetINIFloat("DATA/NPCs.ini", "SCP-096", "scale") / 3.0)
			ScaleEntity(n.obj, temp, temp, temp	)
			
			MeshCullBox (n.obj, -MeshWidth(n.obj)*2, -MeshHeight(n.obj)*2, -MeshDepth(n.obj)*2, MeshWidth(n.obj)*2, MeshHeight(n.obj)*4, MeshDepth(n.obj)*4)
			
			n.CollRadius = 0.26
			//[End Block]
		case NPCtype049:
			//[Block]
			n.NVName = "SCP-049"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = CopyEntity(NPC049OBJ)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-049", "speed") / 100.0)
			
			temp = GetINIFloat("DATA/NPCs.ini", "SCP-049", "scale")
			ScaleEntity(n.obj, temp, temp, temp	)
			
			n.Sound = LoadSound_Strict("SFX/Horror/Horror12.ogg")
			
			if (HorrorSFX(13) == 0) {
				HorrorSFX(13)=LoadSound_Strict("SFX/Horror/Horror13.ogg")
			}
			
			n.CanUseElevator = True
			//[End Block]
		case NPCtypeZombie:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
						
			if (n.obj == 0) {
				n.obj = CopyEntity(NPC0492OBJ)
				
				temp = (GetINIFloat("DATA/NPCs.ini", "SCP-049-2", "scale") / 2.5)
				ScaleEntity(n.obj, temp, temp, temp)
				
				MeshCullBox (n.obj, -MeshWidth(n.obj), -MeshHeight(n.obj), -MeshDepth(n.obj), MeshWidth(n.obj)*2, MeshHeight(n.obj)*2, MeshDepth(n.obj)*2)
			}
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-049-2", "speed") / 100.0)
			
			SetAnimTime(n.obj, 107)
			
			n.Sound = LoadSound_Strict("SFX/SCP/049/0492Breath.ogg")
			
			n.HP = 100
			//[End Block]
		case NPCtypeApache:
			//[Block]
			n.NVName = "Human"
			n.GravityMult = 0.0
			n.MaxGravity = 0.0
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			n.obj = CopyEntity(ApacheObj)
			
			n.obj2 = CopyEntity(ApacheRotorObj)
			EntityParent(n.obj2,n.obj)
			
			for (i of range(-1, 2, 2)) {
				let rotor2 = CopyEntity(n.obj2,n.obj2)
				RotateEntity(rotor2,0,4.0*i,0)
				EntityAlpha(rotor2, 0.5)
			}
			
			n.obj3 = LoadAnimMesh_Strict("GFX/apacherotor2.b3d",n.obj)
			PositionEntity(n.obj3, 0.0, 2.15, -5.48)
			
			EntityType(n.Collider, HIT_APACHE)
			EntityRadius(n.Collider, 3.0)
			
			for (i of range(-1, 2, 2)) {
				let Light1 = CreateLight(2,n.obj)
				LightRange(Light1,2.0)
				LightColor(Light1,255,255,255)
				PositionEntity(Light1, 1.65*i, 1.17, -0.25)
				
				let lightsprite = CreateSprite(n.obj)
				PositionEntity(lightsprite, 1.65*i, 1.17, 0, -0.25)
				ScaleSprite(lightsprite, 0.13, 0.13)
				EntityTexture(lightsprite, LightSpriteTex(0))
				EntityBlend (lightsprite, 3)
				EntityFX(lightsprite, 1+8)
			}
			
			temp = 0.6
			ScaleEntity(n.obj, temp, temp, temp)
			//[End Block]
		case NPCtypeTentacle:
			//[Block]
			n.NVName = "Unidentified"
			
			n.Collider = CreatePivot()
			
			for (n2 of NPCs.each) {
				if (n.NPCtype == n2.NPCtype && n != n2) {
					n.obj = CopyEntity (n2.obj)
					break
				}
			}
			
			if (n.obj == 0) {
				n.obj = LoadAnimMesh_Strict("GFX/NPCs/035tentacle.b3d")
				ScaleEntity(n.obj, 0.065,0.065,0.065)
			}
			
			SetAnimTime(n.obj, 283)
			//[End Block]
		case NPCtype860:
			//[Block]
			n.NVName = "Unidentified"
			
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.25)
			EntityType(n.Collider, HIT_PLAYER)
			n.obj = LoadAnimMesh_Strict("GFX/npcs/forestmonster.b3d")
			
			EntityFX(n.obj, 1)
			
			tex = LoadTexture_Strict("GFX/npcs/860_eyes.png",1+2)
			
			n.obj2 = CreateSprite()
			ScaleSprite(n.obj2, 0.1, 0.1)
			EntityTexture(n.obj2, tex)
			FreeTexture(tex)
			
			EntityFX(n.obj2, 1 + 8)
			EntityBlend(n.obj2, BLEND_ADD)
			SpriteViewMode(n.obj2, 2)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "forestmonster", "speed") / 100.0)
			
			temp = (GetINIFloat("DATA/NPCs.ini", "forestmonster", "scale") / 20.0)
			ScaleEntity(n.obj, temp, temp, temp	)
			
			MeshCullBox (n.obj, -MeshWidth(n.obj)*2, -MeshHeight(n.obj)*2, -MeshDepth(n.obj)*2, MeshWidth(n.obj)*2, MeshHeight(n.obj)*4, MeshDepth(n.obj)*4)
			
			n.CollRadius = 0.25
			//[End Block]
		case NPCtype939:
			let amount939: int = 0
			for (n2 of NPCs.each) {
				if ((n.NPCtype == n2.NPCtype) && (n != n2)) {
					amount939 += 1
				}
			}
			if (amount939 == 0) {i = 53}
			if (amount939 == 1) {i = 89}
			if (amount939 == 2) {i = 96}
			n.NVName = "SCP-939-"+i
			
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.3)
			EntityType(n.Collider, HIT_PLAYER)
			for (n2 of NPCs.each) {
				if (n.NPCtype == n2.NPCtype && n != n2) {
					n.obj = CopyEntity (n2.obj)
					break
				}
			}
			
			if (n.obj == 0) {
				n.obj = LoadAnimMesh_Strict("GFX/NPCs/scp-939.b3d")
								
				temp = GetINIFloat("DATA/NPCs.ini", "SCP-939", "scale")/2.5
				ScaleEntity(n.obj, temp, temp, temp)
			}
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-939", "speed") / 100.0)
			
			n.CollRadius = 0.3
			//[End Block]
		case NPCtype066:
			//[Block]
			n.NVName = "SCP-066"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			
			n.obj = LoadAnimMesh_Strict("GFX/NPCs/scp-066.b3d")
			temp = GetINIFloat("DATA/NPCs.ini", "SCP-066", "scale")/2.5
			ScaleEntity(n.obj, temp, temp, temp		)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-066", "speed") / 100.0)
			//[End Block]
		case NPCtype966:
			//[Block]
			i = 1
			for (n2 of NPCs.each) {
				if ((n.NPCtype == n2.NPCtype) && (n != n2)) {i=i+1}
			}
			n.NVName = "SCP-966-"+i
			
			n.Collider = CreatePivot()
			EntityRadius(n.Collider,0.2)
			
			for (n2 of NPCs.each) {
				if ((n.NPCtype == n2.NPCtype) && (n != n2)) {
					n.obj = CopyEntity (n2.obj)
					break
				}
			}
			
			if (n.obj == 0) { 
				n.obj = LoadAnimMesh_Strict("GFX/npcs/scp-966.b3d")
			}
			
			EntityFX(n.obj,1)
			
			temp = GetINIFloat("DATA/NPCs.ini", "SCP-966", "scale")/40.0
			ScaleEntity(n.obj, temp, temp, temp		)
			
			
			SetAnimTime(n.obj,15.0)
			
			EntityType(n.Collider,HIT_PLAYER)
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-966", "speed") / 100.0)
			//[End Block]
		case NPCtype1048a:
			//[Block]
			n.NVName = "SCP-1048-A"
			n.obj =	LoadAnimMesh_Strict("GFX/npcs/scp-1048a.b3d")
			ScaleEntity(n.obj, 0.05,0.05,0.05)
			SetAnimTime(n.obj, 2)
			
			n.Sound = LoadSound_Strict("SFX/SCP/1048A/Shriek.ogg")
			n.Sound2 = LoadSound_Strict("SFX/SCP/1048A/Growth.ogg")
			//[End Block]
		case NPCtype1499:
			//[Block]
			n.NVName = "Unidentified"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			for (n2 of NPCs.each) {
				if ((n.NPCtype == n2.NPCtype) && (n != n2)) {
					n.obj = CopyEntity (n2.obj)
					break
				}
			}
			
			if (n.obj == 0) {
				n.obj = LoadAnimMesh_Strict("GFX/npcs/1499-1.b3d")
			}
			
			n.Speed = (GetINIFloat("DATA/NPCs.ini", "SCP-1499-1", "speed") / 100.0) * Rnd(0.9,1.1)
			temp = (GetINIFloat("DATA/NPCs.ini", "SCP-1499-1", "scale") / 4.0) * Rnd(0.8,1.0)
			
			ScaleEntity(n.obj, temp, temp, temp)
			
			EntityFX(n.obj,1)
			
			EntityAutoFade(n.obj,HideDistance*2.5,HideDistance*2.95)
			//[End Block]
		case NPCtype008:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.2)
			EntityType(n.Collider, HIT_PLAYER)
			
			n.obj = LoadAnimMesh_Strict("GFX/npcs/zombiesurgeon.b3d")
			
			temp = 0.5 / MeshWidth(n.obj)
			ScaleEntity(n.obj, temp, temp, temp)
			
			n.Speed = 2.0 / 100
			
			MeshCullBox (n.obj, -MeshWidth(n.obj), -MeshHeight(n.obj), -MeshDepth(n.obj), MeshWidth(n.obj)*2, MeshHeight(n.obj)*2, MeshDepth(n.obj)*2)
			
			SetNPCFrame(n,11)
			
			n.Sound = LoadSound_Strict("SFX/SCP/049/0492Breath.ogg")
			
			n.HP = 120
			//[End Block]
		case NPCtypeClerk:
			//[Block]
			n.NVName = "Human"
			n.Collider = CreatePivot()
			EntityRadius(n.Collider, 0.32)
			EntityType(n.Collider, HIT_PLAYER)
			
			n.obj = CopyEntity(ClerkOBJ)
			
			temp = 0.5 / MeshWidth(n.obj)
			ScaleEntity(n.obj, temp, temp, temp)
			
			n.Speed = 2.0 / 100
			
			MeshCullBox (n.obj, -MeshWidth(ClerkOBJ), -MeshHeight(ClerkOBJ), -MeshDepth(ClerkOBJ), MeshWidth(ClerkOBJ)*2, MeshHeight(ClerkOBJ)*2, MeshDepth(ClerkOBJ)*2)
			
			n.CollRadius = 0.32
			//[End Block]
	}
	
	PositionEntity(n.Collider, x, y, z, True)
	PositionEntity(n.obj, x, y, z, True)
	
	ResetEntity(n.Collider)
	
	n.ID = 0
	n.ID = FindFreeNPCID()
	
	DebugLog ("Created NPC " + n.NVName + " (ID: " + n.ID + ")")
	
	NPCSpeedChange(n)
	
	return n
}

function RemoveNPC(n: NPCs) {
	
	if (n == Null) {return}
	
	if (n.obj2 != 0) {
		FreeEntity(n.obj2)
		n.obj2 = 0
	}
	if (n.obj3 != 0) {
		FreeEntity(n.obj3)
		n.obj3 = 0
	}
	if (n.obj4 != 0) {
		FreeEntity(n.obj4)
		n.obj4 = 0
	}
	
	if (!n.SoundChn_IsStream) {
		if (n.SoundChn != 0 && ChannelPlaying(n.SoundChn)) {
			StopChannel(n.SoundChn)
		}
	} else {
		if (n.SoundChn != 0) {
			StopStream_Strict(n.SoundChn)
		}
	}
	
	if (!n.SoundChn2_IsStream) {
		if (n.SoundChn2 != 0 && ChannelPlaying(n.SoundChn2)) {
			StopChannel(n.SoundChn2)
		}
	} else {
		if (n.SoundChn2 != 0) {
			StopStream_Strict(n.SoundChn2)
		}
	}
	
	if (n.Sound!=0) {FreeSound_Strict(n.Sound)}
	if (n.Sound2!=0) {FreeSound_Strict(n.Sound2)}
	
	FreeEntity(n.obj)
	n.obj = 0
	FreeEntity(n.Collider)
	n.Collider = 0	
	
	Delete(n)
}


function UpdateNPCs() {
	CatchErrors("Uncaught (UpdateNPCs)")
	let n: NPCs
	let n2: NPCs
	let d: Doors
	let de: Decals
	let r: Rooms
	let eo: ElevatorObj
	let eo2: ElevatorObj
	let i: int
	let dist: float
	let dist2: float
	let angle: float
	let x: float
	let y: float
	let z: float
	let prevFrame: float
	let PlayerSeeAble: int
	let RN: string
	
	let target
	
	for (n of NPCs.each) {
		//A variable to determine if the NPC is in the facility or not
		n.InFacility = CheckForNPCInFacility(n)
		
		switch (n.NPCtype) {
			case NPCtype173:
				//[Block]
				
				if (Curr173.Idle != 3) {
					dist = EntityDistance(n.Collider, Collider)		
					
					n.State3 = 1
					
					if (n.Idle < 2) {
						if (n.IdleTimer > 0.1) {
							n.Idle = 1
							n.IdleTimer = Max(n.IdleTimer-FPSfactor,0.1)
						} else if (n.IdleTimer == 0.1) {
							n.Idle = 0
							n.IdleTimer = 0
						}
						
						PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.32, EntityZ(n.Collider))
						RotateEntity (n.obj, 0, EntityYaw(n.Collider)-180, 0)
						
						if (!n.Idle) {
							let temp: boolean = False
							let move: boolean = True
							if (dist < 15) {
								if (dist < 10.0) {
									if (EntityVisible(n.Collider, Collider)) {
										temp = True
										n.EnemyX = EntityX(Collider, True)
										n.EnemyY = EntityY(Collider, True)
										n.EnemyZ = EntityZ(Collider, True)
									}
								}										
								
								let SoundVol: float = Max(Min((Distance(EntityX(n.Collider), EntityZ(n.Collider), n.PrevX, n.PrevZ) * 2.5), 1.0), 0.0)
								n.SoundChn = LoopSound2(StoneDragSFX, n.SoundChn, Camera, n.Collider, 10.0, n.State)
								
								n.PrevX = EntityX(n.Collider)
								n.PrevZ = EntityZ(n.Collider)				
								
								if ((BlinkTimer < -16 || BlinkTimer > -6) && !IsNVGBlinking) {
									if (EntityInView(n.obj, Camera)) {
										move = False
									}
								}
							}
							
							if (NoTarget) {
								move = True
							}
							
							//player is looking at it -> doesn't move
							if (!move) {
								BlurVolume = Max(Max(Min((4.0 - dist) / 6.0, 0.9), 0.1), BlurVolume)
								CurrCameraZoom = Max(CurrCameraZoom, (Sin(Float(MilliSecs2())/20.0)+1.0)*15.0*Max((3.5-dist)/3.5,0.0))								
								
								if (dist < 3.5 && MilliSecs2() - n.LastSeen > 60000 && temp) {
									PlaySound_Strict(HorrorSFX(Rand(3,4)))
									
									n.LastSeen = MilliSecs2()
								}
								
								if (dist < 1.5 && Rand(700) == 1) {
									PlaySound2(Scp173SFX(Rand(0, 2)), Camera, n.obj)
								}
								
								if (dist < 1.5 && n.LastDist > 2.0 && temp) {
									CurrCameraZoom = 40.0
									HeartBeatRate = Max(HeartBeatRate, 140)
									HeartBeatVolume = 0.5
									
									switch (Rand(5)) {
										case 1:
											PlaySound_Strict(HorrorSFX(1))
										case 2:
											PlaySound_Strict(HorrorSFX(2))
										case 3:
											PlaySound_Strict(HorrorSFX(9))
										case 4:
											PlaySound_Strict(HorrorSFX(10))
										case 5:
											PlaySound_Strict(HorrorSFX(14))
									}
								}									
									
								n.LastDist = dist
								
								n.State = Max(0, n.State - FPSfactor / 20)
							} else {
								//more than 6 room lengths away from the player -> teleport to a room closer to the player
								if (dist > 50) {
									if (Rand(70)=1) {
										if (PlayerRoom.RoomTemplate.Name != "exit1" && PlayerRoom.RoomTemplate.Name != "gatea" && PlayerRoom.RoomTemplate.Name != "pocketdimension") {
											for (w of WayPoints.each) {
												if (w.door=Null && Rand(5) == 1) {
													x = Abs(EntityX(Collider)-EntityX(w.obj,True))
													if (x < 25.0 && x > 15.0) {
														z = Abs(EntityZ(Collider)-EntityZ(w.obj,True))
														if (z < 25 && z > 15.0) {
															DebugLog("MOVING 173 TO "+w.room.roomtemplate.name)
															PositionEntity(n.Collider, EntityX(w.obj,True), EntityY(w.obj,True)+0.25,EntityZ(w.obj,True))
															ResetEntity(n.Collider)
															break
														}
													}
														
												}
											}
										}
									}
								} else if (dist > HideDistance*0.8) { //3-6 rooms away from the player -> move randomly from waypoint to another
									if (Rand(70) == 1) {
										TeleportCloser(n)
									}
								} else { //less than 3 rooms away -> actively move towards the player
									n.State = CurveValue(SoundVol, n.State, 3)
									
									//try to open doors
									if (Rand(20) == 1) {
										for (d of Doors.each) {
											if (!d.locked && !d.open && d.Code == "" && d.KeyCard == 0) {
												for (i of range(2)) {
													if (d.buttons[i] != 0) {
														if (Abs(EntityX(n.Collider) - EntityX(d.buttons[i])) < 0.5) {
															if (Abs(EntityZ(n.Collider) - EntityZ(d.buttons[i])) < 0.5) {
																if (d.openstate >= 180 || d.openstate <= 0) {
																	pvt = CreatePivot()
																	PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider) + 0.5, EntityZ(n.Collider))
																	PointEntity(pvt, d.buttons[i])
																	MoveEntity(pvt, 0, 0, n.Speed * 0.6)
																	
																	if (EntityPick(pvt, 0.5) == d.buttons[i]) {
																		PlaySound_Strict (LoadTempSound("SFX/Door/DoorOpen173.ogg"))
																		UseDoor(d,False)
																	}
																	
																	FreeEntity(pvt)
																}
															}
														}
													}
												}
											}
										}
									}
									
									if (NoTarget) {
										temp = False
										n.EnemyX = 0
										n.EnemyY = 0
										n.EnemyZ = 0
									}
									
									//player is not looking and is visible from 173's position -> attack
									if (temp) {
										if (dist < 0.65) {
											if (KillTimer >= 0 && !GodMode) {
												
												switch (PlayerRoom.RoomTemplate.Name) {
													case "lockroom", "room2closets", "coffin":
														DeathMSG = "Subject D-9341. Cause of death: Fatal cervical fracture. The surveillance tapes confirm that the subject was killed by SCP-173."	
													case "173":
														DeathMSG = "Subject D-9341. Cause of death: Fatal cervical fracture. According to Security Chief Franklin who was present at SCP-173's containment "
														DeathMSG = DeathMSG + "chamber during the breach, the subject was killed by SCP-173 as soon as the disruptions in the electrical network started."
													case "room2doors":
														DeathMSG = Chr(34)+"If I'm not mistaken, one of the main purposes of these rooms was to stop SCP-173 from moving further in the event of a containment breach. "
														DeathMSG = DeathMSG + "So, who's brilliant idea was it to put A GODDAMN MAN-SIZED VENTILATION DUCT in there?"+Chr(34)
													default:
														DeathMSG = "Subject D-9341. Cause of death: Fatal cervical fracture. Assumed to be attacked by SCP-173."
												}
												
												if (!GodMode) {
													n.Idle = True
												}
												PlaySound_Strict(NeckSnapSFX(Rand(0,2)))
												if (Rand(2) == 1) {
													TurnEntity(Camera, 0, Rand(80,100), 0)
												} else {
													TurnEntity(Camera, 0, Rand(-100,-80), 0)
												}
												Kill()
												
											}
										} else {
											PointEntity(n.Collider, Collider)
											RotateEntity(n.Collider, 0, EntityYaw(n.Collider), EntityRoll(n.Collider))
											TranslateEntity(n.Collider,Cos(EntityYaw(n.Collider)+90.0)*n.Speed*FPSfactor,0.0,Sin(EntityYaw(n.Collider)+90.0)*n.Speed*FPSfactor)
										}
										
									} else { //player is not visible -> move to the location where he was last seen							
										if (n.EnemyX != 0) {
											if (Distance(EntityX(n.Collider), EntityZ(n.Collider), n.EnemyX, n.EnemyZ) > 0.5) {
												AlignToVector(n.Collider, n.EnemyX-EntityX(n.Collider), 0, n.EnemyZ-EntityZ(n.Collider), 3)
												MoveEntity(n.Collider, 0, 0, n.Speed * FPSfactor)
												if (Rand(500) == 1) {
													n.EnemyX = 0
													n.EnemyY = 0
													n.EnemyZ = 0
												}
											} else {
												n.EnemyX = 0
												n.EnemyY = 0
												n.EnemyZ = 0
											}
										} else {
											if (Rand(400) == 1) {
												RotateEntity (n.Collider, 0, Rnd(360), 10)
											}
											TranslateEntity(n.Collider,Cos(EntityYaw(n.Collider)+90.0)*n.Speed*FPSfactor,0.0,Sin(EntityYaw(n.Collider)+90.0)*n.Speed*FPSfactor)
											
										}
									}
									
								} // less than 2 rooms away from the player
								
							}
							
						} //idle = false
						
						PositionEntity(n.Collider, EntityX(n.Collider), Min(EntityY(n.Collider),0.35), EntityZ(n.Collider))
						
					} else {
						
						if (n.Target != Null) {
							let tmp: boolean = false
							if (dist > HideDistance*0.7) {
								if (!EntityVisible(n.obj,Collider)) {
									tmp = True
								}
							}
							if (!tmp) {
								PointEntity(n.obj, n.Target.Collider)
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),10.0), 0, True)
								dist = EntityDistance(n.Collider, n.Target.Collider)
								
								MoveEntity(n.Collider, 0, 0, 0.016*FPSfactor*Max(Min((dist*2-1.0)*0.5,1.0),-0.5))
								n.GravityMult = 1.0
							} else {
								PositionEntity(n.Collider,EntityX(n.Target.Collider),EntityY(n.Target.Collider)+0.3,EntityZ(n.Target.Collider))
								ResetEntity(n.Collider)
								n.DropSpeed = 0
								n.GravityMult = 0.0
							}
							
						}
						
						PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) + 0.05 + Sin(MilliSecs2()*0.08)*0.02, EntityZ(n.Collider))
						RotateEntity (n.obj, 0, EntityYaw(n.Collider)-180, 0)
						
						ShowEntity(n.obj2)
						
						PositionEntity(n.obj2, EntityX(n.Collider), EntityY(n.Collider) - 0.05 + Sin(MilliSecs2()*0.08)*0.02, EntityZ(n.Collider))
						RotateEntity (n.obj2, 0, EntityYaw(n.Collider)-180, 0)
					}
				}
				
				//[End block]
			case NPCtypeOldMan: //------------------------------------------------------------------------------------------------------------------
				//[Block]
				if (Contained106) {
					n.Idle = True
					HideEntity(n.obj)
					HideEntity(n.obj2)
					PositionEntity(n.obj, 0,500.0,0, True)
				} else {
					
					dist = EntityDistance(n.Collider, Collider)
					
					let spawn106: boolean = True
					//checking if 106 is allowed to spawn
					if (PlayerRoom.RoomTemplate.Name == "dimension1499") {spawn106 = False}
					for (e of Events.each) {
						if (e.EventName == "room860") {
							if (e.EventState == 1) {
								spawn106 = False
							}
							break
						}
					}
					if (PlayerRoom.RoomTemplate.Name == "room049" && EntityY(Collider) <= -2848*RoomScale) {
						spawn106 = False
					}
					//GateA event has been triggered - don't make 106 disapper!
					//The reason why this is a seperate For loop is because we need to make sure that room860 would not be able to overwrite the "spawn106%" variable
					for (e of Events.each) {
						if (e.EventName == "gatea") {
							if (e.EventState != 0) {
								spawn106 = True
								if (PlayerRoom.RoomTemplate.Name == "dimension1499") {
									n.Idle = True
								} else {
									n.Idle = False
								}
							}
							break
						}
					}
					if ((!spawn106) && n.State <= 0) {
						n.State = Rand(22000, 27000)
						PositionEntity(n.Collider,0,500,0)
					}
					
					if ((!n.Idle) && spawn106) {
						if (n.State <= 0) {	//attacking	
							if (EntityY(n.Collider) < EntityY(Collider) - 20.0 - 0.55) {
								if (!PlayerRoom.RoomTemplate.DisableDecals) {
									de.Decals = CreateDecal(0, EntityX(Collider), 0.01, EntityZ(Collider), 90, Rand(360), 0)
									de.Size = 0.05
									de.SizeChange = 0.001
									EntityAlpha(de.obj, 0.8)
									UpdateDecals
								}
								
								n.PrevY = EntityY(Collider)
								
								SetAnimTime(n.obj, 110)
								
								if (PlayerRoom.RoomTemplate.Name != "coffin") {
									PositionEntity(n.Collider, EntityX(Collider), EntityY(Collider) - 15, EntityZ(Collider))
								}
								
								PlaySound_Strict(DecaySFX(0))
							}
							
							if (Rand(500) == 1) {PlaySound2(OldManSFX(Rand(0, 2)), Camera, n.Collider)}
							n.SoundChn = LoopSound2(OldManSFX(4), n.SoundChn, Camera, n.Collider, 8.0, 0.8)
							
							if (n.State > -10) {
								ShouldPlay = 66
								if (n.Frame<259) {
									PositionEntity(n.Collider, EntityX(n.Collider), n.PrevY-0.15, EntityZ(n.Collider))
									PointEntity(n.obj, Collider)
									RotateEntity (n.Collider, 0, CurveValue(EntityYaw(n.obj),EntityYaw(n.Collider),100.0), 0, True)
									
									AnimateNPC(n, 110, 259, 0.15, False)
								} else {
									n.State = -10
								}
							} else {
								if (PlayerRoom.RoomTemplate.Name != "gatea") {ShouldPlay = 10}
								
								let Visible: boolean = false
								if (dist < 8.0) {
									Visible = EntityVisible(n.Collider, Collider)
								}
								
								if (NoTarget) {Visible = False}
								
								if (Visible) {
									if (PlayerRoom.RoomTemplate.Name != "gatea") {
										n.PathTimer = 0
									}
									if (EntityInView(n.Collider, Camera)) {
										GiveAchievement(Achv106)
																				
										BlurVolume = Max(Max(Min((4.0 - dist) / 6.0, 0.9), 0.1), BlurVolume)
										CurrCameraZoom = Max(CurrCameraZoom, (Sin(Float(MilliSecs2())/20.0)+1.0) * 20.0 * Max((4.0-dist)/4.0,0))
										
										if (MilliSecs2() - n.LastSeen > 60000) {
											CurrCameraZoom = 40
											PlaySound_Strict(HorrorSFX(6))
											n.LastSeen = MilliSecs2()
										}
									}
								} else {
									n.State -= FPSfactor
								}
								
								if (dist > 0.8) {
									if ((dist > 25.0 || PlayerRoom.RoomTemplate.Name == "pocketdimension" || Visible || n.PathStatus != 1) && PlayerRoom.RoomTemplate.Name != "gatea") {
										
										if (dist > 40 || PlayerRoom.RoomTemplate.Name == "pocketdimension") {
											TranslateEntity(n.Collider, 0, ((EntityY(Collider) - 0.14) - EntityY(n.Collider)) / 50.0, 0)
										}
										
										n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,10.0)
										
										PointEntity(n.obj, Collider)
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 10.0), 0)
										
										if (KillTimer >= 0) {
											prevFrame = n.Frame
											AnimateNPC(n, 284, 333, n.CurrSpeed*43)
											
											if (prevFrame <= 286 && n.Frame>286) {
												PlaySound2(Step2SFX(Rand(0,2)),Camera, n.Collider, 6.0, Rnd(0.8,1.0))	
											} else if (prevFrame <= 311 && n.Frame>311.0) {
												PlaySound2(Step2SFX(Rand(0,2)),Camera, n.Collider, 6.0, Rnd(0.8,1.0))
											}
										} else { 
											n.CurrSpeed = 0
										}
										
										n.PathTimer = Max(n.PathTimer-FPSfactor,0)
										if (n.PathTimer <= 0) {
											n.PathStatus = FindPath (n, EntityX(Collider,True), EntityY(Collider,True), EntityZ(Collider,True))
											n.PathTimer = 70*10
										}
									} else {
										if (n.PathTimer <= 0) {
											n.PathStatus = FindPath (n, EntityX(Collider,True), EntityY(Collider,True), EntityZ(Collider,True))
											n.PathTimer = 70*10
											n.CurrSpeed = 0
										} else {
											n.PathTimer = Max(n.PathTimer-FPSfactor,0)
											
											if (n.PathStatus == 2) {
												n.CurrSpeed = 0
											} else if (n.PathStatus == 1) {
												while (n.Path[n.PathLocation] == Null) {
													if (n.PathLocation > 19) {
														n.PathLocation = 0
														n.PathStatus = 0
														break
													} else {
														n.PathLocation = n.PathLocation + 1
													}
												}
												
												if (n.Path[n.PathLocation]) {
													TranslateEntity(n.Collider, 0, ((EntityY(n.Path[n.PathLocation].obj,True) - 0.11) - EntityY(n.Collider)) / 50.0, 0)
													
													PointEntity(n.obj, n.Path[n.PathLocation].obj)
													
													dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
													
													RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), Min(20.0,dist2*10.0)), 0)
													n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,10.0)
													
													prevFrame = AnimTime(n.obj)
													AnimateNPC(n, 284, 333, n.CurrSpeed*43)
													if (prevFrame <= 286 && n.Frame>286) {
														PlaySound2(Step2SFX(Rand(0,2)),Camera, n.Collider, 6.0, Rnd(0.8,1.0))	
													} else if (prevFrame <= 311 && n.Frame>311.0) {
														PlaySound2(Step2SFX(Rand(0,2)),Camera, n.Collider, 6.0, Rnd(0.8,1.0))
													}
													
													if (dist2 < 0.2) {n.PathLocation += 1}
												}
											} else if (n.PathStatus == 0) {
												if (n.State3 == 0) {AnimateNPC(n, 334, 494, 0.3)}
												n.CurrSpeed = CurveValue(0,n.CurrSpeed,10.0)
											}
										}
									}
									
								} else if (PlayerRoom.RoomTemplate.Name != "gatea" && !NoTarget) {
									
									if (dist > 0.5) {
										n.CurrSpeed = CurveValue(n.Speed * 2.5,n.CurrSpeed,10.0)
									} else {
										n.CurrSpeed = 0
									}
									AnimateNPC(n, 105, 110, 0.15, False)
									
									if (KillTimer >= 0 && FallTimer >= 0) {
										PointEntity()
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 10.0), 0)
										
										if (Ceil(n.Frame) == 110 && (!GodMode)) {
											PlaySound_Strict(DamageSFX(1))
											PlaySound_Strict(HorrorSFX(5))											
											if (PlayerRoom.RoomTemplate.Name = "pocketdimension") {
												DeathMSG = "Subject D-9341. Body partially decomposed by what is assumed to be SCP-106's "+Chr(34)+"corrosion"+Chr(34)+" effect. Body disposed of via incineration."
												Kill()
											} else {
												PlaySound_Strict(OldManSFX(3))
												FallTimer = Min(-1, FallTimer)
												PositionEntity(Head, EntityX(Camera, True), EntityY(Camera, True), EntityZ(Camera, True), True)
												ResetEntity (Head)
												RotateEntity(Head, 0, EntityYaw(Camera) + Rand(-45, 45), 0)
											}
										}
									}
									
								}
								
							} 
							
							MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
							
							if (n.State <= Rand(-3500, -3000)) {
								if (!EntityInView(n.obj,Camera) && dist > 5) {
									n.State = Rand(22000, 27000)
									PositionEntity(n.Collider,0,500,0)
								}
							}
							
							if (FallTimer < -250.0) {
								MoveToPocketDimension()
								n.State = 250 //make 106 idle for a while
							}
							
							if (n.Reload == 0) {
                                if (dist > 10 && PlayerRoom.RoomTemplate.Name != "pocketdimension" && PlayerRoom.RoomTemplate.Name != "gatea" && n.State < -5) { //timer idea by Juanjpro
                                    if (!EntityInView(n.obj,Camera)) {
                                        TurnEntity(Collider,0,180,0)
                                        pick = EntityPick(Collider,5)
                                        TurnEntity(Collider,0,180,0)
                                        if (pick != 0) {
											TeleportEntity(n.Collider,PickedX(),PickedY(),PickedZ(),n.CollRadius)
                                            PointEntity(n.Collider,Collider)
                                            RotateEntity(n.Collider,0,EntityYaw(n.Collider),0)
                                            MoveEntity(n.Collider,0,0,-2)
                                            PlaySound2(OldManSFX(3),Camera,n.Collider)
											n.SoundChn2 = PlaySound2(OldManSFX(6+Rand(0,2)),Camera,n.Collider)
                                            n.PathTimer = 0
                                            n.Reload = (70*10.0)/(SelectedDifficulty.otherFactors+1)
                                            DebugLog("Teleported 106 (Distance: "+EntityDistance(n.Collider,Collider)+")")
										}
									}
                                }
                            }
                            n.Reload = Max(0, n.Reload - FPSfactor)
                            DebugLog("106 in... "+n.Reload )
							
							UpdateSoundOrigin(n.SoundChn2,Camera,n.Collider)
						} else { //idling outside the map
							n.CurrSpeed = 0
							MoveEntity(n.Collider, 0, ((EntityY(Collider) - 30) - EntityY(n.Collider)) / 200.0, 0)
							n.DropSpeed = 0
							n.Frame = 110
							
							if (!PlayerRoom.RoomTemplate.DisableDecals) {
								if (PlayerRoom.RoomTemplate.Name != "gatea") {
									if (SelectedDifficulty.aggressiveNPCs) {
										n.State=n.State-FPSfactor*2
									} else {
										n.State=n.State-FPSfactor
									}
								}
							}
						}
						
						ResetEntity(n.Collider)
						n.DropSpeed = 0
						PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.15, EntityZ(n.Collider))
						
						RotateEntity(n.obj, 0, EntityYaw(n.Collider), 0)
						
						PositionEntity(n.obj2, EntityX(n.obj), EntityY(n.obj) , EntityZ(n.obj))
						RotateEntity(n.obj2, 0, EntityYaw(n.Collider) - 180, 0)
						MoveEntity(n.obj2, 0, 8.6 * 0.11, -1.5 * 0.11)
						
						if (PlayerRoom.RoomTemplate.Name == "pocketdimension" || PlayerRoom.RoomTemplate.Name == "gatea") {
							HideEntity (n.obj2)
						} else {
							if (dist < CameraFogFar*LightVolume*0.6) {
								HideEntity(n.obj2)
							} else {
								ShowEntity(n.obj2)
								EntityAlpha (n.obj2, Min(dist-CameraFogFar*LightVolume*0.6,1.0))
							}
						}						
					} else {
						HideEntity(n.obj2)
					}
				}
				
				//[End Block]
			case NPCtype096:
				//[Block]
				dist = EntityDistance(Collider, n.Collider)
				
				switch (n.State) {
					case 0:
						//[Block]
						if (dist<8.0) {
							GiveAchievement(Achv096)
							if (n.SoundChn == 0) {
								n.SoundChn = StreamSound_Strict("SFX/Music/096.ogg",0)
								n.SoundChn_IsStream = True
							} else {
								UpdateStreamSoundOrigin(n.SoundChn,Camera,n.Collider,8.0,1.0)
							}
							
							if (n.State3 == -1) {
								AnimateNPC(n,936,1263,0.1,False)
								if (n.Frame >= 1262.9) {
									n.State = 5
									n.State3 = 0
									n.Frame = 312
								}
							} else {
								AnimateNPC(n,936,1263,0.1)
								if (n.State3 < 70*6) {
									n.State3=n.State3+FPSfactor
								} else {
									if (Rand(1,5) == 1) {
										n.State3 = -1
									} else {
										n.State3=70*(Rand(0,3))
									}
								}
							}
							
							angle = WrapAngle(DeltaYaw(n.Collider, Collider))
							
							if (!NoTarget) {
								if (angle<90 || angle>270) {
									CameraProject(Camera,EntityX(n.Collider), EntityY(n.Collider)+0.25, EntityZ(n.Collider))
									
									if (ProjectedX()>0 && ProjectedX()<GraphicWidth) {
										if (ProjectedY()>0 && ProjectedY()<GraphicHeight) {
											if (EntityVisible(Collider, n.Collider)) {
												if (BlinkTimer < -16 || BlinkTimer > -6) {
													PlaySound_Strict(LoadTempSound("SFX/SCP/096/Triggered.ogg"))
													
													CurrCameraZoom = 10
													
													n.Frame = 194
													StopStream_Strict(n.SoundChn)
													n.SoundChn=0
													n.Sound = 0
													n.State = 1
													n.State3 = 0
												}
											}									
										}
									}								
									
								}
							}
						}
						//[End Block]
					case 4:
						//[Block]
						CurrCameraZoom = CurveValue(Max(CurrCameraZoom, (Sin(Float(MilliSecs2())/20.0)+1.0) * 10.0),CurrCameraZoom,8.0)
						
						if (n.Target == Null) {
							if (n.SoundChn == 0) {
								n.SoundChn = StreamSound_Strict("SFX/SCP/096/Scream.ogg",0)
								n.SoundChn_IsStream = True
							} else {
								UpdateStreamSoundOrigin(n.SoundChn,Camera,n.Collider,7.5,1.0)
							}
							
							if (n.SoundChn2 == 0) {
								n.SoundChn2 = StreamSound_Strict("SFX/Music/096Chase.ogg",0)
								n.SoundChn2_IsStream = 2
							} else {
								SetStreamVolume_Strict(n.SoundChn2,Min(Max(8.0-dist,0.6),1.0)*SFXVolume)
							}
						}
						
						if (NoTarget && n.Target == Null) {
							n.State = 5
						}
						
						if (KillTimer >= 0) {
							
							if (MilliSecs2() > n.State3) {
								n.LastSeen=0
								if (n.Target=Null) {
									if (EntityVisible(Collider, n.Collider)) {n.LastSeen=1}
								} else {
									if (EntityVisible(n.Target.Collider, n.Collider)) {n.LastSeen=1}
								}
								n.State3=MilliSecs2()+3000
							}
							
							if (n.LastSeen == 1) {
								n.PathTimer=Max(70*3, n.PathTimer)
								n.PathStatus=0
								
								if (n.Target!= Null) {dist = EntityDistance(n.Target.Collider, n.Collider)}
								
								if (dist < 2.8 || n.Frame<150) {
									if (n.Frame>193) {n.Frame = 2.0} //go to the start of the jump animation
									
									AnimateNPC(n, 2, 193, 0.7)
									
									if (dist > 1.0) {
										n.CurrSpeed = CurveValue(n.Speed*2.0,n.CurrSpeed,15.0)
									} else {
										n.CurrSpeed = 0
										
										if (n.Target == Null) {
											if (!GodMode) {
												PlaySound_Strict(DamageSFX(4))
												
												pvt = CreatePivot()
												CameraShake = 30
												BlurTimer = 2000
												DeathMSG = "A large amount of blood found in [DATA REDACTED]. DNA indentified as Subject D-9341. Most likely [DATA REDACTED] by SCP-096."
												Kill()
												KillAnim = 1
												for (i of range(7)) {
													PositionEntity(pvt, EntityX(Collider)+Rnd(-0.1,0.1),EntityY(Collider)-0.05,EntityZ(Collider)+Rnd(-0.1,0.1))
													TurnEntity(pvt, 90, 0, 0)
													EntityPick(pvt,0.3)
													
													de.Decals = CreateDecal(Rand(15,16), PickedX(), PickedY()+0.005, PickedZ(), 90, Rand(360), 0)
													de.Size = Rnd(0.2,0.6)
													EntityAlpha(de.obj, 1.0)
													ScaleSprite(de.obj, de.Size, de.Size)
												}
												FreeEntity(pvt)
											}
										}				
									}
									
									if (n.Target == Null) {
										PointEntity(n.Collider, Collider)
									} else {
										PointEntity(n.Collider, n.Target.Collider)
									}
									
								} else {
									if (n.Target == Null) {
										PointEntity(n.obj, Collider)
									} else {
										PointEntity(n.obj, n.Target.Collider)
									}
									
									RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 5.0), 0)
									
									//1000
									if (n.Frame>847) {
										n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,20.0)
									}
									
									if (n.Frame<906) { //1058
										AnimateNPC(n,737,906,n.Speed*8,False)
									} else {
										AnimateNPC(n,907,935,n.CurrSpeed*8)
									}
								}
								
								RotateEntity(n.Collider, 0, EntityYaw(n.Collider), 0, True)
								MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
								
							} else {
								if (n.PathStatus == 1) {
									
									if (n.Path[n.PathLocation]=Null) { 
										if (n.PathLocation > 19) { 
											n.PathLocation = 0
											n.PathStatus = 0
										} else {
											n.PathLocation = n.PathLocation + 1
										}
									} else {
										PointEntity(n.obj, n.Path[n.PathLocation].obj)
										
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 5.0), 0)
										
										//1000
										if (n.Frame>847) {n.CurrSpeed = CurveValue(n.Speed*1.5,n.CurrSpeed,15.0)}
										MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
										
										if (n.Frame<906) { //1058
											AnimateNPC(n,737,906,n.Speed*8,False)
										} else {
											AnimateNPC(n,907,935,n.CurrSpeed*8)
										}
										
										dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
										if (dist2 < 0.8) {
											if (n.Path[n.PathLocation].door) {
												if (!n.Path[n.PathLocation].door.open) {
													n.Path[n.PathLocation].door.open = True
													n.Path[n.PathLocation].door.fastopen = 1
													PlaySound2(OpenDoorFastSFX, Camera, n.Path[n.PathLocation].door.obj)
												}
											}							
											if (dist2 < 0.7) {n.PathLocation = n.PathLocation + 1}
										} 
									}
									
								} else {
									//AnimateNPC(n, 892,972, 0.2)
									AnimateNPC(n,737,822,0.2)
									
									n.PathTimer = Max(0, n.PathTimer-FPSfactor)
									if (n.PathTimer<=0) {
										if (n.Target!=Null) {
											n.PathStatus = FindPath(n, EntityX(n.Target.Collider),EntityY(n.Target.Collider)+0.2,EntityZ(n.Target.Collider))	
										} else {
											n.PathStatus = FindPath(n, EntityX(Collider),EntityY(Collider)+0.2,EntityZ(Collider))	
										}
										n.PathTimer = 70*5
									}
								}
							}
							
							if (dist > 32.0 || EntityY(n.Collider) < -50) {
								if (Rand(50) == 1) {TeleportCloser(n)}
							}
						} else { //play the eating animation if killtimer < 0 
							AnimateNPC(n, Min(27,AnimTime(n.obj)), 193, 0.5)
						}
						
						
						//[End Block]
					case 1,2,3:
						if (n.SoundChn == 0) {
							n.SoundChn = StreamSound_Strict("SFX/Music/096Angered.ogg",0)
							n.SoundChn_IsStream = True
						} else {
							UpdateStreamSoundOrigin(n.SoundChn,Camera,n.Collider,10.0,1.0)
						}
						
						if (n.State == 1) { // get up
							if (n.Frame<312) {
								AnimateNPC(n,193,311,0.3,False)
								if (n.Frame > 310.9) {
									n.State = 2
									n.Frame = 737
								}
							} else if (n.Frame >= 312 && n.Frame <= 422) {
								AnimateNPC(n,312,422,0.3,False)
								if (n.Frame > 421.9) {
									n.Frame = 677
								}
							} else {
								AnimateNPC(n,677,736,0.3,False)
								if (n.Frame > 735.9) {
									n.State = 2
									n.Frame = 737
								}
							}
						} else if (n.State == 2) {
							AnimateNPC(n,737,822,0.3,False)
							if (n.Frame >= 822) {
								n.State=3
								n.State2=0
							}
						} else if (n.State == 3) {
							n.State2 = n.State2+FPSfactor
							if (n.State2 > 70*18) {
								AnimateNPC(n,823,847,n.Speed*8,False)
								if (n.Frame>846.9) { //1000.9 
									n.State = 4
									StopStream_Strict(n.SoundChn)
									n.SoundChn=0
								}
							} else {
								AnimateNPC(n,737,822,0.3)
							}
						}
						//[End Block]
					case 5:
						//[Block]
						if (dist < 16.0) {
							
							if (dist < 4.0) {
								GiveAchievement(Achv096)
							}
							
							if (n.SoundChn == 0) {
								n.SoundChn = StreamSound_Strict("SFX/Music/096.ogg",0)
								n.SoundChn_IsStream = True
							} else {
								UpdateStreamSoundOrigin(n.SoundChn,Camera,n.Collider,14.0,1.0)
							}
							
							if (n.Frame>=422) {
								n.State2=n.State2+FPSfactor
								if (n.State2>1000) { //walking around
									if (n.State2>1600) {
										n.State2=Rand(0,500)
									}
									
									//1652
									if (n.Frame<1382) { //idle to walk
										n.CurrSpeed = CurveValue(n.Speed*0.1,n.CurrSpeed,5.0)
										AnimateNPC(n,1369,1382,n.CurrSpeed*45,False)
									} else {
										n.CurrSpeed = CurveValue(n.Speed*0.1,n.CurrSpeed,5.0)
										AnimateNPC(n,1383,1456,n.CurrSpeed*45)
									}
									
									if (MilliSecs2() > n.State3) {
										n.LastSeen=0
										if (EntityVisible(Collider, n.Collider)) {
											n.LastSeen=1
										} else {
											HideEntity(n.Collider)
											EntityPick(n.Collider, 1.5)
											if (PickedEntity() != 0) {
												n.Angle = EntityYaw(n.Collider)+Rnd(80,110)
											}
											ShowEntity(n.Collider)
										}
										n.State3=MilliSecs2()+3000
									}
									
									if (n.LastSeen) {
										PointEntity(n.obj, Collider)
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),130.0),0)
										if (dist < 1.5) {
											n.State2=0
										}
									} else {
										RotateEntity(n.Collider, 0, CurveAngle(n.Angle,EntityYaw(n.Collider),50.0),0)
									}
								} else {
									//1638
									if (n.Frame>472) { //walk to idle
										n.CurrSpeed = CurveValue(n.Speed*0.05,n.CurrSpeed,8.0)
										AnimateNPC(n,1383,1469,n.CurrSpeed*45,False)
										if (n.Frame>=1468.9) {n.Frame=423}
									} else { //idle
										n.CurrSpeed = CurveValue(0,n.CurrSpeed,4.0)	
										AnimateNPC(n,423,471,0.2)
									}
								}
								
								MoveEntity(n.Collider,0,0,n.CurrSpeed*FPSfactor)
							} else {
								AnimateNPC(n,312,422,0.3,False)
							}
							
							angle = WrapAngle(DeltaYaw(n.Collider, Camera))
							if (!NoTarget) {
								if (angle<55 || angle>360-55) {
									CameraProject(Camera,EntityX(n.Collider), EntityY(Collider)+5.8*0.2-0.25, EntityZ(n.Collider))
									
									if (ProjectedX()>0 && ProjectedX()<GraphicWidth) {
										if (ProjectedY()>0 && ProjectedY()<GraphicHeight) {
											if (EntityVisible(Collider, n.Collider)) {
												if (BlinkTimer < - 16 || BlinkTimer > - 6) {
													PlaySound_Strict(LoadTempSound("SFX/SCP/096/Triggered.ogg"))
													
													CurrCameraZoom = 10
													
													if (n.Frame >= 422) {
														n.Frame = 677 //833
													}
													StopStream_Strict(n.SoundChn)
													n.SoundChn=0
													n.Sound = 0
													n.State = 2
												}
											}									
										}
									}
								}
							}
						}
						//[End Block]
				}
				
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider)-0.03, EntityZ(n.Collider)) //-0.07
				
				RotateEntity(n.obj, EntityPitch(n.Collider), EntityYaw(n.Collider), 0)
				//[End Block]
			case NPCtype049:
				//[Block]
				//n.state = the "main state" of the NPC
				//n.state2 = attacks the player when the value is above 0.0
				//n.state3 = timer for updating the path again
				
				prevFrame = n.Frame
				
				dist  = EntityDistance(Collider, n.Collider)
				
				n.BlinkTimer = 1.0
				
				if (n.Idle > 0.1) {
					if (PlayerRoom.RoomTemplate.Name != "room049") {
						n.Idle = Max(n.Idle-(1+SelectedDifficulty.aggressiveNPCs)*FPSfactor,0.1)
					}
					n.DropSpeed = 0
					if (ChannelPlaying(n.SoundChn)) {StopChannel(n.SoundChn)}
					if (ChannelPlaying(n.SoundChn2)) {StopChannel(n.SoundChn2)}
					PositionEntity(n.Collider,0,-500,0)
					PositionEntity(n.obj,0,-500,0)
				} else {
					if (n.Idle == 0.1) {
						if (PlayerInReachableRoom()) {
							for (i of range(4)) {
								if (PlayerRoom.Adjacent[i] != Null) {
									for (j of range(4)) {
										if (PlayerRoom.Adjacent[i].Adjacent[j] != Null) {
											TeleportEntity(n.Collider,PlayerRoom.Adjacent[i].Adjacent[j].x,0.5,PlayerRoom.Adjacent[i].Adjacent[j].z,n.CollRadius,True)
											break
										}
									}
									break
								}
							}
							n.Idle = 0.0
							DebugLog("SCP-049 not idle")
						}
					}
					
					switch (n.State) {
						case 1: //looking around before getting active
							//[Block]
							if (n.Frame>=538) {
								AnimateNPC(n, 659, 538, -0.45, False)
								if (n.Frame > 537.9) {
									n.Frame = 37
								}
							} else {
								AnimateNPC(n, 37, 269, 0.7, False)
								if (n.Frame>268.9) {
									n.State = 2
								}	
							}
							//[End Block]
						case 2: //being active
							//[Block]
							if ((dist < HideDistance*2) && !n.Idle && PlayerInReachableRoom(True)) {
								n.SoundChn = LoopSound2(n.Sound, n.SoundChn, Camera, n.Collider)
								PlayerSeeAble = MeNPCSeesPlayer(n)
								if (PlayerSeeAble || n.State2 > 0) { //Player is visible for 049's sight - attacking
									GiveAchievement(Achv049)
									
									//Playing a sound after detecting the player
									if (n.PrevState <= 1 && !ChannelPlaying(n.SoundChn2)) {
										if (n.Sound2 != 0) {FreeSound_Strict(n.Sound2)}
										n.Sound2 = LoadSound_Strict("SFX/SCP/049/Spotted"+Rand(1,7)+".ogg")
										n.SoundChn2 = LoopSound2(n.Sound2,n.SoundChn2,Camera,n.obj)
										n.PrevState = 2
									}
									n.PathStatus = 0
									n.PathTimer = 0.0
									n.PathLocation = 0
									if (PlayerSeeAble) {
										n.State2 = 70*2
									}
									
									PointEntity(n.obj,Collider)
									RotateEntity(n.Collider,0,CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),10.0),0)
									
									if (dist < 0.5) {
										if (WearingHazmat>0) {
											BlurTimer = BlurTimer+FPSfactor*2.5
											if (BlurTimer>250 && BlurTimer-FPSfactor*2.5 <= 250 && n.PrevState!=3) {
												if (n.SoundChn2 != 0) {StopChannel(n.SoundChn2)}
												n.SoundChn2 = PlaySound_Strict(LoadTempSound("SFX/SCP/049/TakeOffHazmat.ogg"))
												n.PrevState=3
											} else if (BlurTimer >= 500) {
												for (i of range(MaxItemAmount)) {
													if (Inventory(i) != Null) {
														if (Instr(Inventory(i).itemtemplate.tempname,"hazmatsuit") && WearingHazmat<3) {
															if (Inventory(i).state2 < 3) {
																Inventory(i).state2 = Inventory(i).state2 + 1
																BlurTimer = 260.0
																CameraShake = 2.0
															} else {
																RemoveItem(Inventory(i))
																WearingHazmat = False
															}
															break
														}
													}
												}
											}
										} else if (Wearing714) {
											BlurTimer = BlurTimer+FPSfactor*2.5
											if (BlurTimer>250 && BlurTimer-FPSfactor*2.5 <= 250 && n.PrevState!=3) {
												if (n.SoundChn2 != 0) {StopChannel(n.SoundChn2)}
												n.SoundChn2 = PlaySound_Strict(LoadTempSound("SFX/SCP/049/714Equipped.ogg"))
												n.PrevState=3
											} else if (BlurTimer >= 500) {
												Wearing714=False
											}
										} else {
											CurrCameraZoom = 20.0
											BlurTimer = 500.0
											
											if (!GodMode) {
												if (PlayerRoom.RoomTemplate.Name == "room049") {
													DeathMSG = "Three (3) active instances of SCP-049-2 discovered in the tunnel outside SCP-049's containment chamber. Terminated by Nine-Tailed Fox."
													for (e of Events.each) {
														if (e.EventName == "room049") {
															e.EventState=-1
															break
														}
													}
												} else {
													DeathMSG = "An active instance of SCP-049-2 was discovered in [REDACTED]. Terminated by Nine-Tailed Fox."
													Kill()
												}
												PlaySound_Strict(HorrorSFX(13))
												if (n.Sound2 != 0) {FreeSound_Strict(n.Sound2)}
												n.Sound2 = LoadSound_Strict("SFX/SCP/049/Kidnap"+Rand(1,2)+".ogg")
												n.SoundChn2 = LoopSound2(n.Sound2,n.SoundChn2,Camera,n.obj)
												n.State = 3
											}										
										}
									} else {
										n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
										MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
										
										if (n.PrevState == 3) {n.PrevState = 2}
										
										if (dist < 3.0) {
											AnimateNPC(n, Max(Min(AnimTime(n.obj),428.0),387), 463.0, n.CurrSpeed*38)
										} else {
											if (n.Frame>428.0) {
												AnimateNPC(n, Min(AnimTime(n.obj),463.0), 498.0, n.CurrSpeed*38,False)
												if (n.Frame>497.9) {
													n.Frame = 358
												}
											} else {
												AnimateNPC(n, Max(Min(AnimTime(n.obj),358.0),346), 393.0, n.CurrSpeed*38)
											}
										}
									}
								} else { //Finding a path to the player
									if (n.PathStatus == 1) { //Path to player found
										while (n.Path[n.PathLocation] == Null) {
											if (n.PathLocation > 19) {
												n.PathLocation = 0
												n.PathStatus = 0
												break
											} else {
												n.PathLocation = n.PathLocation + 1
											}
										}
										if (n.Path[n.PathLocation]!=Null) {
											//closes doors behind him
											if (n.PathLocation>0) {
												if (n.Path[n.PathLocation-1] != Null) {
													if (n.Path[n.PathLocation-1].door != Null) {
														if (!n.Path[n.PathLocation-1].door.IsElevatorDoor) {
															if (EntityDistance(n.Path[n.PathLocation-1].obj,n.Collider)>0.3) {
																if ((n.Path[n.PathLocation-1].door.MTFClose) && (n.Path[n.PathLocation-1].door.open) && (n.Path[n.PathLocation-1].door.buttons[0] != 0 || n.Path[n.PathLocation-1].door.buttons[1] != 0)) {
																	UseDoor(n.Path[n.PathLocation-1].door, False)
																}
															}
														}
													}
												}
											}
											
											n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
											PointEntity(n.obj,n.Path[n.PathLocation].obj)
											RotateEntity(n.Collider,0,CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),10.0),0)
											MoveEntity(n.Collider,0,0,n.CurrSpeed*FPSfactor)
											
											//opens doors in front of him
											dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
											if (dist2 < 0.6) {
												temp = True
												if (n.Path[n.PathLocation].door != Null) {
													if (!n.Path[n.PathLocation].door.IsElevatorDoor) {
														if ((n.Path[n.PathLocation].door.locked || n.Path[n.PathLocation].door.KeyCard!=0 || n.Path[n.PathLocation].door.Code!="") && !n.Path[n.PathLocation].door.open) {
															temp = False
														} else {
															if (!n.Path[n.PathLocation].door.open && (n.Path[n.PathLocation].door.buttons[0]!=0 || n.Path[n.PathLocation].door.buttons[1]!=0)) {
																UseDoor(n.Path[n.PathLocation].door, False)
															}
														}
													}
												}
												if (dist2 < 0.2 && temp) {
													n.PathLocation = n.PathLocation + 1
												} else if (dist2 < 0.5 && !temp) {
													//Breaking up the path when the door in front of 049 cannot be operated by himself
													n.PathStatus = 0
													n.PathTimer = 0.0
												}
											}
											
											AnimateNPC(n, Max(Min(AnimTime(n.obj),358.0),346), 393.0, n.CurrSpeed*38)
											
											//Playing a sound if he hears the player
											if (n.PrevState == 0 && !ChannelPlaying(n.SoundChn2)) {
												if (n.Sound2 != 0) {FreeSound_Strict(n.Sound2)}
												if (Rand(30) == 1) {
													n.Sound2 = LoadSound_Strict("SFX/SCP/049/Searching7.ogg")
												} else {
													n.Sound2 = LoadSound_Strict("SFX/SCP/049/Searching"+Rand(1,6)+".ogg")
												}
												n.SoundChn2 = LoopSound2(n.Sound2,n.SoundChn2,Camera,n.obj)
												n.PrevState = 1
											}
											
											//Resetting the "PrevState" value randomly, to make 049 talking randomly 
											if (Rand(600)=1 && !ChannelPlaying(n.SoundChn2)) {n.PrevState = 0}
											
											if (n.PrevState > 1) {
												n.PrevState = 1
											}
										}
									} else { //No Path to the player found - stands still and tries to find a path
										//[Block]
										n.PathTimer = n.PathTimer + FPSfactor
										if (n.PathTimer > 70*(5-(2*SelectedDifficulty.aggressiveNPCs))) {
											n.PathStatus = FindPath(n, EntityX(Collider),EntityY(Collider),EntityZ(Collider))
											n.PathTimer = 0.0
											n.State3 = 0
											
											//Attempt to find a room (the Playerroom or one of it's adjacent rooms) for 049 to go to but select the one closest to him
											if (n.PathStatus != 1) {
												let closestdist: float = EntityDistance(PlayerRoom.obj,n.Collider)
												let closestRoom: Rooms = PlayerRoom
												let currdist: float = 0.0
												for (i of range(4)) {
													if (PlayerRoom.Adjacent[i]!=Null) {
														currdist = EntityDistance(PlayerRoom.Adjacent[i].obj,n.Collider)
														if (currdist < closestdist) {
															closestdist = currdist
															closestRoom = PlayerRoom.Adjacent[i]
														}
													}
												}
												n.PathStatus = FindPath(n,EntityX(closestRoom.obj),0.5,EntityZ(closestRoom.obj))
												DebugLog("Find path for 049 in another room (pathstatus: "+n.PathStatus+")")
											}
											
											//Making 3 attempts at finding a path
											while (Int(n.State3) < 3) {
												//Breaking up the path if no "real" path has been found (only 1 waypoint and it is too close)
												if (n.PathStatus = 1) {
													if (n.Path[1] != Null) {
														if (n.Path[2]=Null && EntityDistance(n.Path[1].obj,n.Collider)<0.4) {
															n.PathLocation = 0
															n.PathStatus = 0
															DebugLog("Breaking up path for 049 because no waypoint number 2 has been found and waypoint number 1 is too close.")
														}
													}
													if (n.Path[0] != Null && n.Path[1] == Null) {
														n.PathLocation = 0
														n.PathStatus = 0
														DebugLog("Breaking up path for 049 because no waypoint number 1 has been found.")
													}
												}
												
												//No path could still be found, just make 049 go to a room (further away than the very first attempt)
												if (n.PathStatus != 1) {
													closestdist = 100.0 //Prevent the PlayerRoom to be considered the closest, so 049 wouldn't try to find a path there
													closestRoom.Rooms = PlayerRoom
													currdist = 0.0
													for (let i of range(4)) {
														if (PlayerRoom.Adjacent[i]!=Null) {
															currdist = EntityDistance(PlayerRoom.Adjacent[i].obj,n.Collider)
															if (currdist < closestdist) {
																closestdist = currdist
																for (let j of range(4)) {
																	if (PlayerRoom.Adjacent[i].Adjacent[j]!=Null) {
																		if (PlayerRoom.Adjacent[i].Adjacent[j]!=PlayerRoom) {
																			closestRoom = PlayerRoom.Adjacent[i].Adjacent[j]
																			break
																		}
																	}
																}
															}
														}
													}
													n.PathStatus = FindPath(n,EntityX(closestRoom.obj),0.5,EntityZ(closestRoom.obj))
													DebugLog("Find path for 049 in another further away room (pathstatus: "+n.PathStatus+")")
												}
												
												//Making 049 skip waypoints for doors he can't interact with, but only if the actual path is behind him
												if (n.PathStatus == 1) {
													if (n.Path[1]!=Null) {
														if (n.Path[1].door!=Null) {
															if ((n.Path[1].door.locked || n.Path[1].door.KeyCard!=0 || n.Path[1].door.Code!="") && (!n.Path[1].door.open)) {
																while (true) {
																	if (n.PathLocation > 19) {
																		n.PathLocation = 0
																		n.PathStatus = 0
																		break
																	} else {
																		n.PathLocation = n.PathLocation + 1
																	}
																	if (n.Path[n.PathLocation]!=Null) {
																		if (Abs(DeltaYaw(n.Collider,n.Path[n.PathLocation].obj))>(45.0-Abs(DeltaYaw(n.Collider,n.Path[1].obj)))) {
																			DebugLog("Skip until waypoint number "+n.PathLocation)
																			n.State3 = 3
																			break
																		}
																	}
																}
															} else {
																n.State3 = 3
															}
														} else {
															n.State3 = 3
														}
													}
												}
												n.State3 = n.State3 + 1
											}
										}
										AnimateNPC(n, 269, 345, 0.2)
										
									}
								}
								
								if (n.CurrSpeed > 0.005) {
									if ((prevFrame < 361 && n.Frame>=361) || (prevFrame < 377 && n.Frame>=377)) {
										PlaySound2(StepSFX(3,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.8,1.0))						
									} else if ((prevFrame < 431 && n.Frame>=431) || (prevFrame < 447 && n.Frame>=447)) {
										PlaySound2(StepSFX(3,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.8,1.0))
									}
								}
								
								if (ChannelPlaying(n.SoundChn2)) {
									UpdateSoundOrigin(n.SoundChn2,Camera,n.obj)
								}
							} else if (!n.Idle) {
								if (ChannelPlaying(n.SoundChn)) {
									StopChannel(n.SoundChn)
								}
								if (PlayerInReachableRoom(True) && InFacility == 1) { //Player is in a room where SCP-049 can teleport to
									if (Rand(1,3-SelectedDifficulty.otherFactors) == 1) {
										TeleportCloser(n)
										DebugLog("SCP-049 teleported closer due to distance")
									} else {
										n.Idle = 60*70
										DebugLog("SCP-049 is now idle")
									}
								}
							}
							
						case 3: //The player was killed by SCP-049
							
							AnimateNPC(n, 537, 660, 0.7, False)
							
							PositionEntity(n.Collider, CurveValue(EntityX(Collider),EntityX(n.Collider),20.0),EntityY(n.Collider),CurveValue(EntityZ(Collider),EntityZ(n.Collider),20.0))
							RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(Collider)-180.0,EntityYaw(n.Collider),40), 0)
							
						case 4: //Standing on catwalk in room4
							
							if (dist < 8.0) {
								AnimateNPC(n, 18, 19, 0.05)
								
								//Animate2(n.obj, AnimTime(n.obj), 18, 19, 0.05)
								PointEntity(n.obj, Collider)
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 45.0), 0)
								
								n.State3 = 1
							} else if (dist > HideDistance*0.8 && n.State3 > 0) {
								n.State = 2
								n.State3 = 0
								for (r of Rooms.each) {
									if (EntityDistance(r.obj,n.Collider)<4.0) {
										TeleportEntity(n.Collider,EntityX(r.obj),0.1,EntityZ(r.obj),n.CollRadius,True)
										break
									}
								}
							}
							
						case 5: //used for "room2sl"
							
							n.SoundChn = LoopSound2(n.Sound, n.SoundChn, Camera, n.Collider)
							PlayerSeeAble = MeNPCSeesPlayer(n,True)
							if (PlayerSeeAble) {
								n.State = 2
								n.PathStatus = 0
								n.PathLocation = 0
								n.PathTimer = 0
								n.State3 = 0
								n.State2 = 70*2
								n.PrevState = 0
								PlaySound_Strict(LoadTempSound("SFX/Room/Room2SL049Spawn.ogg"))
							} else if (PlayerSeeAble == 2 && n.State3 > 0.0) {
								n.PathStatus = FindPath(n,EntityX(Collider),EntityY(Collider),EntityZ(Collider))
							} else {
								if (n.State3 == 6.0) {
									if (EntityDistance(n.Collider,Collider)>HideDistance) {
										n.State = 2
										n.PathStatus = 0
										n.PathLocation = 0
										n.PathTimer = 0
										n.State3 = 0
										n.PrevState = 0
									} else {
										if (n.PathStatus != 1) {
											n.PathStatus = FindPath(n,EntityX(Collider),EntityY(Collider),EntityZ(Collider))
										}
									}
								}
								
								if (n.PathStatus == 1) {
									if (n.Path[n.PathLocation] == Null) {
										if (n.PathLocation > 19) {
											n.PathLocation = 0
											n.PathStatus = 0
										} else {
											n.PathLocation = n.PathLocation + 1
										}
									} else {
										n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
										PointEntity(n.obj,n.Path[n.PathLocation].obj)
										RotateEntity(n.Collider,0,CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),10.0),0)
										MoveEntity(n.Collider,0,0,n.CurrSpeed*FPSfactor)
										
										//closes doors behind him
										if (n.PathLocation>0) {
											if (n.Path[n.PathLocation-1] != Null) {
												if (n.Path[n.PathLocation-1].door != Null) {
													if (n.Path[n.PathLocation-1].door.KeyCard=0) {
														if (EntityDistance(n.Path[n.PathLocation-1].obj,n.Collider)>0.3) {
															if (n.Path[n.PathLocation-1].door.open) {
																UseDoor(n.Path[n.PathLocation-1].door, False)
															}
														}
													}
												}
											}
										}
										
										//opens doors in front of him
										dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
										if (dist2 < 0.6) {
											if (n.Path[n.PathLocation].door != Null) {
												if (!n.Path[n.PathLocation].door.open) {
													UseDoor(n.Path[n.PathLocation].door, False)
												}
											}
										}
										
										if (dist2 < 0.2) {
											n.PathLocation += 1
										}
										
										AnimateNPC(n, Max(Min(AnimTime(n.obj),358.0),346), 393.0, n.CurrSpeed*38)
									}
								} else {
									switch (n.PrevState) {
										case 0:
											AnimateNPC(n, 269, 345, 0.2)
										case 1:
											AnimateNPC(n, 661, 891, 0.4, False)
										case 2:
											AnimateNPC(n, 892, 1119, 0.4, False)
									}
								}
							}
							
							if (PlayerRoom.RoomTemplate.Name == "room2sl") {
								ShouldPlay = 20
							}
							
							if (n.CurrSpeed > 0.005) {
								if ((prevFrame < 361 && n.Frame>=361) || (prevFrame < 377 && n.Frame>=377)) {
									PlaySound2(StepSFX(3,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.8,1.0))						
						 		} else if ((prevFrame < 431 && n.Frame>=431) || (prevFrame < 447 && n.Frame>=447)) {
									PlaySound2(StepSFX(3,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.8,1.0))
								}
							}
							
							if (ChannelPlaying(n.SoundChn2)) {
								UpdateSoundOrigin(n.SoundChn2,Camera,n.obj)
							}
							
					}
				}
				
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider)-0.22, EntityZ(n.Collider))
				
				RotateEntity(n.obj, 0, EntityYaw(n.Collider), 0)
				
				n.LastSeen = Max(n.LastSeen-FPSfactor,0)
				
				n.State2 = Max(n.State2-FPSfactor,0)
				
				
			case NPCtypeZombie:
				
				
				if (Abs(EntityY(Collider)-EntityY(n.Collider))<4.0) {
					
					prevFrame = n.Frame
					
					if (!n.IsDead) {
						switch (n.State) {
							case 0:
								
								AnimateNPC(n, 719, 777, 0.2, False)
								
								if (n.Frame == 777) {
									if (Rand(700) == 1) {
										if (EntityDistance(Collider, n.Collider) < 5.0) {
											n.Frame = 719
										}
									}
								}
								//[End Block]
							case 1: //stands up
								
								if (n.Frame >= 682) {
									AnimateNPC(n, 926, 935, 0.3, False)
									if (n.Frame == 935) {n.State = 2}
									
								} else {
									AnimateNPC(n, 155, 682, 1.5, False)
								}
								
							case 2: //following the player
								
								if (n.State3 < 0) { //check if the player is visible every three seconds
									if (EntityDistance(Collider, n.Collider)<5.0) { 
										if (EntityVisible(Collider, n.Collider)) {
											n.State2 = 70*5
										}
									}
									n.State3=70*3
								} else {
									n.State3=n.State3-FPSfactor
								}
								
								if (n.State2 > 0 && (!NoTarget)) { //player is visible -> attack
									n.SoundChn = LoopSound2(n.Sound, n.SoundChn, Camera, n.Collider, 6.0, 0.6)
									
									n.PathStatus = 0
									
									dist = EntityDistance(Collider, n.Collider)
									
									PointEntity(n.obj, Collider)
									RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 30.0), 0)
									
									if (dist < 0.7) {
										n.State = 3
										if (Rand(2) == 1) {
											n.Frame = 2
										} else {
											n.Frame = 66
										}
									} else {
										n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
										MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
										
										AnimateNPC(n, 936, 1017, n.CurrSpeed*60)
									}
									
									n.State2=n.State2-FPSfactor
								} else {
									if (n.PathStatus == 1) { //path found
										if (n.Path[n.PathLocation] == Null) { 
											if (n.PathLocation > 19) { 
												n.PathLocation = 0
												n.PathStatus = 0
											} else {
												n.PathLocation = n.PathLocation + 1
											}
										} else {
											PointEntity(n.obj, n.Path[n.PathLocation].obj)
											
											RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 30.0), 0)
											n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
											MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
											
											AnimateNPC(n, 936, 1017, n.CurrSpeed*60)
											
											if (EntityDistance(n.Collider,n.Path[n.PathLocation].obj) < 0.2) {
												n.PathLocation = n.PathLocation + 1
											} 
										}
									} else { //no path to the player, stands still
										n.CurrSpeed = 0
										AnimateNPC(n, 778, 926, 0.1)
										
										n.PathTimer = n.PathTimer-FPSfactor
										if (n.PathTimer <= 0) {
											n.PathStatus = FindPath(n, EntityX(Collider),EntityY(Collider)+0.1,EntityZ(Collider))
											n.PathTimer = n.PathTimer+70*5
										}
									}
								}
								
								//65, 80, 93, 109, 123
								if (n.CurrSpeed > 0.005) {
									if ((prevFrame < 977 && n.Frame>=977) || (prevFrame > 1010 && n.Frame<940)) {
										PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))
									}
								}
								//[End Block]
							case 3:
								
								if (NoTarget) {n.State = 2}
								if (n.Frame < 66) {
									AnimateNPC(n, 2, 65, 0.7, False)
									
									if (prevFrame < 23 && n.Frame>=23) {
										if (EntityDistance(n.Collider,Collider)<1.1) {
											if (Abs(DeltaYaw(n.Collider,Collider))<=60.0) {
												PlaySound_Strict(DamageSFX(Rand(5,8)))
												Injuries = Injuries+Rnd(0.4,1.0)
												DeathMSG = "Subject D-9341. Cause of death: multiple lacerations and severe blunt force trauma caused by an instance of SCP-049-2."
											}
										}
									} else if (n.Frame == 65) {
										n.State = 2
									}	
								} else {
									AnimateNPC(n, 66, 132, 0.7, False)
									if (prevFrame < 90 && n.Frame>=90) {
										if (EntityDistance(n.Collider,Collider)<1.1) {
											if ((Abs(DeltaYaw(n.Collider,Collider))<=60.0)) {
												PlaySound_Strict(DamageSFX(Rand(5,8)))
												Injuries = Injuries+Rnd(0.4,1.0)
												DeathMSG = "Subject D-9341. Cause of death: multiple lacerations and severe blunt force trauma caused by an instance of SCP-049-2."
											}
										}
									} else if (n.Frame == 132) {
										n.State = 2
									}		
								}
						}
					} else {
						AnimateNPC(n, 133, 157, 0.5, False)
					}
					
					PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.2, EntityZ(n.Collider))
					
					RotateEntity(n.obj, -90, EntityYaw(n.Collider), 0)
				}
				
				//[End Block]
			case NPCtypeGuard: //------------------------------------------------------------------------------------------------------------------
				
				prevFrame = n.Frame
				
				n.BoneToManipulate = ""
				n.ManipulateBone = False
				n.ManipulationType = 0
				n.NPCNameInSection = "Guard"
				
				switch (n.State) {
					case 1: //aims and shoots at the player
						
						if (n.Frame < 39 || (n.Frame > 76 && n.Frame < 245) || (n.Frame > 248 && n.Frame < 302) || n.Frame > 344) {
							AnimateNPC(n,345,357,0.2,False)
							if (n.Frame >= 356) {SetNPCFrame(n,302)}
						}
						
						if (KillTimer >= 0) {
							dist = EntityDistance(n.Collider,Collider)
							let ShootAccuracy: float = 0.4+0.5*SelectedDifficulty.aggressiveNPCs
							let DetectDistance: float = 11.0
							
							//If at Gate B increase his distance so that he can shoot the player from a distance after they are spotted.
							if (PlayerRoom.RoomTemplate.Name == "exit1") {
								DetectDistance = 21.0
								ShootAccuracy = 0.0
								if (Rand(1,8-SelectedDifficulty.aggressiveNPCs*4)<2) {
									ShootAccuracy = 0.03
								}
								
								//increase accuracy if the player is going slow
								ShootAccuracy = ShootAccuracy + (0.5 - CurrSpeed*20)
							}
							
							if (dist < DetectDistance) {
								pvt = CreatePivot()
								PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider), EntityZ(n.Collider))
								PointEntity(pvt, Collider)
								RotateEntity(pvt, Min(EntityPitch(pvt), 20), EntityYaw(pvt), 0)
								
								RotateEntity(n.Collider, CurveAngle(EntityPitch(pvt), EntityPitch(n.Collider), 10), CurveAngle(EntityYaw(pvt), EntityYaw(n.Collider), 10), 0, True)
								
								PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider)+0.8, EntityZ(n.Collider))
								PointEntity(pvt, Collider)
								RotateEntity(pvt, Min(EntityPitch(pvt), 40), EntityYaw(n.Collider), 0)
								
								if (n.Reload == 0) {
									DebugLog("entitypick")
									EntityPick(pvt, dist)
									if (PickedEntity() == Collider || n.State3 == 1) {
										let instaKillPlayer: boolean = false
										
										if (PlayerRoom.RoomTemplate.Name == "start") {
											DeathMSG = "Subject D-9341. Cause of death: Gunshot wound to the head. The surveillance tapes confirm that the subject was terminated by Agent Ulgrin shortly after the site lockdown was initiated."
											instaKillPlayer = True
										} else if (PlayerRoom.RoomTemplate.Name = "exit1") {
											DeathMSG = Chr(34)+"Agent G. to control. Eliminated a Class D escapee in Gate B's courtyard."+Chr(34)
										} else {
											DeathMSG = ""
										}
										
										PlaySound2(GunshotSFX, Camera, n.Collider, 35)
										
										RotateEntity(pvt, EntityPitch(n.Collider), EntityYaw(n.Collider), 0, True)
										PositionEntity(pvt, EntityX(n.obj), EntityY(n.obj), EntityZ(n.obj))
										MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
										
										PointEntity(pvt, Collider)
										Shoot(EntityX(pvt), EntityY(pvt), EntityZ(pvt), ShootAccuracy, False, instaKillPlayer)
										n.Reload = 7
									} else {
										n.CurrSpeed = n.Speed
									}
								}
								
								if (n.Reload > 0 && n.Reload <= 7) {
									AnimateNPC(n,245,248,0.35,True)
								} else {
									if (n.Frame < 302) {
										AnimateNPC(n,302,344,0.35,True)
									}
								}
								
								FreeEntity(pvt)
							} else {
								AnimateNPC(n,302,344,0.35,True)
							}
							
							n.ManipulateBone = True
							
							if (n.State2 == 10) { //Hacky way of applying spine pitch to specific guards.
								n.BoneToManipulate = "Chest"
								n.ManipulationType = 3
							} else {
								n.BoneToManipulate = "Chest"
								n.ManipulationType = 0
							}
						} else {
							n.State = 0
						}
						
					case 2: //shoots
						
						AnimateNPC(n,245,248,0.35,True)
						if (n.Reload == 0) {
							PlaySound2(GunshotSFX, Camera, n.Collider, 20)
							p.Particles = CreateParticle(EntityX(n.obj, True), EntityY(n.obj, True), EntityZ(n.obj, True), 1, 0.2, 0.0, 5)
							PositionEntity(p.pvt, EntityX(n.obj), EntityY(n.obj), EntityZ(n.obj))
							RotateEntity(p.pvt, EntityPitch(n.Collider), EntityYaw(n.Collider), 0, True)
							MoveEntity (p.pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
							n.Reload = 7
						}
						
					case 3: //follows a path
						
						if (n.PathStatus == 2) {
							n.State = 0
							n.CurrSpeed = 0
						} else if (n.PathStatus == 1) {
							if (n.Path[n.PathLocation] == Null) {
								if (n.PathLocation > 19) {
									n.PathLocation = 0
									n.PathStatus = 0
								} else {
									n.PathLocation = n.PathLocation + 1
								}
							} else {
								PointEntity(n.obj, n.Path[n.PathLocation].obj)
								
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0)
								
								AnimateNPC(n,1,38,n.CurrSpeed*40)
								n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
								
								MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
								
								if (EntityDistance(n.Collider,n.Path[n.PathLocation].obj) < 0.2) {
									n.PathLocation = n.PathLocation + 1
								} 
							}
						} else {
							n.CurrSpeed = 0
							n.State = 4
						}
						//[End Block]
					case 4:
						
						AnimateNPC(n,77,201,0.2)
						
						if (Rand(400) == 1) {
							n.Angle = Rnd(-180, 180)
						}
						
						RotateEntity(n.Collider, 0, CurveAngle(n.Angle + Sin(MilliSecs2() / 50) * 2, EntityYaw(n.Collider), 150.0), 0, True)
						
						dist = EntityDistance(n.Collider, Collider)
						if (dist < 15.0) {
							if (WrapAngle(EntityYaw(n.Collider)-DeltaYaw(n.Collider, Collider))<90) {
								if (EntityVisible(pvt,Collider)) {
									n.State = 1
								}
							}	
						}
						
						//[End Block]
					case 5: //following a target
						
						
						RotateEntity(n.Collider, 0, CurveAngle(VectorYaw(n.EnemyX-EntityX(n.Collider), 0, n.EnemyZ-EntityZ(n.Collider))+n.Angle, EntityYaw(n.Collider), 20.0), 0)
						
						dist = Distance(EntityX(n.Collider),EntityZ(n.Collider),n.EnemyX,n.EnemyZ)
						
						AnimateNPC(n,1,38,n.CurrSpeed*40)
						
						if (dist > 2.0 || dist < 1.0) {
							n.CurrSpeed = CurveValue(n.Speed*Sgn(dist-1.5)*0.75, n.CurrSpeed, 10.0)
						} else {
							n.CurrSpeed = CurveValue(0, n.CurrSpeed, 10.0)
						}
						
						MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
						//[End Block]
					case 7:
						AnimateNPC(n,77,201,0.2)
						//[End Block]						
					case 9:
						
						AnimateNPC(n,77,201,0.2)
						n.BoneToManipulate = "head"
						n.ManipulateBone = True
						n.ManipulationType = 0
						n.Angle = EntityYaw(n.Collider)
						//[End Block]
					case 10:
						
						AnimateNPC(n, 1, 38, n.CurrSpeed*40)
						
						n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
						
						MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
						//[End Block]
					case 11:
						
						if (n.Frame < 39 || (n.Frame > 76 && n.Frame < 245) || (n.Frame > 248 && n.Frame < 302) || n.Frame > 344) {
							AnimateNPC(n,345,357,0.2,False)
							if (n.Frame >= 356) {SetNPCFrame(n,302)}
						}
						
						if (KillTimer >= 0) {
							dist = EntityDistance(n.Collider,Collider)
							
							let SearchPlayer: boolean = false
							if (dist < 11.0) {
								if (EntityVisible(n.Collider,Collider)) {
									SearchPlayer = True
								}
							}
							
							if (SearchPlayer) {
								pvt = CreatePivot()
								PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider), EntityZ(n.Collider))
								PointEntity(pvt, Collider)
								RotateEntity(pvt, Min(EntityPitch(pvt), 20), EntityYaw(pvt), 0)
								
								RotateEntity(n.Collider, CurveAngle(EntityPitch(pvt), EntityPitch(n.Collider), 10), CurveAngle(EntityYaw(pvt), EntityYaw(n.Collider), 10), 0, True)
								
								PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider)+0.8, EntityZ(n.Collider))
								PointEntity(pvt, Collider)
								RotateEntity(pvt, Min(EntityPitch(pvt), 40), EntityYaw(n.Collider), 0)
								
								if (n.Reload == 0) {
									DebugLog("entitypick")
									EntityPick(pvt, dist)
									if (PickedEntity() == Collider || n.State3 == 1) {
										instaKillPlayer = False
										
										DeathMSG = ""
										
										PlaySound2(GunshotSFX, Camera, n.Collider, 35)
										
										RotateEntity(pvt, EntityPitch(n.Collider), EntityYaw(n.Collider), 0, True)
										PositionEntity(pvt, EntityX(n.obj), EntityY(n.obj), EntityZ(n.obj))
										MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
										
										PointEntity(pvt, Collider)
										Shoot(EntityX(pvt), EntityY(pvt), EntityZ(pvt), 1.0, False, instaKillPlayer)
										n.Reload = 7
									} else {
										n.CurrSpeed = n.Speed
									}
								}
								
								if (n.Reload > 0 && n.Reload <= 7) {
									AnimateNPC(n,245,248,0.35,True)
								} else {
									if (n.Frame < 302) {
										AnimateNPC(n,302,344,0.35,True)
									}
								}
								
								FreeEntity(pvt)
							} else {
								if (n.PathStatus == 1) {
									if (n.Path[n.PathLocation] == Null) {
										if (n.PathLocation > 19) {
											n.PathLocation = 0
											n.PathStatus = 0
										} else {
											n.PathLocation = n.PathLocation + 1
										}
									} else {
										AnimateNPC(n,39,76,n.CurrSpeed*40)
										n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
										MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
										
										PointEntity(n.obj, n.Path[n.PathLocation].obj)
										
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0)
										
										if (EntityDistance(n.Collider,n.Path[n.PathLocation].obj) < 0.2) {
											n.PathLocation = n.PathLocation + 1
										}
									}
								} else {
									if (n.PathTimer == 0) {
										n.PathStatus = FindPath(n,EntityX(Collider),EntityY(Collider)+0.5,EntityZ(Collider))
									}
									
									let wayPointCloseToPlayer: WayPoints
									wayPointCloseToPlayer = Null
									
									for (wp of WayPoints.each) {
										if (EntityDistance(wp.obj,Collider)<2.0) {
											wayPointCloseToPlayer = wp
											break
										}
									}
									
									if (wayPointCloseToPlayer!=Null) {
										n.PathTimer = 1
										if (EntityVisible(wayPointCloseToPlayer.obj,n.Collider)) {
											if (Abs(DeltaYaw(n.Collider,wayPointCloseToPlayer.obj))>0) {
												PointEntity(n.obj, wayPointCloseToPlayer.obj)
												RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0)
											}
										}
									} else {
										n.PathTimer = 0
									}
									
									if (n.PathTimer == 1) {
										AnimateNPC(n,39,76,n.CurrSpeed*40)
										n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
										MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
									}
								}
								
								if (prevFrame < 43 && n.Frame>=43) {
									PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))						
								} else if (prevFrame < 61 && n.Frame>=61) {
									PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))
								}
							}
							
						} else {
							n.State = 0
						}
						//[End Block]
					case 12:
						
						if (n.Frame < 39 || (n.Frame > 76 && n.Frame < 245) || (n.Frame > 248 && n.Frame < 302) || n.Frame > 344) {
							AnimateNPC(n,345,357,0.2,False)
							if (n.Frame >= 356) {
								SetNPCFrame(n,302)
							}
						}
						if (n.Frame < 345) {
							AnimateNPC(n,302,344,0.35,True)
						}
						
						pvt = CreatePivot()
						PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider), EntityZ(n.Collider))
						if (n.State2 == 1.0) {
							PointEntity(pvt, Collider)
						} else {
							RotateEntity(pvt,0,n.Angle,0)
						}
						RotateEntity(pvt, Min(EntityPitch(pvt), 20), EntityYaw(pvt), 0)
						
						RotateEntity(n.Collider, CurveAngle(EntityPitch(pvt), EntityPitch(n.Collider), 10), CurveAngle(EntityYaw(pvt), EntityYaw(n.Collider), 10), 0, True)
						
						PositionEntity(pvt, EntityX(n.Collider), EntityY(n.Collider)+0.8, EntityZ(n.Collider))
						if (n.State2 == 1.0) {
							PointEntity(pvt, Collider)
							n.ManipulateBone = True
							n.BoneToManipulate = "Chest"
							n.ManipulationType = 0
						} else {
							RotateEntity(pvt,0,n.Angle,0)
						}
						RotateEntity(pvt, Min(EntityPitch(pvt), 40), EntityYaw(n.Collider), 0)
						
						FreeEntity(pvt)
						
						UpdateSoundOrigin(n.SoundChn,Camera,n.Collider,20)
						
					case 13:
						
						AnimateNPC(n,202,244,0.35,True)
						
					case 14:
						
						if (n.PathStatus == 2) {
							n.State = 13
							n.CurrSpeed = 0
						} else if (n.PathStatus == 1) {
							if (n.Path[n.PathLocation] == Null) {
								if (n.PathLocation > 19) {
									n.PathLocation = 0
									n.PathStatus = 0
								} else {
									n.PathLocation = n.PathLocation + 1
								}
							} else {
								PointEntity(n.obj, n.Path[n.PathLocation].obj)
								
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0)
								
								AnimateNPC(n,39,76,n.CurrSpeed*40)
								n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
								
								MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
								
								if (EntityDistance(n.Collider,n.Path[n.PathLocation].obj) < 0.2) {
									n.PathLocation = n.PathLocation + 1
								} 
							}
						} else {
							n.CurrSpeed = 0
							n.State = 13
						}
						
						if (prevFrame < 43 && n.Frame>=43) {
							PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))						
						} else if (prevFrame < 61 && n.Frame>=61) {
							PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))
						}
						
					default:
						
						if (Rand(400) == 1) {
							n.PrevState = Rnd(-30, 30)
						}
						n.PathStatus = 0
						AnimateNPC(n,77,201,0.2)
						
						RotateEntity(n.Collider, 0, CurveAngle(n.Angle + n.PrevState + Sin(MilliSecs2() / 50) * 2, EntityYaw(n.Collider), 50), 0, True)
						
				}
				
				if (n.CurrSpeed > 0.01) {
					if (prevFrame < 5 && n.Frame>=5) {
						PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))						
					} else if (prevFrame < 23 && n.Frame>=23) {
						PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.5,0.7))						
					}
				}
				
				if (n.Frame > 286.5 && n.Frame < 288.5) {
					n.IsDead = True
				}
				
				n.Reload = Max(0, n.Reload - FPSfactor)
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.2, EntityZ(n.Collider))
				
				RotateEntity(n.obj, 0, EntityYaw(n.Collider)+180, 0)
				
			case NPCtypeMTF:
				
				UpdateMTFUnit(n)
				
				
			case NPCtypeD,NPCtypeClerk :
				
				RotateEntity(n.Collider, 0, EntityYaw(n.Collider), EntityRoll(n.Collider), True)
				
				prevFrame = AnimTime(n.obj)
				
				switch (n.State) {
					case 0: //idle
						n.CurrSpeed = CurveValue(0.0, n.CurrSpeed, 5.0)
						Animate2(n.obj, AnimTime(n.obj), 210, 235, 0.1)
					case 1: //walking
						if (n.State2 == 1.0) {
							n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
						} else {
							n.CurrSpeed = CurveValue(0.015, n.CurrSpeed, 5.0)
						}
						Animate2(n.obj, AnimTime(n.obj), 236, 260, n.CurrSpeed * 18)
					case 2: //running
						n.CurrSpeed = CurveValue(0.03, n.CurrSpeed, 5.0)
						Animate2(n.obj, AnimTime(n.obj), 301, 319, n.CurrSpeed * 18)
				}
				
				if (n.State2 != 2) {
					if (n.State == 1) {
						if (n.CurrSpeed > 0.01) {
							if (prevFrame < 244 && AnimTime(n.obj)>=244) {
								PlaySound2(StepSFX(GetStepSound(n.Collider),0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))						
							} else if (prevFrame < 256 && AnimTime(n.obj)>=256) {
								PlaySound2(StepSFX(GetStepSound(n.Collider),0,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))
							}
						}
					} else if (n.State == 2) {
						if (n.CurrSpeed > 0.01) {
							if (prevFrame < 309 && AnimTime(n.obj)>=309) {
								PlaySound2(StepSFX(GetStepSound(n.Collider),1,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))
							} else if (prevFrame <= 319 && AnimTime(n.obj)<=301) {
								PlaySound2(StepSFX(GetStepSound(n.Collider),1,Rand(0,2)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))
							}
						}
					}
				}
				
				if (n.Frame == 19 || n.Frame == 60) {
					n.IsDead = True
				}
				if (AnimTime(n.obj) == 19 || AnimTime(n.obj) == 60) {
					n.IsDead = True
				}
				
				MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
				
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.32, EntityZ(n.Collider))
				
				RotateEntity(n.obj, EntityPitch(n.Collider), EntityYaw(n.Collider)-180.0, 0)
				
			case NPCtype5131:

				if (PlayerRoom.RoomTemplate.Name != "pocketdimension") {
					if (n.Idle) {
						HideEntity(n.obj)
						HideEntity(n.obj2)
						if (Rand(200) == 1) {
							for (w of WayPoints.each) {
								if (w.room!=PlayerRoom) {
									x = Abs(EntityX(Collider)-EntityX(w.obj,True))
									if (x>3 && x < 9) {
										z = Abs(EntityZ(Collider)-EntityZ(w.obj,True))
										if (z>3 && z < 9) {
											PositionEntity(n.Collider, EntityX(w.obj,True), EntityY(w.obj,True), EntityZ(w.obj,True))
											PositionEntity(n.obj, EntityX(w.obj,True), EntityY(w.obj,True), EntityZ(w.obj,True))
											ResetEntity(n.Collider)
											ShowEntity(n.obj)
											ShowEntity(n.obj2)
											
											n.LastSeen = 0
											
											n.Path[0]=w
											
											n.Idle = False
											n.State2 = Rand(15,20)*70
											n.State = Max(Rand(-1,2),0)
											n.PrevState = Rand(0,1)
											break
										}
									}
								}
							}
						}
					} else {
						dist = EntityDistance(Collider, n.Collider)
						
						//use the prev-values to do a "twitching" effect
						n.PrevX = CurveValue(0.0, n.PrevX, 10.0)
						n.PrevZ = CurveValue(0.0, n.PrevZ, 10.0)
						
						if (Rand(100) == 1) {
							if (Rand(5) == 1) {
								n.PrevX = (EntityX(Collider)-EntityX(n.Collider))*0.9
								n.PrevZ = (EntityZ(Collider)-EntityZ(n.Collider))*0.9
							} else {
								n.PrevX = Rnd(0.1,0.5)
								n.PrevZ = Rnd(0.1,0.5)						
							}
						}
						
						temp = Rnd(-1.0,1.0)
						PositionEntity(n.obj2, EntityX(n.Collider)+n.PrevX*temp, EntityY(n.Collider) - 0.2 + Sin((MilliSecs2()/8-45) % 360)*0.05, EntityZ(n.Collider)+n.PrevZ*temp)
						RotateEntity(n.obj2, 0, EntityYaw(n.obj), 0)
						if (Floor(AnimTime(n.obj2))!=Floor(n.Frame)) {
							SetAnimTime(n.obj2, n.Frame)
						}
						
						if (n.State == 0) {
							if (n.PrevState == 0) {
								AnimateNPC(n,2,74,0.2)
							} else {
								AnimateNPC(n,75,124,0.2)
							}
							
							if (n.LastSeen) {
								PointEntity(n.obj2, Collider)
								RotateEntity(n.obj, 0, CurveAngle(EntityYaw(n.obj2),EntityYaw(n.obj),40), 0)
								if (dist < 4) {
									n.State = Rand(1,2)
								}
							} else {
								if (dist < 6 && Rand(5) == 1) {
									if (EntityInView(n.Collider,Camera)) {
										if (EntityVisible(Collider, n.Collider)) {
											n.LastSeen = 1
											PlaySound_Strict(LoadTempSound("SFX/SCP/513/Bell"+Rand(2,3)+".ogg"))
										}
									}
								}								
							}
							
						} else {
							if (n.Path[0] == Null) {
								
								//move towards a waypoint that is:
								//1. max 8 units away from 513-1
								//2. further away from the player than 513-1's current position 
								for (w of WayPoints.each) {
									x = Abs(EntityX(n.Collider,True)-EntityX(w.obj,True))
									if (x < 8.0 && x > 1.0) {
										z = Abs(EntityZ(n.Collider,True)-EntityZ(w.obj,True))
										if (z < 8.0 && z > 1.0) {
											if (EntityDistance(Collider, w.obj) > dist) {
												n.Path[0]=w
												break
											}
										}
									}
								}
								
								//no suitable path found -> 513-1 simply disappears
								if (n.Path[0] == Null) {
									n.Idle = True
									n.State2 = 0
								}
							} else {
								
								if (EntityDistance(n.Collider, n.Path[0].obj) > 1.0) {
									PointEntity(n.obj, n.Path[0].obj)
									RotateEntity(n.Collider, CurveAngle(EntityPitch(n.obj),EntityPitch(n.Collider),15.0), CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),15.0), 0, True)
									n.CurrSpeed = CurveValue(0.05*Max((7.0-dist)/7.0,0.0),n.CurrSpeed,15.0)
									MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
									if (Rand(200) == 1) {MoveEntity(n.Collider, 0, 0, 0.5)}
									RotateEntity(n.Collider, 0, EntityYaw(n.Collider), 0, True)
								} else {
									for (i of range(5)) {
										if (n.Path[0].connected[i] != Null) {
											if (EntityDistance(Collider, n.Path[0].connected[i].obj) > dist) {
												
												if (n.LastSeen == 0) {
													if (EntityInView(n.Collider,Camera)) {
														if (EntityVisible(Collider, n.Collider)) {
															n.LastSeen = 1
															PlaySound_Strict(LoadTempSound("SFX/SCP/513/Bell"+Rand(2,3)+".ogg"))
														}
													}
												}
												
												n.Path[0]=n.Path[0].connected[i]
												break
											}
										}
									}
									
									if (!n.Path[0]) {n.State2 = 0}
								}
							}
						}
						
						PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.2 + Sin((MilliSecs2()/8) % 360)*0.1, EntityZ(n.Collider))
						
						switch (n.State) {
							case 1:
								if (n.PrevState == 0) {
									AnimateNPC(n,125,194,n.CurrSpeed*20)
								} else {
									AnimateNPC(n,195,264,n.CurrSpeed*20)
								}
								RotateEntity(n.obj, 0, EntityYaw(n.Collider), 0)
							case 2:
								if (n.PrevState == 0) {
									AnimateNPC(n,2,74,0.2)
								} else {
									AnimateNPC(n,75,124,0.2)
								}
								RotateEntity(n.obj, 0, EntityYaw(n.Collider), 0)
						}
						
						if (n.State2 > 0) {
							if (dist < 4.0) {
								n.State2 = n.State2-FPSfactor*4
							}
							n.State2 = n.State2-FPSfactor
						} else {
							n.Path[0]=Null
							n.Idle = True
							n.State2=0
						}	
					}
				}
				
				n.DropSpeed = 0
				ResetEntity(n.Collider)						
				
			case NPCtype372:
				
				RN = PlayerRoom.RoomTemplate.Name
				if (RN != "pocketdimension" && RN != "dimension1499") {
					if (n.Idle) {
						HideEntity(n.obj)
						if (Rand(50) = 1 && (BlinkTimer < -5 && BlinkTimer > -15)) {
							ShowEntity(n.obj)
							angle = EntityYaw(Collider)+Rnd(-90,90)
							
							dist = Rnd(1.5, 2.0)
							PositionEntity(n.Collider, EntityX(Collider) + Sin(angle) * dist, EntityY(Collider)+0.2, EntityZ(Collider) + Cos(angle) * dist)
							n.Idle = False
							n.State = Rand(20, 60)
							
							if (Rand(300) == 1) {
								PlaySound2(RustleSFX(Rand(0,2)),Camera, n.obj, 8, Rnd(0.0,0.2))
							}
						}
					} else {
						PositionEntity(n.obj, EntityX(n.Collider) + Rnd(-0.005, 0.005), EntityY(n.Collider)+0.3+0.1*Sin(MilliSecs2()/2), EntityZ(n.Collider) + Rnd(-0.005, 0.005))
						RotateEntity(n.obj, 0, EntityYaw(n.Collider), ((MilliSecs2()/5) % 360))
						
						AnimateNPC(n, 32, 113, 0.4)
						
						if (EntityInView(n.obj, Camera)) {
							GiveAchievement(Achv372)
							
							if (Rand(30) == 1) {
								if (!ChannelPlaying(n.SoundChn)) {
									if (EntityVisible(Camera, n.obj)) {
										n.SoundChn = PlaySound2(RustleSFX(Rand(0,2)),Camera, n.obj, 8, 0.3)
									}
								}
							}
							
							temp = CreatePivot()
							PositionEntity(temp, EntityX(Collider), EntityY(Collider), EntityZ(Collider))
							PointEntity(temp, n.Collider)
							
							angle =  WrapAngle(EntityYaw(Collider)-EntityYaw(temp))
							if (angle < 180) {
								RotateEntity(n.Collider, 0, EntityYaw(Collider)-80, 0)
							} else {
								RotateEntity(n.Collider, 0, EntityYaw(Collider)+80, 0)
							}
							FreeEntity(temp)
							
							MoveEntity(n.Collider, 0, 0, 0.03*FPSfactor)
							
							n.State = n.State-FPSfactor
						}
						n.State=n.State-(FPSfactor/80.0)
						if (n.State <= 0) {n.Idle = True}
					}
				}
				
				n.DropSpeed = 0
				ResetEntity(n.Collider)						
				
			case NPCtypeApache: //------------------------------------------------------------------------------------------------------------------
				
				dist = EntityDistance(Collider, n.Collider)
				if (dist<60.0) {
					if (PlayerRoom.RoomTemplate.Name == "exit1") {
						dist2 = Max(Min(EntityDistance(n.Collider, PlayerRoom.Objects[3])/(8000.0*RoomScale),1.0),0.0)
					} else { 
						dist2 = 1.0
					}
					
					n.SoundChn = LoopSound2(ApacheSFX, n.SoundChn, Camera, n.Collider, 25.0, dist2)
				}
				
				n.DropSpeed = 0
				
				switch (n.State) {
					case 0,1:
						TurnEntity(n.obj2,0,20.0*FPSfactor,0)
						TurnEntity(n.obj3,20.0*FPSfactor,0,0)
						
						if (n.State == 1 && !NoTarget) {
							if (Abs(EntityX(Collider)-EntityX(n.Collider))< 30.0) {
								if (Abs(EntityZ(Collider)-EntityZ(n.Collider))<30.0) {
									if (Abs(EntityY(Collider)-EntityY(n.Collider))<20.0) {
										if (Rand(20) == 1) { 
											if (EntityVisible(Collider, n.Collider)) {
												n.State = 2
												PlaySound2(AlarmSFX(2), Camera, n.Collider, 50, 1.0)
											}
										}									
									}
								}
							}							
						}
					case 2,3: //player located -> attack
						
						if (n.State == 2) {
							target = Collider
			 			} else if (n.State == 3) {
							target=CreatePivot()
							PositionEntity(target, n.EnemyX, n.EnemyY, n.EnemyZ, True)
						}
						
						if (NoTarget && n.State == 2) {n.State = 1}
						
						TurnEntity(n.obj2,0,20.0*FPSfactor,0)
						TurnEntity(n.obj3,20.0*FPSfactor,0,0)
						
						if (Abs(EntityX(target)-EntityX(n.Collider)) < 55.0) {
							if (Abs(EntityZ(target)-EntityZ(n.Collider)) < 55.0) {
								if (Abs(EntityY(target)-EntityY(n.Collider))< 20.0) {
									PointEntity(n.obj, target)
									RotateEntity(n.Collider, CurveAngle(Min(WrapAngle(EntityPitch(n.obj)),40.0),EntityPitch(n.Collider),40.0), CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),90.0), EntityRoll(n.Collider), True)
									PositionEntity(n.Collider, EntityX(n.Collider), CurveValue(EntityY(target)+8.0,EntityY(n.Collider),70.0), EntityZ(n.Collider))
									
									dist = Distance(EntityX(target),EntityZ(target),EntityX(n.Collider),EntityZ(n.Collider))
									
									n.CurrSpeed = CurveValue(Min(dist-6.5,6.5)*0.008, n.CurrSpeed, 50.0)
									
									MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
									
									
									if (n.PathTimer == 0) {
										n.PathStatus = EntityVisible(n.Collider,target)
										n.PathTimer = Rand(100,200)
									} else {
										n.PathTimer = Min(n.PathTimer-FPSfactor,0.0)
									}
									
									if (n.PathStatus == 1) { //player visible
										RotateEntity(n.Collider, EntityPitch(n.Collider), EntityYaw(n.Collider), CurveAngle(0, EntityRoll(n.Collider),40), True)
										
										if (n.Reload <= 0) {
											if (dist<20.0) {
												pvt = CreatePivot()
												
												PositionEntity(pvt, EntityX(n.Collider),EntityY(n.Collider), EntityZ(n.Collider))
												RotateEntity(pvt, EntityPitch(n.Collider), EntityYaw(n.Collider),EntityRoll(n.Collider))
												MoveEntity(pvt, 0, 8.87*(0.21/9.0), 8.87*(1.7/9.0))
												PointEntity(pvt, target)
												
												if (WrapAngle(EntityYaw(pvt)-EntityYaw(n.Collider))<10) {
													PlaySound2(Gunshot2SFX, Camera, n.Collider, 20)
													
													if (PlayerRoom.RoomTemplate.Name == "exit1") {
														DeathMSG = Chr(34)+"CH-2 to control. Shot down a runaway Class D at Gate B."+Chr(34)
													} else {
														DeathMSG = Chr(34)+"CH-2 to control. Shot down a runaway Class D at Gate A."+Chr(34)
													}
													
													Shoot( EntityX(pvt),EntityY(pvt), EntityZ(pvt),((10/dist)*(1/dist))*(n.State=2),(n.State=2))
													
													n.Reload = 5
												}
												
												FreeEntity(pvt)
											}
										}
									} else { 
										RotateEntity(n.Collider, EntityPitch(n.Collider), EntityYaw(n.Collider), CurveAngle(-20, EntityRoll(n.Collider),40), True)
									}
									MoveEntity(n.Collider, -EntityRoll(n.Collider)*0.002,0,0)
									n.Reload=n.Reload-FPSfactor
								}
							}
						}		
						
						if (n.State == 3) {FreeEntity(target)}
					case 4: //crash
						if (n.State2 < 300) {
							
							TurnEntity(n.obj2,0,20.0*FPSfactor,0)
							TurnEntity(n.obj3,20.0*FPSfactor,0,0)
							
							TurnEntity(n.Collider,0,-FPSfactor*7,0)
							n.State2=n.State2+FPSfactor*0.3
							
							target=CreatePivot()
							PositionEntity(target, n.EnemyX, n.EnemyY, n.EnemyZ, True)
							
							PointEntity(n.obj, target)
							MoveEntity(n.obj, 0,0,FPSfactor*0.001*n.State2)
							PositionEntity(n.Collider, EntityX(n.obj), EntityY(n.obj), EntityZ(n.obj))
							
							if (EntityDistance(n.obj, target) < 0.3) {
								CameraShake = Max(CameraShake, 3.0)
								PlaySound_Strict(LoadTempSound("SFX/Character/Apache/Crash"+Rand(1,2)+".ogg"))
								n.State = 5
							}
							
							FreeEntity(target)
						}
				}
				
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider), EntityZ(n.Collider))
				RotateEntity(n.obj, EntityPitch(n.Collider), EntityYaw(n.Collider), EntityRoll(n.Collider), True)
				
			case NPCtypeTentacle:
				
				dist = EntityDistance(n.Collider,Collider)
				
				if (dist < HideDistance) {
					
					switch (n.State) {
						case 0: //spawn
							
							if (n.Frame>283) {
								HeartBeatVolume = Max(CurveValue(1.0, HeartBeatVolume, 50),HeartBeatVolume)
								HeartBeatRate = Max(CurveValue(130, HeartBeatRate, 100),HeartBeatRate)
								
								PointEntity(n.obj, Collider)
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),25.0), 0)
								
								AnimateNPC(n, 283, 389, 0.3, False)
								
								if (n.Frame>388) {
									n.State = 1
									FreeSound_Strict(n.Sound2)
									n.Sound2 = 0
								}
							} else {
								if (dist < 2.5) {
									SetNPCFrame(n, 284)
									n.Sound2 = LoadSound_Strict("SFX/Room/035Chamber/TentacleSpawn.ogg")
									PlaySound_Strict(n.Sound2)
								}
							}
							//spawn 283,389
							//attack 2, 32
							//idle 33, 174
						case 1: //idle
							if (n.Sound2 == 0) {
								FreeSound_Strict(n.Sound2)
								n.Sound2=0
								n.Sound2 = LoadSound_Strict("SFX/Room/035Chamber/TentacleIdle.ogg")
							}
							n.SoundChn2 = LoopSound2(n.Sound2,n.SoundChn2,Camera,n.Collider)
							
							if (dist < 1.8) {
								if (Abs(DeltaYaw(n.Collider, Collider))<20) {
									n.State = 2
									if (n.Sound!=0) {
										FreeSound_Strict(n.Sound)
										n.Sound = 0 
									}
								}
							}
							
							PointEntity(n.obj, Collider)
							RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),25.0), 0)
							
							AnimateNPC(n, 33, 174, 0.3, True)
						case 2:
							
							//finish the idle animation before playing the attack animation
							if (n.Frame>33 && n.Frame<174) {
								AnimateNPC(n, 33, 174, 2.0, False)
							} else {
								PointEntity(n.obj, Collider)
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),10.0), 0)
								
								if (n.Frame>33) {
									if (n.Sound2!=0) {
										FreeSound_Strict(n.Sound2)
										n.Sound2 = 0
									}
									n.Frame = 2
									n.Sound = LoadSound_Strict("SFX/Room/035Chamber/TentacleAttack"+Rand(1,2)+".ogg")
									PlaySound_Strict(n.Sound)
								}
								AnimateNPC(n, 2, 32, 0.3, False)
								
								if (n.Frame>=5 && n.Frame<6) {
									if (dist < 1.8) {
										if (Abs(DeltaYaw(n.Collider, Collider))<20) {
											if (WearingHazmat) {
												Injuries = Injuries+Rnd(0.5)
												PlaySound_Strict(LoadTempSound("SFX/General/BodyFall.ogg"))
											} else {
												BlurTimer = 100
												Injuries = Injuries+Rnd(1.0,1.5)
												PlaySound_Strict(DamageSFX(Rand(2,3)))
												
												if (Injuries > 3.0) {
													if (PlayerRoom.RoomTemplate.Name == "room2offices") {
														DeathMSG = Chr(34)+"One large and highly active tentacle-like appendage seems "
														DeathMSG = DeathMSG + "to have grown outside the dead body of a scientist within office area [REDACTED]. Its level of aggression is "
														DeathMSG = DeathMSG + "unlike anything we've seen before - it looks like it has "
														DeathMSG = DeathMSG + "beaten some unfortunate Class D to death at some point during the breach."+Chr(34)
													} else {
														DeathMSG = Chr(34)+"We will need more than the regular cleaning team to take care of this. "
														DeathMSG = DeathMSG + "Two large and highly active tentacle-like appendages seem "
														DeathMSG = DeathMSG + "to have formed inside the chamber. Their level of aggression is "
														DeathMSG = DeathMSG + "unlike anything we've seen before - it looks like they have "
														DeathMSG = DeathMSG + "beaten some unfortunate Class D to death at some point during the breach."+Chr(34)
													}
													Kill()
												}
											}
										}
									}
									
									n.Frame = 6
								} else if (n.Frame == 32) {
									n.State = 1
									n.Frame = 173
								}
							}		
					}	
				}
			
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider), EntityZ(n.Collider))
				RotateEntity(n.obj, EntityPitch(n.Collider)-90, EntityYaw(n.Collider)-180, EntityRoll(n.Collider), True)
				
				n.DropSpeed = 0
				
				ResetEntity(n.Collider)
				
			case NPCtype860:
				
				if (PlayerRoom.RoomTemplate.Name == "room860") {
					let fr: Forest=PlayerRoom.fr
					
					dist = EntityDistance(Collider,n.Collider)
					
					if (ForestNPC!=0) {
						if (ForestNPCData[2] == 1) {
							ShowEntity(ForestNPC)
							if (n.State!=1) {
								if ((BlinkTimer < -8 && BlinkTimer > -12) || !EntityInView(ForestNPC,Camera)) {
									ForestNPCData[2]=0
									HideEntity(ForestNPC)
								}
							}
						} else {
							HideEntity(ForestNPC)
						}
					}
					
					switch (n.State) {
						case 0: //idle (hidden)
							
							HideEntity(n.Collider)
							HideEntity(n.obj)
							HideEntity(n.obj2)
							
							n.State2 = 0
							PositionEntity(n.Collider, 0, -100, 0)
						case 1: //appears briefly behind the trees
							n.DropSpeed = 0
							
							if (EntityY(n.Collider)<= -100) {
								//transform the position of the player to the local coordinates of the forest
								TFormPoint(EntityX(Collider),EntityY(Collider),EntityZ(Collider),0,fr.Forest_Pivot)
								
								//calculate the indices of the forest cell the player is in
								x = Floor((TFormedX()+6.0)/12.0)
								z = Floor((TFormedZ()+6.0)/12.0)
								
								//step through nearby cells
								for (x2 of range(Max(x-1,1), Min(x+1,gridsize) + 1, 2)) {
									for (z2 of range(Max(z-1,1), Min(z+1,gridsize) + 1, 2)) {
										//choose an empty cell (not on the path)
										if (fr.grid[(z2*gridsize)+x2] == 0) {
											//spawn the monster between the empty cell and the cell the player is in
											TFormPoint(((x2+x)/2)*12.0,0,((z2+z)/2)*12.0,fr.Forest_Pivot,0)
											
											//in view -> nope, keep searching for a more suitable cell
											if (EntityInView(n.Collider, Camera)) {
												PositionEntity(n.Collider, 0, -110, 0)
												DebugLog("spawned monster in view -> hide")
											} else { // not in view -> all good
												DebugLog("spawned monster successfully")
												
												PositionEntity(n.Collider, TFormedX(), EntityY(fr.Forest_Pivot,True)+2.3, TFormedZ())
												
												x2 = gridsize
												break												
											}
										}
									}
								}
								
								if (EntityY(n.Collider)> -100) {
									PlaySound2(Step2SFX(Rand(3,5)), Camera, n.Collider, 15.0, 0.5)
									
									if (ForestNPCData[2]!=1) {
										ForestNPCData[2]=0
									}
									
									switch (Rand(3)) {
										case 1:
											PointEntity(n.Collider, Collider)
											n.Frame = 2
											
										case 2:
											PointEntity(n.Collider, Collider)
											n.Frame = 201
											
										case 3:
											PointEntity(n.Collider, Collider)
											TurnEntity(n.Collider, 0, 90, 0)
											n.Frame = 299
											
									}
									
									n.State2 = 0
								}
							} else {
								
								ShowEntity(n.obj)
								ShowEntity(n.Collider)
								
								PositionEntity(n.Collider, EntityX(n.Collider), EntityY(fr.Forest_Pivot,True)+2.3, EntityZ(n.Collider))
								
								//[TODO]
								if (ForestNPC!=0) {
									if (ForestNPCData[2] == 0) {
										let docchance: int = 0
										let docamount: int = 0
										for (i of range(MaxItemAmount)) {
											if (Inventory(i)!=Null) {
												let docname: string = Inventory(i).itemtemplate.name
												if (docname == "Log #1" || docname == "Log #2" || docname == "Log #3") {
													//860,850,830,800
													docamount = docamount + 1
													docchance = docchance + 10*docamount
												}
											}
										}
										
										if (Rand(1,860-docchance) == 1) {
											ShowEntity(ForestNPC)
											ForestNPCData[2]=1
											if (Rand(2) == 1) {
												ForestNPCData[0]=0
											} else {
												ForestNPCData[0]=2
											}
											ForestNPCData[1]=0
											PositionEntity(ForestNPC,EntityX(n.Collider),EntityY(n.Collider)+0.5,EntityZ(n.Collider))
											RotateEntity(ForestNPC,0,EntityYaw(n.Collider),0)
											MoveEntity(ForestNPC,0.75,0,0)
											RotateEntity(ForestNPC,0,0,0)
											EntityTexture(ForestNPC,ForestNPCTex,ForestNPCData[0])
										} else {
											ForestNPCData[2]=2
										}
									} else if (ForestNPCData[2] == 1) {
										if (ForestNPCData[1] == 0.0) {
											if (Rand(200) == 1) {
												ForestNPCData[1]=FPSfactor
												EntityTexture(ForestNPC,ForestNPCTex,ForestNPCData[0]+1)
											}
										} else if (ForestNPCData[1]>0.0 && ForestNPCData[1]<5.0) {
											ForestNPCData[1] = Min(ForestNPCData[1]+FPSfactor,5.0)
										} else {
											ForestNPCData[1]=0
											EntityTexture(ForestNPC,ForestNPCTex,ForestNPCData[0])
										}
									}
								}
								
								if (n.State2 == 0) { //don't start moving until the player is looking
									if (EntityInView(n.Collider, Camera)) { 
										n.State2 = 1
										if (Rand(8) == 1) {
											PlaySound2(LoadTempSound("SFX/SCP/860/Cancer"+Rand(0,2)+".ogg"), Camera, n.Collider, 20.0)
										}										
									}
								} else {
									if (n.Frame<=199) {
										AnimateNPC(n, 2, 199, 0.5,False)
										if (n.Frame == 199) {
											n.Frame = 298
											PlaySound2(Step2SFX(Rand(3,5)), Camera, n.Collider, 15.0)
										}
									} else if (n.Frame <= 297) {
										PointEntity(n.Collider, Collider)
										
										AnimateNPC(n, 200, 297, 0.5, False)
										if (n.Frame == 297) {
											n.Frame=298
											PlaySound2(Step2SFX(Rand(3,5)), Camera, n.Collider, 15.0)
										}
									} else {
										angle = CurveAngle(point_direction(EntityX(n.Collider),EntityZ(n.Collider),EntityX(Collider),EntityZ(Collider)),EntityYaw(n.Collider)+90,20.0)
										
										RotateEntity(n.Collider, 0, angle-90, 0, True)
										
										AnimateNPC(n, 298, 316, n.CurrSpeed*10)

										n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 10.0)
										MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
										
										if (dist>15.0) {
											PositionEntity(n.Collider, 0,-110,0)
											n.State = 0
											n.State2 = 0
										}
									}									
								}
							}
							
							ResetEntity(n.Collider)
						case 2: //appears on the path and starts to walk towards the player
							ShowEntity(n.obj)
							ShowEntity(n.Collider)
							
							prevFrame = n.Frame
							
							if (EntityY(n.Collider)<= -100) {
								//transform the position of the player to the local coordinates of the forest
								TFormPoint(EntityX(Collider),EntityY(Collider),EntityZ(Collider),0,fr.Forest_Pivot)
								
								//calculate the indices of the forest cell the player is in
								x = Floor((TFormedX()+6.0)/12.0)
								z = Floor((TFormedZ()+6.0)/12.0)
								
								for (x2 of range(Max(x-1,1), Min(x+1,gridsize) + 1)) {
									for (z2 of range(Max(z-1,1), Min(z+1,gridsize) + 1)) {
										//find a nearby cell that's on the path and NOT the cell the player is in
										if (fr.grid[(z2*gridsize)+x2]>0 && (x2!=x || z2!=z) && (x2 == x || z2 == z)) {
											
											//transform the position of the cell back to world coordinates
											TFormPoint(x2*12.0, 0,z2*12.0, fr.Forest_Pivot,0)
											
											PositionEntity(n.Collider, TFormedX(), EntityY(fr.Forest_Pivot,True)+1.0,TFormedZ())
											
											DebugLog(TFormedX()+", "+TFormedZ())
											
											if (EntityInView(n.Collider, Camera)) {
												BlinkTimer=-10
											} else {
												x2 = gridsize
												break
											}
										}
									}
								}
							} else {
								angle = CurveAngle(Find860Angle(n, fr),EntityYaw(n.Collider)+90,80.0)
								
								RotateEntity(n.Collider, 0, angle-90, 0, True)
								
								n.CurrSpeed = CurveValue(n.Speed*0.3, n.CurrSpeed, 50.0)
								MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
								
								AnimateNPC(n, 494, 569, n.CurrSpeed*25)
								
								if (n.State2 == 0) {
									if (dist<8.0) {
										if (EntityInView(n.Collider,Camera)) {
											PlaySound_Strict(LoadTempSound("SFX/SCP/860/Chase"+Rand(1,2)+".ogg"))
											
											PlaySound2(LoadTempSound("SFX/SCP/860/Cancer"+Rand(0,2)+".ogg"), Camera, n.Collider)	
											n.State2 = 1
										}										
									}
								}
								
								if (CurrSpeed > 0.03) { //the player is running
									n.State3 = n.State3 + FPSfactor
									if (Rnd(5000)<n.State3) {
										temp = True
										if (n.SoundChn != 0) {
											if (ChannelPlaying (n.SoundChn)) {temp = False}
										}
										if (temp) {
											n.SoundChn = PlaySound2(LoadTempSound("SFX/SCP/860/Cancer"+Rand(0,2)+".ogg"), Camera, n.Collider)
										}
									}
								} else {
									n.State3 = Max(n.State3 - FPSfactor,0)
								}
								
								if (dist<4.5 || n.State3 > Rnd(200,250)) {
									n.SoundChn = PlaySound2(LoadTempSound("SFX/SCP/860/Cancer"+Rand(3,5)+".ogg"), Camera, n.Collider)
									n.State = 3
								}
								
								if (dist > 20.0) {
									n.State = 0
									n.State2 = 0
									PositionEntity(n.Collider, 0,-110,0)
								}
							}
							
							//535, 568
							if ((prevFrame < 533 && n.Frame>=533) || (prevFrame > 568 && n.Frame<2)) {
								PlaySound2(Step2SFX(Rand(3,5)), Camera, n.Collider, 15.0, 0.6)
							}
							
						case 3: //runs towards the player and attacks
							ShowEntity(n.obj)
							ShowEntity(n.Collider)
							
							prevFrame = n.Frame
							
							angle = CurveAngle(Find860Angle(n, fr),EntityYaw(n.Collider)+90,40.0)
							
							RotateEntity(n.Collider, 0, angle-90, 0, True)
							
							if (n.Sound == 0) {
								n.Sound = LoadSound_Strict("SFX/General/Slash1.ogg")
							}
							if (n.Sound2 == 0) {
								n.Sound2 = LoadSound_Strict("SFX/General/Slash2.ogg")
							}
							
							//if close enough to attack OR already attacking, play the attack anim
							if (dist<1.1 || (n.Frame>451 && n.Frame<493) || KillTimer < 0) {
								DeathMSG = ""
								
								n.CurrSpeed = CurveValue(0.0, n.CurrSpeed, 5.0)
								
								AnimateNPC(n, 451,493, 0.5, False)
								
								if (prevFrame < 461 && n.Frame>=461) {
									if (KillTimer >= 0) {
										Kill()
										KillAnim = 0
									}
									PlaySound_Strict(n.Sound)
								}
								if (prevFrame < 476 && n.Frame>=476) {
									PlaySound_Strict(n.Sound2)
								}
								if (prevFrame < 486 && n.Frame>=486) {
									PlaySound_Strict(n.Sound2)
								}
							} else {
								n.CurrSpeed = CurveValue(n.Speed*0.8, n.CurrSpeed, 10.0)
								
								AnimateNPC(n, 298, 316, n.CurrSpeed*10)
								
								if (prevFrame < 307 && n.Frame>=307) {
									PlaySound2(Step2SFX(Rand(3,5)), Camera, n.Collider, 10.0)
								}
							}
							
							MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
					}
					
					if (n.State != 0) {
						RotateEntity(n.Collider, 0, EntityYaw(n.Collider), 0, True	)
						
						PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider)-0.1, EntityZ(n.Collider))
						RotateEntity(n.obj, EntityPitch(n.Collider)-90, EntityYaw(n.Collider), EntityRoll(n.Collider), True)
						
						if (dist > 8.0) {
							ShowEntity(n.obj2)
							EntityAlpha(n.obj2, Min(dist-8.0,1.0))
							
							PositionEntity(n.obj2, EntityX(n.obj), EntityY(n.obj) , EntityZ(n.obj))
							RotateEntity(n.obj2, 0, EntityYaw(n.Collider) - 180, 0)
							MoveEntity(n.obj2, 0, 30.0*0.025, -33.0*0.025)
							
							//render distance is set to 8.5 inside the forest,
							//so we need to cheat a bit to make the eyes visible if they're further than that
							pvt = CreatePivot()
							PositionEntity(pvt, EntityX(Camera),EntityY(Camera),EntityZ(Camera))
							PointEntity(pvt, n.obj2)
							MoveEntity(pvt, 0,0,8.0)
							PositionEntity(n.obj2, EntityX(pvt),EntityY(pvt),EntityZ(pvt))
							FreeEntity(pvt)
						} else {
							HideEntity(n.obj2)
						}
					}
				}
				 
			case NPCtype939:
				
				
				if (PlayerRoom.RoomTemplate.Name != "room3storage") {
					n.State = 66
				}
				
				//state is set to 66 in the room3storage-event if player isn't inside the room
				if (n.State < 66) {
					switch (n.State) {
						case 0:
							AnimateNPC(n, 290,405,0.1)
						case 1:
							
							if (n.Frame>=644 && n.Frame<683) { //finish the walking animation
								n.CurrSpeed = CurveValue(n.Speed*0.05, n.CurrSpeed, 10.0)
								AnimateNPC(n, 644,683,28*n.CurrSpeed*4,False)
								if (n.Frame>=682) {
									n.Frame = 175
								}
							} else {
								n.CurrSpeed = CurveValue(0, n.CurrSpeed, 5.0)
								AnimateNPC(n, 175,297,0.22,False)
								if (n.Frame>=296) {n.State = 2}
							}
							
							n.LastSeen = 0
							
							MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
							
						case 2:
							n.State2 = Max(n.State2, (n.PrevState-3))
							
							dist = EntityDistance(n.Collider, PlayerRoom.Objects[n.State2])
							
							n.CurrSpeed = CurveValue(n.Speed*0.3*Min(dist,1.0), n.CurrSpeed, 10.0)
							MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
							
							prevFrame = n.Frame
							AnimateNPC(n, 644,683,28*n.CurrSpeed) //walk
														
							if ((prevFrame < 664 && n.Frame >= 664) || (prevFrame > 673 && n.Frame < 654)) {
								PlaySound2(StepSFX(4, 0, Rand(0,3)), Camera, n.Collider, 12.0)
								if (Rand(10) == 1) {
									temp = False
									if (n.SoundChn = 0) { 
										temp = true
									} else if (!ChannelPlaying(n.SoundChn)) {
										temp = true
									}
									if (temp) {
										if (n.Sound != 0) {
											FreeSound_Strict(n.Sound)
											n.Sound = 0
										}
										n.Sound = LoadSound_Strict("SFX/SCP/939/"+(n.ID % 3)+"Lure"+Rand(1,10)+".ogg")
										n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider)
									}
								}
							}
							
							PointEntity(n.obj, PlayerRoom.Objects[n.State2])
							RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),20.0), 0)
							
							if (dist<0.4) {
								n.State2 = n.State2 + 1
								if (n.State2 > n.PrevState) {
									n.State2 = (n.PrevState-3)
								}
								n.State = 1
							}
							
						case 3:
							if (EntityVisible(Collider, n.Collider)) {
								if (n.Sound2 == 0) {
									n.Sound2 = LoadSound_Strict("SFX/General/Slash1.ogg")
								}
								
								n.EnemyX = EntityX(Collider)
								n.EnemyZ = EntityZ(Collider)
								n.LastSeen = 10*7
							}
							
							if (n.LastSeen > 0 && (!NoTarget)) {
								prevFrame = n.Frame
								
								if ((n.Frame>=18.0 && n.Frame<68.0)) {
									n.CurrSpeed = CurveValue(0, n.CurrSpeed, 5.0)
									AnimateNPC(n, 18,68,0.5,True)
									
									//hasn't hit
									temp = False
									
									if (prevFrame < 24 && n.Frame>=24) {
										temp = True
									} else if (prevFrame < 57 && n.Frame>=57) {
										temp = True
									}
									
									if (temp) {
										if (Distance(n.EnemyX, n.EnemyZ, EntityX(n.Collider), EntityZ(n.Collider))<1.5) {
											PlaySound_Strict(n.Sound2)
											Injuries = Injuries + Rnd(1.5, 2.5)-WearingVest*0.5
											BlurTimer = 500		
										} else {
											n.Frame	 = 449
										}
									}
									
									if (Injuries>4.0) {
										DeathMSG=Chr(34)+"All four (4) escaped SCP-939 specimens have been captured and recontained successfully. "
										DeathMSG=DeathMSG+"Three (3) of them made quite a mess at Storage Area 6. A cleaning team has been dispatched."+Chr(34)
										Kill()
										if (!GodMode) {
											n.State = 5
										}
									}								
								} else {
									if (n.LastSeen == 10*7) {
										n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 20.0)
										
										AnimateNPC(n, 449,464,6*n.CurrSpeed) //run
										
										if ((prevFrame<452 && n.Frame>=452) || (prevFrame<459 && n.Frame>=459)) {
											PlaySound2(StepSFX(1, 1, Rand(0,7)), Camera, n.Collider, 12.0)
										}										
										
										if (Distance(n.EnemyX, n.EnemyZ, EntityX(n.Collider), EntityZ(n.Collider))<1.1) { //player is visible
											n.Frame = 18
										}
									} else {
										n.CurrSpeed = CurveValue(0, n.CurrSpeed, 5.0)
										AnimateNPC(n, 175,297,5*n.CurrSpeed,True)	
									}
								}
								
								angle = VectorYaw(n.EnemyX-EntityX(n.Collider), 0.0, n.EnemyZ-EntityZ(n.Collider))
								RotateEntity(n.Collider, 0, CurveAngle(angle,EntityYaw(n.Collider),15.0), 0)
								
								MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
								
								n.LastSeen = n.LastSeen - FPSfactor
							} else {
								n.State = 2
							}
							
						case 5:
							if (n.Frame<68) {
								AnimateNPC(n, 18,68,0.5,False) //finish the attack animation
							} else {
								AnimateNPC(n, 464,473,0.5,False) //attack to idle
							}
							
					}
					
					if (n.State < 3 && (!NoTarget) && (!n.IgnorePlayer)) {
						dist = EntityDistance(n.Collider, Collider)
						
						if (dist < 4.0) {
							dist = dist - EntityVisible(Collider, n.Collider)
						}
						if (PlayerSoundVolume*1.2>dist || dist < 1.5) {
							if (n.State3 == 0) {
								if (n.Sound != 0) {
									FreeSound_Strict(n.Sound)
									n.Sound = 0
								}
								n.Sound = LoadSound_Strict("SFX/SCP/939/"+(n.ID % 3)+"Attack"+Rand(1,3)+".ogg")
								n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider)										
								
								PlaySound_Strict(LoadTempSound("SFX/SCP/939/attack.ogg"))
								n.State3 = 1
							}
							
							n.State = 3
						} else if (PlayerSoundVolume*1.6>dist) {
							if (n.State!=1 && n.Reload <= 0) {
								if (n.Sound != 0) {
									FreeSound_Strict(n.Sound)
									n.Sound = 0
								}
								n.Sound = LoadSound_Strict("SFX/SCP/939/"+(n.ID % 3)+"Alert"+Rand(1,3)+".ogg")
								n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider)	
								
								n.Frame = 175
								n.Reload = 70 * 3
							}
							
							n.State = 1
							
						}
						
						n.Reload = n.Reload - FPSfactor
						
					}				
					
					RotateEntity(n.Collider, 0, EntityYaw(n.Collider), 0, True	)
					
					PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider)-0.28, EntityZ(n.Collider))
					RotateEntity(n.obj, EntityPitch(n.Collider)-90, EntityYaw(n.Collider), EntityRoll(n.Collider), True)
				}
				
			case NPCtype066:
				
				dist = Distance(EntityX(Collider),EntityZ(Collider),EntityX(n.Collider),EntityZ(n.Collider))
				
				switch (n.State) {
					case 0: 
						//idle: moves around randomly from waypoint to another if the player is far enough
						//starts staring at the player when the player is close enough
						
						if (dist > 20.0) {
							AnimateNPC(n, 451, 612, 0.2, True)
							
							if (n.State2 < MilliSecs2()) {
								for (w of WayPoints.each) {
									if (w.door == Null) {
										if (Abs(EntityX(w.obj,True)-EntityX(n.Collider))<4.0) {
											if (Abs(EntityZ(w.obj,True)-EntityZ(n.Collider))<4.0) {
												PositionEntity(n.Collider, EntityX(w.obj,True), EntityY(w.obj,True)+0.3, EntityZ(w.obj,True))
												ResetEntity(n.Collider)
												break
											}
										}
									}
								}
								n.State2 = MilliSecs2()+5000
							}
						} else if (dist < 8.0) {
							n.LastDist = Rnd(1.0, 2.5)
							n.State = 1
						}
					case 1: //staring at the player
						
						if (n.Frame<451) {
							angle = WrapAngle(CurveAngle(DeltaYaw(n.Collider, Collider)-180, (AnimTime(n.obj)-2.0)/1.2445, 15.0))
							//0->360 = 2->450
							SetNPCFrame(n,angle*1.2445+2.0)
						} else {
							AnimateNPC(n, 636, 646, 0.4, False)
							if (n.Frame == 646) {SetNPCFrame(n,2)}
						}
						dist = Distance(EntityX(Collider),EntityZ(Collider),EntityX(n.Collider),EntityZ(n.Collider))
						
						if (Rand(700) == 1) {
							PlaySound2(LoadTempSound("SFX/SCP/066/Eric"+Rand(1,3)+".ogg"),Camera, n.Collider, 8.0)
						}
						
						if (dist < 1.0+n.LastDist) {
							n.State = Rand(2,3)
						}
					case 2: //roll towards the player and make a sound, and then escape	
						if (n.Frame < 647) {
							angle = CurveAngle(0, (AnimTime(n.obj)-2.0)/1.2445, 5.0)
							
							if (angle < 5 || angle > 355) {
								SetNPCFrame(n,647)
							} else {
								SetNPCFrame(n,angle*1.2445+2.0)
							}
						} else {
							if (n.Frame == 683) {
								if (n.State2 == 0) {
									if (Rand(2) == 1) {
										PlaySound2(LoadTempSound("SFX/SCP/066/Eric"+Rand(1,3)+".ogg"),Camera, n.Collider, 8.0)
									} else {
										PlaySound2(LoadTempSound("SFX/SCP/066/Notes"+Rand(1,6)+".ogg"), Camera, n.Collider, 8.0)
									}									
									
									switch (Rand(1,6)) {
										case 1:
											if (n.Sound2 == 0) {
												n.Sound2=LoadSound_Strict("SFX/SCP/066/Beethoven.ogg")
											}
											n.SoundChn2 = PlaySound2(n.Sound2, Camera, n.Collider)
											DeafTimer = 70*(45+(15*SelectedDifficulty.aggressiveNPCs))
											DeafPlayer = True
											CameraShake = 10.0
										case 2:
											n.State3 = Rand(700,1400)
										case 3:
											for (d of Doors.each) {
												if (!d.locked && d.KeyCard == 0 && d.Code == "") {
													if (Abs(EntityX(d.frameobj)-EntityX(n.Collider))<16.0) {
														if (Abs(EntityZ(d.frameobj)-EntityZ(n.Collider))<16.0) {
															UseDoor(d, False)
														}
													}
												}
											}
										case 4:
											if (!PlayerRoom.RoomTemplate.DisableDecals) {
												CameraShake = 5.0
												de.Decals = CreateDecal(1, EntityX(n.Collider), 0.01, EntityZ(n.Collider), 90, Rand(360), 0)
												de.Size = 0.3
												UpdateDecals
												PlaySound_Strict(LoadTempSound("SFX/General/BodyFall.ogg"))
												if (Distance(EntityX(Collider),EntityZ(Collider),EntityX(n.Collider),EntityZ(n.Collider))<0.8) {
													Injuries = Injuries + Rnd(0.3,0.5)
												}
											}
									}
								}
								
								n.State2 = n.State2+FPSfactor
								if (n.State2>70) {
									n.State = 3
									n.State2 = 0
								}
							} else {
								n.CurrSpeed = CurveValue(n.Speed*1.5, n.CurrSpeed, 10.0)
								PointEntity(n.obj, Collider)
								RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj)-180, EntityYaw(n.Collider), 10), 0)
								
								AnimateNPC(n, 647, 683, n.CurrSpeed*25, False)
								
								MoveEntity(n.Collider, 0,0,-n.CurrSpeed*FPSfactor)
								
							}
						}
					case 3:
						PointEntity(n.obj, Collider)
						angle = CurveAngle(EntityYaw(n.obj)+n.Angle-180, EntityYaw(n.Collider), 10)
						RotateEntity(n.Collider, 0, angle, 0)
						
						n.CurrSpeed = CurveValue(n.Speed, n.CurrSpeed, 10.0)
						MoveEntity(n.Collider, 0,0,n.CurrSpeed*FPSfactor)
												
						if (Rand(100)=1) {
							n.Angle = Rnd(-20,20)
						}
						
						n.State2 = n.State2 + FPSfactor
						if (n.State2>250) {
							AnimateNPC(n, 684, 647, -n.CurrSpeed*25, False)
							if (n.Frame=647) {
								n.State = 0
								n.State2=0
							}
						} else {
							AnimateNPC(n, 684, 647, -n.CurrSpeed*25)
						}		
				}
				
				if (n.State > 1) {
					if (n.Sound == 0) {
						n.Sound = LoadSound_Strict("SFX/SCP/066/Rolling.ogg")
					}
					if (n.SoundChn!=0) {
						if (ChannelPlaying(n.SoundChn)) {
							n.SoundChn = LoopSound2(n.Sound, n.SoundChn, Camera, n.Collider, 20)
						}
					} else {
						n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider, 20)
					}					
				}
				
				if (n.State3 > 0) {
					n.State3 = n.State3-FPSfactor
					LightVolume = TempLightVolume-TempLightVolume*Min(Max(n.State3/500,0.01),0.6)
					HeartBeatRate = Max(HeartBeatRate, 130)
					HeartBeatVolume = Max(HeartBeatVolume,Min(n.State3/1000,1.0))
				}
				
				if (ChannelPlaying(n.SoundChn2)) {
					UpdateSoundOrigin2(n.SoundChn2,Camera,n.Collider,20)
					BlurTimer = Max((5.0-dist)*300,0)
				}
				
				PositionEntity(n.obj, EntityX(n.Collider), EntityY(n.Collider) - 0.2, EntityZ(n.Collider))
				
				RotateEntity(n.obj, EntityPitch(n.Collider)-90, EntityYaw(n.Collider), 0)
				
			case NPCtype966:
				
				dist = EntityDistance(n.Collider,Collider)
				
				if (dist<HideDistance) {
					
					//n.state = the "general" state (idle/wander/attack/echo etc)
					//n.state2 = timer for doing raycasts
					
					prevFrame = n.Frame
					
					if (n.Sound > 0) {
						temp = 0.5
						//the ambient sound gets louder when the npcs are attacking
						if (n.State > 0) {
							temp = 1.0
						}
						
						n.SoundChn = LoopSound2(n.Sound, n.SoundChn, Camera, Camera, 10.0,temp)
					}
					
					temp = Rnd(-1.0,1.0)
					PositionEntity(n.obj,EntityX(n.Collider,True),EntityY(n.Collider,True)-0.2,EntityZ(n.Collider,True))
					RotateEntity(n.obj,-90.0,EntityYaw(n.Collider),0.0)
					
					if (WearingNightVision=0) {
						HideEntity(n.obj)
						if (dist<1 && n.Reload <= 0 && MsgTimer <= 0) {
							switch (Rand(6)) {
								case 1:
									Msg="You feel something breathing right next to you."
								case 2:
									Msg=Chr(34)+"It feels like something's in this room with me."+Chr(34)
								case 3:
									Msg="You feel like something is here with you, but you do not see anything."
								case 4:
									Msg=Chr(34)+"Is my mind playing tricks on me or is there someone else here?"+Chr(34)
								case 5:
									Msg="You feel like something is following you."
								case 6:
									Msg="You can feel something near you, but you are unable to see it. Perhaps its time is now."
							}
                            n.Reload = 20*70
							MsgTimer=8*70
						}
						n.Reload = n.Reload - FPSfactor
						
					} else {
						ShowEntity(n.obj)
					}
					
					if (n.State3>5*70) {
						if (n.State3<1000.0) {
							for (n2 of NPCs.each) {
								if (n2.NPCtype == n.NPCtype) {
									n2.State3=1000.0
								}
							}
						}
						
						n.State = Max(n.State,8)
						n.State3 = 1000.0					
						
					}
					
					if (Stamina<10) {
						n.State3=n.State3+FPSfactor
					} else if (n.State3 < 900.0) {
						n.State3=Max(n.State3-FPSfactor*0.2,0.0)
					}
					
					if (n.State != 10) {
						n.LastSeen = 0
					}
					
					switch (n.State) {
						case 0: //idle, standing
							//If n.Frame>2300.0 Then
							if (n.Frame>556.0) {
								AnimateNPC(n, 628, 652, 0.25, False)
								if (n.Frame>651.0) {
									SetNPCFrame(n, 2)
								}
							} else {
								//AnimateNPC(n, 201, 1015, 1.0, False)
								AnimateNPC(n, 2, 214, 0.25, False)
								
								//echo/stare/walk around periodically
								//If n.Frame>1014.0 Then
								if (n.Frame>213.0) {
									if (Rand(3) == 1 && dist<4) {
										n.State = Rand(1,4)
									} else {
										n.State = Rand(5,6)								
									}
								}
								
								//echo if player gets close
								if (dist<2.0) {
									n.State=Rand(1,4)
								} 							
							}
							
							n.CurrSpeed = CurveValue(0.0, n.CurrSpeed, 10.0)
							
							MoveEntity(n.Collider,0,0,n.CurrSpeed)
							
						case 1,2: //echo
							AnimateNPC(n, 214, 257, 0.25, False)
							if (n.Frame > 256.0) {n.State = 0}
							
							if (n.Frame>228.0 && prevFrame<=228.0) {
								PlaySound2(LoadTempSound("SFX/SCP/966/Echo"+Rand(1,3)+".ogg"), Camera, n.Collider)
							}
							
							angle = VectorYaw(EntityX(Collider)-EntityX(n.Collider),0,EntityZ(Collider)-EntityZ(n.Collider))
							RotateEntity(n.Collider,0.0,CurveAngle(angle,EntityYaw(n.Collider),20.0),0.0)
							
							if (n.State3<900) {
								BlurTimer = ((Sin(MilliSecs2()/50)+1.0)*200)/dist
								
								if (WearingNightVision>0) {GiveAchievement(Achv966)}
								
								if ((!Wearing714) && (WearingGasMask<3) && (WearingHazmat<3) && dist<16) {
									BlinkEffect = Max(BlinkEffect, 1.5)
									BlinkEffectTimer = 1000
									
									StaminaEffect = 2.0
									StaminaEffectTimer = 1000
									
									if (MsgTimer<=0 && StaminaEffect<1.5) {
										switch (Rand(4)) {
											case 1:
												Msg = "You feel exhausted."
											case 2:
												Msg = Chr(34)+"Could really go for a nap now..."+Chr(34)
											case 3:
												Msg = Chr(34)+"If I wasn't in this situation I would take a nap somewhere."+Chr(34)
											case 4:
												Msg = "You feel restless."
										}
										
										MsgTimer = 7*70
									}
								}							
							}
							
						case 3,4: //stare at player
							if (n.State == 3) {
								AnimateNPC(n, 257, 332, 0.25, False)
								if (n.Frame > 331.0) {
									n.State = 0
								}
							} else {
								AnimateNPC(n, 332, 457, 0.25, False)
								if (n.Frame > 456.0) {
									n.State = 0
								}
							}
							
							if (n.Frame>271.0 && prevFrame<=271.0 || n.Frame>354 || n.Frame>314.0 && prevFrame<=314.0 || n.Frame>301.0 && prevFrame<=301.0) {
								PlaySound2(LoadTempSound("SFX/SCP/966/Idle"+Rand(1,3)+".ogg"), Camera, n.Collider)
							}
							
							angle = VectorYaw(EntityX(Collider)-EntityX(n.Collider),0,EntityZ(Collider)-EntityZ(n.Collider))
							RotateEntity(n.Collider,0.0,CurveAngle(angle,EntityYaw(n.Collider),20.0),0.0)
						case 5,6,8: //walking or chasing
							if (n.Frame<580.0 && n.Frame>214.0) { //start walking
								AnimateNPC(n, 556, 580, 0.25, False)
							} else {
								if (n.CurrSpeed >= 0.005) {
									AnimateNPC(n, 580, 628, n.CurrSpeed*25.0)
								} else {
									AnimateNPC(n, 2, 214, 0.25)
								}
								
								//chasing the player
								if (n.State = 8 && dist<32) {
									if (n.PathTimer <= 0) {
										n.PathStatus = FindPath (n, EntityX(Collider,True), EntityY(Collider,True), EntityZ(Collider,True))
										n.PathTimer = 40*10
										n.CurrSpeed = 0
									}
									n.PathTimer = Max(n.PathTimer-FPSfactor,0)
									
									if (!EntityVisible(n.Collider,Collider)) {
										if (n.PathStatus = 2) {
											n.CurrSpeed = 0
											SetNPCFrame(n,2)
										} else if (n.PathStatus == 1) {
											if (n.Path[n.PathLocation]=Null) { 
												if (n.PathLocation > 19) { 
													n.PathLocation = 0
													n.PathStatus = 0
												} else {
													n.PathLocation = n.PathLocation + 1
												}
											} else {
												n.Angle = VectorYaw(EntityX(n.Path[n.PathLocation].obj,True)-EntityX(n.Collider),0,EntityZ(n.Path[n.PathLocation].obj,True)-EntityZ(n.Collider))
												
												dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
												
												temp = True
												if (dist2 < 0.8) { 
													if (n.Path[n.PathLocation].door!=Null) {
														if (!n.Path[n.PathLocation].door.IsElevatorDoor) {
															if ((n.Path[n.PathLocation].door.locked || n.Path[n.PathLocation].door.KeyCard!=0 || n.Path[n.PathLocation].door.Code!="") && (!n.Path[n.PathLocation].door.open)) {
																temp = False
															} else {
																if (n.Path[n.PathLocation].door.open = False && (n.Path[n.PathLocation].door.buttons[0]!=0 || n.Path[n.PathLocation].door.buttons[1]!=0)) {
																	UseDoor(n.Path[n.PathLocation].door, False)
																}
															}
														}
													}
													if (dist2 < 0.3) {
														n.PathLocation = n.PathLocation + 1
													}
												}
												
												if (!temp) {
													n.PathStatus = 0
													n.PathLocation = 0
													n.PathTimer = 40*10
												}
											}
											
											n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,10.0)
										} else if (n.PathStatus == 0) {
											n.CurrSpeed = CurveValue(0,n.CurrSpeed,10.0)
										}
									} else {
										n.Angle = VectorYaw(EntityX(Collider)-EntityX(n.Collider),0,EntityZ(Collider)-EntityZ(n.Collider))
										n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,10.0)
										
										if (dist<1.0) {n.State=10}
										
									}
								} else {
									if (MilliSecs2() > n.State2 && dist<16.0) {
										HideEntity(n.Collider)
										EntityPick(n.Collider, 1.5)
										if (PickedEntity() != 0) {
											n.Angle = EntityYaw(n.Collider)+Rnd(80,110)
										}
										ShowEntity(n.Collider)
										
										n.State2=MilliSecs2()+1000
										
										if (Rand(5)=1) {n.State=0}
									}	
									
									n.CurrSpeed = CurveValue(n.Speed*0.5, n.CurrSpeed, 20.0)
									
								}
								
								if ((prevFrame < 604 && n.Frame>=604) || (prevFrame < 627 && n.Frame>=627)) {
                                    PlaySound2(StepSFX(4,0,Rand(0,3)),Camera, n.Collider, 7.0, Rnd(0.5,0.7))
                                }
								
								RotateEntity(n.Collider, 0, CurveAngle(n.Angle,EntityYaw(n.Collider),10.0),0)
								
								MoveEntity(n.Collider,0,0,n.CurrSpeed*FPSfactor)
							}
						case 10: //attack
							if (n.LastSeen=0) {
								PlaySound2(LoadTempSound("SFX/SCP/966/Echo"+Rand(1,3)+".ogg"), Camera, n.Collider)
								n.LastSeen = 1
							}
							
							if (n.Frame>557.0) {
								AnimateNPC(n, 628, 652, 0.25, False)
								if (n.Frame>651.0) {
									switch (Rand(3)) {
										case 1:
											SetNPCFrame(n, 458)
										case 2:
											SetNPCFrame(n, 488)
										case 3:
											SetNPCFrame(n, 518)
									}
								}
							} else {								
								if (n.Frame <= 487) {
									AnimateNPC(n, 458, 487, 0.3, False)
									if (n.Frame > 486.0) {
										n.State = 8
									}
								} else if (n.Frame <= 517) {
									AnimateNPC(n, 488, 517, 0.3, False)
									if (n.Frame > 516.0) {
										n.State = 8
									}
								} else if (n.Frame <= 557) {
									AnimateNPC(n, 518, 557, 0.3, False)
									if (n.Frame > 556.0) {
										n.State = 8
									}
								}
							}
							
							if (dist<1.0) {
								if (n.Frame>470.0 && prevFrame<=470.0 || n.Frame>500.0 && prevFrame<=500.0 || n.Frame>527.0 && prevFrame<=527.0) {
									PlaySound2(LoadTempSound("SFX/General/Slash"+Rand(1,2)+".ogg"), Camera, n.Collider)
									Injuries = Injuries + Rnd(0.5,1.0)								
								}
							}
							
							n.Angle = VectorYaw(EntityX(Collider)-EntityX(n.Collider),0,EntityZ(Collider)-EntityZ(n.Collider))
							RotateEntity(n.Collider, 0, CurveAngle(n.Angle,EntityYaw(n.Collider),30.0),0)
							
					}
				} else {
					HideEntity(n.obj)
					if (Rand(600)=1) {
						TeleportCloser(n)
					}
				}
				
				
			case NPCtype1048a:
				
				switch (n.State) {
						
					case 1:
						n.PathStatus = FindPath(n, n.EnemyX,n.EnemyY+0.1,n.EnemyZ)
						//649, 677
				}
				//[End block]
			case NPCtype1499:
				
				//n\State: Current State of the NPC
				//n\State2: A second state variable (dependend on the current NPC's n\State)
				//n\State3: Determines if the NPC will always be aggressive against the player
				//n\PrevState: Determines the type/behaviour of the NPC
				//	0 = Normal / Citizen
				//	1 = Stair guard / Guard next to king
				//	2 = King
				//	3 = Front guard
				
				prevFrame = n.Frame
				
				if ((!n.Idle) && EntityDistance(n.Collider,Collider)<HideDistance*3) {
					if (n.PrevState = 0) {
						if (n.State == 0 || n.State == 2) {
							for (let n2 of NPCs.each) {
								if (n2.NPCtype = n.NPCtype && n2 != n) {
									if (n2.State != 0 && n2.State != 2) {
										if (n2.PrevState = 0) {
											n.State = 1
											n.State2 = 0
											break
										}
									}
								}
							}
						}
					}
					
					switch (n.State) {
						case 0:
							
							if (n.PrevState=0) {
								if (n.CurrSpeed = 0.0) {
									if (n.Reload=0) {
										if (n.State2 < 500.0*Rnd(1,3)) {
											n.CurrSpeed = 0.0
											n.State2 = n.State2 + FPSfactor
										} else {
											if (n.CurrSpeed = 0.0) {
												n.CurrSpeed = n.CurrSpeed + 0.0001
											}
										}
									} else {
										if (n.State2 < 1500) {
											n.CurrSpeed = 0.0
											n.State2 = n.State2 + FPSfactor
										} else {
											if (n.Target != Null) {
												if (n.Target.Target != Null) {
													n.Target.Target = Null
												}
												n.Target.Reload = 0
												n.Target.Angle = n.Target.Angle+Rnd(-45,45)
												n.Target = Null
												n.Reload = 0
												n.Angle = n.Angle+Rnd(-45,45)
											}
											if (n.CurrSpeed == 0.0) {
												n.CurrSpeed = n.CurrSpeed + 0.0001
											}
										}
									}
								} else {
									if (n.Target!=Null) {
										n.State2 = 0.0
									}
									
									if (n.State2 < 10000.0*Rnd(1,3)) {
										n.CurrSpeed = CurveValue(n.Speed,n.CurrSpeed,10.0)
										n.State2 = n.State2 + FPSfactor
									} else {
										n.CurrSpeed = CurveValue(0.0,n.CurrSpeed,50.0)
									}
									
									RotateEntity(n.Collider,0,CurveAngle(n.Angle,EntityYaw(n.Collider),10.0),0)
									
									if (n.Target=Null) {
										if (Rand(200) = 1) {
											n.Angle = n.Angle + Rnd(-45,45)
										}
										
										HideEntity(n.Collider)
										EntityPick(n.Collider, 1.5)
										if (PickedEntity() != 0) {
											n.Angle = EntityYaw(n.Collider)+Rnd(80,110)
										}
										ShowEntity(n.Collider)
									} else {
										n.Angle = EntityYaw(n.Collider) + DeltaYaw(n.Collider,n.Target.Collider)
										if (EntityDistance(n.Collider,n.Target.Collider)<1.5) {
											n.CurrSpeed = 0.0
											n.Target.CurrSpeed = 0.0
											n.Reload = 1
											n.Target.Reload = 1
											temp = Rand(0,2)
											if (temp == 0) {
												SetNPCFrame(n,296)
											} else if (temp == 1) {
												SetNPCFrame(n,856)
											} else {
												SetNPCFrame(n,905)
											}
											temp = Rand(0,2)
											if (temp == 0) {
												SetNPCFrame(n.Target,296)
											} else if (temp == 1) {
												SetNPCFrame(n.Target,856)
											} else {
												SetNPCFrame(n.Target,905)
											}
										}
									}
								}
							} else {
								RotateEntity(n.Collider,0,CurveAngle(n.Angle,EntityYaw(n.Collider),10.0),0)
							}
							
							if (n.CurrSpeed == 0.0) {
								if (n.Reload = 0 && n.PrevState!=2) {
									AnimateNPC(n,296,320,0.2)
								} else if (n.Reload == 0 && n.PrevState == 2) {
									//509-533
									//534-601
									if (n.Frame <= 532.5) {
										AnimateNPC(n,509,533,0.2,False)
									} else if (n.Frame > 533.5 && n.Frame <= 600.5) {
										AnimateNPC(n,534,601,0.2,False)
									} else {
										temp = Rand(0,1)
										if (temp == 0) {
											SetNPCFrame(n,509)
										} else {
											SetNPCFrame(n,534)
										}
									}
								} else {
									if (n.PrevState == 2) {
										AnimateNPC(n,713,855,0.2,False)
										if (n.Frame > 833.5) {
											PointEntity(n.obj,Collider)
											RotateEntity(n.Collider,0,CurveAngle(n.Angle,EntityYaw(n.Collider),10.0),0)
										}
									} else if (n.PrevState == 1) {
										AnimateNPC(n,602,712,0.2,False)
										if (n.Frame > 711.5) {
											n.Reload = 0
										}
									} else {
										if (n.Frame <= 319.5) {
											AnimateNPC(n,296,320,0.2,False)
										//856-904
										} else if (n.Frame > 320.5 && n.Frame < 903.5) {
											AnimateNPC(n,856,904,0.2,False)
										//905-953
										} else if (n.Frame > 904.5 && n.Frame < 952.5) {
											AnimateNPC(n,905,953,0.2,False)
										} else {
											temp = Rand(0,2)
											if (temp == 0) {
												SetNPCFrame(n,296)
											} else if (temp == 1) {
												SetNPCFrame(n,856)
											} else {
												SetNPCFrame(n,905)
											}
										}
									}
								}
							} else {
								if (n.ID % 2 == 0) {
									AnimateNPC(n,1,62,(n.CurrSpeed*28))
								} else {
									AnimateNPC(n,100,167,(n.CurrSpeed*28))
								}
								if (n.PrevState == 0) {
									if (n.Target == Null) {
										if (Rand(1,1200) == 1) {
											for (n2 of NPCs.each) {
												if (n2!=n) {
													if (n2.NPCtype == n.NPCtype) {
														if (n2.Target = Null) {
															if (n2.PrevState=0) {
																if (EntityDistance(n.Collider,n2.Collider)<20.0) {
																	n.Target = n2
																	n2.Target = n
																	n.Target.CurrSpeed = n.Target.CurrSpeed + 0.0001
																	break
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
							
							//randomly play the "screaming animation" and revert back to state 0
							if (n.Target == Null && n.PrevState == 0) {
								if (Rand(5000)=1) {
									n.State = 2
									n.State2 = 0
									
									if (!ChannelPlaying(n.SoundChn)) {
										dist = EntityDistance(n.Collider,Collider)
										if (dist < 20.0) {
											if (n.Sound != 0) {
												FreeSound_Strict(n.Sound)
												n.Sound = 0
											}
											n.Sound = LoadSound_Strict("SFX/SCP/1499/Idle"+Rand(1,4)+".ogg")
											n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider, 20.0)
										}
									}
								}
								
								if ((n.ID % 2 == 0) && (!NoTarget)) {
									dist = EntityDistance(n.Collider,Collider)
									if (dist < 10.0) {
										if (EntityVisible(n.Collider,Collider)) {
											//play the "screaming animation"
											n.State = 2
											if (dist < 5.0) {
												if (n.Sound != 0) {
													FreeSound_Strict(n.Sound)
													n.Sound = 0
												}
												n.Sound = LoadSound_Strict("SFX/SCP/1499/Triggered.ogg")
												n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider,20.0)
												
												n.State2 = 1 //if player is too close, switch to attack after screaming
												
												for (n2 of NPCs.each) {
													if (n2.NPCtype == n.NPCtype && n2 != n) {
														if (n2.PrevState == 0) {
															n2.State = 1
															n2.State2 = 0
														}
													}
												}
											} else {
												n.State2 = 0 //otherwise keep idling
											}
											
											n.Frame = 203
										}
									}
								}
							} else if (n.PrevState=1) {
								dist = EntityDistance(n.Collider,Collider)
								if ((!NoTarget)) {
									if (dist < 4.0) {
										if (EntityVisible(n.Collider,Collider)) {
											if (n.Sound != 0) {
												FreeSound_Strict(n.Sound)
												n.Sound = 0
											}
											n.Sound = LoadSound_Strict("SFX/SCP/1499/Triggered.ogg")
											n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider,20.0)
											
											n.State = 1
											
											n.Frame = 203
										}
									}
								}
							}
							
						case 1: //attacking the player
							
							if (NoTarget) {n.State = 0}
							
							if (PlayerRoom.RoomTemplate.Name == "dimension1499" && n.PrevState == 0) {
								ShouldPlay = 19
							}
							
							PointEntity(n.obj,Collider)
							RotateEntity(n.Collider,0,CurveAngle(EntityYaw(n.obj),EntityYaw(n.Collider),20.0),0)
							
							dist = EntityDistance(n.Collider,Collider)
							
							if (n.State2 = 0.0) {
								if (n.PrevState=1) {
									n.CurrSpeed = CurveValue(n.Speed*2.0,n.CurrSpeed,10.0)
									if (n.Target!=Null) {
										n.Target.State = 1
									}
								} else {
									n.CurrSpeed = CurveValue(n.Speed*1.75,n.CurrSpeed,10.0)
								}
								
								if (n.ID % 2 = 0) Then
									AnimateNPC(n,1,62,(n.CurrSpeed*28))
								} else {
									AnimateNPC(n,100,167,(n.CurrSpeed*28))
								}
							}
							
							if (dist < 0.75) {
								if ((n.ID % 2 == 0) || n.State3 == 1 || n.PrevState==1 || n.PrevState==3 || n.PrevState==4) {
									n.State2 = Rand(1,2)
									n.State = 3
									if (n.State2 = 1) {
										SetNPCFrame(n,63)
									} else {
										SetNPCFrame(n,168)
									}
								} else {
									n.State = 4
								}
							}
							
						case 2: //play the "screaming animation" and switch to n.state2 after it's finished
							
							n.CurrSpeed = 0.0
							AnimateNPC(n,203,295,0.1,False)
							
							if (n.Frame > 294.0) {
								n.State = n.State2
							}
							
						case 3: //slashing at the player
							
							n.CurrSpeed = CurveValue(0.0,n.CurrSpeed,5.0)
							dist = EntityDistance(n.Collider,Collider)
							if (n.State2 = 1) {
								AnimateNPC(n,63,100,0.6,False)
								if (prevFrame < 89 && n.Frame>=89) {
									if (dist > 0.85 || Abs(DeltaYaw(n.Collider,Collider))>60.0) {
										//Miss
									} else {
										Injuries = Injuries + Rnd(0.75,1.5)
										PlaySound2(LoadTempSound("SFX/General/Slash"+Rand(1,2)+".ogg"), Camera, n.Collider)
										if (Injuries > 10.0) {
											Kill()
											if (PlayerRoom.RoomTemplate.Name$ = "dimension1499") {
												DeathMSG = "All personnel situated within Evacuation Shelter LC-2 during the breach have been administered "
												DeathMSG = DeathMSG + "Class-B amnestics due to Incident 1499-E. The Class D subject involved in the event "
												DeathMSG = DeathMSG + "died shortly after being shot by Agent [REDACTED]."
											} else {
												DeathMSG = "An unidentified male and a deceased Class D subject were discovered in [REDACTED] by the Nine-Tailed Fox. "
												DeathMSG = DeathMSG + "The man was described as highly agitated and seemed to only speak Russian. "
												DeathMSG = DeathMSG + "He's been taken into a temporary holding area at [REDACTED] while waiting for a translator to arrive."
											}
										}
									}
								} else if (n.Frame >= 99) {
									n.State2 = 0.0
									n.State = 1
								}
							Else
								AnimateNPC(n,168,202,0.6,False)
								If prevFrame < 189 And n.Frame>=189
									If dist > 0.85 Or Abs(DeltaYaw(n.Collider,Collider))>60.0
										//Miss
									Else
										Injuries = Injuries + Rnd(0.75,1.5)
										PlaySound2(LoadTempSound("SFX/General/Slash"+Rand(1,2)+".ogg"), Camera, n.Collider)
										If Injuries > 10.0
											Kill()
											If PlayerRoom.RoomTemplate.Name$ = "dimension1499"
												DeathMSG = "All personnel situated within Evacuation Shelter LC-2 during the breach have been administered "
												DeathMSG = DeathMSG + "Class-B amnestics due to Incident 1499-E. The Class D subject involved in the event "
												DeathMSG = DeathMSG + "died shortly after being shot by Agent [REDACTED]."
											Else
												DeathMSG = "An unidentified male and a deceased Class D subject were discovered in [REDACTED] by the Nine-Tailed Fox. "
												DeathMSG = DeathMSG + "The man was described as highly agitated and seemed to only speak Russian. "
												DeathMSG = DeathMSG + "He's been taken into a temporary holding area at [REDACTED] while waiting for a translator to arrive."
											EndIf
										EndIf
									EndIf
								ElseIf n\Frame >= 201
									n\State2 = 0.0
									n\State = 1
								EndIf
							EndIf
							
						Case 4 //standing in front of the player
							
							dist = EntityDistance(n\Collider,Collider)
							n\CurrSpeed = CurveValue(0.0,n\CurrSpeed,5.0)
							AnimateNPC(n,296,320,0.2)
							
							PointEntity n\obj,Collider
							RotateEntity n\Collider,0,CurveAngle(EntityYaw(n\obj),EntityYaw(n\Collider),20.0),0
							
							If dist > 0.85
								n\State = 1
							EndIf
							
					End Select
					
					If n\SoundChn != 0 And ChannelPlaying(n\SoundChn) Then
						UpdateSoundOrigin(n\SoundChn,Camera,n\Collider,20.0)
					EndIf
					
					MoveEntity n\Collider,0,0,n\CurrSpeed*FPSfactor
					
					RotateEntity n\obj,0,EntityYaw(n\Collider)-180,0
					PositionEntity n\obj,EntityX(n\Collider),EntityY(n\Collider)-0.2,EntityZ(n\Collider)
					
					ShowEntity n\obj
				Else
					HideEntity n\obj
				EndIf
				
				
			Case NPCtype008
				
				//n\State: Main State
				//n\State2: A timer used for the player detection
				//n\State3: A timer for making the NPC idle (if the player escapes during that time)
				
				if (!n.IsDead) {
					if (n.State == 0) {
						EntityType(n.Collider,HIT_DEAD)
					Else
						EntityType(n.Collider,HIT_PLAYER)
					EndIf
					
					prevFrame = n\Frame
					
					n\BlinkTimer = 1
					
					Select n\State
						Case 0 //Lying next to the wall
							SetNPCFrame(n,11)
						Case 1 //Standing up
							AnimateNPC(n,11,32,0.1,False)
							If n\Frame >= 29
								n\State = 2
							EndIf
						Case 2 //Being active
							PlayerSeeAble = MeNPCSeesPlayer(n)
							If PlayerSeeAble=1 Or n.State2 > 0.0
								If PlayerSeeAble=1
									n.State2 = 70*2
								Else
									n.State2 = Max(n.State2-FPSfactor,0)
								EndIf
								PointEntity n.obj, Collider
								RotateEntity n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0
								
								AnimateNPC(n, 64, 93, n.CurrSpeed*30)
								n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
								MoveEntity n.Collider, 0, 0, n.CurrSpeed * FPSfactor
								
								If EntityDistance(n.Collider,Collider)<1.0
									If (Abs(DeltaYaw(n.Collider,Collider))<=60.0)
										n.State = 3
									EndIf
								EndIf
								
								n.PathTimer = 0
								n.PathStatus = 0
								n.PathLocation = 0
								n.State3 = 0
							Else
								if (n.PathStatus == 1) {
									if (n.Path[n.PathLocation]=Null) { 
										if (n.PathLocation > 19) { 
											n.PathLocation = 0
											n.PathStatus = 0
										} else {
											n.PathLocation = n.PathLocation + 1
										}
									} else {
										PointEntity(n.obj, n.Path[n.PathLocation].obj)
										RotateEntity(n.Collider, 0, CurveAngle(EntityYaw(n.obj), EntityYaw(n.Collider), 20.0), 0)
										
										AnimateNPC(n, 64, 93, n.CurrSpeed*30)
										n.CurrSpeed = CurveValue(n.Speed*0.7, n.CurrSpeed, 20.0)
										MoveEntity(n.Collider, 0, 0, n.CurrSpeed * FPSfactor)
										
										//opens doors in front of him
										dist2 = EntityDistance(n.Collider,n.Path[n.PathLocation].obj)
										if (dist2 < 0.6) {
											temp = True
											if (n.Path[n.PathLocation].door != Null) {
												if (!n.Path[n.PathLocation].door.IsElevatorDoor) {
													if (n.Path[n.PathLocation].door.locked || n.Path[n.PathLocation].door.KeyCard>0 || n.Path[n.PathLocation].door.Code!="") {
														temp = False
													} else {
														if (!n.Path[n.PathLocation].door.open) {
															UseDoor(n.Path[n.PathLocation].door, False)
														}
													}
												}
											}
											if (dist2 < 0.2 && temp) {
												n.PathLocation = n.PathLocation + 1
											} else if (dist2 < 0.5 && (!temp)) {
												n.PathStatus = 0
												n.PathTimer = 0.0
											}
										}
									}
								} else {
									AnimateNPC(n, 323, 344, 0.2, True)
									n.CurrSpeed = 0
									If n.PathTimer < 70*5
										n.PathTimer = n.PathTimer + Rnd(1,2+(2*SelectedDifficulty.aggressiveNPCs))*FPSfactor
									Else
										n.PathStatus = FindPath(n,EntityX(Collider),EntityY(Collider),EntityZ(Collider))
										n.PathTimer = 0
									EndIf
								EndIf
								
								If EntityDistance(n.Collider,Collider)>HideDistance
									If n.State3 < 70*(15+(10*SelectedDifficulty.aggressiveNPCs))
										n.State3 = n.State3+FPSfactor
									Else
										DebugLog("SCP-008-1 IDLE")
										n.State3 = 70*(6*60)
										n.State = 4
									EndIf
								EndIf
							EndIf
							
							If n.CurrSpeed > 0.005 Then
								If (prevFrame < 80 And n.Frame>=80) Or (prevFrame > 92 And n.Frame<65)
									PlaySound2(StepSFX(0,0,Rand(0,7)),Camera, n.Collider, 8.0, Rnd(0.3,0.5))
								EndIf
							EndIf
							
							n.SoundChn = LoopSound2(n.Sound,n.SoundChn,Camera,n.Collider)
						case 3: //Attacking
							AnimateNPC(n, 126, 165, 0.4, False)
							if (n.Frame >= 146 && prevFrame < 146) {
								if (EntityDistance(n.Collider,Collider)<1.1) {
									if (Abs(DeltaYaw(n.Collider,Collider))<=60.0) {
										PlaySound_Strict(DamageSFX(Rand(5,8)))
										Injuries = Injuries+Rnd(0.4,1.0)
										Infect = Infect + (1+(1*SelectedDifficulty.aggressiveNPCs))
										DeathMSG = "Subject D-9341. Cause of death: multiple lacerations and severe blunt force trauma caused by [DATA EXPUNGED], who was infected with SCP-008. Said subject was located by Nine-Tailed Fox and terminated."
									}
								}
							} else if (n.Frame >= 164) {
								if (EntityDistance(n.Collider,Collider)<1.1) {
									if (Abs(DeltaYaw(n.Collider,Collider))<=60.0) {
										SetNPCFrame(n,126)
									} else {
										n.State = 2
									}
								} else {
									n.State = 2
								}
							}
						case 4: //Idling
							HideEntity(n.obj)
							HideEntity(n.Collider)
							n.DropSpeed = 0
							PositionEntity(n.Collider,0,500,0)
							ResetEntity(n.Collider)
							if (n.Idle > 0) {
								n.Idle = Max(n.Idle-(1+(1*SelectedDifficulty.aggressiveNPCs))*FPSfactor,0)
							} else {
								if (PlayerInReachableRoom()) { //Player is in a room where SCP-008-1 can teleport to
									if (Rand(50-(20*SelectedDifficulty.aggressiveNPCs)) == 1) {
										ShowEntity(n.Collider)
										ShowEntity(n.obj)
										for (w of WayPoints.each) {
											if (w.door=Null && w.room.dist < HideDistance && Rand(3) == 1) {
												if (EntityDistance(w.room.obj,n.Collider)<EntityDistance(Collider,n.Collider)) {
													x = Abs(EntityX(n.Collider)-EntityX(w.obj,True))
													if (x < 12.0 && x > 4.0) {
														z = Abs(EntityZ(n.Collider)-EntityZ(w.obj,True))
														if (z < 12 && z > 4.0) {
															if (w.room.dist > 4) {
																DebugLog("MOVING 008-1 TO "+w.room.roomtemplate.name)
																PositionEntity(n.Collider, EntityX(w.obj,True), EntityY(w.obj,True)+0.25,EntityZ(w.obj,True))
																ResetEntity(n.Collider)
																n.PathStatus = 0
																n.PathTimer = 0.0
																n.PathLocation = 0
																break
															}
														}
													}
												}
											}
										}
										n.State = 2
										n.State3 = 0
									}
								}
							}
					}
				} else {
					if (n.SoundChn != 0) {
						StopChannel(n.SoundChn)
						n.SoundChn = 0
						FreeSound_Strict(n.Sound)
						n.Sound = 0
					}
					AnimateNPC(n, 344, 363, 0.5, False)
				}
				
				RotateEntity n.obj,0,EntityYaw(n.Collider)-180,0
				PositionEntity n.obj,EntityX(n.Collider),EntityY(n.Collider)-0.2,EntityZ(n.Collider)
				
		End Select
		
		If n.IsDead
			EntityType n.Collider,HIT_DEAD
		EndIf
		
		Local gravityDist = Distance(EntityX(Collider),EntityZ(Collider),EntityX(n.Collider),EntityZ(n.Collider))
		
		If gravityDist<HideDistance*0.7 Or n.NPCtype = NPCtype1499 Then
			If n.InFacility = InFacility
				TranslateEntity n.Collider, 0, n.DropSpeed, 0
				
				Local CollidedFloor% = False
				For i% = 1 To CountCollisions(n.Collider)
					If CollisionY(n.Collider, i) < EntityY(n.Collider) - 0.01 Then CollidedFloor = True : Exit
				Next
				
				If CollidedFloor = True Then
					n.DropSpeed# = 0
				Else
					If ShouldEntitiesFall
						let UpdateGravity: boolean = False
						let MaxX#,MinX#,MaxZ#,MinZ#
						If n.InFacility=1
							If PlayerRoom.RoomTemplate.Name$ != "173"
								For e.Events = Each Events
									If e.EventName = "room860"
										If e.EventState = 1.0
											UpdateGravity = True
											Exit
										EndIf
									EndIf
								Next
							Else
								UpdateGravity = True
							EndIf
							if (!UpdateGravity) {
								For r.Rooms = Each Rooms
									if (r.MaxX!=0 || r.MinX!=0 || r.MaxZ!=0 || r.MinZ!=0) {
										MaxX = r.MaxX
										MinX = r.MinX
										MaxZ = r.MaxZ
										MinZ = r.MinZ
									} else {
										MaxX = 4.0
										MinX = 0.0
										MaxZ = 4.0
										MinZ = 0.0
									}
									If Abs(EntityX(n.Collider)-EntityX(r.obj))<=Abs(MaxX-MinX)
										If Abs(EntityZ(n.Collider)-EntityZ(r.obj))<=Abs(MaxZ-MinZ)
											If r=PlayerRoom
												UpdateGravity = True
												Exit
											}
											If IsRoomAdjacent(PlayerRoom,r)
												UpdateGravity = True
												Exit
											}
											for (i of range(4)) {
												If (IsRoomAdjacent(PlayerRoom.Adjacent[i],r))
													UpdateGravity = True
													Exit
												}
											}
										}
									}
								}
							}
						Else
							UpdateGravity = True
						EndIf
						If UpdateGravity
							n.DropSpeed# = Max(n.DropSpeed - 0.005*FPSfactor*n.GravityMult,-n.MaxGravity)
						Else
							If n.FallingPickDistance>0
								n.DropSpeed = 0.0
							Else
								n.DropSpeed# = Max(n.DropSpeed - 0.005*FPSfactor*n.GravityMult,-n.MaxGravity)
							EndIf
						EndIf
					Else
						n.DropSpeed# = 0.0
					EndIf
				EndIf
			Else
				n.DropSpeed = 0
			EndIf
		Else
			n.DropSpeed = 0
		EndIf
		
		CatchErrors(Chr(34)+n.NVName+Chr(34)+" NPC")
		
	Next
	
	if (MTF_CameraCheckTimer>0.0 && MTF_CameraCheckTimer<70*90) {
		MTF_CameraCheckTimer=MTF_CameraCheckTimer+FPSfactor
	} else if (MTF_CameraCheckTimer>=70*90) {
		MTF_CameraCheckTimer=0.0
		if (!PlayerDetected) {
			if (MTF_CameraCheckDetected) {
				PlayAnnouncement("SFX/Character/MTF/AnnouncCameraFound"+Rand(1,2)+".ogg")
				PlayerDetected=True
				MTF_CameraCheckTimer=70*60
			} else {
				PlayAnnouncement("SFX/Character/MTF/AnnouncCameraNoFound.ogg")
			}
		}
		MTF_CameraCheckDetected=False
		if (MTF_CameraCheckTimer == 0.0) {
			PlayerDetected=False
		}
	}
}

Function TeleportCloser(n.NPCs)
	Local closestDist# = 0
	Local closestWaypoint.WayPoints
	Local w.WayPoints
	
	Local xtemp#, ztemp#
	
	For w.WayPoints = Each WayPoints
		If w.door = Null Then
			xtemp = Abs(EntityX(w.obj,True)-EntityX(n.Collider,True))
			If xtemp < 10.0 And xtemp > 1.0 Then 
				ztemp = Abs(EntityZ(w.obj,True)-EntityZ(n.Collider,True))
				If ztemp < 10.0 And ztemp > 1.0 Then
					If (EntityDistance(Collider, w.obj)>16-(8*SelectedDifficulty.aggressiveNPCs)) Then
						//teleports to the nearby waypoint that takes it closest to the player
						Local newDist# = EntityDistance(Collider, w.obj)
						If (newDist < closestDist Or closestWaypoint = Null) Then
							closestDist = newDist	
							closestWaypoint = w
						EndIf						
					EndIf
				EndIf
			EndIf
		EndIf
	Next
	
	Local shouldTeleport% = False
	If (closestWaypoint!=Null) Then
		If n.InFacility != 1 Or SelectedDifficulty.aggressiveNPCs Then
			shouldTeleport = True
		ElseIf EntityY(closestWaypoint.obj,True)<=7.0 And EntityY(closestWaypoint.obj,True)>=-10.0 Then
			shouldTeleport = True
		EndIf
		
		If shouldTeleport Then
			PositionEntity n.Collider, EntityX(closestWaypoint.obj,True), EntityY(closestWaypoint.obj,True)+0.15, EntityZ(closestWaypoint.obj,True), True
			ResetEntity n.Collider
			n.PathStatus = 0
			n.PathTimer# = 0.0
			n.PathLocation = 0
		EndIf
	EndIf
	
End Function

Function OtherNPCSeesMeNPC%(me.NPCs,other.NPCs)
	If other.BlinkTimer<=0.0 Then Return False
	
	If EntityDistance(other.Collider,me.Collider)<6.0 Then
		If Abs(DeltaYaw(other.Collider,me.Collider))<60.0 Then
			Return True
		EndIf
	EndIf
	Return False
End Function

Function MeNPCSeesPlayer%(me.NPCs,disablesoundoncrouch%=False)
	//Return values:
		//False (=0): Player is not detected anyhow
		//True (=1): Player is detected by vision
		//2: Player is detected by emitting a sound
		//3: Player is detected by a camera (only for MTF Units!)
		//4: Player is detected through glass
	
	If NoTarget Then Return False
	
	If (Not PlayerDetected) Or me.NPCtype != NPCtypeMTF
		If me.BlinkTimer<=0.0 Then Return False
		If EntityDistance(Collider,me.Collider)>(8.0-CrouchState+PlayerSoundVolume) Then Return False
		
		//spots the player if he's either in view or making a loud sound
		If PlayerSoundVolume>1.0
			If (Abs(DeltaYaw(me.Collider,Collider))>60.0) And EntityVisible(me.Collider,Collider)
				Return 1
			ElseIf (Not EntityVisible(me.Collider,Collider))
				If disablesoundoncrouch% And Crouch%
					Return False
				Else
					Return 2
				EndIf
			EndIf
		Else
			If (Abs(DeltaYaw(me.Collider,Collider))>60.0) Then Return False
		EndIf
		Return EntityVisible(me.Collider,Collider)
	Else
		If EntityDistance(Collider,me.Collider)>(8.0-CrouchState+PlayerSoundVolume) Then Return 3
		If EntityVisible(me.Collider, Camera) Then Return True
		
		//spots the player if he's either in view or making a loud sound
		If PlayerSoundVolume>1.0 Then Return 2
		Return 3
	EndIf
	
End Function

Function TeleportMTFGroup(n.NPCs)
	Local n2.NPCs
	
	If n.MTFLeader != Null Then Return
	
	TeleportCloser(n)
	
	For n2 = Each NPCs
		If n2.NPCtype = NPCtypeMTF
			If n2.MTFLeader != Null
				PositionEntity n2.Collider,EntityX(n2.MTFLeader.Collider),EntityY(n2.MTFLeader.Collider)+0.1,EntityZ(n2.MTFLeader.Collider)
			EndIf
		EndIf
	Next
	
	DebugLog "Teleported MTF Group (dist:"+EntityDistance(n.Collider,Collider)+")"
	
End Function

function UpdateMTFUnit(n: NPCs) {
	
	
	if (n.NPCtype!=NPCtypeMTF) {
		let realType: string = ""
		switch (n.NPCtype) {
			case NPCtype173:
                realType = "173"
			case NPCtypeOldMan:
                realType = "106"
			case NPCtypeGuard:
                realType = "guard"
			case NPCtypeD:
                realType = "d"
			case NPCtype372:
                realType = "372"
			case NPCtypeApache:
                realType = "apache"
			case NPCtype096:
                realType = "096"
			case NPCtype049:
                realType = "049"
			case NPCtypeZombie:
                realType = "zombie"
			case NPCtype5131:
                realType = "513-1"
			case NPCtypeTentacle:
                realType = "tentacle"
			case NPCtype860:
                realType = "860"
			case NPCtype939:
                realType = "939"
			case NPCtype066:
                realType = "066"
			case NPCtypePdPlane:
                realType = "PDPlane"
			case NPCtype966:
                realType = "966"
			case NPCtype1048a:
                realType = "1048-A"
			case NPCtype1499:
				realType = "1499-1"
		}
		RuntimeError("Called UpdateMTFUnit on "+realType)
	}
	
	
	let x: float
	let y: float
	let z: float
	let r: Rooms
	let prevDist: float
	let newDist: float
	let n2: NPCs
	
	let p: Particles
	let target
	let dist: float
	let dist2: float
	
	if (n.IsDead) {
		n.BlinkTimer = -1.0
		SetNPCFrame(n, 532)
		if (ChannelPlaying(n.SoundChn2)) {
			StopChannel(n.SoundChn2)
		}
		return
	}
	
	n.MaxGravity = 0.03
	
	n.BlinkTimer = n.BlinkTimer - FPSfactor
	if (n.BlinkTimer<=-5.0) {
		//only play the "blinking" sound clip if searching/containing 173
		if (n.State = 2) {
			if (OtherNPCSeesMeNPC(Curr173,n)) {
				PlayMTFSound(LoadTempSound("SFX/Character/MTF/173/BLINKING.ogg"),n)
			}
		}
		n.BlinkTimer = 70.0*Rnd(10.0,15.0)
	}	
	
	n.Reload = n.Reload - FPSfactor
	
	let prevFrame: float = n.Frame
	
	n.BoneToManipulate = ""
	//n.BoneToManipulate2 = ""
	n.ManipulateBone = False
	n.ManipulationType = 0
	n.NPCNameInSection = "MTF"
	
	If Int(n.State) != 1 Then n.PrevState = 0
	
	n.SoundChn2 = LoopSound2(MTFSFX(6),n.SoundChn2,Camera,n.Collider)
	
	If n.Idle>0.0 Then
		FinishWalking(n,488,522,0.015*26)
		n.Idle=n.Idle-FPSfactor
		If n.Idle<=0.0 Then n.Idle = 0.0
	Else
		Select Int(n.State) //what is this MTF doing
			Case 0 //wandering around
                
                n.Speed = 0.015
                If n.PathTimer<=0.0 Then //update path
					If n.MTFLeader!=Null Then //i'll follow the leader
						n.PathStatus = FindPath(n,EntityX(n.MTFLeader.Collider,True),EntityY(n.MTFLeader.Collider,True)+0.1,EntityZ(n.MTFLeader.Collider,True)) //whatever you say boss
					Else //i am the leader
						If Curr173.Idle!=2
							For r = Each Rooms
								If ((Abs(r.x-EntityX(n.Collider,True))>12.0) Or (Abs(r.z-EntityZ(n.Collider,True))>12.0)) And (Rand(1,Max(4-Int(Abs(r.z-EntityZ(n.Collider,True)/8.0)),2))=1) Then
									x = r.x
									y = 0.1
									z = r.z
									DebugLog(r.RoomTemplate.Name)
									break
								}
							Next
						Else
							Local tmp = False
							If EntityDistance(n.Collider,Curr173.Collider)>4.0
								If (Not EntityVisible(n.Collider,Curr173.Collider))
									tmp = True
								EndIf
							EndIf
							
							if (!tmp) {
								for (r of Rooms.each) {
									If r.RoomTemplate.Name$ = "start"
										let foundChamber: boolean = False
										let pvt: int = CreatePivot()
										PositionEntity pvt%,EntityX(r.obj,True)+4736*RoomScale,0.5,EntityZ(r.obj,True)+1692*RoomScale
										
										If Distance(EntityX(pvt%),EntityZ(pvt%),EntityX(n.Collider),EntityZ(n.Collider))<3.5
											foundChamber% = True
											DebugLog Distance(EntityX(pvt%),EntityZ(pvt%),EntityX(n.Collider),EntityZ(n.Collider))
										EndIf
										
										If Curr173.Idle = 3 And Distance(EntityX(pvt%),EntityZ(pvt%),EntityX(n.Collider),EntityZ(n.Collider)) > 4.0
											If r.RoomDoors[1].open = True Then UseDoor(r.RoomDoors[1],False)
										EndIf
										
										FreeEntity pvt%
										
										If Distance(EntityX(n\Collider),EntityZ(n\Collider),EntityX(r\obj,True)+4736*RoomScale,EntityZ(r\obj,True)+1692*RoomScale)>1.6 And (Not foundChamber)
											x = EntityX(r\obj,True)+4736*RoomScale
											y = 0.1
											z = EntityZ(r\obj,True)+1692*RoomScale
											DebugLog "Move to 173's chamber"
											Exit
										ElseIf Distance(EntityX(n\Collider),EntityZ(n\Collider),EntityX(r\obj,True)+4736*RoomScale,EntityZ(r\obj,True)+1692*RoomScale)>1.6 And foundChamber
											n\PathX = EntityX(r\obj,True)+4736*RoomScale
											n\PathZ = EntityZ(r\obj,True)+1692*RoomScale
											DebugLog "Move inside 173's chamber"
											Exit
										Else
											Curr173\Idle = 3
											Curr173\Target = Null
											Curr173\IsDead = True
											If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
											n\Sound = LoadSound_Strict("SFX/Character/MTF/173/Cont"+Rand(1,4)+".ogg")
											PlayMTFSound(n\Sound, n)
											PlayAnnouncement("SFX/Character/MTF/Announc173Contain.ogg")
											DebugLog "173 contained"
											Exit
										EndIf
									EndIf
								Next
							Else
								x = EntityX(Curr173\Collider)
								y = 0.1
								z = EntityZ(Curr173\Collider)
								DebugLog "Going back to 173's cage"
							EndIf
						EndIf
						If n\PathX=0 Then n\PathStatus = FindPath(n,x,y,z) //we're going to this room for no particular reason
					EndIf
					If n\PathStatus = 1 Then
						While n\Path[n\PathLocation]=Null
							If n\PathLocation>19 Then Exit
							n\PathLocation=n\PathLocation+1
						Wend
						If n\PathLocation<19 Then
							If (n\Path[n\PathLocation]!=Null) And (n\Path[n\PathLocation+1]!=Null) Then
								If (n\Path[n\PathLocation]\door=Null) Then
									If Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation]\obj))>Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation+1]\obj)) Then
										n\PathLocation=n\PathLocation+1
									EndIf
								EndIf
							EndIf
						EndIf
					EndIf
					n\PathTimer = 70.0 * Rnd(6.0,10.0) //search again after 6-10 seconds
                ElseIf (n\PathTimer<=70.0 * 2.5) And (n\MTFLeader=Null) Then
					n\PathTimer=n\PathTimer-FPSfactor
					n\CurrSpeed = 0.0
					If Rand(1,35)=1 Then
						RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
					EndIf
					FinishWalking(n,488,522,n\Speed*26)
					n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
					RotateEntity n\obj,-90.0,n\Angle,0.0,True
                Else
					If n\PathStatus=2 Then
						n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
						n\CurrSpeed = 0.0
						If Rand(1,35)=1 Then
							RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
						EndIf
						FinishWalking(n,488,522,n\Speed*26)
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
					ElseIf n\PathStatus=1 Then
						If n\Path[n\PathLocation]=Null Then
							If n\PathLocation > 19 Then
								n\PathLocation = 0 : n\PathStatus = 0
							Else
								n\PathLocation = n\PathLocation + 1
							EndIf
						Else
							prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
							
							PointEntity n\Collider,n\Path[n\PathLocation]\obj
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
							
							n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
							//MoveEntity n\Collider, 0, 0, n\CurrSpeed * FPSfactor
							
							TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
							AnimateNPC(n,488, 522, n\CurrSpeed*26)
							
							newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
							
							If (newDist<1.0 And n\Path[n\PathLocation]\door!=Null) Then
								//open the door and make it automatically close after 5 seconds
								If (Not n\Path[n\PathLocation]\door\open)
									Local sound = 0
									If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
									PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
									PlayMTFSound(MTFSFX(5),n)
								EndIf
								n\Path[n\PathLocation]\door\open = True
								If n\Path[n\PathLocation]\door\MTFClose
									n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
								EndIf
							EndIf
                            
							If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
								n\PathLocation=n\PathLocation+1
							EndIf
						EndIf
						n\PathTimer=n\PathTimer-FPSfactor //timer goes down slow
					ElseIf n\PathX#!=0.0
						pvt = CreatePivot()
						PositionEntity pvt,n\PathX#,0.5,n\PathZ#
						
						PointEntity n\Collider,pvt
						RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
						
						n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
						TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
						AnimateNPC(n,488, 522, n\CurrSpeed*26)
						
						If Distance(EntityX(n\Collider),EntityZ(n\Collider),n\PathX#,n\PathZ#)<0.2
							n\PathX# = 0.0
							n\PathZ# = 0.0
							n\PathTimer = 70.0 * Rnd(6.0,10.0)
						EndIf
						
						FreeEntity pvt
					Else
						n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
						If n\MTFLeader = Null Then
							If Rand(1,35)=1 Then
								RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
							EndIf
							FinishWalking(n,488,522,n\Speed*26)
							n\CurrSpeed = 0.0
						ElseIf EntityDistance(n\Collider,n\MTFLeader\Collider)>1.0 Then
							PointEntity n\Collider,n\MTFLeader\Collider
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							
							n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
							TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
							AnimateNPC(n,488, 522, n\CurrSpeed*26)
						Else
							If Rand(1,35)=1 Then
								RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
							EndIf
							FinishWalking(n,488,522,n\Speed*26)
							n\CurrSpeed = 0.0
						EndIf
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
					EndIf
                EndIf
                
				Local temp = MeNPCSeesPlayer(n)
				
				If NoTarget Then temp = False
				
                If temp>False Then
					If n\LastSeen > 0 And n\LastSeen < 70*15 Then
						If temp < 2
							If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
							n\Sound = LoadSound_Strict("SFX/Character/MTF/ThereHeIs"+Rand(1,6)+".ogg")
							PlayMTFSound(n\Sound, n)
						EndIf
					Else
						If temp = True
							If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
							n\Sound = LoadSound_Strict("SFX/Character/MTF/Stop"+Rand(1,6)+".ogg")
							PlayMTFSound(n\Sound, n)
						ElseIf temp = 2
							PlayMTFSound(MTFSFX(Rand(0,3)),n)
						EndIf
					EndIf
					
					n\LastSeen = (70*Rnd(30,40))
					n\LastDist = 1
					
					n\State = 1
					n\EnemyX = EntityX(Collider,True)
					n\EnemyY = EntityY(Collider,True)
					n\EnemyZ = EntityZ(Collider,True)
					n\State2 = 70.0*(15.0*temp) //give up after 15 seconds (30 seconds if detected by loud noise, over camera: 45)
					DebugLog "player spotted :"+n\State2
					n\PathTimer=0.0
					n\PathStatus=0
					n\Reload = 200-(100*SelectedDifficulty\aggressiveNPCs)
                EndIf
				
				//B3D doesn't do short-circuit evaluation, so this retarded nesting is an optimization
                If Curr173\Idle<2 Then
					Local SoundVol173# = Max(Min((Distance(EntityX(Curr173\Collider), EntityZ(Curr173\Collider), Curr173\PrevX, Curr173\PrevZ) * 2.5), 1.0), 0.0)
					If OtherNPCSeesMeNPC(Curr173,n) Or (SoundVol173#>0.0 And EntityDistance(n\Collider,Curr173\Collider)<6.0) Then
						If EntityVisible(n\Collider,Curr173\Collider) Or SoundVol173#>0.0 Then							
							n\State = 2
							n\EnemyX = EntityX(Curr173\Collider,True)
							n\EnemyY = EntityY(Curr173\Collider,True)
							n\EnemyZ = EntityZ(Curr173\Collider,True)
							n\State2 = 70.0*15.0 //give up after 15 seconds
							n\State3 = 0.0
							n\PathTimer=0.0
							n\PathStatus=0
							DebugLog "173 spotted :"+n\State2
							If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
							n\Sound = LoadSound_Strict("SFX/Character/MTF/173/Spotted"+Rand(1,2)+".ogg")
							PlayMTFSound(n\Sound, n)
						EndIf
					EndIf
				EndIf
				
				If Curr106\State <= 0
					If OtherNPCSeesMeNPC(Curr106,n) Or EntityDistance(n\Collider,Curr106\Collider)<3.0 Then
						If EntityVisible(n\Collider,Curr106\Collider) Then
							n\State = 4
							n\EnemyX = EntityX(Curr106\Collider,True)
							n\EnemyY = EntityY(Curr106\Collider,True)
							n\EnemyZ = EntityZ(Curr106\Collider,True)
							n\State2 = 70*15.0
							n\State3 = 0.0
							n\PathTimer = 0.0
							n\PathStatus = 0
							n\Target = Curr106
							DebugLog "106 spotted :"+n\State2
							//If n\MTFLeader=Null
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/106/Spotted"+Rand(1,3)+".ogg")
								PlayMTFSound(n\Sound, n)
							//EndIf
						EndIf
					EndIf
				EndIf
				
				If Curr096 != Null
					If OtherNPCSeesMeNPC(Curr096,n) Then
						If EntityVisible(n\Collider,Curr096\Collider) Then
							n\State = 8
							n\EnemyX = EntityX(Curr096\Collider,True)
							n\EnemyY = EntityY(Curr096\Collider,True)
							n\EnemyZ = EntityZ(Curr096\Collider,True)
							n\State2 = 70*15.0
							n\State3 = 0.0
							n\PathTimer = 0.0
							n\PathStatus = 0
							DebugLog "096 spotted :"+n\State2
							//If n\MTFLeader=Null
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/096/Spotted"+Rand(1,2)+".ogg")
								PlayMTFSound(n\Sound, n)
							//EndIf
						EndIf
					EndIf
				EndIf
				
				For n2.NPCs = Each NPCs
					If n2\NPCtype = NPCtype049
						If OtherNPCSeesMeNPC(n2,n) Then
							If EntityVisible(n\Collider,n2\Collider)
								n\State = 4
								n\EnemyX = EntityX(n2\Collider,True)
								n\EnemyY = EntityY(n2\Collider,True)
								n\EnemyZ = EntityZ(n2\Collider,True)
								n\State2 = 70*15.0
								n\State3 = 0.0
								n\PathTimer = 0.0
								n\PathStatus = 0
								n\Target = n2
								DebugLog "049 spotted :"+n\State2
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/049/Spotted"+Rand(1,5)+".ogg")
								PlayMTFSound(n\Sound, n)
								Exit
							EndIf
						EndIf
					ElseIf n2\NPCtype = NPCtypeZombie And n2\IsDead = False
						If OtherNPCSeesMeNPC(n2,n) Then
							If EntityVisible(n\Collider,n2\Collider)
								n\State = 9
								n\EnemyX = EntityX(n2\Collider,True)
								n\EnemyY = EntityY(n2\Collider,True)
								n\EnemyZ = EntityZ(n2\Collider,True)
								n\State2 = 70*15.0
								n\State3 = 0.0
								n\PathTimer = 0.0
								n\PathStatus = 0
								n\Target = n2
								n\Reload = 70*5
								DebugLog "049-2 spotted :"+n\State2
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/049/Player0492_1.ogg")
								PlayMTFSound(n\Sound, n)
								Exit
							EndIf
						EndIf
					ElseIf n2\NPCtype = NPCtype008 And n2\IsDead = False
						If OtherNPCSeesMeNPC(n2,n) Then
							If EntityVisible(n\Collider,n2\Collider)
								n\State = 9
								n\EnemyX = EntityX(n2\Collider,True)
								n\EnemyY = EntityY(n2\Collider,True)
								n\EnemyZ = EntityZ(n2\Collider,True)
								n\State2 = 70*15.0
								n\State3 = 0.0
								n\PathTimer = 0.0
								n\PathStatus = 0
								n\Target = n2
								n\Reload = 70*5
								DebugLog "008 spotted :"+n\State2
								Exit
							EndIf
						EndIf
					EndIf
				Next
                
			Case 1 //searching for player
                
                n\Speed = 0.015
                n\State2=n\State2-FPSfactor
                If MeNPCSeesPlayer(n) = True Then
					
					//if close enough, start shooting at the player
					If playerDist < 4.0 Then
						
						Local angle# = VectorYaw(EntityX(Collider)-EntityX(n\Collider),0,EntityZ(Collider)-EntityZ(n\Collider))
						
						RotateEntity(n\Collider, 0, CurveAngle(angle, EntityYaw(n\Collider), 10.0), 0, True)
						n\Angle = EntityYaw(n\Collider)
						
						If n\Reload <= 0 And KillTimer = 0 Then
							If EntityVisible(n\Collider, Camera) Then
								angle# = WrapAngle(angle - EntityYaw(n\Collider))
								If angle < 5 Or angle > 355 Then 
									prev% = KillTimer
									
									PlaySound2(GunshotSFX, Camera, n\Collider, 15)
									
									pvt% = CreatePivot()
									
									RotateEntity(pvt, EntityPitch(n\Collider), EntityYaw(n\Collider), 0, True)
									PositionEntity(pvt, EntityX(n\obj), EntityY(n\obj), EntityZ(n\obj))
									MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
									
									Shoot(EntityX(pvt),EntityY(pvt),EntityZ(pvt),5.0/playerDist, False)
									n\Reload = 7
									
									FreeEntity(pvt)
									
									DeathMSG="Subject D-9341. Died of blood loss after being shot by Nine-Tailed Fox."
									
									//player killed -> "target terminated"
									If prev >= 0 And KillTimer < 0 Then
										DeathMSG="Subject D-9341. Terminated by Nine-Tailed Fox."
										PlayMTFSound(LoadTempSound("SFX/Character/MTF/Targetterminated"+Rand(1,4)+".ogg"),n)
									EndIf
								EndIf	
							EndIf
						EndIf
						
						For n2.NPCs = Each NPCs
							If n2\NPCtype = NPCtypeMTF And n2 != n
								If n2\State = 0
									If EntityDistance(n\Collider,n2\Collider)<6.0
										n\PrevState = 1
										n2\LastSeen = (70*Rnd(30,40))
										n2\LastDist = 1
										
										n2\State = 1
										n2\EnemyX = EntityX(Collider,True)
										n2\EnemyY = EntityY(Collider,True)
										n2\EnemyZ = EntityZ(Collider,True)
										n2\State2 = n\State2
										n2\PathTimer=0.0
										n2\PathStatus=0
										n2\Reload = 200-(100*SelectedDifficulty\aggressiveNPCs)
										n2\PrevState = 0
									EndIf
								EndIf
							EndIf
						Next
						
						If n\PrevState = 1
							SetNPCFrame(n,423)
							n\PrevState = 2
						ElseIf n\PrevState=2
							If n\Frame>200
								n\CurrSpeed = CurveValue(0, n\CurrSpeed, 20.0)
								AnimateNPC(n, 423, 463, 0.4, False)
								If n\Frame>462.9 Then n\Frame = 78
							Else
								AnimateNPC(n, 78, 193, 0.2, False)
								n\CurrSpeed = CurveValue(0, n\CurrSpeed, 20.0)
							EndIf
						Else
							If n\Frame>958 Then
								AnimateNPC(n, 1374, 1383, 0.3, False)
								n\CurrSpeed = CurveValue(0, n\CurrSpeed, 20.0)
								If n\Frame>1382.9 Then n\Frame = 78
							Else
								AnimateNPC(n, 78, 193, 0.2, False)
								n\CurrSpeed = CurveValue(0, n\CurrSpeed, 20.0)
							EndIf
						EndIf
					Else
						PositionEntity n\obj,n\EnemyX,n\EnemyY,n\EnemyZ,True
						PointEntity n\Collider,n\obj
						RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
						
						n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
						TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
						AnimateNPC(n,488, 522, n\CurrSpeed*26)
					EndIf
                Else
					n\LastSeen = n\LastSeen - FPSfactor
					
					If n\Reload <= 7
						n\Reload = 7
					EndIf
					
					If n\PathTimer<=0.0 Then //update path
						n\PathStatus = FindPath(n,n\EnemyX,n\EnemyY+0.1,n\EnemyZ)
						n\PathTimer = 70.0 * Rnd(6.0,10.0) //search again after 6 seconds
					ElseIf n\PathTimer<=70.0 * 2.5 Then
						n\PathTimer=n\PathTimer-FPSfactor
						n\CurrSpeed = 0.0
						If Rand(1,35)=1 Then
							RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
						EndIf
						FinishWalking(n,488,522,n\Speed*26)
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
					Else
						If n\PathStatus=2 Then
							n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
							n\CurrSpeed = 0.0
							If Rand(1,35)=1 Then
								RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
							EndIf
							FinishWalking(n,488,522,n\Speed*26)
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
						ElseIf n\PathStatus=1 Then
							If n\Path[n\PathLocation]=Null Then
								If n\PathLocation > 19 Then
									n\PathLocation = 0 : n\PathStatus = 0
								Else
									n\PathLocation = n\PathLocation + 1
								EndIf
							Else
								prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								PointEntity n\Collider,n\Path[n\PathLocation]\obj
								RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
								
								n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
								
								TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
								AnimateNPC(n,488, 522, n\CurrSpeed*26)
								
								newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								If (newDist<1.0 And n\Path[n\PathLocation]\door!=Null) Then
									//open the door and make it automatically close after 5 seconds
									If (Not n\Path[n\PathLocation]\door\open)
										sound = 0
										If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
										PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
										PlayMTFSound(MTFSFX(5),n)
									EndIf
									n\Path[n\PathLocation]\door\open = True
									If n\Path[n\PathLocation]\door\MTFClose
										n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
									EndIf
								EndIf
								
								If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
									n\PathLocation=n\PathLocation+1
								EndIf
							EndIf
							n\PathTimer=n\PathTimer-FPSfactor //timer goes down slow
						Else
							PositionEntity n\obj,n\EnemyX,n\EnemyY,n\EnemyZ,True
							If (Distance(EntityX(n\Collider,True),EntityZ(n\Collider,True),n\EnemyX,n\EnemyZ)<0.2) Or (Not EntityVisible(n\obj,n\Collider)) Then
								If Rand(1,35)=1 Then
									RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
								EndIf
								FinishWalking(n,488,522,n\Speed*26)
								If Rand(1,35)=1 Then
									For wp.Waypoints = Each WayPoints
										If (Rand(1,3)=1) Then
											If (EntityDistance(wp\obj,n\Collider)<6.0) Then
												n\EnemyX = EntityX(wp\obj,True)
												n\EnemyY = EntityY(wp\obj,True)
												n\EnemyZ = EntityZ(wp\obj,True)
												n\PathTimer = 0.0
												Exit
											EndIf											
										EndIf
									Next
								EndIf
								n\PathTimer=n\PathTimer-FPSfactor //timer goes down slow
							Else
								PointEntity n\Collider,n\obj
								RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
								
								n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
								TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
								AnimateNPC(n,488, 522, n\CurrSpeed*26)
							EndIf
						EndIf
					EndIf
					
					If n\MTFLeader=Null And n\LastSeen<70*30 And n\LastSeen+FPSfactor>=70*30 Then
						If Rand(2)=1 Then 
							PlayMTFSound(LoadTempSound("SFX/Character/MTF/Searching"+Rand(1,6)+".ogg"),n)
						EndIf
					EndIf
                EndIf
                
                If n\State2<=0.0 And n\State2+FPSfactor >0.0 Then
					If n\MTFLeader = Null Then
						DebugLog "targetlost: "+n\State2
						PlayMTFSound(LoadTempSound("SFX/Character/MTF/Targetlost"+Rand(1,3)+".ogg"),n)
						If MTF_CameraCheckTimer=0.0
							If Rand(15-(7*SelectedDifficulty\aggressiveNPCs))=1 //Maybe change this to another chance - ENDSHN
								PlayAnnouncement("SFX/Character/MTF/AnnouncCameraCheck.ogg")
								MTF_CameraCheckTimer = FPSfactor
							EndIf
						EndIf
					EndIf
					n\State = 0
                EndIf
                
				//B3D doesn't do short-circuit evaluation, so this retarded nesting is an optimization
                If Curr173\Idle<2 Then
					SoundVol173# = Max(Min((Distance(EntityX(Curr173\Collider), EntityZ(Curr173\Collider), Curr173\PrevX, Curr173\PrevZ) * 2.5), 1.0), 0.0)
					If OtherNPCSeesMeNPC(Curr173,n) Or (SoundVol173#>0.0 And EntityDistance(n\Collider,Curr173\Collider)<6.0) Then
						If EntityVisible(n\Collider,Curr173\Collider) Or SoundVol173#>0.0 Then	
							n\State = 2
							n\EnemyX = EntityX(Curr173\Collider,True)
							n\EnemyY = EntityY(Curr173\Collider,True)
							n\EnemyZ = EntityZ(Curr173\Collider,True)
							n\State2 = 70.0*15.0 //give up after 15 seconds
							DebugLog "173 spotted :"+n\State2
							If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
							n\Sound = LoadSound_Strict("SFX/Character/MTF/173/Spotted3.ogg")
							PlayMTFSound(n\Sound, n)
							n\State3 = 0.0
							n\PathTimer=0.0
							n\PathStatus=0
						EndIf
					EndIf
				EndIf
				
				If Curr106\State <= 0
					If OtherNPCSeesMeNPC(Curr106,n) Or EntityDistance(n\Collider,Curr106\Collider)<3.0 Then
						If EntityVisible(n\Collider,Curr106\Collider) Then
							n\State = 4
							n\EnemyX = EntityX(Curr106\Collider,True)
							n\EnemyY = EntityY(Curr106\Collider,True)
							n\EnemyZ = EntityZ(Curr106\Collider,True)
							n\State2 = 70*15.0
							n\State3 = 0.0
							n\PathTimer = 0.0
							n\PathStatus = 0
							n\Target = Curr106
							DebugLog "106 spotted :"+n\State2
							If n\MTFLeader=Null
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/106/Spotted4.ogg")
								PlayMTFSound(n\Sound, n)
							EndIf
						EndIf
					EndIf
				EndIf
				
				If Curr096 != Null
					If OtherNPCSeesMeNPC(Curr096,n) Then
						If EntityVisible(n\Collider,Curr096\Collider) Then
							n\State = 8
							n\EnemyX = EntityX(Curr096\Collider,True)
							n\EnemyY = EntityY(Curr096\Collider,True)
							n\EnemyZ = EntityZ(Curr096\Collider,True)
							n\State2 = 70*15.0
							n\State3 = 0.0
							n\PathTimer = 0.0
							n\PathStatus = 0
							DebugLog "096 spotted :"+n\State2
							If n\MTFLeader=Null
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/096/Spotted"+Rand(1,2)+".ogg")
								PlayMTFSound(n\Sound, n)
							EndIf
						EndIf
					EndIf
				EndIf
				
				For n2.NPCs = Each NPCs
					If n2\NPCtype = NPCtype049
						If OtherNPCSeesMeNPC(n2,n) Then
							If EntityVisible(n\Collider,n2\Collider)
								n\State = 4
								n\EnemyX = EntityX(n2\Collider,True)
								n\EnemyY = EntityY(n2\Collider,True)
								n\EnemyZ = EntityZ(n2\Collider,True)
								n\State2 = 70*15.0
								n\State3 = 0.0
								n\PathTimer = 0.0
								n\PathStatus = 0
								n\Target = n2
								DebugLog "049 spotted :"+n\State2
								If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
								n\Sound = LoadSound_Strict("SFX/Character/MTF/049/Spotted"+Rand(1,5)+".ogg")
								PlayMTFSound(n\Sound, n)
								Exit
							EndIf
						EndIf
					ElseIf n2\NPCtype = NPCtypeZombie And n2\IsDead = False
						If OtherNPCSeesMeNPC(n2,n) Then
							If EntityVisible(n\Collider,n2\Collider)
								n\State = 9
								n\EnemyX = EntityX(n2\Collider,True)
								n\EnemyY = EntityY(n2\Collider,True)
								n\EnemyZ = EntityZ(n2\Collider,True)
								n\State2 = 70*15.0
								n\State3 = 0.0
								n\PathTimer = 0.0
								n\PathStatus = 0
								n\Target = n2
								n\Reload = 70*5
								DebugLog "049-2 spotted :"+n\State2
								//If n\MTFLeader=Null
									If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
									n\Sound = LoadSound_Strict("SFX/Character/MTF/049/Player0492_1.ogg")
									PlayMTFSound(n\Sound, n)
								//EndIf
								Exit
							EndIf
						EndIf
					EndIf
				Next
				
			Case 2 //searching for/looking at 173
                
                If Curr173\Idle = 2 Then
					n\State = 0
                Else
					For n2.NPCs = Each NPCs
						If n2!=n Then
							If n2\NPCtype = NPCtypeMTF Then
								n2\State = 2
							EndIf
						EndIf
					Next
					
					Local curr173Dist# = Distance(EntityX(n\Collider,True),EntityZ(n\Collider,True),EntityX(Curr173\Collider,True),EntityZ(Curr173\Collider,True))
					
					If curr173Dist<5.0 Then
						If Curr173\Idle != 2 Then Curr173\Idle = True
						n\State2 = 70.0*15.0
						n\PathTimer = 0.0
						Local tempDist# = 1.0
						If n\MTFLeader!=Null Then tempDist = 2.0
						If curr173Dist<tempDist Then
							If n\MTFLeader = Null Then
								n\State3=n\State3+FPSfactor
								DebugLog "CONTAINING 173: "+n\State3
								If n\State3>=70.0*15.0 Then
									Curr173\Idle = 2
									If n\MTFLeader = Null Then Curr173\Target = n
									If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
									n\Sound = LoadSound_Strict("SFX/Character/MTF/173/Box"+Rand(1,3)+".ogg")
									PlayMTFSound(n\Sound, n)
								EndIf
							EndIf
							PositionEntity n\obj,EntityX(Curr173\Collider,True),EntityY(Curr173\Collider,True),EntityZ(Curr173\Collider,True),True
							PointEntity n\Collider,n\obj
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							FinishWalking(n,488,522,n\Speed*26)
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
						Else
							PositionEntity n\obj,EntityX(Curr173\Collider,True),EntityY(Curr173\Collider,True),EntityZ(Curr173\Collider,True),True
							PointEntity n\Collider,n\obj
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
							
							n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
							TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
							AnimateNPC(n,488, 522, n\CurrSpeed*26)
						EndIf
					Else
						If Curr173\Idle != 2 Then Curr173\Idle = False
						If n\PathTimer<=0.0 Then //update path
							n\PathStatus = FindPath(n,EntityX(Curr173\Collider,True),EntityY(Curr173\Collider,True)+0.1,EntityZ(Curr173\Collider,True))
							n\PathTimer = 70.0 * Rnd(6.0,10.0) //search again after 6 seconds
						ElseIf n\PathTimer<=70.0 * 2.5 Then
							n\PathTimer=n\PathTimer-FPSfactor
							n\CurrSpeed = 0.0
							If Rand(1,35)=1 Then
								RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
							EndIf
							FinishWalking(n,488,522,n\Speed*26)
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
						Else
							If n\PathStatus=2 Then
								n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
								n\CurrSpeed = 0.0
								If Rand(1,35)=1 Then
									RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
								EndIf
								FinishWalking(n,488,522,n\Speed*26)
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
							ElseIf n\PathStatus=1 Then
								If n\Path[n\PathLocation]=Null Then
									If n\PathLocation > 19 Then
										n\PathLocation = 0 : n\PathStatus = 0
									Else
										n\PathLocation = n\PathLocation + 1
									EndIf
								Else
									prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
									
									PointEntity n\Collider,n\Path[n\PathLocation]\obj
									RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
									n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
									RotateEntity n\obj,-90.0,n\Angle,0.0,True
									
									n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
									
									TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
									AnimateNPC(n,488, 522, n\CurrSpeed*26)
									
									newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
									
									If (newDist<1.0 And n\Path[n\PathLocation]\door!=Null) Then
										//open the door and make it automatically close after 5 seconds
										If (Not n\Path[n\PathLocation]\door\open)
											sound = 0
											If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
											PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
											PlayMTFSound(MTFSFX(5),n)
										EndIf
										n\Path[n\PathLocation]\door\open = True
										If n\Path[n\PathLocation]\door\MTFClose
											n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
										EndIf
									EndIf
									
									If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
										n\PathLocation=n\PathLocation+1
									EndIf
								EndIf
								n\PathTimer=n\PathTimer-FPSfactor //timer goes down slow
							Else
								n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
								n\CurrSpeed = 0.0
								If Rand(1,35)=1 Then
									RotateEntity n\Collider,0.0,Rnd(360.0),0.0,True
								EndIf
								FinishWalking(n,488,522,n\Speed*26)
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
							EndIf
						EndIf
					EndIf
                EndIf
                
			Case 3 //following a path
				//[Block]
				
				n\Angle = CurveValue(0,n\Angle,40.0)
				
				If n\PathStatus = 2 Then
					n\State = 5
					n\CurrSpeed = 0
				ElseIf n\PathStatus = 1
					If n\Path[n\PathLocation]=Null Then 
						If n\PathLocation > 19 Then 
							n\PathLocation = 0
							n\PathStatus = 0
							If n\LastSeen > 0 Then n\State = 5
						Else
							n\PathLocation = n\PathLocation + 1
						EndIf
					Else
						If n\Path[n\PathLocation]\door != Null Then
							If n\Path[n\PathLocation]\door\open = False Then
								n\Path[n\PathLocation]\door\open = True
								n\Path[n\PathLocation]\door\timerstate = 8.0*70.0
								PlayMTFSound(MTFSFX(5),n)
							EndIf
						EndIf
						
						If dist < HideDistance*0.7 Then 
							dist2# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj) 
														
							PointEntity n\obj, n\Path[n\PathLocation]\obj
							
							RotateEntity n\Collider, 0, CurveAngle(EntityYaw(n\obj), EntityYaw(n\Collider), 10.0), 0
							If n\Idle = 0 Then
								n\CurrSpeed = CurveValue(n\Speed*Max(Min(dist2,1.0),0.1), n\CurrSpeed, 20.0)
								MoveEntity n\Collider, 0, 0, n\CurrSpeed * FPSfactor
								
								If EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)<0.5
									n\PathLocation = n\PathLocation + 1
								EndIf
							EndIf
						Else
							If Rand(20)=1 Then 
								PositionEntity n\Collider, EntityX(n\Path[n\PathLocation]\obj,True),EntityY(n\Path[n\PathLocation]\obj,True)+0.25,EntityZ(n\Path[n\PathLocation]\obj,True),True
								n\PathLocation = n\PathLocation + 1
								ResetEntity n\Collider
							EndIf
						EndIf
						
					EndIf
				Else
					n\CurrSpeed = 0
					n\State = 5
				EndIf
				
				
				If n\Idle = 0 And n\PathStatus = 1 Then
					If dist < HideDistance Then
						If n\Frame>959 Then
							AnimateNPC(n, 1376, 1383, 0.2, False)
							If n\Frame >1382.9 Then n\Frame = 488
						Else
							AnimateNPC(n, 488, 522, n\CurrSpeed*30)
						EndIf
					EndIf
				Else
					If dist < HideDistance Then
						If n\LastSeen > 0 Then 
							AnimateNPC(n, 78, 312, 0.2, True)
						Else
							If n\Frame<962 Then
								If n\Frame>487 Then n\Frame = 463
								AnimateNPC(n, 463, 487, 0.3, False)
								If n\Frame>486.9 Then n\Frame = 962
							Else
								AnimateNPC(n, 962, 1259, 0.3)
							EndIf
						EndIf
					EndIf
					
					n\CurrSpeed = CurveValue(0, n\CurrSpeed, 20.0)
				EndIf
				
				n\Angle = EntityYaw(n\Collider)
				
			Case 4 //SCP-106/049 detected
				//[Block]
				n\Speed = 0.03
                n\State2=n\State2-FPSfactor
				If n\State2 > 0.0
					If OtherNPCSeesMeNPC(n\Target,n)
						n\State2 = 70*15
					EndIf
					
					If EntityDistance(n\Target\Collider,n\Collider)>HideDistance
						If n\State2 > 70
							n\State2 = 70
						EndIf
					EndIf
					
					If EntityDistance(n\Target\Collider,n\Collider)<3.0 And n\State3 >= 0.0
						n\State3 = 70*5
					EndIf
					
					If n\State3 > 0.0
						n\PathStatus = 0
						n\PathLocation = 0
						n\Speed = 0.02
						PointEntity n\Collider,n\Target\Collider
						RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
						n\CurrSpeed = CurveValue(-n\Speed,n\CurrSpeed,20.0)
						TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
						AnimateNPC(n,522, 488, n\CurrSpeed*26)
						
						n\PathTimer = 1.0
						
						n\State3=Max(n\State3-FPSfactor,0)
						
						HideEntity n\Collider
						TurnEntity n\Collider,0,180,0
						EntityPick(n\Collider, 1.0)
						If PickedEntity() != 0 Then
							n\State3 = -70*2
						EndIf
						ShowEntity n\Collider
						TurnEntity n\Collider,0,180,0
					ElseIf n\State3 < 0.0
						n\State3 = Min(n\State3+FPSfactor,0)
					EndIf
					
					If n\PathTimer<=0.0 Then
						If n\MTFLeader!=Null Then
							n\PathStatus = FindPath(n,EntityX(n\MTFLeader\Collider,True),EntityY(n\MTFLeader\Collider,True)+0.1,EntityZ(n\MTFLeader\Collider,True))
						Else
							For r = Each Rooms
								If ((Abs(r\x-EntityX(n\Collider,True))>12.0) Or (Abs(r\z-EntityZ(n\Collider,True))>12.0)) And (Rand(1,Max(4-Int(Abs(r\z-EntityZ(n\Collider,True)/8.0)),2))=1) Then
									If EntityDistance(r\obj,n\Target\Collider)>6.0
										x = r\x
										y = 0.1
										z = r\z
										DebugLog r\RoomTemplate\Name
										Exit
									EndIf
								EndIf
							Next
							n\PathStatus = FindPath(n,x,y,z)
						EndIf
						If n\PathStatus = 1 Then
							While n\Path[n\PathLocation]=Null
								If n\PathLocation>19 Then Exit
								n\PathLocation=n\PathLocation+1
							Wend
							If n\PathLocation<19 Then
								If (n\Path[n\PathLocation]!=Null) And (n\Path[n\PathLocation+1]!=Null) Then
									If (n\Path[n\PathLocation]\door=Null) Then
										If Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation]\obj))>Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation+1]\obj)) Then
											n\PathLocation=n\PathLocation+1
										EndIf
									EndIf
								EndIf
							EndIf
						EndIf
						n\PathTimer = 70*10
					Else
						If n\PathStatus=1 Then
							If n\Path[n\PathLocation]=Null Then
								If n\PathLocation > 19 Then
									n\PathLocation = 0 : n\PathStatus = 0
								Else
									n\PathLocation = n\PathLocation + 1
								EndIf
							Else
								prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								PointEntity n\Collider,n\Path[n\PathLocation]\obj
								RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
								
								n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
								TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
								AnimateNPC(n,488, 522, n\CurrSpeed*26) //Placeholder (until running animation has been implemented)
								
								newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								If (newDist<2.0 And n\Path[n\PathLocation]\door!=Null) Then
									If (Not n\Path[n\PathLocation]\door\open)
										sound = 0
										If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
										PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
										PlayMTFSound(MTFSFX(5),n)
									EndIf
									n\Path[n\PathLocation]\door\open = True
									If n\Path[n\PathLocation]\door\MTFClose
										n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
									EndIf
								EndIf
								
								If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
									n\PathLocation=n\PathLocation+1
								EndIf
							EndIf
							n\PathTimer=n\PathTimer-FPSfactor
						Else
							n\PathTimer=0.0
						EndIf
					EndIf
				Else
					n\State = 0
				EndIf
				
			Case 5 //looking at some other target than the player
				//[Block]
				target=CreatePivot()
				PositionEntity target, n\EnemyX, n\EnemyY, n\EnemyZ, True
				
				If dist<HideDistance Then
					AnimateNPC(n, 346, 351, 0.2, False)
				EndIf
				
				If Abs(EntityX(target)-EntityX(n\Collider)) < 55.0 And Abs(EntityZ(target)-EntityZ(n\Collider)) < 55.0 And Abs(EntityY(target)-EntityY(n\Collider))< 20.0 Then
					
					PointEntity n\obj, target
					RotateEntity n\Collider, 0, CurveAngle(EntityYaw(n\obj),EntityYaw(n\Collider),30.0), 0, True
					
					If n\PathTimer = 0 Then
						n\PathStatus = EntityVisible(n\Collider,target)
						n\PathTimer = Rand(100,200)
					Else
						n\PathTimer = Min(n\PathTimer-FPSfactor,0.0)
					EndIf
					
					If n\PathStatus = 1 And n\Reload <= 0 Then
						dist# = Distance(EntityX(target),EntityZ(target),EntityX(n\Collider),EntityZ(n\Collider))
						
					EndIf
				EndIf		
				
				FreeEntity target
				
				n\Angle = EntityYaw(n\Collider)
				
			Case 6 //seeing the player as a 049-2 instance
				//[Block]
				
				PointEntity n\obj,Collider
				RotateEntity n\Collider,0,CurveAngle(EntityYaw(n\obj),EntityYaw(n\Collider),20.0),0
				n\Angle = EntityYaw(n\Collider)
				
				AnimateNPC(n, 346, 351, 0.2, False)
				
				If n\Reload <= 0 And KillTimer = 0 Then
					If EntityVisible(n\Collider, Collider) Then
						If (Abs(DeltaYaw(n\Collider,Collider))<50.0)
							//prev% = KillTimer
							
							PlaySound2(GunshotSFX, Camera, n\Collider, 15)
							
							pvt% = CreatePivot()
							
							RotateEntity(pvt, EntityPitch(n\Collider), EntityYaw(n\Collider), 0, True)
							PositionEntity(pvt, EntityX(n\obj), EntityY(n\obj), EntityZ(n\obj))
							MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
							
							Shoot(EntityX(pvt),EntityY(pvt),EntityZ(pvt),0.9, False)
							n\Reload = 7
							
							FreeEntity(pvt)
						EndIf	
					EndIf
				EndIf
				
				
			Case 7 //just shooting
				//[Block]
				AnimateNPC(n, 346, 351, 0.2, False)
				
				RotateEntity n\Collider,0,CurveAngle(n\State2,EntityYaw(n\Collider),20),0
				n\Angle = EntityYaw(n\Collider)
				
				If n\Reload <= 0 
					LightVolume = TempLightVolume*1.2
					PlaySound2(GunshotSFX, Camera, n\Collider, 20)
					
					pvt% = CreatePivot()
					
					RotateEntity(pvt, EntityPitch(n\Collider), EntityYaw(n\Collider), 0, True)
					PositionEntity(pvt, EntityX(n\obj), EntityY(n\obj), EntityZ(n\obj))
					MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
					
					p.Particles = CreateParticle(EntityX(pvt), EntityY(pvt), EntityZ(pvt), 1, Rnd(0.08,0.1), 0.0, 5)
					TurnEntity p\obj, 0,0,Rnd(360)
					p\Achange = -0.15
					
					FreeEntity(pvt)
					n\Reload = 7
				End If
				
			Case 8 //SCP-096 spotted
				//[Block]
				n\Speed = 0.015
				n\BoneToManipulate = "head"
				n\ManipulateBone = True
				n\ManipulationType = 2
                If n\PathTimer<=0.0 Then //update path
					If n\MTFLeader!=Null Then //i'll follow the leader
						n\PathStatus = FindPath(n,EntityX(n\MTFLeader\Collider,True),EntityY(n\MTFLeader\Collider,True)+0.1,EntityZ(n\MTFLeader\Collider,True)) //whatever you say boss
					Else //i am the leader
						For r = Each Rooms
							If ((Abs(r\x-EntityX(n\Collider,True))>12.0) Or (Abs(r\z-EntityZ(n\Collider,True))>12.0)) And (Rand(1,Max(4-Int(Abs(r\z-EntityZ(n\Collider,True)/8.0)),2))=1) Then
								x = r\x
								y = 0.1
								z = r\z
								DebugLog r\RoomTemplate\Name
								Exit
							EndIf
						Next
						n\PathStatus = FindPath(n,x,y,z) //we're going to this room for no particular reason
					EndIf
					If n\PathStatus = 1 Then
						While n\Path[n\PathLocation]=Null
							If n\PathLocation>19 Then Exit
							n\PathLocation=n\PathLocation+1
						Wend
						If n\PathLocation<19 Then
							If (n\Path[n\PathLocation]!=Null) And (n\Path[n\PathLocation+1]!=Null) Then
								If (n\Path[n\PathLocation]\door=Null) Then
									If Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation]\obj))>Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation+1]\obj)) Then
										n\PathLocation=n\PathLocation+1
									EndIf
								EndIf
							EndIf
						EndIf
					EndIf
					n\PathTimer = 70.0 * Rnd(6.0,10.0) //search again after 6-10 seconds
                ElseIf (n\PathTimer<=70.0 * 2.5) And (n\MTFLeader=Null) Then
					n\PathTimer=n\PathTimer-FPSfactor
					n\CurrSpeed = 0.0
					FinishWalking(n,488,522,n\Speed*26)
					n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
					RotateEntity n\obj,-90.0,n\Angle,0.0,True
                Else
					If n\PathStatus=2 Then
						n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
						n\CurrSpeed = 0.0
						FinishWalking(n,488,522,n\Speed*26)
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
					ElseIf n\PathStatus=1 Then
						If n\Path[n\PathLocation]=Null Then
							If n\PathLocation > 19 Then
								n\PathLocation = 0 : n\PathStatus = 0
							Else
								n\PathLocation = n\PathLocation + 1
							EndIf
						Else
							prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
							
							PointEntity n\Collider,n\Path[n\PathLocation]\obj
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
							RotateEntity n\obj,-90.0,n\Angle,0.0,True
							
							n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
							//MoveEntity n\Collider, 0, 0, n\CurrSpeed * FPSfactor
							TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
							AnimateNPC(n,488, 522, n\CurrSpeed*26)
							
							newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
							
							If (newDist<1.0 And n\Path[n\PathLocation]\door!=Null) Then
								//open the door and make it automatically close after 5 seconds
								If (Not n\Path[n\PathLocation]\door\open)
									sound = 0
									If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
									PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
									PlayMTFSound(MTFSFX(5),n)
								EndIf
								n\Path[n\PathLocation]\door\open = True
								If n\Path[n\PathLocation]\door\MTFClose
									n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
								EndIf
							EndIf
                            
							If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
								n\PathLocation=n\PathLocation+1
							EndIf
						EndIf
						n\PathTimer=n\PathTimer-FPSfactor //timer goes down slow
					Else
						n\PathTimer=n\PathTimer-(FPSfactor*2.0) //timer goes down fast
						If n\MTFLeader = Null Then

							FinishWalking(n,488,522,n\Speed*26)
							n\CurrSpeed = 0.0
						ElseIf EntityDistance(n\Collider,n\MTFLeader\Collider)>1.0 Then
							PointEntity n\Collider,n\MTFLeader\Collider
							RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
							
							n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
							TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
							AnimateNPC(n,488, 522, n\CurrSpeed*26)
						Else
							FinishWalking(n,488,522,n\Speed*26)
							n\CurrSpeed = 0.0
						EndIf
						n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
						RotateEntity n\obj,-90.0,n\Angle,0.0,True
					EndIf
                EndIf
				
				If (Not EntityVisible(n\Collider,Curr096\Collider)) Or EntityDistance(n\Collider,Curr096\Collider)>6.0
					n\State = 0
				EndIf
				
			Case 9 //SCP-049-2/008 spotted
				//[Block]
				If EntityVisible(n\Collider, n\Target\Collider) Then
					PointEntity n\obj,n\Target\Collider
					RotateEntity n\Collider,0,CurveAngle(EntityYaw(n\obj),EntityYaw(n\Collider),20.0),0
					n\Angle = EntityYaw(n\Collider)
					
					If EntityDistance(n\Target\Collider,n\Collider)<1.3
						n\State3 = 70*2
					EndIf
					
					If n\State3 > 0.0
						n\PathStatus = 0
						n\PathLocation = 0
						n\Speed = 0.02
						n\CurrSpeed = CurveValue(-n\Speed,n\CurrSpeed,20.0)
						TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
						AnimateNPC(n,522, 488, n\CurrSpeed*26)
						
						n\PathTimer = 1.0
						
						n\State3=Max(n\State3-FPSfactor,0)
					Else
						n\State3 = 0
						AnimateNPC(n, 346, 351, 0.2, False)
					EndIf
					If n\Reload <= 0 And n\Target\IsDead = False Then
						If (Abs(DeltaYaw(n\Collider,n\Target\Collider))<50.0)
							//prev% = KillTimer
							
							PlaySound2(GunshotSFX, Camera, n\Collider, 15)
							
							pvt% = CreatePivot()
							
							RotateEntity(pvt, EntityPitch(n\Collider), EntityYaw(n\Collider), 0, True)
							PositionEntity(pvt, EntityX(n\obj), EntityY(n\obj), EntityZ(n\obj))
							MoveEntity (pvt,0.8*0.079, 10.75*0.079, 6.9*0.079)
							
							p.Particles = CreateParticle(EntityX(pvt), EntityY(pvt), EntityZ(pvt), 1, Rnd(0.08,0.1), 0.0, 5)
							TurnEntity p\obj, 0,0,Rnd(360)
							p\Achange = -0.15
							If n\Target\HP > 0
								n\Target\HP = Max(n\Target\HP-Rand(5,10),0)
							Else
								If (Not n\Target\IsDead)
									If n\Sound != 0 Then FreeSound_Strict n\Sound : n\Sound = 0
									If n\NPCtype = NPCtypeZombie
										n\Sound = LoadSound_Strict("SFX\Character\MTF\049\Player0492_2.ogg")
										PlayMTFSound(n\Sound, n)
									Else
										//Still needs to be added! (for 008)
									EndIf
								EndIf
								SetNPCFrame(n\Target,133)
								n\Target\IsDead = True
								n\Target = Null
								n\State = 0
								Return
							EndIf
							n\Reload = 7
							
							FreeEntity(pvt)
						EndIf	
					EndIf
					n\PathStatus = 0
				Else
					If n\PathTimer<=0.0 Then
						n\PathStatus = FindPath(n,EntityX(n\Target\Collider),EntityY(n\Target\Collider),EntityZ(n\Target\Collider))
						If n\PathStatus = 1 Then
							While n\Path[n\PathLocation]=Null
								If n\PathLocation>19 Then Exit
								n\PathLocation=n\PathLocation+1
							Wend
							If n\PathLocation<19 Then
								If (n\Path[n\PathLocation]!=Null) And (n\Path[n\PathLocation+1]!=Null) Then
									If (n\Path[n\PathLocation]\door=Null) Then
										If Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation]\obj))>Abs(DeltaYaw(n\Collider,n\Path[n\PathLocation+1]\obj)) Then
											n\PathLocation=n\PathLocation+1
										EndIf
									EndIf
								EndIf
							EndIf
						EndIf
						n\PathTimer = 70*10
					Else
						If n\PathStatus=1 Then
							If n\Path[n\PathLocation]=Null Then
								If n\PathLocation > 19 Then
									n\PathLocation = 0 : n\PathStatus = 0
								Else
									n\PathLocation = n\PathLocation + 1
								EndIf
							Else
								prevDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								PointEntity n\Collider,n\Path[n\PathLocation]\obj
								RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
								n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
								RotateEntity n\obj,-90.0,n\Angle,0.0,True
								
								n\CurrSpeed = CurveValue(n\Speed,n\CurrSpeed,20.0)
								TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90.0)*n\CurrSpeed * FPSfactor, True
								AnimateNPC(n,488, 522, n\CurrSpeed*26)
								
								newDist# = EntityDistance(n\Collider,n\Path[n\PathLocation]\obj)
								
								If (newDist<1.0 And n\Path[n\PathLocation]\door!=Null) Then
									If (Not n\Path[n\PathLocation]\door\open)
										sound = 0
										If n\Path[n\PathLocation]\door\dir = 1 Then sound = 0 Else sound=Rand(0, 2)
										PlaySound2(OpenDoorSFX(n\Path[n\PathLocation]\door\dir,sound),Camera,n\Path[n\PathLocation]\door\obj)
										PlayMTFSound(MTFSFX(5),n)
									EndIf
									n\Path[n\PathLocation]\door\open = True
									If n\Path[n\PathLocation]\door\MTFClose
										n\Path[n\PathLocation]\door\timerstate = 70.0*5.0
									EndIf
								EndIf
								
								If (newDist<0.2) Or ((prevDist<newDist) And (prevDist<1.0)) Then
									n\PathLocation=n\PathLocation+1
								EndIf
							EndIf
							n\PathTimer=n\PathTimer-FPSfactor
						Else
							n\PathTimer=0.0
						EndIf
					EndIf
				EndIf
				
				If n\Target\IsDead = True Then
					n\Target = Null
					n\State = 0
				EndIf
				
				//[End Block]
		End Select
		
		If n\CurrSpeed > 0.01 Then
			If prevFrame > 500 And n\Frame<495
				PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n\Collider, 8.0, Rnd(0.5,0.7))
			ElseIf prevFrame < 505 And n\Frame>=505
				PlaySound2(StepSFX(2,0,Rand(0,2)),Camera, n\Collider, 8.0, Rnd(0.5,0.7))
			EndIf
		EndIf
		
		If NoTarget And n\State = 1 Then n\State = 0
		
		If n\State != 3 And n\State != 5 And n\State != 6 And n\State != 7
			If n\MTFLeader!=Null Then
				If EntityDistance(n\Collider,n\MTFLeader\Collider)<0.7 Then
					PointEntity n\Collider,n\MTFLeader\Collider
					RotateEntity n\Collider,0.0,EntityYaw(n\Collider,True),0.0,True
					n\Angle = CurveAngle(EntityYaw(n\Collider,True),n\Angle,20.0)
					
					TranslateEntity n\Collider, Cos(EntityYaw(n\Collider,True)-45)* 0.01 * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)-45)* 0.01 * FPSfactor, True
				EndIf
			Else
				For n2.NPCs = Each NPCs
					If n2!=n And n2\IsDead=False Then
						If Abs(DeltaYaw(n\Collider,n2\Collider))<80.0 Then
							If EntityDistance(n\Collider,n2\Collider)<0.7 Then							
								TranslateEntity n2\Collider, Cos(EntityYaw(n\Collider,True)+90)* 0.01 * FPSfactor, 0, Sin(EntityYaw(n\Collider,True)+90)* 0.01 * FPSfactor, True
							EndIf
						EndIf
					EndIf
				Next
			EndIf
		EndIf
		
		//teleport back to the facility if fell through the floor
		If n\State != 6 And n\State != 7
			If (EntityY(n\Collider) < -10.0) Then
				TeleportCloser(n)
			EndIf
		EndIf
		
		RotateEntity n\obj,-90.0,n\Angle,0.0,True
		
		PositionEntity n\obj,EntityX(n\Collider,True),EntityY(n\Collider,True)-0.15,EntityZ(n\Collider,True),True
		
	EndIf
End Function

Function Shoot(x#, y#, z#, hitProb# = 1.0, particles% = True, instaKill% = False)
	
	//muzzle flash
	Local p.Particles = CreateParticle(x,y,z, 1, Rnd(0.08,0.1), 0.0, 5)
	TurnEntity p\obj, 0,0,Rnd(360)
	p\Achange = -0.15
	
	LightVolume = TempLightVolume*1.2
	
	If (Not GodMode) Then 
		
		If instaKill Then Kill() : PlaySound_Strict BullethitSFX : Return
		
		If Rnd(1.0) <= hitProb Then
			TurnEntity Camera, Rnd(-3,3), Rnd(-3,3), 0
			
			Local ShotMessageUpdate$
			If WearingVest>0 Then
				If WearingVest = 1 Then
					Select Rand(8)
						Case 1,2,3,4,5
							BlurTimer = 500
							Stamina = 0
							ShotMessageUpdate = "A bullet penetrated your vest, making you gasp."
							Injuries = Injuries + Rnd(0.1,0.5)
						Case 6
							BlurTimer = 500
							ShotMessageUpdate = "A bullet hit your left leg."
							Injuries = Injuries + Rnd(0.8,1.2)
						Case 7
							BlurTimer = 500
							ShotMessageUpdate = "A bullet hit your right leg."
							Injuries = Injuries + Rnd(0.8,1.2)
						Case 8
							BlurTimer = 500
							Stamina = 0
							ShotMessageUpdate = "A bullet struck your neck, making you gasp."
							Injuries = Injuries + Rnd(1.2,1.6)
					End Select	
				Else
					If Rand(10)=1 Then
						BlurTimer = 500
						Stamina = Stamina - 1
						ShotMessageUpdate = "A bullet hit your chest. The vest absorbed some of the damage."
						Injuries = Injuries + Rnd(0.8,1.1)
					Else
						ShotMessageUpdate = "A bullet hit your chest. The vest absorbed most of the damage."
						Injuries = Injuries + Rnd(0.1,0.5)
					EndIf
				EndIf
				
				If Injuries >= 5
					If Rand(3) = 1 Then Kill()
				EndIf
			Else
				Select Rand(6)
					Case 1
						Kill()
					Case 2
						BlurTimer = 500
						ShotMessageUpdate = "A bullet hit your left leg."
						Injuries = Injuries + Rnd(0.8,1.2)
					Case 3
						BlurTimer = 500
						ShotMessageUpdate = "A bullet hit your right leg."
						Injuries = Injuries + Rnd(0.8,1.2)
					Case 4
						BlurTimer = 500
						ShotMessageUpdate = "A bullet hit your right shoulder."
						Injuries = Injuries + Rnd(0.8,1.2)	
					Case 5
						BlurTimer = 500
						ShotMessageUpdate = "A bullet hit your left shoulder."
						Injuries = Injuries + Rnd(0.8,1.2)	
					Case 6
						BlurTimer = 500
						ShotMessageUpdate = "A bullet hit your right shoulder."
						Injuries = Injuries + Rnd(2.5,4.0)
				End Select
			EndIf
			
			//Only updates the message if it's been more than two seconds.
			If (MsgTimer < 64*4) Then
				Msg = ShotMessageUpdate
				MsgTimer = 70*6
			EndIf

			Injuries = Min(Injuries, 4.0)
			
			//Kill()
			PlaySound_Strict BullethitSFX
		ElseIf particles And ParticleAmount>0
			pvt = CreatePivot()
			PositionEntity pvt, EntityX(Collider),(EntityY(Collider)+EntityY(Camera))/2,EntityZ(Collider)
			PointEntity pvt, p\obj
			TurnEntity pvt, 0, 180, 0
			
			EntityPick(pvt, 2.5)
			
			If PickedEntity() != 0 Then 
				PlaySound2(Gunshot3SFX, Camera, pvt, 0.4, Rnd(0.8,1.0))
				
				If particles Then 
					//dust/smoke particles
					p.Particles = CreateParticle(PickedX(),PickedY(),PickedZ(), 0, 0.03, 0, 80)
					p\speed = 0.001
					p\SizeChange = 0.003
					p\A = 0.8
					p\Achange = -0.01
					RotateEntity p\pvt, EntityPitch(pvt)-180, EntityYaw(pvt),0
					
					For i = 0 To Rand(2,3)
						p.Particles = CreateParticle(PickedX(),PickedY(),PickedZ(), 0, 0.006, 0.003, 80)
						p\speed = 0.02
						p\A = 0.8
						p\Achange = -0.01
						RotateEntity p\pvt, EntityPitch(pvt)+Rnd(170,190), EntityYaw(pvt)+Rnd(-10,10),0	
					Next
					
					//bullet hole decal
					Local de.Decals = CreateDecal(Rand(13,14), PickedX(),PickedY(),PickedZ(), 0,0,0)
					AlignToVector de\obj,-PickedNX(),-PickedNY(),-PickedNZ(),3
					MoveEntity de\obj, 0,0,-0.001
					EntityFX de\obj, 1
					de\lifetime = 70*20
					EntityBlend de\obj, 2
					de\Size = Rnd(0.028,0.034)
					ScaleSprite de\obj, de\Size, de\Size
				EndIf				
			EndIf
			FreeEntity pvt
			
		EndIf
		
	EndIf
	
End Function

Function PlayMTFSound(sound%, n.NPCs)
	If n != Null Then
		n\SoundChn = PlaySound2(sound, Camera, n\Collider, 8.0)	
	EndIf
	
	If SelectedItem != Null Then
		If SelectedItem\state2 = 3 And SelectedItem\state > 0 Then 
			Select SelectedItem\itemtemplate\tempname 
				Case "radio","fineradio","18vradio"
					If sound!=MTFSFX(5) Or (Not ChannelPlaying(RadioCHN(3)))
						If RadioCHN(3)!= 0 Then StopChannel RadioCHN(3)
						RadioCHN(3) = PlaySound_Strict (sound)
					EndIf
			End Select
		EndIf
	EndIf 
End Function

Function MoveToPocketDimension()
	Local r.Rooms
	
	For r.Rooms = Each Rooms
		If r\RoomTemplate\Name = "pocketdimension" Then
			FallTimer = 0
			UpdateDoors()
			UpdateRooms()
			ShowEntity Collider
			PlaySound_Strict(Use914SFX)
			PlaySound_Strict(OldManSFX(5))
			PositionEntity(Collider, EntityX(r\obj),0.8,EntityZ(r\obj))
			DropSpeed = 0
			ResetEntity Collider
			
			BlinkTimer = -10
			
			Injuries = Injuries+0.5
			
			PlayerRoom = r
			
			Return
		EndIf
	Next		
End Function

Function FindFreeNPCID%()
	Local id% = 1
	While (True)
		Local taken% = False
		For n2.NPCs = Each NPCs
			If n2\ID = id Then
				taken = True
				Exit
			EndIf
		Next
		If (Not taken) Then
			Return id
		EndIf
		id = id + 1
	Wend
End Function

Function ForceSetNPCID(n.NPCs, newID%)
	n\ID = newID
	
	For n2.NPCs = Each NPCs
		If n2 != n And n2\ID = newID Then
			n2\id = FindFreeNPCID()
		EndIf
	Next
End Function

Function Find860Angle(n.NPCs, fr.Forest)
	TFormPoint(EntityX(Collider),EntityY(Collider),EntityZ(Collider),0,fr\Forest_Pivot)
	Local playerx = Floor((TFormedX()+6.0)/12.0)
	Local playerz = Floor((TFormedZ()+6.0)/12.0)
	
	TFormPoint(EntityX(n\Collider),EntityY(n\Collider),EntityZ(n\Collider),0,fr\Forest_Pivot)
	Local x# = (TFormedX()+6.0)/12.0
	Local z# = (TFormedZ()+6.0)/12.0
	
	Local xt = Floor(x), zt = Floor(z)
	
	Local x2,z2
	If xt!=playerx Or zt!=playerz Then //the monster is not on the same tile as the player
		For x2 = Max(xt-1,0) To Min(xt+1,gridsize-1)
			For z2 = Max(zt-1,0) To Min(zt+1,gridsize-1)
				If fr\grid[(z2*gridsize)+x2]>0 And (x2!=xt Or z2!=zt) And (x2=xt Or z2=zt) Then
					
					//tile (x2,z2) is closer to the player than the monsters current tile
					If (Abs(playerx-x2)+Abs(playerz-z2))<(Abs(playerx-xt)+Abs(playerz-zt)) Then
						//calculate the position of the tile in world coordinates
						TFormPoint(x2*12.0,0,z2*12.0,fr\Forest_Pivot,0)
						
						Return point_direction(EntityX(n\Collider),EntityZ(n\Collider),TFormedX(),TFormedZ())+180
					EndIf
					
				EndIf
			Next
		Next
	Else
		Return point_direction(EntityX(n\Collider),EntityZ(n\Collider),EntityX(Collider),EntityZ(Collider))+180
	EndIf		
End Function

Function Console_SpawnNPC(c_input$, c_state$ = "")
	Local n.NPCs
	Local consoleMSG$
	
	Select c_input$ 
		Case "008", "008zombie"
			n.NPCs = CreateNPC(NPCtype008, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			n\State = 1
			consoleMSG = "SCP-008 infected human spawned."
			
		Case "049", "scp049", "scp-049"
			n.NPCs = CreateNPC(NPCtype049, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			n\State = 1
			consoleMSG = "SCP-049 spawned."
			
		Case "049-2", "0492", "scp-049-2", "scp049-2", "049zombie"
			n.NPCs = CreateNPC(NPCtypeZombie, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			n\State = 1
			consoleMSG = "SCP-049-2 spawned."
			
		Case "066", "scp066", "scp-066"
			n.NPCs = CreateNPC(NPCtype066, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "SCP-066 spawned."
			
		Case "096", "scp096", "scp-096"
			n.NPCs = CreateNPC(NPCtype096, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			n\State = 5
			If (Curr096 = Null) Then Curr096 = n
			consoleMSG = "SCP-096 spawned."
			
		Case "106", "scp106", "scp-106", "larry"
			n.NPCs = CreateNPC(NPCtypeOldMan, EntityX(Collider), EntityY(Collider) - 0.5, EntityZ(Collider))
			n\State = -1
			consoleMSG = "SCP-106 spawned."
			
		Case "173", "scp173", "scp-173", "statue"
			n.NPCs = CreateNPC(NPCtype173, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			Curr173 = n
			If (Curr173\Idle = 3) Then Curr173\Idle = False
			consoleMSG = "SCP-173 spawned."
		Case "372", "scp372", "scp-372"
			n.NPCs = CreateNPC(NPCtype372, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "SCP-372 spawned."
			
		Case "513-1", "5131", "scp513-1", "scp-513-1"
			n.NPCs = CreateNPC(NPCtype5131, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "SCP-513-1 spawned."
			
		Case "860-2", "8602", "scp860-2", "scp-860-2"
			CreateConsoleMsg("SCP-860-2 cannot be spawned with the console. Sorry!", 255, 0, 0)
			
		Case "939", "scp939", "scp-939"
			CreateConsoleMsg("SCP-939 instances cannot be spawned with the console. Sorry!", 255, 0, 0)

		Case "966", "scp966", "scp-966"
			n.NPCs = CreateNPC(NPCtype966, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "SCP-966 instance spawned."
			
		Case "1048-a", "scp1048-a", "scp-1048-a", "scp1048a", "scp-1048a"
			CreateConsoleMsg("SCP-1048-A cannot be spawned with the console. Sorry!", 255, 0, 0)
			
		Case "1499-1", "14991", "scp-1499-1", "scp1499-1"
			n.NPCs = CreateNPC(NPCtype1499, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "SCP-1499-1 instance spawned."
			
		Case "class-d", "classd", "d"
			n.NPCs = CreateNPC(NPCtypeD, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "D-Class spawned."
			
		Case "guard"
			n.NPCs = CreateNPC(NPCtypeGuard, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "Guard spawned."
			
		Case "mtf"
			n.NPCs = CreateNPC(NPCtypeMTF, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "MTF unit spawned."
			
		Case "apache", "helicopter"
			n.NPCs = CreateNPC(NPCtypeApache, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "Apache spawned."
			
		Case "tentacle"
			n.NPCs = CreateNPC(NPCtypeTentacle, EntityX(Collider), EntityY(Collider), EntityZ(Collider))
			consoleMSG = "SCP-035 tentacle spawned."
			
		Case "clerk"
			n.NPCs = CreateNPC(NPCtypeClerk, EntityX(Collider), EntityY(Collider) + 0.2, EntityZ(Collider))
			consoleMSG = "Clerk spawned."
			
		Default 
			CreateConsoleMsg("NPC type not found.", 255, 0, 0) : Return
	End Select
	
	If n != Null
		If c_state != "" Then n\State = Float(c_state) : consoleMSG = consoleMSG + " (State = " + n\State + ")"
	EndIf
	
	CreateConsoleMsg(consoleMSG)
	
End Function

Function ManipulateNPCBones()
	Local n.NPCs,bone%,pvt%,bonename$
	Local maxvalue#,minvalue#,offset#,smooth#
	Local i%
	Local tovalue#
	
	For n = Each NPCs
		If n\ManipulateBone
			bonename$ = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"bonename",0)
			If bonename$!=""
				pvt% = CreatePivot()
				bone% = FindChild(n\obj,bonename$)
				If bone% = 0 Then RuntimeError "ERROR: NPC bone "+Chr(34)+bonename$+Chr(34)+" does not exist."
				PositionEntity pvt%,EntityX(bone%,True),EntityY(bone%,True),EntityZ(bone%,True)
				Select n\ManipulationType
					Case 0 //<--- looking at player
						For i = 1 To GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controller_max",1)
							If GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i,0) = "pitch"
								maxvalue# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_max",2)
								minvalue# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_min",2)
								offset# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_offset",2)
								If GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_inverse",3)
									tovalue = -DeltaPitch(bone,Camera)+offset
								Else
									tovalue = DeltaPitch(bone,Camera)+offset
								EndIf
								//n\BonePitch = CurveAngle(tovalue,n\BonePitch,20.0)
								smooth# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_smoothing",2)
								If smooth>0.0
									n\BonePitch = CurveAngle(tovalue,n\BonePitch,smooth)
								Else
									n\BonePitch = tovalue
								EndIf
								n\BonePitch = ChangeAngleValueForCorrectBoneAssigning(n\BonePitch)
								n\BonePitch = Max(Min(n\BonePitch,maxvalue),minvalue)
							ElseIf GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis1",0) = "yaw"
								maxvalue# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_max",2)
								minvalue# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_min",2)
								offset# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_offset",2)
								If GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_inverse",3)
									tovalue = -DeltaYaw(bone,Camera)+offset
								Else
									tovalue = DeltaYaw(bone,Camera)+offset
								EndIf
								//n\BoneYaw = CurveAngle(tovalue,n\BoneYaw,20.0)
								smooth# = GetNPCManipulationValue(n\NPCNameInSection,n\BoneToManipulate,"controlleraxis"+i+"_smoothing",2)
								If smooth>0.0
									n\BoneYaw = CurveAngle(tovalue,n\BoneYaw,smooth)
								Else
									n\BoneYaw = tovalue
								EndIf
								n\BoneYaw = ChangeAngleValueForCorrectBoneAssigning(n\BoneYaw)
								n\BoneYaw = Max(Min(n\BoneYaw,maxvalue),minvalue)
							//ElseIf --> (Roll Value)
							//	
							EndIf
						Next
						
						RotateEntity bone%,EntityPitch(bone)+n\BonePitch,EntityYaw(bone)+n\BoneYaw,EntityRoll(bone)+n\BoneRoll
				End Select
				FreeEntity pvt%
			EndIf
		Else
			
		EndIf
	Next
	
End Function

Function GetNPCManipulationValue$(NPC$,bone$,section$,valuetype%=0)
	//valuetype determines what type of variable should the Output be returned
	//0 - String
	//1 - Int
	//2 - Float
	//3 - Boolean
	
	Local value$ = GetINIString("Data\NPCBones.ini",NPC$,bone$+"_"+section$)
	Select valuetype%
		Case 0
			Return value$
		Case 1
			Return Int(value$)
		Case 2
			Return Float(value$)
		Case 3
			If value$ = "true" Or value$ = "1"
				Return True
			Else
				Return False
			EndIf
	End Select
	
End Function

Function ChangeAngleValueForCorrectBoneAssigning(value#)
	Local numb#
	
	If value# <= 180.0
		numb# = value#
	Else
		numb# = -360+value#
	EndIf
	
	Return numb#
End Function

Function NPCSpeedChange(n.NPCs)
	
	Select n\NPCtype
		Case NPCtype173,NPCtypeOldMan,NPCtype096,NPCtype049,NPCtype939,NPCtypeMTF
			Select SelectedDifficulty\otherFactors
				Case NORMAL
					n\Speed = n\Speed * 1.1
				Case HARD
					n\Speed = n\Speed * 1.2
			End Select
	End Select
	
End Function

Function PlayerInReachableRoom(canSpawnIn049Chamber%=False)
	Local RN$ = PlayerRoom\RoomTemplate\Name$
	Local e.Events, temp
	
	//Player is in these rooms, returning false
	If RN = "pocketdimension" Or RN = "gatea" Or RN = "dimension1499" Or RN = "173" Then
		Return False
	EndIf
	//Player is at GateB and is at the surface, returning false
	If RN = "exit1" And EntityY(Collider)>1040.0*RoomScale Then
		Return False
	EndIf
	//Player is in 860's test room and inside the forest, returning false
	temp = False
	For e = Each Events
		If e\EventName$ = "room860" And e\EventState = 1.0 Then
			temp = True
			Exit
		EndIf
	Next
	If RN = "room860" And temp Then
		Return False
	EndIf
	If (Not canSpawnIn049Chamber) Then
		If SelectedDifficulty\aggressiveNPCs = False Then
			If RN = "room049" And EntityY(Collider)<=-2848*RoomScale Then
				Return False
			EndIf
		EndIf
	EndIf
	//Return true, this means player is in reachable room
	Return True
	
End Function

Function CheckForNPCInFacility(n.NPCs)
	//False (=0): NPC is not in facility (mostly meant for "dimension1499")
	//True (=1): NPC is in facility
	//2: NPC is in tunnels (maintenance tunnels/049 tunnels/939 storage room, etc...)
	
	If EntityY(n\Collider)>100.0
		Return False
	EndIf
	If EntityY(n\Collider)< -10.0
		Return 2
	EndIf
	If EntityY(n\Collider)> 7.0 And EntityY(n\Collider)<=100.0
		Return 2
	EndIf
	
	Return True
End Function

Function FindNextElevator(n.NPCs)
	Local eo.ElevatorObj, eo2.ElevatorObj
	
	For eo = Each ElevatorObj
		If eo\InFacility = n\InFacility
			If Abs(EntityY(eo\obj,True)-EntityY(n\Collider))<10.0
				For eo2 = Each ElevatorObj
					If eo2 != eo
						If eo2\InFacility = n\InFacility
							If Abs(EntityY(eo2\obj,True)-EntityY(n\Collider))<10.0
								If EntityDistance(eo2\obj,n\Collider)<EntityDistance(eo\obj,n\Collider)
									n\PathStatus = FindPath(n, EntityX(eo2\obj,True),EntityY(eo2\obj,True),EntityZ(eo2\obj,True))
									n\CurrElevator = eo2
									DebugLog "eo2 found for "+n\NPCtype
									Exit
								EndIf
							EndIf
						EndIf
					EndIf
				Next
				If n\CurrElevator = Null
					n\PathStatus = FindPath(n, EntityX(eo\obj,True),EntityY(eo\obj,True),EntityZ(eo\obj,True))
					n\CurrElevator = eo
					DebugLog "eo found for "+n\NPCtype
				EndIf
				If n\PathStatus != 1
					n\CurrElevator = Null
					DebugLog "Unable to find elevator path: Resetting CurrElevator"
				EndIf
				Exit
			EndIf
		EndIf
	Next
	
End Function

Function GoToElevator(n.NPCs)
	Local dist#,inside%
	
	If n\PathStatus != 1
		PointEntity n\obj,n\CurrElevator\obj
		RotateEntity n\Collider,0,CurveAngle(EntityYaw(n\obj),EntityYaw(n\Collider),20.0),0
		
		inside% = False
		If Abs(EntityX(n\Collider)-EntityX(n\CurrElevator\obj,True))<280.0*RoomScale
			If Abs(EntityZ(n\Collider)-EntityZ(n\CurrElevator\obj,True))<280.0*RoomScale Then
				If Abs(EntityY(n\Collider)-EntityY(n\CurrElevator\obj,True))<280.0*RoomScale Then
					inside% = True
				EndIf
			EndIf
		EndIf
		
		dist# = EntityDistance(n\Collider,n\CurrElevator\door\frameobj)
		If n\CurrElevator\door\open
			If (dist# > 0.4 And dist# < 0.7) And inside%
				UseDoor(n\CurrElevator\door,False)
				DebugLog n\NPCtype+" used elevator"
			EndIf
		Else
			If dist# < 0.7
				n\CurrSpeed = 0.0
				If n\CurrElevator\door\NPCCalledElevator=False
					n\CurrElevator\door\NPCCalledElevator = True
					DebugLog n\NPCtype+" called elevator"
				EndIf
			EndIf
		EndIf
	EndIf
	
End Function

Function FinishWalking(n.NPCs,startframe#,endframe#,speed#)
	Local centerframe#
	
	If n!=Null
		centerframe# = (endframe#-startframe#)/2
		If n\Frame >= centerframe#
			AnimateNPC(n,startframe#,endframe#,speed#,False)
		Else
			AnimateNPC(n,endframe#,startframe#,-speed#,False)
		EndIf
	EndIf
	
End Function

function ChangeNPCTextureID(n.NPCs,textureid%) {
	If (n=Null) Then
		CreateConsoleMsg("Tried to change the texture of an invalid NPC")
		If ConsoleOpening Then
			ConsoleOpen = True
		EndIf
		Return
	EndIf
	
	n\TextureID = textureid%+1
	FreeEntity n\obj
	n\obj = CopyEntity(DTextures[textureid%+1])
	
	temp# = 0.5 / MeshWidth(n\obj)
	ScaleEntity n\obj, temp, temp, temp
	MeshCullBox (n\obj, -MeshWidth(ClassDObj), -MeshHeight(ClassDObj), -MeshDepth(ClassDObj), MeshWidth(ClassDObj)*2, MeshHeight(ClassDObj)*2, MeshDepth(ClassDObj)*2)
	
	SetNPCFrame(n,n\Frame)
	
End Function
