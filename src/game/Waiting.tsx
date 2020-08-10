import React from 'react'
import { GameState } from '../utils/contracts'
import LinearProgress from '@material-ui/core/LinearProgress'

interface WaitProps {
	state: GameState | false
}

const WaitForOther = (props: WaitProps) => {
	return (
		!!props.state &&
		props.state === GameState.PREPARING && (
			<div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
				<p>Waiting for other component to join ... </p>
				<LinearProgress />
			</div>
		)
	)
}

export default WaitForOther
