import styles from "./components.module.css";

export default function Header(){
  return (
    <header className={styles.AppHeader}>
      <nav id="headerNavigation" className={styles.HeaderLinks + " navbar navbar-expand-lg"}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#headerNavigation">FFB Watcher</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#RFID-Card">RFID Card</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#Profile-Setup">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#Tombola-Setup">Tombola</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
