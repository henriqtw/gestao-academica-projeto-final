import { useState } from 'react';

function Configuracoes({ usuarioLogado, setUsuarioLogado, usuarios, setUsuarios, semestre, setSemestre }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleAlterarSenha = (e) => {
    e.preventDefault();
    if (!novaSenha.trim()) {
      setMensagem('Erro: Digite a nova senha.');
      return;
    }
    const atualizado = { ...usuarioLogado, senha: novaSenha.trim() };
    setUsuarioLogado(atualizado);
    setUsuarios(usuarios.map((u) => (u.id === usuarioLogado.id ? atualizado : u)));
    setNovaSenha('');
    setMensagem('Senha alterada com sucesso!');
  };

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Configurações</h1>
          <p className="sub">Preferências do sistema e segurança da conta</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      {mensagem && (
        <p style={{ color: mensagem.startsWith('Erro') ? 'crimson' : '#16a34a', fontWeight: 'bold', marginBottom: '12px' }}>
          {mensagem}
        </p>
      )}

      <div className="grid-2-equal">
        <form className="card" onSubmit={handleAlterarSenha}>
          <h3>Segurança da Conta</h3>
          <label>Nova senha de acesso</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite a nova senha"
          />
          <div className="acts">
            <button type="submit" className="btn">
              Atualizar Senha
            </button>
          </div>
        </form>

        <div className="card">
          <h3>Período Letivo Ativo</h3>
          <label>Semestre exibido no painel</label>
          <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
            <option value="1º Semestre (2026)">1º Semestre (2026)</option>
            <option value="2º Semestre (2026)">2º Semestre (2026)</option>
          </select>
          <p className="sub" style={{ marginTop: '14px' }}>
            Perfil atual: <strong>{usuarioLogado.tipo}</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export default Configuracoes;