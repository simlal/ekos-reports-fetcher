# siboire-ferm-predict
ML models for beer production parameter prediction from brew log data

## Overview
This project is a collection of ML models for predicting beer production parameters from brew log data. 

The models are trained on data from the Siboire craft brewery in Sherbrooke, QC, Canada. The models are trained using the [scikit-learn](https://scikit-learn.org/stable/) library. No deep learning models are used.

## Requirements
For the web scraping aspect we will use Puppeteer, a Node library which provides a high-level API to control a Chrome driver. For the data preparation and model training we will use Python 3+ with the traditional pandas/matplotlib/scikit-learn stack.

## Model selection

### Data collection
We used 3 data sources :
- Reports from Ekos ERP for ferm and product information
- Fermentation data from Plaato API
- Manually entered brewlogs in SharePoint

**Ekos batch info, fermentation and ingredient data**
From Ekos' reporting page, we can fetch batch information, fermentation logs and ingredients. Since there's no API we used a web scrapping approach with Puppeteer to fetch the report programmatically. The script used is located in the `data/fetch_ekos.js`.

**Plaato fermentation data**
We used the Plaato API to fetch fermentation data. The script used is located in the `data/fetch_plaato.js`.

**Brew logs from SharePoint**
Brew logs are entered manually in SharePoint. We used ?? to fetch the Excel spreadsheets.

### Data cleaning
TODO

### Model selection
