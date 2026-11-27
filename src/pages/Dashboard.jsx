function Dashboard({ alunos, disciplinas, notas, eventos, usuarioLogado, semestre, setSemestre, setTelaAtiva }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const alunoAtual = !isAdmin
    ? alunos.find(
        (a) =>
          a.id === usuarioLogado.id ||
          (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula) ||
          a.email.toLowerCase() === usuarioLogado.email.toLowerCase()
      )
    : null;

  const notasConsideradas = isAdmin
    ? notas
    : alunoAtual
    ? notas.filter((n) => n.alunoId === alunoAtual.id)
    : [];

  const mediaGeralNum =
    notasConsideradas.length > 0
      ? notasConsideradas.reduce((soma, n) => soma + (n.nota1 + n.nota2) / 2, 0) / notasConsideradas.length
      : 0;

  const mediaGeralTexto = notasConsideradas.length > 0 ? mediaGeralNum.toFixed(1) : '-';
  const disciplinasAtivas = disciplinas.filter((d) => d.situacao === 'Ativa');

  const dadosGrafico = disciplinasAtivas.map((disc) => {
    const notasDisc = notasConsideradas.filter((n) => n.disciplinaId === disc.id);
    const media =
      notasDisc.length > 0
        ? notasDisc.reduce((s, n) => s + (n.nota1 + n.nota2) / 2, 0) / notasDisc.length
        : 0;
    return { nome: disc.nome, media };
  });

  const proximosEventos = [...eventos]
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4);

  const formatarDataCurta = (iso) => {
    if (!iso || !iso.includes('-')) return iso;
    const [, mes, dia] = iso.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <>
      <div className="sub-top-bar">
        <div className="title-row">
          <h1>Visão Geral</h1>
          {!isAdmin && (
            <span className="status-inline">
              Situação:{' '}
              <span className={mediaGeralNum >= 7 || notasConsideradas.length === 0 ? 'aprovado' : 'atencao'}>
                {mediaGeralNum >= 7 || notasConsideradas.length === 0 ? 'APROVADO' : 'EM ATENÇÃO'}
              </span>
            </span>
          )}
        </div>

        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      <div className="grid-3">
        {isAdmin ? (
          <div className="kpi-card">
            <h3>Alunos cadastrados</h3>
            <div className="kpi-value">{alunos.length}</div>
            <div className="kpi-foot">{alunos.filter((a) => a.situacao === 'Ativo').length} ativo(s)</div>
          </div>
        ) : (
          <div className="kpi-card">
            <h3>Frequência</h3>
            <div className="kpi-value">{alunoAtual?.frequencia ?? 95}%</div>
            <div className="kpi-foot">Mínimo exigido: 75%</div>
          </div>
        )}

        <div className="kpi-card">
          <h3>Disciplinas</h3>
          <div className="kpi-value">{disciplinasAtivas.length}</div>
          <div className="kpi-foot">Ativas no semestre</div>
        </div>

        <div className="kpi-card">
          <h3>Média Geral</h3>
          <div className="kpi-value">{mediaGeralTexto}</div>
          <div className="kpi-foot">
            {isAdmin ? 'Média global da instituição' : `Baseada em ${notasConsideradas.length} matéria(s)`}
          </div>
        </div>
      </div>

      <div className="grid-2-wide">
        <div className="card-gray">
          <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>
            Média por matéria (Gráfico de coluna)
          </h3>
          <p style={{ fontSize: '12px', color: '#475569' }}>
            Desempenho consolidado nas disciplinas ativas
          </p>

          <div className="bar-chart">
            {dadosGrafico.map((item) => (
              <div className="bar-col" key={item.nome}>
                <span className="bar-val">{item.media > 0 ? item.media.toFixed(1) : '-'}</span>
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(item.media * 10, 4)}%` }}
                  title={`${item.nome}: ${item.media.toFixed(1)}`}
                />
              </div>
            ))}
          </div>
          <div className="bar-labels">
            {dadosGrafico.map((item) => (
              <span key={item.nome} title={item.nome}>{item.nome}</span>
            ))}
          </div>
        </div>

        <div className="card-gray">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px' }}>Eventos acadêmicos</h3>
            <button className="mini link-btn" onClick={() => setTelaAtiva('calendario')}>
              Ver todos →
            </button>
          </div>

          {proximosEventos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '20px' }}>
              Nenhum evento agendado.
            </p>
          ) : (
            proximosEventos.map((ev) => (
              <div className="event-item" key={ev.id}>
                <div className="event-icon">
                  {ev.tipo === 'Prova' ? '📅' : ev.tipo === 'Trabalho' ? '📄' : '👥'}
                </div>
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>{ev.titulo}</strong>
                  <small style={{ color: '#475569', fontSize: '12px' }}>
                    {formatarDataCurta(ev.data)} - {ev.horario}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;