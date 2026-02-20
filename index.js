import {google} from "googleapis";
import {Octokit} from "@octokit/core";

export const getGitHubData = async () => {

    const octokit = new Octokit({auth: process.env.SONAR_TOKEN});

    const topicSearchResults = await octokit.request('GET /search/topics', {
        q: "is:curated created:>2022-01-01",
        per_page: 20
    })

    console.log(topicSearchResults.url)
    console.log(topicSearchResults.data)
    console.log(`Total topics found: ${topicSearchResults.data.length}`)

    return topicSearchResults.data.items;
}

export const exportToGoogleSheets = async data => {

    const googleAuth = {
        "type": "service_account",
        "project_id": "myprojectid",
        "private_key_id": "7bf129dbfa7f09a4068911faca0d9ec597fd8015",
        "private_key": process.env.GCP_PRIVATE_KEY,
        "client_email": "gdrive-api-access@myproject.iam.gserviceaccount.com",
        "client_id": "5555555555555555555",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gdrive-api-access%40myproject.iam.gserviceaccount.com"
    };

    const sheets = google.sheets({
        version: 'v4',
        auth: new google.auth.GoogleAuth({
            credentials: googleAuth,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
    });

    const spreadsheetInfo = {
        connection: sheets,
        spreadsheetId: "143fwGCnMlpxQZ0UoZ6t0rUCoBBDA8CHpl0Vw0P2Af6k",
        sheet: "Sheet2",
        sheetId: 1065604454,
    }

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: spreadsheetInfo.spreadsheetId,
        resource: {
            valueInputOption: 'USER_ENTERED',
            data: data.map(item => {
                const itemRowIndex = data.indexOf(item) + 2;
                const itemRange = `A${itemRowIndex}:F${itemRowIndex}`;
                return {
                    "range": itemRange,
                    "values": [Object.values(item)]
                }
            })
        }
    });
}

const githubData = await getGitHubData()
await exportToGoogleSheets(githubData)
