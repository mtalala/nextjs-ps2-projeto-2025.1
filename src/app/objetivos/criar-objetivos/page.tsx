'use client';

import { useState } from 'react';
import styles from './criar-objetivos.module.css';
import Link from 'next/link';

interface Objetivo {
  id: number;
  titulo: string;
  desc: string;
}

export default function CriarObjetivos() {
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoObjetivo: Objetivo = {
      id: Date.now(),
      titulo,
      desc,
    };

    try {
      const response = await fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoObjetivo),
      });

      if (!response.ok) throw new Error('Erro ao enviar dados');

      setTitulo('');
      setDesc('');

      alert('Objetivo criado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao criar objetivo');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Criar Objetivos</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="desc">Descrição:</label>
          <input
            type="text"
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Criar Objetivo
        </button>
      </form>

      <Link href="/objetivos/consultar-objetivos" className={styles.link}>
        Ver Objetivos Criados
      </Link>
    </div>
  );
}
