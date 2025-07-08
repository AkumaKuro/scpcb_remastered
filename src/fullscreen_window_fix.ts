import { CreateBank, FreeBank, PeekInt } from "./Helper/bank"
import { RuntimeError, FlushKeys } from "./Helper/bbhelper"
import { SetBuffer, BackBuffer, Flip, RenderWorld } from "./Helper/graphics"

// -- Declare Windows API constants.
export const C_GWL_STYLE = -16
export const C_WS_POPUP = 0x80000000
export const C_HWND_TOP = 0
export const C_SWP_SHOWWINDOW = 0x0040

// -- Get the width and height of the desktop and place them into these globals.
export var G_desktop_screen_width
export var G_desktop_screen_height
GetDesktopSize()

export var G_viewport_x = 0
export var G_viewport_y = 0
export var G_viewport_width = G_desktop_screen_width
export var G_viewport_height = G_desktop_screen_height

// -- Get the OS handle of the app window.
export var G_app_handle = SystemProperty( "AppHWND" )

if (!Windowed3D()) {
	RuntimeError("FATAL ERROR: Your computer does not support the rendering of 3D graphics within a window.")
}

// == FUNCTIONS ==


export function GetDesktopSize() {
	// Gets the width and height of the desktop on the main monitor and returns them in
	// the globals G_desktop_screen_width and G_desktop_screen_height.
	
	let rectangle = CreateBank( 16 )
	api_GetClientRect( api_GetDesktopWindow(), rectangle )
	G_desktop_screen_width = PeekInt( rectangle, 8 ) - PeekInt( rectangle, 0 )
	G_desktop_screen_height = PeekInt( rectangle, 12 ) - PeekInt( rectangle, 4 )
	FreeBank(rectangle)
}


export function SyncGame() {
	// NOTES:
	// This function should be run immediately before a game session begins and also after resuming from a pause.

	// *** At this point everything should be setup and ready to start/restart the game immediately. ***

	// Reset the input devices.
	MoveMouse(G_viewport_center_x, G_viewport_center_y)
	FlushMouse()
	FlushKeys()
	MouseXSpeed()
	MouseYSpeed()
	MouseHit(1)
	MouseHit(2)
	MouseHit(3)

	// Set and render the backbuffer, and then flip it to the frontbuffer.
	SetBuffer(BackBuffer())
	RenderWorld()
	Flip()

	// Synch the timing. This assumes that the 'G_old_time' global holds the Millisecs() time
	// set at the start of the previous loop and is used with render-tweening or delta-timing.
	G_old_time = MilliSecs()
	
}