import express from "express";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: `Server is up and runnig at PORT ${PORT}`,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
