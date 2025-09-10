import express from "express";
import userRoutes from "../routes/user.routes";
import urlRouters from "../routes/url.routes";
import { authMiddleware } from "../middlewares/auth.middleware";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authMiddleware);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: `Server is up and runnig at PORT ${PORT}`,
  });
});
app.use("/url", urlRouters);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
