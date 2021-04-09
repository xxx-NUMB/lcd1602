//% color="#794044" weight=10 icon="\uf108" block="LCD1602"
namespace LCD1602
{
    let i2cAddr: number
    let BK: number
    let RS: number

    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    function lcdcmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    function lcddat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    //% block="LcdInit $addr" addr.defl="39"  group="LCD1602显示屏"  
    export function i2cLcdInit(addr: number) {
        i2cAddr = addr
        BK = 8
        RS = 0
        lcdcmd(0x33)
        basic.pause(5)
        set(0x30)
        basic.pause(5)
        set(0x20)
        basic.pause(5)
        lcdcmd(0x28)
        lcdcmd(0x0C)
        lcdcmd(0x06)
        lcdcmd(0x01)
    }

    //% block="showchar $ch|col $x|row $y"
    export function i2cLcdShowChar(ch: string, x: number, y: number): void {
        let a: number

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        lcdcmd(a)
        lcddat(ch.charCodeAt(0))
    }

    //% block="showNumber $n|col $x|row $y" 
    export function i2cLcdShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        i2cLcdShowString(s, x, y)
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block="showString $s|col $x|row $y"
    export function i2cLcdShowString(s: string, x: number, y: number): void {
        let a: number

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        lcdcmd(a)

        for (let i = 0; i < s.length; i++) {
            lcddat(s.charCodeAt(i))
        }
    }

    //% block="lcdon"
    export function i2cLcdOn(): void {
        lcdcmd(0x0C)
    }

    //% block="lcdoff" 
    export function i2cLcdOff(): void {
        lcdcmd(0x08)
    }

    //% block="lcdclear"
    export function i2cLcdClear(): void {
        lcdcmd(0x01)
    }

    //% block="lcdlighton"
    export function i2cLcdBacklightOn(): void {
        BK = 8
        lcdcmd(0)
    }

    //% block="lcdlightoff"
    export function i2cLcdBacklightOff(): void {
        BK = 0
        lcdcmd(0)
    }
}
