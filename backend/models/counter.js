const mongoose = require("mongoose")


const counterSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("Counter", counterSchema)