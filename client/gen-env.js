require('dotenv').config();
const fs = require('fs');

let raw = process.env;
let filtered = Object.keys(raw)
	.filter(key => key.startsWith("REACT_APP"))
	.reduce((obj, key) => {
		obj[key] = raw[key];
		return obj;
	}, {});

data = JSON.stringify(filtered, null, "\t");
fs.writeFileSync('public/env.json', data);