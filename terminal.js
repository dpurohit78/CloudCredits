const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet@1.6.0/fonts' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const directories = {
    education: [
        ,
        '<white>education</white>',

        '* <a href="https://www.bing.com/ck/a?!&&p=535baa0fc262aeb29ee6519287dc2386971ec63a5c64c961cd153372fd9e2097JmltdHM9MTc1MTg0NjQwMA&ptn=3&ver=2&hsh=4&fclid=3e0d3db3-fc51-6033-0319-2f82fd576184&psq=juet&u=a1aHR0cHM6Ly93d3cuanVldC5hYy5pbi8&ntb=1">Jaypee University of Engineering and Technology</a> <yellow>"Computer Science"</yellow> 2022-2026',
        '* <a href="https://www.bing.com/ck/a?!&&p=6318dab8c0bdcfe221d57415de08b10ef12b2650105fe447f71a8ba6b6be6bb4JmltdHM9MTc1MTkzMjgwMA&ptn=3&ver=2&hsh=4&fclid=3e0d3db3-fc51-6033-0319-2f82fd576184&psq=noble+international+school&u=a1aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL25vYmxlaW50ZXJuYXRpb25hbHNjaG9vbGJoaWx3YXJhLw&ntb=1">Post-secondary</a>Noble International School<yellow>"Secondary and Senior Secondary"</yellow> 2020-2022',
        
    ],
    projects: [
        '',
        '<white> Projects</white>',
        [
            ['Realtime Device Tracker'
             ,
             'Tracks the coordinates in real time'
            ],
            ['Bus Booking Project', 'Using tkinter,sqlite and python']
            ,
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',

        [
            'JavaScript',
            'C++',
            'Python',
            'SQL',
            'Java',
            'Node.Js'
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        [
            'React.js',
            'VsCode',
            'Jest',
        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        [
            'Docker',
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'guest';
const server = 'freecodecamp.org';

// not every command needs to be binary
// we picked those three that works more like real programs
const files = [
    'joke',
    'credits',
    'record'
];

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_home() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
     term.echo(files.map(file => {
         return `<green class="command">${file}</green>`;
     }).join('\n'));
}

const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                 print_home();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_home();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_home();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    async joke() {
        // we use programming jokes so it fit better developer portfolio
        const res = await fetch('https://v2.jokeapi.dev/joke/Programming');
        const data = await res.json();
        if (data.type == 'twopart') {
            // this allow to create sequence of typing animations
            this.animation(async () => {
                // as said before in every function, passed directly
                // to terminal, you can use `this` object
                // to reference terminal instance
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
            });
        } else if (data.type === 'single') {
            this.echo(data.joke, {
                delay: 51,
                typing: true
            });
        }
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dir.startsWith('../') && cwd !== root && dirs.includes(dir.substring(3))) {
            cwd = root + '/' + dir.substring(3);
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            '',
            '<a href="https://github.com/sponsors/jcubic">Sponsor ❤️ my Open Source work</a>',
            ''
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    },
    record(arg) {
        if (arg === 'start') {
            term.history_state(true);
        } else if (arg === 'stop') {
            term.history_state(false);
        } else {
            term.echo('save commands in url hash so you can share the link\n\n' +
                      'usage: record [stop|start]\n');
            term.echo('<white>NOTE</white>: this command will not work on CodePen,' +
                     ' becuase it use an iframe!');
        }
    }
};

// clear is default command that you can turn off with an option
const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white class="command">${command}</white><aquamarine>${args}</aquamarine>`;
}]);

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;;${attrs.class}]`;
};

const term = $('#terminal').terminal(commands, {
    greetings: false,
    checkArity: false,
    // terminal should be disabled when running in CodePen preview
    enabled: $('#terminal').attr('onload') === undefined,
    completion(string) {
        // in every function we can use this to reference term object
        const { name, rest } = $.terminal.parse_command(this.get_command());
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (rest.startsWith('../') && cwd != root) {
                return dirs.map(dir => `../${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    execHash: true,
    prompt
});

term.pause();

term.on('click', '.command', function() {
   const command = $(this).text();
   term.exec(command, { typing: true, delay: 50 });
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`, { typing: true, delay: 50 });
});

function ready() {
    const seed = rand(256);
    try {
        term.echo(() => rainbow(render('Terminal Portfolio'), seed))
            .echo('<white>Welcome to my Terminal Portfolio</white>\n')
            .resume();
    } catch (e) {
        term.echo('Welcome to my Terminal Portfolio').resume();
    }
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

github('jcubic/jquery.terminal');