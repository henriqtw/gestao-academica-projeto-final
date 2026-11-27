import { useState } from 'react';

function Perfil({
  usuarioLogado,
  setUsuarioLogado,
  usuarios,
  setUsuarios,
  alunos,
  setAlunos,
  semestre,
  setSemestre,
}) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';
  const [editando, setEditando] = useState(false);

  const [nome, setNome] = useState(usuarioLogado?.nome || '');
  const [email, setEmail] = useState(usuarioLogado?.email || '');
  const [telefone, setTelefone] = useState(usuarioLogado?.telefone || '(11) 12345-6789');
  const [nascimento, setNascimento] = useState(usuarioLogado?.nascimento || '14/10/2009');
  const [mensagem, setMensagem] = useState('');

  const alunoAtual = !isAdmin
    ? alunos.find(
        (a) =>
          a.id === usuarioLogado.id ||
          (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula)
      )
    : null;

  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const handleSalvar = (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    const atualizado = {
      ...usuarioLogado,
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      nascimento: nascimento.trim(),
    };

    setUsuarioLogado(atualizado);
    setUsuarios(usuarios.map((u) => (u.id === usuarioLogado.id ? atualizado : u)));

    if (!isAdmin) {
      setAlunos(
        alunos.map((a) =>
          a.id === usuarioLogado.id
            ? { ...a, nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), nascimento: nascimento.trim() }
            : a
        )
      );
    }

    setEditando(false);
    setMensagem('Informações atualizadas com sucesso!');
  };

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Meu perfil</h1>
          <p className="sub">Gerencie suas informações</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      {mensagem && (
        <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '12px' }}>{mensagem}</p>
      )}

      {editando ? (
        <form className="card" onSubmit={handleSalvar}>
          <h3>Editar informações do perfil</h3>
          <div className="row">
            <div>
              <label>Nome completo *</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label>Data de nascimento</label>
              <input value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>E-mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Telefone</label>
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
          </div>
          <div className="acts">
            <button type="button" className="btn ghost" onClick={() => setEditando(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn">
              Salvar Perfil
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-hero">
            <button className="edit-fab" title="Editar perfil" onClick={() => setEditando(true)}>
              ✏️
            </button>
            <div className="avatar-lg">{iniciais || 'US'}</div>
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '6px' }}>{usuarioLogado.nome}</h2>
              <p style={{ fontSize: '16px', color: '#1e293b', marginBottom: '4px' }}>{nascimento}</p>
              <p style={{ fontSize: '15px', color: '#334155', fontWeight: 600 }}>
                {isAdmin
                  ? 'Administrador Institucional'
                  : `${alunoAtual?.turma || usuarioLogado.turma || 'Turma'} · RA ${alunoAtual?.matricula || usuarioLogado.matricula || '-'}`}
              </p>
            </div>
          </div>

          <div className="info-strip">
            <div>
              <small style={{ color: '#334155', fontSize: '14px', display: 'block' }}>E-mail</small>
              <strong style={{ fontSize: '20px' }}>{usuarioLogado.email}</strong>
            </div>
            <button className="mini icon-btn" onClick={() => setEditando(true)}>
              📝
            </button>
          </div>

          <div className="info-strip">
            <div>
              <small style={{ color: '#334155', fontSize: '14px', display: 'block' }}>Telefone</small>
              <strong style={{ fontSize: '20px' }}>{telefone}</strong>
            </div>
            <button className="mini icon-btn" onClick={() => setEditando(true)}>
              📝
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Perfil;