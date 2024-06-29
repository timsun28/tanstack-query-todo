import { Mongo } from "meteor/mongo";
import { z } from "zod";

export const NewTodoSchema = z.object({
    title: z.string(),
    done: z.boolean(),
});

export type NewTodo = z.infer<typeof NewTodoSchema>;

export const TodoSchema = NewTodoSchema.extend({
    _id: z.string(),
    createdAt: z.date(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodosCollection = new Mongo.Collection<Todo>("todos");
