import { useEffect, useState } from 'react';
import { Todo } from '../types';

const TodoList = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://jsonplaceholder.typicode.com/todos', { signal })
      .then((response) => response.json())
      .then((body) => {
        setErrorMessage('');
        setTodos([...body]);
        setIsLoaded(true);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setErrorMessage('Unable to load todos');
          console.error(error);
        }
        setIsLoaded(true);
      });

    return () => controller.abort();
  }, []);

  const slicedTodos = todos.slice(0, 10).map((todo) => {
    return (
      <div key={todo.id} className="flex justify-between">
        <div>{todo.title}</div>
        <div>{todo.completed ? 'Completed' : 'Not Completed'}</div>
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      {errorMessage !== '' && <div>{errorMessage}</div>}
      {isLoaded ? slicedTodos : <div>Loading...</div>}
    </div>
  );
};

export default TodoList;
