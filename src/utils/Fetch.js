export default function FetchFunc(url,postdata) {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(postdata)

        })
}