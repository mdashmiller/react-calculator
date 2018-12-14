import PosNeg from '../functions/PosNeg'

describe('handleParens()', () => {

	it('calls addOpenParens()', () => {
		const spy = jest.spyOn(PosNeg, 'addOpenParens')

		PosNeg.handleParens('1 + -2 + ')

		expect(spy).toHaveBeenCalledWith('1 + -2 + ')
	})

	it('calls findEndParenLocations()', () => {
		const spy = jest.spyOn(PosNeg, 'findEndParenLocations')

		PosNeg.handleParens('1 + -2 + ')

		expect(spy).toHaveBeenCalled()
	})

	it('returns a string with all non-leading negative terms in parentheses', () => {
		const test1 = PosNeg.handleParens('1 + -2 + ')
		const test2 = PosNeg.handleParens('-1 - (-23) x (-100) / -22.22 + ')

		expect(test1).toBe('1 + (-2) + ')
		expect(test2).toBe('-1 - (-23) x (-100) / (-22.22) + ')
	})

})

describe('addOpenParens()', () => {

	it('adds a "(" char before the last negative term and removes any ")" chars', () => {
		const test1 = PosNeg.addOpenParens('1 + -2 + ')
		const test2 = PosNeg.addOpenParens('1 + (-23) - -4 x ')

		expect(test1).toBe('1 + (-2 + ')
		expect(test2).toBe('1 + (-23 - (-4 x ')
	})

})

describe('findEndParenLocations()', () => {

	it('returns an array of the locations in an array to add end parentheses', () => {
		const test1 = PosNeg.findEndParenLocations(["1", " ", "+", " ", "(", "-", "2", " ", "+", " "])
		const test2 = PosNeg.findEndParenLocations(["1", " ", "+", " ", "(", "-", "2", "3", " ", "-", " ", "(", "-", "4", " ", "x", " "])

		expect(test1).toEqual([7])
		expect(test2).toEqual([8, 14])
	})

})

describe('addEndParens()', () => {

	it('returns a string with all the ")" chars inserted in the correct places', () => {
		const test1 = PosNeg.addEndParens(["1", " ", "+", " ", "(", "-", "2", " ", "+", " "], [7])
		const test2 = PosNeg.addEndParens(["1", " ", "+", " ", "(", "-", "2", "3", " ", "-", " ", "(", "-", "4", " ", "x", " "], [8,14])

		expect(test1).toEqual('1 + (-2) + ')
		expect(test2).toEqual('1 + (-23) - (-4) x ')
	})

})

describe('addNegativeSign()', () => {

	it('adds a negative sign before the last term of a string', () => {
		const test1 = PosNeg.addNegativeSign('1+2')
		const test2 = PosNeg.addNegativeSign('1-22')
		const test3 = PosNeg.addNegativeSign('1x100')
		const test4 = PosNeg.addNegativeSign('1/1001')
		const test5 = PosNeg.addNegativeSign('1/-1001+3')

		expect(test1).toBe('1+-2')
		expect(test2).toBe('1--22')
		expect(test3).toBe('1x-100')
		expect(test4).toBe('1/-1001')
		expect(test5).toBe('1/-1001+-3')
	})

})

describe('removeNegativeSign()', () => {

	it('adds a negative sign before the last term of a string', () => {
		const test1 = PosNeg.removeNegativeSign('1+-2')
		const test2 = PosNeg.removeNegativeSign('1--22')
		const test3 = PosNeg.removeNegativeSign('1x-100')
		const test4 = PosNeg.removeNegativeSign('1/-1001')
		const test5 = PosNeg.removeNegativeSign('1/-1001+-3')

		expect(test1).toBe('1+2')
		expect(test2).toBe('1-22')
		expect(test3).toBe('1x100')
		expect(test4).toBe('1/1001')
		expect(test5).toBe('1/-1001+3')
	})

})
