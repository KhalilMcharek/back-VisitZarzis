const express = require ("express")
const app = express()
const mongoose = require ("mongoose")
const bookingRoutes = require('./routes/bookingRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbacksRoutes");
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
app.use(express.json());
app.use(cors({ 
  origin: "http://localhost:5173", // Allow frontend to access backend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
  credentials: true, // Allow cookies if needed
  allowedHeaders: "Content-Type, Authorization", // Allow these headers
}))
app.use('/api/admin', adminRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);

app.use('/api/dashboard', statisticsRoutes);
app.use('/api/notifications', notificationRoutes);



mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

  app.use((req, res, next) => {
    res.status(404).send({ message: "Ressource non trouvée" });
  });


  app.listen(process.env.port , ()=>{
    console.log('server run on http://localhost:'+process.env.PORT)
})

