import React, { Component } from "react"
import Terminal from "react-console-emulator"

const commands = {
  echo: {
    description: "Echo a passed string.",
    usage: "echo <string>",
    fn: (...args: any[]) => args.join(" ")
  }
}

const banner = "<pre>▓█████▄  ███▄ ▄███▓ █    ██ ▓█████▄ <br/>▒██▀ ██▌▓██▒▀█▀ ██▒ ██  ▓██▒▒██▀ ██▌<br/>░██   █▌▓██    ▓██░▓██  ▒██░░██   █▌<br/>░▓█▄   ▌▒██    ▒██ ▓▓█  ░██░░▓█▄   ▌<br/>░▒████▓ ▒██▒   ░██▒▒▒█████▓ ░▒████▓ <br/>▒▒▓  ▒ ░ ▒░   ░  ░░▒▓▒ ▒ ▒  ▒▒▓  ▒ <br/>░ ▒  ▒ ░  ░      ░░░▒░ ░ ░  ░ ▒  ▒ <br/>░ ░  ░ ░      ░    ░░░ ░ ░  ░ ░  ░ <br/>░           ░      ░        ░    <br/>░                           ░</pre>";
const welcome = "Welcome traveler, what should we call you?"

export default class MyTerminal extends Component {
  render() {
    return (
      <Terminal
        className="terminal"
        commands={commands}
        dangerMode={true}
        errorText="What?"
        noDefaults={true}
        noEchoBack={false}
        promptLabel={"> "}
        welcomeMessage={banner + "<br/>" + welcome}
      />
    )
  }
}