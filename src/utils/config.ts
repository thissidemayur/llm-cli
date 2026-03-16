export const config = {
    DMR_BASE_URL: "http://localhost:12434",
    DMR_CHATGPT_URL: "http://localhost:12434/engines/v1",

    //   default model
    DEFAULT_MODEL: "ai/llama3.2:3B-Q4_0",

    //   history file location
    HISTORY_DIR: `${process.env.HOME}/.llm/history`,

    //   Binary name
    APP_NAME: "llm",
    APP_VERSION: "1.0.0",

    // DEFAULT genereation Settings
    MAX_TOKENS: 1024,
    CONTEXT_SIZE: 8192,

    // Chat loop command
    COMMANDS: {
        EXIT: "/exit",
        CLEAR: "/cleat",
        MODELS: "/models",
        SAVE: "/save",
        HELP: "/help",
        MODE: "/mode",
    },
} as const;
