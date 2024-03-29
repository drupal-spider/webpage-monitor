require('dotenv').config()
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const JPEG = require('jpeg-js');

const scraperObject = {
	successCodes: [
		200,
		304
	],
	async take(browser) {
		let pageURLs = JSON.parse(process.env.PAGE_URLS)
		let viewPort = JSON.parse(process.env.VIEW_PORT)
		viewPort.width = parseInt(viewPort.width)
		viewPort.height = parseInt(viewPort.height)
		const page = await browser.newPage();

		// Set up the view port.
		await page.setViewport(viewPort);
		try {
			// Make sure the screenshot folder exists
			if (!fs.existsSync('screenshot/diff')) {
				// Create the folder for saving screenshots.
				fs.mkdirSync('screenshot/diff', { recursive: true });
			}
			// Take screenshots for the base pathes.
			for (i in pageURLs) {
				await this.takeScreenshots(pageURLs[i], i, page)
			}
		}
		catch (err) {
			console.log(err);
		}
		await page.close();
		return;
	},
	async takeScreenshots(pagURL, imgIndex, page) {
		let liveData, backupData, imgPath, diffImgPath
		const KEEP_BASE = process.env.KEEP_BASE === "true";
		try {
			// Go to the page.
			let response = await page.goto(pagURL, { waitUntil: ['domcontentloaded', 'networkidle0'] });
			if (!this.successCodes.includes(response.status())) {
				console.log(response.status() + ':' + pagURL)
				return;
			}
			page.waitForTimeout(3000);
			console.log(pagURL)
			imgPath = 'screenshot/' + imgIndex + '.jpg'
			diffImgPath = 'screenshot/diff/' + imgIndex + '-diff.jpg'
			backupPath = 'screenshot/' + imgIndex + '-baseline.jpg'
			if (!fs.existsSync(imgPath)) {
				liveData = await page.screenshot({
					type: 'jpeg',
					fullPage: true   // take a fullpage screenshot
				});
				this.saveScreenshot(liveData, imgPath)
				console.log('Screenshot saved.')
			}
			else {
				// Compare the backup screenshot with the live one.
				let img1, img2
				backupData = fs.readFileSync(imgPath);
				img1 = JPEG.decode(backupData)

				if (img1) {
					liveData = await page.screenshot({
						type: 'jpeg',
						clip: {
							x: 0,
							y: 0,
							width: img1.width,
							height: img1.height
						}
					});
					if (liveData) {
						img2 = JPEG.decode(liveData)
						const maxSize = img1.height * img1.width * 4
						const diffBuffer = Buffer.alloc(maxSize)
						const diff = { width: img1.width, height: img1.height, data: diffBuffer }
						// Compare those two screenshots.
						const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.2 })
						if (numDiffPixels) {
							if (KEEP_BASE) {
								// Save the backup image.
								fs.writeFile(backupPath, backupData, (err) => {
									if (err)
									  console.log(err);
									else {
									  console.log("Backup image saved.");
									}
								  });
							}
							// Save the new screenshot
							this.saveScreenshot(liveData, imgPath)
							// Save the diff img.
							let jpegImageData = JPEG.encode(diff, 50); // image quality is 50.
							this.saveScreenshot(jpegImageData.data, diffImgPath)
							console.log('Changed.')
						}
						else {
							if (fs.existsSync(diffImgPath)) {
								fs.unlinkSync(diffImgPath)
							}
							console.log('No change.')
						}
					}
				}
			}
		}
		catch (err) {
			console.log(err);
			console.log('Error to ' + pagURL);
		}
	},
	async saveScreenshot(imgData, imgPath) {
		try {
			// Saving the screenshot.
			fs.writeFileSync(imgPath, imgData)
		}
		catch (err) {
			console.log(err);
		}
	}
}

module.exports = scraperObject;
