function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}


async function setupAbly() {
    const realtimeClient = new Ably.Realtime({
        key: 'exK4Cg.m4VhmA:GDez8Ium7MNITXQ0MonMuwiVdC5TluhFbsDkem40itU',
        clientId: 'User' + Math.floor(Math.random() * 100000)
    });
    await realtimeClient.connection.once('connected');

    const channel = realtimeClient.channels.get(getUrlParam('channel') || 'global-chat');
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


setupAbly();

//publishSubscribe();

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
