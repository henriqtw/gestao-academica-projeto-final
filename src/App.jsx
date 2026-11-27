import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Alunos from './pages/Alunos';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('alunos');

  const [usuarios, setUsuarios] = useState(() => {
    const salvos = localStorage.getItem('saber_usuarios');
    return salvos ? JSON.parse(salvos) : [{ id: 1, nome: 'Admin Padrão', email: 'admin@saber.edu.br', senha: '123', tipo: 'Admin' }];
  });

  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const sessao = localStorage.getItem('saber_sessao');
    return sessao ? JSON.parse(sessao) : null;
  });

  const [alunos, setAlunos] = useState(() => {
    const salvos = localStorage.getItem('saber_alunos');
    return salvos ? JSON.parse(salvos) : [{ id: 1, nome: 'Alexandre Henrique Pereira', email: 'alexandre@saber.edu.br', matricula: '110110', turma: '2º A', situacao: 'Ativo' }];
  });

  const [disciplinas, setDisciplinas] = useState(() => {
    const salvas = localStorage.getItem('saber_disciplinas');
    return salvas ? JSON.parse(salvas) : [
      { id: 101, codigo: 'MAT-01', nome: 'Matemática', cargaHoraria: 80, situacao: 'Ativa' },
      { id: 102, codigo: 'POR-01', nome: 'Português', cargaHoraria: 80, situacao: 'Ativa' },
    ];
  });

  const [notas, setNotas] = useState(() => {
    const salvas = localStorage.getItem('saber_notas');
    return salvas ? JSON.parse(salvas) : [];
  });

  useEffect(() => { localStorage.setItem('saber_usuarios', JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => {
    if (usuarioLogado) localStorage.setItem('saber_sessao', JSON.stringify(usuarioLogado));
    else localStorage.removeItem('saber_sessao');
  }, [usuarioLogado]);
  useEffect(() => { localStorage.setItem('saber_alunos', JSON.stringify(alunos)); }, [alunos]);
  useEffect(() => { localStorage.setItem('saber_disciplinas', JSON.stringify(disciplinas)); }, [disciplinas]);
  useEffect(() => { localStorage.setItem('saber_notas', JSON.stringify(notas)); }, [notas]);

  if (!usuarioLogado) {
    return <Login usuarios={usuarios} setUsuarios={setUsuarios} setUsuarioLogado={setUsuarioLogado} alunos={alunos} setAlunos={setAlunos} />;
  }

  return (
    <>
      <input type="checkbox" id="menu" />
      <div className="app">
        <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main">
          <div className="top">
            <label htmlFor="menu" className="burger">☰</label>
            <span className="chip">1.º Semestre 2026</span>
            <span className="user">{usuarioLogado.nome} ({usuarioLogado.tipo})</span>
            <button className="mini r" onClick={() => setUsuarioLogado(null)}>Sair</button>
          </div>

          {telaAtiva === 'alunos' && <Alunos alunos={alunos} setAlunos={setAlunos} />}

          {telaAtiva !== 'alunos' && (
            <div>
              <h1>Tela: {telaAtiva}</h1>
              <p className="sub">Vamos criar este componente nos próximos passos.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;