import { float, int } from "./bbhelper";

export function Sqr(x: float) : float {return 0}

export function Sin( degrees: float ) : float {return 0}

export function Rand (low_value: int, high_value: int = -1) : int {
    if (high_value == -1) {
        high_value = low_value
        low_value = 0
    }
    return 0
}

export function Abs (number: int) : int {return 0}

export function Sgn (number: number) : int {return 0}