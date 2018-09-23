var multipleFunctionInvocation = require('../../functions/shared/patches/cloudFunction/multipleFunctionInvocation')
let v = []
let id = 1
while (1) {
  if (multipleFunctionInvocation.isAlreadyRunning(v, id)) {
    id = id + 1
    console.log(id, v)
  }
  else {
    multipleFunctionInvocation.markAsRunning(v, id)
    console.log(v ,id )
  }
}
