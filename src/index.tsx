import React from 'react'
import ReactDOM from 'react-dom'
import './app/index.scss'
import App from './app/App'
import Landing from './app/Landing'
import { Provider } from 'react-redux'
import configureStore from './state/store'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const RouteContainer = posed.div({
	enter: { opacity: 1, delay: 100, beforeChildren: true },
	exit: { opacity: 0 }
});

const AppRoutes = () => (
	<Route
		render={({ location }) => (
			<div id="site-container">
				<AppBar position="static">
					<Toolbar variant="dense">
						<Typography variant="h6" color="inherit">
							Minesweeper - SB
					</Typography>
					</Toolbar>
				</AppBar>
				<PoseGroup>
					<RouteContainer key={location.pathname}>
						<Switch location={location}>
							<Route exact path="/" component={Landing} key="landing" />
							<Route path="/home" component={App} key="home" />
						</Switch>
					</RouteContainer>
				</PoseGroup>
			</div>
		)}
	/>
);

ReactDOM.render(
	<BrowserRouter>
		<Provider store={configureStore()}>
			<AppRoutes />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
)
