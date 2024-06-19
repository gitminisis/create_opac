export interface Cal_event {
	[SISN]: number
	[TAG_NAME]: string
	[TAG_FUNC_DESC]: string
	[TAG_FUNC_LOC]: string
	[TAG_FUNC_LOC_FEE]: string
	[TAG_FUNC_DATE]: string
	[TAG_FUNC_LOC_BAN]: string
	[TAG_FUNC_LOC_AUD]: string
	[TAG_FUNC_CAP]: number
	[TAG_FUNC_RSVP]: string
	[TAG_FUNC_START_T]: string
	[TAG_FUNC_END_T]: string
	[TAG_FUNC_ROOM]: string
	[TAG_FUNC_LANG]: string
	[PATRON]: patron[]
	[TAG_FUNC_ACCESS]: string
}

export interface patron {
	[PATRON]: string
	[TAG_FUNC_P_ID]: string
	[TAG_FUNC_P_FIRST]: string
	[TAG_FUNC_P_LAST]: string
	[TAG_FUNC_P_EMAIL]: string
	[TAG_FUNC_P_PAID]: string
	[TAG_FUNC_P_ATTND]: string
}

export interface Day_obj {
	day: number | null
	month?: number
	year?: number
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTH_REPORT = 'MONTHLY_CALENDAR_NEW_T4'
export const RSVP_CONFIRM_LANDING_PAGE_URL = 'http://donf.minisisinc.com/rsvp_confirm.html'
export const RSVP_CANCEL_LANDING_PAGE_URL = 'http://donf.minisisinc.com/rsvp_cancel.html'
export const MAIN_MWI_APPLICATION = 'M2L_TAG_TO_BIBLIO'
export const SUB_MWI_APPLICATION = 'LIBRARY_LOCATION'
export const CALENDAR_START_MONTH = 1
export const CALENDAR_WEEK_VIEW_DAYS = 7
export const TAG_NAME = 'TAG_NAME'
export const SISN = 'SISN'
export const VERIFICATION_EMAIL_T = 'Please confirm your event:'
export const REG_CONFIMRATION_EMAIL_T = 'Your confirmed for: '
export const CANCEL_CONFIRMATION_EMAIL_T = 'Your registration has been cancelled for: '
//Library Location group
export const LIBRARY_LOCATION_REPORT = 'LIBRARY_LOCATION_REPORT'
export const LIBRARY_LOCATION_XML_TAG = 'LOCATION'
export const BRANCH_NAME = 'BRANCH_NAME'
export const BRANCH_ADDRESS = 'BRANCH_ADDRESS'
export const BRANCH_PHONE = 'BRANCH_PHONE'
//Event location group
export const TAG_FUNC_LOC_GRP = 'TAG_FUNC_LOC_GRP'
export const TAG_FUNC_DESC = 'TAG_FUNC_DESC'
export const TAG_FUNC_LOC = 'TAG_FUNC_LOC'
export const TAG_FUNC_LOC_FEE = 'TAG_FUNC_LOC_FEE'
export const TAG_FUNC_LOC_BAN = 'TAG_FUNC_LOC_BAN'
export const TAG_FUNC_LOC_AUD = 'TAG_FUNC_LOC_AUD'
//Event group by location
export const TAG_FUNC_DTE_GRP = 'TAG_FUNC_DTE_GRP'
export const TAG_FUNC_DATE = 'TAG_FUNC_DATE'
export const TAG_FUNC_START_T = 'TAG_FUNC_START_T'
export const TAG_FUNC_END_T = 'TAG_FUNC_END_T'
export const TAG_FUNC_RSVP = 'TAG_FUNC_RSVP'
export const TAG_FUNC_CAP = 'TAG_FUNC_CAP'
export const TAG_FUNC_ROOM = 'TAG_FUNC_ROOM'
export const TAG_FUNC_LANG = 'TAG_FUNC_LANG'
//Patron group by event
export const FUNC_LOC_P_GRP = 'FUNC_LOC_P_GRP'
export const PATRON = 'PATRON'
export const TAG_FUNC_P_ID = 'TAG_FUNC_P_ID'
export const TAG_FUNC_P_FIRST = 'TAG_FUNC_P_FIRST'
export const TAG_FUNC_P_LAST = 'TAG_FUNC_P_LAST'
export const TAG_FUNC_P_EMAIL = 'TAG_FUNC_P_EMAIL'
export const TAG_FUNC_P_PAID = 'TAG_FUNC_P_PAID'
export const TAG_FUNC_P_ATTND = 'TAG_FUNC_P_ATTND'
export const TAG_FUNC_ACCESS = 'TAG_FUNC_ACCESS'
export const EVENT_RSVP_YES = 'X'
//Others
export const TAG_FUNC_P_ATTND_DEFAULT = 1
export const TAG_FUNC_P_ATTND_MAX = 4
export const TAG_FUNC_DTE_LIST = 'list'
export const TAG_FUNC_LOC_LENGTH = -7
export const TAG_NAME_LENGTH = 18
export const COLORS_MAP = {
	RED: 'bg-red-500 border-red-500',
	YELLOW: 'bg-yellow-500 border-yellow-500',
	GREEN: 'bg-green-500 border-green-500',
	ORANGE: 'bg-orange-500 border-orange-500',
	PURPLE: 'bg-purple-500 border-purple-500',
	GREY: 'bg-neutral-500 border-neutral-500',
	PINK: 'bg-pink-500 border-pink-500',
	INDIGO: 'bg-sky-900 border-sky-900',
}
//For RSVP
export const MWI_RESFUL_RES = 'MWI-RESTful-response'
export const SUCCESS_RES_CODE = 0
export const MWI_XML_DATA_INDEX = 0
export const NON_LOGIN_USER_TYPE = 'NOLOGIN'
//For RSVP LOG
export const TAG_RSVP_PATRON_LOG = 'TAG_RSVP_PATRON_LOG'
export const TAG_FUNC_P_T = 'TAG_FUNC_P_T'
export const TAG_P_STATUS = 'TAG_P_STATUS'

export const ICON_SHAPE_MAP = {
	SQUARE: 'rounded',
	CIRCLE: 'rounded-full',
}

export type ContactInfo = {
	[BRANCH_NAME]: string
	[BRANCH_ADDRESS]: string
	[BRANCH_PHONE]: string
}

export const RSVP_LOG_P_STATUS = {
	CONFIRM: 'CONFIRM',
	CANCEL: 'CANCEL',
}

export const FILTER_TYPE_COLORS = [
	{
		type: 'Delhi Branch',
		color: COLORS_MAP['INDIGO'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
	{
		type: 'PORT DOVER BRANCH',
		color: COLORS_MAP['YELLOW'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
	{
		type: 'Port Rowan Branch',
		color: COLORS_MAP['GREEN'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
	{
		type: 'Simcoe Branch',
		color: COLORS_MAP['ORANGE'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
	{
		type: 'Waterford Branch',
		color: COLORS_MAP['PURPLE'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
	{
		type: 'Norview Lodge Site',
		color: COLORS_MAP['PINK'],
		icon: ICON_SHAPE_MAP['SQUARE'],
	},
]