function Sidebar({ telaAtiva, setTelaAtiva, usuarioLogado }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const menus = isAdmin
    ? [
        { id: 'dashboard', label: 'Início' },
        { id: 'alunos', label: 'Alunos' },
        { id: 'disciplinas', label: 'Disciplinas' },
        { id: 'notas', label: 'Lançar Notas' },
        { id: 'perfil', label: 'Meu Perfil' },
      ]
    : [
        { id: 'dashboard', label: 'Início' },
        { id: 'notas', label: 'Meu Boletim' },
        { id: 'perfil', label: 'Perfil e Objetivos' },
      ];

  return (
    <aside className="side">
      <div className="brand">SABER</div>
      {menus.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={telaAtiva === item.id ? 'on' : ''}
          onClick={(e) => {
            e.preventDefault();
            setTelaAtiva(item.id);
          }}
        >
          {item.label}
        </a>
      ))}
    </aside>
  );
}

export default Sidebar;