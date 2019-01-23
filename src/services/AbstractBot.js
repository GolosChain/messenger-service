const random = require('random');
const core = require('gls-core-service');
const BasicService = core.services.Basic;
const Logger = core.utils.Logger;
const stats = core.utils.statsClient;
const locale = require('../data/locale');

class AbstractBot extends BasicService {
    constructor({ receiver, connector }) {
        super();

        this._receiver = receiver;
        this._connector = connector;
    }

    async start() {
        await super.start();

        const className = this.constructor.name;

        this._receiver.on(
            `${className.toLocaleLowerCase()}Message`,
            this._tryHandleMessage.bind(this)
        );
    }

    async _tryHandleMessage(data) {
        try {
            await this.handleMessage(data);
        } catch (error) {
            const className = this.constructor.name;

            Logger.error(`Cant handle message from ${className}, but continue - ${error}`);

            try {
                await this._sendToUser({
                    user: data.user,
                    message: `Error, try again :: ${error}`,
                });
            } catch (error) {
                Logger.error(
                    `Cant send error message from ${className} to user ${
                        data.user
                    }, but continue - ${error}`
                );
            }
        }
    }

    async handleMessage({ from, message }) {
        // abstract
    }

    async handleRegistrationVerification({ from, command }) {
        const lang = await this._getUserLang(from);

        switch (command) {
            case 'start':
                {
                    const code = this._makeRegistrationCode();

                    await this._sendRegistrationHelloMessage(from, lang);
                    await this._bindRegistrationCode(from, code);
                    await this._sendCodeMessage(from, lang, code);
                }
                break;

            case 'resendCode':
                {
                    const code = this._makeRegistrationCode();

                    await this._sendResendCodeMessage(from, lang);
                    await this._bindRegistrationCode(from, code);
                    await this._sendCodeMessage(from, lang, code);
                }
                break;

            default:
                Logger.warn(`Unknown registration verification command - ${command}`);
                stats.increment('unknown_registration_verification_command');
        }
    }

    async _sendRegistrationHelloMessage(user, lang) {
        const message = locale.registration.hello[lang]();

        await this._sendToUser({ user, message });
    }

    async _sendResendCodeMessage(user, lang) {
        const message = locale.registration.resendCode[lang]();

        await this._sendToUser({ user, message });
    }

    async _sendCodeMessage(user, lang, code) {
        const message = locale.registration.code[lang](code);

        await this._sendToUser({ user, message });
    }

    async _bindRegistrationCode(from, code) {
        return await this._connector.callService('registration', 'messenger.bindCode', {
            from,
            code,
        });
    }

    _makeRegistrationCode() {
        return random.int(1000, 9999);
    }

    async _sendToUser({ user, message }) {
        // abstract
    }

    async _getUserLang(user) {
        // abstract
    }
}

module.exports = AbstractBot;
