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
			const { runningTotal } = prevState 
			return {
				display: value,
				runningTotal: runningTotal + value
			}
		})

	updateMemory = value => 
		this.setState(prevState => {
			const { display, store, runningTotal } = prevState 
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
			case 'ce':
				const newRunningTotal = this.removeLast() 
				this.setState({
					display: '0' ,
					runningTotal: newRunningTotal
				})
				console.log(this.state.runningTotal)
				break
			case '+':
			case '-':
			case '*':
			case '/':
				this.calcRunningTotal()
		 		this.updateMemory(btn)
		 		break
		  	default:
		    	this.updateScreenWithNumber(btn)
		}
	}

	removeLast = () => {
		const rtArray = [...this.state.runningTotal] 
		const rtLength = rtArray.length 
		const lastItem = rtArray[rtLength - 1]
			switch (lastItem) {
				case '+':
				case '-':
				case '*':
				case '/':
					return rtArray.join('')
				default:
					return rtArray.filter((item, index) =>
						index !== rtLength -1).join('')	
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
