'use strict';

import 'babel-core/register';
import 'babel-polyfill';
import './styles/style.scss';

const USERNAME = 'User' + Math.floor((Math.random() * 256) + 1);
const IPFS = require('ipfs');
const PUBSUB_CHANNEL = 'client-ipfs-b25';
const ipfsRepo = '/ipfs-chat';
const ipfsOptions = {
  repo: ipfsRepo,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/libp2p-signaling.herokuapp.com/tcp/443/wss/p2p-websocket-star/'
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
    console.warn('msg! ', data);
    var div = document.getElementById('content');
    div.innerHTML += data.user + ' :: ' + data.value + "<br />";
  });
});

window.send = () => {
  const msg = {
    ev: 'message',
    user: USERNAME,
    value: document.getElementById("exampleMessage").value
  }
  const msgEncoded = node.types.Buffer.from(JSON.stringify(msg));
  window.node.pubsub.publish(PUBSUB_CHANNEL, msgEncoded);
  document.getElementById("exampleMessage").value = '';
}

window.addEventListener("load", () => {
  document.getElementById('username').innerHTML = USERNAME;
});

module.hot.accept();