const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//configurações
const router = require('express').Router();
const app = express();
app.use(bodyParser.json());

//conexção com o banco
mongoose.connect("mongodb://127.0.0.1:27017/pethouse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
})

//models
const UsuarioSchema = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String}
})
const User = mongoose.model('User', UsuarioSchema);

const produtopet = new mongoose.Schema({
    id: {type: String, required: true},
    descricao: {type: String},
    fornecedor: {type: String},
    dataValidade: {type: Date},
    estoque: {type: Number}
})
const produto = mongoose.model('produto', produtopet);

//post
app.post("/cadastrousuario", async (req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    if(email == null || senha == null){
        return res.status(400).json({error:"Preencha todos os campos"});
    }
    const user = new User({
        email: email,
        senha: senha
    })
    try{
    const newUser = await user.save();
    res.json({error: null, msg:"Cadastro concluído", userId: newUser._id})
    }
    catch(error){
        res.status.json({error});
    }
    const emailExiste = await Pessoa.findOne({email: email})

    if(emailExiste){
        return res.status(400).json({error: "O email cadastrado já existe"})
    }
})

app.post("/cadastroProdutoPet", async (req, res)=>{
    const id = req.body.id;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const dataValidade = req.body.dataValidade;
    const estoque = req.body.estoque;

    if(id == null || descricao == null || fornecedor == null || dataValidade == null || estoque == null){
        return res.status(400).json({error:"Preencha todos os campos"});
    }
    const produtopet = new produto({
        id: id,
        descricao: descricao,
        fornecedor: fornecedor,
        dataValidade: dataValidade,
        estoque: estoque
    })
    try{
    const newProduto = await produtopet.save();
    res.json({error: null, msg:"Cadastro concluído", produtoId: newProduto._id})
    }
    catch(error){
        res.status.json({error});
    }
    if(produto>45){
        res.status(400).json({error:"O limite do produto foi atingido"})
    }
    else if(0<=produto){
        res.status(400).json({error:"O produto predcisa te no mínimo 1 unidade"})
    }
})

//get
app.get("/",(req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000, ()=>{
    console.log("rodando na porta 3000")
})