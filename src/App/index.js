import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		expression: ''
	}

	// component methods
	updateScreen = (value) => {
		this.setState(prevState => {
			const { expression } = prevState
			return { expression: expression + value }
		})
	}

	handleChange = (e) => {
		// get values from buttons and pass them to state
		e.target.value === 'c'
			? this.setState({ expression: '' })
			: this.updateScreen(e.target.value)
	}

	calculate = (expression) => 
		// evaluate the expression on screen
		this.setState({ expression: math.eval(expression) })

	onSubmit = (e) =>
		// prevent page reload
		e.preventDefault()

	render() {
		return (
			<div className="app">
				<Calculator 
					expression={this.state.expression} 
					handleChange={this.handleChange}
					calculate={this.calculate}
					onSubmit={this.onSubmit}
				/>	
			</div>
		)
	}
}

export default App
