# ChatLLM: Local Document Chat with Ollama & LangChain.js

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs) ![LangChain](https://img.shields.io/badge/LangChain-LangChain-f89a34?style=for-the-badge) ![Ollama](https://img.shields.io/badge/Ollama-Ollama-232f3e?style=for-the-badge) ![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express) ![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socketdotio) ![License](https://img.shields.io/github/license/seu-usuario/Local-LLM-Interface?style=for-the-badge)

<br>

<details>
<summary>🇧🇷 <strong>Leia em Português</strong></summary>

## ChatLLM: Chat Local com Documentos via Ollama

Uma aplicação full-stack de **RAG (Retrieval-Augmented Generation)**, privada e offline-first. Este projeto fornece um framework completo para conversar com seus próprios documentos usando o poder de LLMs locais através do **Ollama**, com uma interface web profissional e interativa construída em Node.js.

### ✨ Funcionalidades

- **100% Privado e Local**: Seus documentos e suas conversas nunca saem da sua máquina ou servidor. Toda a inteligência é processada localmente pelo Ollama.
- **Pipeline RAG com LangChain.js**: Utiliza as melhores práticas de RAG para encontrar o contexto relevante nos seus documentos e fornecer respostas precisas.
- **Interface de Chat Moderna**: UI limpa e responsiva com respostas em tempo real para uma experiência de usuário fluida.
- **Atualização Dinâmica**: Adicione novos conhecimentos à IA através de uma página web dedicada, sem precisar reiniciar o servidor manualmente.

### 🚀 Começando

#### Pré-requisitos

- **Node.js**: Versão LTS 20.x ou superior.
- **Ollama**: É necessário ter o [Ollama](https://ollama.com/) instalado e em execução.
- **Modelo de IA Baixado**: Você precisa ter o modelo desejado baixado via Ollama. Este projeto foi testado com `deepseek-r1:8b`.
  ```bash
  ollama pull deepseek-r1:8b
  ```

#### Instalação

1.  **Clone o Repositório**:
    ```bash
    git clone https://github.com/BrunoLoPaiva/Local-LLM-Interface.git
    cd Local-LLM-Interface
    ```
2.  **Instale as Dependências**:
    ```bash
    npm install
    ```
3.  **Adicione sua Base de Conhecimento**:
    - Crie um arquivo chamado `data.txt` na raiz do projeto.
    - Coloque seus dados dentro deste arquivo.

#### Executando a Aplicação

1.  **Inicie os Servidores**:
    ```bash
    npm run dev
    ```
    _(Este comando iniciará o servidor do Ollama e o servidor da aplicação em paralelo)._
2.  **Acesse a Interface**:
    Abra seu navegador e acesse `http://localhost:3000`.

</details>

---

A full-stack, private, and offline-first **RAG (Retrieval-Augmented Generation)** application. This project provides a complete framework to chat with your own documents using the power of local LLMs through **Ollama**, with a professional and real-time web interface built on Node.js.

![Demo GIF of the chat interface](https://github.com/BrunoLoPaiva/Local-LLM-Interface/blob/main/LocalLLM.gif?raw=true)

## ✨ Features

- **100% Private & Local**: Your documents and conversations never leave your machine or server. All intelligence is processed locally by Ollama.
- **RAG Pipeline with LangChain.js**: Utilizes RAG best practices to find relevant context in your documents and provide accurate, fact-based answers.
- **Modern Chat UI**: A clean, responsive user interface with real-time streaming responses for a fluid user experience.
- **Dynamic Training**: Add new knowledge to the AI on the fly through a dedicated web page without manually restarting the server.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Socket.IO, LangChain.js
- **AI Engine**: Ollama
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js**: LTS version 20.x or higher is recommended.
- **Ollama**: You must have [Ollama](https://ollama.com/) installed and running.
- **Downloaded AI Model**: You need to have the desired model pulled via Ollama. This project has been configured and tested with `deepseek-r1:8b`.

  Run this command in your terminal to download the model:

  ```bash
  ollama pull deepseek-r1:8b
  ```

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/BrunoLoPaiva/Local-LLM-Interface.git
    cd Local-LLM-Interface
    ```

2.  **Install NPM Packages**

    ```bash
    npm install
    ```

3.  **Add Your Knowledge Base**
    - In the project's root directory, create a file named `data.txt`.
    - Place all your documents data inside this file.

### Running the Application

1.  **Start the Servers**
    This project uses `concurrently` to start both the Ollama server (if not already running) and the application server with a single command.

    ```bash
    npm run dev
    ```

    You will see interleaved logs from both processes in your terminal. Wait for the message: `✅ --- IA Pronta e Servidor Online! ---`

2.  **Access the UI**
    Open your browser and navigate to:
    `http://localhost:3000`

## ⚙️ How to Use

- **Chat**: The main page (`/`) is the chat interface for asking questions.
- **Training**: Navigate to the `/treino` page (a link is available in the chat UI's corner) to paste or type new text and permanently add it to the AI's knowledge base.

## 🔧 Customization

It's easy to adapt the project to your needs.

### Changing the AI Model

You can use any instruction-following model compatible with Ollama. To change it, simply edit the model name in `server.js`, inside the `LocalGenerativeModel` class:

```javascript
// inside server.js
class LocalGenerativeModel extends LLM {
  // ...
  async _call(prompt, _options) {
    if (!this.pipeline) {
      // ...
      // Change the model name here:
      this.pipeline = await pipeline(
        "text-generation",
        "your-other-ollama-model"
      );
      // ...
    }
    // ...
  }
}
```

Remember to pull the new model with `ollama pull your-other-ollama-model` before starting the server.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Contact

Bruno Paiva - [[Bruno Lopes de Paiva](https://www.linkedin.com/in/bruno-lopes-de-paiva-a35ab4198/)] - brunolopesdepaiva@gmail.com

Project Link: [https://github.com/BrunoLoPaiva/Local-LLM-Interface](https://github.com/BrunoLoPaiva/Local-LLM-Interface)
