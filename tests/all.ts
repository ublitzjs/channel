import {expect, it, describe} from "vitest"
import {expectError, expectType} from "tsd"
import type {Channel as ChannelType} from "@ublitzjs/channel"
var runningTsd: boolean = false;

export function testChannel(module: typeof import("@ublitzjs/channel")) {
  var Channel = module.Channel
  describe("Channel", () => {
    describe("at least", () => {
      it("is typed", () => {
        if (runningTsd) {
          type MessageT = { msg: string }
          let ch = new Channel<MessageT>()
          let cb = (data: string) => { data; }
          expectError(ch.sub(cb))
          var goodCb = (data: MessageT) => { data; }
          ch.sub(goodCb)
          expectError(ch.unsub(cb))
          ch.unsub(goodCb)
          expectError(ch.pub(""))
          ch.pub({ msg: "" })
        }
      })
      var ch = new Channel<number>;
      let cb1X = 0;
      let cb2X = 0;
      let cb3X = 0;
      let cb1 = (i: number) => { cb1X += i }
      let cb2 = (i: number) => { cb2X += i }
      let cb3 = (i: number) => { cb3X += i }
      function regAll() { ch.sub_unique(cb1); ch.sub_unique(cb2); ch.sub_unique(cb3); }

      it("tells if is empty", ()=>{
        expect(ch.isEmpty).toBe(true)
        ch.sub_unique(cb1)
        expect(ch.isEmpty).toBe(false)
        ch.unsub_unique(cb1)
        expect(ch.isEmpty).toBe(true)
        ch.sub(cb1)
        expect(ch.isEmpty).toBe(false)
        ch.unsub(cb1)
        expect(ch.isEmpty).toBe(true)
      })
      it("publishes messages repeatedly", () => {
        regAll()
        ch.pub(10); expect([cb1X, cb2X, cb3X]).toEqual([10, 10, 10])
        ch.pub(10); expect([cb1X, cb2X, cb3X]).toEqual([20, 20, 20])
      })
      it("removes listeners individually", () => {
        expect((cb1 as any).id).toBe(0)
        expect((cb2 as any).id).toBe(1)
        expect((cb3 as any).id).toBe(2)
        ch.unsub_unique(cb2); ch.unsub_unique(cb1); ch.unsub_unique(cb3);
        ch.pub(10); expect([cb1X, cb2X, cb3X]).toEqual([20, 20, 20])
      })
      it("removes all listeners", () => {
        regAll(); ch.clear();
        ch.pub(10); expect([cb1X, cb2X, cb3X]).toEqual([20, 20, 20])
      })
      it("has 'self-deleting' listeners (once)", () => {
        ch.sub_unique(cb1); function once(i: number) {cb2X+=i; ch.unsubCurrent();}; ch.sub_unique(once)
        ch.pub(10); expect([cb1X, cb2X]).toEqual([30, 30])
        ch.pub(10); expect([cb1X, cb2X]).toEqual([40, 30])
      })
      it("has standard functionality for repeated listeners", ()=>{
        ch.clear();
        cb1X = 0

        ch.sub(cb1); ch.sub(cb1);
        ch.pub(10);
        expect(cb1X).toBe(20);

        ch.unsub(cb1)
        ch.pub(10);
        console.log("EMPTY", ch.isEmpty);
        expect(cb1X).toBe(30);

        ch.unsub(cb1)
        ch.pub(10);
        expect(cb1X).toBe(30);
      })
    })
  })
  describe("ChannelMap", ()=>{
    var map = new module.ChannelMap<{"a": number}>();
    it("has typed 'on' method", ()=>{
      if(runningTsd) {
        expectError(map.on("b"))
        var channel = map.on("a")
        expectType<ChannelType<number>>(channel)
      }
    })
  })
}
