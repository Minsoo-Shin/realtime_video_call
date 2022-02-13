const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

// function backendDone(msg) {
//     console.log(`The backend says: `, msg);
// }

room.hidden = true;
let roomName;

function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    console.log(input.value);
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=> {
        console.log(input.value);
        addMessage(`You: ${value}`); //바로 input.value를 사용하면 왜 아무값도 없는거지?
    });
    input.value="";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    console.log("handleRoomSubmit");
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
    input.value="";
};

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    console.log("handleRoomSubmit");
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined!`)
});

socket.on("bye", (user, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} left ㅠㅠ`);
});

socket.on("new_message", addMessage);