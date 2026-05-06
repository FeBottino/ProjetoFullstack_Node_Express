const API_URL = "http://localhost:3000/usuarios";

async function carregarListar() {
    try {
        const response = await fetch(API_URL);
        const usuarios = await response.json();
        
        const lista = document.getElementById('listaPacientes');
        if (!lista) return;
        
        lista.innerHTML = ''; 

        usuarios.forEach(user => {
            const div = document.createElement('div');
            div.className = 'item-usuario';
            
            div.innerHTML = `
                <p>
                    <strong>Nome:</strong> ${user.nome} <br>
                    <strong>Nascimento:</strong> ${user.dataNascimento} <br>
                    <strong>CPF:</strong> ${user.cpf}
                </p>
                <div class="acoes">
                    <button class="btn-acao editar" onclick="prepararEdicao(${user.idusuario}, '${user.nome}', '${user.dataNascimento}', '${user.cpf}')">Editar</button>
                    <button class="btn-acao excluir" onclick="removerUsuario(${user.idusuario})">Excluir</button>
                </div>
            `;
            lista.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

// Inicializa a lista
carregarListar();

async function cadastrarUsuario() {
    const nome = document.getElementById('novo-nome').value;
    const data = document.getElementById('novo-data').value;
    const cpf = document.getElementById('novo-cpf').value;

    if(!nome) {
        alert("Por favor, preencha ao menos o nome.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, dataNascimento: data, cpf })
        });

        if (response.ok) {
            alert("Paciente cadastrado com sucesso!");
            // Limpa campos
            document.getElementById('novo-nome').value = '';
            document.getElementById('novo-data').value = '';
            document.getElementById('novo-cpf').value = '';
            carregarListar();
        }
    } catch (error) {
        alert("Erro ao cadastrar.");
    }
}
window.cadastrarPaciente = cadastrarUsuario;

let usuarioEditandoId = null;

function prepararEdicao(id, nome, data, cpf) {
    document.getElementById('nomePaciente').value = nome;
    document.getElementById('dataPaciente').value = data;
    document.getElementById('cpfPaciente').value = cpf;
    usuarioEditandoId = id;
    
    // Rola para a seção de edição para facilitar
    document.getElementById('nomePaciente').focus();
}
window.prepararEdicao = prepararEdicao;

async function atualizarUsuario() {
    if (!usuarioEditandoId) {
        alert("Selecione um paciente na lista clicando em 'Editar' primeiro.");
        return;
    }

    const nome = document.getElementById('nomePaciente').value;
    const data = document.getElementById('dataPaciente').value;
    const cpf = document.getElementById('cpfPaciente').value;

    try {
        const response = await fetch(`${API_URL}/${usuarioEditandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, dataNascimento: data, cpf })
        });

        if (response.ok) {
            alert("Dados atualizados com sucesso!");
            usuarioEditandoId = null;
            // Limpa campos de edição
            document.getElementById('nomePaciente').value = '';
            document.getElementById('dataPaciente').value = '';
            document.getElementById('cpfPaciente').value = '';
            carregarListar();
        }
    } catch (error) {
        alert("Erro ao atualizar.");
    }
}
window.atualizarUsuario = atualizarUsuario;

async function removerUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("Paciente removido.");
            carregarListar();
        }
    } catch (error) {
        alert("Erro ao remover.");
    }
}
window.removerUsuario = removerUsuario;

async function buscarPaciente() {
    const termo = document.getElementById('nomePaciente').value.toLowerCase();
    if (!termo) {
        alert("Digite um nome para pesquisar.");
        return;
    }

    try {
        const response = await fetch(API_URL);
        const usuarios = await response.json();
        
        const filtrados = usuarios.filter(u => u.nome.toLowerCase().includes(termo));
        const resultadoDiv = document.getElementById('resultado');
        
        if (filtrados.length > 0) {
            resultadoDiv.innerHTML = '<strong>Resultados:</strong><br>' + 
                filtrados.map(u => `<p>${u.nome} - ${u.cpf}</p>`).join('');
        } else {
            resultadoDiv.innerHTML = '<p>Nenhum paciente encontrado.</p>';
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    }
}
window.buscarPaciente = buscarPaciente;
