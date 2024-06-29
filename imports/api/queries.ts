import { useQuery } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";
import { Todo } from "/imports/api/todos";

export const useTodos = () => {
    return useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const todos = (await Meteor.callAsync("todos.get")) as Todo[];
            // const todos = await getTodos({});
            console.log({ todos });
            if (!todos) {
                throw new Error("Network response was not ok");
            }
            return todos;
        },
    });
};
