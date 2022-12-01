/*** examples/src/app.js ***/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import all from "../../lib/index";

const App = () => {
	console.log(all);
	return (
		<>
			<div>
				<button>asdasdsad</button>
			</div>
		</>
	);
};
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
