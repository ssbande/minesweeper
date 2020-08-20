import posed from 'react-pose';
import React, { useEffect, useRef } from 'react';
import Avatar from 'avataaars'
import {
	Theme,
	withStyles,
	createStyles,
} from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import { pulse, headShake, slideInUp, fadeIn, zoomIn, slideInRight } from 'react-animations';
import Radium from 'radium';
import { IData } from './contracts';

export const PoseDiv = posed.div({
  enter: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 }
});

export const usePrevious = <T extends IData>(value: T): T => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current ? ref.current : {} as T;
};

export const avataars = [
  <Avatar key={0} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='ShortHairShortFlat' accessoriesType='Blank' hairColor='Black' facialHairType='Blank' clotheType='CollarSweater' clotheColor='Black' eyeType='Happy' eyebrowType='Default' mouthType='Default' skinColor='Light' />,
  <Avatar key={1} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='LongHairBob' accessoriesType='Blank' hairColor='Black' facialHairType='Blank' clotheType='CollarSweater' clotheColor='Black' eyeType='Happy' eyebrowType='Default' mouthType='Default' skinColor='Light' />,
  <Avatar key={2} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='LongHairBigHair' accessoriesType='Prescription01' hairColor='Black' facialHairType='Blank' clotheType='Overall' clotheColor='Pink' eyeType='Happy' eyebrowType='Default' mouthType='Default' skinColor='Light' />,
  <Avatar key={3} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='LongHairBigHair' accessoriesType='Blank' hairColor='Blue03' facialHairType='Blank' clotheType='CollarSweater' clotheColor='Gray02' eyeType='Default' eyebrowType='Default' mouthType='Default' skinColor='Light' />,
  <Avatar key={4} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='ShortHairShortFlat' accessoriesType='Wayfarers' hairColor='Black' facialHairType='Blank' clotheType='Hoodie' clotheColor='Heather' eyeType='Default' eyebrowType='RaisedExcited' mouthType='Default' skinColor='Light' />,
  <Avatar key={5} style={{ width: '100px', height: '100px' }} avatarStyle='Circle' topType='LongHairStraight2' accessoriesType='Round' hairColor='Black' facialHairType='Blank' clotheType='GraphicShirt' clotheColor='Red' graphicType='Bear' eyeType='Dizzy' eyebrowType='Default' mouthType='Default' skinColor='Light' />,
  <Avatar key={6} style={{ width: '100px', height: '100px' }} avatarStyle="Circle" topType="LongHairMiaWallace" accessoriesType="Prescription02" hairColor="BrownDark" facialHairType="Blank" clotheColor="PastelBlue" clotheType="Hoodie" eyeType="Happy" eyebrowType="Default" mouthType="Smile" skinColor="Light" />,
  <Avatar key={7} style={{ width: '100px', height: '100px' }} avatarStyle="Circle" topType="ShortHairDreads01" accessoriesType="Prescription02" hairColor="Brown" facialHairType="BeardMedium" facialHairColor="BrownDark" clotheType="BlazerShirt" eyeType="Default" eyebrowType="Default" mouthType="Default" skinColor="Light" />,
  <Avatar key={8} style={{ width: '100px', height: '100px' }} avatarStyle="Circle" topType="WinterHat3" accessoriesType="Prescription02" facialHairType="Blank" clotheType="Hoodie" clotheColor="Gray01" eyeType="Default" eyebrowType="Default" mouthType="Tongue" skinColor="Light" />,
  <Avatar key={9} style={{ width: '100px', height: '100px' }} avatarStyle="Circle" topType="LongHairStraight" accessoriesType="Kurt" hairColor="Brown" facialHairType="Blank" clotheType="Hoodie" clotheColor="Heather" eyeType="Default" eyebrowType="Default" mouthType="Smile" skinColor="Light" />,
]

export const animeStyles = {
  pulse: {
    animation: 'x 1s ease 1s infinite',
    animationName: Radium.keyframes(pulse, 'pulse',)
  },
  headShake: {
    animation: 'x 3s ease 1s infinite',
    animationName: Radium.keyframes(headShake, 'headShake',)
  },
  slideInUp: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(slideInUp, 'slideInUp',)
  },
  slideInRight: {
    animation: 'x 1.5s ease 0s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight',)
  },
  fadeIn: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(fadeIn, 'fadeIn',)
  },
  zoomIn: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(zoomIn, 'zoomIn',)
  }
}

export const StyledBadge = withStyles((theme: Theme) => createStyles({
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

export const fieldContainerStyle = (maxRows: number, maxCols: number) => ({
  width: `${30 * maxCols + 40}px`,
  height: `${30 * maxRows + 40}px`,
  border: '1px solid silver',
  padding: 20,
  background: 'white',
  borderRadius: '4px',
  boxShadow: '4px 4px 4px darkgrey',
  marginTop: '30px'
})