import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
  const signature = req.headers.get('dyte-signature');
  const body = await req.text();

  // try {
  //   const dytePublicKey = await fetch("https://api.dyte.io/.well-known/webhooks.json")
  //     .then((res) => res.json())
  //     .then((data) => data.signing_keys[0].public_key);
  //   if (signature) {
  //     verify('RSA-SHA256', Buffer.from(body), dytePublicKey, Buffer.from(signature, 'base64'));
  //   } else {
  //     throw new Error('Signature is missing');
  //   }
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.error();
  // }

    try {
      const dytePublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqw8f8Gu20kj0k85HuM89\nYH6E8rbQhZKgR2GRZt8PUlFowD5XYPQV8jaz3BHNJqzkkrLHaQM6snEEggtcoDH8\nnzw7IIwW4MxDuxGXPG3v83301k4xkiZkH2F6moKr4LptTcPDJYTzKCuzCsihMel9\nrWVkk7Po3oGW+f3UQ72alNkyxr2ZsVmC63Csg/b4N9N771cm8JrVReCTCe46g1ce\nYT+0+ef8j0TNNzg7XdD0U1oxgM9W0Z6ckCRi76XDjWABnWM0GijsJrDQ1SzTiu1u\nL30rSQz/w6E6HZeo5BX84w0JIb50qdCKt8zAyUFZyBv7WnxyiwyXuYcPvD/OdEwv\nfQIDAQAB\n-----END PUBLIC KEY-----"
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

  const body_json = JSON.parse(body)

  const event = body_json.event;
  
  switch (event) {
    // case 'meeting.started': {

    // }
    // case 'meeting.ended': {

    // }
    case 'meeting.transcript': {
      console.log(event.transcriptDownloadUrl)
    }
  }
  
  return NextResponse.json({ message: 'Success' });

}