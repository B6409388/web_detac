const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// เชื่อมต่อ MongoDB Atlas
const dbURI =
  "mongodb+srv://rattanunforwork:new123456@cluster0.s38jb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbURI) 
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // เพิ่มขนาด limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json()); // สำหรับการ parse JSON request body

// ตัวอย่าง Route
app.use("/api/data", require("./routes/licentplate"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
