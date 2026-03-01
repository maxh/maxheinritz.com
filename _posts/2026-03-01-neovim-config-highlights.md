---
title: Neovim config highlights
layout: post
tags: ["tools"]
---

The creator of Claude Code recently [compared AI coding tools to the printing press](https://fortune.com/2026/02/24/will-claude-destroy-software-engineer-coding-jobs-creator-says-printing-press/) and predicted the job title "software engineer" will give way to "builder." Certainly that reflects my own experience over the last few months. The times they are a-changin'.

So writing about my Neovim config feels a bit like a blacksmith lovingly cataloging his tongs and anvils as the first factories open down the road. But people still attend renaissance fairs... and I suspect digital craftsmanship will hold at least some of its appeal even as its economic necessity fades.

## Readline in command mode

Vim's command line (`:`) doesn't support the readline shortcuts that work everywhere else -- Ctrl+A to jump to the start of the line, Ctrl+B to move back a character, Ctrl+F to move forward. This is disorienting if you've internalized these from the terminal, Bash, or any macOS text field.

The fix is seven lines:

```lua
vim.keymap.set("c", "<C-a>", "<Home>")
vim.keymap.set("c", "<C-b>", "<Left>")
vim.keymap.set("c", "<C-f>", "<Right>")
vim.keymap.set("c", "<C-d>", "<Delete>")
vim.keymap.set("c", "<Esc>b", "<S-Left>")
vim.keymap.set("c", "<Esc>f", "<S-Right>")
vim.keymap.set("c", "<Esc>d", "<S-right><Delete>")
```

Small, but it eliminates a constant low-grade friction.

## Isolated project history

By default, Neovim stores undo history, swap files, and backups in shared global directories. This means state from one project can leak into another -- stale swap file warnings, undo trees from a different codebase, etc.

This module partitions all of that by project:

```lua
local function get_dir_name()
  local cwd = vim.fn.getcwd()
  if cwd == "" then
    return ".vim-state/global"
  else
    return vim.fn.fnamemodify(cwd, ":t") .. "/.vim-state"
  end
end

local function get_file_path(file_name)
  local dir_name = get_dir_name()
  return vim.fn.stdpath("data") .. "/" .. dir_name .. "/" .. file_name
end

vim.o.undodir = get_file_path("undo")
vim.o.backupdir = get_file_path("backup")
vim.o.directory = get_file_path("swap")
vim.cmd("set viminfo+=n" .. get_file_path("viminfo"))
vim.fn.mkdir(vim.fn.stdpath("data") .. "/" .. get_dir_name(), "p")
```

Everything ends up under `~/.local/share/nvim/<project-name>/.vim-state/`. Each project gets its own undo tree, its own swap files, its own viminfo. Clean separation.

## GitHub links

During code review, I frequently need to share a link to a specific file or line on GitHub. These utilities build the URL from the current buffer's git remote and relative path:

```lua
function M.get_github_url()
  local remote_url = vim.fn.system(
    "git remote -v | grep origin | head -1 | awk '{print $2}'"
  )
  remote_url = string.gsub(remote_url, "^git@github.com:", "https://github.com/")
  remote_url = string.gsub(remote_url, "\n", "")
  remote_url = string.gsub(remote_url, ".git$", "")

  local main_branch = "main"
  local current_file = get_relative_path_to_git_root()
  return remote_url .. "/blob/" .. main_branch .. "/" .. current_file
end

function M.get_github_url_line()
  local github_url = M.get_github_url()
  local line_number = vim.fn.line(".")
  return github_url .. "#L" .. line_number
end
```

The keybindings follow a pattern: `go` and `gl` open the URL in the browser (whole file and line-specific), while `mo` and `ml` copy the URL to the clipboard.

```lua
-- Open wh[o]le-file URL.
vim.keymap.set("n", "go", require("maxh.utils.github_link").open_github_url, opts)
-- Open [l]ine-specific URL.
vim.keymap.set("n", "gl", require("maxh.utils.github_link").open_github_url_line, opts)
-- Copy wh[o]le-file URL.
vim.keymap.set("n", "<leader>mo", ... )
-- Copy [l]ine-specific URL.
vim.keymap.set("n", "<leader>ml", ... )
```

## SQLite-backed Telescope history

Telescope's default search history is lost when Neovim closes. The [telescope-smart-history](https://github.com/nvim-telescope/telescope-smart-history.nvim) extension persists it to a SQLite database, so previous searches survive across sessions:

```lua
telescope.setup({
  defaults = {
    history = {
      path = "~/.local/share/nvim/databases/telescope_history.sqlite3",
      limit = 100,
    },
    mappings = {
      i = {
        ["<C-j>"] = actions.cycle_history_next,
        ["<C-k>"] = actions.cycle_history_prev,
      },
    },
  },
})
```

Ctrl+J and Ctrl+K cycle through past searches in the Telescope prompt. It's a small thing, but it means frequently-used search patterns are always a few keystrokes away rather than retyped from scratch.

## Craftsmanship

These days I think often of my favorite fable from _The Codeless Code_, #122 "Craftsmanship":

<https://thecodelesscode.com/case/122>

"True, the value lies not in carven oak, but neither does it lie in the shape of the carving; for both the real pillar and the virtual one may be lost, and the temple will be no poorer. But when wood first yields to metal, one more thing is made: and that is the sculptor."

What happens when there is nothing left to make?
