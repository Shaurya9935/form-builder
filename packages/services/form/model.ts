import { z } from 'zod'

export const createFormInput = z.object({
	title: z.string().min(1).max(55).describe('Title of the form'),
	description: z.string().max(300).optional().describe('Description of the form'),
	createdBy: z.uuid().describe('UUID of the user creating the form'),
})

export const listFormsByUserIdInput = z.object({
	id: z.uuid().describe('UUID of the user creating the forms list'),
})

export type CreateFormInput = z.infer<typeof createFormInput>
export type ListFormsByUserIdInput = z.infer<typeof listFormsByUserIdInput>
