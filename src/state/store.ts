import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import { IAppState } from '../utils/contracts'

export default function configureStore(initialState?: IAppState) {
	return createStore(
		rootReducer,
		initialState as any,
		composeWithDevTools({})(applyMiddleware(thunk))
	)
}
