'use client';

import { useEffect, useState } from 'react';
import styles from './atualizar-objetivos.module.css';

interface Objetivo {
  id: number;
  titulo: string;
  desc: string;
}

export default function AtualizarObjetivos() {
  const [idToDelete, setIdToDelete] = useState<string>('');
  const [deleteMsg, setDeleteMsg] = useState<string>('');

  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const fetchObjetivos = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos')
      .then((res) => {
        if (!res.ok) throw new Error('Nenhum objetivo encontrado');
        return res.json();
      })
      .then((data) => setObjetivos(data))
      .catch(() => setObjetivos([]));
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      const objetivo = objetivos.find((o) => o.id === selectedId);
      if (objetivo) {
        setTitulo(objetivo.titulo);
        setDesc(objetivo.desc);
      }
    } else {
      setTitulo('');
      setDesc('');
    }
  }, [selectedId, objetivos]);

  const handleDelete = async () => {
    if (!idToDelete.trim()) {
      alert('Selecione o ID do objetivo para apagar');
      return;
    }

    if (!window.confirm(`Tem certeza que quer apagar o objetivo ID ${idToDelete}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos/${idToDelete.trim()}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao apagar objetivo');
      }

      setDeleteMsg(`Objetivo ID ${idToDelete} apagado com sucesso.`);
      setIdToDelete('');
      fetchObjetivos();
    } catch {
      alert('Erro ao apagar objetivo. Verifique o ID e tente novamente.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedId === null) {
      alert('Selecione um objetivo para atualizar');
      return;
    }

    const updatedObjetivo: Objetivo = {
      id: selectedId,
      titulo,
      desc,
    };

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/objetivos/${selectedId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedObjetivo),
        }
      );

      if (!response.ok) throw new Error('Erro ao atualizar objetivo');

      alert('Objetivo atualizado com sucesso!');
      fetchObjetivos();
    } catch {
      alert('Erro ao atualizar objetivo');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Atualizar Objetivos</h1>

      {/* Apagar objetivo */}
      <button
        className={styles.collapsible}
        onClick={() => setShowDelete((prev) => !prev)}
        aria-expanded={showDelete}
      >
        Apagar Objetivo
      </button>
      {showDelete && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="deleteSelect">Selecione o objetivo:</label>
            <select
              id="deleteSelect"
              value={idToDelete}
              onChange={(e) => setIdToDelete(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {objetivos.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.id} - {obj.titulo}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={!idToDelete}
          >
            Apagar
          </button>
          {deleteMsg && <p className={styles.confirmation}>{deleteMsg}</p>}
        </div>
      )}

      {/* Atualizar objetivo */}
      <button
        className={styles.collapsible}
        onClick={() => setShowUpdate((prev) => !prev)}
        aria-expanded={showUpdate}
      >
        Atualizar Objetivo
      </button>
      {showUpdate && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="selectObjetivo">Selecione o objetivo:</label>
            <select
              id="selectObjetivo"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">-- Selecione --</option>
              {objetivos.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.id} - {obj.titulo}
                </option>
              ))}
            </select>
          </div>

          {selectedId !== null && (
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.inputBox}>
                <label htmlFor="titulo">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputBox}>
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
                Confirmar Atualização
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
