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

	// changes display when number buttons are pressed
	updateScreenWithNumber = (value) =>
		this.setState(prevState => {
			const { display, store } = prevState
			return (
				// allows display to show 0 initially
				// and clear the 0 once numbers are entered
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

	// keeps a running string of all entered values
	// and operators to be evaluated
	updateStore = (value) => {
		this.setState(prevState => {
			const { store } = prevState
			return { store: store + value }
		})
		this.updateScreenWithOperator(value)
	}

	// clears digits from screen when an operator is pressed
	updateScreenWithOperator = (value) => 
		this.setState({ display: '' })

	// get values from buttons and call 
	// functions to pass them to state
	handleChange = (e) => {
		const btn = e.target.value
		switch (btn) {
			case 'c':
				this.setState({
					display: '' ,
					store: ''
				})
				break
			case '+':
		 		this.updateStore(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	calculate = (display, store) => 
		// evaluate the display on screen
		this.setState({ display: math.eval(store) })

	onSubmit = (e) =>
		// prevent page reload
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
