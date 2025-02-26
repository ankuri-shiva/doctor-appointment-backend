const  mongoose  = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            minLength: 3,
            maxLength: 55,
            required: true,
        },
        email: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email format: " + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Invalid password.");
                }
            },
        },
    },
    {
        timestamps: true, // Fixed typo
    }
);

module.exports = mongoose.model("User", userSchema);
