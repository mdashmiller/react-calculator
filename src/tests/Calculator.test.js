import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Calculator from '../components/Calculator'
import ButtonPanel from '../components/ButtonPanel'

Enzyme.configure({ adapter: new Adapter() })

const props = {
	display: '2', 
	store: '1+', 
	handleClick: jest.fn(),
	handleKeyDown: jest.fn(),
	calculate: jest.fn()
}

describe('<Calculator />', () => {

	let wrapper

	beforeAll(() => {
		wrapper = shallow(<Calculator { ...props } />)
	})

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<Calculator { ...props } />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a valid snapshot', () => {
		const component = renderer.create(
			<Calculator { ...props } />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders 1 div.store', () => {
		expect(wrapper.find('div.store').length).toBe(1)
	})

	it('renders 1 input.display', () => {
		expect(wrapper.find('input.display').length).toBe(1)
	})

	it('renders 1 <ButtonPanel /> component', () => {
		expect(wrapper.find(ButtonPanel).length).toBe(1)
	})

	it('displays the store value in div.store', () => {
		expect(wrapper.find('.store span').props().children).toBe('1+')
	})

	it('has a value of display in input.display', () => {
		expect(wrapper.find('input.display').props().value).toBe('2')
	})

	it('has a placeholder of display in input.display', () => {
		expect(wrapper.find('input.display').props().placeholder).toBe('2')
	})

})
