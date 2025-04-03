import { app, HttpRequest, HttpResponseInit, output, InvocationContext } from "@azure/functions";

function postProcessing(request: HttpRequest) {

}

/* Author SQL statements*/
// @ts-ignore
const sqlInsertAuthorDetails = output.sql({
    commandText: 'insert into Author',
    connectionStringSetting: 'SQLConnectionString',
});

export async function bookCatalogueAuthor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let response: string = `nothing`;

    context.log('HTTP GET trigger and SQL input binding function processed an author insert request.');

    context.log(`Details for specific author: ${request.params.id}`);
    response = context.extraInputs.get(sqlInsertAuthorDetails) as string ?? `{"error": "Failed to insert author"}`;
    context.log(`Current response: ${response}`);
    return {
        jsonBody: response,
    };
}

app.http('AuthorAdd', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'author',
    extraOutputs: [sqlInsertAuthorDetails],
    handler: bookCatalogueAuthor
});
