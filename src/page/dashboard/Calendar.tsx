import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import {
	FUNC_LOC_P_GRP,
	MAIN_EVENT_CAL_DB,
	MWI_RESFUL_RES,
	MWI_XML_DATA_INDEX,
	SISN,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC_BLD,
	TAG_FUNC_LOC_GRP,
	TAG_FUNC_P_ATTND,
	TAG_FUNC_START_T,
	TAG_NAME,
} from '@/components/common/event-calendar/Constants'
import RadixAlertDialog from '@/components/common/RadixAlertDialog'
import PatronLayout from '@/components/layouts/patron'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import useJSONData from '@/hooks/useJSONData'
import {
	convertToArr,
	convertXMLToJson,
	getCookieValue,
	getHomeSessionID,
	isDatePast,
} from '@/lib/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'

interface TagFunction {
	[key: string]: any
}

interface PatronInfo {
	sisn: string
	tag_name: string
	tag_func_loc: string
	tag_func_date: string
	tag_func_start_t: string
	tag_func_end_t: string
	tag_func_p_email: string
	tag_func_p_id: string
	_hidden: string
}

const Calendar = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const message = useConstants().message
	let HOME_SESSID = getHomeSessionID()
	const { logo } = useConstants().config
	const rsvp = useConstants().rsvp

	const columns: ColumnDef<ProfileData>[] = [
		{
			accessorKey: TAG_NAME.toLocaleLowerCase(),
			header: message.event,
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue(TAG_NAME.toLocaleLowerCase())}</div>
			),
		},
		{
			accessorKey: TAG_FUNC_DATE.toLocaleLowerCase(),
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						{message.date}
						<CaretSortIcon className="h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue(TAG_FUNC_DATE.toLocaleLowerCase())}</div>
			),
		},
		{
			accessorKey: TAG_FUNC_START_T.toLocaleLowerCase(),
			header: message.start,
			cell: ({ row }) => <div>{row.getValue(TAG_FUNC_START_T.toLocaleLowerCase())}</div>,
		},
		{
			accessorKey: TAG_FUNC_END_T.toLocaleLowerCase(),
			header: message.end,
			cell: ({ row }) => <div>{row.getValue(TAG_FUNC_END_T.toLocaleLowerCase())}</div>,
		},
		{
			accessorKey: TAG_FUNC_LOC_BLD.toLocaleLowerCase(),
			header: message.location,
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue(TAG_FUNC_LOC_BLD.toLocaleLowerCase())}</div>
			),
		},
		{
			accessorKey: TAG_FUNC_P_ATTND.toLocaleLowerCase(),
			header: message.attendee,
			cell: ({ row }) => (
				<div className="capitalize">
					{row.getValue(TAG_FUNC_P_ATTND.toLocaleLowerCase())}
				</div>
			),
		},
		{
			accessorKey: ' ',
			header: '',
			cell: ({ cell }) => {
				return (
					<RadixAlertDialog
						DeleteButton={
							<button
								className="inline-flex h-[35px] items-center justify-center rounded bg-red4 px-[15px] font-medium leading-none text-red11 outline-none hover:bg-red5 focus:shadow-[0_0_0_2px] focus:shadow-red7"
								onClick={() =>
									cancelEvent(cell.row.original, cell.row.original.sisn)
								}>
								{message.yes} {message.cancel}
							</button>
						}
						InitialButton={
							<Button
								variant={'danger'}
								disabled={isDatePast(cell.row.original.tag_func_date)}>
								{message.cancel}
							</Button>
						}
					/>
				)
			},
		},
	]

	const cancelEvent = async (patronInfo: any, sisnValue: number) => {
		getOCCNumber(patronInfo, sisnValue)
			.then((res) => removeRecord(res))
			.then((res) => sendCancelConfirmEmail(res))
	}

	const getOCCNumber = async (patronInfo: PatronInfo, sisnValue: number) => {
		return await axios
			.post(
				`${HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_DB}&READ=Y&KEY=${SISN}&VALUE=${sisnValue}`,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
					timeout: 5000,
				}
			)
			.then(async (res) => {
				const conToJson: any = await convertXMLToJson(res.data)
				const jsonObj = conToJson[MWI_RESFUL_RES].record
				const loc_group = convertToArr(jsonObj?.TAG_FUNC_LOC_GRP)
				const dte_group = convertToArr(loc_group[MWI_XML_DATA_INDEX]?.TAG_FUNC_DTE_GRP)
				let TAG_FUNC_LOC_OCC = 0
				let TAG_FUNC_DTE_OCC = 0

				loc_group?.forEach((elm) => {
					const funcLoc = elm?.TAG_FUNC_LOC_BLD
					if (funcLoc === patronInfo['tag_func_loc']) {
						TAG_FUNC_LOC_OCC = elm._occ // regards as Occurence number of the repeating field
					}
				})
				dte_group?.forEach((elm) => {
					const funcDate = elm?.TAG_FUNC_DATE
					const funcTimeStart = elm?.TAG_FUNC_START_T
					if (
						funcDate === patronInfo['tag_func_date'] &&
						funcTimeStart === patronInfo['tag_func_start_t']
					) {
						TAG_FUNC_DTE_OCC = elm._occ
					}
				})

				return { occ1: TAG_FUNC_LOC_OCC, occ2: TAG_FUNC_DTE_OCC, patronInfo }
			})
			.catch((error) => {
				console.error('Getting record error', error)
				return { occ1: 0, occ2: 0 }
			})
	}

	const removeRecord = async (eventInfo: any) => {
		let { tag_func_p_id, sisn } = eventInfo.patronInfo
		let xmlFormDelete = `<?xml version="1.0" encoding="UTF-8"?>
    <RECORD>
      <${TAG_FUNC_LOC_GRP} occ="${eventInfo?.occ1}" op="chg">
        <${TAG_FUNC_DTE_GRP} occ="${eventInfo?.occ2}" op="chg">
          <${FUNC_LOC_P_GRP} op="del" search="${tag_func_p_id}">
          </${FUNC_LOC_P_GRP}>
        </${TAG_FUNC_DTE_GRP}>
      </${TAG_FUNC_LOC_GRP}>
    </RECORD>`

		return await axios
			.post(
				`${HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_DB}&READ=N&KEY=${SISN}&VALUE=${sisn}`,
				xmlFormDelete,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
					timeout: 5000,
				}
			)
			.then((res) => {
				return eventInfo.patronInfo
			})
			.catch((error) => {
				throw error
			})
	}

	const sendCancelConfirmEmail = async (patronInfo: any) => {
		let is_french = getCookieValue('my_lang') === '145' ? true : false
		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[OPAC_EMAIL_TMP]${is_french ? 'RSVPCancelConfirmTmp_fr.txt' : 'RSVPCancelConfirmTmp.txt'}&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo?.tag_func_p_email}&SUBJECT_DEFAULT=${rsvp.emailSubject.cancelConfirmationEmailT}:${patronInfo?.tag_name}`,
				{
					...patronInfo,
					EVENT_EMAIL_LOGO: logo,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(async (res) => {
				window.location.reload()
				return
			})
	}

	return (
		<PatronLayout heading={message.calendar}>
			<ProfileTable
				data={records}
				columns={columns}
				filterType={TAG_NAME.toLocaleLowerCase()}
				filterTypeShow={message.event}
				filterDateType={'tag_func_date'}
			/>
		</PatronLayout>
	)
}

export default Calendar
