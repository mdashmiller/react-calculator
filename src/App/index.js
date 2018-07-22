import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		display: '0',
		store: '',
		runningTotal: '0',
		ops: ['+', '-', '*', '/'],
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
			case '*':
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

	clear = () => {
		// resets calculator to initial state
		this.setState({
			display: '0' ,
			store: '',
			runningTotal: '0',
			calculateCalled: false,
			isNegative: false,
			negate: false
		})
	}

	undoLastInput = () => {
		// resets display and last term
		// of runningTotal to '0'
		if (this.state.runningTotal !== '0') {
			const newRunningTotal = this.removeLastNumber() 
			this.setState({
				display: '0' ,
				runningTotal: newRunningTotal,
				calculateCalled: false,
				isNegative: false,
				negate: false
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
		const array = [...field]
		return array.filter(item => 
			this.state.ops.includes(item)									 
		)
	}

	lastOperatorEntered = (/*field*/) => {
		// determines the last operator entered by the user
		const rtArray = [...this.state.runningTotal]
		return rtArray.filter(item => 
			this.state.ops.includes(item)									 
		).pop()
		// return getOperators(field).pop()
	}

	updateWithOperator = operator => {
		// handles the input of operators to runningTotal
		// and store and updates display accordingly
		this.setState({ calculateCalled: false })

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
		let total = math.eval(this.state.runningTotal).toString()
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}
		const negativeState = total.includes('-') ? true : false
		this.setState({
			runningTotal: total,
			isNegative: negativeState
		})
	}

	chainOperations = operator => {//+
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

			if (tempStore.indexOf('--') !== -1  
				|| tempStore.indexOf('+-') !== -1 
				|| tempStore.indexOf('*-') !== -1 
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
		const openParens = this.addOpenParens(tempStore)
		
		const openParensArr = [...openParens]
		const beginCheckLocations = []

		openParensArr.forEach((item, index) => {
			if (item === '(') {
				beginCheckLocations.push(index + 3)
			}						 
		})
		const storePrefix = this.createStorePrefix(beginCheckLocations, openParens)
		return this.createCheckStrings(beginCheckLocations, openParens, storePrefix)
	}

	addOpenParens = tempStore => {
		const dblNeg = /--/g
		const plusNeg = /\+-/g
		const timesNeg = /\*-/g
		const divNeg = /\/-/g
		const endParen = /\)/g
		const baseString = tempStore.replace(endParen, '')
		let openParens = baseString.replace(dblNeg, '-(-')
		openParens = openParens.replace(plusNeg, '+(-')
		openParens = openParens.replace(timesNeg, '*(-')
		return openParens.replace(divNeg, '/(-')
	}

	createStorePrefix = (locations, tempStore) => {
		const cutoff = locations[0]
		const tempStoreArr = [...tempStore]
		return tempStoreArr.filter((item, index) =>
			index < cutoff												
		).join('')
	}

	createCheckStrings = (locations, openParens, storePrefix) => {
		let checkStr
		const checkStrings = []

		for (let i = 0; i < locations.length; i++) {
			checkStr = openParens.substring(locations[i], locations[i + 1])
			checkStrings.push(checkStr)
		}
		return this.findCloseParensLocs(checkStrings, locations, storePrefix)
	}

	findCloseParensLocs = (checkStrings, locations, storePrefix) => {
		const ops = ['+', '-', '*', '/']
		const closeParensLocations = []
		
		checkStrings.forEach(substr => {
			for (let i = 0; i < substr.length; i++) {
				if (ops.includes(substr[i])) {
					closeParensLocations.push(substr.indexOf(substr[i]))
					return
				}
			}
		})
		return this.insertCloseParens(closeParensLocations, checkStrings, storePrefix)
	}

	insertCloseParens = (locations, substrings, storePrefix) => {
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

	createStoreWithParens = (storePrefix, storeEnd) => {
		return storePrefix + storeEnd
	}

	handleDecimal = () => {
		// determines when to add decimals to
		// display and runningTotal
		if (this.state.negate) {
			const storeArray = [...this.state.store]
			const parenIndex = storeArray.indexOf('(')
			const newStore = storeArray.filter((item, index) => 
				index < parenIndex
			).join('')
			const newStoreArr = [...newStore]
			const lastOp = newStoreArr.filter(item => 
				this.state.ops.includes(item)									 
			).pop()
			const revertRt = this.removeLastChar(newStore).join('')
			const prevRunningTotal = math.eval(revertRt).toString()

			this.setState(prevState => {
				return {
					store: newStore,
					display: '0.',
					runningTotal: prevRunningTotal + lastOp + '.',
					isNegative: false,
					negate: false
				}
			})
		} else {
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


	plusMinus = () => {
		const lastChar = this.lastCharEntered()//)
		
		if (this.state.runningTotal === '0' || this.state.ops.includes(lastChar)) {
			// if nothing has yet been entered return
			return
		} else {
			this.negateNum()
		}
	}
	
	negateNum = () => {
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
	}

	updateWithChar = char => {
		// determines how to add new characters
		// to display and runningTotal
		this.setState({ negate: false, isNegative: false })
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
		//this.noDoubleOps()
		//this.setState({ negate: false })
		let total
		const lastChar = this.lastCharEntered()

		if (this.state.ops.includes(lastChar)) {
			total = math.eval(this.state.runningTotal + this.state.display).toString()
		} else {
			total = math.eval(this.state.runningTotal).toString()
			//let negativeState
		}
		
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

	refresh = char => {
		// begins a new calculation chain when a number
		// or decimal is entered after calculate() has been called
		this.setState({
			display: char,
			runningTotal: char,
			calculateCalled: false,
		})
	}
	
	onSubmit = e =>
		// prevents page reloading
		e.preventDefault()

	render() {
		console.log(`runningTotal is ${this.state.runningTotal}`)
		console.log(`isNegative: ${this.state.isNegative}`)
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
