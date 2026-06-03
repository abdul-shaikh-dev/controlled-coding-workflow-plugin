import { createServer } from "vite";

const server = await createServer({
  root: process.cwd(),
  clearScreen: false,
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();

process.stdin.resume();
setInterval(() => {}, 1 << 30);
