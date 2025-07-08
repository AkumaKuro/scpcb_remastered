import {float, int} from './bbhelper.ts'
export function WriteInt(file: int, value: int) {}
export function WriteFile (filename: string) : int {return 0}
export function WriteByte (filehandle: int, mybyte: int) {}
export function ReadLine (filehandle: int) : string {return ''}
export function WriteFloat (filehandle: int, myFloat: float) {}
export function WriteString (filehandle: int, mystring: string) {}
export function TextureName(texture: int) : string {return ''}

export function ReadFile (filename: string) : int {return 0}
export function CloseFile (filehandle: int) {}
export function Eof (filehandle: int) : boolean {return false}

export function WriteLine (filehandle: int, string: string) : string {return ''}
export function FilePos (filehandle: int) : int {return 0}

export function CurrentDir() : string {return ''}

export function CopyFile(from: string, to: string) {}
export function FileSize(filename: string): int {return 0}

export function ReadFloat (filehandle: int) : float {return 0}
export function ReadInt (filehandle: int) : int {return 0}
export function ReadString(filehandle: int) : string {return ''}