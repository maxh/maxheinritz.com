---
title: .zshrc ideas
layout: note
---

Some useful ideas for `.zshrc`:

```zsh
# Run `kill_port 1234` to quickly kill whatever process is using it.
kill_port() {
  lsof -ti:$1 | xargs kill -9
}

# Show the current branch name in your terminal prompt, for example:
# ~/loop/backend (main)
#
# It also shows an asterisk when an existing file has been changed:
# ~/loop/backend (main*)
#
# The asterisk does not show when new files have been created but
# not added to git (that takes too long to execute for this use
# case).
parse_git_branch() {
    git_status="$(git status -uno 2> /dev/null)"
    pattern="On branch ([^[:space:]]*)"
    if [[ ! ${git_status} =~ "(nothing to commit)" ]]; then
        state="*"
    fi
    if [[ ${git_status} =~ ${pattern} ]]; then
      branch=${match[1]}
      branch_cut=${branch:0:35}
      if (( ${#branch} > ${#branch_cut} )); then
          echo "(${branch_cut}…${state})"
      else
          echo "(${branch}${state})"
      fi
    fi
}
setopt PROMPT_SUBST
NEWLINE=$'\n'
export PROMPT='${NEWLINE}%B%F{245}%~ $(parse_git_branch)%f%b${NEWLINE}%# '

# Run 's add new feature' to make a new commit.
s() {
    git add .
    git commit -am "$*"
}

# Run 'p' to push commits.
alias p="git push"

# Run 'm' to checkout the main branch.
alias m="git checkout main"

# Run 'mpr' to create a new pull request (requires gh cmd line util).
alias mpr="git push -u origin HEAD && gh pr create -w"

# Show the 8 most recently committed-to Git branches.
alias gitrec="git branch --sort=-committerdate | head -n 8"

# Prune local tracking branches that do not exist on remote anymore.
# https://stackoverflow.com/a/17029936
alias gitprune="git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -v\
v | grep origin) | awk '{print $1}' | xargs git branch -D"

# Treat text after "#" as a comment in command line input.
# This is helpful for saving a typed-out command you're not ready to run yet.
# https://unix.stackexchange.com/a/33995
set -k
```
