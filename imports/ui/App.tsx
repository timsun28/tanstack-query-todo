import React, { Suspense } from "react";
import { useTodos } from "/imports/api/queries";
import {
    useInsertTodoMutation,
    useRemoveTodoMutation,
    useUpdateTodoMutation,
} from "/imports/api/mutation";
import { Random } from "meteor/random";
import { Todo } from "/imports/api/todos";

const LazyLoadedComponent = React.lazy(
    () => import("/imports/ui/LazyLoadedComponent"),
);

export const App = () => {
    const { data, isLoading, error } = useTodos();

    // This is not causing the error in the client bundle
    const defaultTodo: Todo = {
        _id: "123",
        title: "test",
        done: false,
        createdAt: new Date(),
    };
    const updateMutation = useUpdateTodoMutation();
    return (
        <div className="mx-auto flex max-w-xl flex-col gap-4">
            <h1 className="text-4xl">
                Welcome to Meteor with{" "}
                <a
                    href="https://tanstack.com/query/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                >
                    Tanstack Query
                </a>{" "}
                and{" "}
                <a
                    href="https://github.com/zodern/meteor-relay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                >
                    Zodern Relay
                </a>
                !
            </h1>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <CreateTodo />
            {data && (
                <div className="flex flex-col gap-2">
                    {data.map((todo) => (
                        <label
                            key={todo._id}
                            className="flex items-center gap-2 rounded border border-gray-400 p-2"
                        >
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={(e) => {
                                    updateMutation.mutate({
                                        _id: todo._id,
                                        done: e.target.checked,
                                    });
                                }}
                            />
                            {todo.title}
                            <RemoveTodo _id={todo._id} />
                        </label>
                    ))}
                </div>
            )}
            <Suspense fallback={<div>Loading...</div>}>
                <LazyLoadedComponent />
            </Suspense>
        </div>
    );
};

const CreateTodo = () => {
    const insertMutation = useInsertTodoMutation();
    const [title, setTitle] = React.useState("");
    return (
        <form
            className="flex gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                if (!title) return;
                insertMutation.mutate({
                    newTodo: {
                        title,
                        done: false,
                        _id: Random.id(),
                        createdAt: new Date(),
                    },
                });
                setTitle("");
            }}
        >
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-gray-300 p-1"
            />
            <button
                type="submit"
                className="shrink-0 rounded bg-blue-500 p-2 text-white"
            >
                Add Todo
            </button>
        </form>
    );
};

const RemoveTodo = ({ _id }: { _id: string }) => {
    const mutation = useRemoveTodoMutation();
    return (
        <button
            className="ml-auto"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                mutation.mutate({ _id });
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};
