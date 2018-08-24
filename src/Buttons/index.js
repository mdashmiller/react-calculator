import React from 'react'
import './index.css'

const ButtonPanel = ({ handleChange }) => 
	// sends values from button to App state
	<div>
		<div>
			<input type="button" value="7" onClick={handleChange} />
			<input type="button" value="8" onClick={handleChange} />
			<input type="button" value="9" onClick={handleChange} />
			<input type="button" value="/" onClick={handleChange} />
		</div>
		<div>
			<input type="button" value="4" onClick={handleChange} />
			<input type="button" value="5" onClick={handleChange} />
			<input type="button" value="6" onClick={handleChange} />
			<input type="button" value="*" onClick={handleChange} />
		</div>
		<div>
			<input type="button" value="1" onClick={handleChange} />
			<input type="button" value="2" onClick={handleChange} />
			<input type="button" value="3" onClick={handleChange} />
			<input type="button" value="-" onClick={handleChange} />
		</div>
		<div>
			<input type="button" value="0" onClick={handleChange} />
			<input type="button" value="c" onClick={handleChange} />
			<input type="button" value="." onClick={handleChange} />
			<input type="button" value="+" onClick={handleChange} />
		</div>
		<div>
			<input type="button" value="ce" onClick={handleChange} />
			<input type="button" value="+/-" onClick={handleChange} />
		</div>
	</div>	

export default ButtonPanel
