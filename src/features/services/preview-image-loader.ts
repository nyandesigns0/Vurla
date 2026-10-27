/** Per-section cache; at most two downloads/decodes, with interaction ahead of warming. */
export function createPreviewImageLoader() {
  const cache = new Map<string, Promise<boolean>>();
  const queue: { src: string; resolve: (ready: boolean) => void }[] = [];
  const cancel = new Set<() => void>();
  let active = 0;
  let disposed = false;
  const pump = () => {
    while (!disposed && active < 2 && queue.length) {
      const job = queue.shift()!;
      active++;
      const image = new Image();
      let done = false;
      const finish = (ready: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        image.onload = image.onerror = null;
        cancel.delete(abort);
        active--;
        job.resolve(ready);
        pump();
      };
      const abort = () => { finish(false); image.src = ""; };
      const timeout = setTimeout(abort, 12000);
      cancel.add(abort);
      image.onload = async () => {
        try {
          if (image.decode) await image.decode();
          finish(true);
        } catch { finish(false); }
      };
      image.onerror = () => finish(false);
      image.src = job.src;
    }
  };
  return {
    load(src: string, priority = false) {
      if (disposed) return Promise.resolve(false);
      let promise = cache.get(src);
      if (!promise) {
        promise = new Promise<boolean>(resolve => { queue.push({ src, resolve }); });
        cache.set(src, promise);
      }
      const index = queue.findIndex(job => job.src === src);
      if (priority && index > 0) queue.unshift(queue.splice(index, 1)[0]);
      pump();
      return promise;
    },
    dispose() {
      disposed = true;
      queue.splice(0).forEach(job => job.resolve(false));
      cancel.forEach(abort => abort());
      cache.clear();
    },
  };
}
