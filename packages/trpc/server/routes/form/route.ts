import { authenticatedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { createFormInputModel, createFormOutputModel } from "./model";
import { generatePath } from "../../utils/path-generator";

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
})