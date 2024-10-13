const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/netcompassion";
const url = "mongodb+srv://giranezajeandedieu2:ybP5tuy4TMg4Xa7f@cluster0.c7aff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };