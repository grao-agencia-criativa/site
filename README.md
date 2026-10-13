# Site institucional — Grão | Agência Criativa

Site estático (HTML/CSS/JS puro, sem build step) pronto para publicar no **GitHub Pages**.

## Estrutura de pastas

```
grao-site/
├── index.html          → Home
├── quem-somos.html      → Quem Somos (manifesto, missão/visão/valores, time)
├── portfolio.html        → Portfólio (com filtro por tipo de serviço)
├── blog.html             → Blog (pilares de conteúdo + ideias de posts)
├── contato.html          → Contato (formulário → WhatsApp)
├── css/
│   └── style.css         → todo o estilo do site (cores, tipografia, componentes)
├── js/
│   └── main.js           → menu mobile, filtro do portfólio, formulário de contato
└── assets/
    ├── fonts/            → Chelsea Market (títulos) e Karla (texto)
    └── img/               → logo e ícone, em variações de cor:
        ├── logo-white.svg / icon-white.svg   → originais (fundo escuro)
        ├── logo-green.svg / icon-green.svg   → para fundo creme (uso principal)
        ├── logo-dark.svg                     → variação em texto escuro
        ├── logo-cream.svg / icon-cream.svg   → para fundo verde escuro (rodapé, CTA final)
        └── icon-cream-subtle.svg             → versão sutil (marca d'água)
```

## Como publicar no GitHub Pages

### 1. Criar o repositório
1. Crie um repositório novo no GitHub — pode se chamar, por exemplo, `grao-site` (ou `seuusuario.github.io` se quiser que seja o domínio raiz da sua conta).
2. Não inicialize com README (você já tem os arquivos prontos aqui).

### 2. Subir os arquivos
No terminal, dentro da pasta `grao-site`:

```bash
git init
git add .
git commit -m "Primeira versão do site institucional da Grão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

*(Substitua `SEU-USUARIO` e `NOME-DO-REPOSITORIO` pelos seus dados.)*

Se preferir sem linha de comando: no GitHub, clique em **"Add file" → "Upload files"** e arraste toda a pasta `grao-site` (o conteúdo, não a pasta em si).

### 3. Ativar o GitHub Pages
1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
3. Clique em **Save**.
4. Em alguns minutos, o site estará no ar em:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

### 4. Domínio próprio (opcional)
Se vocês tiverem um domínio (ex: `grao.com.br`):
1. Em **Settings → Pages → Custom domain**, digite o domínio.
2. No provedor de DNS do domínio, crie um registro `CNAME` apontando para `SEU-USUARIO.github.io`.
3. Aguarde a propagação (pode levar algumas horas).

## O que ajustar antes de publicar

- **Número de WhatsApp:** troque `5500000000000` em `js/main.js` (linha do `numeroWhatsapp`) e em `contato.html` (link "Abrir WhatsApp") pelo número real, no formato `55DDDNUMERO` (ex: `5591912345678`).
- **Instagram e redes sociais:** atualize o link em `contato.html` (seção "Redes sociais") e adicione outras redes se tiver.
- **Cases do portfólio:** os 4 cards em `portfolio.html` são placeholders — substitua nome do cliente, descrição e, se quiser, adicione fotos reais no lugar do ícone da semente.
- **Depoimentos:** a seção "Marcas que já plantaram com a gente" na Home está com um aviso reservado — assim que tiverem depoimentos, é só substituir o `placeholder-box` por cards de depoimento.
- **Bios de Paulo e Sinara:** em `quem-somos.html`, as bios estão com um texto inicial — ajuste com mais detalhes se quiser.
- **Fotos:** hoje o site usa só o ícone/logo como elemento visual (fiel à identidade visual enviada). Se quiserem adicionar fotos da equipe, dos bastidores ou dos projetos, é só incluir os arquivos em `assets/img/` e referenciar nas páginas.

## Testar localmente antes de publicar

Com Python instalado, dentro da pasta `grao-site`:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

---

Qualquer ajuste de texto, cor ou estrutura, é só falar com o Claude que ele edita os arquivos diretamente.
