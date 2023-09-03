import React, { Component } from "react"
import Terminal from "react-console-emulator";
import Spinner from "react-cli-spinners2";

// .. helpers

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleResponse = (terminal: typeof Terminal, response: string) => {
  terminal?.pushToStdout(
    <div dangerouslySetInnerHTML={{ __html: response }} className="response" />
  );
  terminal?.pushToStdout("<br/>");
}

const removeSpinner = () => {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.remove();
  }
}

// ..

export default class DMUDTerminal extends Component {
  commands = {
    exit: {
      description: "Exit the game",
      fn: () => this.sendCommand("exit"),
    },
    look: {
      description: "Look around",
      fn: () => this.sendCommand("look"),
    },
    say: {
      description: "Say something",
      fn: (...args: string[]) => this.sendCommand(`say ${args.join(" ")}`),
    }
  };
  spinners: typeof Spinner[] = [];
  terminal: typeof Terminal | null = null;
  ws: WebSocket | null = null;

  constructor(props: any) {
    super(props);
    this.terminal = React.createRef()
  }

  componentDidMount() {
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


  async connect() {
    const terminal = this.terminal?.current;

    this.addSpinner("Connecting to server");
    await delay(2500);

    this.ws = new WebSocket("ws://localhost:8080/")
    this.ws.onclose = () => console.info("WebSocket connection closed");
    this.ws.onerror = (error) => console.error("WebSocket error: ", error);
    this.ws.onmessage = (event) => {
      handleResponse(terminal, event.data);
    }
    this.ws.onopen = async () => {
      console.info("WebSocket connection opened");
      removeSpinner();
      handleResponse(terminal, "Welcome to DMUD!");
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
        commands={this.commands}
        dangerMode={true}
        noNewlineParsing={true}
        onClick={this.terminal.focusTerminal}
        promptLabel={" "}
        ref={this.terminal}
      />
    );
  }
}