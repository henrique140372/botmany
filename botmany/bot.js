require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Configurações
const GROUP_ID = process.env.GROUP_ID; // ID do grupo
const DELETE_AFTER = 60 * 60 * 1000; // Tempo para deletar mensagens (1 hora)

// Mensagens para divulgação
const mensagens = [
    "🚀 Conheça a plataforma *TT77Bet* e ganhe bônus incríveis! 🔥\n🔗 [Acesse aqui](https://tt77bet.com)",
    "💰 Invista na *Armih Space* e faça seu dinheiro crescer! 🚀\n🔗 [Saiba mais](https://armihspace.com)",
];

let mensagensEnviadas = [];

// Função para postar e deletar depois de um tempo
function postarMensagem() {
    mensagens.forEach(async (mensagem) => {
        try {
            const msg = await bot.sendMessage(GROUP_ID, mensagem, { parse_mode: "Markdown" });
            mensagensEnviadas.push(msg.message_id);

            // Apagar mensagem após o tempo definido
            setTimeout(() => {
                bot.deleteMessage(GROUP_ID, msg.message_id).catch(console.error);
            }, DELETE_AFTER);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    });
}

// Comando para forçar postagem manual
bot.onText(/\/divulgar/, (msg) => {
    if (msg.chat.id == GROUP_ID) {
        postarMensagem();
        bot.sendMessage(GROUP_ID, "📢 Divulgação enviada!");
    }
});

// Moderação básica: remover mensagens proibidas
const palavrasProibidas = ["spam", "fake", "golpe", "fraude"];

bot.on("message", async (msg) => {
    const { text, message_id, chat } = msg;

    if (chat.id == GROUP_ID && text) {
        if (palavrasProibidas.some(palavra => text.toLowerCase().includes(palavra))) {
            await bot.deleteMessage(chat.id, message_id);
            await bot.sendMessage(chat.id, `🚫 Mensagem removida. Evite usar palavras proibidas!`);
        }
    }
});

// Inicia o loop de postagens automáticas a cada X minutos
setInterval(postarMensagem, 2 * 60 * 60 * 1000); // A cada 2 horas

console.log("🤖 Bot de Divulgação Iniciado!");