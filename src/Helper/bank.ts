import { int } from "./bbhelper";

export function FreeBank (bank: int) {}

export function CreateBank (size: int = -1) : int {return 0}

export function PokeInt (bank: int,offset: int,value: int) {}
export function PeekInt(bank: int,offset: int) : int {return 0}

export function BankSize(bankhandle: int) : int { return 0 }

export function PokeByte (bank: int,offset: int,value: int) {}
export function PeekByte(bank: int,offset: int) : int {return 0}

export function Hex(integer: int) : string {return ''}

export function ResizeBank(bankhandle: int,new_size: int) {}