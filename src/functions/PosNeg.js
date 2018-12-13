import Utils from './Utils'

const ops = ['+', '-', 'x', '/']

const PosNeg = {

	handleParens: function (str) { // '1 + -2 +'
		// takes a string and encapsulates all
		// its negative terms in parentheses
		const openParens = this.addOpenParens(str) // '1 + (-2 +'
		const openParensArr = [...openParens]
		const beginCheckLocations = []

		// finds each location to begin checking for
		// where to insert a closing parenthesis
		openParensArr.forEach((item, index) => {
			if (item === '(') {
				beginCheckLocations.push(index + 4) // [8]
				// beginCheckLocations.push(index + 2) // [6]
			}						 
		})

		const storePrefix = this.createStorePrefix(beginCheckLocations, openParens) // [8] // '1 + (-2 +'

		return this.createCheckStrings(beginCheckLocations, openParens, storePrefix) // [8] // '1 + (-2 +' // '1 + (-2 '
	},

	addOpenParens: str => { // '1 + -2 +'
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
		openParens = openParens.replace(plusNeg, '+ (-') // '1 + (-2 +'
		openParens = openParens.replace(timesNeg, 'x (-')
		return openParens.replace(divNeg, '/ (-')
	},

	createStorePrefix: (locationsArr, str) => { // [8] // '1 + (-2 +'
		// removes and saves the portion of 
		// the string that occurs before the first
		// possible location of a closing parenthesis
		const cutoff = locationsArr[0] // 8
		
		return [...str].filter((item, index) => index < cutoff) // index < 7 // '1 + (-2'
			.join('')
	},

	createCheckStrings: function (locationsArr, openParensStr, storePrefixStr) { // [8] // '1 + (-2 +' // '1 + (-2 '
		// creates an array of substrings so that
		// each can be checked for the proper
		// location of a closing parenthesis
		let checkStr
		const checkStrings = []

		for (let i = 0; i < locationsArr.length; i++) {
			checkStr = openParensStr.substring(locationsArr[i], locationsArr[i + 1]) // '1 + (-2 +' // '+'
			checkStrings.push(checkStr)
		}

		return this.findCloseParensLocs(checkStrings, locationsArr, storePrefixStr) // ['+'] // [8] // '1 + (-2 '
	},

	findCloseParensLocs: function (checkStringsArr, locationsArr, storePrefixStr) { // ['+'] // [8] // '1 + (-2 '
		// finds the index position in each checkString
		// where a closing parenthesis needs
		// to be inserted
		const closeParensLocations = []
		
		checkStringsArr.forEach(substr => {
			for (let i = 0; i < substr.length; i++) {
				if (ops.includes(substr[i])) {
					closeParensLocations.push(substr.indexOf(substr[i])) // [0]
					return
				}
			}
		})

		return this.insertCloseParens(closeParensLocations, checkStringsArr, storePrefixStr) // [0] // ['+'] // '1 + (-2 '
	},

	insertCloseParens: function (locationsArr, substringsArr, storePrefixStr) { // [0] // ['+'] // '1 + (-2 '
		// takes each substring and inserts the closing
		// parenthesis then adds it to an array
		let counter = 0
		const newSubStrings = []
		
		substringsArr.forEach(substr => {
			let substrArray = [...substr]
			substrArray.splice(locationsArr[counter], 0, ') ') // [') ','+']
			counter++
			newSubStrings.push(substrArray.join('')) // [') +']
		})

		return this.createStoreWithParens(storePrefixStr, newSubStrings.join('')) // '1 + (-2 ' // ') +'
	},

	createStoreWithParens: (storePrefixStr, storeEndStr) => // '1 + (-2 ' // ') +'
		// concatenates the string with all the parentheses
		// now added to the end of the previously
		// removed portion of the original string
		storePrefixStr + storeEndStr, // '1 + (-2 ) +'

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
