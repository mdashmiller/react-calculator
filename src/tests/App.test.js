import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import App from '../App'
import Calculator from '../components/Calculator'

Enzyme.configure({ adapter: new Adapter() })

describe('<App />', () => {

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
