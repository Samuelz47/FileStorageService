# 📁 File Storage Service

Sistema fullstack para upload, armazenamento e visualização de arquivos na nuvem, com backend em **.NET 10** e frontend em **React + TypeScript**.

Os arquivos são enviados para o **Cloudinary** e os metadados (nome, URL, tipo, tamanho) são persistidos no **PostgreSQL**. Toda a infraestrutura roda via **Docker Compose** com um único comando.

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| .NET | 10.0 | Runtime e SDK |
| ASP.NET Core Web API | 10.0 | REST API |
| Entity Framework Core | 10.0.5 | ORM + Migrations |
| Npgsql | 10.0.1 | Provider PostgreSQL |
| CloudinaryDotNet | 1.28.0 | Upload de arquivos para a nuvem |
| Swagger / OpenAPI | 10.1.7 | Documentação interativa da API |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.3 | Biblioteca de UI |
| TypeScript | 5.2 | Tipagem estática |
| Vite | 5.3 | Build tool e dev server |
| Tailwind CSS | 3.4 | Estilização utilitária |

### Infraestrutura
| Tecnologia | Função |
|---|---|
| Docker & Docker Compose | Containerização e orquestração |
| Nginx | Servidor web + reverse proxy |
| PostgreSQL 15 (Alpine) | Banco de dados relacional |
| Cloudinary | CDN e armazenamento de arquivos na nuvem |

---

## 📐 Arquitetura

```
FileStorageService/
├── FileStorageService.API/       # Backend .NET
│   ├── Controllers/              # Endpoints REST
│   ├── Data/                     # DbContext (EF Core)
│   ├── Migrations/               # Migrations do banco
│   ├── Models/                   # Entidades
│   ├── Services/                 # Camada de serviço (Cloudinary)
│   ├── Program.cs                # Configuração da aplicação
│   └── Dockerfile                # Container da API
├── web/                          # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── Upload/           # FileUpload (drag & drop)
│   │   │   ├── FileList/         # FileTable (listagem + download)
│   │   │   └── Preview/          # FilePreview (modal)
│   │   ├── services/             # Camada de API (fetch)
│   │   ├── types/                # Interfaces TypeScript
│   │   ├── utils/                # Funções auxiliares
│   │   ├── App.tsx               # Dashboard principal
│   │   └── main.tsx              # Entry point
│   ├── nginx.conf                # Configuração do Nginx
│   └── Dockerfile                # Container do frontend
├── compose.yaml                  # Docker Compose (API + Web + DB)
├── .env.example                  # Template de variáveis de ambiente
└── README.md
```

### Fluxo de comunicação no Docker

```
Browser (:3000) → Nginx → /api/* → API .NET (:8080) → Cloudinary + PostgreSQL
                        → /*     → React SPA (arquivos estáticos)
```

O **Nginx** atua como reverse proxy: serve os arquivos estáticos do React e redireciona chamadas `/api/*` para o container da API. Isso elimina problemas de CORS.

---

## ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- Uma conta no [Cloudinary](https://cloudinary.com/) (plano gratuito é suficiente)

> **Nota:** Não é necessário ter .NET SDK ou Node.js instalados. Tudo roda dentro dos containers.

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
gh repo clone Samuelz47/FileStorageService
cd FileStorageService
```

### 2. Configure as credenciais do Cloudinary

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` com seus dados do Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=sua_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### 3. Suba todos os serviços

```bash
docker compose up --build
```

Isso irá iniciar automaticamente:
- **PostgreSQL** na porta `5432`
- **API .NET** na porta `8080`
- **Frontend React** (via Nginx) na porta `3000`

### 4. Acesse a aplicação

| Serviço | URL |
|---|---|
| **Aplicação completa** | http://localhost:3000 |
| API direta | http://localhost:8080/Files |
| Swagger (via API direta) | http://localhost:8080/swagger |

---

## 💻 Desenvolvimento Local (sem Docker)

Se preferir rodar fora do Docker para desenvolvimento:

```bash
# Terminal 1 — Banco (precisa do Docker para isso)
docker compose up db

# Terminal 2 — API
cd FileStorageService.API
dotnet ef database update
dotnet run                       # → http://localhost:5160

# Terminal 3 — Frontend
cd web
npm install
npm run dev                      # → http://localhost:5173
```

> O frontend usa variáveis de ambiente do Vite. O arquivo `web/.env` já aponta para `http://localhost:5160/Files` para desenvolvimento local.

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/Files/upload` | Upload de arquivo (multipart/form-data) |
| `GET` | `/Files` | Lista todos os arquivos |
| `GET` | `/Files/{id}` | Busca arquivo por ID |

**Extensões aceitas:** `.jpg`, `.png`, `.pdf`

---

## ✨ Funcionalidades

- **Upload Drag & Drop** — Área visual para arrastar e soltar ou selecionar arquivos via clique
- **Validação de tipo** — Rejeita arquivos não suportados com mensagem clara no frontend e backend
- **Listagem em tabela** — Nome, tipo (badge colorido), tamanho formatado e data
- **Visualização inline** — Modal com preview de imagens (`<img>`) e PDFs (`<iframe>`)
- **Download direto** — Download via Blob fetch (contorna limitações de CORS do Cloudinary)
- **Estado vazio** — Mensagem amigável quando não há arquivos
- **Loading states** — Spinners durante carregamento e upload
- **Tratamento de erros** — Mensagens com detalhes do erro vindos do backend

---

## 🐳 Docker Compose — Serviços

| Serviço | Imagem | Porta | Descrição |
|---|---|---|---|
| `filestorageservice.api` | Build .NET 10 | 8080 | API REST |
| `web` | Build Node → Nginx | 3000 | Frontend + Reverse Proxy |
| `db` | postgres:15-alpine | 5432 | Banco de dados |

```bash
docker compose up --build        # Sobe + rebuild
docker compose up -d             # Sobe em background
docker compose down              # Para tudo
docker compose logs -f           # Acompanha logs
```

---

## 📝 Observações Técnicas

- O **Cloudinary** é utilizado como CDN. Os arquivos **não** são salvos localmente — apenas a URL pública é persistida no PostgreSQL.
- O **Nginx** no container web atua como reverse proxy, eliminando problemas de CORS entre frontend e backend.
- As credenciais do Cloudinary são injetadas via variáveis de ambiente no Docker Compose (arquivo `.env`), nunca hardcoded.
- A política de CORS no backend está como `AllowAll` para compatibilidade. Em produção, restrinja as origens.
