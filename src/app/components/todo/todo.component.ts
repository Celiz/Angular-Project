import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { TodoModel, filterList } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit{
  todoList = signal<TodoModel[]>([
    {
      id: 1,
      title: 'Learn Angular',
      completed: false,
      editing: false,
    },
    {
      id: 2,
      title: 'Learn React',
      completed: false,
      editing: false,
    },
  ]);

  constructor(){

    effect(() => {
    localStorage.setItem('todos', JSON.stringify(this.todoList()));
    });
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('todos');

    if(storage){
      this.todoList.set(JSON.parse(storage));
    }

  }

  filter = signal<filterList>('all');

  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todoList();

    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
    }
  });

  changeFilter(filterString: filterList) {
    this.filter.set(filterString);
  }

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();

    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todoList.update((prev_todos) => {
        return [
          ...prev_todos,
          {
            id: Date.now(),
            title: newTodoTitle,
            completed: false,
          },
        ];
      });
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number) {
    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, completed: !todo.completed } : todo;
      })
    );
  }

  removeTodo(todoId: number){
    this.todoList.update((prev_todos) => 
      prev_todos.filter((todo) => todo.id !== todoId));
  }

  editTodo(todoId: number){
    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, editing: true } : { ...todo, editing: false };
      })
    );
  }

  saveTitle(todoId: number, event: Event){
    const title = (event.target as HTMLInputElement).value;

    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, title: title, editing: false } : todo;
      })
    );
  }

}