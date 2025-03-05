import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT: number = Number(process.env.PORT) || 8800;

app.use(bodyParser.json());

const SECRET_FILE: string = path.join(__dirname, "secret.txt");

interface WebhookPayload {
    secret: string;
}


// Webhook endpoint
app.post('/webhook', (req: Request, res: Response): any => {
  try {
    const payload: WebhookPayload = req.body;
    console.log('Payload received:', payload);

    if (!payload.secret) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    fs.writeFileSync(SECRET_FILE, payload.secret);
    return res.status(200).json({ message: 'Payload received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
  
  // Retrieve the stored secret
app.get('/secret', (req: Request, res: Response): any => {
  try {
    if (!fs.existsSync(SECRET_FILE)) {
      return res.status(404).json({ message: 'Secret not found' });
    }
    const secret: string = fs.readFileSync(SECRET_FILE, 'utf-8');
    return res.json({ secret });
  } catch (error) {
    console.error('Error retrieving secret:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
