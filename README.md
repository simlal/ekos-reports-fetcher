# siboire-ferm-predict
ML models for beer production parameter prediction from brew log data. 

The deployed app is available at [todo](todo.com).

## Overview
This project is a collection of ML models for predicting beer production parameters from brew log data. 

The models are trained on data from the Siboire craft brewery in Sherbrooke, QC, Canada. The models are trained using the [scikit-learn](https://scikit-learn.org/stable/) library. No deep learning models are used.

## Requirements
For the web scraping aspect we will use Puppeteer, a Node library which provides a high-level API to control a Chrome driver. For the data preparation and model training we will use Python 3+ with the traditional pandas/matplotlib/scikit-learn stack.

## Data collection and database setup

### Extract Ekos and Sharepoint data
1. [ ] Puppeteer scripts to extract Ekos reports as csv:
    - `scripts/fetchEkos.js`
2. [ ] Python script to get a OAuth token from Sharepoint and fetch Excel spreadsheets:
    - `scripts/fetch_sharepoint.py`
3. [ ] Data prep for database with a Python script

### Clean the data and create a MongoDB database
1. [ ] Create a MongoDB database
2. [ ] Create a Python script to clean the data and populate the database

### Setting up a Node.js and Express server
1. [ ] Install node/npm/nvm + create a new project and install express
2. [ ] Create a basic server that can serve a static page

### Create a simple React frontend
1. [ ] Install React + create a simple React act served by the server
2. [ ] Make a simple left navibar with a few links

## Model selection

### Data collection
We used 2 data sources :
- Reports from Ekos ERP for ferm and product information
- Manually entered brewlogs in SharePoint

**Ekos batch info, fermentation and ingredient data**
From Ekos' reporting page, we can fetch batch information, fermentation logs and ingredients. Since there's no API we used a web scrapping approach with Puppeteer to fetch the report programmatically. The script used is located in the `scripts/fetchEkos.js`.

<!-- **Plaato fermentation data**
We used the Plaato API to fetch fermentation data. The script used is located in the `data/fetch_plaato.js`. -->

**Brew logs from SharePoint**
Brew logs are entered manually in SharePoint. Python to fetch the Excel spreadsheets. The script used is located in the `scripts/fetch_sharepoint.py`.

### Data cleaning
TODO

### Model selection
TODO

## Model training and evaluation
TODO

## Model deployment
TODO

