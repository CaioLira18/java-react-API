import { useEffect, useState } from 'react'
import './App.css'
import Formulario from './components/Formulario'
import Tabela from './components/Tabela'

function App() {

  // Objeto produto
  const produto = {
    codigo : 0,
    nome : '',
    marca : ''
  }


  // UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produtos);

  // UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar").then(retorno => retorno.json()).then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  // Obtendo os dados do Formulario
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]: e.target.value});
  }

  // Remover Produto
  const remover = () => {
    fetch("http://localhost:8080/remover/" + setObjProduto.codigo, {
      method:'delete', 
      body: JSON.stringify(objProduto),
      headers:{
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }     
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      // Mensagem
      alert(retorno_convertido.mensagem);

      // Copia do vetor de produtos
      let vetorTemp = [...produtos];

      // Indice
      let indice = vetorTemp.findIndex((p) => {
        return p.codigo === objProduto.codigo;
      });

      // Remover produto do vetorTemp
      vetorTemp.splice(indice, 1);

      // Atualizar o vetor de produtos
      setProdutos(vetorTemp);
      


      // Limpar Formulario
      limparFormulario();

    })
  }

  // Cadastrar Produto
  const cadastrar = () => {
    fetch("http://localhost:8080/cadastrar", {
      method:'post', 
      body: JSON.stringify(objProduto),
      headers:{
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }     
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      } else {
        setProdutos([...produtos, retorno_convertido]);
        alert("Produto Cadastrado com sucesso");
        limparFormulario();
      }
    })
  }

  // Alterar Produto
  const alterar = () => {
    fetch("http://localhost:8080/alterar", {
      method:'put', 
      body: JSON.stringify(objProduto),
      headers:{
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }     
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      } else {
        alert("Produto Alterado com sucesso");

        // Copia do vetor de produtos
        let vetorTemp = [...produtos];

        // Indice
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        });

        // Alterar produto do vetorTemp
        vetorTemp[indice] = objProduto;

        // Atualizar o vetor de produtos
        setProdutos(vetorTemp);

        // Limpar o Formulario
        limparFormulario();

      }
    })
  }

  // Limpar Formulario
  const limparFormulario = () => {
    setObjProduto(produtos);
    setBtnCadastrar(true);
  }

  // Selecionar Produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  return (
      <div>  
        <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}/>
        <Tabela  vetor={produtos} selecionar={selecionarProduto} />
      </div>
  )
}

export default App;
