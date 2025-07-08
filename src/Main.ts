import {FileSize, Chr, int, float, FileType, SeedRnd, Int, AppTitle, Asc, CameraClsMode, CameraRange, CameraViewport, CameraZoom, ChannelPlaying, Cls, ClsColor, Collisions, Color, CopyEntity, CreateCamera, DebugLog, Delay, EntityFX, EntityTexture, Exit, Flip, Float, FlushKeys, FreeSound, GetParent, Graphics3D, ImageWidth, KeyHit, PositionEntity, range, RuntimeError, ScaleEntity, SetFont, Sqr, StringHeight, First} from "./Helper/bbhelper.ts"

let InitErrorStr: string = ""
if (FileSize("fmod.dll")==0) {InitErrorStr=InitErrorStr+ "fmod.dll"+Chr(13)+Chr(10)}
if (FileSize("zlibwapi.dll")==0) {InitErrorStr=InitErrorStr+ "zlibwapi.dll"+Chr(13)+Chr(10)}

if (Len(InitErrorStr)>0) {
	RuntimeError ("The following DLLs were not found in the game directory:"+Chr(13)+Chr(10)+Chr(13)+Chr(10)+InitErrorStr)
}

import "FMod.ts"

import "StrictLoads.ts"
import "fullscreen_window_fix.ts"
import "KeyName.ts"

export var OptionFile: string = "options.ini"

import "Blitz_Basic_Bank.ts"
import "Blitz_File_FileName.ts"
import "Blitz_File_ZipApi.ts"
import "Update.ts"

import "DevilParticleSystem.ts"

export var ErrorFile: string = "error_log_"
let ErrorFileInd: int = 0
while (FileType(ErrorFile+Str(ErrorFileInd)+".txt") != 0) {
	ErrorFileInd = ErrorFileInd+1
}
ErrorFile = ErrorFile+Str(ErrorFileInd)+".txt"

export var UpdaterFont: int
export var Font1: int
export var Font2: int
export var Font3: int
export var Font4: int
export var Font5: int
export var ConsoleFont: int

export var VersionNumber: string = "1.3.11"
export var CompatibleNumber: string = "1.3.11"

export var MenuWhite: int
export var MenuBlack: int
export var ButtonSFX: int

export var EnableSFXRelease: int = GetINIInt(OptionFile, "audio", "sfx release")
export var EnableSFXRelease_Prev: int = EnableSFXRelease

export var CanOpenConsole: int = GetINIInt(OptionFile, "console", "enabled")

export var ArrowIMG: any[] = new Array(4)

//[Block]

export var LauncherWidth: int= Min(GetINIInt(OptionFile, "launcher", "launcher width"), 1024)
export var LauncherHeight: int = Min(GetINIInt(OptionFile, "launcher", "launcher height"), 768)
export var LauncherEnabled: int = GetINIInt(OptionFile, "launcher", "launcher enabled")
export var LauncherIMG: int

export var GraphicWidth: int = GetINIInt(OptionFile, "options", "width")
export var GraphicHeight: int = GetINIInt(OptionFile, "options", "height")
export var Depth: int = 0, Fullscreen: int = GetINIInt(OptionFile, "options", "fullscreen")

export var SelectedGFXMode: int
export var SelectedGFXDriver: int = Max(GetINIInt(OptionFile, "options", "gfx driver"), 1)

export var fresize_image: int, fresize_texture: int, fresize_texture2: int
export var fresize_cam: int

export var ShowFPS = GetINIInt(OptionFile, "options", "show FPS")

export var WireframeState
export var HalloweenTex

export var TotalGFXModes: int = CountGfxModes3D()
export var GFXModes: int
export var GfxModeWidths: int[] = new Array(TotalGFXModes)
export var GfxModeHeights: int[] = new Array(TotalGFXModes)

export var BorderlessWindowed: int = GetINIInt(OptionFile, "options", "borderless windowed")
export var RealGraphicWidth: int
export var RealGraphicHeight: int
export var AspectRatioRatio: float

export var EnableRoomLights: int = GetINIInt(OptionFile, "options", "room lights enabled")

export var TextureDetails: int = GetINIInt(OptionFile, "options", "texture details")
export var TextureFloat: float
switch (TextureDetails) {
	case 0:
		TextureFloat = 0.8
	case 1:
		TextureFloat = 0.4
	case 2:
		TextureFloat = 0.0
	case 3:
		TextureFloat = -0.4
	case 4:
		TextureFloat = -0.8
}
var ConsoleOpening: int = GetINIInt(OptionFile, "console", "auto opening")
var SFXVolume: float = GetINIFloat(OptionFile, "audio", "sound volume")

var Bit16Mode = GetINIInt(OptionFile, "options", "16bit")

import "AAText.ts"

if (LauncherEnabled) {
	AspectRatioRatio = 1.0
	UpdateLauncher()
	
	//New "fake fullscreen" - ENDSHN Psst, it's called borderless windowed mode --Love Mark,
	if (BorderlessWindowed) {
		DebugLog ("Using Borderless Windowed Mode")
		Graphics3DExt (G_viewport_width, G_viewport_height, 0, 2)
		
		// -- Change the window style to 'WS_POPUP' and then set the window position to force the style to update.
		api_SetWindowLong( G_app_handle, C_GWL_STYLE, C_WS_POPUP )
		api_SetWindowPos( G_app_handle, C_HWND_TOP, G_viewport_x, G_viewport_y, G_viewport_width, G_viewport_height, C_SWP_SHOWWINDOW )
		
		RealGraphicWidth = G_viewport_width
		RealGraphicHeight = G_viewport_height
		
		AspectRatioRatio = (Float(GraphicWidth)/Float(GraphicHeight))/(Float(RealGraphicWidth)/Float(RealGraphicHeight))
		
		Fullscreen = false
	} else {
		AspectRatioRatio = 1.0
		RealGraphicWidth = GraphicWidth
		RealGraphicHeight = GraphicHeight
		if (Fullscreen) {
			Graphics3DExt(GraphicWidth, GraphicHeight, (16*Bit16Mode), 1)
		} else {
			Graphics3DExt(GraphicWidth, GraphicHeight, 0, 2)
		}
	}
	
} else {
	for (let i of range(1, TotalGFXModes + 1)) {
		let samefound: boolean = false
		for  (let n of range(TotalGFXModes)) {
			if (GfxModeWidths(n) == GfxModeWidth(i) && GfxModeHeights(n) == GfxModeHeight(i)) {
				samefound = true
				break
			}
		}
		if (!samefound) {
			if (GraphicWidth == GfxModeWidth(i) && GraphicHeight == GfxModeHeight(i)) {
				SelectedGFXMode = GFXModes
			}
			GfxModeWidths(GFXModes) = GfxModeWidth(i)
			GfxModeHeights(GFXModes) = GfxModeHeight(i)
			GFXModes=GFXModes+1
		}
	}
	
	GraphicWidth = GfxModeWidths(SelectedGFXMode)
	GraphicHeight = GfxModeHeights(SelectedGFXMode)
	
	//New "fake fullscreen" - ENDSHN Psst, it's called borderless windowed mode --Love Mark,
	if (BorderlessWindowed) {
		DebugLog ("Using Faked Fullscreen")
		Graphics3DExt (G_viewport_width, G_viewport_height, 0, 2)
		
		// -- Change the window style to 'WS_POPUP' and then set the window position to force the style to update.
		api_SetWindowLong( G_app_handle, C_GWL_STYLE, C_WS_POPUP )
		api_SetWindowPos( G_app_handle, C_HWND_TOP, G_viewport_x, G_viewport_y, G_viewport_width, G_viewport_height, C_SWP_SHOWWINDOW )
		
		RealGraphicWidth = G_viewport_width
		RealGraphicHeight = G_viewport_height
		
		AspectRatioRatio = (Float(GraphicWidth)/Float(GraphicHeight))/(Float(RealGraphicWidth)/Float(RealGraphicHeight))
		
		Fullscreen = false
	} else {
		AspectRatioRatio = 1.0
		RealGraphicWidth = GraphicWidth
		RealGraphicHeight = GraphicHeight
		if (Fullscreen) {
			Graphics3DExt(GraphicWidth, GraphicHeight, (16*Bit16Mode), 1)
		} else {
			Graphics3DExt(GraphicWidth, GraphicHeight, 0, 2)
		}
	}
	
}

export var MenuScale: float = (GraphicHeight / 1024.0)

SetBuffer(BackBuffer())

export var CurTime: int
export var PrevTime: int
export var LoopDelay: int
export var FPSfactor: float
export var FPSfactor2: float
export var PrevFPSFactor: float
let CheckFPS: int
export var ElapsedLoops: int
export var FPS: int
export var ElapsedTime: float

export var Framelimit: int = GetINIInt(OptionFile, "options", "framelimit")
export var Vsync: int = GetINIInt(OptionFile, "options", "vsync")

export var Opt_AntiAlias = GetINIInt(OptionFile, "options", "antialias")

export var CurrFrameLimit: float = (Framelimit-19)/100.0

export var ScreenGamma: float = GetINIFloat(OptionFile, "options", "screengamma")

const HIT_MAP: int = 1
const HIT_PLAYER: int = 2
const HIT_ITEM: int = 3
const HIT_APACHE: int = 4
const HIT_178: int = 5
const HIT_DEAD: int = 6
SeedRnd (MilliSecs())

export var GameSaved: int

export var CanSave: boolean = true

AppTitle ("SCP - Containment Breach v"+VersionNumber)

PlayStartupVideos()

//---------------------------------------------------------------------------------------------------------------------


export var CursorIMG: int = LoadImage_Strict("GFX/cursor.png")

export var SelectedLoadingScreen: LoadingScreens, LoadingScreenAmount: int, LoadingScreenText: int
export var LoadingBack: int = LoadImage_Strict("Loadingscreens/loadingback.jpg")
InitLoadingScreens("Loadingscreens/loadingscreens.ini")

InitAAFont()
//For some reason, Blitz3D doesn't load fonts that have filenames that
//don't match their "internal name" (i.e. their display name in applications
//like Word and such). As a workaround, I moved the files and renamed them so they
//can load without FastText.
Font1 = AALoadFont("GFX/font/cour/Courier New.ttf", Int(19 * (GraphicHeight / 1024.0)), 0,0,0)
Font2 = AALoadFont("GFX/font/courbd/Courier New.ttf", Int(58 * (GraphicHeight / 1024.0)), 0,0,0)
Font3 = AALoadFont("GFX/font/DS-DIGI/DS-Digital.ttf", Int(22 * (GraphicHeight / 1024.0)), 0,0,0)
Font4 = AALoadFont("GFX/font/DS-DIGI/DS-Digital.ttf", Int(60 * (GraphicHeight / 1024.0)), 0,0,0)
Font5 = AALoadFont("GFX/font/Journal/Journal.ttf", Int(58 * (GraphicHeight / 1024.0)), 0,0,0)

export var CreditsFont: int
export var CreditsFont2: int

ConsoleFont = AALoadFont("Blitz", Int(20 * (GraphicHeight / 1024.0)), 0,0,0,1)

AASetFont (Font2)

export var BlinkMeterIMG: int = LoadImage_Strict("GFX/blinkmeter.jpg")

DrawLoading(0, true)

// - -Viewport.
export var viewport_center_x: int = GraphicWidth / 2, viewport_center_y: int = GraphicHeight / 2

// -- Mouselook.
export var mouselook_x_inc: float = 0.3 // This sets both the sensitivity and direction (+/-) of the mouse on the X axis.
export var mouselook_y_inc: float = 0.3 // This sets both the sensitivity and direction (+/-) of the mouse on the Y axis.
// Used to limit the mouse movement to within a certain number of pixels (250 is used here) from the center of the screen.
// This produces smoother mouse movement than continuously moving the mouse back to the center each loop.
export var mouse_left_limit: int = 250, mouse_right_limit: int = GraphicsWidth () - 250
export var mouse_top_limit: int = 150, mouse_bottom_limit: int = GraphicsHeight () - 150 // As above.
export var mouse_x_speed_1: float, mouse_y_speed_1: float

export var KEY_RIGHT = GetINIInt(OptionFile, "binds", "Right key")
export var KEY_LEFT = GetINIInt(OptionFile, "binds", "Left key")
export var KEY_UP = GetINIInt(OptionFile, "binds", "Up key")
export var KEY_DOWN = GetINIInt(OptionFile, "binds", "Down key")

export var KEY_BLINK = GetINIInt(OptionFile, "binds", "Blink key")
export var KEY_SPRINT = GetINIInt(OptionFile, "binds", "Sprint key")
export var KEY_INV = GetINIInt(OptionFile, "binds", "Inventory key")
export var KEY_CROUCH = GetINIInt(OptionFile, "binds", "Crouch key")
export var KEY_SAVE = GetINIInt(OptionFile, "binds", "Save key")
export var KEY_CONSOLE = GetINIInt(OptionFile, "binds", "Console key")

export var MouseSmooth: float = GetINIFloat(OptionFile,"options", "mouse smoothing", 1.0)

export const INFINITY: float = (999.0) ^ (99999.0)
export const NAN: float = (-1.0) ^ (0.5)

export var Mesh_MinX: float
export var Mesh_MinY: float
export var Mesh_MinZ: float
export var Mesh_MaxX: float
export var Mesh_MaxY: float
export var Mesh_MaxZ: float
export var Mesh_MagX: float
export var Mesh_MagY: float
export var Mesh_MagZ: float

//player stats -------------------------------------------------------------------------------------------------------
export var KillTimer: float
export var KillAnim: int
export var FallTimer: float
export var DeathTimer: float
export var Sanity: float
export var ForceMove: float
export var ForceAngle: float
export var RestoreSanity: int

export var Playable: boolean = true

export var BLINKFREQ: float
export var BlinkTimer: float
export var EyeIrritation: float
export var EyeStuck: float
export var BlinkEffect: float = 1.0
export var BlinkEffectTimer: float

export var Stamina: float
export var StaminaEffect: float=1.0
export var StaminaEffectTimer: float

export var CameraShakeTimer: float
export var Vomit: int
export var VomitTimer: float
export var Regurgitate: int

export var SCP1025state: float[] = new Array(6)

export var HeartBeatRate: float
export var HeartBeatTimer: float
export var HeartBeatVolume: float

export var WearingGasMask: int
export var WearingHazmat: int
export var WearingVest: int
export var Wearing714: int
export var WearingNightVision: int
export var NVTimer: float

export var SuperMan: int
export var SuperManTimer: float

export var Injuries: float
export var Bloodloss: float
export var Infect: float
export var HealTimer: float

export var RefinedItems: int

import "Achievements.ts"

//player coordinates, angle, speed, movement etc ---------------------------------------------------------------------
export var DropSpeed: float
export var HeadDropSpeed: float
export var CurrSpeed: float
export var user_camera_pitch: float
export var side: float
export var Crouch: int
export var CrouchState: float

export var PlayerZone: int
export var PlayerRoom: Rooms

export var GrabbedEntity: int

export var InvertMouse: int = GetINIInt(OptionFile, "options", "invert mouse y")
export var MouseHit1: int
export var MouseDown1: int
export var MouseHit2: int
export var DoubleClick: int
export var LastMouseHit1: int
export var MouseUp1: int

export var GodMode: int
export var NoClip: int
export var NoClipSpeed: float = 2.0

export var CoffinDistance: float = 100.0

export var PlayerSoundVolume: float

//camera/lighting effects (blur, camera shake, etc)-------------------------------------------------------------------
export var Shake: float

export var ExplosionTimer: float, ExplosionSFX: int

export var LightsOn: boolean = true

export var SoundTransmission: int

//menus, GUI ---------------------------------------------------------------------------------------------------------
export var MainMenuOpen: int
export var MenuOpen: int
export var StopHidingTimer: float
export var InvOpen: int
export var OtherOpen: Items = null

export var SelectedEnding$
export var EndingScreen: int
export var EndingTimer: float

export var MsgTimer: float
export var Msg$
export var DeathMSG$

export var AccessCode: int
export var KeypadInput$
export var KeypadTimer: float
export var KeypadMSG$

export var DrawHandIcon: int
export var DrawArrowIcon: int[] = new Array(4)

//misc ---------------------------------------------------------------------------------------------------------------

import "Difficulty.ts"

export var MTFtimer: float
export var MTFrooms: Rooms[] = new Array(10)
export var MTFroomState: int[] = new Array(10)

export var RadioState: float[] = new Array(10)
export var RadioState3: int[] = new Array(10)
export var RadioState4: int[] = new Array(9)
export var RadioCHN: int[] = new Array(8)

export var OldAiPics: int[] = new Array(5)

export var PlayTime: int
export var ConsoleFlush: int
export var ConsoleFlushSnd: int = 0
export var ConsoleMusFlush: int = 0
export var ConsoleMusPlay: int = 0

export var InfiniteStamina: boolean = false
export var NVBlink: int
export var IsNVGBlinking: boolean = false

//[End block]


//----------------------------------------------  Console -----------------------------------------------------

export var ConsoleOpen: int, ConsoleInput: string
export var ConsoleScroll: float,ConsoleScrollDragging: int
export var ConsoleMouseMem: int
export var ConsoleReissue: ConsoleMsg = null
export var ConsoleR: int = 255,ConsoleG: int = 255,ConsoleB: int = 255

class ConsoleMsg {
	txt: string
	isCommand: int
	r: int
	g: int
	b: int
	static each: ConsoleMsg[] = []
}

function CreateConsoleMsg(txt: string,r: int=-1,g: int=-1,b: int=-1,isCommand: boolean = false) {
	let c: ConsoleMsg = new ConsoleMsg()
	ConsoleMsg.each.Insert(c)
	
	c.txt = txt
	c.isCommand = isCommand
	
	c.r = r
	c.g = g
	c.b = b
	
	if (c.r<0) {c.r = ConsoleR}
	if (c.g<0) {c.g = ConsoleG}
	if (c.b<0) {c.b = ConsoleB}
}

function UpdateConsole() {
	let e: Events
	
	if (!CanOpenConsole) {
		ConsoleOpen = false
		return
	}
	
	if (ConsoleOpen) {
		let cm: ConsoleMsg
		
		AASetFont (ConsoleFont)
		
		ConsoleR = 255
		ConsoleG = 255
		ConsoleB = 255
		
		let x: int = 0
		let y: int = GraphicHeight-300*MenuScale
		let width: int = GraphicWidth
		let height: int = 300*MenuScale-30*MenuScale
		let StrTemp: string
		let temp: int
		let i: int
		let ev: Events
		let r: Rooms
		let it: Items
		
		DrawFrame (x,y,width,height+30*MenuScale)
		
		let consoleHeight: int = 0
		let scrollbarHeight: int = 0
		for (cm of ConsoleMsg.each) {
			consoleHeight = consoleHeight + 15*MenuScale
		}
		scrollbarHeight = (Float(height)/Float(consoleHeight))*height
		if (scrollbarHeight>height) {scrollbarHeight = height}
		if (consoleHeight<height) {consoleHeight = height}
		
		Color (50,50,50)
		let inBar = MouseOn(x+width-26*MenuScale,y,26*MenuScale,height)
		if (inBar) {
			Color (70,70,70)
		}
		Rect (x+width-26*MenuScale,y,26*MenuScale,height,true)
		
		
		Color (120,120,120)
		let inBox = MouseOn(x+width-23*MenuScale,y+height-scrollbarHeight+(ConsoleScroll*scrollbarHeight/height),20*MenuScale,scrollbarHeight)
		if (inBox) {Color (200,200,200)}
		if (ConsoleScrollDragging) {Color (255,255,255)}
		Rect (x+width-23*MenuScale,y+height-scrollbarHeight+(ConsoleScroll*scrollbarHeight/height),20*MenuScale,scrollbarHeight,true)
		
		if (!MouseDown(1)) {
			ConsoleScrollDragging=False
		} else if (ConsoleScrollDragging) {
			ConsoleScroll = ConsoleScroll+((ScaledMouseY()-ConsoleMouseMem)*height/scrollbarHeight)
			ConsoleMouseMem = ScaledMouseY()
		}
		
		if (!ConsoleScrollDragging) {
			if (MouseHit1) {
				if (inBox) {
					ConsoleScrollDragging=True
					ConsoleMouseMem = ScaledMouseY()
				} else if(inBar) {
					ConsoleScroll = ConsoleScroll+((ScaledMouseY()-(y+height))*consoleHeight/height+(height/2))
					ConsoleScroll = ConsoleScroll/2
				}
			}
		}
		
		mouseScroll = MouseZSpeed()
		if (mouseScroll == 1) {
			ConsoleScroll = ConsoleScroll - 15*MenuScale
		} else if (mouseScroll == -1) {
			ConsoleScroll = ConsoleScroll + 15*MenuScale
		}
		
		let reissuePos: int
		if (KeyHit(200)){
			reissuePos = 0
			if (ConsoleReissue==Null) {
				ConsoleReissue=First (ConsoleMsg.each)
				
				while (ConsoleReissue!=Null) {
					if (ConsoleReissue.isCommand) {
						Exit()
					}
					reissuePos = reissuePos - 15*MenuScale
					ConsoleReissue = After (ConsoleReissue)
				}
				
			} else {
				cm.ConsoleMsg = First (ConsoleMsg)
				while (cm!=Null) {
					if (cm==ConsoleReissue) {Exit()}
					reissuePos = reissuePos-15*MenuScale
					cm = After (cm)
				}
				ConsoleReissue = After (ConsoleReissue)
				reissuePos = reissuePos-15*MenuScale
				
				while (true) {
					if (ConsoleReissue=Null) {
						ConsoleReissue=First (ConsoleMsg)
						reissuePos = 0
					}
				
					if (ConsoleReissue.isCommand) {
						Exit()
					}
					reissuePos = reissuePos - 15*MenuScale
					ConsoleReissue = After (ConsoleReissue)
				}
			}
			
			if (ConsoleReissue != Null) {
				ConsoleInput = ConsoleReissue.txt
				ConsoleScroll = reissuePos+(height/2)
			}
		}
		
		if (KeyHit(208)) {
			reissuePos = -consoleHeight+15*MenuScale
			if (ConsoleReissue==Null) {
				ConsoleReissue=Last (ConsoleMsg)
				
				while (ConsoleReissue != Null) {
					if (ConsoleReissue.isCommand) {
						Exit()
					}
					reissuePos = reissuePos + 15*MenuScale
					ConsoleReissue = Before (ConsoleReissue)
				}
				
			} else {
				cm.ConsoleMsg = Last (ConsoleMsg)
				while (cm != Null) {
					if (cm == ConsoleReissue) {Exit()}
					reissuePos = reissuePos+15*MenuScale
					cm = Before (cm)
				}
				ConsoleReissue = Before (ConsoleReissue)
				reissuePos = reissuePos+15*MenuScale
				
				while (true) {
					if (ConsoleReissue==Null) {
						ConsoleReissue=Last (ConsoleMsg)
						reissuePos=-consoleHeight+15*MenuScale
					}
				
					if (ConsoleReissue.isCommand) {
						Exit()
					}
					reissuePos = reissuePos + 15*MenuScale
					ConsoleReissue = Before (ConsoleReissue)
				}
			}
			
			if (ConsoleReissue!=Null) {
				ConsoleInput = ConsoleReissue.txt
				ConsoleScroll = reissuePos+(height/2)
			}
		}
		
		if (ConsoleScroll<-consoleHeight+height) {ConsoleScroll = -consoleHeight+height}
		if (ConsoleScroll>0) {ConsoleScroll = 0}
		
		Color (255, 255, 255)
		
		SelectedInputBox = 2
		let oldConsoleInput: string = ConsoleInput
		ConsoleInput = InputBox(x, y + height, width, 30*MenuScale, ConsoleInput, 2)
		if (oldConsoleInput!=ConsoleInput) {
			ConsoleReissue = null
		}
		ConsoleInput = Left(ConsoleInput, 100)
		
		if (KeyHit(28) && ConsoleInput != "") {
			ConsoleReissue = Null
			ConsoleScroll = 0
			CreateConsoleMsg(ConsoleInput,255,255,0,True)
			if (Instr(ConsoleInput, " ") > 0) {
				StrTemp = Lower(Left(ConsoleInput, Instr(ConsoleInput, " ") - 1))
			} else {
				StrTemp = Lower(ConsoleInput)
			}
			
			switch (Lower(StrTemp)) {
				case "help":
					//[Block]
					if (Instr(ConsoleInput, " ") != 0) {
						StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					} else {
						StrTemp$ = ""
					}
					ConsoleR = 0
					ConsoleG = 255
					ConsoleB = 255
					
					switch (Lower(StrTemp)) {
						case "1","":
							CreateConsoleMsg("LIST OF COMMANDS - PAGE 1/3")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("- asd")
							CreateConsoleMsg("- status")
							CreateConsoleMsg("- camerapick")
							CreateConsoleMsg("- ending")
							CreateConsoleMsg("- noclipspeed")
							CreateConsoleMsg("- noclip")
							CreateConsoleMsg("- injure [value]")
							CreateConsoleMsg("- infect [value]")
							CreateConsoleMsg("- heal")
							CreateConsoleMsg("- teleport [room name]")
							CreateConsoleMsg("- spawnitem [item name]")
							CreateConsoleMsg("- wireframe")
							CreateConsoleMsg("- 173speed")
							CreateConsoleMsg("- 106speed")
							CreateConsoleMsg("- 173state")
							CreateConsoleMsg("- 106state")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Use "+Chr(34)+"help 2/3"+Chr(34)+" to find more commands.")
							CreateConsoleMsg("Use "+Chr(34)+"help [command name]"+Chr(34)+" to get more information about a command.")
							CreateConsoleMsg("******************************")
						case "2":
							CreateConsoleMsg("LIST OF COMMANDS - PAGE 2/3")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("- spawn [npc type] [state]")
							CreateConsoleMsg("- reset096")
							CreateConsoleMsg("- disable173")
							CreateConsoleMsg("- enable173")
							CreateConsoleMsg("- disable106")
							CreateConsoleMsg("- enable106")
							CreateConsoleMsg("- halloween")
							CreateConsoleMsg("- sanic")
							CreateConsoleMsg("- scp-420-j")
							CreateConsoleMsg("- godmode")
							CreateConsoleMsg("- revive")
							CreateConsoleMsg("- noclip")
							CreateConsoleMsg("- showfps")
							CreateConsoleMsg("- 096state")
							CreateConsoleMsg("- debughud")
							CreateConsoleMsg("- camerafog [near] [far]")
							CreateConsoleMsg("- gamma [value]")
							CreateConsoleMsg("- infinitestamina")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Use "+Chr(34)+"help [command name]"+Chr(34)+" to get more information about a command.")
							CreateConsoleMsg("******************************")
						case "3":
							CreateConsoleMsg("- playmusic [clip + .wav/.ogg]")
							CreateConsoleMsg("- notarget")
							CreateConsoleMsg("- unlockexits")
						case "asd":
							CreateConsoleMsg("HELP - asd")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Actives godmode, noclip, wireframe and")
							CreateConsoleMsg("sets fog distance to 20 near, 30 far")
							CreateConsoleMsg("******************************")
						case "camerafog":
							CreateConsoleMsg("HELP - camerafog")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Sets the draw distance of the fog.")
							CreateConsoleMsg("The fog begins generating at 'CameraFogNear' units")
							CreateConsoleMsg("away from the camera and becomes completely opaque")
							CreateConsoleMsg("at 'CameraFogFar' units away from the camera.")
							CreateConsoleMsg("Example: camerafog 20 40")
							CreateConsoleMsg("******************************")
						case "gamma":
							CreateConsoleMsg("HELP - gamma")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Sets the gamma correction.")
							CreateConsoleMsg("Should be set to a value between 0.0 and 2.0.")
							CreateConsoleMsg("Default is 1.0.")
							CreateConsoleMsg("******************************")
						case "noclip","fly":
							CreateConsoleMsg("HELP - noclip")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Toggles noclip, unless a valid parameter")
							CreateConsoleMsg("is specified (on/off).")
							CreateConsoleMsg("Allows the camera to move in any direction while")
							CreateConsoleMsg("bypassing collision.")
							CreateConsoleMsg("******************************")
						case "godmode","god":
							CreateConsoleMsg("HELP - godmode")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Toggles godmode, unless a valid parameter")
							CreateConsoleMsg("is specified (on/off).")
							CreateConsoleMsg("Prevents player death under normal circumstances.")
							CreateConsoleMsg("******************************")
						case "wireframe":
							CreateConsoleMsg("HELP - wireframe")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Toggles wireframe, unless a valid parameter")
							CreateConsoleMsg("is specified (on/off).")
							CreateConsoleMsg("Allows only the edges of geometry to be rendered,")
							CreateConsoleMsg("making everything else transparent.")
							CreateConsoleMsg("******************************")
						case "spawnitem":
							CreateConsoleMsg("HELP - spawnitem")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Spawns an item at the player's location.")
							CreateConsoleMsg("Any name that can appear in your inventory")
							CreateConsoleMsg("is a valid parameter.")
							CreateConsoleMsg("Example: spawnitem Key Card Omni")
							CreateConsoleMsg("******************************")
						case "spawn":
							CreateConsoleMsg("HELP - spawn")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Spawns an NPC at the player's location.")
							CreateConsoleMsg("Valid parameters are:")
							CreateConsoleMsg("008zombie / 049 / 049-2 / 066 / 096 / 106 / 173")
							CreateConsoleMsg("/ 178-1 / 372 / 513-1 / 966 / 1499-1 / class-d")
							CreateConsoleMsg("/ guard / mtf / apache / tentacle")
							CreateConsoleMsg("******************************")
						case "revive","undead","resurrect":
							CreateConsoleMsg("HELP - revive")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Resets the player's death timer after the dying")
							CreateConsoleMsg("animation triggers.")
							CreateConsoleMsg("Does not affect injury, blood loss")
							CreateConsoleMsg("or 008 infection values.")
							CreateConsoleMsg("******************************")
						case "teleport":
							CreateConsoleMsg("HELP - teleport")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Teleports the player to the first instance")
							CreateConsoleMsg("of the specified room. Any room that appears")
							CreateConsoleMsg("in rooms.ini is a valid parameter.")
							CreateConsoleMsg("******************************")
						case "stopsound", "stfu":
							CreateConsoleMsg("HELP - stopsound")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Stops all currently playing sounds.")
							CreateConsoleMsg("******************************")
						case "camerapick":
							CreateConsoleMsg("HELP - camerapick")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Prints the texture name and coordinates of")
							CreateConsoleMsg("the model the camera is pointing at.")
							CreateConsoleMsg("******************************")
						case "status":
							CreateConsoleMsg("HELP - status")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Prints player, camera, and room information.")
							CreateConsoleMsg("******************************")
						case "weed","scp-420-j","420":
							CreateConsoleMsg("HELP - 420")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Generates dank memes.")
							CreateConsoleMsg("******************************")
						case "playmusic":
							CreateConsoleMsg("HELP - playmusic")
							CreateConsoleMsg("******************************")
							CreateConsoleMsg("Will play tracks in .ogg/.wav format")
							CreateConsoleMsg("from "+Chr(34)+"SFX/Music/Custom/"+Chr(34)+".")
							CreateConsoleMsg("******************************")
							
						default:
							CreateConsoleMsg("There is no help available for that command.",255,150,0)
					}
					
					//[End Block]
				case "asd":
					//[Block]
					WireFrame(1)
					WireframeState=1
					GodMode = 1
					NoClip = 1
					CameraFogNear = 15
					CameraFogFar = 20
					//[End Block]
				case "status":
					//[Block]
					ConsoleR = 0
					ConsoleG = 255
					ConsoleB = 0
					CreateConsoleMsg("******************************")
					CreateConsoleMsg("Status: ")
					CreateConsoleMsg("Coordinates: ")
					CreateConsoleMsg("    - collider: "+EntityX(Collider)+", "+EntityY(Collider)+", "+EntityZ(Collider))
					CreateConsoleMsg("    - camera: "+EntityX(Camera)+", "+EntityY(Camera)+", "+EntityZ(Camera))
					
					CreateConsoleMsg("Rotation: ")
					CreateConsoleMsg("    - collider: "+EntityPitch(Collider)+", "+EntityYaw(Collider)+", "+EntityRoll(Collider))
					CreateConsoleMsg("    - camera: "+EntityPitch(Camera)+", "+EntityYaw(Camera)+", "+EntityRoll(Camera))
					
					CreateConsoleMsg("Room: "+PlayerRoom.RoomTemplate.Name)
					for (ev of Events.each) {
						if (ev.room == PlayerRoom) {
							CreateConsoleMsg("Room event: "+ev.EventName)	
							CreateConsoleMsg("-    state: "+ev.EventState)
							CreateConsoleMsg("-    state2: "+ev.EventState2)	
							CreateConsoleMsg("-    state3: "+ev.EventState3)
							Exit()
						}
					}
					
					CreateConsoleMsg("Room coordinates: "+Floor(EntityX(PlayerRoom.obj) / 8.0 + 0.5)+", "+ Floor(EntityZ(PlayerRoom.obj) / 8.0 + 0.5))
					CreateConsoleMsg("Stamina: "+Stamina)
					CreateConsoleMsg("Death timer: "+KillTimer)					
					CreateConsoleMsg("Blinktimer: "+BlinkTimer)
					CreateConsoleMsg("Injuries: "+Injuries)
					CreateConsoleMsg("Bloodloss: "+Bloodloss)
					CreateConsoleMsg("******************************")
					//[End Block]
				case "camerapick":
					//[Block]
					ConsoleR = 0
					ConsoleG = 255
					ConsoleB = 0
					let c = CameraPick(Camera,GraphicWidth/2, GraphicHeight/2)
					if (c == 0) {
						CreateConsoleMsg("******************************")
						CreateConsoleMsg("No entity  picked")
						CreateConsoleMsg("******************************")								
					} else {
						CreateConsoleMsg("******************************")
						CreateConsoleMsg("Picked entity:")
						let sf = GetSurface(c,1)
						let b = GetSurfaceBrush( sf )
						let t = GetBrushTexture(b,0)
						let texname = StripPath(TextureName(t))
						CreateConsoleMsg("Texture name: "+texname)
						CreateConsoleMsg("Coordinates: "+EntityX(c)+", "+EntityY(c)+", "+EntityZ(c))
						CreateConsoleMsg("******************************")							
					}
					
				case "hidedistance":
					//[Block]
					HideDistance = Float(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					CreateConsoleMsg("Hidedistance set to "+HideDistance)
					
				case "ending":
					//[Block]
					SelectedEnding = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					KillTimer = -0.1
					//EndingTimer = -0.1
					
				case "noclipspeed":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					NoClipSpeed = Float(StrTemp)
					
				case "injure":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					Injuries = Float(StrTemp)
					
				case "infect":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					Infect = Float(StrTemp)
					
				case "heal":
					//[Block]
					Injuries = 0
					Bloodloss = 0
					
				case "teleport":
					//[Block]
					StrTemp = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "895", "scp-895":
							StrTemp = "coffin"
						case "scp-914":
							StrTemp = "914"
						case "offices", "office":
							StrTemp = "room2offices"
					}
					
					for (r of Rooms.each) {
						if (r.RoomTemplate.Name = StrTemp) {
							PositionEntity (Collider, EntityX(r.obj), EntityY(r.obj)+0.7, EntityZ(r.obj))
							ResetEntity(Collider)
							UpdateDoors()
							UpdateRooms()
							for (it of Items.each) {
								it.disttimer = 0
							}
							PlayerRoom = r
							Exit()
						}
					}
					
					if (PlayerRoom.RoomTemplate.Name != StrTemp) {CreateConsoleMsg("Room not found.",255,150,0)}
					
				case "spawnitem":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					temp = False 
					for (itt of ItemTemplates.each) {
						if (Lower(itt.name) == StrTemp) {
							temp = True
							CreateConsoleMsg(itt.name + " spawned.")
							it.Items = CreateItem(itt.name, itt.tempname, EntityX(Collider), EntityY(Camera,True), EntityZ(Collider))
							EntityType(it.collider, HIT_ITEM)
							Exit
						} else if ((Lower(itt.tempname) = StrTemp)) {
							temp = True
							CreateConsoleMsg(itt.name + " spawned.")
							it.Items = CreateItem(itt.name, itt.tempname, EntityX(Collider), EntityY(Camera,True), EntityZ(Collider))
							EntityType(it.collider, HIT_ITEM)
							Exit
						}
					}
					
					if (temp = False) {CreateConsoleMsg("Item not found.",255,150,0)}
					
				case "wireframe":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "on", "1", "true":
							WireframeState = True							
						case "off", "0", "false":
							WireframeState = False
						default:
							WireframeState = !WireframeState
					}
					
					if (WireframeState) {
						CreateConsoleMsg("WIREFRAME ON")
					} else {
						CreateConsoleMsg("WIREFRAME OFF")	
					}
					
					WireFrame (WireframeState)
					
				case "173speed":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					Curr173.Speed = Float(StrTemp)
					CreateConsoleMsg("173's speed set to " + StrTemp)
					
				case "106speed":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					Curr106.Speed = Float(StrTemp)
					CreateConsoleMsg("106's speed set to " + StrTemp)
					
				case "173state":
					//[Block]
					CreateConsoleMsg("SCP-173")
					CreateConsoleMsg("Position: " + EntityX(Curr173.obj) + ", " + EntityY(Curr173.obj) + ", " + EntityZ(Curr173.obj))
					CreateConsoleMsg("Idle: " + Curr173.Idle)
					CreateConsoleMsg("State: " + Curr173.State)
					
				case "106state":
					//[Block]
					CreateConsoleMsg("SCP-106")
					CreateConsoleMsg("Position: " + EntityX(Curr106.obj) + ", " + EntityY(Curr106.obj) + ", " + EntityZ(Curr106.obj))
					CreateConsoleMsg("Idle: " + Curr106.Idle)
					CreateConsoleMsg("State: " + Curr106.State)
					
				case "reset096":
					//[Block]
					for (let n of NPCs.each) {
						if (n.NPCtype = NPCtype096) {
							n.State = 0
							StopStream_Strict(n.SoundChn)
							n.SoundChn=0
							if (n.SoundChn2!=0) {
								StopStream_Strict(n.SoundChn2)
								n.SoundChn2=0
							}
							Exit()
						}
					}
					
				case "disable173":
					//[Block]
					Curr173.Idle = 3 //This phenominal comment is brought to you by PolyFox. His absolute wisdom in this fatigue of knowledge brought about a new era of 173 state checks.
					HideEntity(Curr173.obj)
					HideEntity(Curr173.Collider)
					
				case "enable173":
					//[Block]
					Curr173.Idle = False
					ShowEntity(Curr173.obj)
					ShowEntity(Curr173.Collider)
					
				case "disable106":
					//[Block]
					Curr106.Idle = True
					Curr106.State = 200000
					Contained106 = True
					
				case "enable106":
					//[Block]
					Curr106.Idle = False
					Contained106 = False
					ShowEntity (Curr106.Collider)
					ShowEntity (Curr106.obj)
					
				case "halloween":
					//[Block]
					HalloweenTex = !HalloweenTex
					if (HalloweenTex) {
						let tex = LoadTexture_Strict("GFX/npcs/173h.pt", 1)
						EntityTexture (Curr173.obj, tex, 0, 0)
						FreeTexture (tex)
						CreateConsoleMsg("173 JACK-O-LANTERN ON")
					} else {
						let tex2 = LoadTexture_Strict("GFX/npcs/173texture.jpg", 1)
						EntityTexture (Curr173.obj, tex2, 0, 0)
						FreeTexture (tex2)
						CreateConsoleMsg("173 JACK-O-LANTERN OFF")
					}
					
				case "sanic":
					//[Block]
					SuperMan = !SuperMan
					if (SuperMan) {
						CreateConsoleMsg("GOTTA GO FAST")
					} else {
						CreateConsoleMsg("WHOA SLOW DOWN")
					}
					
				case "scp-420-j","420","weed":
					//[Block]
					for (i of range(1, 21)) {
						if (Rand(2)==1) {
							it.Items = CreateItem("Some SCP-420-J","420", EntityX(Collider,True)+Cos((360.0/20.0)*i)*Rnd(0.3,0.5), EntityY(Camera,True), EntityZ(Collider,True)+Sin((360.0/20.0)*i)*Rnd(0.3,0.5))
						} else {
							it.Items = CreateItem("Joint","420s", EntityX(Collider,True)+Cos((360.0/20.0)*i)*Rnd(0.3,0.5), EntityY(Camera,True), EntityZ(Collider,True)+Sin((360.0/20.0)*i)*Rnd(0.3,0.5))
						}
						EntityType (it.collider, HIT_ITEM)
					}
					PlaySound_Strict (LoadTempSound("SFX/Music/420J.ogg"))
					
				case "godmode", "god":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "on", "1", "true":
							GodMode = True						
						case "off", "0", "false":
							GodMode = False
						default:
							GodMode = !GodMode
					}
					if (GodMode) {
						CreateConsoleMsg("GODMODE ON")
					} else {
						CreateConsoleMsg("GODMODE OFF")	
					}
					
				case "revive","undead","resurrect":
					//[Block]
					DropSpeed = -0.1
					HeadDropSpeed = 0.0
					Shake = 0
					CurrSpeed = 0
					
					HeartBeatVolume = 0
					
					CameraShake = 0
					Shake = 0
					LightFlash = 0
					BlurTimer = 0
					
					FallTimer = 0
					MenuOpen = False
					
					GodMode = 0
					NoClip = 0
					
					ShowEntity (Collider)
					
					KillTimer = 0
					KillAnim = 0
					
				case "noclip","fly":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "on", "1", "true":
							NoClip = True
							Playable = True
						case "off", "0", "false":
							NoClip = False	
							RotateEntity (Collider, 0, EntityYaw(Collider), 0)
						default:
							NoClip = !NoClip
							if (!NoClip) {		
								RotateEntity (Collider, 0, EntityYaw(Collider), 0)
							} else {
								Playable = True
							}
					}
					
					if (NoClip) {
						CreateConsoleMsg("NOCLIP ON")
					} else {
						CreateConsoleMsg("NOCLIP OFF")
					}
					
					DropSpeed = 0
					
				case "showfps":
					//[Block]
					ShowFPS = !ShowFPS
					CreateConsoleMsg("ShowFPS: "+Str(ShowFPS))
					
				case "096state":
					//[Block]
					for (n of NPCs.each) {
						if (n.NPCtype == NPCtype096) {
							CreateConsoleMsg("SCP-096")
							CreateConsoleMsg("Position: " + EntityX(n.obj) + ", " + EntityY(n.obj) + ", " + EntityZ(n.obj))
							CreateConsoleMsg("Idle: " + n.Idle)
							CreateConsoleMsg("State: " + n.State)
							Exit
						}
					}
					CreateConsoleMsg("SCP-096 has not spawned.")
					
				case "debughud":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					switch (StrTemp) {
						case "on", "1", "true":
							DebugHUD = True
						case "off", "0", "false":
							DebugHUD = False
						default:
							DebugHUD = !DebugHUD
					}
					
					if (DebugHUD) {
						CreateConsoleMsg("Debug Mode On")
					} else {
						CreateConsoleMsg("Debug Mode Off")
					}
					
				case "stopsound", "stfu":
					//[Block]
					for (snd of Sound.each) {
						for (i of range(32)) {
							if (snd.channels[i]!=0) {
								StopChannel (snd.channels[i])
							}
						}
					}
					
					for (e of Events.each) {
						if (e.EventName == "alarm") {
							if (e.room.NPC[0] != Null) {RemoveNPC(e.room.NPC[0])}
							if (e.room.NPC[1] != Null) {RemoveNPC(e.room.NPC[1])}
							if (e.room.NPC[2] != Null) {RemoveNPC(e.room.NPC[2])}
							
							FreeEntity(e.room.Objects[0])
							e.room.Objects[0]=0
							FreeEntity(e.room.Objects[1])
							e.room.Objects[1]=0
							PositionEntity (Curr173.Collider, 0,0,0)
							ResetEntity (Curr173.Collider)
							ShowEntity (Curr173.obj)
							RemoveEvent(e)
							Exit()
						}
					}
					CreateConsoleMsg("Stopped all sounds.")
					
				case "camerafog":
					//[Block]
					args$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					CameraFogNear = Float(Left(args, Len(args) - Instr(args, " ")))
					CameraFogFar = Float(Right(args, Len(args) - Instr(args, " ")))
					CreateConsoleMsg("Near set to: " + CameraFogNear + ", far set to: " + CameraFogFar)
					
				case "gamma":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					ScreenGamma = Int(StrTemp)
					CreateConsoleMsg("Gamma set to " + ScreenGamma)
					
				case "spawn":
					//[Block]
					args$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					StrTemp$ = Piece$(args$, 1)
					StrTemp2$ = Piece$(args$, 2)
					
					//Hacky fix for when the user doesn't input a second parameter.
					if (StrTemp != StrTemp2) {
						Console_SpawnNPC(StrTemp, StrTemp2)
					} else {
						Console_SpawnNPC(StrTemp)
					}
					
				//new Console Commands in SCP:CB 1.3 - ENDSHN
				case "infinitestamina","infstam":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "on", "1", "true":
							InfiniteStamina = True						
						case "off", "0", "false":
							InfiniteStamina = False
						default:
							InfiniteStamina = !InfiniteStamina
					}
					
					if (InfiniteStamina) {
						CreateConsoleMsg("INFINITE STAMINA ON")
					} else {
						CreateConsoleMsg("INFINITE STAMINA OFF")	
					}
					
				case "asd2":
					//[Block]
					GodMode = 1
					InfiniteStamina = 1
					Curr173.Idle = 3
					Curr106.Idle = True
					Curr106.State = 200000
					Contained106 = True
					
				case "toggle_warhead_lever":
					//[Block]
					for (e of Events.each) {
						if (e.EventName = "room2nuke") {
							e.EventState = (!e.EventState)
							Exit
						}
					}
					
				case "unlockexits":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "a":
							for (e of Events.each) {
								if (e.EventName = "gateaentrance") {
									e.EventState3 = 1
									e.room.RoomDoors[1].open = True
									Exit
								}
							}
							CreateConsoleMsg("Gate A is now unlocked.")	
						case "b":
							for (e of Events.each) {
								if (e.EventName = "exit1") {
									e.EventState3 = 1
									e.room.RoomDoors[4].open = True
									Exit
								}
							}	
							CreateConsoleMsg("Gate B is now unlocked.")	
						default:
							for (e of Events.each) {
								if (e.EventName = "gateaentrance") {
									e.EventState3 = 1
									e.room.RoomDoors[1].open = True
								} else if (e.EventName = "exit1") {
									e.EventState3 = 1
									e.room.RoomDoors[4].open = True
								}
							}
							CreateConsoleMsg("Gate A and B are now unlocked.")	
					}
					
					RemoteDoorOn = True
					
				case "kill","suicide":
					//[Block]
					KillTimer = -1
					switch (Rand(4)) {
						case 1:
							DeathMSG = "[REDACTED]"
						case 2:
							DeathMSG = "Subject D-9341 found dead in Sector [REDACTED]. "
							DeathMSG = DeathMSG + "The subject appears to have attained no physical damage, and there is no visible indication as to what killed him. "
							DeathMSG = DeathMSG + "Body was sent for autopsy."
						case 3:
							DeathMSG = "EXCP_ACCESS_VIOLATION"
						case 4:
							DeathMSG = "Subject D-9341 found dead in Sector [REDACTED]. "
							DeathMSG = DeathMSG + "The subject appears to have scribbled the letters "+Chr(34)+"kys"+Chr(34)+" in his own blood beside him. "
							DeathMSG = DeathMSG + "No other signs of physical trauma or struggle can be observed. Body was sent for autopsy."
					}
					
				case "playmusic":
					//[Block]
					// I think this might be broken since the FMod library streaming was added. -Mark
					if (Instr(ConsoleInput, " ")!=0) {
						StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					} else {
						StrTemp$ = ""
					}
					
					if (StrTemp$ != "") {
						PlayCustomMusic = True
						if (CustomMusic != 0) {
							FreeSound_Strict (CustomMusic)
							CustomMusic = 0
						}
						if (MusicCHN != 0) {StopChannel (MusicCHN)}
						CustomMusic = LoadSound_Strict("SFX/Music/Custom/"+StrTemp$)
						if (CustomMusic = 0) {
							PlayCustomMusic = False
						}
					} else {
						PlayCustomMusic = False
						if (CustomMusic != 0) {
							FreeSound_Strict (CustomMusic)
							CustomMusic = 0
						}
						if (MusicCHN != 0) {StopChannel (MusicCHN)}
					}
					
				case "tp":
					//[Block]
					for (n of NPCs.each) {
						if (n.NPCtype = NPCtypeMTF) {
							if (n.MTFLeader = Null) {
								PositionEntity (Collider,EntityX(n.Collider),EntityY(n.Collider)+5,EntityZ(n.Collider))
								ResetEntity (Collider)
								Exit()
							}
						}
					}
					
				case "tele":
					//[Block]
					args = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					StrTemp = Piece(args,1," ")
					StrTemp2 = Piece(args,2," ")
					StrTemp3 = Piece(args,3," ")
					PositionEntity(Collider,Float(StrTemp$),Float(StrTemp2$),Float(StrTemp3$))
					PositionEntity(Camera,Float(StrTemp$),Float(StrTemp2$),Float(StrTemp3$))
					ResetEntity(Collider)
					ResetEntity(Camera)
					CreateConsoleMsg("Teleported to coordinates (X|Y|Z): "+EntityX(Collider)+"|"+EntityY(Collider)+"|"+EntityZ(Collider))
					
				case "notarget":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					switch (StrTemp) {
						case "on", "1", "true":
							NoTarget = True						
						case "off", "0", "false":
							NoTarget = False	
						default:
							NoTarget = !NoTarget
					}
					
					if (NoTarget == False) {
						CreateConsoleMsg("NOTARGET OFF")
					} else {
						CreateConsoleMsg("NOTARGET ON")	
					}
					
				case "spawnradio":
					//[Block]
					it.Items = CreateItem("Radio Transceiver", "fineradio", EntityX(Collider), EntityY(Camera,True), EntityZ(Collider))
					EntityType(it.collider, HIT_ITEM)
					it.state = 101
					
				case "spawnnvg":
					//[Block]
					it.Items = CreateItem("Night Vision Goggles", "nvgoggles", EntityX(Collider), EntityY(Camera,True), EntityZ(Collider))
					EntityType(it.collider, HIT_ITEM)
					it.state = 1000
					
				case "spawnpumpkin","pumpkin":
					//[Block]
					CreateConsoleMsg("What pumpkin?")
					
				case "spawnnav":
					//[Block]
					it.Items = CreateItem("S-NAV Navigator Ultimate", "nav", EntityX(Collider), EntityY(Camera,True), EntityZ(Collider))
					EntityType(it.collider, HIT_ITEM)
					it.state = 101
					
				case "teleport173":
					//[Block]
					PositionEntity (Curr173.Collider,EntityX(Collider),EntityY(Collider)+0.2,EntityZ(Collider))
					ResetEntity (Curr173.Collider)
					
				case "seteventstate":
					//[Block]
					args$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					StrTemp$ = Piece$(args$,1," ")
					StrTemp2$ = Piece$(args$,2," ")
					StrTemp3$ = Piece$(args$,3," ")
					let pl_room_found: boolean = False
					if (StrTemp == "" || StrTemp2 == "" || StrTemp3 == "") {
						CreateConsoleMsg("Too few parameters. This command requires 3.",255,150,0)
					} else {
						for (e of Events.each) {
							if (e.room = PlayerRoom) {
								if (Lower(StrTemp)!="keep") {
									e.EventState = Float(StrTemp)
								}
								if (Lower(StrTemp2)!="keep") {
									e.EventState2 = Float(StrTemp2)
								}
								if (Lower(StrTemp3)!="keep") {
									e.EventState3 = Float(StrTemp3)
								}
								CreateConsoleMsg("Changed event states from current player room to: "+e.EventState+"|"+e.EventState2+"|"+e.EventState3)
								pl_room_found = True
								Exit()
							}
						}
						if (!pl_room_found) {
							CreateConsoleMsg("The current room doesn't has any event applied.",255,150,0)
						}
					}
					
				case "spawnparticles":
					//[Block]
					if (Instr(ConsoleInput, " ")!=0) {
						StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					} else {
						StrTemp$ = ""
					}
					
					if (Int(StrTemp) > -1 && Int(StrTemp) <= 1) { //<--- This is the maximum ID of particles by Devil Particle system, will be increased after time - ENDSHN
						SetEmitter(Collider,ParticleEffect[Int(StrTemp)])
						CreateConsoleMsg("Spawned particle emitter with ID "+Int(StrTemp)+" at player's position.")
					} else {
						CreateConsoleMsg("Particle emitter with ID "+Int(StrTemp)+" not found.",255,150,0)
					}
					
				case "giveachievement":
					//[Block]
					if (Instr(ConsoleInput, " ")!=0) {
						StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					} else {
						StrTemp$ = ""
					}
					
					if (Int(StrTemp)>=0 && Int(StrTemp)<MAXACHIEVEMENTS) {
						Achievements(Int(StrTemp))=True
						CreateConsoleMsg("Achievemt "+AchievementStrings(Int(StrTemp))+" unlocked.")
					} else {
						CreateConsoleMsg("Achievement with ID "+Int(StrTemp)+" doesn't exist.",255,150,0)
					}
					
				case "427state":
					//[Block]
					StrTemp$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					
					I_427.Timer = Float(StrTemp)*70.0
					
				case "teleport106":
					//[Block]
					Curr106.State = 0
					Curr106.Idle = False
					
				case "setblinkeffect":
					//[Block]
					args$ = Lower(Right(ConsoleInput, Len(ConsoleInput) - Instr(ConsoleInput, " ")))
					BlinkEffect = Float(Left(args, Len(args) - Instr(args, " ")))
					BlinkEffectTimer = Float(Right(args, Len(args) - Instr(args, " ")))
					CreateConsoleMsg("Set BlinkEffect to: " + BlinkEffect + "and BlinkEffect timer: " + BlinkEffectTimer)
					
				case "jorge":
					//[Block]	
					CreateConsoleMsg(Chr(74)+Chr(79)+Chr(82)+Chr(71)+Chr(69)+Chr(32)+Chr(72)+Chr(65)+Chr(83)+Chr(32)+Chr(66)+Chr(69)+Chr(69)+Chr(78)+Chr(32)+Chr(69)+Chr(88)+Chr(80)+Chr(69)+Chr(67)+Chr(84)+Chr(73)+Chr(78)+Chr(71)+Chr(32)+Chr(89)+Chr(79)+Chr(85)+Chr(46))
					
				default:
					//[Block]
					CreateConsoleMsg("Command not found.",255,0,0)
					
			}
			
			ConsoleInput = ""
		}
		
		let TempY: int = y + height - 25*MenuScale - ConsoleScroll
		let count: int = 0
		for (cm of ConsoleMsg.each) {
			count = count+1
			if (count>1000) {
				Delete (cm)
			} else {
				if (TempY >= y && TempY < y + height - 20*MenuScale) {
					if (cm=ConsoleReissue) {
						Color (cm.r/4,cm.g/4,cm.b/4)
						Rect (x,TempY-2*MenuScale,width-30*MenuScale,24*MenuScale,True)
					}
					Color (cm.r,cm.g,cm.b)
					if (cm.isCommand) {
						AAText(x + 20*MenuScale, TempY, "> "+cm.txt)
					} else {
						AAText(x + 20*MenuScale, TempY, cm.txt)
					}
				}
				TempY = TempY - 15*MenuScale
			}
			
		}
		
		Color (255,255,255)
		
		if (Fullscreen) {DrawImage (CursorIMG, ScaledMouseX(),ScaledMouseY())}
	}
	
	AASetFont (Font1)
	
}

ConsoleR = 0
ConsoleG = 255
ConsoleB = 255
CreateConsoleMsg("Console commands: ")
CreateConsoleMsg("  - teleport [room name]")
CreateConsoleMsg("  - godmode [on/off]")
CreateConsoleMsg("  - noclip [on/off]")
CreateConsoleMsg("  - noclipspeed [x] (default = 2.0)")
CreateConsoleMsg("  - wireframe [on/off]")
CreateConsoleMsg("  - debughud [on/off]")
CreateConsoleMsg("  - camerafog [near] [far]")
CreateConsoleMsg(" ")
CreateConsoleMsg("  - status")
CreateConsoleMsg("  - heal")
CreateConsoleMsg(" ")
CreateConsoleMsg("  - spawnitem [item name]")
CreateConsoleMsg(" ")
CreateConsoleMsg("  - 173speed [x] (default = 35)")
CreateConsoleMsg("  - disable173/enable173")
CreateConsoleMsg("  - disable106/enable106")
CreateConsoleMsg("  - 173state/106state/096state")
CreateConsoleMsg("  - spawn [npc type]")

//---------------------------------------------------------------------------------------------------

var DebugHUD: int

var BlurVolume: float, BlurTimer: float

var LightBlink: float, LightFlash: float

var BumpEnabled: int = GetINIInt("options.ini", "options", "bump mapping enabled")
var HUDenabled: int = GetINIInt("options.ini", "options", "HUD enabled")

var Camera: int, CameraShake: float, CurrCameraZoom: float

var Brightness: int = GetINIFloat("options.ini", "options", "brightness")
var CameraFogNear: float = GetINIFloat("options.ini", "options", "camera fog near")
var CameraFogFar: float = GetINIFloat("options.ini", "options", "camera fog far")

var StoredCameraFogFar: float = CameraFogFar

var MouseSens: float = GetINIFloat("options.ini", "options", "mouse sensitivity")

var EnableVRam: int = GetINIInt("options.ini", "options", "enable vram")

import "dreamfilter.ts"

var LightSpriteTex = new Array(10)

//----------------------------------------------  Sounds -----------------------------------------------------

//[Block]

var SoundEmitter: int
var TempSounds: int[] = new Array(10)
var TempSoundCHN: int
var TempSoundIndex: int = 0

//The Music now has to be pre-defined, as the new system uses streaming instead of the usual sound loading system Blitz3D has
var Music: string[] = new Array(40)
Music[0] = "The Dread"
Music[1] = "HeavyContainment"
Music[2] = "EntranceZone"
Music[3] = "PD"
Music[4] = "079"
Music[5] = "GateB1"
Music[6] = "GateB2"
Music[7] = "Room3Storage"
Music[8] = "Room049"
Music[9] = "8601"
Music[10] = "106"
Music[11] = "Menu"
Music[12] = "8601Cancer"
Music[13] = "Intro"
Music[14] = "178"
Music[15] = "PDTrench"
Music[16] = "205"
Music[17] = "GateA"
Music[18] = "1499"
Music[19] = "1499Danger"
Music[20] = "049Chase"
Music[21] = "../Ending/MenuBreath"
Music[22] = "914"
Music[23] = "Ending"
Music[24] = "Credits"
Music[25] = "SaveMeFrom"

var MusicVolume: float = GetINIFloat(OptionFile, "audio", "music volume")

var CurrMusicStream, MusicCHN
MusicCHN = StreamSound_Strict("SFX/Music/"+Music(2)+".ogg",MusicVolume,Mode)

var CurrMusicVolume: float = 1.0, NowPlaying: int=2, ShouldPlay: int=11
var CurrMusic: int = 1

DrawLoading(10, True)

var OpenDoorSFX: int[][] = new Array(3,3)
var CloseDoorSFX: int [][] = new Array(3,3)

var KeyCardSFX1 
var KeyCardSFX2 
var ButtonSFX2 
var ScannerSFX1
var ScannerSFX2 

var OpenDoorFastSFX
var CautionSFX: int 

var NuclearSirenSFX: int

var CameraSFX  

var StoneDragSFX: int 

var GunshotSFX: int
var Gunshot2SFX: int
var Gunshot3SFX: int
var BullethitSFX: int

var TeslaIdleSFX 
var TeslaActivateSFX 
var TeslaPowerUpSFX 

var MagnetUpSFX: int, MagnetDownSFX
var FemurBreakerSFX: int
var EndBreathCHN: int
var EndBreathSFX: int

var DecaySFX: int[] = new Array(5)

var BurstSFX 

DrawLoading(20, True)

var RustleSFX: int[] = new Array(3)

var Use914SFX: int
var Death914SFX: int 

var DripSFX: int[] = new Array(4)

var LeverSFX: int, LightSFX: int 
var ButtGhostSFX: int 

var RadioSFX: Array[][] = new Array(5,10) 

var RadioSquelch 
var RadioStatic 
var RadioBuzz 

var ElevatorBeepSFX, ElevatorMoveSFX  

var PickSFX: int[] = new Array(10)

var AmbientSFXCHN: int, CurrAmbientSFX: int
var AmbientSFXAmount: Array = new Array(6)
//0 = light containment, 1 = heavy containment, 2 = entrance
AmbientSFXAmount[0] = 8
AmbientSFXAmount[1] = 11
AmbientSFXAmount[2] = 12
//3 = general, 4 = pre-breach
AmbientSFXAmount[3] = 15
AmbientSFXAmount[4] = 5
//5 = forest
AmbientSFXAmount[5] = 10

var AmbientSFX: int[] = new Array(6, 15)

var OldManSFX: int[] = new Array(8)

var Scp173SFX: int[] = new Array(3)

var HorrorSFX: int[] = new Array(20)


DrawLoading(25, True)

var IntroSFX: int[] = new Array(20)


var AlarmSFX: int[] = new Array(5)

var CommotionState: int[] = new Array(25)

var HeartBeatSFX 

var VomitSFX: int

var BreathSFX: Array[][] = new Array(2,5)
var BreathCHN: int


var NeckSnapSFX: Array = new Array(3)

var DamageSFX: int[] = new Array(9)

var MTFSFX: int[] = new Array(8)

var CoughSFX: int[] = new Array(3)
var CoughCHN: int, VomitCHN: int

var MachineSFX: int 
var ApacheSFX
var CurrStepSFX
var StepSFX: int[][][] = new Array(5, 2, 8) //(normal/metal, walk/run, id)

var Step2SFX: Array = new Array(6)

DrawLoading(30, True)

//[End block]

//New Sounds and Meshes/Other things in SCP:CB 1.3 - ENDSHN

var PlayCustomMusic: int = False, CustomMusic: int = 0

var Monitor2, Monitor3, MonitorTexture2, MonitorTexture3, MonitorTexture4, MonitorTextureOff
var MonitorTimer: float = 0.0, MonitorTimer2: float = 0.0, UpdateCheckpoint1: int, UpdateCheckpoint2: int

//This variable is for when a camera detected the player
	//False: Player is not seen (will be set after every call of the Main Loop
	//True: The Player got detected by a camera
var PlayerDetected: int
var PrevInjuries: float,PrevBloodloss: float
var NoTarget: boolean = False

var NVGImages = LoadAnimImage("GFX/battery.png",64,64,0,2)
MaskImage (NVGImages,255,0,255)

var Wearing1499: int = False
var AmbientLightRoomTex: int, AmbientLightRoomVal: int

var EnableUserTracks: int = GetINIInt(OptionFile, "audio", "enable user tracks")
var UserTrackMode: int = GetINIInt(OptionFile, "audio", "user track setting")
var UserTrackCheck: int = 0, UserTrackCheck2: int = 0
var UserTrackMusicAmount: int = 0, CurrUserTrack: int, UserTrackFlag: int = False
var UserTrackName: string[] = new Array(256)

var NTF_1499PrevX: float
var NTF_1499PrevY: float
var NTF_1499PrevZ: float
var NTF_1499PrevRoom: Rooms
var NTF_1499X: float
var NTF_1499Y: float
var NTF_1499Z: float
var NTF_1499Sky: int

var OptionsMenu: int = 0
var QuitMSG: int = 0

var InFacility: int = True

var PrevMusicVolume: float = MusicVolume
var PrevSFXVolume: float = SFXVolume
var DeafPlayer: int = False
var DeafTimer: float = 0.0

var IsZombie: int = False

var room2gw_brokendoor: int = False
var room2gw_x: float = 0.0
var room2gw_z: float = 0.0

var Menu_TestIMG
var menuroomscale: float = 8.0 / 2048.0

var CurrMenu_TestIMG: string = ""

var ParticleAmount: int = GetINIInt(OptionFile,"options","particle amount")

var NavImages: Array = new Array(5)
for (i of range(4)) {
	NavImages(i) = LoadImage_Strict("GFX/navigator/roomborder"+i+".png")
	MaskImage (NavImages(i),255,0,255)
}
NavImages(4) = LoadImage_Strict("GFX/navigator/batterymeter.png")

var NavBG = CreateImage(GraphicWidth,GraphicHeight)

var LightConeModel

var ParticleEffect: Array = new Array(10)

const MaxDTextures=8
var DTextures: Array = new Array(MaxDTextures)

var NPC049OBJ, NPC0492OBJ
var ClerkOBJ

var IntercomStreamCHN: int

var ForestNPC,ForestNPCTex
var ForestNPCData: float[] = new Array(3)


//-----------------------------------------  Images ----------------------------------------------------------

var PauseMenuIMG: int

var SprintIcon: int
var BlinkIcon: int
var CrouchIcon: int
var HandIcon: int
var HandIcon2: int

var StaminaMeterIMG: int

var KeypadHUD

var Panel294, Using294: int, Input294: string

DrawLoading(35, True)

//----------------------------------------------  Items  -----------------------------------------------------

import "Items.ts"

//--------------------------------------- Particles ------------------------------------------------------------

import "Particles.ts"

//-------------------------------------  Doors --------------------------------------------------------------
import "Doors.ts"
DrawLoading(40,True)

import "MapSystem.ts"

DrawLoading(80,True)

import "NPCs.ts"

//-------------------------------------  Events --------------------------------------------------------------

class Events {
	EventName: string
	room: Rooms
	
	EventState: float
	EventState2: float
	EventState3: float
	SoundCHN: int
	SoundCHN2: int
	Sound
	Sound2
	SoundCHN_isStream: int
	SoundCHN2_isStream: int
	
	EventStr: string
	
	img: int
}

function CreateEvent(eventname: string, roomname: string, id: int, prob: float = 0.0): Events {
	//roomname = the name of the room(s) you want the event to be assigned to
	
	//the id-variable determines which of the rooms the event is assigned to,
	//0 will assign it to the first generated room, 1 to the second, etc
	
	//the prob-variable can be used to randomly assign events into some rooms
	//0.5 means that there's a 50% chance that event is assigned to the rooms
	//1.0 means that the event is assigned to every room
	//the id-variable is ignored if prob != 0.0
	
	let i: int = 0
	let temp: int
	let e: Events
	let e2: Events
	let r: Rooms
	
	if (prob == 0.0) {
		for (r of Rooms.each) {
			if (roomname = "" || roomname == r.RoomTemplate.Name) {
				temp = False
				for (e2 of Events.each) {
					if (e2.room = r) {
						temp = True
						Exit
					}
				}
				
				i=i+1
				if (i >= id && temp == False) {
					e.Events = new Events()
					e.EventName = eventname					
					e.room = r
					return e
				}
			}
		}
	} else {
		for (r of Rooms.each) {
			if (roomname = "" || roomname == r.RoomTemplate.Name) {
				temp = False
				for (e2 of Events.each) {
					if (e2.room = r) {
						temp = True
						Exit
					}
				}
				
				if (Rnd(0.0, 1.0) < prob && temp == False) {
					e.Events = new Events()
					e.EventName = eventname					
					e.room = r
				}
			}
		}		
	}
	
	return Null
}

function InitEvents() {
	let e: Events
	
	CreateEvent("173", "173", 0)
	CreateEvent("alarm", "start", 0)
	
	CreateEvent("pocketdimension", "pocketdimension", 0)	
	
	//there's a 7% chance that 106 appears in the rooms named "tunnel"
	CreateEvent("tunnel106", "tunnel", 0, 0.07 + (0.1*SelectedDifficulty.aggressiveNPCs))
	
	//the chance for 173 appearing in the first lockroom is about 66%
	//there's a 30% chance that it appears in the later lockrooms
	if (Rand(3)<3) {CreateEvent("lockroom173", "lockroom", 0)}
	CreateEvent("lockroom173", "lockroom", 0, 0.3 + (0.5*SelectedDifficulty.aggressiveNPCs))
	
	CreateEvent("room2trick", "room2", 0, 0.15)	
	
	CreateEvent("1048a", "room2", 0, 1.0)	
	
	CreateEvent("room2storage", "room2storage", 0)	
	
	//096 spawns in the first (and last) lockroom2
	CreateEvent("lockroom096", "lockroom2", 0)
	
	CreateEvent("endroom106", "endroom", Rand(0,1))
	
	CreateEvent("room2poffices2", "room2poffices2", 0)
	
	CreateEvent("room2fan", "room2_2", 0, 1.0)
	
	CreateEvent("room2elevator2", "room2elevator", 0)
	CreateEvent("room2elevator", "room2elevator", Rand(1,2))
	
	CreateEvent("room3storage", "room3storage", 0, 0)
	
	CreateEvent("tunnel2smoke", "tunnel2", 0, 0.2)
	CreateEvent("tunnel2", "tunnel2", Rand(0,2), 0)
	CreateEvent("tunnel2", "tunnel2", 0, (0.2*SelectedDifficulty.aggressiveNPCs))
	
	//173 appears in half of the "room2doors" -rooms
	CreateEvent("room2doors173", "room2doors", 0, 0.5 + (0.4*SelectedDifficulty.aggressiveNPCs))
	
	//the anomalous duck in room2offices2-rooms
	CreateEvent("room2offices2", "room2offices2", 0, 0.7)
	
	CreateEvent("room2closets", "room2closets", 0)	
	
	CreateEvent("room2cafeteria", "room2cafeteria", 0)	
	
	CreateEvent("room3pitduck", "room3pit", 0)
	CreateEvent("room3pit1048", "room3pit", 1)
	
	//the event that causes the door to open by itself in room2offices3
	CreateEvent("room2offices3", "room2offices3", 0, 1.0)	
	
	CreateEvent("room2servers", "room2servers", 0)	
	
	CreateEvent("room3servers", "room3servers", 0)	
	CreateEvent("room3servers", "room3servers2", 0)
	
	//the dead guard
	CreateEvent("room3tunnel","room3tunnel", 0, 0.08)
	
	CreateEvent("room4","room4", 0)
	
	if (Rand(5)<5) { 
		switch (Rand(3)) {
			case 1:
				CreateEvent("682roar", "tunnel", Rand(0,2), 0)	
			case 2:
				CreateEvent("682roar", "room3pit", Rand(0,2), 0)		
			case 3:
				//CreateEvent("682roar", "room2offices", 0, 0)
				CreateEvent("682roar", "room2z3", 0, 0)
		}
	} 
	
	CreateEvent("testroom173", "room2testroom2", 0, 1.0)	
	
	CreateEvent("room2tesla", "room2tesla", 0, 0.9)
	
	CreateEvent("room2nuke", "room2nuke", 0, 0)
	
	if (Rand(5) < 5) {
		CreateEvent("coffin106", "coffin", 0, 0)
	} else {
		CreateEvent("coffin", "coffin", 0, 0)
	} 
	
	CreateEvent("checkpoint", "checkpoint1", 0, 1.0)
	CreateEvent("checkpoint", "checkpoint2", 0, 1.0)
	
	CreateEvent("room3door", "room3", 0, 0.1)
	CreateEvent("room3door", "room3tunnel", 0, 0.1)	
	
	if (Rand(2)=1) {
		CreateEvent("106victim", "room3", Rand(1,2))
		CreateEvent("106sinkhole", "room3_2", Rand(2,3))
	} else {
		CreateEvent("106victim", "room3_2", Rand(1,2))
		CreateEvent("106sinkhole", "room3", Rand(2,3))
	}
	CreateEvent("106sinkhole", "room4", Rand(1,2))
	
	CreateEvent("room079", "room079", 0, 0)	
	
	CreateEvent("room049", "room049", 0, 0)
	
	CreateEvent("room012", "room012", 0, 0)
	
	CreateEvent("room035", "room035", 0, 0)
	
	CreateEvent("008", "008", 0, 0)
	
	CreateEvent("room106", "room106", 0, 0)	
	
	CreateEvent("pj", "roompj", 0, 0)
	
	CreateEvent("914", "914", 0, 0)
	
	CreateEvent("buttghost", "room2toilets", 0, 0)
	CreateEvent("toiletguard", "room2toilets", 1, 0)
	
	CreateEvent("room2pipes106", "room2pipes", Rand(0, 3)) 
	
	CreateEvent("room2pit", "room2pit", 0, 0.4 + (0.4*SelectedDifficulty.aggressiveNPCs))
	
	CreateEvent("testroom", "testroom", 0)
	
	CreateEvent("room2tunnel", "room2tunnel", 0)
	
	CreateEvent("room2ccont", "room2ccont", 0)
	
	CreateEvent("gateaentrance", "gateaentrance", 0)
	CreateEvent("gatea", "gatea", 0)	
	CreateEvent("exit1", "exit1", 0)
	
	CreateEvent("room205", "room205", 0)
	
	CreateEvent("room860","room860", 0)
	
	CreateEvent("room966","room966", 0)
	
	CreateEvent("room1123", "room1123", 0, 0)
	CreateEvent("room2tesla", "room2tesla_lcz", 0, 0.9)
	CreateEvent("room2tesla", "room2tesla_hcz", 0, 0.9)
	
	//New Events in SCP:CB Version 1.3 - ENDSHN
	CreateEvent("room4tunnels","room4tunnels",0)
	CreateEvent("room_gw","room2gw",0,1.0)
	CreateEvent("dimension1499","dimension1499",0)
	CreateEvent("room1162","room1162",0)
	CreateEvent("room2scps2","room2scps2",0)
	CreateEvent("room_gw","room3gw",0,1.0)
	CreateEvent("room2sl","room2sl",0)
	CreateEvent("medibay","medibay",0)
	CreateEvent("room2shaft","room2shaft",0)
	CreateEvent("room1lifts","room1lifts",0)
	
	CreateEvent("room2gw_b","room2gw_b",Rand(0,1))
	
	CreateEvent("096spawn","room4pit",0,0.6+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room3pit",0,0.6+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room2pipes",0,0.4+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room2pit",0,0.5+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room3tunnel",0,0.6+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room4tunnels",0,0.7+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","tunnel",0,0.6+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","tunnel2",0,0.4+(0.2*SelectedDifficulty.aggressiveNPCs))
	CreateEvent("096spawn","room3z2",0,0.7+(0.2*SelectedDifficulty.aggressiveNPCs))
	
	CreateEvent("room2pit","room2_4",0,0.4 + (0.4*SelectedDifficulty.aggressiveNPCs))
	
	CreateEvent("room2offices035","room2offices",0)
	
	CreateEvent("room2pit106", "room2pit", 0, 0.07 + (0.1*SelectedDifficulty.aggressiveNPCs))
	
	CreateEvent("room1archive", "room1archive", 0, 1.0)
	
}

import "UpdateEvents.ts"

function RemoveEvent(e: Events) {
	if (e.Sound!=0) {
		FreeSound_Strict(e.Sound)
	}
	if (e.Sound2!=0) {
		FreeSound_Strict(e.Sound2)
	}
	if (e.img!=0) {
		FreeImage(e.img)
	}
	Delete (e)
}

Collisions(HIT_PLAYER, HIT_MAP, 2, 2)
Collisions(HIT_PLAYER, HIT_PLAYER, 1, 3)
Collisions(HIT_ITEM, HIT_MAP, 2, 2)
Collisions(HIT_APACHE, HIT_APACHE, 1, 2)
Collisions(HIT_178, HIT_MAP, 2, 2)
Collisions(HIT_178, HIT_178, 1, 3)
Collisions(HIT_DEAD, HIT_MAP, 2, 2)

function MilliSecs2() {
	let retVal: int = MilliSecs()
	if (retVal < 0) {retVal = retVal + 2147483648}
	return retVal
}

DrawLoading(90, True)

//----------------------------------- meshes and textures ----------------------------------------------------------------

var FogTexture: int, Fog: int
var GasMaskTexture: int, GasMaskOverlay: int
var InfectTexture: int, InfectOverlay: int
var DarkTexture: int, Dark: int
var Collider: int, Head: int

var FogNVTexture: int
var NVTexture: int, NVOverlay: int

var TeslaTexture: int

var LightTexture: int, Light: int
var LightSpriteTex: int[] = new Array(5)
var DoorOBJ: int, DoorFrameOBJ: int

var LeverOBJ: int, LeverBaseOBJ: int

var DoorColl: int
var ButtonOBJ: int, ButtonKeyOBJ: int, ButtonCodeOBJ: int, ButtonScannerOBJ: int

var DecalTextures: int[] = new Array(20)

var Monitor: int, MonitorTexture: int
var CamBaseOBJ: int, CamOBJ: int

var LiquidObj: int,MTFObj: int,GuardObj: int,ClassDObj: int
var ApacheObj: int,ApacheRotorObj: int

var UnableToMove: boolean = False
var ShouldEntitiesFall: boolean = True
var PlayerFallingPickDistance: float = 10.0

var Save_MSG$ = ""
var Save_MSG_Timer: float = 0.0
var Save_MSG_Y: float = 0.0

var MTF_CameraCheckTimer: float = 0.0
var MTF_CameraCheckDetected: boolean = False

//---------------------------------------------------------------------------------------------------

import "menu.ts"
MainMenuOpen = True

//---------------------------------------------------------------------------------------------------

class MEMORYSTATUS {
    dwLength: int
    dwMemoryLoad: int
    dwTotalPhys: int
    dwAvailPhys: int
    dwTotalPageFile: int
    dwAvailPageFile: int
    dwTotalVirtual: int
    dwAvailVirtual: int
}

var m: MEMORYSTATUS = new MEMORYSTATUS()

FlushKeys()
FlushMouse()

DrawLoading(100, True)

LoopDelay = MilliSecs()

var UpdateParticles_Time: float = 0.0

var CurrTrisAmount: int

var Input_ResetTime: float = 0

class SCP427 {
	Using: int
	Timer: float
	Sound: Array = new Array(1)
	SoundCHN: Array = new Array(1)
}

var I_427: SCP427 = new SCP427()

class MapZones {
	Transition: int[] = new Array(1)
	HasCustomForest: int
	HasCustomMT: int
}

var I_Zone: MapZones = new MapZones()


// Main Loop
while (true) {
	
	Cls()
	
	CurTime = MilliSecs2()
	ElapsedTime = (CurTime - PrevTime) / 1000.0
	PrevTime = CurTime
	PrevFPSFactor = FPSfactor
	FPSfactor = Max(Min(ElapsedTime * 70, 5.0), 0.2)
	FPSfactor2 = FPSfactor
	
	if (MenuOpen || InvOpen || OtherOpen!=Null || ConsoleOpen || SelectedDoor != Null || SelectedScreen != Null || Using294) {
		FPSfactor = 0
	}
	
	if (Framelimit > 0) {
	    //Framelimit
		let WaitingTime: int = (1000.0 / Framelimit) - (MilliSecs2() - LoopDelay)
		Delay (WaitingTime)
		
		LoopDelay = MilliSecs2()
	}
	
	//Counting the fps
	if (CheckFPS < MilliSecs2()) {
		FPS = ElapsedLoops
		ElapsedLoops = 0
		CheckFPS = MilliSecs2()+1000
	}
	ElapsedLoops = ElapsedLoops + 1
	
	if (Input_ResetTime<=0.0) {
		DoubleClick = False
		MouseHit1 = MouseHit(1)
		if (MouseHit1) {
			if (MilliSecs2() - LastMouseHit1 < 800) {
				DoubleClick = True
			}
			LastMouseHit1 = MilliSecs2()
		}
		
		let prevmousedown1 = MouseDown1
		MouseDown1 = MouseDown(1)
		if (prevmousedown1 && MouseDown1==False) {MouseUp1 = True} else {MouseUp1 = False}
		
		MouseHit2 = MouseHit(2)
		
		if ((!MouseDown1) && (!MouseHit1)) {GrabbedEntity = 0}
	} else {
		Input_ResetTime = Max(Input_ResetTime-FPSfactor,0.0)
	}
	
	UpdateMusic()
	if (EnableSFXRelease) {AutoReleaseSounds()}
	
	if (MainMenuOpen) {
		if (ShouldPlay == 21) {
			EndBreathSFX = LoadSound("SFX/Ending/MenuBreath.ogg")
			EndBreathCHN = PlaySound(EndBreathSFX)
			ShouldPlay = 66
		} else if (ShouldPlay = 66) {
			if (!ChannelPlaying(EndBreathCHN)) {
				FreeSound(EndBreathSFX)
				ShouldPlay = 11
			}
		} else {
			ShouldPlay = 11
		}
		UpdateMainMenu()
	} else {
		UpdateStreamSounds()
		
		ShouldPlay = Min(PlayerZone,2)
		
		DrawHandIcon = False
		
		RestoreSanity = True
		ShouldEntitiesFall = True
		
		if (FPSfactor > 0 && PlayerRoom.RoomTemplate.Name != "dimension1499") {UpdateSecurityCams()}
		
		if (PlayerRoom.RoomTemplate.Name != "pocketdimension" && PlayerRoom.RoomTemplate.Name != "gatea" && PlayerRoom.RoomTemplate.Name != "exit1" && !MenuOpen && !ConsoleOpen && !InvOpen) {
			
			if (Rand(1500) == 1) {
				for (i of range(6)) {
					if (AmbientSFX(i,CurrAmbientSFX)!=0) {
						if (ChannelPlaying(AmbientSFXCHN)=0) {
							FreeSound_Strict(AmbientSFX(i,CurrAmbientSFX))
							AmbientSFX(i,CurrAmbientSFX) = 0
						}
					}			
				}
				
				PositionEntity (SoundEmitter, EntityX(Camera) + Rnd(-1.0, 1.0), 0.0, EntityZ(Camera) + Rnd(-1.0, 1.0))
				
				if (Rand(3)=1) {PlayerZone = 3}
				
				if (PlayerRoom.RoomTemplate.Name = "173") {
					PlayerZone = 4
				} else if (PlayerRoom.RoomTemplate.Name = "room860") {
					for (e of Events.each) {
						if (e.EventName = "room860") {
							if (e.EventState = 1.0) {
								PlayerZone = 5
								PositionEntity (SoundEmitter, EntityX(SoundEmitter), 30.0, EntityZ(SoundEmitter))
							}
							
							Exit()
						}
					}
				}
				
				CurrAmbientSFX = Rand(0,AmbientSFXAmount(PlayerZone)-1)
				
				switch (PlayerZone) {
					case 0,1,2:
						if (AmbientSFX(PlayerZone,CurrAmbientSFX)=0) {
							AmbientSFX(PlayerZone,CurrAmbientSFX)=LoadSound_Strict("SFX/Ambient/Zone"+(PlayerZone+1)+"/ambient"+(CurrAmbientSFX+1)+".ogg")
						}
					case 3:
						if (AmbientSFX(PlayerZone,CurrAmbientSFX)=0) {
							AmbientSFX(PlayerZone,CurrAmbientSFX)=LoadSound_Strict("SFX/Ambient/General/ambient"+(CurrAmbientSFX+1)+".ogg")
						}
					case 4:
						if (AmbientSFX(PlayerZone,CurrAmbientSFX)=0) {
							AmbientSFX(PlayerZone,CurrAmbientSFX)=LoadSound_Strict("SFX/Ambient/Pre-breach/ambient"+(CurrAmbientSFX+1)+".ogg")
						}
					case 5:
						if (AmbientSFX(PlayerZone,CurrAmbientSFX)=0) {
							AmbientSFX(PlayerZone,CurrAmbientSFX)=LoadSound_Strict("SFX/Ambient/Forest/ambient"+(CurrAmbientSFX+1)+".ogg")
						}
				}
				
				AmbientSFXCHN = PlaySound2(AmbientSFX(PlayerZone,CurrAmbientSFX), Camera, SoundEmitter)
			}
			UpdateSoundOrigin(AmbientSFXCHN,Camera, SoundEmitter)
			
			if (Rand(50000) == 3) {
				let RN: string = PlayerRoom.RoomTemplate.Name$
				if (RN$ != "room860" && RN$ != "room1123" && RN$ != "173" && RN$ != "dimension1499") {
					if (FPSfactor > 0) {LightBlink = Rnd(1.0,2.0)}
					PlaySound_Strict(LoadTempSound("SFX/SCP/079/Broadcast"+Rand(1,7)+".ogg"))
				} 
			}
		}
		
		UpdateCheckpoint1 = False
		UpdateCheckpoint2 = False
		
		if ((!MenuOpen) && (!InvOpen) && (OtherOpen == Null) && (SelectedDoor == Null) && (ConsoleOpen == False) && (Using294 == False) && (SelectedScreen == Null) && EndingTimer >= 0) {
			LightVolume = CurveValue(TempLightVolume, LightVolume, 50.0)
			CameraFogRange(Camera, CameraFogNear*LightVolume,CameraFogFar*LightVolume)
			CameraFogColor(Camera, 0,0,0)
			CameraFogMode (Camera,1)
			CameraRange(Camera, 0.05, Min(CameraFogFar*LightVolume*1.5,28))	
			if (PlayerRoom.RoomTemplate.Name!="pocketdimension") {
				CameraClsColor(Camera, 0,0,0)
			}
			
			AmbientLight (Brightness, Brightness, Brightness)
			PlayerSoundVolume = CurveValue(0.0, PlayerSoundVolume, 5.0)
			
			CanSave = True
			UpdateDeafPlayer()
			UpdateEmitters()
			MouseLook()
			if (PlayerRoom.RoomTemplate.Name == "dimension1499" && QuickLoadPercent > 0 && QuickLoadPercent < 100) {
				ShouldEntitiesFall = False
			}
			MovePlayer()
			InFacility = CheckForPlayerInFacility()
			if (PlayerRoom.RoomTemplate.Name = "dimension1499") {
				if (QuickLoadPercent == -1 || QuickLoadPercent == 100) {
					UpdateDimension1499()
				}
				UpdateLeave1499()
			} else if (PlayerRoom.RoomTemplate.Name = "gatea" || (PlayerRoom.RoomTemplate.Name="exit1" && EntityY(Collider)>1040.0*RoomScale)) {
				UpdateDoors()
				if (QuickLoadPercent == -1 || QuickLoadPercent == 100) {
					UpdateEndings()
				}
				UpdateScreens()
				UpdateRoomLights(Camera)
			} else {
				UpdateDoors()
				if (QuickLoadPercent = -1 || QuickLoadPercent == 100) {
					UpdateEvents()
				}
				UpdateScreens()
				TimeCheckpointMonitors()
				Update294()
				UpdateRoomLights(Camera)
			}
			UpdateDecals()
			UpdateMTF()
			UpdateNPCs()
			UpdateItems()
			UpdateParticles()
			Use427()
			UpdateMonitorSaving()
			//Added a simple code for updating the Particles function depending on the FPSFactor (still WIP, might not be the final version of it) - ENDSHN
			UpdateParticles_Time = Min(1,UpdateParticles_Time+FPSfactor)
			if (UpdateParticles_Time == 1) {
				UpdateDevilEmitters()
				UpdateParticles_Devil()
				UpdateParticles_Time=0
			}
		}
		
		if (InfiniteStamina) {
			Stamina = Min(100, Stamina + (100.0-Stamina)*0.01*FPSfactor)
		}
		
		if (FPSfactor=0) {
			UpdateWorld(0)
		} else {
			UpdateWorld()
			ManipulateNPCBones()
		}
		RenderWorld2()
		
		BlurVolume = Min(CurveValue(0.0, BlurVolume, 20.0),0.95)
		if (BlurTimer > 0.0) {
			BlurVolume = Max(Min(0.95, BlurTimer / 1000.0), BlurVolume)
			BlurTimer = Max(BlurTimer - FPSfactor, 0.0)
		}
		
		UpdateBlur(BlurVolume)
		
		//[Block]
		
		let darkA: float = 0.0
		if (!MenuOpen)  {
			if (Sanity < 0) {
				if (RestoreSanity) {
					Sanity = Min(Sanity + FPSfactor, 0.0)
				}
				if (Sanity < -200) { 
					darkA = Max(Min((-Sanity - 200) / 700.0, 0.6), darkA)
					if (KillTimer >= 0) { 
						HeartBeatVolume = Min(Abs(Sanity+200)/500.0,1.0)
						HeartBeatRate = Max(70 + Abs(Sanity+200)/6.0,HeartBeatRate)
					}
				}
			}
			
			if (EyeStuck > 0) {
				BlinkTimer = BLINKFREQ
				EyeStuck = Max(EyeStuck-FPSfactor,0)
				
				if (EyeStuck < 9000) {BlurTimer = Max(BlurTimer, (9000-EyeStuck)*0.5)}
				if (EyeStuck < 6000) {darkA = Min(Max(darkA, (6000-EyeStuck)/5000.0),1.0)}
				if (EyeStuck < 9000 && EyeStuck+FPSfactor >= 9000) { 
					Msg = "The eyedrops are causing your eyes to tear up."
					MsgTimer = 70*6
				}
			}
			
			if (BlinkTimer < 0) {
				if (BlinkTimer > -5) {
					darkA = Max(darkA, Sin(Abs(BlinkTimer * 18.0)))
				} else if (BlinkTimer > -15) {
					darkA = 1.0
				} else {
					darkA = Max(darkA, Abs(Sin(BlinkTimer * 18.0)))
				}
				
				if (BlinkTimer <= -20) {
					//Randomizes the frequency of blinking. Scales with difficulty.
					switch (SelectedDifficulty.otherFactors) {
						case EASY:
							BLINKFREQ = Rnd(490,700)
						case NORMAL:
							BLINKFREQ = Rnd(455,665)
						case HARD:
							BLINKFREQ = Rnd(420,630)
					}
					BlinkTimer = BLINKFREQ
				}
				
				BlinkTimer = BlinkTimer - FPSfactor
			} else {
				BlinkTimer = BlinkTimer - FPSfactor * 0.6 * BlinkEffect
				if (EyeIrritation > 0) {
					BlinkTimer=BlinkTimer-Min(EyeIrritation / 100.0 + 1.0, 4.0) * FPSfactor
				}
				
				darkA = Max(darkA, 0.0)
			}
			
			EyeIrritation = Max(0, EyeIrritation - FPSfactor)
			
			if (BlinkEffectTimer > 0) {
				BlinkEffectTimer = BlinkEffectTimer - (FPSfactor/70)
			} else {
				if (BlinkEffect != 1.0) {BlinkEffect = 1.0}
			}
			
			LightBlink = Max(LightBlink - (FPSfactor / 35.0), 0)
			if (LightBlink > 0) {darkA = Min(Max(darkA, LightBlink * Rnd(0.3, 0.8)), 1.0)}
			
			if (Using294) {darkA=1.0}
			
			if (!WearingNightVision) {
				darkA = Max((1.0-SecondaryLightOn)*0.9, darkA)
			}
			
			if (KillTimer < 0) {
				InvOpen = False
				SelectedItem = Null
				SelectedScreen = Null
				SelectedMonitor = Null
				BlurTimer = Abs(KillTimer*5)
				KillTimer=KillTimer-(FPSfactor*0.8)
				if (KillTimer < -360) {
					MenuOpen = True 
					if (SelectedEnding != "") {EndingTimer = Min(KillTimer,-0.1)}
				}
				darkA = Max(darkA, Min(Abs(KillTimer / 400.0), 1.0))
			}
			
			if (FallTimer < 0) {
				if (SelectedItem != Null) {
					if (Instr(SelectedItem.itemtemplate.tempname,"hazmatsuit") || Instr(SelectedItem.itemtemplate.tempname,"vest")) {
						if (WearingHazmat == 0 && WearingVest == 0) {
							DropItem(SelectedItem)
						}
					}
				}
				InvOpen = False
				SelectedItem = Null
				SelectedScreen = Null
				SelectedMonitor = Null
				BlurTimer = Abs(FallTimer*10)
				FallTimer = FallTimer-FPSfactor
				darkA = Max(darkA, Min(Abs(FallTimer / 400.0), 1.0))				
			}
			
			if (SelectedItem != Null) {
				if (SelectedItem.itemtemplate.tempname = "navigator" || SelectedItem.itemtemplate.tempname == "nav") {darkA = Max(darkA, 0.5)}
			}
			if (SelectedScreen != Null) {darkA = Max(darkA, 0.5)}
			
			EntityAlpha(Dark, darkA)	
		}
		
		if (LightFlash > 0) {
			ShowEntity (Light)
			EntityAlpha(Light, Max(Min(LightFlash + Rnd(-0.2, 0.2), 1.0), 0.0))
			LightFlash = Max(LightFlash - (FPSfactor / 70.0), 0)
		} else {
			HideEntity (Light)
		}
		
		EntityColor (Light,255,255,255)
		
		//[End block]
		
		if (KeyHit(KEY_INV) && VomitTimer >= 0) {
			if (!UnableToMove && !IsZombie && !Using294) {
				let W: string = ""
				let V: float = 0
				if (SelectedItem!=Null) {
					W = SelectedItem.itemtemplate.tempname
					V = SelectedItem.state
				}
				if ((W!="vest" && W!="finevest" && W!="hazmatsuit" && W!="hazmatsuit2" && W!="hazmatsuit3") || V == 0 || V == 100) {
					if (InvOpen) {
						ResumeSounds()
						MouseXSpeed()
						MouseYSpeed()
						MouseZSpeed()
						mouse_x_speed_1 = 0.0
						mouse_y_speed_1 = 0.0
					} else {
						PauseSounds()
					}
					InvOpen = !InvOpen
					if (OtherOpen != Null) {
						OtherOpen=Null
					}
					SelectedItem = Null
				}
			}
		}
		
		if (KeyHit(KEY_SAVE)) {
			if (SelectedDifficulty.saveType = SAVEANYWHERE) {
				RN$ = PlayerRoom.RoomTemplate.Name$
				if (RN$ = "173" || (RN$ = "exit1" && EntityY(Collider)>1040.0*RoomScale) || RN$ == "gatea") {
					Msg = "You cannot save in this location."
					MsgTimer = 70 * 4
					//SetSaveMSG("You cannot save in this location.")
				} else if ((!CanSave) || QuickLoadPercent > -1) {
					Msg = "You cannot save at this moment."
					MsgTimer = 70 * 4
					//SetSaveMSG("You cannot save at this moment.")
					if (QuickLoadPercent > -1) {
						Msg = Msg + " (game is loading)"
						//Save_MSG = Save_MSG + " (game is loading)"
					}
				} else {
					SaveGame(SavePath + CurrSave + "\\")
				}
			} else if (SelectedDifficulty.saveType = SAVEONSCREENS) {
				if (SelectedScreen == Null && SelectedMonitor == Null) {
					Msg = "Saving is only permitted on clickable monitors scattered throughout the facility."
					MsgTimer = 70 * 4
				} else {
					RN$ = PlayerRoom.RoomTemplate.Name$
					if (RN$ == "173" || (RN$ == "exit1" && EntityY(Collider)>1040.0*RoomScale) || RN$ == "gatea") {
						Msg = "You cannot save in this location."
						MsgTimer = 70 * 4
						//SetSaveMSG("You cannot save in this location.")
					} else if ((!CanSave) || QuickLoadPercent > -1) {
						Msg = "You cannot save at this moment."
						MsgTimer = 70 * 4
						//SetSaveMSG("You cannot save at this moment.")
						if (QuickLoadPercent > -1) {
							Msg = Msg + " (game is loading)"
							//Save_MSG = Save_MSG + " (game is loading)"
						}
					} else {
						if (SelectedScreen != Null) {
							GameSaved = False
							Playable = True
							DropSpeed = 0
						}
						SaveGame(SavePath + CurrSave + "\\")
					}
				}
			} else {
				Msg = "Quick saving is disabled."
				MsgTimer = 70 * 4
			}
		} else if (SelectedDifficulty.saveType = SAVEONSCREENS && (SelectedScreen != Null || SelectedMonitor != Null)) {
			if ((Msg!="Game progress saved." && Msg!="You cannot save in this location."&& Msg!="You cannot save at this moment.") || MsgTimer<=0) {
				Msg = "Press "+KeyName(KEY_SAVE)+" to save."
				MsgTimer = 70*4
			}
			
			if (MouseHit2) {SelectedMonitor = Null}
		}
		
		if (KeyHit(KEY_CONSOLE)) {
			if (CanOpenConsole) {
				if (ConsoleOpen) {
					UsedConsole = True
					ResumeSounds()
					MouseXSpeed()
					MouseYSpeed()
					MouseZSpeed()
					mouse_x_speed_1 = 0.0
					mouse_y_speed_1 = 0.0
				} else {
					PauseSounds()
				}
				ConsoleOpen = !ConsoleOpen
				FlushKeys()
			}
		}
		
		DrawGUI()
		
		if (EndingTimer < 0) {
			if (SelectedEnding != "") {DrawEnding()}
		} else {
			DrawMenu()			
		}
		
		UpdateConsole()
		
		if (PlayerRoom != Null) {
			if (PlayerRoom.RoomTemplate.Name == "173") {
				for (e of Events.each) {
					if (e.EventName == "173") {
						if (e.EventState3 >= 40 && e.EventState3 < 50) {
							if (InvOpen) {
								Msg = "Double click on the document to view it."
								MsgTimer=70*7
								e.EventState3 = 50
							}
						}
					}
				}
			}
		}
		
		if (MsgTimer > 0) {
			let temp: boolean = False
			if (!InvOpen) {
				if (SelectedItem != Null) {
					if (SelectedItem.itemtemplate.tempname == "paper" || SelectedItem.itemtemplate.tempname == "oldpaper") {
						temp = True
					}
				}
			}
			
			if (!temp) {
				Color (0,0,0)
				AAText((GraphicWidth / 2)+1, (GraphicHeight / 2) + 201, Msg, True, False, Min(MsgTimer / 2, 255)/255.0)
				Color (255,255,255)
				if (Left(Msg,14)="Blitz3D Error!") {
					Color(255,0,0)
				}
				AAText((GraphicWidth / 2), (GraphicHeight / 2) + 200, Msg, True, False, Min(MsgTimer / 2, 255)/255.0)
			} else {
				Color(0,0,0)
				AAText((GraphicWidth / 2)+1, (GraphicHeight * 0.94) + 1, Msg, True, False, Min(MsgTimer / 2, 255)/255.0)
				Color(255,255,255)
				if (Left(Msg,14)="Blitz3D Error!") {
					Color(255,0,0)
				}
				AAText((GraphicWidth / 2), (GraphicHeight * 0.94), Msg, True, False, Min(MsgTimer / 2, 255)/255.0)
			}
			MsgTimer=MsgTimer-FPSfactor2 
		}
		
		Color (255, 255, 255)
		if (ShowFPS) {
			AASetFont (ConsoleFont)
			AAText (20, 20, "FPS: " + FPS)
			AASetFont (Font1)
		}
		
		DrawQuickLoading()
		
		UpdateAchievementMsg()
		//UpdateSaveMSG()
	}
	
	if (BorderlessWindowed) {
		if ((RealGraphicWidth != GraphicWidth) || (RealGraphicHeight != GraphicHeight)) {
			SetBuffer(TextureBuffer(fresize_texture))
			ClsColor(0,0,0)
			Cls()
			CopyRect (0,0,GraphicWidth,GraphicHeight,1024-GraphicWidth/2,1024-GraphicHeight/2,BackBuffer(),TextureBuffer(fresize_texture))
			SetBuffer(BackBuffer())
			ClsColor(0,0,0)
			Cls()
			ScaleRender(0,0,2050.0 / Float(GraphicWidth) * AspectRatioRatio, 2050.0 / Float(GraphicWidth) * AspectRatioRatio)
			//might want to replace Float(GraphicWidth) with Max(GraphicWidth,GraphicHeight) if portrait sizes cause issues
			//everyone uses landscape so it's probably a non-issue
		}
	}
	
	//not by any means a perfect solution
	//Not even proper gamma correction but it's a nice looking alternative that works in windowed mode
	if (ScreenGamma>1.0) {
		CopyRect (0,0,RealGraphicWidth,RealGraphicHeight,1024-RealGraphicWidth/2,1024-RealGraphicHeight/2,BackBuffer(),TextureBuffer(fresize_texture))
		EntityBlend (fresize_image,1)
		ClsColor (0,0,0)
		Cls()
		ScaleRender(-1.0/Float(RealGraphicWidth),1.0/Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth))
		EntityFX (fresize_image,1+32)
		EntityBlend (fresize_image,3)
		EntityAlpha (fresize_image,ScreenGamma-1.0)
		ScaleRender(-1.0/Float(RealGraphicWidth),1.0/Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth))
	} else if (ScreenGamma<1.0) { //todo: maybe optimize this if it's too slow, alternatively give players the option to disable gamma
		CopyRect (0,0,RealGraphicWidth,RealGraphicHeight,1024-RealGraphicWidth/2,1024-RealGraphicHeight/2,BackBuffer(),TextureBuffer(fresize_texture))
		EntityBlend (fresize_image,1)
		ClsColor (0,0,0)
		Cls()
		ScaleRender(-1.0/Float(RealGraphicWidth),1.0/Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth))
		EntityFX (fresize_image,1+32)
		EntityBlend (fresize_image,2)
		EntityAlpha (fresize_image,1.0)
		SetBuffer (TextureBuffer(fresize_texture2))
		ClsColor (255*ScreenGamma,255*ScreenGamma,255*ScreenGamma)
		Cls()
		SetBuffer (BackBuffer())
		ScaleRender(-1.0/Float(RealGraphicWidth),1.0/Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth),2048.0 / Float(RealGraphicWidth))
		SetBuffer(TextureBuffer(fresize_texture2))
		ClsColor (0,0,0)
		Cls()
		SetBuffer(BackBuffer())
	}
	EntityFX (fresize_image,1)
	EntityBlend (fresize_image,1)
	EntityAlpha (fresize_image,1.0)
	
	CatchErrors("Main loop / uncaught")
	
	if (Vsync == 0) {
		Flip (0)
	} else { 
		Flip (1)
	}
}

function QuickLoadEvents() {
	CatchErrors("Uncaught (QuickLoadEvents)")
	
	if (QuickLoad_CurrEvent == Null) {
		QuickLoadPercent = -1
		return
	}
	
	let e: Events = QuickLoad_CurrEvent
	
	let r: Rooms
	let sc: SecurityCams
	let sc2: SecurityCams
	let scale: float
	let pvt: int
	let n: NPCs
	let tex: int
	let i: int
	let x: float
	let z: float
	
	//might be a good idea to use QuickLoadPercent to determine the "steps" of the loading process 
	//instead of magic values in e\eventState and e\eventStr

	switch (e.EventName) {
		case "room2sl":
			//[Block]
			if (e.EventState = 0 && e.EventStr != "") {
				if (e.EventStr != "" && Left(e.EventStr,4) != "load") {
					QuickLoadPercent = QuickLoadPercent + 5
					if (Int(e.EventStr) > 9) {
						e.EventStr = "load2"
					} else {
						e.EventStr = Int(e.EventStr) + 1
					}
				} else if (e.EventStr = "load2") {
					//For SCP-049
					let skip = False
					if (e.room.NPC[0]=Null) {
						for (n of NPCs.each) {
							if (n.NPCtype = NPCtype049) {
								skip = True
								Exit()
							}
						}
						
						if (!skip) {
							e.room.NPC[0] = CreateNPC(NPCtype049,EntityX(e.room.Objects[7],True),EntityY(e.room.Objects[7],True)+5,EntityZ(e.room.Objects[7],True))
							e.room.NPC[0].HideFromNVG = True
							PositionEntity (e.room.NPC[0].Collider,EntityX(e.room.Objects[7],True),EntityY(e.room.Objects[7],True)+5,EntityZ(e.room.Objects[7],True))
							ResetEntity (e.room.NPC[0].Collider)
							RotateEntity (e.room.NPC[0].Collider,0,e.room.angle+180,0)
							e.room.NPC[0].State = 0
							e.room.NPC[0].PrevState = 2
							
							DebugLog(EntityX(e.room.Objects[7],True)+", "+EntityY(e.room.Objects[7],True)+", "+EntityZ(e.room.Objects[7],True))
						} else {
							DebugLog("Skipped 049 spawning in room2sl")
						}
					}
					QuickLoadPercent = 80
					e.EventStr = "load3"
				} else if (e.EventStr = "load3") {
					
					e.EventState = 1
					if (e.EventState2 = 0) {e.EventState2 = -(70*5)}
					
					QuickLoadPercent = 100
				}
			}
			
		case "room2closets":
			//[Block]
			if (e.EventState == 0) {
				if (e.EventStr == "load0") {
					QuickLoadPercent = 10
					if (e.room.NPC[0] == Null) {
						e.room.NPC[0] = CreateNPC(NPCtypeD, EntityX(e.room.Objects[0],True),EntityY(e.room.Objects[0],True),EntityZ(e.room.Objects[0],True))
					}
					
					ChangeNPCTextureID(e.room.NPC[0],4)
					e.EventStr = "load1"
				} else if (e.EventStr == "load1") {
					QuickLoadPercent = 20
					e.room.NPC[0].Sound=LoadSound_Strict("SFX/Room/Storeroom/Escape1.ogg")
					e.EventStr = "load2"
				} else if (e.EventStr == "load2") {
					QuickLoadPercent = 35
					e.room.NPC[0].SoundChn = PlaySound2(e.room.NPC[0].Sound, Camera, e.room.NPC[0].Collider, 12)
					e.EventStr = "load3"
				} else if (e.EventStr == "load3") {
					QuickLoadPercent = 55
					if (e.room.NPC[1] == Null) {
						e.room.NPC[1] = CreateNPC(NPCtypeD, EntityX(e.room.Objects[1],True),EntityY(e.room.Objects[1],True),EntityZ(e.room.Objects[1],True))
					}
					
					ChangeNPCTextureID(e.room.NPC[1],2)
					e.EventStr = "load4"
				} else if (e.EventStr == "load4") {
					QuickLoadPercent = 80
					e.room.NPC[1].Sound=LoadSound_Strict("SFX/Room/Storeroom/Escape2.ogg")
					e.EventStr = "load5"
				} else if (e.EventStr == "load5") {
					QuickLoadPercent = 100
					PointEntity (e.room.NPC[0].Collider, e.room.NPC[1].Collider)
					PointEntity (e.room.NPC[1].Collider, e.room.NPC[0].Collider)
					
					e.EventState=1
				}
			}
			
		case "room3storage":
			//[Block]
			if (e.room.NPC[0]=Null) {
				e.room.NPC[0]=CreateNPC(NPCtype939, 0,0,0)
				QuickLoadPercent = 20
			} else if (e.room.NPC[1]=Null) {
				e.room.NPC[1]=CreateNPC(NPCtype939, 0,0,0)
				QuickLoadPercent = 50
			} else if (e.room.NPC[2]=Null) {
				e.room.NPC[2]=CreateNPC(NPCtype939, 0,0,0)
				QuickLoadPercent = 100
			} else {
				if (QuickLoadPercent > -1) {
					QuickLoadPercent = 100
				}
			}
			
		case "room049":
			//[Block]
			if (e.EventState = 0) {
				if (e.EventStr = "load0") {
					n.NPCs = CreateNPC(NPCtypeZombie, EntityX(e.room.Objects[4],True),EntityY(e.room.Objects[4],True),EntityZ(e.room.Objects[4],True))
					PointEntity(n.Collider, e.room.obj)
					TurnEntity(n.Collider, 0, 190, 0)
					QuickLoadPercent = 20
					e.EventStr = "load1"
				} else if (e.EventStr = "load1") {
					n.NPCs = CreateNPC(NPCtypeZombie, EntityX(e.room.Objects[5],True),EntityY(e.room.Objects[5],True),EntityZ(e.room.Objects[5],True))
					PointEntity(n.Collider, e.room.obj)
					TurnEntity(n.Collider, 0, 20, 0)
					QuickLoadPercent = 60
					e.EventStr = "load2"
				} else if (e.EventStr = "load2") {
					for (n of NPCs.each) {
						if (n.NPCtype = NPCtype049) {
							e.room.NPC[0]=n
							e.room.NPC[0].State = 2
							e.room.NPC[0].Idle = 1
							e.room.NPC[0].HideFromNVG = True
							PositionEntity (e.room.NPC[0].Collider,EntityX(e.room.Objects[4],True),EntityY(e.room.Objects[4],True)+3,EntityZ(e.room.Objects[4],True))
							ResetEntity (e.room.NPC[0].Collider)
							Exit()
						}
					}
					if (e.room.NPC[0]=Null) {
						n.NPCs = CreateNPC(NPCtype049, EntityX(e.room.Objects[4],True), EntityY(e.room.Objects[4],True)+3, EntityZ(e.room.Objects[4],True))
						PointEntity (n.Collider, e.room.obj)
						n.State = 2
						n.Idle = 1
						n.HideFromNVG = True
						e.room.NPC[0]=n
					}
					QuickLoadPercent = 100
					e.EventState=1
				}
			}
			
		case "room205":
			//[Block]
			if (e.EventState == 0 || e.room.Objects[0] == 0) {
				if (e.EventStr == "load0") {
					e.room.Objects[3] = LoadAnimMesh_Strict("GFX/npcs/205_demon1.b3d")
					QuickLoadPercent = 10
					e.EventStr = "load1"
				} else if (e.EventStr == "load1") {
					e.room.Objects[4] = LoadAnimMesh_Strict("GFX/npcs/205_demon2.b3d")
					QuickLoadPercent = 20
					e.EventStr = "load2"
				} else if (e.EventStr == "load2") {
					e.room.Objects[5] = LoadAnimMesh_Strict("GFX/npcs/205_demon3.b3d")
					QuickLoadPercent = 30
					e.EventStr = "load3"
				} else if (e.EventStr == "load3") {
					e.room.Objects[6] = LoadAnimMesh_Strict("GFX/npcs/205_woman.b3d")
					QuickLoadPercent = 40
					e.EventStr = "load4"
				} else if (e.EventStr == "load4") {
					QuickLoadPercent = 50
					e.EventStr = "load5"
				} else if (e.EventStr == "load5") {
					for (i of range(3, 7)) {
						PositionEntity(e.room.Objects[i], EntityX(e.room.Objects[0],True), EntityY(e.room.Objects[0],True), EntityZ(e.room.Objects[0],True), True)
						RotateEntity(e.room.Objects[i], -90, EntityYaw(e.room.Objects[0],True), 0, True)
						ScaleEntity(e.room.Objects[i], 0.05, 0.05, 0.05, True)
					}
					QuickLoadPercent = 70
					e.EventStr = "load6"
				} else if (e.EventStr == "load6") {
					//GiveAchievement(Achv205)
					
					HideEntity(e.room.Objects[3])
					HideEntity(e.room.Objects[4])
					HideEntity(e.room.Objects[5])
					QuickLoadPercent = 100
					e.EventStr = "loaddone"
					//e.EventState = 1
				}
			}
			
		case "room860":
			//[Block]
			if (e.EventStr == "load0") {
				QuickLoadPercent = 15
				ForestNPC = CreateSprite()
				ScaleSprite (ForestNPC,0.75*(140.0/410.0),0.75)
				SpriteViewMode (ForestNPC,4)
				EntityFX (ForestNPC,1+8)
				ForestNPCTex = LoadAnimTexture("GFX/npcs/AgentIJ.AIJ",1+2,140,410,0,4)
				ForestNPCData[0] = 0
				EntityTexture (ForestNPC,ForestNPCTex,ForestNPCData[0])
				ForestNPCData[1]=0
				ForestNPCData[2]=0
				HideEntity (ForestNPC)
				e.EventStr = "load1"
			} else if (e.EventStr == "load1") {
				QuickLoadPercent = 40
				e.EventStr = "load2"
			} else if (e.EventStr == "load2") {
				QuickLoadPercent = 100
				if (e.room.NPC[0] == Null) {e.room.NPC[0]=CreateNPC(NPCtype860, 0,0,0)}
				e.EventStr = "loaddone"
			}
			
		case "room966":
			//[Block]
			if (e.EventState = 1) {
				e.EventState2 = e.EventState2+FPSfactor
				if (e.EventState2>30) {
					if (e.EventStr = "") {
						CreateNPC(NPCtype966, EntityX(e.room.Objects[0],True), EntityY(e.room.Objects[0],True), EntityZ(e.room.Objects[0],True))
						QuickLoadPercent = 50
						e.EventStr = "load0"
					} else if (e.EventStr = "load0") {
						CreateNPC(NPCtype966, EntityX(e.room.Objects[2],True), EntityY(e.room.Objects[2],True), EntityZ(e.room.Objects[2],True))
						QuickLoadPercent = 100
						e.EventState=2
					}
				} else {
					QuickLoadPercent = Int(e.EventState2)
				}
			}
			
		case "dimension1499":
			//[Block]
			if (e.EventState = 0.0) {
				if (e.EventStr = "load0") {
					QuickLoadPercent = 10
					e.room.Objects[0] = LoadMesh_Strict("GFX/map/dimension1499/1499plane.b3d")
					HideEntity (e.room.Objects[0])
					e.EventStr = "load1"
				} else if (e.EventStr = "load1") {
					QuickLoadPercent = 30
					NTF_1499Sky = sky_CreateSky("GFX/map/sky/1499sky")
					e.EventStr = 1
				} else {
					if (Int(e.EventStr)<16) {
						QuickLoadPercent = QuickLoadPercent + 2
						e.room.Objects[Int(e.EventStr)] = LoadMesh_Strict("GFX/map/dimension1499/1499object"+(Int(e.EventStr))+".b3d")
						HideEntity (e.room.Objects[Int(e.EventStr)])
						e.EventStr = Int(e.EventStr)+1
					} else if (Int(e.EventStr)=16) {
						QuickLoadPercent = 90
						CreateChunkParts(e.room)
						e.EventStr = 17
					} else if (Int(e.EventStr) = 17) {
						QuickLoadPercent = 100
						x = EntityX(e.room.obj)
						z = EntityZ(e.room.obj)
						let ch: Chunk
						for (i of range(-1, 0, 2)) {
							ch = CreateChunk(-1,x*(i*2.5),EntityY(e.room.obj),z,True)
						}
						for (i of range(-1, 0, 2)) {
							ch = CreateChunk(-1,x*(i*2.5),EntityY(e.room.obj),z-40,True)
						}
						e.EventState = 2.0
						e.EventStr = 18
					}
				}
			}
			
	}
	
	CatchErrors("QuickLoadEvents "+e.EventName)
	
}

function Kill() {
	if (GodMode) {return}
	
	if (BreathCHN != 0) {
		if (ChannelPlaying(BreathCHN)) {StopChannel(BreathCHN)}
	}
	
	if (KillTimer >= 0) {
		KillAnim = Rand(0,1)
		PlaySound_Strict(DamageSFX(0))
		if (SelectedDifficulty.permaDeath) {
			DeleteFile(CurrentDir() + SavePath + CurrSave+"/save.txt") 
			DeleteDir(SavePath + CurrSave)
			LoadSaveGames()
		}
		
		KillTimer = Min(-1, KillTimer)
		ShowEntity (Head)
		PositionEntity(Head, EntityX(Camera, True), EntityY(Camera, True), EntityZ(Camera, True), True)
		ResetEntity (Head)
		RotateEntity(Head, 0, EntityYaw(Camera), 0)		
	}
}

function DrawEnding() {
	
	ShowPointer()
	
	FPSfactor = 0
	if (EndingTimer>-2000) {
		EndingTimer=Max(EndingTimer-FPSfactor2,-1111)
	} else {
		EndingTimer=EndingTimer-FPSfactor2
	}
	
	GiveAchievement(Achv055)
	if (!UsedConsole) {GiveAchievement(AchvConsole)}
	if (SelectedDifficulty.name == "Keter") {GiveAchievement(AchvKeter)}
	let x,y,width,height, temp
	let itt: ItemTemplates, r: Rooms
	
	switch (Lower(SelectedEnding)) {
		case "b2", "a1":
			ClsColor(Max(255+(EndingTimer)*2.8,0), Max(255+(EndingTimer)*2.8,0), Max(255+(EndingTimer)*2.8,0))
		default:
			ClsColor(0,0,0)
	}
	
	ShouldPlay = 66
	
	Cls()
	
	if (EndingTimer<-200) {
		
		if (BreathCHN != 0) {
			if (ChannelPlaying(BreathCHN)) {
				StopChannel (BreathCHN)
				Stamina = 100
			}
		}
				
		if (EndingScreen == 0) {
			EndingScreen = LoadImage_Strict("GFX/endingscreen.pt")
			
			ShouldPlay = 23
			CurrMusicVolume = MusicVolume
			
			CurrMusicVolume = MusicVolume
			StopStream_Strict(MusicCHN)
			MusicCHN = StreamSound_Strict("SFX/Music/"+Music(23)+".ogg",CurrMusicVolume,0)
			NowPlaying = ShouldPlay
			
			PlaySound_Strict (LightSFX)
		}
		
		if (EndingTimer > -700) { 
			
			if (Rand(1,150)<Min((Abs(EndingTimer)-200),155)) {
				DrawImage (EndingScreen, GraphicWidth/2-400, GraphicHeight/2-400)
			} else {
				Color(0,0,0)
				Rect (100,100,GraphicWidth-200,GraphicHeight-200)
				Color(255,255,255)
			}
			
			if (EndingTimer+FPSfactor2 > -450 && EndingTimer <= -450) {
				switch (Lower(SelectedEnding)) {
					case "a1", "a2":
						PlaySound_Strict(LoadTempSound("SFX/Ending/GateA/Ending"+SelectedEnding+".ogg"))
					case "b1", "b2", "b3":
						PlaySound_Strict(LoadTempSound("SFX/Ending/GateB/Ending"+SelectedEnding+".ogg"))
				}
			}			
			
		} else {
			
			DrawImage (EndingScreen, GraphicWidth/2-400, GraphicHeight/2-400)
			
			if (EndingTimer < -1000 && EndingTimer > -2000) {
				
				width = ImageWidth(PauseMenuIMG)
				height = ImageHeight(PauseMenuIMG)
				x = GraphicWidth / 2 - width / 2
				y = GraphicHeight / 2 - height / 2
				
				DrawImage(PauseMenuIMG, x, y)
				
				Color(255, 255, 255)
				AASetFont(Font2)
				AAText(x + width / 2 + 40*MenuScale, y + 20*MenuScale, "THE END", True)
				AASetFont(Font1)
				
				if (AchievementsMenu=0) { 
					x = x+132*MenuScale
					y = y+122*MenuScale
					
					let roomamount = 0, roomsfound = 0
					for (r of Rooms.each) {
						roomamount = roomamount + 1
						roomsfound = roomsfound + r.found
					}
					
					let docamount=0, docsfound=0
					for (itt of ItemTemplates.each) {
						if (itt.tempname = "paper") {
							docamount=docamount+1
							docsfound=docsfound+itt.found
						}
					}
					
					let scpsEncountered = 1
					for (i of range(25)) {
						scpsEncountered = scpsEncountered+Achievements(i)
					}
					
					let achievementsUnlocked =0
					for (i of range(MAXACHIEVEMENTS)) {
						achievementsUnlocked = achievementsUnlocked + Achievements(i)
					}
					
					AAText(x, y, "SCPs encountered: " +scpsEncountered)
					AAText(x, y+20*MenuScale, "Achievements unlocked: " + achievementsUnlocked+"/"+(MAXACHIEVEMENTS))
					AAText(x, y+40*MenuScale, "Rooms found: " + roomsfound+"/"+roomamount)
					AAText(x, y+60*MenuScale, "Documents discovered: " +docsfound+"/"+docamount)
					AAText(x, y+80*MenuScale, "Items refined in SCP-914: " +RefinedItems			)
					
					x = GraphicWidth / 2 - width / 2
					y = GraphicHeight / 2 - height / 2
					x = x+width/2
					y = y+height-100*MenuScale
					
					if (DrawButton(x-145*MenuScale,y-200*MenuScale,390*MenuScale,60*MenuScale,"ACHIEVEMENTS", True)) {
						AchievementsMenu = 1
					}
										
					if (DrawButton(x-145*MenuScale,y-100*MenuScale,390*MenuScale,60*MenuScale,"MAIN MENU", True)) {
						ShouldPlay = 24
						NowPlaying = ShouldPlay
						for (i of range(10)) {
							if (TempSounds[i] != 0) {
								FreeSound_Strict (TempSounds[i])
								TempSounds[i]=0
							}
						}
						StopStream_Strict(MusicCHN)
						MusicCHN = StreamSound_Strict("SFX/Music/"+Music(NowPlaying)+".ogg",0.0,Mode)
						SetStreamVolume_Strict(MusicCHN,1.0*MusicVolume)
						FlushKeys()
						EndingTimer=-2000
						InitCredits()
					}
				} else {
					ShouldPlay = 23
					DrawMenu()
				}
			//Credits
			} else if (EndingTimer<=-2000) {
				ShouldPlay = 24
				DrawCredits()
			}
			
		}
		
	}
	
	if (Fullscreen) {DrawImage(CursorIMG, ScaledMouseX(),ScaledMouseY())}
	
	AASetFont (Font1)
}

class CreditsLine {
	txt: string
	id: int
	stay: int
}

var CreditsTimer: float = 0.0
var CreditsScreen: int

function InitCredits() {
	let cl: CreditsLine
	let file: int = OpenFile("Credits.txt")
	let l: string
	
	CreditsFont = LoadFont_Strict("GFX/font/cour/Courier New.ttf", Int(21 * (GraphicHeight / 1024.0)), 0,0,0)
	CreditsFont2 = LoadFont_Strict("GFX/font/courbd/Courier New.ttf", Int(35 * (GraphicHeight / 1024.0)), 0,0,0)
	
	if (CreditsScreen = 0) {
		CreditsScreen = LoadImage_Strict("GFX/creditsscreen.pt")
	}
	
	do {
		l = ReadLine(file)
		cl = new CreditsLine()
		cl.txt = l
 	} while (!Eof(file))
	
	Delete(CreditsLine.each[0])
	CreditsTimer = 0
	
}

function DrawCredits() {
    let credits_Y: float = (EndingTimer+2000)/2+(GraphicHeight+10)
    let cl: CreditsLine
    let id: int
    let endlinesamount: int
	let LastCreditLine: CreditsLine
	
    Cls()
	
	if (Rand(1,300)>1) {
		DrawImage(CreditsScreen, GraphicWidth/2-400, GraphicHeight/2-400)
	}
	
	id = 0
	endlinesamount = 0
	LastCreditLine = Null
	Color (255,255,255)
	for (cl of CreditsLine.each) {
		cl.id = id
		if (Left(cl.txt,1)="*") {
			SetFont (CreditsFont2)
			if (cl.stay=False) {
				Text(GraphicWidth/2,credits_Y+(24*cl.id*MenuScale),Right(cl.txt,Len(cl.txt)-1),True)
			}
		} else if (Left(cl.txt,1)="/") {
			LastCreditLine = Before(cl)
		} else {
			SetFont (CreditsFont)
			if (cl.stay=False) {
				Text(GraphicWidth/2,credits_Y+(24*cl.id*MenuScale),cl.txt,True)
			}
		}
		if (LastCreditLine != Null) {
			if (cl.id>LastCreditLine.id) {
				cl.stay = True
			}
		}
		if (cl.stay) {
			endlinesamount=endlinesamount+1
		}
		id=id+1
	}
	if ((credits_Y+(24*LastCreditLine.id*MenuScale))<-StringHeight(LastCreditLine.txt)) {
		CreditsTimer=CreditsTimer+(0.5*FPSfactor2)
		if (CreditsTimer>=0.0 && CreditsTimer<255.0) {
			Color(Max(Min(CreditsTimer,255),0),Max(Min(CreditsTimer,255),0),Max(Min(CreditsTimer,255),0))
		} else if (CreditsTimer>=255.0) {
			Color(255,255,255)
			if (CreditsTimer>500.0) {
				CreditsTimer=-255.0
			}
		} else {
			Color(Max(Min(-CreditsTimer,255),0),Max(Min(-CreditsTimer,255),0),Max(Min(-CreditsTimer,255),0))
			if (CreditsTimer>=-1.0) {
				CreditsTimer=-1.0
			}
		}
		DebugLog (CreditsTimer)
	}
	if (CreditsTimer != 0.0) {
		for (cl of CreditsLine.each) {
			if (cl.stay) {
				SetFont (CreditsFont)
				if (Left(cl.txt,1)="/") {
					Text (GraphicWidth/2,(GraphicHeight/2)+(endlinesamount/2)+(24*cl.id*MenuScale),Right(cl.txt,Len(cl.txt)-1),True)
				} else {
					Text (GraphicWidth/2,(GraphicHeight/2)+(24*(cl.id-LastCreditLine.id)*MenuScale)-((endlinesamount/2)*24*MenuScale),cl.txt,True)
				}
			}
		}
	}
	
	if (GetKey()) {CreditsTimer=-1}
	
	if (CreditsTimer == -1) {
		FreeFont(CreditsFont)
		FreeFont(CreditsFont2)
		FreeImage(CreditsScreen)
		CreditsScreen = 0
		FreeImage(EndingScreen)
		EndingScreen = 0
		Delete(CreditsLine.each)
        NullGame(False)
        StopStream_Strict(MusicCHN)
        ShouldPlay = 21
        MenuOpen = False
        MainMenuOpen = True
        MainMenuTab = 0
        CurrSave = ""
        FlushKeys()
	}
    
}

//--------------------------------------- player controls -------------------------------------------

function MovePlayer() {
	CatchErrors("Uncaught (MovePlayer)")
	let Sprint: float = 1.0, Speed: float = 0.018, i: int, angle: float
	
	if (SuperMan) {
		Speed = Speed * 3
		
		SuperManTimer=SuperManTimer+FPSfactor
		
		CameraShake = Sin(SuperManTimer / 5.0) * (SuperManTimer / 1500.0)
		
		if (SuperManTimer > 70 * 50) {
			DeathMSG = "A Class D jumpsuit found in [DATA REDACTED]. Upon further examination, the jumpsuit was found to be filled with 12.5 kilograms of blue ash-like substance. "
			DeathMSG = DeathMSG + "Chemical analysis of the substance remains non-conclusive. Most likely related to SCP-914."
			Kill()
			ShowEntity (Fog)
		} else {
			BlurTimer = 500		
			HideEntity (Fog)
		}
	}
	
	if (DeathTimer > 0) {
		DeathTimer=DeathTimer-FPSfactor
		if (DeathTimer < 1) {DeathTimer = -1.0}
	} else if (DeathTimer < 0 ) {
		Kill()
	}
	
	if (CurrSpeed > 0) {
        Stamina = Min(Stamina + 0.15 * FPSfactor/1.25, 100.0)
	} else {
        Stamina = Min(Stamina + 0.15 * FPSfactor*1.25, 100.0)
	}
	
	if (StaminaEffectTimer > 0) {
		StaminaEffectTimer = StaminaEffectTimer - (FPSfactor/70)
	} else if (StaminaEffect != 1.0) {
		StaminaEffect = 1.0
	}
	
	let temp: float
	
	if (PlayerRoom.RoomTemplate.Name != "pocketdimension") { 
		if (KeyDown(KEY_SPRINT)) {
			if (Stamina < 5) {
				temp = 0
				if (WearingGasMask>0 || Wearing1499>0) {temp=1}
				if (ChannelPlaying(BreathCHN)=False) {BreathCHN = PlaySound_Strict(BreathSFX((temp), 0))}
			} else if (Stamina < 50) {
				if (BreathCHN=0) {
					temp = 0
					if (WearingGasMask>0 || Wearing1499>0) {temp=1}
					BreathCHN = PlaySound_Strict(BreathSFX((temp), Rand(1,3)))
					ChannelVolume (BreathCHN, Min((70.0-Stamina)/70.0,1.0)*SFXVolume)
				} else {
					if (ChannelPlaying(BreathCHN)=False) {
						temp = 0
						if (WearingGasMask>0 || Wearing1499>0) {temp=1}
						BreathCHN = PlaySound_Strict(BreathSFX((temp), Rand(1,3)))
						ChannelVolume (BreathCHN, Min((70.0-Stamina)/70.0,1.0)*SFXVolume)
					}
				}
			}
		}
	}
	
	for (i of range(MaxItemAmount)) {
		if (Inventory(i) != Null) {
			if (Inventory(i).itemtemplate.tempname = "finevest") {Stamina = Min(Stamina, 60)}
		}
	}
	
	if (Wearing714) {
		Stamina = Min(Stamina, 10)
		Sanity = Max(-850, Sanity)
	}
	
	if (IsZombie) {Crouch = False}
	
	if (Abs(CrouchState-Crouch)<0.001) {
		CrouchState = Crouch
	} else {
		CrouchState = CurveValue(Crouch, CrouchState, 10.0)
	}
	
	if (!NoClip) { 
		if (((KeyDown(KEY_DOWN) || KeyDown(KEY_UP)) || (KeyDown(KEY_RIGHT) || KeyDown(KEY_LEFT)) && Playable) || ForceMove>0) {
			
			if (Crouch = 0 && (KeyDown(KEY_SPRINT)) && Stamina > 0.0 && (!IsZombie)) {
				Sprint = 2.5
				Stamina = Stamina - FPSfactor * 0.4 * StaminaEffect
				if (Stamina <= 0) {
					Stamina = -20.0
				}
			}
			
			if (PlayerRoom.RoomTemplate.Name = "pocketdimension") {
				if (EntityY(Collider)<2000*RoomScale || EntityY(Collider)>2608*RoomScale) {
					Stamina = 0
					Speed = 0.015
					Sprint = 1.0					
				}
			}	
			
			if (ForceMove>0) {Speed=Speed*ForceMove}
			
			if (SelectedItem != Null) {
				if (SelectedItem.itemtemplate.tempname == "firstaid" || SelectedItem.itemtemplate.tempname == "finefirstaid" || SelectedItem.itemtemplate.tempname == "firstaid2") { 
					Sprint = 0
				}
			}
			
			temp = (Shake % 360)
			let tempchn: int
			if (!UnableToMove) {Shake = (Shake + FPSfactor * Min(Sprint, 1.5) * 7) % 720}
			if (temp < 180 && (Shake % 360) >= 180 && KillTimer>=0) {
				if (CurrStepSFX == 0) {
					temp = GetStepSound(Collider)
					
					if (Sprint = 1.0) {
						PlayerSoundVolume = Max(4.0,PlayerSoundVolume)
						tempchn = PlaySound_Strict(StepSFX(temp, 0, Rand(0, 7)))
						ChannelVolume(tempchn, (1.0-(Crouch*0.6))*SFXVolume)
					} else {
						PlayerSoundVolume = Max(2.5-(Crouch*0.6),PlayerSoundVolume)
						tempchn = PlaySound_Strict(StepSFX(temp, 1, Rand(0, 7)))
						ChannelVolume(tempchn, (1.0-(Crouch*0.6))*SFXVolume)
					}
				} else if (CurrStepSFX == 1) {
					tempchn = PlaySound_Strict(Step2SFX(Rand(0, 2)))
					ChannelVolume(tempchn, (1.0-(Crouch*0.4))*SFXVolume)
				} else if (CurrStepSFX == 2) {
					tempchn = PlaySound_Strict(Step2SFX(Rand(3,5)))
					ChannelVolume(tempchn, (1.0-(Crouch*0.4))*SFXVolume)
				} else if (CurrStepSFX == 3) {
					if (Sprint == 1.0) {
						PlayerSoundVolume = Max(4.0,PlayerSoundVolume)
						tempchn = PlaySound_Strict(StepSFX(0, 0, Rand(0, 7)))
						ChannelVolume(tempchn, (1.0-(Crouch*0.6))*SFXVolume)
					} else {
						PlayerSoundVolume = Max(2.5-(Crouch*0.6),PlayerSoundVolume)
						tempchn = PlaySound_Strict(StepSFX(0, 1, Rand(0, 7)))
						ChannelVolume(tempchn, (1.0-(Crouch*0.6))*SFXVolume)
					}
				}
				
			}	
		}
	} else { //noclip on
		if (KeyDown(KEY_SPRINT)) { 
			Sprint = 2.5
		} else if (KeyDown(KEY_CROUCH)) {
			Sprint = 0.5
		}
	}
	
	if (KeyHit(KEY_CROUCH) && Playable) {Crouch = !Crouch}
	
	let temp2: float = (Speed * Sprint) / (1.0+CrouchState)
	
	if (NoClip) {
		Shake = 0
		CurrSpeed = 0
		CrouchState = 0
		Crouch = 0
		
		RotateEntity (Collider, WrapAngle(EntityPitch(Camera)), WrapAngle(EntityYaw(Camera)), 0)
		
		temp2 = temp2 * NoClipSpeed
		
		if (KeyDown(KEY_DOWN)) {MoveEntity(Collider, 0, 0, -temp2*FPSfactor)}
		if (KeyDown(KEY_UP)) {MoveEntity(Collider, 0, 0, temp2*FPSfactor)}
		
		if (KeyDown(KEY_LEFT)) {MoveEntity(Collider, -temp2*FPSfactor, 0, 0)}
		if (KeyDown(KEY_RIGHT)) {MoveEntity(Collider, temp2*FPSfactor, 0, 0	)}
		
		ResetEntity (Collider)
	} else {
		temp2 = temp2 / Max((Injuries+3.0)/3.0,1.0)
		if (Injuries > 0.5) {
			temp2 = temp2*Min((Sin(Shake/2)+1.2),1.0)
		}
		
		temp = False
		if (!IsZombie) {
			if (KeyDown(KEY_DOWN) && Playable) {
				temp = True 
				angle = 180
				if (KeyDown(KEY_LEFT)) {angle = 135}
				if (KeyDown(KEY_RIGHT)) {angle = -135}
			} else if (KeyDown(KEY_UP) && Playable) {
				temp = True
				angle = 0
				if (KeyDown(KEY_LEFT)) {angle = 45}
				if (KeyDown(KEY_RIGHT)) {angle = -45}
			} else if (ForceMove>0) {
				temp=True
				angle = ForceAngle
			 } else if (Playable) {
				if (KeyDown(KEY_LEFT)) {
					angle = 90
					temp = True
				}
				if (KeyDown(KEY_RIGHT)) {
					angle = -90
					temp = True 
				}
			}
		} else {
			temp=True
			angle = ForceAngle
		}
		
		angle = WrapAngle(EntityYaw(Collider,True)+angle+90.0)
		
		if (temp) {
			CurrSpeed = CurveValue(temp2, CurrSpeed, 20.0)
		} else {
			CurrSpeed = Max(CurveValue(0.0, CurrSpeed-0.1, 1.0),0.0)
		}
		
		if (!UnableToMove) {
			TranslateEntity (Collider, Cos(angle)*CurrSpeed * FPSfactor, 0, Sin(angle)*CurrSpeed * FPSfactor, True)
		}
		
		let CollidedFloor: boolean = False
		for (i of range(1, CountCollisions(Collider) + 1)) {
			if (CollisionY(Collider, i) < EntityY(Collider) - 0.25) {CollidedFloor = True}
		}
		
		if (CollidedFloor) {
			if (DropSpeed < - 0.07) { 
				if (CurrStepSFX=0) {
					PlaySound_Strict(StepSFX(GetStepSound(Collider), 0, Rand(0, 7)))
				} else if (CurrStepSFX == 1) {
					PlaySound_Strict(Step2SFX(Rand(0, 2)))
				} else if (CurrStepSFX == 2) {
					PlaySound_Strict(Step2SFX(Rand(3, 5)))
				} else if (CurrStepSFX == 3) {
					PlaySound_Strict(StepSFX(0, 0, Rand(0, 7)))
				}
				PlayerSoundVolume = Max(3.0,PlayerSoundVolume)
			}
			DropSpeed = 0
		} else {
			if (PlayerFallingPickDistance != 0.0) {
				let pick = LinePick(EntityX(Collider),EntityY(Collider),EntityZ(Collider),0,-PlayerFallingPickDistance,0)
				if (pick) {
					DropSpeed = Min(Max(DropSpeed - 0.006 * FPSfactor, -2.0), 0.0)
				} else {
					DropSpeed = 0
				}
			} else {
				DropSpeed = Min(Max(DropSpeed - 0.006 * FPSfactor, -2.0), 0.0)
			}
		}
		PlayerFallingPickDistance = 10.0
		
		if ((!UnableToMove) && ShouldEntitiesFall) {TranslateEntity (Collider, 0, DropSpeed * FPSfactor, 0)}
	}
	
	ForceMove = False
	
	if (Injuries > 1.0) {
		temp2 = Bloodloss
		BlurTimer = Max(Max(Sin(MilliSecs2()/100.0)*Bloodloss*30.0,Bloodloss*2*(2.0-CrouchState)),BlurTimer)
		if (!I_427.Using && I_427.Timer < 70*360) {
			Bloodloss = Min(Bloodloss + (Min(Injuries,3.5)/300.0)*FPSfactor,100)
		}
		
		if (temp2 <= 60 && Bloodloss > 60) {
			Msg = "You are feeling faint from the amount of blood you have lost."
			MsgTimer = 70*4
		}
	}
	
	UpdateInfect()
	
	if (Bloodloss > 0) {
		if (Rnd(200)<Min(Injuries,4.0)) {
			pvt = CreatePivot()
			PositionEntity (pvt, EntityX(Collider)+Rnd(-0.05,0.05),EntityY(Collider)-0.05,EntityZ(Collider)+Rnd(-0.05,0.05))
			TurnEntity (pvt, 90, 0, 0)
			EntityPick(pvt,0.3)
			de.decals = CreateDecal(Rand(15,16), PickedX(), PickedY()+0.005, PickedZ(), 90, Rand(360), 0)
			de.size = Rnd(0.03,0.08)*Min(Injuries,3.0)
			EntityAlpha(de.obj, 1.0)
			ScaleSprite (de.obj, de.size, de.size)
			tempchn = PlaySound_Strict (DripSFX(Rand(0,2)))
			ChannelVolume (tempchn, Rnd(0.0,0.8)*SFXVolume)
			ChannelPitch (tempchn, Rand(20000,30000))
			
			FreeEntity (pvt)
		}
		
		CurrCameraZoom = Max(CurrCameraZoom, (Sin(Float(MilliSecs2())/20.0)+1.0)*Bloodloss*0.2)
		
		if (Bloodloss > 60) {Crouch = True}
		if (Bloodloss => 100) { 
			Kill()
			HeartBeatVolume = 0.0
		} else if (Bloodloss > 80.0) {
			HeartBeatRate = Max(150-(Bloodloss-80)*5,HeartBeatRate)
			HeartBeatVolume = Max(HeartBeatVolume, 0.75+(Bloodloss-80.0)*0.0125)	
		} else if (Bloodloss > 35.0) {
			HeartBeatRate = Max(70+Bloodloss,HeartBeatRate)
			HeartBeatVolume = Max(HeartBeatVolume, (Bloodloss-35.0)/60.0)			
		}
	}
	
	if (HealTimer > 0) {
		DebugLog (HealTimer)
		HealTimer = HealTimer - (FPSfactor / 70)
		Bloodloss = Min(Bloodloss + (2 / 400.0) * FPSfactor, 100)
		Injuries = Max(Injuries - (FPSfactor / 70) / 30, 0.0)
	}
		
	if (Playable) {
		if (KeyHit(KEY_BLINK)) {BlinkTimer = 0}
		if (KeyDown(KEY_BLINK) && BlinkTimer < - 10) {BlinkTimer = -10}
	}
	
	
	if (HeartBeatVolume > 0) {
		if (HeartBeatTimer <= 0) {
			tempchn = PlaySound_Strict (HeartBeatSFX)
			ChannelVolume (tempchn, HeartBeatVolume*SFXVolume)
			
			HeartBeatTimer = 70.0*(60.0/Max(HeartBeatRate,1.0))
		} else {
			HeartBeatTimer = HeartBeatTimer - FPSfactor
		}
		
		HeartBeatVolume = Max(HeartBeatVolume - FPSfactor*0.05, 0)
	}
	
	CatchErrors("MovePlayer")
}

function MouseLook() {
	let i: int
	
	CameraShake = Max(CameraShake - (FPSfactor / 10), 0)
	
	CameraZoom(Camera, Min(1.0+(CurrCameraZoom/400.0),1.1))
	CurrCameraZoom = Max(CurrCameraZoom - FPSfactor, 0)
	
	if (KillTimer >= 0 && FallTimer >=0) {
		
		HeadDropSpeed = 0
		
		//fixing the black screen bug with some bubblegum code 
		let Zero: float = 0.0
		let Nan1: float = 0.0 / Zero
		if (Int(EntityX(Collider))=Int(Nan1)) {
			
			PositionEntity (Collider, EntityX(Camera, True), EntityY(Camera, True) - 0.5, EntityZ(Camera, True), True)
			Msg = "EntityX(Collider) = NaN, RESETTING COORDINATES    -    New coordinates: "+EntityX(Collider)
			MsgTimer = 300				
		}
		//EndIf
		
		let up: float = (Sin(Shake) / (20.0+CrouchState*20.0))*0.6//, side# = Cos(Shake / 2.0) / 35.0		
		let roll: float = Max(Min(Sin(Shake/2)*2.5*Min(Injuries+0.25,3.0),8.0),-8.0)
		
		//käännetään kameraa sivulle jos pelaaja on vammautunut
		PositionEntity (Camera, EntityX(Collider), EntityY(Collider), EntityZ(Collider))
		RotateEntity (Camera, 0, EntityYaw(Collider), roll*0.5)
		
		MoveEntity (Camera, side, up + 0.6 + CrouchState * -0.3, 0)
		
		//moveentity player, side, up, 0	
		// -- Update the smoothing que To smooth the movement of the mouse.
		mouse_x_speed_1 = CurveValue(MouseXSpeed() * (MouseSens + 0.6) , mouse_x_speed_1, (6.0 / (MouseSens + 1.0))*MouseSmooth) 
		if (Int(mouse_x_speed_1) = Int(Nan1)) {mouse_x_speed_1 = 0}
		if (PrevFPSFactor>0) {
            if (Abs(FPSfactor/PrevFPSFactor-1.0)>1.0) {
                //lag spike detected - stop all camera movement
                mouse_x_speed_1 = 0.0
                mouse_y_speed_1 = 0.0
			}
		}
		if (InvertMouse) {
			mouse_y_speed_1 = CurveValue(-MouseYSpeed() * (MouseSens + 0.6), mouse_y_speed_1, (6.0/(MouseSens+1.0))*MouseSmooth) 
		} else {
			mouse_y_speed_1 = CurveValue(MouseYSpeed () * (MouseSens + 0.6), mouse_y_speed_1, (6.0/(MouseSens+1.0))*MouseSmooth) 
		}

		if (Int(mouse_y_speed_1) == Int(Nan1)) {mouse_y_speed_1 = 0}
		
		let the_yaw: float = ((mouse_x_speed_1)) * mouselook_x_inc / (1.0+WearingVest)
		let the_pitch: float = ((mouse_y_speed_1)) * mouselook_y_inc / (1.0+WearingVest)
		
		TurnEntity (Collider, 0.0, -the_yaw, 0.0) // Turn the user on the Y (yaw) axis.
		user_camera_pitch = user_camera_pitch + the_pitch
		// -- Limit the user//s camera To within 180 degrees of pitch rotation. //EntityPitch()// returns useless values so we need To use a variable To keep track of the camera pitch.
		if (user_camera_pitch > 70.0) {user_camera_pitch = 70.0}
		if (user_camera_pitch < - 70.0) {user_camera_pitch = -70.0}
		
		RotateEntity (Camera, WrapAngle(user_camera_pitch + Rnd(-CameraShake, CameraShake)), WrapAngle(EntityYaw(Collider) + Rnd(-CameraShake, CameraShake)), roll) // Pitch the user//s camera up && down.)
		
		if (PlayerRoom.RoomTemplate.Name == "pocketdimension") {
			if (EntityY(Collider)<2000*RoomScale || EntityY(Collider)>2608*RoomScale) {
				RotateEntity (Camera, WrapAngle(EntityPitch(Camera)),WrapAngle(EntityYaw(Camera)), roll+WrapAngle(Sin(MilliSecs2()/150.0)*30.0)) // Pitch the user//s camera up && down.
			}
		}
		
	} else { 
		HideEntity(Collider)
		PositionEntity(Camera, EntityX(Head), EntityY(Head), EntityZ(Head))
		
		let CollidedFloor: boolean = False
		for (i of range(1, CountCollisions(Head) + 1)) {
			if (CollisionY(Head, i) < EntityY(Head) - 0.01) {CollidedFloor = True}
		}
		
		if (CollidedFloor) {
			HeadDropSpeed = 0
		} else {
			
			if (KillAnim = 0) {
				MoveEntity (Head, 0, 0, HeadDropSpeed)
				RotateEntity(Head, CurveAngle(-90.0, EntityPitch(Head), 20.0), EntityYaw(Head), EntityRoll(Head))
				RotateEntity(Camera, CurveAngle(EntityPitch(Head) - 40.0, EntityPitch(Camera), 40.0), EntityYaw(Camera), EntityRoll(Camera))
			} else {
				MoveEntity (Head, 0, 0, -HeadDropSpeed)
				RotateEntity(Head, CurveAngle(90.0, EntityPitch(Head), 20.0), EntityYaw(Head), EntityRoll(Head))
				RotateEntity(Camera, CurveAngle(EntityPitch(Head) + 40.0, EntityPitch(Camera), 40.0), EntityYaw(Camera), EntityRoll(Camera))
			}
			
			HeadDropSpeed = HeadDropSpeed - 0.002 * FPSfactor
		}
		
		if (InvertMouse) {
			TurnEntity (Camera, -MouseYSpeed() * 0.05 * FPSfactor, -MouseXSpeed() * 0.15 * FPSfactor, 0)
		} else {
			TurnEntity (Camera, MouseYSpeed() * 0.05 * FPSfactor, -MouseXSpeed() * 0.15 * FPSfactor, 0)
		}
		
	}
	
	//pölyhiukkasia
	if (ParticleAmount=2) {
		if (Rand(35) = 1) {
			let pvt: int = CreatePivot()
			PositionEntity(pvt, EntityX(Camera, True), EntityY(Camera, True), EntityZ(Camera, True))
			RotateEntity(pvt, 0, Rnd(360), 0)
			if (Rand(2) = 1) {
				MoveEntity(pvt, 0, Rnd(-0.5, 0.5), Rnd(0.5, 1.0))
			} else {
				MoveEntity(pvt, 0, Rnd(-0.5, 0.5), Rnd(0.5, 1.0))
			}
			
			let p: Particles = CreateParticle(EntityX(pvt), EntityY(pvt), EntityZ(pvt), 2, 0.002, 0, 300)
			p.speed = 0.001
			RotateEntity(p.pvt, Rnd(-20, 20), Rnd(360), 0)
			
			p.SizeChange = -0.00001
			
			FreeEntity (pvt)
		}
	}
	
	// -- Limit the mouse//s movement. Using this method produces smoother mouselook movement than centering the mouse Each loop.
	if ((MouseX() > mouse_right_limit) || (MouseX() < mouse_left_limit) || (MouseY() > mouse_bottom_limit) || (MouseY() < mouse_top_limit)) {
		MoveMouse (viewport_center_x, viewport_center_y)
	}
	
	if (WearingGasMask || WearingHazmat || Wearing1499) {
		if (!Wearing714) {
			if (WearingGasMask == 2 || Wearing1499 == 2 || WearingHazmat == 2) {
				Stamina = Min(100, Stamina + (100.0-Stamina)*0.01*FPSfactor)
			}
		}
		if (WearingHazmat = 1) {
			Stamina = Min(60, Stamina)
		}
		
		ShowEntity(GasMaskOverlay)
	} else {
		HideEntity(GasMaskOverlay)
	}
	
	if (WearingNightVision != 0) { //Not WearingNightVision=0
		ShowEntity(NVOverlay)
		if (WearingNightVision=2) {
			EntityColor(NVOverlay, 0,100,255)
			AmbientLightRooms(15)
		} else if (WearingNightVision=3) {
			EntityColor(NVOverlay, 255,0,0)
			AmbientLightRooms(15)
		} else {
			EntityColor(NVOverlay, 0,255,0)
			AmbientLightRooms(15)
		}
		EntityTexture(Fog, FogNVTexture)
	} else {
		AmbientLightRooms(0)
		HideEntity(NVOverlay)
		EntityTexture(Fog, FogTexture)
	}
	
	for (i of range(6)) {
		if (SCP1025state[i]>0) {
			switch (i) {
				case 0: //common cold:
					if (FPSfactor>0) { 
						if (Rand(1000) == 1) {
							if (CoughCHN == 0) {
								CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))
							} else {
								if (!ChannelPlaying(CoughCHN)) {CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))}
							}
						}
					}
					Stamina = Stamina - FPSfactor * 0.3
				case 1: //chicken pox:
					if (Rand(9000) == 1 && Msg == "") {
						Msg="Your skin is feeling itchy."
						MsgTimer =70*4
					}
				case 2: //cancer of the lungs:
					if (FPSfactor>0) {
						if (Rand(800)=1) {
							if (CoughCHN = 0) {
								CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))
							} else {
								if (!ChannelPlaying(CoughCHN)) {CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))}
							}
						}
					}
					Stamina = Stamina - FPSfactor * 0.1
				case 3: //appendicitis:
					//0.035/sec = 2.1/min
					if (!I_427.Using && I_427.Timer < 70*360) {
						SCP1025state[i]=SCP1025state[i]+FPSfactor*0.0005
					}
					if (SCP1025state[i]>20.0) {
						if (SCP1025state[i]-FPSfactor<=20.0) {Msg="The pain in your stomach is becoming unbearable."}
						Stamina = Stamina - FPSfactor * 0.3
					} else if (SCP1025state[i]>10.0) {
						if (SCP1025state[i]-FPSfactor<=10.0) {Msg="Your stomach is aching."}
					}
				case 4: //asthma:
					if (Stamina < 35) {
						if (Rand(Int(140+Stamina*8))=1) {
							if (CoughCHN == 0) {
								CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))
							} else {
								if (!ChannelPlaying(CoughCHN)) {CoughCHN = PlaySound_Strict(CoughSFX(Rand(0, 2)))}
							}
						}
						CurrSpeed = CurveValue(0, CurrSpeed, 10+Stamina*15)
					}
				case 5://cardiac arrest:
					if (!I_427.Using && I_427.Timer < 70*360) {
						SCP1025state[i]=SCP1025state[i]+FPSfactor*0.35
					}
					//35/sec
					if (SCP1025state[i]>110) {
						HeartBeatRate=0
						BlurTimer = Max(BlurTimer, 500)
						if (SCP1025state[i]>140) {
							DeathMSG = Chr(34)+"He died of a cardiac arrest after reading SCP-1025, that's for sure. Is there such a thing as psychosomatic cardiac arrest, or does SCP-1025 have some "
							DeathMSG = DeathMSG + "anomalous properties we are not yet aware of?"+Chr(34)
							Kill()
						}
					} else {
						HeartBeatRate=Max(HeartBeatRate, 70+SCP1025state[i])
						HeartBeatVolume = 1.0
					}
			}
		}
	}
	
	
}

//--------------------------------------- GUI, menu etc ------------------------------------------------

function DrawGUI() {
	CatchErrors("Uncaught (DrawGUI)")
	
	let temp: int
	let x: int
	let y: int
	let z: int
	let i: int
	let yawvalue: float
	let pitchvalue: float
	let x2: float
	let y2: float
	let z2: float
	let n: int
	let xtemp
	let ytemp
	let strtemp: string
	
	let e: Events
	let it: Items
	
	if (MenuOpen || ConsoleOpen || SelectedDoor != Null || InvOpen || OtherOpen != Null || EndingTimer < 0) {
		ShowPointer()
	} else {
		HidePointer()
	}
	
	if (PlayerRoom.RoomTemplate.Name == "pocketdimension") {
		for (e of Events.each) {
			if (e.room == PlayerRoom) {
				if (Float(e.EventStr)<1000.0) {
					if (e.EventState > 600) {
						if (BlinkTimer < -3 && BlinkTimer > -10) {
							if (e.img = 0) {
								if (BlinkTimer > -5 && Rand(30) == 1) {
									PlaySound_Strict (DripSFX(0))
									if (e.img == 0) {
										e.img = LoadImage_Strict("GFX/npcs/106face.jpg")
									}
								}
							} else {
								DrawImage(e.img, GraphicWidth/2-Rand(390,310), GraphicHeight/2-Rand(290,310))
							}
						} else {
							if (e.img != 0) {
								FreeImage (e.img)
								e.img = 0
							}
						}
							
						Exit()
					}
				} else {
					if (BlinkTimer < -3 && BlinkTimer > -10) {
						if (e.img == 0) {
							if (BlinkTimer > -5) {
								if (e.img == 0) {
									e.img = LoadImage_Strict("GFX/kneelmortal.pd")
									if (ChannelPlaying(e.SoundCHN)) {
										StopChannel(e.SoundCHN)
									}
									e.SoundCHN = PlaySound_Strict(e.Sound)
								}
							}
						} else {
							DrawImage(e.img, GraphicWidth/2-Rand(390,310), GraphicHeight/2-Rand(290,310))
						}
					} else {
						if (e.img != 0) {
							FreeImage(e.img)
							e.img = 0
						}
						if (BlinkTimer < -3) {
							if (!ChannelPlaying(e.SoundCHN)) {
								e.SoundCHN = PlaySound_Strict(e.Sound)
							}
						} else {
							if (ChannelPlaying(e.SoundCHN)) {
								StopChannel(e.SoundCHN)
							}
						}
					}
					
					Exit()
				}
			}
		}
	}
	
	if (ClosestButton != 0 && SelectedDoor == Null && InvOpen == False && MenuOpen == False && OtherOpen == Null) {
		temp = CreatePivot()
		PositionEntity(temp, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
		PointEntity(temp, ClosestButton)
		yawvalue = WrapAngle(EntityYaw(Camera) - EntityYaw(temp))
		if (yawvalue > 90 && yawvalue <= 180) {yawvalue = 90}
		if (yawvalue > 180 && yawvalue < 270) {yawvalue = 270}
		pitchvalue = WrapAngle(EntityPitch(Camera) - EntityPitch(temp))
		if (pitchvalue > 90 && pitchvalue <= 180) {pitchvalue = 90}
		if (pitchvalue > 180 && pitchvalue < 270) {pitchvalue = 270}
		
		FreeEntity (temp)
		
		DrawImage(HandIcon, GraphicWidth / 2 + Sin(yawvalue) * (GraphicWidth / 3) - 32, GraphicHeight / 2 - Sin(pitchvalue) * (GraphicHeight / 3) - 32)
		
		if (MouseUp1) {
			MouseUp1 = False
			if (ClosestDoor != Null) { 
				if (ClosestDoor.Code != "") {
					SelectedDoor = ClosestDoor
				} else if (Playable) {
					PlaySound2(ButtonSFX, Camera, ClosestButton)
					UseDoor(ClosestDoor,True)				
				}
			}
		}
	}
	
	if (ClosestItem != Null) {
		yawvalue = -DeltaYaw(Camera, ClosestItem.collider)
		if (yawvalue > 90 && yawvalue <= 180) {yawvalue = 90}
		if (yawvalue > 180 && yawvalue < 270) {yawvalue = 270}
		pitchvalue = -DeltaPitch(Camera, ClosestItem.collider)
		if (pitchvalue > 90 && pitchvalue <= 180) {pitchvalue = 90}
		if (pitchvalue > 180 && pitchvalue < 270) {pitchvalue = 270}
		
		DrawImage(HandIcon2, GraphicWidth / 2 + Sin(yawvalue) * (GraphicWidth / 3) - 32, GraphicHeight / 2 - Sin(pitchvalue) * (GraphicHeight / 3) - 32)
	}
	
	if (DrawHandIcon) {DrawImage(HandIcon, GraphicWidth / 2 - 32, GraphicHeight / 2 - 32)}
	for (i of range(4)) {
		if (DrawArrowIcon(i)) {
			x = GraphicWidth / 2 - 32
			y = GraphicHeight / 2 - 32		
			switch (i) {
				case 0:
					y = y - 64 - 5
				case 1:
					x = x + 64 + 5
				case 2:
					y = y + 64 + 5
				case 3:
					x = x - 5 - 64
			}
			DrawImage(HandIcon, x, y)
			Color (0, 0, 0)
			Rect(x + 4, y + 4, 64 - 8, 64 - 8)
			DrawImage(ArrowIMG(i), x + 21, y + 21)
			DrawArrowIcon(i) = False
		}
	}
	
	if (Using294) {Use294()}
	
	if (HUDenabled) {
		
		let width: int = 204, height: int = 20
		x = 80
		y = GraphicHeight - 95
		
		Color (255, 255, 255)
		Rect (x, y, width, height, False)
		for (i of range(1, Int(((width - 2) * (BlinkTimer / (BLINKFREQ))) / 10) + 1)) {
			DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
		}	
		Color (0, 0, 0)
		Rect(x - 50, y, 30, 30)
		
		if (EyeIrritation > 0) {
			Color (200, 0, 0)
			Rect(x - 50 - 3, y - 3, 30 + 6, 30 + 6)
		}
		
		Color (255, 255, 255)
		Rect(x - 50 - 1, y - 1, 30 + 2, 30 + 2, False)
		
		DrawImage (BlinkIcon, x - 50, y)
		
		y = GraphicHeight - 55
		Color (255, 255, 255)
		Rect (x, y, width, height, False)
		for (i of range(1, Int(((width - 2) * (Stamina / 100.0)) / 10) + 1)) {
			DrawImage(StaminaMeterIMG, x + 3 + 10 * (i - 1), y + 3)
		}
		
		Color (0, 0, 0)
		Rect(x - 50, y, 30, 30)
		
		Color (255, 255, 255)
		Rect(x - 50 - 1, y - 1, 30 + 2, 30 + 2, False)
		if (Crouch) {
			DrawImage(CrouchIcon, x - 50, y)
		} else {
			DrawImage(SprintIcon, x - 50, y)
		}
		
		if (DebugHUD) {
			Color (255, 255, 255)
			AASetFont (ConsoleFont)
			
			AAText(x - 50, 50, "Player Position: (" + f2s(EntityX(Collider), 3) + ", " + f2s(EntityY(Collider), 3) + ", " + f2s(EntityZ(Collider), 3) + ")")
			AAText(x - 50, 70, "Camera Position: (" + f2s(EntityX(Camera), 3)+ ", " + f2s(EntityY(Camera), 3) +", " + f2s(EntityZ(Camera), 3) + ")")
			AAText(x - 50, 100, "Player Rotation: (" + f2s(EntityPitch(Collider), 3) + ", " + f2s(EntityYaw(Collider), 3) + ", " + f2s(EntityRoll(Collider), 3) + ")")
			AAText(x - 50, 120, "Camera Rotation: (" + f2s(EntityPitch(Camera), 3)+ ", " + f2s(EntityYaw(Camera), 3) +", " + f2s(EntityRoll(Camera), 3) + ")")
			AAText(x - 50, 150, "Room: " + PlayerRoom.RoomTemplate.Name)
			for (ev of Events.each) {
				if (ev.room = PlayerRoom) {
					AAText(x - 50, 170, "Room event: " + ev.EventName   )
					AAText(x - 50, 190, "state: " + ev.EventState)
					AAText(x - 50, 210, "state2: " + ev.EventState2   )
					AAText(x - 50, 230, "state3: " + ev.EventState3)
					AAText(x - 50, 250, "str: "+ ev.EventStr)
					Exit()
				}
			}
			AAText(x - 50, 280, "Room coordinates: (" + Floor(EntityX(PlayerRoom.obj) / 8.0 + 0.5) + ", " + Floor(EntityZ(PlayerRoom.obj) / 8.0 + 0.5) + ", angle: "+PlayerRoom.angle + ")")
			AAText(x - 50, 300, "Stamina: " + f2s(Stamina, 3))
			AAText(x - 50, 320, "Death timer: " + f2s(KillTimer, 3)               )
			AAText(x - 50, 340, "Blink timer: " + f2s(BlinkTimer, 3))
			AAText(x - 50, 360, "Injuries: " + Injuries)
			AAText(x - 50, 380, "Bloodloss: " + Bloodloss)
			if (Curr173 != Null) {
				AAText(x - 50, 410, "SCP - 173 Position (collider): (" + f2s(EntityX(Curr173.Collider), 3) + ", " + f2s(EntityY(Curr173.Collider), 3) + ", " + f2s(EntityZ(Curr173.Collider), 3) + ")")
				AAText(x - 50, 430, "SCP - 173 Position (obj): (" + f2s(EntityX(Curr173.obj), 3) + ", " + f2s(EntityY(Curr173.obj), 3) + ", " + f2s(EntityZ(Curr173.obj), 3) + ")")
				AAText(x - 50, 450, "SCP - 173 State: " + Curr173.State)
			}
			if (Curr106 != Null) {
				AAText(x - 50, 470, "SCP - 106 Position: (" + f2s(EntityX(Curr106.obj), 3) + ", " + f2s(EntityY(Curr106.obj), 3) + ", " + f2s(EntityZ(Curr106.obj), 3) + ")")
				AAText(x - 50, 490, "SCP - 106 Idle: " + Curr106.Idle)
				AAText(x - 50, 510, "SCP - 106 State: " + Curr106.State)
			}
			offset = 0
			for (npc of NPCs.each) {
				if (npc.NPCtype = NPCtype096) {
					AAText(x - 50, 530, "SCP - 096 Position: (" + f2s(EntityX(npc.obj), 3) + ", " + f2s(EntityY(npc.obj), 3) + ", " + f2s(EntityZ(npc.obj), 3) + ")")
					AAText(x - 50, 550, "SCP - 096 Idle: " + npc.Idle)
					AAText(x - 50, 570, "SCP - 096 State: " + npc.State)
					AAText(x - 50, 590, "SCP - 096 Speed: " + f2s(npc.currspeed, 5))
				}
				if (npc.NPCtype = NPCtypeMTF) {
					AAText(x - 50, 620 + 60 * offset, "MTF " + offset + " Position: (" + f2s(EntityX(npc.obj), 3) + ", " + f2s(EntityY(npc.obj), 3) + ", " + f2s(EntityZ(npc.obj), 3) + ")")
					AAText(x - 50, 640 + 60 * offset, "MTF " + offset + " State: " + npc.State)
					AAText(x - 50, 660 + 60 * offset, "MTF " + offset + " LastSeen: " + npc.lastseen					)
					offset = offset + 1
				}
			}
			if (PlayerRoom.RoomTemplate.Name$ = "dimension1499") {
				AAText (x + 350, 50, "Current Chunk X/Z: ("+(Int((EntityX(Collider)+20)/40))+", "+(Int((EntityZ(Collider)+20)/40))+")")
				let CH_Amount: int = 0
				for (ch of Chunk.each) {
					CH_Amount = CH_Amount + 1
				}
				AAText(x + 350, 70, "Current Chunk Amount: "+CH_Amount)
			} else {
				AAText(x + 350, 50, "Current Room Position: ("+PlayerRoom.x+", "+PlayerRoom.y+", "+PlayerRoom.z+")")
			}
			GlobalMemoryStatus(m.MEMORYSTATUS)
			AAText(x + 350, 90, (m.dwAvailPhys/1024/1024)+" MB/"+(m.dwTotalPhys%/1024/1024)+" MB ("+(m.dwAvailPhys/1024)+" KB/"+(m.dwTotalPhys/1024)+" KB)")
			AAText(x + 350, 110, "Triangles rendered: "+CurrTrisAmount)
			AAText(x + 350, 130, "Active textures: "+ActiveTextures())
			AAText(x + 350, 150, "SCP-427 state (secs): "+Int(I_427.Timer/70.0))
			AAText(x + 350, 170, "SCP-008 infection: "+Infect)
			for (i of range(6)) {
				AAText(x + 350, 190+(20*i), "SCP-1025 State "+i+": "+SCP1025state[i])
			}
			if (SelectedMonitor != Null) {
				AAText(x + 350, 310, "Current monitor: "+SelectedMonitor.ScrObj)
			} else {
				AAText(x + 350, 310, "Current monitor: NULL")
			}
			
			AASetFont (Font1)
		}
		
	}
	
	if (SelectedScreen != Null) {
		DrawImage (SelectedScreen.img, GraphicWidth/2-ImageWidth(SelectedScreen.img)/2,GraphicHeight/2-ImageHeight(SelectedScreen.img)/2)
		
		if (MouseUp1 || MouseHit2) {
			FreeImage (SelectedScreen.img)
			SelectedScreen.img = 0
			SelectedScreen = Null
			MouseUp1 = False
		}
	}
	
	let PrevInvOpen: int = InvOpen
	let MouseSlot: int = 66
	
	let shouldDrawHUD: boolean = True
	if (SelectedDoor != Null) {
		SelectedItem = Null
		
		if (shouldDrawHUD) {
			pvt = CreatePivot()
			PositionEntity (pvt, EntityX(ClosestButton,True),EntityY(ClosestButton,True),EntityZ(ClosestButton,True))
			RotateEntity (pvt, 0, EntityYaw(ClosestButton,True)-180,0)
			MoveEntity (pvt, 0,0,0.22)
			PositionEntity (Camera, EntityX(pvt),EntityY(pvt),EntityZ(pvt))
			PointEntity (Camera, ClosestButton)
			FreeEntity (pvt)	
			
			CameraProject(Camera, EntityX(ClosestButton,True),EntityY(ClosestButton,True)+MeshHeight(ButtonOBJ)*0.015,EntityZ(ClosestButton,True))
			projY = ProjectedY()
			CameraProject(Camera, EntityX(ClosestButton,True),EntityY(ClosestButton,True)-MeshHeight(ButtonOBJ)*0.015,EntityZ(ClosestButton,True))
			scale = (ProjectedY()-projy)/462.0
			
			x = GraphicWidth/2-ImageWidth(KeypadHUD)*scale/2
			y = GraphicHeight/2-ImageHeight(KeypadHUD)*scale/2		
			
			AASetFont (Font3)
			if (KeypadMSG != "") {
				KeypadTimer = KeypadTimer-FPSfactor2
				
				if ((KeypadTimer % 70) < 35) {AAText (GraphicWidth/2, y+124*scale, KeypadMSG, True,True)}
				if (KeypadTimer <= 0) {
					KeypadMSG = ""
					SelectedDoor = Null
					MouseXSpeed()
					MouseYSpeed()
					MouseZSpeed()
					mouse_x_speed_1 =0.0
					mouse_y_speed_1 =0.0
				}
			} else {
				AAText (GraphicWidth/2, y+70*scale, "ACCESS CODE: ",True,True	)
				AASetFont (Font4)
				AAText (GraphicWidth/2, y+124*scale, KeypadInput,True,True	)
			}
			
			x = x+44*scale
			y = y+249*scale
			
			for (n of range(4)) {
				for (i of range(3)) {
					xtemp = x+Int(58.5*scale*n)
					ytemp = y+(67*scale)*i
					
					temp = False
					if (MouseOn(xtemp,ytemp, 54*scale,65*scale) && KeypadMSG == "") {
						if (MouseUp1) {
							PlaySound_Strict (ButtonSFX)
							
							switch ((n+1)+(i*4)) {
								case 1,2,3:
									KeypadInput=KeypadInput + ((n+1)+(i*4))
								case 4:
									KeypadInput=KeypadInput + "0"
								case 5,6,7:
									KeypadInput=KeypadInput + ((n+1)+(i*4)-1)
								case 8: //enter:
									if (KeypadInput = SelectedDoor.Code) {
										PlaySound_Strict (ScannerSFX1)
										
										if (SelectedDoor.Code = Str(AccessCode)) {
											GiveAchievement(AchvMaynard)
										} else if (SelectedDoor.Code = "7816") {
											GiveAchievement(AchvHarp)
										}
										
										SelectedDoor.locked = 0
										UseDoor(SelectedDoor,True)
										SelectedDoor = Null
										MouseXSpeed()
										MouseYSpeed()
										MouseZSpeed()
										mouse_x_speed_1 = 0.0
										mouse_y_speed_1 = 0.0
									} else {
										PlaySound_Strict(ScannerSFX2)
										KeypadMSG = "ACCESS DENIED"
										KeypadTimer = 210
										KeypadInput = ""	
									}
								case 9,10,11:
									KeypadInput=KeypadInput + ((n+1)+(i*4)-2)
								case 12:
									KeypadInput = ""
							}
							
							if (Len(KeypadInput)> 4) {KeypadInput = Left(KeypadInput,4)}
						}
						
					} else {
						temp = False
					}
					
				}
			}
			
			if (Fullscreen) {DrawImage(CursorIMG, ScaledMouseX(),ScaledMouseY())}
			
			if (MouseHit2) {
				SelectedDoor = Null
				MouseXSpeed()
				MouseYSpeed()
				MouseZSpeed()
				mouse_x_speed_1 = 0.0
				mouse_y_speed_1 = 0.0
			}
		} else {
			SelectedDoor = Null
		}
	} else {
		KeypadInput = ""
		KeypadTimer = 0
		KeypadMSG = ""
	}
	
	if (KeyHit(1) && EndingTimer == 0 && (!Using294)) {
		if (MenuOpen || InvOpen) {
			ResumeSounds()
			if (OptionsMenu != 0) {SaveOptionsINI()}
			MouseXSpeed()
			MouseYSpeed()
			MouseZSpeed()
			mouse_x_speed_1 = 0.0
			mouse_y_speed_1 = 0.0
		} else {
			PauseSounds()
		}
		MenuOpen = !MenuOpen
		
		AchievementsMenu = 0
		OptionsMenu = 0
		QuitMSG = 0
		
		SelectedDoor = Null
		SelectedScreen = Null
		SelectedMonitor = Null
		if (SelectedItem != Null) {
			if (Instr(SelectedItem.itemtemplate.tempname,"vest") || Instr(SelectedItem.itemtemplate.tempname,"hazmatsuit")) {
				if (!WearingVest && !WearingHazmat) {
					DropItem(SelectedItem)
				}
				SelectedItem = Null
			}
		}
	}
	
	let spacing: int
	let PrevOtherOpen: Items
	
	let OtherSize: int,OtherAmount: int
	
	let isEmpty: int
	
	let isMouseOn: int
	
	let closedInv: int
	
	if (OtherOpen != Null) {
		//[Block]
		if (PlayerRoom.RoomTemplate.Name = "gatea") {
			HideEntity (Fog)
			CameraFogRange(Camera, 5,30)
			CameraFogColor (Camera,200,200,200)
			CameraClsColor (Camera,200,200,200)					
			CameraRange(Camera, 0.05, 30)
		} else if ((PlayerRoom.RoomTemplate.Name = "exit1") && (EntityY(Collider)>1040.0*RoomScale)) {
			HideEntity (Fog)
			CameraFogRange(Camera, 5,45)
			CameraFogColor (Camera,200,200,200)
			CameraClsColor (Camera,200,200,200)					
			CameraRange(Camera, 0.05, 60)
		}
		
		PrevOtherOpen = OtherOpen
		OtherSize=OtherOpen.invSlots
		
		for (i of range(OtherSize)) {
			if (OtherOpen.SecondInv[i] != Null) {
				OtherAmount = OtherAmount+1
			}
		}
		
		InvOpen = False
		SelectedDoor = Null
		let tempX: int = 0
		
		width = 70
		height = 70
		spacing = 35
		
		x = GraphicWidth / 2 - (width * MaxItemAmount /2 + spacing * (MaxItemAmount / 2 - 1)) / 2
		y = GraphicHeight / 2 - (height * OtherSize /5 + spacing * (OtherSize / 5 - 1)) / 2//height
		
		ItemAmount = 0
		for (n of range(OtherSize)) {
			isMouseOn = False
			if (ScaledMouseX() > x && ScaledMouseX() < x + width) {
				if (ScaledMouseY() > y && ScaledMouseY() < y + height) {
					isMouseOn = True
				}
			}
			
			if (isMouseOn) {
				MouseSlot = n
				Color (255, 0, 0)
				Rect(x - 1, y - 1, width + 2, height + 2)
			}
			
			DrawFrame(x, y, width, height, (x % 64), (x % 64))
			
			if (OtherOpen = Null) {Exit()}
			
			if (OtherOpen.SecondInv[n] != Null) {
				if (SelectedItem != OtherOpen.SecondInv[n] || isMouseOn) {
					DrawImage(OtherOpen.SecondInv[n].invimg, x + width / 2 - 32, y + height / 2 - 32)
				}
			}
			DebugLog ("otheropen: "+(OtherOpen!=Null))
			if (OtherOpen.SecondInv[n] != Null && SelectedItem != OtherOpen.SecondInv[n]) {
			
				if (isMouseOn) {
					Color (255, 255, 255)
					AAText(x + width / 2, y + height + spacing - 15, OtherOpen.SecondInv[n].itemtemplate.name, True)				
					if (SelectedItem = Null) {
						if (MouseHit1) {
							SelectedItem = OtherOpen.SecondInv[n]
							MouseHit1 = False
							
							if (DoubleClick) {
								if (OtherOpen.SecondInv[n].itemtemplate.sound != 66) {
									PlaySound_Strict(PickSFX(OtherOpen.SecondInv[n].itemtemplate.sound))
								}
								OtherOpen = Null
								closedInv=True
								InvOpen = False
								DoubleClick = False
							}
							
						}
					}
				}
				
				ItemAmount=ItemAmount+1
			} else {
				if (isMouseOn && MouseHit1) {
					for (z of range(OtherSize)) {
						if (OtherOpen.SecondInv[z] = SelectedItem) {
							OtherOpen.SecondInv[z] = Null
						}
					}
					OtherOpen.SecondInv[n] = SelectedItem
				}
				
			}				
			
			x=x+width + spacing
			tempX=tempX + 1
			if (tempX = 5) { 
				tempX=0
				y = y + height*2 
				x = GraphicWidth / 2 - (width * MaxItemAmount /2 + spacing * (MaxItemAmount / 2 - 1)) / 2
			}
		}
		
		if (SelectedItem != Null) {
			if (MouseDown1) {
				if (MouseSlot = 66) {
					DrawImage(SelectedItem.invimg, ScaledMouseX() - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, ScaledMouseY() - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
				} else if (SelectedItem != PrevOtherOpen.SecondInv[MouseSlot]) {
					DrawImage(SelectedItem.invimg, ScaledMouseX() - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, ScaledMouseY() - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
				}
			} else {
				if (MouseSlot = 66) {
					if (SelectedItem.itemtemplate.sound != 66) {PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))}
					
					ShowEntity(SelectedItem.collider)
					PositionEntity(SelectedItem.collider, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
					RotateEntity(SelectedItem.collider, EntityPitch(Camera), EntityYaw(Camera), 0)
					MoveEntity(SelectedItem.collider, 0, -0.1, 0.1)
					RotateEntity(SelectedItem.collider, 0, Rand(360), 0)
					ResetEntity (SelectedItem.collider)
					//move the item so that it doesn't overlap with other items
					
					SelectedItem.DropSpeed = 0.0
					
					SelectedItem.Picked = False
					for (z of range(OtherSize)) {
						if (OtherOpen.SecondInv[z] = SelectedItem) {OtherOpen.SecondInv[z] = Null}
					}
					
					isEmpty=True
					if (OtherOpen.itemtemplate.tempname = "wallet") {
						if (!isEmpty) {
							for (z of range(OtherSize)) {
								if (OtherOpen.SecondInv[z]!=Null) {
									let name: string = OtherOpen.SecondInv[z].itemtemplate.tempname
									if (name$!="25ct" && name$!="coin" && name$!="key" && name$!="scp860" && name$!="scp714") {
										isEmpty=False
										Exit()
									}
								}
							}
						}
					} else {
						for (z of range(OtherSize)) {
							if (OtherOpen.SecondInv[z]!=Null) {
								isEmpty = False
								Exit()
							}
						}
					}
					
					if (isEmpty) {
						switch (OtherOpen.itemtemplate.tempname) {
							case "clipboard":
								OtherOpen.invimg = OtherOpen.itemtemplate.invimg2
								SetAnimTime (OtherOpen.model,17.0)
							case "wallet":
								SetAnimTime (OtherOpen.model,0.0)
						}
					}
					
					SelectedItem = Null
					OtherOpen = Null
					closedInv=True
					
					MoveMouse (viewport_center_x, viewport_center_y)
				} else {
					
					if (PrevOtherOpen.SecondInv[MouseSlot] = Null) {
						for (z of range(OtherSize)) {
							if (PrevOtherOpen.SecondInv[z] == SelectedItem) {PrevOtherOpen.SecondInv[z] = Null}
						}
						PrevOtherOpen.SecondInv[MouseSlot] = SelectedItem
						SelectedItem = Null
					 } else if (PrevOtherOpen.SecondInv[MouseSlot] != SelectedItem) {
						switch (SelectedItem.itemtemplate.tempname) {
							default:
								Msg = "You cannot combine these two items."
								MsgTimer = 70 * 5
						}				
					}
					
				}
				SelectedItem = Null
			}
		}
		
		if (Fullscreen) {DrawImage(CursorIMG,ScaledMouseX(),ScaledMouseY())}
		if ((closedInv) && (!InvOpen)) {
			ResumeSounds() 
			OtherOpen=Null
			MouseXSpeed()
			MouseYSpeed()
			MouseZSpeed()
			mouse_x_speed_1 = 0.0
			mouse_y_speed_1 = 0.0
		}
		
		
	} else if (InvOpen) {
		
		if (PlayerRoom.RoomTemplate.Name = "gatea") {
			HideEntity (Fog)
			CameraFogRange (Camera, 5,30)
			CameraFogColor (Camera,200,200,200)
			CameraClsColor (Camera,200,200,200)					
			CameraRange(Camera, 0.05, 30)
		} else if ((PlayerRoom.RoomTemplate.Name = "exit1") && (EntityY(Collider)>1040.0*RoomScale)) {
			HideEntity (Fog)
			CameraFogRange (Camera, 5,45)
			CameraFogColor (Camera,200,200,200)
			CameraClsColor (Camera,200,200,200)					
			CameraRange(Camera, 0.05, 60)
		}
		
		SelectedDoor = Null
		
		width = 70
		height = 70
		spacing = 35
		
		x = GraphicWidth / 2 - (width * MaxItemAmount /2 + spacing * (MaxItemAmount / 2 - 1)) / 2
		y = GraphicHeight / 2 - height
		
		ItemAmount = 0
		for (n of range(MaxItemAmount)) {
			isMouseOn = False
			if (ScaledMouseX() > x && ScaledMouseX() < x + width) {
				if (ScaledMouseY() > y && ScaledMouseY() < y + height) {
					isMouseOn = True
				}
			}
			
			if (Inventory(n) != Null) {
				Color (200, 200, 200)
				switch (Inventory(n).itemtemplate.tempname ) {
					case "gasmask":
						if (WearingGasMask=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "supergasmask":
						if (WearingGasMask=2) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "gasmask3":
						if (WearingGasMask=3) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "hazmatsuit":
						if (WearingHazmat=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "hazmatsuit2":
						if (WearingHazmat=2) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "hazmatsuit3":
						if (WearingHazmat=3) {Rect(x - 3, y - 3, width + 6, height + 6)	}
					case "vest":
						if (WearingVest=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "finevest":
						if (WearingVest=2) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "scp714":
						if (Wearing714=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
						//BoH items
					case "nvgoggles":
						if (WearingNightVision=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "supernv":
						if (WearingNightVision=2) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "scp1499":
						if (Wearing1499=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "super1499":
						if (Wearing1499=2) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "finenvgoggles":
						if (WearingNightVision=3) {Rect(x - 3, y - 3, width + 6, height + 6)}
					case "scp427":
						if (I_427.Using=1) {Rect(x - 3, y - 3, width + 6, height + 6)}
				}
			}
			
			if (isMouseOn) {
				MouseSlot = n
				Color (255, 0, 0)
				Rect(x - 1, y - 1, width + 2, height + 2)
			}
			
			Color (255, 255, 255)
			DrawFrame(x, y, width, height, (x % 64), (x % 64))
			
			if (Inventory(n) != Null) {
				if (SelectedItem != Inventory(n) || isMouseOn) { 
					DrawImage(Inventory(n).invimg, x + width / 2 - 32, y + height / 2 - 32)
				}
			}
			
			if (Inventory(n) != Null && SelectedItem != Inventory(n)) {
				if (isMouseOn) {
					if (SelectedItem = Null) {
						if (MouseHit1) {
							SelectedItem = Inventory(n)
							MouseHit1 = False
							
							if (DoubleClick) {
								if (WearingHazmat > 0 && Instr(SelectedItem.itemtemplate.tempname,"hazmatsuit") == 0) {
									Msg = "You cannot use any items while wearing a hazmat suit."
									MsgTimer = 70*5
									SelectedItem = Null
									return
								}
								if (Inventory(n).itemtemplate.sound != 66) {
									PlaySound_Strict(PickSFX(Inventory(n).itemtemplate.sound))
								}
								InvOpen = False
								DoubleClick = False
							}
							
						}
						
						AASetFont(Font1)
						Color(0,0,0)
						AAText(x + width / 2 + 1, y + height + spacing - 15 + 1, Inventory(n).name, True)							
						Color(255, 255, 255	)
						AAText(x + width / 2, y + height + spacing - 15, Inventory(n).name, True)	
						
					}
				}
				
				ItemAmount=ItemAmount+1
			} else {
				if (isMouseOn && MouseHit1) {
					for (z of range(MaxItemAmount)) {
						if (Inventory(z) = SelectedItem) {Inventory(z) = Null}
					}
					Inventory(n) = SelectedItem
				}	
			}					
			
			x=x+width + spacing
			if (n = 4) { 
				y = y + height*2 
				x = GraphicWidth / 2 - (width * MaxItemAmount /2 + spacing * (MaxItemAmount / 2 - 1)) / 2
			}
		}
		
		if (SelectedItem != Null) {
			if (MouseDown1) {
				if (MouseSlot = 66) {
					DrawImage(SelectedItem.invimg, ScaledMouseX() - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, ScaledMouseY() - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
				} else if (SelectedItem != Inventory(MouseSlot)) {
					DrawImage(SelectedItem.invimg, ScaledMouseX() - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, ScaledMouseY() - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
				}
			} else {
				if (MouseSlot = 66) {
					switch (SelectedItem.itemtemplate.tempname) {
						case "vest","finevest","hazmatsuit","hazmatsuit2","hazmatsuit3":
							Msg = "Double click on this item to take it off."
							MsgTimer = 70*5
						case "scp1499","super1499":
							if (Wearing1499>0) {
								Msg = "Double click on this item to take it off."
								MsgTimer = 70*5
							} else {
								DropItem(SelectedItem)
								SelectedItem = Null
								InvOpen = False
							}
						default:
							DropItem(SelectedItem)
							SelectedItem = Null
							InvOpen = False
					}
					
					MoveMouse(viewport_center_x, viewport_center_y)
				} else {
					if (Inventory(MouseSlot) = Null) {
						for (z of range(MaxItemAmount)) {
							if (Inventory(z) = SelectedItem) {Inventory(z) = Null}
						}
						Inventory(MouseSlot) = SelectedItem
						SelectedItem = Null
					} else if (Inventory(MouseSlot) != SelectedItem) {
						switch (SelectedItem.itemtemplate.tempname) {
							case "paper","key1","key2","key3","key4","key5","key6","misc","oldpaper","badge","ticket","25ct","coin","key","scp860":
								//[Block]
								if (Inventory(MouseSlot).itemtemplate.tempname = "clipboard") {
									//Add an item to clipboard
									let added: Items = Null
									let b: string = SelectedItem.itemtemplate.tempname
									let b2: string = SelectedItem.itemtemplate.name
									if ((b!="misc" && b!="25ct" && b!="coin" && b!="key" && b!="scp860" && b!="scp714") || (b2="Playing Card" || b2 == "Mastercard")) {
										for (c of range(Inventory(MouseSlot).invSlots)) {
											if (Inventory(MouseSlot).SecondInv[c] = Null) {
												if (SelectedItem != Null) {
													Inventory(MouseSlot).SecondInv[c] = SelectedItem
													Inventory(MouseSlot).state = 1.0
													SetAnimTime (Inventory(MouseSlot).model,0.0)
													Inventory(MouseSlot).invimg = Inventory(MouseSlot).itemtemplate.invimg
													
													for (ri of range(MaxItemAmount)) {
														if (Inventory(ri) = SelectedItem) {
															Inventory(ri) = Null
															PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
														}
													}
													added = SelectedItem
													SelectedItem = Null
													Exit()
												}
											}
										}
										if (SelectedItem != Null) {
											Msg = "The paperclip is not strong enough to hold any more items."
										} else {
											if (added.itemtemplate.tempname = "paper" || added.itemtemplate.tempname == "oldpaper") {
												Msg = "This document was added to the clipboard."
											} else if (added.itemtemplate.tempname == "badge") {
												Msg = added.itemtemplate.name + " was added to the clipboard."
											} else {
												Msg = "The " + added.itemtemplate.name + " was added to the clipboard."
											}
											
										}
										MsgTimer = 70 * 5
									} else {
										Msg = "You cannot combine these two items."
										MsgTimer = 70 * 5
									}
								} else if (Inventory(MouseSlot).itemtemplate.tempname = "wallet") {
									//Add an item to clipboard
									added.Items = Null
									b$ = SelectedItem.itemtemplate.tempname
									b2$ = SelectedItem.itemtemplate.name
									if ((b!="misc" && b!="paper" && b!="oldpaper") || (b2 == "Playing Card" || b2 == "Mastercard")) {
										for (c of range(Inventory(MouseSlot).invSlots)) {
											if (Inventory(MouseSlot).SecondInv[c] = Null) {
												if (SelectedItem != Null) {
													Inventory(MouseSlot).SecondInv[c] = SelectedItem
													Inventory(MouseSlot).state = 1.0
													if (b!="25ct" && b!="coin" && b!="key" && b!="scp860") {
														SetAnimTime (Inventory(MouseSlot).model,3.0)
													}
													Inventory(MouseSlot).invimg = Inventory(MouseSlot).itemtemplate.invimg
													
													for (ri of range(MaxItemAmount)) {
														if (Inventory(ri) = SelectedItem) {
															Inventory(ri) = Null
															PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
														}
													}
													added = SelectedItem
													SelectedItem = Null
													Exit()
												}
											}
										}
										if (SelectedItem != Null) {
											Msg = "The wallet is full."
										} else {
											Msg = "You put "+added.itemtemplate.name+" into the wallet."
										}
										
										MsgTimer = 70 * 5
									} else {
										Msg = "You cannot combine these two items."
										MsgTimer = 70 * 5
									}
								} else {
									Msg = "You cannot combine these two items."
									MsgTimer = 70 * 5
								}
								SelectedItem = Null
								
							case "battery", "bat":
								//[Block]
								switch (Inventory(MouseSlot).itemtemplate.name) {
									case "S-NAV Navigator", "S-NAV 300 Navigator", "S-NAV 310 Navigator":
										if (SelectedItem.itemtemplate.sound != 66) {PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))}
										RemoveItem (SelectedItem)
										SelectedItem = Null
										Inventory(MouseSlot).state = 100.0
										Msg = "You replaced the navigator's battery."
										MsgTimer = 70 * 5
									case "S-NAV Navigator Ultimate":
										Msg = "There seems to be no place for batteries in this navigator."
										MsgTimer = 70 * 5
									case "Radio Transceiver":
										switch (Inventory(MouseSlot).itemtemplate.tempname) {
											case "fineradio", "veryfineradio":
												Msg = "There seems to be no place for batteries in this radio."
												MsgTimer = 70 * 5
											case "18vradio":
												Msg = "The battery does not fit inside this radio."
												MsgTimer = 70 * 5
											case "radio":
												if (SelectedItem.itemtemplate.sound != 66) {
													PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))	
												}
												RemoveItem (SelectedItem)
												SelectedItem = Null
												Inventory(MouseSlot).state = 100.0
												Msg = "You replaced the radio's battery."
												MsgTimer = 70 * 5
										}
									case "Night Vision Goggles":
										let nvname: string = Inventory(MouseSlot).itemtemplate.tempname
										if (nvname$ == "nvgoggles" || nvname$ == "supernv") {
											if (SelectedItem.itemtemplate.sound != 66) {PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))}
											RemoveItem (SelectedItem)
											SelectedItem = Null
											Inventory(MouseSlot).state = 1000.0
											Msg = "You replaced the goggles' battery."
											MsgTimer = 70 * 5
										} else {
											Msg = "There seems to be no place for batteries in these night vision goggles."
											MsgTimer = 70 * 5
										}
									default:
										Msg = "You cannot combine these two items."
										MsgTimer = 70 * 5	
								}
								
							case "18vbat":
								//[Block]
								switch (Inventory(MouseSlot).itemtemplate.name) {
									case "S-NAV Navigator", "S-NAV 300 Navigator", "S-NAV 310 Navigator":
										Msg = "The battery does not fit inside this navigator."
										MsgTimer = 70 * 5
									case "S-NAV Navigator Ultimate":
										Msg = "There seems to be no place for batteries in this navigator."
										MsgTimer = 70 * 5
									case "Radio Transceiver":
										switch (Inventory(MouseSlot).itemtemplate.tempname) {
											case "fineradio", "veryfineradio":
												Msg = "There seems to be no place for batteries in this radio."
												MsgTimer = 70 * 5		
											case "18vradio":
												if (SelectedItem.itemtemplate.sound != 66) {PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))}
												RemoveItem (SelectedItem)
												SelectedItem = Null
												Inventory(MouseSlot).state = 100.0
												Msg = "You replaced the radio's battery."
												MsgTimer = 70 * 5
										} 
									default:
										Msg = "You cannot combine these two items."
										MsgTimer = 70 * 5	
								}
								
							default:
								//[Block]
								Msg = "You cannot combine these two items."
								MsgTimer = 70 * 5
								
						}				
					}
					
				}
				SelectedItem = Null
			}
		}
		
		if (Fullscreen) {DrawImage(CursorIMG, ScaledMouseX(),ScaledMouseY())}
		
		if (InvOpen = False) {
			ResumeSounds() 
			MouseXSpeed()
			MouseYSpeed()
			MouseZSpeed()
			mouse_x_speed_1 = 0.0
			mouse_y_speed_1 = 0.0
		}
	} else { //invopen = False
		
		if (SelectedItem != Null) {
			switch (SelectedItem.itemtemplate.tempname) {
				case "nvgoggles":
					//[Block]
					if (Wearing1499 == 0 && WearingHazmat == 0) {
						if (WearingNightVision == 1) {
							Msg = "You removed the goggles."
							CameraFogFar = StoredCameraFogFar
						} else {
							Msg = "You put on the goggles."
							WearingGasMask = 0
							WearingNightVision = 0
							StoredCameraFogFar = CameraFogFar
							CameraFogFar = 30
						}
						
						WearingNightVision = (!WearingNightVision)
					} else if (Wearing1499 > 0) {
						Msg = "You need to take off SCP-1499 in order to put on the goggles."
					} else {
						Msg = "You need to take off the hazmat suit in order to put on the goggles."
					}
					SelectedItem = Null
					MsgTimer = 70 * 5
					
				case "supernv":
					//[Block]
					if (Wearing1499 == 0 && WearingHazmat == 0) {
						if (WearingNightVision = 2) {
							Msg = "You removed the goggles."
							CameraFogFar = StoredCameraFogFar
						} else {
							Msg = "You put on the goggles."
							WearingGasMask = 0
							WearingNightVision = 0
							StoredCameraFogFar = CameraFogFar
							CameraFogFar = 30
						}
						
						WearingNightVision = (!WearingNightVision) * 2
					} else if (Wearing1499 > 0) {
						Msg = "You need to take off SCP-1499 in order to put on the goggles."
					} else {
						Msg = "You need to take off the hazmat suit in order to put on the goggles."
					}
					SelectedItem = Null
					MsgTimer = 70 * 5
					
				case "finenvgoggles":
					//[Block]
					if (Wearing1499 == 0 && WearingHazmat == 0) {
						if (WearingNightVision == 3) {
							Msg = "You removed the goggles."
							CameraFogFar = StoredCameraFogFar
						} else {
							Msg = "You put on the goggles."
							WearingGasMask = 0
							WearingNightVision = 0
							StoredCameraFogFar = CameraFogFar
							CameraFogFar = 30
						}
						
						WearingNightVision = (!WearingNightVision) * 3
					} else if (Wearing1499 > 0) {
						Msg = "You need to take off SCP-1499 in order to put on the goggles."
					} else {
						Msg = "You need to take off the hazmat suit in order to put on the goggles."
					}
					SelectedItem = Null
					MsgTimer = 70 * 5
					
				case "ring":
					//[Block]
					if (Wearing714=2) {
						Msg = "You removed the ring."
						Wearing714 = False
					} else {
						//Achievements(Achv714)=True
						Msg = "You put on the ring."
						Wearing714 = 2
					}
					MsgTimer = 70 * 5
					SelectedItem = Null
					
				case "1123":
					//[Block]
					if (!(Wearing714 = 1)) {
						if (PlayerRoom.RoomTemplate.Name != "room1123") {
							ShowEntity (Light)
							LightFlash = 7
							PlaySound_Strict(LoadTempSound("SFX/SCP/1123/Touch.ogg"))		
							DeathMSG = "Subject D-9341 was shot dead after attempting to attack a member of Nine-Tailed Fox. Surveillance tapes show that the subject had been "
							DeathMSG = DeathMSG + "wandering around the site approximately 9 minutes prior, shouting the phrase " + Chr(34) + "get rid of the four pests" + Chr(34)
							DeathMSG = DeathMSG + " in chinese. SCP-1123 was found in [REDACTED] nearby, suggesting the subject had come into physical contact with it. How "
							DeathMSG = DeathMSG + "exactly SCP-1123 was removed from its containment chamber is still unknown."
							Kill()
							return
						}
						for (e of Events.each) {
							if (e.EventName = "room1123") {
								if (e.EventState = 0) {
									ShowEntity (Light)
									LightFlash = 3
									PlaySound_Strict(LoadTempSound("SFX/SCP/1123/Touch.ogg"))		
								}
								e.EventState = Max(1, e.EventState)
								Exit()
							}
						}
					}
					
				case "battery":
					//[Block]
					//InvOpen = True
					{}
					
				case "key1", "key2", "key3", "key4", "key5", "key6", "keyomni", "scp860", "hand", "hand2", "25ct":
					//[Block]
					DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
					//se

				case "scp513":
					//[Block]
					PlaySound_Strict (LoadTempSound("SFX/SCP/513/Bell1.ogg"))
					
					if (Curr5131 = Null) {
						Curr5131 = CreateNPC(NPCtype5131, 0,0,0)
					}	
					SelectedItem = Null
					
				case "scp500":
					//[Block]
					if (CanUseItem(False, False, True)) {
						GiveAchievement(Achv500)
						
						if (Infect > 0) {
							Msg = "You swallowed the pill. Your nausea is fading."
						} else {
							Msg = "You swallowed the pill."
						}
						MsgTimer = 70*7
						
						DeathTimer = 0
						Infect = 0
						Stamina = 100
						for (i of range(6)) {
							SCP1025state[i]=0
						}
						if (StaminaEffect > 1.0) {
							StaminaEffect = 1.0
							StaminaEffectTimer = 0.0
						}
						
						RemoveItem(SelectedItem)
						SelectedItem = Null
					}	
					
				case "veryfinefirstaid":
					//[Block]
					if (CanUseItem(False, False, True)) {
						switch (Rand(5)) {
							case 1:
								Injuries = 3.5
								Msg = "You started bleeding heavily."
								MsgTimer = 70*7
							case 2:
								Injuries = 0
								Bloodloss = 0
								Msg = "Your wounds are healing up rapidly."
								MsgTimer = 70*7
							case 3:
								Injuries = Max(0, Injuries - Rnd(0.5,3.5))
								Bloodloss = Max(0, Bloodloss - Rnd(10,100))
								Msg = "You feel much better."
								MsgTimer = 70*7
							case 4:
								BlurTimer = 10000
								Bloodloss = 0
								Msg = "You feel nauseated."
								MsgTimer = 70*7
							case 5:
								BlinkTimer = -10
								let roomname: string = PlayerRoom.RoomTemplate.Name
								if (roomname == "dimension1499" || roomname == "gatea" || (roomname="exit1" && EntityY(Collider)>1040.0*RoomScale)) {
									Injuries = 2.5
									Msg = "You started bleeding heavily."
									MsgTimer = 70*7
								} else {
									for (r of Rooms.each) {
										if (r.RoomTemplate.Name = "pocketdimension") {
											PositionEntity(Collider, EntityX(r.obj),0.8,EntityZ(r.obj))		
											ResetEntity (Collider)									
											UpdateDoors()
											UpdateRooms()
											PlaySound_Strict(Use914SFX)
											DropSpeed = 0
											Curr106.State = -2500
											Exit()
										}
									}
									Msg = "For some inexplicable reason, you find yourself inside the pocket dimension."
									MsgTimer = 70*8
								}
						}
						
						RemoveItem(SelectedItem)
					}
					
				case "firstaid", "finefirstaid", "firstaid2":
					//[Block]
					if (Bloodloss == 0 && Injuries == 0) {
						Msg = "You do not need to use a first aid kit right now."
						MsgTimer = 70*5
						SelectedItem = Null
					} else {
						if (CanUseItem(False, True, True)) {
							CurrSpeed = CurveValue(0, CurrSpeed, 5.0)
							Crouch = True
							
							DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
							
							width = 300
							height = 20
							x = GraphicWidth / 2 - width / 2
							y = GraphicHeight / 2 + 80
							Rect(x, y, width+4, height, False)
							for (i of range(1, Int((width - 2) * (SelectedItem.state / 100.0) / 10) + 1)) {
								DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
							}
							
							SelectedItem.state = Min(SelectedItem.state+(FPSfactor/5.0),100)			
							
							if (SelectedItem.state = 100) {
								if (SelectedItem.itemtemplate.tempname = "finefirstaid") {
									Bloodloss = 0
									Injuries = Max(0, Injuries - 2.0)
									if (Injuries = 0) {
										Msg = "You bandaged the wounds and took a painkiller. You feel fine."
									} else if (Injuries > 1.0) {
										Msg = "You bandaged the wounds and took a painkiller, but you were not able to stop the bleeding."
									} else {
										Msg = "You bandaged the wounds and took a painkiller, but you still feel sore."
									}
									MsgTimer = 70*5
									RemoveItem(SelectedItem)
								} else {
									Bloodloss = Max(0, Bloodloss - Rand(10,20))
									if (Injuries => 2.5) {
										Msg = "The wounds were way too severe to staunch the bleeding completely."
										Injuries = Max(2.5, Injuries-Rnd(0.3,0.7))
									} else if (Injuries > 1.0) {
										Injuries = Max(0.5, Injuries-Rnd(0.5,1.0))
										if (Injuries > 1.0) {
											Msg = "You bandaged the wounds but were unable to staunch the bleeding completely."
										} else {
											Msg = "You managed to stop the bleeding."
										}
									} else {
										if (Injuries > 0.5) {
											Injuries = 0.5
											Msg = "You took a painkiller, easing the pain slightly."
										} else {
											Injuries = 0.5
											Msg = "You took a painkiller, but it still hurts to walk."
										}
									}
									
									if (SelectedItem.itemtemplate.tempname = "firstaid2") {
										switch (Rand(6)) {
											case 1:
												SuperMan = True
												Msg = "You have becomed overwhelmedwithadrenalineholyshitWOOOOOO~!"
											case 2:
												InvertMouse = !InvertMouse
												Msg = "You suddenly find it very difficult to turn your head."
											case 3:
												BlurTimer = 5000
												Msg = "You feel nauseated."
											case 4:
												BlinkEffect = 0.6
												BlinkEffectTimer = Rand(20,30)
											case 5:
												Bloodloss = 0
												Injuries = 0
												Msg = "You bandaged the wounds. The bleeding stopped completely and you feel fine."
											case 6:
												Msg = "You bandaged the wounds and blood started pouring heavily through the bandages."
												Injuries = 3.5
										}
									}
									
									MsgTimer = 70*5
									RemoveItem(SelectedItem)
								}							
							}
						}
					}
					
				case "eyedrops":
					//[Block]
					if (CanUseItem(False,False,False)) {
						if (!(Wearing714=1)) { //wtf is this
							BlinkEffect = 0.6
							BlinkEffectTimer = Rand(20,30)
							BlurTimer = 200
						}
						RemoveItem(SelectedItem)
					}
					
				case "fineeyedrops":
					//[Block]
					if (CanUseItem(False,False,False)) {
						if (!(Wearing714=1)) {
							BlinkEffect = 0.4
							BlinkEffectTimer = Rand(30,40)
							Bloodloss = Max(Bloodloss-1.0, 0)
							BlurTimer = 200
						}
						RemoveItem(SelectedItem)
					}
					
				case "supereyedrops":
					//[Block]
					if (CanUseItem(False,False,False)) {
						if (!(Wearing714 = 1)) {
							BlinkEffect = 0.0
							BlinkEffectTimer = 60
							EyeStuck = 10000
						}
						BlurTimer = 1000
						RemoveItem(SelectedItem)
					}
					
				case "paper", "ticket":
					//[Block]
					if (SelectedItem.itemtemplate.img = 0) {
						switch (SelectedItem.itemtemplate.name) {
							case "Burnt Note" :
								SelectedItem.itemtemplate.img = LoadImage_Strict("GFX/items/bn.it")
								SetBuffer(ImageBuffer(SelectedItem.itemtemplate.img))
								Color(0,0,0)
								AAText(277, 469, AccessCode, True, True)
								Color(255,255,255)
								SetBuffer(BackBuffer())
							case "Document SCP-372":
								SelectedItem.itemtemplate.img = LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
								SelectedItem.itemtemplate.img = ResizeImage2(SelectedItem.itemtemplate.img, ImageWidth(SelectedItem.itemtemplate.img) * MenuScale, ImageHeight(SelectedItem.itemtemplate.img) * MenuScale)
								
								SetBuffer(ImageBuffer(SelectedItem.itemtemplate.img))
								Color(37,45,137)
								AASetFont(Font5)
								temp = ((Int(AccessCode)*3) % 10000)
								if (temp < 1000) {temp = temp+1000}
								AAText(383*MenuScale, 734*MenuScale, temp, True, True)
								Color(255,255,255)
								SetBuffer(BackBuffer())
							case "Movie Ticket":
								//don't resize because it messes up the masking
								SelectedItem.itemtemplate.img=LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
								
								if (SelectedItem.state = 0) {
									Msg = Chr(34)+"Hey, I remember this movie!"+Chr(34)
									MsgTimer = 70*10
									PlaySound_Strict (LoadTempSound("SFX/SCP/1162/NostalgiaCancer"+Rand(1,5)+".ogg"))
									SelectedItem.state = 1
								}
							default:
								SelectedItem.itemtemplate.img=LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
								SelectedItem.itemtemplate.img = ResizeImage2(SelectedItem.itemtemplate.img, ImageWidth(SelectedItem.itemtemplate.img) * MenuScale, ImageHeight(SelectedItem.itemtemplate.img) * MenuScale)
						}
						
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					DrawImage(SelectedItem.itemtemplate.img, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.img) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.img) / 2)
					
				case "scp1025":
					//[Block]
					GiveAchievement(Achv1025) 
					if (SelectedItem.itemtemplate.img=0) {
						SelectedItem.state = Rand(0,5)
						SelectedItem.itemtemplate.img=LoadImage_Strict("GFX/items/1025/1025_"+Int(SelectedItem.state)+".jpg")	
						SelectedItem.itemtemplate.img = ResizeImage2(SelectedItem.itemtemplate.img, ImageWidth(SelectedItem.itemtemplate.img) * MenuScale, ImageHeight(SelectedItem.itemtemplate.img) * MenuScale)
						
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					if (!Wearing714) {
						SCP1025state[SelectedItem.state]=Max(1,SCP1025state[SelectedItem.state])
					}
					
					DrawImage(SelectedItem.itemtemplate.img, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.img) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.img) / 2)
					
				case "cup":
					//[Block]
					if (CanUseItem(False,False,True)) {
						SelectedItem.name = Trim(Lower(SelectedItem.name))
						if (Left(SelectedItem.name, Min(6,Len(SelectedItem.name))) = "cup of") {
							SelectedItem.name = Right(SelectedItem.name, Len(SelectedItem.name)-7)
						} else if (Left(SelectedItem.name, Min(8,Len(SelectedItem.name))) = "a cup of") {
							SelectedItem.name = Right(SelectedItem.name, Len(SelectedItem.name)-9)
						}
						
						//the state of refined items is more than 1.0 (fine setting increases it by 1, very fine doubles it)
						x2 = (SelectedItem.state+1.0)
						
						let iniStr: string = "DATA/SCP-294.ini"
						
						let loc: int = GetINISectionLocation(iniStr, SelectedItem.name)
						
						//Stop
						
						strtemp = GetINIString2(iniStr, loc, "message")
						if (strtemp != "") {
							Msg = strtemp
							MsgTimer = 70*6
						}
						
						if (GetINIInt2(iniStr, loc, "lethal") || GetINIInt2(iniStr, loc, "deathtimer")) {
							DeathMSG = GetINIString2(iniStr, loc, "deathmessage")
							if (GetINIInt2(iniStr, loc, "lethal")) {Kill()}
						}
						BlurTimer = GetINIInt2(iniStr, loc, "blur")*70//*temp
						if (VomitTimer = 0) {VomitTimer = GetINIInt2(iniStr, loc, "vomit")}
						CameraShakeTimer = GetINIString2(iniStr, loc, "camerashake")
						Injuries = Max(Injuries + GetINIInt2(iniStr, loc, "damage"),0)//*temp
						Bloodloss = Max(Bloodloss + GetINIInt2(iniStr, loc, "blood loss"),0)//*temp
						strtemp =  GetINIString2(iniStr, loc, "sound")
						if (strtemp!="") {
							PlaySound_Strict (LoadTempSound(strtemp))
						}
						if (GetINIInt2(iniStr, loc, "stomachache")) {SCP1025state[3]=1}
						
						DeathTimer=GetINIInt2(iniStr, loc, "deathtimer")*70
						
						BlinkEffect = Float(GetINIString2(iniStr, loc, "blink effect", 1.0))*x2
						BlinkEffectTimer = Float(GetINIString2(iniStr, loc, "blink effect timer", 1.0))*x2
						
						StaminaEffect = Float(GetINIString2(iniStr, loc, "stamina effect", 1.0))*x2
						StaminaEffectTimer = Float(GetINIString2(iniStr, loc, "stamina effect timer", 1.0))*x2
						
						strtemp = GetINIString2(iniStr, loc, "refusemessage")
						if (strtemp != "") {
							Msg = strtemp 
							MsgTimer = 70*6		
						} else {
							it.Items = CreateItem("Empty Cup", "emptycup", 0,0,0)
							it.Picked = True
							for (i of range(MaxItemAmount)) {
								if (Inventory(i)=SelectedItem) {
									Inventory(i) = it
									Exit()
								}
							}					
							EntityType (it.collider, HIT_ITEM)
							
							RemoveItem(SelectedItem)						
						}
						
						SelectedItem = Null
					}
					
				case "syringe":
					//[Block]
					if (CanUseItem(False,True,True)) {
						HealTimer = 30
						StaminaEffect = 0.5
						StaminaEffectTimer = 20
						
						Msg = "You injected yourself with the syringe and feel a slight adrenaline rush."
						MsgTimer = 70 * 8
						
						RemoveItem(SelectedItem)
					}
					
				case "finesyringe":
					//[Block]
					if (CanUseItem(False,True,True)) {
						HealTimer = Rnd(20, 40)
						StaminaEffect = Rnd(0.5, 0.8)
						StaminaEffectTimer = Rnd(20, 30)
						
						Msg = "You injected yourself with the syringe and feel an adrenaline rush."
						MsgTimer = 70 * 8
						
						RemoveItem(SelectedItem)
					}
					
				case "veryfinesyringe":
					//[Block]
					if (CanUseItem(False,True,True)) {
						switch (Rand(3)) {
							case 1:
								HealTimer = Rnd(40, 60)
								StaminaEffect = 0.1
								StaminaEffectTimer = 30
								Msg = "You injected yourself with the syringe and feel a huge adrenaline rush."
							case 2:
								SuperMan = True
								Msg = "You injected yourself with the syringe and feel a humongous adrenaline rush."
							case 3:
								VomitTimer = 30
								Msg = "You injected yourself with the syringe and feel a pain in your stomach."
						}
						
						MsgTimer = 70 * 8
						RemoveItem(SelectedItem)
					}
					
				case "radio","18vradio","fineradio","veryfineradio":
					//[Block]
					if (SelectedItem.state <= 100) {
						SelectedItem.state = Max(0, SelectedItem.state - FPSfactor * 0.004)
					}
					
					if (SelectedItem.itemtemplate.img=0) {
						SelectedItem.itemtemplate.img=LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					//radiostate(5) = has the "use the number keys" -message been shown yet (true/false)
					//radiostate(6) = a timer for the "code channel"
					//RadioState(7) = another timer for the "code channel"
					
					if (RadioState(5) = 0) {
						Msg = "Use the numbered keys 1 through 5 to cycle between various channels."
						MsgTimer = 70 * 5
						RadioState(5) = 1
						RadioState(0) = -1
					}
					
					strtemp$ = ""
					
					x = GraphicWidth - ImageWidth(SelectedItem.itemtemplate.img) //+ 120
					y = GraphicHeight - ImageHeight(SelectedItem.itemtemplate.img) //- 30
					
					DrawImage(SelectedItem.itemtemplate.img, x, y)
					
					if (SelectedItem.state > 0) {
						if (PlayerRoom.RoomTemplate.Name = "pocketdimension" || CoffinDistance < 4.0) {
							ResumeChannel(RadioCHN(5))
							if (ChannelPlaying(RadioCHN(5)) = False) {RadioCHN(5) = PlaySound_Strict(RadioStatic)}
						} else {
							switch (Int(SelectedItem.state2)) {
								case 0: //randomkanava:
									ResumeChannel(RadioCHN(0))
									strtemp = "        USER TRACK PLAYER - "
									if (!EnableUserTracks) {
										if (ChannelPlaying(RadioCHN(0)) = False) {
											RadioCHN(0) = PlaySound_Strict(RadioStatic)
										}
										strtemp = strtemp + "NOT ENABLED     "
									} else if (UserTrackMusicAmount<1) {
										if (ChannelPlaying(RadioCHN(0)) = False) {
											RadioCHN(0) = PlaySound_Strict(RadioStatic)
										}
										strtemp = strtemp + "NO TRACKS FOUND     "
									} else {
										if (!ChannelPlaying(RadioCHN(0))) {
											if (!UserTrackFlag) {
												if (UserTrackMode) {
													if (RadioState(0)<(UserTrackMusicAmount-1)) {
														RadioState(0) = RadioState(0) + 1
													} else {
														RadioState(0) = 0
													}
													UserTrackFlag = True
												} else {
													RadioState(0) = Rand(0,UserTrackMusicAmount-1)
												}
											}
											if (CurrUserTrack!=0) {
												FreeSound_Strict(CurrUserTrack)
												CurrUserTrack = 0
											}
											CurrUserTrack = LoadSound_Strict("SFX/Radio/UserTracks/"+UserTrackName$(RadioState(0)))
											RadioCHN(0) = PlaySound_Strict(CurrUserTrack)
											DebugLog("CurrTrack: "+RadioState(0))
											DebugLog(UserTrackName$(RadioState(0)))
										} else {
											strtemp = strtemp + Upper(UserTrackName$(RadioState(0))) + "          "
											UserTrackFlag = False
										}
										
										if (KeyHit(2)) {
											PlaySound_Strict (RadioSquelch)
											if (!UserTrackFlag) {
												if (UserTrackMode) {
													if (RadioState(0)<(UserTrackMusicAmount-1)) {
														RadioState(0) = RadioState(0) + 1
													} else {
														RadioState(0) = 0
													}
													UserTrackFlag = True
												} else {
													RadioState(0) = Rand(0,UserTrackMusicAmount-1)
												}
											}
											if (CurrUserTrack != 0) {
												FreeSound_Strict(CurrUserTrack)
												CurrUserTrack = 0
											}
											CurrUserTrack = LoadSound_Strict("SFX/Radio/UserTracks/"+UserTrackName(RadioState(0)))
											RadioCHN(0) = PlaySound_Strict(CurrUserTrack)
											DebugLog("CurrTrack: "+RadioState(0))
											DebugLog(UserTrackName$(RadioState(0)))
										}
									}
								case 1: //hälytyskanava:
									DebugLog(RadioState(1) )
									
									ResumeChannel(RadioCHN(1))
									strtemp = "        WARNING - CONTAINMENT BREACH          "
									if (ChannelPlaying(RadioCHN(1)) = False) {
										
										if (RadioState(1) >= 5) {
											RadioCHN(1) = PlaySound_Strict(RadioSFX(1,1))	
											RadioState(1) = 0
										} else {
											RadioState(1)=RadioState(1)+1	
											RadioCHN(1) = PlaySound_Strict(RadioSFX(1,0))	
										}
										
									}
									
								case 2: //scp-radio:
									ResumeChannel(RadioCHN(2))
									strtemp = "        SCP Foundation On-Site Radio          "
									if (ChannelPlaying(RadioCHN(2)) = False) {
										RadioState(2)=RadioState(2)+1
										if (RadioState(2) = 17) {RadioState(2) = 1}
										if (Floor(RadioState(2)/2)=Ceil(RadioState(2)/2)) { //parillinen, soitetaan normiviesti
											RadioCHN(2) = PlaySound_Strict(RadioSFX(2,Int(RadioState(2)/2)))	
										} else { //pariton, soitetaan musiikkia
											RadioCHN(2) = PlaySound_Strict(RadioSFX(2,0))
										}
									} 
								case 3:
									ResumeChannel(RadioCHN(3))
									strtemp = "             EMERGENCY CHANNEL - RESERVED FOR COMMUNICATION IN THE EVENT OF A CONTAINMENT BREACH         "
									if (ChannelPlaying(RadioCHN(3)) = False) {RadioCHN(3) = PlaySound_Strict(RadioStatic)}
									
									if (MTFtimer > 0) { 
										RadioState(3)=RadioState(3)+Max(Rand(-10,1),0)
										switch (RadioState(3)) {
											case 40:
												if (!RadioState3(0)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random1.ogg"))
													RadioState(3) = RadioState(3)+1	
													RadioState3(0) = True	
												}											
											case 400:
												if (!RadioState3(1)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random2.ogg"))
													RadioState(3) = RadioState(3)+1	
													RadioState3(1) = True	
												}	
											case 800:
												if (!RadioState3(2)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random3.ogg"))
													RadioState(3) = RadioState(3)+1	
													RadioState3(2) = True
												}													
											case 1200:
												if (!RadioState3(3)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random4.ogg"))	
													RadioState(3) = RadioState(3)+1	
													RadioState3(3) = True
												}
											case 1600:
												if (!RadioState3(4)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random5.ogg"))	
													RadioState(3) = RadioState(3)+1
													RadioState3(4) = True
												}
											case 2000:
												if (!RadioState3(5)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random6.ogg"))	
													RadioState(3) = RadioState(3)+1
													RadioState3(5) = True
												}
											case 2400:
												if (!RadioState3(6)) {
													RadioCHN(3) = PlaySound_Strict(LoadTempSound("SFX/Character/MTF/Random7.ogg"))	
													RadioState(3) = RadioState(3)+1
													RadioState3(6) = True
												}
										}
									}
								case 4:
									ResumeChannel(RadioCHN(6)) //taustalle kohinaa
									if (ChannelPlaying(RadioCHN(6)) = False) {RadioCHN(6) = PlaySound_Strict(RadioStatic)}
									
									ResumeChannel(RadioCHN(4))
									if (ChannelPlaying(RadioCHN(4)) = False) {
										if (RemoteDoorOn = False && RadioState(8) == False) {
											RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/Chatter3.ogg"))	
											RadioState(8) = True
										} else {
											RadioState(4)=RadioState(4)+Max(Rand(-10,1),0)
											
											switch (RadioState(4)) {
												case 10:
													if (!Contained106) {
														if (!RadioState4(0)) {
															RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/OhGod.ogg"))
															RadioState(4) = RadioState(4)+1
															RadioState4(0) = True
														}
													}
												case 100:
													if (!RadioState4(1)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/Chatter2.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState4(1) = True
													}		
												case 158:
													if (MTFtimer = 0 && (!RadioState4(2))) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/franklin1.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState(2) = True
													}
												case 200:
													if (!RadioState4(3)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/Chatter4.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState4(3) = True
													}		
												case 260:
													if (!RadioState4(4)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/SCP/035/RadioHelp1.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState4(4) = True
													}		
												case 300:
													if (!RadioState4(5)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/Chatter1.ogg"))	
														RadioState(4) = RadioState(4)+1	
														RadioState4(5) = True
													}		
												case 350:
													if (!RadioState4(6)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/franklin2.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState4(6) = True
													}		
												case 400:
													if (!RadioState4(7)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/SCP/035/RadioHelp2.ogg"))
														RadioState(4) = RadioState(4)+1
														RadioState4(7) = True
													}		
												case 450:
													if (!RadioState4(8)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/franklin3.ogg"))	
														RadioState(4) = RadioState(4)+1		
														RadioState4(8) = True
													}		
												case 600:
													if (!RadioState4(9)) {
														RadioCHN(4) = PlaySound_Strict(LoadTempSound("SFX/radio/franklin4.ogg"))	
														RadioState(4) = RadioState(4)+1	
														RadioState4(9) = True
													}		
											}
										}
									}
									
									
								case 5:
									ResumeChannel(RadioCHN(5))
									if (ChannelPlaying(RadioCHN(5)) = False) {
										RadioCHN(5) = PlaySound_Strict(RadioStatic)
									}
							}
							
							x=x+66
							y=y+419
							
							Color (30,30,30)
							
							if (SelectedItem.state <= 100) {
								for (i of range(5)) {
									Rect(x, y+8*i, 43 - i * 6, 4, Ceil(SelectedItem.state / 20.0) > 4 - i )
								}
							}	
							
							AASetFont (Font3)
							AAText(x+60, y, "CHN")						
							
							if (SelectedItem.itemtemplate.tempname = "veryfineradio") { //"KOODIKANAVA"
								ResumeChannel(RadioCHN(0))
								if (ChannelPlaying(RadioCHN(0)) = False) {
									RadioCHN(0) = PlaySound_Strict(RadioStatic)
								}
								
								//radiostate(7)=kuinka mones piippaus menossa
								//radiostate(8)=kuinka mones access coden numero menossa
								RadioState(6)=RadioState(6) + FPSfactor
								temp = Mid(Str(AccessCode),RadioState(8)+1,1)
								if (RadioState(6)-FPSfactor <= RadioState(7)*50 && RadioState(6)>RadioState(7)*50) {
									PlaySound_Strict(RadioBuzz)
									RadioState(7)=RadioState(7)+1
									if (RadioState(7) >= temp) {
										RadioState(7)=0
										RadioState(6)=-100
										RadioState(8)=RadioState(8)+1
										if (RadioState(8)=4) {
											RadioState(8)=0
											RadioState(6)=-200
										}
									}
								}
								
								strtemp = ""
								for (i of range(Rand(5, 30) + 1)) {
									strtemp = strtemp + Chr(Rand(1,100))
								}
								
								AASetFont (Font4)
								AAText(x+97, y+16, Rand(0,9),True,True)
								
							} else {
								for (i of range(2, 7)) {
									if (KeyHit(i)) {
										if (SelectedItem.state2 != i-2) { //pausetetaan nykyinen radiokanava
											PlaySound_Strict (RadioSquelch)
											if (RadioCHN(Int(SelectedItem.state2)) != 0) {
												PauseChannel(RadioCHN(Int(SelectedItem.state2)))
											}
										}
										SelectedItem.state2 = i-2
										//jos nykyistä kanavaa ollaan soitettu, laitetaan jatketaan toistoa samasta kohdasta
										if (RadioCHN(SelectedItem.state2)!=0) {
											ResumeChannel(RadioCHN(SelectedItem.state2))
										}
									}
								}
								
								AASetFont (Font4)
								AAText(x+97, y+16, Int(SelectedItem.state2+1),True,True)
							}
							
							AASetFont (Font3)
							if (strtemp != "") {
								strtemp = Right(Left(strtemp, (Int(MilliSecs2()/300) % Len(strtemp))),10)
								AAText(x+32, y+33, strtemp)
							}
							
							AASetFont (Font1)
							
						}
						
					}
					
				case "cigarette":
					//[Block]
					if (CanUseItem(False,False,True)) {
						if (SelectedItem.state = 0) {
							switch (Rand(6)) {
								case 1:
									Msg = Chr(34)+"I don't have anything to light it with. Umm, what about that... Nevermind."+Chr(34)
								case 2:
									Msg = "You are unable to get lit."
								case 3:
									Msg = Chr(34)+"I quit that a long time ago."+Chr(34)
									RemoveItem(SelectedItem)
								case 4:
									Msg = Chr(34)+"Even if I wanted one, I have nothing to light it with."+Chr(34)
								case 5:
									Msg = Chr(34)+"Could really go for one now... Wish I had a lighter."+Chr(34)
								case 6:
									Msg = Chr(34)+"Don't plan on starting, even at a time like this."+Chr(34)
									RemoveItem(SelectedItem)
							}
							SelectedItem.state = 1 
						} else {
							Msg = "You are unable to get lit."
						}
						
						MsgTimer = 70 * 5
					}
					
				case "420":
					//[Block]
					if (CanUseItem(False,False,True)) {
						if (Wearing714=1) {
							Msg = Chr(34) + "DUDE WTF THIS SHIT DOESN'T EVEN WORK" + Chr(34)
						} else {
							Msg = Chr(34) + "MAN DATS SUM GOOD ASS SHIT" + Chr(34)
							Injuries = Max(Injuries-0.5, 0)
							BlurTimer = 500
							GiveAchievement(Achv420)
							PlaySound_Strict (LoadTempSound("SFX/Music/420J.ogg"))
						}
						MsgTimer = 70 * 5
						RemoveItem(SelectedItem)
					}
					
				case "420s":
					//[Block]
					if (CanUseItem(False,False,True)) {
						if (Wearing714=1) {
							Msg = Chr(34) + "DUDE WTF THIS SHIT DOESN'T EVEN WORK" + Chr(34)
						} else {
							DeathMSG = "Subject D-9341 found in a comatose state in [DATA REDACTED]. The subject was holding what appears to be a cigarette while smiling widely. "
							DeathMSG = DeathMSG+"Chemical analysis of the cigarette has been inconclusive, although it seems to contain a high concentration of an unidentified chemical "
							DeathMSG = DeathMSG+"whose molecular structure is remarkably similar to that of tetrahydrocannabinol."
							Msg = Chr(34) + "UH WHERE... WHAT WAS I DOING AGAIN... MAN I NEED TO TAKE A NAP..." + Chr(34)
							KillTimer = -1						
						}
						MsgTimer = 70 * 6
						RemoveItem(SelectedItem)
					}
					
				case "scp714":
					//[Block]
					if (Wearing714=1) {
						Msg = "You removed the ring."
						Wearing714 = False
					} else {
						GiveAchievement(Achv714)
						Msg = "You put on the ring."
						Wearing714 = True
					}
					MsgTimer = 70 * 5
					SelectedItem = Null	
					
				case "hazmatsuit", "hazmatsuit2", "hazmatsuit3":
					//[Block]
					if (WearingVest = 0) {
						CurrSpeed = CurveValue(0, CurrSpeed, 5.0)
						
						DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
						
						width = 300
						height = 20
						x = GraphicWidth / 2 - width / 2
						y = GraphicHeight / 2 + 80
						Rect(x, y, width+4, height, False)
						for (i of range(1, Int((width - 2) * (SelectedItem.state / 100.0) / 10) + 1)) {
							DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
						}
						
						SelectedItem.state = Min(SelectedItem.state+(FPSfactor/4.0),100)
						
						if (SelectedItem.state=100) {
							if (WearingHazmat>0) {
								Msg = "You removed the hazmat suit."
								WearingHazmat = False
								DropItem(SelectedItem)
							} else {
								if (SelectedItem.itemtemplate.tempname="hazmatsuit") {
									//Msg = "Hazmat1."
									WearingHazmat = 1
								} else if (SelectedItem.itemtemplate.tempname="hazmatsuit2") {
									//Msg = "Hazmat2."
									WearingHazmat = 2
								} else {
									//Msg = "Hazmat3."
									WearingHazmat = 3
								}
								if (SelectedItem.itemtemplate.sound != 66) {
									PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
								}
								Msg = "You put on the hazmat suit."
								if (WearingNightVision) {
									CameraFogFar = StoredCameraFogFar
								}
								WearingGasMask = 0
								WearingNightVision = 0
							}
							SelectedItem.state=0
							MsgTimer = 70 * 5
							SelectedItem = Null
						}
					}
					
				case "vest","finevest":
					//[Block]
					CurrSpeed = CurveValue(0, CurrSpeed, 5.0)
					
					DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
					
					width = 300
					height = 20
					x = GraphicWidth / 2 - width / 2
					y = GraphicHeight / 2 + 80
					Rect(x, y, width+4, height, False)
					for (i of range(1, Int((width - 2) * (SelectedItem.state / 100.0) / 10) + 1)) {
						DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
					}
					
					SelectedItem.state = Min(SelectedItem.state+(FPSfactor/(2.0+(0.5*(SelectedItem.itemtemplate.tempname="finevest")))),100)
					
					if (SelectedItem.state=100) {
						if (WearingVest>0) {
							Msg = "You removed the vest."
							WearingVest = False
							DropItem(SelectedItem)
						} else {
							if (SelectedItem.itemtemplate.tempname="vest") {
								Msg = "You put on the vest and feel slightly encumbered."
								WearingVest = 1
							} else {
								Msg = "You put on the vest and feel heavily encumbered."
								WearingVest = 2
							}
							if (SelectedItem.itemtemplate.sound != 66) {
								PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
							}
						}
						SelectedItem.state=0
						MsgTimer = 70 * 5
						SelectedItem = Null
					}
					
				case "gasmask", "supergasmask", "gasmask3":
					//[Block]
					if (Wearing1499 == 0 && WearingHazmat == 0) {
						if (WearingGasMask) {
							Msg = "You removed the gas mask."
						} else {
							if (SelectedItem.itemtemplate.tempname = "supergasmask") {
								Msg = "You put on the gas mask and you can breathe easier."
							} else {
								Msg = "You put on the gas mask."
							}
							if (WearingNightVision) {
								CameraFogFar = StoredCameraFogFar
							}
							WearingNightVision = 0
							WearingGasMask = 0
						}
						if (SelectedItem.itemtemplate.tempname="gasmask3") {
							if (WearingGasMask == 0) {WearingGasMask = 3} else {WearingGasMask=0}
						} else if (SelectedItem.itemtemplate.tempname="supergasmask") {
							if (WearingGasMask == 0) {WearingGasMask = 2} else {WearingGasMask=0}
						} else {
							WearingGasMask = (!WearingGasMask)
						}
					} else if (Wearing1499 > 0) {
						Msg = "You need to take off SCP-1499 in order to put on the gas mask."
					} else {
						Msg = "You need to take off the hazmat suit in order to put on the gas mask."
					}
					SelectedItem = Null
					MsgTimer = 70 * 5
					
				case "navigator", "nav":
					//[Block]
					
					if (SelectedItem.itemtemplate.img=0) {
						SelectedItem.itemtemplate.img=LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					if (SelectedItem.state <= 100) {
						SelectedItem.state = Max(0, SelectedItem.state - FPSfactor * 0.005)
					}
					
					x = GraphicWidth - ImageWidth(SelectedItem.itemtemplate.img)*0.5+20
					y = GraphicHeight - ImageHeight(SelectedItem.itemtemplate.img)*0.4-85
					width = 287
					height = 256
					
					let PlayerX,PlayerZ
					
					DrawImage(SelectedItem.itemtemplate.img, x - ImageWidth(SelectedItem.itemtemplate.img) / 2, y - ImageHeight(SelectedItem.itemtemplate.img) / 2 + 85)
					
					AASetFont (Font3)
					
					let NavWorks: boolean = True
					if (PlayerRoom.RoomTemplate.Name == "pocketdimension" || PlayerRoom.RoomTemplate.Name == "dimension1499") {
						NavWorks = False
					} else if (PlayerRoom.RoomTemplate.Name$ = "room860") {
						for (e of Events.each) {
							if (e.EventName = "room860") {
								if (e.EventState = 1.0) {
									NavWorks = False
								}
								Exit()
							}
						}
					}
					
					if (!NavWorks) {
						if ((MilliSecs2() % 1000) > 300) {
							Color(200, 0, 0)
							AAText(x, y + height / 2 - 80, "ERROR 06", True)
							AAText(x, y + height / 2 - 60, "LOCATION UNKNOWN", True)						
						}
					} else {
						
						if (SelectedItem.state > 0 && (Rnd(CoffinDistance + 15.0) > 1.0 || PlayerRoom.RoomTemplate.Name != "coffin")) {
							
							PlayerX = Floor((EntityX(PlayerRoom.obj)+8) / 8.0 + 0.5)
							PlayerZ = Floor((EntityZ(PlayerRoom.obj)+8) / 8.0 + 0.5)
							
							SetBuffer (ImageBuffer(NavBG))
							let xx = x-ImageWidth(SelectedItem.itemtemplate.img)/2
							let yy = y-ImageHeight(SelectedItem.itemtemplate.img)/2+85
							DrawImage(SelectedItem.itemtemplate.img, xx, yy)
							
							x = x - 12 + (((EntityX(Collider)-4.0)+8.0) % 8.0) * 3
							y = y + 12 - (((EntityZ(Collider)-4.0)+8.0) % 8.0) * 3
							for (x2 of range(Max(0, PlayerX - 6), Min(MapWidth, PlayerX + 6) + 1)) {
								for (z2 of range(Max(0, PlayerZ - 6), Min(MapHeight, PlayerZ + 6) + 1)) {
									
									if (CoffinDistance > 16.0 || Rnd(16.0)<CoffinDistance) { 
										if (MapTemp(x2, z2)>0 && (MapFound(x2, z2) > 0 || SelectedItem.itemtemplate.name == "S-NAV 310 Navigator" || SelectedItem.itemtemplate.name == "S-NAV Navigator Ultimate")) {
											let drawx: int = x + (PlayerX - 1 - x2) * 24 , drawy: int = y - (PlayerZ - 1 - z2) * 24
											
											if (x2+1<=MapWidth) {
												if (MapTemp(x2+1,z2)=False) {
													DrawImage(NavImages(3),drawx-12,drawy-12)
												}
											} else {
												DrawImage(NavImages(3),drawx-12,drawy-12)
											}
											if (x2-1>=0) {
												if (MapTemp(x2-1,z2)=False) {
													DrawImage(NavImages(1),drawx-12,drawy-12)
												}
											} else {
												DrawImage(NavImages(1),drawx-12,drawy-12)
											}
											if (z2-1>=0) {
												if (MapTemp(x2,z2-1)=False) {
													DrawImage(NavImages(0),drawx-12,drawy-12)
												}
											} else {
												DrawImage(NavImages(0),drawx-12,drawy-12)
											}
											if (z2+1<=MapHeight) {
												if (MapTemp(x2,z2+1)=False) {
													DrawImage(NavImages(2),drawx-12,drawy-12)
												}
											} else {
												DrawImage(NavImages(2),drawx-12,drawy-12)
											}
										}
									}
									
								}
							}
							
							SetBuffer (BackBuffer())
							DrawImageRect (NavBG,xx+80,yy+70,xx+80,yy+70,270,230)
							Color (30,30,30)
							if (SelectedItem.itemtemplate.name = "S-NAV Navigator") {
								Color(100, 0, 0)
							}
							Rect (xx+80,yy+70,270,230,False)
							
							x = GraphicWidth - ImageWidth(SelectedItem.itemtemplate.img)*0.5+20
							y = GraphicHeight - ImageHeight(SelectedItem.itemtemplate.img)*0.4-85
							
							if (SelectedItem.itemtemplate.name = "S-NAV Navigator") {
								Color(100, 0, 0)
							} else {
								Color (30,30,30)
							}
							if ((MilliSecs2() % 1000) > 300) {
								if (SelectedItem.itemtemplate.name != "S-NAV 310 Navigator" && SelectedItem.itemtemplate.name != "S-NAV Navigator Ultimate") {
									AAText(x - width/2 + 10, y - height/2 + 10, "MAP DATABASE OFFLINE")
								}
								
								yawvalue = EntityYaw(Collider)-90
								x1 = x+Cos(yawvalue)*6
								y1 = y-Sin(yawvalue)*6
								x2 = x+Cos(yawvalue-140)*5
								y2 = y-Sin(yawvalue-140)*5				
								x3 = x+Cos(yawvalue+140)*5
								y3 = y-Sin(yawvalue+140)*5
								
								Line(x1,y1,x2,y2)
								Line(x1,y1,x3,y3)
								Line(x2,y2,x3,y3)
							}
							
							let SCPs_found: int = 0
							if (SelectedItem.itemtemplate.name = "S-NAV Navigator Ultimate" && (MilliSecs2() % 600) < 400) {
								if (Curr173!=Null) {
									let dist = EntityDistance(Camera, Curr173.obj)
									dist = Ceil(dist / 8.0) * 8.0
									if (dist < 8.0 * 4) {
										Color (100, 0, 0)
										Oval(x - dist * 3, y - 7 - dist * 3, dist * 3 * 2, dist * 3 * 2, False)
										AAText(x - width / 2 + 10, y - height / 2 + 30, "SCP-173")
										SCPs_found = SCPs_found + 1
									}
								}
								if (Curr106!=Null) {
									dist = EntityDistance(Camera, Curr106.obj)
									if (dist < 8.0 * 4) {
										Color (100, 0, 0)
										Oval(x - dist * 1.5, y - 7 - dist * 1.5, dist * 3, dist * 3, False)
										AAText(x - width / 2 + 10, y - height / 2 + 30 + (20*SCPs_found), "SCP-106")
										SCPs_found = SCPs_found + 1
									}
								}
								if (Curr096!=Null) { 
									dist = EntityDistance(Camera, Curr096.obj)
									if (dist < 8.0 * 4) {
										Color (100, 0, 0)
										Oval(x - dist * 1.5, y - 7 - dist * 1.5, dist * 3, dist * 3, False)
										AAText(x - width / 2 + 10, y - height / 2 + 30 + (20*SCPs_found), "SCP-096")
										SCPs_found = SCPs_found + 1
									}
								}
								for (np of NPCs.each) {
									if (np.NPCtype = NPCtype049) {
										dist = EntityDistance(Camera, np.obj)
										if (dist < 8.0 * 4) {
											if (!np.HideFromNVG) {
												Color (100, 0, 0)
												Oval(x - dist * 1.5, y - 7 - dist * 1.5, dist * 3, dist * 3, False)
												AAText(x - width / 2 + 10, y - height / 2 + 30 + (20*SCPs_found), "SCP-049")
												SCPs_found = SCPs_found + 1
											}
										}
										Exit()
									}
								}
								if (PlayerRoom.RoomTemplate.Name = "coffin") {
									if (CoffinDistance < 8.0) {
										dist = Rnd(4.0, 8.0)
										Color (100, 0, 0)
										Oval(x - dist * 1.5, y - 7 - dist * 1.5, dist * 3, dist * 3, False)
										AAText(x - width / 2 + 10, y - height / 2 + 30 + (20*SCPs_found), "SCP-895")
									}
								}
							}
							
							Color (30,30,30)
							if (SelectedItem.itemtemplate.name = "S-NAV Navigator") {
								Color(100, 0, 0)
							}
							if (SelectedItem.state <= 100) {
								xtemp = x - width/2 + 196
								ytemp = y - height/2 + 10
								Rect (xtemp,ytemp,80,20,False)
								
								for (i of range(1, Ceil(SelectedItem.state / 10.0) + 1)) {
									DrawImage (NavImages(4),xtemp+i*8-6,ytemp+4)
								}
								
								AASetFont (Font3)
							}
						}
						
					}
					
				//new Items in SCP:CB 1.3
				case "scp1499","super1499":
					//[Block]
					if (WearingHazmat>0) {
						Msg = "You are not able to wear SCP-1499 and a hazmat suit at the same time."
						MsgTimer = 70 * 5
						SelectedItem=Null
						return
					}
					
					CurrSpeed = CurveValue(0, CurrSpeed, 5.0)
					
					DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
					
					width = 300
					height = 20
					x = GraphicWidth / 2 - width / 2
					y = GraphicHeight / 2 + 80
					Rect(x, y, width+4, height, False)
					for (i of range(1, Int((width - 2) * (SelectedItem.state / 100.0) / 10) + 1)) {
						DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
					}
					
					SelectedItem.state = Min(SelectedItem.state+(FPSfactor),100)
					
					if (SelectedItem.state=100) {
						if (Wearing1499>0) {
							//Msg = "1499remove."
							Wearing1499 = False
							//DropItem(SelectedItem)
							if (SelectedItem.itemtemplate.sound != 66) {
								PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
							}
						} else {
							if (SelectedItem.itemtemplate.tempname="scp1499") {
								//Msg = "scp1499."
								Wearing1499 = 1
							} else {
								//Msg = "super1499."
								Wearing1499 = 2
							}
							if (SelectedItem.itemtemplate.sound != 66) {
								PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
							}
							GiveAchievement(Achv1499)
							if (WearingNightVision) {
								CameraFogFar = StoredCameraFogFar
							}
							WearingGasMask = 0
							WearingNightVision = 0
							for (r of Rooms.each) {
								if (r.RoomTemplate.Name = "dimension1499") {
									BlinkTimer = -1
									NTF_1499PrevRoom = PlayerRoom
									NTF_1499PrevX = EntityX(Collider)
									NTF_1499PrevY = EntityY(Collider)
									NTF_1499PrevZ = EntityZ(Collider)
									
									if (NTF_1499X == 0.0 && NTF_1499Y == 0.0 && NTF_1499Z == 0.0) {
										PositionEntity (Collider, r.x+6086.0*RoomScale, r.y+304.0*RoomScale, r.z+2292.5*RoomScale)
										RotateEntity (Collider,0,90,0,True)
									} else {
										PositionEntity (Collider, NTF_1499X, NTF_1499Y+0.05, NTF_1499Z)
									}
									ResetEntity(Collider)
									UpdateDoors()
									UpdateRooms()
									for (it of Items.each) {
										it.disttimer = 0
									}
									PlayerRoom = r
									PlaySound_Strict (LoadTempSound("SFX/SCP/1499/Enter.ogg"))
									NTF_1499X = 0.0
									NTF_1499Y = 0.0
									NTF_1499Z = 0.0
									if (Curr096!=Null) {
										if (Curr096.SoundChn!=0) {
											SetStreamVolume_Strict(Curr096.SoundChn,0.0)
										}
									}
									for (e of Events.each) {
										if (e.EventName = "dimension1499") {
											if (EntityDistance(e.room.obj,Collider)>8300.0*RoomScale) {
												if (e.EventState2 < 5) {
													e.EventState2 = e.EventState2 + 1
												}
											}
											Exit()
										}
									}
									Exit()
								}
							}
						}
						SelectedItem.state=0
						//MsgTimer = 70 * 5
						SelectedItem = Null
					}
					
				case "badge":
					//[Block]
					if (SelectedItem.itemtemplate.img=0) {
						SelectedItem.itemtemplate.img=LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
						
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					DrawImage(SelectedItem.itemtemplate.img, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.img) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.img) / 2)
					
					if (SelectedItem.state = 0) {
						PlaySound_Strict (LoadTempSound("SFX/SCP/1162/NostalgiaCancer"+Rand(6,10)+".ogg"))
						switch (SelectedItem.itemtemplate.name) {
							case "Old Badge":
								Msg = Chr(34)+"Huh? This guy looks just like me!"+Chr(34)
								MsgTimer = 70*10
						}
						
						SelectedItem.state = 1
					}
					
				case "key":
					//[Block]
					if (SelectedItem.state = 0) {
						PlaySound_Strict (LoadTempSound("SFX/SCP/1162/NostalgiaCancer"+Rand(6,10)+".ogg"))
						
						Msg = Chr(34)+"Isn't this the key to that old shack? The one where I... No, it can't be."+Chr(34)
						MsgTimer = 70*10						
					}
					
					SelectedItem.state = 1
					SelectedItem = Null
					
				case "oldpaper":
					//[Block]
					if (SelectedItem.itemtemplate.img = 0) {
						SelectedItem.itemtemplate.img = LoadImage_Strict(SelectedItem.itemtemplate.imgpath)	
						SelectedItem.itemtemplate.img = ResizeImage2(SelectedItem.itemtemplate.img, ImageWidth(SelectedItem.itemtemplate.img) * MenuScale, ImageHeight(SelectedItem.itemtemplate.img) * MenuScale)
						
						MaskImage(SelectedItem.itemtemplate.img, 255, 0, 255)
					}
					
					DrawImage(SelectedItem.itemtemplate.img, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.img) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.img) / 2)
					
					if (SelectedItem.state = 0) {
						switch (SelectedItem.itemtemplate.name) {
							case "Disciplinary Hearing DH-S-4137-17092":
								BlurTimer = 1000
								
								Msg = Chr(34)+"Why does this seem so familiar?"+Chr(34)
								MsgTimer = 70*10
								PlaySound_Strict(LoadTempSound("SFX/SCP/1162/NostalgiaCancer"+Rand(6,10)+".ogg"))
								SelectedItem.state = 1
						}
					}
					
				case "coin":
					//[Block]
					if (SelectedItem.state = 0) {
						PlaySound_Strict(LoadTempSound("SFX/SCP/1162/NostalgiaCancer"+Rand(1,5)+".ogg"))
					}
					
					Msg = ""
					
					SelectedItem.state = 1
					DrawImage(SelectedItem.itemtemplate.invimg, GraphicWidth / 2 - ImageWidth(SelectedItem.itemtemplate.invimg) / 2, GraphicHeight / 2 - ImageHeight(SelectedItem.itemtemplate.invimg) / 2)
					
				case "scp427":
					//[Block]
					if (I_427.Using=1) {
						Msg = "You closed the locket."
						I_427.Using = False
					} else {
						GiveAchievement(Achv427)
						Msg = "You opened the locket."
						I_427.Using = True
					}
					MsgTimer = 70 * 5
					SelectedItem = Null
					
				case "pill":
					//[Block]
					if (CanUseItem(False, False, True)) {
						Msg = "You swallowed the pill."
						MsgTimer = 70*7
						
						RemoveItem(SelectedItem)
						SelectedItem = Null
					}	
					
				case "scp500death":
					//[Block]
					if (CanUseItem(False, False, True)) {
						Msg = "You swallowed the pill."
						MsgTimer = 70*7
						
						if (I_427.Timer < 70*360) {
							I_427.Timer = 70*360
						}
						
						RemoveItem(SelectedItem)
						SelectedItem = Null
					}
					
				default:
					//[Block]
					//check if the item is an inventory-type object
					if (SelectedItem.invSlots>0) {
						DoubleClick = 0
						MouseHit1 = 0
						MouseDown1 = 0
						LastMouseHit1 = 0
						OtherOpen = SelectedItem
						SelectedItem = Null
					}
					
					
			}
			
			if (SelectedItem != Null) {
				if (SelectedItem.itemtemplate.img != 0) {
					let IN: string = SelectedItem.itemtemplate.tempname
					if (IN == "paper" || IN == "badge" || IN == "oldpaper" || IN == "ticket") {
						for (a_it of Items.each) {
							if (a_it != SelectedItem) {
								let IN2: string = a_it.itemtemplate.tempname
								if (IN2 == "paper" || IN2 == "badge" || IN2 == "oldpaper" || IN2 == "ticket") {
									if (a_it.itemtemplate.img!=0) {
										if (a_it.itemtemplate.img != SelectedItem.itemtemplate.img) {
											FreeImage(a_it.itemtemplate.img)
											a_it.itemtemplate.img = 0
										}
									}
								}
							}
						}
					}
				}			
			}
			
			if (MouseHit2) {
				EntityAlpha (Dark, 0.0)
				
				IN = SelectedItem.itemtemplate.tempname
				if (IN == "scp1025") {
					if (SelectedItem.itemtemplate.img!=0) {
						FreeImage(SelectedItem.itemtemplate.img)
					}
					SelectedItem.itemtemplate.img=0
				} else if (IN == "firstaid" || IN == "finefirstaid" || IN == "firstaid2") {
					SelectedItem.state = 0
				} else if (IN == "vest" || IN == "finevest") {
					SelectedItem.state = 0
					if (!WearingVest) {
						DropItem(SelectedItem,False)
					}
				} else if (IN == "hazmatsuit" || IN == "hazmatsuit2" || IN == "hazmatsuit3") {
					SelectedItem.state = 0
					if (!WearingHazmat) {
						DropItem(SelectedItem,False)
					}
				} else if (IN == "scp1499" || IN == "super1499") {
					SelectedItem.state = 0
				}
				
				if (SelectedItem.itemtemplate.sound != 66) {
					PlaySound_Strict(PickSFX(SelectedItem.itemtemplate.sound))
				}
				SelectedItem = Null
			}
		}		
	}
	
	if (SelectedItem = Null) {
		for (i of range(7)) {
			if (RadioCHN(i) != 0) {
				if (ChannelPlaying(RadioCHN(i))) {
					PauseChannel(RadioCHN(i))
				}
			}
		}
	}
	
	for (it of Items.each) {
		if (it!=SelectedItem) {
			switch (it.itemtemplate.tempname) {
				case "firstaid","finefirstaid","firstaid2","vest","finevest","hazmatsuit","hazmatsuit2","hazmatsuit3","scp1499","super1499":
					it.state = 0
			}
		}
	}
	
	if (PrevInvOpen && (!InvOpen)) {
		MoveMouse(viewport_center_x, viewport_center_y)
	}
	
	CatchErrors("DrawGUI")
}

function DrawMenu() {
	CatchErrors("Uncaught (DrawMenu)")
	
	let x: int
	let y: int
	let width: int
	let height: int

	if (api_GetFocus() = 0) { //Game is out of focus -> pause the game
		if (!Using294) {
			MenuOpen = True
			PauseSounds()
		}
        Delay (1000) //Reduce the CPU take while game is not in focus
    }
	if (MenuOpen) {
				
		if (PlayerRoom.RoomTemplate.Name$ != "exit1" && PlayerRoom.RoomTemplate.Name$ != "gatea") {
			if (StopHidingTimer = 0) {
				if (EntityDistance(Curr173.Collider, Collider)<4.0 || EntityDistance(Curr106.Collider, Collider)<4.0) {
					StopHidingTimer = 1
				}	
			} else if (StopHidingTimer < 40) {
				if (KillTimer >= 0) {
					StopHidingTimer = StopHidingTimer+FPSfactor
					
					if (StopHidingTimer => 40) {
						PlaySound_Strict(HorrorSFX(15))
						Msg = "STOP HIDING"
						MsgTimer = 6*70
						MenuOpen = False
						return
					}
				}
			}
		}
		
		InvOpen = False
		
		width = ImageWidth(PauseMenuIMG)
		height = ImageHeight(PauseMenuIMG)
		x = GraphicWidth / 2 - width / 2
		y = GraphicHeight / 2 - height / 2
		
		DrawImage (PauseMenuIMG, x, y)
		
		Color(255, 255, 255)
		
		x = x+132*MenuScale
		y = y+122*MenuScale	
		
		if (!MouseDown1) {
			OnSliderID = 0
		}
		
		if (AchievementsMenu > 0) {
			AASetFont(Font2)
			AAText(x, y-(122-45)*MenuScale, "ACHIEVEMENTS",False,True)
			AASetFont(Font1)
		} else if (OptionsMenu > 0) {
			AASetFont(Font2)
			AAText(x, y-(122-45)*MenuScale, "OPTIONS",False,True)
			AASetFont(Font1)
		} else if (QuitMSG > 0) {
			AASetFont(Font2)
			AAText(x, y-(122-45)*MenuScale, "QUIT?",False,True)
			AASetFont(Font1)
		} else if (KillTimer >= 0) {
			AASetFont(Font2)
			AAText(x, y-(122-45)*MenuScale, "PAUSED",False,True)
			AASetFont(Font1)
		} else {
			AASetFont(Font2)
			AAText(x, y-(122-45)*MenuScale, "YOU DIED",False,True)
			AASetFont(Font1)
		}	
		
		let AchvXIMG: int = (x + (22*MenuScale))
		let scale: float = GraphicHeight/768.0
		let SeparationConst: int = 76*scale
		let imgsize: int = 64
		
		if (AchievementsMenu <= 0 && OptionsMenu <= 0 && QuitMSG <= 0) {
			AASetFont (Font1)
			AAText(x, y, "Difficulty: "+SelectedDifficulty.name)
			AAText(x, y+20*MenuScale, "Save: "+CurrSave)
			AAText(x, y+40*MenuScale, "Map seed: "+RandomSeed)
		} else if (AchievementsMenu <= 0 && OptionsMenu > 0 && QuitMSG <= 0 && KillTimer >= 0) {
			if (DrawButton(x + 101 * MenuScale, y + 390 * MenuScale, 230 * MenuScale, 60 * MenuScale, "Back")) {
				AchievementsMenu = 0
				OptionsMenu = 0
				QuitMSG = 0
				MouseHit1 = False
				SaveOptionsINI()
				
				AntiAlias (Opt_AntiAlias)
				TextureLodBias (TextureFloat)
			}
			
			Color (0,255,0)
			if (OptionsMenu = 1) {
				Rect(x-10*MenuScale,y-5*MenuScale,110*MenuScale,40*MenuScale,True)
			} else if (OptionsMenu = 2) {
				Rect(x+100*MenuScale,y-5*MenuScale,110*MenuScale,40*MenuScale,True)
			} else if (OptionsMenu = 3) {
				Rect(x+210*MenuScale,y-5*MenuScale,110*MenuScale,40*MenuScale,True)
			} else if (OptionsMenu = 4) {
				Rect(x+320*MenuScale,y-5*MenuScale,110*MenuScale,40*MenuScale,True)
			}
			
			if (DrawButton(x-5*MenuScale,y,100*MenuScale,30*MenuScale,"GRAPHICS",False)) {OptionsMenu = 1}
			if (DrawButton(x+105*MenuScale,y,100*MenuScale,30*MenuScale,"AUDIO",False)) {OptionsMenu = 2}
			if (DrawButton(x+215*MenuScale,y,100*MenuScale,30*MenuScale,"CONTROLS",False)) {OptionsMenu = 3}
			if (DrawButton(x+325*MenuScale,y,100*MenuScale,30*MenuScale,"ADVANCED",False)) {OptionsMenu = 4}
			
			let tx: float = (GraphicWidth/2)+(width/2)
			let ty: float = y
			let tw: float = 400*MenuScale
			let th: float = 150*MenuScale
			
			Color (255,255,255)
			switch (OptionsMenu) {
				case 1: //Graphics
					AASetFont (Font1)
					//[Block]
					y=y+50*MenuScale
					
					Color (100,100,100)
					AAText(x, y, "Enable bump mapping:")	
					BumpEnabled = DrawTick(x + 270 * MenuScale, y + MenuScale, BumpEnabled, True)
					if (MouseOn(x + 270 * MenuScale, y + MenuScale, 20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"bump")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "VSync:")
					Vsync = DrawTick(x + 270 * MenuScale, y + MenuScale, Vsync)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"vsync")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "Anti-aliasing:")
					Opt_AntiAlias = DrawTick(x + 270 * MenuScale, y + MenuScale, Opt_AntiAlias)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"antialias")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "Enable room lights:")
					EnableRoomLights = DrawTick(x + 270 * MenuScale, y + MenuScale, EnableRoomLights)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"roomlights")
					}
					
					y=y+30*MenuScale
					
					ScreenGamma = (SlideBar(x + 270*MenuScale, y+6*MenuScale, 100*MenuScale, ScreenGamma*50.0)/50.0)
					Color (255,255,255)
					AAText(x, y, "Screen gamma")
					if (MouseOn(x+270*MenuScale,y+6*MenuScale,100*MenuScale+14,20) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"gamma",ScreenGamma)
					}
					
					//y = y + 50*MenuScale
					
					y=y+50*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Particle amount:")
					ParticleAmount = Slider3(x+270*MenuScale,y+6*MenuScale,100*MenuScale,ParticleAmount,2,"MINIMAL","REDUCED","FULL")
					if ((MouseOn(x + 270 * MenuScale, y-6*MenuScale, 100*MenuScale+14, 20) && OnSliderID == 0) || OnSliderID == 2) {
						DrawOptionsTooltip(tx,ty,tw,th,"particleamount",ParticleAmount)
					}
					
					y=y+50*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Texture LOD Bias:")
					TextureDetails = Slider5(x+270*MenuScale,y+6*MenuScale,100*MenuScale,TextureDetails,3,"0.8","0.4","0.0","-0.4","-0.8")
					switch (TextureDetails) {
						case 0:
							TextureFloat = 0.8
						case 1:
							TextureFloat = 0.4
						case 2:
							TextureFloat = 0.0
						case 3:
							TextureFloat = -0.4
						case 4:
							TextureFloat = -0.8
					}
					TextureLodBias (TextureFloat)
					if ((MouseOn(x+270*MenuScale,y-6*MenuScale,100*MenuScale+14,20) && OnSliderID == 0) || OnSliderID == 3) {
						DrawOptionsTooltip(tx,ty,tw,th+100*MenuScale,"texquality")
					}
					
					y=y+50*MenuScale
					Color(100,100,100)
					AAText(x, y, "Save textures in the VRAM:")	
					EnableVRam = DrawTick(x + 270 * MenuScale, y + MenuScale, EnableVRam, True)
					if (MouseOn(x + 270 * MenuScale, y + MenuScale, 20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"vram")
					}
					
					
				case 2: //Audio
					AASetFont (Font1)
					//[Block]
					y = y + 50*MenuScale
					
					MusicVolume = (SlideBar(x + 250*MenuScale, y-4*MenuScale, 100*MenuScale, MusicVolume*100.0)/100.0)
					Color (255,255,255)
					AAText(x, y, "Music volume:")
					if (MouseOn(x+250*MenuScale,y-4*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"musicvol",MusicVolume)
					}
					
					y = y + 30*MenuScale
					
					PrevSFXVolume = (SlideBar(x + 250*MenuScale, y-4*MenuScale, 100*MenuScale, SFXVolume*100.0)/100.0)
					if (!DeafPlayer) {
						SFXVolume = PrevSFXVolume
					}
					Color(255,255,255)
					AAText(x, y, "Sound volume:")
					if (MouseOn(x+250*MenuScale,y-4*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"soundvol",PrevSFXVolume)
					}
					
					y = y + 30*MenuScale
					
					Color (100,100,100)
					AAText (x, y, "Sound auto-release:")
					EnableSFXRelease = DrawTick(x + 270 * MenuScale, y + MenuScale, EnableSFXRelease,True)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th+220*MenuScale,"sfxautorelease")
					}
					
					y = y + 30*MenuScale
					
					Color (100,100,100)
					AAText (x, y, "Enable user tracks:")
					EnableUserTracks = DrawTick(x + 270 * MenuScale, y + MenuScale, EnableUserTracks,True)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"usertrack")
					}
					
					if (EnableUserTracks) {
						y = y + 30 * MenuScale
						Color (255,255,255)
						AAText (x, y, "User track mode:")
						UserTrackMode = DrawTick(x + 270 * MenuScale, y + MenuScale, UserTrackMode)
						if (UserTrackMode) {
							AAText(x, y + 20 * MenuScale, "Repeat")
						} else {
							AAText(x, y + 20 * MenuScale, "Random")
						}
						if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
							DrawOptionsTooltip(tx,ty,tw,th,"usertrackmode")
						}
					}
					
				case 3: //Controls:
					AASetFont (Font1)
					//[Block]
					y = y + 50*MenuScale
					
					MouseSens = (SlideBar(x + 270*MenuScale, y-4*MenuScale, 100*MenuScale, (MouseSens+0.5)*100.0)/100.0)-0.5
					Color(255, 255, 255)
					AAText(x, y, "Mouse sensitivity:")
					if (MouseOn(x+270*MenuScale,y-4*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mousesensitivity",MouseSens)
					}
					
					y = y + 30*MenuScale
					
					Color(255, 255, 255)
					AAText(x, y, "Invert mouse Y-axis:")
					InvertMouse = DrawTick(x + 270 * MenuScale, y + MenuScale, InvertMouse)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mouseinvert")
					}
					
					y = y + 40*MenuScale
					
					MouseSmooth = (SlideBar(x + 270*MenuScale, y-4*MenuScale, 100*MenuScale, (MouseSmooth)*50.0)/50.0)
					Color(255, 255, 255)
					AAText(x, y, "Mouse smoothing:")
					if (MouseOn(x+270*MenuScale,y-4*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mousesmoothing",MouseSmooth)
					}
					
					Color(255, 255, 255)
					
					y = y + 30*MenuScale
					AAText(x, y, "Control configuration:")
					y = y + 10*MenuScale
					
					AAText(x, y + 20 * MenuScale, "Move Forward")
					InputBox(x + 200 * MenuScale, y + 20 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_UP,210)),5)		
					AAText(x, y + 40 * MenuScale, "Strafe Left")
					InputBox(x + 200 * MenuScale, y + 40 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_LEFT,210)),3)	
					AAText(x, y + 60 * MenuScale, "Move Backward")
					InputBox(x + 200 * MenuScale, y + 60 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_DOWN,210)),6)				
					AAText(x, y + 80 * MenuScale, "Strafe Right")
					InputBox(x + 200 * MenuScale, y + 80 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_RIGHT,210)),4)
					
					AAText(x, y + 100 * MenuScale, "Manual Blink")
					InputBox(x + 200 * MenuScale, y + 100 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_BLINK,210)),7)				
					AAText(x, y + 120 * MenuScale, "Sprint")
					InputBox(x + 200 * MenuScale, y + 120 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_SPRINT,210)),8)
					AAText(x, y + 140 * MenuScale, "Open/Close Inventory")
					InputBox(x + 200 * MenuScale, y + 140 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_INV,210)),9)
					AAText(x, y + 160 * MenuScale, "Crouch")
					InputBox(x + 200 * MenuScale, y + 160 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_CROUCH,210)),10)
					AAText(x, y + 180 * MenuScale, "Quick Save")
					InputBox(x + 200 * MenuScale, y + 180 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_SAVE,210)),11)	
					AAText(x, y + 200 * MenuScale, "Open/Close Console")
					InputBox(x + 200 * MenuScale, y + 200 * MenuScale,100*MenuScale,20*MenuScale,KeyName(Min(KEY_CONSOLE,210)),12)
					
					if (MouseOn(x,y,300*MenuScale,220*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"controls")
					}
					
					for (i of range(228)) {
						if (KeyHit(i)) {
							key = i
							Exit()
						}
					}
					if (key != 0) {
						switch (SelectedInputBox) {
							case 3:
								KEY_LEFT = key
							case 4:
								KEY_RIGHT = key
							case 5:
								KEY_UP = key
							case 6:
								KEY_DOWN = key
							case 7:
								KEY_BLINK = key
							case 8:
								KEY_SPRINT = key
							case 9:
								KEY_INV = key
							case 10:
								KEY_CROUCH = key
							case 11:
								KEY_SAVE = key
							case 12:
								KEY_CONSOLE = key
						}
						SelectedInputBox = 0
					}
					
				case 4: //Advanced:
					AASetFont (Font1)
					//[Block]
					y = y + 50*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "Show HUD:")	
					HUDenabled = DrawTick(x + 270 * MenuScale, y + MenuScale, HUDenabled)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"hud")
					}
					
					y = y + 30*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "Enable console:")
					CanOpenConsole = DrawTick(x +270 * MenuScale, y + MenuScale, CanOpenConsole)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"consoleenable")
					}
					
					y = y + 30*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Open console on error:")
					ConsoleOpening = DrawTick(x + 270 * MenuScale, y + MenuScale, ConsoleOpening)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"consoleerror")
					}
					
					y = y + 50*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Achievement popups:")
					AchvMSGenabled = DrawTick(x + 270 * MenuScale, y, AchvMSGenabled)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"achpopup")
					}
					
					y = y + 50*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Show FPS:")
					ShowFPS = DrawTick(x + 270 * MenuScale, y, ShowFPS)
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"showfps")
					}
					
					y = y + 30*MenuScale
					
					Color(255,255,255)
					AAText(x, y, "Framelimit:")
					
					Color(255,255,255)
					if (DrawTick(x + 270 * MenuScale, y, CurrFrameLimit > 0.0)) {
						CurrFrameLimit = (SlideBar(x + 150*MenuScale, y+30*MenuScale, 100*MenuScale, CurrFrameLimit*99.0)/99.0)
						CurrFrameLimit = Max(CurrFrameLimit, 0.01)
						Framelimit = 19+(CurrFrameLimit*100.0)
						Color (255,255,0)
						AAText(x + 5 * MenuScale, y + 25 * MenuScale, Framelimit%+" FPS")
					} else {
						CurrFrameLimit = 0.0
						Framelimit = 0
					}
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"framelimit",Framelimit)
					}
					if (MouseOn(x+150*MenuScale,y+30*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"framelimit",Framelimit)
					}
					
					y = y + 80*MenuScale
					
					Color (255,255,255)
					AAText(x, y, "Antialiased text:")
					AATextEnable = DrawTick(x + 270 * MenuScale, y + MenuScale, AATextEnable)
					if (AATextEnable_Prev != AATextEnable) {
						for (font of AAFont.each) {
							FreeFont (font.lowResFont)
							if (!AATextEnable) {
								FreeTexture (font.texture)
								FreeImage (font.backup)
							}
							Delete (font)
						}
						if (!AATextEnable) {
							FreeEntity (AATextCam)
						}
						InitAAFont()
						Font1 = AALoadFont("GFX/font/cour/Courier New.ttf", Int(18 * (GraphicHeight / 1024.0)), 0,0,0)
						Font2 = AALoadFont("GFX/font/courbd/Courier New.ttf", Int(58 * (GraphicHeight / 1024.0)), 0,0,0)
						Font3 = AALoadFont("GFX/font/DS-DIGI/DS-Digital.ttf", Int(22 * (GraphicHeight / 1024.0)), 0,0,0)
						Font4 = AALoadFont("GFX/font/DS-DIGI/DS-Digital.ttf", Int(60 * (GraphicHeight / 1024.0)), 0,0,0)
						Font5 = AALoadFont("GFX/font/Journal/Journal.ttf", Int(58 * (GraphicHeight / 1024.0)), 0,0,0)
						ConsoleFont = AALoadFont("Blitz", Int(22 * (GraphicHeight / 1024.0)), 0,0,0,1)
						AATextEnable_Prev = AATextEnable
					}
					if (MouseOn(x+270*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"antialiastext")
					}
					
			}
		} else if (AchievementsMenu <= 0 && OptionsMenu <= 0 && QuitMSG > 0 && KillTimer >= 0) {
			let QuitButton: int = 60 
			if (SelectedDifficulty.saveType == SAVEONQUIT || SelectedDifficulty.saveType == SAVEANYWHERE) {
				let RN: string = PlayerRoom.RoomTemplate.Name$
				let AbleToSave: boolean = True
				if (RN == "173" || RN == "exit1" || RN == "gatea") {AbleToSave = False}
				if (!CanSave) {AbleToSave = False}
				if (AbleToSave) {
					QuitButton = 140
					if (DrawButton(x, y + 60*MenuScale, 390*MenuScale, 60*MenuScale, "Save & Quit")) {
						DropSpeed = 0
						SaveGame(SavePath + CurrSave + "/")
						NullGame()
						MenuOpen = False
						MainMenuOpen = True
						MainMenuTab = 0
						CurrSave = ""
						FlushKeys()
					}
				}
			}
			
			if (DrawButton(x, y + QuitButton*MenuScale, 390*MenuScale, 60*MenuScale, "Quit")) {
				NullGame()
				MenuOpen = False
				MainMenuOpen = True
				MainMenuTab = 0
				CurrSave = ""
				FlushKeys()
			}
			
			if (DrawButton(x+101*MenuScale, y + 344*MenuScale, 230*MenuScale, 60*MenuScale, "Back")) {
				AchievementsMenu = 0
				OptionsMenu = 0
				QuitMSG = 0
				MouseHit1 = False
			}
		} else {
			if (DrawButton(x+101*MenuScale, y + 344*MenuScale, 230*MenuScale, 60*MenuScale, "Back")) {
				AchievementsMenu = 0
				OptionsMenu = 0
				QuitMSG = 0
				MouseHit1 = False
			}
			
			if (AchievementsMenu>0) {
				if (AchievementsMenu <= Floor(Float(MAXACHIEVEMENTS-1)/12.0)) { 
					if (DrawButton(x+341*MenuScale, y + 344*MenuScale, 50*MenuScale, 60*MenuScale, ">")) {
						AchievementsMenu = AchievementsMenu+1
					}
				}
				if (AchievementsMenu > 1) {
					if (DrawButton(x+41*MenuScale, y + 344*MenuScale, 50*MenuScale, 60*MenuScale, "<")) {
						AchievementsMenu = AchievementsMenu-1
					}
				}
				
				for (i of range(12)) {
					if (i+((AchievementsMenu-1)*12)<MAXACHIEVEMENTS) {
						DrawAchvIMG(AchvXIMG,y+((i/4)*120*MenuScale),i+((AchievementsMenu-1)*12))
					} else {
						Exit()
					}
				}
				
				for (i of range(12)) {
					if (i+((AchievementsMenu-1)*12)<MAXACHIEVEMENTS) {
						if (MouseOn(AchvXIMG+((i % 4)*SeparationConst),y+((i/4)*120*MenuScale),64*scale,64*scale)) {
							AchievementTooltip(i+((AchievementsMenu-1)*12))
							Exit()
						}
					} else {
						Exit()
					}
				}
				
			}
		}
		
		y = y+10
		
		if (AchievementsMenu<=0 && OptionsMenu<=0 && QuitMSG<=0) {
			if (KillTimer >= 0) {	
				
				y = y+ 72*MenuScale
				
				if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Resume", True, True)) {
					MenuOpen = False
					ResumeSounds()
					MouseXSpeed()
					MouseYSpeed()
					MouseZSpeed()
					mouse_x_speed_1=0.0
					mouse_y_speed_1=0.0
				}
				
				y = y + 75*MenuScale
				if (!SelectedDifficulty.permaDeath) {
					if (GameSaved) {
						if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Load Game")) {
							DrawLoading(0)
							
							MenuOpen = False
							LoadGameQuick(SavePath + CurrSave + "/")
							
							MoveMouse (viewport_center_x,viewport_center_y)
							AASetFont (Font1)
							HidePointer ()
							
							FlushKeys()
							FlushMouse()
							Playable=True
							
							UpdateRooms()
							
							for (r of Rooms.each) {
								x = Abs(EntityX(Collider) - EntityX(r.obj))
								z = Abs(EntityZ(Collider) - EntityZ(r.obj))
								
								if (x < 12.0 && z < 12.0) {
									MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)) = Max(MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)), 1)
									if (x < 4.0 && z < 4.0) {
										if (Abs(EntityY(Collider) - EntityY(r.obj)) < 1.5) {PlayerRoom = r}
										MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)) = 1
									}
								}
							}
							
							DrawLoading(100)
							
							DropSpeed=0
							
							UpdateWorld (0.0)
							
							PrevTime = MilliSecs()
							FPSfactor = 0
							
							ResetInput()
						}
					} else {
						DrawFrame(x,y,390*MenuScale, 60*MenuScale)
						Color (100, 100, 100)
						AASetFont (Font2)
						AAText(x + (390*MenuScale) / 2, y + (60*MenuScale) / 2, "Load Game", True, True)
					}
					y = y + 75*MenuScale
				}
				
				if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Achievements")) {AchievementsMenu = 1}
				y = y + 75*MenuScale
				if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Options")) {OptionsMenu = 1}
				y = y + 75*MenuScale
			} else {
				y = y+104*MenuScale
				if (GameSaved && (!SelectedDifficulty.permaDeath)) {
					if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Load Game")) {
						DrawLoading(0)
						
						MenuOpen = False
						LoadGameQuick(SavePath + CurrSave + "/")
						
						MoveMouse (viewport_center_x,viewport_center_y)
						AASetFont (Font1)
						HidePointer ()
						
						FlushKeys()
						FlushMouse()
						Playable=True
						
						UpdateRooms()
						
						for (r of Rooms.each) {
							x = Abs(EntityX(Collider) - EntityX(r.obj))
							z = Abs(EntityZ(Collider) - EntityZ(r.obj))
							
							if (x < 12.0 && z < 12.0) {
								MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)) = Max(MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)), 1)
								if (x < 4.0 && z < 4.0) {
									if (Abs(EntityY(Collider) - EntityY(r.obj)) < 1.5) {PlayerRoom = r}
									MapFound(Floor(EntityX(r.obj) / 8.0), Floor(EntityZ(r.obj) / 8.0)) = 1
								}
							}
						}
						
						DrawLoading(100)
						
						DropSpeed=0
						
						UpdateWorld (0.0)
						
						PrevTime = MilliSecs()
						FPSfactor = 0
						
						ResetInput()
					}
				} else {
					DrawButton(x, y, 390*MenuScale, 60*MenuScale, "")
					Color (50,50,50)
					AAText(x + 185*MenuScale, y + 30*MenuScale, "Load Game", True, True)
				}
				if (DrawButton(x, y + 80*MenuScale, 390*MenuScale, 60*MenuScale, "Quit to Menu")) {
					NullGame()
					MenuOpen = False
					MainMenuOpen = True
					MainMenuTab = 0
					CurrSave = ""
					FlushKeys()
				}
				y= y + 80*MenuScale
			}
			
			if (KillTimer >= 0 && (!MainMenuOpen)) {
				if (DrawButton(x, y, 390*MenuScale, 60*MenuScale, "Quit")) {
					QuitMSG = 1
				}
			}
			
			AASetFont (Font1)
			if (KillTimer < 0) {RowText(DeathMSG$, x, y + 80*MenuScale, 390*MenuScale, 600*MenuScale)}
		}
		
		if (Fullscreen) {DrawImage (CursorIMG, ScaledMouseX(),ScaledMouseY())}
		
	}
	
	AASetFont (Font1)
	
	CatchErrors("DrawMenu")
}

function MouseOn(x: int, y: int, width: int, height: int): int {
	if (ScaledMouseX() > x & ScaledMouseX() < x + width) {
		if (ScaledMouseY() > y & ScaledMouseY() < y + height) {
			return True
		}
	}
	return False
}

//----------------------------------------------------------------------------------------------

import "LoadAllSounds.ts"

function LoadEntities() {
	CatchErrors("Uncaught (LoadEntities)")
	DrawLoading(0)
	
	let i: int
	
	for (i of range(10)) {
		TempSounds[i]=0
	}
	
	PauseMenuIMG = LoadImage_Strict("GFX/menu/pausemenu.jpg")
	MaskImage (PauseMenuIMG, 255,255,0)
	ScaleImage (PauseMenuIMG,MenuScale,MenuScale)
	
	SprintIcon = LoadImage_Strict("GFX/sprinticon.png")
	BlinkIcon = LoadImage_Strict("GFX/blinkicon.png")
	CrouchIcon = LoadImage_Strict("GFX/sneakicon.png")
	HandIcon = LoadImage_Strict("GFX/handsymbol.png")
	HandIcon2 = LoadImage_Strict("GFX/handsymbol2.png")

	StaminaMeterIMG = LoadImage_Strict("GFX/staminameter.jpg")

	KeypadHUD =  LoadImage_Strict("GFX/keypadhud.jpg")
	MaskImage(KeypadHUD, 255,0,255)

	Panel294 = LoadImage_Strict("GFX/294panel.jpg")
	MaskImage(Panel294, 255,0,255)
	
	
	Brightness = GetINIFloat("options.ini", "options", "brightness")
	CameraFogNear = GetINIFloat("options.ini", "options", "camera fog near")
	CameraFogFar = GetINIFloat("options.ini", "options", "camera fog far")
	StoredCameraFogFar = CameraFogFar
		
	AmbientLightRoomTex = CreateTexture(2,2,257)
	TextureBlend (AmbientLightRoomTex,5)
	SetBuffer(TextureBuffer(AmbientLightRoomTex))
	ClsColor (0,0,0)
	Cls()
	SetBuffer (BackBuffer())
	AmbientLightRoomVal = 0
	
	SoundEmitter = CreatePivot()
	
	Camera = CreateCamera()
	CameraViewport (Camera,0,0,GraphicWidth,GraphicHeight)
	CameraRange(Camera, 0.05, CameraFogFar)
	CameraFogMode (Camera, 1)
	CameraFogRange (Camera, CameraFogNear, CameraFogFar)
	CameraFogColor (Camera, GetINIInt("options.ini", "options", "fog r"), GetINIInt("options.ini", "options", "fog g"), GetINIInt("options.ini", "options", "fog b"))
	AmbientLight (Brightness, Brightness, Brightness)
	
	ScreenTexs[0] = CreateTexture(512, 512, 1+256)
	ScreenTexs[1] = CreateTexture(512, 512, 1+256)
	
	CreateBlurImage()
	CameraProjMode (ark_blur_cam,0)
	
	FogTexture = LoadTexture_Strict("GFX/fog.jpg", 1)
	
	Fog = CreateSprite(ark_blur_cam)
	ScaleSprite(Fog, Max(GraphicWidth / 1240.0, 1.0), Max(GraphicHeight / 960.0 * 0.8, 0.8))
	EntityTexture(Fog, FogTexture)
	EntityBlend (Fog, 2)
	EntityOrder (Fog, -1000)
	MoveEntity(Fog, 0, 0, 1.0)
	
	GasMaskTexture = LoadTexture_Strict("GFX/GasmaskOverlay.jpg", 1)
	GasMaskOverlay = CreateSprite(ark_blur_cam)
	ScaleSprite(GasMaskOverlay, Max(GraphicWidth / 1024.0, 1.0), Max(GraphicHeight / 1024.0 * 0.8, 0.8))
	EntityTexture(GasMaskOverlay, GasMaskTexture)
	EntityBlend (GasMaskOverlay, 2)
	EntityFX(GasMaskOverlay, 1)
	EntityOrder (GasMaskOverlay, -1003)
	MoveEntity(GasMaskOverlay, 0, 0, 1.0)
	HideEntity(GasMaskOverlay)
	
	InfectTexture = LoadTexture_Strict("GFX/InfectOverlay.jpg", 1)
	InfectOverlay = CreateSprite(ark_blur_cam)
	ScaleSprite(InfectOverlay, Max(GraphicWidth / 1024.0, 1.0), Max(GraphicHeight / 1024.0 * 0.8, 0.8))
	EntityTexture(InfectOverlay, InfectTexture)
	EntityBlend (InfectOverlay, 3)
	EntityFX(InfectOverlay, 1)
	EntityOrder (InfectOverlay, -1003)
	MoveEntity(InfectOverlay, 0, 0, 1.0)
	HideEntity(InfectOverlay)
	
	NVTexture = LoadTexture_Strict("GFX/NightVisionOverlay.jpg", 1)
	NVOverlay = CreateSprite(ark_blur_cam)
	ScaleSprite(NVOverlay, Max(GraphicWidth / 1024.0, 1.0), Max(GraphicHeight / 1024.0 * 0.8, 0.8))
	EntityTexture(NVOverlay, NVTexture)
	EntityBlend (NVOverlay, 2)
	EntityFX(NVOverlay, 1)
	EntityOrder (NVOverlay, -1003)
	MoveEntity(NVOverlay, 0, 0, 1.0)
	HideEntity(NVOverlay)
	NVBlink = CreateSprite(ark_blur_cam)
	ScaleSprite(NVBlink, Max(GraphicWidth / 1024.0, 1.0), Max(GraphicHeight / 1024.0 * 0.8, 0.8))
	EntityColor(NVBlink,0,0,0)
	EntityFX(NVBlink, 1)
	EntityOrder (NVBlink, -1005)
	MoveEntity(NVBlink, 0, 0, 1.0)
	HideEntity(NVBlink)
	
	FogNVTexture = LoadTexture_Strict("GFX/fogNV.jpg", 1)
	
	DrawLoading(5)
	
	DarkTexture = CreateTexture(1024, 1024, 1 + 2)
	SetBuffer (TextureBuffer(DarkTexture))
	Cls
	SetBuffer (BackBuffer())
	
	Dark = CreateSprite(Camera)
	ScaleSprite(Dark, Max(GraphicWidth / 1240.0, 1.0), Max(GraphicHeight / 960.0 * 0.8, 0.8))
	EntityTexture(Dark, DarkTexture)
	EntityBlend (Dark, 1)
	EntityOrder (Dark, -1002)
	MoveEntity(Dark, 0, 0, 1.0)
	EntityAlpha (Dark, 0.0)
	
	LightTexture = CreateTexture(1024, 1024, 1 + 2+256)
	SetBuffer (TextureBuffer(LightTexture))
	ClsColor (255, 255, 255)
	Cls
	ClsColor (0, 0, 0)
	SetBuffer (BackBuffer())
	
	TeslaTexture = LoadTexture_Strict("GFX/map/tesla.jpg", 1+2)
	
	Light = CreateSprite(Camera)
	ScaleSprite(Light, Max(GraphicWidth / 1240.0, 1.0), Max(GraphicHeight / 960.0 * 0.8, 0.8))
	EntityTexture(Light, LightTexture)
	EntityBlend (Light, 1)
	EntityOrder (Light, -1002)
	MoveEntity(Light, 0, 0, 1.0)
	HideEntity (Light)
	
	Collider = CreatePivot()
	EntityRadius (Collider, 0.15, 0.30)
	EntityPickMode(Collider, 1)
	EntityType (Collider, HIT_PLAYER)
	
	Head = CreatePivot()
	EntityRadius (Head, 0.15)
	EntityType (Head, HIT_PLAYER)
	
	
	LiquidObj = LoadMesh_Strict("GFX/items/cupliquid.x") //optimized the cups dispensed by 294
	HideEntity (LiquidObj)
	
	MTFObj = LoadAnimMesh_Strict("GFX/npcs/MTF2.b3d") //optimized MTFs
	GuardObj = LoadAnimMesh_Strict("GFX/npcs/guard.b3d") //optimized Guards
		
	ClassDObj = LoadAnimMesh_Strict("GFX/npcs/classd.b3d") //optimized Class-D's and scientists/researchers
	ApacheObj = LoadAnimMesh_Strict("GFX/apache.b3d") //optimized Apaches (helicopters)
	ApacheRotorObj = LoadAnimMesh_Strict("GFX/apacherotor.b3d") //optimized the Apaches even more
	
	HideEntity(MTFObj)
	HideEntity(GuardObj)
	HideEntity(ClassDObj)
	HideEntity(ApacheObj)
	HideEntity(ApacheRotorObj)
	
	//Other NPCs pre-loaded
	NPC049OBJ = LoadAnimMesh_Strict("GFX/npcs/scp-049.b3d")
	HideEntity(NPC049OBJ)
	NPC0492OBJ = LoadAnimMesh_Strict("GFX/npcs/zombie1.b3d")
	HideEntity(NPC0492OBJ)
	ClerkOBJ = LoadAnimMesh_Strict("GFX/npcs/clerk.b3d")
	HideEntity(ClerkOBJ	)
	
	LightSpriteTex(0) = LoadTexture_Strict("GFX/light1.jpg", 1)
	LightSpriteTex(1) = LoadTexture_Strict("GFX/light2.jpg", 1)
	LightSpriteTex(2) = LoadTexture_Strict("GFX/lightsprite.jpg",1)
	
	DrawLoading(10)
	
	DoorOBJ = LoadMesh_Strict("GFX/map/door01.x")
	HideEntity(DoorOBJ)
	DoorFrameOBJ = LoadMesh_Strict("GFX/map/doorframe.x")
	HideEntity(DoorFrameOBJ)
	
	HeavyDoorObj(0) = LoadMesh_Strict("GFX/map/heavydoor1.x")
	HideEntity(HeavyDoorObj(0))
	HeavyDoorObj(1) = LoadMesh_Strict("GFX/map/heavydoor2.x")
	HideEntity(HeavyDoorObj(1))
	
	DoorColl = LoadMesh_Strict("GFX/map/doorcoll.x")
	HideEntity(DoorColl)
	
	ButtonOBJ = LoadMesh_Strict("GFX/map/Button.x")
	HideEntity(ButtonOBJ)
	ButtonKeyOBJ = LoadMesh_Strict("GFX/map/ButtonKeycard.x")
	HideEntity(ButtonKeyOBJ)
	ButtonCodeOBJ = LoadMesh_Strict("GFX/map/ButtonCode.x")
	HideEntity(ButtonCodeOBJ	)
	ButtonScannerOBJ = LoadMesh_Strict("GFX/map/ButtonScanner.x")
	HideEntity(ButtonScannerOBJ	)
	
	BigDoorOBJ(0) = LoadMesh_Strict("GFX/map/ContDoorLeft.x")
	HideEntity(BigDoorOBJ(0))
	BigDoorOBJ(1) = LoadMesh_Strict("GFX/map/ContDoorRight.x")
	HideEntity(BigDoorOBJ(1))
	
	LeverBaseOBJ = LoadMesh_Strict("GFX/map/leverbase.x")
	HideEntity (LeverBaseOBJ)
	LeverOBJ = LoadMesh_Strict("GFX/map/leverhandle.x")
	HideEntity (LeverOBJ)
		
	DrawLoading(15)
	
	for (i of range(6)) {
		GorePics(i) = LoadTexture_Strict("GFX/895pics/pic" + (i + 1) + ".jpg")
	}
	
	OldAiPics(0) = LoadTexture_Strict("GFX/AIface.jpg")
	OldAiPics(1) = LoadTexture_Strict("GFX/AIface2.jpg")	
	
	DrawLoading(20)
	
	for (i of range(0, 6 + 1)) {
		DecalTextures(i) = LoadTexture_Strict("GFX/decal" + (i + 1) + ".png", 1 + 2)
	}
	DecalTextures(7) = LoadTexture_Strict("GFX/items/INVpaperstrips.jpg", 1 + 2)
	for (i of range(8, 12 + 1)) {
		DecalTextures(i) = LoadTexture_Strict("GFX/decalpd"+(i-7)+".jpg", 1 + 2)	
	}
	for (i of range(13, 14 + 1)) {
		DecalTextures(i) = LoadTexture_Strict("GFX/bullethole"+(i-12)+".jpg", 1 + 2)	
	}
	for (i of range(15, 16 + 1)) {
		DecalTextures(i) = LoadTexture_Strict("GFX/blooddrop"+(i-14)+".png", 1 + 2)	
	}
	DecalTextures(17) = LoadTexture_Strict("GFX/decal8.png", 1 + 2)	
	DecalTextures(18) = LoadTexture_Strict("GFX/decalpd6.dc", 1 + 2)	
	DecalTextures(19) = LoadTexture_Strict("GFX/decal19.png", 1 + 2)
	DecalTextures(20) = LoadTexture_Strict("GFX/decal427.png", 1 + 2)
	
	DrawLoading(25)
	
	Monitor = LoadMesh_Strict("GFX/map/monitor.b3d")
	HideEntity (Monitor)
	MonitorTexture = LoadTexture_Strict("GFX/monitortexture.jpg")
	
	CamBaseOBJ = LoadMesh_Strict("GFX/map/cambase.x")
	HideEntity(CamBaseOBJ)
	CamOBJ = LoadMesh_Strict("GFX/map/CamHead.b3d")
	HideEntity(CamOBJ)
	
	Monitor2 = LoadMesh_Strict("GFX/map/monitor_checkpoint.b3d")
	HideEntity (Monitor2)
	Monitor3 = LoadMesh_Strict("GFX/map/monitor_checkpoint.b3d")
	HideEntity (Monitor3)
	MonitorTexture2 = LoadTexture_Strict("GFX/map/LockdownScreen2.jpg")
	MonitorTexture3 = LoadTexture_Strict("GFX/map/LockdownScreen.jpg")
	MonitorTexture4 = LoadTexture_Strict("GFX/map/LockdownScreen3.jpg")
	MonitorTextureOff = CreateTexture(1,1)
	SetBuffer (TextureBuffer(MonitorTextureOff))
	ClsColor (0,0,0)
	Cls
	SetBuffer (BackBuffer())
	LightConeModel = LoadMesh_Strict("GFX/lightcone.b3d")
	HideEntity (LightConeModel)
	
	for (i of range(2, CountSurfaces(Monitor2) + 1)) {
		sf = GetSurface(Monitor2,i)
		b = GetSurfaceBrush(sf)
		if (b!=0) {
			t1 = GetBrushTexture(b,0)
			if (t1!=0) {
				name$ = StripPath(TextureName(t1))
				if (Lower(name) != "monitortexture.jpg") {
					BrushTexture (b, MonitorTextureOff, 0, 0)
					PaintSurface (sf,b)
				}
				if (name!="") {
					FreeTexture (t1)
				}
			}
			FreeBrush (b)
		}
	}
	for (i of range(2, CountSurfaces(Monitor3) + 1)) {
		sf = GetSurface(Monitor3,i)
		b = GetSurfaceBrush(sf)
		if (b!=0) {
			t1 = GetBrushTexture(b,0)
			if (t1!=0) {
				name$ = StripPath(TextureName(t1))
				if (Lower(name) != "monitortexture.jpg") {
					BrushTexture (b, MonitorTextureOff, 0, 0)
					PaintSurface (sf,b)
				}
				if (name!="") {FreeTexture (t1)}
			}
			FreeBrush (b)
		}
	}
	
	UserTrackMusicAmount = 0
	if (EnableUserTracks) {
		let dirPath: string = "SFX/Radio/UserTracks/"
		if (FileType(dirPath)!=2) {
			CreateDir(dirPath)
		}
		
		let Dir: int = ReadDir("SFX/Radio/UserTracks/")
		while (true) {
			file$=NextFile(Dir)
			if (file="") {
				Exit()
			}
			if (FileType("SFX/Radio/UserTracks/"+file$) = 1) {
				test = LoadSound("SFX/Radio/UserTracks/"+file$)
				if (test!=0) {
					UserTrackName(UserTrackMusicAmount) = file$
					UserTrackMusicAmount = UserTrackMusicAmount + 1
				}
				FreeSound (test)
			}
		}
		CloseDir (Dir)
	}
	if (EnableUserTracks) {
		DebugLog ("User Tracks found: "+UserTrackMusicAmount)
	}
	
	InitItemTemplates()
	
	ParticleTextures(0) = LoadTexture_Strict("GFX/smoke.png", 1 + 2)
	ParticleTextures(1) = LoadTexture_Strict("GFX/flash.jpg", 1 + 2)
	ParticleTextures(2) = LoadTexture_Strict("GFX/dust.jpg", 1 + 2)
	ParticleTextures(3) = LoadTexture_Strict("GFX/npcs/hg.pt", 1 + 2)
	ParticleTextures(4) = LoadTexture_Strict("GFX/map/sun.jpg", 1 + 2)
	ParticleTextures(5) = LoadTexture_Strict("GFX/bloodsprite.png", 1 + 2)
	ParticleTextures(6) = LoadTexture_Strict("GFX/smoke2.png", 1 + 2)
	ParticleTextures(7) = LoadTexture_Strict("GFX/spark.jpg", 1 + 2)
	ParticleTextures(8) = LoadTexture_Strict("GFX/particle.png", 1 + 2)
	
	SetChunkDataValues()
	
	//NPCtypeD - different models with different textures (loaded using "CopyEntity") - ENDSHN
	//[Block]
	for (i of range(1, MaxDTextures + 1)) {
		DTextures[i] = CopyEntity(ClassDObj)
		HideEntity (DTextures[i])
	}
	//Gonzales
	tex = LoadTexture_Strict("GFX/npcs/gonzales.jpg")
	EntityTexture (DTextures[1],tex)
	FreeTexture (tex)
	//SCP-970 corpse
	tex = LoadTexture_Strict("GFX/npcs/corpse.jpg")
	EntityTexture (DTextures[2],tex)
	FreeTexture (tex)
	//scientist 1
	tex = LoadTexture_Strict("GFX/npcs/scientist.jpg")
	EntityTexture(DTextures[3],tex)
	FreeTexture(tex)
	//scientist 2
	tex = LoadTexture_Strict("GFX/npcs/scientist2.jpg")
	EntityTexture(DTextures[4],tex)
	FreeTexture(tex)
	//janitor
	tex = LoadTexture_Strict("GFX/npcs/janitor.jpg")
	EntityTexture(DTextures[5],tex)
	FreeTexture(tex)
	//106 Victim
	tex = LoadTexture_Strict("GFX/npcs/106victim.jpg")
	EntityTexture(DTextures[6],tex)
	FreeTexture(tex)
	//2nd ClassD
	tex = LoadTexture_Strict("GFX/npcs/classd2.jpg")
	EntityTexture(DTextures[7],tex)
	FreeTexture(tex)
	//035 victim
	tex = LoadTexture_Strict("GFX/npcs/035victim.jpg")
	EntityTexture(DTextures[8],tex)
	FreeTexture(tex)
	
	
	
	LoadMaterials("DATA/materials.ini")
	
	OBJTunnel[0]=LoadRMesh("GFX/map/mt1.rmesh",Null)	
	HideEntity(OBJTunnel[0])
	OBJTunnel[1]=LoadRMesh("GFX/map/mt2.rmesh",Null)	
	HideEntity(OBJTunnel[1])
	OBJTunnel[2]=LoadRMesh("GFX/map/mt2c.rmesh",Null)	
	HideEntity(OBJTunnel[2])
	OBJTunnel[3]=LoadRMesh("GFX/map/mt3.rmesh",Null)	
	HideEntity(OBJTunnel[3]	)
	OBJTunnel[4]=LoadRMesh("GFX/map/mt4.rmesh",Null)	
	HideEntity(OBJTunnel[4])
	OBJTunnel[5]=LoadRMesh("GFX/map/mt_elevator.rmesh",Null)
	HideEntity(OBJTunnel[5])
	OBJTunnel[6]=LoadRMesh("GFX/map/mt_generator.rmesh",Null)
	HideEntity(OBJTunnel[6])
	
	//TextureLodBias TextureBias
	TextureLodBias (TextureFloat)
	//Devil Particle System
	//ParticleEffect[] numbers:
	//	0 - electric spark
	//	1 - smoke effect
	
	let t0
	
	InitParticles(Camera)
	
	//Spark Effect (short)
	ParticleEffect[0] = CreateTemplate()
	SetTemplateEmitterBlend(ParticleEffect[0], 3)
	SetTemplateInterval(ParticleEffect[0], 1)
	SetTemplateParticlesPerInterval(ParticleEffect[0], 6)
	SetTemplateEmitterLifeTime(ParticleEffect[0], 6)
	SetTemplateParticleLifeTime(ParticleEffect[0], 20, 30)
	SetTemplateTexture(ParticleEffect[0], "GFX/Spark.png", 2, 3)
	SetTemplateOffset(ParticleEffect[0], -0.1, 0.1, -0.1, 0.1, -0.1, 0.1)
	SetTemplateVelocity(ParticleEffect[0], -0.0375, 0.0375, -0.0375, 0.0375, -0.0375, 0.0375)
	SetTemplateAlignToFall(ParticleEffect[0], True, 45)
	SetTemplateGravity(ParticleEffect[0], 0.001)
	SetTemplateAlphaVel(ParticleEffect[0], True)
	//SetTemplateSize(ParticleEffect[0], 0.0625, 0.125, 0.7, 1)
	SetTemplateSize(ParticleEffect[0], 0.03125, 0.0625, 0.7, 1)
	SetTemplateColors(ParticleEffect[0], $0000FF, $6565FF)
	SetTemplateFloor(ParticleEffect[0], 0.0, 0.5)
	
	//Smoke effect (for some vents)
	ParticleEffect[1] = CreateTemplate()
	SetTemplateEmitterBlend(ParticleEffect[1], 1)
	SetTemplateInterval(ParticleEffect[1], 1)
	SetTemplateEmitterLifeTime(ParticleEffect[1], 3)
	SetTemplateParticleLifeTime(ParticleEffect[1], 30, 45)
	SetTemplateTexture(ParticleEffect[1], "GFX/smoke2.png", 2, 1)
	//SetTemplateOffset(ParticleEffect[1], -.3, .3, -.3, .3, -.3, .3)
	SetTemplateOffset(ParticleEffect[1], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
	//SetTemplateVelocity(ParticleEffect[1], -.04, .04, .1, .2, -.04, .04)
	SetTemplateVelocity(ParticleEffect[1], 0.0, 0.0, 0.02, 0.025, 0.0, 0.0)
	SetTemplateAlphaVel(ParticleEffect[1], True)
	//SetTemplateSize(ParticleEffect[1], 3, 3, .5, 1.5)
	SetTemplateSize(ParticleEffect[1], 0.4, 0.4, 0.5, 1.5)
	SetTemplateSizeVel(ParticleEffect[1], .01, 1.01)
	
	//Smoke effect (for decontamination gas)
	ParticleEffect[2] = CreateTemplate()
	SetTemplateEmitterBlend(ParticleEffect[2], 1)
	SetTemplateInterval(ParticleEffect[2], 1)
	SetTemplateEmitterLifeTime(ParticleEffect[2], 3)
	SetTemplateParticleLifeTime(ParticleEffect[2], 30, 45)
	SetTemplateTexture(ParticleEffect[2], "GFX/smoke.png", 2, 1)
	SetTemplateOffset(ParticleEffect[2], -0.1, 0.1, -0.1, 0.1, -0.1, 0.1)
	SetTemplateVelocity(ParticleEffect[2], -0.005, 0.005, 0.0, -0.03, -0.005, 0.005)
	SetTemplateAlphaVel(ParticleEffect[2], True)
	SetTemplateSize(ParticleEffect[2], 0.4, 0.4, 0.5, 1.5)
	SetTemplateSizeVel(ParticleEffect[2], .01, 1.01)
	SetTemplateGravity(ParticleEffect[2], 0.005)
	t0 = CreateTemplate()
	SetTemplateEmitterBlend(t0, 1)
	SetTemplateInterval(t0, 1)
	SetTemplateEmitterLifeTime(t0, 3)
	SetTemplateParticleLifeTime(t0, 30, 45)
	SetTemplateTexture(t0, "GFX/smoke2.png", 2, 1)
	SetTemplateOffset(t0, -0.1, 0.1, -0.1, 0.1, -0.1, 0.1)
	SetTemplateVelocity(t0, -0.005, 0.005, 0.0, -0.03, -0.005, 0.005)
	SetTemplateAlphaVel(t0, True)
	SetTemplateSize(t0, 0.4, 0.4, 0.5, 1.5)
	SetTemplateSizeVel(t0, .01, 1.01)
	SetTemplateGravity(ParticleEffect[2], 0.005)
	SetTemplateSubTemplate(ParticleEffect[2], t0)
	
	Room2slCam = CreateCamera()
	CameraViewport(Room2slCam, 0, 0, 128, 128)
	CameraRange (Room2slCam, 0.05, 6.0)
	CameraZoom(Room2slCam, 0.8)
	HideEntity(Room2slCam)
	
	DrawLoading(30)
		
	CatchErrors("LoadEntities")
}

function InitNewGame() {
	CatchErrors("Uncaught (InitNewGame)")
	let i: int
	let de: Decals
	let d: Doors
	let it: Items
	let r: Rooms
	let sc: SecurityCams
	let e: Events
	
	DrawLoading(45)
	
	HideDistance = 15.0
	
	HeartBeatRate = 70
	
	AccessCode = 0
	for (i of range(4)) {
		AccessCode = AccessCode + Rand(1,9)*(10^i)
	}	
	
	if (SelectedMap = "") {
		CreateMap()
	} else {
		LoadMap("Map Creator/Maps/"+SelectedMap)
	}
	InitWayPoints()
	
	DrawLoading(79)
	
	Curr173 = CreateNPC(NPCtype173, 0, -30.0, 0)
	Curr106 = CreateNPC(NPCtypeOldMan, 0, -30.0, 0)
	Curr106.State = 70 * 60 * Rand(12,17)
	
	for (d of Doors.each) {
		EntityParent(d.obj, 0)
		if (d.obj2 != 0) {EntityParent(d.obj2, 0)}
		if (d.frameobj != 0) {EntityParent(d.frameobj, 0)}
		if (d.buttons[0] != 0) {EntityParent(d.buttons[0], 0)}
		if (d.buttons[1] != 0) {EntityParent(d.buttons[1], 0)}
		
		if (d.obj2 != 0 && d.dir == 0) {
			MoveEntity(d.obj, 0, 0, 8.0 * RoomScale)
			MoveEntity(d.obj2, 0, 0, 8.0 * RoomScale)
		}	
	}
	
	for (it of Items.each) {
		EntityType (it.collider, HIT_ITEM)
		EntityParent(it.collider, 0)
	}
	
	DrawLoading(80)
	for (sc of SecurityCams.each) {
		sc.angle = EntityYaw(sc.obj) + sc.angle
		EntityParent(sc.obj, 0)
	}	
	
	for (r of Rooms.each) {
		for (i of range(MaxRoomLights + 1)) {
			if (r.Lights[i]!=0) {
				EntityParent(r.Lights[i],0)
			}
		}
		
		if (!r.RoomTemplate.DisableDecals) {
			if (Rand(4) = 1) {
				de.Decals = CreateDecal(Rand(2, 3), EntityX(r.obj)+Rnd(- 2,2), 0.003, EntityZ(r.obj)+Rnd(-2,2), 90, Rand(360), 0)
				de.Size = Rnd(0.1, 0.4)
				ScaleSprite(de.obj, de.Size, de.Size)
				EntityAlpha(de.obj, Rnd(0.85, 0.95))
			}
			
			if (Rand(4) = 1) {
				de.Decals = CreateDecal(0, EntityX(r.obj)+Rnd(- 2,2), 0.003, EntityZ(r.obj)+Rnd(-2,2), 90, Rand(360), 0)
				de.Size = Rnd(0.5, 0.7)
				EntityAlpha(de.obj, 0.7)
				de.ID = 1
				ScaleSprite(de.obj, de.Size, de.Size)
				EntityAlpha(de.obj, Rnd(0.7, 0.85))
			}
		}
		
		if (r.RoomTemplate.Name == "start" && IntroEnabled == False) {
			PositionEntity (Collider, EntityX(r.obj)+3584*RoomScale, 704*RoomScale, EntityZ(r.obj)+1024*RoomScale)
			PlayerRoom = r
			it = CreateItem("Class D Orientation Leaflet", "paper", 1, 1, 1)
			it.Picked = True
			it.Dropped = -1
			it.itemtemplate.found=True
			Inventory(0) = it
			HideEntity(it.collider)
			EntityType (it.collider, HIT_ITEM)
			EntityParent(it.collider, 0)
			ItemAmount = ItemAmount + 1
			it = CreateItem("Document SCP-173", "paper", 1, 1, 1)
			it.Picked = True
			it.Dropped = -1
			it.itemtemplate.found=True
			Inventory(1) = it
			HideEntity(it.collider)
			EntityType (it.collider, HIT_ITEM)
			EntityParent(it.collider, 0)
			ItemAmount = ItemAmount + 1
		} else if (r.RoomTemplate.Name == "173" && IntroEnabled) {
			PositionEntity (Collider, EntityX(r.obj), 1.0, EntityZ(r.obj))
			PlayerRoom = r
		}
		
	}
	
	let rt: RoomTemplates
	for (rt of RoomTemplates.each) {
		FreeEntity (rt.obj)
	}
	
	let tw: TempWayPoints
	for (tw of TempWayPoints.each) {
		Delete (tw)
	}
	
	TurnEntity(Collider, 0, Rand(160, 200), 0)
	
	ResetEntity (Collider)
	
	if (SelectedMap = "") {InitEvents()}
	
	for (e of Events.each) {
		if (e.EventName = "room2nuke") {
			e.EventState = 1
			DebugLog("room2nuke")
		}
		if (e.EventName = "room106") {
			e.EventState2 = 1
			DebugLog("room106")
		}
		if (e.EventName = "room2sl") {
			e.EventState3 = 1
			DebugLog("room2sl")
		}
	}
	
	MoveMouse (viewport_center_x,viewport_center_y)//320, 240
	
	AASetFont (Font1)
	
	HidePointer()
	
	BlinkTimer = -10
	BlurTimer = 100
	Stamina = 100
	
	for (i of range(71)) {
		FPSfactor = 1.0
		FlushKeys()
		MovePlayer()
		UpdateDoors()
		UpdateNPCs()
		UpdateWorld()
		if (Int(Float(i)*0.27)!=Int(Float(i-1)*0.27)) {
			DrawLoading(80+Int(Float(i)*0.27))
		}
	}
	
	FreeTextureCache
	DrawLoading(100)
	
	FlushKeys()
	FlushMouse()
	
	DropSpeed = 0
	
	PrevTime = MilliSecs()
	CatchErrors("InitNewGame")
}

function InitLoadGame() {
	CatchErrors("Uncaught (InitLoadGame)")
	let d: Doors, sc: SecurityCams, rt: RoomTemplates, e: Events
	
	DrawLoading(80)
	
	for (d of Doors.each) {
		EntityParent(d.obj, 0)
		if (d.obj2 != 0) {EntityParent(d.obj2, 0)}
		if (d.frameobj != 0) {EntityParent(d.frameobj, 0)}
		if (d.buttons[0] != 0) {EntityParent(d.buttons[0], 0)}
		if (d.buttons[1] != 0) {EntityParent(d.buttons[1], 0)}
		
	}
	
	for (sc of SecurityCams.each) {
		sc.angle = EntityYaw(sc.obj) + sc.angle
		EntityParent(sc.obj, 0)
	}
	
	ResetEntity (Collider)
	
	//InitEvents()
	
	DrawLoading(90)
	
	MoveMouse (viewport_center_x,viewport_center_y)
	
	AASetFont (Font1)
	
	HidePointer ()
	
	BlinkTimer = BLINKFREQ
	Stamina = 100
	
	for (rt of RoomTemplates.each) {
		if (rt.obj != 0) {
			FreeEntity(rt.obj)
			rt.obj = 0
		}
	}
	
	DropSpeed = 0.0
	
	for (e of Events.each) {
		//Loading the necessary stuff for dimension1499, but this will only be done if the player is in this dimension already
		if (e.EventName = "dimension1499") {
			if (e.EventState == 2) {
				//[Block]
				DrawLoading(91)
				e.room.Objects[0] = CreatePlane()
				let planetex: int = LoadTexture_Strict("GFX/map/dimension1499/grit3.jpg")
				EntityTexture (e.room.Objects[0],planetex)
				FreeTexture(planetex)
				PositionEntity (e.room.Objects[0],0,EntityY(e.room.obj),0)
				EntityType (e.room.Objects[0],HIT_MAP)
				DrawLoading(92)
				NTF_1499Sky = sky_CreateSky("GFX/map/sky/1499sky")
				DrawLoading(93)
				for (i of range(1, 16)) {
					e.room.Objects[i] = LoadMesh_Strict("GFX/map/dimension1499/1499object"+i+".b3d")
					HideEntity (e.room.Objects[i])
				}
				DrawLoading(96)
				CreateChunkParts(e.room)
				DrawLoading(97)
				x = EntityX(e.room.obj)
				z = EntityZ(e.room.obj)
				let ch: Chunk
				for (i of range(-2, 3, 2)) {
					ch = CreateChunk(-1,x*(i*2.5),EntityY(e.room.obj),z)
				}
				DrawLoading(98)
				UpdateChunks(e.room,15,False)
				
				DebugLog ("Loaded dimension1499 successful")
				
				Exit()
				
			}
		}
	}
	
	FreeTextureCache
	
	CatchErrors("InitLoadGame")
	DrawLoading(100)
	
	PrevTime = MilliSecs()
	FPSfactor = 0
	ResetInput()
	
}

function NullGame(playbuttonsfx: boolean = True) {
	CatchErrors("Uncaught (NullGame)")
	let i: int, x: int, y: int, lvl
	let itt: ItemTemplates, s: Screens, lt: LightTemplates, d: Doors, m: Materials
	let wp: WayPoints, twp: TempWayPoints, r: Rooms, it: Items
	
	KillSounds()
	if (playbuttonsfx) {PlaySound_Strict (ButtonSFX)}
	
	FreeParticles()
	
	ClearTextureCache
	
	DebugHUD = False
	
	UnableToMove = False
	
	QuickLoadPercent = -1
	QuickLoadPercent_DisplayTimer = 0
	QuickLoad_CurrEvent = Null
	
	DeathMSG$=""
	
	SelectedMap = ""
	
	UsedConsole = False
	
	DoorTempID = 0
	RoomTempID = 0
	
	GameSaved = 0
	
	HideDistance = 15.0
	
	for (lvl of range(0, 1)) {
		for (x of range(MapWidth+2)) {
			for (y of range(MapHeight+2)) {
				MapTemp(x, y) = 0
				MapFound(x, y) = 0
			}
		}
	}
	
	for (itt of  ItemTemplates.each) {
		itt.found = False
	}
	
	DropSpeed = 0
	Shake = 0
	CurrSpeed = 0
	
	DeathTimer=0
	
	HeartBeatVolume = 0
	
	StaminaEffect = 1.0
	StaminaEffectTimer = 0
	BlinkEffect = 1.0
	BlinkEffectTimer = 0
	
	Bloodloss = 0
	Injuries = 0
	Infect = 0
	
	for (i of range(6)) {
		SCP1025state[i] = 0
	}
	
	SelectedEnding = ""
	EndingTimer = 0
	ExplosionTimer = 0
	
	CameraShake = 0
	Shake = 0
	LightFlash = 0
	
	GodMode = 0
	NoClip = 0
	WireframeState = 0
	WireFrame (0)
	WearingGasMask = 0
	WearingHazmat = 0
	WearingVest = 0
	Wearing714 = 0
	if (WearingNightVision) {
		CameraFogFar = StoredCameraFogFar
		WearingNightVision = 0
	}
	I_427.Using = 0
	I_427.Timer = 0.0
	
	ForceMove = 0.0
	ForceAngle = 0.0	
	Playable = True
	
	CoffinDistance = 100
	
	Contained106 = False
	if (Curr173 != Null) {Curr173.Idle = False}
	
	MTFtimer = 0
	for (i of range(10)) {
		MTFrooms[i]=Null
		MTFroomState[i]=0
	}
	
	for (s of Screens.each) {
		if (s.img != 0) {
			FreeImage (s.img)
			s.img = 0
		}
		Delete (s)
	}
	
	for (i of range(MAXACHIEVEMENTS)) {
		Achievements(i)=0
	}
	RefinedItems = 0
	
	ConsoleInput = ""
	ConsoleOpen = False
	
	EyeIrritation = 0
	EyeStuck = 0
	
	ShouldPlay = 0
	
	KillTimer = 0
	FallTimer = 0
	Stamina = 100
	BlurTimer = 0
	SuperMan = False
	SuperManTimer = 0
	Sanity = 0
	RestoreSanity = True
	Crouch = False
	CrouchState = 0.0
	LightVolume = 0.0
	Vomit = False
	VomitTimer = 0.0
	SecondaryLightOn = True
	PrevSecondaryLightOn = True
	RemoteDoorOn = True
	SoundTransmission = False
	
	InfiniteStamina = False
	
	Msg = ""
	MsgTimer = 0
	
	SelectedItem = Null
	
	for (i of range(MaxItemAmount)) {
		Inventory(i) = Null
	}
	SelectedItem = Null
	
	ClosestButton = 0
	
	for (d of Doors.each) {
		Delete (d)
	}
	
	//ClearWorld
	
	for (lt of LightTemplates.each) {
		Delete (lt)
	}
	
	for (m of Materials.each) {
		Delete (m)
	}
	
	for (wp of WayPoints.each) {
		Delete (wp)
	}
	
	for (twp of TempWayPoints.each) {
		Delete (twp)
	}
	
	for (r of Rooms.each) {
		Delete (r)
	}
	
	for (itt of ItemTemplates.each) {
		Delete (itt)
	}
	
	for (it of Items.each) {
		Delete (it)
	}
	
	for (pr of Props.each) {
		Delete (pr)
	}
	
	for (de of Decals.each) {
		Delete (de)
	}
	
	for (n of NPCs.each) {
		Delete (n)
	}
	Curr173 = Null
	Curr106 = Null
	Curr096 = Null
	for (i of range(7)) {
		MTFrooms[i]=Null
	}
	ForestNPC = 0
	ForestNPCTex = 0
	
	let e: Events
	for (e of Events.each) {
		if (e.Sound != 0) {FreeSound_Strict (e.Sound)}
		if (e.Sound2 != 0) {FreeSound_Strict (e.Sound2)}
		Delete (e)
	}
	
	for (sc of SecurityCams.each) {
		Delete (sc)
	}
	
	for (em of Emitters.each) {
		Delete (em)
	}
	
	for (p of Particles.each) {
		Delete (p)
	}
	
	for (rt of RoomTemplates.each) {
		rt.obj = 0
	}
	
	for (i of range(6)) {
		if (ChannelPlaying(RadioCHN(i))) {StopChannel(RadioCHN(i))}
	}
	
	NTF_1499PrevX = 0.0
	NTF_1499PrevY = 0.0
	NTF_1499PrevZ = 0.0
	NTF_1499PrevRoom = Null
	NTF_1499X = 0.0
	NTF_1499Y = 0.0
	NTF_1499Z = 0.0
	Wearing1499 = False
	DeleteChunks()
	
	DeleteElevatorObjects()
	
	DeleteDevilEmitters()
	
	NoTarget = False
	
	OptionsMenu = -1
	QuitMSG = -1
	AchievementsMenu = -1
	
	MusicVolume = PrevMusicVolume
	SFXVolume = PrevSFXVolume
	DeafPlayer = False
	DeafTimer = 0.0
	
	IsZombie = False
	
	Delete(AchievementMsg.each)
	CurrAchvMSGID = 0
	
	//DeInitExt
	
	ClearWorld
	ReloadAAFont()
	Camera = 0
	ark_blur_cam = 0
	Collider = 0
	Sky = 0
	InitFastResize()
	
	CatchErrors("NullGame")
}

import "save.bb"
import { Contained106, GorePics, HideDistance, MapFound, MapHeight, MapTemp, MapWidth, MaxRoomLights, PrevSecondaryLightOn, RemoteDoorOn, Room2slCam, Rooms, RoomScale, ScreenTexs, SecondaryLightOn, SelectedMonitor, Sky } from "./MapSystem.ts"
import { BackBuffer, CountGfxModes3D, GfxModeHeight, GfxModeWidth, Rect, SetBuffer, TextureBuffer } from "./Helper/graphics.ts"
import { Instr, Left, Len, Lower, Mid, Right, Str, Trim, Upper } from "./Helper/strings.ts"
import { AALoadFont, AASetFont } from "./AAText.ts"
import { MAXACHIEVEMENTS, Achievements, Achv055, AchvConsole, AchvKeter, AchvMaynard, AchvHarp, Achv500, Achv1025, Achv420, Achv714, Achv1499, Achv427 } from "./Achievements.ts"
import { TextureName, CurrentDir, ReadLine, Eof, ReadFile, CloseFile, WriteFile, WriteLine, FilePos } from "./Helper/Files.ts"
import { EntityX, EntityY, EntityZ, EntityPitch, EntityYaw, EntityRoll, GetSurface, GetSurfaceBrush, GetBrushTexture, FreeEntity, CountSurfaces, FreeBrush, CountVertices, VertexX, VertexY, VertexZ, TFormedX, TFormedY, TFormedZ, CreateMesh, CreateSurface, AddVertex, AddTriangle } from "./Helper/Mesh.ts"
import { LoadSound } from "./Helper/sounds.ts"
import { FreeTexture } from "./Helper/textures.ts"
import { TFormVector } from "./Helper/vector.ts"
import { Curr173, Curr106, NPCtype096, NPCtypeMTF, NPCtype049, NPCtypeD, NPCtype939, NPCtypeZombie, NPCtype860, NPCtype966, Curr5131, NPCtype5131, Curr096, NPCtype173, NPCtypeOldMan, NPCtype1499, NPCtype008 } from "./NPCs.ts"
import { LoadSound_Strict, AutoReleaseSounds, LoadAnimMesh_Strict } from "./StrictLoads.ts"
import { G_viewport_width, G_viewport_height, G_app_handle, C_GWL_STYLE, C_WS_POPUP, C_HWND_TOP, G_viewport_x, G_viewport_y, C_SWP_SHOWWINDOW } from "./fullscreen_window_fix.ts"

//--------------------------------------- music & sounds ----------------------------------------------

function PlaySound2(SoundHandle: int, cam: int, entity: int, range: float = 10, volume: float = 1.0): int {
	range = Max(range, 1.0)
	let soundchn: int = 0
	
	if (volume > 0) {
		let dist: float = EntityDistance(cam, entity) / range
		if (1 - dist > 0 && 1 - dist < 1) {
			let panvalue: float = Sin(-DeltaYaw(cam,entity))
			soundchn = PlaySound_Strict (SoundHandle)
			
			ChannelVolume(soundchn, volume * (1 - dist)*SFXVolume)
			ChannelPan(soundchn, panvalue)			
		}
	}
	
	return soundchn
}

function LoopSound2(SoundHandle: int, Chn: int, cam: int, entity: int, range: float = 10, volume: float = 1.0): int {
	range = Max(range,1.0)
	
	if (volume>0) {
		
		let dist: float = EntityDistance(cam, entity) / range
			
		let panvalue: float = Sin(-DeltaYaw(cam,entity))
		
		if (Chn = 0) {
			Chn = PlaySound_Strict (SoundHandle)
		} else {
			if (!ChannelPlaying(Chn)) {Chn = PlaySound_Strict (SoundHandle)}
		}
		
		ChannelVolume(Chn, volume * (1 - dist)*SFXVolume)
		ChannelPan(Chn, panvalue)
	} else {
		if (Chn != 0) {
			ChannelVolume (Chn, 0)
		} 
	}
	
	return Chn
}

function LoadTempSound(file: string) {
	if (TempSounds[TempSoundIndex] != 0) {
		FreeSound_Strict(TempSounds[TempSoundIndex])
	}
	TempSound = LoadSound_Strict(file)
	TempSounds[TempSoundIndex] = TempSound
	
	TempSoundIndex=(TempSoundIndex+1) % 10
	
	return TempSound
}

function LoadEventSound(e: Events,file: string,num: int = 0) {
	
	if (num=0) {
		if (e.Sound != 0) {
			FreeSound_Strict (e.Sound)
			e.Sound=0
		}
		e.Sound=LoadSound_Strict(file)
		return e.Sound
	} else if (num=1) {
		if (e.Sound2 != 0) {
			FreeSound_Strict (e.Sound2)
			e.Sound2=0
		}
		e.Sound2=LoadSound_Strict(file)
		return e.Sound2
	}
}

function UpdateMusic() {
	
	if (ConsoleFlush) {
		if (!ChannelPlaying(ConsoleMusPlay)) {ConsoleMusPlay = PlaySound(ConsoleMusFlush)}
	} else if (!PlayCustomMusic) {
		if (NowPlaying != ShouldPlay) { // playing the wrong clip, fade out
			CurrMusicVolume = Max(CurrMusicVolume - (FPSfactor / 250.0), 0)
			if (CurrMusicVolume = 0) {
				if (NowPlaying<66) {
					StopStream_Strict(MusicCHN)
				}
				NowPlaying = ShouldPlay
				MusicCHN = 0
				CurrMusic=0
			}
		} else { // playing the right clip
			CurrMusicVolume = CurrMusicVolume + (MusicVolume - CurrMusicVolume) * (0.1*FPSfactor)
		}
		
		if (NowPlaying < 66) {
			if (CurrMusic = 0) {
				MusicCHN = StreamSound_Strict("SFX/Music/"+Music(NowPlaying)+".ogg",0.0,Mode)
				CurrMusic = 1
			}
			SetStreamVolume_Strict(MusicCHN,CurrMusicVolume)
		}
	} else {
		if (FPSfactor > 0 || OptionsMenu == 2) {
			if (!ChannelPlaying(MusicCHN)) {MusicCHN = PlaySound_Strict(CustomMusic)}
			ChannelVolume (MusicCHN,1.0*MusicVolume)
		}
	}
	
} 

function PauseSounds() {
	for (e of Events.each) {
		if (e.soundchn != 0) {
			if (!e.soundchn_isstream) {
				if (ChannelPlaying(e.soundchn)) {PauseChannel(e.soundchn)}
			} else {
				SetStreamPaused_Strict(e.soundchn,True)
			}
		}
		if (e.soundchn2 != 0) {
			if (!e.soundchn2_isstream) {
				if (ChannelPlaying(e.soundchn2)) {PauseChannel(e.soundchn2)}
			} else {
				SetStreamPaused_Strict(e.soundchn2,True)
			}
		}		
	}
	
	for (n of NPCs.each) {
		if (n.soundchn != 0) {
			if (!n.soundchn_isstream) {
				if (ChannelPlaying(n.soundchn)) {PauseChannel(n.soundchn)}
			} else {
				if (n.soundchn_isstream=True) {
					SetStreamPaused_Strict(n.soundchn,True)
				}
			}
		}
		if (n.soundchn2 != 0) {
			if (!n.soundchn2_isstream) {
				if (ChannelPlaying(n.soundchn2)) {PauseChannel(n.soundchn2)}
			} else {
				if (n.soundchn2_isstream=True) {
					SetStreamPaused_Strict(n.soundchn2,True)
				}
			}
		}
	}	
	
	for (d of Doors.each) {
		if (d.soundchn != 0) {
			if (ChannelPlaying(d.soundchn)) {PauseChannel(d.soundchn)}
		}
	}
	
	for (dem of DevilEmitters.each) {
		if (dem.soundchn != 0) {
			if (ChannelPlaying(dem.soundchn)) {PauseChannel(dem.soundchn)}
		}
	}
	
	if (AmbientSFXCHN != 0) {
		if (ChannelPlaying(AmbientSFXCHN)) {PauseChannel(AmbientSFXCHN)}
	}
	
	if (BreathCHN != 0) {
		if (ChannelPlaying(BreathCHN)) {PauseChannel(BreathCHN)}
	}
	
	if (IntercomStreamCHN != 0) {
		SetStreamPaused_Strict(IntercomStreamCHN,True)
	}
}

function ResumeSounds() {
	for (e of Events.each) {
		if (e.soundchn != 0) {
			if (!e.soundchn_isstream) {
				if (ChannelPlaying(e.soundchn)) {ResumeChannel(e.soundchn)}
			} else {
				SetStreamPaused_Strict(e.soundchn,False)
			}
		}
		if (e.soundchn2 != 0) {
			if (!e.soundchn2_isstream) {
				if (ChannelPlaying(e.soundchn2)) {ResumeChannel(e.soundchn2)}
			} else {
				SetStreamPaused_Strict(e.soundchn2,False)
			}
		}	
	}
	
	for (n of NPCs.each) {
		if (n.soundchn != 0) {
			if (!n.soundchn_isstream) {
				if (ChannelPlaying(n.soundchn)) {ResumeChannel(n.soundchn)}
			} else {
				if (n.soundchn_isstream=True) {
					SetStreamPaused_Strict(n.soundchn,False)
				}
			}
		}
		if (n.soundchn2 != 0) {
			if (!n.soundchn2_isstream) {
				if (ChannelPlaying(n.soundchn2)) {ResumeChannel(n.soundchn2)}
			} else {
				if (n.soundchn2_isstream=True) {
					SetStreamPaused_Strict(n.soundchn2,False)
				}
			}
		}
	}	
	
	for (d of Doors.each) {
		if (d.soundchn != 0) {
			if (ChannelPlaying(d.soundchn)) {ResumeChannel(d.soundchn)}
		}
	}
	
	for (dem of DevilEmitters.each) {
		if (dem.soundchn != 0) {
			if (ChannelPlaying(dem.soundchn)) {ResumeChannel(dem.soundchn)}
		}
	}
	
	if (AmbientSFXCHN != 0) {
		if (ChannelPlaying(AmbientSFXCHN)) {ResumeChannel(AmbientSFXCHN)}
	}	
	
	if (BreathCHN != 0) {
		if (ChannelPlaying(BreathCHN)) {ResumeChannel(BreathCHN)}
	}
	
	if (IntercomStreamCHN != 0) {
		SetStreamPaused_Strict(IntercomStreamCHN,False)
	}
}

function KillSounds() {
	let i: int,e: Events,n: NPCs,d: Doors,dem: DevilEmitters,snd: Sound
	
	for (i of range(10)) {
		if (TempSounds[i]!=0) {
			FreeSound_Strict (TempSounds[i])
			TempSounds[i]=0
		}
	}
	for (e of Events.each) {
		if (e.SoundCHN != 0) {
			if (!e.SoundCHN_isStream) {
				if (ChannelPlaying(e.SoundCHN)) {StopChannel(e.SoundCHN)}
			} else {
				StopStream_Strict(e.SoundCHN)
			}
		}
		if (e.SoundCHN2 != 0) {
			if (!e.SoundCHN2_isStream){
				if (ChannelPlaying(e.SoundCHN2)) {StopChannel(e.SoundCHN2)}
			} else {
				StopStream_Strict(e.SoundCHN2)
			}
		}		
	}
	for (n of NPCs.each) {
		if (n.SoundChn != 0) {
			if (!n.SoundChn_IsStream) {
				if (ChannelPlaying(n.SoundChn)) {StopChannel(n.SoundChn)}
			} else {
				StopStream_Strict(n.SoundChn)
			}
		}
		if (n.SoundChn2 != 0) {
			if (!n.SoundChn2_IsStream) {
				if (ChannelPlaying(n.SoundChn2)) {StopChannel(n.SoundChn2)}
			} else {
				StopStream_Strict(n.SoundChn2)
			}
		}
	}	
	for (d of Doors.each) {
		if (d.SoundCHN != 0) {
			if (ChannelPlaying(d.SoundCHN)) {StopChannel(d.SoundCHN)}
		}
	}
	for (dem of DevilEmitters.each) {
		if (dem.SoundCHN != 0) {
			if (ChannelPlaying(dem.SoundCHN)) {StopChannel(dem.SoundCHN)}
		}
	}
	if (AmbientSFXCHN != 0) {
		if (ChannelPlaying(AmbientSFXCHN)) {StopChannel(AmbientSFXCHN)}
	}
	if (BreathCHN != 0) {
		if (ChannelPlaying(BreathCHN)) {StopChannel(BreathCHN)}
	}
	if (IntercomStreamCHN != 0) {
		StopStream_Strict(IntercomStreamCHN)
		IntercomStreamCHN = 0
	}
	if (EnableSFXRelease) {
		for (snd of Sound.each) {
			if (snd.internalHandle != 0) {
				FreeSound (snd.internalHandle)
				snd.internalHandle = 0
				snd.releaseTime = 0
			}
		}
	}
	
	for (snd of Sound.each) {
		for (i of range(32)) {
			if (snd.channels[i]!=0) {
				StopChannel (snd.channels[i])
			}
		}
	}
	
	DebugLog ("Terminated all sounds")
	
}

function GetStepSound(entity: int) {
    let picker: int,brush: int,texture: int,name$
    let mat: Materials
    
    picker = LinePick(EntityX(entity),EntityY(entity),EntityZ(entity),0,-1,0)
    if (picker != 0) {
        if (GetEntityType(picker) != HIT_MAP) {return 0}
        brush = GetSurfaceBrush(GetSurface(picker,CountSurfaces(picker)))
        if (brush != 0) {
            texture = GetBrushTexture(brush,3)
            if (texture != 0) {
                name = StripPath(TextureName(texture))
                if ((name != "")) {FreeTexture(texture)}
				for (mat of Materials.each) {
					if (mat.name = name) {
						if (mat.StepSound > 0) {
							FreeBrush(brush)
							return mat.StepSound-1
						}
						Exit()
					}
				}                
			}
			texture = GetBrushTexture(brush,2)
			if (texture != 0) {
				name = StripPath(TextureName(texture))
				if ((name != "")) {FreeTexture(texture)}
				for (mat of Materials.each) {
					if (mat.name = name) {
						if (mat.StepSound > 0) {
							FreeBrush(brush)
							return mat.StepSound-1
						}
						Exit()
					}
				}                
			}
			texture = GetBrushTexture(brush,1)
			if (texture != 0) {
				name = StripPath(TextureName(texture))
				if ((name != "")) {FreeTexture(texture)}
				FreeBrush(brush)
				for (mat of Materials.each) {
					if (mat.name = name) {
						if (mat.StepSound > 0) {
							return mat.StepSound-1
						}
						Exit()
					}
				}                
			}
		}
	}
    
    return 0
}

function UpdateSoundOrigin2(Chn: int, cam: int, entity: int, range: float = 10, volume: float = 1.0) {
	range = Max(range,1.0)
	
	if (volume>0) {
		
		let dist: float = EntityDistance(cam, entity) / range
		if (1 - dist > 0 && 1 - dist < 1) {
			
			let panvalue: float = Sin(-DeltaYaw(cam,entity))
			
			ChannelVolume(Chn, volume * (1 - dist))
			ChannelPan(Chn, panvalue)
		}
	} else {
		if (Chn != 0) {
			ChannelVolume (Chn, 0)
		} 
	}
}

function UpdateSoundOrigin(Chn: int, cam: int, entity: int, range: float = 10, volume: float = 1.0) {
	range = Max(range,1.0)
	
	if (volume>0) {
		
		let dist: float = EntityDistance(cam, entity) / range
		if (1 - dist > 0 && 1 - dist < 1) {
			
			let panvalue: float = Sin(-DeltaYaw(cam,entity))
			
			ChannelVolume(Chn, volume * (1 - dist)*SFXVolume)
			ChannelPan(Chn, panvalue)
		}
	} else {
		if (Chn != 0) {
			ChannelVolume (Chn, 0)
		} 
	}
}
//--------------------------------------- random -------------------------------------------------------

function f2s(n: float, count: int): string {
	return Left(n, Len(Int(n))+count+1)
}

function AnimateNPC(n: NPCs, start: float, quit: float, speed: float, loop=True) {
	let newTime: float
	
	if (speed > 0.0) {
		newTime = Max(Min(n.Frame + speed * FPSfactor,quit),start)
		
		if (loop && newTime >= quit) {
			newTime = start
		}
	} else {
		if (start < quit) {
			temp = start
			start = quit
			quit = temp
		}
		
		if (loop) {
			newTime = n.Frame + speed * FPSfactor
			
			if (newTime < quit) { 
				newTime = start
			} else if (newTime > start) {
				newTime = quit
			}
		} else {
			newTime = Max(Min(n.Frame + speed * FPSfactor,start),quit)
		}
	}
	SetNPCFrame(n, newTime)
	
}

function SetNPCFrame(n: NPCs, frame: float) {
	if (Abs(n.Frame-frame)<0.001) {return}
	
	SetAnimTime (n.obj, frame)
	
	n.Frame = frame
}

function Animate2(entity: int, curr: float, start: int, quit: int, speed: float, loop=True): float {
	
	let newTime: float
	
	if (speed > 0.0) {
		newTime = Max(Min(curr + speed * FPSfactor,quit),start)
		
		if (loop) {
			if (newTime >= quit) { 
				newTime = start
			}
		}
	} else {
		if (start < quit) {
			temp = start
			start = quit
			quit = temp
		}
		
		if (loop) {
			newTime = curr + speed * FPSfactor
			
			if (newTime < quit) {newTime = start}
			if (newTime > start) {newTime = quit}
			
		} else {
			newTime = Max(Min(curr + speed * FPSfactor,start),quit)
		}
	}
	
	SetAnimTime (entity, newTime)
	return newTime
	
} 


function Use914(item: Items, setting: string, x: float, y: float, z: float) {
	
	RefinedItems = RefinedItems+1
	
	let it2: Items
	switch (item.itemtemplate.name) {
		case "Gas Mask", "Heavy Gas Mask":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
					RemoveItem(item)
				case "1:1":
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
				case "fine", "very fine":
					it2 = CreateItem("Gas Mask", "supergasmask", x, y, z)
					RemoveItem(item)
			}
		case "SCP-1499":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
					RemoveItem(item)
				case "1:1":
					it2 = CreateItem("Gas Mask", "gasmask", x, y, z)
					RemoveItem(item)
				case "fine":
					it2 = CreateItem("SCP-1499", "super1499", x, y, z)
					RemoveItem(item)
				case "very fine":
					n.NPCs = CreateNPC(NPCtype1499,x,y,z)
					n.State = 1
					n.Sound = LoadSound_Strict("SFX/SCP/1499/Triggered.ogg")
					n.SoundChn = PlaySound2(n.Sound, Camera, n.Collider,20.0)
					n.State3 = 1
					RemoveItem(item)
			}
		case "Ballistic Vest":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
					RemoveItem(item)
				case "1:1":
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
				case "fine":
					it2 = CreateItem("Heavy Ballistic Vest", "finevest", x, y, z)
					RemoveItem(item)
				case "very fine":
					it2 = CreateItem("Bulky Ballistic Vest", "veryfinevest", x, y, z)
					RemoveItem(item)
			}
		case "Clipboard":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(7, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
					for (i of range(20)) {
						if (item.SecondInv[i]!=Null) {
							RemoveItem(item.SecondInv[i])
						}
						item.SecondInv[i]=Null
					}
					RemoveItem(item)
				case "1:1":
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
				case "fine":
					item.invSlots = Max(item.state2,15)
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
				case "very fine":
					item.invSlots = Max(item.state2,20)
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
			}
		case "Cowbell":
			switch (setting) {
				case "rough","coarse":
					d.Decals = CreateDecal(0, x, 8*RoomScale+0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
					RemoveItem(item)
				case "1:1","fine","very fine":
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
			}
		case "Night Vision Goggles":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
					RemoveItem(item)
				case "1:1":
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)
				case "fine":
					it2 = CreateItem("Night Vision Goggles", "finenvgoggles", x, y, z)
					RemoveItem(item)
				case "very fine":
					it2 = CreateItem("Night Vision Goggles", "supernv", x, y, z)
					it2.state = 1000
					RemoveItem(item)
			}
		case "Metal Panel", "SCP-148 Ingot":
			switch (setting) {
				case "rough", "coarse":
					it2 = CreateItem("SCP-148 Ingot", "scp148ingot", x, y, z)
					RemoveItem(item)
				case "1:1", "fine", "very fine":
					it2 = Null
					for (it of Items.each) {
						if (it!=item && it.collider != 0 && it.Picked == False) {
							if (Distance(EntityX(it.collider,True), EntityZ(it.collider,True), EntityX(item.collider, True), EntityZ(item.collider, True)) < (180.0 * RoomScale)) {
								it2 = it
								Exit()
							} else if (Distance(EntityX(it.collider,True), EntityZ(it.collider,True), x,z) < (180.0 * RoomScale)) {
								it2 = it
								Exit()
							}
						}
					}
					
					if (it2!=Null) {
						switch (it2.itemtemplate.tempname) {
							case "gasmask", "supergasmask":
								RemoveItem (it2)
								RemoveItem (item)
								
								it2 = CreateItem("Heavy Gas Mask", "gasmask3", x, y, z)
							case "vest":
								RemoveItem (it2)
								RemoveItem(item)
								it2 = CreateItem("Heavy Ballistic Vest", "finevest", x, y, z)
							case "hazmatsuit","hazmatsuit2":
								RemoveItem (it2)
								RemoveItem(item)
								it2 = CreateItem("Heavy Hazmat Suit", "hazmatsuit3", x, y, z)
						}
					} else { 
						if (item.itemtemplate.name="SCP-148 Ingot") {
							it2 = CreateItem("Metal Panel", "scp148", x, y, z)
							RemoveItem(item)
						} else {
							PositionEntity(item.collider, x, y, z)
							ResetEntity(item.collider)							
						}
					}					
			}
		case "Severed Hand", "Black Severed Hand":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(3, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1", "fine", "very fine":
					if (item.itemtemplate.name = "Severed Hand") {
						it2 = CreateItem("Black Severed Hand", "hand2", x, y, z)
					} else {
						it2 = CreateItem("Severed Hand", "hand", x, y, z)
					}
			}
			RemoveItem(item)
		case "First Aid Kit", "Blue First Aid Kit":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.12
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					if (Rand(2)=1) {
						it2 = CreateItem("Blue First Aid Kit", "firstaid2", x, y, z)
					} else {
						it2 = CreateItem("First Aid Kit", "firstaid", x, y, z)
					}
				case "fine":
					it2 = CreateItem("Small First Aid Kit", "finefirstaid", x, y, z)
				case "very fine":
					it2 = CreateItem("Strange Bottle", "veryfinefirstaid", x, y, z)
			}
			RemoveItem(item)
		case "Level 1 Key Card", "Level 2 Key Card", "Level 3 Key Card", "Level 4 Key Card", "Level 5 Key Card", "Key Card":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.07
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("Playing Card", "misc", x, y, z)
				case "fine":
					switch (item.itemtemplate.name) {
						case "Level 1 Key Card":
							switch (SelectedDifficulty.otherFactors) {
								case EASY:
									it2 = CreateItem("Level 2 Key Card", "key2", x, y, z)
								case NORMAL:
									if (Rand(5)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 2 Key Card", "key2", x, y, z)
									}
								case HARD:
									if (Rand(4)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 2 Key Card", "key2", x, y, z)
									}
							}
						case "Level 2 Key Card":
							switch (SelectedDifficulty.otherFactors) {
								case EASY:
									it2 = CreateItem("Level 3 Key Card", "key3", x, y, z)
								case NORMAL:
									if (Rand(4)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 3 Key Card", "key3", x, y, z)
									}
								case HARD:
									if (Rand(3)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 3 Key Card", "key3", x, y, z)
									}
							}
						case "Level 3 Key Card":
							switch (SelectedDifficulty.otherFactors) {
								case EASY:
									if (Rand(10)=1) {
										it2 = CreateItem("Level 4 Key Card", "key4", x, y, z)
									} else {
										it2 = CreateItem("Playing Card", "misc", x, y, z)	
									}
								case NORMAL:
									if (Rand(15)=1) {
										it2 = CreateItem("Level 4 Key Card", "key4", x, y, z)
									} else {
										it2 = CreateItem("Playing Card", "misc", x, y, z)	
									}
								case HARD:
									if (Rand(20)=1) {
										it2 = CreateItem("Level 4 Key Card", "key4", x, y, z)
									} else {
										it2 = CreateItem("Playing Card", "misc", x, y, z)	
									}
							}
						case "Level 4 Key Card":
							switch (SelectedDifficulty.otherFactors) {
								case EASY:
									it2 = CreateItem("Level 5 Key Card", "key5", x, y, z)
								case NORMAL:
									if (Rand(4)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 5 Key Card", "key5", x, y, z)
									}
								case HARD:
									if (Rand(3)=1) {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									} else {
										it2 = CreateItem("Level 5 Key Card", "key5", x, y, z)
									}
							}
						case "Level 5 Key Card":
							let CurrAchvAmount: int = 0
							for (i of range(MAXACHIEVEMENTS)) {
								if (Achievements(i)=True) {
									CurrAchvAmount=CurrAchvAmount+1
								}
							}
							
							DebugLog (CurrAchvAmount)
							
							switch (SelectedDifficulty.otherFactors) {
								case EASY:
									if (Rand(0,((MAXACHIEVEMENTS-1)*3)-((CurrAchvAmount-1)*3))=0) {
										it2 = CreateItem("Key Card Omni", "key6", x, y, z)
									} else {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									}
								case NORMAL:
									if (Rand(0,((MAXACHIEVEMENTS-1)*4)-((CurrAchvAmount-1)*3))=0) {
										it2 = CreateItem("Key Card Omni", "key6", x, y, z)
									} else {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									}
								case HARD:
									if (Rand(0,((MAXACHIEVEMENTS-1)*5)-((CurrAchvAmount-1)*3))=0) {
										it2 = CreateItem("Key Card Omni", "key6", x, y, z)
									} else {
										it2 = CreateItem("Mastercard", "misc", x, y, z)
									}
							}		
					}
				case "very fine":
					CurrAchvAmount = 0
					for (i of range(MAXACHIEVEMENTS)) {
						if (Achievements(i)=True) {
							CurrAchvAmount=CurrAchvAmount+1
						}
					}
					
					DebugLog (CurrAchvAmount)
					
					switch (SelectedDifficulty.otherFactors) {
						case EASY:
							if (Rand(0,((MAXACHIEVEMENTS-1)*3)-((CurrAchvAmount-1)*3))=0) {
								it2 = CreateItem("Key Card Omni", "key6", x, y, z)
							} else {
								it2 = CreateItem("Mastercard", "misc", x, y, z)
							}
						case NORMAL:
							if (Rand(0,((MAXACHIEVEMENTS-1)*4)-((CurrAchvAmount-1)*3))=0) {
								it2 = CreateItem("Key Card Omni", "key6", x, y, z)
							} else {
								it2 = CreateItem("Mastercard", "misc", x, y, z)
							}
						case HARD:
							if (Rand(0,((MAXACHIEVEMENTS-1)*5)-((CurrAchvAmount-1)*3))=0) {
								it2 = CreateItem("Key Card Omni", "key6", x, y, z)
							} else {
								it2 = CreateItem("Mastercard", "misc", x, y, z)
							}
					}
			}
			
			RemoveItem(item)
		case "Key Card Omni":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.07
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					if (Rand(2)=1) {
						it2 = CreateItem("Mastercard", "misc", x, y, z)
					} else {
						it2 = CreateItem("Playing Card", "misc", x, y, z)			
					}	
				case "fine", "very fine":
					it2 = CreateItem("Key Card Omni", "key6", x, y, z)
			}			
			
			RemoveItem(item)
		case "Playing Card", "Coin", "Quarter":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.07
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("Level 1 Key Card", "key1", x, y, z)	
			    case "fine", "very fine":
					it2 = CreateItem("Level 2 Key Card", "key2", x, y, z)
			}
			RemoveItem(item)
		case "Mastercard":
			switch (setting) {
				case "rough":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
					d.Size = 0.07
					ScaleSprite(d.obj, d.Size, d.Size)
				case "coarse":
					it2 = CreateItem("Quarter", "25ct", x, y, z)
					let it3: Items,it4: Items,it5: Items
					it3 = CreateItem("Quarter", "25ct", x, y, z)
					it4 = CreateItem("Quarter", "25ct", x, y, z)
					it5 = CreateItem("Quarter", "25ct", x, y, z)
					EntityType (it3.collider, HIT_ITEM)
					EntityType (it4.collider, HIT_ITEM)
					EntityType (it5.collider, HIT_ITEM)
				case "1:1":
					it2 = CreateItem("Level 1 Key Card", "key1", x, y, z)	
			    case "fine", "very fine":
					it2 = CreateItem("Level 2 Key Card", "key2", x, y, z)
			}
			RemoveItem(item)
		case "S-NAV 300 Navigator", "S-NAV 310 Navigator", "S-NAV Navigator", "S-NAV Navigator Ultimate":
			switch (setting) {
				case "rough", "coarse":
					it2 = CreateItem("Electronical components", "misc", x, y, z)
				case "1:1":
					it2 = CreateItem("S-NAV Navigator", "nav", x, y, z)
					it2.state = 100
				case "fine":
					it2 = CreateItem("S-NAV 310 Navigator", "nav", x, y, z)
					it2.state = 100
				case "very fine":
					it2 = CreateItem("S-NAV Navigator Ultimate", "nav", x, y, z)
					it2.state = 101
			}
			
			RemoveItem(item)
		case "Radio Transceiver":
			switch (setting) {
				case "rough", "coarse":
					it2 = CreateItem("Electronical components", "misc", x, y, z)
				case "1:1":
					it2 = CreateItem("Radio Transceiver", "18vradio", x, y, z)
					it2.state = 100
				case "fine":
					it2 = CreateItem("Radio Transceiver", "fineradio", x, y, z)
					it2.state = 101
				case "very fine":
					it2 = CreateItem("Radio Transceiver", "veryfineradio", x, y, z)
					it2.state = 101
			}
			
			RemoveItem(item)
		case "SCP-513":
			switch (setting) {
				case "rough", "coarse":
					PlaySound_Strict (LoadTempSound("SFX/SCP/513/914Refine.ogg"))
					for (n of NPCs.each) {
						if (n.npctype = NPCtype5131) {RemoveNPC(n)}
					}
					d.Decals = CreateDecal(0, x, 8*RoomScale+0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1", "fine", "very fine":
					it2 = CreateItem("SCP-513", "scp513", x, y, z)
					
			}
			
			RemoveItem(item)
		case "Some SCP-420-J", "Cigarette":
			switch (setting) {
				case "rough", "coarse":		
					d.Decals = CreateDecal(0, x, 8*RoomScale+0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("Cigarette", "cigarette", x + 1.5, y + 0.5, z + 1.0)
				case "fine":
					it2 = CreateItem("Joint", "420s", x + 1.5, y + 0.5, z + 1.0)
				case "very fine":
					it2 = CreateItem("Smelly Joint", "420s", x + 1.5, y + 0.5, z + 1.0)
			}
			
			RemoveItem(item)
		case "9V Battery", "18V Battery", "Strange Battery":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("18V Battery", "18vbat", x, y, z)
				case "fine":
					it2 = CreateItem("Strange Battery", "killbat", x, y, z)
				case "very fine":
					it2 = CreateItem("Strange Battery", "killbat", x, y, z)
			}
			
			RemoveItem(item)
		case "ReVision Eyedrops", "RedVision Eyedrops", "Eyedrops":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("RedVision Eyedrops", "eyedrops", x,y,z)
				case "fine":
					it2 = CreateItem("Eyedrops", "fineeyedrops", x,y,z)
				case "very fine":
					it2 = CreateItem("Eyedrops", "supereyedrops", x,y,z)
			}
			
			RemoveItem(item)		
		case "Hazmat Suit":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("Hazmat Suit", "hazmatsuit", x,y,z)
				case "fine":
					it2 = CreateItem("Hazmat Suit", "hazmatsuit2", x,y,z)
				case "very fine":
					it2 = CreateItem("Hazmat Suit", "hazmatsuit2", x,y,z)
			}
			
			RemoveItem(item)
			
		case "Syringe":
			switch (item.itemtemplate.tempname) {
				case "syringe":
					switch (setting) {
						case "rough", "coarse":
							d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
							d.Size = 0.07
							ScaleSprite(d.obj, d.Size, d.Size)
						case "1:1":
							it2 = CreateItem("Small First Aid Kit", "finefirstaid", x, y, z)	
						case "fine":
							it2 = CreateItem("Syringe", "finesyringe", x, y, z)
						case "very fine":
							it2 = CreateItem("Syringe", "veryfinesyringe", x, y, z)
					}
					
				case "finesyringe":
					switch (setting) {
						case "rough":
							d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
							d.Size = 0.07
							ScaleSprite(d.obj, d.Size, d.Size)
						case "coarse":
							it2 = CreateItem("First Aid Kit", "firstaid", x, y, z)
						case "1:1":
							it2 = CreateItem("Blue First Aid Kit", "firstaid2", x, y, z)	
						case "fine", "very fine":
							it2 = CreateItem("Syringe", "veryfinesyringe", x, y, z)
					}
					
				case "veryfinesyringe":
					switch (setting) {
						case "rough", "coarse", "1:1", "fine":
							it2 = CreateItem("Electronical components", "misc", x, y, z)	
						case "very fine":
							n.NPCs = CreateNPC(NPCtype008,x,y,z)
							n.State = 2
					}
			}
			
			RemoveItem(item)
			
		case "SCP-500-01", "Upgraded pill", "Pill":
			switch (setting) {
				case "rough", "coarse":
					d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.010, z, 90, Rand(360), 0)
					d.Size = 0.2
					EntityAlpha(d.obj, 0.8)
					ScaleSprite(d.obj, d.Size, d.Size)
				case "1:1":
					it2 = CreateItem("Pill", "pill", x, y, z)
					RemoveItem(item)
				case "fine":
					let no427Spawn: boolean = False
					for (it3 of Items.each) {
						if (it3.itemtemplate.tempname = "scp427") {
							no427Spawn = True
							Exit()
						}
					}
					if (!no427Spawn) {
						it2 = CreateItem("SCP-427", "scp427", x, y, z)
					} else {
						it2 = CreateItem("Upgraded pill", "scp500death", x, y, z)
					}
					RemoveItem(item)
				case "very fine":
					it2 = CreateItem("Upgraded pill", "scp500death", x, y, z)
					RemoveItem(item)
			}
			
		default:
			
			switch (item.itemtemplate.tempname) {
				case "cup":
					switch (setting) {
						case "rough", "coarse":
							d.Decals = CreateDecal(0, x, 8 * RoomScale + 0.010, z, 90, Rand(360), 0)
							d.Size = 0.2
							EntityAlpha(d.obj, 0.8)
							ScaleSprite(d.obj, d.Size, d.Size)
						case "1:1":
							it2 = CreateItem("cup", "cup", x,y,z)
							it2.name = item.name
							it2.r = 255-item.r
							it2.g = 255-item.g
							it2.b = 255-item.b
						case "fine":
							it2 = CreateItem("cup", "cup", x,y,z)
							it2.name = item.name
							it2.state = 1.0
							it2.r = Min(item.r*Rnd(0.9,1.1),255)
							it2.g = Min(item.g*Rnd(0.9,1.1),255)
							it2.b = Min(item.b*Rnd(0.9,1.1),255)
						case "very fine":
							it2 = CreateItem("cup", "cup", x,y,z)
							it2.name = item.name
							it2.state = Max(it2.state*2.0,2.0)	
							it2.r = Min(item.r*Rnd(0.5,1.5),255)
							it2.g = Min(item.g*Rnd(0.5,1.5),255)
							it2.b = Min(item.b*Rnd(0.5,1.5),255)
							if (Rand(5)=1) {
								ExplosionTimer = 135
							}
					}
					
					RemoveItem(item)
				case "paper":
					switch (setting) {
						case "rough", "coarse":
							d.Decals = CreateDecal(7, x, 8 * RoomScale + 0.005, z, 90, Rand(360), 0)
							d.Size = 0.12
							ScaleSprite(d.obj, d.Size, d.Size)
						case "1:1":
							switch (Rand(6)) {
								case 1:
									it2 = CreateItem("Document SCP-106", "paper", x, y, z)
								case 2:
									it2 = CreateItem("Document SCP-079", "paper", x, y, z)
								case 3:
									it2 = CreateItem("Document SCP-173", "paper", x, y, z)
								case 4:
									it2 = CreateItem("Document SCP-895", "paper", x, y, z)
								case 5:
									it2 = CreateItem("Document SCP-682", "paper", x, y, z)
								case 6:
									it2 = CreateItem("Document SCP-860", "paper", x, y, z)
							}
						case "fine", "very fine":
							it2 = CreateItem("Origami", "misc", x, y, z)
					}
					
					RemoveItem(item)
				default:
					PositionEntity(item.collider, x, y, z)
					ResetEntity(item.collider)	
			}
			
	}
	
	if (it2 != Null) {EntityType (it2.collider, HIT_ITEM)}
}

function Use294() {
	let x: float,y: float, xtemp: int,ytemp: int, strtemp: string, temp: int
	
	ShowPointer()
	
	x = GraphicWidth/2 - (ImageWidth(Panel294)/2)
	y = GraphicHeight/2 - (ImageHeight(Panel294)/2)
	DrawImage (Panel294, x, y)
	if (Fullscreen) {DrawImage (CursorIMG, ScaledMouseX(),ScaledMouseY())}
	
	temp = True
	if (PlayerRoom.SoundCHN!=0) {temp = False}
	
	AAText (x+907, y+185, Input294, True,True)
	
	if (temp) {
		if (MouseHit1) {
			xtemp = Floor((ScaledMouseX()-x-228) / 35.5)
			ytemp = Floor((ScaledMouseY()-y-342) / 36.5)
			
			if (ytemp => 0 && ytemp < 5) {
				if (xtemp => 0 && xtemp < 10) {PlaySound_Strict (ButtonSFX)}
			}
			
			strtemp = ""
			
			temp = False
			
			switch (ytemp) {
				case 0:
					strtemp = (xtemp + 1) % 10
				case 1:
					switch (xtemp) {
						case 0:
							strtemp = "Q"
						case 1:
							strtemp = "W"
						case 2:
							strtemp = "E"
						case 3:
							strtemp = "R"
						case 4:
							strtemp = "T"
						case 5:
							strtemp = "Y"
						case 6:
							strtemp = "U"
						case 7:
							strtemp = "I"
						case 8:
							strtemp = "O"
						case 9:
							strtemp = "P"
					}
				case 2:
					switch (xtemp) {
						case 0:
							strtemp = "A"
						case 1:
							strtemp = "S"
						case 2:
							strtemp = "D"
						case 3:
							strtemp = "F"
						case 4:
							strtemp = "G"
						case 5:
							strtemp = "H"
						case 6:
							strtemp = "J"
						case 7:
							strtemp = "K"
						case 8:
							strtemp = "L"
						case 9: //dispense
							temp = True
					}
				case 3:
					switch (xtemp) {
						case 0:
							strtemp = "Z"
						case 1:
							strtemp = "X"
						case 2:
							strtemp = "C"
						case 3:
							strtemp = "V"
						case 4:
							strtemp = "B"
						case 5:
							strtemp = "N"
						case 6:
							strtemp = "M"
						case 7:
							strtemp = "-"
						case 8:
							strtemp = " "
						case 9:
							Input294 = Left(Input294, Max(Len(Input294)-1,0))
					}
				case 4:
					strtemp = " "
			}
			
			Input294 = Input294 + strtemp
			
			Input294 = Left(Input294, Min(Len(Input294),15))
			
			if (temp && Input294!="") { //dispense
				Input294 = Trim(Lower(Input294))
				if (Left(Input294, Min(7,Len(Input294))) = "cup of ") {
					Input294 = Right(Input294, Len(Input294)-7)
				} else if (Left(Input294, Min(9,Len(Input294))) = "a cup of ") {
					Input294 = Right(Input294, Len(Input294)-9)
				}
				
				if (Input294!="") {
					let loc: int = GetINISectionLocation("DATA/SCP-294.ini",Input294)
				}
				
				if (loc > 0) {
					strtemp$ = GetINIString2("DATA/SCP-294.ini", loc, "dispensesound")
					if (strtemp="") {
						PlayerRoom.SoundCHN = PlaySound_Strict (LoadTempSound("SFX/SCP/294/dispense1.ogg"))
					} else {
						PlayerRoom.SoundCHN = PlaySound_Strict (LoadTempSound(strtemp))
					}
					
					if (GetINIInt2("DATA/SCP-294.ini", loc, "explosion")=True) {
						ExplosionTimer = 135
						DeathMSG = GetINIString2("DATA/SCP-294.ini", loc, "deathmessage")
					}
					
					strtemp$ = GetINIString2("DATA/SCP-294.ini", loc, "color")
					
					sep1 = Instr(strtemp, ",", 1)
					sep2 = Instr(strtemp, ",", sep1+1)
					r = Trim(Left(strtemp, sep1-1))
					g = Trim(Mid(strtemp, sep1+1, sep2-sep1-1))
					b = Trim(Right(strtemp, Len(strtemp)-sep2))
					
					alpha = Float(GetINIString2("DATA/SCP-294.ini", loc, "alpha",1.0))
					glow = GetINIInt2("DATA/SCP-294.ini", loc, "glow")
					//If alpha = 0 Then alpha = 1.0
					if (glow) {alpha = -alpha}
					
					it.items = CreateItem("Cup", "cup", EntityX(PlayerRoom.Objects[1],True),EntityY(PlayerRoom.Objects[1],True),EntityZ(PlayerRoom.Objects[1],True), r,g,b,alpha)
					it.name = "Cup of "+Input294
					EntityType (it.collider, HIT_ITEM)
					
				} else {
					//out of range
					Input294 = "OUT OF RANGE"
					PlayerRoom.SoundCHN = PlaySound_Strict (LoadTempSound("SFX/SCP/294/outofrange.ogg"))
				}
				
			}
			
		} //if mousehit1
		
		if (MouseHit2 || (!Using294)) {
			HidePointer()
			Using294 = False
			Input294 = ""
			MouseXSpeed()
			MouseYSpeed()
			MouseZSpeed()
			mouse_x_speed_1 = 0.0
			mouse_y_speed_1 = 0.0
		}
		
	} else { //playing a dispensing sound
		if (Input294 != "OUT OF RANGE") {Input294 = "DISPENSING..."}
		
		if (!ChannelPlaying(PlayerRoom.SoundCHN)) {
			if (Input294 != "OUT OF RANGE") {
				HidePointer()
				Using294 = False
				MouseXSpeed()
				MouseYSpeed()
				MouseZSpeed()
				mouse_x_speed_1 = 0.0
				mouse_y_speed_1 = 0.0
				let e: Events
				for (e of Events.each) {
					if (e.room = PlayerRoom) {
						e.EventState2 = 0
						Exit()
					}
				}
			}
			Input294=""
			PlayerRoom.SoundCHN=0
		}
	}
	
}

function Use427() {
	let i: int,pvt: int,de: Decals,tempchn: int
	let prevI427Timer: float = I_427.Timer
	
	if (I_427.Timer < 70*360) {
		if (I_427.Using=True) {
			I_427.Timer = I_427.Timer + FPSfactor
			if (Injuries > 0.0) {
				Injuries = Max(Injuries - 0.0005 * FPSfactor,0.0)
			}
			if (Bloodloss > 0.0 && Injuries <= 1.0) {
				Bloodloss = Max(Bloodloss - 0.001 * FPSfactor,0.0)
			}
			if (Infect > 0.0) {
				Infect = Max(Infect - 0.001 * FPSfactor,0.0)
			}
			for (i of range(6)) {
				if (SCP1025state[i]>0.0) {
					SCP1025state[i] = Max(SCP1025state[i] - 0.001 * FPSfactor,0.0)
				}
			}
			if (I_427.Sound[0]=0) {
				I_427.Sound[0] = LoadSound_Strict("SFX/SCP/427/Effect.ogg")
			}
			if (!ChannelPlaying(I_427.SoundCHN[0])) {
				I_427.SoundCHN[0] = PlaySound_Strict(I_427.Sound[0])
			}
			if (I_427.Timer >= 70*180) {
				if (I_427.Sound[1]=0) {
					I_427.Sound[1] = LoadSound_Strict("SFX/SCP/427/Transform.ogg")
				}
				if (!ChannelPlaying(I_427.SoundCHN[1])) {
					I_427.SoundCHN[1] = PlaySound_Strict(I_427.Sound[1])
				}
			}
			if (prevI427Timer < 70*60 && I_427.Timer >= 70*60) {
				Msg = "You feel refreshed and energetic."
				MsgTimer = 70*5
			} else if (prevI427Timer < 70*180 && I_427.Timer >= 70*180) {
				Msg = "You feel gentle muscle spasms all over your body."
				MsgTimer = 70*5
			}
		} else {
			for (i of range(2)) {
				if (I_427.SoundCHN[i]!=0) {
					if (ChannelPlaying(I_427.SoundCHN[i])) {
						StopChannel(I_427.SoundCHN[i])
					}
				}
			}
		}
	} else {
		if (prevI427Timer-FPSfactor < 70*360 && I_427.Timer >= 70*360) {
			Msg = "Your muscles are swelling. You feel more powerful than ever."
			MsgTimer = 70*5
		} else if (prevI427Timer-FPSfactor < 70*390 && I_427.Timer >= 70*390) {
			Msg = "You can't feel your legs. But you don't need legs anymore."
			MsgTimer = 70*5
		}
		I_427.Timer = I_427.Timer + FPSfactor
		if (I_427.Sound[0]=0) {
			I_427.Sound[0] = LoadSound_Strict("SFX/SCP/427/Effect.ogg")
		}
		if (I_427.Sound[1]=0) {
			I_427.Sound[1] = LoadSound_Strict("SFX/SCP/427/Transform.ogg")
		}
		for (i of range(2)) {
			if (!ChannelPlaying(I_427.SoundCHN[i])) {
				I_427.SoundCHN[i] = PlaySound_Strict(I_427.Sound[i])
			}
		}
		if (Rnd(200)<2.0) {
			pvt = CreatePivot()
			PositionEntity (pvt, EntityX(Collider)+Rnd(-0.05,0.05),EntityY(Collider)-0.05,EntityZ(Collider)+Rnd(-0.05,0.05))
			TurnEntity (pvt, 90, 0, 0)
			EntityPick(pvt,0.3)
			de.Decals = CreateDecal(20, PickedX(), PickedY()+0.005, PickedZ(), 90, Rand(360), 0)
			de.Size = Rnd(0.03,0.08)*2.0
			EntityAlpha(de.obj, 1.0)
			ScaleSprite( de.obj, de.Size, de.Size)
			tempchn = PlaySound_Strict (DripSFX(Rand(0,2)))
			ChannelVolume (tempchn, Rnd(0.0,0.8)*SFXVolume)
			ChannelPitch (tempchn, Rand(20000,30000))
			FreeEntity (pvt)
			BlurTimer = 800
		}
		if (I_427.Timer >= 70*420) {
			Kill()
			DeathMSG = Chr(34)+"Requesting support from MTF Nu-7. We need more firepower to take this thing down."+Chr(34)
		} else if (I_427.Timer >= 70*390) {
			Crouch = True
		}
	}
	
}


function UpdateMTF(): int {
	if (PlayerRoom.RoomTemplate.Name = "gateaentrance") {return}
	
	let r: Rooms, n: NPCs
	let dist: float, i: int
	
	//mtf ei vielä spawnannut, spawnataan jos pelaaja menee tarpeeksi lähelle gate b:tä
	if (MTFtimer = 0) {
		if (Rand(30)=1 && PlayerRoom.RoomTemplate.Name$ != "dimension1499") {
			
			let entrance: Rooms = Null
			for (r of Rooms.each) {
				if (Lower(r.RoomTemplate.Name) = "gateaentrance") {
					entrance = r
					Exit()
				}
			}
			
			if (entrance != Null) {
				if (Abs(EntityZ(entrance.obj)-EntityZ(Collider))<30.0) {
					if (PlayerInReachableRoom()) {
						PlayAnnouncement("SFX/Character/MTF/Announc.ogg")
					}
					
					MTFtimer = FPSfactor
					let leader: NPCs
					for (i of range(3)) {
						n.NPCs = CreateNPC(NPCtypeMTF, EntityX(entrance.obj)+0.3*(i-1), 1.0,EntityZ(entrance.obj)+8.0)
						
						if (i = 0) {
							leader = n
						} else {
							n.MTFLeader = leader
						}
						
						n.PrevX = i
					}
				}
			}
		}
	} else {
		if (MTFtimer <= 70*120) {
			MTFtimer = MTFtimer + FPSfactor
		} else if (MTFtimer > 70*120 && MTFtimer < 10000) {
			if (PlayerInReachableRoom()) {
				PlayAnnouncement("SFX/Character/MTF/AnnouncAfter1.ogg")
			}
			MTFtimer = 10000
			} else if (MTFtimer >= 10000 && MTFtimer <= 10000+(70*120)) {
			MTFtimer = MTFtimer + FPSfactor
			} else if (MTFtimer > 10000+(70*120) && MTFtimer < 20000) {
			if (PlayerInReachableRoom()) {
				PlayAnnouncement("SFX/Character/MTF/AnnouncAfter2.ogg")
			}
			MTFtimer = 20000
			} else if (MTFtimer >= 20000 && MTFtimer <= 20000+(70*60)) {
			MTFtimer = MTFtimer + FPSfactor
			} else if (MTFtimer > 20000+(70*60) && MTFtimer < 25000) {
			if (PlayerInReachableRoom()) {
				//If the player has an SCP in their inventory play special voice line.
				for (i of range(MaxItemAmount)) {
					if (Inventory(i) != Null) {
						if ((Left(Inventory(i).itemtemplate.name, 4) == "SCP-") && (Left(Inventory(i).itemtemplate.name, 7) != "SCP-035") && (Left(Inventory(i).itemtemplate.name, 7) != "SCP-093")) {
							PlayAnnouncement("SFX/Character/MTF/ThreatAnnouncPossession.ogg")
							MTFtimer = 25000
							return
							Exit()
						}
					}
				}
				
				PlayAnnouncement("SFX/Character/MTF/ThreatAnnounc"+Rand(1,3)+".ogg")
			}
			MTFtimer = 25000
			
		} else if (MTFtimer >= 25000 && MTFtimer <= 25000+(70*60)) {
			MTFtimer = MTFtimer + FPSfactor
		} else if (MTFtimer > 25000+(70*60) && MTFtimer < 30000) {
			if (PlayerInReachableRoom()) {
				PlayAnnouncement("SFX/Character/MTF/ThreatAnnouncFinal.ogg")
			}
			MTFtimer = 30000
			
		}
	}
	
}


function UpdateInfect() {
	let temp: float, i: int, r: Rooms
	
	let teleportForInfect: int = True
	
	if (PlayerRoom.RoomTemplate.Name = "room860") {
		for (e of Events.each) {
			if (e.EventName = "room860") {
				if (e.EventState = 1.0) {
					teleportForInfect = False
				}
				Exit
			}
		}
	} else if (PlayerRoom.RoomTemplate.Name == "dimension1499" || PlayerRoom.RoomTemplate.Name == "pocketdimension" || PlayerRoom.RoomTemplate.Name == "gatea") {
		teleportForInfect = False
	} else if (PlayerRoom.RoomTemplate.Name = "exit1" && EntityY(Collider)>1040.0*RoomScale) {
		teleportForInfect = False
	}
	
	if (Infect>0) {
		ShowEntity (InfectOverlay)
		
		if (Infect < 93.0) {
			temp=Infect
			if (!I_427.Using && I_427.Timer < 70*360) {
				Infect = Min(Infect+FPSfactor*0.002,100)
			}
			
			BlurTimer = Max(Infect*3*(2.0-CrouchState),BlurTimer)
			
			HeartBeatRate = Max(HeartBeatRate, 100)
			HeartBeatVolume = Max(HeartBeatVolume, Infect/120.0)
			
			EntityAlpha (InfectOverlay, Min(((Infect*0.2)^2)/1000.0,0.5) * (Sin(MilliSecs2()/8.0)+2.0))
			
			for (i of range(7)) {
				if (Infect>i*15+10 && temp <= i*15+10) {
					PlaySound_Strict (LoadTempSound("SFX/SCP/008/Voices"+i+".ogg"))
				}
			}
			
			if (Infect > 20 && temp <= 20.0) {
				Msg = "You feel kinda feverish."
				MsgTimer = 70*6
			} else if (Infect > 40 && temp <= 40.0) {
				Msg = "You feel nauseated."
				MsgTimer = 70*6
			} else if (Infect > 60 && temp <= 60.0) {
				Msg = "The nausea's getting worse."
				MsgTimer = 70*6
			} else if (Infect > 80 && temp <= 80.0) {
				Msg = "You feel very faint."
				MsgTimer = 70*6
			} else if (Infect >= 91.5) {
				BlinkTimer = Max(Min(-10*(Infect-91.5),BlinkTimer),-10)
				IsZombie = True
				UnableToMove = True
				if (Infect >= 92.7 && temp < 92.7) {
					if (teleportForInfect) {
						for (r of Rooms.each) {
							if (r.RoomTemplate.Name="008") {
								PositionEntity (Collider, EntityX(r.Objects[7],True),EntityY(r.Objects[7],True),EntityZ(r.Objects[7],True),True)
								ResetEntity (Collider)
								r.NPC[0] = CreateNPC(NPCtypeD, EntityX(r.Objects[6],True),EntityY(r.Objects[6],True)+0.2,EntityZ(r.Objects[6],True))
								r.NPC[0].Sound = LoadSound_Strict("SFX/SCP/008/KillScientist1.ogg")
								r.NPC[0].SoundChn = PlaySound_Strict(r.NPC[0].Sound)
								tex = LoadTexture_Strict("GFX/npcs/scientist2.jpg")
								EntityTexture (r.NPC[0].obj, tex)
								FreeTexture (tex)
								r.NPC[0].State=6
								PlayerRoom = r
								UnableToMove = False
								Exit()
							}
						}
					}
				}
			}
		} else {
			
			temp=Infect
			Infect = Min(Infect+FPSfactor*0.004,100)
			
			if (teleportForInfect) {
				if (Infect < 94.7) {
					EntityAlpha (InfectOverlay, 0.5 * (Sin(MilliSecs2()/8.0)+2.0))
					BlurTimer = 900
					
					if (Infect > 94.5) {
						BlinkTimer = Max(Min(-50*(Infect-94.5),BlinkTimer),-10)
					}
					PointEntity(Collider, PlayerRoom.NPC[0].Collider)
					PointEntity(PlayerRoom.NPC[0].Collider, Collider)
					PointEntity(Camera, PlayerRoom.NPC[0].Collider,EntityRoll(Camera))
					ForceMove = 0.75
					Injuries = 2.5
					Bloodloss = 0
					UnableToMove = False
					
					Animate2(PlayerRoom.NPC[0].obj, AnimTime(PlayerRoom.NPC[0].obj), 357, 381, 0.3)
				} else if (Infect < 98.5) {
					
					EntityAlpha (InfectOverlay, 0.5 * (Sin(MilliSecs2()/5.0)+2.0))
					BlurTimer = 950
					
					ForceMove = 0.0
					UnableToMove = True
					PointEntity (Camera, PlayerRoom.NPC[0].Collider)
					
					if (temp < 94.7) {
						PlayerRoom.NPC[0].Sound = LoadSound_Strict("SFX/SCP/008/KillScientist2.ogg")
						PlayerRoom.NPC[0].SoundChn = PlaySound_Strict(PlayerRoom.NPC[0].Sound)
						
						DeathMSG = "Subject D-9341 found ingesting Dr. [REDACTED] at Sector [REDACTED]. Subject was immediately terminated by Nine-Tailed Fox and sent for autopsy. "
						DeathMSG = DeathMSG + "SCP-008 infection was confirmed, after which the body was incinerated."
						
						Kill()
						de.Decals = CreateDecal(3, EntityX(PlayerRoom.NPC[0].Collider), 544*RoomScale + 0.01, EntityZ(PlayerRoom.NPC[0].Collider),90,Rnd(360),0)
						de.Size = 0.8
						ScaleSprite(de.obj, de.Size,de.Size)
					} else if (Infect > 96) {
						BlinkTimer = Max(Min(-10*(Infect-96),BlinkTimer),-10)
					} else {
						KillTimer = Max(-350, KillTimer)
					}
					
					if (PlayerRoom.NPC[0].State2=0) {
						Animate2(PlayerRoom.NPC[0].obj, AnimTime(PlayerRoom.NPC[0].obj), 13, 19, 0.3,False)
						if (AnimTime(PlayerRoom.NPC[0].obj) >= 19) {PlayerRoom.NPC[0].State2=1}
					} else {
						Animate2(PlayerRoom.NPC[0].obj, AnimTime(PlayerRoom.NPC[0].obj), 19, 13, -0.3)
						if (AnimTime(PlayerRoom.NPC[0].obj) <= 13) {PlayerRoom.NPC[0].State2=0}
					}
					
					if (ParticleAmount>0) {
						if (Rand(50)=1) {
							p.Particles = CreateParticle(EntityX(PlayerRoom.NPC[0].Collider),EntityY(PlayerRoom.NPC[0].Collider),EntityZ(PlayerRoom.NPC[0].Collider), 5, Rnd(0.05,0.1), 0.15, 200)
							p.speed = 0.01
							p.SizeChange = 0.01
							p.A = 0.5
							p.Achange = -0.01
							RotateEntity (p.pvt, Rnd(360),Rnd(360),0)
						}
					}
					
					PositionEntity(Head, EntityX(PlayerRoom.NPC[0].Collider,True), EntityY(PlayerRoom.NPC[0].Collider,True)+0.65,EntityZ(PlayerRoom.NPC[0].Collider,True),True)
					RotateEntity(Head, (1.0+Sin(MilliSecs2()/5.0))*15, PlayerRoom.angle-180, 0, True)
					MoveEntity(Head, 0,0,-0.4)
					TurnEntity(Head, 80+(Sin(MilliSecs2()/5.0))*30,(Sin(MilliSecs2()/5.0))*40,0)
				}
			} else {
				Kill()
				BlinkTimer = Max(Min(-10*(Infect-96),BlinkTimer),-10)
				if (PlayerRoom.RoomTemplate.Name = "dimension1499") {
					DeathMSG = "The whereabouts of SCP-1499 are still unknown, but a recon team has been dispatched to investigate reports of a violent attack to a church in the Russian town of [REDACTED]."
				} else if (PlayerRoom.RoomTemplate.Name == "gatea" || PlayerRoom.RoomTemplate.Name == "exit1") {
					DeathMSG = "Subject D-9341 found wandering around Gate "
					if (PlayerRoom.RoomTemplate.Name = "gatea") {
						DeathMSG = DeathMSG + "A"
					} else {
						DeathMSG = DeathMSG + "B"
					}
					DeathMSG = DeathMSG + ". Subject was immediately terminated by Nine-Tailed Fox and sent for autopsy. "
					DeathMSG = DeathMSG + "SCP-008 infection was confirmed, after which the body was incinerated."
				} else {
					DeathMSG = ""
				}
			}
		}
		
		
	} else {
		HideEntity (InfectOverlay)
	}
}

//--------------------------------------- math -------------------------------------------------------

function GenerateSeedNumber(seed: string) {
 	let temp: int = 0
 	let shift: int = 0
 	for (i of range(1, Len(seed) + 1)) {
 		temp = temp ^ (Asc(Mid(seed,i,1)) << shift)
 		shift=(shift+1) % 24
	}
 	return temp
}

function Distance(x1: float, y1: float, x2: float, y2: float): float {
	let x: float = x2 - x1, y: float = y2 - y1
	return Sqr(x*x + y*y)
}

function CurveValue(number: float, old: float, smooth: float): float {
	if (FPSfactor = 0) {return old}
	
	if (number < old) {
		return Max(old + (number - old) * (1.0 / smooth * FPSfactor), number)
	} else {
		return Min(old + (number - old) * (1.0 / smooth * FPSfactor), number)
	}
}

function CurveAngle(val: float, old: float, smooth: float): float {
	if (FPSfactor = 0) {return old}
	
   let diff: float = WrapAngle(val) - WrapAngle(old)
   if (diff > 180) {diff = diff - 360}
   if (diff < - 180) {diff = diff + 360}
   return WrapAngle(old + diff * (1.0 / smooth * FPSfactor))
}

function WrapAngle(angle: float): float {
	if (angle = INFINITY) {return 0.0}
	while (angle < 0) {
		angle = angle + 360
	}
	while (angle >= 360) {
		angle = angle - 360
	}
	return angle
}

function GetAngle(x1: float, y1: float, x2: float, y2: float): float {
	return ATan2( y2 - y1, x2 - x1 )
}

function CircleToLineSegIsect(cx: float, cy: float, r: float, l1x: float, l1y: float, l2x: float, l2y: float): int {
	
	//Palauttaa:
	//  True (1) kun:
	//      Ympyrä [keskipiste = (cx, cy): säde = r]
	//      leikkaa janan, joka kulkee pisteiden (l1x, l1y) & (l2x, l2y) kaitta
	//  False (0) muulloin
	
	//Ympyrän keskipisteen ja (ainakin toisen) janan päätepisteen etäisyys < r
	//-> leikkaus
	if (Distance(cx, cy, l1x, l1y) <= r) {
		return True
	}
	
	if (Distance(cx, cy, l2x, l2y) <= r) {
		return True
	}	
	
	//Vektorit (janan vektori ja vektorit janan päätepisteistä ympyrän keskipisteeseen)
	let SegVecX: float = l2x - l1x
	let SegVecY: float = l2y - l1y
	
	let PntVec1X: float = cx - l1x
	let PntVec1Y: float = cy - l1y
	
	let PntVec2X: float = cx - l2x
	let PntVec2Y: float = cy - l2y
	
	//Em. vektorien pistetulot
	let dp1: float = SegVecX * PntVec1X + SegVecY * PntVec1Y
	let dp2: float = -SegVecX * PntVec2X - SegVecY * PntVec2Y
	
	if (dp1 == 0 || dp2 == 0) {
	} else if ((dp1 > 0 && dp2 > 0) || (dp1 < 0 && dp2 < 0)) {
	} else {
		return False
	}
	
	//Janan päätepisteiden kautta kulkevan suoran //yhtälö// (ax + by + c = 0)
	let a: float = (l2y - l1y) / (l2x - l1x)
	let b: float = -1
	let c: float = -(l2y - l1y) / (l2x - l1x) * l1x + l1y
	
	//Ympyrän keskipisteen etäisyys suorasta
	let d: float = Abs(a * cx + b * cy + c) / Sqr(a * a + b * b)
	
	//Ympyrä on liian kaukana
	//-> ei leikkausta
	if (d > r) {return False}
	
	
	//Jos päästään tänne saakka, ympyrä ja jana leikkaavat (tai ovat sisäkkäin)
	return True
}

function Min(a: float, b: float): float {
	if (a < b) {
		return a
	} else {
		return b
	}
}

function Max(a: float, b: float): float {
	if (a > b) {
		return a
	} else {
		return b
	}
}

function point_direction(x1: float,z1: float,x2: float,z2: float): float {
	let dx: float, dz: float
	dx = x1 - x2
	dz = z1 - z2
	return ATan2(dz,dx)
}

function point_distance(x1: float,z1: float,x2: float,z2: float): float {
	let dx: float,dy: float
	dx = x1 - x2
	dy = z1 - z2
	return Sqr((dx*dx)+(dy*dy)) 
}

function angleDist(a0: float,a1: float): float {
	let b: float = a0-a1
	let bb: float
	if (b<-180.0) {
		bb = b+360.0
	} else if (b>180.0) {
		bb = b-360.0
	} else {
		bb = b
	}
	return bb
}

function Inverse(number: float): float {
	return Float(1.0-number)
}

function Rnd_Array(numb1: float,numb2: float,Array1: float,Array2: float): float {
	let whatarray: int = Rand(1,2)
	
	if (whatarray = 1) {
		return Rnd(Array1,numb1)
	} else {
		return Rnd(numb2,Array2)
	}
}

//--------------------------------------- decals -------------------------------------------------------

class Decals {
	obj: int
	SizeChange: float
	Size: float
	MaxSize: float
	AlphaChange: float
	Alpha: float
	blendmode: int
	fx: int
	ID: int
	Timer: float
	
	lifetime: float
	
	x: float
	y: float
	z: float
	pitch: float
	yaw: float
	roll: float
}

function CreateDecal(id: int, x: float, y: float, z: float, pitch: float, yaw: float, roll: float): Decals {
	let d: Decals = new Decals()
	
	d.x = x
	d.y = y
	d.z = z
	d.pitch = pitch
	d.yaw = yaw
	d.roll = roll
	
	d.MaxSize = 1.0
	
	d.Alpha = 1.0
	d.Size = 1.0
	d.obj = CreateSprite()
	d.blendmode = 1
	
	EntityTexture(d.obj, DecalTextures(id))
	EntityFX(d.obj, 0)
	SpriteViewMode(d.obj, 2)
	PositionEntity(d.obj, x, y, z)
	RotateEntity(d.obj, pitch, yaw, roll)
	
	d.ID = id
	
	if (DecalTextures(id) == 0 || d.obj == 0) {return Null}
	
	return d
}

function UpdateDecals() {
	let d: Decals
	for (d of Decals.each) {
		if (d.SizeChange != 0) {
			d.Size=d.Size + d.SizeChange * FPSfactor
			ScaleSprite(d.obj, d.Size, d.Size)
			
			switch (d.ID) {
				case 0:
					if (d.Timer <= 0) {
						let angle: float = Rand(360)
						let temp: float = Rnd(d.Size)
						let d2: Decals = CreateDecal(1, EntityX(d.obj) + Cos(angle) * temp, EntityY(d.obj) - 0.0005, EntityZ(d.obj) + Sin(angle) * temp, EntityPitch(d.obj), Rnd(360), EntityRoll(d.obj))
						d2.Size = Rnd(0.1, 0.5)
						ScaleSprite(d2.obj, d2.Size, d2.Size)
						PlaySound2(DecaySFX(Rand(1, 3)), Camera, d2.obj, 10.0, Rnd(0.1, 0.5))
						d.Timer = Rand(50, 100)
					} else {
						d.Timer= d.Timer-FPSfactor
					}
			}
			
			if (d.Size >= d.MaxSize) {
				d.SizeChange = 0
				d.Size = d.MaxSize
			}
		}
		
		if (d.AlphaChange != 0) {
			d.Alpha = Min(d.Alpha + FPSfactor * d.AlphaChange, 1.0)
			EntityAlpha(d.obj, d.Alpha)
		}
		
		if (d.lifetime > 0) {
			d.lifetime=Max(d.lifetime-FPSfactor,5)
		}
		
		if (d.Size <= 0 || d.Alpha <= 0 || d.lifetime == 5.0 ) {
			FreeEntity(d.obj)
			Delete (d)
		}
	}
}


//--------------------------------------- INI-functions -------------------------------------------------------

class INIFile {
	name: string
	bank: int
	bankOffset: int = 0
	size: int
}

function ReadINILine$(file: INIFile) {
	let rdbyte: int
	let firstbyte: int = True
	let offset: int = file.bankOffset
	let bank: int = file.bank
	let retStr: string = ""
	rdbyte = PeekByte(bank,offset)
	while (((firstbyte) || ((rdbyte!=13) && (rdbyte!=10))) && (offset<file.size)) {
		rdbyte = PeekByte(bank,offset)
		if ((rdbyte!=13) && (rdbyte!=10)) {
			firstbyte = False
			retStr=retStr+Chr(rdbyte)
		}
		offset=offset+1
	}
	file.bankOffset = offset
	return retStr
}

function UpdateINIFile$(filename: string) {
	let file: INIFile = Null
	for (k of INIFile.each) {
		if (k.name = Lower(filename)) {
			file = k
		}
	}
	
	if (file=Null) {return}
	
	if (file.bank!=0) {FreeBank (file.bank)}
	let f: int = ReadFile(file.name)
	let fleSize: int = 1
	while (fleSize<FileSize(file.name)) {
		fleSize=fleSize*2
	}
	file.bank = CreateBank(fleSize)
	file.size = 0
	while (!Eof(f)) {
		PokeByte(file.bank,file.size,ReadByte(f))
		file.size=file.size+1
	}
	CloseFile(f)
}

function GetINIString(file: string, section: string, parameter: string, defaultvalue: string=""): string {
	let TemporaryString$ = ""
	
	let lfile: INIFile = Null
	for (k of INIFile.each) {
		if (k.name = Lower(file)) {
			lfile = k
		}
	}
	
	if (lfile = Null) {
		DebugLog ("CREATE BANK FOR "+file)
		lfile = new INIFile()
		lfile.name = Lower(file)
		lfile.bank = 0
		UpdateINIFile(lfile.name)
	}
	
	lfile.bankOffset = 0
	
	section = Lower(section)
	
	//While Not Eof(f)
	while (lfile.bankOffset<lfile.size) {
		let strtemp: string = ReadINILine(lfile)
		if (Left(strtemp,1) = "[") {
			strtemp$ = Lower(strtemp)
			if (Mid(strtemp, 2, Len(strtemp)-2)=section) {
				do {
					TemporaryString = ReadINILine(lfile)
					if (Lower(Trim(Left(TemporaryString, Max(Instr(TemporaryString, "=") - 1, 0)))) = Lower(parameter)) {
						//CloseFile f
						return Trim( Right(TemporaryString,Len(TemporaryString)-Instr(TemporaryString,"=")) )
					}
				} while (!((Left(TemporaryString, 1) = "[") || (lfile.bankOffset>=lfile.size)))
				
				//CloseFile f
				return defaultvalue
			}
		}
	}
	
	return defaultvalue
}

function GetINIInt(file: string, section: string, parameter: string, defaultvalue: int = 0): int {
	let txt: string = GetINIString(file$, section$, parameter$, defaultvalue)
	if (Lower(txt) = "true") {
		return 1
	} else if (Lower(txt) = "false") {
		return 0
	} else {
		return Int(txt)
	}
}

function GetINIFloat(file: string, section: string, parameter: string, defaultvalue: float = 0.0): float {
	return Float(GetINIString(file, section, parameter, defaultvalue))
}


function GetINIString2(file: string, start: int, parameter: string, defaultvalue: string=""): string {
	let TemporaryString: string = ""
	let f: int = ReadFile(file)
	
	let n: int = 0
	while (!Eof(f)) {
		let strtemp: string = ReadLine(f)
		n=n+1
		if (n=start) {
			do {
				TemporaryString = ReadLine(f)
				if (Lower(Trim(Left(TemporaryString, Max(Instr(TemporaryString, "=") - 1, 0)))) = Lower(parameter)) {
					CloseFile (f)
					return Trim( Right(TemporaryString,Len(TemporaryString)-Instr(TemporaryString,"=")) )
				}
			} while (!(Left(TemporaryString, 1) = "[" || Eof(f)))
			CloseFile (f)
			return defaultvalue
		}
	}
	
	CloseFile (f)
	
	return defaultvalue
}

function GetINIInt2(file: string, start: int, parameter: string, defaultvalue: string=""): int {
	let txt: string = GetINIString2(file, start, parameter, defaultvalue)
	if (Lower(txt) = "true") {
		return 1
	} else if (Lower(txt) = "false") {
		return 0
	} else {
		return Int(txt)
	}
}


function GetINISectionLocation(file: string, section: string): int {
	let Temp: int
	let f: int = ReadFile(file)
	
	section = Lower(section)
	
	let n: int = 0
	while (!Eof(f)) {
		let strtemp: string = ReadLine(f)
		n=n+1
		if (Left(strtemp,1) = "[") {
			strtemp = Lower(strtemp)
			Temp = Instr(strtemp, section)
			if (Temp>0) {
				if (Mid(strtemp, Temp-1, 1) == "[" || Mid(strtemp, Temp-1, 1) == "|") {
					CloseFile (f)
					return n
				}
			}
		}
	}
	
	CloseFile (f)
}

function PutINIValue(file: string, INI_sSection: string, INI_sKey: string, INI_sValue: string): int {
	
	// Returns: True (Success) Or False (Failed)
	
	INI_sSection = "[" + Trim$(INI_sSection) + "]"
	let INI_sUpperSection: string = Upper(INI_sSection)
	INI_sKey = Trim$(INI_sKey)
	INI_sValue = Trim$(INI_sValue)
	let INI_sFilename$ = file$
	
	// Retrieve the INI Data (If it exists)
	
	let INI_sContents$ = INI_FileToString(INI_sFilename)
	
		// (Re)Create the INI file updating/adding the SECTION, KEY && VALUE
	
	let INI_bWrittenKey: int = False
	let INI_bSectionFound: int = False
	let INI_sCurrentSection$ = ""
	
	let INI_lFileHandle: int = WriteFile(INI_sFilename)
	if (INI_lFileHandle = 0) {return False} // Create file failed!
	
	let INI_lOldPos: int = 1
	let INI_lPos: int = Instr(INI_sContents, Chr$(0))
	
	while (INI_lPos != 0) {
		
		let INI_sTemp: string = Mid(INI_sContents, INI_lOldPos, (INI_lPos - INI_lOldPos))
		
		if (INI_sTemp != "") {
			
			if (Left$(INI_sTemp, 1) == "[" && Right$(INI_sTemp, 1) == "]") {
				
					// Process SECTION
				
				if ((INI_sCurrentSection = INI_sUpperSection) && (INI_bWrittenKey = False)) {
					INI_bWrittenKey = INI_CreateKey(INI_lFileHandle, INI_sKey, INI_sValue)
				}
				INI_sCurrentSection = Upper$(INI_CreateSection(INI_lFileHandle, INI_sTemp))
				if (INI_sCurrentSection = INI_sUpperSection) {INI_bSectionFound = True}
				
			} else {
				if (Left(INI_sTemp, 1) = ":") {
					WriteLine (INI_lFileHandle, INI_sTemp)
				} else {
						// KEY=VALUE				
					let lEqualsPos: int = Instr(INI_sTemp, "=")
					if (lEqualsPos != 0) {
						if ((INI_sCurrentSection = INI_sUpperSection) && (Upper$(Trim$(Left$(INI_sTemp, (lEqualsPos - 1)))) = Upper$(INI_sKey))) {
							if (INI_sValue != "") {INI_CreateKey (INI_lFileHandle, INI_sKey, INI_sValue)}
							INI_bWrittenKey = True
						} else {
							WriteLine (INI_lFileHandle, INI_sTemp)
						}
					}
				}
				
			}
			
		}
		
			// Move through the INI file...
		
		INI_lOldPos = INI_lPos + 1
		INI_lPos = Instr(INI_sContents, Chr$(0), INI_lOldPos)
		
	}
	
		// KEY wasn//t found in the INI file - Append a New SECTION If required && create our KEY=VALUE Line
	
	if (INI_bWrittenKey = False) {
		if (INI_bSectionFound = False) {INI_CreateSection (INI_lFileHandle, INI_sSection)}
		INI_CreateKey (INI_lFileHandle, INI_sKey, INI_sValue)
	}
	
	CloseFile (INI_lFileHandle)
	
	return True // Success
	
}

function INI_FileToString(INI_sFilename: string): string {
	
	let INI_sString: string = ""
	let INI_lFileHandle: int = ReadFile(INI_sFilename)
	if (INI_lFileHandle != 0) {
		while (Not(Eof(INI_lFileHandle))) {
			INI_sString = INI_sString + ReadLine$(INI_lFileHandle) + Chr$(0)
		}
		CloseFile (INI_lFileHandle)
	}
	return INI_sString
	
}

function INI_CreateSection(INI_lFileHandle: int, INI_sNewSection: string): string {
	
	if (FilePos(INI_lFileHandle) != 0) {WriteLine (INI_lFileHandle, "")} // Blank Line between sections
	WriteLine (INI_lFileHandle, INI_sNewSection)
	return INI_sNewSection
	
}

function INI_CreateKey(INI_lFileHandle: int, INI_sKey: string, INI_sValue: string): int {
	WriteLine (INI_lFileHandle, INI_sKey + " = " + INI_sValue)
	return True
}

//Save options to .ini.
function SaveOptionsINI() {
	
	PutINIValue(OptionFile, "options", "mouse sensitivity", MouseSens)
	PutINIValue(OptionFile, "options", "invert mouse y", InvertMouse)
	PutINIValue(OptionFile, "options", "bump mapping enabled", BumpEnabled)			
	PutINIValue(OptionFile, "options", "HUD enabled", HUDenabled)
	PutINIValue(OptionFile, "options", "screengamma", ScreenGamma)
	PutINIValue(OptionFile, "options", "antialias", Opt_AntiAlias)
	PutINIValue(OptionFile, "options", "vsync", Vsync)
	PutINIValue(OptionFile, "options", "show FPS", ShowFPS)
	PutINIValue(OptionFile, "options", "framelimit", Framelimit)
	PutINIValue(OptionFile, "options", "achievement popup enabled", AchvMSGenabled)
	PutINIValue(OptionFile, "options", "room lights enabled", EnableRoomLights)
	PutINIValue(OptionFile, "options", "texture details", TextureDetails)
	PutINIValue(OptionFile, "console", "enabled", CanOpenConsole)
	PutINIValue(OptionFile, "console", "auto opening", ConsoleOpening)
	PutINIValue(OptionFile, "options", "antialiased text", AATextEnable)
	PutINIValue(OptionFile, "options", "particle amount", ParticleAmount)
	PutINIValue(OptionFile, "options", "enable vram", EnableVRam)
	PutINIValue(OptionFile, "options", "mouse smoothing", MouseSmooth)
	
	PutINIValue(OptionFile, "audio", "music volume", MusicVolume)
	PutINIValue(OptionFile, "audio", "sound volume", PrevSFXVolume)
	PutINIValue(OptionFile, "audio", "sfx release", EnableSFXRelease)
	PutINIValue(OptionFile, "audio", "enable user tracks", EnableUserTracks)
	PutINIValue(OptionFile, "audio", "user track setting", UserTrackMode)
	
	PutINIValue(OptionFile, "binds", "Right key", KEY_RIGHT)
	PutINIValue(OptionFile, "binds", "Left key", KEY_LEFT)
	PutINIValue(OptionFile, "binds", "Up key", KEY_UP)
	PutINIValue(OptionFile, "binds", "Down key", KEY_DOWN)
	PutINIValue(OptionFile, "binds", "Blink key", KEY_BLINK)
	PutINIValue(OptionFile, "binds", "Sprint key", KEY_SPRINT)
	PutINIValue(OptionFile, "binds", "Inventory key", KEY_INV)
	PutINIValue(OptionFile, "binds", "Crouch key", KEY_CROUCH)
	PutINIValue(OptionFile, "binds", "Save key", KEY_SAVE)
	PutINIValue(OptionFile, "binds", "Console key", KEY_CONSOLE)
	
}

//--------------------------------------- MakeCollBox -functions -------------------------------------------------------


// Create a collision box For a mesh entity taking into account entity scale
// (will not work in non-uniform scaled space)
function MakeCollBox(mesh: int) {
	let sx: float = EntityScaleX(mesh, 1)
	let sy: float = Max(EntityScaleY(mesh, 1), 0.001)
	let sz: float = EntityScaleZ(mesh, 1)
	GetMeshExtents(mesh)
	EntityBox (mesh, Mesh_MinX * sx, Mesh_MinY * sy, Mesh_MinZ * sz, Mesh_MagX * sx, Mesh_MagY * sy, Mesh_MagZ * sz)
}

// Find mesh extents
function GetMeshExtents(Mesh: int) {
	let s: int
	let surf: int
	let surfs: int
	let v: int
	let verts: int
	let x: float
	let y: float
	let z: float
	let minx: float = INFINITY
	let miny: float = INFINITY
	let minz: float = INFINITY
	let maxx: float = -INFINITY
	let maxy: float = -INFINITY
	let maxz: float = -INFINITY
	
	surfs = CountSurfaces(Mesh)
	
	for (s of range(1, surfs + 1)) {
		surf = GetSurface(Mesh, s)
		verts = CountVertices(surf)
		
		for (v of range(verts)) {
			x = VertexX(surf, v)
			y = VertexY(surf, v)
			z = VertexZ(surf, v)
			
			if (x < minx) {minx = x}
			if (x > maxx) {maxx = x}
			if (y < miny) {miny = y}
			if (y > maxy) {maxy = y}
			if (z < minz) {minz = z}
			if (z > maxz) {maxz = z}
		}
	}
	
	Mesh_MinX = minx
	Mesh_MinY = miny
	Mesh_MinZ = minz
	Mesh_MaxX = maxx
	Mesh_MaxY = maxy
	Mesh_MaxZ = maxz
	Mesh_MagX = maxx-minx
	Mesh_MagY = maxy-miny
	Mesh_MagZ = maxz-minz
	
}

function EntityScaleX(entity: int, globl: int = False): float {
	if (globl) {TFormVector (1, 0, 0, entity, 0)} else {TFormVector (1, 0, 0, entity, GetParent(entity))}
	return Sqr(TFormedX() * TFormedX() + TFormedY() * TFormedY() + TFormedZ() * TFormedZ())
} 

function EntityScaleY(entity: int, globl: int = False): float {
	if (globl) {TFormVector( 0, 1, 0, entity, 0)} else {TFormVector (0, 1, 0, entity, GetParent(entity))}
	return Sqr(TFormedX() * TFormedX() + TFormedY() * TFormedY() + TFormedZ() * TFormedZ())
} 

function EntityScaleZ(entity: int, globl: int = False): float {
	if (globl) {TFormVector (0, 0, 1, entity, 0)} else {TFormVector (0, 0, 1, entity, GetParent(entity))}
	return Sqr(TFormedX() * TFormedX() + TFormedY() * TFormedY() + TFormedZ() * TFormedZ())
} 

function Graphics3DExt(width: int, height: int, depth: int= 32,mode: int= 2): int {
	//If FE_InitExtFlag = 1 Then DeInitExt() //prevent FastExt from breaking itself
	Graphics3D (width,height,depth,mode)
	InitFastResize()
	//InitExt()
	AntiAlias (GetINIInt(OptionFile,"options","antialias"))
	//TextureAnisotropy% (GetINIInt(OptionFile,"options","anisotropy"),-1)
}

function ResizeImage2(image: int,width: int,height: int) {
    img = CreateImage(width,height)
	
	oldWidth = ImageWidth(image)
	oldHeight = ImageHeight(image)
	CopyRect (0,0,oldWidth,oldHeight,1024-oldWidth/2,1024-oldHeight/2,ImageBuffer(image),TextureBuffer(fresize_texture))
	SetBuffer( BackBuffer())
	ScaleRender(0,0,2048.0 / Float(RealGraphicWidth) * Float(width) / Float(oldWidth), 2048.0 / Float(RealGraphicWidth) * Float(height) / Float(oldHeight))
	//might want to replace Float(GraphicWidth) with Max(GraphicWidth,GraphicHeight) if portrait sizes cause issues
	//everyone uses landscape so it's probably a non-issue
	CopyRect (RealGraphicWidth/2-width/2,RealGraphicHeight/2-height/2,width,height,0,0,BackBuffer(),ImageBuffer(img))
	
    FreeImage (image)
    return img
}

function RenderWorld2() {
	CameraProjMode(ark_blur_cam,0)
	CameraProjMode(Camera,1)
	
	if (WearingNightVision>0 && WearingNightVision<3) {
		AmbientLight(Min(Brightness*2,255), Min(Brightness*2,255), Min(Brightness*2,255))
	} else if (WearingNightVision=3) {
		AmbientLight(255,255,255)
	} else if (PlayerRoom!=Null) {
		if ((PlayerRoom.RoomTemplate.Name!="173") && (PlayerRoom.RoomTemplate.Name!="exit1") && (PlayerRoom.RoomTemplate.Name!="gatea")) {
			AmbientLight(Brightness, Brightness, Brightness)
		}
	}
	
	IsNVGBlinking = False
	HideEntity (NVBlink)
	
	CameraViewport (Camera,0,0,GraphicWidth,GraphicHeight)
	
	let hasBattery: int = 2
	let power: int = 0
	if ((WearingNightVision == 1) || (WearingNightVision == 2)) {
		for (i of range(MaxItemAmount)) {
			if (Inventory(i)!=Null) {
				if ((WearingNightVision == 1 && Inventory(i).itemtemplate.tempname == "nvgoggles") || (WearingNightVision == 2 && Inventory(i).itemtemplate.tempname == "supernv")) {
					Inventory(i).state = Inventory(i).state - (FPSfactor * (0.02 * WearingNightVision))
					power%=Int(Inventory(i).state)
					if (Inventory(i).state<=0.0) { //this nvg can't be used
						hasBattery = 0
						Msg = "The batteries in these night vision goggles died."
						BlinkTimer = -1.0
						MsgTimer = 350
						Exit
 					} else if (Inventory(i).state<=100.0) {
						hasBattery = 1
					}
				}
			}
		}
		
		if (hasBattery) {
			RenderWorld()
		}
	} else {
		RenderWorld()
	}
	
	CurrTrisAmount = TrisRendered()

	if (hasBattery == 0 && WearingNightVision! == 3) {
		IsNVGBlinking = True
		ShowEntity (NVBlink)
	}
	
	if (BlinkTimer < - 16 || BlinkTimer > - 6) {
		if (WearingNightVision=2 && hasBattery!=0) { //show a HUD
			NVTimer=NVTimer-FPSfactor
			
			if (NVTimer<=0.0) {
				for (np of NPCs.each) {
					np.NVX = EntityX(np.Collider,True)
					np.NVY = EntityY(np.Collider,True)
					np.NVZ = EntityZ(np.Collider,True)
				}
				IsNVGBlinking = True
				ShowEntity (NVBlink)
				if (NVTimer<=-10) {
					NVTimer = 600.0
				}
			}
			
			Color (255,255,255)
			
			AASetFont (Font3)
			
			let plusY: int = 0
			if (hasBattery=1) {plusY = 40}
			
			AAText (GraphicWidth/2,(20+plusY)*MenuScale,"REFRESHING DATA IN",True,False)
			
			AAText (GraphicWidth/2,(60+plusY)*MenuScale,Max(f2s(NVTimer/60.0,1),0.0),True,False)
			AAText (GraphicWidth/2,(100+plusY)*MenuScale,"SECONDS",True,False)
			
			temp = CreatePivot()
			temp2 = CreatePivot()
			PositionEntity (temp, EntityX(Collider), EntityY(Collider), EntityZ(Collider))
			
			Color (255,255,255)
			
			for (np of NPCs.each) {
				if (np.NVName!="" && (!np.HideFromNVG)) { //don't waste your time if the string is empty
					PositionEntity (temp2,np.NVX,np.NVY,np.NVZ)
					dist = EntityDistance(temp2,Collider)
					if (dist<23.5) { //don't draw text if the NPC is too far away
						PointEntity (temp, temp2)
						yawvalue = WrapAngle(EntityYaw(Camera) - EntityYaw(temp))
						xvalue = 0.0
						if (yawvalue > 90 && yawvalue <= 180) {
							xvalue = Sin(90)/90*yawvalue
						} else if (yawvalue > 180 && yawvalue < 270) {
							xvalue = Sin(270)/yawvalue*270
						} else {
							xvalue = Sin(yawvalue)
						}
						pitchvalue = WrapAngle(EntityPitch(Camera) - EntityPitch(temp))
						yvalue = 0.0
						if (pitchvalue > 90 && pitchvalue <= 180) {
							yvalue = Sin(90)/90*pitchvalue
						} else if (pitchvalue > 180 && pitchvalue < 270) {
							yvalue = Sin(270)/pitchvalue*270
						} else {
							yvalue = Sin(pitchvalue)
						}
						
						if (!IsNVGBlinking) {
							AAText(GraphicWidth / 2 + xvalue * (GraphicWidth / 2),GraphicHeight / 2 - yvalue * (GraphicHeight / 2),np.NVName,True,True)
							AAText(GraphicWidth / 2 + xvalue * (GraphicWidth / 2),GraphicHeight / 2 - yvalue * (GraphicHeight / 2) + 30.0 * MenuScale,f2s(dist,1)+" m",True,True)
						}
					}
				}
			}
			
			FreeEntity (temp)
			FreeEntity (temp2)
			
			Color(0,0,55)
			for (k of range(11)) {
				Rect (45,GraphicHeight*0.5-(k*20),54,10,True)
			}
			Color(0,0,255)
			for (l of range(Floor((power%+50)*0.01) + 1)) {
				Rect (45,GraphicHeight*0.5-(l*20),54,10,True)
			}
			DrawImage (NVGImages,40,GraphicHeight*0.5+30,1)
			
			Color(255,255,255)
		} else if (WearingNightVision=1 && hasBattery!=0) {
			Color(0,55,0)
			for (k of range(11)) {
				Rect(45,GraphicHeight*0.5-(k*20),54,10,True)
			}
			Color(0,255,0)
			for (l of range(Floor((power%+50)*0.01) + 1)) {
				Rect(45,GraphicHeight*0.5-(l*20),54,10,True)
			}
			DrawImage (NVGImages,40,GraphicHeight*0.5+30,0)
		}
	}
	
	//render sprites
	CameraProjMode(ark_blur_cam,2)
	CameraProjMode(Camera,0)
	RenderWorld()
	CameraProjMode(ark_blur_cam,0)
	
	if (BlinkTimer < -16 || BlinkTimer > -6) {
		if ((WearingNightVision == 1 || WearingNightVision == 2) && (hasBattery == 1) && ((MilliSecs2() % 800) < 400)) {
			Color (255,0,0)
			AASetFont (Font3)
			
			AAText (GraphicWidth/2,20*MenuScale,"WARNING: LOW BATTERY",True,False)
			Color (255,255,255)
		}
	}
}


function ScaleRender(x: float,y: float,hscale: float=1.0,vscale: float=1.0) {
	if (Camera!=0) {HideEntity (Camera)}
	WireFrame (0)
	ShowEntity (fresize_image)
	ScaleEntity (fresize_image,hscale,vscale,1.0)
	PositionEntity (fresize_image, x, y, 1.0001)
	ShowEntity (fresize_cam)
	RenderWorld()
	HideEntity (fresize_cam)
	HideEntity (fresize_image)
	WireFrame (WireframeState)
	if (Camera!=0) {ShowEntity (Camera)}
}

function InitFastResize() {
    //Create Camera
	let cam: int = CreateCamera()
	CameraProjMode (cam, 2)
	CameraZoom (cam, 0.1)
	CameraClsMode (cam, 0, 0)
	CameraRange (cam, 0.1, 1.5)
	MoveEntity (cam, 0, 0, -10000)
	
	fresize_cam = cam
	
    //ark_sw = GraphicsWidth()
    //ark_sh = GraphicsHeight()
	
    //Create sprite
	let spr: int = CreateMesh(cam)
	let sf: int = CreateSurface(spr)
	AddVertex (sf, -1, 1, 0, 0, 0)
	AddVertex (sf, 1, 1, 0, 1, 0)
	AddVertex (sf, -1, -1, 0, 0, 1)
	AddVertex (sf, 1, -1, 0, 1, 1)
	AddTriangle (sf, 0, 1, 2)
	AddTriangle (sf, 3, 2, 1)
	EntityFX (spr, 17)
	ScaleEntity (spr, 2048.0 / Float(RealGraphicWidth), 2048.0 / Float(RealGraphicHeight), 1)
	PositionEntity (spr, 0, 0, 1.0001)
	EntityOrder (spr, -100001)
	EntityBlend (spr, 1)
	fresize_image = spr
	
    //Create texture
	fresize_texture = CreateTexture(2048, 2048, 1+256)
	fresize_texture2 = CreateTexture(2048, 2048, 1+256)
	TextureBlend (fresize_texture2,3)
	SetBuffer(TextureBuffer(fresize_texture2))
	ClsColor( 0,0,0)
	Cls()
	SetBuffer(BackBuffer())
	//TextureAnisotropy(fresize_texture)
	EntityTexture (spr, fresize_texture,0,0)
	EntityTexture (spr, fresize_texture2,0,1)
	
	HideEntity (fresize_cam)
}

//--------------------------------------- Some new 1.3 -functions -------------------------------------------------------

function UpdateLeave1499() {
	let r: Rooms, it: Items,r2: Rooms,i: int
	let r1499: Rooms
	
	if ((!Wearing1499) && PlayerRoom.RoomTemplate.Name$ == "dimension1499") {
		for (r of Rooms.each) {
			if (r = NTF_1499PrevRoom) {
				BlinkTimer = -1
				NTF_1499X = EntityX(Collider)
				NTF_1499Y = EntityY(Collider)
				NTF_1499Z = EntityZ(Collider)
				PositionEntity (Collider, NTF_1499PrevX, NTF_1499PrevY+0.05, NTF_1499PrevZ)
				ResetEntity(Collider)
				PlayerRoom = r
				UpdateDoors()
				UpdateRooms()
				if (PlayerRoom.RoomTemplate.Name = "room3storage") {
					if (EntityY(Collider)<-4600*RoomScale) {
						for (i of range(3)) {
							PlayerRoom.NPC[i].State = 2
							PositionEntity(PlayerRoom.NPC[i].Collider, EntityX(PlayerRoom.Objects[PlayerRoom.NPC[i].State2],True),EntityY(PlayerRoom.Objects[PlayerRoom.NPC[i].State2],True)+0.2,EntityZ(PlayerRoom.Objects[PlayerRoom.NPC[i].State2],True))
							ResetEntity (PlayerRoom.NPC[i].Collider)
							PlayerRoom.NPC[i].State2 = PlayerRoom.NPC[i].State2 + 1
							if (PlayerRoom.NPC[i].State2 > PlayerRoom.NPC[i].PrevState) {
								PlayerRoom.NPC[i].State2 = (PlayerRoom.NPC[i].PrevState-3)
							}
						}
					}
				} else if (PlayerRoom.RoomTemplate.Name = "pocketdimension") {
					CameraFogColor (Camera, 0,0,0)
					CameraClsColor (Camera, 0,0,0)
				}
				for (r2 of Rooms.each) {
					if (r2.RoomTemplate.Name = "dimension1499") {
						r1499 = r2
						Exit
					}
				}
				for (it of Items.each) {
					it.disttimer = 0
					if (it.itemtemplate.tempname == "scp1499" || it.itemtemplate.tempname == "super1499") {
						if (EntityY(it.collider) >= EntityY(r1499.obj)-5) {
							PositionEntity (it.collider,NTF_1499PrevX,NTF_1499PrevY+(EntityY(it.collider)-EntityY(r1499.obj)),NTF_1499PrevZ)
							ResetEntity (it.collider)
							Exit()
						}
					}
				}
				r1499 = Null
				ShouldEntitiesFall = False
				PlaySound_Strict (LoadTempSound("SFX/SCP/1499/Exit.ogg"))
				NTF_1499PrevX = 0.0
				NTF_1499PrevY = 0.0
				NTF_1499PrevZ = 0.0
				NTF_1499PrevRoom = Null
				Exit()
			}
		}
	}
	
}

function CheckForPlayerInFacility() {
	//False (=0): NPC is not in facility (mostly meant for "dimension1499")
	//True (=1): NPC is in facility
	//2: NPC is in tunnels (maintenance tunnels/049 tunnels/939 storage room, etc...)
	
	if (EntityY(Collider)>100.0) {
		return False
	}
	if (EntityY(Collider)< -10.0) {
		return 2
	}
	if (EntityY(Collider)> 7.0 && EntityY(Collider)<=100.0) {
		return 2
	}
	
	return True
}

function IsItemGoodFor1162(itt: ItemTemplates) {
	let IN: string = itt.tempname
	
	switch (itt.tempname) {
		case "key1", "key2", "key3":
			return True
		case "misc", "420", "cigarette":
			return True
		case "vest", "finevest","gasmask":
			return True
		case "radio","18vradio":
			return True
		case "clipboard","eyedrops","nvgoggles":
			return True
		case "drawing":
			if (itt.img!=0) {FreeImage (itt.img)}
			itt.img = LoadImage_Strict("GFX/items/1048/1048_"+Rand(1,20)+".jpg") //Gives a random drawing.
			return True
		default:
			if (itt.tempname != "paper") {
				return False
			} else if (Instr(itt.name, "Leaflet")) {
				return False
			} else {
				//if the item is a paper, only allow spawning it if the name contains the word "note" or "log"
				//(because those are items created recently, which D-9341 has most likely never seen)
				return ((!Instr(itt.name, "Note")) && (!Instr(itt.name, "Log")))
			}
	}
}

function ControlSoundVolume() {
	let snd: Sound,i
	
	for (snd of Sound.each) {
		for (i of range(32)) {
			ChannelVolume (snd.channels[i],SFXVolume)
		}
	}
	
}

function UpdateDeafPlayer() {
	
	if (DeafTimer > 0) {
		DeafTimer = DeafTimer-FPSfactor
		SFXVolume = 0.0
		if (SFXVolume > 0.0) {
			ControlSoundVolume()
		}
		DebugLog (DeafTimer)
	} else {
		DeafTimer = 0
		SFXVolume = PrevSFXVolume
		if (DeafPlayer) {ControlSoundVolume()}
		DeafPlayer = False
		//EndIf
	}
	
}

function CheckTriggers(): string {
	let i: int,sx: float,sy: float,sz: float
	let inside: int = -1
	
	if (PlayerRoom.TriggerboxAmount = 0) {
		return ""
	} else {
		for (i of range(PlayerRoom.TriggerboxAmount)) {
			EntityAlpha (PlayerRoom.Triggerbox[i],1.0)
			sx = EntityScaleX(PlayerRoom.Triggerbox[i], 1)
			sy = Max(EntityScaleY(PlayerRoom.Triggerbox[i], 1), 0.001)
			sz = EntityScaleZ(PlayerRoom.Triggerbox[i], 1)
			GetMeshExtents(PlayerRoom.Triggerbox[i])
			if (DebugHUD) {
				EntityColor (PlayerRoom.Triggerbox[i],255,255,0)
				EntityAlpha (PlayerRoom.Triggerbox[i],0.2)
			} else {
				EntityColor (PlayerRoom.Triggerbox[i],255,255,255)
				EntityAlpha (PlayerRoom.Triggerbox[i],0.0)
			}
			if (EntityX(Collider)>((sx*Mesh_MinX)+PlayerRoom.x) && EntityX(Collider)<((sx*Mesh_MaxX)+PlayerRoom.x)) {
				if (EntityY(Collider)>((sy*Mesh_MinY)+PlayerRoom.y) && EntityY(Collider)<((sy*Mesh_MaxY)+PlayerRoom.y)) {
					if (EntityZ(Collider)>((sz*Mesh_MinZ)+PlayerRoom.z) && EntityZ(Collider)<((sz*Mesh_MaxZ)+PlayerRoom.z)) {
						inside = i
						Exit()
					}
				}
			}
		}
		
		if (inside > -1) {return PlayerRoom.TriggerboxName[inside]}
	}
	
}

function ScaledMouseX(): int {
	return Float(MouseX()-(RealGraphicWidth*0.5*(1.0-AspectRatioRatio)))*Float(GraphicWidth)/Float(RealGraphicWidth*AspectRatioRatio)
}

function ScaledMouseY(): int {
	return Float(MouseY())*Float(GraphicHeight)/Float(RealGraphicHeight)
}

function CatchErrors(location: string) {
	let errStr: string = ErrorLog()
	let errF: int
	if (Len(errStr)>0) {
		if (FileType(ErrorFile)=0) {
			errF = WriteFile(ErrorFile)
			WriteLine(errF,"An error occured in SCP - Containment Breach!")
			WriteLine(errF,"Version: "+VersionNumber)
			WriteLine(errF,"Save compatible version: "+CompatibleNumber)
			WriteLine(errF,"Date and time: "+CurrentDate()+" at "+CurrentTime())
			WriteLine(errF,"Total video memory (MB): "+TotalVidMem()/1024/1024)
			WriteLine(errF,"Available video memory (MB): "+AvailVidMem()/1024/1024)
			GlobalMemoryStatus (m.MEMORYSTATUS)
			WriteLine(errF,"Global memory status: "+(m.dwAvailPhys/1024/1024)+" MB/"+(m.dwTotalPhys/1024/1024)+" MB ("+(m.dwAvailPhys/1024)+" KB/"+(m.dwTotalPhys/1024)+" KB)")
			WriteLine(errF,"Triangles rendered: "+CurrTrisAmount)
			WriteLine(errF,"Active textures: "+ActiveTextures())
			WriteLine(errF,"")
			WriteLine(errF,"Error(s):")
		} else {
			let canwriteError: int = True
			errF = OpenFile(ErrorFile)
			while (!Eof(errF)) {
				let l: string = ReadLine(errF)
				if (Left(l,Len(location))=location) {
					canwriteError = False
					Exit()
				}
			}
			if (canwriteError) {
				SeekFile (errF,FileSize(ErrorFile))
			}
		}
		if (canwriteError) {
			WriteLine (errF,location+" ***************")
			while (Len(errStr)>0) {
				WriteLine (errF,errStr)
				DebugLog (errStr)
				errStr = ErrorLog()
			}
		}
		Msg = "Blitz3D Error! Details in "+Chr(34)+ErrorFile+Chr(34)
		MsgTimer = 20*70
		CloseFile (errF)
	}
}

function Create3DIcon(width: int,height: int,modelpath: string,modelX: float=0,modelY: float=0,modelZ: float=0,modelPitch: float=0,modelYaw: float=0,modelRoll: float=0,modelscaleX: float=1,modelscaleY: float=1,modelscaleZ: float=1,withfog: boolean = False) {
	let img: int = CreateImage(width,height)
	let cam: int = CreateCamera()
	let model: int
	
	CameraRange (cam,0.01,16)
	CameraViewport (cam,0,0,width,height)
	if (withfog) {
		CameraFogMode (cam,1)
		CameraFogRange (cam,CameraFogNear,CameraFogFar)
	}
	
	if (Right(Lower(modelpath$),6)=".rmesh") {
		model = LoadRMesh(modelpath$,Null)
	} else {
		model = LoadMesh(modelpath$)
	}
	ScaleEntity (model,modelscaleX,modelscaleY,modelscaleZ)
	PositionEntity (model,modelX,modelY,modelZ)
	RotateEntity (model,modelPitch,modelYaw,modelRoll)
	
	//Cls
	RenderWorld()
	CopyRect (0,0,width,height,0,0,BackBuffer(),ImageBuffer(img))
	
	FreeEntity (model)
	FreeEntity (cam)
	return img
}

function PlayAnnouncement(file: string) { //This function streams the announcement currently playing
	
	if (IntercomStreamCHN != 0) {
		StopStream_Strict(IntercomStreamCHN)
		IntercomStreamCHN = 0
	}
	
	IntercomStreamCHN = StreamSound_Strict(file$,SFXVolume,0)
	
}

function UpdateStreamSounds() {
	let e: Events
	
	if (FPSfactor > 0) {
		if (IntercomStreamCHN != 0) {
			SetStreamVolume_Strict(IntercomStreamCHN,SFXVolume)
		}
		for (e of Events.each) {
			if (e.SoundCHN!=0) {
				if (e.SoundCHN_isStream) {
					SetStreamVolume_Strict(e.SoundCHN,SFXVolume)
				}
			}
			if (e.SoundCHN2 != 0) {
				if (e.SoundCHN2_isStream) {
					SetStreamVolume_Strict(e.SoundCHN2,SFXVolume)
				}
			}
		}
	}
	
	if (!PlayerInReachableRoom()) {
		if (PlayerRoom.RoomTemplate.Name != "exit1" && PlayerRoom.RoomTemplate.Name != "gatea") {
			if (IntercomStreamCHN != 0) {
				StopStream_Strict(IntercomStreamCHN)
				IntercomStreamCHN = 0
			}
			if (PlayerRoom.RoomTemplate.Name$ != "dimension1499") {
				for (e of Events.each) {
					if (e.SoundCHN!=0 && e.SoundCHN_isStream) {
						StopStream_Strict(e.SoundCHN)
						e.SoundCHN = 0
						e.SoundCHN_isStream = 0
					}
					if (e.SoundCHN2!=0 && e.SoundCHN2_isStream) {
						StopStream_Strict(e.SoundCHN2)
						e.SoundCHN = 0
						e.SoundCHN_isStream = 0
					}
				}
			}
		}
	}
	
}

function TeleportEntity(entity: int,x: float,y: float,z: float,customradius: float=0.3,isglobal: int=False,pickrange: float=2.0,dir: int=0) {
	let pvt,pick
	//dir = 0 - towards the floor (default)
	//dir = 1 - towrads the ceiling (mostly for PD decal after leaving dimension)
	
	pvt = CreatePivot()
	PositionEntity(pvt, x,y+0.05,z,isglobal)
	if (dir%=0) {
		RotateEntity(pvt,90,0,0)
	} else {
		RotateEntity(pvt,-90,0,0)
	}
	pick = EntityPick(pvt,pickrange)
	if (pick != 0) {
		if (dir%=0) {
			PositionEntity(entity, x,PickedY()+customradius+0.02,z,isglobal)
		} else {
			PositionEntity(entity, x,PickedY()+customradius-0.02,z,isglobal)
		}
		DebugLog("Entity teleported successfully")
	} else {
		PositionEntity(entity,x,y,z,isglobal)
		DebugLog("Warning: no ground found when teleporting an entity")
	}
	FreeEntity (pvt)
	ResetEntity (entity)
	DebugLog("Teleported entity to: "+EntityX(entity)+"/"+EntityY(entity)+"/"+EntityZ(entity))
	
}

function PlayStartupVideos() {
	
	if (GetINIInt("options.ini","options","play startup video")=0) {return}
	
	let Cam = CreateCamera() 
	CameraClsMode (Cam, 0, 1)
	let Quad = CreateQuad()
	let Texture = CreateTexture(2048, 2048, 256 | 16 | 32)
	EntityTexture (Quad, Texture)
	EntityFX (Quad, 1)
	CameraRange (Cam, 0.01, 100)
	TranslateEntity (Cam, 1.0 / 2048 ,-1.0 / 2048 ,-1.0)
	EntityParent (Quad, Cam, 1)
	
	let ScaledGraphicHeight: int
	let Ratio: float = Float(RealGraphicWidth)/Float(RealGraphicHeight)
	if (Ratio>1.76 && Ratio<1.78) {
		ScaledGraphicHeight = RealGraphicHeight
		DebugLog("Not Scaled")
	} else {
		ScaledGraphicHeight = Float(RealGraphicWidth)/(16.0/9.0)
		DebugLog("Scaled: "+ScaledGraphicHeight)
	}
	
	let moviefile$ = "GFX/menu/startup_Undertow"
	BlitzMovie_Open(moviefile$+".avi") //Get movie size
	let moview = BlitzMovie_GetWidth()
	let movieh = BlitzMovie_GetHeight()
	BlitzMovie_Close()
	let image = CreateImage(moview, movieh)
	let SplashScreenVideo = BlitzMovie_OpenDecodeToImage(moviefile$+".avi", image, False)
	SplashScreenVideo = BlitzMovie_Play()
	let SplashScreenAudio = StreamSound_Strict(moviefile$+".ogg",SFXVolume,0)
	do {
		Cls()
		ProjectImage(image, RealGraphicWidth, ScaledGraphicHeight, Quad, Texture)
		Flip()
	} while (!(GetKey() || (!IsStreamPlaying_Strict(SplashScreenAudio))))
	StopStream_Strict(SplashScreenAudio)
	BlitzMovie_Stop()
	BlitzMovie_Close()
	FreeImage (image)
	
	Cls()
	Flip()
	
	moviefile$ = "GFX/menu/startup_TSS"
	BlitzMovie_Open(moviefile$+".avi") //Get movie size
	moview = BlitzMovie_GetWidth()
	movieh = BlitzMovie_GetHeight()
	BlitzMovie_Close()
	image = CreateImage(moview, movieh)
	SplashScreenVideo = BlitzMovie_OpenDecodeToImage(moviefile$+".avi", image, False)
	SplashScreenVideo = BlitzMovie_Play()
	SplashScreenAudio = StreamSound_Strict(moviefile$+".ogg",SFXVolume,0)
	do {
		Cls()
		ProjectImage(image, RealGraphicWidth, ScaledGraphicHeight, Quad, Texture)
		Flip()
	} while  (!(GetKey() || (!IsStreamPlaying_Strict(SplashScreenAudio))))
	StopStream_Strict(SplashScreenAudio)
	BlitzMovie_Stop()
	BlitzMovie_Close()
	
	FreeTexture (Texture)
	FreeEntity (Quad)
	FreeEntity (Cam)
	FreeImage (image)
	Cls()
	Flip()
	
}

function ProjectImage(img, w: float, h: float, Quad: int, Texture: int) {
	
	let img_w: float = ImageWidth(img)
	let img_h: float = ImageHeight(img)
	if (img_w > 2048) {img_w = 2048}
	if (img_h > 2048) {img_h = 2048}
	if (img_w < 1) {img_w = 1}
	if (img_h < 1) {img_h = 1}
	
	if (w > 2048) {w = 2048}
	if (h > 2048) {h = 2048}
	if (w < 1) {w = 1}
	if (h < 1) {h = 1}
	
	let w_rel: float = w / img_w
	let h_rel: float = h / img_h
	let g_rel: float = 2048.0 / Float(RealGraphicWidth)
	let dst_x = 1024 - (img_w / 2.0)
	let dst_y = 1024 - (img_h / 2.0)
	CopyRect (0, 0, img_w, img_h, dst_x, dst_y, ImageBuffer(img), TextureBuffer(Texture))
	ScaleEntity (Quad, w_rel * g_rel, h_rel * g_rel, 0.0001)
	RenderWorld()
	
}

function CreateQuad() {
	
	mesh = CreateMesh()
	surf = CreateSurface(mesh)
	v0 = AddVertex(surf,-1.0, 1.0, 0, 0, 0)
	v1 = AddVertex(surf, 1.0, 1.0, 0, 1, 0)
	v2 = AddVertex(surf, 1.0,-1.0, 0, 1, 1)
	v3 = AddVertex(surf,-1.0,-1.0, 0, 0, 1)
	AddTriangle(surf, v0, v1, v2)
	AddTriangle(surf, v0, v2, v3)
	UpdateNormals (mesh)
	return mesh
	
}

function CanUseItem(canUseWithHazmat: int, canUseWithGasMask: int, canUseWithEyewear: int) {
	if (canUseWithHazmat = False && WearingHazmat) {
		Msg = "You can't use that item while wearing a hazmat suit."
		MsgTimer = 70*5
		return False
	} else if (canUseWithGasMask = False && (WearingGasMask || Wearing1499)) {
		Msg = "You can't use that item while wearing a gas mask."
		MsgTimer = 70*5
		return False
	} else if (canUseWithEyewear = False && (WearingNightVision)) {
		Msg = "You can't use that item while wearing headgear."
	}
	
	return True
}

function ResetInput() {
	
	FlushKeys()
	FlushMouse()
	MouseHit1 = 0
	MouseHit2 = 0
	MouseDown1 = 0
	MouseUp1 = 0
	MouseHit(1)
	MouseHit(2)
	MouseDown(1)
	GrabbedEntity = 0
	Input_ResetTime = 10.0
	
}

function Update096ElevatorEvent(e: Events,EventState: float,d: Doors,elevatorobj: int): float {
	let prevEventState: float = EventState
	
	if (EventState < 0) {
		EventState = 0
		prevEventState = 0
	}
	
	if (d.openstate == 0 && d.open == False) {
		if (Abs(EntityX(Collider)-EntityX(elevatorobj,True))<=280.0*RoomScale+(0.015*FPSfactor)) {
			if (Abs(EntityZ(Collider)-EntityZ(elevatorobj,True))<=280.0*RoomScale+(0.015*FPSfactor)) {
				if (Abs(EntityY(Collider)-EntityY(elevatorobj,True))<=280.0*RoomScale+(0.015*FPSfactor)) {
					d.locked = True
					if (EventState = 0) {
						TeleportEntity(Curr096.Collider,EntityX(d.frameobj),EntityY(d.frameobj)+1.0,EntityZ(d.frameobj),Curr096.CollRadius)
						PointEntity (Curr096.Collider,elevatorobj)
						RotateEntity (Curr096.Collider,0,EntityYaw(Curr096.Collider),0)
						MoveEntity (Curr096.Collider,0,0,-0.5)
						ResetEntity (Curr096.Collider)
						Curr096.State = 6
						SetNPCFrame(Curr096,0)
						e.Sound = LoadSound_Strict("SFX/SCP/096/ElevatorSlam.ogg")
						EventState = EventState + FPSfactor * 1.4
					}
				}
			}
		}
	}
	
	if (EventState > 0) {
		if (prevEventState = 0) {
			e.SoundCHN = PlaySound_Strict(e.Sound)
		}
		
		if (EventState > 70*1.9 && EventState < 70*2+FPSfactor) {
			CameraShake = 7
		} else if (EventState > 70*4.2 && EventState < 70*4.25+FPSfactor) {
			CameraShake = 1
		} else if (EventState > 70*5.9 && EventState < 70*5.95+FPSfactor) {
			CameraShake = 1
		} else if (EventState > 70*7.25 && EventState < 70*7.3+FPSfactor) {
			CameraShake = 1
			d.fastopen = True
			d.open = True
			Curr096.State = 4
			Curr096.LastSeen = 1
		} else if (EventState > 70*8.1 && EventState < 70*8.15+FPSfactor) {
			CameraShake = 1
		}
		
		if (EventState <= 70*8.1) {
			d.openstate = Min(d.openstate,20)
		}
		EventState = EventState + FPSfactor * 1.4
	}
	return EventState
	
}

function RotateEntity90DegreeAngles(entity: int) {
	let angle = WrapAngle(entity)
	
	if (angle < 45.0) {
		return 0
 	} else if (angle >= 45.0 && angle < 135) {
		return 90
 	} else if (angle >= 135 && angle < 225) {
		return 180
	} else {
		return 270
	}
}
