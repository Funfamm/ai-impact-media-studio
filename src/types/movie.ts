export interface Movie {
    id: string;
    title: string;
    description: string;
    genre: string;
    year: string;
    duration: string;
    posterUrl: string;
    trailerUrl: string;
    videoUrl?: string;
    publishLocations: {
        home: boolean;
        movies: boolean;
    };
    status: 'Draft' | 'Published' | 'Scheduled';
    views?: string;
}
