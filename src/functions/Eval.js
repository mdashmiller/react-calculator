import Utils from './Utils'
import * as math from 'mathjs'

const ops = ['+', '-', 'x', '/']

const Eval = {

	runningTotal: str => {
		// recieves a string and evaluates it, returning
		// a string rounded to 4 decimal places

		// 'x' chars in str need to be converted
		// to '*' chars for math.eval() to work properly
		const toEvaluate = Utils.convertX(str)
		let total = math.eval(toEvaluate).toString()

		// round total to max of 4 decimal places
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}

		return total
	},

	calculate: (runningTotalStr, displayStr) => {
		// recieves 2 strings, determines how to evaluate them,
		// and returns a string rounded to 4 decimal places

		// replace all 'x' chars with '*' chars for
		// math.eval() to work properly
		const rtToEvaluate = Utils.convertX(runningTotalStr)
		const displayToEvaluate = Utils.convertX(displayStr)
		let total

		// if the last char in runningTotal is an operator then
		// the term in the display needs to be concatenated
		// to runningTotal before the string is evaluated
		const lastChar = Utils.lastItem([...runningTotalStr])
		
		if (ops.includes(lastChar)) {
			total = math.eval(rtToEvaluate + displayToEvaluate).toString()
		} else {
			total = math.eval(rtToEvaluate).toString()
		}
		
		// rounds total to maximum of four decimal places
		if (total.includes('.') && (total.length - total.indexOf('.')) > 5) {
			total = parseFloat(total).toFixed(4)
		}

		return total
	},

	prepForEval: str => {
		// takes a string and removes the final
		// char if it is an operator
		const spaceless = Utils.removeSpaces([...str])
		const lastChar = Utils.lastItem(spaceless)
		return ops.includes(lastChar)
				?  Utils.removeEndChars(spaceless.join(''), 1).join('')
				:  str
	}

}

export default Eval
