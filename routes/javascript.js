let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/:js_file([a-zA-Z0-9\/\_\-]+)\.js', function(req, res, next) {
	let fs = require('fs');
	if(fs.existsSync(`${__dirname}/../public/javascripts/${req.params.js_file}.js`)) {
		res.sendFile(`${req.params.js_file}.js`, {root: `${__dirname}/../public/javascripts/`});
	}
	else {
		res.set('Content-Type', 'application/javascript');
		res.send(`console.error("'${req.params.js_file}.js' file not found !!")`);
	}
});

module.exports = router;
