import React from 'react'
import ButtonPanel from '../Buttons'
import '../index.css'

const Calculator = ({
	display, 
	store, 
	handleChange, 
	calculate, 
	onSubmit 
}) =>
	<form onSubmit={onSubmit}>
		<input
			className="store"
			type="text"
			value={store}
			disabled
		/>
		<br/>
		<input
			className="display"
			type="text"
			placeholder={display}
			value={display}
			disabled
		/>
		<br/>
		<button onClick={() => calculate()}>
			Calculate
		</button>
		<ButtonPanel handleChange={handleChange} />
	</form>

export default Calculator
