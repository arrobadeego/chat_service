class MasterSocket {
  constructor(connection) {
    this.ws = connection;
  }

  get socket() {
    return this.ws;
  }

  emit() {
    this.ws.emit();
  }
}

module.exports = MasterSocket;
