import React from 'react'
import Badge from '@material-ui/core/Badge'
import Avatar from 'avataaars'
import {
	Theme,
	makeStyles,
	withStyles,
	createStyles,
} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import { IPlayer, GameState } from '../utils/contracts';
import Bomb from '../styles/images/bomb.png';
import AppTimer from './Timer';

interface InfoProps {
	gameId: string
	player: IPlayer
	state: GameState
	judge: string
	winner: string
	time: number
	bombs: number
}

const StyledBadge = withStyles((theme: Theme) =>
	createStyles({
		badge: {
			backgroundColor: '#44b700',
			color: '#44b700',
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			'&::after': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: '50%',
				animation: '$ripple 1.2s infinite ease-in-out',
				border: '1px solid currentColor',
				content: '""',
			},
		},
		'@keyframes ripple': {
			'0%': {
				transform: 'scale(.8)',
				opacity: 1,
			},
			'100%': {
				transform: 'scale(2.4)',
				opacity: 0,
			},
		},
	})
)(Badge)

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			'& > *': {
				margin: theme.spacing(1),
			},
		},
	})
)

const avataars = [
	<Avatar
		key={0}
		style={{ width: '100px', height: '100px' }}
		avatarStyle="Circle"
		topType="LongHairMiaWallace"
		accessoriesType="Prescription02"
		hairColor="BrownDark"
		facialHairType="Blank"
		clotheColor="PastelBlue"
		clotheType="Hoodie"
		eyeType="Happy"
		eyebrowType="Default"
		mouthType="Smile"
		skinColor="Light"
	/>,
	<Avatar
		key={1}
		style={{ width: '100px', height: '100px' }}
		avatarStyle="Circle"
		topType="ShortHairDreads01"
		accessoriesType="Prescription02"
		hairColor="Brown"
		facialHairType="BeardMedium"
		facialHairColor="BrownDark"
		clotheType="BlazerShirt"
		eyeType="Default"
		eyebrowType="Default"
		mouthType="Default"
		skinColor="Light"
	/>,
	<Avatar
		key={2}
		style={{ width: '100px', height: '100px' }}
		avatarStyle="Circle"
		topType="WinterHat3"
		accessoriesType="Prescription02"
		facialHairType="Blank"
		clotheType="Hoodie"
		clotheColor="Gray01"
		eyeType="Default"
		eyebrowType="Default"
		mouthType="Tongue"
		skinColor="Light"
	/>,
	<Avatar
		key={3}
		style={{ width: '100px', height: '100px' }}
		avatarStyle="Circle"
		topType="LongHairStraight"
		accessoriesType="Kurt"
		hairColor="Brown"
		facialHairType="Blank"
		clotheType="Hoodie"
		clotheColor="Heather"
		eyeType="Default"
		eyebrowType="Default"
		mouthType="Smile"
		skinColor="Light"
	/>,
]

const Info: React.FC<InfoProps> = ({
	player,
	gameId,
	state,
	judge,
	winner,
	time,
	bombs
}) => {
	const classes = useStyles()
	return (
		<div className='infoContainer'>
			<div className={classes.root}>
				<StyledBadge
					overlap="circle"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					variant="dot"
				>
					{avataars[+player.id]}
				</StyledBadge>
				{!!player && (
					<div className="playerInfo">
						<div>Hello !</div>
						<div>You are {player.name}</div>
						{state === GameState.OVER && (
							<div className="playerWinInfo">
								{judge === 'DRAW' && <div>It's a draw !!!</div>}
								{judge !== 'DRAW' && <div>
									{winner === player.id
										? (<div>You won !!!</div>)
										: (<div>You Lost</div>)
									}
								</div>}
							</div>
						)}
					</div>
				)}
			</div>
			<div className="playerInfo">
				<div className="playerWinInfo">GAME INFO</div>
				<div style={{ marginBottom: 5 }}>Room: {gameId}</div>
				<Divider />
				<div className='infoContainer' style={{ marginTop: 5 }}>
					<div className='bombInfo'>
						<img src={Bomb} alt="bomb" height={35} width={35} />
						{bombs}
					</div>
					<AppTimer time={time} />
				</div>
			</div>
		</div>
	)
}

export default Info

