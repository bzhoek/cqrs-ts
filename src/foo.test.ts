import "reflect-metadata";
import {sum} from './foo';

// COMMANDS

interface Command {
}

class CreateTodo implements Command {}

class ModifyTodo implements Command {}

// EVENTS

interface DomainEvent {
}

class TodoCreated implements DomainEvent {
  constructor(public id: number, public title: string) {}

}

class TodoCompleted implements DomainEvent {
  constructor(public id: number) {}
}

// ROOT

class AggregateRoot {
  public apply(_event: DomainEvent) {
    // serialize
  }
}

class Todo extends AggregateRoot {

  private id: number
  private title: string
  private done = false;

  public created(event: TodoCreated) {
    this.id = event.id;
    this.title = event.title;
  }

  public complete() {
    if (this.done) {
      throw new Error('Todo already completed');
    }
    this.apply(new TodoCompleted(this.id));
  }

  public completed(_event: TodoCompleted) {
    this.done = true;
  }
}

test('convention', () => {
  expect(Reflect.has(new Todo(), 'completed'));
});

test('type', () => {
  expect(new TodoCompleted(1).constructor.name).toBe("TodoCompleted")
});

class Fixture {
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

function fixture() {
  return new Fixture();
}

class CompleteTodo implements Command {
  constructor(id: number) {}
}

test("todo is completed", () => {
  let id = 1;
  fixture()
    .given(new TodoCreated(id, "sample"))
    .when(new CompleteTodo(id))
    .then(new TodoCompleted(id))
});