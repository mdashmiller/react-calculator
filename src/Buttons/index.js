import React from 'react'
import '../index.css'

const ButtonPanel = ({ handleClick, calculate }) => 
	// sends values from button to App state
	<div className="wrapper">
		<div className="top-row">
			<input className="button func" type="button" value="ce" onClick={handleClick} />
			<input className="button func" type="button" value="c" onClick={handleClick} />
			<input className="button mod" type="button" value="+/-" onClick={handleClick} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="7" onClick={handleClick} />
			<input className="button number" type="button" value="8" onClick={handleClick} />
			<input className="button number" type="button" value="9" onClick={handleClick} />
			<input className="button op" type="button" value="/" onClick={handleClick} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="4" onClick={handleClick} />
			<input className="button number" type="button" value="5" onClick={handleClick} />
			<input className="button number" type="button" value="6" onClick={handleClick} />
			<input className="button op" type="button" value="x" onClick={handleClick} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="1" onClick={handleClick} />
			<input className="button number" type="button" value="2" onClick={handleClick} />
			<input className="button number" type="button" value="3" onClick={handleClick} />
			<input className="button op" type="button" value="-" onClick={handleClick} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="0" onClick={handleClick} />
			<input className="button mod" type="button" value="." onClick={handleClick} />
			<input className="button func" id="calc" type="button" value="=" onClick={calculate} />
			<input className="button op" type="button" value="+" onClick={handleClick} />
		</div>
	</div>	

export default ButtonPanel
