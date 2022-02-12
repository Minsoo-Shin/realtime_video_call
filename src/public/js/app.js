const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
// console.log(nickForm);
console.log(messageList);
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server");
};

function handleClose() {
    console.log("Disconnect from Server");
};

socket.addEventListener("open", handleOpen);
socket.addEventListener("close", handleClose);
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

function handleSubmit(event) {
    event.preventDefault(); //event에 따라서 따로 동작을 막아주는 함수다. 
    console.log("handlesubmit");
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    console.log(li);
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    console.log("handleNick");
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    console.log("send nickname from browser")
    input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
