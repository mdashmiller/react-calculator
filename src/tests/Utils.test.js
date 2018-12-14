import Utils from '../functions/Utils'

describe('convertX()', () => {

	it('replaces all "x" chars with "*" chars', () => {
		const test = Utils.convertX('1x2x3+4')

		expect(test).toBe('1*2*3+4')
	})

})

describe('removeSpaces()', () => {

	it('removes all spaces from an array', () => {
		const test = Utils.removeSpaces([' ', '1', ' ', '+', ' ', '2' ,' '])

		expect(test).toEqual(['1','+','2'])
	})

})

describe('lastItem()', () => {

	it('returns the last item in an array', () => {
		const test = Utils.lastItem(['1', '+', '2'])

		expect(test).toBe('2')
	})

})

describe('getOperators()', () => {

	it('returns an array of all the operator chars in a given array', () => {
		const test = Utils.getOperators(['1', '+', '2', 'x', '-', '3', '/', '1'])

		expect(test).toEqual(['+', 'x', '-', '/'])
	})

})

describe('numOfOps()', () => {

	it('determines the number of operator chars in an array', () => {
		const test = Utils.numOfOps(['1', '+', '2', 'x', '-', '3', '/', '1'])

		expect(test).toBe(4)
	})

})


describe('lastOperator()', () => {

	it('returns the last operator char in an array', () => {
		const test = Utils.lastOperator(['1', '+', '2', 'x', '-', '3', '/', '1'])

		expect(test).toBe('/')
	})

})

describe('firstOperator()', () => {

	it('returns the first operator char in an array', () => {
		const test = Utils.firstOperator(['1', '+', '2', 'x', '-', '3', '/', '1'])

		expect(test).toBe('+')
	})

})

describe('removeEndChars()', () => {

	it('takes a string and returns an array with the specified number of end chars removed	', () => {
		const test = Utils.removeEndChars('1+2+3-4', 1)

		expect(test).toEqual(['1', '+', '2', '+', '3', '-'])
	})

})

describe('replaceEndChars()', () => {

	it('removes the specified number of chars and adds the given char to the end', () => {
		const test = Utils.replaceEndChars('+', '1+2-', 1)

		expect(test).toBe('1+2+')
	})

})

describe('removeLastNumber()', () => {

	it('returns "0" if the there are no operators in the string', () => {
		const test = Utils.removeLastNumber('12')

		expect(test).toBe('0')
	})

	it('returns "0" if the only operator is the "-" of a negative number', () => {
		const test = Utils.removeLastNumber('-12')

		expect(test).toBe('0')
	})

	it('removes the last term if it is positive', () => {
		const test = Utils.removeLastNumber('-12+35')

		expect(test).toBe('-12+')
	})

	it('removes the last term if it is negative', () => {
		const test = Utils.removeLastNumber('-12+-35')

		expect(test).toBe('-12+')
	})

})

describe('opOrNot()', () => {

	it('returns true if it receives an operator char and false if it does not', () => {
		const test1 = Utils.opOrNot('+')
		const test2 = Utils.opOrNot('1')

		expect(test1).toBe(true)
		expect(test2).toBe(false)
	})

})

describe('charStrCombiner()', () => {

	it('concatenates the two strings and the char', () => {
		const test = Utils.charStrCombiner('-', '1 + 2 + ', '3')

		expect(test).toBe('1 + 2 + 3 - ')
	})

	it('adds parentheses if there are any negative terms', () => {
		const test = Utils.charStrCombiner('-', '1 + 2 + ', '-3')

		expect(test).toBe('1 + 2 + (-3) - ')
	})

})
