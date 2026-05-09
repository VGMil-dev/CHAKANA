function Hero() {
  return (
    <section className="cm-hero">
      <div className="container">
        <div className="grid">
          <div className="left">
            <p className="stamp">· CUENCA, ECUADOR ·</p>
            <h1>
              Aquí tu <span className="accent">apoyo</span> vuelve.
            </h1>
            <p className="lede">
              Un ecosistema de economía circular para el barrio: lo que ya no
              usas encuentra un próximo lugar, lo que necesitas regresa por
              manos cercanas.
            </p>
            <div className="ctas">
              <button className="btn btn-primary">Empezar a circular →</button>
              <button className="btn btn-secondary">Ver mercado</button>
            </div>
          </div>
          <div className="right">
            <img src="../../assets/logo.png" alt="" className="mark" />
            <div className="corner-stamp">Reactivando la Atenas</div>
          </div>
        </div>
      </div>
    </section>
  );
}
