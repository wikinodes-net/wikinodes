addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello tree of life!', {
    headers: { 'content-type': 'text/plain' },
  })
}
