import { Component, OnInit, computed, effect, signal } from '@angular/core'; // Importamos los elementos necesarios desde Angular

import { TodoModel, filterList } from '../../models/todo'; // Importamos modelos de tareas
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'; // Importamos clases para formularios reactivos

import { CommonModule } from '@angular/common'; // Importamos CommonModule

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importamos módulos necesarios
  templateUrl: './todo.component.html', // Plantilla HTML del componente
  styleUrl: './todo.component.css', // Estilos del componente
})
export class TodoComponent implements OnInit {
  todoList = signal<TodoModel[]>([]); // Señal para la lista de tareas

  constructor() {
    effect(() => { // Efecto para guardar la lista en el almacenamiento local cuando cambia
      localStorage.setItem('todos', JSON.stringify(this.todoList()));
    });
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('todos'); // Obtener la lista de tareas del almacenamiento local

    if (storage) {
      this.todoList.set(JSON.parse(storage)); // Establecer la lista de tareas si existe en el almacenamiento local
    }
  }

  filter = signal<filterList>('all'); // Señal para el filtro de tareas

  todoListFiltered = computed(() => { // Función computada para filtrar la lista de tareas
    const filter = this.filter(); // Obtener el filtro actual
    const todos = this.todoList(); // Obtener la lista de tareas

    switch (filter) {
      case 'all':
        return todos; // Devolver todas las tareas
      case 'active':
        return todos.filter((todo) => !todo.completed); // Devolver tareas no completadas
      case 'completed':
        return todos.filter((todo) => todo.completed); // Devolver tareas completadas
    }
  });

  changeFilter(filterString: filterList) { // Método para cambiar el filtro de tareas
    this.filter.set(filterString); // Establecer el nuevo filtro
  }

  newTodo = new FormControl('', { // Control de formulario para agregar nuevas tareas
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)], // Validadores para el título de la tarea
  });

  addTodo() { // Método para agregar una nueva tarea
    const newTodoTitle = this.newTodo.value.trim(); // Obtener el título de la nueva tarea

    if (this.newTodo.valid && newTodoTitle !== '') { // Verificar si el título es válido y no está vacío
      this.todoList.update((prev_todos) => { // Actualizar la lista de tareas
        return [
          ...prev_todos,
          {
            id: Date.now(),
            title: newTodoTitle,
            completed: false,
          },
        ];
      });
      this.newTodo.reset(); // Reiniciar el control del formulario
    } else {
      this.newTodo.reset(); // Reiniciar el control del formulario si el título es inválido o está vacío
    }
  }

  toggleTodo(todoId: number) { // Método para alternar el estado de completitud de una tarea
    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ? { ...todo, completed: !todo.completed } : todo; // Cambiar el estado de completitud de la tarea correspondiente
      })
    );
  }

  removeTodo(todoId: number) { // Método para eliminar una tarea
    this.todoList.update((prev_todos) =>
      prev_todos.filter((todo) => todo.id !== todoId) // Filtrar las tareas y eliminar la tarea correspondiente
    );
  }

  editTodo(todoId: number) { // Método para marcar una tarea como editable
    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, editing: true }
          : { ...todo, editing: false }; // Marcar la tarea correspondiente como editable
      })
    );
  }

  saveTitle(todoId: number, event: Event) { // Método para guardar el título editado de una tarea
    const title = (event.target as HTMLInputElement).value; // Obtener el nuevo título de la tarea

    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, title: title, editing: false } // Guardar el nuevo título y desactivar el modo de edición
          : todo;
      })
    );
  }
}
