# Windows 10 PHP Lab Program Viewer

An interactive, premium-designed Single Page Application (SPA) styled as a fully interactive Windows 10 Desktop Environment and Windows Terminal (running PowerShell). This app showcases a collection of PHP script templates for file handling, session handling, string manipulation, and database integrations.

## 🖥️ Live Dashboard Preview & Features

- **Windows 10 Taskbar**: Located at the bottom of the screen, featuring:
  - Start Menu button (resets active file to welcome screen).
  - Cortana Search bar.
  - Task View button.
  - Pinned taskbar shortcuts for the 6 different PHP programs (active states have a bottom accent indicator).
  - System Tray containing volume, Wi-Fi, battery status, and notifications.
  - Windows Stacked Clock (multiline Time & Date).
  - Show Desktop strip (collapses terminal window).
- **PowerShell CLI Simulator**: Try typing standard Windows commands in the prompt:
  - `dir` — List all PHP files in PowerShell table format (alias: `ls`).
  - `type <filename>` — Display and highlight file contents inside the console (alias: `cat`).
  - `cls` — Clear the console log output (alias: `clear`).
  - `systeminfo` — Display Windows OS configuration and specifications.
  - `reset` — Reset open tabs.
  - `fullscreen` — Maximize the window (alias: `maximize`).
  - `help` — Show instructions guide.
- **Window Minimization**: Clicking the taskbar terminal icon or minimize window button (`-`) collapses the window. Clicking again restores it.
- **Header Actions**: Copy file, Download file, Reset session, and Maximize window states.
- **Double-Click Titlebar Toggles**: Double-clicking the titlebar maximize/restores the window sizing.
- **VS Code Syntax Theme**: Syntax highlighting matching dark theme Visual Studio Code colors.

## 📂 Project Structure

```
e:/kunjan kunnan/
├── index.html            # Windows 10 SPA dashboard UI
├── styles.css            # Custom CSS styling (Windows 10 Hero theme & VS Code syntax)
├── script.js             # PowerShell console simulator & tray clock handlers
├── upload.php            # File Upload PHP script
├── page1.php             # Session Page 1
├── page2.php             # Session Page 2
├── search_student.php    # Student details search script
├── string_ops.php        # String operations script
└── insert_student.php    # Student details insert script
```

## 🚀 How to Run Locally

You can open the dashboard in any modern web browser:
1. Double-click the [index.html](file:///e:/kunjan%20kunnan/index.html) file to open it directly.
2. Alternatively, serve the folder using any local development server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.
