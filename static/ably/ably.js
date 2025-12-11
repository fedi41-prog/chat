const Ably = require('ably');

async function publishSubscribe() {

  // Connect to Ably with your API key
  const ably = new Realtime("exK4Cg.2GWbDA:*******************************************")
  ably.connection.once("connected", () => {
    console.log("Connected to Ably!")
  })

  // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
  const channel = ably.channels.get("get-started")
  await channel.subscribe("first", (message) => {
    console.log("Message received: " + message.data)
  });

  // Publish a message with the name 'first' and the contents 'Here is my first message!'
  await channel.publish("first", "Here is my first message!")

  // Close the connection to Ably after a 5 second delay
  setTimeout(async () => {
    ably.connection.close();
      await ably.connection.once("closed", function () {
        console.log("Closed the connection to Ably.")
      });
  }, 5000);
}

//publishSubscribe();

let messageCounter = 1;

function addMessage(text) {
  const area = document.getElementById("messageArea");

   // Neues div erzeugen
   const msgDiv = document.createElement("div");
   msgDiv.className = "message";
   msgDiv.id = "message" + messageCounter;
   msgDiv.textContent = text;

    // Anhängen
   area.appendChild(msgDiv);
   messageCounter++;  
}

// Beispiel
addMessage("Hallo Welt!");
addMessage("Zweite Nachricht!");