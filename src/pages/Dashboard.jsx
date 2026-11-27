function Dashboard({ alunos, disciplinas, notas, usuarioLogado, setTelaAtiva }) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';

  const buscarAluno = (id) => alunos.find((a) => a.id === Number(id));
  const buscarDisciplina = (id) => disciplinas.find((d) => d.id === Number(id));

  const obterSituacao = (media) => {
    if (media >= 7) return { texto: 'Aprovado', classe: 'tag' };
    if (media >= 5) return { texto: 'Recuperação', classe: 'tag r' };
    return { texto: 'Reprovado', classe: 'tag b' };
  };

  // ==========================================
  // VISÃO DO ALUNO (PAINEL ACADÊMICO)
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

    const aprovadas = minhasNotas.filter((n) => (n.nota1 + n.nota2) / 2 >= 7).length;
    const emAtencao = minhasNotas.filter((n) => (n.nota1 + n.nota2) / 2 < 7).length;

    return (
      <>
        <h1>Olá, {usuarioLogado.nome}</h1>
        <p className="sub">
          Matrícula: <strong>{alunoAtual?.matricula || usuarioLogado.matricula || '-'}</strong> | Turma:{' '}
          <strong>{alunoAtual?.turma || usuarioLogado.turma || '-'}</strong>
        </p>

        <div className="row">
          <div className="card">
            <h3>Média Geral</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{mediaGeral}</p>
            <p className="sub">Baseada em {minhasNotas.length} disciplina(s) avaliada(s)</p>
          </div>

          <div className="card">
            <h3>Desempenho por Disciplina</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>
              {aprovadas} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>aprovada(s)</span>
            </p>
            <p className="sub">{emAtencao} disciplina(s) em recuperação ou atenção</p>
          </div>
        </div>

        <div className="card wrap" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Resumo das Notas</h3>
            <button className="btn" onClick={() => setTelaAtiva('notas')}>
              Ver Boletim Completo
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Média</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {minhasNotas.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhuma avaliação registrada até o momento.
                  </td>
                </tr>
              ) : (
                minhasNotas.map((item) => {
                  const disc = buscarDisciplina(item.disciplinaId);
                  const media = (item.nota1 + item.nota2) / 2;
                  const status = obterSituacao(media);

                  return (
                    <tr key={item.id}>
                      <td>{disc ? `${disc.codigo} - ${disc.nome}` : 'Disciplina removida'}</td>
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
  // VISÃO DO ADMIN (PAINEL GESTOR)
  // ==========================================
  const alunosAtivos = alunos.filter((a) => a.situacao === 'Ativo').length;
  const disciplinasAtivas = disciplinas.filter((d) => d.situacao === 'Ativa').length;
  const totalLancamentos = notas.length;
  const aprovadosCount = notas.filter((n) => (n.nota1 + n.nota2) / 2 >= 7).length;
  const taxaAprovacao =
    totalLancamentos > 0 ? `${Math.round((aprovadosCount / totalLancamentos) * 100)}%` : '-';

  const notasEmAtencao = notas.filter((n) => (n.nota1 + n.nota2) / 2 < 7);

  return (
    <>
      <h1>Painel Administrativo</h1>
      <p className="sub">Visão geral dos cadastros e desempenho acadêmico do semestre.</p>

      <div className="row">
        <div className="card">
          <h3>Alunos Ativos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{alunosAtivos}</p>
          <p className="sub">De {alunos.length} cadastrado(s) no total</p>
        </div>

        <div className="card">
          <h3>Disciplinas Ativas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{disciplinasAtivas}</p>
          <p className="sub">De {disciplinas.length} cadastrada(s) no total</p>
        </div>
      </div>

      <div className="row" style={{ marginTop: '16px' }}>
        <div className="card">
          <h3>Avaliações Lançadas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{totalLancamentos}</p>
          <p className="sub">Registros de notas no sistema</p>
        </div>

        <div className="card">
          <h3>Índice de Aprovação</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{taxaAprovacao}</p>
          <p className="sub">{aprovadosCount} lançamento(s) com média igual ou superior a 7,0</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Ações Rápidas</h3>
        <div className="acts" style={{ justifyContent: 'flex-start', gap: '10px', marginTop: '10px' }}>
          <button className="btn" onClick={() => setTelaAtiva('alunos')}>
            Gerenciar Alunos
          </button>
          <button className="btn" onClick={() => setTelaAtiva('disciplinas')}>
            Gerenciar Disciplinas
          </button>
          <button className="btn" onClick={() => setTelaAtiva('notas')}>
            Lançar Notas
          </button>
        </div>
      </div>

      <div className="card wrap" style={{ marginTop: '20px' }}>
        <h3>Acompanhamento Pedagógico (Média abaixo de 7,0)</h3>
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Disciplina</th>
              <th>Média</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {notasEmAtencao.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum aluno em recuperação ou reprovação no momento.
                </td>
              </tr>
            ) : (
              notasEmAtencao.map((item) => {
                const aluno = buscarAluno(item.alunoId);
                const disc = buscarDisciplina(item.disciplinaId);
                const media = (item.nota1 + item.nota2) / 2;
                const status = obterSituacao(media);

                return (
                  <tr key={item.id}>
                    <td>{aluno ? `${aluno.nome} (${aluno.turma})` : 'Aluno removido'}</td>
                    <td>{disc ? disc.nome : 'Disciplina removida'}</td>
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

export default Dashboard;