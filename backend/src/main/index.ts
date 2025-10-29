import express from "express";
import cors from "cors";
import auth from "./Auth";
import adminData from "../admin/AdminData";

const app = express();
const PORT = 3000;

app.use(cors({ 
    origin: "http://localhost:5173",  
    credentials: true 
}));
 
app.use(express.json()); 
app.use("/api", auth); 
app.use("/api", adminData); 

app.get("/", (req: express.Request, res: express.Response) => {
    console.log("success");
    res.status(200).json({ message: "success" });
});

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
});