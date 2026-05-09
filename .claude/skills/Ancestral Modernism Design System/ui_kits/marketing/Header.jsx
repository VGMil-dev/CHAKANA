function Header() {
  return (
    <header className="cm-header">
      <a href="#" className="brand">
        <img src="../../assets/logo.png" alt="Chakana" />
        <span className="word">CHAKANA</span>
      </a>
      <nav>
        <a href="#mercado">Mercado</a>
        <a href="#talleres">Talleres</a>
        <a href="#ciclo">Ciclo</a>
        <a href="#nosotros">Nosotros</a>
      </nav>
      <div className="actions">
        <button className="btn btn-ghost">Iniciar sesión</button>
        <button className="btn btn-primary">Sumarse</button>
      </div>
    </header>
  );
}
