//lib "gdi32.dll"

import { int } from "../Helper/bbhelper"

export function api_AbortDoc(hdc: int) : int {return 0}
export function api_AbortPath(hdc: int) : int {return 0}
export function api_AddFontResource(lpFileName: string) : int {return 0}
export function api_AngleArc(hdc: int, x: int, y: int, dwRadius: int, eStartAngle: int, eSweepAngle: int) : int {return 0}
export function api_AnimatePalette(hPalette: int, wStartIndex: int, wNumEntries: int, lpPaletteColors: int) : int {return 0}
export function api_Arc(hdc: int, X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int, X4: int, Y4: int) : int {return 0}
export function api_ArcTo(hdc: int, X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int, X4: int, Y4: int) : int {return 0}
export function api_BeginPath(hdc: int) : int {return 0}
export function api_BitBlt(hDestDC: int, x: int, y: int, nWidth: int, nHeight: int, hSrcDC: int, xSrc: int, ySrc: int, dwRop: int) : int {return 0}
export function api_CancelDC(hdc: int) : int {return 0}
export function api_CheckColorsInGamut(hdc: int, lpv: int, lpv2: int, dw: int) : int {return 0}
export function api_ChoosePixelFormat(hDC: int, pPixelFormatDescriptor: int) : int {return 0}
export function api_Chord(hdc: int, X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int, X4: int, Y4: int) : int {return 0}
export function api_CloseEnhMetaFile(hdc: int) : int {return 0}
export function api_CloseFigure(hdc: int) : int {return 0}
export function api_CloseMetaFile(hMF: int) : int {return 0}
export function api_ColorMatchToTarget(hdc: int, hdc2: int, dw: int) : int {return 0}
export function api_CombineRgn(hDestRgn: int, hSrcRgn1: int, hSrcRgn2: int, nCombineMode: int) : int {return 0}
export function api_CombineTransform(lpxformResult: int, lpxform1: int, lpxform2: int) : int {return 0}
export function api_CopyEnhMetaFile(hemfSrc: int, lpszFile: string) : int {return 0}
export function api_CopyMetaFile(hMF: int, lpFileName: string) : int {return 0}
export function api_CreateBitmap(nWidth: int, nHeight: int, nPlanes: int, nBitCount: int, lpBits: int) : int {return 0}
export function api_CreateBitmapIndirect(lpBitmap: int) : int {return 0}
export function api_CreateBrushIndirect(lpLogBrush: int) : int {return 0}
export function api_CreateColorSpace(lplogcolorspace: int) : int {return 0}
export function api_CreateCompatibleBitmap(hdc: int, nWidth: int, nHeight: int) : int {return 0}
export function api_CreateCompatibleDC(hdc: int) : int {return 0}
export function api_CreateDC(lpDriverName: string, lpDeviceName: string, lpOutput: string, lpInitData: int) : int {return 0}
export function api_CreateDIBitmap(hdc: int, lpInfoHeader: int, dwUsage: int, lpInitBits: int, lpInitInfo: int, wUsage: int) : int {return 0}
export function api_CreateDIBPatternBrush(hPackedDIB: int, wUsage: int) : int {return 0}
export function api_CreateDIBPatternBrushPt(lpPackedDIB: int, iUsage: int) : int {return 0}
export function api_CreateDIBSection(hDC: int, pBitmapInfo: int, un: int, lplpVoid: int, handle: int, dw: int) : int {return 0}
export function api_CreateDiscardableBitmap(hdc: int, nWidth: int, nHeight: int) : int {return 0}
export function api_CreateEllipticRgn(X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_CreateEllipticRgnIndirect(lpRect: int) : int {return 0}
export function api_CreateEnhMetaFile(hdcRef: int, lpFileName: string, lpRect: int, lpDescription: string) : int {return 0}
export function api_CreateFont(H: int, W: int, E: int, O: int, W2: int, I: int, u: int, S: int, C: int, OP: int, CP: int, Q: int, PAF: int, F: string) : int {return 0}
export function api_CreateFontIndirect(lpLogFont: int) : int {return 0}
export function api_CreateHalftonePalette(hdc: int) : int {return 0}
export function api_CreateHatchBrush(nIndex: int, crColor: int) : int {return 0}
export function api_CreateIC(lpDriverName: string, lpDeviceName: string, lpOutput: string, lpInitData: int) : int {return 0}
export function api_CreateMetaFile(lpString: string) : int {return 0}
export function api_CreatePalette(lpLogPalette: int) : int {return 0}
export function api_CreatePatternBrush(hBitmap: int) : int {return 0}
export function api_CreatePen(nPenStyle: int, nWidth: int, crColor: int) : int {return 0}
export function api_CreatePenIndirect(lpLogPen: int) : int {return 0}
export function api_CreatePolygonRgn(lpPoint: int, nCount: int, nPolyFillMode: int) : int {return 0}
export function api_CreatePolyPolygonRgn(lpPoint: int, lpPolyCounts: int, nCount: int, nPolyFillMode: int) : int {return 0}
export function api_CreateRectRgn(X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_CreateRectRgnIndirect(lpRect: int) : int {return 0}
export function api_CreateRoundRectRgn(X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int) : int {return 0}
export function api_CreateScalableFontResource(fHidden: int, lpszResourceFile: string, lpszFontFile: string, lpszCurrentPath: string) : int {return 0}
export function api_CreateSolidBrush(crColor: int) : int {return 0}
export function api_DeleteColorSpace(hcolorspace: int) : int {return 0}
export function api_DeleteDC(hdc: int) : int {return 0}
export function api_DeleteEnhMetaFile(hemf: int) : int {return 0}
export function api_DeleteMetaFile(hMF: int) : int {return 0}
export function api_DeleteObject(hObject: int) : int {return 0}
export function api_DescribePixelFormat(hDC: int, n: int, un: int, lpPixelFormatDescriptor: int) : int {return 0}
export function api_DPtoLP(hdc: int, lpPoint: int, nCount: int) : int {return 0}
export function api_DrawEscape(hdc: int, nEscape: int, cbInput: int, lpszInData: string) : int {return 0}
export function api_Ellipse(hdc: int, X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_EndDoc(hdc: int) : int {return 0}
export function api_EndPage(hdc: int) : int {return 0}
export function api_EndPath(hdc: int) : int {return 0}
export function api_EnumEnhMetaFile(hdc: int, hemf: int, lpEnhMetaFunc: int, lpData: int, lpRect: int) : int {return 0}
export function api_EnumFontFamilies(hdc: int, lpszFamily: string, lpEnumFontFamProc: int, lParam: int) : int {return 0}
export function api_EnumFontFamiliesEx(hdc: int, lpLogFont: int, lpEnumFontProc: int, lParam: int, dw: int) : int {return 0}
export function api_EnumFonts(hDC: int, lpsz: string, lpFontEnumProc: int, lParam: int) : int {return 0}
export function api_EnumICMProfiles(hdc: int, icmEnumProc: int, lParam: int) : int {return 0}
export function api_EnumMetaFile(hDC: int, hMetafile: int, lpMFEnumProc: int, lParam: int) : int {return 0}
export function api_EnumObjects(hDC: int, n: int, lpGOBJEnumProc: int, lpVoid: int) : int {return 0}
export function api_EqualRgn(hSrcRgn1: int, hSrcRgn2: int) : int {return 0}
export function api_Escape(hdc: int, nEscape: int, nCount: int, lpInData: string, lpOutData: int) : int {return 0}
export function api_ExcludeClipRect(hdc: int, X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_ExtCreatePen(dwPenStyle: int, dwWidth: int, lplb: int, dwStyleCount: int, lpStyle: int) : int {return 0}
export function api_ExtCreateRegion(lpXform: int, nCount: int, lpRgnData: int) : int {return 0}
export function api_ExtEscape(hdc: int, nEscape: int, cbInput: int, lpszInData: string, cbOutput: int, lpszOutData: string) : int {return 0}
export function api_ExtFloodFill(hdc: int, x: int, y: int, crColor: int, wFillType: int) : int {return 0}
export function api_ExtSelectClipRgn(hdc: int, hRgn: int, fnMode: int) : int {return 0}
export function api_ExtTextOut(hdc: int, x: int, y: int, wOptions: int, lpRect: int, lpString: string, nCount: int, lpDx: int) : int {return 0}
export function api_FillPath(hdc: int) : int {return 0}
export function api_FillRgn(hdc: int, hRgn: int, hBrush: int) : int {return 0}
export function api_FixBrushOrgEx(hDC: int, n1: int, n2: int, lpPoint: int) : int {return 0}
export function api_FlattenPath(hdc: int) : int {return 0}
export function api_FloodFill(hdc: int, x: int, y: int, crColor: int) : int {return 0}
export function api_FrameRgn(hdc: int, hRgn: int, hBrush: int, nWidth: int, nHeight: int) : int {return 0}
export function api_GdiComment(hdc: int, cbSize: int, lpData: int) : int {return 0}
export function api_GdiFlush() : int {return 0}
export function api_GdiGetBatchLimit() : int {return 0}
export function api_GdiSetBatchLimit(dwLimit: int) : int {return 0}
export function api_GetArcDirection(hdc: int) : int {return 0}
export function api_GetAspectRatioFilterEx(hdc: int, lpAspectRatio: int) : int {return 0}
export function api_GetBitmapBits(hBitmap: int, dwCount: int, lpBits: int) : int {return 0}
export function api_GetBitmapDimensionEx(hBitmap: int, lpDimension: int) : int {return 0}
export function api_GetBkColor(hdc: int) : int {return 0}
export function api_GetBkMode(hdc: int) : int {return 0}
export function api_GetBoundsRect(hdc: int, lprcBounds: int, flags: int) : int {return 0}
export function api_GetBrushOrgEx(hDC: int, lpPoint: int) : int {return 0}
export function api_GetCharABCWidths(hdc: int, uFirstChar: int, uLastChar: int, lpabc: int) : int {return 0}
export function api_GetCharABCWidthsFloat(hdc: int, iFirstChar: int, iLastChar: int, lpABCF: int) : int {return 0}
export function api_GetCharacterPlacement(hdc: int, lpsz: string, n1: int, n2: int, lpGcpResults: int, dw: int) : int {return 0}
export function api_GetCharWidth(hdc: int, wFirstChar: int, wLastChar: int, lpBuffer: int) : int {return 0}
export function api_GetCharWidth32(hdc: int, iFirstChar: int, iLastChar: int, lpBuffer: int) : int {return 0}
export function api_GetCharWidthFloat(hdc: int, iFirstChar: int, iLastChar: int, pxBuffer: int) : int {return 0}
export function api_GetClipBox(hdc: int, lpRect: int) : int {return 0}
export function api_GetClipRgn(hdc: int, hRgn: int) : int {return 0}
export function api_GetColorAdjustment(hdc: int, lpca: int) : int {return 0}
export function api_GetColorSpace(hdc: int) : int {return 0}
export function api_GetCurrentObject(hdc: int, uObjectType: int) : int {return 0}
export function api_GetCurrentPositionEx(hdc: int, lpPoint: int) : int {return 0}
export function api_GetDCOrgEx(hdc: int, lpPoint: int) : int {return 0}
export function api_GetDeviceCaps(hdc: int, nIndex: int) : int {return 0}
export function api_GetDeviceGammaRamp(hdc: int, lpv: int) : int {return 0}
export function api_GetDIBColorTable(hDC: int, un1: int, un2: int, pRGBQuad: int) : int {return 0}
export function api_GetDIBits(aHDC: int, hBitmap: int, nStartScan: int, nNumScans: int, lpBits: int, lpBI: int, wUsage: int) : int {return 0}
export function api_GetEnhMetaFile(lpszMetaFile: string) : int {return 0}
export function api_GetEnhMetaFileBits(hemf: int, cbBuffer: int, lpbBuffer: int) : int {return 0}
export function api_GetEnhMetaFileDescription(hemf: int, cchBuffer: int, lpszDescription: string) : int {return 0}
export function api_GetEnhMetaFileHeader(hemf: int, cbBuffer: int, lpemh: int) : int {return 0}
export function api_GetEnhMetaFilePaletteEntries(hemf: int, cEntries: int, lppe: int) : int {return 0}
export function api_GetFontData(hdc: int, dwTable: int, dwOffset: int, lpvBuffer: int, cbData: int) : int {return 0}
export function api_GetFontLanguageInfo(hdc: int) : int {return 0}
export function api_GetGlyphOutline(hdc: int, uChar: int, fuFormat: int, lpgm: int, cbBuffer: int, lpBuffer: int, lpmat2: int) : int {return 0}
export function api_GetGraphicsMode(hdc: int) : int {return 0}
export function api_GetICMProfile(hdc: int, dw: int, lpStr: string) : int {return 0}
export function api_GetKerningPairs(hdc: int, cPairs: int, lpkrnpair: int) : int {return 0}
export function api_GetLogColorSpace(hcolorspace: int, lplogcolorspace: int, dw: int) : int {return 0}
export function api_GetMapMode(hdc: int) : int {return 0}
export function api_GetMetaFile(lpFileName: string) : int {return 0}
export function api_GetMetaFileBitsEx(hMF: int, nSize: int, lpvData: int) : int {return 0}
export function api_GetMetaRgn(hdc: int, hRgn: int) : int {return 0}
export function api_GetMiterLimit(hdc: int, peLimit: int) : int {return 0}
export function api_GetNearestColor(hdc: int, crColor: int) : int {return 0}
export function api_GetNearestPaletteIndex(hPalette: int, crColor: int) : int {return 0}
export function api_GetObject(hObject: int, nCount: int, lpObject: int) : int {return 0}
export function api_GetObjectType(hgdiobj: int) : int {return 0}
export function api_GetOutlineTextMetrics(hdc: int, cbData: int, lpotm: int) : int {return 0}
export function api_GetPaletteEntries(hPalette: int, wStartIndex: int, wNumEntries: int, lpPaletteEntries: int) : int {return 0}
export function api_GetPath(hdc: int, lpPoint: int, lpTypes: int, nSize: int) : int {return 0}
export function api_GetPixel(hdc: int, x: int, y: int) : int {return 0}
export function api_GetPixelFormat(hDC: int) : int {return 0}
export function api_GetPolyFillMode(hdc: int) : int {return 0}
export function api_GetRasterizerCaps(lpraststat: int, cb: int) : int {return 0}
export function api_GetRegionData(hRgn: int, dwCount: int, lpRgnData: int) : int {return 0}
export function api_GetRgnBox(hRgn: int, lpRect: int) : int {return 0}
export function api_GetROP2(hdc: int) : int {return 0}
export function api_GetStockObject(nIndex: int) : int {return 0}
export function api_GetStretchBltMode(hdc: int) : int {return 0}
export function api_GetSystemPaletteEntries(hdc: int, wStartIndex: int, wNumEntries: int, lpPaletteEntries: int) : int {return 0}
export function api_GetSystemPaletteUse(hdc: int) : int {return 0}
export function api_GetTextAlign(hdc: int) : int {return 0}
export function api_GetTextCharacterExtra(hdc: int) : int {return 0}
export function api_GetTextCharset(hdc: int) : int {return 0}
export function api_GetTextCharsetInfo(hdc: int, lpSig: int, dwFlags: int) : int {return 0}
export function api_GetTextColor(hdc: int) : int {return 0}
export function api_GetTextExtentExPoint(hdc: int, lpszStr: string, cchString: int, nMaxExtent: int, lpnFit: int, alpDx: int, lpSize: int) : int {return 0}
export function api_GetTextExtentPoint(hdc: int, lpszString: string, cbString: int, lpSize: int) : int {return 0}
export function api_GetTextExtentPoint32(hdc: int, lpsz: string, cbString: int, lpSize: int) : int {return 0}
export function api_GetTextFace(hdc: int, nCount: int, lpFacename: string) : int {return 0}
export function api_GetTextMetrics(hdc: int, lpMetrics: int) : int {return 0}
export function api_GetViewportExtEx(hdc: int, lpSize: int) : int {return 0}
export function api_GetViewportOrgEx(hdc: int, lpPoint: int) : int {return 0}
export function api_GetWindowExtEx(hdc: int, lpSize: int) : int {return 0}
export function api_GetWindowOrgEx(hdc: int, lpPoint: int) : int {return 0}
export function api_GetWinMetaFileBits(hemf: int, cbBuffer: int, lpbBuffer: int, fnMapMode: int, hdcRef: int) : int {return 0}
export function api_GetWorldTransform(hdc: int, lpXform: int) : int {return 0}
export function api_IntersectClipRect(hdc: int, X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_InvertRgn(hdc: int, hRgn: int) : int {return 0}
export function api_LineDDA(n1: int, n2: int, n3: int, n4: int, lpLineDDAProc: int, lParam: int) : int {return 0}
export function api_LineTo(hdc: int, x: int, y: int) : int {return 0}
export function api_LPtoDP(hdc: int, lpPoint: int, nCount: int) : int {return 0}
export function api_MaskBlt(hdcDest: int, nXDest: int, nYDest: int, nWidth: int, nHeight: int, hdcSrc: int, nXSrc: int, nYSrc: int, hbmMask: int, xMask: int, yMask: int, dwRop: int) : int {return 0}
export function api_ModifyWorldTransform(hdc: int, lpXform: int, iMode: int) : int {return 0}
export function api_MoveToEx(hdc: int, x: int, y: int, lpPoint: int) : int {return 0}
export function api_OffsetClipRgn(hdc: int, x: int, y: int) : int {return 0}
export function api_OffsetRgn(hRgn: int, x: int, y: int) : int {return 0}
export function api_OffsetViewportOrgEx(hdc: int, nX: int, nY: int, lpPoint: int) : int {return 0}
export function api_OffsetWindowOrgEx(hdc: int, nX: int, nY: int, lpPoint: int) : int {return 0}
export function api_PaintRgn(hdc: int, hRgn: int) : int {return 0}
export function api_PatBlt(hdc: int, x: int, y: int, nWidth: int, nHeight: int, dwRop: int) : int {return 0}
export function api_PathToRegion(hdc: int) : int {return 0}
export function api_Pie(hdc: int, X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int, X4: int, Y4: int) : int {return 0}
export function api_PlayEnhMetaFile(hdc: int, hemf: int, lpRect: int) : int {return 0}
export function api_PlayEnhMetaFileRecord(hdc: int, lpHandletable: int, lpEnhMetaRecord: int, nHandles: int) : int {return 0}
export function api_PlayMetaFile(hdc: int, hMF: int) : int {return 0}
export function api_PlayMetaFileRecord(hdc: int, lpHandletable: int, lpMetaRecord: int, nHandles: int) : int {return 0}
export function api_PlgBlt(hdcDest: int, lpPoint: int, hdcSrc: int, nXSrc: int, nYSrc: int, nWidth: int, nHeight: int, hbmMask: int, xMask: int, yMask: int) : int {return 0}
export function api_PolyBezier(hdc: int, lppt: int, cPoints: int) : int {return 0}
export function api_PolyBezierTo(hdc: int, lppt: int, cCount: int) : int {return 0}
export function api_PolyDraw(hdc: int, lppt: int, lpbTypes: int, cCount: int) : int {return 0}
export function api_Polygon(hdc: int, lpPoint: int, nCount: int) : int {return 0}
export function api_Polyline(hdc: int, lpPoint: int, nCount: int) : int {return 0}
export function api_PolylineTo(hdc: int, lppt: int, cCount: int) : int {return 0}
export function api_PolyPolygon(hdc: int, lpPoint: int, lpPolyCounts: int, nCount: int) : int {return 0}
export function api_PolyPolyline(hdc: int, lppt: int, lpdwPolyPoints: int, cCount: int) : int {return 0}
export function api_PolyTextOut(hdc: int, pptxt: int, cStrings: int) : int {return 0}
export function api_PtInRegion(hRgn: int, x: int, y: int) : int {return 0}
export function api_PtVisible(hdc: int, x: int, y: int) : int {return 0}
export function api_RealizePalette(hdc: int) : int {return 0}
export function api_Rectangle(hdc: int, X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_RectInRegion(hRgn: int, lpRect: int) : int {return 0}
export function api_RectVisible(hdc: int, lpRect: int) : int {return 0}
export function api_RemoveFontResource(lpFileName: string) : int {return 0}
export function api_ResetDC(hdc: int, lpInitData: int) : int {return 0}
export function api_ResizePalette(hPalette: int, nNumEntries: int) : int {return 0}
export function api_RestoreDC(hdc: int, nSavedDC: int) : int {return 0}
export function api_RoundRect(hdc: int, X1: int, Y1: int, X2: int, Y2: int, X3: int, Y3: int) : int {return 0}
export function api_SaveDC(hdc: int) : int {return 0}
export function api_ScaleViewportExtEx(hdc: int, nXnum: int, nXdenom: int, nYnum: int, nYdenom: int, lpSize: int) : int {return 0}
export function api_ScaleWindowExtEx(hdc: int, nXnum: int, nXdenom: int, nYnum: int, nYdenom: int, lpSize: int) : int {return 0}
export function api_SelectClipPath(hdc: int, iMode: int) : int {return 0}
export function api_SelectClipRgn(hdc: int, hRgn: int) : int {return 0}
export function api_SelectObject(hdc: int, hObject: int) : int {return 0}
export function api_SelectPalette(hdc: int, hPalette: int, bForceBackground: int) : int {return 0}
export function api_SetAbortProc(hDC: int, lpAbortProc: int) : int {return 0}
export function api_SetArcDirection(hdc: int, ArcDirection: int) : int {return 0}
export function api_SetBitmapBits(hBitmap: int, dwCount: int, lpBits: int) : int {return 0}
export function api_SetBitmapDimensionEx(hbm: int, nX: int, nY: int, lpSize: int) : int {return 0}
export function api_SetBkColor(hdc: int, crColor: int) : int {return 0}
export function api_SetBkMode(hdc: int, nBkMode: int) : int {return 0}
export function api_SetBoundsRect(hdc: int, lprcBounds: int, flags: int) : int {return 0}
export function api_SetBrushOrgEx(hdc: int, nXOrg: int, nYOrg: int, lppt: int) : int {return 0}
export function api_SetColorAdjustment(hdc: int, lpca: int) : int {return 0}
export function api_SetColorSpace(hdc: int, hcolorspace: int) : int {return 0}
export function api_SetDeviceGammaRamp(hdc: int, lpv: int) : int {return 0}
export function api_SetDIBColorTable(hDC: int, un1: int, un2: int, pcRGBQuad: int) : int {return 0}
export function api_SetDIBits(hdc: int, hBitmap: int, nStartScan: int, nNumScans: int, lpBits: int, lpBI: int, wUsage: int) : int {return 0}
export function api_SetDIBitsToDevice(hdc: int, x: int, y: int, dx: int, dy: int, SrcX: int, SrcY: int, Scan: int, NumScans: int, Bits: int, BitsInfo: int, wUsage: int) : int {return 0}
export function api_SetEnhMetaFileBits(cbBuffer: int, lpData: int) : int {return 0}
export function api_SetGraphicsMode(hdc: int, iMode: int) : int {return 0}
export function api_SetICMMode(hdc: int, n: int) : int {return 0}
export function api_SetICMProfile(hdc: int, lpStr: string) : int {return 0}
export function api_SetMapMode(hdc: int, nMapMode: int) : int {return 0}
export function api_SetMapperFlags(hdc: int, dwFlag: int) : int {return 0}
export function api_SetMetaFileBitsEx(nSize: int, lpData: int) : int {return 0}
export function api_SetMetaRgn(hdc: int) : int {return 0}
export function api_SetMiterLimit(hdc: int, eNewLimit: int, peOldLimit: int) : int {return 0}
export function api_SetPaletteEntries(hPalette: int, wStartIndex: int, wNumEntries: int, lpPaletteEntries: int) : int {return 0}
export function api_SetPixel(hdc: int, x: int, y: int, crColor: int) : int {return 0}
export function api_SetPixelFormat(hDC: int, n: int, pcPixelFormatDescriptor: int) : int {return 0}
export function api_SetPixelV(hdc: int, x: int, y: int, crColor: int) : int {return 0}
export function api_SetPolyFillMode(hdc: int, nPolyFillMode: int) : int {return 0}
export function api_SetRectRgn(hRgn: int, X1: int, Y1: int, X2: int, Y2: int) : int {return 0}
export function api_SetROP2(hdc: int, nDrawMode: int) : int {return 0}
export function api_SetStretchBltMode(hdc: int, nStretchMode: int) : int {return 0}
export function api_SetSystemPaletteUse(hdc: int, wUsage: int) : int {return 0}
export function api_SetTextAlign(hdc: int, wFlags: int) : int {return 0}
export function api_SetTextCharacterExtra(hdc: int, nCharExtra: int) : int {return 0}
export function api_SetTextColor(hdc: int, crColor: int) : int {return 0}
export function api_SetTextJustification(hdc: int, nBreakExtra: int, nBreakCount: int) : int {return 0}
export function api_SetViewportExtEx(hdc: int, nX: int, nY: int, lpSize: int) : int {return 0}
export function api_SetViewportOrgEx(hdc: int, nX: int, nY: int, lpPoint: int) : int {return 0}
export function api_SetWindowExtEx(hdc: int, nX: int, nY: int, lpSize: int) : int {return 0}
export function api_SetWindowOrgEx(hdc: int, nX: int, nY: int, lpPoint: int) : int {return 0}
export function api_SetWinMetaFileBits(cbBuffer: int, lpbBuffer: int, hdcRef: int, lpmfp: int) : int {return 0}
export function api_SetWorldTransform(hdc: int, lpXform: int) : int {return 0}
export function api_StartDoc(hdc: int, lpdi: int) : int {return 0}
export function api_StartPage(hdc: int) : int {return 0}
export function api_StretchBlt(hdc: int, x: int, y: int, nWidth: int, nHeight: int, hSrcDC: int, xSrc: int, ySrc: int, nSrcWidth: int, nSrcHeight: int, dwRop: int) : int {return 0}
export function api_StretchDIBits(hdc: int, x: int, y: int, dx: int, dy: int, SrcX: int, SrcY: int, wSrcWidth: int, wSrcHeight: int, lpBits: int, lpBitsInfo: int, wUsage: int, dwRop: int) : int {return 0}
export function api_StrokeAndFillPath(hdc: int) : int {return 0}
export function api_StrokePath(hdc: int) : int {return 0}
export function api_SwapBuffers(hDC: int) : int {return 0}
export function api_TextOut(hdc: int, x: int, y: int, lpString: string, nCount: int) : int {return 0}
export function api_TranslateCharsetInfo(lpSrc: int, lpcs: int, dwFlags: int) : int {return 0}
export function api_UnrealizeObject(hObject: int) : int {return 0}
export function api_UpdateColors(hdc: int) : int {return 0}
export function api_WidenPath(hdc: int) : int {return 0}