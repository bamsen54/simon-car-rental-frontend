function showMessage(type, text) {
    const area = document.getElementById('message-area');
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.textContent = text;
    area.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

document.getElementById('msg-success').onclick = () => showMessage('success', 'success');
document.getElementById('msg-warning').onclick = () => showMessage('warning', 'warning');