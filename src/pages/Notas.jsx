import { useState } from 'react';

function Notas({ notas, setNotas, alunos, disciplinas, usuarioLogado, semestre, setSemestre }) {
  const [disciplinaId, setDisciplinaId] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [mensagem, setMensagem] = useState('');

  const alunoAtual = alunos.find(
    (a) =>
      a.id === usuarioLogado.id ||
      (usuarioLogado.matricula && a.matricula === usuarioLogado.matricula) ||
      a.email.toLowerCase() === usuarioLogado.email.toLowerCase()
  );

  const alunoId = alunoAtual ? alunoAtual.id : usuarioLogado.id;
  const minhasNotas = notas.filter((n) => n.alunoId === alunoId);
  const disciplinasAtivas = disciplinas.filter((d) => d.situacao === 'Ativa');

  const mediaGeral =
    minhasNotas.length > 0
      ? (
          minhasNotas.reduce((soma, n) => soma + (n.nota1 + n.nota2) / 2, 0) /
          minhasNotas.length
        ).toFixed(1)
      : '-';

  const handleSalvarNota = (e) => {
    e.preventDefault();
    if (!disciplinaId || nota1 === '' || nota2 === '') {
      setMensagem('Erro: Selecione a disciplina e informe as duas notas.');
      return;
    }

    const n1 = Number(nota1);
    const n2 = Number(nota2);

    if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      setMensagem('Erro: As notas devem estar entre 0 e 10.');
      return;
    }

    const existente = minhasNotas.find((n) => n.disciplinaId === Number(disciplinaId));
    if (existente) {
      setNotas(
        notas.map((n) =>
          n.id === existente.id ? { ...n, nota1: n1, nota2: n2 } : n
        )
      );
      setMensagem('Notas atualizadas com sucesso!');
    } else {
      setNotas([
        ...notas,
        {
          id: Date.now(),
          alunoId,
          disciplinaId: Number(disciplinaId),
          nota1: n1,
          nota2: n2,
        },
      ]);
      setMensagem('Nota adicionada ao boletim!');
    }

    setDisciplinaId('');
    setNota1('');
    setNota2('');
  };

  const obterClasseMedia = (media) => {
    if (media >= 8) return 'tag';
    if (media >= 7) return 'tag w';
    return 'tag b';
  };

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Minhas Notas</h1>
          <p className="sub">
            Confira e registre suas notas por disciplina · <strong>Média Geral: {mediaGeral}</strong>
          </p>
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

      <form className="card" style={{ marginBottom: '22px' }} onSubmit={handleSalvarNota}>
        <h3>Lançar / Atualizar Nota</h3>
        <div className="row">
          <div>
            <label>Disciplina *</label>
            <select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)}>
              <option value="">Selecione a disciplina</option>
              {disciplinasAtivas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome} ({d.codigo})
                </option>
              ))}
            </select>
          </div>
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
              placeholder="Ex.: 9.0"
            />
          </div>
        </div>
        <div className="acts">
          <button type="submit" className="btn">
            Salvar Nota
          </button>
        </div>
      </form>

      <div className="card wrap">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th style={{ textAlign: 'center' }}>1º Bimestre</th>
              <th style={{ textAlign: 'center' }}>2º Bimestre</th>
              <th style={{ textAlign: 'center' }}>Média</th>
            </tr>
          </thead>
          <tbody>
            {minhasNotas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>
                  Nenhuma nota lançada ainda. Use o formulário acima para registrar.
                </td>
              </tr>
            ) : (
              minhasNotas.map((item) => {
                const disc = disciplinas.find((d) => d.id === Number(item.disciplinaId));
                const media = (item.nota1 + item.nota2) / 2;
                return (
                  <tr key={item.id}>
                    <td>{disc ? disc.nome : 'Disciplina'}</td>
                    <td style={{ textAlign: 'center' }}>{item.nota1.toFixed(1).replace('.', ',')}</td>
                    <td style={{ textAlign: 'center' }}>{item.nota2.toFixed(1).replace('.', ',')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={obterClasseMedia(media)}>
                        {media.toFixed(1).replace('.', ',')}
                      </span>
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