function Notificacoes({ notificacoes, setNotificacoes, semestre, setSemestre }) {
  const marcarTodasLidas = () => {
    setNotificacoes(notificacoes.map((n) => ({ ...n, lida: true })));
  };

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Notificações</h1>
          <p className="sub">Avisos acadêmicos e atualizações do sistema</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      <div className="bar">
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
          {notificacoes.filter((n) => !n.lida).length} não lida(s)
        </span>
        <button className="btn ghost" onClick={marcarTodasLidas}>
          Marcar todas como lidas
        </button>
      </div>

      <div className="card">
        {notificacoes.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Nenhuma notificação.</p>
        ) : (
          notificacoes.map((n) => (
            <div
              key={n.id}
              className="event-item"
              style={{ justifyContent: 'space-between', opacity: n.lida ? 0.65 : 1 }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>{n.titulo}</strong>
                <span style={{ fontSize: '13px', color: '#475569' }}>{n.descricao}</span>
              </div>
              <small style={{ color: '#64748b', fontWeight: 700 }}>{n.data}</small>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Notificacoes;