<script setup lang="ts">
interface MenuProps {
    target: HTMLElement | null;
    show: boolean;
}

interface Position {
    left: number;
    top: number;
}

const props = defineProps<MenuProps>();
const position = ref<Position | null>(null);
const container = ref<HTMLElement>();

watch(() => props.show, (newShow) => {
    if (!newShow) {
        position.value = null;
        return;
    }
    nextTick(() => {
        const pos = props.target?.getBoundingClientRect();
        const containerPos = container.value?.getBoundingClientRect();
        if (pos && containerPos) {
            position.value = {
                left: (pos.x + pos.width) - containerPos.width,
                top: pos.y + pos.height,
            };
        }
    });
});

function positionToString() {
    if (position.value === null) {
        return '';
    }

    return `left: ${position.value.left}px;top: ${position.value.top}px;`;
}

</script>

<template>
    <div v-show="props.show" ref="container" class="menu" :style="positionToString()">
        <slot />
    </div>
</template>

<style lang="scss">
.menu {
    position: absolute;
    background: white;
    border-radius: 5px;
    padding: 0.1rem;
    z-index: 99999;
}
</style>