const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: true
    }
});

const inviteCode = 'EhsiKqFWHTb0ENlr6cGMiF';

client.on('qr', (qr) => {
    console.log('Please scan this QR code to find the Group ID (or use the dashboard):', qr);
});

client.on('ready', async () => {
    console.log('Client is ready!');
    try {
        const groupChat = await client.acceptInvite(inviteCode);
        console.log('Successfully joined/retrieved group!');
        console.log('Group Name:', groupChat.name);
        console.log('Group JID:', groupChat.id._serialized);
    } catch (err) {
        console.error('Error joining group:', err.message);
    }
    process.exit(0);
});

client.initialize();
