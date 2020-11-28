const Message = require('../models/message');

module.exports = io => { // export chat controller contents
  io.on("connection", client => { // listen for new connections
    console.log('new connection');

    Message.find({})
    .sort({createdAt: -1}) // Sort in descending order
    .limit(100)
    .then(messages => {
      client.emit("load all messages", messages.reverse());
    })

    client.on("disconnect", () => { // listen for user disconnects
      client.broadcast.emit("user disconnected"); // Broadcast to ALL other connected sockets
      // We are broadcasting (instead of emitting) because the client that's emitting the message is 
      // disconnected and can no longer handle that custom event
      console.log("user disconnected");
    });

    client.on("message", (data) => { // list for a custom message event
      let messageAttributes = {
        content: data.content,
        userName: data.userName,
        user: data.userId
      }
      let m = new Message(messageAttributes);
      m.save().then(() => {
        io.emit("message", messageAttributes); // broadcast message
      }).catch(error => console.log(error));

    });
  });
}