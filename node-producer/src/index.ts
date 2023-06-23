import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Producer from "./producer";

const port = 3000;
const app = express();
app.use(express.static('./public'));
app.use(express.json());

const producer = new Producer('test');

app.post('/order', async (req, res) => {
    const customerId = req.body.customerId;
    const item = req.body.item;

    // Validate request, return early if failed validation
    const validationErrors: string[] = [];
    //if(!orderId || typeof orderId != 'string') validationErrors.push('orderId is required to be a string');
    if(!item || typeof item != 'string') validationErrors.push('itemId is required to be a string');
    if(!customerId || typeof customerId != 'string') validationErrors.push('customerId is required to be a string');
    if(validationErrors.length > 0) return res.status(400).send(`Bad Request: ${validationErrors.join(', ')}`);

    const order = {
        orderId: uuidv4(),
        customerId,
        item
    }

    try{
        await producer.send(JSON.stringify(order), <string>customerId);
    } catch(e) {
        console.log('Error producing message:', e);
        return res.status(500).send('Failed to submit the order');
    }

    return res.status(201).send(JSON.stringify(order));
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

process.on('SIGINT', async () => {
    server.close((e) => {
        if(e){
            console.error('Error stopping express server');
            console.error(e);
        }
        console.log('Express server stopped');
    });
    await producer.disconnect();
    console.log('Producer disconnected');
    console.log('Exiting...');
})