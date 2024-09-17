const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// เชื่อมต่อ MongoDB Atlas
const dbURI = 'mongodb+srv://rattanunforwork:new123456@cluster0.s38jb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // เปลี่ยนเป็น MongoDB Atlas connection string ของคุณ
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

// Middleware
app.use(express.json()); // สำหรับการ parse JSON request body

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
