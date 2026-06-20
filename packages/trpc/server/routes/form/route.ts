import { authenticatedProcedure, router, publicProcedure } from "../../trpc";
import { formService,formFieldService } from "../../services";
import { createFieldInputModel, createFieldOutputModel, createFormInputModel, createFormOutputModel, deleteFieldInputModel, deleteFieldOutputModel, getFieldsInputModel, getFieldsOutputModel, getFormInputModel, getFormOutputModel, listFormsOutputModel, updateFieldInputModel, updateFieldOutputModel } from "./model";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";



const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
	createForm: authenticatedProcedure.meta({ openapi: {
		method: 'POST',
		path: getPath('/create'),
		tags: TAGS,
        protect:true
	} })
		.input(createFormInputModel)
		.output(createFormOutputModel)
		.mutation(async ({ input, ctx }) => {
			const createdBy = ctx.user.id

			const { id } = await formService.createForm({
				title: input.title,
				description: input.description,
				createdBy,
			})

			return { id }
		}),
	listForms: authenticatedProcedure.meta({ openapi: {
		method: 'POST',
		path: getPath('/list'),
		tags: TAGS,
        protect:true
	} })
		.input(z.void())
		.output(listFormsOutputModel)
		.query(async ({ ctx }) => {
			const forms = await formService.listFormsByUserId({ id: ctx.user.id })

			return forms
		}),
		getFields: authenticatedProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/getFields'),
            tags: TAGS,
            protect: true,
        }
    })
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input }) => {
            return formFieldService.getFields({ formId: input.formId })
        }),

    createField: authenticatedProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/createField'),
            tags: TAGS,
            protect: true,
        }
    })
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
            return formFieldService.createField(input)
        }),

    updateField: authenticatedProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/updateField'),
            tags: TAGS,
            protect: true,
        }
    })
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
            return formFieldService.updateField(input)
        }),

    deleteField: authenticatedProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/deleteField'),
            tags: TAGS,
            protect: true,
        }
    })
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
            return formFieldService.deleteField(input)
        }),

    getForm: publicProcedure.meta({
        openapi: {
            method: 'GET',
            path: getPath('/getForm'),
            tags: TAGS,
        }
    })
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
            return formService.getFormById({ formId: input.formId })
        }),
})