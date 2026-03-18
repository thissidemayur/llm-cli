


set -e 
# COlors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color — resets back to normal

# config
REPO="thissidemayur/llm-cli"
INSTALL_DIR="/usr/local/bin"
INSTALL_NAME="llm"
DEFAULT_MODEL="ai/llama3.2:3B-Q4_0"
TMP_FILE="/tmp/llm-installer-download"

## helper function
print_banner(){
    echo ""
	echo -e "${BLUE}${BOLD}__________________________________________________________________${NC}"
    echo ""
	echo -e "${BLUE}${BOLD}  🐳 LLM CLI — Installer                                             ${NC}"
    echo -e "${BLUE}${BOLD}     Powered By Docker Model Runner                                   ${NC}"
	echo -e "${BLUE}${BOLD}  No API keys. No cloud. No cost.                                 ${NC}"
	echo -e "${BLUE}${BOLD}__________________________________________________________________${NC}"
    echo ""
}

print_step(){
    echo -e "${CYAN}${BOLD}==>  ${NC}${BOLD}$1${NC}"
}

print_ok(){
    echo -e "${GREEN}✅  $1${NC}"
}

print_warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error(){
  echo -e "         ${RED}❌ $1${NC}"
  echo ""
  echo -e "        ${RED}Aborting installation.${NC}!!\n"
  exit 1
}

print_info(){
  echo -e "         ${CYAN}ℹ️             $1${NC}"

}





print_banner

# step 1:detecting the OS:
print_step "Detecting the system... "
OS=$(uname -s)
ARCH=$(uname -m)

# map os + correct Arch to correct binary name
if [ "$OS" = "Linux" ] && [ "$ARCH" = "x86_64" ]; then
    BINARY_NAME="llm-linux-amd64"
elif [ "$OS" = "Linux" ] && [ "$ARCH" = "aarch64" ]; then
    BINARY_NAME="llm-linux-arm64"
elif [ "$OS" = "Darwin" ] && [ "$ARCH" = "x86_64" ]; then
    BINARY_NAME="llm-mac-intel"
elif [ "$OS" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then
    BINARY_NAME="llm-mac-apple-silicon"

else
    print_error "Unsupported platform: $OS $ARCH
        Supported: Linux x86_64, Linux ARM64, macOS Intel, macOS Apple Silicon    
        FOr Windows, donwload manually from:
        github.com/$REPO/releases/latest"
fi


print_ok "Detechted: $OS $ARCH"
print_ok "Binary: $BINARY_NAME"


#STEP2:  Check curl is avliable
print_step "Checking required tools..."

if  ! command -v curl &> /dev/null; then 
    print_error "curl is not installed.
        Install it first:
        Linux:  sudo apt-get install curl  OR  sudo dnf install curl
        macOS:  brew install curl"

fi

print_ok "curl found"

# STEP3: check docker is installed or not
print_step "Checking Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed.
            Install Docker Engine first:
            Ubuntu/Debian: https://docs.docker.com/engine/install/ubuntu/
            Fedora/RHEL:   https://docs.docker.com/engine/install/fedora/
            macOS:         https://docs.docker.com/desktop/install/mac-install/"
fi

if ! docker info &> /dev/null; then
    print_error "Docker is installed but not running.
         Start it with:
         Linux:  sudo systemctl start docker
         macOS:  open Docker Desktop"
fi

DOCKER_VERSION=$(docker --version | awk  '{print $3}' | tr -d ',')
print_ok "Docker found: v$DOCKER_VERSION"


# step 4: check DMR 
print_step "Checking Docker Model Runner..."

if ! docker model version &> /dev/null; then
  echo ""
  print_warn "Docker Model Runner is not installed."
  print_info "LLM CLI requires Docker Model Runner to work."
  echo ""
   echo -e "    ${BOLD}Install it with:${NC}"
  echo -e "    ${CYAN}  Ubuntu/Debian:${NC}  sudo apt-get install docker-model-plugin"
  echo -e "    ${CYAN}  Fedora/RHEL:  ${NC}  sudo dnf install docker-model-plugin"
  echo -e "    ${CYAN}  macOS:        ${NC}  Enable in Docker Desktop → Settings → AI"
  echo ""

#   read -r -p "
  read -r -p "    Continue installation anyway? (y/N): " CONTINUE
   echo ""
 
 if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo -e "    ${YELLOW}Installation cancelled.${NC}"
    echo -e "    ${YELLOW}Install Docker Model Runner first then re-run this script.${NC}\n"
    exit 0
  fi

    print_warn "Continuing without Docker Model Runner..."
    DMR_INSTALLED=false

else 
 DMR_VERSION=$(docker model version 2>/dev/null | head -2 || echo "unknown")
  print_ok "Docker Model Runner found: $DMR_VERSION"
  DMR_INSTALLED=true
fi


# Step 5: get latest version

print_step "Fetching latest version..."

LATEST=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
| grep '"tag_name"' \
| sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST" ]; then
    print_error "Could not fetch latest version from GitHub.
         Check your internet connection and try again."
fi

print_ok "Latest version: ${LATEST}"

# Download binary:
print_step "Downloading LLM CLI $LATEST..."

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST}/${BINARY_NAME}"

echo -e "${CYAN}From: $DOWNLOAD_URL${NC}"
echo ""

# download with progress bar
curl -fsSL \
    --progress-bar \
    "$DOWNLOAD_URL" \
    -o "$TMP_FILE"

# verify dowbload 
if [ ! -f "$TMP_FILE" ] || [ ! -s "$TMP_FILE" ]; then
      print_error "Download failed or file is empty.
         Try downloading manually from:
         github.com/$REPO/releases/latest"
fi

print_ok "Downloaded successfully"


# Step7: install binary
print_step "Installing to $INSTALL_DIR/$INSTALL_NAME..."

chmod +x "$TMP_FILE"

if [ -w "$INSTALL_DIR" ]; then 
    mv "$TMP_FILE" "$INSTALL_DIR/$INSTALL_NAME"
else
      print_info "Need sudo permission to install to $INSTALL_DIR"
      sudo mv "$TMP_FILE" "$INSTALL_DIR/$INSTALL_NAME"
fi
print_ok "Installed to $INSTALL_DIR/$INSTALL_NAME"


## verify install
print_step "Verifying installation..."

# check bninary is in path
if ! command -v "$INSTALL_NAME" &> /dev/null; then
     print_error "'$INSTALL_NAME' not found in PATH after installation.
         Try adding $INSTALL_DIR to your PATH:
         echo 'export PATH=\"\$PATH:$INSTALL_DIR\"' >> ~/.bashrc
         source ~/.bashrc"

fi

INSTALLED_VERSION=$("$INSTALL_NAME" --version 2>/dev/null || echo "unknown")
print_ok "Verified: llm is available in PATH"

## step 9: pull default AI model
if [ "$DMR_INSTALLED" = true ]; then
    echo ""
    print_step "Pulling default AI model ($DEFAULT_MODEL)..."
    print_info "This is a one-time download (~1.8 GB). Please wait..."
    echo ""   

    if docker model pull "$DEFAULT_MODEL"; then
       print_ok "Model ready: $DEFAULT_MODEL"
    else
      print_warn "Model pull failed. Pull it manually later:"
      print_info "docker model pull $DEFAULT_MODEL"
    fi
fi

# STEP 10: Successfull
echo ""
echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}${BOLD}  🎉 Installation complete!${NC}"
echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Try it now:${NC}"
echo ""
echo -e "  ${CYAN}llm \"what is docker?\"${NC}              quick answer"
echo -e "  ${CYAN}llm --chat${NC}                         interactive session"
echo -e "  ${CYAN}llm --mode code \"write a sort\"${NC}     code mode"
echo -e "  ${CYAN}llm --models${NC}                       list local models"
echo -e "  ${CYAN}llm --help${NC}                         all options"
echo ""
echo -e "  ${BOLD}More info:${NC}"
echo -e "  ${CYAN}github.com/$REPO${NC}"
echo ""