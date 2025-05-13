export interface Cal_event {
	[TAG_FUNC_LOC_ID]: string
	[SISN]: number
	[TAG_NAME]: string
	[TAG_FUNC_LOC_DEC]: string
	[TAG_FUNC_LOC_BLD]: string
	[TAG_FUNC_LOC_FEE]: string
	[TAG_FUNC_DATE]: string
	[TAG_FUNC_LOC_BAN]: string
	[TAG_FUNC_LOC_AUD]: string
	[TAG_FUNC_LOC_CAP]: number
	[TAG_FUNC_RSVP]: string
	[TAG_FUNC_START_T]: string
	[TAG_FUNC_END_T]: string
	[TAG_FUNC_LOC_ROO]: string
	[TAG_FUNC_LANG]: string
	[PATRON]: patron[]
	[TAG_FUNC_ACCESS]: string
	[TAG_FUNC_CANCEL]: string
	[TAG_FUNC_CAN_RES]: string
	[TAG_DB_TYPE]: string
	[TAG_FUNC_LOC_CT]: string
	[TAG_FUNC_LOC_EM]: string
	[FLOC_IM_REF_GRP]: any
	[FLOC_TX_ACCESS]: string
	[FLOC_VD_REF_GRP]: any
	[TAG_FUNC_O_PATH]: string
	[TAG_FUNC_O]: string
	[TAG_FUNC_O_ID]: string
	[TAG_FUNC_O_PATH]: string
	[TAG_FUNC_O_CODE]: string
	[TAG_FUNC_LOC_MAX]: string
}

// export type ImageProps = {
// 	[TAG_FUNC_LOC_MT]: string
// 	[TAG_FUNC_LOC_MD]: string
// 	[TAG_FUNC_LOC_TH]: string // Thumbnail
// }

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
export type FilterType = { type: string; color: string; icon: string }
export const EVENT_ARCHIVE_COLOR = 'bg-minisis-archives border-minisis-archives'
export const EVENT_MUSEUM_COLOR = 'bg-minisis-museum border-minisis-museum'

//DB
export const MAIN_EVENT_CAL_DB = 'CALENDAR_VAL_SYN'
export const MAIN_EVENT_CAL_LOG_DB = 'TAG_RSVP_PATRON_LOG_SYN'
export const MAIN_EVENT_CAL_DB_SYN = 'CALENDAR_VAL_SYN'
//MINISIS REPORT
export const MONTH_REPORT = 'MONTHLY_CALENDAR'
export const LOCATION_REPORT = 'CALENDAR_LOCATION'
//MWI
export const MAIN_MWI_APPLICATION = 'WEB_CALENDAR'
export const SUB_MWI_APPLICATION = 'WEB_CALENDAR_LOC'
export const RSVP_CONFIRM_LANDING_PAGE_URL = `${window.location.protocol}//${window.location.hostname}/rsvp-confirm.html`
export const RSVP_CANCEL_LANDING_PAGE_URL = `${window.location.protocol}//${window.location.hostname}/rsvp-cancel.html`
export const CALENDAR_START_MONTH = 1
export const CALENDAR_WEEK_VIEW_DAYS = 7
export const SISN = 'SISN'
//Library Location group (From LIBRARY_LOCATION_NEW report)
export const TAG_NAME = 'TAG_NAME'
export const TAG_DB_TYPE = 'TAG_DB_TYPE'
export const LIBRARY_LOCATION_XML_TAG = 'record'
export const CURATORS_CODE = 'CURATORS_CODE'
export const BD_ADDRESS = 'BD_ADDRESS'
export const BD_CITY = 'BD_CITY'
export const BD_POSTAL_CODE = 'BD_POSTAL_CODE'
export const BD_BUILDING_NAME = 'BD_BUILDING_NAME'
//Event location group
export const TAG_FUNC_LOC_ID = 'TAG_FUNC_LOC_ID'
export const TAG_FUNC_LOC_GRP = 'TAG_FUNC_LOC_GRP'
export const TAG_FUNC_LOC_DEC = 'TAG_FUNC_LOC_DEC'
export const TAG_FUNC_LOC_BLD = 'TAG_FUNC_LOC_BLD'
export const TAG_FUNC_LOC_FEE = 'TAG_FUNC_LOC_FEE'
export const TAG_FUNC_LOC_BAN = 'TAG_FUNC_LOC_BAN'
export const TAG_FUNC_LOC_AUD = 'TAG_FUNC_LOC_AUD'
export const TAG_FUNC_LOC_CAP = 'TAG_FUNC_LOC_CAP'
export const TAG_FUNC_LOC_ROO = 'TAG_FUNC_LOC_ROO'
export const TAG_FUNC_LOC_MAX = 'TAG_FUNC_LOC_MAX'
export const TAG_FUNC_LOC_CT = 'TAG_FUNC_LOC_CT'
export const TAG_FUNC_LOC_EM = 'TAG_FUNC_LOC_EM'
//ONLINE
export const TAG_FUNC_O = 'TAG_FUNC_O'
export const TAG_FUNC_O_PATH = 'TAG_FUNC_O_PATH'
export const TAG_FUNC_O_ID = 'TAG_FUNC_O_ID'
export const TAG_FUNC_O_CODE = 'TAG_FUNC_O_CODE'
//TDR FIELD
export const FLOC_IM_REF_GRP = 'FLOC_IM_REF_GRP'
export const FLOC_TX_ACCESS = 'FLOC_TX_ACCESS'
export const FLOC_VD_REF_GRP = 'FLOC_VD_REF_GRP'
//Event group by location
export const TAG_FUNC_DTE_GRP = 'TAG_FUNC_DTE_GRP'
export const TAG_FUNC_DATE = 'TAG_FUNC_DATE'
export const TAG_FUNC_START_T = 'TAG_FUNC_START_T'
export const TAG_FUNC_END_T = 'TAG_FUNC_END_T'
export const TAG_FUNC_RSVP = 'TAG_FUNC_RSVP'
export const TAG_FUNC_LANG = 'TAG_FUNC_LANG'
export const TAG_FUNC_CANCEL = 'TAG_FUNC_CANCEL'
export const TAG_FUNC_CAN_RES = 'TAG_FUNC_CAN_RES'
export const BD_DIS_ACC = 'BD_DIS_ACC'
export const BD_DIS_ACC_TYPE = 'BD_DIS_ACC_TYPE'
export const BD_DIS_ACC_DETAI = 'BD_DIS_ACC_DETAI'
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
export const FUNC_LOC_M_GRP = 'FUNC_LOC_M_GRP'
export const TAG_FUNC_LOC_MT = 'TAG_FUNC_LOC_MT'
export const TAG_FUNC_LOC_MD = 'TAG_FUNC_LOC_MD'
//Others
export const EVENT_EMAIL_LOGO = ''
export const EVENT_CANCEL_NOTI_MODAL_BG = 'bg-red-800'
export const TAG_FUNC_P_CONFIRM_EXP_HOURS = 24
export const TAG_FUNC_P_ATTND_DEFAULT = 1
export const TAG_FUNC_P_ATTND_MAX = 4
export const TAG_FUNC_DTE_LIST = 'list'
export const TAG_FUNC_LOC_LENGTH = -7
export const TAG_NAME_LENGTH = 18 // for event accordian view button
//For RSVP
export const MWI_RESFUL_RES = 'MWI-RESTful-response'
export const SUCCESS_RES_CODE = 0
export const MWI_XML_DATA_INDEX = 0
export const NON_LOGIN_USER_TYPE = 'NOLOGIN'
//For RSVP LOG
export const TAG_FUNC_P_T = 'TAG_FUNC_P_T'
export const TAG_P_STATUS = 'TAG_P_STATUS'

export type ContactInfoRSVP = {
	[CURATORS_CODE]: string
	[BD_ADDRESS]: string
	[BD_CITY]: string
}

export const RSVP_LOG_P_STATUS = {
	CONFIRM: 'CONFIRM',
	CANCEL: 'CANCEL',
}

export const ICON_SHAPE_MAP = {
	SQUARE: 'rounded',
	CIRCLE: 'rounded-full',
}

export const MEDIA_TYPE = {
	VIDEO: 'FLOC_VD_ACCESS',
	IMAGE: 'FLOC_IM_ACCESS',
}

export const RSVP_MAP = {
	YES: 'Yes',
	NO: 'No',
	BLANK: 'blank',
}

// export const COLORS_MAP = {
// 	RED: 'bg-red-500 border-red-500',
// 	YELLOW: 'bg-yellow-500 border-yellow-500',
// 	GREEN: 'bg-green-500 border-green-500',
// 	ORANGE: 'bg-orange-500 border-orange-500',
// 	PURPLE: 'bg-purple-500 border-purple-500',
// 	GREY: 'bg-neutral-500 border-neutral-500',
// 	PINK: 'bg-pink-500 border-pink-500',
// 	INDIGO: 'bg-sky-900 border-sky-900',
// }

// export const FILTER_OPTION = 'TAG_FUNC_LOC_BLD'
// export const FILTER_TYPE_COLORS = [
// 	{
// 		type: 'Delhi Branch',
// 		color:'bg-neutral-500 border-neutral-500',
// 		icon: 'rounded',
// 	},
// 	{
// 		type: 'MERKENICH',
// 		color: 'bg-sky-900 border-sky-900',
// 		icon: 'rounded',
// 	},
// ]
