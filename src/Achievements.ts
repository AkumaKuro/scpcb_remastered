import { AASetFont, AAText } from "./AAText"
import { GetINIInt } from "./Converter"
import { Color, float, ImageWidth, int, range } from "./Helper/bbhelper"
import { Rect } from "./Helper/graphics"
import { Str } from "./Helper/strings"
import { DrawImage } from "./Helper/textures"
import { GraphicHeight, Font3, Font1, MenuScale, FPSfactor2, GraphicWidth } from "./Main"
import { LoadImage_Strict } from "./StrictLoads"

export const MAXACHIEVEMENTS=37
export var Achievements: boolean[] = new Array(MAXACHIEVEMENTS)

export const Achv008: int=0
export const Achv012: int=1
export const Achv035: int=2
export const Achv049: int=3
export const Achv055=4
export const  Achv079: int=5
export const Achv096: int=6
export const Achv106: int=7
export const Achv148: int=8
export const Achv205=9
export const Achv294: int=10
export const Achv372: int=11
export const Achv420: int=12
export const Achv427=13
export const Achv500: int=14
export const Achv513: int=15
export const Achv714: int=16
export const Achv789: int=17
export const Achv860: int=18
export const Achv895: int=19
export const Achv914: int=20
export const Achv939: int=21
export const Achv966: int=22
export const Achv970=23
export const Achv1025: int=24
export const Achv1048=25
export const Achv1123=26

export const AchvMaynard: int=27
export const AchvHarp: int=28
export const AchvSNAV: int=29
export const AchvOmni: int=30
export const AchvConsole: int=31
export const AchvTesla: int=32
export const AchvPD: int=33

export const Achv1162: int = 34
export const Achv1499: int = 35

export const AchvKeter: int = 36

export var UsedConsole

export var AchievementsMenu: int
export var AchvMSGenabled: int = GetINIInt("options.ini", "options", "achievement popup enabled")
export var AchievementStrings: string[] = new Array(MAXACHIEVEMENTS)
export var AchievementDescs: string[] = new Array(MAXACHIEVEMENTS)
export var AchvIMG: int[] = new Array(MAXACHIEVEMENTS)

for (let i of range(MAXACHIEVEMENTS)) {
	let loc2: int = GetINISectionLocation("Data/achievementstrings.ini", "s"+Str(i))
	AchievementStrings[i] = GetINIString2("Data/achievementstrings.ini", loc2, "string1")
	AchievementDescs[i] = GetINIString2("Data/achievementstrings.ini", loc2, "AchvDesc")
	
	let image: string = GetINIString2("Data/achievementstrings.ini", loc2, "image") 
	
	AchvIMG[i] = LoadImage_Strict("GFX/menu/achievements/"+image+".jpg")
	AchvIMG[i] = ResizeImage2(AchvIMG[i],ImageWidth(AchvIMG[i])*GraphicHeight/768.0,ImageHeight(AchvIMG[i])*GraphicHeight/768.0)
}

var AchvLocked = LoadImage_Strict("GFX/menu/achievements/achvlocked.jpg")
AchvLocked = ResizeImage2(AchvLocked,ImageWidth(AchvLocked)*GraphicHeight/768.0,ImageHeight(AchvLocked)*GraphicHeight/768.0)

function GiveAchievement(achvname: int, showMessage: boolean = true) {
	if (Achievements[achvname] != true) {
		Achievements[achvname] = true
		if (AchvMSGenabled && showMessage) {
			let loc2: int = GetINISectionLocation("Data/achievementstrings.ini", "s"+achvname)
			let AchievementName: string = GetINIString2("Data/achievementstrings.ini", loc2, "string1")
			CreateAchievementMsg(achvname,AchievementName)
		}
	}
}

function AchievementTooltip(achvno: int) {
    let scale: float = GraphicHeight/768.0
    
    AASetFont(Font3)
    let width = AAStringWidth(AchievementStrings(achvno))
    AASetFont(Font1)
    if (AAStringWidth(AchievementDescs(achvno))>width) {
        width = AAStringWidth(AchievementDescs(achvno))
	}
    width = width+20*MenuScale
    
    let height = 38*scale
    
    Color(25,25,25)
    Rect(ScaledMouseX()+(20*MenuScale),ScaledMouseY()+(20*MenuScale),width,height,true)
    Color(150,150,150)
    Rect(ScaledMouseX()+(20*MenuScale),ScaledMouseY()+(20*MenuScale),width,height,false)
    AASetFont(Font3)
    AAText(ScaledMouseX()+(20*MenuScale)+(width/2),ScaledMouseY()+(35*MenuScale), AchievementStrings(achvno), true, true)
    AASetFont(Font1)
    AAText(ScaledMouseX()+(20*MenuScale)+(width/2),ScaledMouseY()+(55*MenuScale), AchievementDescs(achvno), true, true)
}

function DrawAchvIMG(x: int, y: int, achvno: int) {
	let row: int
	let scale: float = GraphicHeight/768.0
	let SeparationConst2 = 76 * scale
	row = achvno % 4
	Color( 0,0,0)
	Rect((x+((row)*SeparationConst2)), y, 64*scale, 64*scale, true)
	if (Achievements(achvno)) {
		DrawImage(AchvIMG(achvno),(x+(row*SeparationConst2)),y)
} else {
		DrawImage(AchvLocked,(x+(row*SeparationConst2)),y)
}
	Color (50,50,50)
	
	Rect((x+(row*SeparationConst2)), y, 64*scale, 64*scale, false)
}

var CurrAchvMSGID: int = 0

class AchievementMsg {
	achvID: int
	txt: string
	msgx: float
	msgtime: float
	msgID: int
	static each: AchievementMsg[] = []
}

function CreateAchievementMsg(id: int,txt: string): AchievementMsg {
	let amsg: AchievementMsg = new AchievementMsg()
	
	amsg.achvID = id
	amsg.txt = txt
	amsg.msgx = 0.0
	amsg.msgtime = FPSfactor2
	amsg.msgID = CurrAchvMSGID
	CurrAchvMSGID = CurrAchvMSGID + 1
	
	return amsg
}

function UpdateAchievementMsg() {
	let amsg: AchievementMsg
	let amsg2: AchievementMsg
	let scale: float = GraphicHeight/768.0
	let width: int = 264*scale
	let height: int = 84*scale
	let x: int
	let y: int
	
	for (amsg of AchievementMsg.each) {
		if (amsg.msgtime != 0) {
			x=GraphicWidth+amsg.msgx
			y=(GraphicHeight-height)
			for (amsg2 of AchievementMsg.each) {
				if (amsg2 != amsg) {
					if (amsg2.msgID > amsg.msgID) {
						y=y-height
					}
				}
			}
			DrawFrame(x,y,width,height)
			Color(0,0,0)
			Rect(x+10*scale,y+10*scale,64*scale,64*scale,true)
			DrawImage(AchvIMG(amsg.achvID),x+10*scale,y+10*scale)
			Color(50,50,50)
			Rect(x+10*scale,y+10*scale,64*scale,64*scale,false)
			Color(255,255,255)
			AASetFont(Font1)
			RowText("Achievement Unlocked - "+amsg.txt,x+84*scale,y+10*scale,width-94*scale,y-20*scale)
			if (amsg.msgtime > 0.0 && amsg.msgtime < 70*7) {
				amsg.msgtime = amsg.msgtime + FPSfactor2
				if (amsg.msgx > -width) {
					amsg.msgx = Max(amsg.msgx-4*FPSfactor2,-width%)
				}
			} else if (amsg.msgtime >= 70*7) {
				amsg.msgtime = -1
			} else if (amsg.msgtime = -1) {
				if (amsg.msgx < 0.0) {
					amsg.msgx = Min(amsg.msgx+4*FPSfactor2,0.0)
				} else {
					amsg.msgtime = 0.0
				}
			}
		} else {
			Delete(amsg)
		}
	}
}