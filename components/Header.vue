<script setup lang="ts">
import { CircleUser, User } from 'lucide-vue-next';
import { usePokerStore } from '../stores/poker';
import { storeToRefs } from 'pinia';
import { UserType } from '~/server/Poker/UserType';

const store = usePokerStore();
const { name, userType } = storeToRefs(store);

const toggleUserMode = () => {
    userType.value = userType.value === UserType.Player ? UserType.Observer : UserType.Player;
}
</script>

<template>
    <header>
        <NuxtLink class="brand" to="/">Planning Poker</NuxtLink>

        <DropdownMenu>
            <DropdownMenuTrigger class="ml-auto"><CircleUser /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem v-if="userType === UserType.Observer" @click="toggleUserMode">Switch to Player</DropdownMenuItem>
                <DropdownMenuItem v-if="userType === UserType.Player" @click="toggleUserMode">Switch to Observer</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
    </header>
</template>

<style lang="scss">
header {
    @apply flex;
    @apply py-3;
    @apply px-4;
    @apply bg-primary;
    @apply text-white;

    .brand {
        @apply text-lg;
    }
}
</style>