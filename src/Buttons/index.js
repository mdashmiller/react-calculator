import React from 'react'
import '../index.css'

const ButtonPanel = ({ handleChange, calculate }) => 
	// sends values from button to App state
	<div className="wrapper">
		<div className="top-row">
			<input className="button func" type="button" value="ce" onClick={handleChange} />
			<input className="button func" type="button" value="c" onClick={handleChange} />
			<input className="button mod" type="button" value="+/-" onClick={handleChange} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="7" onClick={handleChange} />
			<input className="button number" type="button" value="8" onClick={handleChange} />
			<input className="button number" type="button" value="9" onClick={handleChange} />
			<input className="button op" type="button" value="/" onClick={handleChange} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="4" onClick={handleChange} />
			<input className="button number" type="button" value="5" onClick={handleChange} />
			<input className="button number" type="button" value="6" onClick={handleChange} />
			<input className="button op" type="button" value="x" onClick={handleChange} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="1" onClick={handleChange} />
			<input className="button number" type="button" value="2" onClick={handleChange} />
			<input className="button number" type="button" value="3" onClick={handleChange} />
			<input className="button op" type="button" value="-" onClick={handleChange} />
		</div>
		<div className="button-row">
			<input className="button number" type="button" value="0" onClick={handleChange} />
			<input className="button mod" type="button" value="." onClick={handleChange} />
			<input className="button func" id="calc" type="button" value="=" onClick={() => calculate()} />
			<input className="button op" type="button" value="+" onClick={handleChange} />
		</div>
	</div>	

export default ButtonPanel
