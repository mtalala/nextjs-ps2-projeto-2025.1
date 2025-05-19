'use client';

import { useEffect, useState } from 'react';
import styles from './consultar-resultados-chave.module.css';
import Table from '../../components/Table/Table';

interface Iniciativa {
  id: number;
  titulo: string;
  desc?: string;
}

interface ResultadoChave {
  id: number;
  desc: string;
  meta: string;
  porcentagemConc: number;
  iniciativas: Iniciativa[];
}

export default function ConsultarResultadosChave() {
  const [data, setData] = useState<ResultadoChave[]>([]);
  const [filterBy, setFilterBy] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFilteredResults = async () => {
    setLoading(true);
    try {
      let url = 'https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave';

      if (filterBy && searchText.trim() !== '') {
        const param = encodeURIComponent(searchText.trim());
        switch (filterBy) {
          case 'desc':
            url += `/descricao/${param}`;
            break;
          case 'meta':
            url += `/meta/${param}`;
            break;
          case 'porcentagemConc':
            url += `/porcentagem/${param}`;
            break;
          case 'id':
            url += `/${param}`;
            break;
        }
      }

      const res = await fetch(url);
      const json = await res.json();

      const resultados = Array.isArray(json) ? json : [json];
      const normalized = resultados.map((r) => ({
        ...r,
        iniciativas: Array.isArray(r.iniciativas) ? r.iniciativas : [],
      }));
      setData(normalized);
    } catch (err) {
      console.error('Erro ao buscar resultados-chave:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredResults();
  }, []);

  const resultadoColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Descrição', accessor: 'desc' },
    { header: 'Meta', accessor: 'meta' },
    { header: 'Conclusão (%)', accessor: 'porcentagemConc' },
    { header: 'Iniciativas', accessor: 'iniciativas' },
  ];

  return (
    <div className={styles.container}>
      <h1>Consultar Resultados-Chave</h1>

      <div className={styles.searchBar}>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className={styles.selectInput}
          required
        >
          <option value="" disabled>
            Pesquisar por
          </option>
          <option value="desc">Descrição</option>
          <option value="meta">Meta</option>
          <option value="porcentagemConc">Conclusão (%)</option>
          <option value="id">ID</option>
        </select>

        <input
          type="text"
          placeholder="Digite o texto para busca"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.textInput}
          disabled={!filterBy}
        />

        <button
          onClick={fetchFilteredResults}
          className={styles.submitButton}
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : data.length > 0 ? (
        <Table
          columns={resultadoColumns}
          data={data.map((r) => ({
            id: r.id,
            desc: r.desc,
            meta: r.meta,
            porcentagemConc: `${r.porcentagemConc}%`,
            iniciativas: (
              <Table
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Título', accessor: 'titulo' },
                  { header: 'Descrição', accessor: 'desc' },
                ]}
                data={r.iniciativas.map((i) => ({
                  id: i.id,
                  titulo: i.titulo,
                  desc: i.desc ?? '(sem descrição)',
                }))}
              />
            ),
          }))}
        />
      ) : (
        <p>Nenhum resultado-chave encontrado.</p>
      )}
    </div>
  );
}
