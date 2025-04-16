import { Hono } from 'hono'
import path, { resolve } from 'node:path'
import { applyMiddleware } from './middleware'
import { easyload } from './routes/easyload'
import { rebuildOPAC, setFileContent } from './utils'
// Create the Hono application
const app = new Hono()

// Middleware
applyMiddleware(app)

// Route for checking server staPtus
app.get('/', (c) => {
	return c.text('Server is currently running on port 3030')
})

// Route for updating files
app.post('/update', async (c) => {
	const base = resolve(path.dirname(path.dirname(__dirname)), 'src')

	if (!base) return c.json({ status: 'failed', message: 'No base directory' })
	const body: { path: string; content: string } = await c.req.json()

	try {
		const { path, content } = body
		setFileContent(resolve(base, path), content)
		rebuildOPAC()

		return c.json({ status: 'success', message: 'Your file has been updated successfully' })
	} catch (error) {
		console.error('Error updating file:', error)
		return c.json({ status: 'failed', message: 'Error updating file' })
	}
})
app.route('/easyload', easyload)

export { app }
