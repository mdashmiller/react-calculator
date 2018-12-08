import PosNeg from './PosNeg'

const ops = ['+', '-', 'x', '/']

const Utils = {

	convertX: str =>
		// replaces all 'x' chars in a string with '*' chars
		str.replace(/[x]/g, '*'),

	removeSpaces: arr =>
		// takes an array and returns a 
		// new array with the spaces removed
		arr.filter(str => /\S/.test(str)),

	lastItem: function (arr, spaces) {
		// returns the last item in an array
		if (arguments[1]) {
			const spaceless = this.removeSpaces(arr)
			return this.lastItem(spaceless, false)
		}
		return arr[arr.length - 1]
	},

	getOperators: arr =>
		// returns an array of all the operator
		// chars in a given array
		arr.filter(item => ops.includes(item)),

	numOfOps: function (arr) {
		// determines the number of operators
		// chars in an array
		return this.getOperators(arr).length
	},

	lastOperator: function (arr) {
		// returns the last operator char in an array	
		return this.getOperators(arr).pop()
	},

	removeEndChars: (str, num) => {
		// takes a string and returns an array with
		// the specified number of end chars removed
		const cutOff = [...str].length - num
		return [...str].filter((item, index) => index < cutOff)
	},

	replaceEndChars: function (char, str, num) {
		// takes string and returns another with
		// the specified number of chars removed
		// from the end and the given char propended
		const prunedArray = this.removeEndChars(str, num)
		prunedArray.push(char)
		return prunedArray.join('')
	},
	
	removeLastNumber: function (runningTotal) {
		// removes the last term entered in runningTotal
		const rtArrayWithSpaces = [...runningTotal]
		const rtArray = this.removeSpaces(rtArrayWithSpaces)
		const lastOp = this.lastOperator(rtArray)
		const numOfOps = this.numOfOps(rtArray)

		if (lastOp === undefined) {
			// if no operator has been entered yet
			// runningTotal will be set back to '0'
			return '0'
		} else if (numOfOps === 1 && lastOp === '-') {
			// if the only operator entered is the '-' sign
			// of a negative number then runningTotal
			// will be set back to '0'
			return '0'
		} else {
			// removes any digits from runningTotal that
			// are after the last operator entered
			const lastOpIndex = rtArray.lastIndexOf(lastOp)
			// check if last term entered was a
			// negative number
			if (ops.includes(rtArray[lastOpIndex - 1])) {
				// if the last term is a negative number
				// an additional char needs to be removed
				return rtArray.filter((item, index) =>
					index <= lastOpIndex - 1 
				).join('')
			} else {
				return rtArray.filter((item, index) =>
					index <= lastOpIndex	
				).join('')
			}
		}
	},

	opOrNot: char => {
		// determines whether or not the char it
		// receives is an operator
		let isOperator

		switch (char) {
			case '+':
			case '-':
			case 'x':
			case '/':
				isOperator = true
				break
			default:
				isOperator = false
		}
		return isOperator
	},

	charStrCombiner: (char, str1, str2) => {
		// takes two strings and a char, concatenates
		// them in a readable way, and encapsulates
		// any negative terms in parentheses
		const tempStr = str1 + str2 + ` ${char} `
		let newStr

		// checking to see if any
		// negative numbers have been entered
		if (tempStr.indexOf('- -') !== -1  
			|| tempStr.indexOf('+ -') !== -1 
			|| tempStr.indexOf('x -') !== -1 
			|| tempStr.indexOf('/ -') !== -1) {
			newStr = PosNeg.handleParens(tempStr)
		} else {
			newStr = tempStr
		}

		return newStr
	}

}

export default Utils
