import { Meteor } from "meteor/meteor";
import { TodosCollection } from "/imports/api/todos";
import { WebAppInternals } from "meteor/webapp";
import { getConfig } from "meteor/jorgenvatle:vite-bundler/loading/vite-connection-handler";

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

/**
 * Inject React Refresh snippet into HTML served by Meteor in development mode.
 * Without this snippet, React HMR will not work with Meteor-Vite.
 *
 * {@link https://github.com/JorgenVatle/meteor-vite/issues/29}
 * {@link https://github.com/vitejs/vite-plugin-react/issues/11#discussion_r430879201}
 */
if (Meteor.isDevelopment) {
    WebAppInternals.registerBoilerplateDataCallback(
        "react-preamble",
        async (request, data) => {
            const { host, port } = await getConfig();
            data.dynamicHead = data.dynamicHead || "";
            data.dynamicHead += `
<script type="module">
  import RefreshRuntime from "http://${host}:${port}/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
    `;
        },
    );
}
