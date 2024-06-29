import { TodosCollection } from "/imports/api/todos";
import { Meteor } from "meteor/meteor";

Meteor.methods({
    async "todos.get"() {
        return await TodosCollection.find().fetchAsync();
    },
    async "todos.insert"({ newTodo }) {
        return await TodosCollection.insertAsync({
            _id: newTodo._id,
            title: newTodo.title,
            done: false,
            createdAt: new Date(),
        });
    },
    async "todos.finish"({ _id, done }) {
        await TodosCollection.updateAsync(
            { _id },
            {
                $set: {
                    done,
                },
            },
        );
    },
    async "todos.remove"({ _id }) {
        await TodosCollection.removeAsync({ _id });
    },
});

// export const getTodos = createMethod({
//     name: "todos.get",
//     schema: z.object({}),
//     async run() {
//         const todos = await TodosCollection.find().fetchAsync();
//         console.log({ todos });
//         return todos;
//     },
// });

// export const insertTodo = createMethod({
//     name: "todos.insert",
//     schema: z.object({ newTodo: NewTodoSchema }),
//     async run({ newTodo }) {
//         return await TodosCollection.insertAsync({
//             title: newTodo.title,
//             done: false,
//             createdAt: new Date(),
//         });
//     },
// });

// export const updateTodo = createMethod({
//     name: "todos.finish",
//     schema: z.object({ _id: z.string(), done: z.boolean() }),
//     async run({ _id, done }) {
//         await TodosCollection.updateAsync(
//             { _id },
//             {
//                 $set: {
//                     done,
//                 },
//             },
//         );
//     },
// });
