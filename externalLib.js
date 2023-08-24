// let's say I don't control this library

const fs = require('fs')
const plist = require('plist')

export const readFile = async (path) => {
    const file = await fs.promises.readFile(path, 'utf8')
    return plist.parse(file)
}
