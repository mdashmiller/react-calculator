import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai, { expect } from 'chai'
import { spy } from 'sinon'

import ButtonPanel from '../Buttons'

Enzyme.configure({ adapter: new Adapter() })

global.jestExpect = global.expect
global.expect = chai.expect

describe('<ButtonPanel />', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div')
		ReactDOM.render(<ButtonPanel />, div)
		ReactDOM.unmountComponentAtNode(div)
	})

	it('has a valid snapshot', () => {
		const component = renderer.create(
			<ButtonPanel />
		)
		let tree = component.toJSON()
		jestExpect(tree).toMatchSnapshot()
	})

	it('renders one top row', () => {
		const wrapper = shallow(<ButtonPanel />)
		expect(wrapper.find('div.top-row')).to.have.lengthOf(1)
	})

	it('renders 4 button rows', () => {
		const wrapper = shallow(<ButtonPanel />)
		expect(wrapper.find('div.button-row')).to.have.lengthOf(4)
	})

	//it('handles click events', () => {})

	//it('handles change', () => {})

})
