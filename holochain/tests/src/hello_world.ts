const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms))

import { InstallAgentApp, _log } from './common'

module.exports = async (orchestrator) => {
  orchestrator.registerScenario('Who am I', async (s, t) => {
    const alice_cell = await InstallAgentApp(s, 'alice-cell')

    let hello_world_result = await alice_cell.call('wikinodes', 'hello_world', {
      content: 'Hello to Holochain',
    })

    _log('Hello World Result', hello_world_result)

    t.deepEqual(hello_world_result.data, 'Hello to Holochain')

    await sleep(10)
  })
}
