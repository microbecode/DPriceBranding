const https = require('https');

exports.handler = async (event) => {
    let dataString = '';
    const key = process.env.REACT_APP_ETHERSCAN_API_KEY_PRICE;
    if (!key) {
        throw "no price key";
    }
    const url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + key;
    
    // https://betterprogramming.pub/aws-tutorial-about-node-js-lambda-external-https-requests-logging-and-analyzing-data-e73137fd534c
    const response = await new Promise((resolve, reject) => {
        const req = https.get(url, function(res) {
          res.on('data', chunk => {
            dataString += chunk;
          });
          res.on('end', () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify(JSON.parse(dataString), null, 4)
            });
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    
    return response;
};