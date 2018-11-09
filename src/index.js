'use strict';

import 'babel-core/register';
import 'babel-polyfill';
import './styles/style.scss';

var username = '';
var password = '';
const IPFS = require('ipfs');
const PUBSUB_CHANNEL = 'client-ipfs-b25';
const ipfsRepo = '/ipfs-chat';
const ipfsOptions = {
  repo: ipfsRepo,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Bootstrap: [
      "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
      "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
      "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
      "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
      "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
      "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
    ],
    Addresses: {
      Swarm: [
        '/dns4/libp2p-signaling.herokuapp.com/tcp/443/wss/p2p-websocket-star/'
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/'
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
};
window.node = new IPFS(ipfsOptions);
window.node.on('error', e => console.error('[🔥 Storage node error] => ', e));
window.node.once('ready', async () => {
  console.warn('ready! ');
  window.node.pubsub.subscribe(PUBSUB_CHANNEL, (encodedMsg) => {
    const data = JSON.parse(encodedMsg.data.toString());
    if (data.ev === 'message') {
      renderMsg(data);
    } else if (data.ev === 'prevMessage') {
      if (!!data.msgs.length) {
        for (var i = 0; i < data.msgs.length; i++) {
          renderMsg(data.msgs[i])
        }
      }
    }
  });
});

window.send = () => {
  const msg = {
    ev: 'message',
    user: username,
    value: document.getElementById("exampleMessage").value
  }
  const msgEncoded = window.node.types.Buffer.from(JSON.stringify(msg));
  window.node.pubsub.publish(PUBSUB_CHANNEL, msgEncoded);
  document.getElementById("exampleMessage").value = '';
}

function getAllMessage() {
  const msg = {
    ev: 'getAllMessage',
    user: username
  }
  const msgEncoded = window.node.types.Buffer.from(JSON.stringify(msg));
  window.node.pubsub.publish(PUBSUB_CHANNEL, msgEncoded);
  console.warn('getAllMessage');
}

function renderMsg(msg) {
  var div = document.getElementById('content');
  div.innerHTML += msg.user + ' :: ' + msg.value + "<br />";
}

window.login = () => {
  username = document.getElementById('email').value;
  document.getElementById('username').innerHTML = username;
  document.getElementById('login').style.display = 'none';
  document.getElementById('content-wrapper').style.display = 'block';
  getAllMessage();
}

window.addEventListener("load", () => {
  console.warn('loaded');
});

module.hot.accept();