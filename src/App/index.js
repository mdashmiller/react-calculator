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
				this.clear()
				break
			case 'ce':
				this.undoLastInput()
				break
			case '+':
			case '-':
			case '*':
			case '/':
				this.updateWithOperator(btn)
		 		break
		 	case '.':
		 		this.handleDecimal()
		 		break
		  	default:
		    	this.updateWithChar(btn)
		}
	}

	clear = () => {
		// resets calculator to initial state
		this.setState({
			display: '0' ,
			store: '',
			runningTotal: '0'
		})
	}

	undoLastInput = () => {
		// resets display and last term
		// of runningTotal to '0'
		if (this.state.runningTotal !== '0') {
			const newRunningTotal = this.removeLastNumber() 
			this.setState({
				display: '0' ,
				runningTotal: newRunningTotal
			})
		}
	}

	removeLastNumber = () => {
		// removes the last term entered
		const rtArray = [...this.state.runningTotal]		
		const lastOp = this.lastOperatorEntered()

		if (lastOp === undefined) {
			// if no operator has been entered yet
			// runningTotal will be set back to '0'
			return '0'
		} else {
			// removes any digits from runningTotal that
			// are after the last operator entered
			const lastOpIndex = rtArray.lastIndexOf(lastOp)
			return rtArray.filter((item, index) => 
				index <= lastOpIndex	
			).join('')
		}
	}

	lastCharEntered = () => {
		// determines the last character entered by the user
		const rtArray = [...this.state.runningTotal]
		const rtLength = rtArray.length
		return rtArray[rtLength - 1]
	}

	lastOperatorEntered = () => {
		// determines the last operator entered by the user
		const rtArray = [...this.state.runningTotal]
		return rtArray.filter(item => 
			this.state.ops.includes(item)									 
		).pop()
	}

	updateWithOperator = operator => {
		// handles the input of operators to runningTotal
		// and store and updates display accordingly
		const lastChar = this.lastCharEntered()
		
		switch (lastChar) {
			case '+':
			case '-':
			case '*':
			case '/':
				// if the last character entered was an operator then
				// replace it with the new operator
				this.swapLastOperator(operator)
				break
			default:
				// if the last character entered was a number then
				// append the operator to runningTotal and store
				this.calcRunningTotal()
				this.chainOperations(operator)
		}
	}

	swapLastOperator = (operator) => {
		// swaps the last char on store and runningTotal for
		// a new operator char
		const newRunningTotal = this.replaceLastChar(operator, this.state.runningTotal)
		const newStore = this.replaceLastChar(operator, this.state.store)
		this.setState({
			runningTotal : newRunningTotal,
			store : newStore
		})
	}

	replaceLastChar = (char, field) => {
		// removes the last char from an array
		// and replaces it with another
		const prunedArray = this.removeLastChar(field)
		prunedArray.push(char)
		return prunedArray.join('')
	}

	removeLastChar = (field) => {
		// returns an array with the last char removed
		const array = [...field]
		const length = array.length
		return array.filter((item, index) =>
			index !== length -1)
	}

	calcRunningTotal = () => {
		// each time an operator is entered after a number 
		// runningTotal is evaluated
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({ runningTotal: total })
	}

	chainOperations = (operator) => {
		// allows user to chain multiple calculations
		// and updates store, display and runningTotal appropriately
		this.setState(prevState => {
			const {
				store,
				display,
				runningTotal
			} = prevState
			return {
				store: store + display + operator,
				display: runningTotal,
				runningTotal: runningTotal + operator
			}
		})
	}

	handleDecimal = () => {
		// determines when to add decimals to
		// display and runningTotal
		const rtArray = [...this.state.runningTotal]
		const lastChar = this.lastCharEntered()
		const lastOp = this.lastOperatorEntered()

		if (lastOp === undefined) {
			if (rtArray.includes('.')) {
				// if there is only one term and
				// it already contains a decimal, return
				return
			} else {
				// append the decimal if the term doesn't
				// yet contain one
				return this.updateWithChar('.')
			}
		}

		// if there is more than one term
		// determine the index of the last operator entered
		const lastOpIndex = rtArray.lastIndexOf(lastOp)
		
		if (rtArray.includes('.', lastOpIndex)) {
			// if last term entered contains a decimal, return
			return
		} else if (this.state.ops.includes(lastChar)) {
			// if last char entered was an operator return '0.'
			this.leadingZero()
		} else {
			// if last char entered was a number append the '.'
			this.updateWithChar('.')
		}
	}

	leadingZero = () => {
		// begins new decimal terms after
		// an operator with a leading '0' 
		this.setState(prevState => {
			const { runningTotal } = prevState
			return {
				display: '0.',
				runningTotal: runningTotal + '.'
			}
		})
	}

	updateWithChar = char => {
		// determines how to add new characters
		// to display and runningTotal
		const lastChar = this.lastCharEntered()
		if (this.state.ops.includes(lastChar) || this.state.runningTotal === '0') {
			// if last character entered was an operator or nothing has yet
			// been entered and the '.' is pressed, retain the leading 
			// zero in display and append the '.' to runningTotal
			if (char === '.') {
				this.leadingZero()
			} else {
				// if last character entered was an operator or nothing has yet
				// been entered and anything other than '.' is pressed,
				// replace previous number in display with the new char
				// and concatenate the new char to runningTotal
				this.updateDisplay(char)
			}	
		} else {
			// if last character entered was a number
			// continue adding chars to the number
			// both in runningTotal and display
			this.concatChar(char)			
		}
	}

	updateDisplay = char => {
		// swaps current display with the char that
		// was entered and updates runningTotal
		this.setState(prevState => {
			const { runningTotal } = prevState
			return {
				display: char,
				runningTotal: runningTotal + char
			}
		})
	}

	concatChar = char => {
		// concatenates the char that was entered 
		// to display and runningTotal
		this.setState(prevState => {
			const { display, runningTotal } = prevState
			return {
				display: display + char,
				runningTotal: runningTotal + char
			}
		})
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
