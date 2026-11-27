import { useState, useEffect } from 'react';

const CONFIG_PADRAO = {
  curso: 'Desenvolvimento de Sistemas',
  periodo: '2º Semestre',
  turno: 'Noite',
  exibirNotasInicio: true,
  lembretesAtividades: true,
  exibirMediaGeral: true,
  exibirFrequencia: true,
  notifEmail: true,
  avisarNovasNotas: true,
  lembreteAtividadesNotif: true,
  avisoFaltas: true,
  horarioNotificacao: '08:00',
  tema: 'Claro',
  idioma: 'Português (BR)',
  fusoHorario: '(GMT-03:00) Brasília',
};

function Configuracoes({
  usuarioLogado,
  setUsuarioLogado,
  usuarios,
  setUsuarios,
  alunos,
  setAlunos,
  disciplinas,
  notas,
  semestre,
  setSemestre,
}) {
  const isAdmin = usuarioLogado?.tipo === 'Admin';
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [mensagem, setMensagem] = useState('');

  const [config, setConfig] = useState(() => {
    const salva = localStorage.getItem('saber_config');
    return salva ? { ...CONFIG_PADRAO, ...JSON.parse(salva) } : CONFIG_PADRAO;
  });

  const [nome, setNome] = useState(usuarioLogado?.nome || '');
  const [matricula, setMatricula] = useState(usuarioLogado?.matricula || '20251234');
  const [foto, setFoto] = useState(usuarioLogado?.foto || '');
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    localStorage.setItem('saber_config', JSON.stringify(config));
    if (config.tema === 'Escuro') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [config]);

  const atualizarCampoConfig = (campo, valor) => {
    setConfig((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleTrocarFoto = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      const base64 = leitor.result;
      setFoto(base64);
      const atualizado = { ...usuarioLogado, foto: base64 };
      setUsuarioLogado(atualizado);
      setUsuarios(usuarios.map((u) => (u.id === usuarioLogado.id ? atualizado : u)));
      setMensagem('Foto de perfil atualizada!');
    };
    leitor.readAsDataURL(arquivo);
  };

  const handleSalvarGeral = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const atualizado = {
      ...usuarioLogado,
      nome: nome.trim(),
      matricula: matricula.trim(),
      curso: config.curso,
      foto,
    };

    setUsuarioLogado(atualizado);
    setUsuarios(usuarios.map((u) => (u.id === usuarioLogado.id ? atualizado : u)));

    if (!isAdmin) {
      setAlunos(
        alunos.map((a) =>
          a.id === usuarioLogado.id
            ? { ...a, nome: nome.trim(), matricula: matricula.trim() }
            : a
        )
      );
    }

    setMensagem('Informações gerais salvas com sucesso!');
  };

  const handleAlterarSenha = (e) => {
    e.preventDefault();
    if (!novaSenha.trim()) {
      setMensagem('Erro: Digite a nova senha antes de salvar.');
      return;
    }
    const atualizado = { ...usuarioLogado, senha: novaSenha.trim() };
    setUsuarioLogado(atualizado);
    setUsuarios(usuarios.map((u) => (u.id === usuarioLogado.id ? atualizado : u)));
    setNovaSenha('');
    setMensagem('Senha alterada com sucesso!');
  };

  const handleLimparCache = () => {
    localStorage.removeItem('saber_tela_ativa');
    setMensagem('Cache temporário do sistema limpo com sucesso!');
  };

  const handleExportarDados = () => {
    const pacote = {
      usuario: usuarioLogado,
      configuracoes: config,
      disciplinas,
      notas,
      exportadoEm: new Date().toLocaleString('pt-BR'),
    };
    const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saber-dados-${usuarioLogado.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMensagem('Arquivo JSON com seus dados exportado!');
  };

  const handleRedefinir = () => {
    setConfig(CONFIG_PADRAO);
    localStorage.setItem('saber_config', JSON.stringify(CONFIG_PADRAO));
    setMensagem('Configurações redefinidas para o padrão do SABER.');
  };

  const totalDisciplinas = disciplinas.filter((d) => d.situacao === 'Ativa').length || 1;
  const minhasNotas = isAdmin
    ? notas
    : notas.filter((n) => n.alunoId === usuarioLogado.id);
  const concluidas = minhasNotas.filter((n) => (n.nota1 + n.nota2) / 2 >= 6).length;
  const percentualCurso = Math.min(100, Math.round((concluidas / totalDisciplinas) * 100));

  return (
    <>
      <div className="sub-top-bar">
        <div>
          <h1>Configurações do Sistema</h1>
          <p className="sub">Personalize as preferências do SABER</p>
        </div>
        <select className="semester-select" value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1º Semestre (2026)">1º Semestre (2026)</option>
          <option value="2º Semestre (2026)">2º Semestre (2026)</option>
        </select>
      </div>

      <div className="tabs-pill">
        <button
          type="button"
          className={`tab-btn ${abaAtiva === 'geral' ? 'active' : ''}`}
          onClick={() => { setAbaAtiva('geral'); setMensagem(''); }}
        >
          Geral
        </button>
        <button
          type="button"
          className={`tab-btn ${abaAtiva === 'academico' ? 'active' : ''}`}
          onClick={() => { setAbaAtiva('academico'); setMensagem(''); }}
        >
          Acadêmico
        </button>
        <button
          type="button"
          className={`tab-btn ${abaAtiva === 'notificacoes' ? 'active' : ''}`}
          onClick={() => { setAbaAtiva('notificacoes'); setMensagem(''); }}
        >
          Notificações
        </button>
        <button
          type="button"
          className={`tab-btn ${abaAtiva === 'sistema' ? 'active' : ''}`}
          onClick={() => { setAbaAtiva('sistema'); setMensagem(''); }}
        >
          Sistema
        </button>
      </div>

      {mensagem && (
        <p
          style={{
            color: mensagem.startsWith('Erro') ? 'crimson' : '#16a34a',
            fontWeight: 'bold',
            marginBottom: '14px',
          }}
        >
          {mensagem}
        </p>
      )}

      {/* ABA 1: GERAL */}
      {abaAtiva === 'geral' && (
        <>
          <form className="card-gray" style={{ marginBottom: '18px' }} onSubmit={handleSalvarGeral}>
            <div className="grid-2-wide" style={{ alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>
                  {isAdmin ? 'Informações do Administrador' : 'Informações do Aluno'}
                </h3>

                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} />

                {!isAdmin && (
                  <>
                    <label>Matrícula / RA</label>
                    <input value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                  </>
                )}

                <label>Curso</label>
                <select
                  value={config.curso}
                  onChange={(e) => atualizarCampoConfig('curso', e.target.value)}
                >
                  <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
                  <option value="Administração">Administração</option>
                  <option value="Eletrotécnica">Eletrotécnica</option>
                  <option value="Ensino Médio Técnico">Ensino Médio Técnico</option>
                </select>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>
                  Foto de Perfil
                </strong>
                <label className="photo-box" style={{ margin: 0 }}>
                  {foto ? (
                    <img src={foto} alt="Foto de perfil" className="photo-preview" />
                  ) : (
                    <div className="photo-preview">👤</div>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Alterar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTrocarFoto}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="acts">
              <button type="submit" className="btn">
                Salvar Alterações
              </button>
            </div>
          </form>

          <div className="card-gray">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Preferências</h3>
            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Exibir notas na tela inicial</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.exibirNotasInicio}
                  onChange={(e) => atualizarCampoConfig('exibirNotasInicio', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Receber lembretes de atividades</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.lembretesAtividades}
                  onChange={(e) => atualizarCampoConfig('lembretesAtividades', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        </>
      )}

      {/* ABA 2: ACADÊMICO */}
      {abaAtiva === 'academico' && (
        <>
          <div className="card-gray" style={{ marginBottom: '18px' }}>
            <div className="grid-2-wide" style={{ alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Dados Acadêmicos</h3>

                <label>Curso</label>
                <select
                  value={config.curso}
                  onChange={(e) => atualizarCampoConfig('curso', e.target.value)}
                >
                  <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
                  <option value="Administração">Administração</option>
                  <option value="Eletrotécnica">Eletrotécnica</option>
                </select>

                <label>Período</label>
                <select
                  value={config.periodo}
                  onChange={(e) => atualizarCampoConfig('periodo', e.target.value)}
                >
                  <option value="1º Semestre">1º Semestre</option>
                  <option value="2º Semestre">2º Semestre</option>
                  <option value="3º Semestre">3º Semestre</option>
                </select>

                <label>Turno</label>
                <select
                  value={config.turno}
                  onChange={(e) => atualizarCampoConfig('turno', e.target.value)}
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>
                  Progresso Geral
                </strong>
                <div className="obj-hero" style={{ padding: '24px' }}>
                  <div
                    className="ring"
                    style={{
                      width: '124px',
                      height: '124px',
                      marginBottom: '12px',
                      background: `conic-gradient(#38bdf8 ${percentualCurso}%, rgba(255,255,255,0.2) 0)`,
                    }}
                  >
                    <div
                      className="ring-inner"
                      style={{ width: '90px', height: '90px', fontSize: '22px' }}
                    >
                      {percentualCurso}%
                    </div>
                  </div>
                  <strong style={{ fontSize: '13px' }}>Disciplinas Concluídas</strong>
                  <small style={{ opacity: 0.85, marginTop: '4px' }}>
                    {concluidas} de {totalDisciplinas}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="card-gray">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Preferências Acadêmicas</h3>
            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Exibir média geral</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.exibirMediaGeral}
                  onChange={(e) => atualizarCampoConfig('exibirMediaGeral', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Exibir frequência</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.exibirFrequencia}
                  onChange={(e) => atualizarCampoConfig('exibirFrequencia', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        </>
      )}

      {/* ABA 3: NOTIFICAÇÕES */}
      {abaAtiva === 'notificacoes' && (
        <div className="grid-2-equal" style={{ alignItems: 'center' }}>
          <div className="card-gray">
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Configurações de Notificações</h3>

            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Receber notificações por E-Mail</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.notifEmail}
                  onChange={(e) => atualizarCampoConfig('notifEmail', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Avisar sobre novas notas</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.avisarNovasNotas}
                  onChange={(e) => atualizarCampoConfig('avisarNovasNotas', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Lembrete de atividades</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.lembreteAtividadesNotif}
                  onChange={(e) => atualizarCampoConfig('lembreteAtividadesNotif', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="switch-row">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Aviso de faltas</span>
              <label className="switch" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.avisoFaltas}
                  onChange={(e) => atualizarCampoConfig('avisoFaltas', e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            <label style={{ marginTop: '18px' }}>Horário das Notificações</label>
            <select
              value={config.horarioNotificacao}
              onChange={(e) => atualizarCampoConfig('horarioNotificacao', e.target.value)}
            >
              <option value="08:00">🕒 08:00</option>
              <option value="12:00">🕒 12:00</option>
              <option value="18:00">🕒 18:00</option>
              <option value="20:00">🕒 20:00</option>
            </select>
          </div>

          <div className="info-callout">
            <span style={{ fontSize: '26px' }}>ℹ️</span>
            <div>
              Você receberá as notificações no e-mail cadastrado na sua conta ({usuarioLogado.email}).
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: SISTEMA */}
      {abaAtiva === 'sistema' && (
        <div className="grid-2-equal">
          <div className="card-gray">
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Preferências do Sistema</h3>

            <label>Tema</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                className={`btn ${config.tema === 'Claro' ? '' : 'ghost'}`}
                onClick={() => atualizarCampoConfig('tema', 'Claro')}
              >
                ☀️ Claro
              </button>
              <button
                type="button"
                className={`btn ${config.tema === 'Escuro' ? '' : 'ghost'}`}
                onClick={() => atualizarCampoConfig('tema', 'Escuro')}
              >
                🌙 Escuro
              </button>
            </div>

            <label>Idioma</label>
            <select
              value={config.idioma}
              onChange={(e) => atualizarCampoConfig('idioma', e.target.value)}
            >
              <option value="Português (BR)">🌐 Português (BR)</option>
              <option value="English (US)">🌐 English (US)</option>
              <option value="Español">🌐 Español</option>
            </select>

            <label>Fuso-Horário</label>
            <select
              value={config.fusoHorario}
              onChange={(e) => atualizarCampoConfig('fusoHorario', e.target.value)}
            >
              <option value="(GMT-03:00) Brasília">🕒 (GMT-03:00) Brasília</option>
              <option value="(GMT-04:00) Manaus">🕒 (GMT-04:00) Manaus</option>
              <option value="(GMT+00:00) UTC">🕒 (GMT+00:00) UTC</option>
            </select>

            <form
              onSubmit={handleAlterarSenha}
              style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #cbd5e1' }}
            >
              <label style={{ marginTop: 0 }}>Alterar senha de acesso</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha"
                />
                <button type="submit" className="btn">
                  Salvar
                </button>
              </div>
            </form>
          </div>

          <div className="card-gray">
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Ações</h3>

            <div className="action-row">
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>🗑️ Limpar Cache</strong>
                <small style={{ color: '#475569' }}>Remove arquivos temporários do sistema</small>
              </div>
              <button type="button" className="btn ghost" onClick={handleLimparCache}>
                Limpar
              </button>
            </div>

            <div className="action-row">
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>⬇️ Exportar Dados</strong>
                <small style={{ color: '#475569' }}>Baixe suas informações em JSON</small>
              </div>
              <button type="button" className="btn ghost" onClick={handleExportarDados}>
                Exportar
              </button>
            </div>

            <div className="action-row">
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>🔄 Redefinir Configurações</strong>
                <small style={{ color: '#475569' }}>Volte para as configurações padrão</small>
              </div>
              <button type="button" className="mini danger" onClick={handleRedefinir}>
                Redefinir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Configuracoes;