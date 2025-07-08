import { float, int } from "../Helper/bbhelper"

export function InitParticles(cam: int) : int {return 0}
export function FreeParticles() : int {return 0}
export function CreateTemplate() : int {return 0}
export function FreeTemplate(template: int) : int {return 0}
export function SetTemplateEmitterBlend(template: int,emitter_blend: int) : int {return 0}
export function SetTemplateInterval(template: int,interval: int) : int {return 0}
export function SetTemplateParticlesPerInterval(template: int,particles_per_interval: int) : int {return 0}
export function SetTemplateMaxParticles(template: int,max_particles: int) : int {return 0}
export function SetTemplateParticleLifeTime(template: int,min_time: int,max_time: int) : int {return 0}
export function SetTemplateEmitterLifeTime(template: int,emitter_max_time: int) : int {return 0}
export function SetTemplateTexture(template: int,path: string,mode: int,blend: int) : int {return 0}
export function SetTemplateAnimTexture(template: int,path: string,mode: int,blend: int,w: int,h: int,maxframes: int,speed: float) : int {return 0}
export function SetTemplateOffset(template: int,min_ox: float,max_ox: float,min_oy: float,max_oy: float,min_oz: float,max_oz: float) : int {return 0}
export function SetTemplateVelocity(template: int,min_xv: float,max_xv: float,min_yv: float,max_yv: float,min_zv: float,max_zv: float) : int {return 0}
export function SetTemplateRotation(template: int,rot_vel1: float,rot_vel2: float) : int {return 0}
export function SetTemplateAlignToFall(template: int,align_to_fall: int,align_to_fall_offset: int) : int {return 0}
export function SetTemplateGravity(template: int,gravity: float) : int {return 0}
export function SetTemplateSize(template: int,sx: float,sy: float,size_multiplicator1: float,size_multiplicator2: float) : int {return 0}
export function SetTemplateSizeVel(template: int,size_add: float,size_mult: float) : int {return 0}
export function SetTemplateAlpha(template: int,alpha: float) : int {return 0}
export function SetTemplateAlphaVel(template: int,alpha_vel: int) : int {return 0}
export function SetTemplateColors(template: int,col1: int,col2: int) : int {return 0}
export function SetTemplateBrightness(template: int,brightness: int) : int {return 0}
export function SetTemplateFloor(template: int,floor_y: float,floor_bounce: float) : int {return 0}
export function SetTemplateFixAngles(template: int,pitch_fix: int,yaw_fix: int) : int {return 0}
export function SetTemplateSubTemplate(template: int,sub_template: int,for_each_particle: int) : int {return 0}
export function SetEmitter(owner: int,template: int,fixed: int) : int {return 0}
export function FreeEmitter(ent: int,delete_particles: int) : int {return 0}
export function FreezeEmitter(ent: int) : int {return 0}
export function UnfreezeEmitter(ent: int) : int {return 0}
export function UpdateParticles() : int {return 0}