import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import path from 'path';
const __dirname = path.resolve();

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));  
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // localhost:3000/~~~#@$@# 모든 url은 "/"로 redirect


const handleListen = () => console.log(`Listening in http://localhost:3000`);

const server = http.createServer(app); //http로 서버를 돌릴 수 있고
const wss = new WebSocketServer({ server }); //ws로 서버를 돌릴 수 있다. 

function onSocketClose() {
    console.log("Disconnected from the Browser");
}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", onSocketClose); 
       
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                );
                break;
            case "nickname":
                console.log("got the nickname : ", message.payload )
                socket["nickname"] = message.payload;
                break;
        }
    });
});


server.listen(3000, handleListen);


