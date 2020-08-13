import React from 'react';
import ReactDOM from "react-dom";
import moment from 'moment';
import { IData } from '../utils/contracts';
import '../styles/timer.scss';
import TimerIcon from '../styles/images/stopwatch.png'

interface ITimerProps {
  time: number
}

interface ITimerState extends IData {
  firstSeconds: string;
  lastSeconds: string;
  firstMinutes: string;
  lastMinutes: string;
  firstHours: string;
  lastHours: string;
  seconds: string;
  minutes: string;
  hours: string;
}

class AppTimer extends React.Component<ITimerProps, ITimerState>{
  state = {
    firstSeconds: '0',
    lastSeconds: '0',
    firstMinutes: '0',
    lastMinutes: '0',
    firstHours: '0',
    lastHours: '0',
    seconds: '00',
    minutes: '00',
    hours: '00',
  }
  componentDidUpdate(prev: ITimerProps) {
    var now = this.props.time

    // var lastHours = last.getHours().toString()
    // var nowHours = now.getHours().toString()
    // if (lastHours !== nowHours) {
    //   updateContainer(hoursContainer, nowHours)
    // }

    // var lastMinutes = last.getMinutes().toString()
    // var nowMinutes = now.getMinutes().toString()
    // if (lastMinutes !== nowMinutes) {
    //   updateContainer(minutesContainer, nowMinutes)
    // }

    const node = ReactDOM.findDOMNode(this);
    if (node instanceof HTMLElement) {
      // const secondsContainer = node.querySelector('.seconds');
      // var hoursContainer = document.querySelector('.hours')
      // var minutesContainer = document.querySelector('.minutes')

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

  // updateContainer = (unit: any, val: number, unitName: string) => {
  //   var time = val.toString().padStart(2, '0')

  //   var first = unit.firstElementChild
  //   if (first.lastElementChild.textContent !== time[0]) {
  //     this.updateNumber(first, time[0], unitName, 'first')
  //   }

  //   var last = unit.lastElementChild
  //   if (last.lastElementChild.textContent !== time[1]) {
  //     this.updateNumber(last, time[1], unitName, 'last')
  //   }
  // }

  // updateNumber = (part: any, value: string, unitName: string, partName: string) => {
  //   var second = part.lastElementChild.cloneNode(true)
  //   // second.textContent = value
  //   console.log(`${partName}${unitName}`, value)
  //   this.setState({ [`${partName}${unitName}`]: value })

  //   part.appendChild(second)
  //   part.classList.add('move')

  //   setTimeout(function () {
  //     part.classList.remove('move')
  //   }, 990)
  //   setTimeout(function () {
  //     part.removeChild(part.firstElementChild)
  //   }, 990)
  // }

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

export default AppTimer

// var hoursContainer = document.querySelector('.hours')
// var minutesContainer = document.querySelector('.minutes')
// var secondsContainer = document.querySelector('.seconds')
// var tickElements = Array.from(document.querySelectorAll('.tick'))

// var last = new Date(0)
// last.setUTCHours(-1)

// var tickState = true

// function updateTime () {
//   var now = new Date

//   var lastHours = last.getHours().toString()
//   var nowHours = now.getHours().toString()
//   if (lastHours !== nowHours) {
//     updateContainer(hoursContainer, nowHours)
//   }

//   var lastMinutes = last.getMinutes().toString()
//   var nowMinutes = now.getMinutes().toString()
//   if (lastMinutes !== nowMinutes) {
//     updateContainer(minutesContainer, nowMinutes)
//   }

//   var lastSeconds = last.getSeconds().toString()
//   var nowSeconds = now.getSeconds().toString()
//   if (lastSeconds !== nowSeconds) {
//     //tick()
//     updateContainer(secondsContainer, nowSeconds)
//   }

//   last = now
// }

// function tick () {
//   tickElements.forEach(t => t.classList.toggle('tick-hidden'))
// }

// function updateContainer (container, newTime) {
//   var time = newTime.split('')

//   if (time.length === 1) {
//     time.unshift('0')
//   }


//   var first = container.firstElementChild
//   if (first.lastElementChild.textContent !== time[0]) {
//     updateNumber(first, time[0])
//   }

//   var last = container.lastElementChild
//   if (last.lastElementChild.textContent !== time[1]) {
//     updateNumber(last, time[1])
//   }
// }

// function updateNumber (element, number) {
//   //element.lastElementChild.textContent = number
//   var second = element.lastElementChild.cloneNode(true)
//   second.textContent = number

//   element.appendChild(second)
//   element.classList.add('move')

//   setTimeout(function () {
//     element.classList.remove('move')
//   }, 990)
//   setTimeout(function () {
//     element.removeChild(element.firstElementChild)
//   }, 990)
// }

// setInterval(updateTime, 100)