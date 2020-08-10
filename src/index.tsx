import React from 'react'
import ReactDOM from 'react-dom'
import './app/index.scss'
import App from './app/App'
import { Provider } from 'react-redux'
import configureStore from './state/store'

ReactDOM.render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.getElementById('root')
)
