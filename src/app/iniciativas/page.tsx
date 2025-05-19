'use client';

import Link from 'next/link';
import styles from './iniciativas.module.css';

export default function Iniciativas() {
  return (
    <div className={styles.container}>
      <h1>Iniciativas</h1>
      <nav className={styles.menu}>
        <Link href="/iniciativas/criar-iniciativas" className={styles.menuButton}>
          Criar Iniciativas
        </Link>
        <Link href="/iniciativas/consultar-iniciativas" className={styles.menuButton}>
          Consultar Iniciativas
        </Link>
        <Link href="/iniciativas/atualizar-iniciativas" className={styles.menuButton}>
          Atualizar Iniciativas
        </Link>
      </nav>
    </div>
  );
}
