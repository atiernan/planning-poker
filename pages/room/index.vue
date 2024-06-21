<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

async function createRoom() {
    const roomId = uuidv4();
    await navigateTo(`/room/${roomId}`);
}
</script>

<template>
    <div class="flex justify-center mt-10">
        <Card class="m-10 w-1/2">
            <CardHeader>
                <CardTitle>Create a Room</CardTitle>
            </CardHeader>
            <CardContent>
                Start a new session for your team effortlessly. Invite your members and begin estimating in seconds! Simplify your planning process with a dedicated room for each project.
            </CardContent>
            <CardFooter class="flex justify-between">
                <Button @click="createRoom">Create</Button>
            </CardFooter>
        </Card>
    </div>
</template>