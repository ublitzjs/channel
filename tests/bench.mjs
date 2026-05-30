import { Bench } from "tinybench"
import { EventEmitter as Tseep_ee } from "tseep"
import { EventEmitter as Node_ee } from "node:events"
import { CozyEvent } from "cozyevent"
import { Channel } from "@ublitzjs/channel"
var closure = (cb)=>cb()
function prettifyLog(task) {
  return {
    task: task.name,
    'ops/s': Math.round(task.result.throughput.mean),
    Samples: task.result.latency.samplesCount,
  }
}
closure(() => {
  console.log("1000 listeners add/remove individually")
  var tseep = new Tseep_ee();
  tseep.setMaxListeners(1001)
  var node = new Node_ee();
  node.setMaxListeners(1001)
  var my = new Channel()
  var cozy = new CozyEvent()

  var bench = new Bench({ time: 2000 });
  var arr = new Array(1000);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = () => { }
  }
  bench.add("channel (sub/unsub)", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      my.unsub(arr[i]);
    }
  }).add("channel O(1)", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub_unique(arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      my.unsub_unique(arr[i]);
    }
  }).add("tseep", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      tseep.off('foo', arr[i]);
    }
  }).add("node:events", () => {
    for (var i = 0; i < arr.length; i++) {
      node.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      node.off('foo', arr[i]);
    }
  }).add("cozy", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      cozy.off('foo', arr[i]);
    }
  }).add("channel (sub/unsub) best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      my.unsub(arr[i]);
    }
  }).add("channel O(1) best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub_unique(arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      my.unsub_unique(arr[i]);
    }
  }).add("tseep best case", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      tseep.off('foo', arr[i]);
    }
  }).add("node:events best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      node.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      node.off('foo', arr[i]);
    }
  }).add("cozy best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      cozy.off('foo', arr[i]);
    }
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("adding 10 listeners + remove individually")
  var tseep = new Tseep_ee();
  var node = new Node_ee();
  var my = new Channel()
  var cozy = new CozyEvent()
  var bench = new Bench({ time: 2000 });
  var arr = new Array(10);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = () => { }
  }
  bench.add("channel (sub/unsub)", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      my.unsub(arr[i]);
    }
  }).add("channel O(1)", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub_unique(arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      my.unsub_unique(arr[i]);
    }
  }).add("tseep", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      tseep.off('foo', arr[i]);
    }
  }).add("node:events", () => {
    for (var i = 0; i < arr.length; i++) {
      node.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      node.off('foo', arr[i]);
    }
  }).add("cozy", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.on('foo', arr[i]);
    }
    for (var i = 0; i < arr.length; i++) {
      cozy.off('foo', arr[i]);
    }
  }).add("channel (sub/unsub) best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      my.unsub(arr[i]);
    }
  }).add("channel O(1) best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub_unique(arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      my.unsub_unique(arr[i]);
    }
  }).add("tseep best case", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      tseep.off('foo', arr[i]);
    }
  }).add("node:events best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      node.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      node.off('foo', arr[i]);
    }
  }).add("cozy best-case", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.on('foo', arr[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      cozy.off('foo', arr[i]);
    }
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("creation time as of empty class")
  var bench = new Bench({ time: 1000 });
  class Empty { }
  bench.add("empty", () => {
    new Empty;
  }).add("channel", () => {
    new Channel;
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("adding 10 listeners + removeAllListeners")
  var tseep = new Tseep_ee();
  var node = new Node_ee();
  var my =  new Channel()
  var cozy = new CozyEvent()
  var bench = new Bench({ time: 1000 });
  var arr = new Array(10);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = () => { }
  }
  bench.add("tseep", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.on('foo', arr[i]);
    }
    tseep.removeAllListeners('foo')
  }).add("channel", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    my.clear()
  }).add("node:events", () => {
    for (var i = 0; i < arr.length; i++) {
      node.on('foo', arr[i]);
    }
    node.removeAllListeners('foo')
  }).add("cozy", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.on('foo', arr[i]);
    }
    cozy.removeAllListeners('foo')
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("'unrealistic' constant 'emit' with no add/remove")
  var tseep = new Tseep_ee(); tseep.on("foo", bar).on("foo", baz).on("foo", foo)
  var node = new Node_ee(); node.on("foo", bar).on("foo", baz).on("foo", foo)
  var my = new Channel(); my.sub(bar); my.sub(baz); my.sub(foo)
  var cozy = new CozyEvent(); cozy.on("foo", bar); cozy.on("foo", baz); cozy.on("foo", foo)
  var bench = new Bench({ name: "add/remove 1 listener", time: 1000 });
  function foo() {
    if (arguments.length > 100) console.log('bad');

    return 1
  }

  function bar() {
    if (arguments.length > 100) console.log('bad');

    return false;
  }

  function baz() {
    if (arguments.length > 100) console.log('bad');

    return true;
  }
  bench.add("channel", () => {
    my.pub("SOME LARGE DATA")
  }).add("tseep", () => {
    tseep.emit("foo", "SOME LARGE DATA")
  }).add("node:events", () => {
    node.emit("foo", "SOME LARGE DATA")
  }).add("cozy", () => {
    cozy.emit("foo", "SOME LARGE DATA")
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("3 constant listeners, add/remove 1 listener each '5 emit calls'")
  var tseep = new Tseep_ee(); tseep.on("foo", bar).on("foo", baz).on("foo", foo)
  var node = new Node_ee(); node.on("foo", bar).on("foo", baz).on("foo", foo)
  var my = new Channel(); my.sub(bar); my.sub(baz); my.sub(foo)
  var cozy = new CozyEvent(); cozy.on("foo", bar); cozy.on("foo", baz); cozy.on("foo", foo)
  var bench = new Bench({ name: "add/remove 1 listener", time: 1000 });

  var payload = { a: 1, b: 2, c: new Array(100).fill("x") }

  function foo(arg) {
    if (arg != payload) throw new Error("BAD")
  }
  function bar(arg) {
    if (arg != payload) throw new Error("BAD")
  }
  function baz(arg) {
    if (arg != payload) throw new Error("BAD")
  }
  function dynamic(arg) {
    if (arg != payload) throw new Error("BAD")
  }
  bench.add("channel", () => {
    my.sub(dynamic)
    my.pub(payload)
    my.pub(payload)
    my.pub(payload)
    my.pub(payload)
    my.pub(payload)
    my.unsub(dynamic)
  }).add("tseep", () => {
    tseep.on("foo", dynamic)
    tseep.emit("foo", payload)
    tseep.emit("foo", payload)
    tseep.emit("foo", payload)
    tseep.emit("foo", payload)
    tseep.emit("foo", payload)
    tseep.off("foo", dynamic)
  }).add("node:events", () => {
    node.on("foo", dynamic)
    node.emit("foo", payload)
    node.emit("foo", payload)
    node.emit("foo", payload)
    node.emit("foo", payload)
    node.emit("foo", payload)
    node.off("foo", dynamic)
  }).add("cozy", () => {
    cozy.on("foo", dynamic)
    cozy.emit("foo", payload)
    cozy.emit("foo", payload)
    cozy.emit("foo", payload)
    cozy.emit("foo", payload)
    cozy.emit("foo", payload)
    cozy.off("foo", dynamic)
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("'once' listeners (for Channel - just .clear())")
  var tseep = new Tseep_ee();
  var node = new Node_ee();
  var my = new Channel()
  var cozy = new CozyEvent()
  var bench = new Bench({ time: 1000 });
  var arr = new Array(10);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = () => { }
  }
  bench.add("tseep", () => {
    for (var i = 0; i < arr.length; i++) {
      tseep.once('foo', arr[i]);
    }
    tseep.emit('foo')
  }).add("channel", () => {
    for (var i = 0; i < arr.length; i++) {
      my.sub(arr[i]);
    }
    my.pub(undefined)
    my.clear()
  }).add("node:events", () => {
    for (var i = 0; i < arr.length; i++) {
      node.once('foo', arr[i]);
    }
    node.emit('foo')
  }).add("cozy", () => {
    for (var i = 0; i < arr.length; i++) {
      cozy.once('foo', arr[i]);
    }
    cozy.emit('foo')
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
closure(() => {
  console.log("mixed creation + listeners + emit")
  var bench = new Bench({ time: 1000 });
  var arr = new Array(3);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = () => { }
  }
  bench.add("tseep", () => {
    var tseep = new Tseep_ee;
    tseep.on("foo", arr[0])
    tseep.on("foo", arr[1])
    tseep.once("foo", arr[2])
    tseep.emit("foo")
    tseep.emit("foo")
    tseep.emit("foo")
    tseep.emit("foo")
    tseep.emit("foo")
  }).add("channel", () => {
    var my = new Channel;
    my.sub(arr[0])
    my.sub(arr[1])
    my.sub(arr[2])
    my.pub(undefined)
    my.unsub(arr[2])
    my.pub(undefined)
    my.pub(undefined)
    my.pub(undefined)
    my.pub(undefined)
  }).add("node:events", () => {
    var node = new Node_ee;
    node.on("foo", arr[0])
    node.on("foo", arr[1])
    node.once("foo", arr[2])
    node.emit("foo")
    node.emit("foo")
    node.emit("foo")
    node.emit("foo")
    node.emit("foo")
  }).add("cozy", () => {
    var cozy = new CozyEvent;
    cozy.on("foo", arr[0])
    cozy.on("foo", arr[1])
    cozy.once("foo", arr[2])
    cozy.emit("foo")
    cozy.emit("foo")
    cozy.emit("foo")
    cozy.emit("foo")
    cozy.emit("foo")
  })
  bench.runSync()
  console.table(bench.table(prettifyLog))
})
