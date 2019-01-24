const request = require('request-promise-native');
const core = require('gls-core-service');
const Logger = core.utils.Logger;
const env = require('../data/env');
const AbstractBot = require('./AbstractBot');
const Model = require('../models/Telegram');

const API_PREFIX = 'https://api.telegram.org/bot';

class Telegram extends AbstractBot {
    async start() {
        this.startLoop(0, env.GLS_TELEGRAM_UPDATES_LOOP);
    }

    async iteration() {
        try {
            const updates = await this._callApi('getUpdates');
            const messageObjects = await this._extractNewMessages(updates);

            for (const { chatUsername, message } of messageObjects) {
                await this._tryHandleMessage({ chatUsername, message });
            }
        } catch (error) {
            Logger.error(`Cant get message list from Telegram, but continue - ${error}`);
        }
    }

    async _extractNewMessages(updates) {
        // TODO Extractor + MongoDB
    }

    async _handleMessage({ chatUsername, message }) {
        // TODO Route with parse start command
    }

    async _sendToUser({ chatUsername, message }) {
        // TODO Get chat id

        await this._callApi('sendMessage', { text: message });
    }

    async _getUserLang(chatUsername) {
        const data = await Model.findOne({ chatUsername }, { lang: true });

        return data.lang;
    }

    async _getUserChatId(chatUsername) {
        const data = await Model.findOne({ chatUsername }, { chatId: true });

        return data.chatId;
    }

    async _callApi(command, params) {
        const rawResult = await request(this.makeRequestString(command, params));
        const result = JSON.parse(rawResult);

        if (result.ok !== true) {
            throw result.description;
        }
    }

    makeRequestString(command, paramsObject = {}) {
        const paramsString = Object.keys(paramsObject)
            .map(key => `${key}=${paramsObject[key]}`)
            .join('&');

        return `${API_PREFIX}${env.GLS_TELEGRAM_KEY}/${command}?${paramsString}`;
    }
}

module.exports = Telegram;
