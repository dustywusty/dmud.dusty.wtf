import React, { Component } from "react"
import Terminal from "react-console-emulator"

import { Player } from '../contexts/PlayerContext';

const commands = {
}

const banner = "<pre>▓█████▄  ███▄ ▄███▓ █    ██ ▓█████▄ <br/>▒██▀ ██▌▓██▒▀█▀ ██▒ ██  ▓██▒▒██▀ ██▌<br/>░██   █▌▓██    ▓██░▓██  ▒██░░██   █▌<br/>░▓█▄   ▌▒██    ▒██ ▓▓█  ░██░░▓█▄   ▌<br/>░▒████▓ ▒██▒   ░██▒▒▒█████▓ ░▒████▓ <br/>▒▒▓  ▒ ░ ▒░   ░  ░░▒▓▒ ▒ ▒  ▒▒▓  ▒ <br/>░ ▒  ▒ ░  ░      ░░░▒░ ░ ░  ░ ▒  ▒ <br/>░ ░  ░ ░      ░    ░░░ ░ ░  ░ ░  ░ <br/>░           ░      ░        ░    <br/>░                           ░</pre>";
const welcome = "Welcome traveler, what should we call you?"

export default class MyTerminal extends Component {

  constructor(props: any) {
    super(props)
    this.terminal = React.createRef()
  }

  // ...

  playerConnected: boolean = false;
  playerName: string = "";
  playerNameConfirmed: boolean = false;

  terminal: any;

  // ...

  handleConnect = (rawInput: string) => {
    const player: Player = this.context?.player;

    const validatePlayerName = (rawInput: string) => {
      return /^[a-zA-Z]+$/i.test(rawInput) && rawInput !== "no";
    };

    if (this.playerName === "" && !validatePlayerName(rawInput)) {
      this.terminal.current.pushToStdout("What should we call you?");
      return;
    } else if (this.playerName === "" && !["yes", "no"].includes(rawInput)) {
      this.playerName = rawInput;
    }

    if (!this.playerNameConfirmed) {
      if (rawInput === "yes") {
        this.playerNameConfirmed = true;
        this.playerConnected = true;
        this.terminal.current.pushToStdout(`Welcome ${this.playerName}, it's nice to see you!<br/><br/>I'm sorry, but this client isn't finished quite yet. :(<br/><br/>Please check back soon!`);
      } else if (rawInput === "no") {
        this.playerName = "";
        this.terminal.current.pushToStdout(`Then what should we call you?`);
      } else {
        this.terminal.current.pushToStdout(`Are you sure ${this.playerName}?`);
      }
      return;
    }

  }

  render() {
    const player: Player = this.context?.player;

    const commandCallback = ({ command, args, rawInput, result }: any) => {
      if (!this.playerConnected) {
        this.handleConnect(rawInput);
        return;
      }

      if (result === null) {
        const responses = ["What?", "What?", "Huh?", "?!?"];
        const response = responses[Math.floor(Math.random() * responses.length)];

        this.terminal.current.pushToStdout(response);
      }
    }

    return (
      <Terminal
        className="terminal"
        commands={commands}
        commandCallback={commandCallback}
        dangerMode={true}
        errorText=" "
        noDefaults={false}
        noEchoBack={false}
        promptLabel={"> "}
        ref={this.terminal}
        welcomeMessage={banner + "<br/>" + welcome}
      />
    )
  }
}
