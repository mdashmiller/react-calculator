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
