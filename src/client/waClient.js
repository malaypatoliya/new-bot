const wa = require("@open-wa/wa-automate");

let client;

const initializeWAClient = async () => {
    try {
        client = await wa.create({
            sessionId: "SIMPLE_MESSAGE_SENDER",
            multiDevice: true,
            authTimeout: 60,
            blockCrashLogs: true,
            disableSpins: true,
            headless: true,
            qrTimeout: 0,
        });
        console.log("\x1b[32m%s\x1b[0m", "- WhatsApp client created successfully!");
    } catch (error) {
        console.error("Error creating WhatsApp client:", error);
    }
}

const getClient = () => {
    if (!client) throw new Error("WhatsApp client is not initialized.");
    return client;
}

module.exports = { initializeWAClient, getClient };
