import { Meteor } from "meteor/meteor";
import { TodosCollection } from "/imports/api/todos";

import "/imports/methods/todo";

// async function insertLink({ title }: { title: string }) {
//     await TodosCollection.insertAsync({
//         title,
//         done: false,
//         createdAt: new Date(),
//     });
// }

// Meteor.startup(async () => {
//     // If the Links collection is empty, add some data.
//     if ((await TodosCollection.find().countAsync()) === 0) {
//         await insertLink({
//             title: "My first todo",
//         });
//     }
// });
