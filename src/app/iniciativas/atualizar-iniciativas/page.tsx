'use client';

import { useEffect, useState } from 'react';
import styles from './atualizar-iniciativas.module.css';

interface ResultadoChave {
  id?: number;
  desc: string;
  porcentagemConc: number;
}

interface Iniciativa {
  id: number;
  titulo: string;
  desc: string;
  porcentagemConcIndividual: number;
  kr: ResultadoChave;
}

export default function AtualizarIniciativas() {
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [krs, setKrs] = useState<ResultadoChave[]>([]);

  const [idToDelete, setIdToDelete] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [porcentagem, setPorcentagem] = useState(0);
  const [kr, setKr] = useState<ResultadoChave | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const fetchIniciativas = () => {
    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas')
      .then(res => res.json())
      .then(data => setIniciativas(Array.isArray(data) ? data : [data]))
      .catch(() => setIniciativas([]));
  };

  useEffect(() => {
    fetchIniciativas();

    fetch('https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/resultados-chave')
      .then(res => res.json())
      .then(data => setKrs(Array.isArray(data) ? data : [data]))
      .catch(() => setKrs([]));
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      const iniciativa = iniciativas.find(i => i.id === selectedId);
      if (iniciativa) {
        setTitulo(iniciativa.titulo);
        setDesc(iniciativa.desc);
        setPorcentagem(iniciativa.porcentagemConcIndividual);
        setKr(iniciativa.kr);
      }
    } else {
      setTitulo('');
      setDesc('');
      setPorcentagem(0);
      setKr(null);
    }
  }, [selectedId, iniciativas]);

  const handleDelete = async () => {
    if (!idToDelete.trim()) {
      alert('Selecione uma iniciativa para apagar');
      return;
    }

    if (!window.confirm(`Tem certeza que quer apagar a iniciativa ID ${idToDelete}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas/${idToDelete.trim()}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error();

      setDeleteMsg(`Iniciativa ID ${idToDelete} apagada com sucesso.`);
      setIdToDelete('');
      fetchIniciativas();
    } catch {
      alert('Erro ao apagar iniciativa. Verifique o ID e tente novamente.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedId === null || !kr) {
      alert('Selecione uma iniciativa e um Resultado-Chave');
      return;
    }

    const updated: Iniciativa = {
      id: selectedId,
      titulo,
      desc,
      porcentagemConcIndividual: porcentagem,
      kr,
    };

    try {
      const response = await fetch(
        `https://reimagined-eureka-97qvj654xg4rc9p6v-8080.app.github.dev/iniciativas/${selectedId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }
      );

      if (!response.ok) throw new Error();

      alert('Iniciativa atualizada com sucesso!');
      fetchIniciativas();
    } catch {
      alert('Erro ao atualizar iniciativa');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Atualizar Iniciativas</h1>

      {/* Apagar Iniciativa */}
      <button className={styles.collapsible} onClick={() => setShowDelete(p => !p)}>
        Apagar Iniciativa por ID
      </button>
      {showDelete && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="deleteSelect">Selecione a Iniciativa:</label>
            <select
              id="deleteSelect"
              value={idToDelete}
              onChange={e => setIdToDelete(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {iniciativas.map(i => (
                <option key={i.id} value={String(i.id)}>
                  {i.id} - {i.titulo}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleDelete} className={styles.deleteButton}>Apagar</button>
          {deleteMsg && <p className={styles.confirmation}>{deleteMsg}</p>}
        </div>
      )}

      {/* Atualizar Iniciativa */}
      <button className={styles.collapsible} onClick={() => setShowUpdate(p => !p)}>
        Atualizar Iniciativa
      </button>
      {showUpdate && (
        <div className={styles.content}>
          <div className={styles.inputBox}>
            <label htmlFor="selectIniciativa">Selecione a iniciativa:</label>
            <select
              id="selectIniciativa"
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">-- Selecione --</option>
              {iniciativas.map(i => (
                <option key={i.id} value={i.id}>
                  {i.id} - {i.titulo}
                </option>
              ))}
            </select>
          </div>

          {selectedId !== null && (
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.inputBox}>
                <label htmlFor="titulo">Título:</label>
                <input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputBox}>
                <label htmlFor="desc">Descrição:</label>
                <input
                  id="desc"
                  type="text"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputBox}>
                <label htmlFor="porcentagem">Porcentagem de Conclusão (%):</label>
                <input
                  id="porcentagem"
                  type="number"
                  min={0}
                  max={100}
                  value={porcentagem}
                  onChange={e => setPorcentagem(parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className={styles.inputBox}>
                <label htmlFor="krSelect">Resultado-Chave:</label>
                <select
                  id="krSelect"
                  value={kr?.id ?? ''}
                  onChange={e => {
                    const selected = krs.find(k => String(k.id) === e.target.value);
                    setKr(selected ?? null);
                  }}
                >
                  <option value="">Selecione um Resultado-Chave</option>
                  {krs.map(k => (
                    <option key={k.id} value={k.id}>{k.id}</option>
                  ))}
                </select>
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
