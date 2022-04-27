# website-comparison
A simple tool to check the changes of a web page. A common use case is to monitor changes of a website.

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
```

The `.env` file contains the following arguments:

* PAGE_URLS: The URLs to check.
* VIEW_PORT: The view port dimension.
* HEADLESS: Whether to run browser in headless mode.

## Run

`npm run start`
