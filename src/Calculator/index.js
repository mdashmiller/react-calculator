import React from 'react'
import ButtonPanel from '../Buttons'

const Calculator = ({ display, store, handleChange, calculate, onSubmit }) =>
	<form onSubmit={onSubmit}>
		{/* displays value of button presses */}
		<input
			className="display"
			type="text"
			placeholder={display}
			value={display}
			disabled
		/>
		{/* evaluates display in the input */}
		<button onClick={() => calculate(display, store)}>
			Calculate
		</button>
		{/* number and operator buttons */}
		<ButtonPanel handleChange={handleChange} />
	</form>

export default Calculator
