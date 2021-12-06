// const http = require("https");

// const options = {
// 	"method": "GET",
// 	"hostname": "apex-legends.p.rapidapi.com",
// 	"port": null,
// 	"path": "/stats/imshleepdawg/PC",
// 	"headers": {
// 		"x-rapidapi-host": "apex-legends.p.rapidapi.com",
// 		"x-rapidapi-key": "2845aa4e72msh03b047e344c8f37p15f41bjsnf768b73e52ba",
// 		"useQueryString": true
// 	}
// };

// const req = http.request(options, function (res) {
// 	const chunks = [];

// 	res.on("data", function (chunk) {
// 		chunks.push(chunk);
// 	});

// 	res.on("end", function () {
// 		const body = Buffer.concat(chunks);
// 		console.log(body.toString());
// 	});
// });

// req.end();