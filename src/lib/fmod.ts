import { int } from "../Helper/bbhelper";

export function FSOUND_Init(freq: int,channels: int,flags: int) : int {return 0}
export function FSOUND_Close() : int {return 0}
export function FSOUND_SetVolume(channel: int,vol: int) {}
export function FSOUND_SetVolumeAbsolute(channel: int,vol: int) : int {return 0}
export function FSOUND_GetVolume(channel: int) {}
export function FSOUND_SetPaused(channel: int,paused: int) {}
export function FSOUND_StopSound(channel: int) {}
export function FSOUND_Stream_Play(channel: int,stream: int) : int {return 0}
export function FSOUND_Stream_Stop(stream: int) : int {return 0}
export function FSOUND_Stream_Close(stream: int) : int {return 0}
export function FSOUND_Stream_Open(filename$,mode: int,memlength: int) : int {return 0}
export function FSOUND_IsPlaying(channel: int) : int {return 0}
export function FSOUND_SetPan(channel: int,pan: int) : int {return 0}