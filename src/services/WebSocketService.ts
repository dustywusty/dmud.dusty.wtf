type MessageHandler = (message: string) => void;
type ErrorHandler = (error: Event) => void;
type OpenHandler = () => void;
type CloseHandler = () => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private messageHandler?: MessageHandler;
  private errorHandler?: ErrorHandler;
  private openHandler?: OpenHandler;
  private closeHandler?: CloseHandler;

  constructor(url: string) {
    this.url = url;
  }

  connect(
    onOpen?: OpenHandler,
    onClose?: CloseHandler,
    onMessage?: MessageHandler,
    onError?: ErrorHandler
  ) {
    this.ws = new WebSocket(this.url);
    this.openHandler = onOpen;
    this.closeHandler = onClose;
    this.messageHandler = onMessage;
    this.errorHandler = onError;

    this.ws.onopen = () => this.openHandler && this.openHandler();
    this.ws.onclose = () => this.closeHandler && this.closeHandler();
    this.ws.onmessage = (event) => this.messageHandler && this.messageHandler(event.data);
    this.ws.onerror = (error) => this.errorHandler && this.errorHandler(error);
  }

  send(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
