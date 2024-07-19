export type PatronInfo = {
	TAG_FUNC_P_ATTND: string
	TAG_FUNC_P_FIRST: string
	TAG_FUNC_P_LAST: string
	TAG_FUNC_P_EMAIL: string
	TAG_NAME: string
	TAG_FUNC_START_T: string
	TAG_FUNC_END_T: string
	TAG_FUNC_ROOM: string
	TAG_FUNC_DATE: string
	TAG_FUNC_LOC: string
	SISN: string
	TAG_FUNC_P_ID: string
	TAG_FUNC_P_T: string
	BRANCH_ADDRESS: string
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
	TAG_FUNC_ROOM: '',
	TAG_FUNC_DATE: '',
	TAG_FUNC_LOC: '',
	SISN: '',
	TAG_FUNC_P_ID: '',
	TAG_FUNC_P_T: '',
	BRANCH_ADDRESS: '',
	occ1: '',
	occ2: '',
	TAG_FUNC_P_PAID: '',
	TAG_FUNC_DESC: '',
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
