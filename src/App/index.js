import React, { Component } from 'react'
import Calculator from '../components/Calculator'
import Utils from '../functions/Utils'
import Eval from '../functions/Eval'
import PosNeg from '../functions/PosNeg'
import '../index.css'

const ops = ['+', '-', 'x', '/']

class App extends Component {
	
	state = {
		display: '0',
		store: '',
		runningTotal: '0',
		calculateCalled: false,
		isNegative: false,
		freeze: false
	}

	// component methods

	handleClick = btn => {
		// sets values and calls functions depending
		// on which button is pressed

		// user input is disabled when the
		// "digit limit exceeded" message is
		// being displayed
		const { freeze } = this.state
		if (freeze) return

		switch (btn) {
			case 'c':
				this.clear()
				break
			case 'ce':
				this.undoLastInput()
				break
			case '+':
			case '-':
			case 'x':
			case '/':
				this.updateWithOperator(btn)
		 		break
		 	case '.':
		 		this.state.calculateCalled
		 			? this.refresh('0.')
		 			: this.handleDecimal()
		 		break
		 	case '+/-':
		 		this.plusMinus()
		 		break
		  	default:
		  		this.state.calculateCalled
		  			? this.refresh(btn)
		    		: this.updateWithChar(btn)
		}
	}

	handleKeyDown = e => {
		// allows user to utilize keyboard
		e.preventDefault()

		const btn = e.key

		switch (btn) {
			case 'Enter':
				this.calculate()
				break
			case '1':
				this.handleClick('1')
				break
			case '2':
				this.handleClick('2')
				break
			case '3':
				this.handleClick('3')
				break
			case '4':
				this.handleClick('4')
				break
			case '5':
				this.handleClick('5')
				break
			case '6':
				this.handleClick('6')
				break
			case '7':
				this.handleClick('7')
				break
			case '8':
				this.handleClick('8')
				break
			case '9':
				this.handleClick('9')
				break
			case '0':
				this.handleClick('0')
				break
			case 'Backspace':
				this.handleClick('ce')
				break
			case '.':
				this.handleClick('.')
				break
			default:
				return
		}
	}

	clear = () =>
		// resets calculator to initial state
		this.setState({
			display: '0',
			store: '',
			runningTotal: '0',
			calculateCalled: false,
			isNegative: false,
			freeze: false
		})

	undoLastInput = () => {
		// resets display and last term
		// of runningTotal to '0'
		const { runningTotal } = this.state

		if (runningTotal !== '0') {
			const newRunningTotal = Utils.removeLastNumber(runningTotal) 

			this.setState({
				display: '0',
				runningTotal: newRunningTotal,
				calculateCalled: false,
				isNegative: false
			})
		}
	}

	limitReached = display => {
		// freezes user input for a short time
		// and displays an error message
		this.setState({ 
			display: 'LIMIT EXCEEDED',
			freeze: true
		})

		setTimeout(() => this.clearErrorMessage(display), 1500)
	}

	clearErrorMessage = prevDisplay => 
		// re-enables user input after an error message
		// and clears the message from the display,
		// replacing it with the last term entered
		this.setState({
			display: prevDisplay,
			freeze: false
		})

	updateWithOperator = operator => {
		// handles the input of operators to runningTotal
		// and store and updates display accordingly

		// reset calculateCalled and isNegative each
		// time an operator is entered
		this.setState({ calculateCalled: false, isNegative: false })

		// determine whether to swap the last char of the
		// evaluation string with the operator or to append
		// the operator to the end of the evaluation string
		const { runningTotal } = this.state
		const lastChar = Utils.lastItem([...runningTotal], false)
		const isOperator = Utils.opOrNot(lastChar)

		if (isOperator) {
			// if the last character entered was an operator then
			// replace it with the new operator
			this.swapLastOperator(operator)
		} else {
			// if the last character entered was a number then
			// append the operator to runningTotal and store
			this.calcRunningTotal()
			this.chainOperations(operator)
		}
	}

	swapLastOperator = operator => {
		// swaps the last char on store and runningTotal for
		// a new operator char

		const { runningTotal, store } = this.state
		// spaces are added around operators in
		// store for better ux
		const opPlusSpaces = ` ${operator} `
		const newRunningTotal = Utils.replaceEndChars(operator, runningTotal, 1)
		const newStore = Utils.replaceEndChars(opPlusSpaces, store, 3)

		this.setState({
			runningTotal: newRunningTotal,
			store: newStore
		})
	}
	
	calcRunningTotal = () => {
		// each time an operator is entered after a number 
		// runningTotal is evaluated
		const { runningTotal, display } = this.state
		const total = Eval.runningTotal(runningTotal)
		
		if(total.length > 15) {
			// check to see if chars limit has been reached and
			// if so display an error message and temporarily
			// freeze user input
			this.limitReached(display)
		} else {
			// if total chars don't exceed the limit then set state
			// to prepare for the next term to be entered
			this.setState({
				runningTotal: total,
			})
		}
	}

	chainOperations = operator => {
		// allows user to chain multiple calculations
		// and updates store, display and runningTotal appropriately
		this.setState(prevState => {
			const {
				store,
				display,
				runningTotal
			} = prevState

			// don't add the 'LIMIT EXCEEDED' error
			// message to the store
			if (display === 'LIMIT EXCEEDED') return

			const newStore = Utils.charStrCombiner(operator, store, display)// '+'  // '1 + ' // '-2'

			return {
				store: newStore,
				display: runningTotal,
				runningTotal: runningTotal + operator
			}
		})
	}

	handleDecimal = () => {
		// determines when to add decimals to
		// display and runningTotal
		const rtArray = [...this.state.runningTotal]
		const lastChar = Utils.lastItem(rtArray, false)
		const lastOp = Utils.lastOperator(rtArray)

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
		} else if (ops.includes(lastChar)) {
			// if last char entered was an operator return '0.'
			this.leadingZero()
		} else {
			// if last char entered was a number append the '.'
			this.updateWithChar('.')
		}
	}

	updateWithChar = char => {
		// determines how to add new characters
		// to display and runningTotal

		this.setState(prevState => {
			// allows user to append decimals and
			// integers to a negative term without
			// changing the state of isNegative
			const { display } = prevState

			if (display[0] !== '-') {
				return {
					isNegative: false
				}
			}
		})

		const { runningTotal } = this.state
		const lastChar = Utils.lastItem([...runningTotal], false)

		if (ops.includes(lastChar) || runningTotal === '0') {
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

	updateDisplay = char =>
		// swaps current display with the char that
		// was entered and updates runningTotal
		this.setState(prevState => {
			const { runningTotal } = prevState

			return {
				display: char,
				runningTotal: runningTotal + char
			}
		})

	concatChar = char => {
		// check the number of chars
		// currently being displayed 
		// to see if the limit has been reached
		const { display } = this.state

		if (display.length > 15) {
			// if the limit is reached, notify the
			// user and disable input for a 
			// short time
			this.limitReached(display)
		} else {
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
	}

	leadingZero = () => 
		// begins new decimal terms after
		// an operator with a leading '0' 
		this.setState(prevState => {
			const { runningTotal } = prevState

			return {
				display: '0.',
				runningTotal: runningTotal + '0.'
			}
		})

	plusMinus = () => {
		// handles the '+/-' button
		const { runningTotal } = this.state
		const lastChar = Utils.lastItem([...runningTotal], false)
		
		if (runningTotal === '0' || ops.includes(lastChar)) {
			// if nothing has yet been entered return
			return
		} else {
			this.negateNum(runningTotal)
		}
	}

	negateNum = str =>
		this.setState(prevState => {
			const { display, isNegative} = prevState

			if (isNegative) {
				// if the term that has focus is negative
				// then make it positive in the display
				// and in runningTotal
				const posDisplay = display.replace('-', '')
				const newStr = PosNeg.removeNegativeSign(str)
				
				return {
					display: posDisplay,
					runningTotal: newStr,
					isNegative: !isNegative
				}
			} else {
				// if the term that has focus is positive
				// then make it negative in the display
				// and in runningTotal
				const newRt = PosNeg.addNegativeSign(str)

				return {
					display: '-' + display,
					runningTotal: newRt,
					isNegative: !isNegative
				}
			}
		})
		
	calculate = () => {
		// evaluates runningTotal, sets the resulting value to display
		// and clears the store when '=' button is pressed
		const { runningTotal, display } = this.state
		const total = Eval.calculate(runningTotal, display)
		
		if(total.length > 15) {
			// check to see if chars limit has been reached and
			// if so display an error message and temporarily
			// freeze user input
			this.limitReached(display)
		} else {
			// if number of chars don't exceed the limit then
			// set state to mimick the "=" button functionality

			// check if the evaluation of runningTotal and 
			// display yields a positive or negative term
			const negativeState = total.includes('-') ? true : false

			this.setState({
				display: total,
				store: '',
				runningTotal: total,
				calculateCalled: true,
				isNegative: negativeState
			})
		}	
	}

	refresh = char => 
		// begins a new calculation chain when a number
		// or decimal is entered after calculate() has been called
		this.setState({
			display: char,
			runningTotal: char,
			calculateCalled: false
		})
	
	render() {
		// console.log(`runningTotal: ${this.state.runningTotal}`)
		return (
			<div className="app">
				<Calculator 
					display={this.state.display}
					store={this.state.store}
					handleClick={this.handleClick}
					calculate={this.calculate}
					handleKeyDown={this.handleKeyDown}
				/>	
			</div>
		)
	}
}

export default App
