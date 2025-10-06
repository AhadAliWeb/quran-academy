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
        },
        reportFields: [
            {
                name: {
                    type: String,
                    required: true
                },
                label: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
                },
                options: {
                    type: [String],
                },
                required: {
                    type: Boolean,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)
