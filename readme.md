# Tanstack Query todo example with Meteor 3.0 and zodern:relay

This is a simple example of how to use Tanstack Query with Meteor and zodern:relay.
This combination allows you to easily manage your data fetching and state management in your Meteor app with full TypeScript support.

## Details

This example uses the following unreleased version of the zodern:relay that is currently an open PR: https://github.com/zodern/meteor-relay/pull/17

## Running the example
1. Clone the repo
2. Run `meteor npm install`
3. Run `npm run start` 
4. Open your browser to `http://localhost:3000`

## What's included
imports/methods/todos.ts - The Meteor methods for fetching todos. This is where you would put your server-side logic. The babelrc plugin "@zodern/babel-plugin-meteor-relay" is used to keep the server side code out of the client bundle, but so you can still import it in the client code and have full type safety.

imports/api/queries.ts - The queries for fetching todos. This is where you would put your client-side logic. In a current code editor with TypeScript support, you will get full type safety and auto-completion if you hover over the todos variable in the `useQuery` hook. This also works in the component that uses the `useTodos` hook.

imports/api/mutation.ts - The mutation file is for mutating a todo. This is where you would put your client-side logic for adding a todo. The useMutation hook has lots of options and hooks for handling the mutation. In this example where we are using the onMutate option to update the cache before the mutation is complete. You can also use the onError option to handle errors and roll back the cache.

imports/api/todo.ts - The todo types and Mongo collection. 