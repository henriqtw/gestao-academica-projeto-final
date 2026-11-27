import { useState } from 'react';

function Objetivos({ objetivos, setObjetivos, usuarioLogado, semestre, setSemestre }) {
  const [titulo, setTitulo] = useState('');
  const [progressoInicial, setProgressoInicial] = useState(0);
  const [exibirNovo, setExibirNovo] = useState(false);

  const meusObjetivos = objetivos.filter((obj) => obj.usuarioId === usuarioLogado.id);

  const progressoGeral =
    meusObjetivos.length > 0
      ? Math.round(meusObjetivos.reduce((soma, o) => soma + Number(o.progresso), 0) / meusObjetivos.length)
      : 0;

  const handleCriar = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setObjetivos([
      ...objetivos,
      {
        id: Date.now(),
        usuarioId: usuarioLogado.id,
        titulo: titulo.trim(),
        progresso: Number(progressoInicial),
      },
    ]);
    setTitulo('');
    setProgressoInicial(0);
    setExibirNovo(false);
  };

  const atualizarPorcentagem = (id, valor) => {
    setObjetivos(
      objetivos.map((obj) => (obj.id === id ? { ...obj, progresso: Number(valor) } : obj))
    );
  };

  const excluirObjetivo = (id) => {
    setObjetivos(objetivos.filter((obj) => obj.id !== id));
  };

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Meus Objetivos</h1>
          <p className="sub">Acompanhe seus objetivos e veja o seu progresso</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      {exibirNovo && (
        <form className="card" style={{ marginBottom: '20px' }} onSubmit={handleCriar}>
          <h3>Nova meta personalizada</h3>
          <div className="row">
            <div>
              <label>Descrição do objetivo *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Alcançar média 9,0 em Física"
              />
            </div>
            <div>
              <label>Progresso atual ({progressoInicial}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progressoInicial}
                onChange={(e) => setProgressoInicial(e.target.value)}
              />
            </div>
          </div>
          <div className="acts">
            <button type="button" className="btn ghost" onClick={() => setExibirNovo(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn">
              Salvar Objetivo
            </button>
          </div>
        </form>
      )}

      <div className="grid-2-equal">
        <div className="obj-hero">
          <div
            className="ring"
            style={{
              background: `conic-gradient(#2563eb ${progressoGeral}%, #e2e8f0 0)`,
            }}
          >
            <div className="ring-inner">{progressoGeral}%</div>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Progresso Geral</h2>
        </div>

        <div className="card-gray">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '20px' }}>Meus Objetivos</h3>
            <button className="btn" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => setExibirNovo(!exibirNovo)}>
              + Nova Meta
            </button>
          </div>

          {meusObjetivos.length === 0 ? (
            <p style={{ color: '#475569' }}>Você ainda não adicionou objetivos. Clique em "+ Nova Meta".</p>
          ) : (
            meusObjetivos.map((obj) => (
              <div key={obj.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>
                    {obj.progresso === 100 ? '✅' : '🔵'} {obj.titulo}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#334155' }}>{obj.progresso}%</strong>
                    <button
                      className="mini link-btn"
                      title="Remover meta"
                      onClick={() => excluirObjetivo(obj.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${obj.progresso}%` }} />
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={obj.progresso}
                  onChange={(e) => atualizarPorcentagem(obj.id, e.target.value)}
                  style={{ marginTop: '6px', padding: 0, height: '18px', background: 'transparent', border: 'none' }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="banner-motivacao">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{ fontSize: '38px' }}>🏆</span>
          <div>
            <strong style={{ fontSize: '18px', display: 'block' }}>
              {progressoGeral >= 70 ? 'Você está indo bem!' : 'Continue avançando!'}
            </strong>
            <span style={{ fontSize: '14px', color: '#1e293b' }}>
              Continue focado para atingir seus objetivos neste semestre!
            </span>
          </div>
        </div>
        <span style={{ fontSize: '42px' }}>🎯</span>
      </div>
    </>
  );
}

export default Objetivos;