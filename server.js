const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Caminho do arquivo data.json em /tmp para poder escrever
const dataFilePath = '/tmp/data.json';
const originalDataFilePath = path.join(__dirname, 'data.json');

// Verifica se o arquivo já existe em /tmp, se não, copia o arquivo original
if (!fs.existsSync(dataFilePath)) {
    fs.copyFileSync(originalDataFilePath, dataFilePath);
}

// Rota para obter produtos
app.get('/api/products', (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro ao ler os produtos.");
        }
        res.json(JSON.parse(data));
    });
});

// Rota para adicionar um produto
app.post('/api/products', (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro ao ler os produtos.");
        }
        const products = JSON.parse(data);
        products.push(req.body);
        fs.writeFile(dataFilePath, JSON.stringify(products), err => {
            if (err) {
                console.error("Erro ao salvar o arquivo:", err);
                return res.status(500).send("Erro ao salvar o produto.");
            }
            res.status(201).send(req.body);
        });
    });
});

// Rota para remover um produto
app.delete('/api/products/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro ao ler os produtos.");
        }
        const products = JSON.parse(data);
        if (index < 0 || index >= products.length) {
            return res.status(400).send("Índice inválido.");
        }
        products.splice(index, 1);
        fs.writeFile(dataFilePath, JSON.stringify(products), err => {
            if (err) {
                console.error("Erro ao salvar o arquivo:", err);
                return res.status(500).send("Erro ao salvar a lista de produtos.");
            }
            res.status(200).send();
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app; // Exporta o app para uso em plataformas serverless
