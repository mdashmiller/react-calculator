import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		display: '0',
		store: '',
		runningTotal: '0',
		ops: ['+', '-', '*', '/']
	}

	// component methods

	handleChange = e => {
		// sets values and calls functions depending
		// on which button is pressed
		const btn = e.target.value
		switch (btn) {
			case 'c':
				this.setState({
					display: '0' ,
					store: '',
					runningTotal: '0'
				})
				break
			case 'ce':
				if (this.state.runningTotal !== '0') {
					const newRunningTotal = this.removeLastNumber() 
					this.setState({
						display: '0' ,
						runningTotal: newRunningTotal
					})
				}
				break
			case '+':
			case '-':
			case '*':
			case '/':
				this.updateMemory(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	removeLastNumber = () => {
		const runningTotalArr = [...this.state.runningTotal]

		// determines the last operator entered
		const lastOp = runningTotalArr.filter(item => 
			this.state.ops.includes(item)									 
		).pop()

		if (lastOp === undefined) {
			// if no operator has been entered yet
			// runningTotal will be set back to '0'
			return '0'
		} else {
			// removes any digits from runningTotal that
			// are after the last operator entered
			const lastOpIndex = runningTotalArr.lastIndexOf(lastOp)
			return runningTotalArr.filter((item, index) => 
				index <= lastOpIndex	
			).join('')
		}
	}

	updateMemory = value => {
		// handles the input of operators to runningTotal
		// and store and updates display accordingly
		const rtArray = [...this.state.runningTotal]
		const rtLength = rtArray.length
		const rtLastItem = rtArray[rtLength - 1]
		const storeArr = [...this.state.store]
		const storeLength = storeArr.length
		switch (rtLastItem) {
			case '+':
			case '-':
			case '*':
			case '/':
				// if the last item entered was an operator then
				// replace it with the new operator
				const newRunningTotalArr = rtArray.filter((item, index) => 
					index !== rtLength - 1)
				newRunningTotalArr.push(value)
				const newRunningTotal = newRunningTotalArr.join('')
				const newStoreArr = storeArr.filter((item, index) => 
					index !== storeLength - 1)
				newStoreArr.push(value)
				const newStore = newStoreArr.join('')
				this.setState({
					runningTotal : newRunningTotal,
					store : newStore
				})
				break
			default:
				// if the last item entered was a number then
				// append the operator to runningTotal and store
				this.calcRunningTotal()
				this.setState(prevState => {
					const {
						store,
						display,
						runningTotal
					} = prevState
					return {
						store: store + display + value,
						display: runningTotal,
						runningTotal: runningTotal + value
					}
				})
		}
	}

	calcRunningTotal = () => {
		// each time a new operator is entered
		// running total is evaluated
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({ runningTotal: total })
	}

	updateScreenWithNumber = number => {
		const rtArray = [...this.state.runningTotal]
		const rtLength = rtArray.length
		const lastItem = rtArray[rtLength - 1]
		if (this.state.ops.includes(lastItem) || this.state.runningTotal === '0') {
			// if last item entered was an operator
			// or nothing has yet been input
			// replace previous number in display with the new number
			// and concatenate the new number to runningTotal
			this.setState(prevState => {
				const { runningTotal } = prevState
				return {
					display: number,
					runningTotal: runningTotal + number
				}
			})
		} else {
			// if last item entered was a number
			// continue adding digits to the number
			// both in runningTotal and display
			this.setState(prevState => {
				const { display, runningTotal } = prevState
				return {
					display: display + number,
					runningTotal: runningTotal + number
				}
			})
		}
	}

	calculate = () => {
		// evaluates runningTotal, sets the resulting value to display
		// and clears the store when '=' button is pressed
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({
			display: total,
			store: '',
			runningTotal: total
		})
	}
		
	onSubmit = e =>
		// prevents page reloading
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
