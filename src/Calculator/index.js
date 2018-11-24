import React from 'react'
import ButtonPanel from '../Buttons'
import '../index.css'

const Calculator = ({
	display, 
	store, 
	handleClick,
	calculate, 
	handleSubmit 
}) =>
	<div>
		<h1>REACTulator</h1>
		<form onSubmit={handleSubmit}>
			<div className="store">
				<span>{store}</span>
			</div>
			<input
				className="display"
				type="text"
				placeholder={display}
				value={display}
				disabled
			/>
			<br/>
			<ButtonPanel
				handleClick={handleClick}
				calculate={calculate} />
		</form>
	</div>

export default Calculator
