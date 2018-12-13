import PosNeg from '../functions/PosNeg'

describe('addOpenParens()', () => {

	it('adds a "(" char before any negative term', () => {
		const test = PosNeg.addOpenParens('1 + -2 +')

		expect(test).toBe('1 + (-2 +')
	})

})

describe('createStorePrefix()', () => {

	it('returns the portion of a string that occurs before the first possible location of a closing parenthesis', () => {
		const test = PosNeg.createStorePrefix([8], '1 + (-2 +')

		expect(test).toBe('1 + (-2 ')
	})

})

describe('PosNeg.addNegativeSign()', () => {

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

describe('PosNeg.removeNegativeSign()', () => {

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

describe('createStoreWithParens()', () => {

	it('concatenates two strings', () => {
		const test1 = PosNeg.createStoreWithParens('1 + ', '(-2) + 3 ')

		expect(test1).toBe('1 + (-2) + 3 ')
	})

})
