const Helper = {

	// takes an array and returns a 
	// new array with the spaces removed
	removeSpaces: arr => arr.filter(str => /\S/.test(str))

}

export default Helper
