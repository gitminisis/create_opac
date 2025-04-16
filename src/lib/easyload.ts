import { axios } from '@/lib/axios'
import { getPatronID } from './utils'

export const EASYLOAD_BASE_API =
	process.env.EASYLOAD_BASE_API || 'https://easyload-dev.azurewebsites.net'
export const urls = {
	TOKEN: '/api/auth/token',
	VERSION: '/api/app/version',
	ASSETS: '/api/Assets/',
	ASSETS_UPLOAD_CHUNK: 'api/Assets/UploadChunk',
	ASSETS_UPLOAD_COMMIT: '/api/Assets/Commit',
	ASSETS_DELETE: '/api/Assets/Remove',
	ASSETS_SEARCH: '/api/Assets/Search',
}
export const auth = {
	AUTH_TOKEN: 'easy_load_authToken',
	TENANT: 'easy_load_tenant',
	TENANT_ID: 'easy_load_tenant_id',
	USER: 'opac_user',
}

interface RequestResult {
	success: boolean
	message: string | undefined
	data: string
	cancelled: boolean
}
export const sliceChunks = (
	file: Blob & { readonly lastModified: number; readonly name: string },
	chunkSize: number
) => {
	let startPointer = 0
	const endPointer = file.size
	const chunks = new Array<Blob>()
	while (startPointer < endPointer) {
		const newStartPointer = startPointer + chunkSize
		chunks.push(file.slice(startPointer, newStartPointer))
		startPointer = newStartPointer
	}
	return chunks
}

export const UploadAssetChunk = async (
	fileChunk: Blob,
	chunkId: string,
	fileId: string,
	fileName: string,
	totalLoaded: number,
	fileSize: number
): Promise<RequestResult> => {
	try {
		const arrayBuffer = await fileChunk.arrayBuffer()
		const res = await axios.postForm('/easyload/upload', arrayBuffer, {
			headers: {
				BlobId: fileId,
				BlobName: fileName,
				BlockId: chunkId,
				Tenant: `${localStorage.getItem('easyloadUser')}`,
				Token: `${localStorage.getItem('easyloadToken')}`,
			},
		})

		if (res.status === 201) {
			return { success: true, data: res.data } as RequestResult
		}

		return {
			success: false,
			message: 'Error uploading chunk',
		} as RequestResult
	} catch (error) {
		return { success: false, message: 'Cancelled' } as RequestResult
	}
}

export const CommitAssetUpload = async (
	fileId: string,
	fileName: string,
	fileType: string,
	chunksIds: string[]
): Promise<RequestResult> => {
	try {
		const response = await axios.post('/easyload/commit', chunksIds, {
			headers: {
				Blobid: fileId,
				Blobname: fileName,
				MimeType: fileType,
				User: getPatronID() || 'Default OPAC User',
				Tenant: `${localStorage.getItem('easyloadUser')}`,
				Token: `${localStorage.getItem('easyloadToken')}`,
			},
		})

		return {
			success: response.status === 201,
			data: response.data,
		} as RequestResult
	} catch (error) {
		return { success: false, message: 'Cancelled' } as RequestResult
	}
}

export const DeleteAsset = async (fileId: string): Promise<RequestResult> => {
	try {
		const headers = {
			Blobid: fileId,
			User: sessionStorage.getItem(auth.USER),
			Tenant: sessionStorage.getItem(auth.TENANT_ID),
		}

		const response = await axios.delete(EASYLOAD_BASE_API + urls.ASSETS_DELETE, {
			headers,
		})

		return {
			success: response.status === 200,
			data: response.data,
		} as RequestResult
	} catch (error) {
		return { success: false, message: 'Cancelled' } as RequestResult
	}
}

export const SearchAssets = async (phrase: string): Promise<RequestResult> => {
	try {
		const headers = {
			User: sessionStorage.getItem(auth.USER),
			Tenant: sessionStorage.getItem(auth.TENANT_ID),
		}

		const response = await axios.get(`${EASYLOAD_BASE_API + urls.ASSETS_SEARCH}/${phrase}`, {
			headers,
		})

		return {
			success: response.status === 201,
			data: response.data,
		} as RequestResult
	} catch (error) {
		return { success: false, message: 'Cancelled' } as RequestResult
	}
}
