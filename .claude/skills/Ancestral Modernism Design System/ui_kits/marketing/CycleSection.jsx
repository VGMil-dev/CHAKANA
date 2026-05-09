function CycleSection() {
  const steps = [
    { state: "done", label: "Donado", desc: "Lo dejas en un punto del barrio o pides recolección." },
    { state: "done", label: "Recolectado", desc: "Voluntarios y mensajeros locales lo transportan." },
    { state: "current", label: "Restaurado", desc: "Pasa por el taller que mejor sabe devolverle vida." },
    { state: "todo", label: "Devuelto", desc: "Regresa al ecosistema — vendido, donado, o intercambiado." },
  ];

  return (
    <section className="cm-ciclo" id="ciclo">
      <div className="container">
        <div className="head">
          <p className="eyebrow">03 · CICLO</p>
          <h2>Cuatro pasos. Ningún desperdicio.</h2>
          <p className="lede">
            La economía circular no es una idea — es un trayecto. El Ciclo
            Chakana hace visible cada parada, desde la donación hasta el
            regreso al barrio.
          </p>
        </div>

        <div className="cycle">
          <div className="track"><div className="fill"></div></div>
          {steps.map((s, i) => (
            <div className={"step " + s.state} key={s.label}>
              <div className="dot">{s.state === "done" ? "✓" : i + 1}</div>
              <div className="text">
                <p className="label">{s.label}</p>
                <p className="desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
