const mongoose = require("mongoose")

const courseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        pdf: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)
