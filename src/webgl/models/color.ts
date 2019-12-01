export class Color {
    channels: [ number, number, number, number ];

    constructor();
    constructor(red: number, green: number, blue: number, alpha?: number);
    constructor(hex: number, alpha?: number);
    constructor(rgba: number[]);

    constructor(...rgba) {
        const channelsFromArray = (rgba: number[]) => {
            this.channels = [
                typeof rgba[0] === "number" ? rgba[0] / 255 : 0,
                typeof rgba[1] === "number" ? rgba[1] / 255 : 0,
                typeof rgba[2] === "number" ? rgba[2] / 255 : 0,
                typeof rgba[3] === "number" ? rgba[3] : 1,
            ];
        };

        if (typeof rgba[0] != "number") {
            // constructor(number[])
            channelsFromArray(rgba[0]);
        } else if (rgba.length < 3) {
            // constructor(hex, alpha?)

            const hex = rgba[0];

            // noinspection PointlessArithmeticExpressionJS
            channelsFromArray([
                hex >> 8 * 2 & 0xff,
                hex >> 8 * 1 & 0xff,
                hex >> 8 * 0 & 0xff,
                rgba[1],
            ]);
        } else {
            // constructor(r, g, b, a)
            channelsFromArray(rgba);
        }
    }

    get red() { return this.channels[0]; }

    set red(value: number) { this.channels[0] = value; }

    get blue() { return this.channels[1]; }

    set blue(value: number) { this.channels[1] = value; }

    get green() { return this.channels[2]; }

    set green(value: number) { this.channels[2] = value; }

    get alpha() { return this.channels[3]; }

    set alpha(value: number) { this.channels[3] = value; }
}

export namespace Color {
    export const BLACK = new Color(0x000000);
    export const WHITE = new Color(0xffffff);
}
