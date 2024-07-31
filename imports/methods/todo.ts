import { createMethod } from "meteor/zodern:relay";
import { TodoSchema, TodosCollection } from "/imports/api/todos";
import { z } from "zod";

export const getTodos = createMethod({
    name: "todos.get.all",
    schema: z.object({}),
    async run() {
        const todos = await TodosCollection.find().fetchAsync();
        console.log({ todos });
        return todos;
    },
});

export const insertTodo = createMethod({
    name: "todos.insert",
    schema: z.object({ newTodo: TodoSchema }),
    async run({ newTodo }) {
        return await TodosCollection.insertAsync({
            _id: newTodo._id,
            title: newTodo.title,
            done: false,
            createdAt: new Date(),
        });
    },
});

export const updateTodo = createMethod({
    name: "todos.finish",
    schema: z.object({ _id: z.string(), done: z.boolean() }),
    async run({ _id, done }) {
        await TodosCollection.updateAsync(
            { _id },
            {
                $set: {
                    done,
                },
            },
        );
    },
});

export const removeTodo = createMethod({
    name: "todos.remove",
    schema: z.object({ _id: z.string() }),
    async run({ _id }) {
        await TodosCollection.removeAsync({ _id });
    },
});