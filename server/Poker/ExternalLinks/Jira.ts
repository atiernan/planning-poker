import { Document } from "jira.js/out/version3/models";
import { JiraTicket } from "../JiraTicket";
import { Version3Client } from 'jira.js';

let client: Version3Client | null = null;
if (getJiraHost() !== undefined) {
    client = new Version3Client({
      host: getJiraHost(),
      authentication: {
        basic: {
          email: getJiraEmail(),
          apiToken: getJiraToken(),
        },
      },
    });
}

export async function getJiraTicket(ticketId: string): Promise<JiraTicket> {
    if (client === null) {
        throw new Error('Coult not connect to Jira: no client setup');
    }
    const issue = await client.issues.getIssue({ issueIdOrKey: ticketId });
    return {
        id: ticketId,
        link: getJiraHost() + `/browse/${ticketId}`,
        title: issue.fields.summary,
        description: issue.fields.description ? jiraDocumentToHtml(issue.fields.description) : '',
    }
}

function getJiraHost() {
    return process.env.JIRA_HOST as string;
}

function getJiraEmail() {
    return process.env.JIRA_EMAIL as string;
}

function getJiraToken() {
    return process.env.JIRA_TOKEN as string;
}

export function jiraDocumentToHtml(document: Omit<Document, 'version'>): string {
    switch (document.type) {
        case 'text':
            return document.text as string;
        case 'orderedList':
            return '<ol>' + document.content?.map(jiraDocumentToHtml).join('') + '</ol>';
            case 'unorderedList':
                return '<ul>' + document.content?.map(jiraDocumentToHtml).join('') + '</ul>';
        case 'listItem':
            return '<li>' + document.content?.map(jiraDocumentToHtml).join('') + '</li>';
        case 'paragraph':
            return '<p>' + document.content?.map(jiraDocumentToHtml).join('') + '</p>';
        case 'doc':
            return document.content?.map(jiraDocumentToHtml).join('') ?? '';
    }
    return '';
}