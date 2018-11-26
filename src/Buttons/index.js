import React from 'react'
import '../index.css'

const ButtonPanel = ({ handleClick, calculate }) => 
	// sends values from button to App state
	<div className="wrapper">
		<div className="top-row">
			<button className="button func" onClick={ () => handleClick('ce') }>ce</button>
			<button className="button func" onClick={ () => handleClick('c') }>c</button>
			<button className="button mod" onClick={ () => handleClick('+/-') }>+/-</button>
		</div>
		<div className="button-row">
			<button className="button number" onClick={ () => handleClick('7') }>7</button>
			<button className="button number" onClick={ () => handleClick('8') }>8</button>
			<button className="button number" onClick={ () => handleClick('9') }>9</button>
			<button className="button op" onClick={ () => handleClick('/') }>/</button>
		</div>
		<div className="button-row">
			<button className="button number" onClick={ () => handleClick('4') }>4</button>
			<button className="button number" onClick={ () => handleClick('5') }>5</button>
			<button className="button number" onClick={ () => handleClick('6') }>6</button>
			<button className="button op" onClick={ () => handleClick('x') }>x</button>
		</div>
		<div className="button-row">
			<button className="button number" onClick={ () => handleClick('1') }>1</button>
			<button className="button number" onClick={ () => handleClick('2') }>2</button>
			<button className="button number" onClick={ () => handleClick('3') }>3</button>
			<button className="button op" onClick={ () => handleClick('-') }>-</button>
		</div>
		<div className="button-row">
			<button className="button number" onClick={ () => handleClick('0') }>0</button>
			<button className="button mod" onClick={ () => handleClick('.') }>.</button>
			<button className="button func" onClick={calculate}>=</button>
			<button className="button op" onClick={ () => handleClick('+') }>+</button>
		</div>
	</div>	

export default ButtonPanel
