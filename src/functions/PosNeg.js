import Utils from './Utils'

const PosNeg = {

	handleParens: function (str) {
		// takes a string and encapsulates all
		// its negative terms in parentheses
		const openParensStr = this.addOpenParens(str)
		const openParensArr = [...openParensStr]
		const endParenLocations = this.findEndParenLocations(openParensArr)

		return this.addEndParens(openParensArr, endParenLocations)
	},

	addOpenParens: str => {
		// takes a string and inserts an opening parenthesis 
		// in front of each negative number
		const dblNeg = /- -/g
		const plusNeg = /\+ -/g
		const timesNeg = /\x -/g
		const divNeg = /\/ -/g
		const endParen = /\)/g

		// remove any pre-existing closing parentheses
		// to avoid double end parentheses later
		const baseString = str.indexOf(')') !== -1 
			? str.replace(endParen, '')
			: str

		// insert opening parentheses where needed
		let openParens = baseString.replace(dblNeg, '- (-')
		openParens = openParens.replace(plusNeg, '+ (-')
		openParens = openParens.replace(timesNeg, 'x (-')
		return openParens.replace(divNeg, '/ (-')
	},

	findEndParenLocations: arr => {
		// find the index of each location to 
		// insert a closing parenthesis
		const endParenLocations = []

		let negSignIndex
		let subArray
		let nextOpInSubArray
		let endParenLoc

		arr.forEach((item, index) => {
			if (item === '(') {
				// find the location of the negative sign 
				// for each negative term
				negSignIndex = index + 1
				// create a sub-array of everything that comes after
				// the '-' of a negative term each time one is found
				subArray = arr.filter((item, index) => index > negSignIndex)
				// identify the next operator that comes after the
				// '-' of each negative term
				nextOpInSubArray = Utils.firstOperator(subArray)
				// create an end parenthesis location one index position before 
				// the operator that directly follows the '-' of
				// each negative term
				endParenLoc = arr.indexOf(nextOpInSubArray, negSignIndex + 1) - 1
				endParenLocations.push(endParenLoc)
			}						 
		})

		return endParenLocations
	},

	addEndParens: (openParensArr, locationsArr) => {
		// adds a ')' char at each appropriate location and
		// returns a string with all the parentheses in place

		// the array will +1 in length each time a ')'
		// is added -- counter tracks this
		let counter = 0

		locationsArr.forEach(location => {
			openParensArr.forEach((item, index) => {
				if (location === index) {
					openParensArr.splice(location + counter, 0, ')')
					counter ++
				}
			})
		})

		return openParensArr.join('')
	},

	addNegativeSign: str => {
		// takes a string and adds a negative
		// sign before its last term
		const strArr = [...str]
		const lastOp = Utils.lastOperator([...str])
		const lastOpIndex = str.lastIndexOf(lastOp)

		strArr.splice(lastOpIndex + 1, 0, '-')

		return strArr.join('')
	},

	removeNegativeSign: str => {
		// takes a string and removes the
		// last negative sign
		const strArr = [...str]
		const lastNeg = str.lastIndexOf('-')

		if (lastNeg === '-1') return

		strArr.splice(lastNeg, 1)

		return strArr.join('')
	}	

}

export default PosNeg
