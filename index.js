import express from "express";
import userRoute from "./routes/userRoutes.js"
import dbConnection from "./db/conn.js";

const app = express();
const port = 4000;
dbConnection()
app.use(express.json());
app.use("/api/v1/user" ,userRoute)

app.get("/", (req, res) => {
  res.send("hello welcome to my personal api server");
});
app.listen(port, () => {
  console.log(`server is listening on port http://localhost:${port}`);
});
