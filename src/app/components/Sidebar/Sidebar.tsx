"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../../globals.css";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
    
    setIsOpen(false);
  }, [pathname]); 

  return (
    <div className={styles.container}>
      <button
        className={styles['side-button']}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          viewBox="0 0 100 80"
          fill="currentColor"
          className={styles['svg-button']}
        >
          <rect className={styles.rect}></rect>
          <rect className={styles.rect} y="30"></rect>
          <rect className={styles.rect} y="60"></rect>
        </svg>
      </button>

      <nav
        className={`${styles['nav-menu']} ${isOpen ? styles.open : ""}`}
      >
        <button
          className={styles['nav-button']}
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>

        <ul className={styles['nav-list']}>
          <Link href="/">
            <li className={styles['nav-item']}>Home</li>
          </Link>
          <Link href="/objetivos">
            <li className={styles['nav-item']}>Objetivos</li>
          </Link>
          <Link href="/resultados-chave">
            <li className={styles['nav-item']}>Resultados-Chave</li>
          </Link>
          <Link href="/iniciativas">
            <li className={styles['nav-item']}>Iniciativas</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}
