const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes.js');
const courseRoutes = require("./routes/courseRoutes.js")
const studentRoutes = require("./routes/studentRoutes.js")
const teacherRoutes = require("./routes/teacherRoutes.js")
const enrollmentRoutes = require('./routes/enrollmentRoutes.js')
const attendanceRoutes = require('./routes/attendanceRoutes.js')
const uploadRoutes = require("./routes/uploadRoutes.js")
const lessonRoutes = require("./routes/lessonRoutes.js")


// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { startNotificationJob } = require('./jobs/classNotificationJob.js');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/students', studentRoutes)
app.use('/api/v1/teachers', teacherRoutes)
app.use('/api/v1/enrollment', enrollmentRoutes)
app.use('/api/v1/attendance', attendanceRoutes)
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/lesson', lessonRoutes)

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('/*splat',(req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}


startNotificationJob()

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.listen(port, () => console.log(`Server started on port ${port}`));
