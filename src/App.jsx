import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Disciplinas from './pages/Disciplinas';
import Calendario from './pages/Calendario';
import Objetivos from './pages/Objetivos';
import Notas from './pages/Notas';
import Perfil from './pages/Perfil';
import Notificacoes from './pages/Notificacoes';
import Configuracoes from './pages/Configuracoes';

function App() {
  const [telaAtiva, setTelaAtiva] = useState(() => {
    return localStorage.getItem('saber_tela_ativa') || 'dashboard';
  });

  const [semestre, setSemestre] = useState(() => {
    return localStorage.getItem('saber_semestre') || '1º Semestre (2026)';
  });

  const [usuarios, setUsuarios] = useState(() => {
    const salvos = localStorage.getItem('saber_usuarios');
    return salvos
      ? JSON.parse(salvos)
      : [
          {
            id: 1,
            nome: 'Admin Padrão',
            email: 'admin@saber.edu.br',
            senha: '123',
            tipo: 'Admin',
            telefone: '(11) 99999-0000',
            nascimento: '10/05/1988',
          },
          {
            id: 2,
            nome: 'Alexandre Henrique Pereira',
            email: 'alexandre@saber.edu.br',
            senha: '123',
            tipo: 'Aluno',
            matricula: '110110',
            turma: '2º A',
            telefone: '(11) 12345-6789',
            nascimento: '14/10/2009',
          },
        ];
  });

  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const sessao = localStorage.getItem('saber_sessao');
    return sessao ? JSON.parse(sessao) : null;
  });

  const [alunos, setAlunos] = useState(() => {
    const salvos = localStorage.getItem('saber_alunos');
    return salvos
      ? JSON.parse(salvos)
      : [
          {
            id: 2,
            nome: 'Alexandre Henrique Pereira',
            email: 'alexandre@saber.edu.br',
            matricula: '110110',
            turma: '2º A',
            situacao: 'Ativo',
            frequencia: 94,
            telefone: '(11) 12345-6789',
            nascimento: '14/10/2009',
          },
        ];
  });

  const [disciplinas, setDisciplinas] = useState(() => {
    const salvas = localStorage.getItem('saber_disciplinas');
    return salvas
      ? JSON.parse(salvas)
      : [
          { id: 101, codigo: 'MAT-01', nome: 'Matemática', cargaHoraria: 80, situacao: 'Ativa' },
          { id: 102, codigo: 'POR-01', nome: 'Português', cargaHoraria: 80, situacao: 'Ativa' },
          { id: 103, codigo: 'HIS-01', nome: 'História', cargaHoraria: 40, situacao: 'Ativa' },
          { id: 104, codigo: 'GEO-01', nome: 'Geografia', cargaHoraria: 40, situacao: 'Ativa' },
          { id: 105, codigo: 'CIE-01', nome: 'Ciências', cargaHoraria: 60, situacao: 'Ativa' },
        ];
  });

  const [notas, setNotas] = useState(() => {
    const salvas = localStorage.getItem('saber_notas');
    return salvas
      ? JSON.parse(salvas)
      : [
          { id: 1, alunoId: 2, disciplinaId: 101, nota1: 8.5, nota2: 9.0 },
          { id: 2, alunoId: 2, disciplinaId: 102, nota1: 9.0, nota2: 8.7 },
          { id: 3, alunoId: 2, disciplinaId: 103, nota1: 7.5, nota2: 8.0 },
          { id: 4, alunoId: 2, disciplinaId: 104, nota1: 9.2, nota2: 8.9 },
          { id: 5, alunoId: 2, disciplinaId: 105, nota1: 7.0, nota2: 6.5 },
        ];
  });

  const [objetivos, setObjetivos] = useState(() => {
    const salvos = localStorage.getItem('saber_objetivos');
    return salvos
      ? JSON.parse(salvos)
      : [
          { id: 1, usuarioId: 2, titulo: 'Manter média acima de 8,0', progresso: 100 },
          { id: 2, usuarioId: 2, titulo: 'Aumentar frequência para 95%', progresso: 90 },
          { id: 3, usuarioId: 2, titulo: 'Estudar mais Matemática', progresso: 55 },
        ];
  });

  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('saber_eventos');
    return salvos
      ? JSON.parse(salvos)
      : [
          { id: 1, titulo: 'Prova de Matemática', data: '2026-11-14', horario: '14:00', tipo: 'Prova' },
          { id: 2, titulo: 'Trabalho de História', data: '2026-11-19', horario: 'Prazo Final', tipo: 'Trabalho' },
          { id: 3, titulo: 'Reunião de pais', data: '2026-11-27', horario: '19:00', tipo: 'Reunião' },
        ];
  });

  const [notificacoes, setNotificacoes] = useState(() => {
    const salvas = localStorage.getItem('saber_notificacoes');
    return salvas
      ? JSON.parse(salvas)
      : [
          { id: 1, titulo: 'Bem-vindo ao portal SABER', descricao: 'Semestre letivo de 2026 iniciado.', data: 'Hoje', lida: false },
          { id: 2, titulo: 'Calendário atualizado', descricao: 'Novas avaliações adicionadas ao calendário acadêmico.', data: 'Ontem', lida: false },
        ];
  });

  useEffect(() => localStorage.setItem('saber_tela_ativa', telaAtiva), [telaAtiva]);
  useEffect(() => localStorage.setItem('saber_semestre', semestre), [semestre]);
  useEffect(() => localStorage.setItem('saber_usuarios', JSON.stringify(usuarios)), [usuarios]);
  useEffect(() => localStorage.setItem('saber_alunos', JSON.stringify(alunos)), [alunos]);
  useEffect(() => localStorage.setItem('saber_disciplinas', JSON.stringify(disciplinas)), [disciplinas]);
  useEffect(() => localStorage.setItem('saber_notas', JSON.stringify(notas)), [notas]);
  useEffect(() => localStorage.setItem('saber_objetivos', JSON.stringify(objetivos)), [objetivos]);
  useEffect(() => localStorage.setItem('saber_eventos', JSON.stringify(eventos)), [eventos]);
  useEffect(() => localStorage.setItem('saber_notificacoes', JSON.stringify(notificacoes)), [notificacoes]);

  useEffect(() => {
    if (usuarioLogado) localStorage.setItem('saber_sessao', JSON.stringify(usuarioLogado));
    else localStorage.removeItem('saber_sessao');
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return (
      <Login
        usuarios={usuarios}
        setUsuarios={setUsuarios}
        setUsuarioLogado={setUsuarioLogado}
        alunos={alunos}
        setAlunos={setAlunos}
      />
    );
  }

  const isAdmin = usuarioLogado.tipo === 'Admin';
  const rotasAdmin = ['dashboard', 'alunos', 'calendario', 'disciplinas', 'perfil', 'notificacoes', 'configuracoes'];
  const rotasAluno = ['dashboard', 'objetivos', 'calendario', 'notas', 'perfil', 'notificacoes', 'configuracoes'];
  const permitidas = isAdmin ? rotasAdmin : rotasAluno;
  const telaAtual = permitidas.includes(telaAtiva) ? telaAtiva : 'dashboard';

  return (
    <>
      <input type="checkbox" id="menu" />
      <div className="app-shell">
        <Sidebar
          telaAtiva={telaAtual}
          setTelaAtiva={setTelaAtiva}
          usuarioLogado={usuarioLogado}
        />

        <main className="main">
          <div className="top-bar">
            <label htmlFor="menu" className="burger">☰</label>
            <div className="user-pill">
              <span className="user-avatar-sm">
                {usuarioLogado.nome?.slice(0, 2).toUpperCase()}
              </span>
              <span>{usuarioLogado.tipo}</span>
            </div>
            <button className="mini danger" onClick={() => setUsuarioLogado(null)}>
              Sair
            </button>
          </div>

          {telaAtual === 'dashboard' && (
            <Dashboard
              alunos={alunos}
              disciplinas={disciplinas}
              notas={notas}
              eventos={eventos}
              usuarioLogado={usuarioLogado}
              semestre={semestre}
              setSemestre={setSemestre}
              setTelaAtiva={setTelaAtiva}
            />
          )}

          {telaAtual === 'alunos' && (
            <Alunos
              alunos={alunos}
              setAlunos={setAlunos}
              usuarios={usuarios}
              setUsuarios={setUsuarios}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'disciplinas' && (
            <Disciplinas
              disciplinas={disciplinas}
              setDisciplinas={setDisciplinas}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'calendario' && (
            <Calendario
              eventos={eventos}
              setEventos={setEventos}
              usuarioLogado={usuarioLogado}
              semestre={semestre}
              setSemestre={setSemestre}
              setNotificacoes={setNotificacoes}
            />
          )}

          {telaAtual === 'objetivos' && (
            <Objetivos
              objetivos={objetivos}
              setObjetivos={setObjetivos}
              usuarioLogado={usuarioLogado}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'notas' && (
            <Notas
              notas={notas}
              setNotas={setNotas}
              alunos={alunos}
              disciplinas={disciplinas}
              usuarioLogado={usuarioLogado}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'perfil' && (
            <Perfil
              usuarioLogado={usuarioLogado}
              setUsuarioLogado={setUsuarioLogado}
              usuarios={usuarios}
              setUsuarios={setUsuarios}
              alunos={alunos}
              setAlunos={setAlunos}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'notificacoes' && (
            <Notificacoes
              notificacoes={notificacoes}
              setNotificacoes={setNotificacoes}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}

          {telaAtual === 'configuracoes' && (
            <Configuracoes
              usuarioLogado={usuarioLogado}
              setUsuarioLogado={setUsuarioLogado}
              usuarios={usuarios}
              setUsuarios={setUsuarios}
              semestre={semestre}
              setSemestre={setSemestre}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default App;