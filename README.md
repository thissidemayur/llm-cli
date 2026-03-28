# 🐳 LLM CLI

> A terminal AI chat app powered by Docker Model Runner.  
> No API keys. No cloud. No cost. Your data never leaves your machine.

Built by [@thissidemayur](https://github.com/thissidemayur) · [Portfolio](https://thissidemayur.me) · [Blog Series](#-blog-series)

---

## Demo

```bash
# Quick one-shot question
$ llm "what is a goroutine?"
  AI ────────────────────────────────────────
  A goroutine is a lightweight thread managed
  by the Go runtime...

# Interactive chat session
$ llm --chat

# Code mode — deterministic, precise
$ llm --mode code "write a binary search in TypeScript"

# List your local models
$ llm --models
```

---

## Features

- 🚀 **Streaming responses** — words appear live as the model generates
- 🧠 **Conversation memory** — AI remembers everything in your session
- 🎛️ **Preset modes** — chat, code, creative (different temperature per mode)
- 📦 **Auto model detection** — pulls model automatically if missing
- 💾 **History saved to disk** — every session stored at `~/.llm/history/`
- ❌ **Plain English errors** — no stack traces, ever
- 📦 **Single binary** — Linux, macOS, Windows

---

## Requirements

- [Docker](https://docs.docker.com/engine/install/) installed and running
- Docker Model Runner plugin installed

```bash
# Ubuntu / Debian
sudo apt-get install docker-model-plugin

# Fedora / RHEL
sudo dnf install docker-model-plugin

# macOS
# Enable in Docker Desktop → Settings → AI tab
```

---

## Installation

### Option 1 — One-line installer (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/thissidemayur/llm-cli/main/install.sh | bash
```

The script automatically:
- Detects your OS and architecture
- Downloads the correct binary
- Installs to `/usr/local/bin`
- Pulls the default AI model

### Option 2 — Manual binary download

```bash
# Linux (x86_64)
curl -L https://github.com/thissidemayur/llm-cli/releases/latest/download/llm-linux-amd64 -o llm
chmod +x llm
sudo mv llm /usr/local/bin/llm

# macOS (Apple Silicon)
curl -L https://github.com/thissidemayur/llm-cli/releases/latest/download/llm-mac-apple-silicon -o llm
chmod +x llm
sudo mv llm /usr/local/bin/llm
```

All available binaries on the [releases page](https://github.com/thissidemayur/llm-cli/releases/latest):

| Binary | Platform |
|---|---|
| `llm-linux-amd64` | Linux x86_64 |
| `llm-linux-arm64` | Linux ARM64 |
| `llm-mac-intel` | macOS Intel |
| `llm-mac-apple-silicon` | macOS M1/M2/M3 |
| `llm-windows.exe` | Windows x64 |

### Option 3 — Docker

```bash
# One-shot question
docker run --network host thissidemayur/llm-cli "what is docker?"

# Interactive chat
docker run -it --network host thissidemayur/llm-cli --chat
```

> `--network host` is required so the container can reach DMR at `localhost:12434`

### Option 4 — Build from source

```bash
# Requires Bun
git clone https://github.com/thissidemayur/llm-cli.git
cd llm-cli
bun install
bun build src/index.ts --compile --outfile bin/llm
sudo cp bin/llm /usr/local/bin/llm
```

---

## Usage

### One-shot mode

```bash
llm "explain async await in JavaScript"
llm --mode code "write a debounce function in TypeScript"
llm --mode creative "write a story about a Docker whale"
llm --model ai/smollm2 "hello"
```

### Interactive chat mode

```bash
llm --chat
llm --chat --mode code
llm --chat --model ai/smollm2
```

### Other flags

```bash
llm --models      # list all local models
llm --history     # view past conversations
llm --help        # show all options
llm --version     # show version
```

### Commands inside chat

| Command | Description |
|---|---|
| `/exit` or `/quit` | Quit and auto-save session |
| `/clear` | Start a fresh conversation |
| `/mode code` | Switch to code mode |
| `/mode chat` | Switch to chat mode |
| `/mode creative` | Switch to creative mode |
| `/models` | List local models |
| `/save` | Save conversation to file |
| `/history` | View past sessions |
| `/help` | Show all commands |

---

## Modes

| Mode | Temperature | Best for |
|---|---|---|
| `chat` | 0.7 | General conversation |
| `code` | 0.1 | Code generation, deterministic |
| `creative` | 1.2 | Writing, brainstorming |

---

## How It Works

```
Your terminal
     ↓
llm binary
     ↓
http://localhost:12434/engines/v1  (Docker Model Runner)
     ↓
Local AI model (llama3.2, smollm2, etc.)
```

DMR exposes an OpenAI-compatible REST API at `localhost:12434`.
LLM CLI points the OpenAI SDK at this address instead of `api.openai.com`.
No internet required after the initial model download.

---

## Architecture

```
llm-cli/
├── src/
│   ├── index.ts          ← entry point
│   ├── cli/
│   │   └── args.ts       ← CLI argument parsing
│   ├── ui/
│   │   ├── tui.ts        ← all visual output
│   │   ├── spinner.ts    ← thinking animation
│   │   └── colors.ts     ← color constants
│   ├── core/
│   │   ├── chat.ts       ← main chat loop
│   │   ├── memory.ts     ← conversation history in RAM
│   │   ├── presets.ts    ← mode configurations
│   │   └── history.ts    ← save/load to disk
│   ├── dmr/
│   │   ├── client.ts     ← OpenAI SDK → localhost
│   │   ├── models.ts     ← list, check, pull models
│   │   └── stream.ts     ← streaming response handler
│   └── utils/
│       ├── config.ts     ← all defaults in one place
│       └── errors.ts     ← plain English error messages
```

---

## 📖 Blog Series

This project was built and documented as a 3-part series:

| Part | Title |
|---|---|
| [Part 1](https://thissidemayur.me/blogs/run-ai-locally-free-docker-model-runner-setup) | Run AI Locally for Free — Setup & Core Concepts |
| [Part 2](https://thissidemayur.me/blogs/local-ai-dmr-rest-api-typescript) | Talking to Your Local AI Through Code — REST API + TypeScript |
| [Part 3](https://thissidemayur.me/blogs/build-terminal-ai-chat-cli-docker-model-runner-typescript) | I Built a Terminal AI Chat App Using Docker |

---

## Roadmap

- [x] TypeScript CLI with streaming
- [x] Conversation memory
- [x] Preset modes (chat, code, creative)
- [x] History saved to disk
- [x] Single binary — Linux, macOS, Windows
- [x] Docker image on Docker Hub
- [x] One-line installer script
- [ ] Go migration — smaller binary, zero runtime
- [ ] Config file support (`~/.llm/config.json`)
- [ ] Multiple model support in one session

---

## Contributing

Issues and pull requests are welcome.  
If you find a bug or want a feature → [open an issue](https://github.com/thissidemayur/llm-cli/issues).

---

## License

MIT © [Mayur](https://thissidemayur.me)
