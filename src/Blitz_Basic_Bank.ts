// <summary>Pokes a NULL terminated string to a bank.</summary>
// <param name="bankHandle">Bank handle to poke to.</param>
// <param name="offset">Offset in bytes that the poke operation will be started at.</param>
// <param name="value">The string to poke.</param>
// <remarks>If the end of the bank is reached, string will still end with a NULL byte.</remarks>

import { BankSize, Hex, PeekByte, PokeByte } from "./Helper/bank"
import { Chr, DebugLog, int, range } from "./Helper/bbhelper"
import { Len, Asc, Mid, Right } from "./Helper/strings"

// <subsystem>Blitz.Bank</subsystem>
export function PokeString(bankHandle: int, offset: int, value: string) {
	
	let stringPos		= 1
	let bankPos		= offset + stringPos - 1
	let bankLength	= BankSize(bankHandle) - 1
	
	while ((stringPos <= Len(value)) && (bankPos < bankLength)) {
		PokeByte (bankHandle, bankPos, Asc(Mid(value, stringPos, 1)))
		
		// Move to next char
		bankPos 	= bankPos + 1
		stringPos 	= stringPos + 1
	}
	
	// Add the null byte to end of string
	PokeByte (bankHandle, bankPos, 0)
	
}

// <summary>Reads a string from a memory bank.</summary>
// <param name="bankHandle">Bank handle to peek from.</param>
// <param name="offset">Offset in bytes that the peek operation will be started at.</param>
// <returns>The Peeked string.</returns>
// <subsystem>Blitz.Bank</subsystem>
export function PeekString(bankHandle: int, offset: int) : string {
	
	let bankPos		= offset
	let bankLength	= BankSize(bankHandle)
	let peekedString: string = ""
	let endFound: boolean = false
	let currentByte	= 0
	
	while ((bankPos < bankLength) && !endFound) {
		
		currentByte	= PeekByte(bankHandle, bankPos)
		
		if (currentByte == 0) {
			endFound = true
		} else {
			peekedString = peekedString + Chr(currentByte)
		}
		
		bankPos = bankPos + 1
	}
	
	return peekedString
	
}

// <summary>Dumps the contents of a bank to the debuglog. Useful for examining the contents of a bank.</summary>
// <param name="bankHandle">Handle of the bank to dump.</param>
// <param name="rowSize">Optional value to control the length of a dumped row.</param>
// <subsystem>Blitz.Bank</subsystem>
export function DumpBank(bankHandle: int, rowSize: int = 16) {
	
	let dumpString: string	= ""
	let ascString: string	= ""
	
	// Header
	DebugLog("Bank Size: " + BankSize(bankHandle))
	for (let i of range(BankSize(bankHandle))) {
		
		// Dump is raw data (as hex), asc is the ascii data
		dumpString = dumpString + Right(Hex(PeekByte(bankHandle, i)), 2) + " "
		ascString	= ascString + Chr(PeekByte(bankHandle, i))
		
		// Dump the line if we're at the end of the row
		if (i % rowSize == rowSize - 1) {
			DebugLog(dumpString + "   " + ascString)
			dumpString = ""
			ascString = ""
		}
	}
	
	// Any extra data not dumped.
	DebugLog (dumpString + "   " + ascString)	
}