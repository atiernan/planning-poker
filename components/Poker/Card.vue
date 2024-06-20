<script setup lang="ts">
import { CardState } from '~/server/Poker/CardState.js';
interface PokerCardProps {
    state: CardState;
    value: string;
    size?: 'md' | 'lg';
    clickable?: boolean; 
}
const {
    value,
    size = 'md',
    clickable = false,
    state = CardState.Waiting,
} = defineProps<PokerCardProps>();
</script>

<template>
    <div
        :class="[
            'card',
            `size-${size}`,
            { clickable, picked: (state === CardState.Picked), revealed: state === CardState.Revealed }
        ]"
    >
        <div class="inner">
            <span v-if="state === CardState.Revealed">{{ value }}</span>
        </div>
    </div>
</template>

<style lang="scss">
.card {
    --color: hsl(var(--primary));

    transition: background 250ms;

    background: white;
    border-radius: 5px;
    box-shadow: 0px 0px 5px black;
    padding: 3px;

    &.clickable {
        cursor: pointer;
    }

    &.size-md {
        width: 75px;
        height: 100px;
        & .inner {
            border: 3px dashed var(--color);
        }
        & * {
            font-size: 2rem;
        }
    }

    &.size-lg {
        width: 100px;
        height: 150px;
        & * {
            font-size: 4rem;
        }
    }

    & .inner {
        border: 3px dashed var(--color);
        border-radius: 5px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &.revealed .inner {
        border: 3px solid var(--color);
    }

    &.picked {
        background: var(--color);

        & .inner{
            border: 3px solid white;
        }
    }
}
</style>