function uploadFile() {
  const file = document.getElementById('uploadInput').files[0];
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("codeBox").innerText = "Your code: " + data.code;
    });
}

function downloadFile() {
  const code = document.getElementById('downloadCode').value;
  if (!code) return alert("Enter a code");

  window.location.href = `/download/${code}`;
}
