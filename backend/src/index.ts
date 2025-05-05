import { serve } from '@hono/node-server'
import { app } from './app'

export const port = Number(process.env.PORT) || 3030

serve({
	fetch: app.fetch,
	port,
})
