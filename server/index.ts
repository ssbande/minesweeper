import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import * as gameController from './controllers/gameController';

export const app = express()
const port = process.env.PORT || 5000

app.use((req: Request, res: Response, next: any) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	res.header('Access-Control-Allow-Methods', '*')
	res.header('x-Trigger', 'CORS')

	req.method === 'OPTIONS' ? res.sendStatus(200) : next()
})

app.options('/*', (req: Request, res: Response) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	res.header('Access-Control-Allow-Headers', 'GET, PUT, POST, DELETE, OPTIONS')
	res.send(200)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API Endpoints
app.post('/api/v1/createGame/:level', gameController.create)
app.put('/api/v1/:gameId/join', gameController.join)
app.get('/api/v1/:gameId/info', gameController.getInfo)
app.get('/api/v1/:gameId/status', gameController.checkStatus)
app.put('/api/v1/:gameId/move', gameController.makeMove)
app.delete('/api/v1/:gameId/remove/:id', gameController.removePlayer)

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`))
