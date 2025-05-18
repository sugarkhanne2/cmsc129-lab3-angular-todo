// Interface for Tasks

export interface Task {
    id?: number,
    name: string,
    dateCreated: string,
    dueDate: string,
    dueTime: string;
    isDone: boolean,
    priority: string,
}