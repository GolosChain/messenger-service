const request = require('request-promise-native');
const env = require('../data/env');
const AbstractBot = require('./AbstractBot');

const API_PREFIX = 'https://api.telegram.org/bot';

class Telegram extends AbstractBot {
    async start() {
        // TODO Messages reading loop
    }

    async extractNewMessages() {
        // TODO Extractor + MongoDB
    }

    async handleMessage({ from, message }) {
        // TODO Route with parse start command
    }

    async _sendToUser({ user, message }) {
        const rawResult = await request({
            method: 'POST',
            uri: this.makeRequestString('sendMessage', { text: message }),
        });
        let result;

        try {
            result = JSON.parse(rawResult);
        } catch (error) {
            throw error;
        }

        if (result.ok !== true) {
            throw result.description;
        }
    }

    async _getUserLang(user) {
        // TODO From db
    }

    async _getUserChatId(user) {
        // TODO From db
    }

    makeRequestString(command, paramsObject) {
        const paramsString = Object.keys(paramsObject)
            .map(key => `${key}=${paramsObject[key]}`)
            .join('&');

        return `${API_PREFIX}${env.GLS_TELEGRAM_KEY}/${command}?${paramsString}`;
    }
}

module.exports = Telegram;
