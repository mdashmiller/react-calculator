import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		display: '0',
		store: ''
	}

	// component methods

	updateScreenWithNumber = value =>
		// changes display when number buttons are pressed
		this.setState(prevState => {
			const { display, store } = prevState
			return (
				// allows display to show 0 initially
				// and clears the 0 once numbers are entered
				display === '0'
					?  {
							display: value, 
							store: store+value
					}
					:  {
							display: display + value,
							store: store + value
					}
			)
		})

	updateStore = value => {
		// updates a running string of all entered values
		// and operators to be evaluated when an 
		// operator button is pressed
		this.setState(prevState => {
			const { store } = prevState
			return { store: store + value }
		})
		// clears digits from screen when an operator is pressed
		this.setState({ display: '' })
	}

	handleChange = e => {
		// gets values from buttons and calls 
		// functions to pass the values to state
		const btn = e.target.value
		switch (btn) {
			case 'c':
				this.setState({
					display: '' ,
					store: ''
				})
				break
			case '+':
			case '-':
		 		this.updateStore(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	calculate = (display, store) => 
		// evaluates the store and shows it in display
		this.setState({ display: math.eval(store) })

	onSubmit = e =>
		// prevents page reload
		e.preventDefault()

	render() {
		return (
			<div className="app">
				<Calculator 
					display={this.state.display}
					store={this.state.store} 
					handleChange={this.handleChange}
					calculate={this.calculate}
					onSubmit={this.onSubmit}
				/>	
			</div>
		)
	}
}

export default App
