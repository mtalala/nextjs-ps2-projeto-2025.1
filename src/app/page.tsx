'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Sistema Simplificado de Gestão de OKRs</h1>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h2 className={styles.textTitle}>Contexto:</h2>
          <p className={styles.text}>Sua equipe foi selecionada para desenvolver um sistema simplificado de acompanhamento de OKRs (Objectives and Key Results). A ideia principal é que o sistema permita o registro de objetivos estratégicos, seus respectivos resultados-chave (KRs), e iniciativas relacionadas a esses resultados. O objetivo é possibilitar a visualização clara e objetiva do progresso, com a percentagem de conclusão das iniciativas refletindo automaticamente nos KRs e nos objetivos relacionados.</p>
        </div>
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
    </div>
  );
}
