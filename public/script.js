const socket = io();
let peer;

function handleShare() {
  const file = document.getElementById('uploadInput').files[0];
  const method = document.querySelector('input[name="shareMethod"]:checked').value;

  if (!file) return alert("Please select a file");

  if (method === 'cloud') {
    uploadViaCloud(file);
  } else {
    shareViaP2P(file);
  }
}

function uploadViaCloud(file) {
  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("codeBox");
    if (box) box.innerText = "🌐 Share code: " + data.code;
  })
  .catch(err => alert("Upload failed: " + err));
}

function shareViaP2P(file) {
  peer = new RTCPeerConnection();
  const channel = peer.createDataChannel("file");

  channel.onopen = () => {
    channel.send(file.name);
    channel.send(file);
    alert("📡 File sent over Wi-Fi!");
  };

  peer.onicecandidate = (e) => {
    if (e.candidate) socket.emit("ice-candidate", e.candidate);
  };

  peer.createOffer()
    .then(offer => {
      peer.setLocalDescription(offer);
      socket.emit("offer", offer);
    });

  socket.on("answer", answer => {
    peer.setRemoteDescription(answer);
  });

  socket.on("ice-candidate", candidate => {
    peer.addIceCandidate(new RTCIceCandidate(candidate));
  });

  document.getElementById("codeBox").innerText = "📶 Waiting for peer to connect...";
}

function downloadFile() {
  const code = document.getElementById('downloadCode').value;
  if (!code) return alert("Please enter a code");

  window.location.href = `/download/${code}`;
}
