
declare module 'hypher' {
  
    export interface HyphenationLanguage {
        patterns: string[];

        leftmin?: number;

        /** The minimum number of characters to leave on the right side of a hyphen. */
        rightmin?: number;
    }

    /**
     * The main Hypher class. It is instantiated with a language pack.
     */
    export default class Hypher {
        /**
         * Creates a new Hypher instance.
         * @param language The language pack object containing hyphenation patterns and rules.
         */
        constructor(language: HyphenationLanguage);

        /**
         * Hyphenates a word and returns an array of its parts.
         * @param word The word to be hyphenated.
         */
        hyphenate(word: string): string[];
    }
}


/**
 * Declares the module for 'hyphenation.en-us', which provides the
 * English language pack for the Hypher library.
 */
declare module 'hyphenation.en-us' {
    /**
     * The English (US) language pack object.
     */
    const language: {
        /** An array of string-based patterns used for hyphenation rules. */
        patterns: string[];
        
        /** The minimum number of characters to leave on the left side of a hyphen. */
        leftmin?: number;
        
        /** The minimum number of characters to leave on the right side of a hyphen. */
        rightmin?: number;
    };
    
    export default language;
}