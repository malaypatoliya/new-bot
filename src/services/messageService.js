const { getClient } = require("../client/waClient");
const path = require("path");

// const sendInvitationToMultipleNumbers = async (phoneNumber, message, filePath) => {
//     const successLog = [];
//     const errorLog = [];

//     // Make for loop to send messages to multiple numbers
//     try {
//         const wpClient = await getClient();
//         // await wpClient.sendText(`91${phoneNumber}@c.us`, message);

//         // Send File parameters (phone_number, file_path, file_name (optional), message (optional))
//         await wpClient.sendFile(
//             `91${phoneNumber}@c.us`,
//             path.resolve(filePath),
//             "Meet & Pooja Wedding Invitation",
//             message
//         );

//         console.log(`- Message sent to ${phoneNumber}`);
//         successLog.push(`Message sent to ${phoneNumber}`);
//     } catch (error) {
//         console.error(`- Failed to send message to ${phoneNumber}:`, error);
//         errorLog.push(`Failed to send message to ${phoneNumber}`);
//     }

//     // Save the logs after processing
//     const logData = {
//         success: successLog,
//         errors: errorLog,
//         timestamp: new Date().toISOString()
//     };

//     logToFile(logData);
// }

const sendMessageWithFile = async (phoneNumber, message, documentFilePath, documentFileName, logData) => {
    try {
        const wpClient = await getClient();

        // Send File parameters (phone_number, file_path, file_name (optional), message (optional))
        await wpClient.sendFile(
            `91${phoneNumber}@c.us`,
            path.resolve(documentFilePath),
            documentFileName,
            message
        );

        console.log(`- Message sent to ${phoneNumber}`);
        logData.successLog.push(`Message sent to ${phoneNumber}`);
    } catch (error) {
        console.error(`- Failed to send message to ${phoneNumber}:`, error);
        logData.errorLog.push(`Failed to send message to ${phoneNumber}`);
    }
}

const sendMessageWithText = async (phoneNumber, message, logData) => {
    try {
        const wpClient = await getClient();

        await wpClient.sendText(`91${phoneNumber}@c.us`, message);

        console.log(`- Message sent to ${phoneNumber}`);
        logData.successLog.push(`Message sent to ${phoneNumber}`);
    } catch (error) {
        console.error(`- Failed to send message to ${phoneNumber}:`, error);
        logData.errorLog.push(`Failed to send message to ${phoneNumber}`);
    }
}

module.exports = {
    sendMessageWithFile,
    sendMessageWithText
};