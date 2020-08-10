import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'

interface ErrorProps {
	error: {
		error: string
		message: string
	}
	removeErrorFromStore: () => void
}

const ErrorMessage = ({ error, removeErrorFromStore }: ErrorProps) => {
	const handleClose = (
		event: React.SyntheticEvent | React.MouseEvent,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		removeErrorFromStore()
	}

	if (error) {
		return (
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={!!error?.error}
				autoHideDuration={error.error === 'PLAYER_EXCEEDING' ? null : 3000}
				onClose={e => handleClose(e)}
				message={error.message}
			/>
		)
	} else return null
}

export default ErrorMessage
