declare module 'us' {
    interface USState {
        fips: string;
        name: string;
        abbr: string;
        territory: boolean;
        contiguous: boolean;
        continental: boolean;
    }

    interface USTerritory {
        fips: string;
        name: string;
        abbr: string;
        territory: boolean;
    }

    const us: {
        states: USState[];
        territories: USTerritory[];
        [key: string]: any;
    };

    export = us;
}