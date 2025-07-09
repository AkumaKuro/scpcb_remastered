import { AASetFont, AAText, AATextEnable, AATextEnable_Prev, AATextCam, InitAAFont, AALoadFont, AAStringWidth, AAStringHeight } from "./AAText"
import { AchvMSGenabled } from "./Achievements"
import { GetINIInt, PutINIValue, GetINIString } from "./Converter"
import { SAFE, CUSTOM, SAVEANYWHERE, SAVEONSCREENS, HARD, EASY, NORMAL, difficulties, SelectedDifficulty } from "./Difficulty"
import { G_viewport_width, G_viewport_height } from "./fullscreen_window_fix"
import { AppTitle, ChannelPlaying, Chr, Color, DebugLog, EntityFX, Exit, FileType, Float, float, FlushKeys, FreeSound, ImageWidth, Int, int, KeyHit, range, SeedRnd, SetFont } from "./Helper/bbhelper"
import { CurrentDir, Eof, ReadLine, CloseFile, ReadByte, ReadInt } from "./Helper/Files"
import { Rect, SetBuffer, BackBuffer, GfxModeWidth, GfxModeHeight, Flip, ClsColor, Cls, TextureBuffer, BBText } from "./Helper/graphics"
import { Rand, Abs } from "./Helper/math"
import { Delete, EntityAlpha, FreeEntity } from "./Helper/Mesh"
import { LoadSound } from "./Helper/sounds"
import { Left, Replace, Len, Trim, Mid, Lower, Instr, Right, StringHeight } from "./Helper/strings"
import { DrawImage, FreeTexture, CreateTexture, TextureBlend } from "./Helper/textures"
import { KeyName } from "./KeyName"
import { FSOUND_Stream_Stop } from "./lib/fmod"
import { MenuWhite, MenuBlack, MenuScale, ArrowIMG, OptionFile, GraphicWidth, GraphicHeight, Font1, FPSfactor, Font2, MouseDown1, MouseHit1, Opt_AntiAlias, ButtonSFX, MainMenuOpen, CompatibleNumber, Vsync, EnableRoomLights, ScreenGamma, TextureDetails, TextureFloat, EnableSFXRelease, EnableSFXRelease_Prev, InvertMouse, MouseSmooth, KEY_UP, KEY_LEFT, KEY_DOWN, KEY_RIGHT, KEY_SAVE, KEY_BLINK, KEY_SPRINT, KEY_INV, KEY_CROUCH, KEY_CONSOLE, CanOpenConsole, ShowFPS, CurrFrameLimit, Framelimit, Font3, Font4, Font5, ConsoleFont, VersionNumber, Fullscreen, CursorIMG, LauncherWidth, LauncherHeight, RealGraphicWidth, RealGraphicHeight, LauncherIMG, TotalGFXModes, GfxModeWidths, GfxModeHeights, SelectedGFXMode, GFXModes, BlinkMeterIMG, SelectedGFXDriver, BorderlessWindowed, LauncherEnabled, LoadingScreenAmount, LoadingScreenText, SelectedLoadingScreen, LoadingBack, fresize_texture, AspectRatioRatio, fresize_image, fresize_texture2, MouseUp1, BumpEnabled, Create3DIcon, CurrMusicStream, EnableVRam, Graphics3DExt, HUDenabled, Max, MilliSecs2, Min, MouseSens, SaveOptionsINI, ScaledMouseX, ScaledMouseY, ScaleRender } from "./Main"
import { MusicVolume } from "./MusicPlayer"
import { LoadImage_Strict, LoadSound_Strict } from "./StrictLoads"


const CurrentGameVersion: string = "1.3.10"

var MenuBack: int = LoadImage_Strict("GFX/menu/back.jpg")
var MenuText: int = LoadImage_Strict("GFX/menu/scptext.jpg")
var Menu173: int = LoadImage_Strict("GFX/menu/173back.jpg")
MenuWhite = LoadImage_Strict("GFX/menu/menuwhite.jpg")
MenuBlack = LoadImage_Strict("GFX/menu/menublack.jpg")
MaskImage (MenuBlack, 255,255,0)
var QuickLoadIcon: int = LoadImage_Strict("GFX/menu/QuickLoading.png")

ResizeImage(MenuBack, ImageWidth(MenuBack) * MenuScale, ImageHeight(MenuBack) * MenuScale)
ResizeImage(MenuText, ImageWidth(MenuText) * MenuScale, ImageHeight(MenuText) * MenuScale)
ResizeImage(Menu173, ImageWidth(Menu173) * MenuScale, ImageHeight(Menu173) * MenuScale)
ResizeImage(QuickLoadIcon, ImageWidth(QuickLoadIcon) * MenuScale, ImageHeight(QuickLoadIcon) * MenuScale)

for (let i of range(4)) {
	ArrowIMG[i] = LoadImage_Strict("GFX/menu/arrow.png")
	RotateImage(ArrowIMG[i], 90 * i)
	HandleImage(ArrowIMG[i], 0, 0)
}

var RandomSeed: string

var MenuBlinkTimer: int[] = new Array(2)
var MenuBlinkDuration: int[] = new Array(2)

MenuBlinkTimer[0] = 1
MenuBlinkTimer[1] = 1

var MenuStr: string
var MenuStrX: int
var MenuStrY: int

var MainMenuTab: int


var IntroEnabled: int = GetINIInt(OptionFile, "options", "intro enabled")

var SelectedInputBox: int

var SavePath: string = "Saves/"
var SaveMSG: string

//nykyisen tallennuksen nimi ja samalla missä kansiossa tallennustiedosto sijaitsee saves-kansiossa
var CurrSave: string

var SaveGameAmount: int
var SaveGames: string[] = new Array(SaveGameAmount+1) 
var SaveGameTime: string[] = new Array(SaveGameAmount + 1)
var SaveGameDate: string[] = new Array(SaveGameAmount + 1)
var SaveGameVersion: string[] = new Array(SaveGameAmount + 1)

var SavedMapsAmount: int = 0
var SavedMaps: string[] = new Array(SavedMapsAmount+1)
var SavedMapsAuthor: string[] = new Array(SavedMapsAmount+1)

var SelectedMap: string

LoadSaveGames()

var CurrLoadGamePage: int = 0

function UpdateMainMenu() {
	let x: int
	let y: int
	let width: int
	let height: int
	let temp: int
	
	Color (0,0,0)
	Rect (0,0,GraphicWidth,GraphicHeight,true)
	
	ShowPointer()
	
	DrawImage(MenuBack, 0, 0)
	
	if ((MilliSecs2() % MenuBlinkTimer(0)) >= Rand(MenuBlinkDuration(0))) {
		DrawImage(Menu173, GraphicWidth - ImageWidth(Menu173), GraphicHeight - ImageHeight(Menu173))
	}
	
	If Rand(300) = 1 Then
		MenuBlinkTimer(0) = Rand(4000, 8000)
		MenuBlinkDuration(0) = Rand(200, 500)
	End If
	
	AASetFont Font1
	
	MenuBlinkTimer(1)=MenuBlinkTimer(1)-FPSfactor
	if (MenuBlinkTimer(1) < MenuBlinkDuration(1)) {
		Color(50, 50, 50)
		AAText(MenuStrX + Rand(-5, 5), MenuStrY + Rand(-5, 5), MenuStr, true)
		if (MenuBlinkTimer(1) < 0) {
			MenuBlinkTimer(1) = Rand(700, 800)
			MenuBlinkDuration(1) = Rand(10, 35)
			MenuStrX = Rand(700, 1000) * MenuScale
			MenuStrY = Rand(100, 600) * MenuScale
			
			switch (Rand(0, 22)) {
				case 0, 2, 3:
					MenuStr = "DON'T BLINK"
				case 4, 5:
					MenuStr = "Secure. Contain. Protect."
				case 6, 7, 8:
					MenuStr = "You want happy endings? Fuck you."
				case 9, 10, 11:
					MenuStr = "Sometimes we would have had time to scream."
				case 12, 19:
					MenuStr = "NIL"
				case 13:
					MenuStr = "NO"
				case 14:
					MenuStr = "black white black white black white gray"
				case 15:
					MenuStr = "Stone does not care"
				case 16:
					MenuStr = "9341"
				case 17:
					MenuStr = "It controls the doors"
				case 18:
					MenuStr = "e8m106]af173o+079m895w914"
				case 20:
					MenuStr = "It has taken over everything"
				case 21:
					MenuStr = "The spiral is growing"
				case 22:
					MenuStr = Chr(34)+"Some kind of gestalt effect due to massive reality damage."+Chr(34)
			}
		}
	}
	
	AASetFont (Font2)
	
	DrawImage(MenuText, GraphicWidth / 2 - ImageWidth(MenuText) / 2, GraphicHeight - 20 * MenuScale - ImageHeight(MenuText))
	
	if (GraphicWidth > 1240 * MenuScale) {
		DrawTiledImageRect(MenuWhite, 0, 5, 512, 7 * MenuScale, 985.0 * MenuScale, 407.0 * MenuScale, (GraphicWidth - 1240 * MenuScale) + 300, 7 * MenuScale)
	}
	
	if (!MouseDown1) {
		OnSliderID = 0
	}
	
	if (MainMenuTab = 0) {
		for (i of range(4)) {
			temp = false
			x = 159 * MenuScale
			y = (286 + 100 * i) * MenuScale
			
			width = 400 * MenuScale
			height = 70 * MenuScale
			
			temp = (MouseHit1 && MouseOn(x, y, width, height))
			
			let txt: string
			switch (i) {
				case 0:
					txt = "NEW GAME"
					RandomSeed = ""
					if (temp) {
						if (Rand(15)=1) {
							switch (Rand(13)) {
								case 1 :
									RandomSeed = "NIL"
								case 2:
									RandomSeed = "NO"
								case 3:
									RandomSeed = "d9341"
								case 4:
									RandomSeed = "5CP_I73"
								case 5:
									RandomSeed = "DONTBLINK"
								case 6:
									RandomSeed = "CRUNCH"
								case 7:
									RandomSeed = "die"
								case 8:
									RandomSeed = "HTAED"
								case 9:
									RandomSeed = "rustledjim"
								case 10:
									RandomSeed = "larry"
								case 11:
									RandomSeed = "JORGE"
								case 12:
									RandomSeed = "dirtymetal"
								case 13:
									RandomSeed = "whatpumpkin"
							}
						} else {
							n = Rand(4,8)
							for (i of range(1, n + 1)) {
								if (Rand(3)=1) {
									RandomSeed = RandomSeed + Rand(0,9)
								} else {
									RandomSeed = RandomSeed + Chr(Rand(97,122))
								}
							}							
						}
						
						MainMenuTab = 1
					}
				case 1:
					txt = "LOAD GAME"
					if (temp) {
						LoadSaveGames()
						MainMenuTab = 2
					}
				case 2:
					txt = "OPTIONS"
					if (temp) {MainMenuTab = 3}
				case 3:
					txt = "QUIT"
					if (temp) {
						FSOUND_Stream_Stop(CurrMusicStream)
						End()
					}
			}
			
			DrawButton(x, y, width, height, txt)			
		}	
		
	} else {
		
		x = 159 * MenuScale
		y = 286 * MenuScale
		
		width = 400 * MenuScale
		height = 70 * MenuScale
		
		DrawFrame(x, y, width, height)
		
		if (DrawButton(x + width + 20 * MenuScale, y, 580 * MenuScale - width - 20 * MenuScale, height, "BACK", false)) {
			switch (MainMenuTab) {
				case 1:
					PutINIValue(OptionFile, "options", "intro enabled", IntroEnabled)
					MainMenuTab = 0
				case 2:
					CurrLoadGamePage = 0
					MainMenuTab = 0
				case 3,5,6,7: //save the options:
					SaveOptionsINI()
					
					UserTrackCheck = 0
					UserTrackCheck2 = 0
					
					AntiAlias (Opt_AntiAlias)
					MainMenuTab = 0
				case 4: //move back to the "new game" tab:
					MainMenuTab = 1
					CurrLoadGamePage = 0
					MouseHit1 = false
				default:
					MainMenuTab = 0
			}
		}
		
		switch (MainMenuTab) {
			case 1: // New game
				//[Block]
				
				x = 159 * MenuScale
				y = 286 * MenuScale
				
				width = 400 * MenuScale
				height = 70 * MenuScale
				
				Color(255, 255, 255)
				AASetFont (Font2)
				AAText(x + width / 2, y + height / 2, "NEW GAME", true, true)
				
				x = 160 * MenuScale
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				height = 330 * MenuScale
				
				DrawFrame(x, y, width, height)				
				
				AASetFont (Font1)
				
				AAText (x + 20 * MenuScale, y + 20 * MenuScale, "Name:")
				CurrSave = InputBox(x + 150 * MenuScale, y + 15 * MenuScale, 200 * MenuScale, 30 * MenuScale, CurrSave, 1)
				CurrSave = Left(CurrSave, 15)
				CurrSave = Replace(CurrSave,":","")
				CurrSave = Replace(CurrSave,".","")
				CurrSave = Replace(CurrSave,"/","")
				CurrSave = Replace(CurrSave,"\\","")
				CurrSave = Replace(CurrSave,"<","")
				CurrSave = Replace(CurrSave,">","")
				CurrSave = Replace(CurrSave,"|","")
				CurrSave = Replace(CurrSave,"?","")
				CurrSave = Replace(CurrSave,Chr(34),"")
				CurrSave = Replace(CurrSave,"*","")
				
				Color (255,255,255)
				if (SelectedMap = "") {
					AAText (x + 20 * MenuScale, y + 60 * MenuScale, "Map seed:")
					RandomSeed = Left(InputBox(x+150*MenuScale, y+55*MenuScale, 200*MenuScale, 30*MenuScale, RandomSeed, 3),15)	
				} else {
					AAText (x + 20 * MenuScale, y + 60 * MenuScale, "Selected map:")
					Color (255, 255, 255)
					Rect(x+150*MenuScale, y+55*MenuScale, 200*MenuScale, 30*MenuScale)
					Color (0, 0, 0)
					Rect(x+150*MenuScale+2, y+55*MenuScale+2, 200*MenuScale-4, 30*MenuScale-4)
					
					Color (255, 0,0)
					if (Len(SelectedMap)>15) {
						AAText(x+150*MenuScale + 100*MenuScale, y+55*MenuScale + 15*MenuScale, Left(SelectedMap,14)+"...", true, true)
					} else {
						AAText(x+150*MenuScale + 100*MenuScale, y+55*MenuScale + 15*MenuScale, SelectedMap, true, true)
					}
					
					if (DrawButton(x+370*MenuScale, y+55*MenuScale, 120*MenuScale, 30*MenuScale, "Deselect", false)) {
						SelectedMap=""
					}
				}	
				
				AAText(x + 20 * MenuScale, y + 110 * MenuScale, "Enable intro sequence:")
				IntroEnabled = DrawTick(x + 280 * MenuScale, y + 110 * MenuScale, IntroEnabled)	
				
				//Local modeName$, modeDescription$, selectedDescription$
				AAText (x + 20 * MenuScale, y + 150 * MenuScale, "Difficulty:")				
				for (i of range(SAFE, CUSTOM + 1)) {
					if (DrawTick(x + 20 * MenuScale, y + (180+30*i) * MenuScale, (SelectedDifficulty = difficulties(i)))) {
						SelectedDifficulty = difficulties(i)
					}
					Color(difficulties(i).r,difficulties(i).g,difficulties(i).b)
					AAText(x + 60 * MenuScale, y + (180+30*i) * MenuScale, difficulties(i)\name)
				}
				
				Color(255, 255, 255)
				DrawFrame(x + 150 * MenuScale,y + 155 * MenuScale, 410*MenuScale, 150*MenuScale)
				
				if (SelectedDifficulty.customizable) {
					SelectedDifficulty.permaDeath =  DrawTick(x + 160 * MenuScale, y + 165 * MenuScale, (SelectedDifficulty.permaDeath))
					AAText(x + 200 * MenuScale, y + 165 * MenuScale, "Permadeath")
					
					if (DrawTick(x + 160 * MenuScale, y + 195 * MenuScale, SelectedDifficulty.saveType = SAVEANYWHERE && (!SelectedDifficulty.permaDeath), SelectedDifficulty.permaDeath)) {
						SelectedDifficulty.saveType = SAVEANYWHERE
					} else {
						SelectedDifficulty.saveType = SAVEONSCREENS
					}
					
					AAText(x + 200 * MenuScale, y + 195 * MenuScale, "Save anywhere")	
					
					SelectedDifficulty.aggressiveNPCs =  DrawTick(x + 160 * MenuScale, y + 225 * MenuScale, SelectedDifficulty.aggressiveNPCs)
					AAText(x + 200 * MenuScale, y + 225 * MenuScale, "Aggressive NPCs")
					
					//Other factor's difficulty
					Color (255,255,255)
					DrawImage (ArrowIMG(1),x + 155 * MenuScale, y+251*MenuScale)
					if (MouseHit1) {
						if (ImageRectOverlap(ArrowIMG(1),x + 155 * MenuScale, y+251*MenuScale, ScaledMouseX(),ScaledMouseY(),0,0)) {
							if (SelectedDifficulty.otherFactors < HARD) {
								SelectedDifficulty.otherFactors = SelectedDifficulty.otherFactors + 1
							} else {
								SelectedDifficulty.otherFactors = EASY
							}
							PlaySound_Strict(ButtonSFX)
						}
					}
					Color (255,255,255)
					switch (SelectedDifficulty.otherFactors) {
						case EASY:
							AAText(x + 200 * MenuScale, y + 255 * MenuScale, "Other difficulty factors: Easy")
						case NORMAL:
							AAText(x + 200 * MenuScale, y + 255 * MenuScale, "Other difficulty factors: Normal")
						case HARD:
							AAText(x + 200 * MenuScale, y + 255 * MenuScale, "Other difficulty factors: Hard")
					}
				} else {
					RowText(SelectedDifficulty.description, x+160*MenuScale, y+160*MenuScale, (410-20)*MenuScale, 200)					
				}
				
				if (DrawButton(x, y + height + 20 * MenuScale, 160 * MenuScale, 70 * MenuScale, "Load map", false)) {
					MainMenuTab = 4
					LoadSavedMaps()
				}
				
				AASetFont (Font2)
				
				if (DrawButton(x + 420 * MenuScale, y + height + 20 * MenuScale, 160 * MenuScale, 70 * MenuScale, "START", false)) {
					if (CurrSave = "") {CurrSave = "untitled"}
					
					if (RandomSeed = "") {
						RandomSeed = Abs(MilliSecs())
					}
					
					SeedRnd (GenerateSeedNumber(RandomSeed))
					
					let SameFound: boolean = false
					
					for (i of range(1, SaveGameAmount + 1)) {
						if (SaveGames(i - 1) = CurrSave) {
							SameFound = SameFound + 1
						}
					}
						
					if (SameFound > 0) {
						CurrSave = CurrSave + " (" + (SameFound + 1) + ")"
					}
					
					LoadEntities()
					LoadAllSounds()
					InitNewGame()
					MainMenuOpen = false
					FlushKeys()
					FlushMouse()
					
					PutINIValue(OptionFile, "options", "intro enabled", IntroEnabled%)
					
				}
				
				//[End Block]
			case 2: //load game
				//[Block]
				
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				//height = 300 * MenuScale
				height = 510 * MenuScale
				
				DrawFrame(x, y, width, height)
				
				x = 159 * MenuScale
				y = 286 * MenuScale
				
				width = 400 * MenuScale
				height = 70 * MenuScale
				
				Color(255, 255, 255)
				AASetFont (Font2)
				AAText(x + width / 2, y + height / 2, "LOAD GAME", true, true)
				
				x = 160 * MenuScale
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				height = 296 * MenuScale
				
				//AASetFont Font1	
				
				AASetFont (Font2)
				
				if (CurrLoadGamePage < Ceil(Float(SaveGameAmount)/6.0)-1 && SaveMSG == "") { 
					if (DrawButton(x+530*MenuScale, y + 510*MenuScale, 50*MenuScale, 55*MenuScale, ">")) {
						CurrLoadGamePage = CurrLoadGamePage+1
					}
				} else {
					DrawFrame(x+530*MenuScale, y + 510*MenuScale, 50*MenuScale, 55*MenuScale)
					Color(100, 100, 100)
					AAText(x+555*MenuScale, y + 537.5*MenuScale, ">", true, true)
				}
				if (CurrLoadGamePage > 0 && SaveMSG == "") {
					if (DrawButton(x, y + 510*MenuScale, 50*MenuScale, 55*MenuScale, "<")) {
						CurrLoadGamePage = CurrLoadGamePage-1
					}
				} else {
					DrawFrame(x, y + 510*MenuScale, 50*MenuScale, 55*MenuScale)
					Color(100, 100, 100)
					AAText(x+25*MenuScale, y + 537.5*MenuScale, "<", true, true)
				}
				
				DrawFrame(x+50*MenuScale,y+510*MenuScale,width-100*MenuScale,55*MenuScale)
				
				AAText(x+(width/2.0),y+536*MenuScale,"Page "+Int(Max((CurrLoadGamePage+1),1))+"/"+Int(Max((Int(Ceil(Float(SaveGameAmount)/6.0))),1)),true,true)
				
				AASetFont (Font1)
				
				if (CurrLoadGamePage > Ceil(Float(SaveGameAmount)/6.0)-1) {
					CurrLoadGamePage = CurrLoadGamePage - 1
				}
				
				if (SaveGameAmount = 0) {
					AAText (x + 20 * MenuScale, y + 20 * MenuScale, "No saved games.")
				} else {
					x = x + 20 * MenuScale
					y = y + 20 * MenuScale
					
					for (i of range((1+(6*CurrLoadGamePage)), 6+(6*CurrLoadGamePage) + 1)) {
						if (i <= SaveGameAmount) {
							DrawFrame(x,y,540* MenuScale, 70* MenuScale)
							
							if (SaveGameVersion(i - 1) != CompatibleNumber && SaveGameVersion(i - 1) != CurrentGameVersion) {
								Color (255,0,0)
							} else {
								Color (255,255,255)
							}
							
							AAText(x + 20 * MenuScale, y + 10 * MenuScale, SaveGames(i - 1))
							AAText(x + 20 * MenuScale, y + (10+18) * MenuScale, SaveGameTime(i - 1)) //y + (10+23) * MenuScale
							AAText(x + 120 * MenuScale, y + (10+18) * MenuScale, SaveGameDate(i - 1))
							AAText(x + 20 * MenuScale, y + (10+36) * MenuScale, SaveGameVersion(i - 1))
							
							if (SaveMSG = "") {
								if (SaveGameVersion(i - 1) != CompatibleNumber && SaveGameVersion(i - 1) != CurrentGameVersion) {
									DrawFrame(x + 280 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale)
									Color(255, 0, 0)
									AAText(x + 330 * MenuScale, y + 34 * MenuScale, "Load", true, true)
								} else {
									if (DrawButton(x + 280 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale, "Load", false)) {
										LoadEntities()
										LoadAllSounds()
										LoadGame(SavePath + SaveGames(i - 1) + "/")
										CurrSave = SaveGames(i - 1)
										InitLoadGame()
										MainMenuOpen = false
									}
								}
								
								if (DrawButton(x + 400 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale, "Delete", false)) {
									SaveMSG = SaveGames(i - 1)
									DebugLog (SaveMSG)
									Exit()
								}
							} else {
								DrawFrame(x + 280 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale)
								if (SaveGameVersion(i - 1) != CompatibleNumber && SaveGameVersion(i - 1) != CurrentGameVersion) {
									Color(255, 0, 0)
								} else {
									Color(100, 100, 100)
								}
								AAText(x + 330 * MenuScale, y + 34 * MenuScale, "Load", true, true)
								
								DrawFrame(x + 400 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale)
								Color(100, 100, 100)
								AAText(x + 450 * MenuScale, y + 34 * MenuScale, "Delete", true, true)
							}
							
							y = y + 80 * MenuScale
						} else {
							Exit
						}
					}
					
					if (SaveMSG != "") {
						x = 740 * MenuScale
						y = 376 * MenuScale
						DrawFrame(x, y, 420 * MenuScale, 200 * MenuScale)
						RowText("Are you sure you want to delete this save?", x + 20 * MenuScale, y + 15 * MenuScale, 400 * MenuScale, 200 * MenuScale)
						//AAText(x + 20 * MenuScale, y + 15 * MenuScale, "Are you sure you want to delete this save?")
						if (DrawButton(x + 50 * MenuScale, y + 150 * MenuScale, 100 * MenuScale, 30 * MenuScale, "Yes", false)) {
							DeleteFile(CurrentDir() + SavePath + SaveMSG + "\save.txt")
							DeleteDir(CurrentDir() + SavePath + SaveMSG)
							SaveMSG = ""
							LoadSaveGames()
						}
						if (DrawButton(x + 250 * MenuScale, y + 150 * MenuScale, 100 * MenuScale, 30 * MenuScale, "No", false)) {
							SaveMSG = ""
						}
					}
				}

				//[End Block]
			case 3,5,6,7: //options
				//[Block]
				
				x = 159 * MenuScale
				y = 286 * MenuScale
				
				width = 400 * MenuScale
				height = 70 * MenuScale
				
				Color(255, 255, 255)
				AASetFont (Font2)
				AAText(x + width / 2, y + height / 2, "OPTIONS", true, true)
				
				x = 160 * MenuScale
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				height = 60 * MenuScale
				DrawFrame(x, y, width, height)
				
				Color (0,255,0)
				if (MainMenuTab = 3) {
					Rect(x+15*MenuScale,y+10*MenuScale,(width/5)+10*MenuScale,(height/2)+10*MenuScale,true)
				} else if (MainMenuTab = 5) {
					Rect(x+155*MenuScale,y+10*MenuScale,(width/5)+10*MenuScale,(height/2)+10*MenuScale,true)
				} else if (MainMenuTab = 6) {
					Rect(x+295*MenuScale,y+10*MenuScale,(width/5)+10*MenuScale,(height/2)+10*MenuScale,true)
				} else if (MainMenuTab = 7) {
					Rect(x+435*MenuScale,y+10*MenuScale,(width/5)+10*MenuScale,(height/2)+10*MenuScale,true)
				}
				
				Color (255,255,255)
				if (DrawButton(x+20*MenuScale,y+15*MenuScale,width/5,height/2, "GRAPHICS", false)) {
					MainMenuTab = 3
				}
				if (DrawButton(x+160*MenuScale,y+15*MenuScale,width/5,height/2, "AUDIO", false)) {
					MainMenuTab = 5
				}
				if (DrawButton(x+300*MenuScale,y+15*MenuScale,width/5,height/2, "CONTROLS", false)) {
					MainMenuTab = 6
				}
				if (DrawButton(x+440*MenuScale,y+15*MenuScale,width/5,height/2, "ADVANCED", false)) {
					MainMenuTab = 7
				}
				
				AASetFont (Font1)
				y = y + 70 * MenuScale
				
				if (MainMenuTab != 5) {
					UserTrackCheck = 0
					UserTrackCheck2 = 0
				}
				
				let tx: float = x+width
				let ty: float = y
				let tw: float = 400*MenuScale
				let th: float = 150*MenuScale
				
				//DrawOptionsTooltip(tx,ty,tw,th,"")
				
				if (MainMenuTab = 3) { //Graphics
					//[Block]
					//height = 380 * MenuScale
					height = 330 * MenuScale
					DrawFrame(x, y, width, height)
					
					y=y+20*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Enable bump mapping:")	
					BumpEnabled = DrawTick(x + 310 * MenuScale, y + MenuScale, BumpEnabled)
					if (MouseOn(x + 310 * MenuScale, y + MenuScale, 20*MenuScale,20*MenuScale) && OnSliderID==0) {
						DrawOptionsTooltip(tx,ty,tw,th,"bump")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "VSync:")
					Vsync = DrawTick(x + 310 * MenuScale, y + MenuScale, Vsync)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID==0) {
						DrawOptionsTooltip(tx,ty,tw,th,"vsync")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Anti-aliasing:")
					Opt_AntiAlias = DrawTick(x + 310 * MenuScale, y + MenuScale, Opt_AntiAlias)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID==0) {
						DrawOptionsTooltip(tx,ty,tw,th,"antialias")
					}
					
					y=y+30*MenuScale //40
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Enable room lights:")
					EnableRoomLights = DrawTick(x + 310 * MenuScale, y + MenuScale, EnableRoomLights)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"roomlights")
					}
					
					y=y+30*MenuScale
					
					ScreenGamma = (SlideBar(x + 310*MenuScale, y+6*MenuScale, 150*MenuScale, ScreenGamma*50.0)/50.0)
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Screen gamma")
					if (MouseOn(x+310*MenuScale,y+6*MenuScale,150*MenuScale+14,20) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"gamma",ScreenGamma)
					}
					
					y=y+50*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Particle amount:")
					ParticleAmount = Slider3(x+310*MenuScale,y+6*MenuScale,150*MenuScale,ParticleAmount,2,"MINIMAL","REDUCED","FULL")
					if ((MouseOn(x + 310 * MenuScale, y-6*MenuScale, 150*MenuScale+14, 20) && OnSliderID == 0) || OnSliderID == 2) {
						DrawOptionsTooltip(tx,ty,tw,th,"particleamount",ParticleAmount)
					}
					
					y=y+50*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Texture LOD Bias:")
					TextureDetails = Slider5(x+310*MenuScale,y+6*MenuScale,150*MenuScale,TextureDetails,3,"0.8","0.4","0.0","-0.4","-0.8")
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
					if ((MouseOn(x+310*MenuScale,y-6*MenuScale,150*MenuScale+14,20) && OnSliderID == 0) || OnSliderID == 3) {
						DrawOptionsTooltip(tx,ty,tw,th+100*MenuScale,"texquality")
					}
					
					y=y+50*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Save textures in the VRAM:")
					EnableVRam = DrawTick(x + 310 * MenuScale, y + MenuScale, EnableVRam)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale) && OnSliderID == 0) {
						DrawOptionsTooltip(tx,ty,tw,th,"vram")
					}
					
					//[End Block]
				} else if (MainMenuTab == 5) { //Audio
					//[Block]
					height = 220 * MenuScale
					DrawFrame(x, y, width, height)	
					
					y = y + 20*MenuScale
					
					MusicVolume = (SlideBar(x + 310*MenuScale, y-4*MenuScale, 150*MenuScale, MusicVolume*100.0)/100.0)
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Music volume:")
					if (MouseOn(x+310*MenuScale,y-4*MenuScale,150*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"musicvol",MusicVolume)
					}
					
					y = y + 40*MenuScale
					
					PrevSFXVolume = (SlideBar(x + 310*MenuScale, y-4*MenuScale, 150*MenuScale, SFXVolume*100.0)/100.0)
					SFXVolume = PrevSFXVolume
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Sound volume:")
					if (MouseOn(x+310*MenuScale,y-4*MenuScale,150*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"soundvol",PrevSFXVolume)
					}
					
					y = y + 30*MenuScale
					
					Color (255,255,255)
					AAText (x + 20 * MenuScale, y, "Sound auto-release:")
					EnableSFXRelease = DrawTick(x + 310 * MenuScale, y + MenuScale, EnableSFXRelease)
					if (EnableSFXRelease_Prev != EnableSFXRelease) {
						if (EnableSFXRelease) {
							for (snd of Sound.each) {
								for (i of range(32)) {
									if (snd.channels[i]!=0) {
										if (ChannelPlaying(snd.channels[i])) {
											StopChannel(snd.channels[i])
										}
									}
								}
								if (snd.internalHandle!=0) {
									FreeSound (snd.internalHandle)
									snd.internalHandle = 0
								}
								snd.releaseTime = 0
							}
						} else {
							for (snd of Sound.each) {
								if (snd.internalHandle = 0) {
									snd.internalHandle = LoadSound(snd.name)
								}
							}
						}
						EnableSFXRelease_Prev = EnableSFXRelease
					}
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th+220*MenuScale,"sfxautorelease")
					}
					y = y + 30*MenuScale
					
					Color (255,255,255)
					AAText (x + 20 * MenuScale, y, "Enable user tracks:")
					EnableUserTracks = DrawTick(x + 310 * MenuScale, y + MenuScale, EnableUserTracks)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"usertrack")
					}
					
					if (EnableUserTracks) {
						y = y + 30 * MenuScale
						Color (255,255,255)
						AAText (x + 20 * MenuScale, y, "User track mode:")
						UserTrackMode = DrawTick(x + 310 * MenuScale, y + MenuScale, UserTrackMode)
						if (UserTrackMode) {
							AAText (x + 350 * MenuScale, y + MenuScale, "Repeat")
						} else {
							AAText (x + 350 * MenuScale, y + MenuScale, "Random")
						}
						if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
							DrawOptionsTooltip(tx,ty,tw,th,"usertrackmode")
						}
						if (DrawButton(x + 20 * MenuScale, y + 30 * MenuScale, 190 * MenuScale, 25 * MenuScale, "Scan for User Tracks",false)) {
							DebugLog ("User Tracks Check Started")
							
							UserTrackCheck = 0
							UserTrackCheck2 = 0
							
							Dir=ReadDir("SFX/Radio/UserTracks/")
							while (true) {
								file = NextFile(Dir)
								if (file$="") {Exit()}
								if (FileType("SFX/Radio/UserTracks/"+file$) = 1) {
									UserTrackCheck = UserTrackCheck + 1
									test = LoadSound("SFX/Radio/UserTracks/"+file$)
									if (test != 0) {
										UserTrackCheck2 = UserTrackCheck2 + 1
									}
									FreeSound(test)
								}
							}
							CloseDir (Dir)
							
							DebugLog ("User Tracks Check Ended")
						}
						if (MouseOn(x+20*MenuScale,y+30*MenuScale,190*MenuScale,25*MenuScale)) {
							DrawOptionsTooltip(tx,ty,tw,th,"usertrackscan")
						}
						if (UserTrackCheck > 0) {
							AAText (x + 20 * MenuScale, y + 100 * MenuScale, "User tracks found ("+UserTrackCheck2+"/"+UserTrackCheck+" successfully loaded)")
						}
					} else {
						UserTrackCheck%=0
					}
					//[End Block]
				} else if (MainMenuTab = 6) { //Controls
					//[Block]
					height = 270 * MenuScale
					DrawFrame(x, y, width, height)	
					
					y = y + 20*MenuScale
					
					MouseSens = (SlideBar(x + 310*MenuScale, y-4*MenuScale, 150*MenuScale, (MouseSens+0.5)*100.0)/100.0)-0.5
					Color(255, 255, 255)
					AAText(x + 20 * MenuScale, y, "Mouse sensitivity:")
					if (MouseOn(x+310*MenuScale,y-4*MenuScale,150*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mousesensitivity",MouseSens)
					}
					
					y = y + 40*MenuScale
					
					Color(255, 255, 255)
					AAText(x + 20 * MenuScale, y, "Invert mouse Y-axis:")
					InvertMouse = DrawTick(x + 310 * MenuScale, y + MenuScale, InvertMouse)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mouseinvert")
					}
					
					y = y + 40*MenuScale
					
					MouseSmooth = (SlideBar(x + 310*MenuScale, y-4*MenuScale, 150*MenuScale, (MouseSmooth)*50.0)/50.0)
					Color(255, 255, 255)
					AAText(x + 20 * MenuScale, y, "Mouse smoothing:")
					if (MouseOn(x+310*MenuScale,y-4*MenuScale,150*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"mousesmoothing",MouseSmooth)
					}
					
					Color(255, 255, 255)
					
					y = y + 30*MenuScale
					AAText(x + 20 * MenuScale, y, "Control configuration:")
					y = y + 10*MenuScale
					
					AAText(x + 20 * MenuScale, y + 20 * MenuScale, "Move Forward")
					InputBox(x + 160 * MenuScale, y + 20 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_UP,210)],5)		
					AAText(x + 20 * MenuScale, y + 40 * MenuScale, "Strafe Left")
					InputBox(x + 160 * MenuScale, y + 40 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_LEFT,210)],3)	
					AAText(x + 20 * MenuScale, y + 60 * MenuScale, "Move Backward")
					InputBox(x + 160 * MenuScale, y + 60 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_DOWN,210)],6)				
					AAText(x + 20 * MenuScale, y + 80 * MenuScale, "Strafe Right")
					InputBox(x + 160 * MenuScale, y + 80 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_RIGHT,210)],4)	
					AAText(x + 20 * MenuScale, y + 100 * MenuScale, "Quick Save")
					InputBox(x + 160 * MenuScale, y + 100 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_SAVE,210)],11)
					
					AAText(x + 280 * MenuScale, y + 20 * MenuScale, "Manual Blink")
					InputBox(x + 470 * MenuScale, y + 20 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_BLINK,210)],7)				
					AAText(x + 280 * MenuScale, y + 40 * MenuScale, "Sprint")
					InputBox(x + 470 * MenuScale, y + 40 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_SPRINT,210)],8)
					AAText(x + 280 * MenuScale, y + 60 * MenuScale, "Open/Close Inventory")
					InputBox(x + 470 * MenuScale, y + 60 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_INV,210)],9)
					AAText(x + 280 * MenuScale, y + 80 * MenuScale, "Crouch")
					InputBox(x + 470 * MenuScale, y + 80 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_CROUCH,210)],10)	
					AAText(x + 280 * MenuScale, y + 100 * MenuScale, "Open/Close Console")
					InputBox(x + 470 * MenuScale, y + 100 * MenuScale,100*MenuScale,20*MenuScale,KeyName[Min(KEY_CONSOLE,210)],12)
					
					if (MouseOn(x+20*MenuScale,y,width-40*MenuScale,120*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"controls")
					}
					let key
					for (let i of range(228)) {
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
					//[End Block]
				} else if (MainMenuTab = 7) { //Advanced
					//[Block]
					height = 320 * MenuScale
					DrawFrame(x, y, width, height)	
					
					y = y + 20*MenuScale
					
					Color (255,255,255				)
					AAText(x + 20 * MenuScale, y, "Show HUD:")	
					HUDenabled = DrawTick(x + 310 * MenuScale, y + MenuScale, HUDenabled)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"hud")
					}
					
					y=y+30*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Enable console:")
					CanOpenConsole = DrawTick(x + 310 * MenuScale, y + MenuScale, CanOpenConsole)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"consoleenable")
					}
					
					y = y + 30*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Open console on error:")
					ConsoleOpening = DrawTick(x + 310 * MenuScale, y + MenuScale, ConsoleOpening)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"consoleerror")
					}
					
					y = y + 50*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Achievement popups:")
					AchvMSGenabled = DrawTick(x + 310 * MenuScale, y + MenuScale, AchvMSGenabled)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"achpopup")
					}
					
					y = y + 50*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Show FPS:")
					ShowFPS = DrawTick(x + 310 * MenuScale, y + MenuScale, ShowFPS)
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"showfps")
					}
					
					y = y + 30*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Framelimit:")
					Color (255,255,255)
					if (DrawTick(x + 310 * MenuScale, y, CurrFrameLimit > 0.0)) {
						CurrFrameLimit = (SlideBar(x + 150*MenuScale, y+30*MenuScale, 100*MenuScale, CurrFrameLimit*99.0)/99.0)
						CurrFrameLimit = Max(CurrFrameLimit, 0.01)
						Framelimit = 19+(CurrFrameLimit*100.0)
						Color (255,255,0)
						AAText(x + 25 * MenuScale, y + 25 * MenuScale, Framelimit%+" FPS")
					} else {
						CurrFrameLimit = 0.0
						Framelimit = 0
					}
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"framelimit",Framelimit)
					}
					if (MouseOn(x+150*MenuScale,y+30*MenuScale,100*MenuScale+14,20)) {
						DrawOptionsTooltip(tx,ty,tw,th,"framelimit",Framelimit)
					}
					
					y = y + 80*MenuScale
					
					Color (255,255,255)
					AAText(x + 20 * MenuScale, y, "Antialiased text:")
					AATextEnable = DrawTick(x + 310 * MenuScale, y + MenuScale, AATextEnable)
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
					if (MouseOn(x+310*MenuScale,y+MenuScale,20*MenuScale,20*MenuScale)) {
						DrawOptionsTooltip(tx,ty,tw,th,"antialiastext")
					}
					//[End Block]
				}
				//[End Block]
			case 4: // load map
				//[Block]
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				height = 510 * MenuScale
				
				DrawFrame(x, y, width, height)
				
				x = 159 * MenuScale
				y = 286 * MenuScale
				
				width = 400 * MenuScale
				height = 70 * MenuScale
				
				Color(255, 255, 255)
				AASetFont (Font2)
				AAText(x + width / 2, y + height / 2, "LOAD MAP", true, true)
				
				x = 160 * MenuScale
				y = y + height + 20 * MenuScale
				width = 580 * MenuScale
				height = 350 * MenuScale
				
				AASetFont (Font2)
				
				tx = x+width
				ty = y
				tw = 400*MenuScale
				th = 150*MenuScale
				
				if (CurrLoadGamePage < Ceil(Float(SavedMapsAmount)/6.0)-1) {
					if (DrawButton(x+530*MenuScale, y + 510*MenuScale, 50*MenuScale, 55*MenuScale, ">")) {
						CurrLoadGamePage = CurrLoadGamePage+1
					}
				} else {
					DrawFrame(x+530*MenuScale, y + 510*MenuScale, 50*MenuScale, 55*MenuScale)
					Color(100, 100, 100)
					AAText(x+555*MenuScale, y + 537.5*MenuScale, ">", true, true)
				}
				if (CurrLoadGamePage > 0) {
					if (DrawButton(x, y + 510*MenuScale, 50*MenuScale, 55*MenuScale, "<")) {
						CurrLoadGamePage = CurrLoadGamePage-1
					}
				} else {
					DrawFrame(x, y + 510*MenuScale, 50*MenuScale, 55*MenuScale)
					Color(100, 100, 100)
					AAText(x+25*MenuScale, y + 537.5*MenuScale, "<", true, true)
				}
				
				DrawFrame(x+50*MenuScale,y+510*MenuScale,width-100*MenuScale,55*MenuScale)
				
				AAText(x+(width/2.0),y+536*MenuScale,"Page "+Int(Max((CurrLoadGamePage+1),1))+"/"+Int(Max((Int(Ceil(Float(SavedMapsAmount)/6.0))),1)),true,true)
				
				AASetFont(Font1)
				
				if (CurrLoadGamePage > Ceil(Float(SavedMapsAmount)/6.0)-1) {
					CurrLoadGamePage = CurrLoadGamePage - 1
				}
				
				AASetFont(Font1)
				
				if (SavedMaps(0)="") {
					AAText (x + 20 * MenuScale, y + 20 * MenuScale, "No saved maps. Use the Map Creator to create new maps.")
				} else {
					x = x + 20 * MenuScale
					y = y + 20 * MenuScale
					for (i of range((1+(6*CurrLoadGamePage)), 6+(6*CurrLoadGamePage) + 1)) {
						if (i <= SavedMapsAmount) {
							DrawFrame(x,y,540* MenuScale, 70* MenuScale)
							
							AAText(x + 20 * MenuScale, y + 10 * MenuScale, SavedMaps(i - 1))
							AAText(x + 20 * MenuScale, y + (10+27) * MenuScale, SavedMapsAuthor(i - 1))
							
							if (DrawButton(x + 400 * MenuScale, y + 20 * MenuScale, 100 * MenuScale, 30 * MenuScale, "Load", false)) {
								SelectedMap=SavedMaps(i - 1)
								MainMenuTab = 1
							}
							if (MouseOn(x + 400 * MenuScale, y + 20 * MenuScale, 100*MenuScale,30*MenuScale)) {
								DrawMapCreatorTooltip(tx,ty,tw,th,SavedMaps(i-1))
							}
							
							y = y + 80 * MenuScale
						} else {
							Exit()
						}
					}
				}
				//[End Block]
		}
		
	}
	
	Color(255,255,255)
	AASetFont(ConsoleFont)
	AAText(20,GraphicHeight-30,"v"+VersionNumber)
	
	//DrawTiledImageRect(MenuBack, 985 * MenuScale, 860 * MenuScale, 200 * MenuScale, 20 * MenuScale, 1200 * MenuScale, 866 * MenuScale, 300, 20 * MenuScale)
	
	if (Fullscreen) {
		DrawImage(CursorIMG, ScaledMouseX(),ScaledMouseY())
	}
	
	AASetFont(Font1)
}

function UpdateLauncher() {
	MenuScale = 1
	
	Graphics3DExt(LauncherWidth, LauncherHeight, 0, 2)

	//InitExt
	
	SetBuffer (BackBuffer())
	
	RealGraphicWidth = GraphicWidth
	RealGraphicHeight = GraphicHeight
	
	Font1 = LoadFont_Strict("GFX/font/cour/Courier New.ttf", 18, 0,0,0)
	SetFont (Font1)
	MenuWhite = LoadImage_Strict("GFX/menu/menuwhite.jpg")
	MenuBlack = LoadImage_Strict("GFX/menu/menublack.jpg")	
	MaskImage (MenuBlack, 255,255,0)
	LauncherIMG = LoadImage_Strict("GFX/menu/launcher.jpg")
	ButtonSFX = LoadSound_Strict("SFX/Interact/Button.ogg")
	let i: int	
	
	for (i of range(4)) {
		ArrowIMG(i) = LoadImage_Strict("GFX/menu/arrow.png")
		RotateImage(ArrowIMG(i), 90 * i)
		HandleImage(ArrowIMG(i), 0, 0)
	}
	
	for (i of range(1, TotalGFXModes + 1)) {
		let samefound: boolean = false
		for (n of range(TotalGFXModes)) {
			if (GfxModeWidths(n) == GfxModeWidth(i) && GfxModeHeights(n) == GfxModeHeight(i)) {
				samefound = true
				Exit
			}
		}
		if (samefound = false) {
			if (GraphicWidth == GfxModeWidth(i) && GraphicHeight == GfxModeHeight(i)) {
				SelectedGFXMode = GFXModes
			}
			GfxModeWidths(GFXModes) = GfxModeWidth(i)
			GfxModeHeights(GFXModes) = GfxModeHeight(i)
			GFXModes=GFXModes+1 
		}
	}
	
	BlinkMeterIMG = LoadImage_Strict("GFX/blinkmeter.jpg")
	CheckForUpdates()
	
	AppTitle ("SCP - Containment Breach Launcher")
	
	while (true) {
		
		//Cls
		Color(0,0,0)
		Rect(0,0,LauncherWidth,LauncherHeight,true)
		
		MouseHit1 = MouseHit(1)
		
		Color(255, 255, 255)
		DrawImage(LauncherIMG, 0, 0)
		
		BBText(20, 240 - 65, "Resolution: ")
		
		let x: int = 40
		let y: int = 270 - 65
		for (i of range(GFXModes)) {
			Color(0, 0, 0)
			if (SelectedGFXMode = i) {Rect(x - 1, y - 1, 100, 20, false)}
			
			BBText(x, y, (GfxModeWidths(i) + "x" + GfxModeHeights(i)))
			if (MouseOn(x - 1, y - 1, 100, 20)) {
				Color(100, 100, 100)
				Rect(x - 1, y - 1, 100, 20, false)
				if (MouseHit1) {SelectedGFXMode = i}
			}
			
			y=y+20
			if (y >= 250 - 65 + (LauncherHeight - 80 - 260)) {
				y = 270 - 65
				x=x+100
			}
		}
		
		//-----------------------------------------------------------------
		Color(255, 255, 255)
		x = 30
		y = 369
		Rect(x - 10, y, 340, 95)
		BBText(x - 10, y - 25, "Graphics:")
		
		y=y+10
		for (i of range(1, CountGfxDrivers() + 1)) {
			Color(0, 0, 0)
			if (SelectedGFXDriver = i) {Rect(x - 1, y - 1, 290, 20, false)}
			LimitText(GfxDriverName(i), x, y, 290, false)
			if (MouseOn(x - 1, y - 1, 290, 20)) {
				Color(100, 100, 100)
				Rect(x - 1, y - 1, 290, 20, false)
				if (MouseHit1) {
					SelectedGFXDriver = i
				}
			}
			
			y=y+20
		}
		
		Fullscreen = DrawTick(40 + 430 - 15, 260 - 55 + 5 - 8, Fullscreen, BorderlessWindowed)
		BorderlessWindowed = DrawTick(40 + 430 - 15, 260 - 55 + 35, BorderlessWindowed)
		lock = false

		if (BorderlessWindowed || (!Fullscreen)) {
			lock = true
		}
		Bit16Mode = DrawTick(40 + 430 - 15, 260 - 55 + 65 + 8, Bit16Mode,lock)
		LauncherEnabled = DrawTick(40 + 430 - 15, 260 - 55 + 95 + 8, LauncherEnabled)

		if (BorderlessWindowed) {
 		   Color(255, 0, 0)
 		   Fullscreen = false
		} else {
  		  Color(255, 255, 255)
		}

		BBText(40 + 430 + 15, 262 - 55 + 5 - 8, "Fullscreen")
		Color(255, 255, 255)
		BBText(40 + 430 + 15, 262 - 55 + 35 - 8, "Borderless",false,false)
		BBText(40 + 430 + 15, 262 - 55 + 35 + 12, "windowed mode",false,false)

		if (BorderlessWindowed || (!Fullscreen)) {
 		   Color(255, 0, 0)
 		   Bit16Mode = false
		} else {
		    Color(255, 255, 255)
		}

		BBText(40 + 430 + 15, 262 - 55 + 65 + 8, "16 Bit")
		Color(255, 255, 255)
		BBText(40 + 430 + 15, 262 - 55 + 95 + 8, "Use launcher")
		
		if (!BorderlessWindowed) {
			if (Fullscreen) {
				BBText(40+ 260 + 15, 262 - 55 + 140, "Current Resolution: "+(GfxModeWidths[SelectedGFXMode] + "x" + GfxModeHeights[SelectedGFXMode] + "," + (16+(16*(!Bit16Mode)))))
			} else {
				BBText(40+ 260 + 15, 262 - 55 + 140, "Current Resolution: "+(GfxModeWidths[SelectedGFXMode] + "x" + GfxModeHeights[SelectedGFXMode] + ",32"))
			}
		} else {
			BBText(40+ 260 + 15, 262 - 55 + 140, "Current Resolution: "+GfxModeWidths[SelectedGFXMode] + "x" + GfxModeHeights[SelectedGFXMode] + ",32")
			if (GfxModeWidths[SelectedGFXMode]<G_viewport_width) {
				BBText(40+ 260 + 65, 262 - 55 + 160, "(upscaled to")
				BBText(40+ 260 + 65, 262 - 55 + 180, G_viewport_width + "x" + G_viewport_height + ",32)")
		 	} else if (GfxModeWidths[SelectedGFXMode]>G_viewport_width) {
				BBText(40+ 260 + 65, 262 - 55 + 160, "(downscaled to")
				BBText(40+ 260 + 65, 262 - 55 + 180, G_viewport_width + "x" + G_viewport_height + ",32)")
			}
		}
		
		UpdateCheckEnabled = DrawTick(LauncherWidth - 275, LauncherHeight - 50, UpdateCheckEnabled)
		Color(255,255,255)
		BBText(LauncherWidth-250,LauncherHeight-70,"Check for")
		BBText(LauncherWidth-250,LauncherHeight-50,"updates on")
		BBText(LauncherWidth-250,LauncherHeight-30,"launch")
		
		if (DrawButton(LauncherWidth - 30 - 90, LauncherHeight - 50 - 55, 100, 30, "LAUNCH", false, false, false)) {
			GraphicWidth = GfxModeWidths(SelectedGFXMode)
			GraphicHeight = GfxModeHeights(SelectedGFXMode)
			RealGraphicWidth = GraphicWidth
			RealGraphicHeight = GraphicHeight
			break
		}
		
		if (DrawButton(LauncherWidth - 30 - 90, LauncherHeight - 50, 100, 30, "EXIT", false, false, false)) {End()}
		Flip()
	}
	
	PutINIValue(OptionFile, "options", "width", GfxModeWidths(SelectedGFXMode))
	PutINIValue(OptionFile, "options", "height", GfxModeHeights(SelectedGFXMode))
	if (Fullscreen) {
		PutINIValue(OptionFile, "options", "fullscreen", "true")
	} else {
		PutINIValue(OptionFile, "options", "fullscreen", "false")
	}
	if (LauncherEnabled) {
		PutINIValue(OptionFile, "launcher", "launcher enabled", "true")
	} else {
		PutINIValue(OptionFile, "launcher", "launcher enabled", "false")
	}
	if (BorderlessWindowed) {
		PutINIValue(OptionFile, "options", "borderless windowed", "true")
	} else {
		PutINIValue(OptionFile, "options", "borderless windowed", "false")
	}
	if (Bit16Mode) {
		PutINIValue(OptionFile, "options", "16bit", "true")
	} else {
		PutINIValue(OptionFile, "options", "16bit", "false")
	}
	PutINIValue(OptionFile, "options", "gfx driver", SelectedGFXDriver)
	if (UpdateCheckEnabled) {
		PutINIValue(OptionFile, "options", "check for updates", "true")
	} else {
		PutINIValue(OptionFile, "options", "check for updates", "false")
	}
	
}


function DrawTiledImageRect(img: int, srcX: int, srcY: int, srcwidth: float, srcheight: float, x: int, y: int, width: int, height: int) {
	
	let x2: int = x
	while (x2 < x+width) {
		let y2: int = y
		while (y2 < y+height) {
			if (x2 + srcwidth > x + width) {
				srcwidth = srcwidth - Max((x2 + srcwidth) - (x + width), 1)
			}
			if (y2 + srcheight > y + height) {
				srcheight = srcheight - Max((y2 + srcheight) - (y + height), 1)
			}
			DrawImageRect(img, x2, y2, srcX, srcY, srcwidth, srcheight)
			y2 = y2 + srcheight
		}
		x2 = x2 + srcwidth
	}
}

class LoadingScreens {
	imgpath: string
	img: int
	ID: int
	title: string
	alignx: int
	aligny: int
	disablebackground: int
	txt: string[] = new Array(5)
	txtamount: int
}

function InitLoadingScreens(file: string) {
	let TemporaryString: string
	let i: int
	let ls: LoadingScreens
	
	let f = OpenFile(file)
	
	while (!Eof(f)) {
		TemporaryString = Trim(ReadLine(f))
		if (Left(TemporaryString,1) = "[") {
			TemporaryString = Mid(TemporaryString, 2, Len(TemporaryString) - 2)
			
			ls.LoadingScreens = new LoadingScreens()
			LoadingScreenAmount=LoadingScreenAmount+1
			ls.ID = LoadingScreenAmount
			
			ls.title = TemporaryString
			ls.imgpath = GetINIString(file, TemporaryString, "image path")
			
			for (i of range(5)) {
				ls.txt[i] = GetINIString(file, TemporaryString, "text"+(i+1))
				if (ls.txt[i] != "") {ls.txtamount=ls.txtamount+1}
			}
			
			ls.disablebackground = GetINIInt(file, TemporaryString, "disablebackground")
			
			switch (Lower(GetINIString(file, TemporaryString, "align x"))) {
				case "left":
					ls.alignx = -1
				case "middle", "center":
					ls.alignx = 0
				case "right" :
					ls.alignx = 1
			} 
			
			switch (Lower(GetINIString(file, TemporaryString, "align y"))) {
				case "top", "up":
					ls.aligny = -1
				case "middle", "center":
					ls.aligny = 0
				case "bottom", "down":
					ls.aligny = 1
			} 			
			
		}
	}
	
	CloseFile (f)
}

function DrawLoading(percent: int, shortloading: boolean = false) {
	
	let x: int
	let y: int
	
	if (percent = 0) {
		LoadingScreenText=0
		
		temp = Rand(1,LoadingScreenAmount)
		for (ls of LoadingScreens.each) {
			if (ls.id = temp) {
				if (ls.img=0) {
					ls.img = LoadImage_Strict("Loadingscreens/"+ls.imgpath)
				}
				SelectedLoadingScreen = ls 
				Exit()
			}
		}
	}	
	
	firstloop = true
	do { 
		
		ClsColor (0,0,0)
		Cls()
				
		if (percent > 20) {
			UpdateMusic()
		}
		
		if (shortloading = false) {
			if (percent > (100.0 / SelectedLoadingScreen.txtamount)*(LoadingScreenText+1)) {
				LoadingScreenText=LoadingScreenText+1
			}
		}
		
		if (!SelectedLoadingScreen.disablebackground) {
			DrawImage (LoadingBack, GraphicWidth/2 - ImageWidth(LoadingBack)/2, GraphicHeight/2 - ImageHeight(LoadingBack)/2)
		}	
		
		if (SelectedLoadingScreen.alignx = 0) {
			x = GraphicWidth/2 - ImageWidth(SelectedLoadingScreen.img)/2 
		} else if (SelectedLoadingScreen.alignx = 1) {
			x = GraphicWidth - ImageWidth(SelectedLoadingScreen.img)
		} else {
			x = 0
		}
		
		if (SelectedLoadingScreen.aligny = 0) {
			y = GraphicHeight/2 - ImageHeight(SelectedLoadingScreen.img)/2 
		} else if (SelectedLoadingScreen.aligny = 1) {
			y = GraphicHeight - ImageHeight(SelectedLoadingScreen.img)
		} else {
			y = 0
		}
		
		DrawImage (SelectedLoadingScreen.img, x, y)
		
		let width: int = 300, height: int = 20
		x = GraphicWidth / 2 - width / 2
		y = GraphicHeight / 2 + 30 - 100
		
		Rect(x, y, width+4, height, false)
		for (i of range(1, Int((width - 2) * (percent / 100.0) / 10) + 1)) {
			DrawImage(BlinkMeterIMG, x + 3 + 10 * (i - 1), y + 3)
		}
		
		if (SelectedLoadingScreen.title = "CWM") {
			
			if (!shortloading) {
				if (firstloop) {
					if (percent = 0) {
						PlaySound_Strict (LoadTempSound("SFX/SCP/990/cwm1.cwm"))
					} else if (percent = 100) {
						PlaySound_Strict (LoadTempSound("SFX/SCP/990/cwm2.cwm"))
					}
				}
			}
			
			AASetFont (Font2)
			strtemp$ = ""
			temp = Rand(2,9)
			for (i of range(temp + 1)) {
				strtemp$ = STRTEMP + Chr(Rand(48,122))
			}
			AAText(GraphicWidth / 2, GraphicHeight / 2 + 80, strtemp, true, true)
			
			if (percent = 0) {
				if (Rand(5)=1) {
					switch (Rand(2)) {
						case 1:
							SelectedLoadingScreen.txt[0] = "It will happen on " + CurrentDate() + "."
						case 2:
							SelectedLoadingScreen.txt[0] = CurrentTime()
					}
				} else {
					switch (Rand(13)) {
						case 1:
							SelectedLoadingScreen.txt[0] = "A very fine radio might prove to be useful."
						case 2:
							SelectedLoadingScreen.txt[0] = "ThIS PLaCE WiLL BUrN"
						case 3:
							SelectedLoadingScreen.txt[0] = "You cannot control it."
						case 4:
							SelectedLoadingScreen.txt[0] = "eof9nsd3jue4iwe1fgj"
						case 5:
							SelectedLoadingScreen.txt[0] = "YOU NEED TO TRUST IT"
						case 6 :
							SelectedLoadingScreen.txt[0] = "Look my friend in the eye when you address him, isn't that the way of the gentleman?"
						case 7:
							SelectedLoadingScreen.txt[0] = "???____??_???__????n?"
						case 8, 9:
							SelectedLoadingScreen.txt[0] = "Jorge has been expecting you."
						case 10:
							SelectedLoadingScreen.txt[0] = "???????????"
						case 11:
							SelectedLoadingScreen.txt[0] = "Make her a member of the midnight crew."
						case 12:
							SelectedLoadingScreen.txt[0] = "oncluded that coming here was a mistake. We have to turn back."
						case 13:
							SelectedLoadingScreen.txt[0] = "This alloy contains the essence of my life."
					}
				}
			}
			
			strtemp$ = SelectedLoadingScreen.txt[0]
			temp = Int(Len(SelectedLoadingScreen.txt[0])-Rand(5))
			for (i of range(Rand(10,15) + 1)) {
				strtemp$ = Replace(SelectedLoadingScreen.txt[0],Mid(SelectedLoadingScreen.txt[0],Rand(1,Len(strtemp)-1),1),Chr(Rand(130,250)))
			}		
			AASetFont (Font1)
			RowText(strtemp, GraphicWidth / 2-200, GraphicHeight / 2 +120,400,300,true)		
		} else {
			
			Color (0,0,0)
			AASetFont (Font2)
			AAText(GraphicWidth / 2 + 1, GraphicHeight / 2 + 80 + 1, SelectedLoadingScreen.title, true, true)
			AASetFont (Font1)
			RowText(SelectedLoadingScreen.txt[LoadingScreenText], GraphicWidth / 2-200+1, GraphicHeight / 2 +120+1,400,300,true)
			
			Color (255,255,255)
			AASetFont (Font2)
			AAText(GraphicWidth / 2, GraphicHeight / 2 +80, SelectedLoadingScreen.title, true, true)
			AASetFont (Font1)
			RowText(SelectedLoadingScreen.txt[LoadingScreenText], GraphicWidth / 2-200, GraphicHeight / 2 +120,400,300,true)
			
		}
		
		Color (0,0,0)
		AAText(GraphicWidth / 2 + 1, GraphicHeight / 2 - 100 + 1, "LOADING - " + percent + " %", true, true)
		Color (255,255,255)
		AAText(GraphicWidth / 2, GraphicHeight / 2 - 100, "LOADING - " + percent + " %", true, true)
		
		if (percent = 100) {
			if (firstloop && SelectedLoadingScreen.title != "CWM") {
				PlaySound_Strict (LoadTempSound(("SFX/Horror/Horror8.ogg")))
			}
			AAText(GraphicWidth / 2, GraphicHeight - 50, "PRESS ANY KEY TO CONTINUE", true, true)
		} else {
			FlushKeys()
			FlushMouse()
		}
		
		if (BorderlessWindowed) {
			if ((RealGraphicWidth != GraphicWidth) || (RealGraphicHeight != GraphicHeight)) {
				SetBuffer (TextureBuffer(fresize_texture))
				ClsColor (0,0,0)
				Cls()
				CopyRect (0,0,GraphicWidth,GraphicHeight,1024-GraphicWidth/2,1024-GraphicHeight/2,BackBuffer(),TextureBuffer(fresize_texture))
				SetBuffer (BackBuffer())
				ClsColor (0,0,0)
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
		
		Flip (false)
		
		firstloop = false
		if (percent != 100) {
			Exit()
		}
		
 	} while (!((GetKey() != 0 || MouseHit(1))))
}



function rInput(aString: string): string {
	let value: int = GetKey()
	let length: int = Len(aString$)
	
	if (value = 8) {
		value = 0
		if (length > 0) {
			aString$ = Left(aString, length - 1)
		}
	}
	
	if (value = 13 || value == 0) {
		return aString
	} else if (value > 0 && value < 7 || value > 26 && value < 32 || value == 9) {
		return aString
	} else {
		aString$ = aString$ + Chr(value)
		return aString
	}
}

function InputBox(x: int, y: int, width: int, height: int, Txt: string, ID: int = 0) : string {
	//TextBox(x,y,width,height,Txt$)
	Color (255, 255, 255)
	DrawTiledImageRect(MenuWhite, (x % 256), (y % 256), 512, 512, x, y, width, height)
	//Rect(x, y, width, height)
	Color (0, 0, 0)
	
	let MouseOnBox: boolean = false
	if (MouseOn(x, y, width, height)) {
		Color(50, 50, 50)
		MouseOnBox = true
		if (MouseHit1) {
			SelectedInputBox = ID
			FlushKeys()
		}
	}
	
	Rect(x + 2, y + 2, width - 4, height - 4)
	Color (255, 255, 255)	
	
	if ((!MouseOnBox) && MouseHit1 && SelectedInputBox == ID) {
		SelectedInputBox = 0
	}
	
	if (SelectedInputBox = ID) {
		Txt = rInput(Txt)
		if ((MilliSecs2() % 800) < 400) {
			Rect (x + width / 2 + AAStringWidth(Txt) / 2 + 2, y + height / 2 - 5, 2, 12)
		}
	}	
	
	AAText(x + width / 2, y + height / 2, Txt, true, true)
	
	return Txt
}

function DrawFrame(x: int, y: int, width: int, height: int, xoffset: int=0, yoffset: int=0) {
	Color (255, 255, 255)
	DrawTiledImageRect(MenuWhite, xoffset, (y % 256), 512, 512, x, y, width, height)
	
	DrawTiledImageRect(MenuBlack, yoffset, (y % 256), 512, 512, x+3*MenuScale, y+3*MenuScale, width-6*MenuScale, height-6*MenuScale)	
}

function DrawButton(x: int, y: int, width: int, height: int, txt$, bigfont: boolean = true, waitForMouseUp: boolean=false, usingAA: boolean=true) : int {
	let clicked: boolean = false
	
	DrawFrame (x, y, width, height)
	if (MouseOn(x, y, width, height)) {
		Color(30, 30, 30)
		if ((MouseHit1 && (!waitForMouseUp)) || (MouseUp1 && waitForMouseUp)) {
			clicked = true
			PlaySound_Strict(ButtonSFX)
		}
		Rect(x + 4, y + 4, width - 8, height - 8)	
	} else {
		Color(0, 0, 0)
	}
	
	Color (255, 255, 255)
	if (usingAA) {
		if (bigfont) {
			AASetFont(Font2)
		} else {
			AASetFont(Font1)
		}
		AAText(x + width / 2, y + height / 2, txt, true, true)
	} else {
		if (bigfont) {
			SetFont(Font2)
		} else {
			SetFont(Font1)
		}
		BBText(x + width / 2, y + height / 2, txt, true, true)
	}
	
	return clicked
}

function DrawButton2(x: int, y: int, width: int, height: int, txt$, bigfont: boolean = true) : int {
	let clicked: boolean = false
	
	DrawFrame (x, y, width, height)
	let hit: int = MouseHit(1)
	if (MouseOn(x, y, width, height)) {
		Color(30, 30, 30)
		if (hit) {
			clicked = true
			PlaySound_Strict(ButtonSFX)
		}
		Rect(x + 4, y + 4, width - 8, height - 8)	
	} else {
		Color(0, 0, 0)
	}
	
	Color (255, 255, 255)
	if (bigfont) {
		SetFont(Font2)
	} else {
		SetFont(Font1)
	}
	BBText(x + width / 2, y + height / 2, txt, true, true)
	
	return clicked
}

function DrawTick(x: int, y: int, selected: int, locked: boolean = false): int {
	let width: int = 20 * MenuScale
	let height: int = 20 * MenuScale
	
	Color (255, 255, 255)
	DrawTiledImageRect(MenuWhite, (x % 256), (y % 256), 512, 512, x, y, width, height)
	
	let Highlight: int = MouseOn(x, y, width, height) && (!locked)
	
	if (Highlight) {
		Color(50, 50, 50)
		if (MouseHit1) {
			selected = (!selected)
			PlaySound_Strict (ButtonSFX)
		}
	} else {
		Color(0, 0, 0)		
	}
	
	Rect(x + 2, y + 2, width - 4, height - 4)
	
	if (selected) {
		if (Highlight) {
			Color (255,255,255)
		} else {
			Color (200,200,200)
		}
		DrawTiledImageRect(MenuWhite, (x % 256), (y % 256), 512, 512, x + 4, y + 4, width - 8, height - 8)
	}
	
	Color (255, 255, 255)
	
	return selected
}

function SlideBar(x: int, y: int, width: int, value: float): float {
	
	if (MouseDown1 && OnSliderID == 0) {
		if (ScaledMouseX() >= x && ScaledMouseX() <= x + width + 14 && ScaledMouseY() >= y && ScaledMouseY() <= y + 20) {
			value = Min(Max((ScaledMouseX() - x) * 100 / width, 0), 100)
		}
	}
	
	Color (255,255,255)
	Rect(x, y, width + 14, 20,false)
	
	DrawImage(BlinkMeterIMG, x + width * value / 100.0 +3, y+3)
	
	Color (170,170,170 )
	AAText (x - 50 * MenuScale, y + 4*MenuScale, "LOW")					
	AAText (x + width + 38 * MenuScale, y+4*MenuScale, "HIGH")	
	
	return value
}

function RowText(A: string, X, Y, W, H, align: int = 0, Leading: float = 1) {
	//Display A$ starting at X,Y - no wider than W And no taller than H (all in pixels).
	//Leading is optional extra vertical spacing in pixels
	
	if (H<1) {H=2048}
	
	let LinesShown = 0
	let Height = AAStringHeight(A$) + Leading
	let b: string
	
	while (Len(A) > 0) {
		let space = Instr(A$, " ")
		if (space = 0) {space = Len(A$)}
		let temp$ = Left(A$, space)
		let trimmed$ = Trim(temp) //we might ignore a final space 
		let extra = 0 //we haven't ignored it yet
		//ignore final space If doing so would make a word fit at End of Line:
		if ((AAStringWidth (b$ + temp$) > W) && (AAStringWidth (b$ + trimmed$) <= W)) {
			temp = trimmed
			extra = 1
		}
		
		if (AAStringWidth (b$ + temp$) > W) { //too big, so Print what will fit
			if (align) {
				AAText(X + W / 2 - (AAStringWidth(b) / 2), LinesShown * Height + Y, b)
			} else {
				AAText(X, LinesShown * Height + Y, b)
			}		
			
			LinesShown = LinesShown + 1
			b$=""
		} else { //append it To b$ (which will eventually be printed) And remove it from A$
			b$ = b$ + temp$
			A$ = Right(A$, Len(A$) - (Len(temp$) + extra))
		}
		
		if (((LinesShown + 1) * Height) > H) {break} //the Next Line would be too tall, so leave
	}
	
	if ((b$ != "") && ((LinesShown + 1) <= H)) {
		if (align) {
			AAText(X + W / 2 - (AAStringWidth(b) / 2), LinesShown * Height + Y, b) //Print any remaining Text If it'll fit vertically
		} else {
			AAText(X, LinesShown * Height + Y, b) //Print any remaining Text If it'll fit vertically
		}
	}
}

function RowText2(A$, X, Y, W, H, align: int = 0, Leading: float = 1) {
	//Display A$ starting at X,Y - no wider than W And no taller than H (all in pixels).
	//Leading is optional extra vertical spacing in pixels
	
	if (H<1) {H=2048}
	
	let LinesShown = 0
	let Height = StringHeight(A$) + Leading
	let b: string
	
	while (Len(A) > 0) {
		let space = Instr(A$, " ")
		if (space = 0) {space = Len(A$)}
		let temp$ = Left(A$, space)
		let trimmed$ = Trim(temp) //we might ignore a final space 
		let extra = 0 //we haven't ignored it yet
		//ignore final space If doing so would make a word fit at End of Line:
		if ((StringWidth (b$ + temp$) > W) && (StringWidth (b$ + trimmed$) <= W)) {
			temp = trimmed
			extra = 1
		}
		
		if (StringWidth (b$ + temp$) > W) { //too big, so Print what will fit
			if (align) {
				BBText(X + W / 2 - (StringWidth(b) / 2), LinesShown * Height + Y, b)
			} else {
				BBText(X, LinesShown * Height + Y, b)
			}
			
			LinesShown = LinesShown + 1
			b$=""
		} else { //append it To b$ (which will eventually be printed) And remove it from A$
			b$ = b$ + temp$
			A$ = Right(A$, Len(A$) - (Len(temp$) + extra))
		}
		
		if (((LinesShown + 1) * Height) > H) {break} //the Next Line would be too tall, so leave
	}
	
	if ((b != "") && (LinesShown + 1 <= H)) {
		if (align) {
			BBText(X + W / 2 - (StringWidth(b) / 2), LinesShown * Height + Y, b) //Print any remaining BBText If it'll fit vertically
		} else {
			BBText(X, LinesShown * Height + Y, b) //Print any remaining Text If it'll fit vertically
		}
	}
	
}

function GetLineAmount(A$, W, H, Leading: float = 1) {
	//Display A$ starting at X,Y - no wider than W And no taller than H (all in pixels).
	//Leading is optional extra vertical spacing in pixels
	
	if (H<1) {
		H=2048
	}
	
	let LinesShown = 0
	let Height = AAStringHeight(A$) + Leading
	let b$
	
	while (Len(A) > 0) {
		let space = Instr(A$, " ")
		if (space = 0) {space = Len(A)}
		let temp: string = Left(A, space)
		let trimmed: string = Trim(temp) //we might ignore a final space 
		let extra = 0 //we haven't ignored it yet
		//ignore final space If doing so would make a word fit at End of Line:
		if ((AAStringWidth (b$ + temp$) > W) && (AAStringWidth (b$ + trimmed$) <= W)) {
			temp = trimmed
			extra = 1
		}
		
		if (AAStringWidth (b$ + temp$) > W) { //too big, so Print what will fit
			
			LinesShown = LinesShown + 1
			b$=""
		} else { //append it To b$ (which will eventually be printed) And remove it from A$
			b$ = b$ + temp$
			A$ = Right(A$, Len(A$) - (Len(temp$) + extra))
		}
		
		if (((LinesShown + 1) * Height) > H) {break} //the Next Line would be too tall, so leave
	}
	
	return LinesShown+1
}

function GetLineAmount2(A: string, W, H, Leading: float = 1) {
	//Display A$ starting at X,Y - no wider than W And no taller than H (all in pixels).
	//Leading is optional extra vertical spacing in pixels
	
	if (H<1) {H=2048}
	
	let LinesShown = 0
	let Height = StringHeight(A$) + Leading
	let b$
	
	while (Len(A) > 0) {
		let space = Instr(A$, " ")
		if (space = 0) {space = Len(A$)}
		let temp: string = Left(A, space)
		let trimmed: string = Trim(temp) //we might ignore a final space 
		let extra = 0 //we haven't ignored it yet
		//ignore final space If doing so would make a word fit at End of Line:
		if ((StringWidth (b$ + temp$) > W) && (StringWidth (b$ + trimmed$) <= W)) {
			temp = trimmed
			extra = 1
		}
		
		if (StringWidth (b$ + temp$) > W) { //too big, so Print what will fit
			
			LinesShown = LinesShown + 1
			b$=""
		} else { //append it To b$ (which will eventually be printed) And remove it from A$
			b$ = b$ + temp$
			A$ = Right(A$, Len(A$) - (Len(temp$) + extra))
		}
		
		if (((LinesShown + 1) * Height) > H) {Exit()} //the Next Line would be too tall, so leave
	}
	
	return LinesShown+1	
}

function LimitText(txt: string, x: int, y: int, width: int, usingAA: boolean = true): int {
	let TextLength: int
	let UnFitting: int
	let LetterWidth: int
	if (usingAA) {
		if (txt == "" || width == 0) {return 0}
		TextLength = AAStringWidth(txt)
		UnFitting = TextLength - width
		if (UnFitting <= 0) {
			AAText(x, y, txt)
		} else { //ei mahdu
			LetterWidth = TextLength / Len(txt)
			
			AAText(x, y, Left(txt, Max(Len(txt) - UnFitting / LetterWidth - 4, 1)) + "...")
		}
	} else {
		if (txt == "" || width == 0) {return 0}
		TextLength = StringWidth(txt)
		UnFitting = TextLength - width
		if (UnFitting <= 0) {
			BBText(x, y, txt)
		} else { //ei mahdu
			LetterWidth = TextLength / Len(txt)
			
			BBText(x, y, Left(txt, Max(Len(txt) - UnFitting / LetterWidth - 4, 1)) + "...")
		}
	}
}

function DrawTooltip(message: string) {
	let scale: float = GraphicHeight/768.0
	
	let width = (AAStringWidth(message$))+20*MenuScale
	
	Color (25,25,25)
	Rect(ScaledMouseX()+20,ScaledMouseY(),width,19*scale,true)
	Color (150,150,150)
	Rect(ScaledMouseX()+20,ScaledMouseY(),width,19*scale,false)
	AASetFont (Font1)
	AAText(ScaledMouseX()+(20*MenuScale)+(width/2),ScaledMouseY()+(12*MenuScale), message$, true, true)
}

var QuickLoadPercent: int = -1
var QuickLoadPercent_DisplayTimer: float = 0
var QuickLoad_CurrEvent: Events

function DrawQuickLoading() {
	
	if (QuickLoadPercent > -1) {
		MidHandle (QuickLoadIcon)
		DrawImage (QuickLoadIcon,GraphicWidth-90,GraphicHeight-150)
		Color (255,255,255)
		AASetFont (Font1)
		AAText (GraphicWidth-100,GraphicHeight-90,"LOADING: "+QuickLoadPercent+"%",1)
		if (QuickLoadPercent > 99) {
			if (QuickLoadPercent_DisplayTimer < 70) {
				QuickLoadPercent_DisplayTimer = Min(QuickLoadPercent_DisplayTimer+FPSfactor,70)
			} else {
				QuickLoadPercent = -1
			}
		}
		QuickLoadEvents()
	} else {
		QuickLoadPercent = -1
		QuickLoadPercent_DisplayTimer = 0
		QuickLoad_CurrEvent = Null
	}	
}

function DrawOptionsTooltip(x: int,y: int,width: int,height: int,option: string,value: float = 0,ingame: boolean = false) {
	let fx: float = x+6*MenuScale
	let fy: float = y+6*MenuScale
	let fw: float = width-12*MenuScale
	let fh: float = height-12*MenuScale
	let lines: int = 0
	let lines2: int = 0
	let txt: string = ""
	let txt2: string = ""
	let R: int = 0
	let G: int = 0
	let B: int = 0
	let usetestimg: int = false
	let extraspace: int = 0
	
	AASetFont (Font1)
	Color (255,255,255)
	switch (Lower(option)) {
		//Graphic options
		case "bump":
			txt = Chr(34)+"Bump mapping"+Chr(34)+" is used to simulate bumps and dents by distorting the lightmaps."
			txt2 = "This option cannot be changed in-game."
			R = 255
		case "vsync":
			txt = Chr(34)+"Vertical sync"+Chr(34)+" waits for the display to finish its current refresh cycle before calculating the next frame, preventing issues such as "
			txt = txt + "screen tearing. This ties the game's frame rate to your display's refresh rate and may cause some input lag."
		case "antialias":
			txt = Chr(34)+"Anti-Aliasing"+Chr(34)+" is used to smooth the rendered image before displaying in order to reduce aliasing around the edges of models."
			txt2 = "This option only takes effect in fullscreen."
			R = 255
		case "roomlights":
			txt = "Toggles the artificial lens flare effect generated over specific light sources."
		case "gamma":
			txt = Chr(34)+"Gamma correction"+Chr(34)+" is used to achieve a good brightness factor to balance out your display's gamma if the game appears either too dark or bright. "
			txt = txt + "Setting it too high or low can cause the graphics to look less detailed."
			R = 255
			G = 255
			B = 255
			txt2 = "Current value: "+Int(value*100)+"% (default is 100%)"
		case "texquality":
			txt = Chr(34)+"Texture LOD Bias"+Chr(34)+" affects the distance at which texture detail will change to prevent aliasing. Change this option if textures flicker or look too blurry."
		case "particleamount":
			txt = "Determines the amount of particles that can be rendered per tick."
			switch (value) {
				case 0:
					R = 255
					txt2 = "Only smoke emitters will produce particles."
				case 1:
					R = 255
					G = 255
					txt2 = "Only a few particles will be rendered per tick."
				case 2:
					G = 255
					txt2 = "All particles are rendered."
			}
		case "vram":
			txt = "Textures that are stored in the Video-RAM will load faster, but this also has negative effects on the texture quality as well."
			txt2 = "This option cannot be changed in-game."
			R = 255
			//[End Block]
		//Sound options
			//[Block]
		case "musicvol":
			txt = "Adjusts the volume of background music. Sliding the bar fully to the left will mute all music."
			R = 255
			G = 255
			B = 255
			txt2 = "Current value: "+Int(value*100)+"% (default is 50%)"
		case "soundvol":
			txt = "Adjusts the volume of sound effects. Sliding the bar fully to the left will mute all sounds."
			R = 255
			G = 255
			B = 255
			txt2 = "Current value: "+Int(value*100)+"% (default is 100%)"
		case "sfxautorelease":
			txt = Chr(34)+"Sound auto-release"+Chr(34)+" will free a sound from memory if it not used after 5 seconds. Prevents memory allocation issues."
			R = 255
			txt2 = "This option cannot be changed in-game."
		case "usertrack":
			txt = "Toggles the ability to play custom tracks over channel 1 of the radio. These tracks are loaded from the " + Chr(34) + "SFX/Radio/UserTracks/" + Chr(34)
			txt = txt + " directory. Press " + Chr(34) + "1" + Chr(34) + " when the radio is selected to change track."
			R = 255
			txt2 = "This option cannot be changed in-game."
		case "usertrackmode":
			txt = "Sets the playing mode for the custom tracks. "+Chr(34)+"Repeat"+Chr(34)+" plays every file in alphabetical order. "+Chr(34)+"Random"+Chr(34)+" chooses the "
			txt = txt + "next track at random."
			R = 255
			G = 255
			txt2 = "Note that the random mode does not prevent previously played tracks from repeating."
		case "usertrackscan":
			txt = "Re-checks the user tracks directory for any new or removed sound files."
			//[End Block]
		//Control options	
			//[Block]
		case "mousesensitivity":
			txt = "Adjusts the speed of the mouse pointer."
			R = 255
			G = 255
			B = 255
			txt2 = "Current value: "+Int((0.5+value)*100)+"% (default is 50%)"
		case "mouseinvert":
			txt = Chr(34)+"Invert mouse Y-axis"+Chr(34)+" is self-explanatory."
		case "mousesmoothing":
			txt = "Adjusts the amount of smoothing of the mouse pointer."
			R = 255
			G = 255
			B = 255
			txt2 = "Current value: "+Int(value*100)+"% (default is 100%)"
		case "controls":
			txt = "Configure the in-game control scheme."
			//[End Block]
		//Advanced options	
			//[Block]
		case "hud":
			txt = "Display the blink and stamina meters."
		case "consoleenable":
			txt = "Toggles the use of the developer console. Can be used in-game by pressing " + KeyName(KEY_CONSOLE) + "."
		case "consoleerror":
			txt = Chr(34)+"Open console on error"+Chr(34)+" is self-explanatory."
		case "achpopup":
			txt = "Displays a pop-up notification when an achievement is unlocked."
		case "showfps":
			txt = "Displays the frames per second counter at the top left-hand corner."
		case "framelimit":
			txt = "Limits the frame rate that the game can run at to a desired value."
			if (value > 0 && value < 60) {
				R = 255
				G = 255
				txt2 = "Usually, 60 FPS or higher is preferred. If you are noticing excessive stuttering at this setting, try lowering it to make your framerate more consistent."
			}
		case "antialiastext":
			txt = Chr(34)+"Antialiased text"+Chr(34)+" smooths out the text before displaying. Makes text easier to read at high resolutions."
			//[End Block]
	}
	
	lines = GetLineAmount(txt,fw,fh)
	if (usetestimg) {
		extraspace = 210*MenuScale
	}
	if (txt2$ = "") {
		DrawFrame(x,y,width,((AAStringHeight(txt)*lines)+(10+lines)*MenuScale)+extraspace)
	} else {
		lines2 = GetLineAmount(txt2,fw,fh)
		DrawFrame(x,y,width,(((AAStringHeight(txt)*lines)+(10+lines)*MenuScale)+(AAStringHeight(txt2)*lines2)+(10+lines2)*MenuScale)+extraspace)
	}
	RowText(txt,fx,fy,fw,fh)
	if (txt2 != "") {
		Color (R,G,B)
		RowText(txt2,fx,(fy+(AAStringHeight(txt)*lines)+(5+lines)*MenuScale),fw,fh)
	}
	if (usetestimg) {
		MidHandle (Menu_TestIMG)
		if (txt2$ = "") {
			DrawImage (Menu_TestIMG,x+(width/2),y+100*MenuScale+((AAStringHeight(txt)*lines)+(10+lines)*MenuScale))
		} else {
			DrawImage (Menu_TestIMG,x+(width/2),y+100*MenuScale+(((AAStringHeight(txt)*lines)+(10+lines)*MenuScale)+(AAStringHeight(txt2)*lines2)+(10+lines2)*MenuScale))
		}
	}
}

function DrawMapCreatorTooltip(x: int,y: int,width: int,height: int,mapname: string) {
	let fx: float = x+6*MenuScale
	let fy: float = y+6*MenuScale
	let fw: float = width-12*MenuScale
	let fh: float = height-12*MenuScale
	let lines: int = 0
	
	AASetFont (Font1)
	Color (255,255,255)
	
	let txt: string[] = new Array(5)
	if (Right(mapname,6)="cbmap2") {
		txt[0] = Left(mapname$,Len(mapname$)-7)
		let f: int = OpenFile("Map Creator/Maps/"+mapname$)
		
		let author$ = ReadLine(f)
		let descr$ = ReadLine(f)
		ReadByte(f)
		ReadByte(f)
		let ramount: int = ReadInt(f)
		if (ReadInt(f) > 0) {
			let hasForest: boolean = true
		} else {
			hasForest = false
		}
		if (ReadInt(f) > 0) {
			let hasMT: boolean = true
		} else {
			hasMT = false
		}
		
		CloseFile (f)
	} else {
		txt[0] = Left(mapname,Len(mapname)-6)
		author = "[Unknown]"
		descr = "[No description]"
		ramount = 0
		hasForest = false
		hasMT = false
	}
	txt[1] = "Made by: " + author
	txt[2] = "Description: "+descr$
	if (ramount > 0) {
		txt[3] = "Room amount: "+ramount
	} else {
		txt[3] = "Room amount: [Unknown]"
	}
	if (hasForest) {
		txt[4] = "Has custom forest: Yes"
	} else {
		txt[4] = "Has custom forest: No"
	}
	if (hasMT) {
		txt[5] = "Has custom maintenance tunnel: Yes"
	} else {
		txt[5] = "Has custom maintenance tunnel: No"
	}
	
	lines = GetLineAmount(txt[2],fw,fh)
	DrawFrame(x,y,width,(AAStringHeight(txt[0])*6)+AAStringHeight(txt[2])*lines+5*MenuScale)
	
	Color (255,255,255)
	AAText(fx,fy,txt[0])
	AAText(fx,fy+AAStringHeight(txt[0]),txt[1])
	RowText(txt[2],fx,fy+(AAStringHeight(txt[0])*2),fw,fh)
	AAText(fx,fy+((AAStringHeight(txt[0])*2)+AAStringHeight(txt[2])*lines+5*MenuScale),txt[3])
	AAText(fx,fy+((AAStringHeight(txt[0])*3)+AAStringHeight(txt[2])*lines+5*MenuScale),txt[4])
	AAText(fx,fy+((AAStringHeight(txt[0])*4)+AAStringHeight(txt[2])*lines+5*MenuScale),txt[5])
}

function ChangeMenu_TestIMG(change: string) {
	
	if (Menu_TestIMG != 0) {FreeImage (Menu_TestIMG)}
	AmbientLightRoomTex = CreateTexture(2,2,257)
	TextureBlend (AmbientLightRoomTex,5)
	SetBuffer(TextureBuffer(AmbientLightRoomTex))
	ClsColor (0,0,0)
	Cls()
	SetBuffer (BackBuffer())
	Menu_TestIMG = Create3DIcon(200,200,"GFX/map/room3z3_opt.rmesh",0,-0.75,1,0,0,0,menuroomscale,menuroomscale,menuroomscale,true)
	ScaleImage (Menu_TestIMG,MenuScale,MenuScale)
	MaskImage(Menu_TestIMG,255,0,255)
	FreeTexture (AmbientLightRoomTex)
	AmbientLightRoomTex = 0
	
	CurrMenu_TestIMG = change$
}

var OnSliderID: int = 0

function Slider3(x: int,y: int,width: int,value: int,ID: int,val1: string,val2: string,val3: string) {
	
	if (MouseDown1) {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			OnSliderID = ID
		}
	}
	
	Color (200,200,200)
	Rect(x,y,width+14,10,true)
	Rect(x,y-8,4,14,true)
	Rect(x+(width/2)+5,y-8,4,14,true)
	Rect(x+width+10,y-8,4,14,true)
	
	if (ID = OnSliderID) {
		if (ScaledMouseX() <= x+8) {
			value = 0
		} else if ((ScaledMouseX() >= x+width/2) && (ScaledMouseX() <= x+(width/2)+8)) {
			value = 1
		} else if ((ScaledMouseX() >= x+width)) {
			value = 2
		}
		Color (0,255,0)
		Rect(x,y,width+14,10,true)
	} else {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			Color (0,200,0)
			Rect(x,y,width+14,10,false)
		}
	}
	
	if (value == 0) {
		DrawImage(BlinkMeterIMG,x,y-8)
 	} else if (value == 1) {
		DrawImage(BlinkMeterIMG,x+(width/2)+3,y-8)
	} else {
		DrawImage(BlinkMeterIMG,x+width+6,y-8)
	}
	
	Color(170,170,170)
	if (value == 0) {
		AAText(x+2,y+10+MenuScale,val1,true)
 	} else if (value == 1) {
		AAText(x+(width/2)+7,y+10+MenuScale,val2,true)
	} else {
		AAText(x+width+12,y+10+MenuScale,val3,true)
	}
	
	return value
	
}

function Slider4(x: int,y: int,width: int,value: int,ID: int,val1: string,val2: string,val3: string,val4: string) {
	
	if (MouseDown1) {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			OnSliderID = ID
		}
	}
	
	Color(200,200,200)
	Rect(x,y,width+14,10,true)
	Rect(x,y-8,4,14,true) //1
	Rect(x+(width*(1.0/3.0))+(10.0/3.0),y-8,4,14,true) //2
	Rect(x+(width*(2.0/3.0))+(20.0/3.0),y-8,4,14,true) //3
	Rect(x+width+10,y-8,4,14,true) //4
	
	if (ID == OnSliderID) {
		if (ScaledMouseX() <= x+8) {
			value = 0
		} else if ((ScaledMouseX() >= x+width*(1.0/3.0)) && (ScaledMouseX() <= x+width*(1.0/3.0)+8)) {
			value = 1
		} else if ((ScaledMouseX() >= x+width*(2.0/3.0)) && (ScaledMouseX() <= x+width*(2.0/3.0)+8)) {
			value = 2
		} else if ((ScaledMouseX() >= x+width)) {
			value = 3
		}
		Color(0,255,0)
		Rect(x,y,width+14,10,true)
	} else {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			Color(0,200,0)
			Rect(x,y,width+14,10,false)
		}
	}
	
	if (value == 0) {
		DrawImage(BlinkMeterIMG,x,y-8)
 	} else if (value == 1) {
		DrawImage(BlinkMeterIMG,x+width*(1.0/3.0)+2,y-8)
 	} else if (value == 2) {
		DrawImage(BlinkMeterIMG,x+width*(2.0/3.0)+4,y-8)
	} else {
		DrawImage(BlinkMeterIMG,x+width+6,y-8)
	}
	
	Color(170,170,170)
	if (value == 0) {
		AAText(x+2,y+10+MenuScale,val1,true)
 	} else if (value == 1) {
		AAText(x+width*(1.0/3.0)+2+(10.0/3.0),y+10+MenuScale,val2,true)
 	} else if (value == 2) {
		AAText(x+width*(2.0/3.0)+2+((10.0/3.0)*2),y+10+MenuScale,val3,true)
	} else {
		AAText(x+width+12,y+10+MenuScale,val4,true)
	}
	
	return value
}

function Slider5(x: int,y: int,width: int,value: int,ID: int,val1: string,val2: string,val3: string,val4: string,val5: string) {
	
	if (MouseDown1) {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			OnSliderID = ID
		}
	}
	
	Color (200,200,200)
	Rect(x,y,width+14,10,true)
	Rect(x,y-8,4,14,true) //1
	Rect(x+(width/4)+2.5,y-8,4,14,true) //2
	Rect(x+(width/2)+5,y-8,4,14,true) //3
	Rect(x+(width*0.75)+7.5,y-8,4,14,true) //4
	Rect(x+width+10,y-8,4,14,true) //5
	
	if (ID = OnSliderID) {
		if (ScaledMouseX() <= x+8) {
			value = 0
		} else if ((ScaledMouseX() >= x+width/4) && (ScaledMouseX() <= x+(width/4)+8)) {
			value = 1
		} else if ((ScaledMouseX() >= x+width/2) && (ScaledMouseX() <= x+(width/2)+8)) {
			value = 2
		} else if ((ScaledMouseX() >= x+width*0.75) && (ScaledMouseX() <= x+(width*0.75)+8)) {
			value = 3
		} else if ((ScaledMouseX() >= x+width)) {
			value = 4
		}
		Color (0,255,0)
		Rect(x,y,width+14,10,true)
	} else {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			Color (0,200,0)
			Rect(x,y,width+14,10,false)
		}
	}
	
	if (value = 0) {
		DrawImage(BlinkMeterIMG,x,y-8)
	} else if (value = 1) {
		DrawImage(BlinkMeterIMG,x+(width/4)+1.5,y-8)
	} else if (value = 2) {
		DrawImage(BlinkMeterIMG,x+(width/2)+3,y-8)
	} else if (value = 3) {
		DrawImage(BlinkMeterIMG,x+(width*0.75)+4.5,y-8)
	} else {
		DrawImage(BlinkMeterIMG,x+width+6,y-8)
	}
	
	Color (170,170,170)
	if (value = 0) {
		AAText(x+2,y+10+MenuScale,val1,true)
 	} else if (value = 1) {
		AAText(x+(width/4)+4.5,y+10+MenuScale,val2,true)
 	} else if (value = 2) {
		AAText(x+(width/2)+7,y+10+MenuScale,val3,true)
 	} else if (value = 3) {
		AAText(x+(width*0.75)+9.5,y+10+MenuScale,val4,true)
	} else {
		AAText(x+width+12,y+10+MenuScale,val5,true)
	}
	
	return value
}

function Slider7(x: int,y: int,width: int,value: int,ID: int,val1: string,val2: string,val3: string,val4: string,val5: string,val6: string,val7: string) {
	
	if (MouseDown1) {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			OnSliderID = ID
		}
	}
	
	Color (200,200,200)
	Rect(x,y,width+14,10,true)
	Rect(x,y-8,4,14,true) //1
	Rect(x+(width*(1.0/6.0))+(10.0/6.0),y-8,4,14,true) //2
	Rect(x+(width*(2.0/6.0))+(20.0/6.0),y-8,4,14,true) //3
	Rect(x+(width*(3.0/6.0))+(30.0/6.0),y-8,4,14,true) //4
	Rect(x+(width*(4.0/6.0))+(40.0/6.0),y-8,4,14,true) //5
	Rect(x+(width*(5.0/6.0))+(50.0/6.0),y-8,4,14,true) //6
	Rect(x+width+10,y-8,4,14,true) //7
	
	if (ID = OnSliderID) {
		if (ScaledMouseX() <= x+8) {
			value = 0
		} else if ((ScaledMouseX() >= x+(width*(1.0/6.0))) && (ScaledMouseX() <= x+(width*(1.0/6.0))+8)) {
			value = 1
		} else if ((ScaledMouseX() >= x+(width*(2.0/6.0))) && (ScaledMouseX() <= x+(width*(2.0/6.0))+8)) {
			value = 2
		} else if ((ScaledMouseX() >= x+(width*(3.0/6.0))) && (ScaledMouseX() <= x+(width*(3.0/6.0))+8)) {
			value = 3
		} else if ((ScaledMouseX() >= x+(width*(4.0/6.0))) && (ScaledMouseX() <= x+(width*(4.0/6.0))+8)) {
			value = 4
		} else if ((ScaledMouseX() >= x+(width*(5.0/6.0))) && (ScaledMouseX() <= x+(width*(5.0/6.0))+8)) {
			value = 5
		} else if ((ScaledMouseX() >= x+width)) {
			value = 6
		}
		Color (0,255,0)
		Rect(x,y,width+14,10,true)
	} else {
		if ((ScaledMouseX() >= x) && (ScaledMouseX() <= x+width+14) && (ScaledMouseY() >= y-8) && (ScaledMouseY() <= y+10)) {
			Color (0,200,0)
			Rect(x,y,width+14,10,false)
		}
	}
	
	if (value = 0) {
		DrawImage(BlinkMeterIMG,x,y-8)
	} else if (value = 1) {
		DrawImage(BlinkMeterIMG,x+(width*(1.0/6.0))+1,y-8)
	} else if (value = 2) {
		DrawImage(BlinkMeterIMG,x+(width*(2.0/6.0))+2,y-8)
	} else if (value = 3) {
		DrawImage(BlinkMeterIMG,x+(width*(3.0/6.0))+3,y-8)
	} else if (value = 4) {
		DrawImage(BlinkMeterIMG,x+(width*(4.0/6.0))+4,y-8)
	} else if (value = 5) {
		DrawImage(BlinkMeterIMG,x+(width*(5.0/6.0))+5,y-8)
	} else {
		DrawImage(BlinkMeterIMG,x+width+6,y-8)
	}
	
	Color (170,170,170)
	if (value = 0) {
		AAText(x+2,y+10+MenuScale,val1,true)
	} else if (value = 1) {
		AAText(x+(width*(1.0/6.0))+2+(10.0/6.0),y+10+MenuScale,val2,true)
	} else if (value = 2) {
		AAText(x+(width*(2.0/6.0))+2+((10.0/6.0)*2),y+10+MenuScale,val3,true)
	} else if (value = 3) {
		AAText(x+(width*(3.0/6.0))+2+((10.0/6.0)*3),y+10+MenuScale,val4,true)
	} else if (value = 4) {
		AAText(x+(width*(4.0/6.0))+2+((10.0/6.0)*4),y+10+MenuScale,val5,true)
	} else if (value = 5) {
		AAText(x+(width*(5.0/6.0))+2+((10.0/6.0)*5),y+10+MenuScale,val6,true)
	} else {
		AAText(x+width+12,y+10+MenuScale,val7,true)
	}
	
	return value
}

export var OnBar: int
export var ScrollBarY: float = 0.0
export var ScrollMenuHeight: float = 0.0

function DrawScrollBar(x, y, width, height, barx, bary, barwidth, barheight, bar: float, dir = 0): float {
	//0 = vaakasuuntainen, 1 = pystysuuntainen
	
	let MouseSpeedX = MouseXSpeed()
	let MouseSpeedY = MouseYSpeed()
	
	Color(0, 0, 0)
	//Rect(x, y, width, height)
	Button(barx, bary, barwidth, barheight, "")
	
	if (dir = 0) { //vaakasuunnassa
		if (height > 10) {
			Color (250,250,250)
			Rect(barx + barwidth / 2, bary + 5*MenuScale, 2*MenuScale, barheight - 10)
			Rect(barx + barwidth / 2 - 3*MenuScale, bary + 5*MenuScale, 2*MenuScale, barheight - 10)
			Rect(barx + barwidth / 2 + 3*MenuScale, bary + 5*MenuScale, 2*MenuScale, barheight - 10)
		}
	} else { //pystysuunnassa
		if (width > 10) {
			Color (250,250,250)
			Rect(barx + 4*MenuScale, bary + barheight / 2, barwidth - 10*MenuScale, 2*MenuScale)
			Rect(barx + 4*MenuScale, bary + barheight / 2 - 3*MenuScale, barwidth - 10*MenuScale, 2*MenuScale)
			Rect(barx + 4*MenuScale, bary + barheight / 2 + 3*MenuScale, barwidth - 10*MenuScale, 2*MenuScale)
		}
	}
	
	if (MouseX()>barx && MouseX()<barx+barwidth) {
		if (MouseY()>bary && MouseY()<bary+barheight) {
			OnBar = true
		} else {
			if (!MouseDown1) {
				OnBar = false
			}
		}
	} else {
		if (!MouseDown1) {
			OnBar = false
		}
	}
	
	if (MouseDown1) {
		if (OnBar) {
			if (dir = 0) {
				return Min(Max(bar + MouseSpeedX / Float(width - barwidth), 0), 1)
			} else {
				return Min(Max(bar + MouseSpeedY / Float(height - barheight), 0), 1)
			}
		}
	}
	
	return bar
}

function Button(x,y,width,height,txt: string, disabled: boolean = false): int {
	let Pushed = false
	
	Color (50, 50, 50)
	if (!disabled) { 
		if (MouseX() > x && MouseX() < x+width) {
			if (MouseY() > y && MouseY() < y+height) {
				if (MouseDown1) {
					Pushed = true
					Color(50*0.6, 50*0.6, 50*0.6)
				} else {
					Color(Min(50*1.2,255),Min(50*1.2,255),Min(50*1.2,255))
				}
			}
		}
	}
	
	if (Pushed) {
		Rect (x,y,width,height)
		Color (133,130,125)
		Rect (x+1*MenuScale,y+1*MenuScale,width-1*MenuScale,height-1*MenuScale,false)
		Color (10,10,10)
		Rect (x,y,width,height,false)
		Color (250,250,250)
		Line (x,y+height-1*MenuScale,x+width-1*MenuScale,y+height-1*MenuScale)
		Line (x+width-1*MenuScale,y,x+width-1*MenuScale,y+height-1*MenuScale)
	} else {
		Rect (x,y,width,height)
		Color (133,130,125)
		Rect (x,y,width-1*MenuScale,height-1*MenuScale,false)
		Color (250,250,250)
		Rect (x,y,width,height,false)
		Color (10,10,10)
		Line (x,y+height-1,x+width-1,y+height-1)
		Line (x+width-1,y,x+width-1,y+height-1)
	}
	
	Color (255,255,255)
	if (disabled) {Color(70,70,70)}
	BBText(x+width/2, y+height/2-1*MenuScale, txt, true, true)
	
	Color (0,0,0)
	
	if (Pushed && MouseHit1) {
		PlaySound_Strict (ButtonSFX)
		return true
	}
}