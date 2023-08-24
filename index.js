//@ts-check
// required for util (used by promisify) to work
// globalThis.process = require('process')
global = globalThis
const browserfs = require('browserfs')
const { promisify } = require('util')

const fs = require('fs')

browserfs.install(window)

// todo migrate from input to showdirectorypicker + FileSystemAccess
browserfs.configure({
  fs: 'LocalStorage',
  options: {
  },
}, (e) => {
  if (e) throw e
})

const {readFile} = require('./externalLib')

//@ts-ignore
fs.promises = new Proxy(Object.fromEntries(['readFile', 'writeFile', 'stat', 'mkdir'].map(key => [key, promisify(fs[key])])), {
  get (target, p, receiver) {
    //@ts-ignore
    if (!target[p]) throw new Error(`Not implemented fs.promises.${p}`)
    return (...args) => {
      // browser fs bug: if path doesn't start with / dirname will return . which would cause infinite loop, so we need to normalize paths
      if (typeof args[0] === 'string' && !args[0].startsWith('/')) args[0] = '/' + args[0]
      //@ts-ignore
      return target[p](...args)
    }
  }
})
// though open is not used here. originally added for https://github.com/PrismarineJS/prismarine-provider-anvil/blob/main/src/region.js#L35C28-L35C32 in https://github.com/zardoy/prismarine-web-client
//@ts-ignore
fs.promises.open = async (...args) => {
  //@ts-ignore
  const fd = await promisify(fs.open)(...args)
  return Object.fromEntries(['read', 'write', 'close'].map(x => [x, async (...args) => {
    return await new Promise(resolve => {
      fs[x](fd, ...args, (err, bytesRead, buffer) => {
        if (err) throw err
        // for some backends (eg for sync) doing this would be fine
        // if (x === 'write') {
        //   fs.fsync(fd, () => { })
        // }
        resolve({ buffer, bytesRead })
      })
    })
  }]))
}

input.onchange = async (e) => {
  /** @type {HTMLInputElement} */
  const target = e.target
  //@ts-ignore
  const file = target.files[0]
  const path = '/test'
  await fs.promises.writeFile(path, Buffer.from(await file.arrayBuffer()))

  const data = await readFile(path)
  console.log(data)
}
