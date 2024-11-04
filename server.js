const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter produtos
app.get('/api/products', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).send(err);
        res.json(JSON.parse(data));
    });
});

// Rota para adicionar um produto
app.post('/api/products', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).send(err);
        const products = JSON.parse(data);
        products.push(req.body);
        fs.writeFile('data.json', JSON.stringify(products), err => {
            if (err) return res.status(500).send(err);
            res.status(201).send(req.body);
        });
    });
});

// Rota para remover um produto
app.delete('/api/products/:index', (req, res) => {
    const index = req.params.index;
    fs.readFile('data.json', (err, data) => {
        if (err) return res.status(500).send(err);
        const products = JSON.parse(data);
        products.splice(index, 1);
        fs.writeFile('data.json', JSON.stringify(products), err => {
            if (err) return res.status(500).send(err);
            res.status(200).send();
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
