"use client"

import styles from './page.module.css'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import ProfileContent from './components/profileContent';

export default function Home() {
  return (
    <main className={styles.main} style={{backgroundColor: "#0a0a0a", color: "#fff"}}>
      <h1> FFB-Watcher Next.js Client</h1>

      <div className={styles.center}>
        <ProfileContent />
      </div>
    </main>
  )
}
