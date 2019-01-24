const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'TelegramMessage',
    {
        messageId: {
            type: Number,
            required: true,
        },
        chatUsername: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
    },
    {
        index: [
            // Search
            {
                fields: {
                    messageId: 1,
                },
            },
        ],
    }
);
