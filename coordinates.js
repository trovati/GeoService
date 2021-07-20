const request = require('request');
const fs = require('fs');
// Importando os endereços
// Formato: {endereco: []}
// const {endereco} = require('./endereco.json')
// const {saintGobain} = require('./Endereços/PDVsSaintGobain.json')

const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyCMHugBqB_VEmy7aPMBLjjG-rrRBGLtmtM';

// Passar os dados em string para JSON
const parseJson = (string) => {

    try {
        return JSON.parse(string)
    } catch (error) {
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

const getApiUrl = (address, postalCode) => {
    //console.log(`${API_URL}?address=${address.replace(/[- ]+/g, "+")}&key=${API_KEY}`)
    //SaintGobain
    //return `${API_URL}?address=${address.replace(/\s+/g, "+")}&components=postal_code:${postalCode}&key=${API_KEY}`;
    //Condor
    //return `${API_URL}?address=${address.replace(/\s+/g, "+")}&key=${API_KEY}`;
    //SIKA
    return `${API_URL}?address=${address.replace(/\s+/g, "+")}&key=${API_KEY}`;
}

//const end = `${saintGobain.Address} ${saintGobain.Bairro}, ${saintGobain.UF}`
//console.log(end)
// const end = saintGobain.Address[0]
// console.log(end)

// ETAPAS:
// 1. LER O ARQUIVO JSON + // 2. TRANSFORMAR OS DADOS DO ARQUIVO EM OBJETO
const enderecos = require('./Endereços/PDVsSIKA.json')
console.log("ends: ", enderecos.length)

// 3. MONTAR A URL PARA UM ENDEREÇO
// function montarURLS(listaEnderecos){
//   let urls = []
//   for (let endereco of listaEnderecos){ // para cada endereco na lista de enderecos

//     const enderecoFormatado = `${endereco['Address']} ${endereco['Bairro']} ${endereco['UF']}`;
//     const url = getApiUrl(enderecoFormatado, endereco["Código postal"])
//     urls.push(url)
//   }
//   return urls
// }
function montarURL(endereco) {
    //SaintGobain
    // const enderecoFormatado = `${endereco['Address']} ${endereco['Bairro']} ${endereco['UF']}`;
    // const url = getApiUrl(enderecoFormatado, endereco["Código postal"])
    // Condor
    //const enderecoFormatado = `${endereco['rua']} ${endereco['Cliente - Estado']}`;
    //const url = getApiUrl(enderecoFormatado);
    //SIKA
     const enderecoFormatado = `${endereco['CONCAT']}`;
     const url = getApiUrl(enderecoFormatado, endereco["Código postal"])
    console.log(url)
    return url
}
// const urlsMontadas = montarURLS(enderecos)
// console.log("urls: ", urlsMontadas)
// 4. PEGAR AS INFORMAÇOES LAT E LONG
// doRequest(urlsMontadas[0]).then((results)=> console.log('dados: ', results))

async function getLatLong(urlGoogle) {
    const data = await doRequest(urlGoogle)
    if (data.results.length) {
        const results = data.results[0].geometry.location
        const coordinate = {
            endereco: data.results[0].formatted_address,
            lat: results.lat,
            lng: results.lng
        }
        return coordinate
    }
    return null
}
// getLatLong(urlsMontadas[0]).then((response)=> console.log('formatado: ', response))

// 5. BUSCAR TODAS AS LAT E LONG E FORMATAR RESULTADO
async function formatResults(listaEnderecos) {
    const results = []
    for (let endereco of listaEnderecos) {
        const urlMontada = montarURL(endereco)

        const resultado = await getLatLong(urlMontada)
        if (resultado) {
            const { endereco: enderecoFormatado, lat, lng } = resultado;
            // const result = await getLatLong(urlMontada)
            console.log("endereco formatado: ", enderecoFormatado)
            console.log("lat: ", lat)
            console.log("lng: ", lng)
            results.push({
                ...endereco,
                enderecoFormatado,
                lat,
                lng
            })
        } else {
            results.push({
                ...endereco,
                enderecoFormatado: '',
                lat: '',
                lng: ''
            })
        }
    }
    return results
}


// 6. SALVAR OS DADOS EM JSON (DADOS DO ARQUIVO + LAT E LONG + END. FORMATADO)
formatResults(enderecos).then((resultados) => {
    fs.writeFileSync('./resultados.json', JSON.stringify(resultados))
})


// const address = endereco;
// //console.log(Object.values(address).length)
// const coordinateList = [];
// (async () => {
//     for (let i = 0; i < endereco.length; i++) {
//     const apiUrl = getApiUrl(address[i]);
//     const data = await doRequest(apiUrl);

//     const results = data.results[0].geometry.location
//     //console.log(data.results[0].geometry.location.lat);
//     const coordinate = {
//         endereco: data.results[0].formatted_address,
//         lat:results.lat,
//         lng:results.lng
//     }
//     console.log(coordinate)
//     coordinateList.push(coordinate)
//     }
//     return coordinateList
// })();