import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import App from '../App'
import Calculator from '../components/Calculator'

Enzyme.configure({ adapter: new Adapter() })

describe('<App /> rendering', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<App />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a valid snapshot', () => {
		const component = renderer.create(
			<App />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders 1 <Calculator /> component', () => {
		const wrapper = shallow(<App />)
		expect(wrapper.find(Calculator).length).toBe(1)
	})

})

describe('directly invoking HandleClick()', () => {

	let wrapper
	let instance

	beforeEach(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	it('returns if user input is frozen', () => {
		jest.spyOn(instance, 'updateWithChar')
		wrapper.setState({ freeze: true })

		instance.handleClick('1')

		expect(instance.updateWithChar).not.toHaveBeenCalled()
	})

	it('calls clear() when user presses "c"', () => {
		jest.spyOn(instance, 'clear')

		instance.handleClick('c')

		expect(instance.clear).toHaveBeenCalled()
	})

	it('calls undoLastInput() when user presses "ce"', () => {
		jest.spyOn(instance, 'undoLastInput')

		instance.handleClick('ce')

		expect(instance.undoLastInput).toHaveBeenCalled()
	})

	it('calls updateWithOperator() when user enters an operator', () => {
		jest.spyOn(instance, 'updateWithOperator')

		instance.handleClick('+')
		instance.handleClick('-')
		instance.handleClick('x')
		instance.handleClick('/')

		expect(instance.updateWithOperator).toHaveBeenCalledTimes(4)
	})

	it('calls refresh() when user presses "." after calculate() has been called', () => {
		wrapper.setState({ calculateCalled: true })
		jest.spyOn(instance, 'refresh')

		instance.handleClick('.')

		expect(instance.refresh).toHaveBeenCalled()
	})

	it('calls handleDecimal() when user presses "." before calculate() has been called', () => {
		jest.spyOn(instance, 'handleDecimal')

		instance.handleClick('.')

		expect(instance.handleDecimal).toHaveBeenCalled()
	})

	it('calls plusMinus() when user presses "+/-"', () => {
		jest.spyOn(instance, 'plusMinus')

		instance.handleClick('+/-')

		expect(instance.plusMinus).toHaveBeeplusMinus
	})

	it('calls refresh() when user enters any integer after calculate() has been called', () => {
		jest.spyOn(instance, 'refresh')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('0')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('1')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('2')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('3')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('4')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('5')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('6')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('7')
		wrapper.setState({ calculateCalled: true })

		instance.handleClick('8')
		wrapper.setState({ calculateCalled: true })
		
		instance.handleClick('9')

		expect(instance.refresh).toHaveBeenCalledTimes(10)
	})

	it('calls updateWithChar() when user enters any integer before calculate() has been called', () => {
		jest.spyOn(instance,  'updateWithChar')

		instance.handleClick('0')
		instance.handleClick('1')
		instance.handleClick('2')
		instance.handleClick('3')
		instance.handleClick('4')
		instance.handleClick('5')
		instance.handleClick('6')
		instance.handleClick('7')
		instance.handleClick('8')
		instance.handleClick('9')

		expect(instance.updateWithChar).toHaveBeenCalledTimes(10)
	})

})

describe('directly invoking handleKeyDown()', () => {

	let wrapper
	let instance
	let event

	beforeAll(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	beforeEach(() => {
		event = {
			preventDefault: jest.fn(),
			key: 'Enter'
		}
	})
	
	it('calls preventDefault on the event', () => {
		instance.handleKeyDown(event)

		expect(event.preventDefault).toHaveBeenCalled()
	})

	it('calls calculate() when user presses "Enter"', () => {
		jest.spyOn(instance, 'calculate')

		instance.handleKeyDown(event)

		expect(instance.calculate).toHaveBeenCalled()
	})

	it('calls handleClick() with the proper event', () => {
		jest.spyOn(instance, 'handleClick')

		// testing the number keys
		for (let i = 0; i < 10; i++) {
			let str = i.toString()
			event.key = str

			instance.handleKeyDown(event)

			expect(instance.handleClick).toHaveBeenCalledWith(str)
		}

		// testing the non-number keys
		event.key = 'Backspace'

		instance.handleKeyDown(event)

		expect(instance.handleClick).toHaveBeenCalledWith('ce')

		event.key = '.'

		instance.handleKeyDown(event)

		expect(instance.handleClick).toHaveBeenCalledWith('.')
		expect(instance.handleClick).toHaveBeenCalledTimes(12)

		// testing the default behavior
		instance.handleClick.mockReset()
		instance.calculate.mockReset()
		jest.spyOn(instance, 'handleKeyDown')
		event.key = 'a'

		instance.handleKeyDown(event)

		expect(instance.handleClick).not.toHaveBeenCalled()
		expect(instance.calculate).not.toHaveBeenCalled()
		expect(instance.handleKeyDown).toHaveReturned()
	})
})

describe('directly invoking clear()', () => {

	it('resets state to prepare for new calculations', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '11',
			store: '-17 + ',
			runningTotal: '-17+11',
			calculateCalled: true,
			isNegative: true,
			freeze: true
		})

		instance.clear()

		const state = instance.state

		expect(state.display).toBe('0')
		expect(state.store).toBe('')
		expect(state.runningTotal).toBe('0')
		expect(state.calculateCalled).toBe(false)
		expect(state.isNegative).toBe(false)
		expect(state.freeze).toBe(false)
	})

})

describe('directly invoking undoLastInput()', () => {

	it('resets display and last term of runningTotal to "0" if runningTotal is not "0"', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		let state

		// works when runningTotal is anything other than '0'
		wrapper.setState({
			display: '3',
			runningTotal: '-5-3',
			calculateCalled: true,
			isNegative: true
		})

		instance.undoLastInput()

		state = instance.state

		expect(state.display).toBe('0')
		expect(state.runningTotal).toBe('-5-')
		expect(state.calculateCalled).toBe(false)
		expect(state.isNegative).toBe(false)

		// doesn't do anything if runningTotal is '0'
		wrapper.setState({
			display: '0',
			runningTotal: '0',
			calculateCalled: true,
			isNegative: false
		})

		instance.undoLastInput()

		state = instance.state

		expect(state.calculateCalled).toBe(true)
	})

})

describe('directly invoking displayErrorMessage()', () => {

	it('freezes input, displays the error message, then calls clearErrorMessage()', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()

		// test with a limit error
		jest.useFakeTimers()
		jest.spyOn(instance, 'clearErrorMessage')
		wrapper.setState({
			display: '999999999999999'
		})

		instance.displayErrorMessage('999999999999999', 'limit')

		// input frozen and error message displayed
		expect(instance.state.display).toBe('LIMIT EXCEEDED')
		expect(instance.state.freeze).toBe(true)
		expect(setTimeout).toHaveBeenCalledTimes(1)

		jest.runAllTimers()

		// input unfrozen and previous display restored
		expect(instance.clearErrorMessage).toHaveBeenCalled()
		expect(instance.state.display).toBe('999999999999999')
		expect(instance.state.freeze).toBe(false)

		// test with an undefined error
		wrapper.setState({
			display: '0',
			runningTotal: '1/0'
		})

		instance.displayErrorMessage('0', 'undef')

		// input frozen and error message displayed
		expect(instance.state.display).toBe('UNDEFINED')
		expect(instance.state.freeze).toBe(true)
		expect(setTimeout).toHaveBeenCalledTimes(2)

		jest.runAllTimers()

		// input unfrozen and previous display restored
		expect(instance.clearErrorMessage).toHaveBeenCalled()
		expect(instance.state.display).toBe('0')
		expect(instance.state.runningTotal).toBe('1/')
		expect(instance.state.freeze).toBe(false)
	})

})

describe('directly invoking clearErrorMessage()', () => {

	it('sets state.display to the prevous display and unfreezes user input', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: 'LIMIT EXCEEDED',
			freeze: true
		})

		instance.clearErrorMessage('100')

		expect(instance.state.display).toBe('100')
		expect(instance.state.freeze).toBe(false)
	})

})

describe('directly invoking updateWithOperator()', () => {

	let wrapper
	let instance

	beforeEach(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	it('resets calculateCalled and isNegative each time an operator is entered', () => {
		wrapper.setState({ 
			calculateCalled: true,
			isNegative: true
		})

		instance.updateWithOperator('+')

		expect(instance.state.calculateCalled).toBe(false)
		expect(instance.state.isNegative).toBe(false)
	})

	it('calls swapLastOperator() if the last char of runningTotal is an operator', () => {
		wrapper.setState({ runningTotal: '1+' })
		jest.spyOn(instance, 'swapLastOperator')

		instance.updateWithOperator('-')

		expect(instance.swapLastOperator).toHaveBeenCalled()
		expect(instance.state.runningTotal).toBe('1-')
	})

	it('calls calcRunningTotal() and chainOperations() if the last char is a number', () => {
		wrapper.setState({ runningTotal: '1+2' })
		jest.spyOn(instance, 'calcRunningTotal')
		jest.spyOn(instance, 'chainOperations')

		instance.updateWithOperator('-')

		expect(instance.calcRunningTotal).toHaveBeenCalled()
		expect(instance.chainOperations).toHaveBeenCalledWith('-')
		expect(instance.state.runningTotal).toBe('3-')	
	})

})

describe('directly invoking swapLastOperator()', () => {

	it('swaps the last char on store and runningTotal for a new operator char', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			runningTotal: '3+',
			store: '3 + '
		})

		instance.swapLastOperator('-')

		expect(instance.state.runningTotal).toBe('3-')
		expect(instance.state.store).toBe('3 - ')
	})

})

describe('directly invoking calcRunningTotal()', () => {

	it('evaluates runningTotal and calls displayErrorMessage() or sets state accordingly', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()

		// calls displayErrorMessage() if runningTotal will exceed 15 chars
		wrapper.setState({ 
			runningTotal: '999999999999999+1',
			display: '1'
		})
		jest.spyOn(instance, 'displayErrorMessage')

		instance.calcRunningTotal()

		expect(instance.displayErrorMessage).toHaveBeenCalledWith('1', 'limit')

		// calls displayErrorMessage() if runningTotal will be NaN or Infinity
		wrapper.setState({ 
			runningTotal: '1/0',
			display: '0'
		})
		jest.spyOn(instance, 'displayErrorMessage')

		instance.calcRunningTotal()

		expect(instance.displayErrorMessage).toHaveBeenCalledWith('0', 'undef')

		// sets new runningTotal in state otherwise
		wrapper.setState({ runningTotal: '1+1' })

		instance.calcRunningTotal()

		expect(instance.state.runningTotal).toBe('2')
	})

})

describe('directly invoking chainOperations()', () => {

	it('will not do anything if display reads "LIMIT EXCEEDED"', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({ 
			display: 'LIMIT EXCEEDED',
			runningTotal: '999999999999999+1',
			store: '999999999999999 + '
		})
		jest.spyOn(instance, 'chainOperations')

		instance.chainOperations('+')

		expect(instance.state.display).toBe('LIMIT EXCEEDED')
		expect(instance.state.runningTotal).toBe('999999999999999+1')
		expect(instance.state.store).toBe('999999999999999 + ')
		expect(instance.chainOperations).toHaveReturned()
	})

	it('sets state with the new operator if the char limit is not exceeded', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({ 
			display: '3',
			runningTotal: '6',
			store: '1 + 2 + '
		})

		instance.chainOperations('-')

		expect(instance.state.display).toBe('6')
		expect(instance.state.runningTotal).toBe('6-')
		expect(instance.state.store).toBe('1 + 2 + 3 - ')
	})

})

describe('directly invoking handleDecimal()', () => {

	let wrapper
	let instance

	beforeEach(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	it('does nothing if there is only one term and it already contains a decimal', () => {
		wrapper.setState({ runningTotal: '-0.5' })

		jest.spyOn(instance, 'handleDecimal')
		jest.spyOn(instance, 'updateWithChar')
		instance.handleDecimal()

		expect(instance.state.runningTotal).toBe('-0.5')
		expect(instance.handleDecimal).toHaveReturned()
		expect(instance.updateWithChar).not.toHaveBeenCalled()
	})

	it('calls updateWithChar(".") if the term needs a decimal added', () => {
		wrapper.setState({
			runningTotal: '1+3',
			display: '3'
		})

		jest.spyOn(instance, 'updateWithChar')
		instance.handleDecimal()

		expect(instance.updateWithChar).toHaveBeenCalledWith('.')
		expect(instance.state.runningTotal).toBe('1+3.')
		expect(instance.state.display).toBe('3.')
	})
		
	it('does nothing if the last term entered already contains a decimal', () => {
		wrapper.setState({
			runningTotal: '1+3.',
			display: '3.'
		})

		jest.spyOn(instance, 'updateWithChar')
		instance.handleDecimal()

		expect(instance.state.runningTotal).toBe('1+3.')
		expect(instance.state.display).toBe('3.')
		expect(instance.updateWithChar).not.toHaveBeenCalled()
	})

	it('calls leadingZero() if the last char entered was an operator', () => {
		wrapper.setState({
			runningTotal: '1+',
			display: '1'
		})

		jest.spyOn(instance, 'leadingZero')
		instance.handleDecimal()

		expect(instance.state.runningTotal).toBe('1+0.')
		expect(instance.state.display).toBe('0.')
		expect(instance.leadingZero).toHaveBeenCalled()
	})

	it('calls updateWithChar(".") if the last char entered was a number', () => {
		wrapper.setState({
			runningTotal: '1+3',
			display: '3'
		})	

		jest.spyOn(instance, 'updateWithChar')
		instance.handleDecimal()

		expect(instance.state.runningTotal).toBe('1+3.')
		expect(instance.state.display).toBe('3.')
		expect(instance.updateWithChar).toHaveBeenCalledWith('.')
	})

})

describe('directly invoking updateWithChar()', () => {

	let wrapper
	let instance

	beforeEach(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	it('keeps state.isNegative true if user adds digits or decimals to a negative term', () => {
		wrapper.setState({
			display: '-1',
			isNegative: true
		})

		instance.updateWithChar('.')

		expect(instance.state.isNegative).toBe(true)

		wrapper.setState({
			display: '-1',
			isNegative: true
		})

		instance.updateWithChar('2')

		expect(instance.state.isNegative).toBe(true)
	})

	it('calls leadingZero() if user enters "." and the last char was an operator or nothing has yet been entered', () => {
		jest.spyOn(instance, 'leadingZero')
		wrapper.setState({ runningTotal: '1+' })

		instance.updateWithChar('.')

		expect(instance.state.runningTotal).toBe('1+0.')

		wrapper.setState({ runningTotal: '0' })

		instance.updateWithChar('.')

		expect(instance.state.runningTotal).toBe('00.')
		expect(instance.leadingZero).toHaveBeenCalledTimes(2)
	})

	it('calls updateDisplay() if user enters !="." and last char was an operator or nothing has yet been entered', () => {
		jest.spyOn(instance, 'updateDisplay')
		wrapper.setState({
			display: '1',
			runningTotal: '1+'
		})

		instance.updateWithChar('2')

		expect(instance.state.display).toBe('2')
		expect(instance.state.runningTotal).toBe('1+2')
		expect(instance.updateDisplay).toHaveBeenCalledWith('2')
	})

	it('calls concatChar() if last char entered was a number', () => {
		jest.spyOn(instance, 'concatChar')
		wrapper.setState({
			display: '2',
			runningTotal: '1+2'
		})

		instance.updateWithChar('3')

		expect(instance.state.display).toBe('23')
		expect(instance.state.runningTotal).toBe('1+23')
		expect(instance.concatChar).toHaveBeenCalledWith('3')
	})
})

describe('directly invoking updateDisplay()', () => {

	it('swaps the current display with the char it receives and updates runningTotal', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '1',
			runningTotal: '1+'
		})

		instance.updateDisplay('2')

		expect(instance.state.display).toBe('2')
		expect(instance.state.runningTotal).toBe('1+2')
	})

})

describe('directly invoking concatChar()', () => {

	it('calls displayErrorMessage if the number of chars in the display will exceed 15', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({ display: '1111111111111111' })
		jest.spyOn(instance, 'displayErrorMessage')

		instance.concatChar('2')

		expect(instance.displayErrorMessage).toHaveBeenCalledWith('1111111111111111', 'limit')
	})

	it('adds the char it receives to display and runningTotal if the char limit is not exceeded', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '1',
			runningTotal: '01'
		})

		instance.concatChar('2')

		expect(instance.state.display).toBe('12')
		expect(instance.state.runningTotal).toBe('012')
	})

})

describe('directly invoking leadingZero()', () => {

	it('begins new decimal terms with a leading "0"', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '1',
			runningTotal: '1+'
		})

		instance.leadingZero()

		expect(instance.state.display).toBe('0.')
		expect(instance.state.runningTotal).toBe('1+0.')
	})

})

describe('directly invoking plusMinus()', () => {

	it('does nothing if the last char is an operator or user has yet to enter any terms', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		jest.spyOn(instance, 'plusMinus')

		// last char is an operator
		wrapper.setState({ runningTotal: '1+' })

		instance.plusMinus()

		expect(instance.state.runningTotal).toBe('1+')
		expect(instance.plusMinus).toHaveReturnedTimes(1)

		// no chars have been entered yet
		wrapper.setState({ runningTotal: '0' })

		instance.plusMinus()

		expect(instance.state.runningTotal).toBe('0')
		expect(instance.plusMinus).toHaveReturnedTimes(2)
	})

	it('calls negateNum() if there is a char to negate', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({ runningTotal: '1' })
		jest.spyOn(instance, 'negateNum')

		instance.plusMinus()

		expect(instance.state.runningTotal).toBe('-1')
		expect(instance.negateNum).toHaveBeenCalledWith('1')
	})

})

describe('directly invoking negateNum()', () => {

	it('makes the term with focus positive if it is negative', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '-1',
			runningTotal: '2+-1',
			isNegative: true
		})

		instance.negateNum('2+-1')

		expect(instance.state.display).toBe('1')
		expect(instance.state.runningTotal).toBe('2+1')
		expect(instance.state.isNegative).toBe(false)
	})

	it('makes the term with focus negative if it is positive', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '1',
			runningTotal: '2+1',
			isNegative: false
		})

		instance.negateNum('2+1')

		expect(instance.state.display).toBe('-1')
		expect(instance.state.runningTotal).toBe('2+-1')
		expect(instance.state.isNegative).toBe(true)
	})

})

describe('directly invoking calculate()', () => {

	let wrapper
	let instance

	beforeEach(() => {
		wrapper = shallow(<App />)
		instance = wrapper.instance()
	})

	it('calls displayErrorMessage() if the calculated total will exceed 15 chars', () => {
		wrapper.setState({
			display: '1',
			runningTotal: '999999999999999+1'
		})
		jest.spyOn(instance, 'displayErrorMessage')

		instance.calculate()

		expect(instance.state.display).toBe('LIMIT EXCEEDED')
		expect(instance.displayErrorMessage).toHaveBeenCalledWith('1', 'limit')
	})

	it('calls displayErrorMessage() if the calculated total will be "NaN" or "Infinity"', () => {
		wrapper.setState({
			display: '0',
			runningTotal: '1/0'
		})
		jest.spyOn(instance, 'displayErrorMessage')

		instance.calculate()

		expect(instance.state.display).toBe('UNDEFINED')
		expect(instance.displayErrorMessage).toHaveBeenCalledWith('0', 'undef')
	})

	it('sets state to mimick the functionality of the "=" button on a calculator', () => {
		// invoking calculate() to produce a negative total
		wrapper.setState({
			display: '20',
			store: '5 - ',
			runningTotal: '5-20',
			calculateCalled: false,
			isNegative: false
		})

		instance.calculate()

		expect(instance.state.display).toBe('-15')
		expect(instance.state.store).toBe('')
		expect(instance.state.runningTotal).toBe('-15')
		expect(instance.state.calculateCalled).toBe(true)
		expect(instance.state.isNegative).toBe(true)

		// invoking calculate() to produce a positive total
		wrapper.setState({
			display: '20',
			store: '5 + ',
			runningTotal: '5+20',
			calculateCalled: false,
			isNegative: false
		})

		instance.calculate()

		expect(instance.state.display).toBe('25')
		expect(instance.state.store).toBe('')
		expect(instance.state.runningTotal).toBe('25')
		expect(instance.state.calculateCalled).toBe(true)
		expect(instance.state.isNegative).toBe(false)
	})

})

describe('directly invoking refresh()', () => {

	it('begins a new calculation chain when a number or decimal is entered after calculate() has been called', () => {
		const wrapper = shallow(<App />)
		const instance = wrapper.instance()
		wrapper.setState({
			display: '3',
			runningTotal: '3',
			calculateCalled: true
		})

		instance.refresh('1')

		expect(instance.state.display).toBe('1')
		expect(instance.state.runningTotal).toBe('1')
		expect(instance.state.calculateCalled).toBe(false)
	})

})
