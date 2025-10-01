import { Hono } from 'hono'
import path, { resolve } from 'node:path'
import { port } from '.'
import { applyMiddleware } from './middleware'
import { easyload } from './routes/easyload'
import { tdr } from './routes/tdr'
import { rebuildOPAC, setFileContent } from './utils'
// Create the Hono application
const app = new Hono()
// Middleware
applyMiddleware(app)

// Route for checking server staPtus
app.get('/', (c) => {
	return c.text(`Server is currently running on port ${port}`)
})

// Route for updating files
app.post('/update', async (c) => {
	const base = resolve(path.dirname(path.dirname(__dirname)), 'src')

	if (!base) return c.json({ status: 'failed', message: 'No base directory' })
	const body: { path: string; content: string } = await c.req.json()

	try {
		const { path, content } = body
		setFileContent(resolve(base, path), content)
		
		// Wait for the rebuild to complete before sending response
		const result = await rebuildOPAC()

		if (result.success) {
			return c.json({ 
				status: 'success', 
				message: 'Your file has been updated successfully',
				buildMessage: result.message
			})
		} else {
			return c.json({ 
				status: 'partial', 
				message: 'File updated but build process had issues',
				buildMessage: result.message
			})
		}
	} catch (error) {
		console.error('Error updating file:', error)
		return c.json({ status: 'failed', message: 'Error updating file' })
	}
})
app.route('/easyload', easyload)

app.route('/tdr', tdr)

export { app }
