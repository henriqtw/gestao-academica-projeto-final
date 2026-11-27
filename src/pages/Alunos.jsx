import { useState } from 'react';

function Alunos({ alunos, setAlunos, usuarios, setUsuarios, semestre, setSemestre }) {
  const [modoForm, setModoForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turma, setTurma] = useState('');
  const [situacao, setSituacao] = useState('Ativo');
  const [mensagem, setMensagem] = useState('');

  const alunosFiltrados = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
      aluno.matricula.includes(busca)
  );

  const abrirNovo = () => {
    setEditandoId(null);
    setNome('');
    setEmail('');
    setMatricula('');
    setTurma('');
    setSituacao('Ativo');
    setMensagem('');
    setModoForm(true);
  };

  const abrirEditar = (aluno) => {
    setEditandoId(aluno.id);
    setNome(aluno.nome);
    setEmail(aluno.email);
    setMatricula(aluno.matricula);
    setTurma(aluno.turma);
    setSituacao(aluno.situacao);
    setMensagem('');
    setModoForm(true);
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !matricula.trim() || !turma) {
      setMensagem('Erro: Preencha todos os campos obrigatórios (*).');
      return;
    }

    const matriculaDuplicada = alunos.find(
      (a) => a.matricula === matricula.trim() && a.id !== editandoId
    );
    if (matriculaDuplicada) {
      setMensagem('Erro: Já existe um aluno com este RA/Matrícula.');
      return;
    }

    if (editandoId) {
      setAlunos(
        alunos.map((a) =>
          a.id === editandoId
            ? { ...a, nome: nome.trim(), email: email.trim(), matricula: matricula.trim(), turma, situacao }
            : a
        )
      );
      setUsuarios(
        usuarios.map((u) =>
          u.id === editandoId
            ? { ...u, nome: nome.trim(), email: email.trim(), matricula: matricula.trim(), turma }
            : u
        )
      );
      setMensagem('Dados do aluno atualizados!');
    } else {
      const novoId = Date.now();
      const novoAluno = {
        id: novoId,
        nome: nome.trim(),
        email: email.trim(),
        matricula: matricula.trim(),
        turma,
        situacao,
        frequencia: 100,
      };
      setAlunos([...alunos, novoAluno]);

      if (!usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        setUsuarios([
          ...usuarios,
          {
            id: novoId,
            nome: nome.trim(),
            email: email.trim(),
            senha: '123',
            tipo: 'Aluno',
            matricula: matricula.trim(),
            turma,
          },
        ]);
      }
      setMensagem('Aluno cadastrado! (Senha padrão de acesso: 123)');
    }

    setModoForm(false);
    setEditandoId(null);
  };

  const handleExcluir = (id) => {
    setAlunos(alunos.filter((aluno) => aluno.id !== id));
    setUsuarios(usuarios.filter((u) => u.id !== id));
    setMensagem('Aluno removido com sucesso.');
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
            ← Gestão de Alunos
          </a>{' '}
          / {editandoId ? 'Editar aluno' : 'Novo aluno'}
        </p>
        <h1>{editandoId ? 'Editar aluno' : 'Novo aluno'}</h1>
        <p className="sub">Preencha os dados para cadastrar ou atualizar um aluno na instituição.</p>

        {mensagem && (
          <p style={{ color: 'crimson', fontWeight: 'bold', margin: '12px 0' }}>{mensagem}</p>
        )}

        <form className="card" style={{ marginTop: '18px' }} onSubmit={handleSalvar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Dados pessoais</h3>
            <small style={{ color: '#64748b' }}>* Campos obrigatórios</small>
          </div>

          <label>Nome completo *</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome completo do aluno"
          />

          <label>E-mail institucional *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@instituicao.edu.br"
          />

          <h3 style={{ marginTop: '24px' }}>Vínculo acadêmico</h3>
          <div className="row">
            <div>
              <label>RA / Matrícula *</label>
              <input
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Digite o RA ou matrícula"
              />
            </div>
            <div>
              <label>Turma *</label>
              <select value={turma} onChange={(e) => setTurma(e.target.value)}>
                <option value="">Selecione a turma</option>
                <option value="1º A">1º A</option>
                <option value="2º A">2º A</option>
                <option value="3º A">3º A</option>
                <option value="DEV2_SESI">DEV2_SESI</option>
              </select>
            </div>
            <div>
              <label>Situação *</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="acts" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <small style={{ color: '#64748b' }}>Confira os dados antes de concluir o cadastro.</small>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn ghost" onClick={() => setModoForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn">
                {editandoId ? 'Salvar alterações' : 'Cadastrar aluno'}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Gestão de Alunos</h1>
          <p className="sub">Cadastre, edite e gerencie seus alunos</p>
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
            placeholder="Busque por Nome ou RA/Matrícula..."
          />
        </div>
        <button className="btn" onClick={abrirNovo}>
          + Novo Aluno
        </button>
      </div>

      <div className="card wrap">
        <table>
          <thead>
            <tr>
              <th>Alunos</th>
              <th>E-mail</th>
              <th>RA / Matrícula</th>
              <th>Turma</th>
              <th>Situação</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                  Nenhum aluno encontrado.
                </td>
              </tr>
            ) : (
              alunosFiltrados.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td style={{ color: '#475569', fontSize: '13px' }}>{aluno.email}</td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.turma}</td>
                  <td>
                    <span className={`tag ${aluno.situacao === 'Inativo' ? 'b' : ''}`}>
                      {aluno.situacao.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="mini icon-btn"
                        title="Editar aluno"
                        onClick={() => abrirEditar(aluno)}
                      >
                        📝
                      </button>
                      <button
                        className="mini icon-btn danger"
                        title="Excluir aluno"
                        onClick={() => handleExcluir(aluno.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Alunos;