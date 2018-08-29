import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import '../index.css'

class App extends Component {
	state = {
		display: '0',
		store: '',
		runningTotal: '0',
		ops: ['+', '-', 'x', '/'],
		calculateCalled: false,
		isNegative: false
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

	clear = () =>
		// resets calculator to initial state
		this.setState({
			display: '0' ,
			store: '',
			runningTotal: '0',
			calculateCalled: false,
			isNegative: false
		})

	undoLastInput = () => {
		// resets display and last term
		// of runningTotal to '0'
		if (this.state.runningTotal !== '0') {
			const newRunningTotal = this.removeLastNumber() 
			this.setState({
				display: '0' ,
				runningTotal: newRunningTotal,
				calculateCalled: false,
				isNegative: false
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

	getOperators = field => {
		// takes a string and returns
		// an array of all the operators
		// it includes
		const array = [...field]
		return array.filter(item => 
			this.state.ops.includes(item)									 
		)
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
		this.setState({ calculateCalled: false })

		const lastChar = this.lastCharEntered()

		switch (lastChar) {
			case '+':
			case '-':
			case 'x':
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

	swapLastOperator = operator => {
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
		// removes the last char from a string
		// and replaces it with another
		const prunedArray = this.removeLastChar(field)
		prunedArray.push(char)
		return prunedArray.join('')
	}

	removeLastChar = field => {
		// returns an array with the last char removed
		const array = [...field]
		const length = array.length
		return array.filter((item, index) =>
			index !== length -1)
	}

	calcRunningTotal = () => {
		// each time an operator is entered after a number 
		// runningTotal is evaluated

		// 'x' chars in runningTotal need to be
		// converted to '*' chars for math.eval()
		// to work properly
		const toEvaluate = this.convertX(this.state.runningTotal)

		let total = math.eval(toEvaluate).toString()

		// round total to max of 4 decimal places
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}

		const negativeState = total.includes('-') ? true : false
		this.setState({
			runningTotal: total,
			isNegative: negativeState
		})
	}

	convertX = (str) => {
		// replaces all 'x' chars in a string
		// with '*' chars
		const x = /[x]/g
		return str.replace(x, '*')
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

			const tempStore = store + display + operator
			let newStore

			// checking to see if any
			// negative numbers have been entered
			if (tempStore.indexOf('--') !== -1  
				|| tempStore.indexOf('+-') !== -1 
				|| tempStore.indexOf('x-') !== -1 
				|| tempStore.indexOf('/-') !== -1) {
				newStore = this.handleParens(tempStore)
			} else {
				newStore = tempStore
			}

			return {
				store: newStore,
				display: runningTotal,
				runningTotal: runningTotal + operator
			}
		})
	}

	handleParens = tempStore => {
		//when a negaive number is entered it
		// will be encapsulated in parentheses
		const openParens = this.addOpenParens(tempStore)
		
		const openParensArr = [...openParens]
		const beginCheckLocations = []

		// finds each location to begin checking for
		// where to insert a closing parenthesis
		openParensArr.forEach((item, index) => {
			if (item === '(') {
				beginCheckLocations.push(index + 3)
			}						 
		})

		const storePrefix = this.createStorePrefix(beginCheckLocations, openParens)

		return this.createCheckStrings(beginCheckLocations, openParens, storePrefix)
	}

	addOpenParens = tempStore => {
		// returns a string with an opening parenthesis in
		// front of each negative number
		const dblNeg = /--/g
		const plusNeg = /\+-/g
		const timesNeg = /\x-/g
		const divNeg = /\/-/g
		const endParen = /\)/g
		// remove any pre-existing closing parentheses
		// to avoid double parentheses later
		const baseString = tempStore.replace(endParen, '')
		// insert opening parentheses where needed
		let openParens = baseString.replace(dblNeg, '-(-')
		openParens = openParens.replace(plusNeg, '+(-')
		openParens = openParens.replace(timesNeg, 'x(-')
		return openParens.replace(divNeg, '/(-')
	}

	createStorePrefix = (locations, tempStore) => {
		// removes and saves the portion of 
		// the string that occurs before the first
		// possible location of a closing parenthesis
		const cutoff = locations[0]
		const tempStoreArr = [...tempStore]
		return tempStoreArr.filter((item, index) =>
			index < cutoff												
		).join('')
	}

	createCheckStrings = (locations, openParens, storePrefix) => {
		// creates an array of substrings so that
		// each can be checked for the proper
		// location of a closing parenthesis
		let checkStr
		const checkStrings = []

		for (let i = 0; i < locations.length; i++) {
			checkStr = openParens.substring(locations[i], locations[i + 1])
			checkStrings.push(checkStr)
		}

		return this.findCloseParensLocs(checkStrings, locations, storePrefix)
	}

	findCloseParensLocs = (checkStrings, locations, storePrefix) => {
		// finds the index position in each checkString
		// where a closing parenthesis needs
		// to be inserted
		const closeParensLocations = []
		
		checkStrings.forEach(substr => {
			for (let i = 0; i < substr.length; i++) {
				if (this.state.ops.includes(substr[i])) {
					closeParensLocations.push(substr.indexOf(substr[i]))
					return
				}
			}
		})

		return this.insertCloseParens(closeParensLocations, checkStrings, storePrefix)
	}

	insertCloseParens = (locations, substrings, storePrefix) => {
		// takes each substring and inserts
		// the closing parenthesis then adds
		// it to an array 
		let counter = 0
		const newSubStrings = []
		
		substrings.forEach(substr => {
			let substrArray = [...substr]
			substrArray.splice(locations[counter], 0, ')')
			counter++
			newSubStrings.push(substrArray.join(''))
		})

		return this.createStoreWithParens(storePrefix, newSubStrings.join(''))
	}

	createStoreWithParens = (storePrefix, storeEnd) =>
		// concatenates the string with all the parentheses
		// now added to the end of the previously
		// removed portion of the original string
		storePrefix + storeEnd

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

	leadingZero = () => 
		// begins new decimal terms after
		// an operator with a leading '0' 
		this.setState(prevState => {
			const { runningTotal } = prevState
			return {
				display: '0.',
				runningTotal: runningTotal + '.'
			}
		})

	plusMinus = () => {
		// handles the '+/-' button
		const lastChar = this.lastCharEntered()
		
		if (this.state.runningTotal === '0' || this.state.ops.includes(lastChar)) {
			// if nothing has yet been entered return
			return
		} else {
			this.negateNum()
		}
	}
	
	negateNum = () =>
		// adds or removes '-' char in
		// display and runningTotal
		this.setState(prevState => {
			const { store, display, isNegative} = prevState

			if (isNegative) {
				const posDisplay = display.replace('-', '')
				return {
					display: posDisplay,
					runningTotal: `${store}${posDisplay}`,
					isNegative: !isNegative
				}
			} else {
				return {
					display: '-' + display,
					runningTotal: `${store}-${display}`,
					isNegative: !isNegative
				}
			}
		})

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

	concatChar = char =>
		// concatenates the char that was entered 
		// to display and runningTotal
		this.setState(prevState => {
			const { display, runningTotal } = prevState
			return {
				display: display + char,
				runningTotal: runningTotal + char
			}
		})

	calculate = () => {
		// evaluates runningTotal, sets the resulting value to display
		// and clears the store when '=' button is pressed

		// replace all 'x' chars with '*' chars for
		// math.eval() to work properly
		const rtToEvaluate = this.convertX(this.state.runningTotal)
		const displayToEvaluate = this.convertX(this.state.display)

		let total
		const lastChar = this.lastCharEntered()

		if (this.state.ops.includes(lastChar)) {
			total = math.eval(rtToEvaluate + displayToEvaluate).toString()
		} else {
			total = math.eval(rtToEvaluate).toString()
		}
		
		// rounds total to maximum of four decimal places
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}

		const negativeState = total.includes('-') ? true : false
		this.setState({
			display: total,
			store: '',
			runningTotal: total,
			calculateCalled: true,
			isNegative: negativeState
		})
	}

	refresh = char => 
		// begins a new calculation chain when a number
		// or decimal is entered after calculate() has been called
		this.setState({
			display: char,
			runningTotal: char,
			calculateCalled: false
		})
	
	onSubmit = e =>
		// prevents page reloading
		e.preventDefault()

	render() {
		return (
			<div className="app">
				<Calculator 
					display={this.state.display}
					store={this.state.store}
					handleChange={this.handleChange}
					calculate={this.calculate}
					onSubmit={this.onSubmit}
				/>	
			</div>
		)
	}
}

export default App
