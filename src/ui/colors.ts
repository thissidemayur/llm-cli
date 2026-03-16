import chalk from "chalk";
export const colors = {
  // msg
  user: chalk.hex("#3B82F6"),
  ai: chalk.hex("#14B8A6"),
  system: chalk.hex("#94A3B8"),
  error: chalk.hex("#EF4444"),
  warning: chalk.hex("#F59E0B"),
  success: chalk.hex("#22C55E"),

  // UI chrome
  border: chalk.hex("#1E293B"),
  label: chalk.hex("#64748B"),
  accent: chalk.hex("#8B5CF6"),
  dim: chalk.hex("#475569"),

  bold: chalk.bold,
  muted: chalk.hex("#64748B"),

  userLabel: chalk.hex("#3B82F6").bold("  You: "),
  aiLabel: chalk.hex("#14B8A6").bold("  AI: "),
};