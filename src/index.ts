import express from "express";
import userRoutes from "../routes/user.routes"; 

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use("/user",userRoutes)

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: `Server is up and runnig at PORT ${PORT}`,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
