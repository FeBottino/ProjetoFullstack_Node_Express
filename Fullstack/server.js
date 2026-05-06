const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 3000;


app.use(express.json())
app.use(cors())


let usuario = [
    {idusuario:1, nome:'Wallace Oliveira', dataNascimento:'10-10-1986', cpf:'039.741.615-62'},
    {idusuario:2, nome:'Ana Mota', dataNascimento:'10-10-1980', cpf:'039.741.000-56'},
    {idusuario:3, nome:'Fernanda Souza', dataNascimento:'02-06-2000', cpf:'111.111.111-11'},
    {idusuario:4, nome:'Erasmo Carlos', dataNascimento:'01-02-1999', cpf:'222.222.222-22'},
    {idusuario:5, nome:'Teles da Silva Nascimento', dataNascimento:'10-03-1978', cpf:'333.333.333-33'},
    {idusuario:6, nome:'Ronaldo Fenômeno', dataNascimento:'03-12-1990', cpf:'444.444.444-44'}

]

//Criando rotas

app.get('/', (req, res) => {
    res.json({mensagem: "API FUNCIONANDO"})
})

app.get('/usuarios', (req, res) => {
    res.json(usuario)
})

app.post('/usuarios', (req, res) => {

    const novoUsuario = {
        idusuario: usuario.length > 0 ? Math.max(...usuario.map(u => u.idusuario)) + 1 : 1,
        nome: req.body.nome,
        dataNascimento: req.body.dataNascimento,
        cpf: req.body.cpf
        
    }

    usuario.push(novoUsuario)

    res.status(201).json({mensagem: 'Usuário criado com sucesso', usuario:novoUsuario})
})

//Rota de atualizar
app.put('/usuarios/:id', (req, res) => {

    const id = parseInt(req.params.id) 
    const usuarioIndex = usuario.findIndex(u => u.idusuario === id)
    if(usuarioIndex === -1){
        return res.status(404).json({mensagem: "Usuário não encontrado"})
    }

    usuario[usuarioIndex] = {
        ...usuario[usuarioIndex],
        nome:req.body.nome,
        dataNascimento:req.body.dataNascimento,
        cpf:req.body.cpf
    }

    res.status(200).json({mensagem:"Usuário aualizado", usuario:usuario[usuarioIndex]})
})

app.delete('/usuarios/:id', (req, res) => {

    const id = parseInt(req.params.id) 

    const usuarioIndex = usuario.findIndex(u => u.idusuario === id)

    if(usuarioIndex === -1){
        return res.status(404).json({mensagem: "Usuário não encontrado"})
    }

    const removido = usuario.splice(usuarioIndex,1)

    res.status(200).json({mensagem:"Usuario removido", usuario:removido[0]})
})

//Ligando seu BackEnd

app.listen(PORT, () => {
   console.log("API Rodando na porta - http://localhost:3000") })
