import { z } from 'zod'

export const createFormInputModel = z.object({
    title: z.string().max(55).describe('Title of the form'),
    description: z.string().max(300).optional().describe('Description of the form')
})



export const createFormOutputModel = z.object({
	id: z.string().describe('ID of the created form'),
})

export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe('ID of the form'),
        title: z.string().describe('Title of the form'),
        description: z.string().nullable().describe('Description of the form'),
        createdBy: z.string().uuid().nullable().describe('ID of the Created By the user'),
        createdAt: z.string().nullable().describe('creation timestamp'),
        updatedAt: z.string().nullable().describe('Last update timestamp'),
    })
)

export type CreateFormInputModel = z.infer<typeof createFormInputModel>
export type CreateFormOutputModel = z.infer<typeof createFormOutputModel>
export type ListFormsOutputModel = z.infer<typeof listFormsOutputModel>
