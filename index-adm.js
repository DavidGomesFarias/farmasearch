if(localStorage.getItem('token') == null) {
    alert('Você precisa estar logado para acessar essa página!')
    window.location.href = 'index.html'
}

localStorage.clear()

function updateItemList(cidade) {
  const cidadeFormatada = cidade.replace(/\s+/g, '');
  fetch(`http://localhost:3001/dados/${cidadeFormatada}`) // Ajuste a URL conforme necessário
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
      data.forEach(item => {
        const li = document.createElement('li');
        const pDisponibilidade  = document.createElement('p');
        const pDataPedido  = document.createElement('p');
        const pDataPrevisao  = document.createElement('p');
        const divEditar = document.createElement('div');
        const divApagar = document.createElement('div');
        
        divEditar.innerHTML = `<svg class="svgEditar" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
        divApagar.innerHTML = `<svg class="svgApagar" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
        pDisponibilidade.textContent = item.disponibilidade || 'Sem informações'
        pDataPedido.textContent = `Data do pedido: ${item.data_pedido}` || 'Sem informações'
        pDataPrevisao.textContent = `Previsão de chegada: ${item.data_previsao}`  || 'Sem informações'
        if (item.disponibilidade === 'Disponível') {
          pDisponibilidade.classList.add('disponivel')
          pDataPedido.style.display = 'none'
          pDataPrevisao.style.display = 'none'
          // console.log(`Item ${item.nome_remedio} está disponível.`);
            } else if (item.disponibilidade === 'Indisponível') {
              pDisponibilidade.classList.add('indisponivel')
              // console.log(`Item ${item.nome_remedio} está indisponível.`);
            } else {
        // Caso a disponibilidade tenha outro valor ou seja nula
        console.log(`Item ${item.nome_remedio} tem status desconhecido.`);
      }
        li.textContent = item.nome_remedio || 'Item sem texto'; // Defina um texto padrão se 'nome_remedio' for indefinido
        li.dataset.id = item.id || '0'; // Defina um ID padrão se 'id' for indefinido
        itemList.appendChild(li);
        li.appendChild(pDisponibilidade)
        li.appendChild(pDataPedido)
        li.appendChild(pDataPrevisao)
        li.appendChild(divEditar)
        li.appendChild(divApagar)

        divEditar.querySelector('.svgEditar').addEventListener('click', () => {
          divEditar.style.display = 'none';
          if(item.disponibilidade === 'Disponível') {
            li.innerHTML = `<input class="inputNovoNome" type="text" placeholder="${item.nome_remedio}" autofocus>
          <label for="">Disponibilidade: </label>
          <div class="disponibilidade">
            <label for="">Disponível: </label>
            <input
              type="radio"
              name="opcao"
              class="radioDisponivel2"
              checked
            />
            <label for="">Indisponível: </label>
            <input type="radio" name="opcao" class="radioIndisponivel2"/>
          </div>
        </div>
        <div class="datas2" style="display: none">
          <label for="dataPedido" class="dataPedido">Data do pedido: </label>
          <input type="date" name="dataPedido" class="dataPedido3"/>
          <label for="previsaoDeChegada" class="previsaoDeChegada"
            >Previsão de chegada:
          </label>
          <input type="date" name="previsaoDeChegada" class="previsaoDeChegada3"/>
        </div>`
        document.querySelector('.radioIndisponivel2').addEventListener('click', () => {
              document.querySelector('.datas2').style.display = 'grid'
          });
        document.querySelector('.radioDisponivel2').addEventListener('click', () => {
              document.querySelector('.datas2').style.display = 'none'
          });
          } else if(item.disponibilidade === 'Indisponível') {
            li.innerHTML = `<input class="inputNovoNome" type="text" placeholder="${item.nome_remedio}" autofocus>
          <label for="">Disponibilidade: </label>
          <div class="disponibilidade">
            <label for="">Disponível: </label>
            <input
              type="radio"
              name="opcao"
              class="radioDisponivel2"
            />
            <label for="">Indisponível: </label>
            <input type="radio" name="opcao" class="radioIndisponivel2" checked/>
          </div>
        </div>
        <div class="datas2" style="display: none">
          <label for="dataPedido" class="dataPedido">Data do pedido: </label>
          <input type="date" name="dataPedido3" class="dataPedido3"/>
          <label for="previsaoDeChegada" class="previsaoDeChegada"
            >Previsão de chegada:
          </label>
          <input type="date" name="previsaoDeChegada3" class="previsaoDeChegada3"/>
        </div>`
        document.querySelector('.radioDisponivel2').addEventListener('click', () => {
              document.querySelector('.datas2').style.display = 'none'
          });
        document.querySelector('.radioIndisponivel2').addEventListener('click', () => {
              document.querySelector('.datas2').style.display = 'grid'
          });
        }

        // Função para formatar a data no formato YYYY-MM-DD
        // Função para formatar a data no formato DD/MM/YYYY para YYYY-MM-DD
        function formatarData(data) {
          // Verifica se a data já está no formato ISO (YYYY-MM-DD)
          if (typeof data === 'string' && data.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return data; // A data já está no formato correto
          }
        
          // Verifica se a data está no formato DD/MM/YYYY
          if (typeof data === 'string' && data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const partes = data.split('/');
            const dia = partes[0];
            const mes = partes[1];
            const ano = partes[2];
          
            // Retorna a data no formato YYYY-MM-DD
            return `${ano}-${mes}-${dia}`;
          }
        
          console.error("Formato de data inválido: ", data);
          return null;
        }


      
        // Definindo os valores de data nos inputs de data
        const dataPedidoInput = li.querySelector('.dataPedido3');
        const previsaoDeChegadaInput = li.querySelector('.previsaoDeChegada3');

        const dataPedidoFormatada = formatarData(item.data_pedido);
        dataPedidoInput.value = dataPedidoFormatada;

        const previsaoFormatada = formatarData(item.data_previsao);
        previsaoDeChegadaInput.value = previsaoFormatada;


          
        li.querySelector('.inputNovoNome').value = item.nome_remedio;
        // document.querySelector('.radioIndisponivel2').addEventListener('click', () => {
        // const datas = document.querySelector('.datas2')
        // datas.style.display = 'grid'
  
        //   document.querySelector('.radioDisponivel2').addEventListener('click', () => {
        //      datas.style.display = 'none'
        //     })
        // });
        if(item.disponibilidade === 'Indisponível') {
          const datas = document.querySelector('.datas2')
          datas.style.display = 'grid'
        } else if(item.disponibilidade === 'Disponível') {
          const datas = document.querySelector('.datas2')
          datas.style.display = 'none'
        }

          const divSalvar = document.createElement('div');
          divSalvar.innerHTML = `<svg class="svgSalvar" width="24px" height="24px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	        <path d="M14.164 0h-12.664c-0.827 0-1.5 0.673-1.5 1.5v14c0 0.827 0.673 1.5 1.5 1.5h14c0.827 0 1.5-0.673 1.5-1.5v-12.724l-2.836-2.776zM8 1v4h3v-4h1v5h-8v-5h4zM3 16v-6h11v6h-11zM16 15.5c0 0.275-0.225 0.5-0.5 0.5h-0.5v-7h-13v7h-0.5c-0.276 0-0.5-0.225-0.5-0.5v-14c0-0.275 0.224-0.5 0.5-0.5h1.5v6h10v-6h0.756l2.244 2.196v12.304z" fill="#000000" />
          </svg>`
          li.appendChild(divSalvar)
          divSalvar.querySelector('.svgSalvar').addEventListener('click', () => {

            function formatarDataInput(data) {
              if (!data) return 'Sem informações'; // Tratamento para data nula

              const dataComHora = data.includes('T') ? data : `${data}T00:00:00`;

              const dataObjeto = new Date(dataComHora);
              const dia = String(dataObjeto.getDate()).padStart(2, '0');
              const mes = String(dataObjeto.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
              const ano = dataObjeto.getFullYear();
              return `${dia}/${mes}/${ano}`;
            }

            let radioDisponivel = document.querySelector('.radioDisponivel2').checked;
            let valorDataPedido = document.querySelector('.dataPedido3').value;
            let valorPrevisaoDeChegada = document.querySelector('.previsaoDeChegada3').value;
            let cidade3 = document.querySelector('#searchInput').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');


            const novaDisponibilidade = radioDisponivel ? 'Disponível' : 'Indisponível';
            const novaDataPedido = novaDisponibilidade === 'Indisponível' ? valorDataPedido : null;
            const novaDataPrevisao = novaDisponibilidade === 'Indisponível' ? valorPrevisaoDeChegada : null;
            const itemId = item.id;
            const novoNomeRemedio = li.querySelector('.inputNovoNome').value;

            

            const dados2 = {
              cidade: cidade3,
              id: itemId,
              novo_nome_remedio: novoNomeRemedio,
              nova_disponibilidade: novaDisponibilidade,
              nova_data_pedido: novaDataPedido,
              nova_data_previsao: novaDataPrevisao
            }

            fetch(`http://localhost:3001/dados/${itemId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dados2) // Converte o objeto em JSON para enviar
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro ao enviar os dados');
                }
                return response.json();
              })
              .then(result => {
                console.log('Dados enviados com sucesso:', result);
                li.querySelector('.inputNovoNome').style.display = 'none'
                li.innerText = novoNomeRemedio
                pDisponibilidade.textContent = novaDisponibilidade || 'Sem informações'
                pDataPedido.textContent = `Data do pedido: ${formatarDataInput(novaDataPedido)}` || 'Sem informações'
                pDataPrevisao.textContent = `Previsão de chegada: ${formatarDataInput(novaDataPrevisao)}`  || 'Sem informações'
                
                if (novaDisponibilidade === 'Disponível') {
                    pDisponibilidade.classList.remove('indisponivel')
                    pDisponibilidade.classList.add('disponivel')
                    pDataPedido.style.display = 'none'
                    pDataPrevisao.style.display = 'none'
                // console.log(`Item ${item.nome_remedio} está disponível.`);
                  } else if (novaDisponibilidade === 'Indisponível') {
                    pDisponibilidade.classList.remove('disponivel')
                    pDisponibilidade.classList.add('indisponivel')
                    pDataPedido.style.display = 'block'
                    pDataPrevisao.style.display = 'block'
                    // console.log(`Item ${item.nome_remedio} está indisponível.`);
                  } else {
                    // Caso a disponibilidade tenha outro valor ou seja nula
                    console.log(`Item ${novoNomeRemedio} tem status desconhecido.`);
                  }
                  li.appendChild(pDisponibilidade);
                  li.appendChild(pDataPedido);
                  li.appendChild(pDataPrevisao);
                  li.appendChild(divEditar);
                  li.appendChild(divApagar);
                  
                  function closeModal() {
                    document.getElementById('myModal').style.display = 'none';
                  };

                  function openModal() {
                    document.querySelector('.pModal').innerHTML = `<span class="spanAdicionar">O remédio foi editado com sucesso!</span>`
                    document.getElementById('myModal').style.display = 'flex';
                  };

                  openModal();
                  document.querySelector('.close-modal').style.display = 'none';
                  document.querySelector('.btnConfirmarModal').innerText = 'Fechar';
                  document.querySelector('.btnConfirmarModal').addEventListener('click', closeModal);
                  // alert('Remédio editado com sucesso!')
              })
              .catch(error => {
                
                console.error('Erro ao enviar dados:', error);
                document.querySelector('#myModalErro').style.display = 'flex'
                document.querySelector('.pModalErro').innerHTML = 'Ocorreu um <span class="spanModalErro">ERRO</span>, revise as informações e tente novamente!'
                document.querySelector('.btnConfirmarModalErro').addEventListener('click', () => {
                  document.querySelector('#myModalErro').style.display = 'none'
                });
                // alert('Não foi possivel editar o remédio, verifique as informações e tente novamente!')
                divSalvar.style.display = 'block'
              });
            // Quando clicar no svg "svgSalvar" fazer o UPDATE com o WHERE = ${item.id ou li.id eu acho} dos novos dados que seriam "nome_remedio", "Disponibilidade", "data_pedido" e "data_previsao"
            // E colocar as informações novas na "li" para exibição
            divSalvar.style.display = 'none'
            divEditar.style.display = 'block'
          })
        // let li = document.querySelector('#itemList li')
        // li.appendChild(pDisponibilidade)
        // li.appendChild(pDataPedido)
        // li.appendChild(pDataPrevisao)
        // li.appendChild(divApagar)
        // li.appendChild(divSalvar)
      })

      divApagar.querySelector('.svgApagar').addEventListener('click', () => {
        const itemDeleteId = item.id;
        const cidade3 = document.querySelector('#searchInput').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        document.querySelector('.pModal').innerHTML = `Tem certeza que deseja excluir o remédio <span class="spanApagar">${item.nome_remedio}</span>?`
        

        document.querySelector('.pModalErro').innerHTML = 'Ocorreu um <span class="spanModalErro">ERRO</span>, tente excluir o remédio novamente!'
        // const userConfirmed = window.confirm(`Você tem certeza que deseja excluir o remédio ${item.nome_remedio}`);
        function openModal() {
            document.getElementById('myModal').style.display = 'flex';
            document.querySelector('.btnConfirmarModal').style.display = 'block';
            document.querySelector('.btnConfirmarModal').innerText = 'Confirmar';
            document.querySelector('.close-modal').style.display = 'block';
            document.querySelector('.close-modal').innerText = 'Voltar';
        }

        openModal()

        function apagarRemedio() {
            const cidadeFormatada = cidade3.replace(/\s+/g, '');
            fetch(`http://localhost:3001/dados/${cidadeFormatada}/${itemDeleteId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro ao enviar os dados');
                }
                return response.json();
              })
              .then(result => {
                console.log('Item deletado com sucesso:', result);
                li.style.display = 'none'
                updateItemList(cidadeFormatada)
                let searchInput2 = document.querySelector('#searchInput2');
                searchInput2.value = ''

                
                // alert('Remédio deletado com sucesso!')
              })
              .catch(error => {
                console.error('Erro ao deletar o item', error);
                document.querySelector('#myModalErro').style.display = 'flex'
                document.querySelector('.btnConfirmarModalErro').addEventListener('click', () => {
                  document.querySelector('#myModalErro').style.display = 'none'
                })
                // alert('Não foi possivel deletar o remédio, tente novamente!')
              }); 

            document.getElementById('myModal').style.display = 'none';
        };

        
        // Função para fechar o modal
        function closeModal() {
            document.getElementById('myModal').style.display = 'none';
        }

        document.querySelector('.btnConfirmarModal').addEventListener('click', () => {
          apagarRemedio()

        })

        document.querySelector('.close-modal').addEventListener('click', () => {
          closeModal()
        })

        // Fechar o modal clicando fora dele
        window.onclick = function(event) {
            const modal = document.getElementById('myModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
        // if(userConfirmed) {
          
        // };

        
        
      })
      });

      

      document.getElementById('searchInput2').addEventListener('keyup', function() {
        const input = this.value.toLowerCase();
        const items = itemList.querySelectorAll('li');


        // Os itens comentados são para fala que não achou nenhum remedio caso o usuário escreva algum remédio não encontrado.

        
        // let found = false;
        // const itemList2 = document.querySelector('#itemList');
        // const nenhumRemedio = document.createElement('p')
        // nenhumRemedio.textContent = 'Nenhum remédio foi encontrado com esse nome!'
        items.forEach(function(item) {
          const text = item.textContent.toLowerCase();
          if (text.includes(input)) {
            item.style.display = 'flex';
            // found = true;
          } else {
            item.style.display = 'none';
            // found = false;
          }

          // if(found == false) {
          //   itemList.appendChild(nenhumRemedio);
          // }
        });
      });
    })
    .catch(error => console.error('Erro:', error));


}


document.getElementById('searchInput').addEventListener('keyup', function() {
  const input = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o valor do input e converte para minúsculas
  const items = document.querySelectorAll('.itemList li'); // Seleciona todos os itens da lista

  items.forEach(function(item) { 
    const text = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o texto de cada item e converte para minúsculas
    if (text.includes(input)) { // Verifica se o texto do item contém o que foi digitado
      item.style.display = 'block'; // Mostra o item se ele contiver o texto
    } else {
      item.style.display = 'none'; // Esconde o item se não contiver o texto
    }
  });

  items.forEach(function(item) {
    item.addEventListener('click', () => {
      items.forEach(function(i) {
        i.style.display = 'none';
      });

      const textNormal = item.textContent;
      let cidade = item.textContent;
      cidade = cidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const main = document.querySelector('.main');
      main.innerHTML = `<div class="containerMain">
         <form class="divMainAdicionar">
        <div class="h2Adicionar">
          <h2>Adicionar remédio</h2>
        </div>
        <div class="search3">
          <input type="text" class="searchInput3" placeholder="Digite a cidade" required />
          <ul class="itemList2">
            <li>Goiânia</li>
            <li>Petrolina</li>
            <li>Anápolis</li>
            <li>Rio Verde</li>
          </ul>
        </div>
        <div class="divAdicionar">
          <label for="textAreaNomeRemedio">Digite o nome do remédio: </label>
          <textarea
            name="textAreaNomeRemedio"
            cols="30"
            rows="2"
            class="textAreaNomeRemedio"
            required
          ></textarea>
          <label for="">Disponibilidade: </label>
          <div class="disponibilidade">
            <label for="">Disponível: </label>
            <input
              type="radio"
              name="opcao"
              class="radioDisponivel"
              checked
            />
            <label for="">Indisponível: </label>
            <input type="radio" name="opcao" class="radioIndisponivel" />
          </div>
        </div>
        <div class="datas" style="display: none">
          <label for="dataPedido" class="dataPedido">Data do pedido: </label>
          <input type="date" name="dataPedido" class="dataPedido2"/>
          <label for="previsaoDeChegada" class="previsaoDeChegada"
            >Previsão de chegada:
          </label>
          <input type="date" name="previsaoDeChegada" class="previsaoDeChegada2"/>
        </div>
        <div class="confirmar">
          <button type="button" class="btnConfirmar">Confirmar</button>
        </div>
      </form>
        <h2>${textNormal}</h2>
        <input type="text" id="searchInput2" placeholder="Buscar Remédio">
        <ul id="itemList" style="display: flex;">
        
        </ul>
      </div>`;

      document.querySelector('.btnConfirmar').addEventListener('click', (event) => {
         event.preventDefault()
         const cidadeNormal = document.querySelector('.searchInput3').value;
         const cidade2 = document.querySelector('.searchInput3').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
         let valorNomeRemedio = document.querySelector('.textAreaNomeRemedio').value;
         let radioDisponivel = document.querySelector('.radioDisponivel').checked;
         let valorDataPedido = document.querySelector('.dataPedido2').value;
         let valorPrevisaoDeChegada = document.querySelector('.previsaoDeChegada2').value;
         document.querySelector('.pModalErro').innerHTML = 'Ocorreu um <span class="spanModalErro">ERRO</span>, revise as informações e tente novamente!'

         function closeModal() {
            document.getElementById('myModal').style.display = 'none';
         };

         function openModal() {
                document.querySelector('.pModal').innerHTML = `Sucesso!, o remédio <span class="spanAdicionar">${valorNomeRemedio}</span> foi adicionado a lista de <span class="spanAdicionar">${cidadeNormal}</span>!`
                document.getElementById('myModal').style.display = 'flex';
         };

         // Verifica se está "Disponível" ou "Indisponível" e constrói o objeto de dados
         const disponibilidade = radioDisponivel ? 'Disponível' : 'Indisponível';
         const dataPedido = disponibilidade === 'Indisponível' ? valorDataPedido : null;
         const dataPrevisao = disponibilidade === 'Indisponível' ? valorPrevisaoDeChegada : null;

         const dados = {
           cidade: cidade2,
           nome_remedio: valorNomeRemedio,
           disponibilidade: disponibilidade,
           data_pedido: dataPedido,
           data_previsao: dataPrevisao
         };

         fetch('http://localhost:3001/dados', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(dados) // Converte o objeto em JSON para enviar
               })
               .then(response => {
                 if (!response.ok) {
                   throw new Error('Erro ao enviar os dados');
                 }
                 return response.json();
               })
               .then(result => {
                 console.log('Dados enviados com sucesso:', result);
                 updateItemList(cidade2)
                 document.querySelector('.textAreaNomeRemedio').value = '';
                 document.querySelector('.dataPedido2').value = '';
                 document.querySelector('.previsaoDeChegada2').value = '';
                 openModal();
                 document.querySelector('.close-modal').style.display = 'none';
                 document.querySelector('.btnConfirmarModal').innerText = 'Fechar';
                 document.querySelector('.btnConfirmarModal').addEventListener('click', closeModal);
                //  alert(`O Remédio ${valorNomeRemedio} cadastrado para ${cidadeNormal} com sucesso!`)

               })
               .catch(error => {
                 console.error('Erro ao enviar dados:', error);
                 document.querySelector('#myModalErro').style.display = 'flex'
                 document.querySelector('.btnConfirmarModalErro').addEventListener('click', () => {
                  document.querySelector('#myModalErro').style.display = 'none'
                });
                //  alert('Não foi possivel cadastrar o remédio, verifique as informações e tente novamente! (Possivelmente ele ja está cadastrado!)')
               });        
      });
      
      updateItemList(cidade)
      document.getElementById('searchInput').value = textNormal;

      document.querySelector('.searchInput3').addEventListener('keyup', () => {
      const input = document.querySelector('.searchInput3').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o valor do input e converte para minúsculas
      const items = document.querySelectorAll('.itemList2 li'); // Seleciona todos os itens da lista
          
      items.forEach(function(item) { 
        const text = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o texto de cada item e converte para minúsculas
        if (text.includes(input)) { // Verifica se o texto do item contém o que foi digitado
          item.style.display = 'flex'; // Mostra o item se ele contiver o texto
        } else {
          item.style.display = 'none'; // Esconde o item se não contiver o texto
        }
      });
    
      items.forEach(function(item) {
        item.addEventListener('click', () => {
          items.forEach(function(i) {
            i.style.display = 'none';
          });
        
          let cidade2 = item.textContent;
          const textNormal = item.textContent;
          cidade2 = cidade2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          document.querySelector('.searchInput3').value = textNormal;
        });
      });
      })

      document.querySelector('.radioIndisponivel').addEventListener('click', () => {
        const datas = document.querySelector('.datas')
        datas.style.display = 'grid'

  
          document.querySelector('.radioDisponivel').addEventListener('click', () => {
             datas.style.display = 'none'
            })
      });
    });
  });
});

document.querySelector('.searchInput3').addEventListener('keyup', () => {
  const input = document.querySelector('.searchInput3').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o valor do input e converte para minúsculas
  const items = document.querySelectorAll('.itemList2 li'); // Seleciona todos os itens da lista

  items.forEach(function(item) { 
    const text = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Pega o texto de cada item e converte para minúsculas
    if (text.includes(input)) { // Verifica se o texto do item contém o que foi digitado
      item.style.display = 'flex'; // Mostra o item se ele contiver o texto
    } else {
      item.style.display = 'none'; // Esconde o item se não contiver o texto
    }
  });

  items.forEach(function(item) {
    item.addEventListener('click', () => {
      items.forEach(function(i) {
        i.style.display = 'none';
      });

      let cidade2 = item.textContent;
      const textNormal = item.textContent;
      cidade2 = cidade2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      document.querySelector('.searchInput3').value = textNormal;
    });
  });

  
})

document.querySelector('.radioIndisponivel').addEventListener('click', () => {
  const datas = document.querySelector('.datas')
  datas.style.display = 'grid'
  
    document.querySelector('.radioDisponivel').addEventListener('click', () => {
      datas.style.display = 'none'
    })


});


document.querySelector('.btnConfirmar').addEventListener('click', (event) => {
  event.preventDefault()
  const cidadeNormal = document.querySelector('.searchInput3').value;
  const cidade2 = document.querySelector('.searchInput3').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let valorNomeRemedio = document.querySelector('.textAreaNomeRemedio').value;
  let radioDisponivel = document.querySelector('.radioDisponivel').checked;
  let valorDataPedido = document.querySelector('.dataPedido2').value;
  let valorPrevisaoDeChegada = document.querySelector('.previsaoDeChegada2').value;

  // Verifica se está "Disponível" ou "Indisponível" e constrói o objeto de dados
  const disponibilidade = radioDisponivel ? 'Disponível' : 'Indisponível';
  const dataPedido = disponibilidade === 'Indisponível' ? valorDataPedido : null;
  const dataPrevisao = disponibilidade === 'Indisponível' ? valorPrevisaoDeChegada : null;
  document.querySelector('.pModalErro').innerHTML = 'Ocorreu um <span class="spanModalErro">ERRO</span>, revise as informações e tente novamente!'

  const dados = {
    cidade: cidade2,
    nome_remedio: valorNomeRemedio,
    disponibilidade: disponibilidade,
    data_pedido: dataPedido,
    data_previsao: dataPrevisao
  };

  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
  };

  function openModal() {
        document.querySelector('.pModal').innerHTML = `Sucesso!, o remédio <span class="spanAdicionar">${valorNomeRemedio}</span> foi adicionado a lista de <span class="spanAdicionar">${cidadeNormal}</span>!`
        document.getElementById('myModal').style.display = 'flex';
  };

  fetch('http://localhost:3001/dados', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados) // Converte o objeto em JSON para enviar
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar os dados');
      }
      return response.json();
    })
    .then(result => {
      console.log('Dados enviados com sucesso:', result);
      document.querySelector('.textAreaNomeRemedio').value = '';
      document.querySelector('.dataPedido2').value = '';
      document.querySelector('.previsaoDeChegada2').value = '';
      openModal();
      document.querySelector('.close-modal').style.display = 'none';
      document.querySelector('.btnConfirmarModal').innerText = 'Fechar';
      document.querySelector('.btnConfirmarModal').addEventListener('click', closeModal);
     //  alert(`O Remédio ${valorNomeRemedio} cadastrado para ${cidadeNormal} com sucesso!`)
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
      document.querySelector('#myModalErro').style.display = 'flex'
      document.querySelector('.btnConfirmarModalErro').addEventListener('click', () => {
       document.querySelector('#myModalErro').style.display = 'none'
     })
     //  alert('Não foi possivel cadastrar o remédio, verifique as informações e tente novamente! (Possivelmente ele ja está cadastrado!)')
    });
});