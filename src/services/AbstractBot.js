const core = require('gls-core-service');
const BasicService = core.services.Basic;

class AbstractBot extends BasicService {
    constructor({ receiver }) {
        super();

        this._receiver = receiver;
    }

    // TODO -
}

module.exports = AbstractBot;
