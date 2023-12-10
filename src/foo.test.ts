import "reflect-metadata";
import {Aggregate, Command, DomainEvent, Fixture} from './cqrs'
import {sum} from './foo';

// COMMANDS
class CreateTodo implements Command {
}

class ModifyTodo implements Command {
}

// EVENTS
class TodoCreated implements DomainEvent {
  constructor(public id: number, public title: string) {
  }

}

class TodoCompleted implements DomainEvent {
  constructor(public id: number) {
  }
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


function fixture() {
  return new Fixture();
}

class CompleteTodo implements Command {
  constructor(id: number) {
  }
}

test("todo is completed", () => {
  let id = 1;
  fixture()
      .given(new TodoCreated(id, "sample"))
      .when(new CompleteTodo(id))
      .then(new TodoCompleted(id))
});