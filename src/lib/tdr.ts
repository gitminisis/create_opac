import axios from 'axios'
import { decodeString, encodeString } from './encoder'

export const OPAC_ADMIN_USERNAME = 'OPAC_ADMIN'
export const TDR_CONFIG: TdrParams = {
	// username: 'Karl',
	// userpassword: 'F1re_water',
	// tdr_api: 'https://tdrmultiapi.minisisinc.com',
	// tdr_ui: 'https://tdrmultiui.minisisinc.com',
	// login_endpoint: '/token',
	// search_endpoint: '/#/search',
	// bookmark_endpoint: '/api/Discover/BookmarkLinks',
	// delete_bookmark_ep: '/api/Discover/Bookmarks',
	username: 'Cams.Dev',
	userpassword: 'Cams.Dev_12!',
	tdr_api: 'https://titantdrapi.minisisinc.com',
	tdr_ui: 'https://titantdr.minisisinc.com',
	login_endpoint: '/token',
	search_endpoint: '/#/discover',
	bookmark_endpoint: '/api/Discover/BookmarkLinks',
	delete_bookmark_ep: '/api/Discover/Bookmarks',
}
type TdrParams = {
	tdr_api: string
	tdr_ui: string
	login_endpoint: string
	search_endpoint: string
	username: string
	bookmark_endpoint: string
	delete_bookmark_ep: string
	userpassword: string
}

export type TDRFile = {
	AccessionId: string | null
	PackageUuid: string
	PackageName: string
	AssetUuid: string
	AssetName: string
	FormatKey: string
	FormatType: string
	FormatId: string
	FormatName: string
	MimeType: string
	Extension: string
	FileName: string
	OriginalName: string
	Original: string
	Preservation: string
	Access: string
	Thumbnail: string
	Other: string | null
	Ocr: string
	People: string | null
	Creators: string[]
	SourceDonor: string[]
	LastModifiedOn: string // ISO 8601 date string
}

export const generateTDRIframeURL = (access_token: string, bookmarkId: string) => {
	// Generate discovery URL
	const discoveryUrl = `${TDR_CONFIG.tdr_ui}${TDR_CONFIG.search_endpoint}/${bookmarkId}`
	return discoveryUrl
}

export const generateBookmarkId = (userName = OPAC_ADMIN_USERNAME) => {
	// Get current time in seconds
	const today = new Date()
	const year = today.getFullYear().toString()
	const month = (today.getMonth() + 1).toString().padStart(2, '0')
	const day = today.getDate().toString().padStart(2, '0')
	const hour = today.getHours().toString().padStart(2, '0')
	const minute = today.getMinutes().toString().padStart(2, '0')
	const second = today.getSeconds().toString().padStart(2, '0')

	// Generate bookmark ID
	const bookmarkId = `${userName}_${year}${month}${day}_${hour}${minute}${second}`
	return bookmarkId
}

export const getTDRAccessToken = async () => {
	const res = await axios.post<AuthResponse>(
		`${TDR_CONFIG.tdr_api}/token`,
		{
			grant_type: 'password',
			username: decodeString(TDR_CONFIG.username),
			password: decodeString(TDR_CONFIG.userpassword),
		},
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		}
	)

	return res?.data
}

export const getTDRBookmark = async (accessToken: string, bookmarkId: string) => {
	const res = await axios.get<TDRFile[]>(`${TDR_CONFIG.tdr_api}/${TDR_CONFIG.bookmark_endpoint}/${bookmarkId}`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return res?.data
}

export const deleteTDRBookmark = async (accessToken: string, bookmarkId: string) => {
	const res = await axios.delete(`${TDR_CONFIG.tdr_api}/${TDR_CONFIG.delete_bookmark_ep}/${bookmarkId}`, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	})

	return res?.data
}

export const isSupportedImageExtension = (extension: string): boolean => {
	// Define a set of supported image extensions
	const supportedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']

	// Check if the provided extension matches any of the supported image extensions
	return supportedImageExtensions.includes(extension?.toLowerCase())
}

export type AuthResponse = {
	access_token: string
	token_type: string
	expires_in: number
	userName: string
	roleId: string
	roleName: string
	organizationUuid: string
	multiTenant: string // Consider changing to boolean if you normalize the value
	master: string // Same here
	'.issued': string
	'.expires': string
	logo: string
	avatar: string | null
}
