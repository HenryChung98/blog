---
title: "Git Commands Reference"
description: "Comprehensive Git command cheat sheet and workflow guide"
pubDate: "Jan 31 2026"
categories: ["Etc"]
---

#### Daily Commands

| Command                   | Description                 |
| ------------------------- | --------------------------- |
| `git status`              | Check current state         |
| `git add .`               | Stage all changes           |
| `git commit -m "message"` | Commit with message         |
| `git push`                | Push to remote              |
| `git pull`                | Fetch and merge from remote |

---

#### Branching

| Command                       | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| `git switch -c [branch]`      | Create and switch to new branch                  |
| `git switch [branch]`         | Switch to existing branch                        |
| `git merge [branch]`          | Merge branch into current                        |
| `git merge --squash [branch]` | Merge branch as a single commit                  |
| `git rebase [branch]`         | Reapply commits on top of branch, linear history |
| `git branch -d [branch]`      | Delete merged branch                             |

---

#### Fixing Mistakes

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `git restore --staged .`  | Unstage files                    |
| `git reset --soft HEAD~1` | Undo last commit (keep changes)  |
| `git commit --amend`      | Modify last commit               |
| `git stash`               | Save changes temporarily         |
| `git stash pop`           | Apply and remove stashed changes |

---

#### Configuration

```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
git config --global pull.rebase true
```

#### My Setting

```bash
git config alias.history 'log --pretty=oneline' # assign history to the command
git config pull.rebase true # use rebase method if conflict happens when pull

# deactivate pager
git config --global pager.log false
git config --global pager.diff false
git config --global pager.branch false
git config --global pager.tag false
```

---

#### ETC

1. unstage command: `git restore --staged .`

2. remove or modify commit command:
   - `git reset --soft HEAD~1` (keep stage)
   - `git reset HEAD~1` (unstage as well)
   - `git reset --hard HEAD~1` (unstage and undo all modified things)
   - `git revert [commit-id]` (cancel pushed commit, this create new commit)

3. If a conflict occurs (only main branch):
   - `git stash`
   - `git pull`
   - `git stash pop` (conflict could be happened)
   - Resolve any conflicts if they occur
   - `git add .`
   - `git commit -m "Resolve conflicts and apply stashed changes"`

4. The normal Git workflow for collaboration is as follows:
   - `git switch -c `[new-branch-name]` [commit ID (optional)]`
   - Make your changes
   - `git add . && git commit -m "Implement feature"`
   - `git switch main`
   - `git pull` (to ensure main is up-to-date)
   - `git merge [new-branch-name]` (conflict could be happened, do 3.4 - 3.6)
   - Resolve any conflicts if they occur
   - `git push`
