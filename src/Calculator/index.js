import React from 'react'
import ButtonPanel from '../Buttons'
import '../index.css'
import PropTypes from 'prop-types'

const Calculator = ({
	display, 
	store, 
	handleClick,
	handleKeyDown,
	calculate
}) =>
	<div>
		<h1>REACTulator</h1>
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
			handleKeyDown={handleKeyDown}
			calculate={calculate}
		/>
	</div>

Calculator.propTypes = {
	display: PropTypes.string.isRequired, 
	store: PropTypes.string, 
	handleClick: PropTypes.func.isRequired,
	handleKeyDown: PropTypes.func.isRequired,
	calculate: PropTypes.func.isRequired
}

export default Calculator
