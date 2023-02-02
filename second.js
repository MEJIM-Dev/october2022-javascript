const onk = {
    "name": "assaas",
    "age": 23
}

const fs = require("fs")

const tb = fs.readFileSync(__dirname+"/mailTemplate/resetPassword.html","utf-8")
console.log(tb)


const asda = "ASdhagsdasd"

function saySomething(){
    console.log("msg")
}

module.exports = {asda,onk,saySomething}

const as = ["a","b","C"]
const deleted = as.pop()
console.log(as)
console.log("deleted",deleted)