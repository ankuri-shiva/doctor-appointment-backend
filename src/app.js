const express = require('express');
const connectDB = require('./config/database');
const Doctor = require("./models/doctors.js");
const Appointments = require("./models/appointments.js");
const User = require("./models/user.js");
const app = express();
app.use(express.json());

const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const port = 7000;


// signup user
app.post("/signup", async(req, res) => {
    try {
        const {userName, email, password} = req.body;
 
           //creating the new instance of the user model
           const user =  new User({
            userName, email, password
           });

           // adding new user to the database
            const savedUser = await user.save();
            res.json({message : "user added successfully", data : savedUser});
    } catch(err) {
        res.status(400).send("Error " + err.message);
    }
 });

 //login 

 app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
    
        const user = await User.findOne({ email: email });        
        if(!user) {
            throw new Error("Invalid credintials");
        };

        if(user.password === password){
            res.json({message:"Login in successfully", data: user});
        }else{
            throw new Error("Invalid Credintials");
        };
        
    }catch(err) {
        res.status(400).send("Error " + err.message);
    }
    
});

//add doctor to database
app.post("/doctor", async(req, res) => {
    try{
        const {name, specialization} = req.body;
        

        // validating request body
        if (!name || !specialization) {
            return res.status(400).json({ error: "Name and specialization are required" });
        }

        // creating new doctor
        const doctor = new Doctor({name,specialization});

        // saving doctor to database
       const newDoctor =  await doctor.save()
        res.json({message : "Doctor added successfully", data:newDoctor});

    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});

//get all doctors
app.get("/doctors", async(req, res) => {
    try{
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});

//get a doctor by id
app.get("/doctors/:_id", async(req, res) => {
    try{
        const doctorId = req.params._id;
        const doctor = await Doctor.findById(doctorId);
        res.json(doctor);
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});


const computeTheAvailableSlots = async (doctorId, date) => {
    try {
        // get the doctor from the database
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found")
        }

        // get the working hours 
        if (!doctor.workingHours || !doctor.workingHours.start || !doctor.workingHours.end) {
            throw new Error("Working hours not are available")
        }
        const { start, end } = doctor.workingHours;

        const availableSlots = []
        const now = new Date();
        //now.setMinutes(now.getMinutes() + 30);  

        // Setting start time to working hours
        const currentDate = new Date(date);
        currentDate.setHours(parseInt(start.split(":")[0], 10));
        currentDate.setMinutes(parseInt(start.split(":")[1], 10));

        // Setting  end time to working hours
        const endTime = new Date(date);
        endTime.setHours(parseInt(end.split(":")[0], 10));
        endTime.setMinutes(parseInt(end.split(":")[1], 10));

        // available slots in 30-minutes
        while (currentDate < endTime) {
            if (currentDate >= now) {  
                const formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                availableSlots.push({
                    dateTime: new Date(currentDate), 
                    time: formattedTime 
                });
            }

            // Increment by 30 minutes
            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        return availableSlots;
    } catch (error) {
        console.error("Error computing slots:" + error.message);
        return [];
    }
};


app.get("/doctors/:_id/slots", async(req, res) => {
    try{
        const doctorId = req.params._id;
        const date = req.query.date;
        const availableSlots = await computeTheAvailableSlots(doctorId, date);
        res.json(availableSlots);
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});
    
//post an appointment

app.post("/appointment", async(req, res) => {
    try{
        const {doctorId, date, appointmentType, patientName} = req.body;

        // validating request body
        if (!doctorId || !appointmentType || !patientName  || !date) {
            return res.status(400).json({ error: "doctorId, appointmentType, patientName and date are required" });
        }

        // creating an instance of an appointment
        const appointment = new Appointments({doctorId, date, appointmentType, patientName});

        // saving an appointment to database
       const newAppointment =  await appointment.save()
        res.json({message : "Appointment added successfully", data:newAppointment});

    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }

});

//get all appointments
app.get("/appointments", async(req, res) => {
    try{
        const appointments = await Appointments.find();
        res.json(appointments);
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});

//get an appointment by id 
app.get("/appointments/:_id", async(req, res) => {
    try{
        const appointmentId = req.params._id;
        const appointment = await Appointments.findById(appointmentId);
        res.json(appointment);
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});

//delete an appointment by id

app.delete("/appointments/:_id", async(req, res) => {
    try{
        const appointmentId = req.params._id;
        await Appointments.findByIdAndDelete(appointmentId);
        res.json({message: "Appointment deleted successfully"});
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});

//update an appointment by id

app.put("/appointments/:_id", async(req, res) => {
    try{
        const appointmentId = req.params._id;
        const {doctorId, appointmentType, patientName, date} = req.body;
        const appointment = await Appointments.findById(appointmentId);
        if(doctorId) {
            appointment.doctorId = doctorId;
        }
        if(appointmentType) {
            appointment.appointmentType = appointmentType;
        }
        if(patientName) {
            appointment.patientName = patientName;
        }
        if(date){
            appointment.date = date;
        }
        await appointment.save();
        res.json({message: "Appointment updated successfully"});
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
});



connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.error("Database connection failed"  + err);
});
