import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { App } from "/imports/ui/App";
import { QueryClient } from "@tanstack/react-query";
import {
    PersistedClient,
    Persister,
    PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorPage } from "/imports/ui/ErrorPage";

import { get, set, del } from "idb-keyval";
import { NewTodo } from "/imports/api/todos";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            // staleTime: 1000 * 2,
        },
    },
});

const persister = createIDBPersister("reactQuery");

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
    return {
        persistClient: async (client: PersistedClient) => {
            await set(idbValidKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
    } as Persister;
}

queryClient.setMutationDefaults(["insertTodo"], {
    mutationFn: async ({ newTodo }: { newTodo: NewTodo }) => {
        const newInsertedId = (await Meteor.callAsync("todos.insert", {
            newTodo,
        }).then((res) => res)) as string;
        return newInsertedId;
    },
    onSuccess: (_result) => {
        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});
queryClient.setMutationDefaults(["updateTodo"], {
    mutationFn: async ({ _id, done }: { _id: string; done: boolean }) => {
        return await Meteor.callAsync("todos.finish", { _id, done });
    },
    onSuccess: (_result) => {
        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});
queryClient.setMutationDefaults(["removeTodo"], {
    mutationFn: async ({ _id }: { _id: string }) => {
        return await Meteor.callAsync("todos.remove", { _id });
    },
    onSuccess: (_result) => {
        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});

Meteor.startup(() => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Outlet />} errorElement={<ErrorPage />}>
                <Route path="/" element={<App />} />
            </Route>,
        ),
    );
    const container = document.getElementById("react-target");
    if (!container) {
        throw new Error("No react-target element found");
    }
    ReactDOM.createRoot(container).render(
        <StrictMode>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister, buster: "1.0" }}
                onSuccess={() => {
                    queryClient.resumePausedMutations().then(() => {
                        queryClient.invalidateQueries();
                    });
                }}
            >
                <RouterProvider router={router} />
                {Meteor.isDevelopment && <ReactQueryDevtools />}
            </PersistQueryClientProvider>
        </StrictMode>,
    );
});
