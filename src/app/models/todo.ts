export interface TodoModel{
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean;
}

export type filterList = 'all' | 'active' | 'completed';
