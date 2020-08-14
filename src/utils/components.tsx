import posed from 'react-pose';

export const PoseDiv = posed.div({
	enter: { y: 0, opacity: 1 },
	exit: { y: 50, opacity: 0 }
});