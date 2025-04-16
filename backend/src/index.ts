import { serve } from '@hono/node-server'
import { app } from './app'

const port = 3030

serve({
	fetch: app.fetch,
	port,
})
