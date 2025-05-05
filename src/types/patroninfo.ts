export type PatronInfo = {
	TAG_FUNC_O_ID: string
	TAG_FUNC_O_CODE: string
	TAG_FUNC_O_PATH: string
	TAG_FUNC_O: string
	TAG_FUNC_P_ATTND: string
	TAG_FUNC_P_FIRST: string
	TAG_FUNC_P_LAST: string
	TAG_FUNC_P_EMAIL: string
	TAG_NAME: string
	TAG_FUNC_START_T: string
	TAG_FUNC_END_T: string
	TAG_FUNC_LOC_ROO: string
	TAG_FUNC_DATE: string
	TAG_FUNC_LOC_BLD: string
	SISN: string
	TAG_FUNC_P_ID: string
	TAG_FUNC_P_T: string
	BD_ADDRESS: string
	occ1: string
	occ2: string
	TAG_FUNC_P_PAID: any
	TAG_FUNC_DESC: string
}

export const initialPatronInfo: PatronInfo = {
	TAG_FUNC_P_ATTND: '',
	TAG_FUNC_P_FIRST: '',
	TAG_FUNC_P_LAST: '',
	TAG_FUNC_P_EMAIL: '',
	TAG_NAME: '',
	TAG_FUNC_START_T: '',
	TAG_FUNC_END_T: '',
	TAG_FUNC_LOC_ROO: '',
	TAG_FUNC_DATE: '',
	TAG_FUNC_LOC_BLD: '',
	SISN: '',
	TAG_FUNC_P_ID: '',
	TAG_FUNC_P_T: '',
	BD_ADDRESS: '',
	occ1: '',
	occ2: '',
	TAG_FUNC_P_PAID: '',
	TAG_FUNC_DESC: '',
	TAG_FUNC_O_ID: '',
	TAG_FUNC_O_CODE: '',
	TAG_FUNC_O_PATH: '',
	TAG_FUNC_O: '',
}

export const STATUS_TYPE = {
	Invalid: 'Invalid',
	Success: 'Success',
	Confirm: 'Confirm',
	Cancel: 'Cancel',
	OutDate: 'OutDate',
	InList: 'InList', // Already registered
	Full: 'Full', // Fully registered
	Expired: 'Expired',
} as const

export type StatusType = keyof typeof STATUS_TYPE
