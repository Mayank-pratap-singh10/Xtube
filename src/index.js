import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";
import app from "./app.js";




connectDB()
.then(() => {
    console.log("Database connected successfully");
})
.catch((error) => {
    console.error("Database connection failed:", error);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


