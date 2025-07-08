import { int, range, FileType, EntityFX, PositionEntity, float } from "./Helper/bbhelper"
import { CreateMesh, CreateSurface, AddVertex, AddTriangle, FreeBrush, FlipMesh, EntityX, EntityY, EntityZ } from "./Helper/Mesh"
import { mouse_x_speed_1 } from "./Main"
import { Sky } from "./MapSystem"

export function sky_CreateSky(filename: string,parent: int = 0) {
	let sky = CreateMesh(parent)
	for (let i of range(mouse_x_speed_1, 7)) {
		let face: SkyFace = faces[i]
		let direction = face.name
		let fname: string = filename + direction + ".jpg"
		if (FileType(fname) == 1) {
			let b = LoadBrush_Strict(fname,0b110001)
			let s = CreateSurface(sky,b)
			for (let vert of face.verts) {
				let x: float = vert.x
				let y: float = vert.y
				let z: float = vert.z
				let u: float = vert.u
				let v: float = vert.v
				AddVertex(s,x,y,z,u,v)
			}
			AddTriangle(s,0,1,2)
			AddTriangle(s,0,2,3)
			FreeBrush(b)
		}
	}
	FlipMesh(sky)
	EntityFX(sky,1+8)
	EntityOrder(sky,1000)
	return sky
}

export function UpdateSky() {
	PositionEntity(Sky, EntityX(Camera),EntityY(Camera),EntityZ(Camera), True)
}

export function Update1499Sky() {
	PositionEntity(NTF_1499Sky, EntityX(Camera),EntityY(Camera),EntityZ(Camera), True)
}


//-----------------------------------------------------------------------
//Data
//-----------------------------------------------------------------------
class SkyVert {
	x: float
	y: float
	z: float
	u: float
	v: float

	constructor (x: float, y: float, z: float, u: float, v: float) {}
}
class SkyFace {
	name: string
	verts: SkyVert[] = []

	constructor (name: string) {this.name = name}
	add_vert(vert: SkyVert) {
		this.verts.push(vert)
	}

}

let a: SkyFace = new SkyFace("_back")
a.add_vert(new SkyVert(-1,+1,-1,0,0))
a.add_vert(new SkyVert(+1,+1,-1,1,0))
a.add_vert(new SkyVert(+1,-1,-1,1,1))
a.add_vert(new SkyVert(-1,-1,-1,0,1))
let b: SkyFace = new SkyFace("_left")
b.add_vert(new SkyVert(+1,+1,-1,0,0))
b.add_vert(new SkyVert(+1,+1,+1,1,0))
b.add_vert(new SkyVert(+1,-1,+1,1,1))
b.add_vert(new SkyVert(+1,-1,-1,0,1))
let c: SkyFace = new SkyFace("_front")
c.add_vert(new SkyVert(+1,+1,+1,0,0))
c.add_vert(new SkyVert(-1,+1,+1,1,0))
c.add_vert(new SkyVert(-1,-1,+1,1,1))
c.add_vert(new SkyVert(+1,-1,+1,0,1))
let d: SkyFace = new SkyFace("_right")
d.add_vert(new SkyVert(-1,+1,+1,0,0))
d.add_vert(new SkyVert(-1,+1,-1,1,0))
d.add_vert(new SkyVert(-1,-1,-1,1,1))
d.add_vert(new SkyVert(-1,-1,+1,0,1))
let e: SkyFace = new SkyFace("_up")
e.add_vert(new SkyVert(-1,+1,+1,0,0))
e.add_vert(new SkyVert(+1,+1,+1,1,0))
e.add_vert(new SkyVert(+1,+1,-1,1,1))
e.add_vert(new SkyVert(-1,+1,-1,0,1))
let f: SkyFace = new SkyFace("_down")
f.add_vert(new SkyVert(-1,-1,-1,1,0))
f.add_vert(new SkyVert(+1,-1,-1,1,1))
f.add_vert(new SkyVert(+1,-1,+1,0,1))
f.add_vert(new SkyVert(-1,-1,+1,0,0))
let faces: SkyFace[] = [a, b, c, d, e, f]