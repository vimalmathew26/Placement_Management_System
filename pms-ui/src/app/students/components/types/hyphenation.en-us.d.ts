declare module 'hyphenation.en-us' {

    const pattern: {
        patterns: string[];

        leftmin?: number;

        rightmin?: number;
    };

    export default pattern;
}