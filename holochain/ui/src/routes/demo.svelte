<script lang="ts">
  import { onMount } from 'svelte'
  import { AppWebsocket } from '@holochain/conductor-api'

  // temporary, when fixed upstream this will not be required
  // import { Buffer } from 'buffer/'
  // onMount(() => (window.Buffer = Buffer))

  onMount(demo)

  async function demo() {
    let response
    response = await call_zome_fn(8000, 'wikinodes', 'foo')
    console.log(response)
    response = await call_zome_fn(8000, 'wikinodes', 'whoami')
    console.log(response)
    // console.log(response.agent_latest_pubkey)
    // console.log(Buffer.from(response.agent_latest_pubkey).toString('base64'))
  }

  async function call_zome_fn(port: number, appid: string, fnname: string, payload = null) {
    const holochainClient = await AppWebsocket.connect('ws://localhost:' + port)
    const appInfo = await holochainClient.appInfo({
      installed_app_id: appid,
    })
    const cellId = appInfo.cell_data[0].cell_id

    // const [_, agentId] = cellId
    // console.log('agent key', arrayBufferToBase64(agentId))

    // const dnaHash = 'u' + Buffer.from(cellId[0]).toString('base64')
    // console.log('dnaHash : ', dnaHash)

    const message = await holochainClient.callZome({
      cap: null,
      cell_id: cellId,
      zome_name: 'wikinodes',
      fn_name: fnname,
      provenance: cellId[1],
      payload: payload,
    })

    // console.log(message)
    // console.log(message.toString('utf8'))
    return message
    // } catch (error) {
    //   return error;
    // }
  }

  // function arrayBufferTostring(arrayBuffer) {
  //   if (!('TextDecoder' in window)) {
  //     throw new Error('Sorry, this browser does not support TextDecoder...')
  //   }

  //   const decoder = new TextDecoder('utf-8')
  //   return decoder.decode(arrayBuffer)
  // }

  // function arrayBufferToBase64(buffer) {
  //   let binary = ''
  //   const bytes = new Uint8Array(buffer)
  //   const len = bytes.byteLength
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i])
  //   }
  //   return window.btoa(binary)
  // }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
