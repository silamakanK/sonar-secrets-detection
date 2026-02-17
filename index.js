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
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKyvflSjAgEABoIBAQDSuHqX+0BhBGS/\n/DR9z7qW6854r/5xSZ4l3w6wqJFPN/g6sVfS890mtYnL9yC+06G3uORcz5A64gno\nN3TI2YzAHj5ywsUr23XDZShaOtNRO96QqkFK7Y/tOqM6/J7YppWPmn+LzxMVr3Kj\nuLZMpnkC/6BbAqsgFdm75UOtPJSTAhEtacRsxqQn9qAGWw21PUmtx64HXHmbEsh\naM5VHS868CQbLFNuj6Ed3PFYmdpfhOUfDYU9nOdXtrY3IKeTULHkqifTtiWiLjOA\nPZNJLg4EsIYJz07LO49+v/rFSqVvVFwACaabClYakvDu9kMAxMcYvvadCCGaKHnL\nDWhZpLFZAgMBAAECggEAaMqMUOuGixjDv8P1YPDusOqY+AgF0bHiH4RLimfyB3rW\ni92oxsQ2rSrnkZLe6ndVe4fLrSod2GKTubNmdQHXYK1JoaiRQ2u6p0a1qBWMBGBp\nIPlCSjBU/I9z+Z1cI3LIeudC2bTLkWO0d54CrqC1Glwkk04C6wxiwPHVU5CKQ+mB\nH3mDnnieQbHAopgsKxmnUHWczoq8tPhFCxIuZN2mVG/532z1+8uUGmoVCaDVpRD1\nyFPm6I9u3Fq1lxgeBsUX5Smox3E3Y2g7//o5ezhp894sussg8wGszLMFWcQahT8s\n3Koij5IdmW5HyZW4VNGv1QxkMw9OWhWJ+NS1wqn/zwKBgQD0J7oPM9lhTtfnr4Bz\nx/fhRdzrtLAQR0Ox+NDojfUMskONVNbAQygrdHT+iV/t0SnjYJ5gBFkCWTvPzfkd\niBtZobO/pM9EVcPswiPBNC8R6OnVJq+GhpTxg5UkwKsWfPBRdImhmegjCfSGYR6v\nYtMTrMipiwBfim0shsXr8ZI+0wKBgQDc8YNg6hsmBB/pcv1HOPYbkDkqbkijdYc9\norXWIXyanhWK2H9wdVA3vkpgIItPO562Z/mOm6fiBtBANloagKkPfhva7+8P63RU\nyw06zYGd5EvvrO0G9EOFuflMqWAur/ULRdLy91Pdpb5JD8nwnxxF0lsdXGX+TgVp\nWEGrM9nrowKBgG4OslpD/wtUJRL1E6drSemsOmetrWfJGATTqigKRZoRiUjlUXbd\nTvA3sL1EY4+qJ32tgfa6Pv1GCCYmLNNZFSsULxiGTD/7gTPqV3+x7D3ghfdlVt4H\nMICl1txDaoXaj+HH7HqCDBgvVqB0iwZ4P7mwvCkkqtUumwPlRLaU0F2tAoGAMdE+\n90Yx8uNxMpkb5MhCLbraOOf+9uRUJyCd8XdBejd00ga4zWlLplFAweX0o1vlEGnn\nSjFsrDkvEZtvu5QRCo47x6Tb+XH0m/3gsMaPmENWn+cU1sGSy/8/5/o01rIUBYOr\n6ds6ParWefDWbqvhmxiwNLGVyb5b2AHvZKPfWhMCgYEA52llcV9VAaEG4TrFLgds\njNPhapIdONZ8IzzupNVmpw2bjuzTYj8Rt9ohBknYtlcHB0HPsN5maDMbMW56grMP\nWOa9S/zgiiqMG5E5A1CT9riX/irD2x8yM0qXdpAGUj9S1RtnJ/RAY6DjTPiyLPcy\n0GAIC6MWvtoW8aITfOSl5sE=\n-----END PRIVATE KEY-----\n",
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
