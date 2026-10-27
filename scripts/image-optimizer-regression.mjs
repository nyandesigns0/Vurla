import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";
import { resolve } from "node:path";
import test from "node:test";
import { fetchInternalImage } from "next/dist/server/image-optimizer.js";
import { serveStatic } from "next/dist/server/serve-static.js";

test(
  "an abandoned image client cannot interrupt the shared source-file response",
  { timeout: 3000 },
  async () => {
    const socket = new Socket();
    socket.destroy();
    const request = new IncomingMessage(socket);
    request.method = "GET";
    const response = new ServerResponse(request);
    const imagePath = resolve(
      "public/media/projects/baker-house/editorial-exterior.png",
    );
    const expected = await readFile(imagePath);
    const result = await fetchInternalImage(
      "/media/projects/baker-house/editorial-exterior.png",
      request,
      response,
      50_000_000,
      async (internalRequest, internalResponse) => {
        assert.equal(internalRequest.socket, socket);
        await serveStatic(internalRequest, internalResponse, imagePath);
      },
    );
    assert.deepEqual(result.buffer, expected);
    assert.equal(result.contentType, "image/png");
  },
);
