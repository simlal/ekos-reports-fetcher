const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const path = require("path")
const dotenvFile = path.join("..", ".env")

dotenv.config({path: dotenvFile})

console.log(process.env.TEST)

// Puppeter driver config
const ekosLoginUrl = "https://login.goekos.com/";
const viewPort = {
    width: 1080,
    height: 1024
};

// Helper for deprecated waitForTimeout
async function pageTimeout(ms) {
    new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to fetch Ekos data
async function fetchEkosData(headlessMode, baseUrl, viewPort) {
    // Launch browser
    const browser = await puppeteer.launch({headless: headlessMode});
    const page = await browser.newPage();

    // navigate to Ekos login page and set viewPort
    await page.goto(baseUrl);
    await page.setViewport(viewPort);

    // Input credentials and login
    await page.waitForSelector(".input_wrapper");
    await page.type("#txtUsername", process.env.EKOS_USERNAME, {delay: 15})
    await page.type("#txtPassword", process.env.EKOS_PASSWORD, {delay: 15})
    await page.click("#btnLogin")
    
    // Open the reporting main section
    await page.waitForSelector(".desktop-nav--collapsed-icons > div:nth-child(6) > button:nth-child(1)")
        .then(button => button.click());
    
    await page.waitForSelector("a.nav-option:nth-child(1) > div:nth-child(1) > div:nth-child(1)")
        .then(button => button.click());

    // Select category and build array of wanted reports
    const reportsArr = new Array(3);
    // TODO select + build
    // const reports = await page.$$(".Link-reports-ui__sc-81gbfs-0 ddnYoF");
    // for (let report of navButtons) {
    //     let buttonInnerHtml = await button.evaluate(ele => ele.innerHTML, button);
    //     if (buttonInnerHtml == "Reporting") {
    //         await button.click();
    //     }
    // }

    // close browser
    await browser.close();
}

// Call main function
try {
    fetchEkosData(false, ekosLoginUrl, viewPort);
} catch (error) {
    console.log(error);
}