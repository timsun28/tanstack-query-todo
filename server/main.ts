/**
 * These modules are automatically imported by jorgenvatle:vite.
 * You can commit these to your project or move them elsewhere if you'd like,
 * but they must be imported somewhere in your Meteor mainModule.
 *
 * More info: https://github.com/JorgenVatle/meteor-vite#lazy-loaded-meteor-packages
 **/
import "../_vite-bundle/server/_entry.mjs"
/** End of vite auto-imports **/
import { Meteor } from "meteor/meteor";
import { TodosCollection } from "/imports/api/todos";

import "/imports/methods/todo";

async function insertLink({ title }: { title: string }) {
    await TodosCollection.insertAsync({
        title,
        done: false,
        createdAt: new Date(),
    });
}

Meteor.startup(async () => {
    // If the Links collection is empty, add some data.
    if ((await TodosCollection.find().countAsync()) === 0) {
        await insertLink({
            title: "My first todo",
        });
    }
});
