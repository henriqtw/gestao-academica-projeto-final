import { useState } from 'react';

const MESES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

function Calendario({ eventos, setEventos, usuarioLogado, semestre, setSemestre, setNotificacoes }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';
  const [mesAtual, setMesAtual] = useState(10); // Novembro
  const [anoAtual, setAnoAtual] = useState(2026);
  const [diaSelecionado, setDiaSelecionado] = useState('2026-11-14');

  const [titulo, setTitulo] = useState('');
  const [dataEvento, setDataEvento] = useState('2026-11-20');
  const [horario, setHorario] = useState('14:00');
  const [tipo, setTipo] = useState('Prova');
  const [mensagem, setMensagem] = useState('');

  const mudarMes = (delta) => {
    let novoMes = mesAtual + delta;
    let novoAno = anoAtual;
    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }
    setMesAtual(novoMes);
    setAnoAtual(novoAno);
  };

  const primeiroDiaSemana = (new Date(anoAtual, mesAtual, 1).getDay() + 6) % 7;
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const diasMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();

  const celulas = [];
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    celulas.push({ dia: diasMesAnterior - i, atual: false });
  }
  for (let d = 1; d <= diasNoMes; d++) {
    const iso = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    celulas.push({ dia: d, atual: true, iso });
  }
  while (celulas.length % 7 !== 0) {
    celulas.push({ dia: celulas.length - (primeiroDiaSemana + diasNoMes) + 1, atual: false });
  }

  const handleAdicionarEvento = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !dataEvento) {
      setMensagem('Erro: Preencha o título e a data do evento.');
      return;
    }
    const novo = {
      id: Date.now(),
      titulo: titulo.trim(),
      data: dataEvento,
      horario: horario.trim() || 'Dia todo',
      tipo,
    };
    setEventos([...eventos, novo]);
    setNotificacoes((prev) => [
      {
        id: Date.now(),
        titulo: `Novo evento: ${novo.titulo}`,
        descricao: `${novo.tipo} marcado para ${novo.data.split('-').reverse().join('/')} (${novo.horario}).`,
        data: 'Agora',
        lida: false,
      },
      ...prev,
    ]);
    setTitulo('');
    setMensagem('Evento adicionado ao calendário!');
  };

  const excluirEvento = (id) => {
    setEventos(eventos.filter((ev) => ev.id !== id));
  };

  const formatarData = (iso) => {
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  };

  const eventosOrdenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>{isAdmin ? 'Calendário Acadêmico' : 'Meu calendário'}</h1>
          <p className="sub">
            {isAdmin
              ? 'Adicione provas, trabalhos e reuniões para toda a instituição'
              : 'Acompanhe suas atividades e provas'}
          </p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      {isAdmin && (
        <form className="card" style={{ marginBottom: '22px' }} onSubmit={handleAdicionarEvento}>
          <h3>Adicionar novo evento</h3>
          {mensagem && (
            <p style={{ color: mensagem.startsWith('Erro') ? 'crimson' : '#16a34a', fontWeight: 'bold', marginTop: '8px' }}>
              {mensagem}
            </p>
          )}
          <div className="row">
            <div>
              <label>Título do evento *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Prova de Matemática"
              />
            </div>
            <div>
              <label>Tipo *</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="Prova">Prova</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Reunião">Reunião</option>
              </select>
            </div>
            <div>
              <label>Data *</label>
              <input
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
            </div>
            <div>
              <label>Horário / Observação</label>
              <input
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex.: 14:00 ou Prazo Final"
              />
            </div>
          </div>
          <div className="acts">
            <button type="submit" className="btn">
              + Adicionar ao Calendário
            </button>
          </div>
        </form>
      )}

      <div className="grid-2-equal">
        <div className="card-gray">
          <div className="cal-header">
            <button type="button" className="cal-nav" onClick={() => mudarMes(-1)}>‹</button>
            <span>{MESES[mesAtual]} {anoAtual}</span>
            <button type="button" className="cal-nav" onClick={() => mudarMes(1)}>›</button>
          </div>

          <div className="cal-grid">
            <b>Seg</b>
            <b>Ter</b>
            <b>Qua</b>
            <b>Qui</b>
            <b>Sex</b>
            <b>Sab</b>
            <b>Dom</b>

            {celulas.map((cel, idx) => {
              const temEvento = cel.atual && eventos.some((ev) => ev.data === cel.iso);
              const selecionado = cel.atual && cel.iso === diaSelecionado;
              return (
                <span
                  key={idx}
                  className={`cal-day ${!cel.atual ? 'dim' : ''} ${selecionado ? 'active' : ''} ${temEvento ? 'has-event' : ''}`}
                  onClick={() => cel.atual && setDiaSelecionado(cel.iso)}
                >
                  {cel.dia}
                </span>
              );
            })}
          </div>
        </div>

        <div className="card-gray">
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Próximos eventos</h3>
          {eventosOrdenados.length === 0 ? (
            <p style={{ color: '#475569', fontSize: '14px' }}>Nenhum evento marcado.</p>
          ) : (
            eventosOrdenados.map((ev) => (
              <div className="event-item" key={ev.id} style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="event-icon">
                    {ev.tipo === 'Prova' ? '📅' : ev.tipo === 'Trabalho' ? '📄' : '👥'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px', display: 'block' }}>{ev.titulo}</strong>
                    <small style={{ color: '#475569', fontSize: '13px' }}>
                      {formatarData(ev.data)} - {ev.horario}
                    </small>
                  </div>
                </div>
                {isAdmin && (
                  <button className="mini danger" onClick={() => excluirEvento(ev.id)}>
                    Excluir
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Calendario;