## 🐳 LLM CLI $VERSION

A terminal AI chat app powered by Docker Model Runner.  
No API keys. No cloud. No cost. Your data never leaves your machine.

---


### ⚡ Quick Install

**1. One-line installer:**

```bash
curl -fsSL  https://raw.githubusercontent.com/thissidemayur/llm-cli/main/install.sh | bash
```

**2. Manual install:**

```bash
curl -L https://github.com/thissidemayur/llm-cli/releases/download/$VERSION/llm-linux-amd64 -o llm
chmod +x llm
sudo mv llm /usr/local/bin/llm
```

**3. Docker:**

```bash
docker run --network host thissidemayur/llm-cli "what is docker"
```

---

### 📋 Requirements

- Docker installed and running
- Docker Model Runner enabled

```bash
# Install DMR plugin
sudo apt-get install docker-model-plugin  # ubuntut/debian
sudo dnf install docker-model-plugin      # fedora/RHEL

# pull a model
docker model pull ai/llama3.2:3B-Q4_0
```

---

### 💬 Usage

```bash
llm "what is recursion?"          # quick answer
llm --chat                        # interactive session
llm --mode code "write a sort"    # code mode
llm --models                      # list local models
llm --history                     # past conversations
```

---

### Commands inside chat

| Command | Description |
|---|---|
| `/exit` | Quit |
| `/clear` | Fresh conversation |
| `/mode code` | Switch to code mode |
| `/mode chat` | Switch to chat mode |
| `/save` | Save conversation |
| `/history` | View past sessions |
| `/help` | Show all commands |

---

### 📖 Blog Series — Local AI with Docker Model Runner

This project was built and documented as a 3-part blog series:

| Part | Title | Link |
|------|-------|------|
| Part 1 | Run AI Locally for Free — Setup & Core Concepts | [Read →](https://thissidemayur.me/blogs/run-ai-locally-free-docker-model-runner-setup) |
| Part 2 | Talking to Your Local AI Through Code — REST API + TypeScript | [Read →](https://thissidemayur.me/blogs/local-ai-dmr-rest-api-typescript) |
| Part 3 | I Built a Terminal AI Chat App Using Docker | [Read →](https://thissidemayur.me/blogs/build-terminal-ai-chat-cli-docker-model-runner-typescript) |

---


### 🔗 Links

- [Source Code](https://github.com/thissidemayur/llm-cli)
- [Docker Hub](https://hub.docker.com/r/thissidemayur/llm-cli)
- [Report a Bug](https://github.com/thissidemayur/llm-cli/issues)
- [Portfolio](https://thissidemayur.me)
