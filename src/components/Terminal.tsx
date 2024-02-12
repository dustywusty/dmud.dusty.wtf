import React, { useState, useEffect, useRef } from "react";
import Terminal from "react-console-emulator"; 

import { WebSocketService } from "@/services/WebSocketService";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DMUDTerminal = () => {
  const [isConnected, setIsConnected] = useState(false);
  const maxReconnectionAttempts = 5;
  const reconnectionAttempts = useRef(0);
  const terminalRef = useRef<typeof Terminal | null>(null);
  const wsService = useRef(new WebSocketService("ws://localhost:8080/"));

  useEffect(() => {
    wsService.current.connect(
      handleOpen,
      handleClose,
      handleResponse,
      handleError
    );
    return () => {
      wsService.current.close();
    };
  }, []);

  const handleOpen = () => {
    reconnectionAttempts.current = 0;
    setIsConnected(true);
    console.info("WebSocket connection opened");
  };

  const handleClose = () => {
    if (isConnected) {
      console.info("WebSocket connection closed. Attempting to reconnect...");
      handleReconnect();
    }
  };

  const handleError = (error: Event) => {
    console.error("WebSocket error: ", error);
    handleReconnect();
  };

  const handleReconnect = () => {
    if (reconnectionAttempts.current < maxReconnectionAttempts) {
      reconnectionAttempts.current++;
      console.info(
        `Reconnection attempt ${reconnectionAttempts.current} of ${maxReconnectionAttempts}`
      );
      wsService.current.connect(
        handleOpen,
        handleClose,
        handleResponse,
        handleError
      );
    } else {
      console.error(
        `Failed to reconnect after ${maxReconnectionAttempts} attempts. Please refresh the page.`
      );
    }
  }

  const handleResponse = (response: string) => {
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.pushToStdout(
        <div dangerouslySetInnerHTML={{ __html: `<pre>${response}</pre>` }} />
      );
    }
  };

  const sendCommand = (command: string) => {
    wsService.current.send(command);
  };

  const commands = {
    exit: {
      description: "Exit the game",
      fn: () => sendCommand("exit"),
    },
    help: {
      description: "List available commands",
      fn: () => sendCommand("help"),
    },
    look: {
      description: "Look around",
      fn: () => sendCommand("look"),
    },
    kill: {
      description: "Kill something",
      fn: (...args: string[]) => sendCommand(`kill ${args.join(" ")}`),
    },
    say: {
      description: "Say something",
      fn: (...args: string[]) => sendCommand(`say ${args.join(" ")}`),
    },
    scan: {
      description: "Scan the area",
      fn: () => sendCommand("scan"),
    },
    shout: {
      description: "Shout something",
      fn: (...args: string[]) => sendCommand(`shout ${args.join(" ")}`),
    },
    move: {
      description: "Move in a direction",
      fn: (...args: string[]) => sendCommand(`${args.join(" ")}`),
    },
    who: {
      description: "List players online",
      fn: () => sendCommand("who"),
    }
  };

  return (
    <Terminal
      autoFocus={true}
      autoscroll={true}
      commands={commands}
      dangerMode={true}
      noDefaults={true}
      noNewlineParsing={true}
      promptLabel=">"
      readOnly={!isConnected}
      ref={terminalRef}
    />
  );
};

export default DMUDTerminal;
