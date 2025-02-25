const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    date: {
        type: String,
        required : true,
    },
    duration: {
        type: Number,
        default: 30,

    },
    appointmentType: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true,
        trim : true
    },
    notes: {
        type: String,
        trim: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Appointments", appointmentSchema);