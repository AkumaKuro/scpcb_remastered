

// --------------------------------------------------
// -- API Functions
// --------------------------------------------------

import { range } from "./Helper/bbhelper"
import { Right, Left, Len, Replace, Mid } from "./Helper/strings"

// File_GetDirName
// File_GetFileName
// File_GetExtension

// <summary>Returns the directory name component of path.</summary>
// <param name="path">The path to use.</param>
// <remarks>A version of PHP's "dirname" function.</remarks>
// <returns>The directory name from a path.</returns>
// <example>File_GetDirName$("c:\my-dir\another-dir\file.txt") will return ""c:\my-dir\another-dir\"</example>
// <subsystem>Blitz.File</subsystem>
export function File_GetDirName(path: string): string {
	// Strip trailing slashes & return the part of the path that isn't the filename
	if (Right(path, 1) == "/" || Right(path, 1) == "\\") {
		path = Left(path, Len(path) - 1)
	}
	return Left(path, Len(path) - Len(File_GetFileName(path)))
}

// <summary>Returns the file name component of a path.</summary>
// <param name="path">The path to use.</param>
// <remarks>A version of PHP's "basename" function.</remarks>
// <returns>The file name from a path, or "" if not found</returns>
// <example>File_GetFileName$("c:\my-dir\another-dir\file.txt") will return "file.txt"</example>
// <subsystem>Blitz.File</subsystem>
export function File_GetFileName(path: string): string {
	
	if (path = "") {return ""}
	
	let fileName: string	= File_SplitAfterChar(File_ConvertSlashes(path), "/")
	if (fileName == "") {
		fileName = path
	}
	
	return fileName
}

// <summary>Returns the extension part of a filename.</summary>
// <param name="fileName">The file name to get the extension of.</param>
// <remarks>Will return text after the final "." character.</remarks>
// <returns>The file extension found, or "" if not found.</returns>
// <example>File_GetFileName$("c:\my-dir\another-dir\file.txt") will return "txt"</example>
// <subsystem>Blitz.File</subsystem>
export function File_GetExtension(fileName$) : string {
	return File_SplitAfterChar(File_ConvertSlashes(fileName$), ".")
}

// --------------------------------------------------
// -- Utility Functions
// --------------------------------------------------

// <summary>Convert backslashes in a filename to forward slashes.</summary>
// <param name="fileName">The filename to convert.</param>
// <returns>Filename with only forward slashes.</returns>
// <subsystem>Blitz.File</subsystem>
function File_ConvertSlashes(fileName: string): string {
	return Replace(fileName, "\\", "/")
}

// <summary>Gets the remainder of a string after the last instance of a character "char" has been reached.</summary>
// <param name="fileName">The file name to split.</param>
// <param name="char">The character to look for.</param>
// <returns>The remainder of the string after char, or "" if not found.</returns>
// <subsystem>Blitz.File</subsystem>
function File_SplitAfterChar(fileName: string, char: string): string {
	
	let afterChar: string	= ""
	
	// Start at the end of the name, and look for the char
	for (let stringPos of range(Len(fileName), 0, -1)) {
		if (Mid(fileName, stringPos, 1) == char) {
			afterChar = Right(fileName, Len(fileName) - stringPos)
			break
		}
	}
	
	return afterChar	
}