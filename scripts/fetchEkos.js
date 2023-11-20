const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const path = require("path")
const fs = require('fs');

// savePath for downloaded reports
const scriptDir = path.dirname(__filename)
const savePath = path.join(scriptDir, "..", "data", "ekos-reports")

// Ekos related data for getting reports
const EkosRequestInfo = {
    ekosLoginUrl: "https://login.goekos.com/",
    reportNameQuerries: [
        "CQ data - brewInfo",
        "CQ - Ingredients (completed)",
        "CQ data - Fermentation (all-progress)"
    ],
    newReportFileNames: [
        "brewinfo.csv", 
        "ingredients.csv", 
        "fermentation.csv"
    ]
}

function setupEnv() {

    // Deal with external run
    console.log("Setting up environment...")
    const dotenvFile = path.join(scriptDir, "..", ".env")
    try {
        dotenv.config({path: dotenvFile})
    } catch (error) {
        console.log(".env not found, using current environnement.")
    }

    // Check for missing env variables
    const requiredEnvVars = ["EKOS_USERNAME", "EKOS_PASSWORD"]
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    if (missingEnvVars.length > 0) {
        console.log(`Missing environment variables: ${missingEnvVars.join(", ")}`)
        process.exit(1)
    }
}

function setPuppeteerConfig() {
    // Puppeter driver config
    const pptrParams = {
        product: "chrome",
        headless: false,
        viewPort: {
            width: 1080,
            height: 1024
        },
        downloadTimeout: 5000,
        defaultWaitTime: 3000
    }
    // Parse headless config
    const args = process.argv.slice(2)
    console.log(args.length)
    const possibleArgs = ["--help", "--headless", undefined]
    if (args.length > 1 || !possibleArgs.includes(args[0])) {
        console.log("Invalid arguments. Use --help for more info.")
        process.exit(1)
    }
    if (args[0] === "--help") {
        console.log("Usage: node fetchEkos.js [--headless]")
        console.log("Options:")
        console.log("  --headless    Run in headless mode")
        process.exit(0)
    }
    if (args[0] === "--headless") {
        pptrParams.headless = true
    }
    console.log("Using puppeteer config:")
    console.log(pptrParams)
    return pptrParams
}

// Helper for deprecated waitForTimeout
async function pageTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Rename report file once downloaded
function renameDownload(savePath, newName) {
    fs.readdir(savePath, (err, files) => {
        if (err) throw err;
        // Rename the newly download file
        for (const file of files) {
            if (path.extname(file) === ".csv" && !EkosRequestInfo.newReportFileNames.includes(file)) {
                fs.rename(path.join(savePath, file), path.join(savePath, newName), err => {
                    if (err) throw err;
                });
            }
        }
    });
}
// Clear data folder
function clearData(savePath) {
    // Create dir if not already
    if (!fs.existsSync(savePath)) {
        console.log("Creating data folder...")
        fs.mkdirSync(savePath)
    }
    // clear the data
    console.log("Clearing data folder...")
    fs.readdir(savePath, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            // Delete exising file with target name
            if (file) {
                fs.unlink(path.join(savePath, file), err => {
                    if (err) throw err;
                });
            }
        }
    });
}

// Main function to fetch Ekos data
async function fetchEkosData(pptrParams) {
    
    // Clear data folder
    clearData(savePath);

    // Launch browser
    const browser = await puppeteer.launch(pptrParams);
    const page = await browser.newPage();

    // Set download path
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: savePath
    });


    // navigate to Ekos login page and set viewPort
    await page.goto(EkosRequestInfo.ekosLoginUrl);
    await page.setViewport(pptrParams.viewPort);

    // Input credentials and login
    console.log(`Logging in ${process.env.EKOS_USERNAME}`)
    await page.waitForSelector(".input_wrapper");
    await page.type("#txtUsername", process.env.EKOS_USERNAME, {delay: 5})
    await page.type("#txtPassword", process.env.EKOS_PASSWORD, {delay: 5})
    await page.click("#btnLogin")
    
    // Open the reporting main section
    await page.waitForSelector("button.nav-option:nth-child(6)")
        .then(button => button.click());
    
    await page.waitForSelector("a.nav-option:nth-child(1)")
        .then(button => button.click());
    
    // *** Fetch relevant reports ***
    for (let i = 0; i < EkosRequestInfo.reportNameQuerries.length; i++) {
        let reportName = EkosRequestInfo.reportNameQuerries[i];
        // Type in report name and naviguate to report page
        const reportSearchBoxSelector = 
            "input.sc-uVWWZ.jjluET.sc-Nxspf.dXYREZ.ReportsList__StyledSearchInput-reports-ui__sc-wzkmmj-2.iBbXOq";
        await page.waitForSelector(reportSearchBoxSelector);
                
        await page.evaluate((selector) => {    // clear the field
            document.querySelector(selector).value = "";
        }, reportSearchBoxSelector);

        await page.type(
            reportSearchBoxSelector, 
            reportName,
            {delay: 3});

        // Wait for a selector that contains the reportName in its innerHTML
        const reportLinkSelector = ".Link-reports-ui__sc-81gbfs-0.ddnYoF";
        
        // click on single report
        await pageTimeout(pptrParams.defaultWaitTime)    //TODO FIND BETTER WAY BUT TEMP FIX
        await page.waitForSelector(reportLinkSelector)
            .then(a => a.click());

        // Wait for loading indicator to finish
        await page.waitForSelector(".loading-indicator");
        await page.waitForSelector(".loading-indicator", {hidden: true});

        // Get the report body which is nested inside iframe
        let iframe = await page.waitForSelector("iframe").then(iframe => iframe.contentFrame());
        
        await iframe.waitForSelector(".button_section");
        await iframe.waitForSelector(".buttonGroupOuter")
            .then(button => button.click());

        // Download the report and rename it
            await iframe.waitForSelector(".buttonGroupOptions")
        await iframe.waitForSelector("#csv_export")
            .then(button => button.click())
            .then(console.log("Started downloading report: " + reportName));
        await pageTimeout(pptrParams.downloadTimeout)    // No puppeteer wait for download to finish, so we wait 5s
            .then(console.log(`Finished ${pptrParams.downloadTimeout} timeout for download.`))
        // Rename the file
        renameDownload(savePath, EkosRequestInfo.newReportFileNames[i]);
        console.log("Renamed report to " + EkosRequestInfo.newReportFileNames[i]);
        await iframe.waitForSelector(".CloseButton")
            .then(button => button.click());
    }

    await browser.close();
}

// *** Main ***
async function main() {
    // Setup environment
    try {
        setupEnv();
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

    // Set puppeteer config
    const pptrParams = setPuppeteerConfig();

    // Fetch Ekos data
    try {
        fetchEkosData(pptrParams);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
main()
