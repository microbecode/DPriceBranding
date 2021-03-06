exports.handler = async function(event, context) {
    const key = process.env.REACT_APP_ETHERSCAN_API_KEY_PRICE;
    const url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + key;
    const res = await fetch(url);
    const json = await res.json();
    return {
        statusCode: 200,
        body: json
    };
}