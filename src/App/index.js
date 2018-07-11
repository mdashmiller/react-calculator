import React, { Component } from 'react'
import Calculator from '../Calculator'
import * as math from 'mathjs'
import './index.css'

class App extends Component {
	state = {
		display: '0',
		store: '',
		runningTotal: ''
	}

	// component methods
	updateScreenWithNumber = value => 
		this.setState(prevState => {
			const { runningTotal } = prevState // ''
			return {
				display: value,
				runningTotal: runningTotal + value
			}
		})

	updateMemory = value => 
		this.setState(prevState => {
			const { store, display, runningTotal } = prevState 
			return {
				display: runningTotal,
				store: store + display + value,
				runningTotal: runningTotal + value
			}
		})
		
	handleChange = e => {
		const btn = e.target.value
		switch (btn) {
			case 'c':
				this.setState({
					display: '' ,
					store: '',
					runningTotal: ''
				})
				break
			case '+':
			case '-':
				this.calcRunningTotal()
		 		this.updateMemory(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	calcRunningTotal = () => {
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({ runningTotal: total })
	}
		
	calculate = () => {
		const total = math.eval(this.state.runningTotal).toString()
		this.setState({
			display: total,
			store: '',
			runningTotal: total
		})
	}
		
	onSubmit = e =>
		e.preventDefault()

	render() {
		return (
			<div className="app">
				<Calculator 
					display={this.state.display}
					store={this.state.store}
					runningTotal={this.runningTotal} 
					handleChange={this.handleChange}
					calculate={this.calculate}
					onSubmit={this.onSubmit}
				/>	
			</div>
		)
	}
}

export default App
