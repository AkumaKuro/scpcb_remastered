//lib "FreeImage.dll"

import { int } from "../Helper/bbhelper";

export function FI_Allocate( Width: int,Height: int,BPP: int,RedMask: int,GreenMask: int,BlueMask: int ) : int {return 0}
export function FI_Load( ImageType: int,File: string,Mode: int ) : int {return 0}
export function FI_Save( ImapeType: int,FIBITMAP: int,File: string,Flags: int ) : int {return 0}
export function FI_Unload( FIBITMAP: int ) : int {return 0}
export function FI_GetFIFDescription( FREE_IMAGE_FORMAT: int ) : string {return ''}
export function FI_GetFileType( File: string,Default: int ) : int {return 0}
export function FI_ConvertToRawBits( Bank: int,FIBITMAP: int,Pitch: int,Depth: int,Red_Mask: int,Green_Mask: int,Blue_Mask: int,TopDown: int ) {}
export function FI_ConvertToRawBits3D( Pointer,FIBITMAP: int,Pitch: int,Depth: int,Red_Mask: int,Green_Mask: int,Blue_Mask: int,TopDown: int ) {}
export function FI_GetFIFFromFilename( File: string ) : int {return 0}
export function FI_GetColorsUsed( FIBITMAP: int ) : int {return 0}
export function FI_GetBits( FIBITMAP: int ) : int {return 0}
export function FI_GetLine( FIBITMAP: int,ScanLine: int ) : int {return 0}
export function FI_GetBPP( FIBITMAP: int ) : int {return 0}
export function FI_GetWidth( FIBITMAP: int ) : int {return 0}
export function FI_GetHeight( FIBITMAP: int ) : int {return 0}
export function FI_GetPitch( FIBITMAP: int ) : int {return 0}
export function FI_GetDIBSize( FIBITMAP: int ) : int {return 0}
export function FI_GetPalette( FIBITMAP: int ) : int {return 0}
export function FI_GetDotsPerMeterX( FIBITMAP: int ) : int {return 0}
export function FI_GetDotsPerMeterY( FIBITMAP: int ) : int {return 0}
export function FI_GetInfoHeader( FIBITMAP: int ) : int {return 0}
export function FI_GetInfo( FIBITMAP: int ) : int {return 0}
export function FI_GetColorType( FIBITMAP: int ) : int {return 0}
export function FI_GetRedMask( FIBITMAP: int ) : int {return 0}
export function FI_GetGreenMask( FIBITMAP: int ) : int {return 0}
export function FI_GetBlueMask( FIBITMAP: int ) : int {return 0}
export function FI_GetTransparencyCount( FIBITMAP: int ) : int {return 0}
export function FI_GetTransparencyTable( FIBITMAP: int ) : int {return 0}
export function FI_SetTransparencyTable( FIBITMAP: int,Table: int,Size ) : int {return 0}
export function FI_SetTransparent( FIBITMAP: int,Flag: int ) {}
export function FI_IsTransparent( FIBITMAP: int ) : int {return 0}
export function FI_ConvertTo8Bits( FIBITMAP: int ) : int {return 0}
export function FI_ConvertTo16Bits555( FIBITMAP: int ) : int {return 0}
export function FI_ConvertTo16Bits565( FIBITMAP: int ) : int {return 0}
export function FI_ConvertTo24Bits( FIBITMAP: int ) : int {return 0}
export function FI_ConvertTo32Bits( FIBITMAP: int ) : int {return 0}
export function FI_ColorQuantize( FIBITMAP: int,Flag: int ) : int {return 0}
export function FI_Threshold( FIBITMAP: int,Flag: int ) : int {return 0}
export function FI_Dither( FIBITMAP: int,Algo: int ) : int {return 0}
export function FI_ConvertFromRawBits( Bank: int,Width: int,Height: int,Pitch: int,Depth: int,RedMask: int,GreenMask: int,BlueMask: int,TopDown: int ) : int {return 0}
export function FI_ConvertFromRawBits3D( Pointer,Width: int,Height: int,Pitch: int,Depth: int,RedMask: int,GreenMask: int,BlueMask: int,TopDown: int ) : int {return 0}
export function FI_Clone(DIB: int) : int {return 0}
export function FI_FIFSupportsReading( FREE_IMAGE_FORMAT: int ) : int {return 0}
export function FI_FIFSupportsWriting( FREE_IMAGE_FORMAT: int ) : int {return 0}
export function FI_FIFSupportsExportBPP( FREE_IMAGE_FORMAT: int, BPP: int ) : int {return 0}
export function FI_ZLibCompress( BankOut: int,BSizeOut: int,BankIn: int,BSizeIn: int ) : int {return 0}
export function FI_ZLibUncompress( BankOut: int,BSizeOut: int,BankIn: int,BSizeIn: int ) : int {return 0}
export function FI_RotateClassic( FIBITMAP: int,Angle: int ) : int {return 0}
export function FI_RotateEx( FIBITMAP: int,Angle: int,Shiftx: int,Shifty: int,offx: int,offy: int,Masked: int ) : int {return 0}
export function FI_FlipHorizontal( FIBITMAP: int ) : int {return 0}
export function FI_FlipVertical( FIBITMAP: int ) : int {return 0}
export function FI_Rescale( FIBITMAP: int,Width: int,Height: int,Filter: int ) : int {return 0}
export function FI_AdjustCurve( FIBITMAP: int,Bank: int,Channel: int ) : int {return 0}
export function FI_AdjustGamma( FIBITMAP: int,Gamma: int ) : int {return 0}
export function FI_AdjustBrightness( FIBITMAP: int,Percent: int ) : int {return 0}
export function FI_AdjustContrast( FIBITMAP: int,Percent: int ) : int {return 0}
export function FI_Invert( FIBITMAP: int ) : int {return 0}
export function FI_GetHistogram( FIBITMAP: int,Bank: int,Channel: int ) : int {return 0}
export function FI_GetChannel( FIBITMAP: int,Channel: int ) : int {return 0}
export function FI_SetChannel( FIBITMAP: int, FIBITMAP8: int, Channel: int ) : int {return 0}
export function FI_Copy( FIBITMAP: int,XA: int,XB: int,YA: int,YB: int ) : int {return 0}
export function FI_Paste( FIBITMAP: int,X: int,Y: int,Alpha: int ) : int {return 0}
export function FI_GetVersion() : string {return ''}

//lib "kernel32.dll"
export function RtlMoveMemory_To(Destination: int,Source: int,Length: int) : int {return 0}
export function RtlMoveMemory_From(Destination: int,Source: int,Length: int) : int {return 0}
export function RtlMoveMemory_Ex(Destination: int,Source: int,Length: int) : int {return 0}