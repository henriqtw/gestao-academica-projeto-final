function Sidebar({ telaAtiva, setTelaAtiva, usuarioLogado }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const menus = isAdmin
    ? [
        { id: 'dashboard', label: 'Visão Geral' },
        { id: 'alunos', label: 'Gestão de Alunos' },
        { id: 'calendario', label: 'Calendário' },
        { id: 'disciplinas', label: 'Disciplinas' },
        { id: 'perfil', label: 'Meu Perfil' },
        { id: 'notificacoes', label: 'Notificações' },
        { id: 'configuracoes', label: 'Configurações' },
      ]
    : [
        { id: 'dashboard', label: 'Visão Geral' },
        { id: 'objetivos', label: 'Meus Objetivos' },
        { id: 'calendario', label: 'Calendário' },
        { id: 'notas', label: 'Minhas Notas' },
        { id: 'perfil', label: 'Meu Perfil' },
        { id: 'notificacoes', label: 'Notificações' },
        { id: 'configuracoes', label: 'Configurações' },
      ];

  const selecionarTela = (e, id) => {
    e.preventDefault();
    setTelaAtiva(id);
    const menuCheck = document.getElementById('menu');
    if (menuCheck) menuCheck.checked = false;
  };

  return (
    <aside className="side">
      <label htmlFor="menu" className="close">✕</label>
      <div className="logo-wrap">
        <img src="/marca-saber.png" alt="SABER - Sistema Acadêmico" className="logo-img" />
      </div>
      {menus.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={telaAtiva === item.id ? 'on' : ''}
          onClick={(e) => selecionarTela(e, item.id)}
        >
          {item.label}
        </a>
      ))}
    </aside>
  );
}

export default Sidebar;