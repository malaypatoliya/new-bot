const _MessageService = require("../services/messageService");
const multer = require("multer");
const xlsx = require("xlsx");
const { logToFile } = require("../helper/logger");
const { storageFunc, filterFunc } = require("../helper/multer");

const sendMessagesFromExcel = (req, res) => {
    try {
        const upload = multer({
            storage: storageFunc,
            fileFilter: filterFunc,
        }).fields([
            { name: "excelFile", maxCount: 1 },
            { name: "document", maxCount: 1 }
        ]);

        upload(req, res, async (err) => {
            if (err) {
                if (err.message === "FILE_VALIDATION_ERROR") {
                    return res.status(400).json({ message: "Invalid file type. Only XLSX, XLS, JPG, PNG, and PDF files are allowed." });
                }
                return res.status(500).json({ message: "File upload failed.", error: err.message });
            }

            // both files are required
            if (!req?.files || !req?.files?.excelFile) {
                return res.status(400).json({ message: "Excel file is required." });
            }

            const excelFile = req?.files?.excelFile || null;
            const documentFile = req?.files?.document || null;

            const excelFilePath = excelFile[0]?.path;

            // Read the Excel file
            const workbook = xlsx.readFile(excelFilePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Validate the sheet
            if (!sheet) {
                return res.status(400).json({ message: "No data found in the uploaded Excel file." });
            }

            // Convert sheet to JSON array
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            if (!data || data.length === 0) {
                return res.status(400).json({ message: "The Excel file is empty or invalid." });
            }

            // Check if the document file exists
            let documentFilePath = documentFile?.[0]?.path || null;
            let documentFileName = documentFile?.[0]?.originalname || null

            // Extract phone numbers and messages from the Excel file
            const phoneMessages = data.slice(1) // Skip the header row (row 1)
                .map(row => ({
                    phoneNumber: row[0], // First column for phone number
                    message: row[1]     // Second column for message
                }))
                .filter(item => (
                    (typeof item.phoneNumber === 'number' || /^[0-9]+$/.test(item.phoneNumber)) &&
                    typeof item.message === 'string' &&
                    item.message.trim() !== ''
                ));

            // Validate extracted data
            if (phoneMessages.length === 0) {
                return res.status(400).json({ message: "No valid phone numbers and messages found in the file." });
            }

            console.log("Extracted Phone and Message Data:", phoneMessages);
            console.log('documentFilePath: ', documentFilePath);
            console.log('documentFileName: ', documentFileName);

            // Render the success page
            console.log("Message sending process started. Progress will appear here.");

            const logData = {
                successLog: [],
                errorLog: [],
                timestamp: new Date().toISOString()
            };

            for (const { phoneNumber, message } of phoneMessages) {
                if (documentFilePath) {
                    await _MessageService.sendMessageWithFile(phoneNumber, message, documentFilePath, documentFileName, logData);
                } else {
                    await _MessageService.sendMessageWithText(phoneNumber, message, logData);
                }
            }

            logToFile(logData);
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    sendMessagesFromExcel
};