
export type int = number
export type float = number

export function Exit() {}

export function Color (red,green,blue) {}

export function RuntimeError (message: string) {}
export function Chr(integer: int): string {return ""}

export function Float<T>(value: T): float {return 0}

export function SetFont(font_handle: int) {}

export function range(a: int, b: int = -1, step: int = 1): int[] {
    return []
}



export function EntityTexture(entity, texture ,frame = null, index = null) {}



// Image
export function ImageWidth (image_handle) {}

// Entity
export function EntityFX(entity,fx) {}
export function PositionEntity( entity,x: float,y: float,z: float, global: boolean = false) {}
export function ScaleEntity (entity,x_scale: float,y_scale: float,z_scalel: float,global: boolean = false) {}

// Files
export function FileType (filename: string): FileTypeResult {
    return FileTypeResult.EXISTS
}

enum FileTypeResult {
    DOES_NOT_EXIST,
    EXISTS,
    IS_DIR
}

export function LoadImage (Filename) {}

// Sound
export function FreeSound (sound_variable) {}

export function ChannelPlaying (channel_handle): boolean {
    return true
}



export class BColor {
    r: int
    g: int
    b: int
    a: int

    constructor (r: int, g: int, b: int, a: int = 255) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
}

export function Millisecs() {}

export function LoadAnimMesh( Filename: string, Parent = null ): int {
    return 0
}

export function AppTitle(title: string) {}

export function Collisions(src_type: int,dest_type: int,method: CollisionMethod,response: CollisionResponse) {}

enum CollisionMethod {
    EllipsoidXEllipsoid = 1,
    EllipsoidXPolygon = 2,
    EllipsoidXBox = 3
}

enum CollisionResponse {
    Stop =  1,
    slide1 = 2,
    slide2 = 3 //prevent entities from sliding down slopes 
}

export function Graphics3D(width: int, height: int, depth: int, mode: DisplayMode = DisplayMode.WindowedDebugFullscreenRelease) {}

enum DisplayMode {
    WindowedDebugFullscreenRelease,
    Fullscreen,
    Windowed,
    Scaled
}

export function EntityName(entity: int) : string {return ''}



export function GetChild (entity: int,index: int) : int {return 0}

export function SeedRnd (seed: int) {}

export function Int( value ) : int {return 0}

export function CopyEntity ( entity: int,parent: int = 0 ) : int {return 0}

export function DebugLog (message: any) {}

export function CountChildren ( entity: int ) : int {return 0}

export function GetParent ( entity: int ) : int {return 0}

export function KeyHit (scancode: int) : boolean {return false}



export function Delay (milliseconds: int) {}

export function FlushKeys() {}

export function Input(prompt: string) : string {return ''}

export function First<T>(type_variable: T[]) : T {return type_variable[0]}