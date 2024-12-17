import pc2 from "picocolors";
import { inspect } from "util";
import { inspect as inspect$1 } from "node:util";
import { createMethod } from "meteor/zodern:relay";
import { Mongo } from "meteor/mongo";
import { z } from "zod";
var PackageStub$1 = Package?.["webapp"] || {};
var WebApp = PackageStub$1.WebApp || globalThis.WebApp;
var WebAppInternals = PackageStub$1.WebAppInternals || globalThis.WebAppInternals;
var package_default = {
  name: "meteor-vite",
  version: "3.1.2",
  description: "",
  files: [
    "dist"
  ],
  main: "",
  exports: {
    "./plugin": {
      types: "./dist/plugin/index.d.ts",
      import: [
        "./dist/plugin/index.mjs"
      ],
      require: [
        "./dist/plugin/index.js"
      ]
    },
    "./bootstrap/scripts": {
      types: "./dist/bootstrap/scripts/index.d.ts",
      import: "./dist/bootstrap/scripts/index.mjs"
    },
    "./bootstrap/*": {
      types: "./dist/bootstrap/*.d.ts",
      import: "./dist/bootstrap/*.mjs"
    },
    "./client": {
      types: "./dist/client/index.d.ts",
      import: "./dist/client/index.mjs"
    }
  },
  scripts: {
    start: "ts-node-dev src/bin/debug/watch-mocks.ts",
    watch: "tsup --watch --dts --sourcemap",
    build: "rm -rf ./dist && tsup",
    prepack: "npm run build",
    test: "vitest",
    lint: "tsc --noEmit"
  },
  keywords: [
    "meteor",
    "vite"
  ],
  engines: {
    node: ">=20.0.0"
  },
  author: "",
  bugs: {
    url: "https://github.com/JorgenVatle/meteor-vite/issues"
  },
  homepage: "https://github.com/JorgenVatle/meteor-vite",
  license: "ISC",
  dependencies: {
    "@babel/parser": "^7.22.5",
    "@babel/traverse": "^7.22.5",
    execa: "^9.5.1",
    "p-limit": "^3.1.0",
    picocolors: "^1.0.0",
    semver: "^7.6.3"
  },
  devDependencies: {
    "@babel/generator": "^7.23.6",
    "@babel/types": "^7.22.5",
    "@types/babel__generator": "^7.6.8",
    "@types/meteor": "^2.9.8",
    "@types/node": "^20.3.3",
    "@types/semver": "^7.5.8",
    tsup: "^8.3.5",
    typescript: "^5.1.6",
    vite: "^6.0.0",
    vitest: "^2.1.6"
  },
  peerDependencies: {
    vite: "^6.0.0"
  }
};
var PackageStub = Package?.["meteor"] || {};
var Meteor = PackageStub.Meteor || globalThis.Meteor;
var divColor = (text) => pc2.dim(text);
var MeteorViteError = class extends Error {
  constructor(originalMessage, { cause, context, package: meteorPackage, subtitle } = {}) {
    super(originalMessage);
    this.originalMessage = originalMessage;
    this.subtitle = subtitle;
    this.cause = cause;
    this.context = context;
    this.package = meteorPackage;
    if (cause instanceof Error && !subtitle) {
      this.subtitle = `Caused by [${cause?.name}] ${cause?.message}`;
    }
    if (cause) {
      this.addSection("Caused by", cause);
    }
  }
  package;
  context;
  cause;
  subtitle;
  metadataLines = [];
  addLine(...lines) {
    if (Array.isArray(lines[0])) {
      lines = lines[0];
    }
    const whitespace = "  ";
    this.metadataLines.push(`${whitespace}${lines.join(whitespace)}`);
  }
  setContext(loadRequest) {
    this.context = loadRequest.context;
  }
  async formatLog() {
  }
  addSection(title, object) {
    const content = inspect(object, { colors: true });
    const divider = this.titleDivider({
      title: `[${title}]`,
      indent: 2
    });
    this.addLine(divider);
    content.split(/[\r\n]+/).forEach((line) => {
      this.addLine(`${divColor("|")}  ${line}`);
    });
  }
  titleDivider({
    title = "",
    addLength = 0,
    divider = "-",
    indent = 0
  }) {
    divider = divColor(divider);
    let repeatCount = 85 - title.length + addLength - indent;
    if (repeatCount < 1) {
      return title;
    }
    return `${divider.repeat(indent)}${title}${divider.repeat(repeatCount)}`;
  }
  async beautify() {
    await this.formatLog();
    const moduleId = this.context?.id.replace("meteor/", "") || this.package?.packageId;
    const moduleString = moduleId && pc2.yellow(`
⚡   <${moduleId}>`) || "";
    this.name = `

${this.titleDivider({
      title: `[${this.constructor.name}]`,
      divider: "_",
      indent: 6
    })}${moduleString}`;
    this.message = [
      "",
      "",
      `${pc2.bgRed(pc2.bold(" ERROR "))} ${this.message}`,
      `${pc2.dim(this.subtitle)}`,
      "",
      ...this.metadataLines,
      this.titleDivider({
        title: "[Error Stack]",
        indent: 2
      })
    ].filter((line, index) => {
      if (typeof line !== "string") {
        return false;
      }
      if (index === 1 && !this.subtitle) {
        return false;
      }
      return true;
    }).join("\n");
    const endOfLog = this.titleDivider({ divider: "_" });
    const reportIssue = ` 🐛  Report an issue:
  -  ${package_default.bugs.url}`;
    this.stack = `${this.stack}

${reportIssue}
${endOfLog}
`;
    if (!this.cause) {
      this.clearProperties(["cause"]);
    }
    this.clearProperties([
      "subtitle",
      "originalMessage",
      "package",
      "context",
      "metadataLines"
    ]);
  }
  clearProperties(keys) {
    keys.forEach((key) => delete this[key]);
  }
};
function createLogger(formatter) {
  return {
    info: (...params) => console.log(...formatMessage(formatter(...params))),
    warn: (...params) => console.warn(...formatMessage(formatter(...params))),
    error: (...params) => console.error(...formatMessage(formatter(...params))),
    debug: (...params) => process.env.ENABLE_DEBUG_LOGS && console.debug(
      ...formatMessage(formatter(...params)).map((field) => typeof field === "string" ? pc2.dim(field) : field)
    )
  };
}
function formatMessage([message, ...params]) {
  if (message instanceof MeteorViteError) {
    message.beautify().then(() => console.warn(message, ...params));
    return [];
  }
  if (typeof message === "string") {
    return [`⚡  ${message}`, ...params];
  }
  return [message, ...params];
}
var Logger_default = createLogger((...params) => params);
function createSimpleLogger(label) {
  const log = (log2, colorize) => {
    return (...params) => log2(`⚡  ${label} ${colorize("%s")}`, ...params);
  };
  return {
    info: log(console.info, pc2.blue),
    success: log(console.info, pc2.green),
    error: log(console.error, pc2.red),
    warn: log(console.warn, pc2.yellow),
    debug: log(
      process.env.ENABLE_DEBUG_LOGS ? console.debug : () => {
      },
      pc2.dim
    )
  };
}
var ViteBoilerplate = class {
};
var ViteProductionBoilerplate = class extends ViteBoilerplate {
  constructor(viteManifest) {
    Meteor.settings.vite = { manifest: viteManifest };
    super();
    this.viteManifest = viteManifest;
    this.logger = createSimpleLogger("HTML Boilerplate");
  }
  logger;
  get assetDir() {
    return "/" + this.viteManifest.assetsDir.replace(/^\/+/, "");
  }
  get baseUrl() {
    return this.viteManifest.base;
  }
  filePath(file) {
    return `${this.baseUrl.replace(/\/?$/, "")}/${file}`;
  }
  getBoilerplate() {
    return {
      dynamicHead: this.dynamicHead,
      dynamicBody: ""
    };
  }
  /**
   * Mark assets built by Vite as cacheable in Meteor's program.json file for both legacy and modern browsers.
   * Because of the way Meteor handles non-cacheable assets, headers are added that make it tricky to cache with
   * a standard reverse proxy config. You would have to explicitly override the caching headers for all files served
   * by meteor at /vite-assets.
   *
   * The default behavior of Meteor would be to set a max-age header of 0. Which would of course result in a lot of
   * load being put on both your clients and your server.
   */
  makeViteAssetsCacheable() {
    const archs = ["web.browser", "web.browser.legacy"];
    let cacheable = 0;
    for (const arch of archs) {
      const files = WebAppInternals.staticFilesByArch[arch] || {};
      Object.entries(files).forEach(([path, file]) => {
        if (!path.startsWith(`${this.assetDir}/`)) {
          this.logger.debug(`Not a Vite asset: ${path}`);
          return;
        }
        if (path.endsWith(".js")) {
          file.cacheable = true;
        }
        if (path.endsWith(".css")) {
          file.cacheable = true;
        }
        this.logger.debug(`Marked as cacheable: ${path}`);
        cacheable++;
      });
    }
    if (cacheable <= 0) {
      this.logger.warn("Found no Vite assets in Meteor client program manifest.");
      this.logger.warn("Static files served by Meteor have caching disabled by default, we were unable to override this setting.");
    }
    this.logger.info(`Marked ${cacheable.toLocaleString()} static Vite assets as cacheable`);
  }
  get dynamicHead() {
    const imports = this.imports;
    const lines = [];
    const prefetchArray = [];
    for (const file of imports.stylesheets) {
      lines.push(`<link rel="stylesheet" crossorigin href="${this.filePath(file)}">`);
    }
    for (const file of imports.modules) {
      lines.push(`<script type="module" crossorigin src="${this.filePath(file)}"><\/script>`);
    }
    for (const file of imports.modulePreload) {
      lines.push(`<link rel="modulepreload" crossorigin href="${this.filePath(file)}">`);
    }
    for (const file of imports.moduleLazyPrefetch) {
      prefetchArray.push({
        href: this.filePath(file)
      });
    }
    for (const file of imports.cssLazyPrefetch) {
      prefetchArray.push({
        href: this.filePath(file),
        as: "style"
      });
    }
    function lazyPrefetch(assets) {
      window.addEventListener("load", () => window.setTimeout(() => {
        const makeLink = (asset) => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.fetchPriority = "low";
          Object.entries(asset).forEach(([key, value]) => {
            link.setAttribute(key, value);
          });
          return link;
        };
        const loadNext = (assets2, count) => window.setTimeout(() => {
          if (count > assets2.length) {
            count = assets2.length;
            if (count === 0) {
              return;
            }
          }
          const fragment = new DocumentFragment();
          while (count > 0) {
            const asset = assets2.shift();
            if (!asset) {
              break;
            }
            const link = makeLink(asset);
            fragment.append(link);
            count--;
            if (assets2.length) {
              link.onload = () => loadNext(assets2, 1);
              link.onerror = () => loadNext(assets2, 1);
            }
          }
          document.head.append(fragment);
        });
        loadNext(assets, 3);
      }));
    }
    if (!process.env.DISABLE_FULL_APP_PREFETCH) {
      lines.push(
        `<script type="text/javascript">`,
        `${lazyPrefetch.toString()};`,
        `lazyPrefetch(${JSON.stringify(prefetchArray)})`,
        `<\/script>`
      );
    }
    return lines.join("\n");
  }
  get imports() {
    if (Meteor.settings.vite?.imports) {
      return Meteor.settings.vite.imports;
    }
    const manifest = this.viteManifest;
    const stylesheets = /* @__PURE__ */ new Set();
    const modules = /* @__PURE__ */ new Set();
    const modulePreload = /* @__PURE__ */ new Set();
    const moduleLazyPrefetch = /* @__PURE__ */ new Set();
    const cssLazyPrefetch = /* @__PURE__ */ new Set();
    function preloadImports(imports2) {
      for (const path of imports2) {
        const chunk = manifest.files[path];
        if (!chunk) {
          continue;
        }
        if (modulePreload.has(chunk.file)) {
          continue;
        }
        moduleLazyPrefetch.delete(chunk.file);
        modulePreload.add(chunk.file);
        chunk.css?.forEach((css) => stylesheets.add(css));
        preloadImports(chunk.imports || []);
      }
    }
    for (const [name, chunk] of Object.entries(manifest.files)) {
      if (!chunk.isEntry) {
        if (chunk.file.endsWith(".js")) {
          moduleLazyPrefetch.add(chunk.file);
        }
        if (chunk.file.endsWith(".css")) {
          cssLazyPrefetch.add(chunk.file);
        }
        continue;
      }
      if (chunk.file.endsWith(".js")) {
        moduleLazyPrefetch.delete(chunk.file);
        modules.add(chunk.file);
      }
      if (chunk.file.endsWith(".css")) {
        stylesheets.add(chunk.file);
      }
      preloadImports(chunk.imports || []);
      chunk.css?.forEach((css) => {
        stylesheets.add(css);
        cssLazyPrefetch.delete(css);
      });
    }
    const imports = {
      stylesheets,
      modules,
      modulePreload,
      moduleLazyPrefetch,
      cssLazyPrefetch
    };
    Logger_default.debug("Parsed Vite manifest imports", inspect$1({
      imports,
      manifest,
      modules
    }, { depth: 4, colors: true }));
    Object.assign(Meteor.settings.vite, { imports });
    return imports;
  }
};
Meteor.startup(async () => {
  if (!Meteor.isProduction) {
    return;
  }
  console.log("[Vite] Fetching manifest...");
  const manifest = await Assets.getTextAsync("vite/client.manifest.json");
  const files = JSON.parse(manifest);
  const boilerplate = new ViteProductionBoilerplate({
    base: "/vite",
    assetsDir: "vite",
    files
  });
  WebApp.handlers.use(boilerplate.baseUrl, (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/plain");
    res.writeHead(404, "Not found");
    res.write("Vite asset not found");
    res.end();
    Logger_default.warn(`Served 404 for unknown Vite asset: ${req.originalUrl}`);
  });
  boilerplate.makeViteAssetsCacheable();
  WebAppInternals.registerBoilerplateDataCallback("vite", async (req, data) => {
    try {
      const { dynamicBody, dynamicHead } = boilerplate.getBoilerplate();
      if (dynamicHead) {
        data.dynamicHead = `${data.dynamicHead || ""}
${dynamicHead}`;
      }
      if (dynamicBody) {
        data.dynamicBody = `${data.dynamicBody || ""}
${dynamicBody}`;
      }
    } catch (error) {
      console.warn(error);
      throw error;
    }
  });
});
const NewTodoSchema = z.object({
  title: z.string(),
  done: z.boolean()
});
const TodoSchema = NewTodoSchema.extend({
  _id: z.string(),
  createdAt: z.date()
});
const TodosCollection = new Mongo.Collection("todos");
createMethod({
  name: "todos.get.all",
  schema: z.object({}),
  async run() {
    const todos = await TodosCollection.find().fetchAsync();
    console.log({
      todos
    });
    return todos;
  }
});
createMethod({
  name: "todos.insert",
  schema: z.object({
    newTodo: TodoSchema
  }),
  async run({
    newTodo
  }) {
    console.log({
      newTodo
    });
    const test = {
      _id: "123",
      title: "test",
      done: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    console.log({
      test
    });
    return await TodosCollection.insertAsync({
      _id: newTodo._id,
      title: newTodo.title,
      done: false,
      createdAt: /* @__PURE__ */ new Date()
    });
  }
});
createMethod({
  name: "todos.finish",
  schema: z.object({
    _id: z.string(),
    done: z.boolean()
  }),
  async run({
    _id,
    done
  }) {
    await TodosCollection.updateAsync({
      _id
    }, {
      $set: {
        done
      }
    });
  }
});
createMethod({
  name: "todos.remove",
  schema: z.object({
    _id: z.string()
  }),
  async run({
    _id
  }) {
    await TodosCollection.removeAsync({
      _id
    });
  }
});
//# sourceMappingURL=main-B8MSbZQ6.entry.js.map
