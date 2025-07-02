import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const model = 'deepseek-r1:8b' // Certifique-se que seu modelo suporta o formato <think>

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/treino', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'treino.html'));
});

let ragChain;

async function setupRAG() {
    console.log("Iniciando ou atualizando a configuração do RAG...");

    const ollama = new Ollama({ model: model, baseUrl: "http://localhost:11434" });
    const embeddings = new OllamaEmbeddings({ model: model, baseUrl: "http://localhost:11434" });

    const text = fs.readFileSync("data.txt", "utf-8");
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const splits = await textSplitter.createDocuments([text]);

    const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
    console.log("Banco de dados vetorial recriado com sucesso.");

    const retriever = vectorStore.asRetriever();
    const prompt = PromptTemplate.fromTemplate(
        `Primeiro, pense passo a passo sobre a pergunta do usuário dentro de tags <think></think>. Analise o contexto, o que o usuário quer, e como você vai formular a resposta.
Depois de pensar, responda à pergunta do usuário de forma clara e concisa, utilizando apenas as informações do contexto abaixo.
Se a resposta não estiver no contexto, diga "Não encontrei essa informação nos meus dados".

CONTEXTO:
{context}

PERGUNTA:
{question}`
    );


    ragChain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
        },
        prompt,
        ollama,
        new StringOutputParser(),
    ]);

    console.log("✅ Configuração do RAG concluída.");
}

io.on('connection', (socket) => {
    console.log('Um usuário se conectou via WebSocket');

    socket.on('chat message', async (msg) => {
        if (!ragChain) {
            return socket.emit('error message', 'A IA não está pronta. Tente novamente.');
        }

        console.log(`Recebida a pergunta: "${msg}"`);
        socket.emit('status', { message: 'Pesquisando na base de dados...' });

        try {
            const stream = await ragChain.stream(msg);

            let buffer = '';
            let inThinkBlock = false;
            let thinkBlockClosed = false;

            socket.emit('status', { message: 'Gerando resposta...' });

            for await (const chunk of stream) {
                buffer += chunk;

                if (!inThinkBlock && buffer.includes('<think>')) {
                    inThinkBlock = true;
                    const beforeThink = buffer.substring(0, buffer.indexOf('<think>'));
                    if (beforeThink.trim()) {
                         socket.emit('ai chunk', { chunk: beforeThink.trimStart() });
                    }
                    buffer = buffer.substring(buffer.indexOf('<think>') + '<think>'.length);
                }
                
                if (inThinkBlock && !thinkBlockClosed) {
                    if (buffer.includes('</think>')) {
                        const thinkContent = buffer.substring(0, buffer.indexOf('</think>'));
                        socket.emit('ai thinking chunk', { chunk: thinkContent });
                        
                        buffer = buffer.substring(buffer.indexOf('</think>') + '</think>'.length);
                        inThinkBlock = false;
                        thinkBlockClosed = true;

                         if (buffer.trim()) {
                            socket.emit('ai chunk', { chunk: buffer.trimStart() });
                         }

                    } else {
                        socket.emit('ai thinking chunk', { chunk: buffer });
                        buffer = '';
                    }
                } else if (thinkBlockClosed) {
                    socket.emit('ai chunk', { chunk: chunk });
                }
            }
            socket.emit('ai end');

        } catch (error) {
            console.error("Erro durante o stream:", error);
            socket.emit('error message', 'Ocorreu um erro ao gerar a resposta.');
        }
    });

    socket.on('add training text', async (text) => {
        if (!text || text.trim() === '') {
            return socket.emit('training status', { message: 'Erro: O texto não pode estar vazio.', error: true });
        }
        try {
            socket.emit('training status', { message: 'Recebido. Adicionando ao arquivo de conhecimento...' });
            
            fs.appendFileSync("data.txt", `\n\n${text}`);

            socket.emit('training status', { message: `Informação adicionada. Atualizando a base de conhecimento...` });
            
            await setupRAG();

            socket.emit('training status', { message: 'Sucesso! A base de conhecimento foi atualizada.', success: true });

        } catch (error) {
            console.error('Erro durante o treinamento:', error);
            socket.emit('training status', { message: 'Ocorreu um erro ao atualizar a base de conhecimento.', error: true });
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});


// --- INICIA O SERVIDOR ---
server.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    await setupRAG();
});