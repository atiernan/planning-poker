<script setup lang="ts">
import { UserType } from '~/server/Poker/UserType';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const emit = defineEmits(['join']);
const formSchema = toTypedSchema(z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Please enter a name' }),
    isObserver: z.boolean(),
}))

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    isObserver: false,
  },
});

const onSubmit = handleSubmit((values) => {
    emit('join', values.name, values.isObserver ? UserType.Observer : UserType.Player);
});

</script>

<template>
    <Dialog>
        <DialogContent>
            <form class="space-y-3" @submit="onSubmit">
                <DialogHeader>
                    <DialogTitle>Join Room</DialogTitle>
                </DialogHeader>
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <Input type="text" v-bind="componentField"/>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ value, handleChange }" name="isObserver">
                    <FormItem class="flex flex-row items-center justify-between py-2">
                        <FormLabel>Observing</FormLabel>
                        <FormControl>
                            <Switch
                                :checked="value"
                                @update:checked="handleChange"
                            />
                        </FormControl>
                    </FormItem>
                </FormField>
                <DialogFooter>
                    <Button :disabled="!meta.valid" type="submit">
                        Join Room
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>