import { BColor, int } from "./Helper/bbhelper"


export class Difficulty {
	name: string
	description: string
	permaDeath: boolean
	aggressiveNPCs
	saveType: int
	otherFactors: int
	
	color: BColor
	
	customizable: boolean
}

export var difficulties: Difficulty[] = new Array(4)

export var SelectedDifficulty: Difficulty

export const SAFE=0
export const EUCLID=1
export const KETER=2
export const CUSTOM=3
export enum DifficultyLevel {
	SAFE,
	EUCLID,
	KETER,
	CUSTOM
}

export const SAVEANYWHERE = 0
export const SAVEONQUIT=1
export const SAVEONSCREENS=2
export enum SaveSetting {
	SAVE_ANYWHERE,
	SAVE_ON_QUIT,
	SAVE_ON_SCREENS
}

export const EASY = 0
export const NORMAL = 1
export const HARD = 2
export enum DifficultySetting {
	EASY,
	NORMAL,
	HARD
}

difficulties[DifficultyLevel.SAFE] = new Difficulty()
difficulties[DifficultyLevel.SAFE].name = "Safe"
difficulties[DifficultyLevel.SAFE].description ="The game can be saved any time. However, as in the case of SCP Objects, a Safe classification does not mean that handling it does not pose a threat."
difficulties[DifficultyLevel.SAFE].permaDeath = false
difficulties[DifficultyLevel.SAFE].aggressiveNPCs = false
difficulties[DifficultyLevel.SAFE].saveType = SaveSetting.SAVE_ANYWHERE
difficulties[DifficultyLevel.SAFE].otherFactors = DifficultySetting.EASY
difficulties[DifficultyLevel.SAFE].color = new BColor(120, 150, 50)

difficulties[DifficultyLevel.EUCLID] = new Difficulty()
difficulties[DifficultyLevel.EUCLID].name = "Euclid"
difficulties[DifficultyLevel.EUCLID].description = "In Euclid difficulty, saving is only allowed at specific locations marked by lit up computer screens. Euclid-class objects are inherently unpredictable, so that reliable containment is not always possible."
difficulties[DifficultyLevel.EUCLID].permaDeath = false
difficulties[DifficultyLevel.EUCLID].aggressiveNPCs = false
difficulties[DifficultyLevel.EUCLID].saveType = SaveSetting.SAVE_ON_SCREENS
difficulties[DifficultyLevel.EUCLID].otherFactors = DifficultySetting.NORMAL
difficulties[DifficultyLevel.EUCLID].color = new BColor(200, 200, 0)

difficulties[DifficultyLevel.KETER] = new Difficulty()
difficulties[DifficultyLevel.KETER].name = "Keter"
difficulties[DifficultyLevel.KETER].description = "Keter-class objects are considered the most dangerous ones in Foundation containment. The same can be said for this difficulty level: the SCPs are more aggressive, and you have only one life - when you die, the game is over. "
difficulties[DifficultyLevel.KETER].permaDeath = true
difficulties[DifficultyLevel.KETER].aggressiveNPCs = true
difficulties[DifficultyLevel.KETER].saveType = SaveSetting.SAVE_ON_QUIT
difficulties[DifficultyLevel.KETER].otherFactors = DifficultySetting.HARD
difficulties[DifficultyLevel.KETER].color = new BColor(200, 0, 0)

difficulties[DifficultyLevel.CUSTOM] = new Difficulty()
difficulties[DifficultyLevel.CUSTOM].name = "Custom"
difficulties[DifficultyLevel.CUSTOM].permaDeath = false
difficulties[DifficultyLevel.CUSTOM].aggressiveNPCs = true
difficulties[DifficultyLevel.CUSTOM].saveType = SaveSetting.SAVE_ANYWHERE
difficulties[DifficultyLevel.CUSTOM].customizable = true
difficulties[DifficultyLevel.CUSTOM].otherFactors = DifficultySetting.EASY
difficulties[DifficultyLevel.CUSTOM].color = new BColor(255, 255, 255)

SelectedDifficulty = difficulties[DifficultyLevel.SAFE]
