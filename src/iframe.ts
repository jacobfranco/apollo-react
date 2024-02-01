/** ID of this iframe (given by embed.js) when embedded on a page. */
let iframeId: any;

const handleMessage = (e: MessageEvent) => {
  if (e.data?.type === 'setHeight') {
    iframeId = e.data?.id;
  }
};

window.addEventListener('message', handleMessage);

export { iframeId };