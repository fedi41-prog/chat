function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkHasName() {
  let user = getCookie("username");
  if (user != "") {
    console.log("user logged in again: " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
      console.log("New user set: " + user);
    } else {
      alert("No name entered. Using 'Guest' as your name.");
      setCookie("username", "Guest" + Math.floor(Math.random() * 100000), 1);
    }
  }
}

async function setup() {
    checkHasName();
    const realtimeClient = new Ably.Realtime({
        key: 'exK4Cg.m4VhmA:GDez8Ium7MNITXQ0MonMuwiVdC5TluhFbsDkem40itU',
        clientId: getCookie("username")
    });
    await realtimeClient.connection.once('connected');

    const channel = realtimeClient.channels.get(getUrlParam('channel') || 'global-chat');
    const history = await channel.history();
    for (let msg of history.items) {
        isMyMessage = msg.clientId === realtimeClient.auth.clientId;
        messageType = isMyMessage ? "my-message" : "normal";
        addMessage(msg.clientId, msg.data, messageType);
    }
    
    addMessage('LOG', 'CONNECTED as ' + realtimeClient.auth.clientId);



    await channel.subscribe((message) => {
        isMyMessage = message.clientId === realtimeClient.auth.clientId;
        messageType = isMyMessage ? "my-message" : "normal";
        addMessage(message.clientId, message.data, messageType);
    });

    button = document.getElementById("send-button");
    button.addEventListener("click", () => {
        const inputField = document.getElementById("message-input");
        const messageText = inputField.value;
        if (messageText.trim() === "") {
            return; // Leere Nachrichten nicht senden
        }
        channel.publish('message', messageText);
        inputField.value = "";
    })
}


setup();


//View messages ->
let messageCounter = 1;

function addMessage(heading, text, messageType="normal") {
    const area = document.getElementById("messageArea");

    // Neues div erzeugen
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.id = "message" + messageCounter;
    msgDiv.dataset.type = messageType;

    const msgText = document.createElement("span");
    msgText.className = "message-text";
    msgText.textContent = text;
   
    const msHeader = document.createElement("h3");
    msHeader.textContent = heading;
    msHeader.className = "message-header";

    // Anhängen
    msgDiv.appendChild(msHeader);
    msgDiv.appendChild(msgText);

    area.appendChild(msgDiv);
    messageCounter++;  
}
