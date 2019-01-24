const request = require('request-promise-native');
const core = require('gls-core-service');
const Logger = core.utils.Logger;
const env = require('../data/env');
const AbstractBot = require('./AbstractBot');
const TelegramUser = require('../models/TelegramUser');
const TelegramMessage = require('../models/TelegramMessage');

const API_PREFIX = 'https://api.telegram.org/bot';

class Telegram extends AbstractBot {
    async start() {
        this.startLoop(0, env.GLS_TELEGRAM_UPDATES_LOOP);
    }

    async iteration() {
        try {
            const updates = await this._callApi('getUpdates');
            const messages = await this._extractNewMessages(updates);

            for (const { chatUsername, text } of messages) {
                await this._tryHandleMessage({ chatUsername, message: text });
            }
        } catch (error) {
            Logger.error(`Cant get message list from Telegram, but continue - ${error}`);
        }
    }

    async _extractNewMessages(updates) {
        const result = [];

        for (const { message } of updates) {
            const messageId = message.message_id;
            const chatUsername = message.chat.username;
            const text = message.text;
            let model = await TelegramMessage.findOne({ messageId }, { messageId: true });

            if (model) {
                continue;
            }

            model = new TelegramMessage({ messageId, chatUsername, text });

            await model.save();
            result.push(model);
        }

        return result;
    }

    async _handleMessage({ chatUsername, message }) {
        // TODO Route with parse start command
    }

    async _sendToUser({ chatUsername, message }) {
        const chatId = await this._getUserChatId(chatUsername);

        await this._callApi('sendMessage', { text: message, chat_id: chatId });
    }

    async _getUserLang(chatUsername) {
        const data = await TelegramUser.findOne({ chatUsername }, { lang: true });

        return data.lang;
    }

    async _getUserChatId(chatUsername) {
        const data = await TelegramUser.findOne({ chatUsername }, { chatId: true });

        return data.chatId;
    }

    async _callApi(command, params) {
        const rawResult = await request(this.makeRequestString(command, params));
        const parsedResult = JSON.parse(rawResult);

        if (parsedResult.ok !== true) {
            throw parsedResult.description;
        }

        return parsedResult.result;
    }

    makeRequestString(command, paramsObject = {}) {
        const paramsString = Object.keys(paramsObject)
            .map(key => `${key}=${paramsObject[key]}`)
            .join('&');

        return `${API_PREFIX}${env.GLS_TELEGRAM_KEY}/${command}?${paramsString}`;
    }
}

module.exports = Telegram;
