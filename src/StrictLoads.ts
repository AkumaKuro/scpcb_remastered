import {range, ChannelPlaying, Chr, FreeSound, FileType, int, RuntimeError} from "./Helper/bbhelper.ts"
import { LoadSound } from "./Helper/sounds.ts"

function LoadImage_Strict(file: string) {
	if (FileType(file) != FileTypeResult.EXISTS) {
		RuntimeError ("Image " + Chr(34) + file + Chr(34) + " missing. ")
	}

	let tmp = LoadImage(file)
	return tmp
}


class Sound {
	static each: Sound[]
	internalHandle: int
	name: string
	channels: int[] = new Array(32)
	releaseTime: int
}

export function AutoReleaseSounds() {
	let snd: Sound
	for (snd of Sound.each) {
		let tryRelease: boolean = true
		for (let i of range(32)) {
			if (snd.channels[i] != 0) {
				if (ChannelPlaying(snd.channels[i])) {
					tryRelease = false
					snd.releaseTime = MilliSecs2()+5000
					break
				}
			}
		}
		if (tryRelease) {
			if (snd.releaseTime < MilliSecs2()) {
				if (snd.internalHandle != 0) {
					FreeSound (snd.internalHandle)
					snd.internalHandle = 0
				}
			}
		}
	}
}

function PlaySound_Strict(sndHandle: int) : int {
	let snd: Sound = Sound.each[sndHandle] // Object
	if (snd != null) {
		let shouldPlay: boolean = true
		for (let i of range(32)) {
			if (snd.channels[i] != 0) {
				if (!ChannelPlaying(snd.channels[i])) {
					if (snd.internalHandle = 0) {
						if (FileType(snd.name) != 1) {
							CreateConsoleMsg("Sound " + Chr(34) + snd.name + Chr(34) + " not found.")
							if (ConsoleOpening) {
								ConsoleOpen = true
							}
						} else {
							if (EnableSFXRelease) {
								snd.internalHandle = LoadSound(snd.name)
							}
						}
						if (snd.internalHandle == 0) {
							CreateConsoleMsg("Failed to load Sound: " + Chr(34) + snd.name + Chr(34))
							if ConsoleOpening {
								ConsoleOpen = true
							}
						}
					}
					if (ConsoleFlush) {
						snd.channels[i] = PlaySound(ConsoleFlushSnd)
					} else {
						snd.channels[i] = PlaySound(snd.internalHandle)
					}
					ChannelVolume (snd.channels[i],SFXVolume)
					snd.releaseTime = MilliSecs2()+5000 //release after 5 seconds
					return snd.channels[i]
				}
			} else {
				if (snd.internalHandle == 0) {
					if (FileType(snd.name) != 1) {
						CreateConsoleMsg("Sound " + Chr(34) + snd.name + Chr(34) + " not found.")
						if (ConsoleOpening) {
							ConsoleOpen = True
						}
					} else {
						if (EnableSFXRelease) {
							snd.internalHandle = LoadSound(snd.name)
						}
					}
						
					if (snd.internalHandle == 0) {
						CreateConsoleMsg("Failed to load Sound: " + Chr(34) + snd.name + Chr(34))
						if (ConsoleOpening) {
							ConsoleOpen = True
						}
					}
				}
				if (ConsoleFlushSnd) {
					snd.channels[i] = PlaySound(ConsoleFlushSnd)
				} else {
					snd.channels[i] = PlaySound(snd.internalHandle)
				}
				ChannelVolume(snd.channels[i],SFXVolume)
				snd.releaseTime = MilliSecs2()+5000 //release after 5 seconds
				return snd.channels[i]
			}
		}
	}
	return 0
}

export function LoadSound_Strict(file: string) {
	let snd: Sound = new Sound()
	snd.name = file
	snd.internalHandle = 0
	snd.releaseTime = 0
	if (!EnableSFXRelease) {
		if (snd.internalHandle = 0) { 
			snd.internalHandle = LoadSound(snd.name)
		}
	}
	
	return Handle(snd)
}

function FreeSound_Strict(sndHandle: int) {
	let snd: Sound = Object.Sound(sndHandle)
	if (snd) {
		if (snd.internalHandle != 0) {
			FreeSound(snd.internalHandle)
			snd.internalHandle = 0
		}
		Delete(snd)
	}
}

class Stream {
	sfx: int
	chn: int
}

function StreamSound_Strict(file$,volume#=1.0,custommode=Mode) {
	If FileType(file$)!=1
		CreateConsoleMsg("Sound " + Chr(34) + file$ + Chr(34) + " not found.")
		If ConsoleOpening
			ConsoleOpen = True
}
		Return 0
}
	
	Local st.Stream = New Stream
	st\sfx = FSOUND_Stream_Open(file$,custommode,0)
	
	If st\sfx = 0
		CreateConsoleMsg("Failed to stream Sound (returned 0): " + Chr(34) + file$ + Chr(34))
		If ConsoleOpening
			ConsoleOpen = True
}
		Return 0
}
	
	st\chn = FSOUND_Stream_Play(FreeChannel,st\sfx)
	
	If st\chn = -1
		CreateConsoleMsg("Failed to stream Sound (returned -1): " + Chr(34) + file$ + Chr(34))
		If ConsoleOpening
			ConsoleOpen = True
}
		Return -1
}
	
	FSOUND_SetVolume(st\chn,volume*255)
	FSOUND_SetPaused(st\chn,False)
	
	Return Handle(st)
}

function StopStream_Strict(streamHandle%) {
	Local st.Stream = Object.Stream(streamHandle)
	
	If st = Null
		CreateConsoleMsg("Failed to stop stream Sound: Unknown Stream")
		Return
}
	If st\chn=0 Or st\chn=-1
		CreateConsoleMsg("Failed to stop stream Sound: Return value "+st\chn)
		Return
}
	
	FSOUND_StopSound(st\chn)
	FSOUND_Stream_Stop(st\sfx)
	FSOUND_Stream_Close(st\sfx)
	Delete st
	
}

function SetStreamVolume_Strict(streamHandle%,volume#) {
	Local st.Stream = Object.Stream(streamHandle)
	
	If st = Null
		CreateConsoleMsg("Failed to set stream Sound volume: Unknown Stream")
		Return
}
	If st\chn=0 Or st\chn=-1
		CreateConsoleMsg("Failed to set stream Sound volume: Return value "+st\chn)
		Return
}
	
	FSOUND_SetVolume(st\chn,volume*255.0)
	FSOUND_SetPaused(st\chn,False)
	
}

function SetStreamPaused_Strict(streamHandle%,paused%) {
	Local st.Stream = Object.Stream(streamHandle)
	
	If st = Null
		CreateConsoleMsg("Failed to pause/unpause stream Sound: Unknown Stream")
		Return
}
	If st\chn=0 Or st\chn=-1
		CreateConsoleMsg("Failed to pause/unpause stream Sound: Return value "+st\chn)
		Return
}
	
	FSOUND_SetPaused(st\chn,paused)
	
}

function IsStreamPlaying_Strict(streamHandle%) {
	Local st.Stream = Object.Stream(streamHandle)
	
	If st = Null
		CreateConsoleMsg("Failed to find stream Sound: Unknown Stream")
		Return
}
	If st\chn=0 Or st\chn=-1
		CreateConsoleMsg("Failed to find stream Sound: Return value "+st\chn)
		Return
}
	
	Return FSOUND_IsPlaying(st\chn)
	
}

function SetStreamPan_Strict(streamHandle%,pan#) {
	Local st.Stream = Object.Stream(streamHandle)
	
	If st = Null
		CreateConsoleMsg("Failed to find stream Sound: Unknown Stream")
		Return
}
	If st\chn=0 Or st\chn=-1
		CreateConsoleMsg("Failed to find stream Sound: Return value "+st\chn)
		Return
}
	
	//-1 = Left = 0
	//0 = Middle = 127.5 (127)
	//1 = Right = 255
	Local fmod_pan% = 0
	fmod_pan% = Int((255.0/2.0)+((255.0/2.0)*pan#))
	FSOUND_SetPan(st\chn,fmod_pan%)
	
}

function UpdateStreamSoundOrigin(streamHandle%,cam%,entity%,range#=10,volume#=1.0) {
	//Local st.Stream = Object.Stream(streamHandle)
	range# = Max(range,1.0)
	
	If volume>0 Then
		
		Local dist# = EntityDistance(cam, entity) / range#
		If 1 - dist# > 0 And 1 - dist# < 1 Then
			
			Local panvalue# = Sin(-DeltaYaw(cam,entity))
			
			SetStreamVolume_Strict(streamHandle,volume#*(1-dist#)*SFXVolume#)
			SetStreamPan_Strict(streamHandle,panvalue)
		Else
			SetStreamVolume_Strict(streamHandle,0.0)
}
	Else
		If streamHandle != 0 Then
			SetStreamVolume_Strict(streamHandle,0.0)
		} 
	}
}

function LoadMesh_Strict(File$,parent=0) {
	if (FileType(File$) != 1) {RuntimeError("3D Mesh " + File$ + " not found.")}
	tmp = LoadMesh(File$, parent)
	if (tmp == 0) {RuntimeError("Failed to load 3D Mesh: " + File)}
	return tmp  
}   

export function LoadAnimMesh_Strict(File: string,parent=0) {
	DebugLog (File)
	if (FileType(File) != 1) {RuntimeError ("3D Animated Mesh " + File + " not found.")}
	let tmp = LoadAnimMesh(File, parent)
	if (tmp = 0) {RuntimeError ("Failed to load 3D Animated Mesh: " + File )}
	return tmp
}   

//don't use in LoadRMesh, as Reg does this manually there. If you wanna fuck around with the logic in that function, be my guest 
function LoadTexture_Strict(File$,flags=1) {
	If FileType(File$) != 1 Then RuntimeError "Texture " + File$ + " not found."
	tmp = LoadTexture(File$, flags+(256*(EnableVRam=True)))
	If tmp = 0 Then RuntimeError "Failed to load Texture: " + File$ 
	Return tmp 
}   

function LoadBrush_Strict(file: string,flags,u: float=1.0,v: float=1.0) {
	if (FileType(file)!=1) {RuntimeError("Brush Texture " + file$ + "not found.")}
	tmp = LoadBrush(file$, flags, u, v)
	if (tmp == 0) {RuntimeError("Failed to load Brush: " + file)}
	return tmp 
} 

function LoadFont_Strict(file: string = "Tahoma", height=13, bold=0, italic=0, underline=0) {
	if (FileType(file$)!=1) {RuntimeError("Font " + file$ + " not found.")}
	tmp = LoadFont(file, height, bold, italic, underline)  
	if (tmp == 0) {RuntimeError("Failed to load Font: " + file$ )}
	return tmp
}