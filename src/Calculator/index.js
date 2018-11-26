import React from 'react'
import ButtonPanel from '../Buttons'
import '../index.css'

const Calculator = ({
	handleSubmit,
	display, 
	store, 
	handleClick,
	handleKeyPress,
	calculate
}) =>
	<div>
		<h1>REACTulator</h1>
		<form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
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
				handleKeyPress={handleKeyPress}
				calculate={calculate} />
		</form>
	</div>

export default Calculator
