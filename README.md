# siboire-ferm-predict
ML models for beer production parameter prediction from brew log data

## Overview
This project is a collection of ML models for predicting beer production parameters from brew log data. 

The models are trained on data from the Siboire craft brewery in Sherbrooke, QC, Canada. The models are trained using the [scikit-learn](https://scikit-learn.org/stable/) library. No deep learning models are used.

## Requirements
For the web scraping aspect we will use Puppeteer, a Node library which provides a high-level API to control a Chrome driver. For the data preparation and model training we will use Python 3+ with the traditional pandas/matplotlib/scikit-learn stack.

## Backend setup
### Setting up a Node.js and Express server
1. [ ] Install node/npm/nvm + create a new project and install express
2. [ ] Create a basic server that can serve a static page

### Create a simple React frontend
1. [ ] Install React + create a simple React act served by the server
2. [ ] Make a simple left navibar with a few links

### Step 3: Extract Ekos and Sharepoint data for base setup with SQL Server
1. [ ] Puppeteer scripts to extract data from Ekos and SharePoint as csv:
    - `scripts/fetchEkos.js`
    - `scripts/fetchSharePoint.js`
3. [ ] Data prep for database with a Python script

### Base schema and tables for SQL Server database
1. [ ] Create a base schema (product, brew logs, fermentation logs, etc.)
2. [ ] Setup a SQL Server with Azure
3. [ ] Create the db and tables using a the Python ORM SQLAlchemy

### Step 5: Populate the database with the extracted data
1. [ ] Create a function call in Azure to populate the database

## Model selection

### Data collection
We used 3 data sources :
- Reports from Ekos ERP for ferm and product information
- Fermentation data from Plaato API
- Manually entered brewlogs in SharePoint

**Ekos batch info, fermentation and ingredient data**
From Ekos' reporting page, we can fetch batch information, fermentation logs and ingredients. Since there's no API we used a web scrapping approach with Puppeteer to fetch the report programmatically. The script used is located in the `scripts/fetchEkos.js`.

<!-- **Plaato fermentation data**
We used the Plaato API to fetch fermentation data. The script used is located in the `data/fetch_plaato.js`. -->

**Brew logs from SharePoint**
Brew logs are entered manually in SharePoint. We used Puppeteer to fetch the Excel spreadsheets. The script used is located in the `scripts/fetchSharePoint.js`.

### Data cleaning
TODO

### Model selection
