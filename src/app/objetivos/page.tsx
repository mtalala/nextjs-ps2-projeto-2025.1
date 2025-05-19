import Link from 'next/link';
import styles from './objetivos.module.css';

export default function Objetivos() {
  return (
    <div className={styles.container}>
      <h1>Objetivos</h1>
      <nav className={styles.menu}>
        <Link href="/objetivos/criar-objetivos" className={styles.link}>Criar Objetivos</Link>
        <Link href="/objetivos/consultar-objetivos" className={styles.link}>Consultar Objetivos</Link>
        <Link href="/objetivos/atualizar-objetivos" className={styles.link}>Atualizar Objetivos</Link>
      </nav>
    </div>
  );
}
