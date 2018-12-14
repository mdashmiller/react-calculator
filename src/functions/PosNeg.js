import Utils from './Utils'

const ops = ['+', '-', 'x', '/']

const PosNeg = {

	handleParens: function (str) {
		// takes a string and encapsulates all
		// its negative terms in parentheses
		const openParensStr = this.addOpenParens(str)
		const openParensArr = [...openParensStr]
		const beginCheckLocations = this.findCheckLocations(openParensArr)
		const storePrefix = this.createStorePrefix(beginCheckLocations, openParensStr)

		return this.createCheckStrings(beginCheckLocations, openParensStr, storePrefix)
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
		// to avoid double parentheses later
		const baseString = str.indexOf(')') !== -1 
			? str.replace(endParen, '')
			: str

		// insert opening parentheses where needed
		let openParens = baseString.replace(dblNeg, '- (-')
		openParens = openParens.replace(plusNeg, '+ (-')
		openParens = openParens.replace(timesNeg, 'x (-')
		return openParens.replace(divNeg, '/ (-')
	},

	findCheckLocations: arr => {
		// find the index of each location from which
		// to begin looking for the location to 
		// insert a closing parenthesis
		const beginCheckLocations = []

		let negSignIndex
		let subArray
		let nextOpInSubArray
		let beginCheckLoc

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
				// create a check location one index position before 
				// the operator that directly follows the '-' of
				// each negative term
				beginCheckLoc = arr.indexOf(nextOpInSubArray, negSignIndex + 1) - 1
				beginCheckLocations.push(beginCheckLoc)
			}						 
		})

		return beginCheckLocations
	},

	createStorePrefix: (locationsArr, str) => {
		// removes and saves the portion of 
		// the string that occurs before the first
		// possible location of a closing parenthesis
		const cutoff = locationsArr[0]
		
		return [...str].filter((item, index) => index < cutoff)
			.join('')
	},

	createCheckStrings: function (locationsArr, openParensStr, storePrefixStr) {
		// creates an array of substrings so that
		// each can be checked for the proper
		// location of a closing parenthesis
		let checkStr
		const checkStrings = []

		for (let i = 0; i < locationsArr.length; i++) {
			// start at locationsArr[i] + 1 to remove the now-superfluous
			// space after the last operator in each substring
			checkStr = openParensStr.substring(locationsArr[i] + 1, locationsArr[i + 1])
			checkStrings.push(checkStr)
		}

		return this.findCloseParensLocs(checkStrings, locationsArr, storePrefixStr)
	},

	findCloseParensLocs: function (checkStringsArr, locationsArr, storePrefixStr) {
		// finds the index position in each checkString where 
		// a closing parenthesis needs to be inserted
		const closeParensLocations = []
		
		checkStringsArr.forEach(substr => {
			for (let i = 0; i < substr.length; i++) {
				if (ops.includes(substr[i])) {
					closeParensLocations.push(i)
					return
				}
			}
		})

		return this.insertCloseParens(closeParensLocations, checkStringsArr, storePrefixStr)
	},

	insertCloseParens: function (locationsArr, substringsArr, storePrefixStr) {
		// takes each substring and inserts the closing
		// parenthesis then adds it to an array
		let counter = 0
		const newSubStrings = []
		
		substringsArr.forEach(substr => {
			let substrArray = [...substr]
			substrArray.splice(locationsArr[counter], 0, ') ')
			counter++
			newSubStrings.push(substrArray.join(''))
		})

		return this.createStoreWithParens(storePrefixStr, newSubStrings.join(''))
	},

	createStoreWithParens: (storePrefixStr, storeEndStr) =>
		// concatenates the string with all the parentheses
		// now added to the end of the previously
		// removed portion of the original string
		storePrefixStr + storeEndStr,

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
