import express from 'express';
import Producer from "./producer";

const port = 3000;
const app = express();
app.use(express.static('./public'));
app.use(express.json());

const producer = new Producer('test');

app.post('/order', async (req, res) => {
    const orderId = req.body.orderId;
    const customerId = req.body.customerId;
    const item = req.body.item;

    // Validate request, return early if failed validation
    const validationErrors: string[] = [];
    if(!orderId || typeof orderId != 'string') validationErrors.push('orderId is required to be a string');
    if(!item || typeof item != 'string') validationErrors.push('itemId is required to be a string');
    if(!customerId || typeof customerId != 'string') validationErrors.push('customerId is required to be a string');
    if(validationErrors.length > 0) return res.status(400).send(`Bad Request: ${validationErrors.join(', ')}`);

    const order = {
        customerId,
        orderId,
        item
    }

    try{
        await producer.send(JSON.stringify(order), <string>customerId);
    } catch(e) {
        return res.status(500).send('Failed to submit the order');
    }

    return res.send('Order sent successfully');
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

process.on('SIGINT', async () => {
    server.close();
    await producer.disconnect();
    console.log('Producer disconnected, exiting...');
})