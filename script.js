// Database of PHP lab programs and files
const filesDb = {
    "console.cmd": {
        name: "console.cmd",
        size: "Virtual Command Prompt",
        code: "" // Handled dynamically
    },
    "upload.php": {
        name: "upload.php",
        size: "468 bytes",
        code: `<html>
<head>
    <title>File Upload</title>
</head>
<body>

<form action="" method="post" enctype="multipart/form-data">
    Select File:
    <input type="file" name="myfile" required>

    <input type="submit" name="submit" value="Upload">
</form>

<?php

if (isset($_POST['submit'])) {

    $file = $_FILES['myfile']['name'];
    $temp = $_FILES['myfile']['tmp_name'];

    move_uploaded_file($temp, "uploaded/" . $file);

    echo "File uploaded successfully!";
}

?>

</body>
</html>`
    },
    "page1.php": {
        name: "page1.php",
        size: "394 bytes",
        code: `<html>
<head>
    <title>Session Example - Page 1</title>
</head>
<body>

<form method="post" action="">
    Enter your name:
    <input type="text" name="username" required>
    <input type="submit" name="submit" value="Submit">
</form>

</body>
</html>

<?php
session_start();

if (isset($_POST['submit'])) {

    $_SESSION['name'] = $_POST['username'];

    header("Location: page2.php");
}
?>`
    },
    "page2.php": {
        name: "page2.php",
        size: "155 bytes",
        code: `<?php
session_start();

if (isset($_SESSION['name'])) {

    echo "Your name is: " . $_SESSION['name'];

} else {

    echo "Name not found";
}
?>`
    },
    "search_student.php": {
        name: "search_student.php",
        size: "956 bytes",
        code: `<html>
<head>
    <title>Search Student</title>
</head>

<body>

<form method="post" action="">
    Enter Student ID:
    <input type="number" name="sid" required><br><br>

    <input type="submit" name="submit" value="Search">
</form>

<?php

if (isset($_POST['submit']))
{
    $id = $_POST['sid'];

    $conn = mysqli_connect("localhost", "root", "", "college");

    $sql = "SELECT id, name, dob FROM student WHERE id='$id'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0)
    {
        echo "<table border='1' cellpadding='8'>";
        echo "<tr><th>ID</th><th>Name</th><th>Date of Birth</th></tr>";

        while ($row = mysqli_fetch_row($result))
        {
            echo "<tr>";
            echo "<td>".$row[0]."</td>";
            echo "<td>".$row[1]."</td>";
            echo "<td>".$row[2]."</td>";
            echo "</tr>";
        }

        echo "</table>";
    }
    else
    {
        echo "No student found with that ID.";
    }

    mysqli_close($conn);
}

?>

</body>
</html>`
    },
    "string_ops.php": {
        name: "string_ops.php",
        size: "527 bytes",
        code: `<html>
<head>
<title> String Operations </title>
</head>
<body>
<?php
$str1 = "Hello";
$str2 = "World";
echo "Original String : <br>";
echo "string 1 :". $str1."<br>";
echo "string 2 :". $str2."<br><br>";
echo "string length of str1:". strlen($str1)."<br>";
echo "String to Uppercase :". strtoupper($str1)."<br>";
echo "string to Lowercase :". strtolower($str1)."<br>";
echo "string to reverse :". strrev($str1)."<br>";
echo "Concatenation :". $str1." ". $str2."<br>";
?>
</body>
</html>`
    },
    "insert_student.php": {
        name: "insert_student.php",
        size: "742 bytes",
        code: `<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "colleges";

$conn = new mysqli($servername, $username, $password, $dbname);

if (isset($_POST['submit'])) {
    $id = $_POST['id'];
    $name = $_POST['sname'];
    $dob = $_POST['dob'];

    $sql = "INSERT INTO STUDENT (id, name, dob) VALUES ('$id', '$name', '$dob')";

    if (mysqli_query($conn, $sql)) {
        echo "Record Inserted Successfully";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

$conn->close();
?>

<html>
<head>
    <title>Student Entry</title>
</head>
<body>
    <h2>Enter Student Details</h2>
    <form method="POST" action="">
        ID: <input type="text" name="id" required><br>
        Name: <input type="text" name="sname" required><br>
        Date of Birth: <input type="date" name="dob" required><br>
        <input type="submit" name="submit" value="Insert">
    </form>
</body>
</html>`
    }
};

// Application State Management
let openTabs = ["console.cmd"]; // Auto include console on start
let activeFile = "console.cmd";

// DOM Elements
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalWelcome = document.getElementById('terminal-welcome');
const codeViewContainer = document.getElementById('code-view-container');
const codeViewArea = document.getElementById('code-view-area');
const fileInfoLabel = document.getElementById('file-info-label');
const fileSizeLabel = document.getElementById('file-size-label');
const terminalTabs = document.getElementById('terminal-tabs');
const windowTitleText = document.getElementById('window-title-text');
const trayTime = document.getElementById('tray-time');
const trayDate = document.getElementById('tray-date');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const consolePromptLine = document.getElementById('console-prompt-line');
const terminalScreen = document.getElementById('terminal-screen');

// Clock Update (Windows 11 format: Time and Date stacked vertically)
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${month}/${day}/${year}`;
    
    trayTime.textContent = timeStr;
    trayDate.textContent = dateStr;
}
setInterval(updateClock, 1000);
updateClock();

// Regex-based Syntax Highlighter (Adapts tokens for VS Light scheme in Notepad mode)
function highlightPHP(code) {
    // 1. Escape HTML Special Characters
    let html = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const placeholders = [];
    function addPlaceholder(text, className) {
        const id = `___PH_${placeholders.length}___`;
        placeholders.push({
            id: id,
            value: `<span class="token ${className}">${text}</span>`
        });
        return id;
    }

    // 2. Hide String Literals first to prevent formatting inner content
    html = html.replace(/("(?:\\.|[^"\\])*")/g, (match) => addPlaceholder(match, 'string'));
    html = html.replace(/('(?:\\.|[^'\\])*')/g, (match) => addPlaceholder(match, 'string'));

    // 3. Hide PHP Comments
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => addPlaceholder(match, 'comment'));
    html = html.replace(/(\/\/.*)/g, (match) => addPlaceholder(match, 'comment'));

    // 4. Variables ($ followed by letters/numbers)
    html = html.replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="token variable">$1</span>');

    // 5. PHP Tags
    html = html.replace(/(&lt;\?php|&lt;\?|\?&gt;)/g, '<span class="token keyword">$1</span>');

    // 6. Keywords & Functions
    const keywords = [
        'if', 'else', 'elseif', 'while', 'for', 'foreach', 'switch', 'case', 'break', 'continue',
        'default', 'return', 'echo', 'print', 'new', 'class', 'function', 'session_start',
        'header', 'isset', 'empty', 'exit', 'true', 'false', 'null'
    ];
    const keyregex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keyregex, '<span class="token keyword">$1</span>');

    const functions = [
        'mysqli_connect', 'mysqli_query', 'mysqli_fetch_row', 'mysqli_close', 'mysqli_num_rows',
        'mysqli_error', 'move_uploaded_file', 'strlen', 'strtoupper', 'strtolower', 'strrev'
    ];
    const funcregex = new RegExp(`\\b(${functions.join('|')})\\b`, 'g');
    html = html.replace(funcregex, '<span class="token function">$1</span>');

    // 7. HTML Elements & Tags (Color tag names and attributes)
    html = html.replace(/(&lt;\/?[a-zA-Z0-9_-]+(?:&nbsp;|\s|[^&])*&gt;)/g, (match) => {
        return `<span class="token tag">${match}</span>`;
    });

    // 8. Restore Strings and Comments
    for (let i = placeholders.length - 1; i >= 0; i--) {
        html = html.replace(placeholders[i].id, placeholders[i].value);
    }

    return html;
}

// Display File Content inside Notepad / Terminal Console
function displayFile(filename) {
    if (!filesDb[filename]) return false;
    
    activeFile = filename;
    
    // Add to tabs if not present
    if (!openTabs.includes(filename)) {
        openTabs.push(filename);
    }

    // Render active state on taskbar shortcuts
    document.querySelectorAll('.taskbar-pinned .file-launcher').forEach(btn => {
        if (btn.getAttribute('data-file') === filename) {
            btn.setAttribute('active', 'true');
        } else {
            btn.removeAttribute('active');
        }
    });

    renderTabs();
    restoreWindow();

    if (filename === 'console.cmd') {
        // Toggle dark console active mode
        terminalScreen.classList.add('console-active');
        windowTitleText.textContent = `Windows PowerShell`;
        
        // Show console prompt & logs, hide code viewer
        terminalWelcome.style.display = 'block';
        terminalOutput.style.display = 'block';
        consolePromptLine.style.display = 'flex';
        codeViewContainer.style.display = 'none';
        
        // Focus shell input
        terminalInput.focus();
    } else {
        // Light Notepad mode
        terminalScreen.classList.remove('console-active');
        windowTitleText.textContent = `${filename} - Notepad`;
        fileInfoLabel.textContent = `C:\\Users\\vivek\\codes\\${filename}`;
        fileSizeLabel.textContent = filesDb[filename].size;
        
        // Hide welcome & logs, show code viewer
        terminalWelcome.style.display = 'none';
        terminalOutput.style.display = 'none';
        consolePromptLine.style.display = 'none';
        codeViewContainer.style.display = 'block';
        
        // Set and highlight code
        codeViewArea.innerHTML = highlightPHP(filesDb[filename].code);
        codeViewContainer.scrollTop = 0;
    }
    
    return true;
}

// Render tabs bar in Windows 11 style
function renderTabs() {
    terminalTabs.innerHTML = '';
    
    if (openTabs.length === 0) {
        terminalTabs.parentElement.style.display = 'none';
        return;
    }
    
    terminalTabs.parentElement.style.display = 'flex';
    
    openTabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `terminal-tab ${tab === activeFile ? 'active' : ''}`;
        tabEl.innerHTML = `
            <span>${tab}</span>
            <span class="tab-close" data-file="${tab}">&times;</span>
        `;
        
        // Tab click behavior
        tabEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                closeTab(tab);
            } else {
                displayFile(tab);
            }
        });
        
        terminalTabs.appendChild(tabEl);
    });
}

// Close a tab
function closeTab(filename) {
    // Prevent closing the last tab if it's the only one left
    if (openTabs.length === 1) {
        showToast("Cannot close the last open tab!");
        return;
    }

    openTabs = openTabs.filter(t => t !== filename);
    
    if (activeFile === filename) {
        displayFile(openTabs[openTabs.length - 1]);
    } else {
        renderTabs();
    }
}

// Toast Alert Manager
function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// File Copy to Clipboard
document.getElementById('action-copy').addEventListener('click', () => {
    if (!activeFile || activeFile === 'console.cmd') {
        showToast("No active Notepad file to copy!");
        return;
    }
    
    const code = filesDb[activeFile].code;
    navigator.clipboard.writeText(code).then(() => {
        showToast(`${activeFile} copied to clipboard!`);
    }).catch(err => {
        console.error("Clipboard copy failed: ", err);
        showToast("Failed to copy code.");
    });
});

// File Save/Download Manager
document.getElementById('action-download').addEventListener('click', () => {
    if (!activeFile || activeFile === 'console.cmd') {
        showToast("No active Notepad file to save!");
        return;
    }
    
    const code = filesDb[activeFile].code;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Saved C:\\Users\\vivek\\downloads\\${activeFile} successfully!`);
});

// Reset Notepad Environment
function resetTerminal() {
    openTabs = ["console.cmd"];
    activeFile = "console.cmd";
    terminalOutput.innerHTML = '';
    
    // Clear taskbar pinned highlights
    document.querySelectorAll('.taskbar-pinned .file-launcher').forEach(btn => btn.removeAttribute('active'));
    
    displayFile("console.cmd");
    showToast("Notepad environment reset.");
}

// Toggle Full Screen Window (Maximize)
function toggleFullscreen() {
    const termWindow = document.querySelector('.terminal-window');
    termWindow.classList.toggle('fullscreen');
    
    const isFullscreen = termWindow.classList.contains('fullscreen');
    const fsText = document.getElementById('fullscreen-text');
    const fsIcon = document.getElementById('fullscreen-icon');
    
    if (isFullscreen) {
        fsText.textContent = "Restore";
        fsIcon.innerHTML = `<path fill="currentColor" d="M4 8h4V4H6v2H2v2h2V8zm12-4h-2v4h4V6h-2V4zM4 16H2v2h4v-2H4v-2zm12 2h2v-2h2v-2h-4v4z"/>`;
        showToast("Notepad maximized.");
    } else {
        fsText.textContent = "Maximize";
        fsIcon.innerHTML = `<path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>`;
        showToast("Notepad window restored.");
    }
    
    if (activeFile === 'console.cmd') {
        terminalInput.focus();
    }
}

// Minimization triggers
function minimizeWindow() {
    const win = document.querySelector('.terminal-window');
    win.style.display = 'none';
    document.getElementById('task-notepad-btn').classList.remove('active');
    showToast("Notepad minimized to taskbar.");
}

function restoreWindow() {
    const win = document.querySelector('.terminal-window');
    win.style.display = 'flex';
    document.getElementById('task-notepad-btn').classList.add('active');
    if (activeFile === 'console.cmd') {
        terminalInput.focus();
    }
}

// Action Header Buttons bindings
document.getElementById('action-reset').addEventListener('click', resetTerminal);
document.getElementById('action-fullscreen').addEventListener('click', toggleFullscreen);

// Windows Standard title buttons bindings
document.getElementById('win-min').addEventListener('click', minimizeWindow);
document.getElementById('win-max').addEventListener('click', toggleFullscreen);
document.getElementById('win-close').addEventListener('click', resetTerminal);

// Header double click maximize
document.querySelector('.terminal-header').addEventListener('dblclick', (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.terminal-actions')) return;
    toggleFullscreen();
});

// Taskbar App logo click toggles minimize/restore
document.getElementById('task-notepad-btn').addEventListener('click', () => {
    const win = document.querySelector('.terminal-window');
    if (win.style.display === 'none') {
        restoreWindow();
    } else {
        minimizeWindow();
    }
});

// Pinned taskbar buttons load files
document.querySelectorAll('.taskbar-pinned .file-launcher').forEach(btn => {
    btn.addEventListener('click', () => {
        const file = btn.getAttribute('data-file');
        displayFile(file);
    });
});

// Windows Shell Commands Simulator
const COMMAND_HELP = `
<span class="highlight-orange">Windows PowerShell Help Commands Guide:</span>
  <span class="highlight-green">dir</span>                  List files in current directory (alias: <span class="highlight-blue">ls</span>)
  <span class="highlight-green">type &lt;filename&gt;</span>      Display and highlight contents of a specific file (alias: <span class="highlight-blue">cat</span>)
  <span class="highlight-green">cls</span>                  Clear the console log output (alias: <span class="highlight-blue">clear</span>)
  <span class="highlight-green">systeminfo</span>           Display OS configuration statistics
  <span class="highlight-green">reset</span>                Reset terminal tabs and welcome view
  <span class="highlight-green">fullscreen</span>           Toggle full screen window state
  <span class="highlight-green">help</span>                 Show this help guides index
`;

const COMMAND_SYSTEMINFO = `
<span class="highlight-blue">████████████  ████████████</span>   Host Name:           WINDOWS11-PHP-LAB
<span class="highlight-blue">████████████  ████████████</span>   OS Name:             Microsoft Windows 11 Pro Light
<span class="highlight-blue">████████████  ████████████</span>   OS Version:          10.0.22621 N/A Build 22621
<span class="highlight-blue">████████████  ████████████</span>   OS Manufacturer:     Microsoft Corporation
                             System Type:         x64-based PC
<span class="highlight-blue">████████████  ████████████</span>   Processor(s):        AMD Ryzen 7 5800X 8-Core @ 3.80GHz
<span class="highlight-blue">████████████  ████████████</span>   Total Physical Mem:  16,384 MB
<span class="highlight-blue">████████████  ████████████</span>   Active PHP Version:  PHP 8.1.18 (cli)
<span class="highlight-blue">████████████  ████████████</span>   Default Database:    MySQL 8.0 (college)
`;

function executeCommand(inputLine) {
    const trimmed = inputLine.trim();
    if (!trimmed) return;

    // Log the input command
    appendLog(`PS C:\\Users\\vivek\\codes&gt; ${trimmed}`, 'command');

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.length > 1 ? parts[1] : null;

    switch (cmd) {
        case 'help':
            appendLog(COMMAND_HELP);
            break;
        case 'cls':
        case 'clear':
            terminalOutput.innerHTML = '';
            terminalWelcome.style.display = 'none';
            break;
        case 'systeminfo':
            appendLog(COMMAND_SYSTEMINFO);
            break;
        case 'dir':
        case 'ls':
            let fileList = '    Directory: C:\\Users\\vivek\\codes\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n';
            Object.keys(filesDb).forEach(name => {
                if (name !== 'console.cmd') {
                    fileList += `-a---          08/03/2026   12:00 AM          ${filesDb[name].size.padStart(7)} <span class="highlight-blue">${name}</span>\n`;
                }
            });
            appendLog(fileList);
            break;
        case 'type':
        case 'cat':
            if (!arg) {
                appendLog(`Error: Command requires a file argument (e.g. type upload.php)`, 'error');
            } else if (filesDb[arg] && arg !== 'console.cmd') {
                const loaded = displayFile(arg);
                if (loaded) {
                    appendLog(`Opened C:\\Users\\vivek\\codes\\${arg} in Notepad tab.`, 'success');
                }
            } else {
                appendLog(`Get-Content : Cannot find path 'C:\\Users\\vivek\\codes\\${arg}' because it does not exist.`, 'error');
            }
            break;
        case 'reset':
            resetTerminal();
            break;
        case 'fullscreen':
        case 'maximize':
            toggleFullscreen();
            break;
        default:
            appendLog(`The term '${cmd}' is not recognized as the name of a cmdlet, function, script program, or operable file.`, 'error');
    }
}

function appendLog(htmlContent, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = htmlContent;
    terminalOutput.appendChild(entry);
    
    // Auto-scroll output log
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Input Submit listener
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = terminalInput.value;
        executeCommand(val);
        terminalInput.value = '';
    }
});

// Click anywhere inside terminal screen container to focus input (only if terminal cmd is active)
terminalScreen.addEventListener('click', () => {
    if (activeFile === 'console.cmd') {
        terminalInput.focus();
    }
});

// Pinned tabs bar "+" icon opens console.cmd tab
document.querySelector('.new-tab-btn').addEventListener('click', () => {
    displayFile('console.cmd');
    showToast("Opened terminal session.");
});

// Desktop icons click handlers
document.getElementById('desktop-thispc').addEventListener('click', () => {
    if (activeFile === 'console.cmd') {
        appendLog("PS C:\\Users\\vivek\\codes&gt; [System.Environment]::OSVersion", 'command');
        appendLog(`
Platform OS: Win32NT
Service Pack: 
Version: 10.0.22621.0
VersionString: Microsoft Windows NT 10.0.22621.0
`);
    } else {
        showToast("System details simulated. Open console.cmd tab to run command.");
    }
});

document.getElementById('desktop-recycle').addEventListener('click', () => {
    if (activeFile === 'console.cmd') {
        appendLog("PS C:\\Users\\vivek\\codes&gt; Clear-RecycleBin -Force", 'command');
        appendLog("Recycle Bin is empty.", "success");
    } else {
        showToast("Recycle bin emptied.");
    }
});

document.getElementById('desktop-readme').addEventListener('click', () => {
    displayFile('upload.php'); // Just loads any script
    showToast("Opening README simulation.");
    if (activeFile === 'console.cmd') {
        executeCommand("type README.txt");
    } else {
        // Temporarily display README in viewer
        fileInfoLabel.textContent = `C:\\Users\\vivek\\codes\\README.txt`;
        fileSizeLabel.textContent = "284 bytes";
        codeViewArea.innerHTML = `Notepad.exe - Windows 11 PHP Lab Viewer
=========================================
This is a responsive text editor simulating Windows 11 Notepad.
Select files from the taskbar, or switch to 'console.cmd' tab
to issue terminal commands.

Copy, Save, and Reset tools are present in the window header bar.`;
    }
});

document.getElementById('desktop-student-db').addEventListener('click', () => {
    if (activeFile === 'console.cmd') {
        appendLog("PS C:\\Users\\vivek\\codes&gt; mysql -u root -p college", 'command');
        appendLog(`
Welcome to the MariaDB monitor.  Commands end with ; or \\g.
Your Connection ID is 81.

mysql&gt; SHOW TABLES;
+-------------------+
| Tables_in_college |
+-------------------+
| student           |
+-------------------+
1 row in set (0.001 sec)
`);
    } else {
        showToast("MySQL database connected. Open console.cmd tab to inspect.");
    }
});

// Start button resets view to welcome
document.getElementById('start-btn').addEventListener('click', () => {
    activeFile = null;
    windowTitleText.textContent = `Windows 11 Notepad`;
    codeViewContainer.style.display = 'none';
    terminalWelcome.style.display = 'block';
    terminalOutput.style.display = 'none';
    consolePromptLine.style.display = 'none';
    terminalScreen.classList.remove('console-active');
    
    document.querySelectorAll('.taskbar-pinned .file-launcher').forEach(btn => btn.removeAttribute('active'));
    restoreWindow();
    showToast("Windows 11 Start Menu loaded.");
});

// Auto load upload.php tab at launch
window.addEventListener('DOMContentLoaded', () => {
    displayFile('console.cmd'); // Default to console command line on launch
    displayFile('upload.php'); // And auto open upload.php so they see Notepad style immediately!
});
