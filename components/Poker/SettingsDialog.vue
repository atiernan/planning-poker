<script setup lang="ts">
import { Mode } from '~/server/Poker/Mode';
import type { User } from '../../server/Poker/User';
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

interface SettingsDialogProps {
    admin: string;
    users: User[];
    possibleEstimates: string[];
    open: boolean;
    mode: Mode;
}

const emit = defineEmits(['save', 'close']);
const props = defineProps<SettingsDialogProps>();

const formSchema = toTypedSchema(z.object({
    admin: z
        .string({ required_error: 'Please select a user' })
        .min(1),
    advancedRoom: z.boolean(),
    possibleEstimates: z.array(z.string()).min(2)
}))

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    admin: props.admin,
    advancedRoom: props.mode === Mode.Advanced,
    possibleEstimates: props.possibleEstimates,
  },
});

const onSubmit = handleSubmit((values) => {
    emit('save', {
        admin: values.admin,
        possibleEstimates: values.possibleEstimates,
        mode: values.advancedRoom === true ? Mode.Advanced : Mode.Simple,
    });
    emit('close');
});

function onOpenChanged(open: boolean) {
    if (!open) {
        emit('close');
    }
}

watch(() => props.open, () => {
    setValues({
        admin: props.admin,
        advancedRoom: props.mode === Mode.Advanced,
        possibleEstimates: props.possibleEstimates,
    });
});
</script>

<template>
    <Dialog :open="open" @update:open="onOpenChanged">
        <DialogContent>
            <form class="space-y-3" @submit="onSubmit">
                <DialogHeader>
                    <DialogTitle>Room Settings</DialogTitle>
                </DialogHeader>
                <FormField v-slot="{ componentField }" name="admin">
                    <FormItem>
                        <FormLabel>Room Admin</FormLabel>
                        <Select v-bind="componentField" class="grow w-auto">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="user in props.users" :value="user.id">{{ user.name }}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ value, handleChange }" name="advancedRoom">
                    <FormItem class="flex flex-row items-center justify-between py-2">
                        <FormLabel>Show Rounds</FormLabel>
                        <FormControl>
                            <Switch
                                :checked="value"
                                @update:checked="handleChange"
                            />
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ handleChange, value }" name="possibleEstimates">
                    <FormItem>
                        <Label>Possible Estimates</Label>
                        <TagsInput :model-value="value" @update:model-value="handleChange">
                            <TagsInputItem v-for="item in value" :key="item" :value="item">
                                <TagsInputItemText />
                                <TagsInputItemDelete />
                            </TagsInputItem>

                            <TagsInputInput placeholder="New Estimate..." />
                        </TagsInput>
                    </FormItem>
                </FormField>
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<style lang="scss" scoped>
.estimates {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    & * {
        font-size: 1rem;
    }
}

.new-estimate {
    display: flex;
    gap: 1rem;
    
}
</style>