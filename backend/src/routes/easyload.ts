import { Hono } from 'hono'
import axios from 'axios'
import { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status'

// Types
interface AuthRequest {
	tenant: string
	password: string
}

// Create a new router instance for easyload
const easyload = new Hono()

// Constants
const API_BASE_URL = 'https://easyload-dev.azurewebsites.net/api'

// Auth endpoint
easyload.post('/auth', async (c) => {
	try {
		const body = await c.req.json<AuthRequest>()
		const { tenant, password } = body

		if (!tenant || !password) {
			return c.json(
				{
					status: 'failed',
					message: 'Tenant and password are required',
				},
				400
			)
		}

		const response = await axios.post(`${API_BASE_URL}/Auth/Token`, {
			id: tenant,
			password: password,
		})

		return c.json({
			status: 'success',
			message: 'Authentication successful',
			data: response.data,
		})
	} catch (error) {
		console.error('Error during EasyLoad Auth:', error)
		return c.json(
			{
				status: 'failed',
				message: 'Authentication failed',
				error: error || 'An unexpected error occurred',
			},
			500
		)
	}
})

// Search endpoint (placeholder)
easyload.post('/search', async (c) => {
	try {
		// For POST routes, get data from request body instead of query params
		const { query, token, tenant } = await c.req.json()

		if (!query || !token) {
			return c.json(
				{
					status: 'failed',
					message: 'Query and token are required',
				},
				400
			)
		}

		const response = await axios.get(`${API_BASE_URL}/Assets/TenantSearch?${query === '*' ? '' : `phrase=${encodeURIComponent(query)}`}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Tenant: tenant,
			},
		})

		return c.json({
			status: 'success',
			message: 'Search completed successfully',
			data: response.data,
		})
	} catch (error) {
		if (axios.isAxiosError(error)) {
			// The error is an Axios error
			const statusCode = error.response?.status || 500
			console.error('Axios Error during EasyLoad Search:', error)

			return c.json(
				{
					status: 'failed',
					message: 'Search failed',
					error: error.message || 'An unexpected error occurred',
				},
				statusCode as ContentfulStatusCode
			)
		}

		return c.json(
			{
				status: 'failed',
				message: 'Search failed',
				error: 'An unexpected error occurred',
			},
			500
		)
	}
})

// Upload endpoint (placeholder)
easyload.post('/upload', async (c) => {
	const blobId = c.req.header('BlobId')
	const blockId = c.req.header('BlockId')
	const tenant = c.req.header('Tenant')
	const blobName = c.req.header('BlobName')
	const token = c.req.header('Token')

	if (!token) {
		return c.json(
			{
				status: 'failed',
				message: 'Token is required',
			},
			400
		)
	}
	if (!blobId || !blockId || !tenant) {
		return c.json(
			{
				message: 'Missing required headers: BlobId, BlockId, and Tenant are required',
			},
			400
		)
	}

	// Validate that BlockId is a valid integer
	if (!Number.isInteger(Number(blockId))) {
		return c.json(
			{
				message: 'BlockId must be a valid integer',
			},
			400
		)
	}

	try {
		const chunkData = await c.req.arrayBuffer()
		const response = await axios.post(`${API_BASE_URL}/Assets/UploadChunk`, chunkData, {
			headers: {
				Authorization: `Bearer ${token}`,
				Blobid: blobId,
				Blockid: blockId,
				Blobname: blobName,
				Tenant: tenant,
				'Content-Type': 'application/octet-stream',
			},
		})

		return c.json(response.data, response.status as ContentfulStatusCode)
	} catch (error) {
		return c.json(
			{
				message: 'Internal server error during upload',
				error,
			},
			500
		)
	}
})

easyload.post('/commit', async (c) => {
	const blobId = c.req.header('BlobId')
	const tenant = c.req.header('Tenant')
	const user = c.req.header('User')
	const type = c.req.header('MimeType')
	const blobName = c.req.header('BlobName')
	const token = c.req.header('Token')

	if (!token) {
		return c.json(
			{
				status: 'failed',
				message: 'Token is required',
			},
			400
		)
	}
	if (!blobId || !user || !tenant || !type || !blobName) {
		return c.json(
			{
				message: 'Missing required headers: BlobId, BlobName, User, Type, and Tenant are required',
			},
			400
		)
	}

	try {
		const data = await c.req.json()
		const response = await axios.post(`${API_BASE_URL}/Assets/Commit`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
				Blobid: blobId,
				Blobname: blobName,
				MimeType: type,
				Tenant: tenant,
				User: user,
			},
		})

		return c.json(response.data, response.status as ContentfulStatusCode)
	} catch (error) {
		return c.json(
			{
				message: 'Internal server error during upload',
				error,
			},
			500
		)
	}
})
export { easyload }
