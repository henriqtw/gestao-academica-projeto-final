import { useState } from 'react';

function Notas({ notas, setNotas, alunos, disciplinas, usuarioLogado }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const [alunoId, setAlunoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');

  const buscarAluno = (id) => alunos.find((a) => a.id === Number(id));
  const buscarDisciplina = (id) => disciplinas.find((d) => d.id === Number(id));

  const obterSituacao = (media) => {
    if (media >= 7) return { texto: 'Aprovado', classe: 'tag' };
    if (media >= 5) return { texto: 'Recuperação', classe: 'tag r' };
    return { texto: 'Reprovado', classe: 'tag b' };
  };

  // ==========================================
  // VISÃO DO ALUNO (BOLETIM INDIVIDUAL)
  // ==========================================
  if (!isAdmin) {
    const alunoAtual = alunos.find(
      (a) =>
        a.id === usuarioLogado.id ||
        (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula) ||
        a.email.toLowerCase() === usuarioLogado.email.toLowerCase()
    );

    const minhasNotas = alunoAtual
      ? notas.filter((n) => n.alunoId === alunoAtual.id)
      : [];

    const mediaGeral =
      minhasNotas.length > 0
        ? (
            minhasNotas.reduce((soma, n) => soma + (n.nota1 + n.nota2) / 2, 0) /
            minhasNotas.length
          ).toFixed(1)
        : '-';

    return (
      <>
        <h1>Meu Boletim</h1>
        <p className="sub">
          Matrícula: <strong>{alunoAtual?.matricula || usuarioLogado.matricula || '-'}</strong> | Turma:{' '}
          <strong>{alunoAtual?.turma || usuarioLogado.turma || '-'}</strong> | Média Geral:{' '}
          <strong>{mediaGeral}</strong>
        </p>

        <div className="card wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Disciplina</th>
                <th>1º Bimestre</th>
                <th>2º Bimestre</th>
                <th>Média</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {minhasNotas.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhuma nota lançada até o momento.
                  </td>
                </tr>
              ) : (
                minhasNotas.map((item) => {
                  const disc = buscarDisciplina(item.disciplinaId);
                  const media = (item.nota1 + item.nota2) / 2;
                  const status = obterSituacao(media);

                  return (
                    <tr key={item.id}>
                      <td>{disc ? disc.codigo : '-'}</td>
                      <td>{disc ? disc.nome : 'Disciplina removida'}</td>
                      <td>{item.nota1.toFixed(1)}</td>
                      <td>{item.nota2.toFixed(1)}</td>
                      <td>
                        <strong>{media.toFixed(1)}</strong>
                      </td>
                      <td>
                        <span className={status.classe}>{status.texto}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ==========================================
  // VISÃO DO ADMIN (LANÇAMENTO E GESTÃO)
  // ==========================================
  const alunosAtivos = alunos.filter((a) => a.situacao === 'Ativo');
  const disciplinasAtivas = disciplinas.filter((d) => d.situacao === 'Ativa');

  const handleLancarNota = (e) => {
    e.preventDefault();

    if (!alunoId || !disciplinaId || nota1 === '' || nota2 === '') {
      setMensagem('Erro: Selecione o aluno, a disciplina e preencha as duas notas.');
      return;
    }

    const n1 = Number(nota1);
    const n2 = Number(nota2);

    if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      setMensagem('Erro: As notas devem estar entre 0 e 10.');
      return;
    }

    const jaLancada = notas.find(
      (n) => n.alunoId === Number(alunoId) && n.disciplinaId === Number(disciplinaId)
    );
    if (jaLancada) {
      setMensagem('Erro: Este aluno já possui notas nesta disciplina. Exclua o lançamento para refazer.');
      return;
    }

    const novoLancamento = {
      id: Date.now(),
      alunoId: Number(alunoId),
      disciplinaId: Number(disciplinaId),
      nota1: n1,
      nota2: n2,
    };

    setNotas([...notas, novoLancamento]);
    setAlunoId('');
    setDisciplinaId('');
    setNota1('');
    setNota2('');
    setMensagem('Notas lançadas com sucesso!');
  };

  const excluirNota = (id) => {
    setNotas(notas.filter((n) => n.id !== id));
    setMensagem('Lançamento removido.');
  };

  const notasFiltradas = notas.filter((item) => {
    const aluno = buscarAluno(item.alunoId);
    const disc = buscarDisciplina(item.disciplinaId);
    const textoBusca = busca.toLowerCase();

    return (
      (aluno && aluno.nome.toLowerCase().includes(textoBusca)) ||
      (disc && disc.nome.toLowerCase().includes(textoBusca))
    );
  });

  return (
    <>
      <h1>Lançamento de Notas</h1>
      <p className="sub">Selecione o aluno e a disciplina para registrar as avaliações.</p>

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

      <form className="card" onSubmit={handleLancarNota}>
        <h3>Novo Lançamento</h3>
        <div className="row">
          <div>
            <label>Aluno (Ativos) *</label>
            <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
              <option value="">Selecione um aluno</option>
              {alunosAtivos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome} ({aluno.turma})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Disciplina (Ativas) *</label>
            <select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)}>
              <option value="">Selecione uma disciplina</option>
              {disciplinasAtivas.map((disc) => (
                <option key={disc.id} value={disc.id}>
                  {disc.codigo} - {disc.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div>
            <label>1º Bimestre (0 a 10) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={nota1}
              onChange={(e) => setNota1(e.target.value)}
              placeholder="Ex.: 8.5"
            />
          </div>

          <div>
            <label>2º Bimestre (0 a 10) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={nota2}
              onChange={(e) => setNota2(e.target.value)}
              placeholder="Ex.: 7.0"
            />
          </div>
        </div>

        <div className="acts">
          <button type="submit" className="btn">
            Salvar Notas
          </button>
        </div>
      </form>

      <div className="bar" style={{ marginTop: '20px' }}>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Filtrar lançamentos por aluno ou disciplina..."
        />
      </div>

      <div className="card wrap">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Disciplina</th>
              <th>1º Bim</th>
              <th>2º Bim</th>
              <th>Média</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {notasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma nota encontrada.
                </td>
              </tr>
            ) : (
              notasFiltradas.map((item) => {
                const aluno = buscarAluno(item.alunoId);
                const disc = buscarDisciplina(item.disciplinaId);
                const media = (item.nota1 + item.nota2) / 2;
                const status = obterSituacao(media);

                return (
                  <tr key={item.id}>
                    <td>{aluno ? `${aluno.nome} (${aluno.turma})` : 'Aluno removido'}</td>
                    <td>{disc ? disc.nome : 'Disciplina removida'}</td>
                    <td>{item.nota1.toFixed(1)}</td>
                    <td>{item.nota2.toFixed(1)}</td>
                    <td>
                      <strong>{media.toFixed(1)}</strong>
                    </td>
                    <td>
                      <span className={status.classe}>{status.texto}</span>
                    </td>
                    <td>
                      <button className="mini r" onClick={() => excluirNota(item.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Notas;