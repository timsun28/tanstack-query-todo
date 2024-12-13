import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { meteor } from "meteor-vite/plugin";
import zodernRelay from "@meteor-vite/plugin-zodern-relay";

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "classic",
        }),
        meteor({
            clientEntry: "imports/vite-entrypoint.tsx",
            serverEntry: "server/vite_main.ts",
            enableExperimentalFeatures: true,
            stubValidation: {
                warnOnly: true,
            },
            meteorStubs: {
                debug: false,
            },
        }),
        zodernRelay({
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
