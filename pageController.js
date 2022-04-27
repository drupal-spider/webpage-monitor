const pageScreenshot = require('./pageScreenshot');
async function checkChanges(browserInstance) {
	let browser;
	try {
		browser = await browserInstance;
		await pageScreenshot.take(browser);
		await browser.close();
	}
	catch (err) {
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => checkChanges(browserInstance)