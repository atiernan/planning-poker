<script lang="ts" setup>
import type { Round } from '~/server/Poker/Round';
import { RoundState } from '~/server/Poker/RoundState';
import { EllipsisVertical } from 'lucide-vue-next';

interface RoundsProps {
    currentRound: number;
    isAdmin: boolean;
    rounds: Round[];
}

const { isAdmin, rounds } = defineProps<RoundsProps>();
const getRelativeTime = useRelativeTime();
</script>

<template>
    <div class="container">
        <div class="header">
            <h3>Rounds</h3>
            <Button v-if="isAdmin">Add Round</Button>
        </div>
        <p v-if="rounds.length === 0">No rounds yet{{ isAdmin ? ', click "Add Round" to get started' : '' }}</p>
        <Card v-for="(round, index) in rounds" :key="index" class="mb-3">
            <CardContent class="p-2">
                <div class="round__header">
                    <p class="text-sm">{{ getRelativeTime(round.when) }}</p>
                    <Badge v-if="round.state === RoundState.Complete" class="round__status">Complete</Badge>
                    <Badge v-else-if="round.state === RoundState.Upcoming" variant="secondary" class="round__status">Incomplete</Badge>
                    <Badge v-else-if="round.state === RoundState.InProgress" variant="outline" class="round__status">In Progress</Badge>
                    <Button variant="ghost" size="icon"><EllipsisVertical class="w-4 h-4" /></Button>
                </div>
                <p>{{ round.title }}</p>
                <div class="controls">
                    <Input placeholder="SP" class="w-14 text-center" v-model="round.storyPoints" :disabled="!isAdmin" />
                    <Button v-if="isAdmin && round.state === RoundState.Complete" variant="outline">Vote Again</Button>
                    <Button v-else-if="isAdmin && round.state === RoundState.Upcoming" variant="outline">Start</Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.container {
    padding-right: 2rem;
    max-height: 100%;
    overflow-y: scroll;

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
.round {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    padding: 1rem;
    background: white;
    margin-bottom: 1rem;

    &>p {
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    &__header {
        display:flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    &__status {
        flex-basis: 50%;
        justify-content: center;
    }
}
.controls {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
}
</style>