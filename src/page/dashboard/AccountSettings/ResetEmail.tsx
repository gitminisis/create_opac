import {
	FUNC_LOC_P_GRP,
	MAIN_EVENT_CAL_DB,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	SISN,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_LOC_GRP,
	TAG_FUNC_P_EMAIL,
	TAG_FUNC_P_ID,
	TAG_NAME,
} from '@/components/common/event-calendar/Constants'
import Spinner from '@/components/common/event-calendar/Spinner'
import Layout from '@/components/layouts'
import { Button } from '@/components/ui/button'
import useConstants from '@/hooks/useConstants'
import { convertXMLToJson, decodeObj, getCookieValue, getHomeSessionID, isDatePast } from '@/lib/utils'
import LandingPageMessage from '@/page/RSVP/LandingPageMessage'
import { STATUS_TYPE, initialPatronInfo } from '@/types/patroninfo'
import axios from 'axios'
import { useEffect, useState } from 'react'

type EmailInfo = {
	email: string
	date: string
	client_number: string
}

const ResetEmail = () => {
	const [loading, setLoading] = useState(true)
	const rsvp = useConstants().rsvp
	const [emailInfo, setEmailInfo] = useState<EmailInfo>({ email: '', date: '', client_number: '' })
	const [status, setStatus] = useState('')
	const { message } = useConstants()

	useEffect(() => {
		checkParms()
	}, [])

	const checkParms = async () => {
		const params = new URLSearchParams(window.location.search)
		let obj: any
		params?.forEach((value: string, key) => {
			obj = decodeObj(value)
		})
		let jsonObj = JSON.parse(obj)
		if (isDatePast(jsonObj.date)) {
			setStatus(STATUS_TYPE.OutDate)
			return
		}

		setEmailInfo(jsonObj)
		setLoading(false)
	}

	const onClick = () => {
		setLoading(true)
		getLogon()
			.then((res) => changeRecord(res))
			.then((res) => {
				setStatus(STATUS_TYPE.Success)
			})
	}

	const getLogon = async () => {
		let urlForSessionID = `/scripts/mwimain.dll?logon&application=${MAIN_MWI_APPLICATION}&file=[OPAC]rsvp-cancel.html`

		try {
			await axios.post(
				urlForSessionID,
				{},
				{
					headers: { 'Content-Type': 'text/xml' },
					withCredentials: true,
				}
			)

			return await waitForHomeSessionID()
		} catch (error) {
			return false
		}
	}

	const waitForHomeSessionID = () => {
		return new Promise((resolve, reject) => {
			let attempts = 0
			const maxAttempts = 10
			const interval = 100

			const checkSessionID = () => {
				let HOME_SESSID = getHomeSessionID()
				if (HOME_SESSID) {
					resolve(HOME_SESSID)
				} else if (attempts < maxAttempts) {
					attempts++
					setTimeout(checkSessionID, interval)
				} else {
					reject(new Error('Failed to get HOME_SESSID'))
				}
			}

			checkSessionID()
		})
	}

	const changeRecord = async (HOME_SESSID: any) => {
		axios({
			method: 'POST',
			url: HOME_SESSID + '?MANIPXMLRECORD&KEY=C_CLIENT_NUMBER&VALUE=' + emailInfo.client_number + '&DATABASE=PATRON',
			headers: { 'Content-Type': 'text/xml' },
			data: `<?xml version="1.0" encoding="UTF-8"?><RECORD>
            <C_EMAIL>${emailInfo.email}</C_EMAIL>
			</RECORD>`,
		})
			.then((res) => {
				const json = convertXMLToJson(res.data)
				const error = json['MWI-RESTful-response']?.error
				if (error == '530') return setStatus(STATUS_TYPE.InList)

				setStatus(STATUS_TYPE.Success)
			})
			.catch((error) => {
				// error
				setStatus(STATUS_TYPE.Invalid)
				return ''
			})
		setLoading(false)
	}

	const showRegStatus = () => {
		switch (status) {
			case STATUS_TYPE.InList:
				return <LandingPageMessage {...rsvp.emailInList} />
			case STATUS_TYPE.Invalid:
				return <LandingPageMessage {...rsvp.confirmLandingInvalid} />
			case STATUS_TYPE.OutDate:
				return <LandingPageMessage {...rsvp.confirmLandingInvalid} />
			case STATUS_TYPE.Success:
				return <LandingPageMessage {...rsvp.emailSuccess} />
			default:
				return (
					<div className="min-h-[35vh] flex flex-col items-center justify-center">
				<h1 className="landing-page-title">{message.email} {message.confirmation}</h1>
						<p className="landing-page-sub-title">{message.pleaseClickConfirm}</p>
						<Button
							onClick={onClick}
							className={`w-[300px] h-[50px] mt-6  rounded 
            bg-green-600 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring`}>
							<div>{message.confirm}</div>
						</Button>
					</div>
				)
		}
	}

	return (
		<Layout>
			<img
				src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
				alt=""
				className="h-64 w-full object-cover"
			/>
			{loading ? (
				<div className="flex h-full items-center justify-center">
					<Spinner height={'h-full'} spinHeight={'h-20'} spinWidth={'w-20'} background={'bg-white'} />
				</div>
			) : (
				<div>{showRegStatus()}</div>
			)}
		</Layout>
	)
}

export default ResetEmail
