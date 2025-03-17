import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import fs from 'node:fs'
// Apply middleware to the Hono app
export function applyMiddleware(app: Hono) {
	// Apply prettyJSON middleware
	app.use(prettyJSON())

	app.use('*', async (c, next) => {
		const log = `${new Date().toISOString()} - ${c.req.method} ${c.req.url}\n`
		fs.appendFileSync('logs.txt', log)
		await next()
	})

	// Apply CORS middleware
	app.use('/*', cors())

	// 404 Handler
	app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
}
