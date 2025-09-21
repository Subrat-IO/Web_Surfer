const { default: axios } = require("axios");




export const npmjsserver = axios.create({
    baseURL :"http://localhost:9090",

})
