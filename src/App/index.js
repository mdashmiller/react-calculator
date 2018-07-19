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
		isNegative: false,
		negate: false
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

	updateWithOperator = operator => {//+
		// handles the input of operators to runningTotal
		// and store and updates display accordingly
		this.setState({ calculateCalled: false })
		/*
		if (this.state.negate) {
			this.setState(prevState => {
				const { store } = prevState
				return {
					store: store + operator,
					display: '0',
					runningTotal: '0' + operator,
					isNegative: false,
					negate: false
				}
			})
		} else {
		*/
			const lastChar = this.lastCharEntered()//0
			
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
					this.calcRunningTotal()//-1
					this.chainOperations(operator)
			}
		//}	
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
		let total = math.eval(this.state.runningTotal).toString()//1+-20 --> -19
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}
		const negativeState = total.includes('-') ? true : false//t
		this.setState({
			runningTotal: total,//-19
			isNegative: negativeState//t
		})
	}

	chainOperations = operator => {//+
		// allows user to chain multiple calculations
		// and updates store, display and runningTotal appropriately
		this.setState(prevState => {
			const {
				store,//1+
				display,//-20
				runningTotal//-19
			} = prevState

			//const tempStore = store + display + operator//1+-20+
			//const newStore = this.addParens(tempStore)

			return {
				//store: newStore,
				store: store + display + operator,
				display: runningTotal,//-1
				runningTotal: runningTotal + operator//-1+
			}
		})
	}

	addParens = tempStore => {//1+-20+
		const dblNeg = /--/g
		const plusNeg = /\+-/g
		const endParen = /\)/g
		const baseString = tempStore.replace(endParen, '')//1+-20+
		let openParens = baseString.replace(dblNeg, '-(-')//1+-20+
		openParens = openParens.replace(plusNeg, '+(-')//1+(-20+
		return this.handleCloseParens(openParens)
	}

	handleCloseParens = string => {
		const array = [...string]
		const beginCheckLocations = []

		array.forEach((item, index) => {
			if (item === '(') {
				beginCheckLocations.push(index + 3)
			}						 
		})

		let checkStr

		for (let i = 0; i < beginCheckLocations.length; i++) {
			checkStr = string.substring(beginCheckLocations[i], beginCheckLocations[i + 1])
			this.findCloseParenLocation(checkStr)
		}

		/*
		const array = [...string]

		const closeParenLocations = []
		let numNewItems = 0
		array.forEach((item, index) => {
			if (item === '(') {
				closeParenLocations.push(index + 3 + numNewItems)//[]
				numNewItems++
			}
		})

		closeParenLocations.forEach(item =>
			array.splice(item, 0, ')')
		)

		return array.join('')
		*/
	}

	//for each char in substring, if ops.icludes(char) then return char index
	findCloseParenLocation = string => {
		for (let i = 0; i < string.length; i++) {
			if (this.state.ops.includes(string[i])) {
				return this.insertClosingParens(string, string.indexOf(string[i]))
			} else {
				return this.insertClosingParens(string.length)
			}
		}
	}

	insertClosingParens = (string, position) => {
		const array = [...string]
		return array.splice(position, 0, ')').join
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
			/*
			const lastOp = storeArray.filter(item => 
				this.state.ops.includes(item)									 
			).pop()
			const lastOpIndex = storeArray.lastIndexOf(lastOp)
			const newStore = storeArray.filter((item, index) => 
				index <= lastOpIndex	
			).join('')
			*/

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
		//this.setState({ negate: false })
		//const rtArray = [...this.state.runningTotal]//[-,1,1,+,(,-,1,1,)]
		//const lastOp = this.lastOperatorEntered()//-
		//const lastOpIndex = rtArray.lastIndexOf(lastOp)//5
		const lastChar = this.lastCharEntered()//)
		//const storeOps = this.getOperators(this.state.store)//[-,-,+,-]
		
		if (this.state.runningTotal === '0' || this.state.ops.includes(lastChar)) {
			// if nothing has yet been entered return
			return
		} else {
			this.negateNum()
		}

		/*
		if (storeOps.length > 1 && this.state.ops.includes(lastChar)) {
			this.negateNum()
			return	
		}


		switch (lastOp) {//+
			case undefined:
				// when there is a single positive term
				// make it negative
				this.setState(prevState => {
					const { display, runningTotal, isNegative } = prevState
					if (isNegative) {
						const newDisplay = display.replace('-', '')
						const storeArray = [...this.state.store]
						const parenIndex = storeArray.indexOf('(')
						const lastPrevOp = storeArray[parenIndex - 1]
						const newStore = storeArray.filter((item, index) => 
							index < parenIndex
						).join('')
						const revertRt = this.removeLastChar(newStore).join('')
						const prevRunningTotal = math.eval(revertRt).toString()
						if (runningTotal === '00') {
							return {
								store: newStore,
								display: newDisplay,
								runningTotal: prevRunningTotal + lastPrevOp,
								isNegative: !isNegative
							}
						} else {
							//2
							const newRunningTotal = runningTotal.replace('-', '')//00
							return {
								display: newDisplay,//2
								runningTotal: newRunningTotal,//00
								isNegative: !isNegative//f
							}
						}
					} else {
						if (runningTotal === '00') {
							const storeArray = [...this.state.store]
							const storeLastOp = storeOps.pop()
							const storeLastOpIndex = storeArray.lastIndexOf(storeLastOp) 
							const prunedStore = storeArray.filter((item, index) =>
								index <= storeLastOpIndex
							).join('')
							return {
								store: prunedStore + `(-${display})`,
								display: '-' + display,
								runningTotal: `-${display}+(-${display})`,
								isNegative: !isNegative
							}
						} else {
							return {
								display: '-' + display,
								runningTotal: '-' + runningTotal,
								isNegative: !isNegative
							}
						}
					}
				})
				break
			case '-':
				// when the last term is negative
				// make it positive
				this.setState(prevState => {
					const { store, display, isNegative } = prevState
					if (isNegative) {
						const newDisplay = display.replace('-', '')//11
						rtArray.splice(lastOpIndex, 1, '+')//[-,1,1,+,(,+,1,1,)]
						if (lastChar === ')') {
							const storeArray = [...store]
							const storeLastOp = storeOps.pop()
							const storeLastOpIndex = storeArray.lastIndexOf(storeLastOp)
							const prunedStore = storeArray.filter((item, index) =>
								index !== storeLastOpIndex
							).join('') 
							const lParen = /\(/
							const rParen = /\)/
							let newStore = prunedStore.replace(lParen, '')
							newStore = newStore.replace(rParen, '')
							return {
								store: newStore,
								display: newDisplay,
								runningTotal: '00',
								isNegative: !isNegative,
								negate: true
							}
						} else {
							return {
								display: newDisplay,//11
								runningTotal: rtArray.join(''),//-11++11
								isNegative: !isNegative//f
							}
						}
					} else {
						rtArray.splice(lastOpIndex, 1, '+')//[1,-,2]
						return {
							display: '-' + display,//-2
							runningTotal: rtArray.join(''),
							isNegative: !isNegative
						}
					}
				})
				break
			case '+':
				this.setState(prevState => {
					const { display, isNegative } = prevState
					if (isNegative) {
						const newDisplay = display.replace('-', '')//
						rtArray.splice(lastOpIndex, 1, '-')//[7,-,5]
						return {
							display: newDisplay,//5
							runningTotal: rtArray.join(''),
							isNegative: !isNegative
						}
					} else {
						if (!this.state.negate) { 
							rtArray.splice(lastOpIndex, 1, '-')//[7,-,5]
							return {
								display: '-' + display,//-5
								runningTotal: rtArray.join(''),//7-5
								isNegative: !isNegative,
							}
						}
						
					}
				})
				break
			default:
				return
		}
		*/
	}
	

	negateNum = () => {
		this.setState(prevState => {
			const { store, display, isNegative} = prevState
			//const rtArray = [...runningTotal]
			//const lastOp = this.lastOperatorEntered()
			//const lastOpIndex = rtArray.lastIndexOf(lastOp)
			if (isNegative) {
				const posDisplay = display.replace('-', '')
				return {
					display: posDisplay,
					runningTotal: `${store}${posDisplay}`,
					isNegative: !isNegative
					//negate: true
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
		/*
		if (total.includes('-')) {
			negativeState = true
		} else {
			negativeState = false
		}
		*/
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
