const browserObject = require('./browser');
const pageController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the screenshot controller
pageController(browserInstance)