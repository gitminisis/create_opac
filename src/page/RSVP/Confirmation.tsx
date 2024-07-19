import { Button } from '@/components/ui/button'
import Layout from '@/components/layouts'
import '@/components/common/event-calendar/CalendarStyle.css'
import React, { useEffect, useState } from 'react'
import {
	FUNC_LOC_P_GRP,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	NON_LOGIN_USER_TYPE,
	REG_CONFIMRATION_EMAIL_T,
	RSVP_CANCEL_LANDING_PAGE_URL,
	RSVP_LOG_P_STATUS,
	SISN,
	TAG_FUNC_DATE,
	TAG_FUNC_DESC,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC_GRP,
	TAG_FUNC_P_ATTND,
	TAG_FUNC_P_CONFIRM_EXP_HOURS,
	TAG_FUNC_P_EMAIL,
	TAG_FUNC_P_FIRST,
	TAG_FUNC_P_ID,
	TAG_FUNC_P_LAST,
	TAG_FUNC_P_PAID,
	TAG_FUNC_P_T,
	TAG_FUNC_START_T,
	TAG_NAME,
	TAG_P_STATUS,
	TAG_RSVP_PATRON_LOG,
} from '@/components/common/event-calendar/Constants'
import axios from 'axios'
import { convertToArr, convertXMLToJson, decodeObj, encodeObj, isDatePast } from '@/lib/utils'
import Spinner from '@/components/common/event-calendar/Spinner'
import { v4 as uuidv4 } from 'uuid'
import { calNumOfPatron } from '@/components/common/event-calendar/EC-Util'
import useConstants from '@/hooks/useConstants'
import { PatronInfo, STATUS_TYPE, initialPatronInfo } from '@/types/patroninfo'
import { ConfirmTmp } from './ActionComponent'
import LandingPageMessage from './LandingPageMessage'

const RSVP_CONFIRM = () => {
	const rsvp: any = useConstants().rsvp
	const [loading, setLoading] = useState(false)
	const [patronInfo, setPatronInfo] = useState<PatronInfo>(initialPatronInfo)
	const [status, setStatus] = useState('')

	useEffect(() => {
		checkParms()
	}, [])

	const checkParms = async () => {
		const params = new URLSearchParams(window.location.search)
		let obj: any
		params.forEach((value: string, key) => {
			obj = decodeObj(value)
		})
		if (!obj) {
			setLoading(false)
			setStatus(STATUS_TYPE.Invalid)
			return
		}
		let jsonObj = JSON.parse(obj)
		// check the expired or not, user should confirm within TAG_FUNC_P_CONFIRM_EXP_HOURS
		if (isExpired(jsonObj.TAG_FUNC_P_T)) {
			setStatus(STATUS_TYPE.Expired)
			return
		}
		// check the date is available
		if (isDatePast(jsonObj.TAG_FUNC_DATE)) {
			setStatus(STATUS_TYPE.OutDate)
			return
		}
		return await isRecordValidate(jsonObj).then((res) => {
			setLoading(false)
			if (res.status) {
				setPatronInfo({ ...jsonObj, [TAG_FUNC_DESC]: res.TAG_FUNC_DESC })
				setStatus(STATUS_TYPE.Confirm)
				return
			}
			return
		})
	}

	const isExpired = (registered_time: string) => {
		const givenTime = new Date(registered_time)
		const currentTime = new Date()
		const milliseconds = TAG_FUNC_P_CONFIRM_EXP_HOURS * 60 * 60 * 1000
		const timeDifference = currentTime.getTime() - givenTime.getTime()
		return timeDifference > milliseconds
	}

	// check the email is already registered or not
	// check the seats are available
	const isRecordValidate = async (patrons: PatronInfo) => {
		setLoading(true)
		return await axios
			.get(
				`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${SISN} ${patrons[SISN]}`,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then((res) => {
				let result = convertXMLToJson(res)
				let records = result.div.xml.event
				let recordArr = convertToArr(records) ?? []
				let event = recordArr?.filter((item) => {
					return (
						item[TAG_FUNC_DATE] === patrons[TAG_FUNC_DATE] &&
						item[TAG_FUNC_START_T] === patrons[TAG_FUNC_START_T]
					)
				})

				// there were no exsisted patron then go true
				if (!event[0].PATRON) {
					return { status: true, [TAG_FUNC_DESC]: event[0].TAG_FUNC_DESC }
				}
				let event_arr = convertToArr(event[0].PATRON)
				let event_patron = event_arr.filter((item: PatronInfo) => {
					if (item[TAG_FUNC_P_EMAIL] === patrons[TAG_FUNC_P_EMAIL]) {
						return item
					}
				})
				// Checking Patron's email is already in the list
				if (event_patron.length >= 1) {
					setStatus(STATUS_TYPE.InList)
					return { status: false }
				}
				// Checking the event is fully registered
				if (calNumOfPatron(event_arr) >= event[0].TAG_FUNC_CAP) {
					setStatus(STATUS_TYPE.Full)
					return { status: false }
				}
				// Adding event description at the patronInfo to bring to RSVPRegConfirmTmp email
				// TAG_FUNC_DESC is too big to get from the query string so I try to add when the user registartion info is valid
				return { status: true, [TAG_FUNC_DESC]: event[0].TAG_FUNC_DESC }
			})
			.catch((error) => {
				throw error
			})
	}

	const onClick = () => {
		setLoading(true)
		getSessionID()
			.then((res) => storeRecord(res, patronInfo))
			.then((res) => sendRegConfirmEmail(res))
			.then((res) => storeAtLog(res))
	}

	const getSessionID = async () => {
		let urlForSessionID = `/scripts/mwimain.dll?logon&application=${MAIN_MWI_APPLICATION}`

		return await axios
			.post(
				urlForSessionID,
				{},
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then(() => {
				let match = document.cookie.match(/HOME_SESSID=(http:\/\/[^;]+)/) ?? ''
				let HOME_SESSID = match[0]?.split('=')[1]
				return HOME_SESSID
			})
			.catch((error) => {
				throw error
			})
	}

	const storeRecord = async (
		HOME_SESSID: string | boolean,
		PatronInfo: PatronInfo | undefined
	) => {
		const ID = `${NON_LOGIN_USER_TYPE}${uuidv4()?.substring(15)}`

		let xmlFormAdd = `<?xml version="1.0" encoding="UTF-8"?>
		<RECORD>
			<${TAG_FUNC_LOC_GRP} occ="${patronInfo.occ1}" op="chg">
				<${TAG_FUNC_DTE_GRP} occ="${patronInfo.occ2}" op="chg">
					<${FUNC_LOC_P_GRP} op="add">
						<${TAG_FUNC_P_ID}>${ID}</${TAG_FUNC_P_ID}>
						<${TAG_FUNC_P_FIRST}>${patronInfo[TAG_FUNC_P_FIRST]}</${TAG_FUNC_P_FIRST}>
						<${TAG_FUNC_P_LAST}>${patronInfo[TAG_FUNC_P_LAST]}</${TAG_FUNC_P_LAST}>
						<${TAG_FUNC_P_EMAIL}>${patronInfo[TAG_FUNC_P_EMAIL]}</${TAG_FUNC_P_EMAIL}>
						<${TAG_FUNC_P_ATTND}>${patronInfo[TAG_FUNC_P_ATTND]}</${TAG_FUNC_P_ATTND}>
					</${FUNC_LOC_P_GRP}>
				</${TAG_FUNC_DTE_GRP}>
			</${TAG_FUNC_LOC_GRP}>
		</RECORD>`

		return await axios
			.post(
				`${HOME_SESSID}?manipxmlrecord&database=M2L_TAG&READ=N&KEY=${SISN}&VALUE=${PatronInfo?.SISN}`,
				xmlFormAdd,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					timeout: 5000,
				}
			)
			.then((res) => {
				return { HOME_SESSID, ID }
			})
			.catch((error) => {
				setStatus(STATUS_TYPE.Invalid)
				throw error
			})
	}

	const sendRegConfirmEmail = async (obj: { HOME_SESSID: string | boolean; ID: string }) => {
		const encoded = encodeObj(
			JSON.stringify({
				...patronInfo,
				[TAG_FUNC_P_ID]: obj.ID,
				TAG_FUNC_DESC: undefined, //TAG_FUNC_DESC is too big for query string
			})
		)

		return await axios
			.post(
				`${obj.HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[CALENDAR]RSVPRegConfirmTmp.txt&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo[TAG_FUNC_P_EMAIL]}&SUBJECT_DEFAULT=${REG_CONFIMRATION_EMAIL_T}:${patronInfo[TAG_NAME]}`,
				{
					...patronInfo,
					RSVP_CANCEL_LANDING_PAGE_URL: RSVP_CANCEL_LANDING_PAGE_URL,
					[TAG_FUNC_P_ID]: obj.ID,
					encoded,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(async (res) => {
				setStatus(STATUS_TYPE.Success)
				setLoading(false)
				return obj
			})
			.catch((error) => {
				setStatus(STATUS_TYPE.Invalid)
				throw error
			})
	}

	const storeAtLog = async (obj: { HOME_SESSID: string | boolean; ID: string }) => {
		let xmlFormAdd = `<?xml version="1.0" encoding="UTF-8"?>
		<RECORD>
			<${TAG_NAME} op="add">${patronInfo[TAG_NAME]}</${TAG_NAME}>
			<${TAG_FUNC_P_ID} op="add">${obj.ID}</${TAG_FUNC_P_ID}>
			<${TAG_FUNC_P_EMAIL} op="add">${patronInfo[TAG_FUNC_P_EMAIL]}</${TAG_FUNC_P_EMAIL}>
			<${TAG_FUNC_P_PAID} op="add">${patronInfo[TAG_FUNC_P_PAID]}</${TAG_FUNC_P_PAID}>
			<${TAG_FUNC_P_T} op="add">${patronInfo[TAG_FUNC_P_T]}</${TAG_FUNC_P_T}>
			<${TAG_FUNC_P_ATTND} op="add">${patronInfo[TAG_FUNC_P_ATTND]}</${TAG_FUNC_P_ATTND}>
			<${TAG_P_STATUS} op="add">${RSVP_LOG_P_STATUS.CONFIRM}</${TAG_P_STATUS}>
			<${TAG_FUNC_DATE} op="add">${patronInfo[TAG_FUNC_DATE]}</${TAG_FUNC_DATE}>
			<${TAG_FUNC_START_T} op="add">${patronInfo[TAG_FUNC_START_T]}</${TAG_FUNC_START_T}>
			<${TAG_FUNC_END_T} op="add">${patronInfo[TAG_FUNC_END_T]}</${TAG_FUNC_END_T}>
		</RECORD>`

		return await axios
			.post(
				`${obj.HOME_SESSID}?manipxmlrecord&database=${TAG_RSVP_PATRON_LOG}&READ=N`,
				xmlFormAdd,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
				}
			)
			.then((res) => {
				return
			})
			.catch((error) => {
				throw error
			})
	}

	// Various view for different status
	const showRegStatus = () => {
		switch (status) {
			case STATUS_TYPE.Invalid:
				return <LandingPageMessage {...rsvp.confirmLandingInvalid} />
			case STATUS_TYPE.Success:
				return <LandingPageMessage {...rsvp.confirmLandingSuccess} />
			case STATUS_TYPE.OutDate:
				return <LandingPageMessage {...rsvp.confirmLandingOutDate} />
			case STATUS_TYPE.InList:
				return <LandingPageMessage {...rsvp.confirmLandingInList} />
			case STATUS_TYPE.Full:
				return <LandingPageMessage {...rsvp.confirmLandingFullEvent} />
			case STATUS_TYPE.Expired:
				return <LandingPageMessage {...rsvp.confirmLandingExpired} />
			case STATUS_TYPE.Confirm:
				return <ConfirmTmp patronInfo={patronInfo} onClick={onClick} />
			default:
				return <LandingPageMessage {...rsvp.confirmLandingInvalid} />
		}
	}

	return (
		<Layout>
			<div className="flex h-screen flex-col bg-white">
				<img
					src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
					alt=""
					className="h-64 w-full object-cover"
				/>
				{loading ? (
					<div className="flex h-full items-center justify-center">
						<Spinner
							height={'h-full'}
							spinHeight={'h-20'}
							spinWidth={'w-20'}
							background={'bg-white'}
						/>
					</div>
				) : (
					<div className="flex h-full items-center justify-center">{showRegStatus()}</div>
				)}
			</div>
		</Layout>
	)
}

export default RSVP_CONFIRM
