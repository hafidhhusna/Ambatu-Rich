export async function fetchInternalAPI(path : string, cookie : string){
    const baseUrl = process.env.NEXTAUTH_URL;
    const res = await fetch(`${baseUrl}${path}`, {
        headers : {
            Cookie : cookie,
        },
        cache : "no-store",
    });

    if(!res.ok){
        throw new Error(`Failed to fetch ${path} : ${res.statusText}`);
    }

    return res.json();
}