import ProfileTable, { ProfileData } from '@/components/common/client-profile/ProfileTable'
import {
	CANCEL_CONFIRMATION_EMAIL_T,
	FUNC_LOC_P_GRP,
	MAIN_EVENT_CAL_DB,
	MWI_RESFUL_RES,
	MWI_XML_DATA_INDEX,
	SISN,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC,
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
import { convertToArr, convertXMLToJson, getHomeSessionID, isDatePast } from '@/lib/utils'
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

const test = [
	{
		"sisn": "1",
		"tag_name": "Japanese Tea Ceremony",
		"tag_func_loc": "Toronto Public Library, Main Branch",
		"tag_func_date": "2025-01-12",
		"tag_func_start_t": "10:00 am",
		"tag_func_end_t": "11:30 am",
		"tag_func_p_email": "tea.master@example.com",
		"tag_func_p_id": "20250001"
	  },
	  {
		"sisn": "2",
		"tag_name": "Chinese Cooking Class 2",
		"tag_func_loc": "Vancouver Public Library, Central Library",
		"tag_func_date": "2025-02-20",
		"tag_func_start_t": "01:00 pm",
		"tag_func_end_t": "02:00 pm",
		"tag_func_p_email": "donryu1031@gmail.com",
		"tag_func_p_id": "20250004"
	  },
	  {
		"sisn": "3",
		"tag_name": "French Pastry Workshop",
		"tag_func_loc": "Montreal Library, Downtown Branch",
		"tag_func_date": "2025-03-08",
		"tag_func_start_t": "02:00 pm",
		"tag_func_end_t": "04:00 pm",
		"tag_func_p_email": "pastry.chef@example.com",
		"tag_func_p_id": "20250007"
	  },
	  {
		"sisn": "1",
		"tag_name": "Japanese Tea Ceremony",
		"tag_func_loc": "Toronto Public Library, Main Branch",
		"tag_func_date": "2025-01-12",
		"tag_func_start_t": "10:00 am",
		"tag_func_end_t": "11:30 am",
		"tag_func_p_email": "tea.master@example.com",
		"tag_func_p_id": "20250001"
	  },
	  {
		"sisn": "2",
		"tag_name": "Chinese Cooking Class 2",
		"tag_func_loc": "Vancouver Public Library, Central Library",
		"tag_func_date": "2025-02-20",
		"tag_func_start_t": "01:00 pm",
		"tag_func_end_t": "02:00 pm",
		"tag_func_p_email": "donryu1031@gmail.com",
		"tag_func_p_id": "20250004"
	  },
	  {
		"sisn": "3",
		"tag_name": "French Pastry Workshop",
		"tag_func_loc": "Montreal Library, Downtown Branch",
		"tag_func_date": "2025-03-08",
		"tag_func_start_t": "02:00 pm",
		"tag_func_end_t": "04:00 pm",
		"tag_func_p_email": "pastry.chef@example.com",
		"tag_func_p_id": "20250007"
	  },
	  {
		"sisn": "1",
		"tag_name": "Japanese Tea Ceremony",
		"tag_func_loc": "Toronto Public Library, Main Branch",
		"tag_func_date": "2025-01-12",
		"tag_func_start_t": "10:00 am",
		"tag_func_end_t": "11:30 am",
		"tag_func_p_email": "tea.master@example.com",
		"tag_func_p_id": "20250001"
	  },
	  {
		"sisn": "2",
		"tag_name": "Chinese Cooking Class 2",
		"tag_func_loc": "Vancouver Public Library, Central Library",
		"tag_func_date": "2025-02-20",
		"tag_func_start_t": "01:00 pm",
		"tag_func_end_t": "02:00 pm",
		"tag_func_p_email": "donryu1031@gmail.com",
		"tag_func_p_id": "20250004"
	  },
	  {
		"sisn": "3",
		"tag_name": "French Pastry Workshop",
		"tag_func_loc": "Montreal Library, Downtown Branch",
		"tag_func_date": "2025-03-08",
		"tag_func_start_t": "02:00 pm",
		"tag_func_end_t": "04:00 pm",
		"tag_func_p_email": "pastry.chef@example.com",
		"tag_func_p_id": "20250007"
	  },
	  {
		"sisn": "1",
		"tag_name": "Japanese Tea Ceremony",
		"tag_func_loc": "Toronto Public Library, Main Branch",
		"tag_func_date": "2025-01-12",
		"tag_func_start_t": "10:00 am",
		"tag_func_end_t": "11:30 am",
		"tag_func_p_email": "tea.master@example.com",
		"tag_func_p_id": "20250001"
	  },
	  {
		"sisn": "2",
		"tag_name": "Chinese Cooking Class 2",
		"tag_func_loc": "Vancouver Public Library, Central Library",
		"tag_func_date": "2025-02-20",
		"tag_func_start_t": "01:00 pm",
		"tag_func_end_t": "02:00 pm",
		"tag_func_p_email": "donryu1031@gmail.com",
		"tag_func_p_id": "20250004"
	  },
	  {
		"sisn": "3",
		"tag_name": "French Pastry Workshop",
		"tag_func_loc": "Montreal Library, Downtown Branch",
		"tag_func_date": "2025-03-08",
		"tag_func_start_t": "02:00 pm",
		"tag_func_end_t": "04:00 pm",
		"tag_func_p_email": "pastry.chef@example.com",
		"tag_func_p_id": "20250007"
	  },
	{
	  "sisn": "1",
	  "tag_name": "Japanese Tea Ceremony",
	  "tag_func_loc": "Toronto Public Library, Main Branch",
	  "tag_func_date": "2025-01-12",
	  "tag_func_start_t": "10:00 am",
	  "tag_func_end_t": "11:30 am",
	  "tag_func_p_email": "tea.master@example.com",
	  "tag_func_p_id": "20250001"
	},
	{
	  "sisn": "2",
	  "tag_name": "Chinese Cooking Class 2",
	  "tag_func_loc": "Vancouver Public Library, Central Library",
	  "tag_func_date": "2025-02-20",
	  "tag_func_start_t": "01:00 pm",
	  "tag_func_end_t": "02:00 pm",
	  "tag_func_p_email": "donryu1031@gmail.com",
	  "tag_func_p_id": "20250004"
	},
	{
	  "sisn": "3",
	  "tag_name": "French Pastry Workshop",
	  "tag_func_loc": "Montreal Library, Downtown Branch",
	  "tag_func_date": "2025-03-08",
	  "tag_func_start_t": "02:00 pm",
	  "tag_func_end_t": "04:00 pm",
	  "tag_func_p_email": "pastry.chef@example.com",
	  "tag_func_p_id": "20250007"
	},
	{
	  "sisn": "4",
	  "tag_name": "Yoga for Beginners",
	  "tag_func_loc": "Calgary Public Library, Main Hall",
	  "tag_func_date": "2025-04-15",
	  "tag_func_start_t": "09:00 am",
	  "tag_func_end_t": "10:30 am",
	  "tag_func_p_email": "yoga.instructor@example.com",
	  "tag_func_p_id": "20250010"
	},
	{
	  "sisn": "5",
	  "tag_name": "Creative Writing Workshop",
	  "tag_func_loc": "Ottawa Public Library, Writers’ Room",
	  "tag_func_date": "2025-05-27",
	  "tag_func_start_t": "03:00 pm",
	  "tag_func_end_t": "05:00 pm",
	  "tag_func_p_email": "author@example.com",
	  "tag_func_p_id": "20250013"
	},
	{
	  "sisn": "6",
	  "tag_name": "Photography Basics",
	  "tag_func_loc": "Edmonton Public Library, Studio A",
	  "tag_func_date": "2025-06-10",
	  "tag_func_start_t": "01:30 pm",
	  "tag_func_end_t": "03:00 pm",
	  "tag_func_p_email": "photo.expert@example.com",
	  "tag_func_p_id": "20250016"
	},
	{
	  "sisn": "7",
	  "tag_name": "Public Speaking Seminar",
	  "tag_func_loc": "Winnipeg Public Library, Conference Room 2",
	  "tag_func_date": "2025-07-05",
	  "tag_func_start_t": "11:00 am",
	  "tag_func_end_t": "12:30 pm",
	  "tag_func_p_email": "speech.trainer@example.com",
	  "tag_func_p_id": "20250019"
	},
	{
	  "sisn": "8",
	  "tag_name": "Coding for Kids",
	  "tag_func_loc": "Halifax Public Library, Tech Lab",
	  "tag_func_date": "2025-08-22",
	  "tag_func_start_t": "10:00 am",
	  "tag_func_end_t": "12:00 pm",
	  "tag_func_p_email": "coder.kids@example.com",
	  "tag_func_p_id": "20250022"
	},
	{
	  "sisn": "9",
	  "tag_name": "Digital Marketing Strategies",
	  "tag_func_loc": "Quebec City Public Library, Seminar Room",
	  "tag_func_date": "2025-09-30",
	  "tag_func_start_t": "02:30 pm",
	  "tag_func_end_t": "04:00 pm",
	  "tag_func_p_email": "marketing.guru@example.com",
	  "tag_func_p_id": "20250025"
	},
	{
	  "sisn": "10",
	  "tag_name": "Advanced Chess Strategies",
	  "tag_func_loc": "Regina Public Library, Chess Hall",
	  "tag_func_date": "2025-10-18",
	  "tag_func_start_t": "04:00 pm",
	  "tag_func_end_t": "06:00 pm",
	  "tag_func_p_email": "chess.master@example.com",
	  "tag_func_p_id": "20250028"
	}
  ]

const Calendar = () => {
	const { records } = useJSONData({ selector: '#xml_record' })
	const message = useConstants().message
	let HOME_SESSID = getHomeSessionID()
	const { logo } = useConstants().config

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
			cell: ({ row }) => (
				<div>
					{row.getValue(TAG_FUNC_START_T.toLocaleLowerCase())}
				</div>
			),
		},
		{
			accessorKey: TAG_FUNC_END_T.toLocaleLowerCase(),
			header: message.end,
			cell: ({ row }) => (
				<div>{row.getValue(TAG_FUNC_END_T.toLocaleLowerCase())}</div>
			),
		},
		{
			accessorKey: TAG_FUNC_LOC.toLocaleLowerCase(),
			header: message.location,
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue(TAG_FUNC_LOC.toLocaleLowerCase())}</div>
			),
		},
		{
			accessorKey: TAG_FUNC_P_ATTND.toLocaleLowerCase(),
			header: message.attendee,
			cell: ({ row }) => (
				<div className="capitalize">
					{row.getValue(TAG_FUNC_P_ATTND.toLocaleLowerCase())}
				</div>
			)
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
						InitialButton={<Button variant={'danger'} disabled={isDatePast(cell.row.original.tag_func_date)}>{message.cancel}</Button>}
					/>
				)
			},
		}
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
					const funcLoc = elm?.TAG_FUNC_LOC
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
		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[OPAC_EMAIL_TMP]RSVPCancelConfirmTmp.txt&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo?.tag_func_p_email}&SUBJECT_DEFAULT=${CANCEL_CONFIRMATION_EMAIL_T}:${patronInfo?.tag_name}`,
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
