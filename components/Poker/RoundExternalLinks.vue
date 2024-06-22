<script lang="ts" setup>
import { SquareArrowOutUpRight } from 'lucide-vue-next';
import type { Round } from '~/server/Poker/Round';
import type { SupportedLinks } from '~/server/Poker/SupportedLinks';

interface RoundExternalLinksProps {
    round: Round;
    supportedLinks: SupportedLinks;
    isAdmin: boolean;
}

const emit = defineEmits(['add-link']);
const showJiraDialog = ref(false);
function onJiraTicketDialogToggled(newValue: boolean) {
    if (!newValue) {
        showJiraDialog.value = false;
    }
}

function onClickJira(e: MouseEvent) {
    e.stopImmediatePropagation();
    if (props.round.externalLinks.jira === undefined) {
        showJiraDialog.value = true;
    } else if (props.supportedLinks.jira !== undefined) {
        window.open(props.round.externalLinks.jira.link, '__blank');
    }
    return false;
}

function onJiraAdd(ticketId: string) {
    emit('add-link', { jira: ticketId });
    showJiraDialog.value = false;
}

const props = defineProps<RoundExternalLinksProps>();
</script>

<template>
    <poker-jira-ticket-dialog :open="showJiraDialog" @update:open="onJiraTicketDialogToggled" @submit="onJiraAdd" />
    <Badge
        v-if="supportedLinks.jira !== undefined && (isAdmin || round.externalLinks.jira !== undefined)"
        variant="secondary"
        @click="onClickJira"
    >
        <template v-if="round.externalLinks.jira !== undefined">
            {{ round.externalLinks.jira.id }} <SquareArrowOutUpRight class="ml-2 w-3 h-3" />
        </template>
        <template v-else>
            Add Jira
        </template>
    </Badge>
</template>