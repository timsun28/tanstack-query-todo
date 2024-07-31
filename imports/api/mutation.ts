import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "/imports/api/todos";
import { insertTodo, removeTodo, updateTodo } from "/imports/methods/todo";

export const useInsertTodoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["insertTodo"],
        mutationFn: async ({ newTodo }: { newTodo: Todo }) =>
            insertTodo({ newTodo }).then((res) => res),
        onMutate: async (variables) => {
            const queryKey = ["todos"];
            // Cancel current queries for the todos query
            await queryClient.cancelQueries({ queryKey });

            // Update the todo in the queryClient
            const optimisticTodo = {
                ...variables.newTodo,
            };
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old) {
                    return [...old, optimisticTodo];
                }
                return old;
            });

            return { optimisticTodo };
        },
        onError: (_error, _variables, context) => {
            const queryKey = ["todos"];
            // Rollback to the previous todo
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old && context) {
                    return old.filter(
                        (todo) => todo._id !== context.optimisticTodo._id,
                    );
                }
                return old;
            });
        },
        retry: 3,
    });
};

export const useUpdateTodoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async ({ _id, done }: { _id: string; done: boolean }) =>
            updateTodo({
                _id,
                done,
            }).then((res) => res),
        onMutate: async (variables) => {
            const queryKey = ["todos"];
            // Cancel current queries for the todos query
            await queryClient.cancelQueries({ queryKey });

            // Get the previous todos
            const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);
            const previousTodo = previousTodos?.find(
                (todo) => todo._id === variables._id,
            );

            if (!previousTodo) {
                throw new Error("todo not found");
            }

            // Update the todo in the queryClient
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old) {
                    return old.map((todo) =>
                        todo._id === variables._id
                            ? { ...todo, done: variables.done }
                            : todo,
                    );
                }
                return old;
            });
            return { previousTodo };
        },
        onError: (_error, variables, context) => {
            const queryKey = ["todos"];
            // Rollback to the previous todo
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old && context) {
                    return old.map((todo) =>
                        todo._id === variables._id
                            ? context.previousTodo
                            : todo,
                    );
                }
                return old;
            });
        },
        retry: 3,
    });
};

export const useRemoveTodoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["removeTodo"],
        mutationFn: async ({ _id }: { _id: string }) => removeTodo({ _id }),
        onMutate: async (variables) => {
            const queryKey = ["todos"];
            // Cancel current queries for the todos query
            await queryClient.cancelQueries({ queryKey });

            // Get the previous todos
            const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);
            const previousTodo = previousTodos?.find(
                (todo) => todo._id === variables._id,
            );

            if (!previousTodo) {
                throw new Error("todo not found");
            }

            // Update the todo in the queryClient
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old) {
                    return old.filter((todo) => todo._id !== variables._id);
                }
                return old;
            });
            return { previousTodo };
        },
        onError: (_error, _variables, context) => {
            const queryKey = ["todos"];
            // Rollback to the previous todo
            queryClient.setQueryData<Todo[]>(queryKey, (old) => {
                if (old && context) {
                    return [...old, context.previousTodo];
                }
                return old;
            });
        },
        retry: 3,
    });
};
