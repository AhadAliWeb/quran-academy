const mongoose = require("mongoose")

const courseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)
