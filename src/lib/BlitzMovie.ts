//lib "BlitzMovie.dll"

import { int } from "../Helper/bbhelper"

export function BlitzMovie_Open(strName: string) : int {return 0}
export function BlitzMovie_Close() {}
export function BlitzMovie_GetWidth() : int {return 0}
export function BlitzMovie_GetHeight() : int {return 0}
export function BlitzMovie_GetPixel(offset: int) : int {return 0}
export function BlitzMovie_Play() : int {return 0}
export function BlitzMovie_Stop() : int {return 0}

// Direct3D7 specific stuff (much faster than the software versions)
export function BlitzMovie_OpenD3D(strName: string, device: int, ddraw: int) : int {return 0}
export function BlitzMovie_DrawD3D(x: int, y: int, width: int, height: int) : int {return 0}

// new stuff for 1.2
export function BlitzMovie_MuteAudio() : int {return 0}
export function BlitzMovie_SetVolume(volume: int) : int {return 0}
export function BlitzMovie_IsPlaying() : int {return 0}

// new stuff for 1.3
export function BlitzMovie_OpenDecodeToImage(strName: string, buffer: int, looping: int) : int {return 0}
export function BlitzMovie_OpenDecodeToTexture(strName: string, buffer: int, looping: int) : int {return 0}
export function BlitzMovie_Pause() : int {return 0}


