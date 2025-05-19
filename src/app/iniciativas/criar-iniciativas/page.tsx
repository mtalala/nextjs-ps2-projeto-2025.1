'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './criar-iniciativas.module.css'; // reutilizando css de objetivos

interface ResultadoChave {
  id?: number;
  desc: string;
  porcentagemConc: number;
}

export default function CriarIniciativas() {
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [porcentagem, setPorcentagem] = useState(0);
  const [kr, setKr] = useState<ResultadoChave | null>(null);
  const [krs, setKrs] = useState<ResultadoChave[]>([]); // Lista de KRs para selecionar

  // Buscar KRs para seleção no form
  useEffect(() => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave')
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) setKrs(res);
        else if (res) setKrs([res]);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kr) {
      alert('Selecione um Resultado-Chave');
      return;
    }

    const novaIniciativa = {
      titulo,
      desc,
      porcentagemConcIndividual: porcentagem,
      kr,
    };

    try {
      const response = await fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaIniciativa),
      });

      if (!response.ok) throw new Error('Erro ao enviar dados');

      await response.json();

      setTitulo('');
      setDesc('');
      setPorcentagem(0);
      setKr(null);

      alert('Iniciativa criada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao criar iniciativa');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Criar Iniciativas</h1>

      <form onSubmit={handleSubmit} className={styles.form}>

        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label htmlFor="desc">Descrição:</label>
          <input
            type="text"
            id="desc"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label htmlFor="porcentagem">Porcentagem de Conclusão (%):</label>
          <input
            type="number"
            id="porcentagem"
            min={0}
            max={100}
            value={porcentagem}
            onChange={e => setPorcentagem(parseFloat(e.target.value))}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label htmlFor="krSelect">Resultado-Chave:</label>
          <select
            id="krSelect"
            value={kr?.id ?? ''}
            onChange={e => {
              const selected = krs.find(k => String(k.id) === e.target.value);
              setKr(selected ?? null);
            }}
            required
            className={styles.input}
          >
            <option value="" disabled>
              Selecione um Resultado-Chave
            </option>
            {krs.map(k => (
              <option key={k.id} value={k.id}>
                {k.id}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Criar Iniciativa
        </button>
      </form>

      <Link href="/iniciativas/consultar-iniciativas" className={styles.link}>
          Ver Iniciativas Criadas
      </Link>
    </div>
  );
}
