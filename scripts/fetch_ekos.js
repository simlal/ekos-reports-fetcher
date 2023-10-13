const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const path = require("path")

const dotenvFile = path.join("..", ".env")
dotenv.config({path: dotenvFile})


// Puppeter driver config
const pptrLaunchParams = {
    product: "chrome",
    headless: false,
    viewPort: {
        width: 1080,
        height: 1024
    }
}
const downloadPath = path.resolve(__dirname)

// Ekos related data
const ekosLoginUrl = "https://login.goekos.com/";
const brewInfoReportName = "CQ data - brewInfo";
const ingredientsReportName = "CQ - Ingredients (completed)";
const fermentationReportName = "CQ data - Fermentation (all-progress)";

// Helper for deprecated waitForTimeout
async function pageTimeout(ms) {
    new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to fetch Ekos data
async function fetchEkosData(launchParams) {
    // Launch browser
    const browser = await puppeteer.launch(launchParams);
    const page = await browser.newPage();

    // navigate to Ekos login page and set viewPort
    await page.goto(ekosLoginUrl);
    await page.setViewport(launchParams.viewPort);

    // Input credentials and login
    await page.waitForSelector(".input_wrapper");
    await page.type("#txtUsername", process.env.EKOS_USERNAME, {delay: 5})
    await page.type("#txtPassword", process.env.EKOS_PASSWORD, {delay: 5})
    await page.click("#btnLogin")
    
    // Open the reporting main section
    await page.waitForSelector("button.nav-option:nth-child(6)")
        .then(button => button.click());
    
    await page.waitForSelector("a.nav-option:nth-child(1)")
        .then(button => button.click());
    
    // *** Fetch brewInfo report ***
    // Type in report name and naviguate to report page
    await page.waitForSelector("input.sc-uVWWZ.jjluET.sc-Nxspf.dXYREZ.ReportsList__StyledSearchInput-reports-ui__sc-wzkmmj-2.iBbXOq");
    await page.type(
        "input.sc-uVWWZ.jjluET.sc-Nxspf.dXYREZ.ReportsList__StyledSearchInput-reports-ui__sc-wzkmmj-2.iBbXOq", 
        brewInfoReportName,
        {delay: 1});

    await page.waitForSelector(".Link-reports-ui__sc-81gbfs-0")
        .then(a => a.click());

    // Wait for loading indicator to finish
    await page.waitForSelector(".loading-indicator").then(console.log("loaded ind"));
    await page.waitForSelector(".loading-indicator", {hidden: true}).then(console.log("loaded ind DONE!"));

    // Get the report body which is nested inside iframe
    let iframe = await page.waitForSelector("iframe").then(iframe => iframe.contentFrame());
    
    await iframe.waitForSelector(".button_section");
    await iframe.waitForSelector(".buttonGroupOuter")
        .then(button => button.click());

    // Download the file and save it locally
    // const fs = require('fs');
    // fs.watch(downloadPath, (eventType, filename) => {
    //     if (eventType === 'rename' && filename) {
    //       console.log(`File ${filename} was added to the directory`);
    //       // File has been downloaded, you can perform the next action here
    //     }
    //   });
    
    await iframe.waitForSelector(".buttonGroupOptions")
    await iframe.waitForSelector("#csv_export")
        .then(button => button.click());

    await browser.close();
}

// Call main function driver
try {
    fetchEkosData(pptrLaunchParams);
} catch (error) {
    console.log(error);
}
