import { useState } from 'react';

function Disciplinas({ disciplinas, setDisciplinas, semestre, setSemestre }) {
  const [modoForm, setModoForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('Todas');

  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [situacao, setSituacao] = useState('Ativa');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const disciplinasFiltradas = disciplinas.filter((disc) => {
    const bateTexto =
      disc.nome.toLowerCase().includes(busca.toLowerCase()) ||
      disc.codigo.toLowerCase().includes(busca.toLowerCase());
    const bateSituacao = filtroSituacao === 'Todas' || disc.situacao === filtroSituacao;
    return bateTexto && bateSituacao;
  });

  const abrirNova = () => {
    setEditandoId(null);
    setNome('');
    setCodigo('');
    setCargaHoraria('');
    setSituacao('Ativa');
    setDescricao('');
    setMensagem('');
    setModoForm(true);
  };

  const abrirEditar = (disc) => {
    setEditandoId(disc.id);
    setNome(disc.nome);
    setCodigo(disc.codigo);
    setCargaHoraria(String(disc.cargaHoraria));
    setSituacao(disc.situacao);
    setDescricao(disc.descricao || '');
    setMensagem('');
    setModoForm(true);
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    if (!nome.trim() || !codigo.trim() || !cargaHoraria) {
      setMensagem('Erro: Preencha nome, código e carga horária.');
      return;
    }

    const codigoDuplicado = disciplinas.find(
      (d) => d.codigo.toLowerCase() === codigo.trim().toLowerCase() && d.id !== editandoId
    );
    if (codigoDuplicado) {
      setMensagem('Erro: Já existe uma disciplina com este código.');
      return;
    }

    if (editandoId) {
      setDisciplinas(
        disciplinas.map((d) =>
          d.id === editandoId
            ? {
                ...d,
                nome: nome.trim(),
                codigo: codigo.trim().toUpperCase(),
                cargaHoraria: Number(cargaHoraria),
                situacao,
                descricao: descricao.trim(),
              }
            : d
        )
      );
      setMensagem('Disciplina atualizada com sucesso!');
    } else {
      setDisciplinas([
        ...disciplinas,
        {
          id: Date.now(),
          codigo: codigo.trim().toUpperCase(),
          nome: nome.trim(),
          cargaHoraria: Number(cargaHoraria),
          situacao,
          descricao: descricao.trim(),
        },
      ]);
      setMensagem('Disciplina cadastrada com sucesso!');
    }

    setModoForm(false);
    setEditandoId(null);
  };

  const alternarSituacao = (id) => {
    setDisciplinas(
      disciplinas.map((disc) =>
        disc.id === id
          ? { ...disc, situacao: disc.situacao === 'Ativa' ? 'Inativa' : 'Ativa' }
          : disc
      )
    );
  };

  if (modoForm) {
    return (
      <>
        <p className="crumb">
          <a
            href="#voltar"
            onClick={(e) => {
              e.preventDefault();
              setModoForm(false);
              setMensagem('');
            }}
          >
            ← Disciplinas
          </a>{' '}
          / {editandoId ? 'Editar disciplina' : 'Nova disciplina'}
        </p>
        <h1>{editandoId ? 'Editar disciplina' : 'Nova disciplina'}</h1>
        <p className="sub">Preencha os dados para adicionar ou editar uma disciplina da instituição.</p>

        {mensagem && (
          <p style={{ color: 'crimson', fontWeight: 'bold', margin: '12px 0' }}>{mensagem}</p>
        )}

        <form className="card" style={{ marginTop: '18px' }} onSubmit={handleSalvar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Dados da disciplina</h3>
            <small style={{ color: '#64748b' }}>* Campos obrigatórios</small>
          </div>

          <label>Nome da disciplina *</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da disciplina"
          />

          <div className="row">
            <div>
              <label>Código *</label>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex.: MAT-01"
              />
            </div>
            <div>
              <label>Carga horária (h) *</label>
              <input
                type="number"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(e.target.value)}
                placeholder="Ex.: 80"
              />
            </div>
            <div>
              <label>Situação *</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>
          </div>

          <label>Descrição (opcional)</label>
          <textarea
            rows="4"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva os conteúdos e objetivos da disciplina"
          />

          <div className="acts" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <small style={{ color: '#64748b' }}>Confira os dados antes de concluir o cadastro.</small>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn ghost" onClick={() => setModoForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn">
                {editandoId ? 'Salvar alterações' : 'Cadastrar disciplina'}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }

  const ativasCount = disciplinas.filter((d) => d.situacao === 'Ativa').length;
  const inativasCount = disciplinas.length - ativasCount;

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Disciplinas</h1>
          <p className="sub">Cadastre, edite e gerencie as disciplinas da instituição</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      {mensagem && (
        <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '12px' }}>{mensagem}</p>
      )}

      <div className="bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por nome ou código..."
          />
        </div>
        <select
          style={{ maxWidth: '200px', background: '#fff' }}
          value={filtroSituacao}
          onChange={(e) => setFiltroSituacao(e.target.value)}
        >
          <option value="Todas">Todas as situações</option>
          <option value="Ativa">Ativa</option>
          <option value="Inativa">Inativa</option>
        </select>
        <button className="btn" onClick={abrirNova}>
          + Nova disciplina
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3>Disciplinas cadastradas</h3>
        <small style={{ color: '#64748b' }}>
          {disciplinas.length} disciplinas · {ativasCount} ativas · {inativasCount} inativa(s)
        </small>
      </div>

      <div className="card wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Disciplina</th>
              <th>Carga horária</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinasFiltradas.map((disc) => (
              <tr key={disc.id}>
                <td style={{ color: '#475569' }}>{disc.codigo}</td>
                <td>{disc.nome}</td>
                <td>{disc.cargaHoraria} h</td>
                <td>
                  <span className={`tag ${disc.situacao === 'Inativa' ? 'neutral' : ''}`}>
                    {disc.situacao}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="mini" onClick={() => abrirEditar(disc)}>
                      Editar
                    </button>
                    <button className="mini link-btn" onClick={() => alternarSituacao(disc.id)}>
                      {disc.situacao === 'Ativa' ? 'Inativar' : 'Reativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Disciplinas;