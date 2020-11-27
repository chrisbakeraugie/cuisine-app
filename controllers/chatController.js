const Message = require('../models/message');

module.exports = io => { // export chat controller contents
  io.on("connection", client => { // listen for new connections
    console.log('new connection');

    Message.find({})
    .sort({createdAt: -1}) // Sort in descending order
    .limit(10)
    .then(messages => {
      client.emit("load all messages", messages.reverse());
    })

    client.on("disconnect", () => { // listen for user disconnects
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