import { float, int } from "./bbhelper";

export function UnlockBuffer (buffer: int) {}
export function LockBuffer (buffer: int) {}
export function ImageBuffer (handle: int,frame: int = -1) : int {return 0}

export function TextureHeight ( texture: int ) : int {return 0}
export function TextureWidth ( texture: int ) : int {return 0}

export function FreeTexture (texture: int) {}


export enum TextureBlendMode {
    DoNotBlend,
    NoBlendOrAlpha,
    Multiply,
    Add,
    Dot3,
    Multiply2
} 
export function TextureBlend(Texture: int, Blend: TextureBlendMode = TextureBlendMode.Multiply) {}

export function ScaleTexture (texture: int,u_scale: float,v_scale: float) {}

export function PositionTexture (texture: int,u_position: float,v_position: float) {}

export function DrawImage (image: int, x: int,y: int ,frame: int = -1) {}