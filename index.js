function updateItemList(cidade) {
  const cidadeFormatada = cidade.replace(/\s+/g, '');
  fetch(`https://farmasearch.onrender.com/dados/${cidadeFormatada}`) // Ajuste a URL conforme necessário
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      return response.json(); // Converte a resposta para JSON
    })
    .then(data => {
      console.log('Dados recebidos:', data); // Verifique a estrutura
      const itemList = document.querySelector('#itemList');
      itemList.innerHTML = ''; // Limpar a lista existente

      // Criação dos itens da lista
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
          console.log(`Item ${item.nome_remedio} está disponível.`);
        } else if (item.disponibilidade === 'Indisponível') {
          pDisponibilidade.classList.add('indisponivel');
          console.log(`Item ${item.nome_remedio} está indisponível.`);
        } else {
          console.log(`Item ${item.nome_remedio} tem status desconhecido.`);
        }

        li.textContent = item.nome_remedio || 'Item sem texto'; // Defina um texto padrão se 'nome_remedio' for indefinido
        li.dataset.id = item.id || '0'; // Defina um ID padrão se 'id' for indefinido
        itemList.appendChild(li);
        li.appendChild(pDisponibilidade);
        li.appendChild(pDataPedido);
        li.appendChild(pDataPrevisao);
      });

      // Adicionando a funcionalidade de pesquisa para os remédios
      const searchInput2 = document.getElementById('searchInput2');
      searchInput2.addEventListener('keyup', function () {
        const input = this.value.toLowerCase();
        const items = itemList.querySelectorAll('li');

        items.forEach(function (item) {
          const text = item.textContent.toLowerCase();
          if (text.includes(input)) {
            item.style.display = 'block'; // Mostra o item
          } else {
            item.style.display = 'none'; // Esconde o item
          }
        });
      });
    })
    .catch(error => console.error('Erro:', error));
}

document.getElementById('searchInput').addEventListener('keyup', function () {
  const input = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o valor do input e converte para minúsculas
  const items = document.querySelectorAll('.itemList li'); // Seleciona todos os itens da lista

  items.forEach(function (item) {
    const text = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o texto de cada item e converte para minúsculas
    if (text.includes(input)) { // Verifica se o texto do item contém o que foi digitado
      item.style.display = 'block'; // Mostra o item se ele contiver o texto
    } else {
      item.style.display = 'none'; // Esconde o item se não contiver o texto
    }
  });

  items.forEach(function (item) {
    item.addEventListener('click', () => {
      // Limpa os itens visíveis antes de mostrar o novo conteúdo
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
      updateItemList(cidade);
      document.getElementById('searchInput').value = textNormal;
    });
  });
});
