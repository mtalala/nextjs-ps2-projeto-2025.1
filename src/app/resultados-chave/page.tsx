'use client';

import Link from 'next/link';
import styles from './resultados-chave.module.css'; // Crie esse CSS ou reutilize outro existente

export default function ResultadosChavePage() {
  return (
    <div className={styles.container}>
      <h1>Resultados-Chave</h1>

      <nav className={styles.nav}>
        <Link href="/resultados-chave/criar-resultados-chave" className={styles.link}>
          Criar Resultados-Chave
        </Link>
        <Link href="/resultados-chave/consultar-resultados-chave" className={styles.link}>
          Consultar Resultados-Chave
        </Link>
        <Link href="/resultados-chave/atualizar-resultados-chave" className={styles.link}>
          Atualizar Resultados-Chave
        </Link>
      </nav>
    </div>
  );
}
