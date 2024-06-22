<script setup lang="ts">
import { usePokerStore } from '../../stores/poker';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { usePokerSocket } from '../../composables/usePokerSocket';
import { onMounted, ref, nextTick } from 'vue';
import { CardState } from '../../server/Poker/CardState';
import type { User } from '~/server/Poker/User';
import { Mode } from '~/server/Poker/Mode';
import { UserType } from '~/server/Poker/UserType';
import { Button } from '@/components/ui/button';
import { Crown, Eye, Settings, ChevronLast } from 'lucide-vue-next';

useHead({
  title: 'Planning Poker',
})

const pokerStore = usePokerStore();
const { name, userType } = storeToRefs(pokerStore);
const route = useRoute();
let { id } = route.params;
if (Array.isArray(id)) {
    id = id[0];
}

const {
    joinRoom,
    room,
    estimate,
    isAdmin,
    reveal,
    nextRound,
    selectedEstimate,
    connected,
    updateRoomSettings,
    updateUserSettings,
    addExternalLink,
} = usePokerSocket(id);
const showSettings = ref(false);

const playingUsers = computed(() => room.value?.users.filter((u) => u.type === UserType.Player) ?? []);
const observingUsers = computed(() => room.value?.users.filter((u) => u.type === UserType.Observer) ?? []);
const allPlayersEstimated = computed(() => {
    const estimatedPlayers = playingUsers.value
        .map((user) => room.value?.rounds[room.value.currentRound].estimates[user.id]?.estimate !== undefined)
        .filter(Boolean);
    return estimatedPlayers.length === playingUsers.value.length && playingUsers.value.length > 0;
});

onMounted(() => {
    if (name.value !== '') {
        nextTick(() => joinRoom(name.value, userType.value));
    }
});

watch([name, userType], ([newName, newType]) => {
    updateUserSettings(newName, newType);
});

function selectEstimate(value: string) {
    estimate(value);
}

function getUserEstimate(userId: string) {
    if (room.value?.rounds === undefined) {
        return '';
    }
    return room.value.rounds[room.value.currentRound].estimates[userId]?.estimate ?? '';
}

function join(newName: string, newUserType: UserType) {
    name.value = newName;
    userType.value = newUserType;
    joinRoom(newName, newUserType);
}

function getUsersCardState(user: User) {
    if (room.value?.reveal === true) {
        return CardState.Revealed;
    }

    if (getUserEstimate(user.id) !== '') {
        return CardState.Picked;
    }

    return CardState.Waiting;
}

function saveSettings({ admin, possibleEstimates, mode }: { admin: string, possibleEstimates: string[], mode: Mode }) {
    updateRoomSettings(admin, possibleEstimates, mode);
}

</script>

<template>
    <poker-settings-dialog
        :open="showSettings"
        :admin="room?.admin ?? ''"
        :users="room?.users ?? []"
        :possible-estimates="room?.possibleEstimates ?? []"
        :mode="room?.mode ?? Mode.Simple"
        @close="showSettings = false"
        @save="saveSettings"
    />
    <poker-join-room-dialog
        :open="connected && name === ''"
        @join="join"
    />
    <div class="room pt-2" v-if="room !== null">
        <div :class="['game-state', { 'mode-simple': room.mode === Mode.Simple, 'has-observers': observingUsers.length > 0 }]">
            <div v-if="observingUsers.length > 0" class="user-lists">
                <h2>Observers</h2>
                <ul class="observers">
                    <li v-for="observer of observingUsers" :key="observer.id" class="observer">
                        {{ observer.name }}
                        <Crown v-if="observer.id === room.admin"/>
                    </li>
                </ul>
            </div>
            <div>
                <ul class="estimations">
                    <p v-if="playingUsers.length === 0">No players yet</p>
                    <li v-for="user of playingUsers" :key="user.id" class="estimation">
                        <Crown v-if="user.id === room.admin" class="mb-2"/>
                        <poker-card
                            :value="getUserEstimate(user.id)"
                            :picked="getUserEstimate(user.id) !== ''"
                            :revealed="room.reveal"
                            size="lg"
                            :style="{marginTop: room.admin === user.id ? '0' : '30px'}"
                            :state="getUsersCardState(user)"
                        />
                        <span class="name">{{ user.name }}</span>
                    </li>
                </ul>
            </div>
            <poker-rounds-list
                v-if="room.mode === Mode.Advanced"
                :is-admin="isAdmin"
                :current-round="room.currentRound"
                :rounds="room.rounds"
                :supported-links="room.externalLinks"
                @add-external-link="addExternalLink"
            />
        </div>

        <p v-if="room.reveal && !isAdmin" class="my-5 text-center text-lg">Waiting for next round...</p>
        <div v-if="isAdmin" class="controls my-5">
            <Button :class="{highlight: !room.reveal && allPlayersEstimated}" :disabled="room.reveal" @click="reveal">
                <Eye class="mr-2" /> Reveal
            </Button>
            <Button @click="showSettings = true">
                <Settings class="mr-2" /> Room Settings
            </Button>
            <Button :class="{highlight: room.reveal}" @click="nextRound">
                <ChevronLast class="mr-2" /> Next Round
            </Button>
        </div>

        <ul v-if="userType === UserType.Player" class="possible-estimates">
            <li v-for="estimate of room.possibleEstimates" :key="estimate">
                <poker-card
                    @click="selectEstimate(estimate)"
                    :value="estimate"
                    size="md"
                    :class="['card', { selected: selectedEstimate === estimate }]"
                    :clickable="true"
                    :state="CardState.Revealed"
                />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.join-room {
    margin-top: 2rem;
}
.room {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-grow: 1;
    max-height: calc(100% - 52px);
}
.game-state {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 60% 40%;
    overflow-y: scroll;

    &.has-observers:not(.mode-simple) {
        grid-template-columns: 10% 50% 40%;
    }
    &.has-observers.mode-simple {
        grid-template-columns: 10% 90%;
    }
    &.mode-simple:not(.has-observers) {
        grid-template-columns: 100%;
    }

    & .user-lists {
        padding-left: 1rem;
        & li {
            font-size: 1.5rem;
        }
        & ul {
            list-style: none;
        }
    }

    & .estimations {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        padding: 0rem 2rem;

        li {
            transition: all 200ms;
            width: 20%;
        }

        & .admin {
            font-size: 5rem;
        }
    }

    & .results {
        display:none;
    }
}
.estimation {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 15%;

    & .name {
        margin-top: 1rem;
        font-size: 1.5rem;
    }
}
.possible-estimates {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2rem;
    padding: 2rem;
    padding-top:3rem;
    background: #e2e2e2;
    list-style: none;
    & li {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 1250px) {
        grid-template-columns: repeat(6, 1fr);
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }

    & .card {
        transition: margin-top 200ms;

        &.selected {
            margin-top: -3rem;
        }
    }
}

.observer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 5rem;

    .highlight {
        animation: highlight ease-in-out 1s infinite alternate;
    }
}

@keyframes highlight {
  from {transform: scale(1);}
  to {transform: scale(1.1);}
}
</style>