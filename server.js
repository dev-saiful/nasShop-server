import http from "http";
import "dotenv/config";
import { dbConnect } from "./config/dbConfig.js";
import {app} from "./app.js";
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const  startServer = async()=>
{
    await dbConnect();
    server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
    });
}

startServer();
