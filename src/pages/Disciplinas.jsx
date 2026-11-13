import { useState } from 'react';

function Disciplinas({ disciplinas, setDisciplinas }) {
  const [exibirForm, setExibirForm] = useState(false);
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
    const bateSituacao =
      filtroSituacao === 'Todas' || disc.situacao === filtroSituacao;
    return bateTexto && bateSituacao;
  });

  const handleCadastrar = (e) => {
    e.preventDefault();

    if (!nome.trim() || !codigo.trim() || !cargaHoraria) {
      setMensagem('Erro: Preencha nome, código e carga horária.');
      return;
    }

    const codigoDuplicado = disciplinas.find(
      (d) => d.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );
    if (codigoDuplicado) {
      setMensagem('Erro: Já existe uma disciplina com este código.');
      return;
    }

    const novaDisciplina = {
      id: Date.now(),
      codigo: codigo.trim().toUpperCase(),
      nome: nome.trim(),
      cargaHoraria: Number(cargaHoraria),
      situacao,
      descricao: descricao.trim(),
    };

    setDisciplinas([...disciplinas, novaDisciplina]);
    setNome('');
    setCodigo('');
    setCargaHoraria('');
    setSituacao('Ativa');
    setDescricao('');
    setMensagem('Disciplina cadastrada com sucesso!');
    setExibirForm(false);
  };

  const alternarSituacao = (id) => {
    const atualizadas = disciplinas.map((disc) =>
      disc.id === id
        ? { ...disc, situacao: disc.situacao === 'Ativa' ? 'Inativa' : 'Ativa' }
        : disc
    );
    setDisciplinas(atualizadas);
  };

  if (exibirForm) {
    return (
      <>
        <p className="crumb">
          <a
            href="#voltar"
            onClick={(e) => {
              e.preventDefault();
              setExibirForm(false);
              setMensagem('');
            }}
          >
            ← Disciplinas
          </a>{' '}
          / Nova disciplina
        </p>
        <h1>Nova disciplina</h1>
        <p className="sub">Preencha os dados para adicionar uma disciplina à instituição.</p>

        {mensagem && (
          <p style={{ color: 'crimson', fontWeight: 'bold', marginBottom: '12px' }}>
            {mensagem}
          </p>
        )}

        <form className="card" onSubmit={handleCadastrar}>
          <h3>Dados da disciplina</h3>
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
              <label>Situação</label>
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

          <div className="acts">
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setExibirForm(false);
                setMensagem('');
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn">
              Cadastrar disciplina
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Disciplinas</h1>
      <p className="sub">Cadastre, edite e gerencie as disciplinas da instituição</p>

      {mensagem && (
        <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '12px' }}>
          {mensagem}
        </p>
      )}

      <div className="bar">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou código..."
        />
        <select value={filtroSituacao} onChange={(e) => setFiltroSituacao(e.target.value)}>
          <option value="Todas">Todas as situações</option>
          <option value="Ativa">Ativa</option>
          <option value="Inativa">Inativa</option>
        </select>
        <button
          className="btn"
          onClick={() => {
            setExibirForm(true);
            setMensagem('');
          }}
        >
          + Nova disciplina
        </button>
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
                <td>{disc.codigo}</td>
                <td>{disc.nome}</td>
                <td>{disc.cargaHoraria} h</td>
                <td>
                  <span className={`tag ${disc.situacao === 'Inativa' ? 'b' : ''}`}>
                    {disc.situacao}
                  </span>
                </td>
                <td>
                  <button
                    className={`mini ${disc.situacao === 'Ativa' ? 'r' : ''}`}
                    onClick={() => alternarSituacao(disc.id)}
                  >
                    {disc.situacao === 'Ativa' ? 'Inativar' : 'Ativar'}
                  </button>
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