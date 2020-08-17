export class Message {
  private type: string;
  private payload?: any;

  constructor(type: string, payload?: any) {
    this.type = type;

    if (payload) {
      this.payload = payload;
    }
  }

  public getType(): string {
    return this.type;
  }

  public getPayload(): any {
    return this.payload;
  } 

  public static getMessageFromObject(input: object): Message {
    return new Message(input["type"], input["payload"])
  }
}