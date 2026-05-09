function ImpactStrip() {
  const stats = [
    { num: "1.420", label: "Objetos en circulación", meta: "Donados, reparados o intercambiados este trimestre." },
    { num: "38", label: "Talleres del barrio", meta: "Carpinterías, sastres, ferreterías y más, todos vecinos." },
    { num: "12", label: "Parroquias activas", meta: "Desde San Sebastián hasta El Vergel — una red caminable." },
  ];
  return (
    <section className="cm-impact">
      <div className="container">
        <p className="eyebrow" style={{ marginBottom: 32 }}>· LO QUE CIRCULA ·</p>
        <div className="row">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <p className="num">{s.num}</p>
              <p className="label">{s.label}</p>
              <p className="meta">{s.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
