/** * SALEM OS KERNEL v1.0 - STABLE BUILD **/

// #region Core Configuration
const SalemOS = {
    user: 'root',
    hostname: 'salem',
    fileSystem: { '/': [{name: 'welcome.txt', content: 'Welcome to SalemOS.'}] },
    root: { name: '/', type: 'dir', children: [], parent: null },
    currentPath: '/',
    activeProcesses: [],
    history: [],
    historyIndex: -1,
    bootTime: Date.now()
};

class VFSNode {
    constructor(name, type, content = "", parent = null) {
        this.name = name;
        this.type = type;
        this.content = content;
        this.parent = parent;
        this.children = []; 
    }
}
// #endregion

// #region System Services
const SaveManager = {
    save: () => localStorage.setItem('salem_fs', JSON.stringify(SalemOS.fileSystem)),
    load: () => {
        const saved = localStorage.getItem('salem_fs');
        if (saved) SalemOS.fileSystem = JSON.parse(saved);
    }
};
// #endregion

// #region Command Registry
const CommandRegistry = {
    help: () => log("Available: clear, ls, mkdir, spm, cat, save, rmdir, cd, fastfetch, make, touch, ps, slamen, date, uptime"),
    clear: () => { document.getElementById('cli-output').innerHTML = ''; },
    ls: () => {
        const files = SalemOS.fileSystem[SalemOS.currentPath];
        log(files ? files.map(f => f.name).join('  ') : "Empty");
    },
    ps: () => {
        log("PID    CMD    STATUS");
        log("---    ---    ------");
        SalemOS.activeProcesses.forEach(p => log(`${p.pid}    ${p.name}    ${p.status}`));
    },
    slamen: (args) => {
        const flag = args[0];
        if (flag === '--releases') log("Available ISOs: SalemOS-v1.0-Stable.iso");
        else if (flag === '--version') log("SalemOS ISO Version: 1.0.0-stable");
        else log("Usage: slamen [--releases | --version]");
    },
    mkdir: (args) => {
        if (!args[0]) return log("Usage: mkdir [name]");
        let currentDir = resolvePath(SalemOS.currentPath);
        currentDir.children.push(new VFSNode(args[0], 'dir', "", currentDir));
        SaveManager.save();
        log(`Directory ${args[0]} created.`);
    },
    rmdir: (args) => {
        const files = SalemOS.fileSystem[SalemOS.currentPath];
        const index = files.findIndex(f => f.name === args[0]);
        if (index !== -1) { files.splice(index, 1); SaveManager.save(); log(`Removed ${args[0]}`); }
        else log(`rmdir: ${args[0]}: Not found`);
    },
    cd: (args) => {
        if (!args[0] || args[0] === '/') SalemOS.currentPath = '/';
        else log(`Changed directory to ${args[0]}`);
    },
    fastfetch: () => {
        const logo = `<pre>   _____      _                      ____   _____ 
  / ____|    | |                    / __ \\ / ____|
 | (___   __ _| | ___ _ __ ___      | |  | | (___  
  \\___ \\ / _\` | |/ _ \\ '_ \` _ \\     | |  | |\\___ \\ 
  ____) | (_| | |  __/ | | | | |    | |__| |____) |
 |_____/ \\__,_|_|\\___|_| |_| |_|     \\____/|_____/ </pre>`;
        log(logo);
        log(`OS: SalemOS v1.0 | Kernel: JS/V8 | Uptime: ${((Date.now() - SalemOS.bootTime) / 60000).toFixed(0)}m`);
    },
    cat: (args) => {
        const file = SalemOS.fileSystem[SalemOS.currentPath]?.find(f => f.name === args[0]);
        if (file) log(file.content);
        else log(`cat: ${args[0]}: No such file`);
    },
    touch: (args) => {
        SalemOS.fileSystem[SalemOS.currentPath].push({ name: args[0], content: "Empty", mode: "644" });
        SaveManager.save();
        log(`File '${args[0]}' created.`);
    },
    make: (args) => {
        const pid = Math.floor(Math.random() * 9000) + 1000;
        SalemOS.activeProcesses.push({ pid, name: 'make', status: 'RUNNING' });
        log(`[PID ${pid}] Building...`);
        setTimeout(() => {
            SalemOS.activeProcesses = SalemOS.activeProcesses.filter(p => p.pid !== pid);
            log(`[PID ${pid}] Build complete.`);
        }, 3000);
    },
    save: () => { SaveManager.save(); log("System state saved."); },
    date: () => { log(new Date().toString()); },
    uptime: () => {
        const mins = Math.floor((Date.now() - SalemOS.bootTime) / 60000);
        log(`System uptime: ${mins} minutes`);
    }
};
// #endregion

// #region Kernel IO
function log(text) {
    const output = document.getElementById('cli-output');
    const p = document.createElement('p');
    p.innerHTML = text;
    output.appendChild(p);
}

function processCommand(raw) {
    const parts = raw.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    if (CommandRegistry[cmd]) CommandRegistry[cmd](parts.slice(1));
    else log(`Command not found: ${cmd}`);
}

function resolvePath(path) {
    return SalemOS.root;
}
// #endregion

window.onload = () => {
    SaveManager.load();
    document.getElementById('prompt-line').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('cli-input');
        processCommand(input.value);
        input.value = '';
    });
};