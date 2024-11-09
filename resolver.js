import { getJobs, getJob, getJobsByCompany, createJob } from "./db/jobs.js";
import { getCompany } from './db/companies.js';
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        greeting: () => 'Hello World',
        jobs: async () => {
            return await getJobs();
        },
        job: async (_root, args) => {
            return await getJob(args?.id);
        },
        company: async (_root, args) => {
            const company = await getCompany(args?.id);

            if (!company) {
                throw notFoundError('No Company found with id : ' +  args.id);
            }

            return company;
        }
    },

    Mutation: {
        createJob: async (_root, { input: { title, description, companyId } }) => {
            return createJob({companyId, title, description});
        },
    },

    Company: {
        jobs: async (company) => await getJobsByCompany(company.id)
    },

    Job: {
        company: (job) => getCompany(job.companyId),
        date: (job) => toISOString(job.createdAt)
    }
    
};

const notFoundError = (message) => {
    return new GraphQLError(message, {
        extensions: {
            code: 'NOT_FOUND'
        }
    })
}
const toISOString = (date) => date.slice(0, 'yyyy-mm-dd'.length);