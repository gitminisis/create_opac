import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import useConstants from '@/hooks/useConstants'
import { convertToArr, convertXMLToJson, encodeObj, getCookieValue, getCurrentDate, getSessionID, isLogin, setCookie } from '@/lib/utils'
import { calendarCurrDate, calendarEvents, calendarWeekType } from '@/store'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { saveAs } from 'file-saver'
import { useAtom } from 'jotai'
import { BadgeCheck, FileDown, Mail, MonitorPlay, Phone, SquareUserRound } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { SubmitHandler, useForm } from 'react-hook-form'
import ButtonTooltip from './ButtonTooltip'
import {
	BD_ADDRESS,
	BD_BUILDING_NAME,
	BD_CITY,
	BD_POSTAL_CODE,
	Cal_event,
	ContactInfoRSVP,
	EVENT_EMAIL_LOGO,
	FLOC_TX_ACCESS,
	FUNC_LOC_P_GRP,
	MAIN_MWI_APPLICATION,
	MONTH_REPORT,
	MWI_RESFUL_RES,
	MWI_XML_DATA_INDEX,
	NON_LOGIN_USER_TYPE,
	patron,
	RSVP_CANCEL_LANDING_PAGE_URL,
	RSVP_CONFIRM_LANDING_PAGE_URL,
	SISN,
	MAIN_EVENT_CAL_DB,
	TAG_FUNC_DATE,
	TAG_FUNC_DTE_GRP,
	TAG_FUNC_END_T,
	TAG_FUNC_LOC_BLD,
	TAG_FUNC_LOC_CT,
	TAG_FUNC_LOC_EM,
	TAG_FUNC_LOC_GRP,
	TAG_FUNC_LOC_ROO,
	TAG_FUNC_O,
	TAG_FUNC_O_CODE,
	TAG_FUNC_O_ID,
	TAG_FUNC_O_PATH,
	TAG_FUNC_P_ATTND,
	TAG_FUNC_P_ATTND_DEFAULT,
	TAG_FUNC_P_ATTND_MAX,
	TAG_FUNC_P_EMAIL,
	TAG_FUNC_P_FIRST,
	TAG_FUNC_P_ID,
	TAG_FUNC_P_LAST,
	TAG_FUNC_P_T,
	TAG_FUNC_RSVP,
	TAG_FUNC_START_T,
	TAG_NAME,
	RSVP_MAP,
} from './Constants'
import { calNumOfPatron } from './EC-Util'
import { fetch_get, getContactInfo } from './Service'
import Spinner from './Spinner'
import x2js from 'x2js'

type Inputs = {
	[TAG_FUNC_P_FIRST]: string
	[TAG_FUNC_P_LAST]: string
	[TAG_FUNC_P_EMAIL]: string
	[TAG_FUNC_P_ATTND]: number
}

const STATUS_TYPE = {
	SHOW_FORM: 'SHOW_FORM',
	SHOW_BTN: 'SHOW_BTN',
	SHOW_SUCCESS: 'SHOW_SUCCESS',
}

type EventInput = {
	label: string
	keyname: string
	register: Function
	required: boolean
	errors?: any
	isLoginValid: boolean
}

type EventRSVPForm = {
	capacity: number
	patrons: patron[]
	sisnNumber: number
	event: Cal_event
	contactInfo: ContactInfoRSVP[]
}

const EventInput = ({ label, keyname, register, required, isLoginValid }: EventInput) => {
	return (
		<div className={'flex w-full flex-col my-1'}>
			<Label>{label}</Label>
			<Input disabled={isLoginValid} className={'border-2 border-grey-500'} {...register(keyname, { required: required })} />
		</div>
	)
}

const EventEmailInput = ({ label, keyname, register, required, errors, isLoginValid }: EventInput) => {
	return (
		<div className={'flex w-full flex-col my-1'}>
			<Label>{label}</Label>
			<Input
				disabled={isLoginValid}
				className={'border-2 border-grey-500'}
				{...register(keyname, {
					required: required,
					pattern: {
						value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						message: 'Invalid email address',
					},
				})}
			/>
			{errors[TAG_FUNC_P_EMAIL]?.message}
		</div>
	)
}

const ShowForm = ({
	loading,
	handleSubmit,
	register,
	onSubmit,
	errors,
	onReset,
	setValue,
	isLoginValid,
	isIDValid,
	setLoading,
}: {
	loading: boolean
	handleSubmit: Function
	register: Function
	onSubmit: Function
	errors: any
	onReset: any
	setValue: Function
	isLoginValid: boolean
	isIDValid: boolean
	setLoading: any
}) => {
	const message = useConstants().message
	const conf = useConstants().config
	const [captchaValue, setCaptchaValue] = useState<string | null>(null)
	const handleCaptchaChange = (value: string | null) => {
		setCaptchaValue(value)
	}
	const handleFormSubmit = (data: any) => {
		if (captchaValue || isLoginValid) {
			onSubmit({ ...data })
		} else {
			toast({ title: `CAPTCHA verification failed` })
		}
	}

	useEffect(() => {
		// If user login in , fill the form automatically.
		if (isLoginValid) {
			// M2L_PATRON_ID
			let name = getCookieValue('M2L_PATRON_NAME')?.split('%2C%20') ?? []
			setValue(TAG_FUNC_P_FIRST, name[1])
			setValue(TAG_FUNC_P_LAST, name[0])
			setValue(TAG_FUNC_P_EMAIL, getCookieValue('Email'))
		}
	}, [setValue])

	const M2L_PATRON_NAME = getCookieValue('M2L_PATRON_NAME')

	return (
		<div className={'h-full w-full p-1 border-2 rounded text-lg'}>
			{loading && <Spinner height={'h-full'} spinHeight={'h-10'} spinWidth={'w-10'} />}
			<div className={'bg-primary p-1 text-white'}>
				{M2L_PATRON_NAME ? (
					<span className={'text-gray-400'}>
						{message.hello}! {decodeURIComponent(M2L_PATRON_NAME)}
					</span>
				) : (
					<a href={`${conf.auth.url}`}>
						<span className={'text-gray-400'}>{message.logIn}?</span>
					</a>
				)}
			</div>
			<form
				onSubmit={handleSubmit(handleFormSubmit)} // Use handleFormSubmit here
				className={'h-full w-full flex flex-col justify-start items-center'}>
				<EventInput label={message.firstName} keyname={TAG_FUNC_P_FIRST} register={register} required={true} isLoginValid={isLoginValid} />
				<EventInput label={message.lastName} keyname={TAG_FUNC_P_LAST} register={register} required={true} isLoginValid={isLoginValid} />
				<EventEmailInput
					label={message.email}
					keyname={TAG_FUNC_P_EMAIL}
					register={register}
					required={true}
					errors={errors}
					isLoginValid={isLoginValid}
				/>
				<div className={'flex w-full flex-col my-1'}>
					<Label>{message.attendee}</Label>
					<select defaultValue={TAG_FUNC_P_ATTND_DEFAULT} {...register(TAG_FUNC_P_ATTND)} className={'border-2 border-grey-500 w-1/4'}>
						{Array(TAG_FUNC_P_ATTND_MAX)
							.fill(0)
							.map((_, index) => (
								<option key={index} value={index + 1}>
									{index + 1}
								</option>
							))}
					</select>
				</div>
				{!isIDValid && <div className={'my-2'}>{message.emailAlreadyRegistered}</div>}
				<div className={'my-2'}>
					{!isLoginValid && (
						<ReCAPTCHA
							sitekey={process.env.REACT_APP_RSVP_RECAPTCHA || import.meta.env.VITE_REACT_APP_RECAPTCHA}
							onChange={handleCaptchaChange}
						/>
					)}
				</div>
				<Button className={'w-full font-bold'} type="submit">
					{message.register}
				</Button>
				<div onClick={onReset} className="text-center border-b-4 font-bold mt-6">
					{message.goBack}
				</div>
			</form>
		</div>
	)
}

const ShowButton = ({
	capacity,
	patrons,
	setStatus,
	event,
	contactInfo,
}: {
	capacity: number
	patrons: patron[]
	setStatus: React.Dispatch<React.SetStateAction<string>>
	event: Cal_event
	contactInfo: ContactInfoRSVP[]
}) => {
	const message = useConstants().message

	const handleDownload = async () => {
		let fileUrl = event[FLOC_TX_ACCESS]?.toLowerCase().includes('[media]')
			? event[FLOC_TX_ACCESS].replace(/\[media\]/i, '/media/')
			: event[FLOC_TX_ACCESS]
		if (fileUrl) {
			try {
				const response = await fetch(fileUrl)
				if (!response.ok) throw new Error('Network response was not ok')
				const blob = await response.blob()
				saveAs(blob, fileUrl.split('/').pop() || 'downloaded-file')
			} catch (error) {
				console.error('Error downloading file:', error)
			}
		}
	}

	function isDateInThePast(dateString: string) {
		const inputDate = new Date(dateString)
		const currentDate = new Date()

		// Zero out the hours, minutes, seconds, and milliseconds of the current date
		currentDate.setHours(0, 0, 0, 0)

		return inputDate <= currentDate
	}

	return (
		<div className={'h-full w-full text-lg'}>
			{event[TAG_FUNC_RSVP] !== RSVP_MAP.NO && (
				<div className={'h-1/2 w-full flex flex-col items-center justify-evenly p-1 border-2 rounded'}>
					<div className={'flex justify-center items-center'}>{message.registrationRequired}</div>
					<Button
						disabled={capacity - calNumOfPatron(patrons) <= 0 || isDateInThePast(event[TAG_FUNC_DATE]) ? true : false}
						className={'w-full font-bold'}
						onClick={() => setStatus(STATUS_TYPE.SHOW_FORM)}>
						{isDateInThePast(event[TAG_FUNC_DATE]) ? message.eventEndedMessage : message.register}
					</Button>
					<div className={'flex justify-center items-center'}>
						{capacity - calNumOfPatron(patrons) <= 0 ? (
							<div className={'flex text-red-600 justify-center items-center'}>{message.noSeatsRemaining}</div>
						) : (
							<div className={'flex text-lime-800 justify-center items-center'}>
								<BadgeCheck /> {`${capacity - calNumOfPatron(patrons)} ${message.seatsRemaining}`}
							</div>
						)}
					</div>
				</div>
			)}
			{getContactInfo(BD_ADDRESS, contactInfo, event) ? (
				<div
					className={`${event[TAG_FUNC_RSVP] !== RSVP_MAP.NO ? 'h-1/2' : 'h-[54%]'} w-full flex flex-col items-start justify-evenly text-lg p-3 border-2 rounded`}>
					<div className={'w-full flex justify-center'}>{message.contactInfo}</div>
					<div className={'w-full text-center'}>
						{event[TAG_FUNC_LOC_CT] && (
							<div className={'flex font-normal items-center text-base'}>
								<Phone size={25} className={'mr-2'} />
								{event[TAG_FUNC_LOC_CT]}
							</div>
						)}
						{event[TAG_FUNC_LOC_EM] && (
							<div className={'flex font-normal items-center text-base'}>
								<Mail size={25} className={'mr-2'} />
								{event[TAG_FUNC_LOC_EM]}
							</div>
						)}
					</div>
					<div className={'w-full'}>
						{/*@ts-ignore there is variable called TAG_FUNC_O*/}
						{event[TAG_FUNC_O] === RSVP_MAP.YES ? (
							<>
								<div className={'flex font-normal items-center'}>
									<MonitorPlay size={25} className={'mr-2'} />
									<div>{message.online}</div>
								</div>
								<div className={'text-sm my-2 text-center'}>"{message.onlineTip}"</div>
							</>
						) : (
							<>
								<div className={'flex'}>
									<SquareUserRound size={25} className={'mr-2'} />
									<div>
										<div className={'font-normal text-base'}>{getContactInfo(BD_BUILDING_NAME, contactInfo, event)}</div>
										<div className={'font-normal text-base'}>
											<div>{getContactInfo(BD_ADDRESS, contactInfo, event)}</div>
											<div>
												<span className={'mr-1'}>{getContactInfo(BD_CITY, contactInfo, event)}</span>
												<span>{getContactInfo(BD_POSTAL_CODE, contactInfo, event)}</span>
											</div>
										</div>
									</div>
								</div>
								<div className={'text-sm my-2 text-center'}>"{message.inPersonTip}"</div>
							</>
						)}
					</div>
					{event[FLOC_TX_ACCESS] && (
						<ButtonTooltip item={[{ TAG_NAME: `Download material` }]}>
							<Button onClick={handleDownload}>
								<FileDown />
							</Button>
						</ButtonTooltip>
					)}
				</div>
			) : (
				// If there are no building info, this is private place
				<div className={'h-1/2 w-full flex flex-col items-center justify-center'}>
					<div>{message.privateProperty}</div>
					<div className={'text-center'}>{message.contactInfoNotProvided}</div>
					{event[FLOC_TX_ACCESS] && (
						<Button onClick={handleDownload}>
							<FileDown />
						</Button>
					)}
				</div>
			)}
		</div>
	)
}

const ShowRSVPSuccess = ({
	onReset,
	event,
	contactInfo,
	isLoginValid,
}: {
	onReset: any
	event: Cal_event
	contactInfo: ContactInfoRSVP[]
	isLoginValid: boolean
}) => {
	const message = useConstants().message
	return (
		<div className={'min-h-[388px] h-full w-full p-2 border-2 rounded flex flex-col justify-evenly'}>
			<div>
				<div className={'min-h-[194px] text-center w-full h-3/6 flex flex-col items-center justify-evenly'}>
					<SquareUserRound className="w-12 h-12" />
					{isLoginValid ? (
						<div className={'text-2xl'}>{message.registered}!</div>
					) : (
						<div className={'text-2xl'}>{message.registrationIncomplete}</div>
					)}
					<div className={'text-xl'}>{message.checkEmail}</div>
				</div>
				<div
					onClick={onReset}
					className="font-bold h-[40px] flex items-center justify-center text-center bg-primary text-primary-foreground rounded">
					{message.goBack}
				</div>
			</div>
			<div>
				<div className={'w-full flex justify-center text-lg mb-3'}>{message.contactInfo}</div>
				{event[TAG_FUNC_O] === RSVP_MAP.YES ? (
					<>
						<div className={'flex font-normal items-center'}>
							<MonitorPlay size={25} className={'mr-2'} />
							<div>{message.online}</div>
						</div>
						<div className={'text-sm my-2 text-center'}>"{message.onlineTip}"</div>
					</>
				) : (
					<>
						<div className={'flex items-center'}>
							<SquareUserRound size={25} className={'mr-2'} />
							<div>
								<div className={'font-normal text-base'}>{getContactInfo(BD_BUILDING_NAME, contactInfo, event)}</div>
								<div className={'font-normal text-base'}>
									<div>{getContactInfo(BD_ADDRESS, contactInfo, event)}</div>
									<div>
										<span className={'mr-1'}>{getContactInfo(BD_CITY, contactInfo, event)}</span>
										<span>{getContactInfo(BD_POSTAL_CODE, contactInfo, event)}</span>
									</div>
								</div>
							</div>
						</div>
						<div className={'text-sm my-2 text-center'}>"{message.inPersonTip}"</div>
					</>
				)}
			</div>
		</div>
	)
}

const EventRSVPForm = ({ capacity, patrons, sisnNumber, event, contactInfo }: EventRSVPForm) => {
	const [status, setStatus] = useState(STATUS_TYPE.SHOW_BTN)
	const rsvp: any = useConstants().rsvp
	const { logo } = useConstants().config
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm<Inputs>()
	const [loading, setLoading] = useState(false)
	const [currentDate, _] = useAtom(calendarCurrDate)
	const [weekType, __] = useAtom(calendarWeekType)
	const [___, setCurrentEvent] = useAtom(calendarEvents)
	const [isLogin, setIsLogin] = useState(false)
	const [isIDValid, setIsIDValid] = useState(true)

	useEffect(() => {
		if (getCookieValue('M2L_PATRON_NAME')) {
			setIsLogin(true)
			!getCookieValue('Email') && getEmail()
		}
	}, [])

	const getEmail = async () => {
		setLoading(true)
		let HOME_SESSID = getSessionID()
		let ID = getCookieValue('M2L_PATRON_ID') ?? ''
		return axios
			.post(`${HOME_SESSID}?manipxmlrecord&database=CLIENT&READ=Y&KEY=C_CLIENT_NUMBER&VALUE=${ID.replace(/\[.*?\]/g, '')}`, {
				headers: {
					'Content-Type': 'text/xml',
				},
				withCredentials: true,
				timeout: 5000,
			})
			.then((res) => {
				const conToJson: any = convertXMLToJson(res.data)
				const jsonObj = conToJson[MWI_RESFUL_RES].record
				setCookie('Email', jsonObj['C_EMAIL'])
				setLoading(false)
				return jsonObj['C_EMAIL']
			})
	}

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setLoading(true)
		if (isLogin) {
			const isReg = await isUserAlreadyReg(event)
			if (isReg) {
				setLoading(false)
				setIsIDValid(false)
				return
			}
			const res = await getOCCNumber()
			return storeRecord(res, data, event)
		}

		const res = await getOCCNumber()
		return sendEmail(res, data, event)
	}

	const getOCCNumber = async () => {
		let HOME_SESSID = getSessionID()

		return await axios
			.post(`${HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_DB}&READ=Y&KEY=${SISN}&VALUE=${sisnNumber}`, {
				headers: {
					'Content-Type': 'text/xml',
				},
				withCredentials: true,
				timeout: 5000,
			})
			.then((res) => {
				const conToJson: any = convertXMLToJson(res.data)
				const jsonObj = conToJson[MWI_RESFUL_RES].record
				const loc_group = convertToArr(jsonObj?.TAG_FUNC_LOC_GRP)
				const dte_group = convertToArr(loc_group[MWI_XML_DATA_INDEX].TAG_FUNC_DTE_GRP)
				let TAG_FUNC_LOC_OCC = 0
				let TAG_FUNC_DTE_OCC = 0

				loc_group?.forEach((elm) => {
					const funcLoc = elm?.TAG_FUNC_LOC_BLD
					if (funcLoc === event[TAG_FUNC_LOC_BLD]) {
						TAG_FUNC_LOC_OCC = elm._occ // regards as Occurence number of the repeating field
					}
				})

				dte_group?.forEach((elm) => {
					const funcDate = elm?.TAG_FUNC_DATE
					const funcTimeStart = elm?.TAG_FUNC_START_T
					if (funcDate === event[TAG_FUNC_DATE] && funcTimeStart === event[TAG_FUNC_START_T]) {
						TAG_FUNC_DTE_OCC = elm._occ
					}
				})

				return { occ1: TAG_FUNC_LOC_OCC, occ2: TAG_FUNC_DTE_OCC }
			})
			.catch((error) => {
				console.error('Getting record error', error)
				return { occ1: 0, occ2: 0 }
			})
	}

	const sendEmail = async (patron: any, patronInfo: Inputs, event: Cal_event) => {
		let HOME_SESSID = getSessionID()
		let is_french = getCookieValue('my_lang') === '145' ? true : false
		const encoded = encodeObj(
			JSON.stringify({
				...patronInfo,
				[TAG_NAME]: event[TAG_NAME],
				[TAG_FUNC_START_T]: event[TAG_FUNC_START_T],
				[TAG_FUNC_END_T]: event[TAG_FUNC_END_T],
				[TAG_FUNC_LOC_ROO]: event[TAG_FUNC_LOC_ROO],
				[TAG_FUNC_DATE]: event[TAG_FUNC_DATE],
				[TAG_FUNC_LOC_BLD]: event[TAG_FUNC_LOC_BLD],
				[SISN]: event[SISN],
				[TAG_FUNC_P_T]: getCurrentDate(),
				BD_ADDRESS: getContactInfo(BD_ADDRESS, contactInfo, event),
				occ1: patron.occ1,
				occ2: patron.occ2,
				[TAG_FUNC_O]: event[TAG_FUNC_O],
				[TAG_FUNC_O_PATH]: event[TAG_FUNC_O_PATH],
				[TAG_FUNC_O_ID]: event[TAG_FUNC_O_ID],
				[TAG_FUNC_O_CODE]: event[TAG_FUNC_O_CODE],
			})
		)

		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=[OPAC_EMAIL_TMP]${is_french ? 'RSVPVerificationConfirmTmp_fr.txt' : 'RSVPVerificationConfirmTmp.txt'}&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${patronInfo[TAG_FUNC_P_EMAIL]}&SUBJECT_DEFAULT=${rsvp.emailSubject.cancelConfirmationEmailT}${event[TAG_NAME]}`,
				{
					...patronInfo,
					EVENT_EMAIL_LOGO: logo,
					[TAG_NAME]: event[TAG_NAME],
					[TAG_FUNC_DATE]: event[TAG_FUNC_DATE],
					[TAG_FUNC_P_T]: getCurrentDate(),
					[BD_ADDRESS]: getContactInfo(BD_ADDRESS, contactInfo, event),
					RSVP_CONFIRM_LANDING_PAGE_URL: RSVP_CONFIRM_LANDING_PAGE_URL,
					encoded,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(async () => {
				setStatus(STATUS_TYPE.SHOW_SUCCESS)
				const currE = await fetch_get(currentDate, weekType)
				setCurrentEvent(currE)
				setLoading(false)
			})
	}

	const storeRecord = async (occ_info: any, patronInfo: any, event: Cal_event) => {
		let HOME_SESSID = getSessionID()
		const ID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		let xmlFormAdd = `<?xml version="1.0" encoding="UTF-8"?>
		<RECORD>
			<${TAG_FUNC_LOC_GRP} occ="${occ_info.occ1}" op="chg">
				<${TAG_FUNC_DTE_GRP} occ="${occ_info.occ2}" op="chg">
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
			.post(`${HOME_SESSID}?manipxmlrecord&database=${MAIN_EVENT_CAL_DB}&READ=N&KEY=${SISN}&VALUE=${event?.SISN}`, xmlFormAdd, {
				headers: {
					'Content-Type': 'text/xml',
				},
				withCredentials: true,
				timeout: 5000,
			})
			.then((res) => {
				sendRegConfirmEmail(occ_info, patronInfo, event)
				setLoading(false)
			})
			.catch((error) => {
				throw error
			})
	}

	// User only can register one event
	// If Cooking class is on Dec 1st or Dec 12st, user can register only one of the two.
	const isUserAlreadyReg = async (event: Cal_event) => {
		const ID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		return await axios
			.get(
				`/scripts/mwimain.dll/144/${MAIN_MWI_APPLICATION}/${MONTH_REPORT}?commandsearch&exp=${TAG_FUNC_P_ID} ${ID} AND ${TAG_FUNC_DATE} ${event[TAG_FUNC_DATE]}`,
				{
					headers: {
						'Content-Type': 'text/xml',
					},
					withCredentials: true,
				}
			)
			.then((res) => {
				let result = convertXMLToJson(res.data)
				if (result.div) {
					return true
				}
				return false
			})
	}

	const sendRegConfirmEmail = async (occ_info: any, userData: Inputs, event: Cal_event) => {
		const userID = getCookieValue('M2L_PATRON_ID')?.split(']')[1]
		let HOME_SESSID = getSessionID()
		let isFrench = getCookieValue('my_lang') === '145'

		const encoded = encodeObj(
			JSON.stringify({
				...userData,
				[TAG_FUNC_P_ID]: userID,
				[TAG_NAME]: event[TAG_NAME],
				[TAG_FUNC_START_T]: event[TAG_FUNC_START_T],
				[TAG_FUNC_END_T]: event[TAG_FUNC_END_T],
				[TAG_FUNC_LOC_ROO]: event[TAG_FUNC_LOC_ROO],
				[TAG_FUNC_DATE]: event[TAG_FUNC_DATE],
				[TAG_FUNC_LOC_BLD]: event[TAG_FUNC_LOC_BLD],
				[SISN]: event[SISN],
				[TAG_FUNC_P_T]: getCurrentDate(),
				BD_ADDRESS: getContactInfo(BD_ADDRESS, contactInfo, event),
				occ1: occ_info.occ1,
				occ2: occ_info.occ2,
				[TAG_FUNC_O]: event[TAG_FUNC_O],
				[TAG_FUNC_O_PATH]: event[TAG_FUNC_O_PATH],
				[TAG_FUNC_O_ID]: event[TAG_FUNC_O_ID],
				[TAG_FUNC_O_CODE]: event[TAG_FUNC_O_CODE],
			})
		)

		const is_online = event.TAG_FUNC_O === RSVP_MAP.YES
		let templateName = ''

		if (is_online && isFrench) {
			templateName = 'RSVPRegOnlineComfrimTmp_fr.txt'
		} else if (is_online && !isFrench) {
			templateName = 'RSVPRegOnlineComfrimTmp.txt'
		} else if (!is_online && isFrench) {
			templateName = 'RSVPRegConfirmTmp_fr.txt'
		} else {
			templateName = 'RSVPRegConfirmTmp.txt'
		}

		const templateParam = `[OPAC_EMAIL_TMP]${templateName}`
		const subject = `${rsvp.emailSubject.regConfirmationEmailT}:${event[TAG_NAME]}`

		return await axios
			.post(
				`${HOME_SESSID}?SAVE_MAIL_FORM&TEMPLATE=${templateParam}&FROM_DEFAULT=noreply@minisisinc.com&TO_DEFAULT=${userData[TAG_FUNC_P_EMAIL]}&SUBJECT_DEFAULT=${subject}`,
				{
					BD_ADDRESS: event[TAG_FUNC_LOC_BLD],
					...userData,
					...event,
					EVENT_EMAIL_LOGO: logo,
					RSVP_CANCEL_LANDING_PAGE_URL: RSVP_CANCEL_LANDING_PAGE_URL,
					[TAG_FUNC_P_ID]: userID,
					encoded,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then(async (res) => {
				setStatus(STATUS_TYPE.SHOW_SUCCESS)
				setLoading(false)
			})
			.catch((error) => {
				throw error
			})
	}

	const onReset = () => {
		setLoading(false)
		setStatus(STATUS_TYPE.SHOW_BTN)
		reset()
	}

	const showRSVPStatus = () => {
		switch (status) {
			case STATUS_TYPE.SHOW_BTN:
				return <ShowButton event={event} capacity={capacity} patrons={patrons} setStatus={setStatus} contactInfo={contactInfo} />
			case STATUS_TYPE.SHOW_FORM:
				return (
					<ShowForm
						setLoading={setLoading}
						loading={loading}
						handleSubmit={handleSubmit}
						register={register}
						onSubmit={onSubmit}
						errors={errors}
						onReset={onReset}
						setValue={setValue}
						isLoginValid={isLogin}
						isIDValid={isIDValid}
					/>
				)
			case STATUS_TYPE.SHOW_SUCCESS:
				return <ShowRSVPSuccess onReset={onReset} event={event} contactInfo={contactInfo} isLoginValid={isLogin} />
			default:
				return <ShowButton event={event} capacity={capacity} patrons={patrons} setStatus={setStatus} contactInfo={contactInfo} />
		}
	}

	return <>{showRSVPStatus()}</>
}

export default EventRSVPForm
