'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './criar-resultados-chave.module.css';
interface Objetivo {
  id?: number;
  titulo: string;
  desc?: string;
}

export default function CriarResultadosChave() {
  const [desc, setDesc] = useState('');
  const [meta, setMeta] = useState('');
  const [obj, setObj] = useState<Objetivo | null>(null);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);

  useEffect(() => {
    // Buscar objetivos para seleção
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos')
      .then(res => res.json())
      .then(res => {
        const objetivosLimpos = (Array.isArray(res) ? res : [res]).filter((o: Objetivo) => o.id !== undefined);
        setObjetivos(objetivosLimpos);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obj) {
      alert('Selecione um Objetivo');
      return;
    }

    const novoKR = {
      desc,
      meta,
      porcentagemConc: 0,
      obj: { id: obj.id },
    };

    try {
      const response = await fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoKR),
      });

      if (!response.ok) throw new Error('Erro ao enviar dados');

      setDesc('');
      setMeta('');
      setObj(null);

      alert('Resultado-Chave criado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao criar resultado-chave');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Criar Resultados-Chave</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
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
          <label htmlFor="meta">Meta:</label>
          <input
            type="text"
            id="meta"
            value={meta}
            onChange={e => setMeta(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label htmlFor="objSelect">Objetivo:</label>
          <select
            id="objSelect"
            value={obj?.id !== undefined ? String(obj.id) : ''}
            onChange={e => {
              const selecionado = objetivos.find(o => String(o.id) === e.target.value);
              setObj(selecionado ?? null);
            }}
            required
            className={styles.input}
          >
            <option value="" disabled>
              Selecione um Objetivo
            </option>
            {objetivos.map(o => (
              <option key={o.id ?? o.titulo} value={o.id}>
                {o.id}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Criar Resultado-Chave
        </button>
      </form>

      <Link href="/resultados-chave/consultar-resultados-chave" className={styles.link}>
          Ver Resultados-Chave Criados
      </Link>
    </div>
  );
}
