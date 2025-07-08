import { float, int } from "./bbhelper";

export function CreateCamera (parent = null ): int {return 0}

export function CameraViewport (camera,x,y,width,height){}

export function CameraClsMode (camera,cls_color: boolean,cls_zbuffer: boolean){}
export function CameraZoom (camera,zoom: float) {}
export function CameraRange (camera,near: float,far: float) {}

export enum CameraProjectionMode {
    NoProjection,
    Perspective,
    Orthographic
}
export function CameraProjMode (camera: int,mode: CameraProjectionMode) {}