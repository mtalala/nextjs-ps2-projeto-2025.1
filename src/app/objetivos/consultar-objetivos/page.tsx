'use client';

import { useEffect, useState } from 'react';
import Table from '../../components/Table/Table';
import styles from './consultar-objetivos.module.css';

interface Iniciativa {
  id?: number;
  desc: string;
  porcentagemConcIndividual: number;
}

interface ResultadoChave {
  id?: number;
  desc: string;
  porcentagemConc: number;
  iniciativas?: Iniciativa[];
}

interface Objetivo {
  id: number;
  titulo: string;
  desc: string;
  porcentagemConcGeral: number;
  krs: ResultadoChave[];
}

export default function ConsultarObjetivos() {
  const [data, setData] = useState<Objetivo[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllObjetivos = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos')
      .then((res) => res.json())
      .then((res) => {
        const objetivos = Array.isArray(res) ? res : [res];
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

  useEffect(() => {
    fetchAllObjetivos();
  }, []);

  const handleSearch = () => {
    if (!searchField) {
      alert('Selecione um campo para pesquisar');
      return;
    }
    if (!searchTerm.trim()) {
      fetchAllObjetivos();
      return;
    }

    const baseUrl = 'https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos';
    const term = encodeURIComponent(searchTerm.trim());
    let url = baseUrl;

    switch (searchField) {
      case 'titulo':
        url += `/titulo/${term}`;
        break;
      case 'desc':
        url += `/desc/${term}`;
        break;
      case 'porcentagemConcGeral':
        url += `/porcentagem/${term}`;
        break;
      case 'id':
        url += `/${term}`;
        break;
      default:
        url = baseUrl;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Nenhum resultado encontrado');
        return res.json();
      })
      .then((res) => {
        const objetivos = Array.isArray(res) ? res : [res];
        const normalized = objetivos.map((obj) => ({
          ...obj,
          krs: Array.isArray(obj.krs) ? obj.krs.map((kr: any) => ({
            ...kr,
            iniciativas: Array.isArray(kr.iniciativas) ? kr.iniciativas : [],
          })) : [],
        }));
        setData(normalized);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  };

  const objetivoColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Descrição', accessor: 'desc' },
    { header: 'Conclusão Geral (%)', accessor: 'porcentagemConcGeral' },
    { header: 'Resultados-Chave', accessor: 'krs' },
  ];

  const krColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Descrição', accessor: 'desc' },
    { header: 'Conclusão (%)', accessor: 'porcentagemConc' },
    { header: 'Iniciativas', accessor: 'iniciativas' },
  ];

  const iniciativaColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Descrição', accessor: 'desc' },
    { header: 'Conclusão (%)', accessor: 'porcentagemConcIndividual' },
  ];

  return (
    <div className={styles.container}>
      <h1>Consultar Objetivos</h1>

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
          <option value="porcentagemConcGeral">Porcentagem de Conclusão Geral</option>
          <option value="id">ID</option>
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
          columns={objetivoColumns}
          data={data.map((obj) => ({
            id: obj.id,
            titulo: obj.titulo,
            desc: obj.desc,
            porcentagemConcGeral: obj.porcentagemConcGeral + '%',
            krs: (
              <Table
                columns={krColumns}
                data={(obj.krs ?? []).map((kr) => ({
                  id: kr.id,
                  desc: kr.desc,
                  porcentagemConc: kr.porcentagemConc + '%',
                  iniciativas: (
                    <Table
                      columns={iniciativaColumns}
                      data={(kr.iniciativas ?? []).map((ini) => ({
                        id: ini.id,
                        desc: ini.desc,
                        porcentagemConcIndividual: ini.porcentagemConcIndividual + '%',
                      }))}
                    />
                  ),
                }))}
              />
            ),
          }))}
        />
      ) : (
        <p>Nenhum objetivo encontrado.</p>
      )}
    </div>
  );
}
