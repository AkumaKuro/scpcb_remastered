import { int } from "./bbhelper";

export function UnlockBuffer (buffer: int) {}
export function LockBuffer (buffer: int) {}
export function ImageBuffer (handle: int,frame: int = -1) : int {return 0}

export function TextureHeight ( texture: int ) : int {return 0}
export function TextureWidth ( texture: int ) : int {return 0}

export function FreeTexture (texture: int) {}

