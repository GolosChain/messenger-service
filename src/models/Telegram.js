const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'Telegram',
    {
        chatUsername: {
            type: String,
            required: true,
        },
        chatId: {
            type: Number,
            required: true,
        },
        lang: {
            type: String,
        },
    },
    {
        index: [
            // Search and identify
            {
                fields: {
                    chatUsername: 1,
                },
            },
        ],
    }
);
