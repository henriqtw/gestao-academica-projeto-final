import { useState } from 'react';

function Login({ usuarios, setUsuarios, setUsuarioLogado, alunos, setAlunos }) {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turma, setTurma] = useState('');
  const [mensagem, setMensagem] = useState('');

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setMensagem('');
    setNome('');
    setEmail('');
    setSenha('');
    setMatricula('');
    setTurma('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modo === 'login') {
      const encontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
      );
      if (!encontrado) {
        setMensagem('Erro: E-mail ou senha inválidos.');
        return;
      }
      setUsuarioLogado(encontrado);
      return;
    }

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setMensagem('Erro: Preencha nome, e-mail e senha.');
      return;
    }

    const emailExiste = usuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExiste) {
      setMensagem('Erro: Este e-mail já está cadastrado.');
      return;
    }

    if (modo === 'admin') {
      setUsuarios([
        ...usuarios,
        { id: Date.now(), nome: nome.trim(), email: email.trim(), senha, tipo: 'Admin' },
      ]);
      trocarModo('login');
      setMensagem('Admin cadastrado! Faça login para entrar.');
      return;
    }

    if (modo === 'aluno') {
      if (!matricula.trim() || !turma) {
        setMensagem('Erro: Preencha matrícula e turma.');
        return;
      }
      const novoId = Date.now();
      setUsuarios([
        ...usuarios,
        {
          id: novoId,
          nome: nome.trim(),
          email: email.trim(),
          senha,
          tipo: 'Aluno',
          matricula: matricula.trim(),
          turma,
        },
      ]);
      setAlunos([
        ...alunos,
        {
          id: novoId,
          nome: nome.trim(),
          email: email.trim(),
          matricula: matricula.trim(),
          turma,
          situacao: 'Ativo',
        },
      ]);
      trocarModo('login');
      setMensagem('Aluno cadastrado! Faça login para entrar.');
    }
  };

  return (
    <div className="login">
      <div className="lbox">
        <section className="hero">
          <div style={{ fontSize: '30px', fontWeight: 800 }}>SABER</div>
          <h2>SEU FUTURO COMEÇA AQUI.</h2>
          <p>
            Acompanhe seu desempenho, consulte suas notas e fique por dentro de
            todas as suas informações acadêmicas em um só lugar.
          </p>
          <span className="btn" style={{ background: '#2f6df0' }}>
            Educação que conecta resultados
          </span>
        </section>

        <form className="form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              className={`btn ${modo === 'login' ? '' : 'ghost'}`}
              onClick={() => trocarModo('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`btn ${modo === 'admin' ? '' : 'ghost'}`}
              onClick={() => trocarModo('admin')}
            >
              + Admin
            </button>
            <button
              type="button"
              className={`btn ${modo === 'aluno' ? '' : 'ghost'}`}
              onClick={() => trocarModo('aluno')}
            >
              + Aluno
            </button>
          </div>

          <h2>
            {modo === 'login' && 'Acesse sua conta'}
            {modo === 'admin' && 'Cadastro de Admin'}
            {modo === 'aluno' && 'Cadastro de Aluno'}
          </h2>
          <p className="sub">
            {modo === 'login'
              ? 'Entre com suas credenciais institucionais.'
              : 'Preencha os dados para criar um novo acesso.'}
          </p>

          {mensagem && (
            <p
              style={{
                color: mensagem.startsWith('Erro') ? 'crimson' : 'green',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              {mensagem}
            </p>
          )}

          {modo !== 'login' && (
            <>
              <label>Nome completo *</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
              />
            </>
          )}

          <label>E-mail institucional *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@saber.edu.br"
          />

          {modo === 'aluno' && (
            <div className="row">
              <div>
                <label>Matrícula *</label>
                <input
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Ex.: 202601"
                />
              </div>
              <div>
                <label>Turma *</label>
                <select value={turma} onChange={(e) => setTurma(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="1º A">1º A</option>
                  <option value="2º A">2º A</option>
                  <option value="3º A">3º A</option>
                </select>
              </div>
            </div>
          )}

          <label>Senha *</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />

          <button className="btn" type="submit" style={{ marginTop: '20px' }}>
            {modo === 'login' ? 'Entrar' : 'Concluir Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;