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
const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String}
})
const User = mongoose.model('User', UserSchema);

const produtopet = new mongoose.Schema({
    id: {type: String, required: true},
    desc: {type: String},
    fornecedor: {type: String},
    dataValidade: {type: Date},
    estoque: {type: Number}
})
const produto = mongoose.model('produto', produtopet);

//post
app.post("/cadastrousuario", async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    if(email == null || password == null){
        return res.status(400).json({error:"Preencha todos os campos"});
    }
    const user = new User({
        email: email,
        password: password
    })
    try{
    const newUser = await user.save();
    res.json({error: null, msg:"Cadastro concluído", userId: newUser._id})
    }
    catch(error){
        res.status.json({error});
    }
})

app.post("/cadastroProdutoPet", async (req, res)=>{
    const id = req.body.id;
    const desc = req.body.desc;
    const fornecedor = req.body.fornecedor;
    const dataValidade = req.body.dataValidade;
    const estoque = req.body.estoque;

    if(id == null || desc == null || fornecedor == null || dataValidade == null || estoque == null){
        return res.status(400).json({error:"Preencha todos os campos"});
    }
    const produtopet = new produto({
        id: id,
        desc: desc,
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
})

//get
app.get("/",(req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000, ()=>{
    console.log("rodando na porta 3000")
})