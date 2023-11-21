# Ekos reports fetcher

## Overview
Automate report fetching from Ekos web app using Puppeteer web driver.

## Requirements
For the web scraping aspect we used Puppeteer, a Node library which provides a high-level API to control a Chrome driver. 

## Installation
1. Clone the repository

`git clone https://github.com/simlal/ekos-reports-fetcher.git`

2. Install dependencies

`npm install`

3. Create a `.env` file in the root directory and add the following variables:
```
EKOS_USERNAME=your_username
EKOS_PASSWORD=your_password
```
4. Modify the `EkosRequestInfo.reportNameQuerries` property in `./scripts/fetchEkos.js` to match a search parameter that yields a unique report that you want to fetch. 

For example, if you want to fetch the report with the name `fermentation-data complete logs`, you can set the `reportNameQuerries` property to `['fermentation-data complete logs']`.

5. Set the `run_fetcher.sh` permissions to executable
`chmod +x ./scripts/run_fetcher.sh`

## Usage
Run the the `run_fetcher.sh` script to start the fetcher.

`./scripts/run_fetcher.sh`

Reports will be in the `./data/ekos-reports` directory.