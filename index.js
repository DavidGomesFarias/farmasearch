// Variável para controlar se uma requisição está em andamento
let requisicaoEmAndamento = false;
let debounceTimer;

function updateItemList(cidade) {
  const cidadeFormatada = cidade.replace(/\s+/g, ''); // Remove espaços
  
  // Se já existe uma requisição em andamento, não faça outra
  if (requisicaoEmAndamento) {
    console.log(`Já há uma requisição em andamento para a cidade ${cidade}.`);
    return;
  }

  // Marca que uma requisição está em andamento
  requisicaoEmAndamento = true;

  // Limpa a lista de itens antes de fazer a requisição para garantir dados frescos
  const itemList = document.querySelector('#itemList');
  itemList.innerHTML = ''; // Limpa a lista existente

  fetch(`https://farmasearch.onrender.com/dados/${cidadeFormatada}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      return response.json(); // Converte a resposta para JSON
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      renderItems(data); // Atualiza a lista com os novos dados
    })
    .catch(error => {
      console.error('Erro:', error);
    })
    .finally(() => {
      // Ao terminar a requisição (seja sucesso ou erro), libera o controle para novas requisições
      requisicaoEmAndamento = false;
    });
}

// Função para renderizar os itens da cidade
function renderItems(data) {
  const itemList = document.querySelector('#itemList');
  itemList.innerHTML = ''; // Limpa a lista existente

  data.forEach(item => {
    const li = document.createElement('li');
    const pDisponibilidade = document.createElement('p');
    const pDataPedido = document.createElement('p');
    const pDataPrevisao = document.createElement('p');

    pDisponibilidade.textContent = item.disponibilidade || 'Sem informações';
    pDataPedido.textContent = `Data do pedido: ${item.data_pedido}` || 'Sem informações';
    pDataPrevisao.textContent = `Previsão de chegada: ${item.data_previsao}` || 'Sem informações';

    if (item.disponibilidade === 'Disponível') {
      pDisponibilidade.classList.add('disponivel');
      pDataPedido.style.display = 'none';
      pDataPrevisao.style.display = 'none';
    } else if (item.disponibilidade === 'Indisponível') {
      pDisponibilidade.classList.add('indisponivel');
    }

    li.textContent = item.nome_remedio || 'Item sem texto';
    li.dataset.id = item.id || '0'; // ID do item
    itemList.appendChild(li);
    li.appendChild(pDisponibilidade);
    li.appendChild(pDataPedido);
    li.appendChild(pDataPrevisao);
  });
}

// Função de debounce
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

// Adicionando a funcionalidade de pesquisa para os remédios
document.getElementById('searchInput').addEventListener('keyup', function () {
  const input = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // A função de debounce vai ser chamada aqui
  debounce(() => {
    const items = document.querySelectorAll('.itemList li');
    
    items.forEach(function (item) {
      const text = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (text.includes(input)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }, 200); // Delay de 500ms para garantir que o usuário terminou de digitar

  // A parte de "click" no item de cidade
  const items = document.querySelectorAll('.itemList li');
  items.forEach(function (item) {
    item.addEventListener('click', () => {
      // Limpa os itens antes de mostrar o novo conteúdo
      items.forEach(function (i) {
        i.style.display = 'none';
      });

      const textNormal = item.textContent;
      let cidade = item.textContent;
      cidade = cidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const main = document.querySelector('.main');
      main.innerHTML = `<div class="containerMain">
        <h2>${textNormal}</h2>
        <input type="text" id="searchInput2" placeholder="Buscar Remédio">
        <ul id="itemList" style="display: flex;">
        </ul>
      </div>`;

      const itemList = document.querySelector('#itemList');
      itemList.innerHTML = '';
      updateItemList(cidade); // Requisição para carregar dados atualizados
      document.getElementById('searchInput').value = textNormal;
    });
  });
});
