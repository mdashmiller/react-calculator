import React from 'react'
import ButtonPanel from '../Buttons'

const Calculator = ({ expression, handleChange, calculate, onSubmit }) =>
	<form onSubmit={onSubmit}>
		{/* displays value of button presses */}
		<input
			className="display"
			type="text"
			placeholder="0"
			value={expression}
			disabled
		/>
		{/* evaluates expression in the input */}
		<button onClick={() => calculate(expression)}>
			Calculate
		</button>
		{/* number and operator buttons */}
		<ButtonPanel handleChange={handleChange} />
	</form>

export default Calculator
