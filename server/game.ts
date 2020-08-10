import mongoose from 'mongoose'
import { IGame, GameSchema } from './helpers/contracts'

const uri: string = 'mongodb://127.0.0.1:27017/local'

mongoose.connect(
	uri,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err: any) => {
		if (err) {
			console.log(err.message)
		} else {
			console.log('Successfully Connected to local Db!')
		}
	}
)

export interface IGameDocument extends IGame, mongoose.Document {}
const Game = mongoose.model<IGameDocument>('Game', GameSchema)
export default Game
