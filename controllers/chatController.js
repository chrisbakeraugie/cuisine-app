module.exports = io => { // export chat controller contents
  io.on("connection", client => { // listen for new connections
    console.log('new connection');

    client.on("disconnect", () => { // listen for user disconnects
      console.log("user disconnected");
    });

    client.on("message", () => { // list for a custom message event
      io.emit("message", { // broadcast message
        content: "Hello"
      });
    });
  });
}