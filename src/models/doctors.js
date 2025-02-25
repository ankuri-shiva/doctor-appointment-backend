const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    workingHours : {
        start: {
            type: String,
            default: "09:00"
        },
        end: {
            type: String,
            default: "23:00"
        }
    },
    
    specialization: {
        type: String,
        trim: true
    
    }

},

{
    timestamps: true
});

module.exports = mongoose.model("Doctor", doctorSchema);