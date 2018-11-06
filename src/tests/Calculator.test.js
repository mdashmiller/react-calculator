import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

import Calculator from '../Calculator'
import ButtonPanel from '../Buttons'

Enzyme.configure({ adapter: new Adapter() })

describe('<Calculator />', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<Calculator />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a valid snapshot', () => {
		const component = renderer.create(
			<Calculator />
		)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders 1 form element', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('form').length).toBe(1)
	})

	it('renders 1 store div', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('div.store').length).toBe(1)
	})

	it('renders 1 display input', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('input.display').length).toBe(1)
	})

	it('renders 1 <ButtonPanel /> component', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find(ButtonPanel).length).toBe(1)
	})

	//it('handles submit events', () => {})

	//it('handles change events', () => {})
	
	//it('handles click events', () => {})

})
