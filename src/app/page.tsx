'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Sistema Simplificado de Gestão de OKRs</h1>
      <nav className={styles.menu}>
        <Link href="/objetivos" className={styles.menuButton}>
          Objetivos
        </Link>
        <Link href="/resultados-chave" className={styles.menuButton}>
          Resultados-Chave
        </Link>
        <Link href="/iniciativas" className={styles.menuButton}>
          Iniciativas
        </Link>
      </nav>
    </div>
  );
}
