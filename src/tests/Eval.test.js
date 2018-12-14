import Eval from '../functions/Eval'

describe('runningTotal()', () => {

	it('evaluates the string it receives', () => {
		const addTest = Eval.runningTotal('1+2')
		const subtractTest = Eval.runningTotal('1-2')
		const multiplyTest = Eval.runningTotal('2x3')
		const divideTest = Eval.runningTotal('10/2')

		expect(addTest).toBe('3')
		expect(subtractTest).toBe('-1')
		expect(multiplyTest).toBe('6')
		expect(divideTest).toBe('5')
	})

	it('rounds the answer to 4 decimal places', () => {
		const roundTest1 = Eval.runningTotal('1.11111+2.22222')
		const roundTest2 = Eval.runningTotal('1.11111+2.44444')

		expect(roundTest1).toBe('3.3333')
		expect(roundTest2).toBe('3.5556')
	})

})

describe('calculate()', () => {

	it('concantenates the 2 strings it receives before eval() if the 1st string ends in an operator char', () => {
		const addTest = Eval.calculate('1+', '1')
		const subtractTest = Eval.calculate('1-', '1')
		const multiplyTest = Eval.calculate('3x', '3')
		const divideTest = Eval.calculate('10/', '10')

		expect(addTest).toBe('2')
		expect(subtractTest).toBe('0')
		expect(multiplyTest).toBe('9')
		expect(divideTest).toBe('1')
	})

	it('evaluates the first string only if it ends in a number char', () => {
		const addTest = Eval.calculate('1+2', '2')
		const subtractTest = Eval.calculate('1-2', '2')
		const multiplyTest = Eval.calculate('3x4', '4')
		const divideTest = Eval.calculate('10/5', '5')

		expect(addTest).toBe('3')
		expect(subtractTest).toBe('-1')
		expect(multiplyTest).toBe('12')
		expect(divideTest).toBe('2')
	})

	it('rounds the answer to 4 decimal places', () => {
		const roundTest1 = Eval.calculate('1.11111+', '1.11111')
		const roundTest2 = Eval.calculate('1.11113+', '1.11113')
		const roundTest3 = Eval.calculate('1.11111+2.22222', '2.22222')
		const roundTest4 = Eval.calculate('1.11111+2.44444', '2.44444')

		expect(roundTest1).toBe('2.2222')
		expect(roundTest2).toBe('2.2223')
		expect(roundTest3).toBe('3.3333')
		expect(roundTest4).toBe('3.5556')
	})

})

describe('prepForEval()', () => {

	it('removes the last char from a string if it is an operator', () => {
		const test1 = Eval.prepForEval('1+2')
		const test2 = Eval.prepForEval('1+2+')
		const test3 = Eval.prepForEval('1 + 2 ')
		const test4 = Eval.prepForEval('1 + 2 + ')

		expect(test1).toBe('1+2')
		expect(test2).toBe('1+2')
		expect(test3).toBe('1 + 2 ')
		expect(test4).toBe('1+2')
	})

})
