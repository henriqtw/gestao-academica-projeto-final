function Sidebar({ telaAtiva, setTelaAtiva }) {
const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'objetivos', label: 'Meus Objetivos' },
    { id: 'notas', label: 'Minhas Notas' },
    { id: 'alunos', label: 'Gestão de Alunos' },
    { id: 'calendario', label: 'Calendário' },
    { id: 'disciplinas', label: 'Disciplinas' },
    { id: 'perfil', label: 'Meu Perfil' },
    { id: 'notificacoes', label: 'Notificações' },
    { id: 'configuracoes', label: 'Configurações' },
];


    const navegar = (e, id) => {
    e.preventDefault();
    setTelaAtiva(id);
  };

  return (
    <nav className="side">
      <label htmlFor="menu" className="close">✕</label>
      <div className="logo">SABER</div>

      {links.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={telaAtiva === item.id ? 'on' : ''}
          onClick={(e) => navegar(e, item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default Sidebar;