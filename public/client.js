const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');

let currentAiMessageElement = null;

const robotAvatarSVG = `<svg width="800px" height="800px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#ff9800" d="M13 5.2V4h-3V1H8.8v3H7.6V1H6.4v3H5.2V1H4v3H1v1.2h3v1.2H1v1.2h3v1.2H1V10h3v3h1.2v-3h1.2v3h1.2v-3h1.2v3H10v-3h3V8.8h-3V7.6h3V6.4h-3V5.2h3z"/><path fill="#4caf50" d="M2.2 3.4v7.2c0 .66.54 1.2 1.2 1.2h7.2c.66 0 1.2-.54 1.2-1.2V3.4c0-.66-.54-1.2-1.2-1.2H3.4c-.66 0-1.2.54-1.2 1.2z"/><path fill="#37474f" d="M9.1 9.1H4.9c-.33 0-.6-.27-.6-.6v-3c0-.33.27-.6.6-.6h4.2c.33 0 .6.27.6.6v3c0 .33-.27.6-.6.6z"/></svg>`;
function createMessageElement(sender, text = '') {
    const li = document.createElement('li');
    li.classList.add('message', `${sender}-message`);

    if (sender === 'ai') {
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        avatarDiv.innerHTML = robotAvatarSVG;
        li.appendChild(avatarDiv);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        messageContent.innerHTML = `
            <div class="thinking-container hidden">
                <div class="thinking-toggle">                    
                    <svg width="800px" height="800px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><title>artificial intelligence</title><path d="M106,27A23,23,0,1,0,62.45,37.33a18.45,18.45,0,0,0-9-2.33c-11,0-20,9.85-20,22a23.09,23.09,0,0,0,5.81,15.5A19.12,19.12,0,0,0,35,72c-12.7,0-23,12.54-23,28s10.3,28,23,28a19.12,19.12,0,0,0,4.31-.5A23.09,23.09,0,0,0,33.5,143c0,12.15,9,22,20,22a18.45,18.45,0,0,0,9-2.33A23,23,0,1,0,106,173c0-.34,0-0.67,0-1h0V28h0C106,27.67,106,27.34,106,27Z" fill="none" stroke="#220728" stroke-linejoin="bevel" stroke-width="8"/><path d="M67.26,189.26a23,23,0,0,0,32.53-32.53H86.9" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><path d="M66.26,10.74A23,23,0,0,1,98.79,43.26H87.67" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><polyline points="106 95 81 95 49.25 124.76" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><line x1="44.97" y1="86.65" x2="62.45" y2="111.44" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><line x1="62.45" y1="162.67" x2="74.5" y2="146" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><polyline points="62.45 37.49 71 51 71 71" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><line x1="152" y1="100" x2="104" y2="100" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><polyline points="107 131 131 131 143 152.67" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><polyline points="107 70 131 70 143 48.33" fill="none" stroke="#220728" stroke-miterlimit="10" stroke-width="8"/><circle cx="171" cy="100" r="16" fill="none" stroke="#ffc548" stroke-miterlimit="10" stroke-width="8"/><circle cx="149" cy="170" r="16" fill="none" stroke="#ffc548" stroke-miterlimit="10" stroke-width="8"/><circle cx="149" cy="30" r="16" fill="none" stroke="#ffc548" stroke-miterlimit="10" stroke-width="8"/></svg>
                      <span>Mostrar processo de pensamento</span>
                    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
                <div class="thinking-content hidden"></div>
            </div>
            <div class="answer-content"></div>
        `;
        li.appendChild(messageContent);
        
    } else {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;
        li.appendChild(contentDiv);
    }
    
    return li;
}

function addMessage(sender, text) {
    const messageElement = createMessageElement(sender, text);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        addMessage('user', input.value);
        socket.emit('chat message', input.value);
        input.value = '';
        statusContainer.classList.remove('hidden');
        statusText.textContent = 'Pensando...';
    }
});

messages.addEventListener('click', (e) => {
    const toggleButton = e.target.closest('.thinking-toggle');
    if (toggleButton) {
        const thinkingContainer = toggleButton.closest('.thinking-container');
        const thinkingContent = thinkingContainer.querySelector('.thinking-content');
        const toggleText = toggleButton.querySelector('span');

        thinkingContent.classList.toggle('hidden');

        if (thinkingContent.classList.contains('hidden')) {
            toggleText.textContent = 'Mostrar processo de pensamento';
            toggleButton.querySelector('.chevron').style.transform = 'rotate(0deg)';
        } else {
            toggleText.textContent = 'Ocultar processo de pensamento';
            toggleButton.querySelector('.chevron').style.transform = 'rotate(90deg)';
        }
    }
});

socket.on('status', (data) => {
    statusText.textContent = data.message;
});

socket.on('ai thinking chunk', (data) => {
    if (!currentAiMessageElement) {
        currentAiMessageElement = createMessageElement('ai');
        messages.appendChild(currentAiMessageElement);
    }
    const thinkingContainer = currentAiMessageElement.querySelector('.thinking-container');
    const thinkingContent = currentAiMessageElement.querySelector('.thinking-content');
    thinkingContainer.classList.remove('hidden');
    thinkingContent.classList.remove('hidden');
    
    const toggleButton = currentAiMessageElement.querySelector('.thinking-toggle');
    toggleButton.querySelector('span').textContent = 'Ocultar processo de pensamento';
    toggleButton.querySelector('.chevron').style.transform = 'rotate(90deg)';

    thinkingContent.textContent += data.chunk;
    messages.scrollTop = messages.scrollHeight;
});

socket.on('ai chunk', (data) => {
    if (!currentAiMessageElement) {
        currentAiMessageElement = createMessageElement('ai');
        messages.appendChild(currentAiMessageElement);
    }
    
    const thinkingContent = currentAiMessageElement.querySelector('.thinking-content');
    if (thinkingContent && !thinkingContent.classList.contains('hidden')) {
        const toggleButton = currentAiMessageElement.querySelector('.thinking-toggle');
        thinkingContent.classList.add('hidden');
        toggleButton.querySelector('span').textContent = 'Mostrar processo de pensamento';
        toggleButton.querySelector('.chevron').style.transform = 'rotate(0deg)';
    }

    currentAiMessageElement.querySelector('.answer-content').textContent += data.chunk;
    messages.scrollTop = messages.scrollHeight;
});

socket.on('ai end', () => {
    currentAiMessageElement = null;
    statusContainer.classList.add('hidden');
});

socket.on('error message', (msg) => {
    addMessage('ai', `Erro: ${msg}`);
    statusContainer.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const firstAiMessage = document.querySelector('.ai-message');
    if (firstAiMessage && !firstAiMessage.querySelector('.avatar')) {
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        avatarDiv.innerHTML = robotAvatarSVG;
        firstAiMessage.prepend(avatarDiv);
    }
});