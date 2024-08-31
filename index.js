const { Telegraf, Markup, session } = require('telegraf');
const express = require("express");
const web = express();

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const bot = new Telegraf('7342606736:AAEFfDFGlsiLlir3chArPJGmASvrW_m_0Yw');

// Подключение middleware для сессий
bot.use(session());

// Middleware для инициализации сессии
bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    return next();
});

bot.start((ctx) => {
    ctx.reply(
        'Добро пожаловать на тех поддержку 2024 MAX Games! Выберите, по какой игре вы хотели бы обратиться:',
        Markup.inlineKeyboard([
            [Markup.button.callback('MPOS', 'MPOS_GAME')],
            [Markup.button.callback('MPUS', 'MPUS_GAME')],
            [Markup.button.callback('PiuTown', 'PIUTOWN_GAME')],
            [Markup.button.callback('Mixi Click', 'MC_APP')],
        ])
    );
});

const gameOptions = Markup.inlineKeyboard([
    [Markup.button.callback('БАГ', 'BUG')],
    [Markup.button.callback('ИДЕЯ', 'IDEA')],
]);

bot.action('MPOS_GAME', (ctx) => {
    ctx.session.selectedGame = 'MPOS';
    ctx.reply('Вы выбрали игру MPOS. Что вы хотели бы предложить или рассказать?', gameOptions);
});

bot.action('MPUS_GAME', (ctx) => {
    ctx.session.selectedGame = 'MPUS';
    ctx.reply('Вы выбрали игру MPUS. Что вы хотели бы предложить или рассказать?', gameOptions);
});

bot.action('PIUTOWN_GAME', (ctx) => {
    ctx.session.selectedGame = 'PiuTown';
    ctx.reply('Вы выбрали игру PiuTown. Что вы хотели бы предложить или рассказать?', gameOptions);
});

bot.action('MC_APP', (ctx) => {
    ctx.session.selectedGame = 'Mixi Click';
    ctx.reply('Вы выбрали игру Mixi Click. Что вы хотели бы предложить или рассказать?', gameOptions);
});

bot.action('BUG', (ctx) => {
    ctx.session.issueType = 'БАГ';
    ctx.reply('Хорошо, напишите, в какой игре баг и какой баг.', Markup.inlineKeyboard([
        [Markup.button.callback('Отправить', 'SEND_TO_AUTHOR')],
    ]));
});

bot.action('IDEA', (ctx) => {
    ctx.session.issueType = 'ИДЕЯ';
    ctx.reply('Отлично! Напишите свою идею, и мы рассмотрим её.');
});

bot.on('text', (ctx) => {
    if (ctx.session.issueType) {
        ctx.session.issueText = ctx.message.text;
        ctx.reply(
            `Ваше сообщение: "${ctx.message.text}"`,
            Markup.inlineKeyboard([Markup.button.callback('Отправить', 'SEND_TO_AUTHOR')])
        );
    }
});

bot.action('SEND_TO_AUTHOR', (ctx) => {
    const { selectedGame, issueType, issueText } = ctx.session;
    if (selectedGame && issueType && issueText) {
        const message = `Сообщение по игре ${selectedGame} (${issueType}): "${issueText}"`;
        ctx.reply(`Сообщение отправлено: "${issueText}" разработчикам.`);
        // Отправка сообщения разработчику
        bot.telegram.sendMessage('1489771120', message).then(() => console.log('Сообщение успешно отправлено.'))
        .catch(error => console.error('Ошибка отправки сообщения:', error));
        // Очистка сессии после отправки
        ctx.session.selectedGame = null;
        ctx.session.issueType = null;
        ctx.session.issueText = null;
    } else {
        ctx.reply('Нет сообщения для отправки.');
    }
});


web.listen(7005, ()=>{
    bot.launch();
    console.log('Бот запущен');
});