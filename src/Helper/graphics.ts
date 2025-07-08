import { float, int } from "./bbhelper";

export function SetBuffer (buffer: int) {}
export function BackBuffer() : int {return 0}
export function CountGfxModes3D() : int {return 0}

export function BBText (x: int,y: int,string: string,center_x: int = 0,center_y: int = 0) {}
export function ReadPixelFast (x: int,y: int,buffer: int = 0) : int {return 0}
export function WritePixelFast (x: int,y: int,rgb: int,buffer: int = 0) {}

export function TextureBuffer ( texture: int,frame: int = 0 ) : int {return 0}

export function Rect(x: int, y: int, width: int, height: int, solid: boolean) {}

export function GfxModeHeight (mode: int) : int {return 0}
export function GfxModeWidth (mode: int) : int {return 0}

export function ColorRed() : int {return 0}
export function ColorBlue() : int {return 0}
export function ColorGreen() : int {return 0}

export function Cls() {}

export function Flip() {}

export function ClsColor(red: int,green: int,blue: int) {}

export function RenderWorld(tween: float = 1) {}