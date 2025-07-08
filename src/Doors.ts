import { int, float, CopyEntity, ScaleEntity, Exit, PositionEntity, range, EntityFX, Chr } from "./Helper/bbhelper"
import { Rand, Sin } from "./Helper/math"
import { EntityX, EntityZ, EntityY, FreeEntity, RotateEntity, MoveEntity } from "./Helper/Mesh"
import { Instr } from "./Helper/strings"
import { PlayerRoom, FPSfactor, GrabbedEntity, Wearing714, MsgTimer } from "./Main"
import { Rooms, RoomScale, HideDistance, RemoteDoorOn } from "./MapSystem"


var ClosestButton: int
var ClosestDoor: Doors
var SelectedDoor: Doors
var UpdateDoorsTimer: float
var DoorTempID: int

class Doors {
	obj: int
    obj2: int
    frameobj: int
    buttons: int[] = new Array(2)
	locked: boolean
    open: boolean
    angle: int
    openstate: float
    fastopen: int
	dir: int
	timer: int
    timerstate: float
	KeyCard: int
	room: Rooms
	
	DisableWaypoint: int
	
	dist: float
	
	SoundCHN: int
	
	Code$
	
	ID: int
	
	Level: int
	LevelDest: int
	
	AutoClose: int
	
	LinkedDoor: Doors
	
	IsElevatorDoor: boolean = false
	
	MTFClose: boolean = true
	NPCCalledElevator: boolean = false
	
	DoorHitOBJ: int
}

var BigDoorOBJ: int[] = new Array(2)
var HeavyDoorObj: int[] = new Array(2)
var OBJTunnel: int[] = new Array(7)

function CreateDoor(lvl, x: float, y: float, z: float, angle: float, room: Rooms, dopen: boolean = false,  big: boolean = false, keycard: boolean = false, code: string = "", useCollisionMesh: boolean = false): Doors {
	let d: Doors, parent, i: int
	if (room != Null) {parent = room.obj}
	
	let d2: Doors
	
	d = new Doors()
	if (big == 1) {
		d.obj = CopyEntity(BigDoorOBJ(0))
		ScaleEntity(d.obj, 55 * RoomScale, 55 * RoomScale, 55 * RoomScale)
		d.obj2 = CopyEntity(BigDoorOBJ(1))
		ScaleEntity(d.obj2, 55 * RoomScale, 55 * RoomScale, 55 * RoomScale)
		
		d.frameobj = CopyEntity(DoorColl)	//CopyMesh				
		ScaleEntity(d.frameobj, RoomScale, RoomScale, RoomScale)
		EntityType (d.frameobj, HIT_MAP)
		EntityAlpha (d.frameobj, 0.0)
    } else if (big=2) {
		d.obj = CopyEntity(HeavyDoorObj(0))
		ScaleEntity(d.obj, RoomScale, RoomScale, RoomScale)
		d.obj2 = CopyEntity(HeavyDoorObj(1))
		ScaleEntity(d.obj2, RoomScale, RoomScale, RoomScale)
		
		d.frameobj = CopyEntity(DoorFrameOBJ)
    } else if (big=3) {
		for (d2 of Doors.each) {
			if (d2 != d && d2.dir == 3) {
				d.obj = CopyEntity(d2.obj)
				d.obj2 = CopyEntity(d2.obj2)
				ScaleEntity(d.obj, RoomScale, RoomScale, RoomScale)
				ScaleEntity(d.obj2, RoomScale, RoomScale, RoomScale)
				Exit()
            }
        }
		if (d.obj == 0) {
			d.obj = LoadMesh_Strict("GFX/map/elevatordoor.b3d")
			d.obj2 = CopyEntity(d.obj)
			ScaleEntity(d.obj, RoomScale, RoomScale, RoomScale)
			ScaleEntity(d.obj2, RoomScale, RoomScale, RoomScale)
        }
		d.frameobj = CopyEntity(DoorFrameOBJ)
    } else {
		d.obj = CopyEntity(DoorOBJ)
		ScaleEntity(d.obj, (204.0 * RoomScale) / MeshWidth(d.obj), 312.0 * RoomScale / MeshHeight(d.obj), 16.0 * RoomScale / MeshDepth(d.obj))
		
		d.frameobj = CopyEntity(DoorFrameOBJ)
		d.obj2 = CopyEntity(DoorOBJ)
		
		ScaleEntity(d.obj2, (204.0 * RoomScale) / MeshWidth(d.obj), 312.0 * RoomScale / MeshHeight(d.obj), 16.0 * RoomScale / MeshDepth(d.obj))
    }
	
	PositionEntity (d.frameobj, x, y, z	)
	ScaleEntity(d.frameobj, (8.0 / 2048.0), (8.0 / 2048.0), (8.0 / 2048.0))
	EntityPickMode (d.frameobj,2)
	EntityType (d.obj, HIT_MAP)
	EntityType (d.obj2, HIT_MAP)
	
	d.ID = DoorTempID
	DoorTempID=DoorTempID+1
	
	d.KeyCard = keycard
	d.Code = code
	
	d.Level = lvl
	d.LevelDest = 66
	
	for (i of range(2)) {
		if (code != "") {
			d.buttons[i]= CopyEntity(ButtonCodeOBJ)
			EntityFX(d.buttons[i], 1)
        } else {
			if (keycard>0) {
				d.buttons[i]= CopyEntity(ButtonKeyOBJ)
            } else if (keycard<0) {
				d.buttons[i]= CopyEntity(ButtonScannerOBJ)	
            } else {
				d.buttons[i] = CopyEntity(ButtonOBJ)
            }
        }
		
		ScaleEntity(d.buttons[i], 0.03, 0.03, 0.03)
    }
	
	if (big==1) {
		PositionEntity(d.buttons[0], x - 432.0 * RoomScale, y + 0.7, z + 192.0 * RoomScale)
		PositionEntity(d.buttons[1], x + 432.0 * RoomScale, y + 0.7, z - 192.0 * RoomScale)
		RotateEntity(d.buttons[0], 0, 90, 0)
		RotateEntity(d.buttons[1], 0, 270, 0)
    } else {
		PositionEntity(d.buttons[0], x + 0.6, y + 0.7, z - 0.1)
		PositionEntity(d.buttons[1], x - 0.6, y + 0.7, z + 0.1)
		RotateEntity(d.buttons[1], 0, 180, 0		)
    }
	EntityParent(d.buttons[0], d.frameobj)
	EntityParent(d.buttons[1], d.frameobj)
	EntityPickMode(d.buttons[0], 2)
	EntityPickMode(d.buttons[1], 2)
	
	PositionEntity(d.obj, x, y, z)
	
	RotateEntity(d.obj, 0, angle, 0)
	RotateEntity(d.frameobj, 0, angle, 0)
	
	if (d.obj2 != 0) {
		PositionEntity (d.obj2, x, y, z)
		if (big=1) {
			RotateEntity(d.obj2, 0, angle, 0)
        } else {
			RotateEntity(d.obj2, 0, angle + 180, 0)
		}
		EntityParent(d.obj2, parent)
	}
	
	EntityParent(d.frameobj, parent)
	EntityParent(d.obj, parent)
	
	d.angle = angle
	d.open = dopen		
	
	EntityPickMode(d.obj, 2)
	if (d.obj2 != 0) {
		EntityPickMode(d.obj2, 2)
    }
	
	EntityPickMode (d.frameobj,2)
	
	if (d.open && big == False && Rand(8) == 1) {d.AutoClose = True}
	d.dir=big
	d.room=room
	
	d.MTFClose = True
	
	if (useCollisionMesh) {
		for (d2 of Doors.each) {
			if (d2 != d) {
				if (d2.DoorHitOBJ != 0) {
					d.DoorHitOBJ = CopyEntity(d2.DoorHitOBJ,d.frameobj)
					EntityAlpha (d.DoorHitOBJ,0.0)
					EntityFX (d.DoorHitOBJ,1)
					EntityType (d.DoorHitOBJ,HIT_MAP)
					EntityColor (d.DoorHitOBJ,255,0,0)
					HideEntity(d.DoorHitOBJ)
					Exit()
                }
            }
        }
		if (d.DoorHitOBJ == 0) {
			d.DoorHitOBJ = LoadMesh_Strict("GFX/doorhit.b3d",d.frameobj)
			EntityAlpha(d.DoorHitOBJ,0.0)
			EntityFX(d.DoorHitOBJ,1)
			EntityType(d.DoorHitOBJ,HIT_MAP)
			EntityColor(d.DoorHitOBJ,255,0,0)
			HideEntity(d.DoorHitOBJ)
        }
    }
	
	return d
	
}

function CreateButton(x: float,y: float,z: float, pitch: float,yaw: float,roll: float=0) {
	let obj = CopyEntity(ButtonOBJ)	
	
	ScaleEntity(obj, 0.03, 0.03, 0.03)
	
	PositionEntity(obj, x,y,z)
	RotateEntity(obj, pitch,yaw,roll)
	
	EntityPickMode(obj, 2)	
	
	return obj
}

function UpdateDoors() {
	
	let i: int, d: Doors, x: float, z: float, dist: float
	if (UpdateDoorsTimer <= 0) {
		for (d of Doors.each) {
			let xdist: float = Abs(EntityX(Collider)-EntityX(d.obj,True))
			let zdist: float = Abs(EntityZ(Collider)-EntityZ(d.obj,True))
			
			d.dist = xdist+zdist
			
			if (d.dist > HideDistance*2) {
				if (d.obj != 0) {HideEntity( d.obj)}
				if (d.frameobj != 0) {HideEntity( d.frameobj)}
				if (d.obj2 != 0) {HideEntity( d.obj2)}
				if (d.buttons[0] != 0) {HideEntity( d.buttons[0])}
				if (d.buttons[1] != 0) {HideEntity( d.buttons[1]				)}
            } else {
				if (d.obj != 0) {ShowEntity( d.obj)}
				if (d.frameobj != 0) {ShowEntity( d.frameobj)}
				if (d.obj2 != 0) {ShowEntity( d.obj2)}
				if (d.buttons[0] != 0) {ShowEntity( d.buttons[0])}
				if (d.buttons[1] != 0) {ShowEntity( d.buttons[1])}
            }
			
			if (PlayerRoom.RoomTemplate.Name$ = "room2sl") {
				if (ValidRoom2slCamRoom(d.room)) {
					if (d.obj != 0) {ShowEntity(d.obj)}
					if (d.frameobj != 0) {ShowEntity(d.frameobj)}
					if (d.obj2 != 0) {ShowEntity(d.obj2)}
					if (d.buttons[0] != 0) {ShowEntity(d.buttons[0])}
					if (d.buttons[1] != 0) {ShowEntity(d.buttons[1])}
                }
            }
        }
		
		UpdateDoorsTimer = 30
    } else {
		UpdateDoorsTimer = Max(UpdateDoorsTimer-FPSfactor,0)
	}
	
	ClosestButton = 0
	ClosestDoor = null
	
	for (d of Doors.each) {
		if (d.dist < HideDistance*2 || d.IsElevatorDoor>0) { //Make elevator doors update everytime because if not, this can cause a bug where the elevators suddenly won't work, most noticeable in room2tunnel - ENDSHN
			
			if ((d.openstate >= 180 || d.openstate <= 0) && GrabbedEntity == 0) {
				for (i of range(2)) {
					if (d.buttons[i] != 0) {
						if (Abs(EntityX(Collider)-EntityX(d.buttons[i],True)) < 1.0) { 
							if (Abs(EntityZ(Collider)-EntityZ(d.buttons[i],True)) < 1.0) { 
								dist = Distance(EntityX(Collider, True), EntityZ(Collider, True), EntityX(d.buttons[i], True), EntityZ(d.buttons[i], True))
								if (dist < 0.7) {
									let temp: int = CreatePivot()
									PositionEntity (temp, EntityX(Camera), EntityY(Camera), EntityZ(Camera))
									PointEntity( temp,d.buttons[i])
									
									if (EntityPick(temp, 0.6) == d.buttons[i]) {
										if (ClosestButton = 0) {
											ClosestButton = d.buttons[i]
											ClosestDoor = d
										} else {
											if (dist < EntityDistance(Collider, ClosestButton)) {
												ClosestButton = d.buttons[i]
												ClosestDoor = d
											}
										}							
									}
									
									FreeEntity (temp)
									
								}							
							}
						}
						
					}
				}
			}
			
			if (d.open) {
				if (d.openstate < 180) {
					switch (d.dir) {
						case 0:
							d.openstate = Min(180, d.openstate + FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * (d.fastopen*2+1) * FPSfactor / 80.0, 0, 0)
							if (d.obj2 != 0) (MoveEntity(d.obj2, Sin(d.openstate)* (d.fastopen+1) * FPSfactor / 80.0, 0, 0)		)
						case 1:
							d.openstate = Min(180, d.openstate + FPSfactor * 0.8)
							MoveEntity(d.obj, Sin(d.openstate) * FPSfactor / 180.0, 0, 0)
							if (d.obj2 != 0) (MoveEntity(d.obj2, -Sin(d.openstate) * FPSfactor / 180.0, 0, 0))
						case 2:
							d.openstate = Min(180, d.openstate + FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * (d.fastopen+1) * FPSfactor / 85.0, 0, 0)
							if (d.obj2 != 0) (MoveEntity(d.obj2, Sin(d.openstate)* (d.fastopen*2+1) * FPSfactor / 120.0, 0, 0))
						case 3:
							d.openstate = Min(180, d.openstate + FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * (d.fastopen*2+1) * FPSfactor / 162.0, 0, 0)
							if (d.obj2 != 0) (MoveEntity(d.obj2, Sin(d.openstate)* (d.fastopen*2+1) * FPSfactor / 162.0, 0, 0))
						case 4: //Used for 914 only:
							d.openstate = Min(180, d.openstate + FPSfactor * 1.4)
							MoveEntity(d.obj, Sin(d.openstate) * FPSfactor / 114.0, 0, 0)
                    }
				} else {
					d.fastopen = 0
					ResetEntity(d.obj)
					if (d.obj2 != 0) {ResetEntity(d.obj2)}
					if (d.timerstate > 0) {
						d.timerstate = Max(0, d.timerstate - FPSfactor)
						if (d.timerstate + FPSfactor > 110 && d.timerstate <= 110) {d.SoundCHN = PlaySound2(CautionSFX, Camera, d.obj)}
						let sound: int
						if (d.dir == 1) {sound = Rand(0, 1)} else {sound = Rand(0, 2)}
						if (d.timerstate == 0) {
                            d.open = !d.open
                            d.SoundCHN = PlaySound2(CloseDoorSFX(d.dir,sound), Camera, d.obj)
                        }
					}
					if (d.AutoClose && RemoteDoorOn) {
						if (EntityDistance(Camera, d.obj) < 2.1) {
							if (!Wearing714) {PlaySound_Strict (HorrorSFX(7))}
							d.open = false
							d.SoundCHN = PlaySound2(CloseDoorSFX(Min(d.dir,1), Rand(0, 2)), Camera, d.obj)
							d.AutoClose = false
						}
					}				
				}
			} else {
				if (d.openstate > 0) {
					switch (d.dir) {
						case 0:
							d.openstate = Max(0, d.openstate - FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * -FPSfactor * (d.fastopen+1) / 80.0, 0, 0)
							if (d.obj2 != 0) {
								MoveEntity(d.obj2, Sin(d.openstate) * (d.fastopen+1) * -FPSfactor / 80.0, 0, 0)
							}
						case 1:
							d.openstate = Max(0, d.openstate - FPSfactor*0.8)
							MoveEntity(d.obj, Sin(d.openstate) * -FPSfactor / 180.0, 0, 0)
							if (d.obj2 != 0) {MoveEntity(d.obj2, Sin(d.openstate) * FPSfactor / 180.0, 0, 0)}
							if (d.openstate < 15 && d.openstate+FPSfactor >= 15) {
								if (ParticleAmount==2) {
									for (i of range(0, Rand(76,100))) {
										let pvt: int = CreatePivot()
										PositionEntity(pvt, EntityX(d.frameobj,True)+Rnd(-0.2,0.2), EntityY(d.frameobj,True)+Rnd(0.0,1.2), EntityZ(d.frameobj,True)+Rnd(-0.2,0.2))
										RotateEntity(pvt, 0, Rnd(360), 0)
										
										let p: Particles = CreateParticle(EntityX(pvt), EntityY(pvt), EntityZ(pvt), 2, 0.002, 0, 300)
										p.speed = 0.005
										RotateEntity(p.pvt, Rnd(-20, 20), Rnd(360), 0)
										
										p.SizeChange = -0.00001
										p.size = 0.01
										ScaleSprite(p.obj,p.size,p.size)
										
										p.Achange = -0.01
										
										EntityOrder (p.obj,-1)
										
										FreeEntity( pvt)
                                    }
								}
							}
						case 2:
							d.openstate = Max(0, d.openstate - FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * -FPSfactor * (d.fastopen+1) / 85.0, 0, 0)
							if (d.obj2 != 0) {
								MoveEntity(d.obj2, Sin(d.openstate) * (d.fastopen+1) * -FPSfactor / 120.0, 0, 0)
							}
						case 3:
							d.openstate = Max(0, d.openstate - FPSfactor * 2 * (d.fastopen+1))
							MoveEntity(d.obj, Sin(d.openstate) * -FPSfactor * (d.fastopen+1) / 162.0, 0, 0)
							if (d.obj2 != 0) {
								MoveEntity(d.obj2, Sin(d.openstate) * (d.fastopen+1) * -FPSfactor / 162.0, 0, 0)
							}
						case 4: //Used for 914 only:
							d.openstate = Min(180, d.openstate - FPSfactor * 1.4)
							MoveEntity(d.obj, Sin(d.openstate) * -FPSfactor / 114.0, 0, 0)
                    }
					
					if (d.angle == 0 || d.angle == 180) {
						if (Abs(EntityZ(d.frameobj, true)-EntityZ(Collider))<0.15) {
							if (Abs(EntityX(d.frameobj, true)-EntityX(Collider))<0.7*(d.dir*2+1)) {
								z = CurveValue(EntityZ(d.frameobj,true)+0.15*Sgn(EntityZ(Collider)-EntityZ(d.frameobj, true)), EntityZ(Collider), 5)
								PositionEntity (Collider, EntityX(Collider), EntityY(Collider), z)
							}
						}
					} else {
						if (Abs(EntityX(d.frameobj, true)-EntityX(Collider))<0.15) {
							if (Abs(EntityZ(d.frameobj, true)-EntityZ(Collider))<0.7*(d.dir*2+1)) {
								x = CurveValue(EntityX(d.frameobj,true)+0.15*Sgn(EntityX(Collider)-EntityX(d.frameobj, true)), EntityX(Collider), 5)
								PositionEntity (Collider, x, EntityY(Collider), EntityZ(Collider))
							}
						}
					}
					
					if (d.DoorHitOBJ != 0) {
						ShowEntity(d.DoorHitOBJ)
					}
				} else {
					d.fastopen = 0
					PositionEntity(d.obj, EntityX(d.frameobj, true), EntityY(d.frameobj, true), EntityZ(d.frameobj, true))
					if (d.obj2 != 0) {
						PositionEntity(d.obj2, EntityX(d.frameobj, true), EntityY(d.frameobj, true), EntityZ(d.frameobj, true))
					}
					if (d.obj2 != 0 && d.dir == 0) {
						MoveEntity(d.obj, 0, 0, 8.0 * RoomScale)
						MoveEntity(d.obj2, 0, 0, 8.0 * RoomScale)
					}
					if (d.DoorHitOBJ != 0) {
						HideEntity(d.DoorHitOBJ)
					}
				}
			}
			
		}
		UpdateSoundOrigin(d.SoundCHN,Camera,d.frameobj)
		
		if (d.DoorHitOBJ!=0) {
			if (DebugHUD) {
				EntityAlpha (d.DoorHitOBJ,0.5)
			} else {
				EntityAlpha (d.DoorHitOBJ,0.0)
			}
		}
	}
}

function UseDoor(d: Doors, showmsg: boolean = true, playsfx: boolean = true) {
	let temp: int = 0
	if (d.KeyCard > 0) {
		if (!SelectedItem) {
			if (showmsg) {
				if ((Instr(Msg,"The keycard") == 0 && Instr(Msg,"A keycard with") == 0) || (MsgTimer<70*3)) {
					Msg = "A keycard is required to operate this door."
					MsgTimer = 70 * 7
				}
			}
			return
		} else {
			switch (SelectedItem.itemtemplate.tempname) {
				case "key1":
					temp = 1
				case "key2":
					temp = 2
				case "key3":
					temp = 3
				case "key4":
					temp = 4
				case "key5":
					temp = 5
				case "key6":
					temp = 6
				default: 
					temp = -1
			}
			
			if (temp == -1) {
				if (showmsg) {
					if ((Instr(Msg,"The keycard")=0 && Instr(Msg,"A keycard with")==0) || (MsgTimer<70*3)) {
						Msg = "A keycard is required to operate this door."
						MsgTimer = 70 * 7
					}
				}
				return				
			} else if (temp >= d.KeyCard) {
				SelectedItem = Null
				if (showmsg) {
					if (d.locked) {
						PlaySound_Strict(KeyCardSFX2)
						Msg = "The keycard was inserted into the slot but nothing happened."
						MsgTimer = 70 * 7
						return
					} else {
						PlaySound_Strict(KeyCardSFX1)
						Msg = "The keycard was inserted into the slot."
						MsgTimer = 70 * 7	
					}
				}
			} else {
				SelectedItem = null
				if (showmsg) {
					PlaySound_Strict(KeyCardSFX2)
					if (d.locked) {
						Msg = "The keycard was inserted into the slot but nothing happened."
					} else {
						Msg = "A keycard with security clearance "+d\KeyCard+" or higher is required to operate this door."
					}
					MsgTimer = 70 * 7					
				}
				return
			}
		}	
	} else if (d.KeyCard < 0) {
		//I can't find any way to produce short circuited boolean expressions so work around this by using a temporary variable - risingstar64
		if (SelectedItem != Null) {
			temp = (SelectedItem.itemtemplate.tempname == "hand" && d.KeyCard == -1) || (SelectedItem.itemtemplate.tempname == "hand2" && d.KeyCard == -2)
		}
		SelectedItem = Null
		if (temp != 0) {
			PlaySound_Strict (ScannerSFX1)
			if ((Instr(Msg,"You placed your")=0) || (MsgTimer < 70*3)) {
				Msg = "You place the palm of the hand onto the scanner. The scanner reads: "+Chr(34)+"DNA verified. Access granted."+Chr(34)
			}
			MsgTimer = 70 * 10
		} else {
			if (showmsg) {
				PlaySound_Strict (ScannerSFX2)
				Msg = "You placed your palm onto the scanner. The scanner reads: "+Chr(34)+"DNA does not match known sample. Access denied."+Chr(34)
				MsgTimer = 70 * 10
			}
			return			
		}
	} else {
		if (d.locked) {
			if (showmsg) {
				if (!(d.IsElevatorDoor>0)) {
					PlaySound_Strict (ButtonSFX2)
					if (PlayerRoom.RoomTemplate.Name != "room2elevator") {
                        if (d.open) {
                            Msg = "You pushed the button but nothing happened."
						} else {    
                            Msg = "The door appears to be locked."
                        }    
					} else {
                        Msg = "The elevator appears to be broken."
                    }
					MsgTimer = 70 * 5
				} else {
					if (d.IsElevatorDoor == 1) {
						Msg = "You called the elevator."
						MsgTimer = 70 * 5
					} else if (d.IsElevatorDoor == 3) {
						Msg = "The elevator is already on this floor."
						MsgTimer = 70 * 5
					} else if (Msg!="You called the elevator.") {
						if ((Msg=="You already called the elevator.") || (MsgTimer<70*3)) {
							switch (Rand(10)) {
								case 1:
									Msg = "Stop spamming the button."
									MsgTimer = 70 * 7
								case 2:
									Msg = "Pressing it harder does not make the elevator come faster."
									MsgTimer = 70 * 7
								case 3:
									Msg = "If you continue pressing this button I will generate a Memory Access Violation."
									MsgTimer = 70 * 7
								default:
									Msg = "You already called the elevator."
									MsgTimer = 70 * 7
							}
						}
					} else {
						Msg = "You already called the elevator."
						MsgTimer = 70 * 7
					}
				}
				
			}
			return
		}	
	}
	
	d.open = (!d.open)
	if (d.LinkedDoor != null) {
		d.LinkedDoor.open = (!d.LinkedDoor.open)
	}
	
	let sound = 0
	if (d.dir == 1) {
		sound=Rand(0, 1)
	} else {
		sound=Rand(0, 2)
	}
	
	if (playsfx) {
		if (d.open) {
			if (d.LinkedDoor != Null) {d.LinkedDoor.timerstate = d.LinkedDoor.timer}
			d.timerstate = d.timer
			d.SoundCHN = PlaySound2 (OpenDoorSFX(d.dir, sound), Camera, d.obj)
		} else {
			d.SoundCHN = PlaySound2 (CloseDoorSFX(d.dir, sound), Camera, d.obj)
		}
		UpdateSoundOrigin(d.SoundCHN,Camera,d.obj)
	} else {
		if (d.open) {
			if (d.LinkedDoor != Null) {d.LinkedDoor.timerstate = d.LinkedDoor.timer}
			d.timerstate = d.timer
		}
	}
	
}

function RemoveDoor(d: Doors) {
	if (d.buttons[0] != 0) {EntityParent (d.buttons[0], 0)}
	if (d.buttons[1] != 0) {EntityParent (d.buttons[1], 0	)}
	
	if (d.obj != 0) {FreeEntity( d.obj)}
	if (d.obj2 != 0) {FreeEntity( d.obj2)}
	if (d.frameobj != 0) {FreeEntity( d.frameobj)}
	if (d.buttons[0] != 0) {FreeEntity( d.buttons[0])}
	if (d.buttons[1] != 0) {FreeEntity( d.buttons[1])}
	
	Delete (d)
}
