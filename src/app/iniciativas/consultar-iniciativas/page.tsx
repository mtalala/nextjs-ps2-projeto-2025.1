'use client';

import { useEffect, useState } from 'react';
import Table from '@/app/components/Table/Table';
import styles from './consultar-iniciativas.module.css';

interface ResultadoChave {
  id?: number;
  desc: string;
  porcentagemConc: number;
}

interface Iniciativa {
  id?: number;
  titulo: string;
  desc: string;
  porcentagemConcIndividual: number;
  kr: ResultadoChave;
}

export default function ConsultarIniciativas() {
  const [data, setData] = useState<Iniciativa[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchAllIniciativas = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas')
      .then((res) => {
        if (!res.ok) throw new Error('Nenhuma iniciativa encontrada');
        return res.json();
      })
      .then((res) => {
        const iniciativas = Array.isArray(res) ? res : [res];
        setData(iniciativas);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  };

  useEffect(() => {
    fetchAllIniciativas();
  }, []);

  const handleSearch = () => {
    if (!searchField) {
      alert('Selecione um campo para pesquisar');
      return;
    }

    if (!searchTerm.trim()) {
      fetchAllIniciativas();
      return;
    }

    const baseUrl = 'https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas';
    const param = encodeURIComponent(searchTerm.trim());
    let url = baseUrl;

    switch (searchField) {
      case 'titulo':
        url += `/titulo/${param}`;
        break;
      case 'desc':
        url += `/descricao/${param}`;
        break;
      case 'porcentagemConcIndividual':
        url += `/porcentagem/${param}`;
        break;
      case 'krId':
        url += `/resultado-chave/${param}`;
        break;
      default:
        url = baseUrl;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Nenhuma iniciativa encontrada');
        return res.json();
      })
      .then((res) => {
        const iniciativas = Array.isArray(res) ? res : [res];
        setData(iniciativas);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Descrição', accessor: 'desc' },
    { header: 'Conclusão (%)', accessor: 'porcentagemConcIndividual' },
    // coluna Resultado-Chave removida
  ];

  return (
    <div className={styles.container}>
      <h1>Consultar Iniciativas</h1>

      <div className={styles.searchBar}>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>
            Pesquisar por
          </option>
          <option value="titulo">Título</option>
          <option value="desc">Descrição</option>
          <option value="porcentagemConcIndividual">Conclusão (%)</option>
          <option value="krId">ID do Resultado-Chave</option>
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o termo da pesquisa"
          className={styles.input}
        />

        <button onClick={handleSearch} className={styles.button} disabled={!searchField}>
          Buscar
        </button>
      </div>

      {data.length > 0 ? (
        <Table
          columns={columns}
          data={data.map((i) => ({
            id: i.id,
            titulo: i.titulo,
            desc: i.desc,
            porcentagemConcIndividual: i.porcentagemConcIndividual + '%',
            // removido krDescricao
          }))}
        />
      ) : (
        <p>Nenhuma iniciativa encontrada.</p>
      )}
    </div>
  );
}
