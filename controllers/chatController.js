module.exports = io => { // export chat controller contents
  io.on("connection", client => { // listen for new connections
    console.log('new connection');

    client.on("disconnect", () => { // listen for user disconnects
      console.log("user disconnected");
    });

    client.on("message", (data) => { // list for a custom message event
      let messageAttributes = {
        content: data.content,
        userName: data.userName,
        user: data.userId
      }
      io.emit("message", messageAttributes); // broadcast message
    });
  });
}