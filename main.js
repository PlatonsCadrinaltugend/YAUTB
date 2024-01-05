const oAuth = "4t7aw76j9ry5oy4v7t1cahxukhx5bm";
const nick = `njdagdoiad`;
const channels = ["deadcr1", "yautb"];

Object.assign(global, { WebSocket: require('ws') });
const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
socket.addEventListener('open', ()=>{
    socket.send(`PASS oauth:${oAuth}`);
    socket.send(`NICK ${nick}`);
    for (var channel of channels){
        socket.send(`JOIN #${channel}`);
        console.log(`Joined ${channel}`);
        socket.send(`PRIVMSG #${channel} :kok`);
    }

})


socket.addEventListener('message', event => {
    if (socket.readyState === WebSocket.OPEN) {
        console.log(event.data);
        if (event.data.includes("kok")) {
            for (var channel of channels){
                if (event.data.includes("#" + channel)){
                    socket.send(`PRIVMSG #${channel} :kok`);
                }
            }
        }
        if (event.data.includes("ppPoof") && event.data.includes("deadcr1!deadcr1@deadcr1") && event.data.includes("kok") && event.data.includes("#yautb") && !event.data.includes("streamelements!streamelements@streamelements")){
            socket.close();
        }
    }
  
      // Respond to PING requests
    if (event.data.includes("PING")) {
        socket.send("PONG");
      }
    });


  socket.addEventListener('error', error => {
    console.error('WebSocket error:', error);
  });

  socket.addEventListener('close', event => {
    for (var channel of channels){
        socket.send(`PRIVMSG #${channel} :ppPoof`)
    }
    console.log('WebSocket closed:', event);
  });