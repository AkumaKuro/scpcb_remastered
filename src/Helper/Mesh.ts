import { float, int } from "./bbhelper";

export function CreateMesh(parent: int = 0) : int {return 0}
export function CountSurfaces ( mesh: int ) : int {return 0}
export function GetSurface ( mesh: int, index: int ) {return 0}
export function AddVertex(surface: int,x: float,y: float,z: float,u: float = 0,v: float=0,w: float = 0) : int {return 0}
export function AddTriangle ( surface: int,v0: int,v1: int,v2: int ) {}
export function CreateSurface ( mesh: int,brush: int = -1 ) : int {return 0}
export function VertexTexCoords (surface: int,index: int,u: float,v: float,w: float = 0,coord_set: int = 0) {}
export function ScaleMesh (mesh: int,x_scale: float,y_scale: float,z_scale: float) {}
export function RotateMesh (mesh: int,pitch: float,yaw: float,roll: float) {}

export function EntityX( entity: int,   global: boolean = false ) : float {return 0}
export function EntityY( entity: int,   global: boolean = false ) : float {return 0}
export function EntityZ( entity: int,   global: boolean = false ) : float {return 0}

export function RotateEntity(entity,pitch: float,yaw: float,roll: float,global: boolean = false) {}

export function EntityPitch( entity: int, global: boolean = false ) : float {return 0}
export function EntityYaw( entity: int, global: boolean = false ) : float {return 0}
export function EntityRoll( entity: int, global: boolean = false ) : float {return 0}

export function AddMesh (source_mesh: int,dest_mesh: int) {}

export function PositionMesh (mesh,x: float,y: float,z: float) {}

export function VertexX( surface: int,index: int ) : float {return 0}
export function VertexY( surface: int,index: int ) : float {return 0}
export function VertexZ( surface: int,index: int ) : float {return 0}

export function VertexU( surface: int,index: int ,coord_set: int = -1 ) : float {return 0}
export function VertexV( surface: int,index: int ,coord_set: int = -1 ) : float {return 0}

export function CountVertices ( surface: int ) : int {return 0}
export function CountTriangles ( surface: int ) : int {return 0}

export function TriangleVertex ( surface: int,triangle_index: int,corner: int ) : int {return 0}

export function GetBrushTexture(brush: int,index: int = 0) : int {return 0}

export function TFormedX() : float {return 0}
export function TFormedY() : float {return 0}
export function TFormedZ() : float {return 0}

export function GetSurfaceBrush(surface: int) : int {return 0}

export function FreeEntity (EntityHandle: int) {}

export function FreeBrush (brush: int) {}

export function VertexRed( surface: int,index: int) : float {return 0}
export function VertexGreen( surface: int,index: int) : float {return 0}
export function VertexBlue( surface: int,index: int) : float {return 0}

export function FlipMesh(mesh: int) {}

export function MoveEntity (entity: int,x: float,y: float,z: float) {}

export function Delete (custom_type_name: any) {}

export function EntityAlpha (entity: int,alpha: float) {}

export function EntityOrder (entity: int,order: int) {}

export function BrushTexture (brush: int,texture: int,frame: int = 0,index: int = 0) : int {return 0}

export function CopyMesh ( mesh: int,parent: int = -1 ) : int {return 0}

export function CreatePivot ( parent: int = -1 ) : int {return 0}

export function EntityType (entity: int,collision_type: int,recursive: boolean = false) {}