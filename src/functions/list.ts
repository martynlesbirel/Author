import { app, HttpRequest, HttpResponseInit, input, output, InvocationContext } from "@azure/functions";

function postProcessing(request: HttpRequest) {
}

/* Author SQL statements*/
const sqlInputAuthorList = input.sql({
    commandText: 'select AuthorID, FirstName, MiddleName, LastName, C.Value	from Author A LEFT JOIN Configuration C ON A.NationaliltyID = C.ConfigurationID',
    commandType: 'Text',
    connectionStringSetting: 'SQLConnectionString',
});

export async function bookCatalogueAuthor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let response: string = `nothing`;

    context.log('HTTP GET trigger and SQL input binding function processed an author request.');

    context.log(`Author list: ${JSON.stringify(sqlInputAuthorList)}`);
    response = context.extraInputs.get(sqlInputAuthorList) as string ?? `{"error": "Failed to fetch author list"}`;
    context.log(`Current response: ${response}`);

    return {
        jsonBody: response,
    };
}

app.http('Author', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'author',
    extraInputs: [sqlInputAuthorList],
    handler: bookCatalogueAuthor
});
