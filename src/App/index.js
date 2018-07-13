import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		display: '0',
		store: '',
		runningTotal: ''
	}

	// component methods
	updateScreenWithNumber = value => // 1
		this.setState(prevState => {
			const { runningTotal } = prevState // ''
			return {
				display: value, // 1
				runningTotal: runningTotal + value  // 1
			}
		})

	updateMemory = value => { // -
		const rtArray = [...this.state.runningTotal]	// [1+]
		const rtLength = rtArray.length // 2
		const lastItem = rtArray[rtLength - 1] // +
		switch (lastItem) { // +
			case '+':
			case '-':
			case '*':
			case '/':	
				const newRunningTotalArr = rtArray.filter((item, index) => 
					index !== rtLength - 1) // [1]
				newRunningTotalArr.push(value) // [1, -]
				const updatedRT = newRunningTotalArr.join('') // '1-'
				this.setState({
					runningTotal : updatedRT,  // '1 - '
					store : updatedRT // '1 - '  
				})
				break
			default:
				//const updatedRTc2 = runningTotal + value
				this.setState(prevState => {
					const {
						store, // ''
						display,  // 1
						runningTotal // 1
					} = prevState
					return {
						store: store + display + value, // 1+
						display: runningTotal, // 1
						runningTotal: runningTotal + value // 1+
					}
				})
		}
	}

	checkForOperator = value => { // -
		switch (value) {
			case '+':
			case '-':
			case '/':
			case '*':	
				this.updateMemory(value)
				break
			default:
				this.setState = prevState => {
					const { runningTotal } = prevState
					return { runningTotal: runningTotal + value }
				}
		}
	}
			
	handleChange = e => {
		const btn = e.target.value
		switch (btn) {
			case 'c':
				this.setState({
					display: '' ,
					store: '',
					runningTotal: ''
				})
				break
			case 'ce':
				const newRunningTotal = this.removeLast() 
				this.setState({
					display: '0' ,
					runningTotal: newRunningTotal
				})
				break
			case '+':
			case '-':
			case '*':
			case '/':
				this.checkForOperator(btn)
				this.calcRunningTotal()
		 		//this.checkForOperator(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	removeLast = () => {
		const rtArray = [...this.state.runningTotal] 
		const rtLength = rtArray.length 
		const lastItem = rtArray[rtLength - 1]
			switch (lastItem) {
				case '+':
				case '-':
				case '*':
				case '/':
					return this.state.runningTotal
				default:
					return rtArray.filter((item, index) =>
						index !== rtLength -1).join('')	
			}
	}

	calcRunningTotal = () => {
		const total = math.eval(this.state.runningTotal).toString() 
		this.setState({ runningTotal: total })
	}
		
	calculate = () => {
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({
			display: total,
			store: '',
			runningTotal: total
		})
	}
		
	onSubmit = e =>
		e.preventDefault()

	render() {
		console.log(`runningTotal is ${this.state.runningTotal} and type ${typeof this.state.runningTotal}`)
		return (
			<div className="app">
				<Calculator 
					display={this.state.display}
					store={this.state.store}
					runningTotal={this.runningTotal} 
					handleChange={this.handleChange}
					calculate={this.calculate}
					onSubmit={this.onSubmit}
				/>	
			</div>
		)
	}
}

export default App
