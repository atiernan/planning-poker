import type { IssueTracker, Issue } from './IssueTracker';
import { Version3Client } from 'jira.js';

let client: null | Version3Client = null;

if (process.env.JIRA_HOST && process.env.JIRA_EMAIL && process.env.JIRA_TOKEN) {
    client = new Version3Client({
        host: process.env.JIRA_HOST,
        authentication: {
          basic: {
            email: process.env.JIRA_EMAIL,
            apiToken: process.env.JIRA_TOKEN,
          },
        },
    });
}

export class Jira implements IssueTracker {
    getIssue(id: string): Issue {
        this.clientExists();
        return { id, title: '', description: ''};
    }

    private clientExists() {
        if (client === null) {
            throw new Error('Jira client doesn\'t exist');
        }
    }
}
