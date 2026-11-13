import { useState } from 'react';

function Alunos({ alunos, setAlunos }) {
  const [exibirForm, setExibirForm] = useState(false);
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

  const handleCadastrar = (e) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !matricula.trim() || !turma) {
      setMensagem('Erro: Preencha todos os campos obrigatórios (*).');
      return;
    }
    
    const matriculaExiste = alunos.find((a) => a.matricula === matricula.trim());
    if (matriculaExiste) {
      setMensagem('Erro: Já existe um aluno com esta matrícula.');
      return;
    }

    const novoAluno = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim(),
      matricula: matricula.trim(),
      turma,
      situacao,
    };

    setAlunos([...alunos, novoAluno]);
    setNome('');
    setEmail('');
    setMatricula('');
    setTurma('');
    setSituacao('Ativo');
    setMensagem('Aluno cadastrado com sucesso!');
    setExibirForm(false);
  };

  const handleExcluir = (id) => {
    setAlunos(alunos.filter((aluno) => aluno.id !== id));
    setMensagem('Aluno removido com sucesso.');
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
            ← Gestão de Alunos
          </a>{' '}
          / Novo aluno
        </p>
        <h1>Novo aluno</h1>
        <p className="sub">Preencha os dados para cadastrar um aluno na instituição.</p>

        {mensagem && (
          <p style={{ color: 'crimson', fontWeight: 'bold', marginBottom: '12px' }}>
            {mensagem}
          </p>
        )}

        <form className="card" onSubmit={handleCadastrar}>
          <h3>Dados pessoais</h3>
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

          <h3 style={{ marginTop: '22px' }}>Vínculo acadêmico</h3>
          <div className="row">
            <div>
              <label>Matrícula *</label>
              <input
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Digite a matrícula"
              />
            </div>
            <div>
              <label>Turma *</label>
              <select value={turma} onChange={(e) => setTurma(e.target.value)}>
                <option value="">Selecione a turma</option>
                <option value="1º A">1º A</option>
                <option value="2º A">2º A</option>
                <option value="3º A">3º A</option>
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
              Cadastrar aluno
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Gestão de Alunos</h1>
      <p className="sub">Cadastre, edite e gerencie seus alunos</p>

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
          placeholder="Buscar por nome ou matrícula..."
        />
        <button
          className="btn"
          onClick={() => {
            setExibirForm(true);
            setMensagem('');
          }}
        >
          + Novo Aluno
        </button>
      </div>

      <div className="card wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Turma</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhum aluno encontrado.</td>
              </tr>
            ) : (
              alunosFiltrados.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.turma}</td>
                  <td>
                    <span className={`tag ${aluno.situacao === 'Inativo' ? 'b' : ''}`}>
                      {aluno.situacao}
                    </span>
                  </td>
                  <td>
                    <button className="mini r" onClick={() => handleExcluir(aluno.id)}>
                      Excluir
                    </button>
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