<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const emit = defineEmits(['submit']);

const formSchema = toTypedSchema(z.object({
    ticket: z
        .string()
        .trim()
        .min(1, { message: 'Please enter a ticket ID' }),
}))

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ticket: '',
  },
});

const onSubmit = handleSubmit((values) => {
    emit('submit', values.ticket);
    return false;
});

</script>

<template>
    <Dialog>
        <DialogContent>
            <form class="space-y-3" @submit="onSubmit">
                <DialogHeader>
                    <DialogTitle>Add Jira Ticket</DialogTitle>
                </DialogHeader>
                <FormField v-slot="{ componentField }" name="ticket">
                    <FormItem>
                        <Input type="text" placeholder="Jira Ticket ID" v-bind="componentField"/>
                    </FormItem>
                </FormField>
                <DialogFooter>
                    <Button :disabled="!meta.valid" type="submit">
                        Save
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>