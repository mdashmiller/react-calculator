import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ButtonPanel from '../Buttons'

Enzyme.configure({ adapter: new Adapter() })

const props = {
	handleClick: jest.fn(),
	handleKeyDown: jest.fn(),
	calculate: jest.fn()
}

describe('<ButtonPanel />', () => {
	
	let wrapper

	beforeAll(() => {
		wrapper = shallow(<ButtonPanel { ...props } />)
	})

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<ButtonPanel { ...props } />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a valid snapshot', () => {
		const component = renderer.create(
			<ButtonPanel { ...props } />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders one top row', () => {
		expect(wrapper.find('div.top-row').length).toBe(1)
	})

	it('renders 4 button rows', () => {
		expect(wrapper.find('div.button-row').length).toBe(4)
	})

	it('renders 19 buttons', () => {
		expect(wrapper.find('.button').length).toBe(19)
	})

	it('calls calculate() when #calc is clicked', () => {
		wrapper.find('button#calc').simulate('click')

		expect(props.calculate).toHaveBeenCalled()
	})

	it('calls handleClick() when the buttons are clicked', () => {
		wrapper.find('.button').not('#calc').forEach(node => {
			node.simulate('click')
		})

		expect(props.handleClick).toHaveBeenCalledTimes(18)
	})

})
