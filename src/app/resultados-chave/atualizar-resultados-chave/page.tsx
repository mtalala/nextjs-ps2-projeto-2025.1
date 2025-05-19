'use client';

import { useEffect, useState } from 'react';
import styles from './atualizar-resultados-chave.module.css';

interface Objetivo {
  id: number;
  titulo: string;
}

interface ResultadoChave {
  id: number;
  desc: string;
  meta: string;
  porcentagemConc: number;
  obj: Objetivo;
}

export default function AtualizarResultadosChave() {
  const [idToDelete, setIdToDelete] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  const [resultadosChave, setResultadosChave] = useState<ResultadoChave[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [desc, setDesc] = useState('');
  const [meta, setMeta] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const fetchResultadosChave = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave')
      .then((res) => {
        if (!res.ok) throw new Error('Nenhum resultado-chave encontrado');
        return res.json();
      })
      .then((data) => setResultadosChave(data))
      .catch(() => setResultadosChave([]));
  };

  useEffect(() => {
    fetchResultadosChave();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      const kr = resultadosChave.find((r) => r.id === selectedId);
      if (kr) {
        setDesc(kr.desc);
        setMeta(kr.meta);
      }
    } else {
      setDesc('');
      setMeta('');
    }
  }, [selectedId, resultadosChave]);

  const handleDelete = async () => {
    if (!idToDelete.trim()) {
      alert('Selecione o ID do resultado-chave para apagar');
      return;
    }

    if (!window.confirm(`Tem certeza que quer apagar o resultado-chave ID ${idToDelete}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave/${idToDelete}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Erro ao apagar resultado-chave');

      setDeleteMsg(`Resultado-chave ID ${idToDelete} apagado com sucesso.`);
      setIdToDelete('');
      fetchResultadosChave();
    } catch {
      alert('Erro ao apagar resultado-chave. Verifique o ID e tente novamente.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedId === null) {
      alert('Selecione um resultado-chave para atualizar');
      return;
    }

    const krAtual = resultadosChave.find((r) => r.id === selectedId);
    if (!krAtual) {
      alert('Resultado-chave não encontrado');
      return;
    }

    const updatedKR: ResultadoChave = {
      ...krAtual,
      desc,
      meta,
    };

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave/${selectedId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedKR),
        }
      );

      if (!response.ok) throw new Error('Erro ao atualizar resultado-chave');

      alert('Resultado-chave atualizado com sucesso!');
      fetchResultadosChave();
    } catch {
      alert('Erro ao atualizar resultado-chave');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Atualizar Resultados-Chave</h1>

      {/* Apagar resultado-chave */}
      <button
        className={styles.collapsible}
        onClick={() => setShowDelete((prev) => !prev)}
        aria-expanded={showDelete}
      >
        Apagar Resultado-Chave
      </button>
      {showDelete && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="deleteSelect">Selecione o resultado-chave:</label>
            <select
              id="deleteSelect"
              value={idToDelete}
              onChange={(e) => setIdToDelete(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {resultadosChave.map((kr) => (
                <option key={kr.id} value={kr.id}>
                  {kr.id} - {kr.desc}
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

      {/* Atualizar resultado-chave */}
      <button
        className={styles.collapsible}
        onClick={() => setShowUpdate((prev) => !prev)}
        aria-expanded={showUpdate}
      >
        Atualizar Resultado-Chave
      </button>
      {showUpdate && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="selectKR">Selecione o resultado-chave:</label>
            <select
              id="selectKR"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">-- Selecione --</option>
              {resultadosChave.map((kr) => (
                <option key={kr.id} value={kr.id}>
                  {kr.id} - {kr.desc}
                </option>
              ))}
            </select>
          </div>

          {selectedId !== null && (
            <form onSubmit={handleUpdate} className={styles.form}>
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

              <div className={styles.inputBox}>
                <label htmlFor="meta">Meta:</label>
                <input
                  type="text"
                  id="meta"
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
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
