async function setupAbly() {
    const realtimeClient = new Ably.Realtime({
        key: 'HBc1Qw.EUDr4Q:4EjI-Zkt67PAu_OtlpxuvUvuPZ6Gt60Gs1-6SrU1-ss',
        clientId: 'anonymos-user-' + Math.floor(Math.random() * 100000)
    });
    await realtimeClient.connection.once('connected');

    const channel = realtimeClient.channels.get('my-first-channel');
    addMessage('LOG', 'Made my first connection!');

    await channel.subscribe((message) => {
        addMessage(message.clientId, message.data);
    });

    button = document.getElementById("send-button");
    button.addEventListener("click", () => {
        const inputField = document.getElementById("message-input");
        const messageText = inputField.value;
        channel.publish('message', messageText);
        inputField.value = "";
    })
}


setupAbly();

//publishSubscribe();

let messageCounter = 1;

function addMessage(heading, text) {
    const area = document.getElementById("messageArea");

    // Neues div erzeugen
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.id = "message" + messageCounter;

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

// Beispiel
addMessage("LOG", "Hallo Welt!");
addMessage("LOG", "Zweite Nachricht!");