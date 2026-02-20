---
title: "Unix/Linux Commands Reference"
description: "Essential Unix/Linux commands for daily terminal work"
pubDate: "Jan 31 2026"
categories: ["Etc"]
---

#### Terminal Shortcuts

| Command    | Description                 |
| ---------- | --------------------------- |
| `ctrl + A` | Move to beginning of line   |
| `ctrl + E` | Move to end of line         |
| `ctrl + U` | Delete to beginning of line |
| `ctrl + K` | Delete to end of line       |
| `ctrl + L` | Clear screen                |
| `ctrl + R` | Search command history      |
| `ctrl + C` | Kill current process        |
| `ctrl + Z` | Suspend current process     |

---

#### Navigation

| Command          | Description                 |
| ---------------- | --------------------------- |
| `pwd`            | Print current directory     |
| `ls -lah`        | List all files with details |
| `cd [directory]` | Change directory            |
| `cd ..`          | Move to parent directory    |
| `cd ~`           | Move to home directory      |

---

#### File Operations

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `cp [source] [dest]` | Copy file/directory          |
| `mv [source] [dest]` | Move/rename file             |
| `rm [file]`          | Remove file                  |
| `rm -rf [dir]`       | Remove directory recursively |
| `mkdir [dir]`        | Create directory             |
| `touch [file]`       | Create empty file            |
| `cat [file]`         | Display file content         |
| `less [file]`        | View file with pagination    |
| `head -n 10 [file]`  | Show first 10 lines          |
| `tail -n 10 [file]`  | Show last 10 lines           |

---

#### Search & Filter

| Command                   | Description            |
| ------------------------- | ---------------------- |
| `grep [pattern] [file]`   | Search pattern in file |
| `grep -r [pattern] [dir]` | Search recursively     |
| `find [dir] -name [name]` | Find files by name     |
| `which [command]`         | Show command path      |

---

#### Process Management

| Command          | Description               |
| ---------------- | ------------------------- |
| `ps aux`         | List all processes        |
| `top`            | Real-time process monitor |
| `kill [PID]`     | Kill process by ID        |
| `killall [name]` | Kill process by name      |
| `jobs`           | List background jobs      |
| `bg`             | Resume job in background  |
| `fg`             | Bring job to foreground   |

---

#### System Info

| Command    | Description        |
| ---------- | ------------------ |
| `df -h`    | Disk usage         |
| `free -h`  | Memory usage       |
| `uname -a` | System information |
| `whoami`   | Current user       |
| `uptime`   | System uptime      |

---

#### Networking

| Command                       | Description              |
| ----------------------------- | ------------------------ |
| `ping [host]`                 | Test connectivity        |
| `curl [url]`                  | Make HTTP request        |
| `wget [url]`                  | Download file            |
| `ssh [user@host]`             | Connect to remote server |
| `scp [file] [user@host:path]` | Copy file to remote      |

---

#### Compression

| Command                           | Description               |
| --------------------------------- | ------------------------- |
| `tar -czf archive.tar.gz [files]` | Create compressed archive |
| `tar -xzf archive.tar.gz`         | Extract archive           |
| `zip [archive.zip] [files]`       | Create zip                |
| `unzip [archive.zip]`             | Extract zip               |
