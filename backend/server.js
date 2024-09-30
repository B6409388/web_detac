const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// // เชื่อมต่อ MongoDB Atlas โดยใช้ Environment Variable
 //const dbURI = process.env.DB_URL || "mongodb://localhost:27017/myDatabase"; // ใช้ DB_URL จาก Environment Variables

// เชื่อมต่อ MongoDB Atlas ----------------

 const dbURI = "mongodb+srv://beamy:beamy123456@cluster0.s38jb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // ใช้ข้อมูลจา�� MongoDB Atlas

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ตัวอย่าง Route
app.use("/api/data", require("./routes/licentplate"));

// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error-handling middleware (จัดการข้อผิดพลาด)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Something went wrong!", error: err.message });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
