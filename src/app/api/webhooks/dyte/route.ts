import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
  const signature = req.headers.get('dyte-signature');
  const body = await req.text();

  try {
    const dytePublicKey = await fetch("https://api.dyte.io/.well-known/webhooks.json")
      .then((res) => res.json())
      .then((data) => data.signing_keys[0].public_key);
    if (signature) {
      verify('RSA-SHA256', Buffer.from(body), dytePublicKey, Buffer.from(signature, 'base64'));
    } else {
      throw new Error('Signature is missing');
    }
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  console.log('✅ Success:', body);
  

}