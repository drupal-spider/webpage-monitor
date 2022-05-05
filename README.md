# webpage-monitor
A simple tool to check the changes to web pages. A common use case is to monitor any visible changes to a website.

## Install

```bash
# install required package
npm i
```

## Usage

Create a `.env` file in the root of this project:

For example

```dosini
PAGE_URLS = {"1": "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=fake+objects","2": "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=ckeditor+link"}
VIEW_PORT = { "width": "1440", "height": "600" }
HEADLESS = true
KEEP_BASE = false
```

The `.env` file contains the following arguments:

* PAGE_URLS: The URLs to check.
* VIEW_PORT: The view port dimension.
* HEADLESS: Whether to run browser in headless mode.
* KEEP_BASE: Whether keep the baseline image as backup.

## Run

`npm run start`

## Screenshots output

First running, the screenshots for each page will be saved under the folder 'screenshot' as the baseline image to compare with. Since then, everytime this program is executed, it will compare the live screenshot with the baseline image to figure out if any visible change to each page.  
