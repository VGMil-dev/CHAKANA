function MarketSection() {
  const [filter, setFilter] = React.useState("Todo");
  const filters = ["Todo", "Mercado", "Talleres", "Servicios", "Materiales"];

  const items = [
    { tone: "tone-1", eyebrow: "01 · MERCADO", title: "Bicicleta urbana, marco rojo", meta: "El Vado · hace 2 días", badge: "Disponible", placeholder: "Foto del objeto" },
    { tone: "tone-2", eyebrow: "02 · MATERIALES", title: "Madera de eucalipto recuperada", meta: "San Sebastián · hace 4 días", badge: "Reservado", placeholder: "Foto del material" },
    { tone: "tone-3", eyebrow: "03 · SERVICIOS", title: "Costura y arreglos a domicilio", meta: "Las Herrerías · disponible", badge: "Abierto", placeholder: "Foto del taller" },
  ];

  return (
    <section className="cm-mercado" id="mercado">
      <div className="container">
        <div className="head">
          <div>
            <p className="eyebrow">01 · MERCADO</p>
            <h2>Lo que circula esta semana en el barrio</h2>
          </div>
          <div className="filters">
            {filters.map((f) => (
              <button
                key={f}
                className={"chip" + (filter === f ? " active" : "")}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {items.map((it) => (
            <article className="product" key={it.title}>
              <div className={"img " + it.tone}>
                <span className="badge">{it.badge}</span>
                <span className="placeholder">{it.placeholder}</span>
              </div>
              <div className="body">
                <p className="eyebrow">{it.eyebrow}</p>
                <h3 className="title">{it.title}</h3>
                <p className="meta">{it.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
