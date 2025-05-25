# Documentação do código: 

## Sumário
* [Integração com back-end ](#integracao)
    * [Exemplo do controller no Back-end](#back)
    * [Exemplo da requisição no Front-end](#front)
* [Components](#components)
* [Objetivos](#obj)
* [Iniciativas](#iniciativas)
* [Resultados-Chave](#kr)
* [global.css + layout](#global)
* [page](#page)
* [Autoras](#autoras)


<div id='integracao'/> 


## Integração com back-end 
Para o back-end aceitar a requisição da API de um front-end, utilizamos o `@CrossOrigin(origins = "*")` nos controllers, porque o navegador tyem uma política de same-origin, que bloqueia automaticamente as requisições entre esses domínios diferentes por motivos de segurança. O `@CrossOrigin` remove essa restrição.

 O  `@CrossOrigin(origins = "*")` é uma anotação do Spring Framework Java que permite solicitações entre origens diferentes (cross-origin) a um endpoint específico do nosso back-end. O parâmetro `origins = "*"` permite acesso de qualquer origem.

<div id='back'>

* ### Exemplo do controller no Back-end:

```java

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/objetivos")
public class ObjetivoController {
    private final ObjetivoService objetivoService;

    public ObjetivoController(ObjetivoService objetivoService, ObjetivoRepository objetivoRepository) {
        this.objetivoService = objetivoService;
    }
...
}

```
</div>
<div id='front'>

* ### Exemplo da requisição no Front-end:

   ```javascript
   const fetchAllObjetivos = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos')
      .then((res) => res.json())
      .then((res) => {
        const objetivos = Array.isArray(res) ? res : [res]; // se a resposta n for um array, coloca dentro de um array

        //para cada obj, garante que kr e iniciativa seja um array
        const normalized = objetivos.map((obj) => ({
          ...obj,
          krs: Array.isArray(obj.krs) ? obj.krs.map((kr: any) => ({
            ...kr,
            iniciativas: Array.isArray(kr.iniciativas) ? kr.iniciativas : [],
          })) : [],
        }));
        setData(normalized);
      })
      .catch(console.error);
  };
   ```

   Nesse trecho de código da função `fetchAllObjetivos`, a requisição acontece da seguinte maneira:

   1- `fetch()` faz uma chamada GET para o endpoint `/objetivos` do back-end
    * Recebe a requisição do front-end
    * Verifica o cabeçalho `Origin`
    * Se permitido pelo `@CrossOrigin`, processa e retorna a resposta com cabeçalho adequado

   2- O primeiro`.then()` converte a resposta em JSON

   3- O segundo `.then()` processa os dados recebidos

   4- O `.catch(console.error)` captura e exibe no console qualquer erro que tenha ocorrido durante a requisição

 

</div>


<div id='estrutura'>

## Estrutura do código: 
```
>src/app
|
|------>componentes
        |
        |->Sidebar 
            |_Sidebar.module.css
            |_Sidebar.tsx
        |
        |->Table
            |_Table.module.css
            |_Table.tsx
        |
        |->ToggleButton
            |_ToggleButton.module.css
            |_ToggleButton.tsx
|
|------>iniciativas
        |
        |->atualizar-iniciativas
            |
            |_atualizar-iniciativas.module.css
            |_page.tsx
        |
        |->consultar-iniciativas
            |
            |_consultar-iniciativas.module.css
            |_page.tsx
        |
        |->criar-iniciativas
            |
            |_criar-iniciativas.module.css
            |_page.tsx
        |
        |_iniciativas.module.css
        |
        |_page.tsx
|
|------>objetivos
        |
        |->atualizar-objetivos
            |
            |_atualizar-objetivos.module.css
            |_page.tsx
        |
        |->consultar-objetivos
            |
            |_consultar-objetivos.module.css
            |_page.tsx
        |
        |->criar-objetivos
            |
            |_criar-objetivos.module.css
            |_page.tsx
        |
        |_objetivos.module.css
        |
        |_page.tsx
|
|------>resultados-chave
        |
        |->atualizar-resultados-chave
            |
            |_atualizar-resultados-chave.module.css
            |_page.tsx
        |
        |->consultar-resultados-chave
            |
            |_consultar-resultados-chave.module.css
            |_page.tsx
        |
        |->criar-resultados-chave
            |
            |_criar-resultados-chave.module.css
            |_page.tsx
        |
        |_resultados-chave.module.css
        |
        |_page.tsx
|
|------>globals.css
|
|------>layout.tsx
|
|------>page.module.css
|
|------>page.tsx
```

</div>

<div id='components'>

## Components
A componentização é utilizada para evitar a repetição de trechos de códigos de elementos que serão utilizados em multiplas páginas. No contexto do nosso projeto, decidimos componentizar a estilização e a estrutura dos seguintes elementos: 

* ### Sidebar:

   - Menu lateral responsivo que pode ser expandido/recolhido
   - Navegação entre as seções principais (Objetivos, Resultados-Chave, Iniciativas)
   - Estilização com CSS Modules para isolamento de estilos
     
   A Sidebar é composta pelos arquivos `Sidebar.tsx` e `Sidebar.module.css`. No arquivo `.tsx` estão presentes o botão hamburguer, para expandi-la, o `<nav>` que possui uma lista de tags `<Link>` importada do 'next/link', os quais são responsáveis por redirecionar para outras páginas. Já no arquivo `.module.css` estão as classes de estilização dos elementos presentes no arquivo `.tsx`.

   - visualização: 

    ![alt text](image.png)


* ### Table: 

   - Componente reutilizável para exibição tabular de dados
   - Suporta aninhamento para mostrar relações hierárquicas (Objetivos → KRs → Iniciativas)
   - Estilização alternada de linhas para melhor legibilidade
   - Estilos alternados (`.light`/`.dark`) entre os campos da tabela. 
     
   A Table é composta pelos arquivos `Table.tsx` e `Table.module.css`. No arquivo `.tsx` estão presentes as tags `<table>`, `<thead>` e `<tbody>` que possui as tags `<tr>` dentro, os quais são responsáveis pelas linhas e colunas de uma tabela. 

   A tabela recebe duas props que definirão os dados e as colunas da tabela criada, se adaptando dinamicamente ao contexto de ojetivos, resultados-chaves e iniciativas, os quais possuem diferentes quantidades de atributos, o que altera a quantidade de linhas e colunas das tabelas.


   - visualização: 
    ![alt text](image-1.png)


* ### ToggleButton

   - Componente para alternar estados (usado para expandir/recolher seções)
   - Integrado com o sistema de temas (claro/escuro)

</div>
<div id='obj'>

## Objetivos  
//trechos de código consultar, atualizar, criar + css

### Páginas de Consulta:

A página ConsultarObjetivos é a interface principal para visualização e busca de objetivos no sistema, apresentando os dados tanto em formato de cards interativos, a fim de uma melhor esperiência de usuário, quanto em tabela hierárquica.

* Barra de pesquisa com filtros por diferentes campos
  - Filtragem por diferentes campos (título, descrição, porcentagem ou ID)
   - Validação para evitar pesquisas sem campo selecionado
   - Botão de busca que aciona a requisição à API

     ```tsx
         const handleSearch = () => {
        let url = baseUrl;
        
        switch(searchField) {
          case 'titulo': url += `/titulo/${term}`; break;
          case 'desc': url += `/desc/${term}`; break;
          case 'porcentagem': url += `/porcentagem/${term}`; break;
          case 'id': url += `/${term}`; break;
        }
      
        fetch(url)
          .then(/* ... */)
          .then(/*normalização */)
          .then(setData);
      };
     ```
     
* Visualização alternativa em tabela hierárquica
     - utilizacção do componente Table
  
* Visualização em cards interativos com:
   - Seções expansíveis para KRs e Iniciativas
   - Indicadores visuais de progresso (porcentagens)
   - Design responsivo que se adapta a diferentes tamanhos de tela


   ```tsx
      <div className={styles.cardContainer}>
     {data.map((obj) => (
       <div key={obj.id} className={styles.objetivoCard}>
         {/* Conteúdo do objetivo */}
         {obj.krs.map((kr) => (
           <div key={kr.id} className={styles.krCard}>
             {/* Conteúdo do KR */}
             {isExpanded && (
               <div className={styles.iniciativasContainer}>
                 {/* Iniciativas expandidas */}
               </div>
             )}
           </div>
         ))}
       </div>
     ))}
   </div>
   ```


### Páginas de Criação:
A página CriarObjetivos permite aos usuários cadastrar novos objetivos no sistema através de um formulário simples e intuitivo, com integração direta à API back-end.

* Estados do Componente:
   - Controla os campos do formulário (título e descrição)
   - Inicializados como strings vazias 

```
const [titulo, setTitulo] = useState('');
const [desc, setDesc] = useState('');
```
  
* Estrutura do Formulário:
   - Dois campos obrigatórios (título e descrição)
   - Validação HTML5 (required)
   - Estilização via CSS Modules

* Link de Navegação 
   - Redireciona para a página de consulta
 
* Submissão do formulário:

   - código

 ```typescript

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const novoObjetivo: Objetivo = {
          id: Date.now(), // ID temporário
          titulo,
          desc,
        };
      
        try {
          const response = await fetch(API_URL + '/objetivos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoObjetivo),
          });
      
          if (!response.ok) throw new Error('Erro ao enviar dados');
      
          // Reset do formulário
          setTitulo('');
          setDesc('');
      
          alert('Objetivo criado com sucesso!');
        } catch (error) {
          console.error('Erro ao enviar dados:', error);
          alert('Erro ao criar objetivo');
        }
      };

```
     
1 - Previne comportamento padrão do formulário

2 - Cria objeto Objetivo com:

   - 2.1 - ID gerado temporariamente (timestamp)
   
   - 2.2 - Título e descrição dos estados
   
3 - Envia requisição POST para a API

4 - Trata resposta:

   - 4.1 - Sucesso: Limpa formulário e exibe alerta
   
   - 4.2 - Erro: Log no console e alerta usuário
     

</div>

<div id='iniciativas'>

## Iniciativas
//trechos de código consultar, atualizar, criar + css

</div>
<div id='kr'>

## Resultados-Chave
//trechos de código consultar, atualizar, criar + css

</div>
<div id='global'>

## global.css + layout

</div>
<div id='page'>

## page 
// css + tsx

</div>

<div id='autoras'>

## Autoras
* Carolina Sun Ramos Nantes de Castilho
* Millie Talala Zogheib

</div>
