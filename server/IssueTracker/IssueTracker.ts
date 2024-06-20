export interface Issue {
    id: string;
    title: string;
    description: string;
}

export interface IssueTracker {
    getIssue(id: string): Issue;
}