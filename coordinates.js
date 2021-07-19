const request = require('request');
const {endereco} = require('./endereco.json')

const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyCMHugBqB_VEmy7aPMBLjjG-rrRBGLtmtM';

const parseJson = (string) => {

    try{
        return JSON.parse(string)
    }catch(error) {
        console.error;
    }
}

const doRequest = (url) => {
    const promisse = (resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            const data = parseJson(body);
            //console.log(data)
            resolve(data);
        });
    };
    return new Promise(promisse);
}


const getApiUrl = (address) => {
    //console.log(`${API_URL}?address=${address.replace(/[- ]+/g, "+")}&key=${API_KEY}`)
    return `${API_URL}?address=${address.replace(/[- ]+/g, "+")}&key=${API_KEY}`;
}
const address = endereco;
//console.log(Object.values(address).length)

(async () => {
    for (let i = 0; i < Object.values(endereco).length; i++) {
    const apiUrl = getApiUrl(address[i]);
    const data = await doRequest(apiUrl);

    const results = data.results[0].geometry.location
    //console.log(data.results[0].geometry.location.lat);
    const coordinate = {
        endereco: data.results[0].formatted_address,
        lat:results.lat,
        lng:results.lng
    }
    console.log(coordinate)
    }
})();