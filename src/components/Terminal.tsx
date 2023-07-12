import React, { Component } from "react"
import Terminal from "react-console-emulator"

import { Player } from '../contexts/PlayerContext';
import { GAME_BANNER, WELCOME_MSG } from "@/util/constants";

export default class MyTerminal extends Component {

  playerConnected: boolean = false;
  playerName: string = "";
  playerNameConfirmed: boolean = false;
  terminal: any;

  // ...

  constructor(props: any) {
    super(props)
    this.terminal = React.createRef()
  }

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
        this.terminal.current.pushToStdout("<br/>");
        return;
      }

      if (result === null) { // command not found
        const response = ["What?", "Huh?"][Math.floor(Math.random() * 2)];
        this.terminal.current.pushToStdout(response);
      }

      this.terminal.current.pushToStdout("<br/>");
    }

    return (
      <Terminal
        className="terminal"
        commands={{}}
        commandCallback={commandCallback}
        dangerMode={true}
        errorText=" "
        noDefaults={false}
        noEchoBack={false}
        promptLabel={"> "}
        ref={this.terminal}
        welcomeMessage={GAME_BANNER + "<br/>" + WELCOME_MSG}
      />
    )
  }
}
