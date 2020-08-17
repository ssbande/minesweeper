import React from 'react';
import ReactDOM from "react-dom";
import moment from 'moment';
import { ITimerProps, ITimerState } from '../utils/contracts';
import '../styles/timer.scss';
import TimerIcon from '../styles/images/stopwatch.png'

class AppTimer extends React.Component<ITimerProps, ITimerState>{
  state = {
    seconds: '00',
    minutes: '00',
    hours: '00',
  }

  componentDidUpdate(prev: ITimerProps) {
    var now = this.props.time

    const node = ReactDOM.findDOMNode(this);
    if (node instanceof HTMLElement) {
      const newSeconds = moment.duration(now).seconds();
      const oldSeconds = moment.duration(prev.time).seconds();

      const newMinutes = moment.duration(now).minutes();
      const oldMinutes = moment.duration(prev.time).minutes();

      const newHours = moment.duration(now).hours();
      const oldHours = moment.duration(prev.time).hours();

      if (newSeconds !== oldSeconds) {
        this.setState({ seconds: newSeconds.toString().padStart(2, '0') })
      }
      if (newMinutes !== oldMinutes) {
        this.setState({ minutes: newMinutes.toString().padStart(2, '0') })
      }
      if (newHours !== oldHours) {
        this.setState({ hours: newHours.toString().padStart(2, '0') })
      }
    }
  }

  render() {
    return <div className='bombInfo'>
      <img alt="timer" src={TimerIcon} height={35} width={35} />
      <div className="clock">
        <div className="hours">
          <div className="first">
            <div className="number">{this.state.hours[0]}</div>
          </div>
          <div className="second">
            <div className="number">{this.state.hours[1]}</div>
          </div>
        </div>
        <div className="tick">:</div>
        <div className="minutes">
          <div className="first">
            <div className="number">{this.state.minutes[0]}</div>
          </div>
          <div className="second">
            <div className="number">{this.state.minutes[1]}</div>
          </div>
        </div>
        <div className="tick">:</div>
        <div className="seconds">
          <div className="first">
            <div className="number">{this.state.seconds[0]}</div>
          </div>
          <div className="second infinite">
            <div className="number">{this.state.seconds[1]}</div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default AppTimer;