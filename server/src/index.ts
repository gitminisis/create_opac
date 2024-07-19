import Fastify, { FastifyRequest } from 'fastify'
import fastifyEnv from '@fastify/env'

import fs from 'node:fs'

const fastify = Fastify()
const DEFAULT_PORT = 8080

const schema = {
	type: 'object',
	required: ['PORT'],
	properties: {
		PORT: {
			type: 'string',
			default: DEFAULT_PORT,
		},
		CONSTANTS_BASE_DIR: {
			type: 'string',
		},
	},
}

const options = {
	confKey: 'config',
	schema: schema,
	dotenv: true,
	data: process.env,
}

type GET_FILE_REQUEST_TYPE = {
	file: string
}
type GET_FILE_REQUEST = FastifyRequest<{
	Querystring: { file: GET_FILE_REQUEST_TYPE }
}>

type POST_FILE_REQUEST_TYPE = {
	file: string
	content: string
}
type POST_FILE_REQUEST = FastifyRequest<{
	Body: POST_FILE_REQUEST_TYPE
}>

fastify.get('/', async (request: GET_FILE_REQUEST, reply) => {
	try {
		const { file } = request.query
		if (file) {
			const content = fs.readFileSync(
				`${process.env.CONSTANTS_BASE_DIR}/${file}.json`,
				'utf-8'
			)
			reply
				.code(200)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send(JSON.parse(content))
		}
	} catch (error) {
		console.error(error)
	}
})

fastify.post('/', async (request: POST_FILE_REQUEST, reply) => {
	try {
		const { file, content } = request.body

		if (file) {
			fs.writeFileSync(`${process.env.CONSTANTS_BASE_DIR}/${file}.json`, content)

			reply
				.code(200)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({ message: 'File updated successfully' })
		}
	} catch (error) {
		console.error(error)
	}
})

const start = async () => {
	try {
		console.log('Starting Server ==============')
		await fastify.register(fastifyEnv, options)
		await fastify.after()
		await fastify.ready()
		await fastify.listen({
			port: DEFAULT_PORT,
		})
		console.log(
			`Server ready on port ${DEFAULT_PORT}: http://localhost:${DEFAULT_PORT} ==============`
		)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

start()
