const { stringify } = require('querystring');
const {enderecos} = require('./Endereços/PDVsSaintGobain.json')

const end = JSON.parse(enderecos)

console.log(end);