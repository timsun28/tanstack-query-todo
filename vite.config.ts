import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { meteor } from "meteor-vite/plugin";
// import zodernRelay from "@meteor-vite/plugin-zodern-relay";
import localZodernRelay from "./vite-plugins/local-zodern-relay";


export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "classic",
        }),
        meteor({
            clientEntry: "imports/vite-entrypoint.tsx",
            stubValidation: {
                warnOnly: true,
            },
            meteorStubs: {
                debug: false,
            },
        }),
        localZodernRelay({
            directories: {
                /**
                 * Path to directories where your zodern:relay methods live
                 * @default ['./imports/methods']
                 */
                methods: ["./imports/methods"],
            },
        }),
    ],
});
