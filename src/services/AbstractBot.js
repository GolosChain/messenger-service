const random = require('random');
const core = require('gls-core-service');
const BasicService = core.services.Basic;
const Logger = core.utils.Logger;
const stats = core.utils.statsClient;
const locale = require('../data/locale');

class AbstractBot extends BasicService {
    constructor({ receiver = null, connector }) {
        super();

        this._receiver = receiver;
        this._connector = connector;
    }

    async start() {
        await super.start();

        const className = this.constructor.name;

        if (this._receiver) {
            this._receiver.on(
                `${className.toLocaleLowerCase()}Message`,
                this._tryHandleMessage.bind(this)
            );
        }
    }

    async _tryHandleMessage(data) {
        try {
            await this._handleMessage(data);
        } catch (error) {
            const className = this.constructor.name;

            Logger.error(`Cant handle message from ${className}, but continue - ${error}`);

            try {
                await this._sendToUser({
                    chatUsername: data.chatUsername,
                    message: `Error, try again :: ${error}`,
                });
            } catch (error) {
                Logger.error(
                    `Cant send error message from ${className} to user ${
                        data.chatUsername
                    }, but continue - ${error}`
                );
            }
        }
    }

    async _handleMessage({ chatUsername, message }) {
        // abstract
    }

    async _handleVerification({ chatUsername, command }) {
        const lang = await this._getUserLang(chatUsername);

        switch (command) {
            case 'getVerificationCode':
                {
                    const code = this._makeRegistrationCode();

                    await this._sendRegistrationHelloMessage(chatUsername, lang);
                    await this._bindRegistrationCode(chatUsername, code);
                    await this._sendCodeMessage(chatUsername, lang, code);
                }
                break;

            case 'resendVerificationCode':
                {
                    const code = this._makeRegistrationCode();

                    await this._sendResendCodeMessage(chatUsername, lang);
                    await this._bindRegistrationCode(chatUsername, code);
                    await this._sendCodeMessage(chatUsername, lang, code);
                }
                break;

            default:
                Logger.warn(`Unknown verification command - ${command}`);
                stats.increment('unknown_verification_command');
        }
    }

    async _sendRegistrationHelloMessage(chatUsername, lang) {
        const message = locale.registration.hello[lang]();

        await this._sendToUser({ chatUsername, message });
    }

    async _sendResendCodeMessage(chatUsername, lang) {
        const message = locale.registration.resendCode[lang]();

        await this._sendToUser({ chatUsername, message });
    }

    async _sendCodeMessage(chatUsername, lang, code) {
        const message = locale.registration.code[lang](code);

        await this._sendToUser({ chatUsername, message });
    }

    async _bindRegistrationCode(chatUsername, code) {
        return await this._connector.callService('registration', 'messenger.bindCode', {
            chatUsername,
            code,
        });
    }

    _makeRegistrationCode() {
        return random.int(1000, 9999);
    }

    async _sendToUser({ chatUsername, message }) {
        // abstract
    }

    async _getUserLang(chatUsername) {
        // abstract
    }
}

module.exports = AbstractBot;
