import React, { Component } from "react"
import Terminal from "react-console-emulator";
import Spinner from "react-cli-spinners2";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleResponse = (terminal: typeof Terminal, response: string) => {
  terminal?.pushToStdout(
    <div dangerouslySetInnerHTML={{ __html: `<pre>${response}</pre>` }} className="response" />
  );
  terminal?.scrollToBottom();
}

const removeSpinner = () => {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.remove();
  }
}

export default class DMUDTerminal extends Component {
  commands = {
    exit: {
      description: "Exit the game",
      fn: () => this.sendCommand("exit"),
    },
    help: {
      description: "List available commands",
      fn: () => {
        const terminal = this.terminal?.current;
        if (terminal) {
          terminal.pushToStdout(
            <div className="help">
              <p>Available commands:</p>
              <p>
                {Object.keys(this.commands).map((command) => (
                  <span key={command}>{command} </span>
                ))}
              </p>
            </div>
          );
        }
      },
    },
    look: {
      description: "Look around",
      fn: () => this.sendCommand("look"),
    },
    kill: {
      description: "Kill something",
      fn: (...args: string[]) => this.sendCommand(`kill ${args.join(" ")}`),
    },
    say: {
      description: "Say something",
      fn: (...args: string[]) => this.sendCommand(`say ${args.join(" ")}`),
    },
    scan: {
      description: "Scan the area",
      fn: () => this.sendCommand("scan"),
    },
    shout: {
      description: "Shout something",
      fn: (...args: string[]) => this.sendCommand(`shout ${args.join(" ")}`),
    },
    move: {
      description: "Move in a direction",
      fn: (...args: string[]) => this.sendCommand(`${args.join(" ")}`),
    },
    who: {
      description: "List players online",
      fn: () => this.sendCommand("who"),
    }
  };
  spinners: typeof Spinner[] = [];
  state = {
    isConnected: false,
    reconnectionAttempts: 0,
    maxReconnectionAttempts: 5,
  };
  terminal: typeof Terminal | null = null;
  ws: WebSocket | null = null;

  constructor(props: any) {
    super(props);
    this.terminal = React.createRef()
  }

  componentDidMount() {
    this.addSpinner("Connecting to server...");
    this.connect();
  }

  componentWillUnmount() {
    this.shutdown();
  }

  addSpinner(message?: string) {
    const terminal = this.terminal?.current;
    if (terminal) {
      terminal.pushToStdout(
        <div id="spinner">
          <Spinner spinner="dots12" /> {message}
        </div>
      );
    }
  }

  clear() {
    const terminal = this.terminal?.current;
    if (terminal) {
      terminal.state.stdout = [];
    }
  }

  async connect() {
    await delay(2500);

    const terminal = this.terminal?.current;

    this.clear();

    this.ws = new WebSocket("ws://localhost:8080/")
    this.ws.onclose = (e) => {
      console.info("WebSocket connection closed", e);
      this.addSpinner("Connection lost, reconnecting");
      this.setState({ isConnected: false });
      this.connect();
    }
    this.ws.onerror = (error) => console.error("WebSocket error: ", error);
    this.ws.onmessage = (event) => {
      console.info("WebSocket message received: ", event.data);
      handleResponse(terminal, event.data);
    }
    this.ws.onopen = async () => {
      console.info("WebSocket connection opened");
      this.setState({ isConnected: true });
      removeSpinner();
    };
  }

  async sendCommand(command: string) {
    const ws = this.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(command.trimEnd());
    }
  };

  shutdown() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  render() {
    return (
      <Terminal
        autoFocus={true}
        autoscroll={true}
        commands={this.commands}
        dangerMode={true}
        noDefaults={true}
        noNewlineParsing={true}
        onClick={this.terminal.focusTerminal}
        promptLabel={" "}
        readOnly={!this.state.isConnected}
        ref={this.terminal}
      />
    );
  }
}