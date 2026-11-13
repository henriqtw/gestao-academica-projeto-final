import { useState } from 'react';

function Perfil({
  usuarioLogado,
  setUsuarioLogado,
  usuarios,
  setUsuarios,
  alunos,
  setAlunos,
  objetivos,
  setObjetivos,
}) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const [nome, setNome] = useState(usuarioLogado?.nome || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [tituloObjetivo, setTituloObjetivo] = useState('');
  const [prazoObjetivo, setPrazoObjetivo] = useState('');

  const alunoAtual = !isAdmin
    ? alunos.find(
        (a) =>
          a.id === usuarioLogado.id ||
          (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula) ||
          a.email.toLowerCase() === usuarioLogado.email.toLowerCase()
      )
    : null;

  const handleSalvarPerfil = (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      setMensagem('Erro: O nome não pode ficar em branco.');
      return;
    }

    const usuariosAtualizados = usuarios.map((u) => {
      if (u.id === usuarioLogado.id) {
        return {
          ...u,
          nome: nome.trim(),
          senha: novaSenha.trim() ? novaSenha.trim() : u.senha,
        };
      }
      return u;
    });

    setUsuarios(usuariosAtualizados);

    const sessaoAtualizada = {
      ...usuarioLogado,
      nome: nome.trim(),
      senha: novaSenha.trim() ? novaSenha.trim() : usuarioLogado.senha,
    };
    setUsuarioLogado(sessaoAtualizada);

    if (!isAdmin) {
      setAlunos(
        alunos.map((a) =>
          a.id === usuarioLogado.id ||
          (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula) ||
          a.email.toLowerCase() === usuarioLogado.email.toLowerCase()
            ? { ...a, nome: nome.trim() }
            : a
        )
      );
    }

    setNovaSenha('');
    setMensagem('Dados atualizados com sucesso!');
  };

  const handleAdicionarObjetivo = (e) => {
    e.preventDefault();

    if (!tituloObjetivo.trim()) {
      setMensagem('Erro: Descreva o objetivo antes de adicionar.');
      return;
    }

    const novoObjetivo = {
      id: Date.now(),
      usuarioId: usuarioLogado.id,
      titulo: tituloObjetivo.trim(),
      prazo: prazoObjetivo || 'Sem prazo',
      concluido: false,
    };

    setObjetivos([...objetivos, novoObjetivo]);
    setTituloObjetivo('');
    setPrazoObjetivo('');
    setMensagem('Objetivo adicionado!');
  };

  const alternarConclusao = (id) => {
    setObjetivos(
      objetivos.map((obj) =>
        obj.id === id ? { ...obj, concluido: !obj.concluido } : obj
      )
    );
  };

  const excluirObjetivo = (id) => {
    setObjetivos(objetivos.filter((obj) => obj.id !== id));
  };

  const meusObjetivos = objetivos.filter((obj) => obj.usuarioId === usuarioLogado.id);

  return (
    <>
      <h1>{isAdmin ? 'Meu Perfil' : 'Perfil e Objetivos'}</h1>
      <p className="sub">
        Gerencie suas informações de acesso e acompanhe suas metas do semestre.
      </p>

      {mensagem && (
        <p
          style={{
            color: mensagem.startsWith('Erro') ? 'crimson' : 'green',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}
        >
          {mensagem}
        </p>
      )}

      <form className="card" onSubmit={handleSalvarPerfil}>
        <h3>Dados da Conta</h3>
        <div className="row">
          <div>
            <label>Nome Completo *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label>E-mail de Acesso</label>
            <input type="email" value={usuarioLogado.email} disabled />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Perfil / Vínculo</label>
            <input
              type="text"
              value={
                isAdmin
                  ? 'Administrador'
                  : `Aluno — Matrícula: ${alunoAtual?.matricula || usuarioLogado.matricula || '-'} (${alunoAtual?.turma || usuarioLogado.turma || '-'})`
              }
              disabled
            />
          </div>

          <div>
            <label>Nova Senha (deixe em branco para manter a atual)</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite uma nova senha..."
            />
          </div>
        </div>

        <div className="acts">
          <button type="submit" className="btn">
            Salvar Alterações
          </button>
        </div>
      </form>

      <form className="card" style={{ marginTop: '20px' }} onSubmit={handleAdicionarObjetivo}>
        <h3>{isAdmin ? 'Metas Administrativas' : 'Meus Objetivos Acadêmicos'}</h3>
        <div className="row">
          <div>
            <label>Descrição da Meta *</label>
            <input
              type="text"
              value={tituloObjetivo}
              onChange={(e) => setTituloObjetivo(e.target.value)}
              placeholder={
                isAdmin
                  ? 'Ex.: Fechar lançamentos do 1º bimestre'
                  : 'Ex.: Alcançar média 8,5 em Matemática'
              }
            />
          </div>

          <div>
            <label>Prazo / Etapa</label>
            <input
              type="text"
              value={prazoObjetivo}
              onChange={(e) => setPrazoObjetivo(e.target.value)}
              placeholder="Ex.: Fim do 2º Bimestre"
            />
          </div>
        </div>

        <div className="acts">
          <button type="submit" className="btn">
            Adicionar Objetivo
          </button>
        </div>
      </form>

      <div className="card wrap" style={{ marginTop: '20px' }}>
        <table>
          <thead>
            <tr>
              <th>Objetivo</th>
              <th>Prazo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {meusObjetivos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum objetivo cadastrado ainda.
                </td>
              </tr>
            ) : (
              meusObjetivos.map((obj) => (
                <tr key={obj.id}>
                  <td
                    style={{
                      textDecoration: obj.concluido ? 'line-through' : 'none',
                      opacity: obj.concluido ? 0.7 : 1,
                    }}
                  >
                    {obj.titulo}
                  </td>
                  <td>{obj.prazo}</td>
                  <td>
                    <span className={obj.concluido ? 'tag' : 'tag b'}>
                      {obj.concluido ? 'Concluído' : 'Em andamento'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="mini"
                      style={{ marginRight: '6px' }}
                      onClick={() => alternarConclusao(obj.id)}
                    >
                      {obj.concluido ? 'Reabrir' : 'Concluir'}
                    </button>
                    <button className="mini r" onClick={() => excluirObjetivo(obj.id)}>
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

export default Perfil;