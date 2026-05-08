function JoinSection() {
  const [email, setEmail] = React.useState("");
  const [barrio, setBarrio] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <section className="cm-join" id="nosotros">
      <div className="container">
        <div className="panel">
          <div>
            <p className="eyebrow">04 · SUMARSE</p>
            <h2>
              Tu barrio te <span className="accent">espera</span>.
            </h2>
            <p className="en">Your neighbourhood is already part of the cycle.</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.65, color: "var(--on-background)", margin: 0, maxWidth: "38ch" }}>
              Recibirás cada quince días un boletín con lo que circula cerca
              de ti, los talleres abiertos, y las personas que recién se
              suman al ecosistema.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email && barrio) setSubmitted(true);
            }}
          >
            <input
              className="input"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <input
              className="input"
              placeholder="Barrio o parroquia"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
            />
            <div className="field-row">
              <button className="btn btn-primary" type="submit" style={{ flex: 1, justifyContent: "center" }}>
                Sumarse al ciclo →
              </button>
            </div>
            {submitted ? (
              <p className="ack">Gracias. Pronto recibirás noticias del barrio.</p>
            ) : (
              <p className="helper">Sin spam. Sólo lo que pasa cerca.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
