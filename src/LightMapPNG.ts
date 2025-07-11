Graphics3D (640,480,0,2)

AppTitle ("Optimize lightmaps (convert bmp to png)")

export const FIF_UNKNOWN = -1
export const FIF_BMP = 0
export const FIF_ICO = 1
export const FIF_JPEG = 2
export const FIF_JNG = 3
export const FIF_KOALA = 4
export const FIF_LBM = 5
export const FIF_IFF = FIF_LBM
export const FIF_MNG = 6
export const FIF_PBM = 7
export const FIF_PBMRAW = 8
export const FIF_PCD = 9
export const FIF_PCX = 10
export const FIF_PGM = 11
export const FIF_PGMRAW = 12
export const FIF_PNG = 13
export const FIF_PPM = 14
export const FIF_PPMRAW = 15
export const FIF_RAS = 16
export const FIF_TARGA = 17
export const FIF_TIFF = 18
export const FIF_WBMP = 19
export const FIF_PSD = 20
export const FIF_CUT = 21
export const FIF_XBM = 22
export const FIF_XPM = 23
export const FIF_DDS = 24
export const FIF_GIF = 25
export const FIF_HDR = 26
export const FIF_FAXG3	= 27
export const FIF_SGI = 28
export const FIF_EXR = 29
export const FIF_J2K = 30
export const FIF_JP2 = 31
export const FIF_PFM = 32
export const FIF_PICT = 33
export const FIF_RAW = 34

//INI-funktiot:
function GetINIString(file: string, section: string, parameter: string) : string {
	let TemporaryString: string = ""
	let f = ReadFile(file)
	
	while (!Eof(f)) {
		If ReadLine(f) = "["+section+"]" Then
			Repeat 
				TemporaryString = ReadLine(f)
				If Trim( Left(TemporaryString, Max(Instr(TemporaryString,"=")-1,0)) ) = parameter Then
					CloseFile f
					return Trim( Right(TemporaryString,Len(TemporaryString)-Instr(TemporaryString,"=")) )
				EndIf
			Until Left(TemporaryString,1) = "[" Or Eof(f)
			CloseFile f
			Return ""
		EndIf
	Wend
	
	CloseFile f
}

Function GetINIInt%(file$, section$, parameter$)
	Local strtemp$ = Lower(GetINIString(file$, section$, parameter$))
	
	Select strtemp
		Case "true"
			Return 1
		Case "false"
			Return 0
		Default
			Return Int(strtemp)
	End Select
	Return 
}

Function GetINIFloat#(file$, section$, parameter$)
	Return GetINIString(file$, section$, parameter$)
}

Function PutINIValue%(INI_sAppName$, INI_sSection$, INI_sKey$, INI_sValue$)
	
// Returns: True (Success) or False (Failed)
	
	INI_sSection = "[" + Trim$(INI_sSection) + "]"
	INI_sUpperSection$ = Upper$(INI_sSection)
	INI_sKey = Trim$(INI_sKey)
	INI_sValue = Trim$(INI_sValue)
	INI_sFilename$ = CurrentDir$() + "\"  + INI_sAppName
	
// Retrieve the INI data (if it exists)
	
	INI_sContents$= INI_FileToString(INI_sFilename)
	
// (Re)Create the INI file updating/adding the SECTION, KEY and VALUE
	
	INI_bWrittenKey% = False
	INI_bSectionFound% = False
	INI_sCurrentSection$ = ""
	
	INI_lFileHandle = WriteFile(INI_sFilename)
	If INI_lFileHandle = 0 Then Return False // Create file failed!
	
	INI_lOldPos% = 1
	INI_lPos% = Instr(INI_sContents, Chr$(0))
	
	While (INI_lPos <> 0)
		
		INI_sTemp$ =Trim$(Mid$(INI_sContents, INI_lOldPos, (INI_lPos - INI_lOldPos)))
		
		If (INI_sTemp <> "") Then
			
			If Left$(INI_sTemp, 1) = "[" And Right$(INI_sTemp, 1) = "]" Then
				
				// Process SECTION
				
				If (INI_sCurrentSection = INI_sUpperSection) And (INI_bWrittenKey = False) Then
					INI_bWrittenKey = INI_CreateKey(INI_lFileHandle, INI_sKey, INI_sValue)
				End If
				INI_sCurrentSection = Upper$(INI_CreateSection(INI_lFileHandle, INI_sTemp))
				If (INI_sCurrentSection = INI_sUpperSection) Then INI_bSectionFound = True
				
			Else
				
				// KEY=VALUE
				
				lEqualsPos% = Instr(INI_sTemp, "=")
				If (lEqualsPos <> 0) Then
					If (INI_sCurrentSection = INI_sUpperSection) And (Upper$(Trim$(Left$(INI_sTemp, (lEqualsPos - 1)))) = Upper$(INI_sKey)) Then
						If (INI_sValue <> "") Then INI_CreateKey INI_lFileHandle, INI_sKey, INI_sValue
						INI_bWrittenKey = True
					Else
						WriteLine INI_lFileHandle, INI_sTemp
					End If
				End If
				
			End If
			
		End If
		
		// Move through the INI file...
		
		INI_lOldPos = INI_lPos + 1
		INI_lPos% = Instr(INI_sContents, Chr$(0), INI_lOldPos)
		
	Wend
	
	// KEY wasn't found in the INI file - Append a new SECTION if required and create our KEY=VALUE line
	
	If (INI_bWrittenKey = False) Then
		If (INI_bSectionFound = False) Then INI_CreateSection INI_lFileHandle, INI_sSection
		INI_CreateKey INI_lFileHandle, INI_sKey, INI_sValue
	End If
	
	CloseFile INI_lFileHandle
	
	Return True // Success
	
}


Function INI_FileToString$(INI_sFilename$)
	
	INI_sString$ = ""
	INI_lFileHandle% = ReadFile(INI_sFilename)
	If INI_lFileHandle <> 0 Then
		While Not(Eof(INI_lFileHandle))
			INI_sString = INI_sString + ReadLine$(INI_lFileHandle) + Chr$(0)
		Wend
		CloseFile INI_lFileHandle
	End If
	Return INI_sString
	
}

Function INI_CreateSection$(INI_lFileHandle%, INI_sNewSection$)
	
	If FilePos(INI_lFileHandle) <> 0 Then WriteLine INI_lFileHandle, "" // Blank line between sections
	WriteLine INI_lFileHandle, INI_sNewSection
	Return INI_sNewSection
	
}

Function INI_CreateKey%(INI_lFileHandle%, INI_sKey$, INI_sValue$)
	
	WriteLine INI_lFileHandle, INI_sKey + "=" + INI_sValue
	Return True
	
}

// matemaattiset funktiot:
Function Min#(a#,b#)
	If a < b Then Return a Else Return b
}

Function Max#(a#,b#)
	If a > b Then Return a Else Return b
}

Function StripPath$(file$) 
	
	If Len(file$)>0 
		
		For i=Len(file$) To 1 Step -1 
			
			mi$=Mid$(file$,i,1) 
			If mi$="\" Or mi$="/" Then Return name$ Else name$=mi$+name$ 
			
		Next 
		
	EndIf 
	
	Return name$ 
	
} 

Function StripFilename$(file$)
	//Local name$=""
	Local mi$=""
	Local lastSlash%=0
	If Len(file)>0
		For i%=1 To Len(file)
			mi=Mid(file$,i,1)
			If mi="\" Or mi="/" Then
				lastSlash=i
			EndIf
		Next
	EndIf
	
	Return Left(file,lastSlash)
}

Function EntityScaleX#(entity, globl=False) 
	If globl Then TFormVector 1,0,0,entity,0 Else TFormVector 1,0,0,entity,GetParent(entity) 
	Return Sqr(TFormedX()*TFormedX()+TFormedY()*TFormedY()+TFormedZ()*TFormedZ()) 
} 

Function EntityScaleY#(entity, globl=False)
	If globl Then TFormVector 0,1,0,entity,0 Else TFormVector 0,1,0,entity,GetParent(entity)  
	Return Sqr(TFormedX()*TFormedX()+TFormedY()*TFormedY()+TFormedZ()*TFormedZ()) 
} 

Function EntityScaleZ#(entity, globl=False)
	If globl Then TFormVector 0,0,1,entity,0 Else TFormVector 0,0,1,entity,GetParent(entity)  
	Return Sqr(TFormedX()*TFormedX()+TFormedY()*TFormedY()+TFormedZ()*TFormedZ()) 
}

Function Piece$(s$,entry,char$=" ")
	While Instr(s,char+char)
		s=Replace(s,char+char,char)
	Wend
	For n=1 To entry-1
		p=Instr(s,char)
		s=Right(s,Len(s)-p)
	Next
	p=Instr(s,char)
	If p<1
		a$=s
	Else
		a=Left(s,p-1)
	EndIf
	Return a
}

Function KeyValue$(entity,key$,defaultvalue$="")
	properties$=EntityName(entity)
	properties$=Replace(properties$,Chr(13),"")
	key$=Lower(key)
	Repeat
		p=Instr(properties,Chr(10))
		If p Then test$=(Left(properties,p-1)) Else test=properties
		testkey$=Piece(test,1,"=")
		testkey=Trim(testkey)
		testkey=Replace(testkey,Chr(34),"")
		testkey=Lower(testkey)
		If testkey=key Then
			value$=Piece(test,2,"=")
			value$=Trim(value$)
			value$=Replace(value$,Chr(34),"")
			Return value
		EndIf
		If Not p Then Return defaultvalue$
		properties=Right(properties,Len(properties)-p)
	Forever 
}

Type Converted
	Field name$
End Type

Function LoadRMesh(file$)
	
	//generate a texture made of white	
	//read the file
	Local f%=ReadFile(file)
	Local fw%=WriteFile(Replace(file,".rmesh","_opt.rmesh"))
	Local i%,j%,k%,x#,y#,z#,yaw#
	Local vertex%
	Local temp1i%,temp2i%,temp3i%
	Local temp1#,temp2#,temp3#
	Local temp1s$,temp2s$
	
	temp2s=ReadString(f)
	WriteString fw,temp2s
	
	file=StripFilename(file)
	
	If FileType(file+"bmp_lm")<>2 Then CreateDir(file+"bmp_lm")
	
	Local count%,count2%
	//drawn meshes
	
	count = ReadInt(f)
	WriteInt fw,count
	
	Local u#,v#
	
	For i=1 To count //drawn mesh
		For j=0 To 1
			temp1i=ReadByte(f)
			WriteByte fw,temp1i
			If temp1i<>0 Then
				temp1s=ReadString(f)
				If Instr(temp1s,".bmp")<>0 Then
					done%=0
					For r.Converted = Each Converted
						If r\name=temp1s Then done=1 : Exit
					Next
					If Not done Then
						r.Converted = New Converted
						r\name=temp1s
						loadTex%=FI_Load(FIF_BMP,file+temp1s,0)
						DebugLog temp1s
					EndIf
					CopyFile(file+temp1s,file+"bmp_lm\"+temp1s)
					DeleteFile file+temp1s
					temp1s=Replace(temp1s,".bmp",".png")
					If Not done Then
						FI_Save(FIF_PNG,loadTex,file+temp1s,0)
						FI_Unload(loadTex)
					EndIf
				EndIf
				WriteString fw,temp1s
			EndIf
		Next
		
		count2=ReadInt(f) //vertices
		WriteInt fw,count2
		
		For j%=1 To count2
			//world coords
			x=ReadFloat(f) : y=ReadFloat(f) : z=ReadFloat(f)
			WriteFloat fw,x
			WriteFloat fw,y
			WriteFloat fw,z
			//vertex=AddVertex(surf,x,y,z)
			
			//texture coords
			For k%=0 To 1
				u=ReadFloat(f) : v=ReadFloat(f)
				WriteFloat fw,u
				WriteFloat fw,v
				//VertexTexCoords surf,vertex,u,v,0.0,k
			Next
			
			//colors
			temp1i=ReadByte(f)
			temp2i=ReadByte(f)
			temp3i=ReadByte(f)
			WriteByte fw,temp1i
			WriteByte fw,temp2i
			WriteByte fw,temp3i
		Next
		
		count2=ReadInt(f) //polys
		WriteInt fw,count2
		For j%=1 To count2
			temp1i = ReadInt(f)
			temp2i = ReadInt(f)
			temp3i = ReadInt(f)
			WriteInt (fw,temp1i)
			WriteInt (fw,temp2i)
			WriteInt (fw,temp3i)
		Next
		
	Next
	
	While (Not Eof(f))
		temp1i=ReadByte(f)
		WriteByte fw,temp1i
	Wend
	
				}


Global state%=0

SetBuffer BackBuffer()
ClsColor (0,0,0)
Cls
Color (255,255,255)
Text(5,5,"Press a key:")
Text(5,25,"1 - Convert BMPs to PNGs, and modify rmeshes to use them")
Text(5,45,"2 - Convert BMPs to PNGs for a specific room and modify it to use them")
Text(5,65,"3 - Revert options.ini to use the old rmeshes")
Text(5,85,"ESC - Close without doing anything")
Flip()

while (!KeyHit(1)) {
	if (KeyHit(2) || KeyHit(79)) {
		state=1
		Exit()
	}
	if (KeyHit(3) || KeyHit(80)) {
		state=2
		Exit()
	}
}

let Stri: string
let TemporaryString: string
let f: int

Type INIConvert
	Field file$
	Field section$
	Field key$
	Field value$
End Type

Local ic.INIConvert

If state=1 Then
	If FileSize("NineTailedFoxMod/Data/rooms_opt.ini")=0 Then
		CopyFile "NineTailedFoxMod/Data/rooms.ini","NineTailedFoxMod/Data/rooms_bmp.ini"
	EndIf
	
	f%=ReadFile("NineTailedFoxMod/Data/rooms.ini")
	
	While Not Eof(f)
		TemporaryString = Trim(ReadLine(f))
		If Left(TemporaryString,1) = "[" Then
			TemporaryString = Mid(TemporaryString, 2, Len(TemporaryString) - 2)
			
			If TemporaryString <> "room ambience" Then
				Stri=GetINIString("NineTailedFoxMod\Data\rooms.ini",TemporaryString,"mesh path")
				
				LoadRMesh(Stri)
								
				Cls
				Text 5,5,"Converted "+Chr(34)+Stri+Chr(34)
				Flip
				
				ic.INIConvert=New INIConvert
				ic.file="NineTailedFoxMod/Data/rooms.ini"
				ic.section=TemporaryString
				ic.key="mesh path"
				ic.value=Replace(Stri,".rmesh",".rmesh")
				
			}
		}
	Wend
	
	For ic.INIConvert=Each INIConvert
		PutINIValue(ic\file,ic\section,ic\key,ic\value)
	Next
	
	Cls
	Text 5,5,"Conversion complete"
	Flip
	Delay 1000
	
	CloseFile f
ElseIf state=2
	
	Cls
	Flip
	FlushKeys()
	Stri=Input("Path for the room to be converted: ")
	LoadRMesh(Stri)
	Cls
	Text 5,5,"Conversion of "+Stri+" complete"
	Flip
	Delay 1000
	
ElseIf state=3
	f%=ReadFile("NineTailedFoxMod\Data\rooms.ini")
	
	While Not Eof(f)
		TemporaryString = Trim(ReadLine(f))
		If Left(TemporaryString,1) = "[" Then
			TemporaryString = Mid(TemporaryString, 2, Len(TemporaryString) - 2)
			
			If TemporaryString <> "room ambience" Then
				Stri=GetINIString("NineTailedFoxMod/Data/rooms.ini",TemporaryString,"mesh path")
				
				ic.INIConvert=New INIConvert
				ic\file="NineTailedFoxMod/Data/rooms.ini"
				ic\section=TemporaryString
				ic\key="mesh path"
				ic\value=Replace(Stri,"_opt.rmesh",".rmesh")
				
			EndIf
		EndIf
	Wend
	
	For ic.INIConvert=Each INIConvert
		PutINIValue(ic\file,ic\section,ic\key,ic\value)
	Next
	
	Cls
	Text 5,5,"Reset complete, you need to restore the bmp lightmaps manually"
	Flip
	Delay 1000
	
	CloseFile(f)
EndIf