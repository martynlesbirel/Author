import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

function postProcessing(request: HttpRequest) {

}

/* Author SQL statements*/
const sqlInputAuthorDetails = input.sql({
    commandText: 'select AuthorID, FirstName, MiddleName, LastName, C.Value	from Author A LEFT JOIN Configuration C ON A.NationaliltyID = C.ConfigurationID where A.AuthorID = @Id',
    commandType: 'Text',
    parameters: '@Id={id}',
    connectionStringSetting: 'SQLConnectionString',
});

export async function bookCatalogueAuthor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let response: string = `nothing`;

    context.log('HTTP GET trigger and SQL input binding function processed an author request.');

    context.log(`Details for specific author: ${request.params.id}`);
    response = context.extraInputs.get(sqlInputAuthorDetails) as string ?? `{"error": "Failed to fetch details"}`;
    context.log(`Current response: ${JSON.stringify(response)}`);
    return {
        jsonBody: response,
    };
}

app.http('AuthorDetail', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'author/{id:int}',
    extraInputs: [sqlInputAuthorDetails],
    handler: bookCatalogueAuthor
});
