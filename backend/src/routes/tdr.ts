import { Hono } from 'hono'
const tdr = new Hono()
const originServer = 'https://titantdrapi.minisisinc.com'
tdr.all('*', async (c) => {
	const url = new URL(c.req.url)

	const targetUrl = originServer + url.pathname.replace('/tdr', '') + url.search
	// Clone headers (but optionally filter sensitive ones)
	const headers = new Headers()
	for (const [key, value] of Object.entries(c.req.header())) {
		headers.set(key, value)
	}

	const reqInit: RequestInit = {
		method: c.req.method,
		headers,
		body: ['GET', 'HEAD'].includes(c.req.method.toUpperCase())
			? undefined
			: await c.req.raw.body
					?.getReader()
					.read()
					.then((res) => (res.done ? undefined : new Blob([res.value]))),
		redirect: 'manual',
	}

	const res = await fetch(targetUrl, reqInit)

	// Clone headers to response
	const responseHeaders = new Headers()
	for (const [key, value] of res.headers) {
		responseHeaders.set(key, value)
	}

	return new Response(res.body, {
		status: res.status,
		headers: responseHeaders,
	})
})
export { tdr }
