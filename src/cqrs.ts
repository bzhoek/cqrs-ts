export interface Aggregate {
}

export interface Command {
}

export interface DomainEvent {
}

export class Fixture {
  private emitted: DomainEvent[] = []

  public given(e: DomainEvent) {
    return this;
  }

  when(command: Command) {
    return this;
  }

  then(event: DomainEvent) {
    expect(this.emitted.length).toBe(1);
    expect(this.emitted[0].constructor.name).toBe(event.constructor.name);
    return this;
  }
}
