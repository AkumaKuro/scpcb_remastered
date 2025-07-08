import { SetAnimTime } from "./Helper/animation.ts"
import {int, float, CopyEntity} from "./Helper/bbhelper.ts"
import { Lower } from "./Helper/strings.ts"
import { LoadAnimMesh_Strict } from "./StrictLoads.ts"

var BurntNote: int

const MaxItemAmount: int = 10
var ItemAmount: int
var Inventory: Items[] = new Array(MaxItemAmount + 1)
var InvSelect: int, SelectedItem: Items

var ClosestItem: Items

var LastItemID: int

class ItemTemplates {
	name: string
	tempname: string
	
	sound: int
	
	found: int
	
	obj: int
	objpath: string
	parentobjpath: string
	invimg: int
	invimg2: int
	invimgpath: string
	imgpath: string
	img: int
	
	isAnim: int
	
	scale: float
	tex: int
	texpath: string
	static each: ItemTemplates[] = []
}

function CreateItemTemplate(name: string, tempname: string, objpath: string, invimgpath: string, imgpath: string, scale: float, texturepath: string = "",invimgpath2: string="",Anim: int = 0, texflags: int = 9): ItemTemplates {
	let it: ItemTemplates = new ItemTemplates
	let n
	
	
	//if another item shares the same object, copy it
	for (let it2 of ItemTemplates.each) {
		if (it2.objpath == objpath && it2.obj != 0) {
			it.obj = CopyEntity(it2.obj)
			it.parentobjpath=it2.objpath
			break
		}
	}
	
	if (it.obj = 0) {
		If Anim!=0 Then
			it.obj = LoadAnimMesh_Strict(objpath)
			it.isAnim=True
		Else
			it.obj = LoadMesh_Strict(objpath)
			it.isAnim=False
		EndIf
		it.objpath = objpath
	EndIf
	it.objpath = objpath
	
	Local texture%
	
	If texturepath != "" Then
		For it2.itemtemplates = Each ItemTemplates
			If it2\texpath = texturepath And it2\tex!=0 Then
				texture = it2\tex
				Exit
			EndIf
		Next
		If texture=0 Then texture=LoadTexture_Strict(texturepath,texflags%) : it\texpath = texturepath// : DebugLog texturepath
		EntityTexture it\obj, texture
		it\tex = texture
	EndIf  
	
	it\scale = scale
	ScaleEntity it\obj, scale, scale, scale, True
	
	//if another item shares the same object, copy it
	For it2.itemtemplates = Each ItemTemplates
		If it2.invimgpath = invimgpath And it2.invimg != 0 Then
			it.invimg = it2.invimg //CopyImage()
			If it2.invimg2!=0 Then
				it.invimg2=it2.invimg2 //CopyImage()
			EndIf
			Exit
		EndIf
	Next
	If it.invimg=0 Then
		it.invimg = LoadImage_Strict(invimgpath)
		it.invimgpath = invimgpath
		MaskImage(it.invimg, 255, 0, 255)
	EndIf
	
	If (invimgpath2 != "") Then
		If it.invimg2=0 Then
			it.invimg2 = LoadImage_Strict(invimgpath2)
			MaskImage(it.invimg2,255,0,255)
		EndIf
	Else
		it.invimg2 = 0
	EndIf
	
	it.imgpath = imgpath
	
	it.tempname = tempname
	it.name = name
	
	it.sound = 1

	HideEntity(it.obj)
	
	Return it
	
End Function

function InitItemTemplates() {
	let it: ItemTemplates,it2: ItemTemplates
	
	it = CreateItemTemplate("Some SCP-420-J", "420", "GFX/items/420.x", "GFX/items/INV420.jpg", "", 0.0005)
	it.sound = 2
	
	CreateItemTemplate("Level 1 Key Card", "key1",  "GFX/items/keycard.x", "GFX/items/INVkey1.jpg", "", 0.0004,"GFX/items/keycard1.jpg")
	CreateItemTemplate("Level 2 Key Card", "key2",  "GFX/items/keycard.x", "GFX/items/INVkey2.jpg", "", 0.0004,"GFX/items/keycard2.jpg")
	CreateItemTemplate("Level 3 Key Card", "key3",  "GFX/items/keycard.x", "GFX/items/INVkey3.jpg", "", 0.0004,"GFX/items/keycard3.jpg")
	CreateItemTemplate("Level 4 Key Card", "key4",  "GFX/items/keycard.x", "GFX/items/INVkey4.jpg", "", 0.0004,"GFX/items/keycard4.jpg")
	CreateItemTemplate("Level 5 Key Card", "key5", "GFX/items/keycard.x", "GFX/items/INVkey5.jpg", "", 0.0004,"GFX/items/keycard5.jpg")
	CreateItemTemplate("Playing Card", "misc", "GFX/items/keycard.x", "GFX/items/INVcard.jpg", "", 0.0004,"GFX/items/card.jpg")
	CreateItemTemplate("Mastercard", "misc", "GFX/items/keycard.x", "GFX/items/INVmastercard.jpg", "", 0.0004,"GFX/items/mastercard.jpg")
	CreateItemTemplate("Key Card Omni", "key6", "GFX/items/keycard.x", "GFX/items/INVkeyomni.jpg", "", 0.0004,"GFX/items/keycardomni.jpg")
	
	it = CreateItemTemplate("SCP-860", "scp860", "GFX/items/key.b3d", "GFX/items/INVkey.jpg", "", 0.001)
	it.sound = 3
	
	it = CreateItemTemplate("Document SCP-079", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc079.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-895", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc895.jpg", 0.003)
	it.sound = 0 
	it = CreateItemTemplate("Document SCP-860", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc860.jpg", 0.003)
	it.sound = 0 	
	it = CreateItemTemplate("Document SCP-860-1", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc8601.jpg", 0.003)
	it.sound = 0 	
	it = CreateItemTemplate("SCP-093 Recovered Materials", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc093rm.jpg", 0.003)
	it.sound = 0 	
	it = CreateItemTemplate("Document SCP-106", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc106.jpg", 0.003)
	it.sound = 0	
	it = CreateItemTemplate("Dr. Allok's Note", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc106_2.jpg", 0.0025)
	it.sound = 0
	it = CreateItemTemplate("Recall Protocol RP-106-N", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docRP.jpg", 0.0025)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-682", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc682.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-173", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc173.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-372", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc372.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-049", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc049.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-096", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc096.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-008", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc008.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-012", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc012.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-500", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc500.png", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-714", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc714.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-513", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc513.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-035", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc035.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("SCP-035 Addendum", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc035ad.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-939", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc939.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-966", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc966.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-970", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc970.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-1048", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1048.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-1123", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1123.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-1162", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1162.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document SCP-1499", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1499.png", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Incident Report SCP-1048-A", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1048a.jpg", 0.003)
	it.sound = 0
	
	it = CreateItemTemplate("Drawing", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc1048.jpg", 0.003)
	it.sound = 0
	
	it = CreateItemTemplate("Leaflet", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/leaflet.jpg", 0.003, "GFX/items/notetexture.jpg")
	it.sound = 0
	
	it = CreateItemTemplate("Dr. L's Note", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docL1.jpg", 0.0025, "GFX/items/notetexture.jpg")
	it.sound = 0
	it = CreateItemTemplate("Dr L's Note", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docL2.jpg", 0.0025, "GFX/items/notetexture.jpg")
	it.sound = 0
	it = CreateItemTemplate("Blood-stained Note", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docL3.jpg", 0.0025, "GFX/items/notetexture.jpg")
	it.sound = 0
	it = CreateItemTemplate("Dr. L's Burnt Note", "paper", "GFX/items/paper.x", "GFX/items/INVbn.jpg", "GFX/items/docL4.jpg", 0.0025, "GFX/items/BurntNoteTexture.jpg")
	it.sound = 0
	it = CreateItemTemplate("Dr L's Burnt Note", "paper", "GFX/items/paper.x", "GFX/items/INVbn.jpg", "GFX/items/docL5.jpg", 0.0025, "GFX/items/BurntNoteTexture.jpg")
	it.sound = 0
	it = CreateItemTemplate("Scorched Note", "paper", "GFX/items/paper.x", "GFX/items/INVbn.jpg", "GFX/items/docL6.jpg", 0.0025, "GFX/items/BurntNoteTexture.jpg")
	it.sound = 0
	
	it = CreateItemTemplate("Journal Page", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docGonzales.jpg", 0.0025)
	it.sound = 0
	
	
	it = CreateItemTemplate("Log #1", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/f4.jpg", 0.004, "GFX/items/f4.jpg")
	it.sound = 0
	it = CreateItemTemplate("Log #2", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/f5.jpg", 0.004, "GFX/items/f4.jpg")
	it.sound = 0
	it = CreateItemTemplate("Log #3", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/f6.jpg", 0.004, "GFX/items/f4.jpg")
	it.sound = 0
	
	it = CreateItemTemplate("Strange Note", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docStrange.jpg", 0.0025, "GFX/items/notetexture.jpg")
	it.sound = 0
	
	it = CreateItemTemplate("Nuclear Device Document", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docNDP.jpg", 0.003)
	it.sound = 0	
	it = CreateItemTemplate("Class D Orientation Leaflet", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docORI.jpg", 0.003)
	it.sound = 0	
	
	it = CreateItemTemplate("Note from Daniel", "paper", "GFX/items/note.x", "GFX/items/INVnote2.jpg", "GFX/items/docdan.jpg", 0.0025)
	it.sound = 0
	
	it = CreateItemTemplate("Burnt Note", "paper", "GFX/items/paper.x", "GFX/items/INVbn.jpg", "GFX/items/bn.it", 0.003, "GFX/items/BurntNoteTexture.jpg")
	it.img = BurntNote
	it.sound = 0
	
	it = CreateItemTemplate("Mysterious Note", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/sn.it", 0.003, "GFX/items/notetexture.jpg")
	it.sound = 0	
	
	it = CreateItemTemplate("Mobile Task Forces", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docMTF.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Security Clearance Levels", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docSC.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Object Classes", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docOBJC.jpg", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Document", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docRAND3.jpg", 0.003)
	it.sound = 0 
	it = CreateItemTemplate("Addendum: 5/14 Test Log", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docRAND2.jpg", 0.003, "GFX/items/notetexture.jpg")
	it.sound = 0 
	it = CreateItemTemplate("Notification", "paper", "GFX/items/paper.x", "GFX/items/INVnote.jpg", "GFX/items/docRAND1.jpg", 0.003, "GFX/items/notetexture.jpg")
	it.sound = 0 	
	it = CreateItemTemplate("Incident Report SCP-106-0204", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docIR106.jpg", 0.003)
	it.sound = 0 
	
	it = CreateItemTemplate("Ballistic Vest", "vest", "GFX/items/vest.x", "GFX/items/INVvest.jpg", "", 0.02,"GFX/items/Vest.png")
	it.sound = 2
	it = CreateItemTemplate("Heavy Ballistic Vest", "finevest", "GFX/items/vest.x", "GFX/items/INVvest.jpg", "", 0.022,"GFX/items/Vest.png")
	it.sound = 2
	it = CreateItemTemplate("Bulky Ballistic Vest", "veryfinevest", "GFX/items/vest.x", "GFX/items/INVvest.jpg", "", 0.025,"GFX/items/Vest.png")
	it.sound = 2
	
	it = CreateItemTemplate("Hazmat Suit", "hazmatsuit", "GFX/items/hazmat.b3d", "GFX/items/INVhazmat.jpg", "", 0.013)
	it.sound = 2
	it = CreateItemTemplate("Hazmat Suit", "hazmatsuit2", "GFX/items/hazmat.b3d", "GFX/items/INVhazmat.jpg", "", 0.013)
	it.sound = 2
	it = CreateItemTemplate("Heavy Hazmat Suit", "hazmatsuit3", "GFX/items/hazmat.b3d", "GFX/items/INVhazmat.jpg", "", 0.013)
	it.sound = 2
	
	it = CreateItemTemplate("cup", "cup", "GFX/items/cup.x", "GFX/items/INVcup.jpg", "", 0.04)
	it.sound = 2
	
	it = CreateItemTemplate("Empty Cup", "emptycup", "GFX/items/cup.x", "GFX/items/INVcup.jpg", "", 0.04)
	it.sound = 2	
	
	it = CreateItemTemplate("SCP-500-01", "scp500", "GFX/items/pill.b3d", "GFX/items/INVpill.jpg", "", 0.0001)
	it.sound = 2
	EntityColor (it.obj,255,0,0)
	
	it = CreateItemTemplate("First Aid Kit", "firstaid", "GFX/items/firstaid.x", "GFX/items/INVfirstaid.jpg", "", 0.05)
	it = CreateItemTemplate("Small First Aid Kit", "finefirstaid", "GFX/items/firstaid.x", "GFX/items/INVfirstaid.jpg", "", 0.03)
	it = CreateItemTemplate("Blue First Aid Kit", "firstaid2", "GFX/items/firstaid.x", "GFX/items/INVfirstaid2.jpg", "", 0.03, "GFX/items/firstaidkit2.jpg")
	it = CreateItemTemplate("Strange Bottle", "veryfinefirstaid", "GFX/items/eyedrops.b3d", "GFX/items/INVbottle.jpg", "", 0.002, "GFX/items/bottle.jpg")	
	
	it = CreateItemTemplate("Gas Mask", "gasmask", "GFX/items/gasmask.b3d", "GFX/items/INVgasmask.jpg", "", 0.02)
	it.sound = 2
	it = CreateItemTemplate("Gas Mask", "supergasmask", "GFX/items/gasmask.b3d", "GFX/items/INVgasmask.jpg", "", 0.021)
	it.sound = 2
	it = CreateItemTemplate("Heavy Gas Mask", "gasmask3", "GFX/items/gasmask.b3d", "GFX/items/INVgasmask.jpg", "", 0.021)
	it.sound = 2
	
	it = CreateItemTemplate("Origami", "misc", "GFX/items/origami.b3d", "GFX/items/INVorigami.jpg", "", 0.003)
	it.sound = 0
	
	CreateItemTemplate("Electronical components", "misc", "GFX/items/electronics.x", "GFX/items/INVelectronics.jpg", "", 0.0011)
	
	it = CreateItemTemplate("Metal Panel", "scp148", "GFX/items/metalpanel.x", "GFX/items/INVmetalpanel.jpg", "", RoomScale)
	it.sound = 2
	it = CreateItemTemplate("SCP-148 Ingot", "scp148ingot", "GFX/items/scp148.x", "GFX/items/INVscp148.jpg", "", RoomScale)
	it.sound = 2
	
	CreateItemTemplate("S-NAV 300 Navigator", "nav", "GFX/items/navigator.x", "GFX/items/INVnavigator.jpg", "GFX/items/navigator.png", 0.0008)
	CreateItemTemplate("S-NAV Navigator", "nav", "GFX/items/navigator.x", "GFX/items/INVnavigator.jpg", "GFX/items/navigator.png", 0.0008)
	CreateItemTemplate("S-NAV Navigator Ultimate", "nav", "GFX/items/navigator.x", "GFX/items/INVnavigator.jpg", "GFX/items/navigator.png", 0.0008)
	CreateItemTemplate("S-NAV 310 Navigator", "nav", "GFX/items/navigator.x", "GFX/items/INVnavigator.jpg", "GFX/items/navigator.png", 0.0008)
	
	CreateItemTemplate("Radio Transceiver", "radio", "GFX/items/radio.x", "GFX/items/INVradio.jpg", "GFX/items/radioHUD.png", 1.0)//0.0010)
	CreateItemTemplate("Radio Transceiver", "fineradio", "GFX/items/radio.x", "GFX/items/INVradio.jpg", "GFX/items/radioHUD.png", 1.0)
	CreateItemTemplate("Radio Transceiver", "veryfineradio", "GFX/items/radio.x", "GFX/items/INVradio.jpg", "GFX/items/radioHUD.png", 1.0)
	CreateItemTemplate("Radio Transceiver", "18vradio", "GFX/items/radio.x", "GFX/items/INVradio.jpg", "GFX/items/radioHUD.png", 1.02)
	
	it = CreateItemTemplate("Cigarette", "cigarette", "GFX/items/420.x", "GFX/items/INV420.jpg", "", 0.0004)
	it.sound = 2
	
	it = CreateItemTemplate("Joint", "420s", "GFX/items/420.x", "GFX/items/INV420.jpg", "", 0.0004)
	it.sound = 2
	
	it = CreateItemTemplate("Smelly Joint", "420s", "GFX/items/420.x", "GFX/items/INV420.jpg", "", 0.0004)
	it.sound = 2
	
	it = CreateItemTemplate("Severed Hand", "hand", "GFX/items/severedhand.b3d", "GFX/items/INVhand.jpg", "", 0.04)
	it.sound = 2
	it = CreateItemTemplate("Black Severed Hand", "hand2", "GFX/items/severedhand.b3d", "GFX/items/INVhand2.jpg", "", 0.04, "GFX/items/shand2.png")
	it.sound = 2
	
	CreateItemTemplate("9V Battery", "bat", "GFX/items/Battery/Battery.x", "GFX/items/Battery/INVbattery9v.jpg", "", 0.008)
	CreateItemTemplate("18V Battery", "18vbat", "GFX/items/Battery/Battery.x", "GFX/items/Battery/INVbattery18v.jpg", "", 0.01, "GFX/items/Battery/Battery 18V.jpg")
	CreateItemTemplate("Strange Battery", "killbat", "GFX/items/Battery/Battery.x", "GFX/items/Battery/INVbattery22900.jpg", "", 0.01,"GFX/items/Battery/Strange Battery.jpg")
	
	CreateItemTemplate("Eyedrops", "fineeyedrops", "GFX/items/eyedrops.b3d", "GFX/items/INVeyedrops.jpg", "", 0.0012, "GFX/items/eyedrops.jpg")
	CreateItemTemplate("Eyedrops", "supereyedrops", "GFX/items/eyedrops.b3d", "GFX/items/INVeyedrops.jpg", "", 0.0012, "GFX/items/eyedrops.jpg")
	CreateItemTemplate("ReVision Eyedrops", "eyedrops","GFX/items/eyedrops.b3d", "GFX/items/INVeyedrops.jpg", "", 0.0012, "GFX/items/eyedrops.jpg")
	CreateItemTemplate("RedVision Eyedrops", "eyedrops", "GFX/items/eyedrops.b3d", "GFX/items/INVeyedropsred.jpg", "", 0.0012,"GFX/items/eyedropsred.jpg")
	
	it = CreateItemTemplate("SCP-714", "scp714", "GFX/items/scp714.b3d", "GFX/items/INV714.jpg", "", 0.3)
	it.sound = 3
	
	it = CreateItemTemplate("SCP-1025", "scp1025", "GFX/items/scp1025.b3d", "GFX/items/INV1025.jpg", "", 0.1)
	it.sound = 0
	
	it = CreateItemTemplate("SCP-513", "scp513", "GFX/items/513.x", "GFX/items/INV513.jpg", "", 0.1)
	it.sound = 2
	
	//BoH items
	
	it = CreateItemTemplate("Clipboard", "clipboard", "GFX/items/clipboard.b3d", "GFX/items/INVclipboard.jpg", "", 0.003, "", "GFX/items/INVclipboard2.jpg", 1)
	
	it = CreateItemTemplate("SCP-1123", "1123", "GFX/items/HGIB_Skull1.b3d", "GFX/items/inv1123.jpg", "", 0.015)
	it.sound = 2
		
	it = CreateItemTemplate("Night Vision Goggles", "supernv", "GFX/items/NVG.b3d", "GFX/items/INVsupernightvision.jpg", "", 0.02)
	it.sound = 2
	it = CreateItemTemplate("Night Vision Goggles", "nvgoggles", "GFX/items/NVG.b3d", "GFX/items/INVnightvision.jpg", "", 0.02)
	it.sound = 2
	it = CreateItemTemplate("Night Vision Goggles", "finenvgoggles", "GFX/items/NVG.b3d", "GFX/items/INVveryfinenightvision.jpg", "", 0.02)
	it.sound = 2
	
	it = CreateItemTemplate("Syringe", "syringe", "GFX/items/Syringe/syringe.b3d", "GFX/items/Syringe/inv.png", "", 0.005)
	it.sound = 2
	it = CreateItemTemplate("Syringe", "finesyringe", "GFX/items/Syringe/syringe.b3d", "GFX/items/Syringe/inv.png", "", 0.005)
	it.sound = 2
	it = CreateItemTemplate("Syringe", "veryfinesyringe", "GFX/items/Syringe/syringe.b3d", "GFX/items/Syringe/inv.png", "", 0.005)
	it.sound = 2
	
	//.........
	
	//new Items in SCP:CB 1.3 - ENDSHN
	it = CreateItemTemplate("SCP-1499","scp1499","GFX/items/SCP-1499.b3d","GFX/items/INVscp1499.jpg", "", 0.023)
	it.sound = 2
	it = CreateItemTemplate("SCP-1499","super1499","GFX/items/SCP-1499.b3d","GFX/items/INVscp1499.jpg", "", 0.023)
	it.sound = 2
	CreateItemTemplate("Emily Ross' Badge", "badge", "GFX/items/badge.x", "GFX/items/INVbadge.jpg", "GFX/items/badge1.jpg", 0.0001, "GFX/items/badge1_tex.jpg")
	it = CreateItemTemplate("Lost Key", "key", "GFX/items/key.b3d", "GFX/items/INV1162_1.jpg", "", 0.001, "GFX/items/key2.png","",0,1+2+8)
	it.sound = 3
	it = CreateItemTemplate("Disciplinary Hearing DH-S-4137-17092", "oldpaper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/dh.s", 0.003)
	it.sound = 0
	it = CreateItemTemplate("Coin", "coin", "GFX/items/key.b3d", "GFX/items/INVcoin.jpg", "", 0.0005, "GFX/items/coin.png","",0,1+2+8)
	it.sound = 3
	it = CreateItemTemplate("Movie Ticket", "ticket", "GFX/items/key.b3d", "GFX/items/INVticket.jpg", "GFX/items/ticket.png", 0.002, "GFX/items/tickettexture.png","",0,1+2+8)
	it.sound = 0
	CreateItemTemplate("Old Badge", "badge", "GFX/items/badge.x", "GFX/items/INVoldbadge.jpg", "GFX/items/badge2.png", 0.0001, "GFX/items/badge2_tex.png","",0,1+2+8)
	
	it = CreateItemTemplate("Quarter","25ct", "GFX/items/key.b3d", "GFX/items/INVcoin.jpg", "", 0.0005, "GFX/items/coin.png","",0,1+2+8)
	it.sound = 3
	it = CreateItemTemplate("Wallet","wallet", "GFX/items/wallet.b3d", "GFX/items/INVwallet.jpg", "", 0.0005,"","",1)
	it.sound = 2
	
	CreateItemTemplate("SCP-427","scp427","GFX/items/427.b3d","GFX/items/INVscp427.jpg", "", 0.001)
	it = CreateItemTemplate("Upgraded pill", "scp500death", "GFX/items/pill.b3d", "GFX/items/INVpill.jpg", "", 0.0001)
	it.sound = 2
	EntityColor(it.obj,255,0,0)
	it = CreateItemTemplate("Pill", "pill", "GFX/items/pill.b3d", "GFX/items/INVpillwhite.jpg", "", 0.0001)
	it.sound = 2
	EntityColor(it.obj,255,255,255)
	
	it = CreateItemTemplate("Sticky Note", "paper", "GFX/items/note.x", "GFX/items/INVnote2.jpg", "GFX/items/note682.jpg", 0.0025)
	it.sound = 0
	it = CreateItemTemplate("The Modular Site Project", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docMSP.jpg", 0.003)
	it.sound = 0
	
	it = CreateItemTemplate("Research Sector-02 Scheme", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/docmap.jpg", 0.003)
	it.sound = 0
	
	it = CreateItemTemplate("Document SCP-427", "paper", "GFX/items/paper.x", "GFX/items/INVpaper.jpg", "GFX/items/doc427.jpg", 0.003)
	it.sound = 0
	
	for (it of ItemTemplates.each) {
		if ((it.tex != 0)) {
			if ((it.texpath != "")) {
				for (it2 of ItemTemplates.each) {
					if ((it2 != it) && (it2.tex=it.tex)) {
						it2.tex = 0
					}
				}
			}
			FreeTexture( it.tex)
			it.tex = 0
		}
	}
}



Type Items
	Field name$
	Field collider%,model%
	Field itemtemplate.ItemTemplates
	Field DropSpeed#
	
	Field r%,g%,b%,a#
	
	Field level
	
	Field SoundChn%
	
	Field dist#, disttimer#
	
	Field state#, state2#
	
	Field Picked%,Dropped%
	
	Field invimg%
	Field WontColl% = False
	Field xspeed#,zspeed#
	Field SecondInv.Items[20]
	Field ID%
	Field invSlots%
End Type 

function CreateItem(name: string, tempname: string, x: float, y: float, z: float, r: int = 0,g: int = 0,b: int = 0,a: float = 1.0,invSlots: int = 0) : Items {
	CatchErrors("Uncaught (CreateItem)")
	
	let i: Items = new Items()
	let it: ItemTemplates
	
	name = Lower(name)
	tempname = Lower (tempname)
	
	for (it of ItemTemplates.each) {
		if (Lower(it.name) = name) {
			if (Lower(it.tempname) = tempname) {
				i.itemtemplate = it
				i.collider = CreatePivot()			
				EntityRadius (i.collider, 0.01)
				EntityPickMode (i.collider, 1, False)
				i.model = CopyEntity(it.obj,i.collider)
				i.name = it.name
				ShowEntity (i.collider)
				ShowEntity (i.model)
			}
		}
	} 
	
	i.WontColl = false
	
	if (i.itemtemplate == Null) {
		RuntimeError("Item template not found ("+name+", "+tempname+")")
	}
	
	ResetEntity(i.collider)
	PositionEntity(i.collider, x, y, z, true)
	RotateEntity (i.collider, 0, Rand(360), 0)
	i.dist = EntityDistance(Collider, i.collider)
	i.DropSpeed = 0.0
	
	if (tempname == "cup") {
		i.r=r
		i.g=g
		i.b=b
		i.a=a
		
		let liquid = CopyEntity(LiquidObj)
		ScaleEntity(liquid, i.itemtemplate.scale,i.itemtemplate.scale,i.itemtemplate.scale,true)
		PositionEntity(liquid, EntityX(i.collider,true),EntityY(i.collider,true),EntityZ(i.collider,true))
		EntityParent(liquid, i.model)
		EntityColor(liquid, r,g,b)
		
		if (a < 0) {
			EntityFX(liquid, 1)
			EntityAlpha(liquid, Abs(a))
		} else {
			EntityAlpha(liquid, Abs(a))
		}
		
		
		EntityShininess(liquid, 1.0)
	}
	
	i.invimg = i.itemtemplate.invimg
	if ((tempname="clipboard") && (invSlots=0)) {
		invSlots = 10
		SetAnimTime(i.model,17.0)
		i.invimg = i.itemtemplate.invimg2
	} else if ((tempname="wallet") && (invSlots=0)) {
		invSlots = 10
		SetAnimTime(i.model,0.0)
	}
	
	i.invSlots=invSlots
	
	i.ID=LastItemID+1
	LastItemID=i.ID
	
	CatchErrors("CreateItem")
	return i
}

function RemoveItem(i: Items) {
	CatchErrors("Uncaught (RemoveItem)")
	let n
	FreeEntity(i.model)
	FreeEntity(i.collider)
	i.collider = 0
	
	for (n of range(MaxItemAmount)) {
		if (Inventory(n) == i) {
			DebugLog("Removed "+i.itemtemplate.name+" from slot "+n)
			Inventory(n) = Null
			ItemAmount = ItemAmount-1
			break
		}
	}
	if (SelectedItem == i) {
		switch (SelectedItem.itemtemplate.tempname) {
			case "nvgoggles", "supernv":
				WearingNightVision = False
			case "gasmask", "supergasmask", "gasmask2", "gasmask3":
				WearingGasMask = False
			case "vest", "finevest", "veryfinevest":
				WearingVest = False
			case "hazmatsuit","hazmatsuit2","hazmatsuit3":
				WearingHazmat = False	
			case "scp714":
				Wearing714 = False
			case "scp1499","super1499":
				Wearing1499 = False
			case "scp427":
				I_427.Using = False
		}
		
		SelectedItem = Null
	}
	if (i.itemtemplate.img != 0) {
		FreeImage(i.itemtemplate.img)
		i.itemtemplate.img = 0
	}
	Delete(i)
	
	CatchErrors("RemoveItem")
}


function UpdateItems() {
	CatchErrors("Uncaught (UpdateItems)")
	let n
	let i: Items
	let i2: Items
	let xtemp: float
	let ytemp: float
	let ztemp: float
	let temp: int
	let np: NPCs
	let pick: int
	
	let HideDist = HideDistance*0.5
	let deletedItem: boolean = False
	
	ClosestItem = Null
	For i.Items = Each Items
		i.Dropped = 0
		
		If (Not i.Picked) Then
			If i.disttimer < MilliSecs2() Then
				i.dist = EntityDistance(Camera, i.collider)
				i.disttimer = MilliSecs2() + 700
				If i.dist < HideDist Then ShowEntity i.collider
			EndIf
			
			If i.dist < HideDist Then
				ShowEntity i.collider
				
				If i.dist < 1.2 Then
					If ClosestItem = Null Then
						If EntityInView(i.model, Camera) Then
							If EntityVisible(i.collider,Camera) Then
								ClosestItem = i
							EndIf
						EndIf
					ElseIf ClosestItem = i Or i.dist < EntityDistance(Camera, ClosestItem.collider) Then 
						If EntityInView(i.model, Camera) Then
							If EntityVisible(i.collider,Camera) Then
								ClosestItem = i
							EndIf
						EndIf
					EndIf
				EndIf
				
				If EntityCollided(i.collider, HIT_MAP) Then
					i.DropSpeed = 0
					i.xspeed = 0.0
					i.zspeed = 0.0
				Else
					If ShouldEntitiesFall
						pick = LinePick(EntityX(i.collider),EntityY(i.collider),EntityZ(i.collider),0,-10,0)
						If pick
							i.DropSpeed = i.DropSpeed - 0.0004 * FPSfactor
							TranslateEntity i.collider, i.xspeed*FPSfactor, i.DropSpeed * FPSfactor, i.zspeed*FPSfactor
							If i.WontColl Then ResetEntity(i.collider)
						Else
							i.DropSpeed = 0
							i.xspeed = 0.0
							i.zspeed = 0.0
						EndIf
					Else
						i.DropSpeed = 0
						i.xspeed = 0.0
						i.zspeed = 0.0
					EndIf
				EndIf
				
				If i\dist<HideDist*0.2 Then
					For i2.Items = Each Items
						If i!=i2 And (Not i2\Picked) And i2\dist<HideDist*0.2 Then
							
							xtemp# = (EntityX(i2\collider,True)-EntityX(i\collider,True))
							ytemp# = (EntityY(i2\collider,True)-EntityY(i\collider,True))
							ztemp# = (EntityZ(i2\collider,True)-EntityZ(i\collider,True))
							
							ed# = (xtemp*xtemp+ztemp*ztemp)
							If ed<0.07 And Abs(ytemp)<0.25 Then
								//items are too close together, push away
								If PlayerRoom\RoomTemplate\Name	!= "room2storage" Then
									xtemp = xtemp*(0.07-ed)
									ztemp = ztemp*(0.07-ed)
									
									While Abs(xtemp)+Abs(ztemp)<0.001
										xtemp = xtemp+Rnd(-0.002,0.002)
										ztemp = ztemp+Rnd(-0.002,0.002)
									Wend
									
									TranslateEntity i2\collider,xtemp,0,ztemp
									TranslateEntity i\collider,-xtemp,0,-ztemp
								EndIf
							EndIf
						EndIf
					Next
				EndIf
				
				If EntityY(i\collider) < - 35.0 Then DebugLog "remove: " + i\itemtemplate\name:RemoveItem(i):deletedItem=True
			Else
				HideEntity i\collider
			EndIf
		Else
			i\DropSpeed = 0
			i\xspeed = 0.0
			i\zspeed = 0.0
		EndIf
		
		If Not deletedItem Then
			CatchErrors(Chr(34)+i\itemtemplate\name+Chr(34)+" item")
		EndIf
		deletedItem = False
	Next
	
	If ClosestItem != Null Then
		//DrawHandIcon = True
		
		If MouseHit1 Then PickItem(ClosestItem)
	EndIf
	
End Function

Function PickItem(item.Items)
	Local n% = 0
	Local canpickitem = True
	Local fullINV% = True
	
	For n% = 0 To MaxItemAmount - 1
		If Inventory(n)=Null
			fullINV = False
			Exit
		EndIf
	Next
	
	If WearingHazmat > 0 Then
		Msg = "You cannot pick up any items while wearing a hazmat suit."
		MsgTimer = 70*5
		Return
	EndIf
	
	CatchErrors("Uncaught (PickItem)")
	if (!fullINV) {
		for (n of range(MaxItemAmount)) {
			if (Inventory(n) == Null) {
				switch (item.itemtemplate.tempname) {
					case "1123":
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
							}
							for (e of Events.each) {
								if (e.eventname = "room1123") { 
									if (e.eventstate = 0) {
										ShowEntity (Light)
										LightFlash = 3
										PlaySound_Strict(LoadTempSound("SFX/SCP/1123/Touch.ogg"))
									}
									e.eventstate = Max(1, e.eventstate)
									
									Exit()
								}
							}
						}
						
						return
					case "killbat":
						ShowEntity (Light)
						LightFlash = 1.0
						PlaySound_Strict(IntroSFX(11))
						DeathMSG = "Subject D-9341 found dead inside SCP-914's output booth next to what appears to be an ordinary nine-volt battery. The subject is covered in severe "
						DeathMSG = DeathMSG + "electrical burns, and assumed to be killed via an electrical shock caused by the battery. The battery has been stored for further study."
						Kill()
					case "scp148":
						GiveAchievement(Achv148)	
					case "scp513":
						GiveAchievement(Achv513)
					case "scp860":
						GiveAchievement(Achv860)
					case "key6":
						GiveAchievement(AchvOmni)
					case "veryfinevest":
						Msg = "The vest is too heavy to pick up."
						MsgTimer = 70*6
						Exit()
					case "firstaid", "finefirstaid", "veryfinefirstaid", "firstaid2":
						item.state = 0
					case "navigator", "nav":
						if (item.itemtemplate.name = "S-NAV Navigator Ultimate") {GiveAchievement(AchvSNAV)}
					case "hazmatsuit", "hazmatsuit2", "hazmatsuit3":
						canpickitem = True
						for (z of range(MaxItemAmount)) {
							if (Inventory(z) != Null) {
								if (Inventory(z).itemtemplate.tempname == "hazmatsuit" || Inventory(z).itemtemplate.tempname == "hazmatsuit2" || Inventory(z).itemtemplate.tempname == "hazmatsuit3") {
									canpickitem = False
									Exit()
								} else if (Inventory(z).itemtemplate.tempname == "vest" || Inventory(z).itemtemplate.tempname == "finevest") {
									canpickitem = 2
									Exit()
								}
							}
						}
						
						if (!canpickitem) {
							Msg = "You are not able to wear two hazmat suits at the same time."
							MsgTimer = 70 * 5
							Return
						} else if (canpickitem == 2) {
							Msg = "You are not able to wear a vest and a hazmat suit at the same time."
							MsgTimer = 70 * 5
							Return
						} else {
							SelectedItem = item
						}
					case "vest","finevest":
						canpickitem = True
						for (z of range(MaxItemAmount)) {
							if (Inventory(z) != Null) {
								if (Inventory(z).itemtemplate.tempname == "vest" || Inventory(z).itemtemplate.tempname == "finevest") {
									canpickitem = False
									break
								} else if (Inventory(z).itemtemplate.tempname == "hazmatsuit" || Inventory(z).itemtemplate.tempname == "hazmatsuit2" || Inventory(z).itemtemplate.tempname == "hazmatsuit3") {
									canpickitem = 2
									break
								}
							}
						}
						
						if (!canpickitem) {
							Msg = "You are not able to wear two vests at the same time."
							MsgTimer = 70 * 5
							Return
						} else if (canpickitem == 2) {
							Msg = "You are not able to wear a vest and a hazmat suit at the same time."
							MsgTimer = 70 * 5
							Return
						} else {
							SelectedItem = item
						}
				}
				
				if (item.itemtemplate.sound != 66) {PlaySound_Strict(PickSFX(item.itemtemplate.sound))}
				item.Picked = True
				item.Dropped = -1
				
				item.itemtemplate.found=True
				ItemAmount = ItemAmount + 1
				
				Inventory(n) = item
				HideEntity(item.collider)
				break
			}
		}
	} else {
		Msg = "You cannot carry any more items."
		MsgTimer = 70 * 5
	}
	CatchErrors("PickItem")
}

function DropItem(item: Items,playdropsound: boolean = True) {
	if (WearingHazmat > 0) {
		Msg = "You cannot drop any items while wearing a hazmat suit."
		MsgTimer = 70*5
		return
	}
	
	CatchErrors("Uncaught (DropItem)")
	if (playdropsound) {
		if (item.itemtemplate.sound != 66) {
			PlaySound_Strict(PickSFX(item.itemtemplate.sound))
		}
	}
	
	item.Dropped = 1
	
	ShowEntity(item.collider)
	PositionEntity(item.collider, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
	RotateEntity(item.collider, EntityPitch(Camera), EntityYaw(Camera)+Rnd(-20,20), 0)
	MoveEntity(item.collider, 0, -0.1, 0.1)
	RotateEntity(item.collider, 0, EntityYaw(Camera)+Rnd(-110,110), 0)
	
	ResetEntity (item.collider)
	
	item.Picked = False
	for (z of range(MaxItemAmount)) {
		if (Inventory(z) == item) {
			Inventory(z) = Null
		}
	}
	switch (item.itemtemplate.tempname) {
		case "gasmask", "supergasmask", "gasmask3":
			WearingGasMask = False
		case "hazmatsuit",  "hazmatsuit2", "hazmatsuit3":
			WearingHazmat = False
		case "vest", "finevest":
			WearingVest = False
		case "nvgoggles":
			if (WearingNightVision = 1) {
				CameraFogFar = StoredCameraFogFar
				WearingNightVision = False
			}
		case "supernv":
			if (WearingNightVision = 2) {
				CameraFogFar = StoredCameraFogFar
				WearingNightVision = False
			}
		case "finenvgoggles":
			if (WearingNightVision = 3) {
				CameraFogFar = StoredCameraFogFar
				WearingNightVision = False
			}
		case "scp714":
			Wearing714 = False
		case "scp1499","super1499":
			Wearing1499 = False
		case "scp427":
			I_427.Using = False
	}
	
	CatchErrors("DropItem")	
}

//Update any ailments inflicted by SCP-294 drinks.
function Update294() {
	CatchErrors("Uncaught (Update294)")
	
	if (CameraShakeTimer > 0) {
		CameraShakeTimer = CameraShakeTimer - (FPSfactor/70)
		CameraShake = 2
	}
	
	If VomitTimer > 0 Then
		DebugLog VomitTimer
		VomitTimer = VomitTimer - (FPSfactor/70)
		
		If (MilliSecs2() Mod 1600) < Rand(200, 400) Then
			If BlurTimer = 0 Then BlurTimer = Rnd(10, 20)*70
			CameraShake = Rnd(0, 2)
		EndIf
				
		if (Rand(50) == 50 && (MilliSecs2() % 4000) < 200) {PlaySound_Strict(CoughSFX(Rand(0,2)))}
		
		//Regurgitate when timer is below 10 seconds. (ew)
		if (VomitTimer < 10 && Rnd(0, 500 * VomitTimer) < 2) {
			if ((!ChannelPlaying(VomitCHN)) && (!Regurgitate)) {
				VomitCHN = PlaySound_Strict(LoadTempSound("SFX/SCP/294/Retch" + Rand(1, 2) + ".ogg"))
				Regurgitate = MilliSecs2() + 50
			}
		}
		
		If Regurgitate > MilliSecs2() And Regurgitate != 0 Then
			mouse_y_speed_1 = mouse_y_speed_1 + 1.0
		Else
			Regurgitate = 0
		EndIf
		
	ElseIf VomitTimer < 0 Then //vomit
		VomitTimer = VomitTimer - (FPSfactor/70)
		
		if (VomitTimer > -5) {
			if ((MilliSecs2() % 400) < 50) {CameraShake = 4}
			mouse_x_speed_1 = 0.0
			Playable = False
		} else {
			Playable = True
		}
		
		if (!Vomit) {
			BlurTimer = 40 * 70
			VomitSFX = LoadSound_Strict("SFX/SCP/294/Vomit.ogg")
			VomitCHN = PlaySound_Strict(VomitSFX)
			PrevInjuries = Injuries
			PrevBloodloss = Bloodloss
			Injuries = 1.5
			Bloodloss = 70
			EyeIrritation = 9 * 70
			
			pvt = CreatePivot()
			PositionEntity(pvt, EntityX(Camera), EntityY(Collider) - 0.05, EntityZ(Camera))
			TurnEntity(pvt, 90, 0, 0)
			EntityPick(pvt, 0.3)
			de.decals = CreateDecal(5, PickedX(), PickedY() + 0.005, PickedZ(), 90, 180, 0)
			de.Size = 0.001
			de.SizeChange = 0.001
			de.MaxSize = 0.6
			EntityAlpha(de.obj, 1.0)
			EntityColor(de.obj, 0.0, Rnd(200, 255), 0.0)
			ScaleSprite (de.obj, de.size, de.size)
			FreeEntity (pvt)
			Vomit = True
		}
		
		UpdateDecals()
		
		mouse_y_speed_1 = mouse_y_speed_1 + Max((1.0 + VomitTimer / 10), 0.0)
		
		if (VomitTimer < -15) {
			FreeSound_Strict(VomitSFX)
			VomitTimer = 0
			if (KillTimer >= 0) {
				PlaySound_Strict(BreathSFX(0,0))
			}
			Injuries = PrevInjuries
			Bloodloss = PrevBloodloss
			Vomit = False
		}
	}
	
	CatchErrors("Update294")
}