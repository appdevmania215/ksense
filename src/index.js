"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8800;
app.use(body_parser_1.default.json());
const SECRET_FILE = path_1.default.join(__dirname, "secret.txt");
// Webhook endpoint
app.post('/webhook', (req, res) => {
    try {
        const payload = req.body;
        console.log('Payload received:', payload);
        if (!payload.secret) {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        fs_1.default.writeFileSync(SECRET_FILE, payload.secret);
        return res.status(200).json({ message: 'Payload received successfully' });
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Retrieve the stored secret
app.get('/secret', (req, res) => {
    try {
        if (!fs_1.default.existsSync(SECRET_FILE)) {
            return res.status(404).json({ message: 'Secret not found' });
        }
        const secret = fs_1.default.readFileSync(SECRET_FILE, 'utf-8');
        return res.json({ secret });
    }
    catch (error) {
        console.error('Error retrieving secret:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
