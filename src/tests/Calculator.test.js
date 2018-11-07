import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai, { expect } from 'chai'
import { spy } from 'sinon'

import Calculator from '../Calculator'
import ButtonPanel from '../Buttons'

Enzyme.configure({ adapter: new Adapter() })

global.jestExpect = global.expect
global.expect = chai.expect

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
		jestExpect(tree).toMatchSnapshot()
	})

	it('renders 1 form element', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('form')).to.have.lengthOf(1)
	})

	it('renders 1 div.store', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('div.store')).to.have.lengthOf(1)
	})

	it('renders 1 input.display', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find('input.display')).to.have.lengthOf(1)	})

	it('renders 1 <ButtonPanel /> component', () => {
		const wrapper = shallow(<Calculator />)
		expect(wrapper.find(ButtonPanel)).to.have.lengthOf(1)
	})

	it('displays the store value in div.store', () => {
		const store = 'some value'
		const wrapper = shallow(<Calculator store={store} />)
		expect(wrapper.find('.store span').props().children).to.equal(store)
	})

	it('has a value of display in input.display', () => {
		const display = 'some value'
		const wrapper = shallow(<Calculator display={display} />)
		expect(wrapper.find('input.display').props().value).to.equal(display)
	})

	it('has a placeholder of display in input.display', () => {
		const display = 'some value'
		const wrapper = shallow(<Calculator display={display} />)
		expect(wrapper.find('input.display').props().placeholder).to.equal(display)
	})

	it('handles submit events', () => {
		const onSubmit = spy()
		const wrapper = shallow(<Calculator onSubmit={onSubmit} />)
		wrapper.find('form').simulate('submit')
		expect(onSubmit).to.have.property('callCount', 1)
	})

})
