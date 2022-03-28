import { jws } from 'jsrsasign';

export async function verify(userToken: string, aud: string) {
    let jwt: IJWT = decodeJWT(userToken)
    var jwKey = await fetchPublicKey(jwt.header.kid);
    const isValid = jws.JWS.verifyJWT(userToken, jwKey, {
        alg: ['RS256'], iss: `https://securetoken.google.com/${aud}`, aud
    });
    return { isValid, decoded: jwt };
}

function decodeJWT(jwtString: string): IJWT {
    // @ts-ignore
    const jwt: IJWT = jwtString.match(
        /(?<header>[^.]+)\.(?<payload>[^.]+)\.(?<signature>[^.]+)/
    ).groups;

    // @ts-ignore
    jwt.header = JSON.parse(atob(jwt.header));
    // @ts-ignore
    jwt.payload = JSON.parse(atob(jwt.payload));

    return jwt;
}

async function fetchPublicKey(kid: string): Promise<any> {
    var key: any = await (await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')).json();

    key = key[kid];
    return key;
}

interface IJWT {
    header: IJWT_Header,
    payload: IJWT_Payload
    signature: string;
}

interface IJWT_Header {
    alg: string;
    kid: string;
    typ: string;
}

interface IJWT_Payload {
    name: string;
    giftcard: boolean;
    timecard: boolean;
    role: string;
    setup: true;
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
    firebase: {
        indentities: [object];
        sign_in_provider: 'password';
        tenant: string;
    }
}