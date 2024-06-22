<script lang="ts" setup>
import type { Round } from '~/server/Poker/Round';
import { RoundState } from '~/server/Poker/RoundState';
import type { SupportedLinks } from '~/server/Poker/SupportedLinks';

interface RoundsProps {
    currentRound: number;
    isAdmin: boolean;
    rounds: Round[];
    supportedLinks: SupportedLinks;
}

const emit = defineEmits(['add-external-link']);
const { isAdmin, rounds } = defineProps<RoundsProps>();
function test(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false
}
</script>

<template>
    <div class="container123 pr-5">
        <p v-if="rounds.length === 0">No rounds yet{{ isAdmin ? ', click "Add Round" to get started' : '' }}</p>
        <Accordion type="single" class="w-full"  style="overflow-y: scroll;max-height: 100%;height: 100%;" collapsible default-value="0">
            <AccordionItem v-for="(round, index) in rounds" :key="index" :value="index.toString()">
                <AccordionTrigger>
                    <div class="w-full flex justify-between items-center mr-2">
                        Round {{ index + 1 }}
                        <Badge v-if="round.state === RoundState.Complete" class="round__status">Complete</Badge>
                        <Badge v-else-if="round.state === RoundState.Upcoming" variant="secondary" class="round__status">Incomplete</Badge>
                        <Badge v-else-if="round.state === RoundState.InProgress" variant="outline" class="round__status">In Progress</Badge>
                        <poker-round-external-links
                            :is-admin="isAdmin"
                            :round="round"
                            :supported-links="supportedLinks"
                            @add-link="(link) => emit('add-external-link', index, link)"
                        />
                        <Input placeholder="SP" class="w-10 p-1 text-center" @click="test" v-model="round.storyPoints" :disabled="!isAdmin" />
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div v-if="round.externalLinks.jira" class="jira">
                        <p class="text-xl">{{ round.externalLinks.jira.title }}</p>
                        <div class="description" v-html="round.externalLinks.jira.description"></div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<style lang="scss" scoped>
.container123 {
    max-height: 100%;
    overflow-y: hidden;
    height: 100%;

    & .header {
        display: flex;
        flex-direction: row;
        position: sticky;
        top: 0;
        background: linear-gradient(180deg, var(--color-neutral-200) 0%, var(--color-neutral-200) 71%, rgba(0,0,0,0) 100%);
        z-index: 9997;
        padding-bottom: 0.5rem;
        align-items: center;
        justify-content: space-between;
    }
}
.jira {
    & .description {
        & ol { list-style: decimal; margin-left: 1rem;}
    }
}
.controls {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
}
</style>